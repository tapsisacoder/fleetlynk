import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { PentaIntegrationSection } from "@/components/PentaIntegrationSection";
import { FoundingFleetSection } from "@/components/FoundingFleetSection";
import { RiskReversalSection } from "@/components/RiskReversalSection";
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
      <PentaIntegrationSection />
      <FoundingFleetSection />
      <RiskReversalSection />
      <Footer />
    </div>
  );
};

export default Landing;
