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
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { TransparentVideo } from "./TransparentVideo";
import { CanvasVideo } from "./CanvasVideo";
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

const CENTER_VIDEO =
  "https://isadoradigitalagency.com/wp-content/uploads/2025/04/ISA_FLOR_04__444.webm";
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
    stiffness: 150,
    damping: 38,
    mass: 0.2,
    restDelta: 0.0001
  });

  const p = smoothProgress;

  // Phase 2-3: left video card expands to fit screen (centered, with gutters)
  const [vp, setVp] = useState({ w: 1280, h: 720 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
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

  const mobileSizzleRef = useRef<HTMLVideoElement>(null);
  const [isMobileSizzlePlaying, setIsMobileSizzlePlaying] = useState(true);

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
    if (isMobile && mobileSizzleRef.current) {
      mobileSizzleRef.current.play().catch((err) => {
        console.warn("Mobile sizzle play prevented:", err);
      });
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="relative w-full bg-[#0c0428] px-6 py-12 flex flex-col items-center text-center gap-10 overflow-hidden">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2" style={{ background: "var(--grad-glow)", opacity: 0.6 }} />

        {/* Headline */}
        <h1 className="text-glow z-10 max-w-lg font-serif text-[36px] sm:text-[42px] font-normal leading-[1.15] tracking-tight text-white mt-16 px-4">
          Digital Evolution for <br /> Business
        </h1>

        {/* Center 3D Flower Video with SVG Glow */}
        <div className="pointer-events-none relative w-full aspect-[16/10] z-10 overflow-visible bg-transparent my-2">
          {/* SVG Glow Background */}
          <svg
            className="absolute top-1/2 left-1/2 w-[140%] h-[140%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-75"
            viewBox="0 0 929 1031"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.7" filter="url(#filter0_f_7187_16734_mobile)">
              <mask id="mask0_7187_16734_mobile" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="210" y="189" width="509" height="632">
                <path d="M341.083 235.644C459.314 149.684 604.547 187.719 665.468 320.596L692.048 378.572C752.969 511.45 706.51 688.853 588.278 774.813C470.046 860.773 324.814 822.738 263.893 689.861L237.312 631.885C176.391 499.008 222.851 321.605 341.083 235.644Z" fill="url(#paint0_linear_7187_16734_mobile)"></path>
              </mask>
              <g mask="url(#mask0_7187_16734_mobile)">
                <g filter="url(#filter1_f_7187_16734_mobile)">
                  <path d="M485.757 631.657C515.392 768.555 278.311 809.003 231.389 793.446C180.35 775.816 71.8528 711.308 46.169 594.323C14.0643 448.091 117.787 311.193 211.632 233.41C305.477 155.627 431.426 336.084 399.321 420.089C367.217 504.095 456.122 494.759 485.757 631.657Z" fill="#FF92C2"></path>
                </g>
                <g filter="url(#filter2_f_7187_16734_mobile)">
                  <path d="M636.493 555.245C762.127 589.979 708.508 703.201 674.753 779.933C620.392 845.922 502.791 897.673 446.225 866.121C346.298 810.384 282.864 730.092 255.356 617.55C227.848 505.007 309.757 449.506 368.97 521.392C428.182 593.277 510.859 520.51 636.493 555.245Z" fill="#A1AFFF"></path>
                </g>
                <g filter="url(#filter3_f_7187_16734_mobile)">
                  <path d="M630.157 649.243C588.786 333.288 259.504 440.763 127.198 445.133C232.395 240.052 638.784 -0.546038 780.463 230.907C863.217 366.1 843.806 502.088 742.675 677.543C641.545 852.997 644.155 756.147 630.157 649.243Z" fill="#6337D8"></path>
                </g>
                <g filter="url(#filter4_f_7187_16734_mobile)">
                  <path d="M686.182 515.232C763.84 535.839 729.699 608.733 708.163 658.102C673.929 700.873 600.579 735.341 565.738 715.911C504.189 681.588 465.467 631.149 449.282 559.692C433.096 488.233 484.336 451.814 520.504 496.942C556.673 542.07 608.524 494.626 686.182 515.232Z" fill="#A21844"></path>
                </g>
              </g>
            </g>
            <defs>
              <filter id="filter0_f_7187_16734_mobile" x="0.515625" y="-20.3457" width="928.332" height="1051.15" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur stdDeviation="105" result="effect1_foregroundBlur_7187_16734"></feGaussianBlur>
              </filter>
              <filter id="filter1_f_7187_16734_mobile" x="-13.7891" y="160.387" width="556.102" height="690.199" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_7187_16734"></feGaussianBlur>
              </filter>
              <filter id="filter2_f_7187_16734_mobile" x="195.871" y="435.168" width="573.66" height="494.451" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_7187_16734"></feGaussianBlur>
              </filter>
              <filter id="filter3_f_7187_16734_mobile" x="73.1992" y="82.2617" width="812.984" height="745.904" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_7187_16734"></feGaussianBlur>
              </filter>
              <filter id="filter4_f_7187_16734_mobile" x="392.207" y="423.088" width="396.301" height="352.379" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur stdDeviation="27" result="effect1_foregroundBlur_7187_16734"></feGaussianBlur>
              </filter>
              <linearGradient id="paint0_linear_7187_16734_mobile" x1="663.887" y1="439.496" x2="221.229" y2="551.25" gradientUnits="userSpaceOnUse">
                <stop offset="0.012844" stopColor="#D7DCFC"></stop>
                <stop offset="0.5044" stopColor="#BEA7FF"></stop>
                <stop offset="1" stopColor="#E98EB9"></stop>
              </linearGradient>
            </defs>
          </svg>
          <CanvasVideo
            src={CENTER_VIDEO}
            className="relative z-10 h-full w-full object-cover"
          />
        </div>

        {/* Description Text */}
        <div className="z-10 max-w-xl px-4">
          <p className="text-[15px] sm:text-[16px] leading-[1.55] text-white/80 font-sans font-light">
            Our <a href="#" className="underline decoration-white/40 underline-offset-4 hover:text-white font-normal text-white">web design agency</a> helps enterprise brands and market leaders navigate digital, evolve profitably, and launch unforgettable websites, products, and campaigns.
          </p>
        </div>

        {/* Client Logos Row */}
        <div className="z-10 w-full flex items-center justify-center gap-12 py-4 px-4 opacity-80">
          <img src={logo2} alt="Honest" className="h-6 w-auto object-contain brightness-0 invert opacity-80" />
          <img src={logo6} alt="Logitech" className="h-6 w-auto object-contain brightness-0 invert opacity-80" />
          <img src={logo11} alt="Popcornopolis" className="h-8 w-auto object-contain brightness-0 invert opacity-80" />
        </div>

        {/* Splay Video Card (Reel) with Play/Pause button */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0e0228] z-10 border border-white/10">
          <video
            ref={mobileSizzleRef}
            src={LEFT_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
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

        {/* Awards Footer */}
        <div className="z-10 w-full flex flex-row flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 mt-6 px-2">
          <div className="flex flex-row items-center gap-6">
            {/* Webby Badge */}
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 65 130" fill="none" className="opacity-75">
                <path fillRule="evenodd" clipRule="evenodd" d="M25.8327 0.764998C15.1323 8.56497 12.6342 15.7539 13.5821 25.409C18.2541 22.2642 23.568 11.7881 25.8327 0.764998ZM20.3573 68.7135C17.7726 70.6448 12.8724 79.3931 18.7908 88.2555C21.9969 83.1884 23.9753 74.8749 20.3573 68.7135ZM26.937 100.619C29.5257 96.0635 30.3368 87.4411 25.4843 80.8048C20.0144 87.3248 22.9785 96.3954 26.937 100.619ZM17.1956 56.5197C11.8078 58.5591 10.7122 67.9656 12.7414 73.317C16.7936 69.3782 20.1612 64.1907 17.1956 56.5197ZM18.284 45.0669C15.1555 45.5543 8.72868 50.3307 9.73098 59.0402C14.0148 56.6639 19.6702 51.0488 18.284 45.0669ZM20.3058 32.3367C18.0196 32.5751 10.8922 36.6197 10.3996 46.0109C14.8918 44.4059 20.5541 40.8627 20.3058 32.3367ZM12.3579 33.8076C16.5219 32.7178 23.5998 26.3451 23.6011 20.1359C19.5069 20.6185 13.3313 26.9263 12.3579 33.8076ZM27.5735 102.304C22.7199 95.7788 13.7919 92.0939 9.09093 93.115C13.261 104.274 22.9883 104.062 27.5735 102.304ZM37.2552 110.825C38.6848 105.832 38.1818 96.7634 32.4708 94.0646C30.5261 96.5921 28.8662 104.441 37.2552 110.825ZM39.0342 112.828C35.2241 109.961 25.7003 105.267 18.7528 107.372C26.1794 117.053 36.5533 114.34 39.0342 112.828ZM49.1283 118.751C49.5863 113.507 48.0419 106.304 40.8395 103.374C39.528 106.035 39.2339 113.867 49.1283 118.751ZM51.0055 120.372C46.5954 118.254 34.1862 114.486 27.8881 117.966C37.4506 127.568 48.8989 122.257 51.0055 120.372ZM64.2195 124.92C64.0559 118.055 57.7785 113.894 52.6633 111.722C51.0401 118.22 57.1002 123.117 64.2195 124.92ZM44.4013 125.345C57.0752 133.03 63.4434 128.989 64.0488 125.823C59.2978 124.564 47.8971 121.847 44.4013 125.345ZM17.8799 90.1986C12.0867 89.1426 1.72052 87.2529 4.06116 76.7043C9.49774 77.4343 17.5734 87.7061 18.8821 90.3838C18.5675 90.324 18.2322 90.2628 17.8799 90.1986ZM0.662074 60.003C-1.33164 69.1195 5.48464 75.0804 12.8668 76.2371C11.4275 71.4085 7.00777 61.9522 0.662074 60.003ZM9.21423 60.4826C9.23284 60.7362 9.25079 60.9809 9.26912 61.2154C5.16704 59.9331 -0.933862 53.078 2.94078 45.2564C8.41167 49.5446 8.90437 56.2595 9.21423 60.4826ZM9.57706 47.8226C10.0055 43.4663 8.7953 34.4396 4.93434 32.3741C-0.157808 41.8829 6.88982 46.5238 9.57706 47.8226ZM11.1446 36.7791C12.1529 32.9159 14.177 23.8187 9.88718 17.5089C3.9982 29.2145 9.29386 35.4111 11.1446 36.7791Z" fill="#F1DECC"></path>
              </svg>
              <img src="https://isadoradigitalagency.com/wp-content/uploads/2025/04/Webby-1.svg" alt="Webby" className="h-6 w-auto object-contain" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 65 130" fill="none" className="opacity-75">
                <path fillRule="evenodd" clipRule="evenodd" d="M39.1673 0.764998C49.8677 8.56497 52.3658 15.7539 51.4179 25.409C46.7459 22.2642 41.432 11.7881 39.1673 0.764998ZM44.6427 68.7135C47.2274 70.6448 52.1276 79.3931 46.2092 88.2555C43.0031 83.1884 41.0247 74.8749 44.6427 68.7135ZM38.063 100.619C35.4743 96.0635 34.6632 87.4411 39.5157 80.8048C44.9856 87.3248 42.0215 96.3954 38.063 100.619ZM47.8044 56.5197C53.1922 58.5591 54.2878 67.9656 52.2586 73.317C48.2064 69.3782 44.8388 64.1907 47.8044 56.5197ZM46.716 45.0669C49.8445 45.5543 56.2713 50.3307 55.269 59.0402C50.9852 56.6639 45.3298 51.0488 46.716 45.0669ZM44.6942 32.3367C46.9804 32.5751 54.1078 36.6197 54.6004 46.0109C50.1082 44.4059 44.4459 40.8627 44.6942 32.3367ZM52.6421 33.8076C48.4781 32.7178 41.4002 26.3451 41.3989 20.1359C45.4931 20.6185 51.6687 26.9263 52.6421 33.8076ZM37.4265 102.304C42.2801 95.7788 51.2081 92.0939 55.9091 93.115C51.739 104.274 42.0117 104.062 37.4265 102.304ZM27.7448 110.825C26.3152 105.832 26.8182 96.7634 32.5292 94.0646C34.4739 96.5921 36.1338 104.441 27.7448 110.825ZM25.9658 112.828C29.7759 109.961 39.2997 105.267 46.2472 107.372C38.8206 117.053 28.4467 114.34 25.9658 112.828ZM15.8717 118.751C15.4137 113.507 16.9581 106.304 24.1605 103.374C25.472 106.035 25.7661 113.867 15.8717 118.751ZM13.9945 120.372C18.4046 118.254 30.8138 114.486 37.1119 117.966C27.5494 127.568 16.1011 122.257 13.9945 120.372ZM0.780484 124.92C0.94413 118.055 7.2215 113.894 12.3367 111.722C13.9599 118.22 7.89979 123.117 0.780484 124.92ZM20.5987 125.345C7.92484 133.03 1.55662 128.989 0.951206 125.823C5.70218 124.564 17.1029 121.847 20.5987 125.345ZM47.1201 90.1986C52.9133 89.1426 63.2795 87.2529 60.9388 76.7043C55.5023 77.4343 47.4266 87.7061 46.1179 90.3838C46.4325 90.324 46.7678 90.2628 47.1201 90.1986ZM64.3379 60.003C66.3316 69.1195 59.5154 75.0804 52.1332 76.2371C53.5725 71.4085 57.9922 61.9522 64.3379 60.003ZM55.7858 60.4826C55.7672 60.7362 55.7492 60.9809 55.7309 61.2154C59.833 59.9331 65.9339 53.078 62.0592 45.2564C56.5883 49.5446 56.0956 56.2595 55.7858 60.4826ZM55.4229 47.8226C54.9945 43.4663 56.2047 34.4396 60.0657 32.3741C65.1578 41.8829 58.1102 46.5238 55.4229 47.8226ZM53.8554 36.7791C52.8471 32.9159 50.823 23.8187 55.1128 17.5089C61.0018 29.2145 55.7061 35.4111 53.8554 36.7791Z" fill="#F1DECC"></path>
              </svg>
            </div>

            {/* Awwwards Badge */}
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 65 130" fill="none" className="opacity-75">
                <path fillRule="evenodd" clipRule="evenodd" d="M25.8327 0.764998C15.1323 8.56497 12.6342 15.7539 13.5821 25.409C18.2541 22.2642 23.568 11.7881 25.8327 0.764998ZM20.3573 68.7135C17.7726 70.6448 12.8724 79.3931 18.7908 88.2555C21.9969 83.1884 23.9753 74.8749 20.3573 68.7135ZM26.937 100.619C29.5257 96.0635 30.3368 87.4411 25.4843 80.8048C20.0144 87.3248 22.9785 96.3954 26.937 100.619ZM17.1956 56.5197C11.8078 58.5591 10.7122 67.9656 12.7414 73.317C16.7936 69.3782 20.1612 64.1907 17.1956 56.5197ZM18.284 45.0669C15.1555 45.5543 8.72868 50.3307 9.73098 59.0402C14.0148 56.6639 19.6702 51.0488 18.284 45.0669ZM20.3058 32.3367C18.0196 32.5751 10.8922 36.6197 10.3996 46.0109C14.8918 44.4059 20.5541 40.8627 20.3058 32.3367ZM12.3579 33.8076C16.5219 32.7178 23.5998 26.3451 23.6011 20.1359C19.5069 20.6185 13.3313 26.9263 12.3579 33.8076ZM27.5735 102.304C22.7199 95.7788 13.7919 92.0939 9.09093 93.115C13.261 104.274 22.9883 104.062 27.5735 102.304ZM37.2552 110.825C38.6848 105.832 38.1818 96.7634 32.4708 94.0646C30.5261 96.5921 28.8662 104.441 37.2552 110.825ZM39.0342 112.828C35.2241 109.961 25.7003 105.267 18.7528 107.372C26.1794 117.053 36.5533 114.34 39.0342 112.828ZM49.1283 118.751C49.5863 113.507 48.0419 106.304 40.8395 103.374C39.528 106.035 39.2339 113.867 49.1283 118.751ZM51.0055 120.372C46.5954 118.254 34.1862 114.486 27.8881 117.966C37.4506 127.568 48.8989 122.257 51.0055 120.372ZM64.2195 124.92C64.0559 118.055 57.7785 113.894 52.6633 111.722C51.0401 118.22 57.1002 123.117 64.2195 124.92ZM44.4013 125.345C57.0752 133.03 63.4434 128.989 64.0488 125.823C59.2978 124.564 47.8971 121.847 44.4013 125.345ZM17.8799 90.1986C12.0867 89.1426 1.72052 87.2529 4.06116 76.7043C9.49774 77.4343 17.5734 87.7061 18.8821 90.3838C18.5675 90.324 18.2322 90.2628 17.8799 90.1986ZM0.662074 60.003C-1.33164 69.1195 5.48464 75.0804 12.8668 76.2371C11.4275 71.4085 7.00777 61.9522 0.662074 60.003ZM9.21423 60.4826C9.23284 60.7362 9.25079 60.9809 9.26912 61.2154C5.16704 59.9331 -0.933862 53.078 2.94078 45.2564C8.41167 49.5446 8.90437 56.2595 9.21423 60.4826ZM9.57706 47.8226C10.0055 43.4663 8.7953 34.4396 4.93434 32.3741C-0.157808 41.8829 6.88982 46.5238 9.57706 47.8226ZM11.1446 36.7791C12.1529 32.9159 14.177 23.8187 9.88718 17.5089C3.9982 29.2145 9.29386 35.4111 11.1446 36.7791Z" fill="#F1DECC"></path>
              </svg>
              <img src="https://isadoradigitalagency.com/wp-content/uploads/2025/04/Awwwards-1.svg" alt="Awwwards" className="h-5 w-auto object-contain" />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" viewBox="0 0 65 130" fill="none" className="opacity-75">
                <path fillRule="evenodd" clipRule="evenodd" d="M39.1673 0.764998C49.8677 8.56497 52.3658 15.7539 51.4179 25.409C46.7459 22.2642 41.432 11.7881 39.1673 0.764998ZM44.6427 68.7135C47.2274 70.6448 52.1276 79.3931 46.2092 88.2555C43.0031 83.1884 41.0247 74.8749 44.6427 68.7135ZM38.063 100.619C35.4743 96.0635 34.6632 87.4411 39.5157 80.8048C44.9856 87.3248 42.0215 96.3954 38.063 100.619ZM47.8044 56.5197C53.1922 58.5591 54.2878 67.9656 52.2586 73.317C48.2064 69.3782 44.8388 64.1907 47.8044 56.5197ZM46.716 45.0669C49.8445 45.5543 56.2713 50.3307 55.269 59.0402C50.9852 56.6639 45.3298 51.0488 46.716 45.0669ZM44.6942 32.3367C46.9804 32.5751 54.1078 36.6197 54.6004 46.0109C50.1082 44.4059 44.4459 40.8627 44.6942 32.3367ZM52.6421 33.8076C48.4781 32.7178 41.4002 26.3451 41.3989 20.1359C45.4931 20.6185 51.6687 26.9263 52.6421 33.8076ZM37.4265 102.304C42.2801 95.7788 51.2081 92.0939 55.9091 93.115C51.739 104.274 42.0117 104.062 37.4265 102.304ZM27.7448 110.825C26.3152 105.832 26.8182 96.7634 32.5292 94.0646C34.4739 96.5921 36.1338 104.441 27.7448 110.825ZM25.9658 112.828C29.7759 109.961 39.2997 105.267 46.2472 107.372C38.8206 117.053 28.4467 114.34 25.9658 112.828ZM15.8717 118.751C15.4137 113.507 16.9581 106.304 24.1605 103.374C25.472 106.035 25.7661 113.867 15.8717 118.751ZM13.9945 120.372C18.4046 118.254 30.8138 114.486 37.1119 117.966C27.5494 127.568 16.1011 122.257 13.9945 120.372ZM0.780484 124.92C0.94413 118.055 7.2215 113.894 12.3367 111.722C13.9599 118.22 7.89979 123.117 0.780484 124.92ZM20.5987 125.345C7.92484 133.03 1.55662 128.989 0.951206 125.823C5.70218 124.564 17.1029 121.847 20.5987 125.345ZM47.1201 90.1986C52.9133 89.1426 63.2795 87.2529 60.9388 76.7043C55.5023 77.4343 47.4266 87.7061 46.1179 90.3838C46.4325 90.324 46.7678 90.2628 47.1201 90.1986ZM64.3379 60.003C66.3316 69.1195 59.5154 75.0804 52.1332 76.2371C53.5725 71.4085 57.9922 61.9522 64.3379 60.003ZM55.7858 60.4826C55.7672 60.7362 55.7492 60.9809 55.7309 61.2154C59.833 59.9331 65.9339 53.078 62.0592 45.2564C56.5883 49.5446 56.0956 56.2595 55.7858 60.4826ZM55.4229 47.8226C54.9945 43.4663 56.2047 34.4396 60.0657 32.3741C65.1578 41.8829 58.1102 46.5238 55.4229 47.8226ZM53.8554 36.7791C52.8471 32.9159 50.823 23.8187 55.1128 17.5089C61.0018 29.2145 55.7061 35.4111 53.8554 36.7791Z" fill="#F1DECC"></path>
              </svg>
            </div>
          </div>

          <button className="rounded-lg bg-[#f1decc] px-4 py-2 text-[14px] font-sans font-normal text-[#210b39] transition hover:bg-[#e7d4c2] cursor-pointer">
            Cookie Settings
          </button>
        </div>

        {/* Website Domain Link */}
        <div className="z-10 w-full text-center text-[10px] text-white/40 font-sans tracking-wide -mt-6 pb-4">
          isadoradigitalagency.com
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
