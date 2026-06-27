"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageDistortionProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  overlay?: boolean;
}

export default function ImageDistortion({
  src,
  alt,
  className = "",
  aspectRatio = "4/5",
  overlay = true,
}: ImageDistortionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ aspectRatio }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay */}
      {overlay && (
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent"
          animate={{ opacity: isHovered ? 0.8 : 0.4 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Image with zoom */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isHovered ? 1.08 : 1,
          filter: isHovered ? "brightness(1.1)" : "brightness(0.85)",
        }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>

      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl z-20 pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? "inset 0 0 0 1px rgba(201, 169, 110, 0.3)"
            : "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
