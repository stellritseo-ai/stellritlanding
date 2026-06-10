import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

type LinkItem = { label: string; to: string };
const COMPANY: LinkItem[] = [
  { label: "About Us", to: "/about" },
  { label: "Career", to: "/careers" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Contact", to: "/contact" },
];
const RESOURCES: LinkItem[] = [
  { label: "StellR Insights", to: "/insights" },
  { label: "StellR Academy", to: "/insights" },
];
const SOLUTIONS: LinkItem[] = [{ label: "StellR Solutions", to: "/services" }];
const LEGAL: LinkItem[] = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Security", to: "/privacy" },
  { label: "Terms of Use", to: "/terms" },
  { label: "Data Security", to: "/privacy" },
];

export default function Footer() {
  const topRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealFrom = { y: 40, opacity: 0 };
      const revealTo = {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      } as const;
      const triggerConfig = {
        start: "top 85%",
        toggleActions: "play none none none",
      } as const;

      [topRef, columnsRef, bottomRef].forEach((r) => {
        if (r.current) {
          gsap.fromTo(r.current.children, revealFrom, {
            ...revealTo,
            scrollTrigger: { trigger: r.current, ...triggerConfig },
          });
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setEmail("");
    toast.success("You've been subscribed to the StellR IT newsletter!");
  };

  const Column = ({ title, items }: { title: string; items: LinkItem[] }) => (
    <div>
      <h4 className="mb-7 text-[18px] font-semibold text-white">{title}</h4>
      <ul className="space-y-4">
        {items.map((s) => (
          <li key={s.label}>
            <Link
              to={s.to}
              className="text-[15px] text-white/70 transition-colors hover:text-[#ff8a5b]"
            >
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative z-10 overflow-hidden bg-transparent text-white border-t border-white/10" onMouseMove={(e) => {
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      e.currentTarget.style.setProperty("--x", `${x * 100}%`);
      e.currentTarget.style.setProperty("--y", `${y * 100}%`);
    }}>
      {/* Interactive mouse glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(168,85,247,0.15) 0%, transparent 50%)",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:px-20 relative z-10">
        {/* Top row: logo + badges (left), socials (right) */}
        <div
          ref={topRef}
          className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between"
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <span className="font-serif text-5xl font-normal tracking-tight bg-gradient-to-r from-[#7a2adc] via-[#be50ff] to-[#ff8a5b] bg-clip-text text-transparent">
                StellR
              </span>
              <span className="text-5xl font-light text-white/80">IT</span>
            </div>
            <div className="flex items-center gap-4">
              {/* EU badge */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003399]">
                <div className="grid grid-cols-3 gap-[2px]">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className="text-[6px] text-yellow-300">★</span>
                  ))}
                </div>
              </div>
              {/* SOC II */}
              <div
                className="flex h-14 w-14 items-center justify-center text-[10px] font-bold text-white"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                SOC II
              </div>
              {/* GDPR */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/25">
                <span className="text-[10px] font-bold text-white">GDPR</span>
                <div className="pointer-events-none absolute inset-0 rounded-full">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute left-1/2 top-1/2 text-[6px] text-yellow-300"
                      style={{
                        transform: `translate(-50%,-50%) rotate(${i * 30}deg) translateY(-24px)`,
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            {[
              { label: "Facebook", svg: <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z" /> },
              { label: "Instagram", svg: <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.5" r="1" /></> },
              { label: "YouTube", svg: <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /> },
              { label: "LinkedIn", svg: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.1 0 4.9 2.7 4.9 6.2V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4z" /> },
              { label: "TikTok", svg: <path d="M19.5 8.2a6.4 6.4 0 0 1-3.8-1.2v7.6a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.8a2.7 2.7 0 1 0 1.9 2.6V2h2.7a3.7 3.7 0 0 0 3.8 3.4z" /> },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#ff8a5b] hover:text-[#ff8a5b]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {s.svg}
                </svg>
              </a>
            ))}
          </nav>
        </div>

        {/* Columns */}
        <div
          ref={columnsRef}
          className="mt-20 grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-5"
        >
          <Column title="Company" items={COMPANY} />
          <Column title="Resources" items={RESOURCES} />
          <Column title="Solutions" items={SOLUTIONS} />
          <Column title="Legal" items={LEGAL} />
          <div>
            <h4 className="mb-7 text-[18px] font-semibold text-white">Need Help ?</h4>
            <ul className="space-y-5 text-[14px] text-white/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <span>633 W 5th St floor 26, Los Angeles, CA 90071, United States</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                <span>576 Block Q, Phase 2 Johar Town, Lahore, 54782</span>
              </li>
              <li>
                <a href="tel:8559185940" className="flex items-center gap-3 hover:text-[#ff8a5b]">
                  <Phone className="h-4 w-4 shrink-0 text-white/60" />
                  855-918-5940
                </a>
              </li>
              <li>
                <a href="mailto:hello@stellr.it" className="flex items-center gap-3 hover:text-[#ff8a5b]">
                  <Mail className="h-4 w-4 shrink-0 text-white/60" />
                  hello@stellr.it
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 border-t border-white/10 pt-10 md:pt-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-[20px] font-semibold text-white">Subscribe to our newsletter</h4>
              <p className="mt-2 text-[15px] text-white/60">
                Get the latest insights, case studies, and updates from StellR IT.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-start">
              <div className="flex w-full flex-col gap-1 md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your email"
                  className={`h-12 w-full rounded-full border bg-white/5 px-5 text-[15px] text-white outline-none transition-all placeholder:text-white/30 md:w-72 ${error ? "border-red-400/60 focus:border-red-400" : "border-white/15 focus:border-[#ff8a5b]"
                    }`}
                />
                {error && <span className="px-1 text-[13px] text-red-400">{error}</span>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7a2adc] to-[#ff8a5b] px-6 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Subscribe
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div
          ref={bottomRef}
          className="mt-16 flex flex-col items-start gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between"
        >
          <span className="text-[14px] text-white/60">
            © StellR IT . All rights reserved {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-8 text-[14px] text-white/70">
            <Link to="/privacy" className="transition-colors hover:text-[#ff8a5b]">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-[#ff8a5b]">Terms of Use</Link>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      {/* <div className="overflow-hidden px-4 pb-4">
        <div
          className="shimmer-text select-none whitespace-nowrap text-center font-sans font-black uppercase leading-[0.8] tracking-[-0.05em]"
          style={{ fontSize: "clamp(80px, 28vw, 480px)" }}
        >
          StellR IT
        </div>
      </div> */}

      {/* <style>{`
        .shimmer-text {
          background:
            linear-gradient(
              105deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0) 40%,
              rgba(255,255,255,0.55) 50%,
              rgba(255,255,255,0) 60%,
              rgba(255,255,255,0) 100%
            ),
            linear-gradient(
              to bottom,
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,0.35) 55%,
              rgba(26,5,51,1) 100%
            );
          background-size: 250% 100%, 100% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer-sweep 5s ease-in-out infinite;
        }
        @keyframes shimmer-sweep {
          0%   { background-position: 200% 0, 0 0; }
          100% { background-position: -200% 0, 0 0; }
        }
      `}</style> */}
    </footer>
  );
}
