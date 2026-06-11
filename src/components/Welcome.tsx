import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import aw1Img from "@/assets/aw1.png";
import aw2Img from "@/assets/aw2.png";
import aw3Img from "@/assets/aw3.png";


const Laurel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1 md:gap-5">
    <svg viewBox="0 0 60 100" className="h-10 w-5 sm:h-14 sm:w-8 md:h-24 md:w-14 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M50 5 Q20 30 25 95" />
      <path d="M45 18 Q30 22 28 32" />
      <path d="M40 32 Q25 36 23 46" />
      <path d="M36 46 Q21 50 22 60" />
      <path d="M33 60 Q20 64 23 74" />
      <path d="M30 74 Q18 78 24 88" />
    </svg>
    <div className="w-[75px] sm:w-[90px] md:min-w-[110px] text-center flex-shrink-0">
      {children}
    </div>
    <svg viewBox="0 0 60 100" className="h-10 w-5 sm:h-14 sm:w-8 scale-x-[-1] md:h-24 md:w-14 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <span className="text-white/15">{children}</span>
      <motion.span
        style={{ opacity, willChange: "opacity" }}
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

  // Per-word reveal driven by scroll progress through the text block
  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 0.85", "start 0.15"],
  });
  const smoothText = useSpring(textProgress, {
    stiffness: 80,
    damping: 28,
    mass: 0.4,
  });

  const headline =
    "Bold ideas. Strategic execution. Lasting impact. We turn vision into reality—keeping our industry leading partners ahead of the curve.";
  const words = headline.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-transparent py-[60px] text-white"
    >
      {/* Static background — no scroll-linked blur to keep things smooth */}
      <div
        aria-hidden
        style={{
          background: `
            radial-gradient(40% 35% at 12% 18%, rgba(255,170,140,0.45), transparent 70%),
            radial-gradient(45% 40% at 88% 88%, rgba(180,80,200,0.35), transparent 72%),
            radial-gradient(55% 45% at 50% 45%, rgba(255,200,170,0.30), transparent 70%)
          `,
        }}
        className="pointer-events-none absolute -inset-[10%]"
      />

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
          className="mb-20 flex flex-nowrap md:flex-wrap items-center justify-between sm:justify-center md:justify-center gap-0.5 sm:gap-6 md:mb-28 md:gap-12 w-full"
        >
          <Laurel><img src={aw1Img} alt="Award 1" className="h-7 sm:h-12 md:h-14 mx-auto w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} /></Laurel>
          <Laurel><img src={aw2Img} alt="Award 2" className="h-7 sm:h-12 md:h-14 mx-auto w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} /></Laurel>
          <Laurel><img src={aw3Img} alt="Award 3" className="h-7 sm:h-12 md:h-14 mx-auto w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} /></Laurel>
        </motion.div>

        {/* Scroll-revealed headline */}
        <div
          ref={textRef}
          className="font-serif text-[28px] leading-[1.2] tracking-tight md:text-[52px] lg:text-[70px] xl:text-[80px]"
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
