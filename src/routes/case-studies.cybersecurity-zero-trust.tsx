import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, ArrowUpRight, ShieldCheck, TrendingDown, Clock, FileCheck, ShieldAlert, Zap } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CtaBand from "@/components/CtaBand";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

// Fallback local images to prevent build crashes
import serviceAi from "@/assets/service-ai.png";
import serviceGrowth from "@/assets/service-growth.jpg";

export const Route = createFileRoute("/case-studies/cybersecurity-zero-trust")({
  head: () => ({
    meta: [
      { title: "Cybersecurity – Zero Trust | StellR IT LLC" },
      {
        name: "description",
        content:
          "How STELLR IT deployed a Zero Trust security framework for Meridian Trust Bank, reducing unauthorized access by 99% and achieving full SOC 2 Type II compliance.",
      },
      { property: "og:title", content: "Cybersecurity – Zero Trust | StellR IT LLC" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "/case-studies/cybersecurity-zero-trust" }],
  }),
  component: CyberSecurityPage,
});

/* ── Approach steps ──────────────────────────────────────────────────── */
const APPROACH = [
  {
    number: "01",
    title: "Zero Trust Network Access (ZTNA)",
    body: "Replaced legacy VPN. Verified every access request continuously across user identity, device posture, and geographic location.",
    accent: "#06b6d4", // Cyan
  },
  {
    number: "02",
    title: "Mandatory Multi-Factor Authentication",
    body: "Enforced strict MFA for all 520 employees and third-party vendors, utilizing hardware security tokens with biometric fallbacks.",
    accent: "#3b82f6", // Blue
  },
  {
    number: "03",
    title: "Unified Incident Response Plan",
    body: "Created 4 dedicated playbooks (phishing, ransomware, credential theft, insider threat). Automated alert-to-remediation via tight SIEM integration.",
    accent: "#0ea5e9", // Sky Blue
  },
  {
    number: "04",
    title: "Ongoing Phishing Simulations",
    body: "Launched monthly simulated attacks coupled with real-time, mandatory training modules for low-scoring employees to build human firewalls.",
    accent: "#2dd4bf", // Teal
  },
];

/* ── Impact table ────────────────────────────────────────────────────── */
const IMPACT = [
  { metric: "Successful unauthorized access attempts", before: "~35/month", after: "0–1/month (99% reduction)", icon: ShieldCheck, accent: "#06b6d4" },
  { metric: "Phishing click rate", before: "18%", after: "2% in 90 days", icon: TrendingDown, accent: "#0ea5e9" },
  { metric: "IT team time on incident response", before: "20 hours/week", after: "2 hours/week", icon: Clock, accent: "#2dd4bf" },
  { metric: "Regulatory compliance", before: "At risk", after: "SOC 2 Type II + FFIEC achieved", icon: FileCheck, accent: "#3b82f6" },
];

/* ── Bottom Line Table ───────────────────────────────────────────────── */
const BOTTOM_LINE = [
  { case: "Impressions → Clicks", metric: "CTR ↑ 292%", roi: "62% lower CPC" },
  { case: "UX/UI for Conversions", metric: "Signups ↑ 3.4x", roi: "+$1.2M AUM" },
  { case: "Cybersecurity", metric: "Unauthorized access ↓ 99%", roi: "Full compliance + 90% less IT firefighting" },
];

