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
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch((err) => {
        console.warn("Video play was prevented:", err);
      });
    }
  }, [src]);

  const isWebm = src.endsWith(".webm") || src.includes("webm");
  const type = isWebm ? "video/webm" : "video/mp4";

  return (
    <video
      ref={videoRef}
      autoPlay
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
