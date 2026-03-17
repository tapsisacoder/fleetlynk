import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { LossSection } from "@/components/LossSection";
import { SolutionSection } from "@/components/SolutionSection";
import { VisualSection } from "@/components/VisualSection";
import { PlatformSection } from "@/components/PlatformSection";
import { PricingSection } from "@/components/PricingSection";
import { ApplicationSection } from "@/components/ApplicationSection";
import { Footer } from "@/components/Footer";

const Landing = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <LossSection />
      <SolutionSection />
      <VisualSection />
      <PlatformSection />
      <PricingSection />
      <ApplicationSection />
      <Footer />
    </div>
  );
};

export default Landing;
