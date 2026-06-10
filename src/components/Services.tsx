import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import brandImg from "@/assets/service-brand.jpg";
import productImg from "@/assets/service-product.jpg";
import growthImg from "@/assets/service-growth.jpg";

const SERVICES = [
  {
    title: "Brand Building",
    tags: ["Visual Identity", "Video", "Content Strategy"],
    image: brandImg,
  },
  {
    title: "Product Development",
    tags: ["Web Design", "Design Systems", "eCommerce"],
    image: productImg,
  },
  {
    title: "Growth Marketing",
    tags: ["Paid Media", "CRO", "Analytics", "SEM Strategy"],
    image: growthImg,
  },
];

const Sparkle = () => (
  <svg viewBox="0 0 32 32" className="h-7 w-7 text-[#ff8a5b]" fill="currentColor">
    <path d="M16 0 L18 12 L30 14 L18 18 L16 32 L14 18 L2 14 L14 12 Z" opacity="0.9" />
    <path d="M16 4 L17 13 L26 14 L17 16 L16 28 L15 16 L6 14 L15 13 Z" />
  </svg>
);

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-24 text-white md:py-32" style={{ background: "#2a0a5e" }}>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1fr_auto] md:gap-20 md:px-12">
        {/* Left: services list */}
        <div className="flex flex-col">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              onMouseEnter={() => setActive(i)}
              className="group cursor-pointer border-b border-white/15 py-10 transition-colors hover:border-[#a855f7]/60 md:py-14"
            >
              <div className="flex items-start gap-5">
                <motion.div
                  animate={{ rotate: active === i ? 180 : 0, scale: active === i ? 1.15 : 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Sparkle />
                </motion.div>
                <div>
                  <h3
                    className="font-serif text-4xl leading-none transition-colors md:text-6xl lg:text-7xl"
                    style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
                  >
                    {s.title}
                  </h3>
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90 md:text-base">
                    {s.tags.map((t, idx) => (
                      <span key={t} className="flex items-center gap-3">
                        {t}
                        {idx < s.tags.length - 1 && <span className="text-white/40">—</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: swapping image */}
        <div className="relative hidden h-[520px] w-[400px] overflow-hidden rounded-sm md:block lg:h-[600px] lg:w-[460px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={SERVICES[active].image}
              src={SERVICES[active].image}
              alt={SERVICES[active].title}
              width={800}
              height={1024}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
