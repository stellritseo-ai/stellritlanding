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

// Word component removed for performance

export default function Welcome() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Hooks removed for performance

  const headline =
    "Bold ideas. Strategic execution. Lasting impact. We turn vision into reality—keeping our industry leading partners ahead of the curve.";
  const words = headline.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-transparent pt-32 pb-24 text-white md:pt-48 md:pb-32"
    >
      {/* Single composited background layer — one transform, no jitter */}
      <div
        aria-hidden
        style={{
          willChange: "transform",
          background: `
            radial-gradient(40% 35% at 12% 18%, rgba(255,170,140,0.55), transparent 70%),
            radial-gradient(45% 40% at 88% 88%, rgba(180,80,200,0.45), transparent 72%),
            radial-gradient(55% 45% at 50% 45%, rgba(255,200,170,0.40), transparent 70%)
          `,
          filter: "blur(60px)",
        }}
        className="pointer-events-none absolute -inset-[15%]"
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
        <div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-wrap items-center justify-center gap-6 md:mb-28 md:gap-12"
        >
          <Laurel>The Webby Awards</Laurel>
          <Laurel>awwwards.</Laurel>
          <Laurel>W3 Awards</Laurel>
        </div>

        {/* Scroll-revealed headline */}
        <div
          ref={textRef}
          className="font-serif text-[40px] leading-[1.2] tracking-tight md:text-[64px] lg:text-[80px]"
          style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
        >
          {words.map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block text-white">
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