/* ── Page ────────────────────────────────────────────────────────────── */
function CyberSecurityPage() {
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
        {/* Cybersecurity Theme: Deep space blue with Cyan/Neon Azure glows */}
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none bg-[#030b1c]"
          style={{ maskImage: "linear-gradient(to bottom, black 85%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 85%, transparent 100%)" }}
        >
          <svg
            className="absolute inset-0 h-full w-full object-cover"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              <linearGradient id="grad-br" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              
              <radialGradient id="grad-tr-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#082f49" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#030b1c" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="grad-bl-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#030b1c" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="grad-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="35%" stopColor="#06b6d4" />
                <stop offset="65%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

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

            <motion.circle 
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              cx="300" cy="180" r="140" fill="url(#grad-tl)" 
            />

            <motion.circle 
              animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              cx="1350" cy="950" r="250" fill="url(#grad-br)" 
            />

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
                style={{ textShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(6,182,212,0.35)" }}
              >
                Cybersecurity <br />
                <em className="font-normal italic text-[#cffafe] pr-4">Zero Trust</em> <br />
                Architecture.
              </h1>

              {/* Accent text */}
              <div className="flex gap-6 max-w-[420px] xl:pb-4 relative">
                <div className="relative mt-1.5 shrink-0">
                  <ShieldCheck className="relative z-10 h-7 w-7 text-[#06b6d4]" strokeWidth={1.5} />
                  <div className="absolute inset-0 rounded-full bg-[#06b6d4]/40 blur-md" />
                </div>
                <p className="text-[17px] md:text-[19px] leading-[1.6] text-white/70 font-light tracking-wide">
                  How we achieved zero regulatory findings and a <strong className="font-medium text-white">99% reduction</strong> in unauthorized access for Meridian Trust Bank.
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
            className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#030b1c]/70 backdrop-blur-2xl p-10 md:p-16"
            style={{ boxShadow: "0 40px 120px -20px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
            {/* Gradient top bar */}
            <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg, #06b6d4, #3b82f6 60%, transparent)" }} />

            {/* BG glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #06b6d4, transparent)", filter: "blur(60px)" }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-[#06b6d4] font-semibold mb-6 block">
                  The Challenge
                </span>

                <h2 className="font-serif text-[28px] sm:text-[38px] md:text-[50px] leading-[1.1] tracking-tight text-white max-w-2xl">
                  12+ phishing incidents a week.
                  <br />
                  <span className="text-[#06b6d4]">Zero unified response.</span>
                  <br />
                  <span className="text-white/40 italic font-normal">Compliance at risk.</span>
                </h2>

                <p className="mt-9 max-w-xl text-[15px] md:text-[17px] leading-[1.75] text-white/55">
                  Meridian Trust Bank possessed a dedicated IT team, but they were spending 20 hours every week manually hunting threats and firefighting breaches. With a mid-sized footprint of 8 branches and 45,000 customers, their legacy VPN and lack of an incident playbook put their SOC 2 and FFIEC compliance audit in severe jeopardy.
                </p>
              </div>

              {/* Related Image (Placeholder using local asset) */}
              <div className="relative h-[300px] lg:h-full lg:min-h-[400px] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl group">
                <img 
                  src={serviceAi} 
                  alt="Cybersecurity and threat analytics" 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#030b1c]/80 via-cyan-900/30 to-transparent" />
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
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#06b6d4] font-semibold mb-4 block">
              Our Approach
            </span>
            <h2 className="font-serif text-[36px] sm:text-[50px] md:text-[62px] leading-[1.0] tracking-tight text-white max-w-3xl">
              Complete Security Framework
            </h2>
            <p className="mt-5 text-[15px] md:text-[17px] text-white/45 max-w-2xl leading-[1.75]">
              We stripped out their porous legacy infrastructure and replaced it with a rigorous, modern Zero Trust architecture, neutralizing threats before they reached the network.
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
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#030b1c]/50 backdrop-blur-xl p-8 hover:border-white/[0.13] transition-all duration-500`}
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
              src={serviceGrowth} 
              alt="Cybersecurity infrastructure" 
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Deep cyan/blue ambient overlay */}
            <div className="absolute inset-0 bg-[#030b1c]/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020613]/90 via-[#020613]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/20 via-transparent to-blue-500/10 mix-blend-screen" />
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
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#06b6d4] font-semibold mb-4 block">
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
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030b1c]/60 backdrop-blur-xl"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)" }}
          >
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
              background: "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(3,11,28,0.85) 50%, rgba(59,130,246,0.07) 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 40px 100px rgba(0,0,0,0.6)",
            }}
          >
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-16 left-1/4 h-52 w-52 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, #06b6d4, transparent)", filter: "blur(70px)" }} />
            <div className="pointer-events-none absolute -bottom-16 right-1/4 h-52 w-52 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #3b82f6, transparent)", filter: "blur(70px)" }} />

            <span className="text-[9px] uppercase tracking-[0.55em] text-[#06b6d4] font-semibold block mb-8">
              STELLR IT Takeaway
            </span>

            <blockquote className="font-serif text-[28px] sm:text-[36px] md:text-[46px] leading-[1.18] tracking-tight text-white max-w-4xl mx-auto">
              &ldquo;Trust is a vulnerability.
              <br />
              <span className="text-white/40 italic">Zero Trust is a strategy.</span>&rdquo;
            </blockquote>

            {/* Divider */}
            <div className="mx-auto mt-12 h-px w-20 opacity-25"
              style={{ background: "linear-gradient(90deg, transparent, #06b6d4, transparent)" }} />
            <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-white/25">
              STELLR IT LLC — Case Study 003
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── THE BOTTOM LINE (ALL CASE STUDIES SUMMARY) ────────────────── */}
      <section className="relative z-10 px-6 py-20 md:px-14 lg:px-24 border-t border-white/[0.05]">
        <div className="mx-auto max-w-[1380px]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="mb-14 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] mb-6">
              <Zap className="h-3 w-3 text-[#f59e0b]" />
              <span className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">
                Portfolio Overview
              </span>
            </div>
            <h2 className="font-serif text-[32px] sm:text-[42px] leading-[1.0] tracking-tight text-white">
              The Bottom Line
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c061d]/80 backdrop-blur-xl"
            style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Case Study</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Core Metric</th>
                    <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-white/40 font-semibold text-right">ROI Highlight</th>
                  </tr>
                </thead>
                <tbody>
                  {BOTTOM_LINE.map((row, idx) => (
                    <motion.tr
                      key={row.case}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.025] transition-colors duration-200"
                    >
                      <td className="px-8 py-7 font-serif text-[18px] text-white/90">
                        {row.case}
                      </td>
                      <td className="px-8 py-7">
                        <span className="inline-flex items-center px-2.5 py-1 rounded border border-white/10 bg-white/5 text-[13px] font-medium text-white/80">
                          {row.metric}
                        </span>
                      </td>
                      <td className="px-8 py-7 text-right font-medium text-[15px] text-[#2dd4bf]">
                        {row.roi}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      <CtaBand
        title="Secure your digital assets."
        subtitle="Talk to a security architect about your Zero Trust strategy today."
      />
      <Footer />
      <ChatWidget />
    </main>
  );
}
