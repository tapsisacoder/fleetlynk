import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SocialProofBar } from "@/components/SocialProofBar";
import { ProblemSection } from "@/components/ProblemSection";
import { PentaIntegrationSection } from "@/components/PentaIntegrationSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FoundingFleetSection } from "@/components/FoundingFleetSection";
import { RiskReversalSection } from "@/components/RiskReversalSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { FAQSection } from "@/components/FAQSection";
import { FinalCTASection } from "@/components/FinalCTASection";
import { Footer } from "@/components/Footer";

const Landing = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <SocialProofBar />
      <ProblemSection />
      <PentaIntegrationSection />
      <HowItWorksSection />
      <FoundingFleetSection />
      <RiskReversalSection />
      <SocialProofSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Landing;
