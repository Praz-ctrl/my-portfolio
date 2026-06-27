import Hero from "@/components/sections/Hero";
import FeaturedWorks from "@/components/sections/FeaturedWorks";
import HorizontalGallery from "@/components/sections/HorizontalGallery";
import Philosophy from "@/components/sections/Philosophy";
import Awards from "@/components/sections/Awards";
import Marquee from "@/components/sections/Marquee";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Hero />

      <Marquee
        text="PRAJWAL AGRAWAL ✦ CS STUDENT ✦ AI/ML DEVELOPER ✦ FRONTEND ENGINEER"
        separator="—"
        speed={35}
      />

      <FeaturedWorks />

      <HorizontalGallery />

      <Philosophy />

      <Marquee
        text="REACT.JS ✦ C++ ✦ NEURAL NETWORKS ✦ SYSTEM DESIGN ✦ UI/UX"
        separator="◆"
        speed={25}
        reverse
        className="text-[#525252]"
      />

      <Awards />

      <Marquee
        text="LET'S BUILD SOMETHING CLEAN & USER FRIENDLY"
        separator="✦"
        speed={40}
      />

      <Footer />
    </>
  );
}
