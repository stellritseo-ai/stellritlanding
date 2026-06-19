import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Calendar, Loader2, AlertCircle } from "lucide-react";
import {
  createChatSessionFn,
  getChatSessionFn,
  sendChatMessageFn,
  type ChatSession,
  type ChatMessage,
} from "@/lib/chat.functions.server";

// ── Config ────────────────────────────────────────────────────────────────────
const RELAY_URL = import.meta.env.VITE_RELAY_URL ?? "http://localhost:3001";
const SESSION_KEY = "stellr_chat_session_id";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [step, setStep] = useState<"intro" | "form" | "chat">("intro");

  const [session, setSession] = useState<ChatSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [visitorName, setVisitorName] = useState("");
  const [visitorContact, setVisitorContact] = useState("");

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  // ── Show tooltip after 4s ─────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (!open) setShowNotification(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [open]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [session?.messages, adminTyping, open]);

  // ── Socket.IO relay connection ────────────────────────────────────────────
  useEffect(() => {
    if (!session?.id) return;

    // Lazily import socket.io-client
    import("socket.io-client").then(({ io }) => {
      const socket = io(RELAY_URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join-room", session.id);
      });

      // Admin reply comes in — add to messages
      socket.on("receive-message", (msg: any) => {
        if (msg.sender === "admin") {
          setAdminTyping(false);
          setSession((prev) => {
            if (!prev) return null;
            const exists = prev.messages.some((m) => m.id === msg.id || m.id === msg._id);
            if (exists) return prev;
            const newMsg: ChatMessage = {
              id: msg.id || msg._id || Math.random().toString(36),
              sender: "admin",
              text: msg.text,
              timestamp: msg.timestamp,
            };
            return {
              ...prev,
              messages: [...prev.messages, newMsg],
              lastMessage: msg.text,
              lastMessageTime: msg.timestamp,
            };
          });
        }
      });

      return () => { socket.disconnect(); };
    });
  }, [session?.id]);

  // ── 3-second polling fallback (same as JRM) ───────────────────────────────
  useEffect(() => {
    if (!session?.id) return;
    const interval = setInterval(async () => {
      try {
        const refreshed = await getChatSessionFn({ data: { sessionId: session.id } });
        if (refreshed) setSession(refreshed);
      } catch { /* non-fatal */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [session?.id]);

  // ── On open: restore session from localStorage ────────────────────────────
  useEffect(() => {
    if (!open) return;
    const storedId = localStorage.getItem(SESSION_KEY);
    if (!storedId) { setStep("intro"); return; }

    setSessionLoading(true);
    getChatSessionFn({ data: { sessionId: storedId } })
      .then((sess) => {
        if (sess) {
          setSession(sess);
          setStep("chat");
        } else {
          localStorage.removeItem(SESSION_KEY);
          setStep("intro");
        }
      })
      .catch(() => {
        localStorage.removeItem(SESSION_KEY);
        setStep("intro");
      })
      .finally(() => setSessionLoading(false));
  }, [open]);

  // ── Create new session ────────────────────────────────────────────────────
  const startChat = async () => {
    if (!visitorName.trim()) { setFormError("Please enter your name."); return; }
    if (!visitorContact.trim()) { setFormError("Please enter your email or phone."); return; }
    setFormError(null);
    setSessionLoading(true);

    try {
      const sess = await createChatSessionFn({
        data: { visitorName: visitorName.trim(), visitorContact: visitorContact.trim() },
      });

      // Seed welcome message
      const welcomed = await sendChatMessageFn({
        data: {
          sessionId: sess.id,
          sender: "admin",
          text: `Hi ${visitorName.split(" ")[0]}! 👋 Thanks for reaching out to StellR IT. How can we help you today?`,
        },
      });

      localStorage.setItem(SESSION_KEY, sess.id);
      setSession(welcomed || sess);
      setStep("chat");
    } catch {
      setFormError("Failed to connect. Please try again.");
    } finally {
      setSessionLoading(false);
    }
  };

  // ── Send visitor message ──────────────────────────────────────────────────
  const sendMessage = useCallback(async (text = input) => {
    if (!text.trim() || !session || session.status === "closed" || sending) return;

    setInput("");
    setSending(true);

    // Optimistic
    const optimisticMsg: ChatMessage = {
      id: `opt-${Date.now()}`,
      sender: "visitor",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setSession((prev) => prev ? { ...prev, messages: [...prev.messages, optimisticMsg] } : prev);

    try {
      const updated = await sendChatMessageFn({
        data: { sessionId: session.id, sender: "visitor", text: text.trim() },
      });
      if (updated) setSession(updated);

      // Relay via Socket.IO so admin sees it instantly
      const lastMsg = updated?.messages[updated.messages.length - 1];
      if (socketRef.current && lastMsg) {
        socketRef.current.emit("new-message", {
          sessionId: session.id,
          message: { ...lastMsg, sessionId: session.id },
        });
      }

      // Show typing indicator for 12 seconds (simulated agent response wait)
      setAdminTyping(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setAdminTyping(false), 12000);
    } catch {
      setSession((prev) =>
        prev
          ? { ...prev, messages: prev.messages.filter((m) => m.id !== optimisticMsg.id) }
          : prev
      );
    } finally {
      setSending(false);
    }
  }, [input, session, sending]);

  const handleToggle = () => {
    setOpen((v) => !v);
    setShowNotification(false);
  };

  const isClosed = session?.status === "closed";
  const messages = session?.messages ?? [];

  return (
    <>
      {/* ── Tooltip notification ──────────────────────────────────────────── */}
      {showNotification && !open && (
        <div className="fixed bottom-24 right-6 z-[60] mb-2 flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a003a] px-4 py-2.5 text-sm text-white shadow-xl backdrop-blur-xl animate-bounce">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Have questions? Chat with us!</span>
          <button onClick={() => setShowNotification(false)} className="ml-1 text-white/50 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ── Floating launcher button ──────────────────────────────────────── */}
      <button
        id="chat-widget-launcher"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#6a18c8] text-white shadow-[0_10px_40px_-10px_rgba(168,85,247,0.8)] ring-1 ring-white/20 transition hover:scale-105"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-[#a855f7] opacity-60 blur-xl animate-pulse" />
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* ── Panel ────────────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-6 z-[60] w-[min(390px,calc(100vw-1.5rem))] origin-bottom-right overflow-hidden rounded-2xl border border-white/10 bg-[#120025]/95 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 bg-gradient-to-br from-[#3A0A7A] via-[#4a1290] to-[#1a0533] px-4 py-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold leading-tight">StellR IT</div>
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              {isClosed ? (
                <><span className="h-1.5 w-1.5 rounded-full bg-gray-400" />Conversation closed</>
              ) : (
                <><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Online — typically replies instantly</>
              )}
            </div>
          </div>
          <button
            id="chat-widget-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading */}
        {sessionLoading && (
          <div className="flex min-h-[260px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#a855f7]" />
          </div>
        )}

        {/* Intro */}
        {!sessionLoading && step === "intro" && (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 px-5 py-8 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#a855f7]/30 to-[#6a18c8]/30 ring-1 ring-[#a855f7]/40">
              <MessageCircle className="h-7 w-7 text-[#c084fc]" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">Hi there! 👋</p>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                We typically reply in minutes. Start a conversation below.
              </p>
            </div>
            <button
              id="chat-start-btn"
              onClick={() => setStep("form")}
              className="mt-1 w-full rounded-xl bg-gradient-to-br from-[#a855f7] to-[#6a18c8] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Start a conversation
            </button>
          </div>
        )}

        {/* Form */}
        {!sessionLoading && step === "form" && (
          <div className="flex min-h-[260px] flex-col gap-4 px-5 py-6">
            <p className="text-sm text-white/70">Tell us a bit about yourself so we can help you better.</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs text-white/50" htmlFor="chat-visitor-name">Your name *</label>
                <input
                  id="chat-visitor-name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startChat()}
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#a855f7]/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50" htmlFor="chat-visitor-contact">Email or phone *</label>
                <input
                  id="chat-visitor-contact"
                  value={visitorContact}
                  onChange={(e) => setVisitorContact(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startChat()}
                  placeholder="jane@company.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#a855f7]/60 focus:outline-none"
                />
              </div>

              {formError && (
                <p className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {formError}
                </p>
              )}

              <button
                id="chat-form-submit"
                onClick={startChat}
                disabled={sessionLoading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#6a18c8] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
              >
                {sessionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start chatting →"}
              </button>

              <button onClick={() => setStep("intro")} className="text-center text-xs text-white/40 hover:text-white/60">
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Chat */}
        {!sessionLoading && step === "chat" && (
          <>
            <div ref={scrollRef} className="flex max-h-[42vh] min-h-[260px] flex-col gap-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => {
                const isVisitor = m.sender === "visitor";
                return (
                  <div key={m.id} className={`flex flex-col ${isVisitor ? "items-end" : "items-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug ${
                        isVisitor
                          ? "bg-gradient-to-br from-[#ff8a5b] to-[#e8674a] text-white"
                          : "bg-white/[0.06] text-white/90 ring-1 ring-white/10"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/35">{formatTime(m.timestamp)}</div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {adminTyping && (
                <div className="flex items-start">
                  <div className="flex items-center gap-1 rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50" />
                  </div>
                </div>
              )}
            </div>

            {isClosed && (
              <div className="mx-4 mb-3 rounded-xl border border-gray-500/30 bg-gray-800/40 px-4 py-3 text-center text-xs text-white/60">
                This conversation has been closed.
              </div>
            )}

            <div className="px-4 pb-3">
              <a
                id="chat-book-call"
                href="mailto:hello@stellrit.com?subject=Book%20a%20discovery%20call"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#ff8a5b]/50 hover:bg-white/[0.1]"
              >
                <Calendar className="h-4 w-4" />
                Book a discovery call
              </a>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-2 border-t border-white/10 bg-black/20 px-3 py-3"
            >
              <input
                id="chat-message-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={isClosed ? "Conversation closed" : "Ask about services, pricing, timelines…"}
                disabled={isClosed || sending}
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#a855f7]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                id="chat-send-btn"
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || isClosed || sending}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#a855f7] to-[#6a18c8] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
