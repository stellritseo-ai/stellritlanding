import { useEffect, useRef, useState } from "react";

interface TransparentVideoProps {
  src: string;
  className?: string;
}

export function TransparentVideo({ src, className }: TransparentVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animationFrameId: number;
    // willReadFrequently is important for getImageData performance
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const processFrame = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      if (video.readyState >= 2 && video.videoWidth > 0) {
        // Match canvas resolution to video resolution for high quality
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const width = canvas.width;
        const height = canvas.height;

        ctx.drawImage(video, 0, 0, width, height);

        try {
          const frame = ctx.getImageData(0, 0, width, height);
          const data = frame.data;
          const len = data.length;

          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Calculate alpha based on the brightest channel to simulate additive blending
            const maxColor = Math.max(r, g, b);
            
            // If it's completely black, make it fully transparent
            if (maxColor === 0) {
              data[i + 3] = 0;
            } else {
              // Scale the color up so it becomes a bright color with opacity
              // This completely prevents the "black shadow" effect because dark pixels
              // become bright pixels with very low opacity, adding light instead of shadow!
              data[i] = (r * 255) / maxColor;
              data[i + 1] = (g * 255) / maxColor;
              data[i + 2] = (b * 255) / maxColor;
              data[i + 3] = maxColor; // Alpha becomes the brightness
            }
          }
          ctx.putImageData(frame, 0, 0);
        } catch (e) {
          console.error("Canvas transparent video error:", e);
          setError(true);
        }
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      processFrame();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("playing", handlePlay);

    // Force play in case browser autoplay policy delayed it
    video.play().catch((err) => {
      console.warn("Video play was prevented:", err);
    });

    if (!video.paused) {
      processFrame();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("playing", handlePlay);
    };
  }, [src]);

  // Fallback to normal video if canvas processing errors (e.g. CORS)
  if (error) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className={className}
        style={{ mixBlendMode: "screen", WebkitMixBlendMode: "screen" }}
      />
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className || "w-full h-full"}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        style={{
          opacity: 0,
          width: "1px",
          height: "1px",
          position: "absolute",
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // Standard alpha blending, no mix-blend-mode needed!
        }}
      />
    </div>
  );
}
