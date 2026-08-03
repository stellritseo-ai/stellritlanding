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
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const renderLoop = () => {
      if (video.readyState >= 2 && ctx) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 600;
          canvas.height = video.videoHeight || 600;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert black background pixels (#000000) to true transparent alpha channel
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          const len = d.length;
          for (let i = 0; i < len; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            const maxRGB = Math.max(r, g, b);
            if (maxRGB < 32) {
              // Smoothly fade out dark background pixels to transparent alpha 0
              d[i + 3] = Math.floor((maxRGB / 32) * d[i + 3]);
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (err) {
          // Fallback if canvas security context prevents getImageData
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
              renderLoop();
            })
            .catch(() => {
              const retry = () => {
                video
                  .play()
                  .then(() => renderLoop())
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
      {/* 2D Canvas with physical alpha transparency + mixBlendMode screen */}
      <canvas
        ref={canvasRef}
        className="h-full w-full object-contain"
        style={{
          mixBlendMode: "screen",
          WebkitMixBlendMode: "screen",
          pointerEvents: "none",
          display: "block",
        }}
      />
    </div>
  );
}
