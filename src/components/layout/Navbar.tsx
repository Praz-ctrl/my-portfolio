"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

const navLinks = [
  { label: "Works", href: "#works" },
  { label: "Experience", href: "#gallery" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Skills & Certs", href: "#awards" },
  { label: "Contact", href: "#footer" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-5"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 backdrop-blur-xl border-b border-[rgba(255,255,255,0.04)]"
        style={{
          opacity: backgroundOpacity,
          backgroundColor: "rgba(10, 10, 10, 0.85)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <a href="#" className="flex items-center gap-1">
          <span className="text-2xl font-bold tracking-[-0.04em] text-[#fafafa]">
            <span className="text-[#c9a96e]">P</span>RAJWAL
          </span>
          <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#525252] ml-2 hidden md:block">
            Portfolio
          </span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-sm tracking-[0.1em] uppercase text-[#737373] hover:text-[#fafafa] transition-colors duration-300"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9a96e] group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <MagneticButton strength={20} href="#footer">
            Let&apos;s Talk
          </MagneticButton>
        </div>

        {/* Mobile menu icon */}
        <button className="md:hidden flex flex-col gap-1.5 p-2">
          <span className="w-6 h-[1px] bg-[#fafafa]" />
          <span className="w-4 h-[1px] bg-[#fafafa]" />
        </button>
      </div>
    </motion.nav>
  );
}
