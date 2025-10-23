import { Button } from "./ui/button";
import { ArrowRight, Shield } from "lucide-react";

export const HeroSection = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById("application-form");
    formSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,12%)] text-white overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-float delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full blur-3xl animate-float delay-300"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full mb-8 animate-fade-in-up animate-pulse-subtle">
            <span className="text-sm font-bold">⚡ Founding Fleet: Limited Spots</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up delay-100">
            No Hardware. No Hassle.
            <br />
            <span className="text-accent">Just Control.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Track your fleet using drivers' phones. Free pilot. Launching January 2026.
          </p>

          {/* CTA Button */}
          <Button 
            variant="hero" 
            size="xl"
            onClick={scrollToForm}
            className="mb-6 animate-fade-in-up delay-300"
          >
            Join the Founding Fleet
            <ArrowRight className="ml-2" />
          </Button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/70 animate-fade-in-up delay-400">
            <Shield className="w-4 h-4" />
            <span>Your data is encrypted and never shared</span>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};
