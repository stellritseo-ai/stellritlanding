import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CLIENTS = ["CODA", "RATIO:", "BRIXTON", "HSBC", "LAB", "OCTOPUS MONEY", "PICNIQ", "WILDERNESS", "THREECOLTS", "BUCHERER"];

const SERVICES = [
  "UX/UI & Digital Products",
  "High-Performance Websites",
  "Brand Identity & Positioning",
  "Flexible Design Support",
];

const LINKS = ["Latest case studies", "Contact us"];

const HONORS = ["ALLIANCE", "BIMA", "NET", "AGENCY HACKERS"];

export default function Footer() {
  const topRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Shared ScrollTrigger config — matches Testimonials section exactly
      const revealFrom = { y: 60, opacity: 0, scale: 0.98 };
      const revealTo = {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
      } as const;
      const triggerConfig = {
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none none",
      } as const;

      // Top row reveal
      if (topRef.current) {
        gsap.fromTo(topRef.current.children, revealFrom, {
          ...revealTo,
          scrollTrigger: { trigger: topRef.current, ...triggerConfig },
        });
      }

      // Columns reveal
      if (columnsRef.current) {
        gsap.fromTo(columnsRef.current.children, revealFrom, {
          ...revealTo,
          scrollTrigger: { trigger: columnsRef.current, ...triggerConfig },
        });
      }

      // Bottom bar reveal
      if (bottomRef.current) {
        gsap.fromTo(bottomRef.current, revealFrom, {
          ...revealTo,
          scrollTrigger: { trigger: bottomRef.current, ...triggerConfig },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative z-10 bg-[#1a0533] text-white">
      {/* Marquee */}
      <div className="overflow-hidden border-y border-white/10 py-10">
        <div className="flex animate-[marquee_40s_linear_infinite] gap-16 whitespace-nowrap px-8">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <span
              key={i}
              className="font-serif text-2xl tracking-[0.2em] text-white/70 md:text-3xl"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 lg:px-20">
        {/* Top: brand + contact */}
        <div ref={topRef} className="flex flex-col gap-8 border-b border-white/10 pb-16 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-10">
            <span className="font-serif text-6xl font-normal tracking-tight md:text-7xl lg:text-8xl">
              StellR
            </span>
            <span className="max-w-md text-[15px] leading-[1.55] text-white/60">
              Exceptional design, seamless collaboration.
            </span>
          </div>
          <div className="flex flex-col items-start gap-2 text-[15px] leading-[1.55] md:items-end">
            <a href="mailto:hello@stellr.it" className="text-white/90 transition-colors hover:text-[#ff8a5b]">
              hello@stellr.it
            </a>
            <a href="tel:+4407738288101" className="text-white/70 transition-colors hover:text-white">
              +44 07738 288101
            </a>
          </div>
        </div>

        {/* Columns */}
        <div ref={columnsRef} className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <h4 className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
              Our Services
            </h4>
            <ul className="space-y-5">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="font-serif text-[22px] leading-[1.15] tracking-tight text-white/90 transition-colors hover:text-[#ff8a5b] md:text-[28px]"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
              Useful Links
            </h4>
            <ul className="space-y-5">
              {LINKS.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="font-serif text-[22px] leading-[1.15] tracking-tight text-white/90 transition-colors hover:text-[#ff8a5b] md:text-[28px]"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
              Honors
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {HONORS.map((h) => (
                <div
                  key={h}
                  className="flex aspect-square items-center justify-center border border-white/15 px-2 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:border-[#ff8a5b] hover:text-white"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}

        <div ref={bottomRef} className="flex flex-col items-start gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
          <span className="text-[14px] text-white/80">
            © {new Date().getFullYear()} StellR IT LLC. All Rights Reserved
          </span>
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="relative text-[15px] text-white/90 transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-[#ff8a5b]"
            >
              Careers
            </a>
            <nav className="flex items-center gap-6 text-white/85">
              <a href="#" aria-label="Behance" className="font-serif text-xl italic leading-none transition-colors hover:text-white">
                Bē
              </a>
              <a href="#" aria-label="YouTube" className="transition-colors hover:text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="transition-colors hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.3v7A10 10 0 0 0 22 12z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="transition-colors hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.1 0 4.9 2.7 4.9 6.2V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4z"/>
                </svg>
              </a>
              <a href="#" aria-label="X" className="transition-colors hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.01L4.5 22H1.24l8.02-9.17L1 2h7.02l4.84 6.39L18.244 2zm-1.2 18h1.86L7.05 4H5.07l11.974 16z"/>
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden px-4 pb-4">
        <div
          className="select-none whitespace-nowrap text-center font-sans font-black uppercase leading-[0.8] tracking-[-0.05em] bg-gradient-to-b from-white to-[#1a0533] bg-clip-text text-transparent"
          style={{ fontSize: "clamp(80px, 28vw, 480px)" }}
        >
          StellR IT
        </div>
      </div>



      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
