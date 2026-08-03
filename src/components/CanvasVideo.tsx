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

    // Enforce programmatically muted playsInline for iOS Safari
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    let animationFrameId: number;
    let lastTime = 0;
    const ctx = canvas.getContext("2d", { alpha: true });

    const renderLoop = (timestamp: number) => {
      // Smooth 60fps GPU draw loop
      if (timestamp - lastTime >= 15) {
        lastTime = timestamp;
        if (video.readyState >= 2 && ctx) {
          const w = video.videoWidth || 480;
          const h = video.videoHeight || 480;
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          ctx.clearRect(0, 0, w, h);
          ctx.drawImage(video, 0, 0, w, h);
        }
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
                video
                  .play()
                  .then(() => {
                    animationFrameId = requestAnimationFrame(renderLoop);
                  })
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
      {/* Hidden decoding video element */}
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
      {/* GPU hardware-accelerated 60 FPS canvas with mixBlendMode screen */}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-contain"
        style={{
          mixBlendMode: "screen",
          WebkitMixBlendMode: "screen",
          pointerEvents: "none",
          display: "block",
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
