"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { playSuccessSweep } = useSound();

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerating curve
        const increment = Math.max(1, Math.floor((100 - prev) / 8));
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      playSuccessSweep();
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [progress, playSuccessSweep]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0a]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 gradient-hero" />

          {/* Logo / Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center gap-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] text-[#fafafa]">
              <span className="text-[#c9a96e]">P</span>RAJWAL
            </h1>

            {/* Progress bar */}
            <div className="w-48 h-[1px] bg-[rgba(255,255,255,0.1)] relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-[#c9a96e]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Dynamic Status Text */}
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#c9a96e]/60 font-mono text-center h-4">
              {progress < 25 && "INIT INTERACTION MATRIX..."}
              {progress >= 25 && progress < 50 && "PARSING NEURAL PATHS..."}
              {progress >= 50 && progress < 75 && "COMPILING WEBGL GRID..."}
              {progress >= 75 && progress < 100 && "CALIBRATING TACTILE PHYSICS..."}
              {progress === 100 && "INTERFACE CALIBRATED ✦"}
            </span>

            {/* Counter */}
            <motion.span
              className="text-sm tracking-[0.3em] text-[#737373] tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {progress.toString().padStart(3, "0")}
            </motion.span>
          </motion.div>

          {/* Bottom line */}
          <motion.div
            className="absolute bottom-12 text-[0.65rem] tracking-[0.3em] uppercase text-[#525252]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            CS & AI/ML Developer Portfolio
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
