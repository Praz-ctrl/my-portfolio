"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import MagneticButton from "@/components/ui/MagneticButton";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

import { useMousePosition } from "@/hooks/useMousePosition";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { normalizedX, normalizedY } = useMousePosition();

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Parallax on the entire hero
      gsap.to(".hero-content", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Subtle radial mouse-reactive glows */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-[rgba(201,169,110,0.03)] blur-[120px] pointer-events-none"
        animate={{
          x: normalizedX * -50,
          y: normalizedY * -50,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 30 }}
        style={{ left: "calc(50% - 400px)", top: "calc(33% - 400px)" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[rgba(139,92,246,0.025)] blur-[100px] pointer-events-none"
        animate={{
          x: normalizedX * 70,
          y: normalizedY * 70,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 25 }}
        style={{ left: "calc(75% - 250px)", top: "calc(50% - 250px)" }}
      />

      {/* 3D Scene - centered fullscreen background (drag interactions handled globally) */}
      <div className="absolute inset-0 opacity-55 z-0 select-none pointer-events-none">
        <Scene />
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 flex flex-col items-center text-center px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-label mb-8 animate-pulse-glow"
        >
          CS & AI/ML Student — Symbiosis Pune
        </motion.div>

        {/* Main heading */}
        <h1 className="text-display mb-6">
          <SplitText text="PRAJWAL" delay={2.0} duration={0.8} staggerDelay={0.08} animation="slideUp" />
        </h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-2xl text-[#737373] max-w-xl leading-relaxed tracking-[-0.01em] mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6 }}
        >
          Building real-world applications with Machine Learning, Neural Networks, and intuitive Front-End Development.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.9 }}
        >
          <MagneticButton href="#works">
            Explore Works
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#525252]">
          Scroll
        </span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#c9a96e]/50 to-transparent animate-scroll-bounce" />
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </section>
  );
}
