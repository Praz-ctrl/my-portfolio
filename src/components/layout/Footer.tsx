"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

const socialLinks = [
  { 
    label: "Gmail", 
    href: "mailto:prajwalagrawal1348@gmail.com",
    icon: (
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    )
  },
  { 
    label: "LinkedIn", 
    href: "https://www.linkedin.com/in/prajwal-agrawal-5b7009385",
    icon: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  { 
    label: "GitHub", 
    href: "https://github.com/Praz-ctrl",
    icon: (
      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    )
  }
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <footer
      ref={footerRef}
      className="relative py-24 md:py-40 px-6 md:px-12"
      id="footer"
    >
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[rgba(201,169,110,0.04)] blur-[150px]" />

      <div className="max-w-[1800px] mx-auto relative z-10">
        {/* CTA area */}
        <div ref={ctaRef} className="mb-24 md:mb-40">
          <motion.span
            className="text-label block mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Ready to collaborate?
          </motion.span>

          <motion.h2
            className="text-display leading-none mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1 }}
          >
            LET&apos;S{" "}
            <span className="text-[#c9a96e] italic text-glow-accent">
              CONNECT
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            <MagneticButton href="mailto:prajwalagrawal1348@gmail.com" strength={30}>
              prajwalagrawal1348@gmail.com
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </MagneticButton>

            <span className="text-sm text-[#525252]">
              or call +91 9279347733
            </span>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[rgba(255,255,255,0.06)] mb-12" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Logo */}
          <div>
            <span className="text-2xl font-bold tracking-[-0.04em]">
              <span className="text-[#c9a96e]">P</span>RAJWAL
            </span>
            <p className="text-xs text-[#525252] mt-2 tracking-[0.05em]">
              CS & AI/ML Student @ SIT Pune
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-full border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] text-[#737373] hover:text-[#c9a96e] hover:border-[#c9a96e]/30 hover:bg-[rgba(201,169,110,0.05)] shadow-lg transition-all duration-300"
                whileHover={{ y: -3, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                aria-label={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs text-[#525252]">
            © {new Date().getFullYear()} Prajwal Agrawal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
