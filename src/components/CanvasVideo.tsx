import { useEffect, useRef } from "react";

interface CanvasVideoProps {
  src: string;
  fallbackMp4?: string;
  className?: string;
  style?: React.CSSProperties;
  isPlaying?: boolean;
}

export function CanvasVideo({
  src,
  fallbackMp4,
  className,
  style,
  isPlaying = true,
}: CanvasVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set all critical attributes programmatically for iOS Safari autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const attemptPlay = () => {
      if (isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser blocks initial un-promoted autoplay, retry on user interaction
            const resumePlay = () => {
              video.play().catch(() => {});
              window.removeEventListener("touchstart", resumePlay);
              window.removeEventListener("click", resumePlay);
              window.removeEventListener("scroll", resumePlay);
            };
            window.addEventListener("touchstart", resumePlay, { once: true, passive: true });
            window.addEventListener("click", resumePlay, { once: true, passive: true });
            window.addEventListener("scroll", resumePlay, { once: true, passive: true });
          });
        }
      } else {
        video.pause();
      }
    };

    attemptPlay();

    video.addEventListener("loadedmetadata", attemptPlay);
    video.addEventListener("canplay", attemptPlay);

    return () => {
      video.removeEventListener("loadedmetadata", attemptPlay);
      video.removeEventListener("canplay", attemptPlay);
    };
  }, [src, fallbackMp4, isPlaying]);

  const isWebm = src.endsWith(".webm") || src.includes("webm");

  return (
    <video
      ref={videoRef}
      autoPlay={isPlaying}
      muted
      loop
      playsInline
      // @ts-ignore
      webkit-playsinline="true"
      controls={false}
      preload="auto"
      className={className}
      style={style}
    >
      {isWebm && <source src={src} type="video/webm" />}
      {fallbackMp4 && <source src={fallbackMp4} type="video/mp4" />}
      {!isWebm && <source src={src} type="video/mp4" />}
    </video>
  );
}
