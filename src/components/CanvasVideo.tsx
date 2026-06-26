import { useEffect, useRef } from "react";

interface CanvasVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  isPlaying?: boolean;
}

export function CanvasVideo({ src, className, style, isPlaying = true }: CanvasVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      if (isPlaying) {
        video.play().catch((err) => {
          console.warn("Video play was prevented:", err);
        });
      } else {
        video.pause();
      }
    }
  }, [src, isPlaying]);

  const isWebm = src.endsWith(".webm") || src.includes("webm");
  const type = isWebm ? "video/webm" : "video/mp4";

  return (
    <video
      ref={videoRef}
      autoPlay={isPlaying}
      muted
      loop
      playsInline
      preload="auto"
      className={className}
      style={style}
    >
      <source src={src} type={type} />
    </video>
  );
}
