import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isSupported, setIsSupported] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Precise coordinates for the pinpoint pointer
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the trailing colorful glow spotlight
  const glowX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.5 });
  const glowY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.5 });

  useEffect(() => {
    // Only enable custom cursor on desktop/fine-pointer devices
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

    // Add CSS flag to document to hide standard cursor
    document.documentElement.classList.add("has-custom-cursor");

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if mouse is hovering over an interactive element
      const isClickable = !!target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], select, textarea, .clickable, .glass'
      );
      setIsHovered(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isSupported, isVisible, mouseX, mouseY]);

  if (!isSupported) return null;

  return (
    <>
      {/* Premium ambient colorful glow spotlight */}
      <motion.div
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 240 : 120,
          height: isHovered ? 240 : 120,
          opacity: isHovered ? 0.45 : 0.22,
          background: isHovered
            ? "radial-gradient(circle, rgba(168, 85, 247, 0.6) 0%, rgba(255, 138, 91, 0.45) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(255, 138, 91, 0.2) 40%, transparent 65%)",
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 0.6,
        }}
        className={`pointer-events-none fixed left-0 top-0 z-[99998] rounded-full blur-[35px] mix-blend-screen transform-gpu transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* Tiny precise pinpoint pointer dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 2.5 : 1.0,
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 1)",
          borderColor: isHovered ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0)",
          borderWidth: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className={`pointer-events-none fixed left-0 top-0 z-[99999] h-2 w-2 rounded-full border-solid mix-blend-difference transform-gpu transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      />
    </>
  );
}
