/**
 * Pure-CSS infinite marquee strip.
 * Zero Framer Motion, zero JS scroll listeners. GPU-only via CSS animation.
 * Props:
 *   items  — text items to repeat
 *   speed  — animation duration in seconds (lower = faster)
 *   dir    — "left" | "right"
 *   size   — "sm" | "md" | "lg"
 *   className — additional classes for the outer wrapper
 */

type MarqueeStripProps = {
  items?: string[];
  speed?: number;
  dir?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "text-[13px] tracking-[0.35em] py-3",
  md: "text-[18px] tracking-[0.25em] py-5",
  lg: "text-[clamp(36px,5vw,72px)] tracking-[-0.01em] py-6 font-serif",
};

export default function MarqueeStrip({
  items = ["BRAND IDENTITY", "WEB DESIGN", "ENGINEERING", "GROWTH MARKETING", "UX STRATEGY", "DIGITAL EVOLUTION"],
  speed = 28,
  dir = "left",
  size = "md",
  className = "",
}: MarqueeStripProps) {
  // Duplicate enough times so the strip is always full-width regardless of screen size
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative z-10 overflow-hidden border-y border-white/10 bg-white/[0.018] ${className}`}
    >
      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
        style={{ background: "linear-gradient(to right, rgba(24,0,40,0.9), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16"
        style={{ background: "linear-gradient(to left, rgba(24,0,40,0.9), transparent)" }}
      />

      <div
        className="flex w-max"
        style={{
          animation: `marquee-${dir} ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`flex shrink-0 items-center font-sans font-medium uppercase text-white/55 select-none ${sizeMap[size]}`}
          >
            {item}
            {/* Separator dot */}
            <span className="mx-6 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#a855f7] opacity-70" />
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
