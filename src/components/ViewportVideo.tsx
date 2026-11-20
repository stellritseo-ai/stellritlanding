import { useEffect, useRef, type VideoHTMLAttributes } from "react";
import { useInViewActive } from "@/hooks/use-in-view-active";

interface ViewportVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  rootMargin?: string;
}

/**
 * Drop-in <video> replacement for decorative/looping videos that automatically
 * pauses decoding when scrolled off-screen or when the browser tab is hidden,
 * and uses preload="metadata" so off-screen videos don't stall initial load.
 */
export function ViewportVideo({
  src,
  rootMargin = "200px",
  preload = "metadata",
  ...rest
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isActive = useInViewActive(videoRef, rootMargin);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload={preload}
      {...rest}
    />
  );
}

