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
      if (video.paused || video.ended) return;

      // Downscale video frames on canvas to optimize luma key performance
      let targetWidth = video.videoWidth || 480;
      let targetHeight = video.videoHeight || 300;
      const maxDim = 480;
      if (targetWidth > maxDim) {
        const ratio = maxDim / targetWidth;
        targetWidth = maxDim;
        targetHeight = Math.round(targetHeight * ratio);
      }

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      if (canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Apply luma key to key out black background to true transparent pixels
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate brightness (luminance)
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          
          if (luma < 10) {
            data[i + 3] = 0; // Pure black = transparent
          } else if (luma < 30) {
            data[i + 3] = ((luma - 10) / 20) * 255; // Smooth edge blending
          }
        }
        ctx.putImageData(imgData, 0, 0);
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
        className="hidden absolute pointer-events-none"
        style={{ width: 1, height: 1, opacity: 0 }}
      />
      <canvas
        ref={canvasRef}
        className={className}
      />
    </>
  );
}
