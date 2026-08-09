import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const SIZZLE_REEL =
  "https://res.cloudinary.com/dmanafb84/video/upload/f_auto:video,q_auto/IA-Website-Homepage-Sizzle-Reel-Animation_V5_1_2-2_c6hfyj.mp4";

/**
 * VideoMerge — cinematic scroll-driven section.
 *
 * The sizzle reel video starts as a small card (matching the hero card size)
 * at the bottom-left, then seamlessly grows to fill the center of the screen as
 * the user scrolls. Creates the illusion that the hero video "flows" into
 * the Welcome section.
 */
export default function VideoMerge() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 25, mass: 0.4 });

  // Card grows from hero card size to full-width centered
  // To avoid Framer Motion string interpolation crashes, we must match the number of values in the string template.
  const cardW = useTransform(smooth, [0.0, 0.65], ["calc(0vw + 360px)", "calc(100vw + -96px)"]);
  const cardH = useTransform(smooth, [0.0, 0.65], ["calc(0vh + 202.5px)", "calc(56vh + 0px)"]);
  const cardY = useTransform(smooth, [0.0, 0.65], ["calc(0vh + 0px)", "calc(-24vh + 0px)"]);
  const radius = useTransform(smooth, [0.0, 0.65], [20, 14]);

  // Inner video zoom after full expansion
  const videoScale = useTransform(smooth, [0.6, 0.95], [1, 1.07]);

  // Text overlay
  const textOpacity = useTransform(smooth, [0.6, 0.75], [0, 1]);
  const textY = useTransform(smooth, [0.6, 0.8], [32, 0]);

  // Section stays visible so Welcome can overlap it
  return (
    <section
      ref={containerRef}
      aria-label="Sizzle reel showcase"
      className="relative hidden md:block"
      style={{ height: "300vh", background: "transparent" }}
    >
      <motion.div
        className="sticky top-0 h-screen w-full flex items-end justify-start overflow-hidden"
      >
        {/* Expanding video card */}
        <motion.div
          style={{
            width: cardW,
            height: cardH,
            left: "48px",
            bottom: "32px",
            borderRadius: radius,
            y: cardY,
            willChange: "width, height, transform",
          }}
          className="absolute overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-[#0e0228]"
        >
          {/* Inner video with independent zoom */}
          <motion.div
            style={{ scale: videoScale, transformOrigin: "center center" }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              src={SIZZLE_REEL}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          {/* Border ring */}
          <div
            className="pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/10"
            style={{ borderRadius: "inherit" }}
          />

          {/* Text overlay — appears after card is fully open */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute bottom-8 left-8 z-30 max-w-[480px]"
          >
            <p
              className="text-white/90 text-[13px] uppercase tracking-[0.2em] mb-3 font-medium"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
            >
              Sizzle Reel · 2025
            </p>
            <h2
              className="font-serif text-white text-[32px] lg:text-[44px] leading-[1.1] tracking-tight"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                textShadow: "0 2px 20px rgba(0,0,0,0.7)",
              }}
            >
              Bold ideas.{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(90deg, #d9b8ff, #cc7aff, #ff9f7a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Lasting impact.
              </span>
            </h2>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
