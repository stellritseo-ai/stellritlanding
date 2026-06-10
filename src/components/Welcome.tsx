import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Laurel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 md:gap-5">
    <svg viewBox="0 0 60 100" className="h-16 w-10 md:h-24 md:w-14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M50 5 Q20 30 25 95" />
      <path d="M45 18 Q30 22 28 32" />
      <path d="M40 32 Q25 36 23 46" />
      <path d="M36 46 Q21 50 22 60" />
      <path d="M33 60 Q20 64 23 74" />
      <path d="M30 74 Q18 78 24 88" />
    </svg>
    <div className="min-w-[80px] text-center text-xs font-semibold uppercase tracking-wider md:min-w-[110px] md:text-sm">
      {children}
    </div>
    <svg viewBox="0 0 60 100" className="h-16 w-10 md:h-24 md:w-14 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M50 5 Q20 30 25 95" />
      <path d="M45 18 Q30 22 28 32" />
      <path d="M40 32 Q25 36 23 46" />
      <path d="M36 46 Q21 50 22 60" />
      <path d="M33 60 Q20 64 23 74" />
      <path d="M30 74 Q18 78 24 88" />
    </svg>
  </div>
);

export default function Welcome() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth background gradient shift on scroll (deep purple → coral)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const orb1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Word-by-word reveal
  const headline =
    "Bold ideas. Strategic execution. Lasting impact. We turn vision into reality—keeping our industry leading partners ahead of the curve.";
  const words = headline.split(" ");

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden py-24 text-white md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #1a0640 0%, #4a1740 20%, #c97560 55%, #e88a72 100%)",
      }}
    >
      {/* Smooth animated background blobs */}
      <motion.div
        style={{ y: orb1 }}
        className="pointer-events-none absolute -left-32 top-0 h-[600px] w-[600px] rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(circle, rgba(255,170,140,0.5), transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: orb2 }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[700px] w-[700px] rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(circle, rgba(180,80,200,0.45), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(circle, rgba(255,200,170,0.35), transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </motion.div>

      {/* Grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-wrap items-center justify-center gap-6 md:mb-28 md:gap-12"
        >
          <Laurel>The Webby Awards</Laurel>
          <Laurel>awwwards.</Laurel>
          <Laurel>W3 Awards</Laurel>
        </motion.div>

        {/* Headline */}
        <h2
          className="font-serif text-[40px] leading-[1.15] tracking-tight md:text-[64px] lg:text-[84px]"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
        >
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block pr-[0.25em]"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
