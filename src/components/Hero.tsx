import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Menu } from "lucide-react";

const CENTER_VIDEO =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/ISA_FLOR_04__444_enp2ps";
const LEFT_VIDEO =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj";

const LOGOS = [
  "RAZOR", "HONEST", "LUMEN", "ORBIT", "NOVA", "VERTEX",
  "ATLAS", "PRISM", "ÆTHER", "HALO", "MERIDIAN", "CIPHER",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Phase 1: headline scales down, center video moves up, glow intensifies
  const headlineScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.7]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 0.6, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);

  const centerY = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, -120, -200]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.4, 0.55], [1, 0.5, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);

  const leftTextOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const logosOpacity = useTransform(scrollYProgress, [0, 0.35, 0.5], [1, 0.7, 0]);

  // Phase 2-3: left video card expands to fullscreen
  const cardScale = useTransform(scrollYProgress, [0.3, 0.65], [1, 8]);
  const cardX = useTransform(scrollYProgress, [0.3, 0.65], [0, 0]);
  const cardRadius = useTransform(scrollYProgress, [0.3, 0.65], [24, 0]);

  // Phase 4: content reveal
  const phase4Opacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const phase4Y = useTransform(scrollYProgress, [0.7, 0.9], [60, 0]);

  // Cursor parallax for center video
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div ref={containerRef} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden noise-overlay" style={{ background: "var(--grad-bg)" }}>
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(180,80,255,0.35), transparent 70%)", filter: "blur(40px)" }}
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(120,40,200,0.4), transparent 70%)", filter: "blur(50px)" }}
            animate={{ x: [0, -50, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Center radial glow behind video */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-full w-full" style={{ background: "var(--grad-glow)", filter: "blur(20px)" }} />
        </motion.div>

        {/* Nav */}
        <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
          <div className="font-serif text-2xl font-semibold tracking-tight text-glow">
            StellR<span className="text-[#c9a4ff]">.</span>
            <span className="ml-1 text-xs font-sans tracking-[0.3em] text-white/60">IT LLC</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="group glass flex items-center gap-2 rounded-full bg-white/95 py-2 pl-5 pr-2 text-sm font-medium text-[#2a0860] transition hover:bg-white">
              Let's Talk
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </button>
            <button className="glass grid h-12 w-12 place-items-center rounded-full text-white transition hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Headline */}
        <motion.h1
          style={{ scale: headlineScale, opacity: headlineOpacity, y: headlineY }}
          className="relative z-20 mx-auto mt-4 max-w-[1400px] px-6 text-center font-serif text-[64px] font-medium leading-[0.95] tracking-[-0.02em] text-white text-glow md:text-[110px] lg:text-[150px]"
        >
          Digital Evolution
          <br />
          <span className="italic font-light">for Business</span>
        </motion.h1>

        {/* Center hero video */}
        <motion.div
          style={{ y: centerY, opacity: centerOpacity, x: sx, translateY: sy }}
          className="pointer-events-none absolute left-1/2 top-[55%] z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 md:h-[640px] md:w-[640px]"
        >
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <video
              src={CENTER_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              style={{
                maskImage: "radial-gradient(circle, black 55%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 75%)",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Left content */}
        <motion.div
          style={{ opacity: leftTextOpacity }}
          className="absolute left-6 top-[42%] z-20 max-w-[320px] md:left-12"
        >
          <p className="text-[15px] leading-[1.55] text-white/85">
            Our <a href="#" className="underline decoration-white/60 underline-offset-4 hover:decoration-white">creative studio</a> helps enterprise brands and market leaders navigate digital, evolve profitably, and launch unforgettable websites, products, and campaigns.
          </p>
        </motion.div>

        {/* Expanding left video card */}
        <motion.div
          style={{
            scale: cardScale,
            x: cardX,
            borderRadius: cardRadius,
          }}
          className="glass absolute left-6 bottom-12 z-20 h-[180px] w-[320px] origin-center overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] md:left-12 md:h-[200px] md:w-[360px]"
        >
          <video
            src={LEFT_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15" style={{ borderRadius: "inherit" }} />
        </motion.div>

        {/* Right logo slider */}
        <motion.div
          style={{ opacity: logosOpacity }}
          className="absolute right-0 top-0 z-20 hidden h-full w-[200px] md:block"
        >
          <div
            className="relative h-full overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div className="animate-scroll-up flex flex-col gap-12 py-12">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center text-center font-serif text-2xl tracking-[0.2em] text-white/70 transition hover:text-white"
                  style={{ opacity: 0.5 + ((i % 4) * 0.12) }}
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom scroll hint */}
        <motion.div
          style={{ opacity: leftTextOpacity }}
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[11px] uppercase tracking-[0.4em] text-white/50"
        >
          Scroll to explore
        </motion.div>

        {/* Phase 4 overlay content */}
        <motion.div
          style={{ opacity: phase4Opacity, y: phase4Y }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="mb-6 text-[11px] uppercase tracking-[0.5em] text-white/60">Chapter 01 — The Craft</span>
          <h2 className="max-w-4xl font-serif text-5xl font-medium leading-[1] tracking-tight text-white text-glow md:text-7xl">
            We design <span className="italic">moments</span> that outlive the scroll.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75">
            From immersive brand worlds to high-conversion product surfaces, every pixel earns its place. Cinematic motion. Premium typography. Engineering that sings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
