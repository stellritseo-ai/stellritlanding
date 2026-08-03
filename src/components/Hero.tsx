import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, RefreshCw } from "lucide-react";

const LEFT_VIDEO_SRC = "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj.mp4";

function HeroVideoFrame({ isPlaying = true }: { isPlaying?: boolean }) {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying && !errored) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isPlaying, errored, key]);

  return (
    <>
      {!errored && (
        <video
          key={key}
          ref={videoRef}
          src={LEFT_VIDEO_SRC}
          autoPlay={isPlaying}
          muted
          loop
          playsInline
          preload="none"
          fetchPriority="low"
          aria-hidden="true"
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
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { TransparentVideo } from "./TransparentVideo";
import { CanvasVideo } from "./CanvasVideo";
import heroWebm from "@/assets/hero.webm";
import logoImg from "@/assets/logo.png";
import logo1 from "@/assets/logos/logo (1).png";
import logo2 from "@/assets/logos/Logo.png";
import logo3 from "@/assets/logos/cropped-logo.png";
import logo4 from "@/assets/logos/Image-507.png";
import logo5 from "@/assets/logos/logo-BX_kYZ7l.png";
import logo6 from "@/assets/logos/logo-BqMKyS9S.png";
import logo7 from "@/assets/logos/logo-BwGEonYb.png";
import logo8 from "@/assets/logos/logo-CMAon1t6 (1).png";
import logo9 from "@/assets/logos/logo-DdbW9O7g.png";
import logo10 from "@/assets/logos/logo-I6fgEckf.png";
import logo11 from "@/assets/logos/logo-nayshands.png";
import logo12 from "@/assets/logos/logo-white-DNQTDUZa.png";

const CLIENT_LOGOS = [
  logo1,
  logo2,
  logo3,
  logo4,
  logo5,
  logo6,
  logo7,
  logo8,
  logo9,
  logo10,
  logo11,
  logo12,
];

const CENTER_VIDEO = heroWebm;
const LEFT_VIDEO =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Use a highly responsive spring to smooth out scroll increments (wheel stepping)
  // while maintaining absolute snappiness and lightweight feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 25,
    mass: 0.1,
    restDelta: 0.001
  });

  const p = smoothProgress;

  // Phase 2-3: left video card expands to fit screen (centered, with gutters)
  // Throttled window resize handler
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  useEffect(() => {
    let rId: number;
    const update = () => {
      rId = requestAnimationFrame(() => {
        setVp({ w: window.innerWidth, h: window.innerHeight });
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rId);
    };
  }, []);

  const isMobile = vp.w < 768;

  // Phase 1: headline scales down, center video moves up, glow intensifies
  const headlineScale = useTransform(p, [0, 0.25], [1, 0.7]);
  const headlineOpacity = useTransform(
    p,
    isMobile ? [0, 0.12, 0.2] : [0, 0.2, 0.3],
    [1, 0.6, 0]
  );
  const headlineY = useTransform(
    p,
    isMobile ? [0, 0.2] : [0, 0.25],
    isMobile ? [0, -40] : [0, -80]
  );

  const centerY = useTransform(
    p,
    isMobile ? [0, 0.25, 0.4] : [0, 0.3, 0.5],
    isMobile ? [0, -60, -100] : [0, -120, -200]
  );
  const centerOpacity = useTransform(
    p,
    isMobile ? [0, 0.2, 0.35] : [0, 0.4, 0.55],
    [1, 0.5, 0]
  );
  const glowOpacity = useTransform(p, [0, 0.3], [0.6, 1]);

  const leftTextOpacity = useTransform(p, [0, 0.2], [1, 0]);
  const logosOpacity = useTransform(p, [0, 0.35, 0.5], [1, 0.7, 0]);

  // Card dimensions tailored exactly to class names at each viewport size:
  // Mobile: left-4 (16px), w=240, h=140
  // SM: left-6 (24px), w=280, h=160
  // MD+: left-12 (48px), w=360, h=200
  const getCardDims = () => {
    if (vp.w >= 768) {
      return { w: 360, h: 200, left: 48 };
    }
    if (vp.w >= 640) {
      return { w: 280, h: 160, left: 24 };
    }
    return { w: 240, h: 140, left: 16 };
  };
  const { w: CARD_W, h: CARD_H, left: CARD_LEFT } = getCardDims();
  const CARD_BOTTOM = 32; // bottom-8 = 32px

  const gutter = 48;
  const targetW = vp.w - gutter * 2;
  const targetH = vp.h - gutter * 2 - 80;
  const scaleX = targetW / CARD_W;
  const scaleY = targetH / CARD_H;
  const fitScale = Math.min(scaleX, scaleY);

  const targetCenterX = vp.w / 2;
  const currentCenterX = CARD_LEFT + CARD_W / 2;
  const deltaX = targetCenterX - currentCenterX;
  const deltaY = -16; // Slight offset to maintain clean 48px bottom gutter when expanded

  const cardScale = useTransform(p, [0.3, 0.65], [1, fitScale]);
  const cardX = useTransform(p, [0.3, 0.65], [0, deltaX]);
  const cardY = useTransform(p, [0.3, 0.65], [0, deltaY]);
  const cardRadius = useTransform(p, [0.3, 0.65], [24, 16]);

  // Phase 4: content reveal
  const phase4Opacity = useTransform(p, [0.7, 0.85], [0, 1]);
  const phase4Y = useTransform(p, [0.7, 0.9], [60, 0]);

  const mobileSizzleRef = useRef<HTMLVideoElement>(null);
  const mobileCenterVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobileSizzlePlaying, setIsMobileSizzlePlaying] = useState(false);

  const toggleMobileSizzle = () => {
    const video = mobileSizzleRef.current;
    if (!video) return;
    if (isMobileSizzlePlaying) {
      video.pause();
      setIsMobileSizzlePlaying(false);
    } else {
      video.play().catch(() => { });
      setIsMobileSizzlePlaying(true);
    }
  };

  const [isCenterVideoPlaying, setIsCenterVideoPlaying] = useState(true);
  const [isCardVideoPlaying, setIsCardVideoPlaying] = useState(true);

  // Programmatic autoplay enforcer for mobile iOS/Android
  useEffect(() => {
    if (!isMobile) return;
    const video = mobileCenterVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const playMobileVideo = () => {
      video.play().catch(() => {
        const retry = () => {
          video.play().catch(() => {});
          window.removeEventListener("touchstart", retry);
          window.removeEventListener("click", retry);
          window.removeEventListener("scroll", retry);
        };
        window.addEventListener("touchstart", retry, { once: true, passive: true });
        window.addEventListener("click", retry, { once: true, passive: true });
        window.addEventListener("scroll", retry, { once: true, passive: true });
      });
    };

    playMobileVideo();
    video.addEventListener("loadedmetadata", playMobileVideo);
    video.addEventListener("canplay", playMobileVideo);

    return () => {
      video.removeEventListener("loadedmetadata", playMobileVideo);
      video.removeEventListener("canplay", playMobileVideo);
    };
  }, [isMobile]);

  // Deduplicated scroll listener — fires React state updates ONLY on state transitions
  useEffect(() => {
    if (isMobile) return;
    let isCenter = true;
    let isCard = true;
    const unsubscribe = p.on("change", (latest) => {
      const nextCenter = latest < 0.6;
      const nextCard = latest < 1.0;
      if (nextCenter !== isCenter) {
        isCenter = nextCenter;
        setIsCenterVideoPlaying(nextCenter);
      }
      if (nextCard !== isCard) {
        isCard = nextCard;
        setIsCardVideoPlaying(nextCard);
      }
    });
    return () => unsubscribe();
  }, [p, isMobile]);

  if (isMobile) {
    return (
      <div className="relative w-full bg-[#180028] px-6 pt-16 pb-12 flex flex-col items-center text-center gap-8 overflow-hidden">
        {/* Ambient background glow behind flower */}
        <div
          className="pointer-events-none absolute left-1/2 top-[38%] h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(255,146,194,0.25) 45%, transparent 70%)" }}
        />

        {/* Headline — Pixel-perfect match to reference */}
        <h1 className="text-glow z-10 max-w-lg font-serif text-[34px] sm:text-[44px] font-normal leading-[1.12] tracking-tight text-white mt-4 px-2">
          Digital Evolution for <br /> Business
        </h1>

        {/* Center 3D Organic Flower Video — Made significantly bigger */}
        <div className="pointer-events-none relative w-[98%] sm:w-[90%] max-w-[440px] aspect-[4/5] scale-110 z-10 overflow-visible my-3 flex items-center justify-center">
          <video
            ref={mobileCenterVideoRef}
            autoPlay
            muted
            loop
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            controls={false}
            preload="auto"
            className="relative z-10 h-full w-full object-contain"
            style={{
              mixBlendMode: "screen",
              maskImage: "radial-gradient(circle at center, black 45%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at center, black 45%, transparent 75%)",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
            }}
          >
            <source src={CENTER_VIDEO} type="video/webm" />
            <source src={LEFT_VIDEO_SRC} type="video/mp4" />
          </video>
        </div>

        {/* Description Text — Positioned directly beneath flower */}
        <div className="z-10 max-w-md px-2">
          <p className="text-[14px] sm:text-[15px] leading-[1.55] text-white/80 font-sans font-light">
            Our <a href="#" className="underline decoration-white/40 underline-offset-4 hover:text-white font-normal text-white">web design agency</a> helps enterprise brands and market leaders navigate digital, evolve profitably, and launch unforgettable websites, products, and campaigns.
          </p>
        </div>

        {/* Client Logos — auto-scrolling ticker */}
        <div className="z-10 w-full overflow-hidden py-3 opacity-75 mt-2"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div
            className="flex w-max flex-nowrap items-center animate-scroll-left hover:[animation-play-state:paused]"
            style={{ animationDuration: "22s" }}
          >
            {[1, 2].map((set) => (
              <div key={set} className="flex flex-nowrap items-center gap-10 px-5">
                {CLIENT_LOGOS.map((logo, i) => (
                  <img
                    key={i}
                    src={logo}
                    alt={`Client ${i}`}
                    className="h-7 w-auto max-w-[100px] object-contain shrink-0"
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Splay Video Card (Reel) with Play/Pause button */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#180028] z-10 border border-white/10 mt-2">
          <video
            ref={mobileSizzleRef}
            src={LEFT_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            // @ts-ignore
            webkit-playsinline="true"
            controls={false}
            className="h-full w-full object-cover"
          />
          {/* Circular Play/Pause Button in Bottom Right */}
          <button
            onClick={toggleMobileSizzle}
            className="absolute bottom-4 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-lg active:scale-95 transition-transform cursor-pointer"
            aria-label={isMobileSizzlePlaying ? "Pause video" : "Play video"}
          >
            {isMobileSizzlePlaying ? (
              // Pause Icon (||)
              <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor">
                <rect x="2" y="2" width="3" height="14" rx="0.5" />
                <rect x="9" y="2" width="3" height="14" rx="0.5" />
              </svg>
            ) : (
              // Play Icon (triangle)
              <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor">
                <path d="M4 2.694a1 1 0 011.517-.853l10.28 6.305a1 1 0 010 1.706L5.517 16.16a1 1 0 01-1.517-.853V2.694z" />
              </svg>
            )}
          </button>
        </div>


      </div>
    );
  }

  if (reduced) {
    return (
      <div className="relative h-screen w-full overflow-hidden noise-overlay">
        <div className="relative flex flex-col items-center justify-center px-6 pt-24 text-center">
          <div className="pointer-events-none relative mt-[80px] w-full sm:w-[480px] md:w-[640px] lg:w-[800px] aspect-[16/10] z-[99] overflow-hidden rounded-2xl bg-transparent isolate">
            <CanvasVideo
              src={CENTER_VIDEO}
              className="h-full w-full object-cover"
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
    <div ref={containerRef} className="relative" style={{ height: "150vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden noise-overlay">

        {/* Gradient mask at the top of the viewport to fade out content scrolling behind header */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#180028] via-[#180028]/80 to-transparent z-[20]" />

        {/* Center radial glow behind video */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] md:h-[800px] md:w-[800px] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-full w-full" style={{ background: "var(--grad-glow)" }} />
        </motion.div>



        {/* Center hero video — sits below gradient mask and headline */}
        <motion.div
          style={{ y: centerY, opacity: centerOpacity }}
          className="pointer-events-none absolute left-1/2 top-[12%] mt-[100px] sm:mt-[130px] md:mt-[150px] z-[10] w-full sm:w-[480px] md:w-[640px] lg:w-[800px] aspect-[16/10] -translate-x-1/2 overflow-hidden rounded-2xl bg-transparent isolate"
        >
          <CanvasVideo
            src={CENTER_VIDEO}
            isPlaying={isCenterVideoPlaying}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Headline — sits on top of video, below gradient mask */}
        <motion.h1
          style={{ scale: headlineScale, opacity: headlineOpacity, y: headlineY }}
          className="text-glow absolute left-1/2 top-[14%] z-[15] w-full max-w-[1800px] -translate-x-1/2 px-4 sm:px-6 text-center font-serif text-[28px] sm:text-[38px] font-bold leading-[1.05] tracking-tight text-white md:text-[60px] lg:text-[76px] mt-[20px] sm:mt-[30px]"
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
            transformOrigin: "center bottom",
          }}
          className="absolute left-4 bottom-8 z-[99] h-[140px] w-[240px] origin-bottom overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] sm:left-6 sm:h-[160px] sm:w-[280px] md:left-12 md:h-[200px] md:w-[360px] bg-[#0e0228] will-change-transform transform-gpu"
        >
          <HeroVideoFrame isPlaying={isCardVideoPlaying} />
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
                        style={{ filter: "brightness(0) invert(1)" }}
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
          className="absolute bottom-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 z-20 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-white/50 pointer-events-none"
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
