import { useEffect, useRef, useState } from "react";

interface CanvasVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CanvasVideo({ src, className, style }: CanvasVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted and playsinline programmatically for mobile autoplay
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.muted = true;
    video.defaultMuted = true;

    const attemptPlay = () => {
      video.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Video play was prevented:", err);
        });
    };

    attemptPlay();

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handlePlaying = () => setIsPlaying(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("loadedmetadata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);

    // Document fallback for mobile autoplay restriction
    const handleTouch = () => {
      if (video.paused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      document.removeEventListener("touchstart", handleTouch);
    };
    document.addEventListener("touchstart", handleTouch);

    if (!video.paused) {
      setIsPlaying(true);
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("loadedmetadata", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
      document.removeEventListener("touchstart", handleTouch);
    };
  }, [src]);

  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId: number;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        // Render at a max resolution of 720px for optimal Retina sharpness + smooth mobile frame rate
        let targetWidth = video.videoWidth;
        let targetHeight = video.videoHeight;
        const maxDim = 720;
        if (targetWidth > maxDim) {
          const ratio = maxDim / targetWidth;
          targetWidth = maxDim;
          targetHeight = Math.round(targetHeight * ratio);
        }

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }

        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const len = data.length;

          // Compression noise threshold
          const threshold = 16;

          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Determine maximum channel value
            const max = r > g ? (r > b ? r : b) : (g > b ? g : b);

            if (max <= threshold) {
              data[i + 3] = 0; // Fully transparent
            } else {
              // Smooth screen blend simulation
              const adjustedMax = ((max - threshold) * 255) / (255 - threshold);
              const factor = max / 255;
              
              // Premultiply color components to simulate screen blending natively
              data[i] = Math.min(255, Math.round(r / factor));
              data[i + 1] = Math.min(255, Math.round(g / factor));
              data[i + 2] = Math.min(255, Math.round(b / factor));
              data[i + 3] = Math.round(adjustedMax);
            }
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (e) {
          console.error("Canvas video render frame error:", e);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute pointer-events-none"
        style={{ width: "1px", height: "1px", opacity: 0, top: "-10px", left: "-10px" }}
      />
      <canvas
        ref={canvasRef}
        className={className}
        style={style}
      />
    </>
  );
}


