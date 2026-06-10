import { useEffect, useRef, useState } from "react";

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
    brandClass: "font-serif italic text-[28px]",
    span: "md:col-span-2",
  },
  {
    quote:
      "Transparent, responsive, and organized—ensuring success on time and within budget.",
    brand: "NCCER",
    brandClass: "font-bold tracking-wider text-[26px]",
  },
  {
    quote: "Isadora transformed our vision into an award-winning website.",
    brand: "logitech",
    brandClass: "text-[26px] lowercase tracking-tight",
  },
  {
    quote: "They delivered exactly what we wanted. Highly recommend.",
    brand: "✸ Razor",
    brandClass: "font-bold text-[26px]",
  },
];

export default function Testimonials() {
  const gridRef = useRef<HTMLDivElement>(null);

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
          stagger: 0.15,
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
    <section className="relative z-10 py-28 md:py-36">
      <div className="mx-auto max-w-[1240px] px-6">
        <h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-serif text-[32px] leading-[1.15] tracking-tight text-white md:text-[52px] lg:text-[60px]"
        >
          Leading brands turn to us at pivotal moments of digital evolution. Our
          global creative <Underlined>team</Underlined> fuses story,{" "}
          <Underlined>technology,</Underlined> and <Underlined>design</Underlined>{" "}
          to make experiences that captivate and <Underlined>convert.</Underlined>
        </h2>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-1 gap-y-14 gap-x-12 sm:grid-cols-2 md:mt-32 md:gap-y-20">
          {STATS.map((s, i) => (
            <div
              key={s.value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex items-start gap-6"
            >
              <span className="font-serif text-[72px] leading-none tracking-tight text-[#f5b59a] md:text-[88px]">
                {s.value}
              </span>
              <span className="mt-3 max-w-[200px] text-sm leading-snug text-white/80">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial grid */}
        <div
          ref={gridRef}
          className="mt-24 grid grid-cols-1 border-l border-t border-white/15 md:mt-32 md:grid-cols-6"
        >
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`group relative ${t.span ?? "md:col-span-2"}`}>
              <div className="relative flex h-full flex-col justify-between overflow-hidden border-b border-r border-white/15 p-8 transition-all duration-500 ease-out will-change-transform md:p-10 group-hover:-translate-y-1.5 group-hover:scale-[1.01] group-hover:border-[#ff8a5b]/30 group-hover:bg-white/[0.04] group-hover:shadow-[0_0_40px_-10px_rgba(255,138,91,0.12),0_20px_50px_-15px_rgba(0,0,0,0.4)]">
                {/* Shine sweep */}
                <div className="pointer-events-none absolute -left-full top-0 z-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-all duration-700 ease-in-out group-hover:left-full" />
                {/* Border glow overlay */}
                <span className="pointer-events-none absolute inset-0 z-0 border border-transparent transition-colors duration-500 group-hover:border-[#ff8a5b]/70" />

                <div className="relative z-10 flex flex-col justify-between">
                  <p className="text-[15px] leading-relaxed text-white/85 md:text-base">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-12 flex items-end justify-end">
                    {t.brandSub ? (
                      <div className="flex items-center gap-2 text-white">
                        <span className="grid h-9 w-9 place-items-center rounded-sm bg-white/10 text-[8px] font-bold leading-tight">
                          BLUE<br/>BOOK
                        </span>
                        <div className="leading-tight">
                          <div className="text-[10px] uppercase tracking-wider text-white/70">{t.brandSub}</div>
                          <div className="text-lg font-bold tracking-wide">{t.brand}</div>
                          <div className="text-[9px] uppercase tracking-wider text-white/60">The Trusted Resource</div>
                        </div>
                      </div>
                    ) : (
                      <span className={`text-white ${t.brandClass ?? "text-2xl"}`}>{t.brand}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Underlined({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <span className="absolute left-0 right-0 -bottom-1 h-px bg-white/90" />
    </span>
  );
}
