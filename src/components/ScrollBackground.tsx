import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Calm, scroll-reactive atmosphere.
 *
 * Stripped back from the previous multi-layer version: one base gradient,
 * two slow aurora blobs, a subtle bottom haze, and a touch of grain.
 * No light beams, no mesh wash, no mix-blend stacks.
 */
export default function ScrollBackground() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 28,
    mass: 0.6,
  });

  const stops = [0, 0.25, 0.5, 0.75, 1];

  // Softer, less saturated base gradient
  const background = useTransform(p, stops, [
    "radial-gradient(120% 100% at 50% 35%, #2a0a5a 0%, #180230 55%, #0d0220 100%)",
    "radial-gradient(125% 105% at 55% 40%, #2e1670 0%, #170a3a 55%, #0a0520 100%)",
    "radial-gradient(130% 110% at 45% 50%, #1a2a78 0%, #0e1640 55%, #060a20 100%)",
    "radial-gradient(135% 115% at 50% 55%, #0e1f48 0%, #07112c 60%, #03060f 100%)",
    "radial-gradient(130% 110% at 50% 45%, #3a0e80 0%, #1a0440 55%, #0a0220 100%)",
  ]);

  const blobA = useTransform(p, stops, [
    "#6a22b8", "#5040c8", "#264fa8", "#0e3a64", "#7820c8",
  ]);
  const blobB = useTransform(p, stops, [
    "#3a0a6a", "#5018a8", "#0f2880", "#0a2848", "#5018b8",
  ]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ background, willChange: "background" }}
        className="absolute inset-0"
      />

      <motion.div
        style={{ background: useTransform(blobA, (c) => `radial-gradient(circle at center, ${c} 0%, transparent 65%)`) }}
        animate={{ x: ["-6%", "8%", "-6%"], y: ["-4%", "6%", "-4%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 h-[70vh] w-[70vh] rounded-full blur-3xl opacity-40 mix-blend-screen"
      />
      <motion.div
        style={{ background: useTransform(blobB, (c) => `radial-gradient(circle at center, ${c} 0%, transparent 65%)`) }}
        animate={{ x: ["4%", "-6%", "4%"], y: ["4%", "-4%", "4%"] }}
        transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-1/4 h-[80vh] w-[80vh] rounded-full blur-3xl opacity-35 mix-blend-screen"
      />

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
