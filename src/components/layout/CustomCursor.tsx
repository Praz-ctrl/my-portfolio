"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const { x, y } = useMousePosition();
  const isMobile = useMediaQuery("(pointer: coarse)");
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Detect interactive elements
    const handleElementHover = () => {
      const interactives = document.querySelectorAll(
        "a, button, [data-cursor-hover], input, textarea, select"
      );

      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    handleElementHover();

    // Re-check after DOM changes
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* 1. Precise Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#c9a96e] pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: x - 3,
          y: y - 3,
          scale: isHovering ? 0 : 1,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          x: { type: "spring", stiffness: 1000, damping: 45, mass: 0.15 },
          y: { type: "spring", stiffness: 1000, damping: 45, mass: 0.15 },
          scale: { duration: 0.15 },
          opacity: { duration: 0.15 },
        }}
      />

      {/* 2. Primary Responsive Ring (Acts as a glass magnifying lens) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#c9a96e] pointer-events-none z-[9998]"
        animate={{
          x: x - 16,
          y: y - 16,
          scale: isHovering ? 2.0 : 1,
          opacity: isHidden ? 0 : 0.7,
          borderWidth: isHovering ? "2px" : "1px",
          borderColor: isHovering ? "#c9a96e" : "rgba(201, 169, 110, 0.4)",
          backgroundColor: isHovering ? "rgba(201, 169, 110, 0.05)" : "rgba(255,255,255,0.01)",
          backdropFilter: isHovering ? "none" : "contrast(1.2) brightness(1.15) saturate(1.1)",
        }}
        transition={{
          x: { type: "spring", stiffness: 350, damping: 25, mass: 0.4 },
          y: { type: "spring", stiffness: 350, damping: 25, mass: 0.4 },
          scale: { type: "spring", stiffness: 200, damping: 15 },
          opacity: { duration: 0.15 },
        }}
      />

      {/* 3. Outer Lagging Orbit (Violet Accent) */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-dashed border-[#8b5cf6]/35 pointer-events-none z-[9997]"
        animate={{
          x: x - 24,
          y: y - 24,
          scale: isHovering ? 2.4 : 1,
          opacity: isHidden ? 0 : 0.4,
          rotate: isHovering ? 90 : 0,
        }}
        transition={{
          x: { type: "spring", stiffness: 180, damping: 18, mass: 0.8 },
          y: { type: "spring", stiffness: 180, damping: 18, mass: 0.8 },
          scale: { type: "spring", stiffness: 150, damping: 20 },
          rotate: { duration: 2, ease: "linear", repeat: Infinity },
          opacity: { duration: 0.2 },
        }}
      />

      {/* 4. Ambient Glow Segment (Follower) */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-[#c9a96e]/10 blur-[6px] pointer-events-none z-[9996]"
        animate={{
          x: x - 8,
          y: y - 8,
          scale: isHovering ? 4.5 : 1,
          opacity: isHidden ? 0 : 0.6,
        }}
        transition={{
          x: { type: "spring", stiffness: 120, damping: 12, mass: 1.2 },
          y: { type: "spring", stiffness: 120, damping: 12, mass: 1.2 },
          scale: { duration: 0.3 },
          opacity: { duration: 0.2 },
        }}
      />
    </>
  );
}
