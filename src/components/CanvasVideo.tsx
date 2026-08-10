import { useEffect, useRef } from "react";

interface CanvasVideoProps {
  src: string;
  fallbackMp4?: string;
  className?: string;
  style?: React.CSSProperties;
  isPlaying?: boolean;
}

// Target 24fps for pixel-keying — visually identical to 60fps but ~60% less CPU work
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS; // ~41ms

export function CanvasVideo({
  src,
  fallbackMp4,
  className,
  style,
  isPlaying = true,
}: CanvasVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Force autoplay attributes on DOM element (required for iOS Safari)
    video.muted = true;
    (video as any).defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    // Canvas context with alpha transparency enabled
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
    let animationFrameId: number;
    let isRunning = false;
    let lastFrameTime = 0;

    const renderLoop = (timestamp: number) => {
      if (!isRunning) return;

      // Throttle: only do expensive pixel work when FRAME_INTERVAL has elapsed
      const elapsed = timestamp - lastFrameTime;
      if (elapsed >= FRAME_INTERVAL && video.readyState >= 2 && ctx) {
        lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);

        const vw = video.videoWidth || 480;
        const vh = video.videoHeight || 480;

        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }

        ctx.clearRect(0, 0, vw, vh);
        ctx.drawImage(video, 0, 0, vw, vh);

        // Pixel keying: remove black/near-black background
        // Using a generous threshold of 55 to catch dark video backgrounds
        // Soft feathered edges for natural blending
        try {
          const imgData = ctx.getImageData(0, 0, vw, vh);
          const d = imgData.data;
          const len = d.length;
          const THRESHOLD = 55;

          for (let i = 0; i < len; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            // Max channel brightness determines if pixel is "background black"
            const maxRGB = r > g ? (r > b ? r : b) : (g > b ? g : b);
            if (maxRGB < THRESHOLD) {
              // Smooth feather: alpha fades 0→1 as maxRGB goes 0→THRESHOLD
              d[i + 3] = Math.round((maxRGB / THRESHOLD) * 255);
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (_) {
          // Cross-origin or security error — silently continue without keying
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        lastFrameTime = 0;
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    const attemptPlay = () => {
      if (!isPlaying) {
        video.pause();
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
        return;
      }
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => startLoop())
          .catch(() => {
            // Browser blocked autoplay — retry on first user interaction
            const retry = () => {
              video
                .play()
                .then(() => startLoop())
                .catch(() => {});
              window.removeEventListener("touchstart", retry);
              window.removeEventListener("click", retry);
              window.removeEventListener("scroll", retry);
            };
            window.addEventListener("touchstart", retry, { once: true, passive: true });
            window.addEventListener("click", retry, { once: true, passive: true });
            window.addEventListener("scroll", retry, { once: true, passive: true });
          });
      }
    };

    video.addEventListener("loadedmetadata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);
    attemptPlay();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadedmetadata", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
    };
  }, [src, fallbackMp4, isPlaying]);

  const isWebm = src.endsWith(".webm") || src.includes("webm");

  return (
    <div
      className={className}
      style={{
        position: "relative",
        background: "transparent",
        // NO isolation — blend mode must reach parent background
        isolation: "auto",
        ...style,
      }}
    >
      {/* Hidden video element — draws into canvas, never shown directly */}
      <video
        ref={videoRef}
        autoPlay={isPlaying}
        muted
        loop
        playsInline
        // @ts-ignore
        webkit-playsinline="true"
        controls={false}
        preload="auto"
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
      >
        {isWebm && <source src={src} type="video/webm" />}
        {fallbackMp4 && <source src={fallbackMp4} type="video/mp4" />}
        {!isWebm && !fallbackMp4 && <source src={src} type="video/mp4" />}
      </video>

      {/* Canvas renders keyed transparent frames — black pixels removed */}
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: "transparent",
          // NO willChange or transform — these break blend mode compositing
        }}
      />
    </div>
  );
}
