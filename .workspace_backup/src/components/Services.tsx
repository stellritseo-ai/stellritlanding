import { useRef, useState, MouseEvent } from "react";
import brandImg from "@/assets/service-brand.jpg";
import productImg from "@/assets/service-product.jpg";
import growthImg from "@/assets/service-growth.jpg";

const SERVICES = [
  { title: "Brand Building", tags: ["Visual Identity", "Video", "Content Strategy"], image: brandImg },
  { title: "Product Development", tags: ["Web Design", "Design Systems", "eCommerce"], image: productImg },
  { title: "Growth Marketing", tags: ["Paid Media", "CRO", "Analytics", "SEM Strategy"], image: growthImg },
];

const Sparkle = ({ spin }: { spin: boolean }) => (
  <svg
    viewBox="0 0 40 40"
    className="h-7 w-7 md:h-8 md:w-8 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
    style={{ transform: spin ? "rotate(180deg) scale(1.18)" : "rotate(0deg) scale(1)" }}
  >
    <g fill="#ff8a5b">
      <path d="M20 0 L22 17 L40 20 L22 23 L20 40 L18 23 L0 20 L18 17 Z" />
      <path d="M20 6 L21 18 L33 20 L21 22 L20 34 L19 22 L7 20 L19 18 Z" opacity="0.85" />
    </g>
  </svg>
);

function ServiceRow({
  service,
  isActive,
  onHover,
}: {
  service: typeof SERVICES[number];
  isActive: boolean;
  onHover: () => void;
}) {
  // Hooks removed

  return (
    <div
      onMouseEnter={onHover}
      className="group relative cursor-pointer border-b border-white/15 py-10 md:py-14"
    >
      <div className="flex items-start gap-5">
        <div className="mt-2 md:mt-4">
          <Sparkle spin={isActive} />
        </div>
        <div>
          <h3
            className={`font-serif text-[55px] leading-[0.95] tracking-tight transition-colors duration-500 ${isActive ? "text-[#ffffff]" : "text-white/90"}`}
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontWeight: 400 }}
          >
            {service.title}
          </h3>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90 md:text-base">
            {service.tags.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                <span>{t}</span>
                {i < service.tags.length - 1 && <span className="text-white/50">—</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [active, setActive] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  // Hooks removed

  return (
    <section className="relative py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[1.2fr_460px] md:gap-16 md:px-12">
        {/* Left: services */}
        <div className="flex flex-col">
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.title} service={s} isActive={active === i} onHover={() => setActive(i)} />
          ))}
          {/* Final gradient rule */}
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #a855f7 30%, #e879f9 60%, #ff8a5b 100%)",
            }}
          />
        </div>

        {/* Right: image stage */}
        <div
          ref={stageRef}
          className="relative mx-auto hidden h-[560px] w-[400px] md:block lg:h-[640px] lg:w-[460px]"
          style={{ perspective: 1200 }}
        >
          <div
            className="relative h-full w-full"
          >
            
              <div
                key={SERVICES[active].image}
                initial={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 overflow-hidden rounded-[2px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)]"
              >
                <img
                  src={SERVICES[active].image}
                  alt={SERVICES[active].title}
                  width={800}
                  height={1024}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
