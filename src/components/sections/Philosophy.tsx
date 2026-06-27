"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import RevealText from "@/components/ui/RevealText";

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-56 px-6 md:px-12 overflow-hidden"
      id="philosophy"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(139,92,246,0.03)] blur-[150px]" />

      <div className="max-w-[1200px] mx-auto">
        {/* Label */}
        <motion.span
          className="text-label block mb-16 md:mb-24"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          My Perspective
        </motion.span>

        {/* Main editorial text - scroll reveal */}
        <RevealText
          text="I am fascinated by the contrast between sophisticated technology and simple user experience. Taking an idea, no matter how small it is, and turning it into something clean, simple, and user-friendly is what drives my coding journey."
          className="mb-24 md:mb-40"
          highlightColor="#fafafa"
        />

        {/* Quote */}
        <div ref={quoteRef} className="relative">
          <motion.div
            className="border-l-[2px] border-[#c9a96e]/30 pl-8 md:pl-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl md:text-4xl font-light leading-relaxed tracking-[-0.02em] text-[#fafafa]/80">
              &ldquo;The best programmers are not only skilled programmers,{" "}
              <span className="text-[#c9a96e] italic text-glow-accent">
                but also thinkers who create things people want to use.
              </span>
              &rdquo;
            </p>
            <p className="mt-6 text-sm text-[#525252] tracking-[0.1em] uppercase">
              — Personal Manifesto
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          className="mt-24 md:mt-40 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[rgba(255,255,255,0.06)] pt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { label: "BTech Graduation Target", value: "2029" },
            { label: "Habit App Feedback Users", value: "5+" },
            { label: "Project Concepts Built", value: "3+" },
            { label: "Core Developer Skills", value: "5+" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-[#c9a96e] mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-[#525252] tracking-[0.1em] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
