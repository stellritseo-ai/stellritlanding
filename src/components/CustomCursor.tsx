import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isSupported, setIsSupported] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

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
    const handleDeviceChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSupported(e.matches);
    };

    handleDeviceChange(mediaQuery);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleDeviceChange);
    } else {
      mediaQuery.addListener(handleDeviceChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleDeviceChange);
      } else {
        mediaQuery.removeListener(handleDeviceChange);
      }
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
      if (!isVisible) setIsVisible(true);

      // RAF-gate: only update motion values once per animation frame
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
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const card = target.closest('[data-cursor-text], article, .group');
      if (card && card.getAttribute('data-cursor-text')) {
        setHoverText(card.getAttribute('data-cursor-text') || '');
      } else {
        setHoverText('');
      }

      const isClickable = !!target.closest(
        'a, button, [role="button"], input, select, textarea, .clickable, .glass, [data-cursor-hover]'
      );
      setIsHovered(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
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
  }, [isSupported, isVisible, mouseX, mouseY]);

  if (!isSupported) return null;

  return (
    <>
      {/* 1. Deep Ambient Radial Glow Trail */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.8 : isHovered ? 1.8 : 1,
          opacity: isVisible ? (isHovered ? 0.5 : 0.25) : 0,
        }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none fixed left-0 top-0 z-[99996] h-48 w-48 rounded-full bg-gradient-to-r from-[#a855f7] via-[#7a2adc] to-[#ff8a5b] blur-3xl opacity-30 transform-gpu"
      />

      {/* 2. Outer Fluid Magnetic Halo Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? (hoverText ? 80 : 54) : 38,
          height: isHovered ? (hoverText ? 80 : 54) : 38,
          scale: isClicked ? 0.75 : 1,
          borderColor: isHovered ? "rgba(255, 138, 91, 0.8)" : "rgba(168, 85, 247, 0.5)",
          backgroundColor: isHovered
            ? "rgba(168, 85, 247, 0.12)"
            : "rgba(255, 255, 255, 0.02)",
          backdropFilter: isHovered ? "blur(4px)" : "blur(0px)",
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 22,
          mass: 0.3,
        }}
        className={`pointer-events-none fixed left-0 top-0 z-[99997] flex items-center justify-center rounded-full border-2 border-solid shadow-[0_0_20px_rgba(168,85,247,0.3)] transform-gpu transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {hoverText && (
          <span className="text-[9px] font-bold uppercase tracking-wider text-white drop-shadow-md">
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
        className={`pointer-events-none fixed left-0 top-0 z-[99999] h-2.5 w-2.5 rounded-full transform-gpu transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
