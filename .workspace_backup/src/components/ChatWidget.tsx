import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Calendar } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string };

const QUICK_ACTIONS = [
  { label: "Services", emoji: "🧩", reply: "We offer Strategy, Web & Product Design, Engineering, Brand, and Growth Marketing. Which area fits your project?" },
  { label: "Case Studies", emoji: "📈", reply: "Our work spans fintech, retail, healthcare, and SaaS. Want me to pull up a relevant case study?" },
  { label: "Pricing", emoji: "💰", reply: "Engagements typically start at $25k for sprints and scale up for retainers and platform builds. Want a tailored estimate?" },
  { label: "Timeline", emoji: "🗓️", reply: "Sprints run 2–4 weeks, full builds 8–16 weeks. When are you hoping to launch?" },
  { label: "Careers", emoji: "🚀", reply: "We're hiring across design, engineering, and strategy. I can point you to open roles." },
  { label: "Contact", emoji: "📞", reply: "You can reach us at hello@stellrit.com or book a call below." },
];

const INITIAL: Msg = {
  role: "bot",
  text: "Hi, I'm StellR — your digital strategy concierge. I can help with services, case studies, pricing, and timelines. What are you exploring today?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([INITIAL]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    const match = QUICK_ACTIONS.find((q) => text.toLowerCase().includes(q.label.toLowerCase()));
    const reply = match?.reply ??
      "Thanks for the note — a strategist will follow up shortly. In the meantime, you can book a discovery call below.";
    setTimeout(() => setMessages((m) => [...m, { role: "bot", text: reply }]), 600);
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[60] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#6a18c8] text-white shadow-[0_10px_40px_-10px_rgba(168,85,247,0.8)] ring-1 ring-white/20 transition hover:scale-105"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-[#a855f7] opacity-60 blur-xl animate-pulse" />
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-24 right-6 z-[60] w-[min(380px,calc(100vw-3rem))] origin-bottom-right overflow-hidden rounded-2xl border border-white/10 bg-[#120025] text-white shadow-2xl transition-all duration-300 ${
          open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online — typically replies instantly
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1 text-white/80 transition hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="max-h-[42vh] min-h-[260px] space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-[#ff8a5b] to-[#e8674a] text-white"
                    : "bg-white/[0.06] text-white/90 ring-1 ring-white/10"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="pt-2">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">Quick actions</div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => send(q.label)}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm text-white/90 transition hover:border-[#ff8a5b]/40 hover:bg-white/[0.08]"
                  >
                    <span className="mr-1.5">{q.emoji}</span>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Book CTA */}
        <div className="px-4 pb-3">
          <a
            href="mailto:hello@stellrit.com?subject=Book%20a%20discovery%20call"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:border-[#ff8a5b]/50 hover:bg-white/[0.1]"
          >
            <Calendar className="h-4 w-4" />
            Book a discovery call
          </a>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t border-white/10 bg-black/20 px-3 py-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about services, pricing, timelines…"
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#a855f7]/60 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#a855f7] to-[#6a18c8] text-white transition hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
