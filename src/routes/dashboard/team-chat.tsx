import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Search,
  X,
  Loader2,
  AlertCircle,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Film,
  Download,
  Maximize2,
  Users,
  Shield,
  Activity,
  Check,
  CheckCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOperatorsFn } from "@/lib/dashboard.functions.server";
import {
  getCurrentOperatorFn,
  getTeamChatMessagesFn,
  sendTeamChatMessageFn,
  markTeamChatReadFn,
} from "@/lib/chat.functions.server";
import { generateCloudinarySignatureFn } from "@/lib/dashboard.functions.server";

export const Route = createFileRoute("/dashboard/team-chat")({
  component: TeamChatPage,
});

const RELAY_URL = import.meta.env.VITE_RELAY_URL ?? "http://localhost:3001";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  username: string;
  unreadCount?: number;
}

interface TeamMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  fileUrl: string;
  fileType: string;
  fileName: string;
  createdAt: string;
  readAt: string | null;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

function msgTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function TeamChatPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // Auth & Identity State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  // Active chat state
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const partnerIdRef = useRef<string | null>(null);
  useEffect(() => {
    partnerIdRef.current = activePartnerId;
  }, [activePartnerId]);

  const [activePartner, setActivePartner] = useState<TeamMember | null>(null);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // UI status
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  // File Upload State
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox preview for images
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  const membersRef = useRef<TeamMember[]>([]);
  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  // ── Retrieve active operator identity & operators ──────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const init = async () => {
      setMembersLoading(true);
      setMembersError(null);
      try {
        const token = localStorage.getItem("stellr_admin_token") || "";
        const me = await (getCurrentOperatorFn as any)({ data: { token } });
        if (!me) {
          setMembersError("Failed to authenticate session. Please log in again.");
          return;
        }
        setCurrentUser(me);

        const ops = await getOperatorsFn();
        // Exclude the current operator from chat choices
        const filteredOps = ops
          .filter((op: any) => op.id !== me.id && op.status === "Active")
          .map((op: any) => ({
            id: op.id,
            name: op.name,
            email: op.email,
            role: op.role,
            status: op.status,
            username: op.username,
            unreadCount: 0,
          }));
        setMembers(filteredOps);
      } catch (err) {
        setMembersError(err instanceof Error ? err.message : "Failed to load team members");
      } finally {
        setMembersLoading(false);
      }
    };
    init();
  }, []);

  // ── Join conversation / room identifier helper ──────────────────────────────
  const getRoomId = (user1: string, user2: string) => {
    const sorted = [user1, user2].sort();
    return `team-chat:${sorted[0]}-${sorted[1]}`;
  };

  // ── Fetch messages for selected member ──────────────────────────────────────
  const loadConversation = async (partner: TeamMember) => {
    if (!currentUser) return;
    setActivePartnerId(partner.id);
    setActivePartner(partner);
    setMessagesLoading(true);

    try {
      // Clear local unread counts in state
      setMembers((prev) =>
        prev.map((m) => (m.id === partner.id ? { ...m, unreadCount: 0 } : m))
      );

      // Load history
      const history = await (getTeamChatMessagesFn as any)({
        data: { senderId: currentUser.id, recipientId: partner.id },
      });
      setMessages(history);

      // Mark read
      await (markTeamChatReadFn as any)({
        data: { senderId: currentUser.id, recipientId: partner.id },
      });
    } catch (err) {
      console.error("Failed to load conversation:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  // ── Establish Real-Time Socket Connection ────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    import("socket.io-client").then(({ io }) => {
      const socket = io(RELAY_URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        // Announce presence
        socket.emit("user-online", currentUser.id);
        // Join personal user room using the join-user event
        socket.emit("join-user", currentUser.id);
      });

      // Listen for presence updates
      socket.on("presence-update", (userIds: string[]) => {
        setOnlineUserIds(userIds);
      });

      // Listen for incoming messages using the receive-team-message event
      socket.on("receive-team-message", (msg: TeamMessage) => {
        // Verify it is a team chat message (not visitor message)
        if (msg && msg.senderId && msg.recipientId) {
          const activeId = partnerIdRef.current;
          const isMe = msg.senderId === currentUser.id;

          // Show browser notification for inbound messages
          if (!isMe) {
            const isTabHidden = document.visibilityState === "hidden";
            const isDifferentPartner = msg.senderId !== activeId;
            if (isTabHidden || isDifferentPartner) {
              if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                const senderMember = membersRef.current.find((m) => m.id === msg.senderId);
                const senderName = senderMember ? senderMember.name : "Team Member";
                try {
                  new Notification(`New message from ${senderName}`, {
                    body: msg.text || "Shared a file in team chat",
                    icon: "/favicon.ico",
                  });
                } catch (err) {
                  console.error("Error displaying background notification:", err);
                }
              }
            }
          }

          // If this message belongs to the active conversation
          if (
            (msg.senderId === currentUser.id && msg.recipientId === activeId) ||
            (msg.senderId === activeId && msg.recipientId === currentUser.id)
          ) {
            setMessages((prev) => {
              // Avoid duplicate messages if already present
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
            // Auto mark as read
            (markTeamChatReadFn as any)({
              data: { senderId: currentUser.id, recipientId: activeId! },
            });
          } else {
            // Increment unread count for background member (only if sender is not me)
            if (!isMe) {
              setMembers((prev) =>
                prev.map((m) =>
                  m.id === msg.senderId ? { ...m, unreadCount: (m.unreadCount || 0) + 1 } : m
                )
              );
            }
          }
        }
      });

      return () => {
        socket.disconnect();
      };
    });
  }, [currentUser]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ── Send text messages ───────────────────────────────────────────────────────
  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !activePartnerId || sending) return;

    const textContent = input.trim();
    setInput("");
    setSending(true);

    try {
      const savedMsg = await (sendTeamChatMessageFn as any)({
        data: {
          senderId: currentUser.id,
          recipientId: activePartnerId,
          text: textContent,
        },
      });

      setMessages((prev) => [...prev, savedMsg]);

      // Emit over socket using send-team-message
      socketRef.current?.emit("send-team-message", {
        senderId: currentUser.id,
        recipientId: activePartnerId,
        message: savedMsg,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  // ── File upload handler ──────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser || !activePartnerId || uploadingFile) return;

    setUploadingFile(true);
    setUploadProgress(0);
    setUploadError(null);

    const mime = file.type || "";
    let detectedType: "image" | "video" | "document" = "document";
    if (mime.startsWith("image/")) detectedType = "image";
    else if (mime.startsWith("video/")) detectedType = "video";

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const sigData = await (generateCloudinarySignatureFn as any)({ data: { timestamp } });

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              
              // Register in DB
              const savedMsg = await (sendTeamChatMessageFn as any)({
                data: {
                  senderId: currentUser.id,
                  recipientId: activePartnerId,
                  text: "",
                  fileUrl: result.secure_url,
                  fileType: detectedType,
                  fileName: file.name,
                },
              });

              setMessages((prev) => [...prev, savedMsg]);

              // Emit over socket using send-team-message
              socketRef.current?.emit("send-team-message", {
                senderId: currentUser.id,
                recipientId: activePartnerId,
                message: savedMsg,
              });

              resolve();
            } catch (err) {
              reject(new Error("Failed to register asset details."));
            }
          } else {
            reject(new Error(`Cloudinary upload error: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during file upload."));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", sigData.apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", sigData.signature);
        formData.append("folder", sigData.folder);
        xhr.send(formData);
      });

    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file to Cloudinary.");
    } finally {
      setUploadingFile(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // ── Filters & Search ────────────────────────────────────────────────────────
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Supervisor":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Manager":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  // Render visual element based on file type
  const renderFileContent = (msg: TeamMessage) => {
    if (!msg.fileUrl) return null;

    if (msg.fileType === "image") {
      return (
        <div className="relative group rounded-xl overflow-hidden mt-1 cursor-pointer max-w-[260px] border border-white/10 shadow-md">
          <img
            src={msg.fileUrl}
            alt={msg.fileName || "Shared image"}
            className="w-full h-auto object-cover max-h-[180px] hover:scale-105 transition duration-300"
            onClick={() => setLightboxUrl(msg.fileUrl)}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition gap-2">
            <button
              onClick={() => setLightboxUrl(msg.fileUrl)}
              className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/35"
              title="Expand image"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <a
              href={msg.fileUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/35"
              title="Download image"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      );
    }

    if (msg.fileType === "video") {
      return (
        <div className="rounded-xl overflow-hidden mt-1 max-w-[300px] border border-white/10 shadow-md">
          <video
            src={msg.fileUrl}
            controls
            preload="metadata"
            className="w-full max-h-[200px] bg-black"
          />
        </div>
      );
    }

    // Document
    return (
      <div className="flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-black/25 mt-1.5 max-w-[280px]">
        <div className="h-9 w-9 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-white/95 truncate">
            {msg.fileName || "Shared Document"}
          </span>
          <span className="block text-[9px] text-white/35 font-mono">Document</span>
        </div>
        <a
          href={msg.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white shrink-0"
          title="Download file"
        >
          <Download className="h-4.5 w-4.5" />
        </a>
      </div>
    );
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold tracking-tight">Team Chat</h1>
        <p className={`mt-1 text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
          Secure real-time communication portal for StellR IT operators.
        </p>
      </div>

      {/* Main panel layout */}
      <div
        className={`grid grid-cols-1 overflow-hidden rounded-3xl border lg:grid-cols-3 ${
          isDark
            ? "border-white/5 bg-[#12052c]/65 shadow-2xl backdrop-blur-xl"
            : "border-slate-200/60 bg-white shadow-sm"
        }`}
        style={{ height: "calc(100vh - 235px)", minHeight: "450px" }}
      >
        {/* Left Side: Members List */}
        <div
          className={`flex h-full flex-col border-r min-h-0 ${
            isDark ? "border-white/5 bg-[#12052c]/40" : "border-slate-100 bg-slate-50/50"
          }`}
        >
          {/* Search bar */}
          <div className={`p-4 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-white/30" : "text-slate-400"}`} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team members..."
                className={`w-full rounded-xl border py-2 pl-9 pr-4 text-xs transition focus:outline-none ${
                  isDark
                    ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/40"
                    : "border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/40"
                }`}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-white/30 hover:text-white/60" />
                </button>
              )}
            </div>
          </div>

          {/* Members List Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {membersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-[#a855f7]" />
              </div>
            ) : membersError ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center p-4">
                <AlertCircle className="h-6 w-6 text-rose-400" />
                <p className="text-xs text-rose-400 font-medium">{membersError}</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className={`py-12 text-center text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                No active team members found.
              </div>
            ) : (
              filteredMembers.map((m) => {
                const isOnline = onlineUserIds.includes(m.id);
                const isActive = m.id === activePartnerId;
                return (
                  <button
                    key={m.id}
                    onClick={() => loadConversation(m)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left transition duration-300 relative ${
                      isActive
                        ? isDark
                          ? "border-[#a855f7]/25 bg-[#a855f7]/10 text-white"
                          : "border-[#a855f7]/20 bg-[#a855f7]/10 text-[#7c3aed]"
                        : isDark
                        ? "border-transparent hover:bg-white/[0.03] text-white/70"
                        : "border-transparent hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Initials badge + Online/Offline indicator */}
                      <div className="relative shrink-0">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/25 border border-purple-500/20 font-bold text-xs text-white">
                          {initials(m.name)}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 ${
                            isDark ? "border-[#12052c]" : "border-white"
                          } ${
                            isOnline
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                              : "bg-slate-400"
                          }`}
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="block truncate text-xs font-semibold">{m.name}</span>
                          {m.unreadCount && m.unreadCount > 0 ? (
                            <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#ff8a5b] text-[9px] font-bold text-white flex items-center justify-center shadow">
                              {m.unreadCount}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-semibold border ${getRoleColor(m.role)}`}>
                            {m.role}
                          </span>
                          <span className={`text-[9px] ${isDark ? "text-white/30" : "text-slate-400"}`}>
                            @{m.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Box */}
        <div className="flex h-full flex-col lg:col-span-2 min-h-0">
          {!activePartner ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center p-8 bg-[#12052c]/20">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-[#a855f7]/10 to-[#ff8a5b]/10 border border-[#a855f7]/15 flex items-center justify-center text-[#a855f7]/80">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/80">Direct Messaging Workspace</h3>
                <p className={`mt-1 text-xs max-w-xs ${isDark ? "text-white/35" : "text-slate-400"}`}>
                  Choose a team member from the sidebar to establish a secure, private end-to-end chat.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header bar */}
              <div
                className={`flex items-center justify-between border-b px-5 py-4 ${
                  isDark ? "border-white/5 bg-[#12052c]/30" : "border-slate-100 bg-slate-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/25 border border-purple-500/20 font-bold text-xs text-white">
                      {initials(activePartner.name)}
                    </div>
                    <span
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 ${
                        isDark ? "border-[#12052c]" : "border-white"
                      } ${
                        onlineUserIds.includes(activePartner.id)
                          ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                          : "bg-slate-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                      {activePartner.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-1.5 py-0.2 rounded text-[7px] font-semibold border ${getRoleColor(activePartner.role)}`}>
                        {activePartner.role}
                      </span>
                      <span className={`text-[9px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                        {activePartner.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider ${
                      onlineUserIds.includes(activePartner.id)
                        ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                        : "border-slate-500/20 bg-slate-800/20 text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        onlineUserIds.includes(activePartner.id)
                          ? "animate-pulse bg-emerald-400"
                          : "bg-slate-400"
                      }`}
                    />
                    {onlineUserIds.includes(activePartner.id) ? "Active Online" : "Offline"}
                  </div>
                </div>
              </div>

              {/* Messages feed */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-5 min-h-0 bg-[#0d0220]/15">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#a855f7]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className={`flex h-full items-center justify-center text-xs italic ${isDark ? "text-white/20" : "text-slate-350"}`}>
                    Begin conversation with {activePartner.name}. Shared assets are secure.
                  </div>
                ) : (
                  <>
                    {messages.map((m) => {
                      const isMe = m.senderId === currentUser?.id;
                      return (
                        <AnimatePresence key={m.id} mode="popLayout">
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            {!isMe && (
                              <div className="mr-2.5 mt-auto grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-[8px] font-bold text-white border border-white/5">
                                {initials(activePartner.name)}
                              </div>
                            )}
                            <div className={`max-w-[70%] space-y-1 ${isMe ? "text-right" : "text-left"}`}>
                              <div
                                className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                                  isMe
                                    ? "rounded-tr-none bg-gradient-to-br from-[#a855f7] to-[#8b35f2] border-[#a855f7]/10 text-white shadow-lg shadow-purple-500/5"
                                    : isDark
                                    ? "rounded-tl-none bg-white/[0.03] border-white/5 text-white/95"
                                    : "rounded-tl-none bg-slate-100 border-slate-200/50 text-slate-800"
                                }`}
                              >
                                {m.text && <p className="whitespace-pre-wrap select-text">{m.text}</p>}
                                {renderFileContent(m)}
                              </div>
                              <div
                                className={`flex items-center gap-1.5 text-[9px] ${isMe ? "justify-end" : "justify-start"} ${isDark ? "text-white/30" : "text-slate-400"}`}
                              >
                                <span>{msgTime(m.createdAt)}</span>
                                {isMe && (
                                  m.readAt ? (
                                    <CheckCheck className="h-3 w-3 text-indigo-400" />
                                  ) : (
                                    <Check className="h-3 w-3 text-white/30" />
                                  )
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Chat Send bar */}
              <div className={`border-t p-4 relative ${isDark ? "border-white/5 bg-[#12052c]/20" : "border-slate-100 bg-slate-50/40"}`}>
                
                {/* Uploading File Overlay Indicator */}
                {uploadingFile && (
                  <div className="absolute inset-x-0 bottom-full bg-[#12052c]/95 border-t border-white/10 p-3.5 flex items-center justify-between text-xs backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-[#a855f7]" />
                      <span className="font-semibold text-white/80">Uploading asset stream: {uploadProgress}%</span>
                    </div>
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload errors */}
                {uploadError && (
                  <div className="absolute inset-x-0 bottom-full bg-rose-500/10 border-t border-rose-500/25 p-2.5 flex items-center justify-between text-[11px] text-rose-400">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                    <button onClick={() => setUploadError(null)} className="text-white/40 hover:text-white/70">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendText} className="flex items-center gap-3">
                  {/* File Upload Selector Hidden */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Attachment action button */}
                  <button
                    type="button"
                    onClick={triggerFileSelect}
                    disabled={uploadingFile}
                    className={`h-10 w-10 shrink-0 grid place-items-center rounded-xl border transition ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title="Share files (Images, Videos, Documents)"
                  >
                    <Paperclip className="h-4.5 w-4.5" />
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message or share files..."
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white placeholder-white/20 focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/40"
                        : "border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40 focus:ring-1 focus:ring-[#a855f7]/40"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#a855f7] to-[#8b35f2] text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none active:scale-95"
                  >
                    {sending ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Expand Image Lightbox Portal modal */}
      <AnimatePresence>
        {lightboxUrl && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setLightboxUrl(null)}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              src={lightboxUrl}
              alt="Expanded Preview"
              className="max-w-full max-h-[85vh] rounded-xl object-contain border border-white/5 shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
