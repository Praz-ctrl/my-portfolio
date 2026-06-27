"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

interface RevealTextProps {
  text: string;
  className?: string;
  highlightColor?: string;
}

export default function RevealText({
  text,
  className = "",
  highlightColor = "#c9a96e",
}: RevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const words = containerRef.current.querySelectorAll(".reveal-word");

      gsap.fromTo(
        words,
        {
          opacity: 0.15,
          color: "#525252",
        },
        {
          opacity: 1,
          color: highlightColor,
          stagger: 0.05,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 1,
          },
        }
      );
    },
    { scope: containerRef }
  );

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={className}>
      <p className="text-editorial leading-relaxed">
        {words.map((word, i) => (
          <span
            key={i}
            className="reveal-word inline-block mr-[0.3em] transition-colors"
          >
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}
