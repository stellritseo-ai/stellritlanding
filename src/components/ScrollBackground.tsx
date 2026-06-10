import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Global, scroll-reactive atmosphere.
 *
 * One spring-smoothed scroll progress drives every layer so the entire site
 * feels like one continuous, morphing surface — no hard section breaks.
 *
 * Layers (back → front):
 *   1. Base radial gradient — section-to-section color story
 *   2. Mesh gradient — soft multi-point color wash
 *   3. Aurora blobs — slowly drifting blurred color orbs
 *   4. Light beams — diagonal volumetric sweeps
 *   5. Noise — film-grain overlay for premium feel
 */
export default function ScrollBackground() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 26,
    mass: 0.5,
  });

  // 6 stops: Hero → S2 → S3 → S4 → S5 → Final CTA
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1];

  // ── Base radial gradient ──────────────────────────────────────────────
  const background = useTransform(p, stops, [
    // Hero — deep luxury purple
    "radial-gradient(125% 100% at 50% 35%, #3A0A7A 0%, #220245 50%, #180028 100%)",
    // S2 — purple → blue-violet
    "radial-gradient(130% 110% at 55% 40%, #4422a8 0%, #2a1370 50%, #160a3a 100%)",
    // S3 — dark electric blue
    "radial-gradient(135% 115% at 45% 50%, #1d3fb0 0%, #11215a 55%, #0a1230 100%)",
    // S4 — dark cyan / teal aurora
    "radial-gradient(140% 120% at 50% 55%, #0e6e7a 0%, #0a3b52 55%, #061824 100%)",
    // S5 — midnight navy / black
    "radial-gradient(150% 130% at 50% 60%, #0a1530 0%, #050a1c 60%, #02030a 100%)",
    // Final CTA — back to vivid luxury purple
    "radial-gradient(140% 120% at 50% 45%, #6a18c8 0%, #3A0A7A 50%, #1a0240 100%)",
  ]);

  // ── Mesh gradient (multi-spot wash) ──────────────────────────────────
  const mesh = useTransform(p, stops, [
    `radial-gradient(40% 40% at 20% 25%, rgba(122,42,210,0.55), transparent 70%),
     radial-gradient(45% 45% at 80% 70%, rgba(58,10,122,0.55), transparent 70%),
     radial-gradient(35% 35% at 50% 90%, rgba(180,60,255,0.25), transparent 70%)`,
    `radial-gradient(45% 45% at 25% 30%, rgba(90,80,255,0.55), transparent 70%),
     radial-gradient(50% 50% at 80% 65%, rgba(120,40,210,0.45), transparent 70%),
     radial-gradient(40% 40% at 50% 85%, rgba(80,140,255,0.30), transparent 70%)`,
    `radial-gradient(50% 50% at 20% 30%, rgba(30,90,255,0.55), transparent 70%),
     radial-gradient(50% 50% at 85% 70%, rgba(20,60,180,0.50), transparent 70%),
     radial-gradient(45% 45% at 50% 90%, rgba(80,180,255,0.30), transparent 70%)`,
    `radial-gradient(55% 55% at 20% 35%, rgba(20,180,180,0.50), transparent 70%),
     radial-gradient(50% 50% at 85% 65%, rgba(50,220,200,0.40), transparent 70%),
     radial-gradient(45% 45% at 50% 90%, rgba(140,255,230,0.25), transparent 70%)`,
    `radial-gradient(55% 55% at 25% 30%, rgba(40,80,160,0.40), transparent 70%),
     radial-gradient(50% 50% at 80% 70%, rgba(20,40,90,0.55), transparent 70%),
     radial-gradient(45% 45% at 50% 90%, rgba(80,120,200,0.20), transparent 70%)`,
    `radial-gradient(50% 50% at 25% 30%, rgba(190,80,255,0.60), transparent 70%),
     radial-gradient(50% 50% at 80% 70%, rgba(120,30,200,0.55), transparent 70%),
     radial-gradient(45% 45% at 50% 90%, rgba(255,140,255,0.30), transparent 70%)`,
  ]);

  // ── Aurora blob colors ───────────────────────────────────────────────
  const blobA = useTransform(p, stops, [
    "#7a2adc", "#5a4cff", "#1e5aff", "#14b4b4", "#2850a0", "#be50ff",
  ]);
  const blobB = useTransform(p, stops, [
    "#3a0a7a", "#7828d2", "#1232a0", "#32dcc8", "#142860", "#7820d0",
  ]);
  const blobC = useTransform(p, stops, [
    "#b43cff", "#508cff", "#50b4ff", "#8cffe6", "#5078c8", "#ff8cff",
  ]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base color story */}
      <motion.div
        style={{ background, willChange: "background" }}
        className="absolute inset-0"
      />

      {/* Mesh gradient wash */}
      <motion.div
        style={{ background: mesh, willChange: "background", mixBlendMode: "screen" }}
        className="absolute inset-0 opacity-80"
      />

      {/* Aurora blobs — slow drift */}
      <motion.div
        style={{ background: useTransform(blobA, (c) => `radial-gradient(circle at center, ${c} 0%, transparent 65%)`) }}
        animate={{ x: ["-10%", "12%", "-10%"], y: ["-8%", "10%", "-8%"], scale: [1, 1.15, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1/4 -left-1/4 h-[80vh] w-[80vh] rounded-full blur-3xl opacity-60 mix-blend-screen"
      />
      <motion.div
        style={{ background: useTransform(blobB, (c) => `radial-gradient(circle at center, ${c} 0%, transparent 65%)`) }}
        animate={{ x: ["8%", "-12%", "8%"], y: ["6%", "-10%", "6%"], scale: [1.1, 0.95, 1.1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-1/4 h-[90vh] w-[90vh] rounded-full blur-3xl opacity-55 mix-blend-screen"
      />
      <motion.div
        style={{ background: useTransform(blobC, (c) => `radial-gradient(circle at center, ${c} 0%, transparent 65%)`) }}
        animate={{ x: ["-6%", "10%", "-6%"], y: ["10%", "-6%", "10%"], scale: [1, 1.2, 1] }}
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-1/3 left-1/4 h-[85vh] w-[85vh] rounded-full blur-3xl opacity-50 mix-blend-screen"
      />

      {/* Moving light beams */}
      <motion.div
        animate={{ x: ["-30%", "30%", "-30%"], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-y-0 left-1/3 w-[40vw] -rotate-12 bg-gradient-to-b from-transparent via-white/20 to-transparent blur-3xl mix-blend-overlay"
      />
      <motion.div
        animate={{ x: ["20%", "-20%", "20%"], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-y-0 right-1/4 w-[30vw] rotate-12 bg-gradient-to-b from-transparent via-white/15 to-transparent blur-3xl mix-blend-overlay"
      />

      {/* Volumetric fog (subtle bottom haze) */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      {/* Film grain / noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
