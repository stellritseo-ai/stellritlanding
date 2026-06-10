import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, RefreshCw } from "lucide-react";

const LEFT_VIDEO_SRC = "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj.mp4";

function HeroVideoFrame() {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [key, setKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
    const t = setTimeout(() => {
      if (!videoRef.current || videoRef.current.readyState < 2) setErrored(true);
    }, 10000);
    return () => clearTimeout(t);
  }, [key]);

  const retry = () => {
    setErrored(false);
    setLoaded(false);
    setKey((k) => k + 1);
  };

  return (
    <>
      {!errored && (
        <video
          key={key}
          ref={videoRef}
          src={LEFT_VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover"
        />
      )}
      {!loaded && !errored && (
        <div className="pointer-events-none absolute inset-0 z-20 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.08)_50%,transparent_70%)] bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />
        </div>
      )}
      {errored && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Video unavailable</p>
          <button
            onClick={retry}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-[#2a0860] transition hover:bg-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}
    </>
  );
}
import { Link } from "@tanstack/react-router";
import MenuOverlay from "./MenuOverlay";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import logoImg from "@/assets/logo.png";
import logo1 from "@/assets/logos/1.png";
import logoImage660 from "@/assets/logos/Image-660.png";
import logoP1 from "@/assets/logos/Logo (1).png";
import logoP2 from "@/assets/logos/Logo (2).png";
import logoP3 from "@/assets/logos/Logo (3).png";
import logoSite from "@/assets/logos/Site-Logo.png";
import logoDuk from "@/assets/logos/logo-DUKsLZX9.png";
import logoPng from "@/assets/logos/logo.png";
import logoTsr from "@/assets/logos/tsr.png";

const CLIENT_LOGOS = [
  logo1,
  logoImage660,
  logoP1,
  logoP2,
  logoP3,
  logoSite,
  logoDuk,
  logoPng,
  logoTsr,
];

const CENTER_VIDEO =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/ISA_FLOR_04__444_enp2ps";
const LEFT_VIDEO =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Smooth the scroll signal so per-frame transforms coalesce.
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.25 });

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

  if (reduced) {
    return (
      <div className="relative h-screen w-full overflow-hidden noise-overlay">
        <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
          <Link to="/" className="block">
            <img src={logoImg} alt="StellR IT" className="h-12 sm:h-14 md:h-16 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/contact"
              className="group relative hidden sm:flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all duration-500 overflow-hidden hover:border-[#ff8a5b]/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(190,80,255,0.25)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative z-10">Let's Talk</span>
              <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="glass grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full text-white hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

        <div className="relative flex flex-col items-center justify-center px-6 pt-8 text-center">
          <div className="pointer-events-none relative mt-[80px] h-[240px] w-[240px] sm:h-[320px] sm:w-[320px] md:h-[440px] md:w-[440px] z-[99]">
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
          </div>
          <h1 className="text-glow relative z-20 max-w-5xl font-serif text-[32px] font-bold leading-[1.05] tracking-tight text-white sm:text-[42px] md:text-[60px] lg:text-[76px] mt-6">
            Digital <span className="italic bg-gradient-to-r from-[#d9b8ff] via-[#cc7aff] to-[#ff9f7a] bg-clip-text text-transparent drop-shadow-sm">Evolution</span> <span className="font-semibold text-white/95">for Business</span>
          </h1>
          <p className="mt-4 max-w-xl text-[14px] sm:text-[15px] leading-[1.55] text-white/85 px-2">
            Our creative studio helps enterprise brands and market leaders navigate digital, evolve profitably, and launch unforgettable websites, products, and campaigns.
          </p>
        </div>

      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden noise-overlay">



        {/* Center radial glow behind video */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] md:h-[800px] md:w-[800px] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-full w-full" style={{ background: "var(--grad-glow)" }} />
        </motion.div>

        {/* Nav */}
        <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
          <Link to="/" className="block">
            <img src={logoImg} alt="StellR IT" className="h-12 sm:h-14 md:h-16 w-auto object-contain" style={{ filter: "brightness(0) invert(1)" }} />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/contact"
              className="group relative hidden sm:flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all duration-500 overflow-hidden hover:border-[#ff8a5b]/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(190,80,255,0.25)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative z-10">Let's Talk</span>
              <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="glass grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-full text-white transition hover:bg-white/10">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Center hero video — on top */}
        <motion.div
          style={{ y: centerY, opacity: centerOpacity }}
          className="pointer-events-none absolute left-1/2 top-[8%] mt-[100px] sm:mt-[130px] md:mt-[150px] z-[99] h-[240px] w-[240px] sm:h-[300px] sm:w-[300px] md:h-[480px] md:w-[480px] lg:h-[540px] lg:w-[540px] -translate-x-1/2"
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
          className="text-glow absolute left-1/2 top-[14%] z-30 w-full max-w-[1800px] -translate-x-1/2 px-4 sm:px-6 text-center font-serif text-[28px] sm:text-[38px] font-bold leading-[1.05] tracking-tight text-white md:text-[60px] lg:text-[76px] mt-[20px] sm:mt-[30px]"
        >
          Digital <span className="italic bg-gradient-to-r from-[#d9b8ff] via-[#cc7aff] to-[#ff9f7a] bg-clip-text text-transparent drop-shadow-sm">Evolution</span> <span className="font-semibold text-white/95">for Business</span>
        </motion.h1>


        {/* Left content — hidden on small screens */}
        <motion.div
          style={{ opacity: leftTextOpacity }}
          className="absolute left-6 top-[42%] mt-[70px] z-20 max-w-[280px] hidden md:block md:left-12"
        >
          <p className="text-[14px] leading-[1.55] text-white/85">
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
          className="absolute left-4 bottom-8 z-[99] h-[140px] w-[240px] origin-center overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:left-6 sm:h-[160px] sm:w-[280px] md:left-12 md:h-[200px] md:w-[360px] bg-[#0e0228] will-change-transform transform-gpu"
        >
          <HeroVideoFrame />
          <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-white/15" style={{ borderRadius: "inherit" }} />
        </motion.div>

        {/* Right logo slider — desktop only */}
        <motion.div
          style={{ opacity: logosOpacity }}
          className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block mt-[80px]"
        >
          <div
            className="relative h-[100px] w-[35vw] overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div
              className="animate-scroll-left flex h-full w-max flex-row flex-nowrap items-center hover:[animation-play-state:paused]"
              style={{ animationDuration: "20s" }}
            >
              {[1, 2].map((set) => (
                <div key={set} className="flex w-max flex-nowrap items-center gap-10 pr-10 pl-10">
                  {CLIENT_LOGOS.map((logo, i) => (
                    <div
                      key={i}
                      className="flex shrink-0 items-center justify-center whitespace-nowrap px-3"
                    >
                      <img
                        src={logo}
                        alt={`Client Logo ${i}`}
                        className="h-14 lg:h-16 w-auto max-w-[120px] lg:max-w-[150px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom scroll hint */}
        <motion.div
          style={{ opacity: leftTextOpacity }}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-white/50"
        >
          Scroll to explore
        </motion.div>

        {/* Phase 4 Content Reveal */}
        {/* <motion.div
          style={{ opacity: phase4Opacity, y: phase4Y }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center text-white"
        >
          <h2 className="max-w-5xl font-serif text-[40px] font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-[54px] lg:text-[68px]">
            Digital <span className="font-serif italic bg-gradient-to-r from-[#c9a4ff] via-[#be50ff] to-[#ff8a5b] bg-clip-text text-transparent">Evolution</span> <span className="font-sans font-light tracking-wide text-white/90">for Business</span>
          </h2>
          <p className="mt-6 max-w-2xl font-sans text-sm leading-[1.6] text-white/75 md:text-[17px]">
            Our creative studio helps enterprise brands and market leaders navigate digital, evolve profitably, and launch unforgettable websites, products, and campaigns.
          </p>
          <Link
            to="/contact"
            className="pointer-events-auto group relative mt-[70px] inline-flex items-center gap-3.5 rounded-full bg-white/5 border border-white/10 px-7 py-3.5 text-base font-medium text-white transition-all duration-500 overflow-hidden hover:border-[#ff8a5b]/40 hover:bg-white/10 hover:shadow-[0_0_35px_rgba(190,80,255,0.3)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="relative z-10">Let's Talk</span>
            <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#7a2adc] to-[#ff8a5b] text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </Link>
        </motion.div> */}

      </div>
    </div>
  );
}
