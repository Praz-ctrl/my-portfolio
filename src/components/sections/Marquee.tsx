"use client";

interface MarqueeProps {
  text?: string;
  speed?: number;
  separator?: string;
  className?: string;
  reverse?: boolean;
}

export default function Marquee({
  text = "VOID STUDIO",
  speed = 30,
  separator = "✦",
  className = "",
  reverse = false,
}: MarqueeProps) {
  const repeatedContent = Array(8)
    .fill(null)
    .map((_, i) => (
      <span key={i} className="flex items-center gap-8 md:gap-16 shrink-0">
        <span className="text-display-sm whitespace-nowrap font-bold tracking-[-0.04em]">
          {text}
        </span>
        <span className="text-[#c9a96e] text-xl md:text-2xl opacity-50">
          {separator}
        </span>
      </span>
    ));

  return (
    <div
      className={`relative py-8 md:py-12 overflow-hidden border-y border-[rgba(255,255,255,0.04)] ${className}`}
    >
      {/* Edge gradients */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

      <div
        className="flex gap-8 md:gap-16 animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {repeatedContent}
        {repeatedContent}
      </div>
    </div>
  );
}
