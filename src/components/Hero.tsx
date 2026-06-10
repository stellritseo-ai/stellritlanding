import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import MenuOverlay from "./MenuOverlay";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Smooth the scroll signal so per-frame transforms coalesce.
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 30, mass: 0.5 });

  // Phase 1: headline scales down, center video moves up, glow intensifies
  const headlineScale = useTransform(p, [0, 0.25], [1, 0.7]);
  const headlineOpacity = useTransform(p, [0, 0.2, 0.3], [1, 0.6, 0]);
  const headlineY = useTransform(p, [0, 0.25], [0, -80]);

  const centerY = useTransform(p, [0, 0.3, 0.5], [0, -120, -200]);
  const centerOpacity = useTransform(p, [0, 0.4, 0.55], [1, 0.5, 0]);
  const glowOpacity = useTransform(p, [0, 0.3], [0.6, 1]);

  const leftTextOpacity = useTransform(p, [0, 0.2], [1, 0]);
  const logosOpacity = useTransform(p, [0, 0.35, 0.5], [1, 0.7, 0]);

  // Phase 2-3: left video card expands to fit screen (centered, with gutters)
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // card base: w=320 (md:360), h=180 (md:200), left:24 (md:48), bottom:48
  const CARD_W = vp.w >= 768 ? 360 : 320;
  const CARD_H = vp.w >= 768 ? 200 : 180;
  const CARD_LEFT = vp.w >= 768 ? 48 : 24;
  const CARD_BOTTOM = 48;

  const gutter = 48;
  const targetW = vp.w - gutter * 2;
  const targetH = vp.h - gutter * 2 - 80;
  const scaleX = targetW / CARD_W;
  const scaleY = targetH / CARD_H;
  const fitScale = Math.min(scaleX, scaleY);

  const targetCenterX = vp.w / 2;
  const targetCenterY = vp.h / 2 + 20;
  const currentCenterX = CARD_LEFT + CARD_W / 2;
  const currentCenterY = vp.h - CARD_BOTTOM - CARD_H / 2;
  const deltaX = targetCenterX - currentCenterX;
  const deltaY = targetCenterY - currentCenterY;

  const cardScale = useTransform(p, [0.3, 0.65], [1, fitScale]);
  const cardX = useTransform(p, [0.3, 0.65], [0, deltaX]);
  const cardY = useTransform(p, [0.3, 0.65], [0, deltaY]);
  const cardRadius = useTransform(p, [0.3, 0.65], [24, 12]);

  // Phase 4: content reveal
  const phase4Opacity = useTransform(p, [0.7, 0.85], [0, 1]);
  const phase4Y = useTransform(p, [0.7, 0.9], [60, 0]);



  return (
    <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden noise-overlay">


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
            <Link to="/contact" className="group glass flex items-center gap-2 rounded-full bg-white/95 py-2 pl-5 pr-2 text-sm font-medium text-[#2a0860] transition hover:bg-white">
              Let's Talk
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#7c2dd9] text-white transition group-hover:scale-110">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="glass grid h-12 w-12 place-items-center rounded-full text-white transition hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Center hero video — on top */}
        <motion.div
          style={{ y: centerY, opacity: centerOpacity }}
          className="pointer-events-none absolute left-1/2 top-[20%] z-10 h-[360px] w-[360px] -translate-x-1/2 md:top-[18%] md:h-[480px] md:w-[480px] lg:h-[540px] lg:w-[540px]"
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


        {/* Headline — on top of video */}
        <motion.h1
          style={{ scale: headlineScale, opacity: headlineOpacity, y: headlineY }}
          className="text-glow absolute left-1/2 top-[14%] z-30 w-full max-w-[1800px] -translate-x-1/2 px-6 text-center font-serif text-[60px] font-normal leading-[0.95] tracking-[-0.02em] text-white"
        >
          Digital Evolution for Business
        </motion.h1>


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
            y: cardY,
            borderRadius: cardRadius,
          }}
          className="glass absolute left-6 bottom-12 z-20 h-[180px] w-[320px] origin-center overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] md:left-12 md:h-[200px] md:w-[360px]"
        >
          <iframe
            src="https://player.cloudinary.com/embed/?cloud_name=dmanafb84&public_id=IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj&autoplay=true&muted=true&loop=true&controls=false&show_logo=false&fluid=true"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
            style={{ objectFit: "cover", pointerEvents: "none" }}
          />
          <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-white/15" style={{ borderRadius: "inherit" }} />
        </motion.div>

        {/* Right logo slider */}
        <motion.div
          style={{ opacity: logosOpacity }}
          className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 md:block"
        >
          <div
            className="relative h-[70px] w-[280px] overflow-hidden lg:w-[320px]"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div className="animate-scroll-left flex h-full flex-row flex-nowrap items-center gap-8 px-8">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center justify-center whitespace-nowrap font-serif text-lg tracking-[0.2em] text-white/70 transition hover:text-white lg:text-2xl"
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
