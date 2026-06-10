import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Calm, scroll-reactive atmosphere — GPU-friendly version.
 *
 * Instead of interpolating CSS `background` strings every frame (which forces
 * paint on a full-viewport layer), we stack static gradient layers and
 * crossfade them via `opacity` — a compositor-only property. The spring is
 * also softer / heavier so updates settle faster and run less often.
 */

const BASES = [
  "radial-gradient(120% 100% at 50% 35%, #2a0a5a 0%, #180230 55%, #0d0220 100%)",
  "radial-gradient(125% 105% at 55% 40%, #2e1670 0%, #170a3a 55%, #0a0520 100%)",
  "radial-gradient(130% 110% at 45% 50%, #1a2a78 0%, #0e1640 55%, #060a20 100%)",
  "radial-gradient(135% 115% at 50% 55%, #0e1f48 0%, #07112c 60%, #03060f 100%)",
  "radial-gradient(130% 110% at 50% 45%, #3a0e80 0%, #1a0440 55%, #0a0220 100%)",
];

const BLOBS_A = ["#6a22b8", "#5040c8", "#264fa8", "#0e3a64", "#7820c8"];
const BLOBS_B = ["#3a0a6a", "#5018a8", "#0f2880", "#0a2848", "#5018b8"];

function layerOpacity(p: MotionValue<number>, i: number, n: number) {
  // Triangular window centered at i/(n-1); width = 1/(n-1).
  const c = i / (n - 1);
  const w = 1 / (n - 1);
  const stops = [c - w, c, c + w].map((v) => Math.max(0, Math.min(1, v)));
  const values = [0, 1, 0];
  // Always 1 at the edges for the first/last layer
  if (i === 0) {
    return useTransform(p, [0, w], [1, 0]);
  }
  if (i === n - 1) {
    return useTransform(p, [1 - w, 1], [0, 1]);
  }
  return useTransform(p, stops, values);
}

export default function ScrollBackground() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 30,
    mass: 0.8,
  });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Static base color stack — crossfaded via opacity (compositor only) */}
      {BASES.map((bg, i) => (
        <motion.div
          key={i}
          style={{ background: bg, opacity: layerOpacity(p, i, BASES.length), willChange: "opacity" }}
          className="absolute inset-0"
        />
      ))}

      {/* Two slow drifting blobs — crossfaded color stacks */}
      <div className="absolute -top-1/4 -left-1/4 h-[70vh] w-[70vh]">
        <motion.div
          animate={{ x: ["-4%", "6%", "-4%"], y: ["-3%", "5%", "-3%"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          {BLOBS_A.map((c, i) => (
            <motion.div
              key={i}
              style={{
                background: `radial-gradient(circle at center, ${c} 0%, transparent 65%)`,
                opacity: layerOpacity(p, i, BLOBS_A.length),
                willChange: "opacity",
              }}
              className="absolute inset-0 rounded-full blur-3xl mix-blend-screen"
            />
          ))}
        </motion.div>
      </div>

      <div className="absolute top-1/4 -right-1/4 h-[80vh] w-[80vh]">
        <motion.div
          animate={{ x: ["3%", "-5%", "3%"], y: ["3%", "-3%", "3%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          {BLOBS_B.map((c, i) => (
            <motion.div
              key={i}
              style={{
                background: `radial-gradient(circle at center, ${c} 0%, transparent 65%)`,
                opacity: layerOpacity(p, i, BLOBS_B.length),
                willChange: "opacity",
              }}
              className="absolute inset-0 rounded-full blur-3xl mix-blend-screen"
            />
          ))}
        </motion.div>
      </div>

      {/* Subtle bottom haze */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Light grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
