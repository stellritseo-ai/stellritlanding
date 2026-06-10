import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  <motion.svg
    viewBox="0 0 40 40"
    className="h-7 w-7 md:h-8 md:w-8"
    animate={{ rotate: spin ? 180 : 0, scale: spin ? 1.18 : 1 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  >
    <g fill="#ff8a5b">
      <path d="M20 0 L22 17 L40 20 L22 23 L20 40 L18 23 L0 20 L18 17 Z" />
      <path d="M20 6 L21 18 L33 20 L21 22 L20 34 L19 22 L7 20 L19 18 Z" opacity="0.85" />
    </g>
  </motion.svg>
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
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 200, damping: 20, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    mx.set(dx * 0.04);
    my.set(dy * 0.08);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={onHover}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative cursor-pointer border-b border-white/15 py-10 md:py-14"
    >
      <motion.div style={{ x: sx, y: sy }} className="flex items-start gap-5 will-change-transform">
        <div className="mt-2 md:mt-4">
          <Sparkle spin={isActive} />
        </div>
        <div>
          <motion.h3
            animate={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.92)" }}
            className="font-serif text-[44px] leading-[0.95] tracking-tight md:text-[72px] lg:text-[88px]"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontWeight: 400 }}
          >
            {service.title}
          </motion.h3>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/90 md:text-base">
            {service.tags.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                <span>{t}</span>
                {i < service.tags.length - 1 && <span className="text-white/50">—</span>}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const [active, setActive] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  // Parallax for the right image (subtle tilt + shift to follow cursor)
  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const six = useSpring(ix, { stiffness: 80, damping: 18, mass: 0.6 });
  const siy = useSpring(iy, { stiffness: 80, damping: 18, mass: 0.6 });
  const rotX = useTransform(siy, [-1, 1], [6, -6]);
  const rotY = useTransform(six, [-1, 1], [-8, 8]);
  const tx = useTransform(six, [-1, 1], [-12, 12]);
  const ty = useTransform(siy, [-1, 1], [-12, 12]);

  const onStageMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    ix.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    iy.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onStageLeave = () => {
    ix.set(0);
    iy.set(0);
  };

  return (
    <section className="relative py-24 text-white md:py-32" style={{ background: "#2a0a5e" }}>
      <div
        className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[1.2fr_460px] md:gap-16 md:px-12"
        onMouseMove={onStageMove}
        onMouseLeave={onStageLeave}
      >
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
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY, x: tx, y: ty, transformStyle: "preserve-3d" }}
            className="relative h-full w-full will-change-transform"
          >
            <AnimatePresence mode="wait">
              <motion.div
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
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
