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
    <section className="relative overflow-hidden px-6 pt-16 pb-24 md:px-12 md:pt-24 md:pb-32 lg:px-20">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-32 top-10 h-[460px] w-[460px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.32), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute right-0 top-32 h-[520px] w-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,138,91,0.18), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1400px]">
        <span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.4em] text-[#ff8a5b]"
        >
          {eyebrow}
        </span>
        <h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.2, 0.7, 0.2, 1] }}
          className="text-glow mt-6 max-w-[1100px] font-serif text-[56px] font-normal leading-[0.98] tracking-tight text-white md:text-[88px] lg:text-[110px]"
        >
          {title}
        </h1>
        {description && (
          <p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 max-w-2xl text-[17px] leading-[1.6] text-white/75"
          >
            {description}
          </p>
        )}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}
