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

      // Match canvas size to video size if different
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        if (video.videoWidth && video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      }

      if (canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
