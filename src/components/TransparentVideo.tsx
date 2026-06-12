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
        // A smooth radial mask fades the edges of the video's black background out,
        // creating the soft background shadow effect against the purple page
        maskImage: "radial-gradient(circle at center, black 35%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 70%)",
        pointerEvents: "none",
        // Hardware acceleration fix to ensure the mask renders smoothly
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    />
  );
}
