import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { WhyWeExistSection } from "@/components/WhyWeExistSection";
import { MVPFeatureSection } from "@/components/MVPFeatureSection";
import { FoundingProgramSectionNew } from "@/components/FoundingProgramSectionNew";
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
      <WhyWeExistSection />
      <MVPFeatureSection />
      <FoundingProgramSectionNew />
      <ApplicationFormNew />
      <Footer />
    </div>
  );
};

export default Landing;
