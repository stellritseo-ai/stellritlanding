import { useEffect, useRef } from "react";

interface CanvasVideoProps {
  src: string;
  fallbackMp4?: string;
  className?: string;
  style?: React.CSSProperties;
  isPlaying?: boolean;
}

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

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    let animationFrameId: number;
    // Offscreen small canvas for FAST pixel keying at 25% resolution
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    const ctx = canvas.getContext("2d", { alpha: true });
    const SCALE = 0.35; // Key at 35% resolution — fast yet clean

    const renderLoop = () => {
      if (video.readyState >= 2 && ctx && offCtx) {
        const vw = video.videoWidth || 480;
        const vh = video.videoHeight || 480;
        const sw = Math.floor(vw * SCALE);
        const sh = Math.floor(vh * SCALE);

        // Sync display canvas size
        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }

        // Sync offscreen canvas size
        if (offscreen.width !== sw || offscreen.height !== sh) {
          offscreen.width = sw;
          offscreen.height = sh;
        }

        // Step 1: Draw video at reduced resolution into offscreen canvas
        offCtx.clearRect(0, 0, sw, sh);
        offCtx.drawImage(video, 0, 0, sw, sh);

        // Step 2: Pixel key — strip black pixels into alpha=0 (at low res, very fast)
        try {
          const imgData = offCtx.getImageData(0, 0, sw, sh);
          const d = imgData.data;
          const len = d.length;
          for (let i = 0; i < len; i += 4) {
            const maxRGB = d[i] > d[i + 1] ? (d[i] > d[i + 2] ? d[i] : d[i + 2]) : (d[i + 1] > d[i + 2] ? d[i + 1] : d[i + 2]);
            if (maxRGB < 40) {
              d[i + 3] = Math.floor((maxRGB / 40) * d[i + 3]);
            }
          }
          offCtx.putImageData(imgData, 0, 0);
        } catch (_) {}

        // Step 3: Upscale the keyed frame to full display canvas
        ctx.clearRect(0, 0, vw, vh);
        ctx.drawImage(offscreen, 0, 0, vw, vh);
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    const attemptPlay = () => {
      if (isPlaying) {
        const promise = video.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              animationFrameId = requestAnimationFrame(renderLoop);
            })
            .catch(() => {
              const retry = () => {
                video.play().then(() => {
                  animationFrameId = requestAnimationFrame(renderLoop);
                }).catch(() => {});
                window.removeEventListener("touchstart", retry);
                window.removeEventListener("click", retry);
                window.removeEventListener("scroll", retry);
              };
              window.addEventListener("touchstart", retry, { once: true, passive: true });
              window.addEventListener("click", retry, { once: true, passive: true });
              window.addEventListener("scroll", retry, { once: true, passive: true });
            });
        }
      } else {
        video.pause();
        cancelAnimationFrame(animationFrameId);
      }
    };

    attemptPlay();
    video.addEventListener("loadedmetadata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("loadedmetadata", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
    };
  }, [src, fallbackMp4, isPlaying]);

  const isWebm = src.endsWith(".webm") || src.includes("webm");

  return (
    <div className={className} style={{ position: "relative", ...style }}>
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
        style={{ display: "none" }}
      >
        {isWebm && <source src={src} type="video/webm" />}
        {fallbackMp4 && <source src={fallbackMp4} type="video/mp4" />}
        {!isWebm && <source src={src} type="video/mp4" />}
      </video>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          mixBlendMode: "screen",
          WebkitMixBlendMode: "screen",
          pointerEvents: "none",
          display: "block",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          willChange: "transform",
          imageRendering: "auto",
        }}
      />
    </div>
  );
}
