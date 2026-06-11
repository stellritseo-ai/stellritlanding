import { useRef, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import logo1 from "@/assets/logos/logo-BX_kYZ7l.png";
import logo2 from "@/assets/logos/logo-BqMKyS9S.png";
import logo3 from "@/assets/logos/logo-BwGEonYb.png";
import logo4 from "@/assets/logos/logo-DdbW9O7g.png";
import logo5 from "@/assets/logos/logo-I6fgEckf.png";

const STATS = [
  { value: "4.9", label: "Average rating on Google Reviews" },
  { value: "50+", label: "Verified 5-star client testimonials" },
  { value: "100%", label: "Commitment to client satisfaction" },
  { value: "24/7", label: "Dedicated technical support" },
];

const TESTIMONIALS = [
  {
    quote: "Stellr IT completely transformed our digital presence. Their team is incredibly responsive and delivered beyond our expectations.",
    brand: "Sarah Jenkins",
    logo: logo1,
    span: "md:col-span-2",
  },
  {
    quote: "Exceptional service and deep technical expertise. They streamlined our entire workflow seamlessly.",
    brand: "Michael Chen",
    logo: logo2,
    span: "md:col-span-2",
  },
  {
    quote: "The best IT consulting firm we've worked with. Transparent, fast, and highly skilled.",
    brand: "David R.",
    logo: logo3,
  },
  {
    quote: "They took our vision and built a stunning, high-converting platform. Highly recommend Stellr IT!",
    brand: "Amanda P.",
    logo: logo4,
  },
  {
    quote: "Professional, innovative, and reliable. A fantastic partner for any digital transformation project.",
    brand: "James L.",
    logo: logo5,
  },
];

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

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

  const headline = "Leading brands turn to us at pivotal moments of digital evolution. Our global creative team fuses story, technology, and design to make experiences that captivate and convert.";
  const words = headline.split(" ");
  const highlightWords = ["team", "technology,", "design", "convert."];

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = gsap.utils.toArray<HTMLElement>(grid.children);

    const ctx = gsap.context(() => {

      gsap.fromTo(
        cards,
        {
          y: 60,
          opacity: 0,
          scale: 0.98,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            end: "top 30%",
            toggleActions: "play none none none",
          },
        }
      );
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 py-12 md:py-[70px] overflow-hidden">
      {/* Dynamic Background Glows */}
      <div
        className="pointer-events-none absolute -right-60 top-1/3 h-[600px] w-[600px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(255,138,91,0.1), transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-60 bottom-1/3 h-[500px] w-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="mx-auto max-w-[1300px] px-6">

        {/* Dynamic Editorial Heading */}
        <h2
          ref={textRef}
          className="font-serif text-[22px] leading-[1.2] tracking-tight max-w-5xl sm:text-[28px] md:text-[38px] lg:text-[50px]"
        >
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            const isHighlight = highlightWords.includes(w);
            return (
              <Word key={i} progress={smoothText} range={[start, end]} isHighlight={isHighlight}>
                {w}
              </Word>
            );
          })}
        </h2>

        {/* Stats Dashboard Grid */}
        <div className="mt-[40px] grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-white/[0.08] pt-12 md:pt-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col relative group"
            >
              <div
                className="absolute top-0 left-0 w-8 h-px transition-all duration-300 group-hover:w-16"
                style={{ background: "linear-gradient(90deg, #ff8a5b, #a855f7)" }}
              />
              <span className="font-serif text-[36px] md:text-[56px] lg:text-[64px] font-medium leading-none tracking-tight text-white mt-4 transition-colors duration-300 group-hover:text-[#ff8a5b]">
                {s.value}
              </span>
              <span className="mt-3 text-[12px] uppercase tracking-[0.15em] leading-relaxed text-white/40 font-semibold max-w-[220px]">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Structural Grid Testimonial Board */}
        <div
          ref={gridRef}
          className="mt-[55px] grid grid-cols-1 border-l border-t border-white/[0.08] md:grid-cols-6"
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative ${t.span ?? "md:col-span-2"} overflow-hidden border-b border-r border-white/[0.08]`}
    >
      <div className="relative flex h-full flex-col justify-between p-8 md:p-10 min-h-[280px] md:min-h-[320px] transition-all duration-500 ease-out bg-[#070314]/20 group-hover:bg-[#0c0721]/30">

        {/* Spotlight dynamic follow overlay */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full opacity-0 transition-opacity duration-500 ease-out blur-[40px] group-hover:opacity-100"
          style={{
            left: "var(--mouse-x, 0px)",
            top: "var(--mouse-y, 0px)",
            background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(255,138,91,0.05) 50%, transparent 100%)",
          }}
        />

        {/* Shine sweep */}
        <div className="pointer-events-none absolute -left-full top-0 z-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-all duration-1000 ease-in-out group-hover:left-full" />

        {/* Background quote mark watermark */}
        <span className="pointer-events-none absolute -top-4 -left-2 font-serif text-[130px] leading-none select-none text-white/[0.02] transition-all duration-500 group-hover:text-white/[0.04] group-hover:scale-105 group-hover:translate-x-1">
          &ldquo;
        </span>

        {/* Quote details */}
        <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
          {/* 5 Stars */}
          <div className="flex gap-1.5 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 text-yellow-500 fill-current drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-[15px] md:text-[16px] leading-[1.65] text-white/75 font-medium transition-colors duration-500 group-hover:text-white/95">
            "{t.quote}"
          </p>
        </div>

        {/* Citation details */}
        <div className="relative z-10 mt-10 flex items-center justify-between transition-transform duration-500 group-hover:-translate-y-0.5 border-t border-white/5 pt-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#a855f7] to-[#ff8a5b] flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {t.brand.charAt(0)}
            </div>
            <span className="text-[15px] font-bold tracking-wide text-white/90">
              {t.brand}
            </span>
          </div>

          {/* Client Logo Indicator */}
          <div className="flex items-center justify-center">
            <img src={t.logo} alt={`${t.brand} logo`} className="h-8 md:h-10 max-w-[100px] object-contain brightness-0 invert opacity-60 transition-all duration-500 group-hover:opacity-100" />
          </div>
        </div>

      </div>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="relative inline-block italic font-serif font-normal text-transparent bg-clip-text"
      style={{
        background: "linear-gradient(135deg, #ff8a5b 0%, #c084fc 50%, #a855f7 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}
    >
      {children}
    </span>
  );
}

function Word({
  children,
  progress,
  range,
  isHighlight
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  isHighlight?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <span className="text-white/15">{children}</span>
      <motion.span
        className={`absolute left-0 top-0 inline-block ${isHighlight ? "italic font-serif font-normal" : "text-white"}`}
        style={{
          opacity,
          willChange: "opacity",
          ...(isHighlight ? {
            background: "linear-gradient(135deg, #ff8a5b 0%, #c084fc 50%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          } : {})
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
