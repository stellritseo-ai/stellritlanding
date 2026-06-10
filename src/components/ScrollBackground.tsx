import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * A single fixed gradient layer that lives behind every section.
 * One spring-smoothed scroll value drives the whole color blend, so
 * the hero → welcome transition is continuous and seamless.
 */
export default function ScrollBackground() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 28,
    mass: 0.4,
  });

  // Smoothly morph between two full-screen gradients
  const background = useTransform(
    p,
    [0, 0.28, 0.55, 0.85, 1],
    [
      // 0 — Hero deep purple
      "radial-gradient(120% 100% at 50% 35%, #4a1290 0%, #2a065a 45%, #180028 100%)",
      // 0.28 — hero ending, purple lingering
      "radial-gradient(120% 100% at 50% 35%, #4a1290 0%, #2a065a 45%, #180028 100%)",
      // 0.55 — purple warms into magenta
      "radial-gradient(130% 110% at 50% 50%, #5a1a78 0%, #7a2a6e 50%, #3a0a40 100%)",
      // 0.85 — coral takes over
      "radial-gradient(140% 120% at 50% 60%, #c97560 0%, #b85a55 55%, #5a1a40 100%)",
      // 1 — full coral
      "radial-gradient(140% 120% at 50% 60%, #e88a72 0%, #c97560 55%, #7a2a4a 100%)",
    ]
  );

  return (
    <motion.div
      aria-hidden
      style={{ background, willChange: "background" }}
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
