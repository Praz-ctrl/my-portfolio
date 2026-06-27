import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import LoadingScreen from "@/components/providers/LoadingScreen";
import CustomCursor from "@/components/layout/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import AIAgent from "@/components/layout/AIAgent";
import CursorTrail from "@/components/layout/CursorTrail";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Prajwal Agrawal — CS & AI/ML Developer Portfolio",
  description:
    "CS & AI/ML Student at Symbiosis Institute of Technology. Building Real-World Apps with Machine Learning, Neural Networks, and Frontend Design.",
  keywords: [
    "Prajwal Agrawal",
    "Symbiosis Institute of Technology",
    "AI/ML Student",
    "Machine Learning",
    "Neural Networks",
    "Frontend Developer",
    "React.js",
    "C++",
    "DayLens",
  ],
  openGraph: {
    title: "Prajwal Agrawal — CS & AI/ML Developer Portfolio",
    description:
      "CS & AI/ML Student at Symbiosis Institute of Technology. Building Real-World Apps with Machine Learning & Neural Networks.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} antialiased`}
    >
      <body
        className="min-h-screen bg-[#0a0a0a] text-[#fafafa]"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        <SmoothScroll>
          <LoadingScreen />
          <CustomCursor />
          <Navbar />

          {/* Noise grain and grid overlays */}
          <div className="noise-overlay" />
          <div className="grid-overlay" />
          <CursorTrail />

          <main>{children}</main>
          <AIAgent />
        </SmoothScroll>
      </body>
    </html>
  );
}
