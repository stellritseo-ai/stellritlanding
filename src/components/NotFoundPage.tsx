import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Compass } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";
import ChatWidget from "@/components/ChatWidget";

const SUGGESTED = [
  { label: "Our work", to: "/case-studies", desc: "Selected case studies from the studio." },
  { label: "Services", to: "/services", desc: "What we build, brand, and ship." },
  { label: "About", to: "/about", desc: "The team and the thinking behind StellR." },
  { label: "Contact", to: "/contact", desc: "Start a project — reply within a day." },
] as const;

export default function NotFoundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ScrollBackground />
      <SiteHeader transparent />

      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,138,91,0.35), rgba(201,164,255,0.12) 55%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,164,255,0.35), transparent 70%)",
        }}
      />

      <section className="relative z-10 px-6 pt-24 pb-20 md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 md:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-[11px] uppercase tracking-[0.35em] text-white/65 backdrop-blur">
              <Compass className="h-3 w-3 text-[#ff8a5b]" />
              Error 404
            </div>

            <h1 className="text-glow mt-8 font-serif text-[96px] font-normal leading-[0.92] tracking-tight text-white md:text-[160px] lg:text-[200px]">
              Lost in
              <span className="block italic text-[#ff8a5b]">orbit.</span>
            </h1>

            <p className="mt-8 max-w-xl text-[18px] leading-[1.55] text-white/80">
              The page you're looking for has drifted out of frame. It might have been
              moved, renamed, or never existed — but you're one click from getting back on
              course.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[13px] font-medium uppercase tracking-[0.18em] text-[#2a0860] transition hover:scale-[1.02]"
              >
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                Back to home
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-[13px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.06]"
              >
                Talk to us
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
            }}
            className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
          >
            <li className="px-6 py-5 text-[11px] uppercase tracking-[0.35em] text-white/45">
              Try one of these
            </li>
            {SUGGESTED.map((item) => (
              <motion.li
                key={item.to}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Link
                  to={item.to}
                  className="group flex items-center justify-between gap-6 px-6 py-5 transition hover:bg-white/[0.04]"
                >
                  <div>
                    <div className="font-serif text-[22px] leading-none text-white md:text-[26px]">
                      {item.label}
                    </div>
                    <div className="mt-2 text-[13px] text-white/55">{item.desc}</div>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white transition group-hover:border-white/40 group-hover:bg-white group-hover:text-[#2a0860]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </main>
  );
}
