import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import brandImg from "@/assets/service-brand.jpg";
import productImg from "@/assets/product.jpg";
import growthImg from "@/assets/marketing.webp";
import aiImg from "@/assets/ai.jpg";

const SERVICES = [
  {
    index: "01",
    title: "Brand Building",
    description: "Crafting iconic identities that command attention and build lasting equity for market leaders.",
    tags: ["Visual Identity", "Video", "Content Strategy"],
    image: brandImg,
  },
  {
    index: "02",
    title: "Product Development",
    description: "From concept to conversion — beautifully engineered digital products that scale with ambition.",
    tags: ["Web Design", "Design Systems", "eCommerce"],
    image: productImg,
  },
  {
    index: "03",
    title: "Growth Marketing",
    description: "Data-driven campaigns that unlock compounding growth across every channel that matters.",
    tags: ["Paid Media", "CRO", "Analytics", "SEM Strategy"],
    image: growthImg,
  },
  {
    index: "04",
    title: "AI Automation",
    description: "Integrating intelligent agents and custom language models to streamline operations and unlock data insights.",
    tags: ["Agentic Workflows", "LLM Integrations", "Process Automation"],
    image: aiImg,
  },
];

function ServiceRow({
  service,
  isActive,
  onHover,
  idx,
}: {
  service: typeof SERVICES[number];
  isActive: boolean;
  onHover: () => void;
  idx: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 180, damping: 22, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.03);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.05);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onHover}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: idx * 0.08 }}
      className="group relative cursor-pointer"
    >
      {/* Top border with gradient on active */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 bg-white/10" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #7a2adc, #cc7aff, #ff8a5b)",
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <motion.div
        style={{ x: sx, y: sy }}
        className="grid grid-cols-[56px_1fr_auto] items-start gap-6 py-4 md:py-5 lg:py-5 will-change-transform"
      >
        {/* Index number */}
        <motion.span
          animate={{ color: isActive ? "rgba(204,122,255,0.9)" : "rgba(255,255,255,0.2)" }}
          transition={{ duration: 0.3 }}
          className="mt-1 font-mono text-xs tracking-[0.2em] select-none"
        >
          {service.index}
        </motion.span>

        {/* Title + description + tags */}
        <div className="flex flex-col gap-2">
          <motion.h3
            animate={{
              color: isActive ? "#ffffff" : "rgba(255,255,255,0.75)",
            }}
            transition={{ duration: 0.3 }}
            className="font-serif text-[24px] leading-[0.95] tracking-tight sm:text-[28px] md:text-[36px] lg:text-[42px]"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontWeight: 600 }}
          >
            {service.title}
          </motion.h3>

          <motion.p
            animate={{ opacity: isActive ? 1 : 0, height: isActive ? "auto" : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden text-sm leading-relaxed text-white/60 max-w-sm"
          >
            {service.description}
          </motion.p>

          <motion.div
            animate={{ opacity: isActive ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center gap-2"
          >
            {service.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-white/70"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Arrow icon */}
        <motion.div
          animate={{
            opacity: isActive ? 1 : 0,
            x: isActive ? 0 : 8,
            rotate: isActive ? 0 : -20,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm"
        >
          <ArrowUpRight className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const six = useSpring(ix, { stiffness: 70, damping: 20, mass: 0.6 });
  const siy = useSpring(iy, { stiffness: 70, damping: 20, mass: 0.6 });
  const rotX = useTransform(siy, [-1, 1], [5, -5]);
  const rotY = useTransform(six, [-1, 1], [-7, 7]);
  const tx = useTransform(six, [-1, 1], [-10, 10]);
  const ty = useTransform(siy, [-1, 1], [-10, 10]);

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
    <section className="relative py-12 text-white md:py-16 lg:py-20 md:h-screen md:min-h-[600px] md:max-h-[850px] flex flex-col justify-center overflow-hidden">
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 50%, rgba(122,42,220,0.08), transparent 70%)",
        }}
      />

      <div
        className="relative mx-auto max-w-7xl px-6 md:px-12 w-full"
        onMouseMove={onStageMove}
        onMouseLeave={onStageLeave}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-10 flex items-end justify-between"
        >
          <div>
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
              What we do
            </span>
            <h2
              className="font-serif text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[36px] md:text-[40px] lg:text-[46px]"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}
            >
              Our Services
            </h2>
          </div>
          <span className="hidden text-sm text-white/30 md:block">
            {String(active + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid items-start gap-8 md:grid-cols-[1fr_400px] md:gap-12 lg:grid-cols-[1fr_460px]">
          {/* Left: service rows */}
          <div className="flex flex-col">
            {SERVICES.map((s, i) => (
              <ServiceRow
                key={s.title}
                service={s}
                idx={i}
                isActive={active === i}
                onHover={() => setActive(i)}
              />
            ))}
            {/* Bottom border */}
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(122,42,220,0.5) 40%, rgba(255,138,91,0.5) 100%)",
              }}
            />
          </div>

          {/* Right: image stage */}
          <div
            ref={stageRef}
            className="relative mx-auto hidden h-[420px] w-full md:block lg:h-[480px]"
            style={{ perspective: 1200 }}
          >
            {/* Ambient glow behind image */}
            <motion.div
              key={active}
              animate={{ opacity: [0, 0.5, 0.3] }}
              transition={{ duration: 1.2 }}
              className="absolute -inset-6 rounded-[32px] blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(122,42,220,0.3), rgba(255,138,91,0.15), transparent 70%)",
              }}
            />

            <motion.div
              style={{ rotateX: rotX, rotateY: rotY, x: tx, y: ty, transformStyle: "preserve-3d" }}
              className="relative h-full w-full will-change-transform"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={SERVICES[active].image}
                  initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)]"
                >
                  <img
                    src={SERVICES[active].image}
                    alt={SERVICES[active].title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(5,0,18,0.55) 0%, transparent 50%)",
                    }}
                  />
                  {/* Inner ring */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />

                  {/* Service label at bottom of image */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <span className="font-serif text-lg font-medium text-white drop-shadow-sm">
                      {SERVICES[active].title}
                    </span>
                    <span className="font-mono text-xs text-white/50 tracking-widest">
                      {SERVICES[active].index}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
