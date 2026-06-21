import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { toast } from "sonner";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllChatSessionsFn,
  getChatSessionFn,
  sendChatMessageFn,
  markChatReadFn,
  updateChatStatusFn,
  deleteChatSessionFn,
  type ChatSession,
  type ChatMessage,
} from "@/lib/chat.functions.server";

export const Route = createFileRoute("/dashboard/chat")({
  component: ChatPage,
});

// ── Config ────────────────────────────────────────────────────────────────────
const RELAY_URL = import.meta.env.VITE_RELAY_URL ?? "http://localhost:3001";

// ── Helpers ───────────────────────────────────────────────────────────────────
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

type StatusFilter = "all" | "open" | "closed";

// ── Component ─────────────────────────────────────────────────────────────────
function ChatPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // Keep a ref of sessions to avoid stale closures in socket callback
  const sessionsRef = useRef<ChatSession[]>([]);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  // Request browser notification permissions on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Helper to trigger native browser notification
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, options);
      } catch (err) {
        console.error("Error showing browser notification:", err);
      }
    }
  }, []);

  // ── Fetch all sessions ──────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const data = await getAllChatSessionsFn();
      setSessions(data);
    } catch (err) {
      setSessionsError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeSession?.messages]);

  // ── Socket.IO relay — admin listens for new visitor messages ────────────
  useEffect(() => {
    import("socket.io-client").then(({ io }) => {
      const socket = io(RELAY_URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join-admin");
      });

      // New visitor message arrives — refresh the active session + sessions list
      socket.on("visitor-message", ({ sessionId, message }: { sessionId: string; message: ChatMessage }) => {
        // If this session is open, refresh it
        if (sessionId === activeSessionId) {
          getChatSessionFn({ data: { sessionId } }).then((sess) => {
            if (sess) setActiveSession(sess);
          });
        }

        // Notify if it is a new chat visitor or message in a background session
        const currentSessions = sessionsRef.current;
        const existingSession = currentSessions.find((s) => s.id === sessionId);

        if (!existingSession) {
          showNotification("New Chat Visitor", {
            body: message.text || "A new visitor has initiated a live chat.",
            icon: "/favicon.ico",
          });
          fetchSessions();
        } else if (sessionId !== activeSessionId || document.hidden) {
          showNotification(`New message from ${existingSession.visitorName}`, {
            body: message.text,
            icon: "/favicon.ico",
          });
        }

        // Bump the session to top of list with unread badge, or fetch all if it is a new chat
        setSessions((prev) => {
          const exists = prev.some((s) => s.id === sessionId);
          if (!exists) {
            return prev;
          }
          return prev.map((s) =>
            s.id === sessionId
              ? { 
                  ...s, 
                  lastMessage: message.text, 
                  lastMessageTime: message.timestamp, 
                  unread: s.id !== activeSessionId ? true : s.unread 
                }
              : s
          );
        });
      });

      return () => { socket.disconnect(); };
    });
  }, [activeSessionId, fetchSessions, showNotification]);

  // Poll database every 5 seconds to sync new chats automatically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getAllChatSessionsFn();
        setSessions(data);
      } catch { /* non-fatal */ }
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  // ── 3-second polling (same as JRM) ─────────────────────────────────────
  useEffect(() => {
    if (!activeSessionId) return;
    const interval = setInterval(async () => {
      try {
        const refreshed = await getChatSessionFn({ data: { sessionId: activeSessionId } });
        if (refreshed) setActiveSession(refreshed);
      } catch { /* non-fatal */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSessionId]);

  // ── Select session ──────────────────────────────────────────────────────
  const selectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessagesLoading(true);
    try {
      const sess = await getChatSessionFn({ data: { sessionId } });
      if (sess) {
        setActiveSession(sess);
        setSessions((prev) => prev.map((s) => s.id === sessionId ? { ...s, unread: false } : s));
        await markChatReadFn({ data: { sessionId } });
        // Join relay room so socket receives visitor replies
        socketRef.current?.emit("join-room", sessionId);
      }
    } catch { /* ignore */ } finally {
      setMessagesLoading(false);
    }
  };

  // ── Send admin reply ────────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSession || sending) return;

    const text = input.trim();
    setInput("");
    setSending(true);

    // Optimistic message
    const optimistic: ChatMessage = {
      id: `opt-${Date.now()}`,
      sender: "admin",
      text,
      timestamp: new Date().toISOString(),
    };
    setActiveSession((prev) =>
      prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev
    );

    try {
      const updated = await sendChatMessageFn({
        data: { sessionId: activeSession.id, sender: "admin", text },
      });
      if (updated) {
        setActiveSession(updated);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id ? { ...s, lastMessage: text, lastMessageTime: new Date().toISOString() } : s
          )
        );
        // Emit via Socket.IO so visitor sees reply instantly
        const lastMsg = updated.messages[updated.messages.length - 1];
        if (socketRef.current && lastMsg) {
          socketRef.current.emit("new-message", {
            sessionId: activeSession.id,
            message: { ...lastMsg, sessionId: activeSession.id },
          });
        }
      }
    } catch {
      // Remove optimistic on failure
      setActiveSession((prev) =>
        prev ? { ...prev, messages: prev.messages.filter((m) => m.id !== optimistic.id) } : prev
      );
    } finally {
      setSending(false);
    }
  };

  // ── Close session ───────────────────────────────────────────────────────
  const closeSession = async () => {
    if (!activeSession) return;
    try {
      const updated = await updateChatStatusFn({ data: { sessionId: activeSession.id, status: "closed" } });
      if (updated) {
        setActiveSession(updated);
        setSessions((prev) => prev.map((s) => s.id === activeSession.id ? { ...s, status: "closed" } : s));
      }
    } catch { /* ignore */ }
  };

  // ── Delete session ──────────────────────────────────────────────────────
  const handleDeleteSession = (sessionId: string) => {
    setDeleteConfirmId(sessionId);
  };

  const confirmDeleteSession = async () => {
    if (!deleteConfirmId) return;
    const sessionId = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      await deleteChatSessionFn({ data: { sessionId } });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setActiveSession(null);
      }
      toast.success("Conversation deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete conversation");
    }
  };

  // ── Filtered sessions ───────────────────────────────────────────────────
  const filtered = sessions.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.visitorName.toLowerCase().includes(q) ||
        s.visitorContact.toLowerCase().includes(q) ||
        s.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalUnread = sessions.filter((s) => s.unread).length;
  const messages = activeSession?.messages ?? [];

  // ── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Live Chat</h1>
          <p className={`mt-1 text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Monitor visitor inquiries and respond in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {totalUnread > 0 && (
            <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow">
              {totalUnread} unread
            </span>
          )}
          <button
            onClick={fetchSessions}
            className={`rounded-lg border p-2 transition ${
              isDark
                ? "border-white/10 bg-white/5 text-white/60 hover:text-white"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
            title="Refresh sessions"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div
        className={`grid grid-cols-1 overflow-hidden rounded-2xl border lg:grid-cols-3 ${
          isDark
            ? "border-white/5 bg-[#12052c]/65 shadow-2xl"
            : "border-slate-200/60 bg-white shadow-sm"
        }`}
        style={{ height: "calc(100vh - 275px)", minHeight: "400px" }}
      >
        {/* ── Left: Sessions list ─────────────────────────────────────── */}
        <div
          className={`h-full flex-col border-r min-h-0 ${
            activeSessionId ? "hidden lg:flex" : "flex"
          } ${
            isDark ? "border-white/5 bg-[#12052c]/40" : "border-slate-100 bg-slate-50/50"
          }`}
        >
          {/* Search + filter */}
          <div className={`space-y-2 border-b p-3 ${isDark ? "border-white/5" : "border-slate-100"}`}>
            <div className="relative">
              <Search className={`absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${isDark ? "text-white/30" : "text-slate-400"}`} />
              <input
                id="chat-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className={`w-full rounded-lg border py-1.5 pl-8 pr-3 text-xs transition focus:outline-none ${
                  isDark
                    ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#a855f7]/40"
                    : "border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40"
                }`}
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="h-3 w-3 text-white/40" />
                </button>
              )}
            </div>

            <div className={`flex rounded-lg p-0.5 text-[10px] font-semibold uppercase tracking-wider ${isDark ? "bg-white/5" : "bg-slate-100"}`}>
              {(["open", "closed", "all"] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`flex-1 rounded-md py-1 transition ${
                    statusFilter === f
                      ? isDark ? "bg-[#a855f7]/20 text-[#c084fc]" : "bg-white text-[#a855f7] shadow"
                      : isDark ? "text-white/40 hover:text-white/70" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-[#a855f7]" />
              </div>
            ) : sessionsError ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-xs text-red-400">{sessionsError}</p>
                <button onClick={fetchSessions} className="text-xs text-[#a855f7] underline">Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className={`py-10 text-center text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {search ? "No conversations match your search." : statusFilter === "open" ? "No open chats yet. Chats started on the homepage will appear here." : "No conversations yet."}
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  id={`chat-session-${s.id}`}
                  onClick={() => selectSession(s.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition group ${
                    s.id === activeSessionId
                      ? isDark
                        ? "border-[#a855f7]/20 bg-[#a855f7]/10 text-white"
                        : "border-[#a855f7]/20 bg-[#a855f7]/10 text-[#7c3aed]"
                      : isDark
                      ? "border-transparent hover:bg-white/[0.02] text-white/70"
                      : "border-transparent hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-bold text-xs text-white shadow ${
                        s.status === "closed" ? "bg-slate-500" : "bg-gradient-to-br from-indigo-500 to-purple-600"
                      }`}
                    >
                      {initials(s.visitorName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="block truncate text-xs font-semibold">{s.visitorName}</span>
                        <span className={`shrink-0 text-[9px] ${isDark ? "text-white/35" : "text-slate-400"}`}>
                          {relativeTime(s.lastMessageTime)}
                        </span>
                      </div>
                      <p className={`truncate text-[10px] leading-snug ${isDark ? "text-white/40" : "text-slate-500"}`}>
                        {s.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {s.unread && (
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                      )}
                      {s.status === "closed" && (
                        <span className={`text-[8px] uppercase tracking-wider ${isDark ? "text-white/20" : "text-slate-300"}`}>
                          closed
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(s.id);
                        }}
                        title="Delete conversation"
                        className={`opacity-0 group-hover:opacity-100 transition p-0.5 rounded hover:bg-red-500/10 hover:text-red-400 ${
                          isDark ? "text-white/30" : "text-slate-400"
                        }`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right: Conversation area ──────────────────────────────── */}
        <div className={`h-full flex-col lg:col-span-2 min-h-0 ${
          activeSessionId ? "flex" : "hidden lg:flex"
        }`}>
          {!activeSession ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <MessageSquare className={`h-10 w-10 ${isDark ? "text-white/15" : "text-slate-200"}`} />
              <p className={`text-sm ${isDark ? "text-white/30" : "text-slate-400"}`}>
                Select a conversation to view messages
              </p>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div
                className={`flex items-center justify-between border-b px-5 py-3.5 ${
                  isDark ? "border-white/5 bg-[#12052c]/30" : "border-slate-100 bg-slate-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveSessionId(null)}
                    className={`lg:hidden h-8 w-8 flex items-center justify-center rounded-lg border transition ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white/70 hover:text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
                    }`}
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white ${
                      activeSession.status === "closed"
                        ? "bg-slate-500"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    }`}
                  >
                    {initials(activeSession.visitorName)}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-800"}`}>
                      {activeSession.visitorName}
                    </p>
                    <p className={`text-[9px] ${isDark ? "text-white/40" : "text-slate-400"}`}>
                      {activeSession.visitorContact || "No contact info"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                      activeSession.status === "closed"
                        ? isDark
                          ? "border-slate-500/25 bg-slate-800/30 text-slate-500"
                          : "border-slate-300 bg-slate-100 text-slate-500"
                        : "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        activeSession.status === "closed" ? "bg-slate-500" : "animate-pulse bg-emerald-400"
                      }`}
                    />
                    {activeSession.status === "closed" ? "Closed" : "Online"}
                  </div>

                  {activeSession.status === "open" && (
                    <button
                      id="chat-close-session"
                      onClick={closeSession}
                      title="Mark conversation as closed"
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white/60 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          : "border-slate-200 bg-white text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Close chat
                    </button>
                  )}

                  <button
                    id="chat-delete-session"
                    onClick={() => handleDeleteSession(activeSession.id)}
                    title="Delete conversation"
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[10px] font-semibold transition ${
                      isDark
                        ? "border-white/10 bg-white/5 text-red-400 hover:border-red-500/40 hover:bg-red-500/20"
                        : "border-slate-200 bg-white text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete chat
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-5 min-h-0">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[#a855f7]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className={`flex h-full items-center justify-center text-xs ${isDark ? "text-white/25" : "text-slate-300"}`}>
                    No messages yet in this conversation.
                  </div>
                ) : (
                  <>
                    {messages.map((m) => {
                      const isAdmin = m.sender === "admin";
                      return (
                        <AnimatePresence key={m.id} mode="popLayout">
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                          >
                            {!isAdmin && (
                              <div className="mr-2 mt-auto grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[8px] font-bold text-white">
                                {initials(activeSession.visitorName)}
                              </div>
                            )}
                            <div className={`max-w-[68%] space-y-1 ${isAdmin ? "text-right" : "text-left"}`}>
                              <div
                                className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                                  isAdmin
                                    ? "rounded-tr-none bg-gradient-to-br from-[#a855f7] to-[#cc7aff] border-[#a855f7]/20 text-white shadow-lg"
                                    : isDark
                                    ? "rounded-tl-none bg-white/[0.03] border-white/5 text-white/90"
                                    : "rounded-tl-none bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                              >
                                {m.text}
                              </div>
                              <div
                                className={`flex items-center gap-1 text-[9px] ${isAdmin ? "justify-end" : "justify-start"} ${isDark ? "text-white/30" : "text-slate-400"}`}
                              >
                                <span>{msgTime(m.timestamp)}</span>
                              </div>
                            </div>
                            {isAdmin && (
                              <div className="ml-2 mt-auto grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#6a18c8] text-[8px] font-bold text-white">
                                A
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Reply input */}
              {activeSession.status === "closed" ? (
                <div className={`border-t p-4 text-center text-xs ${isDark ? "border-white/5 text-white/30" : "border-slate-100 text-slate-400"}`}>
                  This conversation is closed.
                </div>
              ) : (
                <form
                  onSubmit={handleSend}
                  className={`flex items-center gap-3 border-t p-4 ${isDark ? "border-white/5 bg-[#12052c]/20" : "border-slate-100 bg-slate-50/40"}`}
                >
                  <input
                    id="admin-reply-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e as any); } }}
                    placeholder="Type a reply…"
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-[#a855f7]/40"
                        : "border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40"
                    }`}
                  />
                  <button
                    id="admin-send-btn"
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#a855f7] to-[#6a18c8] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Premium Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl border p-6 shadow-2xl ${
                isDark
                  ? "border-white/10 bg-[#160a2c] text-white shadow-purple-950/20"
                  : "border-slate-200 bg-white text-slate-800 shadow-slate-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold leading-none">Delete Conversation</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? "text-white/60" : "text-slate-500"}`}>
                    Are you sure you want to permanently delete this conversation and all its messages? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                    isDark
                      ? "border-[#a855f7]/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSession}
                  className="rounded-lg bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 hover:shadow-lg hover:shadow-red-500/25"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
