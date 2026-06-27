"use client";
import { motion, Variants, Variant } from "framer-motion";
import { useCallback, useRef } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  type?: "chars" | "words";
  animation?: "fadeUp" | "fadeIn" | "slideUp";
}

const animations: Record<string, { hidden: Variant; visible: Variant }> = {
  fadeUp: {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: "0%", opacity: 1 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { y: "120%", rotateX: 90 },
    visible: { y: "0%", rotateX: 0 },
  },
};

// Pentatonic scale frequencies for the musical hover effect (C4, D4, E4, G4, A4, C5, D5, E5, G5, A5)
const PENTATONIC_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

export default function SplitText({
  text,
  className = "",
  delay = 0,
  duration = 0.6,
  staggerDelay = 0.03,
  type = "chars",
  animation = "fadeUp",
}: SplitTextProps) {
  const anim = animations[animation];
  const audioCtxRef = useRef<AudioContext | null>(null);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: anim.hidden,
    visible: {
      ...(anim.visible as Record<string, unknown>),
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  // Play a synthesizer note mapped to character index
  const playCharNote = useCallback((idx: number) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state === "suspended") return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Select frequency from scale based on index
      const freq = PENTATONIC_SCALE[idx % PENTATONIC_SCALE.length];
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      // Add a slight vibrato or frequency slide for quality
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Bypass context locks
    }
  }, []);

  const items = type === "chars" ? text.split("") : text.split(" ");

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden py-2 px-[0.02em]"
          style={{ perspective: "600px" }}
        >
          <motion.span
            className="inline-block origin-center select-none"
            variants={childVariants}
            style={{ willChange: "transform, opacity" }}
            whileHover={
              type === "chars" && item !== " "
                ? { 
                    y: -22, 
                    scale: 1.35, 
                    color: "#c9a96e",
                    rotateZ: [0, 8, -8, 0],
                    textShadow: "0 0 20px rgba(201, 169, 110, 0.6)"
                  }
                : {}
            }
            transition={{
              y: { type: "spring", stiffness: 400, damping: 10, mass: 0.4 },
              scale: { type: "spring", stiffness: 400, damping: 10, mass: 0.4 },
              rotateZ: { type: "tween", ease: "easeInOut", duration: 0.4 },
              default: { duration: 0.2 }
            }}
            onMouseEnter={type === "chars" && item !== " " ? () => playCharNote(i) : undefined}
          >
            {item === " " ? "\u00A0" : item}
          </motion.span>
          {type === "words" && i < items.length - 1 && (
            <span className="inline-block">{"\u00A0"}</span>
          )}
        </span>
      ))}
    </motion.span>
  );
}
