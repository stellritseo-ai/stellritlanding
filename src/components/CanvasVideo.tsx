import { useEffect, useRef } from "react";

interface CanvasVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CanvasVideo({ src, className, style }: CanvasVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.warn("Video play was prevented:", err);
      });
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={className}
      style={style}
    />
  );
}

