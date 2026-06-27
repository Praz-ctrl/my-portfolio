"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface NeuralLockProps {
  onUnlock: () => void;
}

export default function NeuralLock({ onUnlock }: NeuralLockProps) {
  // 3x3 grid coordinates: index 0 to 8
  const totalNodes = 9;
  const targetPattern = [0, 4, 8, 2]; // The diagonal cross pattern to unlock
  const [activePattern, setActivePattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const { playHoverClick, playClick, playSuccessSweep } = useSound();
  const containerRef = useRef<HTMLDivElement>(null);

  // Clear draw state on mouse release
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDrawing) {
        verifyPattern();
      }
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDrawing, activePattern]);

  const handleNodeStart = (id: number) => {
    setIsDrawing(true);
    setErrorState(false);
    setActivePattern([id]);
    playHoverClick();
  };

  const handleNodeEnter = (id: number) => {
    if (!isDrawing) return;
    if (activePattern.includes(id)) return; // No duplicates

    setActivePattern((prev) => [...prev, id]);
    playHoverClick();
  };

  const verifyPattern = () => {
    setIsDrawing(false);

    // Check if user connected nodes correctly
    const isCorrect = 
      activePattern.length === targetPattern.length &&
      activePattern.every((node, idx) => node === targetPattern[idx]);

    if (isCorrect) {
      playSuccessSweep();
      // Delay slightly for unlock visual feel
      setTimeout(() => {
        onUnlock();
      }, 400);
    } else {
      // Trigger error state and reset
      setErrorState(true);
      playClick(); // play fail sound
      setTimeout(() => {
        setActivePattern([]);
        setErrorState(false);
      }, 800);
    }
  };

  const handleBypass = () => {
    playSuccessSweep();
    onUnlock();
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[450px] flex flex-col items-center justify-center rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.04)] bg-[rgba(10,10,10,0.85)] backdrop-blur-2xl px-6">
      {/* Background visual glows */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#8b5cf6]/5 via-transparent to-[#c9a96e]/5 pointer-events-none z-0" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#c9a96e]/5 blur-[80px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Lock title */}
        <span className="text-[0.65rem] tracking-[0.35em] text-[#c9a96e] uppercase mb-2 font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-ping" />
          Neural Alignment Matrix
        </span>
        <h3 className="text-xl md:text-2xl font-bold tracking-[-0.03em] text-[#fafafa] mb-4">
          Decrypt Selected Works
        </h3>
        <p className="text-xs text-[#737373] leading-relaxed mb-8 font-mono">
          Connect the nodes in a Z-pattern starting from Top-Left, through the Center, to Bottom-Right, then Top-Right to unlock the portfolio.
        </p>

        {/* Lock Pattern Grid (3x3) */}
        <div 
          ref={containerRef}
          className="relative grid grid-cols-3 gap-6 p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] select-none cursor-pointer mb-8"
        >
          {Array.from({ length: totalNodes }).map((_, idx) => {
            const isActive = activePattern.includes(idx);
            const isTarget = targetPattern.includes(idx);
            
            return (
              <div
                key={idx}
                onMouseDown={() => handleNodeStart(idx)}
                onMouseEnter={() => handleNodeEnter(idx)}
                onTouchStart={() => handleNodeStart(idx)}
                // Touch enter emulation
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const element = document.elementFromPoint(touch.clientX, touch.clientY);
                  const nodeId = element?.getAttribute("data-node-id");
                  if (nodeId !== null && nodeId !== undefined) {
                    handleNodeEnter(parseInt(nodeId));
                  }
                }}
                data-node-id={idx}
                className="relative w-10 h-10 flex items-center justify-center"
              >
                {/* Node Outer Orbit */}
                <motion.div
                  className={`absolute inset-0 rounded-full border transition-colors duration-300 pointer-events-none ${
                    isActive
                      ? errorState
                        ? "border-[#ef4444] bg-[#ef4444]/10 shadow-[0_0_15px_#ef4444]"
                        : "border-[#c9a96e] bg-[#c9a96e]/10 shadow-[0_0_15px_#c9a96e]"
                      : isTarget
                      ? "border-[rgba(201,169,110,0.25)] hover:border-[rgba(201,169,110,0.6)]"
                      : "border-[rgba(255,255,255,0.1)]"
                  }`}
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />

                {/* Node Center Core */}
                <div 
                  className={`w-3.5 h-3.5 rounded-full transition-colors duration-300 pointer-events-none ${
                    isActive
                      ? errorState
                        ? "bg-[#ef4444]"
                        : "bg-[#c9a96e]"
                      : isTarget
                      ? "bg-[rgba(201,169,110,0.4)] animate-pulse-glow"
                      : "bg-[#525252]"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Action Options */}
        <div className="flex items-center gap-6">
          <button
            onClick={handleBypass}
            className="text-[0.65rem] tracking-[0.2em] uppercase text-[#525252] hover:text-[#c9a96e] transition-colors duration-300 font-mono"
          >
            [ Bypass Authentication ]
          </button>
        </div>
      </div>
    </div>
  );
}
