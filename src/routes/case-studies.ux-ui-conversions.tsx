import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, ArrowUpRight, MousePointerClick, TrendingDown, BarChart3, CheckCircle2, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";
import serviceProduct from "@/assets/service-product.jpg";
import serviceAi from "@/assets/service-ai.png";

export const Route = createFileRoute("/case-studies/ux-ui-conversions")({
  head: () => ({
    meta: [
      { title: "How UX/UI Increases Conversion Rates | StellR IT LLC" },
      {
        name: "description",
        content:
          "How STELLR IT redesigned Finvise to reduce bounce rates from 58% to 27% and increased signup completion by 41%, driving +$1.2M AUM in 3 months.",
      },
      { property: "og:title", content: "How UX/UI Increases Conversion Rates | StellR IT LLC" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/case-studies/ux-ui-conversions" }],
  }),
  component: UxUiConversionPage,
});

/* ── Approach steps ──────────────────────────────────────────────────── */
const APPROACH = [
  {
    number: "01",
    title: "Simplified Navigation",
    body: "Reduced menu items from 11 to 5. Added a sticky CTA (“Start Investing”) on every page to provide a frictionless path to action.",
    accent: "#0ea5e9", // sky blue
  },
  {
    number: "02",
    title: "Optimized Layout Architecture",
    body: "Moved the risk-free guarantee and primary CTA completely above the fold, ensuring immediate value proposition visibility.",
    accent: "#10b981", // emerald
  },
  {
    number: "03",
    title: "Enhanced Visual Hierarchy",
    body: "Increased button size (44px → 64px) and leveraged high-contrast 'green vs. grey' aesthetics with aggressive whitespace to intuitively guide the eye.",
    accent: "#059669", // dark emerald
  },
  {
    number: "04",
    title: "Streamlined Checkout Flows",
    body: "Slashed a cumbersome 12-field form down to just 4 essential fields (name, email, phone, investment goal) and added a clear progress indicator.",
    accent: "#0284c7", // dark sky
  },
  {
    number: "05",
    title: "Accelerated Mobile Responsiveness",
    body: "Thumb-optimized all tap targets and overhauled asset delivery to achieve a blistering 2-second load time on standard 4G connections.",
    accent: "#0369a1", // deeper sky
  },
];

/* ── Impact table ────────────────────────────────────────────────────── */
const IMPACT = [
  { metric: "Bounce rate", before: "58%", after: "27%", icon: TrendingDown, accent: "#10b981" },
  { metric: "Signup completion", before: "12%", after: "41%", icon: CheckCircle2, accent: "#0ea5e9" },
  { metric: "Assets Under Management", before: "Baseline", after: "+$1.2M in 3 mos", icon: BarChart3, accent: "#059669" },
];

/* ── Page ────────────────────────────────────────────────────────────── */
function UxUiConversionPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  return (
    <main className="relative min-h-screen">
      <ScrollBackground />
      <SiteHeader transparent hideNav />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Exact Isadora / Broadcom Background Replica - Re-themed for Finvise (Green/Blue) */}
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none bg-[#020f18]"
          style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}
        >
          <svg
            className="absolute inset-0 h-full w-full object-cover"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Top-Left Crisp Circle */}
              <linearGradient id="grad-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>

              {/* Bottom-Right Crisp Blob */}
              <linearGradient id="grad-br" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              
              {/* Massive ambient glow on top right */}
              <radialGradient id="grad-tr-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#020f18" stopOpacity="0" />
              </radialGradient>

              {/* Massive ambient glow on bottom left */}
              <radialGradient id="grad-bl-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#020f18" stopOpacity="0" />
              </radialGradient>

              {/* Thick Flowing S-Ribbon */}
              <linearGradient id="grad-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="65%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Background Ambient Fades */}
            <motion.circle 
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              cx="1100" cy="150" r="600" fill="url(#grad-tr-glow)" 
            />
            <motion.circle 
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              cx="200" cy="800" r="700" fill="url(#grad-bl-glow)" 
            />

            {/* Top-Left Crisp Circle */}
            <motion.circle 
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              cx="300" cy="180" r="140" fill="url(#grad-tl)" 
            />

            {/* Bottom-Right Crisp Blob */}
            <motion.circle 
              animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              cx="1350" cy="950" r="250" fill="url(#grad-br)" 
            />

            {/* The Main Thick Wavy Ribbon */}
            <motion.path
              animate={{ y: [0, 15, 0], scaleY: [1, 1.02, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              style={{ originY: "100%" }}
              d="M -200 950 
                 C 200 650, 400 1150, 850 850 
                 C 1150 550, 1350 900, 1600 700"
              fill="none"
              stroke="url(#grad-ribbon)"
              strokeWidth="350"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Light premium grain overlay */}
          <div
            className="absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              backgroundSize: "160px 160px",
            }}
          />
        </div>

        <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 px-6 pb-20 pt-36 md:px-14 lg:px-24">
          <div className="mx-auto max-w-[1380px]">

            {/* Back link */}
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-white/45 hover:text-white transition-colors duration-300 mb-16"
            >
              <ArrowLeft className="h-3 w-3" /> All case studies
            </Link>

            {/* Title & Accent Paragraph Container */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 xl:gap-24 relative z-10">
              <h1
                className="font-serif text-[52px] sm:text-[68px] md:text-[84px] lg:text-[104px] font-normal leading-[1.08] tracking-[-0.02em] text-white max-w-[950px]"
                style={{ textShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(16,185,129,0.4)" }}
              >
                How UX/UI <br />
                <em className="font-normal italic text-[#d1fae5] pr-4">Increases</em> <br />
                Conversion Rates.
              </h1>

              {/* Accent text like the screenshot */}
              <div className="flex gap-6 max-w-[420px] xl:pb-4 relative">
                <div className="relative mt-1.5 shrink-0">
                  <Sparkles className="relative z-10 h-7 w-7 text-[#34d399]" strokeWidth={1.5} />
                  <div className="absolute inset-0 rounded-full bg-[#34d399]/40 blur-md" />
                </div>
                <p className="text-[17px] md:text-[19px] leading-[1.6] text-white/70 font-light tracking-wide">
                  How we dropped bounce rates to 27% and drove a <strong className="font-medium text-white">+$1.2M AUM</strong> increase in 3 months for Finvise.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* ── CHALLENGE ─────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-20 md:px-14 lg:px-24">
        <div className="mx-auto max-w-[1380px]">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#020f18]/70 backdrop-blur-2xl p-10 md:p-16"
            style={{ boxShadow: "0 40px 120px -20px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            {/* Gradient top bar */}
            <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg, #10b981, #0ea5e9 60%, transparent)" }} />

            {/* BG glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #10b981, transparent)", filter: "blur(60px)" }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#34d399] font-semibold mb-6 block">
                  The Challenge
                </span>

                <h2 className="font-serif text-[28px] sm:text-[38px] md:text-[50px] leading-[1.1] tracking-tight text-white max-w-2xl">
                  58% bounce rate.
                  <br />
                  <span className="text-[#34d399]">72% abandonment</span> on signup.
                  <br />
                  <span className="text-white/40 italic font-normal">Features without flow.</span>
                </h2>

                <p className="mt-9 max-w-xl text-[15px] md:text-[17px] leading-[1.75] text-white/55">
                  Finvise (an investment advisory startup) had a brilliant product but a broken funnel. Users arrived at the pricing page only to bounce immediately. Those who did try to sign up were met with a grueling 3-step form that caused a massive 72% abandonment rate. The UX was leaking customers.
                </p>
              </div>

              {/* Related Image (New UX/UI Dashboard image) */}
              <div className="relative h-[300px] lg:h-full lg:min-h-[400px] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
                <img 
                  src={serviceProduct} 
                  alt="UX/UI design wireframes and analytics" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020f18]/80 via-emerald-900/30 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── APPROACH ──────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-20 md:px-14 lg:px-24">
        <div className="mx-auto max-w-[1380px]">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#34d399] font-semibold mb-4 block">
              Our Approach
            </span>
            <h2 className="font-serif text-[36px] sm:text-[50px] md:text-[62px] leading-[1.0] tracking-tight text-white max-w-3xl">
              Frictionless Conversion
            </h2>
            <p className="mt-5 text-[15px] md:text-[17px] text-white/45 max-w-2xl leading-[1.75]">
              We aggressively redesigned the user experience to eliminate cognitive load and remove every obstacle standing between the user and their first investment.
            </p>
          </motion.div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {APPROACH.map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#020f18]/50 backdrop-blur-xl p-8 hover:border-white/[0.13] transition-all duration-500 ${i === 4 ? "md:col-span-2" : ""}`}
                style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}
              >
                {/* Left accent stripe */}
                <div
                  className="absolute left-0 inset-y-0 w-[2px] rounded-full transition-opacity duration-300 opacity-50 group-hover:opacity-100"
                  style={{ background: item.accent }}
                />

                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at top left, ${item.accent}09, transparent 65%)` }}
                />

                {/* Step number */}
                <span
                  className="font-serif text-[60px] leading-none font-semibold opacity-[0.12] select-none block mb-5"
                  style={{ color: item.accent }}
                >
                  {item.number}
                </span>

                <h3 className="text-[17px] md:text-[19px] font-semibold text-white leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-[13px] md:text-[14px] text-white/50 leading-[1.75]">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL WIDTH IMAGE BREAK ──────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-10 md:px-14 lg:px-24">
        <div className="mx-auto max-w-[1380px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[300px] md:h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <img 
              src={serviceAi} 
              alt="Fintech interface wireframes" 
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Deep green/blue ambient overlay */}
            <div className="absolute inset-0 bg-[#020f18]/50 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010a10]/80 via-[#010a10]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/20 via-transparent to-sky-500/10 mix-blend-screen" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ── IMPACT TABLE ────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-20 md:px-14 lg:px-24">
        <div className="mx-auto max-w-[1380px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-14"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#34d399] font-semibold mb-4 block">
              Outcomes
            </span>
            <h2 className="font-serif text-[36px] sm:text-[50px] md:text-[62px] leading-[1.0] tracking-tight text-white">
              The Impact
            </h2>
          </motion.div>

          {/* Before / After table */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#020f18]/60 backdrop-blur-xl"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            {/* Table header */}
            <div className="px-8 py-5 border-b border-white/[0.06] bg-white/[0.015] flex items-center justify-between">
              <h3 className="font-serif text-[16px] text-white">Before vs. After</h3>
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/25">Verified Results · 2024</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.005]">
                    <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-white/30 font-semibold">Metric</th>
                    <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-white/30 font-semibold">Before</th>
                    <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-white/30 font-semibold text-right">After</th>
                  </tr>
                </thead>
                <tbody>
                  {IMPACT.map((row, idx) => {
                    const Icon = row.icon;
                    return (
                      <motion.tr
                        key={row.metric}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={`border-b border-white/[0.04] text-[14px] transition-colors duration-200 hover:bg-white/[0.025] ${idx % 2 === 1 ? "bg-white/[0.008]" : ""}`}
                      >
                        <td className="px-8 py-6 font-medium text-white/85">
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4 opacity-50" style={{ color: row.accent }} />
                            {row.metric}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-white/35 font-medium">{row.before}</td>
                        <td className="px-8 py-6 text-right font-bold text-[15px]" style={{ color: row.accent }}>
                          {row.after}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TAKEAWAY ──────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-20 md:px-14 lg:px-24 border-t border-white/[0.05]">
        <div className="mx-auto max-w-[1380px]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.07] p-12 md:p-20 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(2,15,24,0.85) 50%, rgba(14,165,233,0.07) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-16 left-1/4 h-52 w-52 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #10b981, transparent)", filter: "blur(70px)" }} />
            <div className="pointer-events-none absolute -bottom-16 right-1/4 h-52 w-52 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #0ea5e9, transparent)", filter: "blur(70px)" }} />

            <span className="text-[9px] uppercase tracking-[0.55em] text-[#34d399] font-semibold block mb-8">
              STELLR IT Takeaway
            </span>

            <blockquote className="font-serif text-[28px] sm:text-[36px] md:text-[46px] leading-[1.18] tracking-tight text-white max-w-4xl mx-auto">
              &ldquo;Every extra form field
              <br />
              <span className="text-white/40 italic">costs you customers.</span>
              <br />
              Remove friction,
              <br className="hidden md:block" />
              not features.&rdquo;
            </blockquote>

            {/* Divider */}
            <div className="mx-auto mt-12 h-px w-20 opacity-25"
              style={{ background: "linear-gradient(90deg, transparent, #10b981, transparent)" }} />
            <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-white/25">
              STELLR IT LLC — Case Study 002
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── NEXT CASE STUDY ───────────────────────────────────────────── */}
      <section className="relative z-10 px-6 py-16 md:px-14 lg:px-24 border-t border-white/[0.05]">
        <Link
          to="/case-studies/$slug"
          params={{ slug: "cybersecurity-zero-trust" }}
          className="group relative mx-auto block max-w-[1380px] overflow-hidden rounded-3xl border border-white/[0.07] hover:border-white/[0.16] transition-colors duration-500"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(2,15,24,0.9), rgba(14,165,233,0.04))" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14">
            <div>
              <div className="text-[9px] uppercase tracking-[0.45em] text-[#34d399] font-semibold mb-3">
                Next case study
              </div>
              <h3 className="font-serif text-[28px] md:text-[42px] leading-tight text-white">
                Cybersecurity: Zero Trust Network
              </h3>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-[#01141c] transition-all duration-300 group-hover:scale-110 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </section>

      <CtaBand
        title="Want results like these?"
        subtitle="Tell us about your project — a senior partner replies within one business day."
      />
      <Footer />
      <ChatWidget />
    </main>
  );
}
