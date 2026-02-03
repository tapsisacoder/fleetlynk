import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ThreePillarsSection } from "@/components/ThreePillarsSection";
import { FoundingFleetSection } from "@/components/FoundingFleetSection";
import { RiskReversalSection } from "@/components/RiskReversalSection";
import { ApplicationFormNew } from "@/components/ApplicationFormNew";
import { Footer } from "@/components/Footer";

const Landing = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ThreePillarsSection />
      <FoundingFleetSection />
      <RiskReversalSection />
      <ApplicationFormNew />
      <Footer />
    </div>
  );
};

export default Landing;
