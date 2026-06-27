"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import ImageDistortion from "@/components/ui/ImageDistortion";
import NeuralLock from "@/components/ui/NeuralLock";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

const projects = [
  {
    title: "DayLens",
    category: "Founder & Developer — Minimal Daily Habit Tracker",
    year: "2026",
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&q=80",
    color: "rgba(201, 169, 110, 0.15)",
  },
  {
    title: "What Did You Do Today?",
    category: "Product Design, Engineering & User Behavior Study",
    year: "2025",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80",
    color: "rgba(139, 92, 246, 0.15)",
  },
  {
    title: "Neural Networks & ML",
    category: "Real-world App Integrations & Model Applications",
    year: "2025",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    color: "rgba(201, 169, 110, 0.15)",
  },
  {
    title: "WebGL Creative Dev",
    category: "Interactive Next.js & React Three Fiber Application",
    year: "2026",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    color: "rgba(139, 92, 246, 0.15)",
  },
];

function ProjectCard({ project, index, isOdd }: { project: typeof projects[0]; index: number; isOdd: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setTilt({
      x: (y - 0.5) * -12,
      y: (x - 0.5) * 12,
    });
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className={`project-card relative group p-4 rounded-2xl border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.015)] backdrop-blur-sm overflow-hidden ${isOdd ? "md:mt-24" : ""}`}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(circle 200px at ${glowPos.x}% ${glowPos.y}%, ${project.color}, transparent 80%)`,
          }}
        />
      )}

      <div 
        className="absolute inset-0 rounded-2xl border pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-10"
        style={{ borderColor: "rgba(201, 169, 110, 0.25)" }}
      />

      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <div className="project-image relative mb-6 overflow-hidden rounded-xl">
          <ImageDistortion
            src={project.image}
            alt={project.title}
            aspectRatio="4/5"
            className="w-full transition-transform duration-700"
          />
          <div className="absolute top-6 right-6 text-[0.65rem] tracking-[0.2em] text-[rgba(255,255,255,0.5)] z-30 font-mono">
            {(index + 1).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="flex items-start justify-between px-2">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[#fafafa] group-hover:text-[#c9a96e] transition-colors duration-500">
              {project.title}
            </h3>
            <p className="text-sm text-[#737373] mt-2 group-hover:text-[#a3a3a3] transition-colors duration-500 leading-relaxed max-w-sm">
              {project.category}
            </p>
          </div>
          <span className="text-sm text-[#525252] mt-2 group-hover:text-[#fafafa] transition-colors duration-500 font-mono">
            {project.year}
          </span>
        </div>

        <div className="mt-6 mx-2 h-[1px] bg-[rgba(255,255,255,0.06)] group-hover:bg-[rgba(201,169,110,0.3)] transition-colors duration-700" />
      </div>
    </motion.div>
  );
}

export default function FeaturedWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: "-100px" });
  const [isUnlocked, setIsUnlocked] = useState(false);

  useGSAP(
    () => {
      if (!isUnlocked) return;
      if (!sectionRef.current) return;

      const cards = sectionRef.current.querySelectorAll(".project-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );

        const img = card.querySelector(".project-image img");
        if (img) {
          gsap.to(img, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });
    },
    [isUnlocked]
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 px-6 md:px-12 bg-gradient-to-b from-transparent via-[#0a0a0a] to-transparent"
      id="works"
    >
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[rgba(139,92,246,0.015)] blur-[130px] pointer-events-none" />

      {/* Section header */}
      <div ref={titleRef} className="max-w-[1800px] mx-auto mb-20 md:mb-32">
        <motion.span
          className="text-label block mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Selected Projects
        </motion.span>
        <motion.h2
          className="text-display-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Featured <span className="text-[#c9a96e] italic">Works</span>
        </motion.h2>
      </div>

      {/* Unlock Mechanism Wrapper */}
      <div className="max-w-[1800px] mx-auto">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="lock"
              initial={{ opacity: 1, scale: 0.95 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <NeuralLock onUnlock={() => setIsUnlocked(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16"
            >
              {projects.map((project, i) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={i}
                  isOdd={i % 2 === 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
