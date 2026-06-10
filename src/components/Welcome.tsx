import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
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
    <svg viewBox="0 0 60 100" className="h-16 w-10 scale-x-[-1] md:h-24 md:w-14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M50 5 Q20 30 25 95" />
      <path d="M45 18 Q30 22 28 32" />
      <path d="M40 32 Q25 36 23 46" />
      <path d="M36 46 Q21 50 22 60" />
      <path d="M33 60 Q20 64 23 74" />
      <path d="M30 74 Q18 78 24 88" />
    </svg>
  </div>
);

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [12, 0]);
  const blur = useTransform(progress, range, [6, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <span className="text-white/15">{children}</span>
      <motion.span
        style={{ opacity, y, filter }}
        className="absolute left-0 top-0 inline-block text-white"
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Smoothed scroll for background parallax (no jitter)
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(sectionProgress, {
    stiffness: 50,
    damping: 24,
    mass: 0.5,
  });

  // ONE continuous transform drives the entire background layer
  const bgY = useTransform(smooth, [0, 1], ["-12%", "12%"]);

  // Per-word reveal driven by scroll progress through the text block
  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "start 0.15"],
  });
  const smoothText = useSpring(textProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.5,
  });

  const headline =
    "Bold ideas. Strategic execution. Lasting impact. We turn vision into reality—keeping our industry leading partners ahead of the curve.";
  const words = headline.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden py-24 text-white md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #1a0640 0%, #4a1740 22%, #c97560 58%, #e88a72 100%)",
      }}
    >
      {/* Smooth animated background blobs */}
      <motion.div
        style={{ y: orb1Y, willChange: "transform" }}
        className="pointer-events-none absolute -left-32 top-0 h-[600px] w-[600px] rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(circle, rgba(255,170,140,0.55), transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: orb2Y, willChange: "transform" }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[700px] w-[700px] rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(circle, rgba(180,80,200,0.45), transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </motion.div>
      <motion.div
        style={{ y: orb3Y, x: bgShift, willChange: "transform" }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
      >
        <div
          className="h-full w-full"
          style={{
            background: "radial-gradient(circle, rgba(255,200,170,0.4), transparent 60%)",
            filter: "blur(120px)",
          }}
        />
      </motion.div>

      {/* Soft grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-wrap items-center justify-center gap-6 md:mb-28 md:gap-12"
        >
          <Laurel>The Webby Awards</Laurel>
          <Laurel>awwwards.</Laurel>
          <Laurel>W3 Awards</Laurel>
        </motion.div>

        {/* Scroll-revealed headline */}
        <div
          ref={textRef}
          className="font-serif text-[40px] leading-[1.2] tracking-tight md:text-[64px] lg:text-[80px]"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
        >
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={smoothText} range={[start, end]}>
                {w}
              </Word>
            );
          })}
        </div>
      </div>
    </section>
  );
}
