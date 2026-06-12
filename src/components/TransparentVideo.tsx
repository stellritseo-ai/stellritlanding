import { useEffect, useRef } from "react";

interface TransparentVideoProps {
  src: string;
  className?: string;
}

export function TransparentVideo({ src, className }: TransparentVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on iOS
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={className}
      style={{
        mixBlendMode: "screen", // Screen blend mode drops black background
        WebkitMixBlendMode: "screen",
        transform: "translate3d(0, 0, 0)", // Force GPU compositing layer to fix Safari bug
        WebkitTransform: "translate3d(0, 0, 0)",
        filter: "contrast(1.05)", // Push near-blacks to pure black
        pointerEvents: "none",
        backgroundColor: "transparent",
      }}
    />
  );
}
