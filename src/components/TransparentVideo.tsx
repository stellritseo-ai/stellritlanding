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
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set resolution for the chromakey operations
    const width = 360;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    const processFrame = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);

      try {
        const frame = ctx.getImageData(0, 0, width, height);
        const data = frame.data;
        const len = data.length;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Calculate perceived brightness
          const brightness = (r + g + b) / 3;

          // If pixel is near black, make it transparent
          if (brightness < 18) {
            data[i + 3] = 0; // alpha = 0
          } else if (brightness < 38) {
            // Smooth edge transition
            data[i + 3] = ((brightness - 18) / 20) * 255;
          }
        }
        ctx.putImageData(frame, 0, 0);
      } catch (e) {
        console.error("Canvas transparent video chromakey error:", e);
        setError(true);
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    const handlePlay = () => {
      processFrame();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("playing", handlePlay);

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
        style={{ mixBlendMode: "screen" }}
      />
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        crossOrigin="anonymous"
        className="hidden"
        style={{ display: "none", opacity: 0, width: 1, height: 1, position: "absolute" }}
      />
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
