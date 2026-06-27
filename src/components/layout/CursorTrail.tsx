"use client";
import { useEffect, useRef } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useMousePosition();
  const isMobile = useMediaQuery("(pointer: coarse)");
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const colors = ["#c9a96e", "#8b5cf6", "#fafafa"];
    let lastMouseX = 0;
    let lastMouseY = 0;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn particles only when mouse is moving
      const dx = mouse.x - lastMouseX;
      const dy = mouse.y - lastMouseY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1 && particlesRef.current.length < 80) {
        particlesRef.current.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 1,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      lastMouseX = mouse.x;
      lastMouseY = mouse.y;

      const particles = particlesRef.current;

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015; // fade speed

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          i--;
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Plexus lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.sqrt(
            (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
          );

          // Connect particles within 80px limit
          if (dist < 80) {
            ctx.save();
            // line opacity fades with particle age & distance
            ctx.globalAlpha = Math.min(p1.alpha, p2.alpha) * (1 - dist / 80) * 0.15;
            ctx.strokeStyle = p1.color === p2.color ? p1.color : "#c9a96e";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      requestAnimationFrame(tick);
    };

    const animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [mouse.x, mouse.y, isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9995] opacity-80"
    />
  );
}
