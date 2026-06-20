import { useEffect, useRef, useState } from "react";

interface CanvasVideoProps {
  src: string;
  className?: string;
}

export function CanvasVideo({ src, className }: CanvasVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start video playback
    video.play().catch(console.error);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handlePlaying = () => setIsPlaying(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("playing", handlePlaying);

    // If already playing
    if (!video.paused) {
      setIsPlaying(true);
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("playing", handlePlaying);
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

      // Check if video is loaded and ready
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        // Render at a higher resolution (max 960px width) for Retina screens
        let targetWidth = video.videoWidth;
        let targetHeight = video.videoHeight;
        const maxDim = 960;
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

          // Apply luma key to key out black background to true transparent pixels
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          const len = data.length;
          
          for (let i = 0; i < len; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Fast-path: key out dark pixels and compression noise immediately (covers ~82% of frames)
            if (r < 75 && g < 75 && b < 75) {
              data[i + 3] = 0; // Fully transparent
              continue;
            }
            
            // Fast integer math approximation of luminance: (r * 0.299 + g * 0.587 + b * 0.114)
            const luma = (r * 77 + g * 150 + b * 29) >> 8;
            
            if (luma < 105) {
              data[i + 3] = ((luma - 75) / 30) * 255; // Smooth edge blending
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
      />
    </>
  );
}
