import { createFileRoute } from "@tanstack/react-router";
import { useDashboardTheme } from "../../hooks/useDashboardTheme";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Check,
  CheckCheck,
  Paperclip,
  Search,
  X,
  Loader2,
  AlertCircle,
  UserCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatSocket } from "@/hooks/useChatSocket";

export const Route = createFileRoute("/dashboard/chat")({
  component: ChatPage,
});

// ─── Config ───────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_CHAT_API_URL ?? "http://localhost:3001";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN ?? "stellr-admin-dev-2024";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatSession {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorPhoneOrEmail: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageAt: string;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: "visitor" | "admin";
  message: string;
  createdAt: string;
  readAt: string | null;
}

type StatusFilter = "all" | "open" | "closed";

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function adminFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": ADMIN_TOKEN,
    },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

// ─── Component ────────────────────────────────────────────────────────────────
function ChatPage() {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";

  // Sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  // Active session
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");

  // Input
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Typing
  const [visitorTyping, setVisitorTyping] = useState<string | null>(null); // sessionId of typing visitor
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const myTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  // ─── Socket.IO ─────────────────────────────────────────────────────────
  const { joinAdmin, joinSession, leaveSession, emitTypingStart, emitTypingStop, markRead } =
    useChatSocket({
      onMessage: (data) => {
        // Update messages if this is the active session
        if (data.sessionId === activeSessionId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev;
            return [...prev, data as unknown as ChatMessage];
          });
        }

        // Update sessions list with latest message + unread count
        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== data.sessionId) return s;
            return {
              ...s,
              lastMessage: data.message,
              lastMessageAt: data.createdAt,
              unreadCount:
                data.senderType === "visitor" && data.sessionId !== activeSessionId
                  ? s.unreadCount + 1
                  : s.unreadCount,
            };
          })
        );
      },
      onTypingStart: (data) => {
        if (data.senderType === "visitor") {
          setVisitorTyping(data.sessionId);
          if (typingTimeout.current) clearTimeout(typingTimeout.current);
          typingTimeout.current = setTimeout(() => setVisitorTyping(null), 4000);
        }
      },
      onTypingStop: (data) => {
        if (data.senderType === "visitor" && data.sessionId === visitorTyping) {
          setVisitorTyping(null);
        }
      },
      onSessionCreated: (data) => {
        // Add new session to the top of the list
        setSessions((prev) => {
          if (prev.some((s) => s.id === data.id)) return prev;
          return [
            {
              id: data.id,
              visitorId: data.visitorId,
              visitorName: data.visitorName,
              visitorPhoneOrEmail: data.visitorPhoneOrEmail,
              status: data.status,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              unreadCount: 0,
              lastMessage: "",
              lastMessageAt: data.createdAt,
            },
            ...prev,
          ];
        });
      },
      onSessionUpdated: (data) => {
        setSessions((prev) =>
          prev.map((s) => (s.id === data.id ? { ...s, status: data.status } : s))
        );
      },
      onMessageRead: (data) => {
        if (data.sessionId === activeSessionId && data.readBy === "visitor") {
          setMessages((prev) =>
            prev.map((m) =>
              m.senderType === "admin" && !m.readAt
                ? { ...m, readAt: new Date().toISOString() }
                : m
            )
          );
        }
      },
    });

  // ─── Join admin room on mount ───────────────────────────────────────────
  useEffect(() => {
    // Small delay to ensure socket is connected before emitting
    const t = setTimeout(() => joinAdmin(), 500);
    return () => clearTimeout(t);
  }, [joinAdmin]);

  // ─── Fetch sessions ─────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const data = await adminFetch<ChatSession[]>(`/api/admin/chats?${params}`);
      setSessions(data);
    } catch (err) {
      setSessionsError(err instanceof Error ? err.message : "Failed to load chats");
    } finally {
      setSessionsLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // ─── Load session messages ──────────────────────────────────────────────
  const loadMessages = useCallback(
    async (sessionId: string) => {
      setMessagesLoading(true);
      try {
        const data = await adminFetch<{ session: ChatSession; messages: ChatMessage[] }>(
          `/api/admin/chats/${sessionId}`
        );
        setMessages(data.messages);
        // Clear unread count for this session
        setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, unreadCount: 0 } : s))
        );
        // Mark messages as read
        markRead(sessionId, "admin");
      } catch {
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    },
    [markRead]
  );

  // ─── Switch active session ──────────────────────────────────────────────
  const selectSession = useCallback(
    (sessionId: string) => {
      if (activeSessionId) leaveSession(activeSessionId);
      setActiveSessionId(sessionId);
      joinSession(sessionId);
      loadMessages(sessionId);
    },
    [activeSessionId, joinSession, leaveSession, loadMessages]
  );

  // ─── Auto-scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, visitorTyping]);

  // ─── Send admin reply ───────────────────────────────────────────────────
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId || sending) return;

    const text = input.trim();
    const optimisticId = `opt-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        sessionId: activeSessionId,
        senderType: "admin",
        message: text,
        createdAt: new Date().toISOString(),
        readAt: null,
      },
    ]);
    setInput("");
    setSending(true);

    emitTypingStop(activeSessionId, "admin");
    if (myTypingTimeout.current) clearTimeout(myTypingTimeout.current);

    try {
      const saved = await adminFetch<ChatMessage>(`/api/admin/chat/${activeSessionId}/message`, {
        method: "POST",
        body: JSON.stringify({ message: text }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? saved : m))
      );
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, lastMessage: text, lastMessageAt: new Date().toISOString() }
            : s
        )
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } finally {
      setSending(false);
    }
  };

  // ─── Typing emit ────────────────────────────────────────────────────────
  const handleInputChange = (val: string) => {
    setInput(val);
    if (!activeSessionId) return;
    emitTypingStart(activeSessionId, "admin");
    if (myTypingTimeout.current) clearTimeout(myTypingTimeout.current);
    myTypingTimeout.current = setTimeout(() => {
      if (activeSessionId) emitTypingStop(activeSessionId, "admin");
    }, 3000);
  };

  // ─── Mark session as closed ─────────────────────────────────────────────
  const closeSession = async () => {
    if (!activeSessionId) return;
    try {
      await adminFetch(`/api/admin/chat/${activeSessionId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "closed" }),
      });
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, status: "closed" } : s))
      );
    } catch {
      // ignore
    }
  };

  // ─── Total unread ───────────────────────────────────────────────────────
  const totalUnread = sessions.reduce((sum, s) => sum + s.unreadCount, 0);

  // ─── Filtered sessions ──────────────────────────────────────────────────
  const filtered = sessions.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.visitorName.toLowerCase().includes(q) ||
        s.visitorPhoneOrEmail.toLowerCase().includes(q) ||
        s.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ─── UI ─────────────────────────────────────────────────────────────────
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
        style={{ height: "calc(100vh - 220px)", minHeight: "520px" }}
      >
        {/* ── Left: Sessions list ──────────────────────────────────────── */}
        <div
          className={`flex h-full flex-col border-r ${
            isDark ? "border-white/5 bg-[#12052c]/40" : "border-slate-100 bg-slate-50/50"
          }`}
        >
          {/* Search + filter header */}
          <div
            className={`space-y-2 border-b p-3 ${
              isDark ? "border-white/5" : "border-slate-100"
            }`}
          >
            {/* Search box */}
            <div className="relative">
              <Search
                className={`absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
                  isDark ? "text-white/30" : "text-slate-400"
                }`}
              />
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
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3 w-3 text-white/40" />
                </button>
              )}
            </div>

            {/* Status filter tabs */}
            <div
              className={`flex rounded-lg p-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                isDark ? "bg-white/5" : "bg-slate-100"
              }`}
            >
              {(["open", "closed", "all"] as StatusFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`flex-1 rounded-md py-1 transition ${
                    statusFilter === f
                      ? isDark
                        ? "bg-[#a855f7]/20 text-[#c084fc]"
                        : "bg-white text-[#a855f7] shadow"
                      : isDark
                      ? "text-white/40 hover:text-white/70"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions scroll list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-[#a855f7]" />
              </div>
            ) : sessionsError ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="text-xs text-red-400">{sessionsError}</p>
                <button
                  onClick={fetchSessions}
                  className="text-xs text-[#a855f7] underline"
                >
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className={`py-10 text-center text-xs ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {search ? "No conversations match your search." : "No conversations yet."}
              </div>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  id={`chat-session-${s.id}`}
                  onClick={() => selectSession(s.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
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
                        s.status === "closed"
                          ? "bg-slate-500"
                          : "bg-gradient-to-br from-indigo-500 to-purple-600"
                      }`}
                    >
                      {initials(s.visitorName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="block truncate text-xs font-semibold">
                          {s.visitorName}
                        </span>
                        <span
                          className={`shrink-0 text-[9px] ${
                            isDark ? "text-white/35" : "text-slate-400"
                          }`}
                        >
                          {relativeTime(s.lastMessageAt)}
                        </span>
                      </div>
                      <p
                        className={`truncate text-[10px] leading-snug ${
                          isDark ? "text-white/40" : "text-slate-500"
                        }`}
                      >
                        {s.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {s.unreadCount > 0 && (
                        <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {s.unreadCount}
                        </span>
                      )}
                      {visitorTyping === s.id && (
                        <span className="text-[8px] text-[#a855f7]">typing…</span>
                      )}
                      {s.status === "closed" && (
                        <span
                          className={`text-[8px] uppercase tracking-wider ${
                            isDark ? "text-white/20" : "text-slate-300"
                          }`}
                        >
                          closed
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right: Conversation area ─────────────────────────────────── */}
        <div className="flex h-full flex-col lg:col-span-2">
          {!activeSession ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <MessageSquare
                className={`h-10 w-10 ${isDark ? "text-white/15" : "text-slate-200"}`}
              />
              <p className={`text-sm ${isDark ? "text-white/30" : "text-slate-400"}`}>
                Select a conversation to view messages
              </p>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div
                className={`flex items-center justify-between border-b px-5 py-3.5 ${
                  isDark
                    ? "border-white/5 bg-[#12052c]/30"
                    : "border-slate-100 bg-slate-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
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
                    <p
                      className={`text-xs font-semibold ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {activeSession.visitorName}
                    </p>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-[9px] ${
                          isDark ? "text-white/40" : "text-slate-400"
                        }`}
                      >
                        {activeSession.visitorPhoneOrEmail || "No contact info"}
                      </p>
                      {visitorTyping === activeSession.id && (
                        <span className="text-[9px] text-[#a855f7]">typing…</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Online/offline indicator */}
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
                        activeSession.status === "closed"
                          ? "bg-slate-500"
                          : "animate-pulse bg-emerald-400"
                      }`}
                    />
                    {activeSession.status === "closed" ? "Closed" : "Online"}
                  </div>

                  {/* Mark closed button */}
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
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-5">
                {messagesLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-[#a855f7]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div
                    className={`flex h-full items-center justify-center text-xs ${
                      isDark ? "text-white/25" : "text-slate-300"
                    }`}
                  >
                    No messages yet in this conversation.
                  </div>
                ) : (
                  <>
                    {messages.map((m) => {
                      const isAdmin = m.senderType === "admin";
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
                            <div
                              className={`max-w-[68%] space-y-1 ${
                                isAdmin ? "text-right" : "text-left"
                              }`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed border ${
                                  isAdmin
                                    ? "rounded-tr-none bg-gradient-to-br from-[#a855f7] to-[#cc7aff] border-[#a855f7]/20 text-white shadow-lg"
                                    : isDark
                                    ? "rounded-tl-none bg-white/[0.03] border-white/5 text-white/90"
                                    : "rounded-tl-none bg-slate-50 border-slate-200 text-slate-800"
                                }`}
                              >
                                {m.message}
                              </div>
                              <div
                                className={`flex items-center gap-1 text-[9px] ${
                                  isAdmin ? "justify-end" : "justify-start"
                                } ${isDark ? "text-white/30" : "text-slate-400"}`}
                              >
                                <span>{msgTime(m.createdAt)}</span>
                                {isAdmin && (
                                  m.readAt ? (
                                    <CheckCheck className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )
                                )}
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

                    {/* Visitor typing indicator */}
                    {visitorTyping === activeSession.id && (
                      <div className="flex items-center gap-2">
                        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[8px] font-bold text-white">
                          {initials(activeSession.visitorName)}
                        </div>
                        <div
                          className={`flex items-center gap-1 rounded-2xl rounded-tl-none px-4 py-2.5 ${
                            isDark ? "bg-white/[0.03] ring-1 ring-white/5" : "bg-slate-50"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Reply input */}
              {activeSession.status === "closed" ? (
                <div
                  className={`border-t p-4 text-center text-xs ${
                    isDark
                      ? "border-white/5 text-white/30"
                      : "border-slate-100 text-slate-400"
                  }`}
                >
                  This conversation is closed. Visitor must start a new chat.
                </div>
              ) : (
                <form
                  onSubmit={handleSend}
                  className={`flex items-center gap-3 border-t p-4 ${
                    isDark ? "border-white/5 bg-[#12052c]/20" : "border-slate-100 bg-slate-50/40"
                  }`}
                >
                  <button
                    type="button"
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white/50 hover:text-white"
                        : "border-slate-200 bg-white text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <input
                    ref={inputRef}
                    id="admin-reply-input"
                    type="text"
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e as unknown as React.FormEvent);
                      }
                    }}
                    placeholder="Type your reply…"
                    className={`h-9 flex-1 rounded-xl border px-4 text-xs transition focus:outline-none focus:ring-1 ${
                      isDark
                        ? "border-white/10 bg-white/5 text-white placeholder-white/35 focus:border-[#a855f7]/40 focus:ring-[#a855f7]/20"
                        : "border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:border-[#a855f7]/40 focus:ring-[#a855f7]/10"
                    }`}
                  />
                  <button
                    id="admin-send-btn"
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ff8a5b] text-white shadow transition hover:shadow-lg active:scale-[0.97] disabled:opacity-40"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
