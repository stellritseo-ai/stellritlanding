import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CtaBand({
  title = "Let's build something unforgettable.",
  subtitle = "Tell us about your project. We'll get back within one business day.",
  className = "py-24",
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section className={`relative z-10 px-6 md:px-12 lg:px-20 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl border border-white/10 px-8 py-16 md:px-16 md:py-24"
        style={{
          background:
            "radial-gradient(120% 100% at 0% 0%, rgba(168,85,247,0.35), transparent 60%), radial-gradient(120% 100% at 100% 100%, rgba(255,138,91,0.25), transparent 55%), rgba(255,255,255,0.03)",
        }}
      >
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-serif text-[44px] leading-[1.02] tracking-tight text-white md:text-[64px]">
              {title}
            </h2>
            <p className="mt-5 text-[16px] text-white/70 md:text-[17px]">{subtitle}</p>
          </div>
          <Link
            to="/contact"
            className="group flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[15px] font-semibold text-[#2a0860] shadow-[0_20px_60px_-20px_rgba(168,85,247,0.7)] transition hover:bg-white/90"
          >
            Start a project
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
