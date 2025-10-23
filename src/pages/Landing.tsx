import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FoundingValueSection } from "@/components/FoundingValueSection";
import { ProblemSolutionSection } from "@/components/ProblemSolutionSection";
import { ThreeToolsSection } from "@/components/ThreeToolsSection";
import { EconomicsSection } from "@/components/EconomicsSection";
import { FoundingProgramSection } from "@/components/FoundingProgramSection";
import { ApplicationForm } from "@/components/ApplicationForm";
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
      <FoundingValueSection />
      <ProblemSolutionSection />
      <ThreeToolsSection />
      <EconomicsSection />
      <FoundingProgramSection />
      <ApplicationForm />
      <Footer />
    </div>
  );
};

export default Landing;
