import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isSupported, setIsSupported] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Refs to prevent redundant state updates and listener re-subscriptions
  const isVisibleRef = useRef(false);
  const isHoveredRef = useRef(false);
  const hoverTextRef = useRef("");

  // Exact mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ultra-fluid spring physics for outer magnetic ring
  const ringX = useSpring(mouseX, { stiffness: 220, damping: 24, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 220, damping: 24, mass: 0.4 });

  // Soft ambient glow trail
  const trailX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.8 });
  const trailY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.8 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setIsSupported(mediaQuery.matches && !reducedQuery.matches);
    };

    update();
    mediaQuery.addEventListener?.("change", update);
    reducedQuery.addEventListener?.("change", update);

    return () => {
      mediaQuery.removeEventListener?.("change", update);
      reducedQuery.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    document.documentElement.classList.add("has-custom-cursor");

    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          mouseX.set(pendingX);
          mouseY.set(pendingY);
          rafId = null;
        });
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
      }
    };
    const handleMouseEnter = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || typeof target.closest !== "function") return;

      const card = target.closest("[data-cursor-text]");
      const nextText = card?.getAttribute("data-cursor-text") || "";
      if (nextText !== hoverTextRef.current) {
        hoverTextRef.current = nextText;
        setHoverText(nextText);
      }

      const nextHovered = !!target.closest(
        'a, button, [role="button"], input, select, textarea, .clickable, .glass, [data-cursor-hover]'
      );
      if (nextHovered !== isHoveredRef.current) {
        isHoveredRef.current = nextHovered;
        setIsHovered(nextHovered);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isSupported, mouseX, mouseY]);

  if (!isSupported) return null;

  // Compositor-only scale replaces animating width/height (eliminates layout thrashing)
  const ringScale = isClicked ? 0.75 : isHovered ? (hoverText ? 2.1 : 1.42) : 1;

  return (
    <>
      {/* 1. Deep Ambient Radial Glow Trail — soft radial-gradient instead of expensive live blur-3xl */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(168,85,247,0.48) 0%, rgba(122,42,220,0.28) 38%, rgba(255,138,91,0.14) 58%, transparent 74%)",
        }}
        animate={{
          scale: isClicked ? 0.8 : isHovered ? 1.8 : 1,
          opacity: isVisible ? (isHovered ? 0.55 : 0.3) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none fixed left-0 top-0 z-[99996] h-72 w-72 rounded-full"
      />

      {/* 2. Outer Fluid Magnetic Halo Ring — compositor-only transform + opacity */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className={`pointer-events-none fixed left-0 top-0 z-[99997] flex items-center justify-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <motion.div
          animate={{
            scale: ringScale,
            borderColor: isHovered ? "rgba(255, 138, 91, 0.8)" : "rgba(168, 85, 247, 0.5)",
            backgroundColor: isHovered
              ? "rgba(168, 85, 247, 0.12)"
              : "rgba(255, 255, 255, 0.02)",
          }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 22,
            mass: 0.3,
          }}
          className="h-[38px] w-[38px] rounded-full border-2 border-solid shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        />
        {hoverText && (
          <span className="absolute text-[9px] font-bold uppercase tracking-wider text-white drop-shadow-md">
            {hoverText}
          </span>
        )}
      </motion.div>

      {/* 3. Central Glowing Laser Core Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.5 : isHovered ? 1.6 : 1,
          backgroundColor: isHovered ? "#ff8a5b" : "#ffffff",
          boxShadow: isHovered
            ? "0 0 15px #ff8a5b, 0 0 30px #a855f7"
            : "0 0 10px rgba(255, 255, 255, 0.8)",
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
        }}
        className={`pointer-events-none fixed left-0 top-0 z-[99999] h-2.5 w-2.5 rounded-full transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
