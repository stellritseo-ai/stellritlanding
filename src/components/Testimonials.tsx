import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "230+", label: "Enterprise brands that have partnered with us" },
  { value: "$95B", label: "Business sales we have been trusted with" },
  { value: "92%", label: "Partner retention rate over seven years" },
  { value: "62%", label: "Average boost in conversion rate" },
];

const TESTIMONIALS = [
  {
    quote:
      "Isadora Agency brings empathy to human-computer interaction, setting them apart from other providers.",
    brand: "KBB.COM",
    brandSub: "Kelley Blue Book",
    span: "md:col-span-2",
  },
  {
    quote:
      "Extraordinarily grateful for Isadora's dedication in propelling our brand forward.",
    brand: "Popcornopolis",
    brandClass: "font-serif italic text-[28px] text-white/90",
    span: "md:col-span-2",
  },
  {
    quote:
      "Transparent, responsive, and organized—ensuring success on time and within budget.",
    brand: "NCCER",
    brandClass: "font-bold tracking-wider text-[24px] text-white/90",
  },
  {
    quote: "Isadora transformed our vision into an award-winning website.",
    brand: "logitech",
    brandClass: "text-[24px] lowercase tracking-tight font-medium text-white/80",
  },
  {
    quote: "They delivered exactly what we wanted. Highly recommend.",
    brand: "✸ Razor",
    brandClass: "font-bold text-[24px] text-white/90",
  },
];

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const heading = headingRef.current;
    if (!grid) return;

    const cards = gsap.utils.toArray<HTMLElement>(grid.children);

    const ctx = gsap.context(() => {
      if (heading) {
        gsap.fromTo(
          heading,
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

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
          ref={headingRef}
          className="font-serif text-[22px] leading-[1.2] tracking-tight text-white/95 max-w-5xl sm:text-[28px] md:text-[38px] lg:text-[50px] opacity-0"
        >
          Leading brands turn to us at pivotal moments of digital evolution. Our
          global creative <Highlight>team</Highlight> fuses story,{" "}
          <Highlight>technology,</Highlight> and <Highlight>design</Highlight>{" "}
          to make experiences that captivate and <Highlight>convert.</Highlight>
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
          <p className="text-[15px] md:text-[16px] leading-[1.65] text-white/75 font-medium transition-colors duration-500 group-hover:text-white/95">
            &ldquo;{t.quote}&rdquo;
          </p>
        </div>

        {/* Citation details */}
        <div className="relative z-10 mt-10 flex items-center justify-end transition-transform duration-500 group-hover:-translate-y-0.5">
          {t.brandSub ? (
            <div className="flex items-center gap-3 text-white">
              <span className="grid h-9 w-9 place-items-center rounded bg-white/[0.06] border border-white/[0.08] text-[8px] font-bold leading-none tracking-tighter transition-colors duration-300 group-hover:border-white/20">
                BLUE<br/>BOOK
              </span>
              <div className="leading-none">
                <div className="text-[9px] uppercase tracking-widest text-[#ff8a5b] font-semibold">{t.brandSub}</div>
                <div className="text-base font-bold tracking-wide mt-1">{t.brand}</div>
              </div>
            </div>
          ) : (
            <span className={`${t.brandClass ?? "text-xl font-bold tracking-wide text-white/80"} transition-all duration-300 group-hover:text-white`}>
              {t.brand}
            </span>
          )}
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
