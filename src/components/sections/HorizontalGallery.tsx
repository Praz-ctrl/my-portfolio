"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

const galleryItems = [
  {
    title: "Founder & Developer",
    subtitle: "DayLens habit-tracker • March 2026—Present",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
    year: "2026",
  },
  {
    title: "Computer Science (AI/ML)",
    subtitle: "Symbiosis Institute of Technology • July 2025—Present",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    year: "2025",
  },
  {
    title: "BTech in CSE & Data Science",
    subtitle: "SIT Academic Specialization • 2025—2029",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
    year: "2025",
  },
  {
    title: "Frontend & Web Security",
    subtitle: "React Developer & Cybersec certifications",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
    year: "CERT",
  },
];

export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !containerRef.current) return;

      const scrollWidth =
        containerRef.current.scrollWidth - window.innerWidth + 100;

      // GSAP velocity skew setter
      const skewSetter = gsap.quickSetter(".gallery-card", "skewX", "deg");
      const clamp = gsap.utils.clamp(-10, 10); // limit max skew skew deg

      // Pinned horizontal translate with dynamic velocity skew/distortion
      gsap.to(containerRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -250);
            // smooth skew bounce back
            gsap.to(".gallery-card", {
              skewX: skew,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
              onComplete: () => {
                gsap.to(".gallery-card", {
                  skewX: 0,
                  duration: 0.6,
                  ease: "power2.out",
                });
              }
            });
          }
        },
      });

      // Parallax on each image
      const images = containerRef.current.querySelectorAll(".gallery-image");
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: `+=${scrollWidth}`,
              scrub: 1,
            },
          }
        );
      });

      // Giant background outline text parallax effect
      gsap.to(".timeline-bg-text", {
        xPercent: -45,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollWidth}`,
          scrub: 1,
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#141414]/30 to-[#0a0a0a]"
      id="gallery"
    >
      {/* Giant Parallax outline text behind cards */}
      <div 
        className="timeline-bg-text absolute left-24 top-1/4 text-[25vw] font-extrabold text-[rgba(255,255,255,0.015)] tracking-[-0.05em] uppercase pointer-events-none select-none font-sans z-0"
        style={{ WebkitTextStroke: "1px rgba(201, 169, 110, 0.03)" }}
      >
        EXPRNCE
      </div>

      {/* Section label */}
      <div className="absolute top-10 left-6 md:left-12 z-20">
        <span className="text-label">Experience Timeline</span>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="flex items-center gap-8 md:gap-16 h-full pl-6 md:pl-24 pr-24 relative z-10"
        style={{ width: "fit-content" }}
      >
        {galleryItems.map((item, i) => (
          <div
            key={item.title}
            className="gallery-card relative flex-shrink-0 w-[80vw] md:w-[42vw] h-[72vh] group rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)] backdrop-blur-sm shadow-2xl transition-shadow duration-500 hover:shadow-[#c9a96e]/5"
            style={{ transformOrigin: "bottom center", willChange: "transform" }}
          >
            {/* Image container */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="gallery-image absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover brightness-[0.7] scale-110 group-hover:scale-100 group-hover:brightness-90 transition-all duration-700 ease-out"
                  sizes="(max-width: 768px) 80vw, 42vw"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent z-10" />

              {/* Slide Number / Year tag */}
              <div className="absolute top-6 left-6 text-2xl font-bold tracking-[0.1em] text-[#c9a96e] z-20 font-mono">
                {item.year}
              </div>
              <div className="absolute top-6 right-6 text-[0.65rem] tracking-[0.2em] text-[rgba(255,255,255,0.4)] z-20 font-mono">
                {(i + 1).toString().padStart(2, "0")} / {galleryItems.length.toString().padStart(2, "0")}
              </div>

              {/* Hover border glow segments */}
              <div className="absolute inset-0 rounded-2xl border pointer-events-none border-[rgba(255,255,255,0.05)] group-hover:border-[rgba(201,169,110,0.2)] transition-colors duration-500 z-20" />

              {/* Content Card with minor slide-up reveal */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-[#fafafa] mb-3 group-hover:text-[#c9a96e] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-[#737373] group-hover:text-[#a3a3a3] transition-colors duration-300 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edge gradients */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
