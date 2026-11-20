import { memo, useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useInViewActive } from "@/hooks/use-in-view-active";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { CanvasVideo } from "./CanvasVideo";
import heroWebm from "@/assets/hero.webm";
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

const LEFT_VIDEO_SRC =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj.mp4";

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

const HeroVideoFrame = memo(function HeroVideoFrame({ isPlaying = true }: { isPlaying?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [key, setKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewActive = useInViewActive(videoRef, "200px");
  const shouldPlay = isPlaying && inViewActive && !errored;

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
    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay, key]);

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
          aria-hidden="true"
          onLoadedData={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className="h-full w-full object-contain"
          style={{
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
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
});

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sizzleCardRef = useRef<HTMLDivElement>(null);
  const sizzleClipRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Throttled window resize handler — ignore mobile URL-bar height-only resizes
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  useEffect(() => {
    let rId = 0;
    const update = () => {
      cancelAnimationFrame(rId);
      rId = requestAnimationFrame(() => {
        const nextW = window.innerWidth;
        const nextH = window.innerHeight;
        setVp((prev) => {
          if (prev.w === nextW && nextW < 768) return prev;
          if (prev.w === nextW && prev.h === nextH) return prev;
          return { w: nextW, h: nextH };
        });
      });
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rId);
    };
  }, []);

  const isMobile = vp.w < 768;

  // Card dimensions tailored exactly to class names at each viewport size:
  const getCardDims = () => {
    if (vp.w >= 768) {
      return { w: 360, h: (360 * 9) / 16, left: 48 };
    }
    if (vp.w >= 640) {
      return { w: 280, h: (280 * 9) / 16, left: 24 };
    }
    return { w: 240, h: (240 * 9) / 16, left: 16 };
  };
  const { w: CARD_W, h: CARD_H, left: CARD_LEFT } = getCardDims();
  const CARD_BOTTOM = 32;

  // -- SIZZLE REEL (CINEMATIC VIDEO) ANIMATION --
  const paddingX = 130;
  const paddingY = 100;
  const maxWByWidth = vp.w - paddingX;
  const maxWByHeight = (vp.h - paddingY) * (16 / 9);
  const endWidth = Math.min(maxWByWidth, maxWByHeight);
  const endHeight = endWidth * (9 / 16);
  const startTop = vp.h - CARD_BOTTOM - CARD_H;
  const endX = (vp.w - endWidth) / 2 - CARD_LEFT;
  const endY = 160;
  const startScale = endWidth > 0 ? CARD_W / endWidth : 0.3;
  const initialRadius = Math.round(24 / Math.max(startScale, 0.1));

  // Direct passive rAF scroll driver:
  // Exact pixel-for-pixel original zoom, position, 24px -> 0px corners, and fades,
  // using GPU transform (scale + translate3d) instead of layout-reflowing CSS `width`,
  // with zero React re-renders and zero Framer Motion spring overhead.
  useEffect(() => {
    if (isMobile || reduced || typeof window === "undefined") return;

    let rafId = 0;
    let lastProgress = -1;
    let lastRadius = -1;

    const applyScroll = () => {
      rafId = 0;
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScroll = container.offsetHeight - window.innerHeight;
      const progress =
        totalScroll > 0 ? Math.max(0, Math.min(1, -rect.top / totalScroll)) : 0;

      if (Math.abs(progress - lastProgress) < 0.0002) return;
      lastProgress = progress;

      const s = startScale + (1 - startScale) * progress;
      const x = endX * progress;
      const y = endY * progress;

      if (sizzleCardRef.current) {
        sizzleCardRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      }

      // Maintain exact 24px -> 0px visual corner radius; write only when integer changes
      const cssR = Math.round((24 * (1 - progress)) / s);
      if (cssR !== lastRadius) {
        lastRadius = cssR;
        if (sizzleClipRef.current) {
          sizzleClipRef.current.style.borderRadius = `${cssR}px`;
        }
      }

      const fadeLeft = String(Math.max(0, 1 - progress / 0.2));
      if (leftTextRef.current) leftTextRef.current.style.opacity = fadeLeft;
      if (scrollHintRef.current) scrollHintRef.current.style.opacity = fadeLeft;

      if (logosRef.current) {
        const logoOp =
          progress <= 0.35
            ? 1 - (progress / 0.35) * 0.3
            : Math.max(0, 0.7 * (1 - (progress - 0.35) / 0.15));
        logosRef.current.style.opacity = String(logoOp);
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(applyScroll);
      }
    };

    applyScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile, reduced, endX, endY, startScale]);

  const mobileSizzleRef = useRef<HTMLVideoElement>(null);
  const mobileTickerRef = useRef<HTMLDivElement>(null);
  const desktopTickerRef = useRef<HTMLDivElement>(null);
  const [isMobileSizzlePlaying, setIsMobileSizzlePlaying] = useState(true);
  const mobileSizzleInView = useInViewActive(mobileSizzleRef, "150px");
  const mobileTickerInView = useInViewActive(mobileTickerRef, "100px");
  const desktopTickerInView = useInViewActive(desktopTickerRef, "100px");

  const toggleMobileSizzle = () => {
    const video = mobileSizzleRef.current;
    if (!video) return;
    if (isMobileSizzlePlaying) {
      video.pause();
      setIsMobileSizzlePlaying(false);
    } else {
      video.play().catch(() => {});
      setIsMobileSizzlePlaying(true);
    }
  };

  useEffect(() => {
    if (!isMobile) return;
    const video = mobileSizzleRef.current;
    if (!video) return;
    if (isMobileSizzlePlaying && mobileSizzleInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isMobile, isMobileSizzlePlaying, mobileSizzleInView]);

  const [isCenterVideoPlaying] = useState(true);
  const [isCardVideoPlaying] = useState(true);

  if (isMobile) {
    return (
      <div className="relative w-full bg-[#180028] px-4 pt-24 pb-12 flex flex-col items-center text-center gap-0 overflow-hidden">
        {/* Ambient background glow behind flower */}
        <div
          className="pointer-events-none absolute left-1/2 top-[45%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.48) 0%, rgba(255,146,194,0.22) 40%, transparent 70%)",
          }}
        />

        {/* Headline — Stylish luxury editorial typography */}
        <h1
          className="z-20 max-w-lg font-serif tracking-tight px-2 drop-shadow-[0_4px_30px_rgba(190,167,255,0.4)] mb-0"
          style={{
            fontSize: "38px",
            fontWeight: 900,
            lineHeight: "1.1",
            marginTop: "65px",
            marginBottom: "30px",
          }}
        >
          <span className="bg-gradient-to-b from-white via-white to-white/80 bg-clip-text text-transparent">
            Custom Software &
          </span>{" "}
          <br />
          <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#d7dcfc] via-[#c4b5fd] to-[#f472b6]">
            AI Development
          </span>
          <br />
        </h1>

        {/* Center 3D Organic Flower Video — transparent via pixel keying, zero black */}
        <div
          className="pointer-events-none relative w-screen -mx-4 aspect-[8/6] z-10 overflow-visible scale-[1.35]"
          style={{ marginTop: "30px", marginBottom: "15px" }}
        >
          <CanvasVideo src={CENTER_VIDEO} className="h-full w-full" />
        </div>

        {/* Description Text */}
        <div className="z-20 max-w-md px-4" style={{ marginTop: "50px" }}>
          <p className="text-[15px] leading-[28px] text-white/80 font-sans font-light">
            Our{" "}
            <a
              href="#"
              className="underline decoration-white/40 underline-offset-4 hover:text-white font-normal text-white"
            >
              web design agency
            </a>{" "}
            helps enterprise brands and market leaders navigate digital, evolve profitably, and
            launch unforgettable websites, products, and campaigns.
          </p>
        </div>

        {/* Client Logos — auto-scrolling ticker */}
        <div
          ref={mobileTickerRef}
          className="z-10 w-full overflow-hidden py-3 opacity-75 mt-2"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div
            className="flex w-max flex-nowrap items-center animate-scroll-left hover:[animation-play-state:paused]"
            style={{
              animationDuration: "22s",
              animationPlayState: mobileTickerInView ? "running" : "paused",
            }}
          >
            {[1, 2].map((set) => (
              <div key={set} className="flex flex-nowrap items-center gap-10 px-5">
                {CLIENT_LOGOS.map((logo, i) => (
                  <img
                    key={i}
                    src={logo}
                    alt={`Client ${i}`}
                    decoding="async"
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
            preload="metadata"
            // @ts-ignore
            webkit-playsinline="true"
            controls={false}
            className="h-full w-full object-cover"
            style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
          {/* Circular Play/Pause Button in Bottom Right */}
          <button
            onClick={toggleMobileSizzle}
            className="absolute bottom-4 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-lg active:scale-95 transition-transform cursor-pointer"
            aria-label={isMobileSizzlePlaying ? "Pause video" : "Play video"}
          >
            {isMobileSizzlePlaying ? (
              <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor">
                <rect x="2" y="2" width="3" height="14" rx="0.5" />
                <rect x="9" y="2" width="3" height="14" rx="0.5" />
              </svg>
            ) : (
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
          <div className="pointer-events-none relative mt-[80px] w-full max-w-[500px] lg:max-w-[600px] aspect-[8/6] z-[99] overflow-visible scale-110 lg:scale-[1.35] bg-transparent isolate">
            <CanvasVideo src={CENTER_VIDEO} className="h-full w-full" />
          </div>
          <h1 className="text-glow relative z-20 max-w-5xl font-serif text-[32px] font-bold leading-[1.05] tracking-tight text-white sm:text-[42px] md:text-[60px] lg:text-[76px] mt-6">
            Custom Software &{" "}
            <span className="italic bg-gradient-to-r from-[#d9b8ff] via-[#cc7aff] to-[#ff9f7a] bg-clip-text text-transparent drop-shadow-sm">
              AI Development
            </span>{" "}
            <br />{" "}
            <span className="font-semibold text-white/95 text-[24px] md:text-[40px]">
              USA & Dallas, TX
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[14px] sm:text-[15px] leading-[1.55] text-white/85 px-2">
            We empower enterprises with custom AI software, generative AI, automation systems,
            SaaS, and dedicated engineering teams to drive digital transformation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[180svh] w-full z-10" style={{ zIndex: 10 }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-visible noise-overlay">
        {/* Gradient mask at the top of the viewport to fade out content scrolling behind header */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#180028] via-[#180028]/80 to-transparent z-[20]" />

        {/* Center radial glow behind video */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] md:h-[800px] md:w-[800px] -translate-x-1/2 -translate-y-1/2">
          <div className="h-full w-full opacity-90" style={{ background: "var(--grad-glow)" }} />
        </div>

        {/* Center hero video — sits below gradient mask and headline */}
        <div className="pointer-events-none absolute left-1/2 top-[12%] mt-[100px] sm:mt-[130px] md:mt-[150px] z-[10] w-full max-w-[500px] lg:max-w-[600px] aspect-[8/6] -translate-x-1/2 overflow-visible scale-110 lg:scale-[1.35] bg-transparent isolate">
          <CanvasVideo
            src={CENTER_VIDEO}
            isPlaying={isCenterVideoPlaying}
            className="h-full w-full"
          />
        </div>

        {/* Headline — sits on top of video, below gradient mask */}
        <h1 className="text-glow absolute left-1/2 top-[14%] z-[15] w-full max-w-[1800px] -translate-x-1/2 px-4 sm:px-6 text-center font-serif text-[28px] sm:text-[38px] font-bold leading-[1.05] tracking-tight text-white md:text-[60px] lg:text-[76px] mt-[20px] sm:mt-[30px]">
          Digital{" "}
          <span className="italic bg-gradient-to-r from-[#d9b8ff] via-[#cc7aff] to-[#ff9f7a] bg-clip-text text-transparent drop-shadow-sm">
            Evolution
          </span>{" "}
          <span className="font-semibold text-white/95">for Business</span>
        </h1>

        {/* Left content — hidden on small screens */}
        <div
          ref={leftTextRef}
          className="absolute left-6 top-[42%] mt-[70px] z-20 max-w-[280px] hidden md:block md:left-12"
        >
          <p className="text-[14px] leading-[1.55] text-white/85">
            Our{" "}
            <a
              href="#"
              className="underline decoration-white/60 underline-offset-4 hover:decoration-white"
            >
              creative studio
            </a>{" "}
            helps enterprise brands and market leaders navigate digital, evolve profitably, and
            launch unforgettable websites, products, and campaigns.
          </p>
        </div>

        {/* Cinematic Sizzle Reel — exact original layout/shadow/radius driven via GPU transform */}
        <div
          ref={sizzleCardRef}
          style={{
            width: endWidth,
            height: endHeight,
            left: CARD_LEFT,
            top: startTop,
            transformOrigin: "top left",
            transform: `translate3d(0px, 0px, 0) scale(${startScale})`,
            willChange: "transform",
            backfaceVisibility: "hidden",
            contain: "layout style",
          }}
          className="absolute z-[99]"
        >
          {/* Static shadow rasterized once at full size and scaled on GPU */}
          <div className="pointer-events-none absolute inset-0 rounded-[24px] shadow-[0_30px_100px_rgba(0,0,0,0.8)]" />
          {/* Video clip layer — fixed video dimensions, exact 24px -> 0px visual corners */}
          <div
            ref={sizzleClipRef}
            style={{ borderRadius: `${initialRadius}px` }}
            className="relative h-full w-full overflow-hidden bg-[#0e0228]"
          >
            <HeroVideoFrame isPlaying={isCardVideoPlaying} />
            <div
              style={{ borderRadius: "inherit" }}
              className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-white/15"
            />
          </div>
        </div>

        {/* Right logo slider — desktop only */}
        <div
          ref={logosRef}
          className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 lg:block mt-[80px]"
        >
          <div
            ref={desktopTickerRef}
            className="relative h-[100px] w-[35vw] overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div
              className="animate-scroll-left flex h-full w-max flex-row flex-nowrap items-center hover:[animation-play-state:paused]"
              style={{
                animationDuration: "20s",
                animationPlayState: desktopTickerInView ? "running" : "paused",
                willChange: "transform",
              }}
            >
              {[1, 2].map((set) => (
                <div
                  key={set}
                  className="flex w-max flex-nowrap items-center gap-10 pr-10 pl-10"
                >
                  {CLIENT_LOGOS.map((logo, i) => (
                    <div
                      key={i}
                      className="flex shrink-0 items-center justify-center whitespace-nowrap px-3"
                    >
                      <img
                        src={logo}
                        alt={`Client Logo ${i}`}
                        decoding="async"
                        className="h-14 lg:h-16 w-auto max-w-[120px] lg:max-w-[150px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
                        style={{ filter: "brightness(0) invert(1)" }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-6 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 z-20 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-white/50 pointer-events-none"
        >
          Scroll to explore
        </div>
      </div>
    </div>
  );
}
