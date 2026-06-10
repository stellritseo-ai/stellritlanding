import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-20 md:px-12 md:pt-20 md:pb-28 lg:px-20">
      {/* Soft single orb */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-24 top-8 h-[360px] w-[360px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1400px]">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.4em] text-[#ff8a5b]"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-6 max-w-[1100px] font-serif text-[48px] font-normal leading-[1] tracking-tight text-white md:text-[72px] lg:text-[88px]"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-white/75"
          >
            {description}
          </motion.p>
        )}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}
