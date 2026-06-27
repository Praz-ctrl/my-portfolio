"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  href?: string;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  strength = 40,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { playHoverClick, playClick } = useSound();

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverClick();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: ((e.clientX - centerX) / (rect.width / 2)) * strength,
      y: ((e.clientY - centerY) / (rect.height / 2)) * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow:
            "0 0 30px rgba(201, 169, 110, 0.15), 0 0 60px rgba(201, 169, 110, 0.05)",
        }}
      />
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.05 }}
          style={{
            background:
              "radial-gradient(circle, #c9a96e 0%, transparent 70%)",
          }}
        />
      )}
    </>
  );

  const sharedClasses = `group relative inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 rounded-full border border-[rgba(255,255,255,0.1)] hover:border-[#c9a96e] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,169,110,0.08)] text-[#fafafa] ${className}`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className="inline-block"
    >
      {href ? (
        <a href={href} className={sharedClasses} onClick={() => playClick()}>
          {inner}
        </a>
      ) : (
        <button
          onClick={() => {
            onClick?.();
            playClick();
          }}
          className={sharedClasses}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}
