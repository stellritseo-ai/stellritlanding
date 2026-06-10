/**
 * ParallaxText — large display text that drifts left or right on scroll.
 * Pure CSS scroll-driven animation using `animation-timeline: scroll()`.
 * Falls back to a static display on browsers that don't support it.
 * Zero JS, zero Framer Motion, GPU-only.
 */

type ParallaxTextProps = {
  text: string;
  dir?: "left" | "right";
  opacity?: number;
  className?: string;
};

export default function ParallaxText({
  text,
  dir = "left",
  opacity = 0.07,
  className = "",
}: ParallaxTextProps) {
  const animId = `pt-${dir}-${Math.random().toString(36).slice(2, 6)}`;
  const from = dir === "left" ? "0%" : "-15%";
  const to   = dir === "left" ? "-15%" : "0%";

  return (
    <div
      className={`relative z-0 overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden
    >
      <div
        className="whitespace-nowrap font-serif font-black uppercase tracking-[-0.04em] text-white leading-none"
        style={{
          fontSize: "clamp(80px, 18vw, 240px)",
          opacity,
          animation: `${animId} linear both`,
          animationTimeline: "scroll(root)",
          animationRange: "entry 0% exit 100%",
        }}
      >
        {text}
      </div>

      <style>{`
        @keyframes ${animId} {
          from { transform: translateX(${from}); }
          to   { transform: translateX(${to}); }
        }
      `}</style>
    </div>
  );
}
