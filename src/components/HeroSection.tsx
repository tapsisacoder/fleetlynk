import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";
import heroTruck from "@/assets/hero-truck-new.jpg";

export const HeroSection = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById("application-form");
    formSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Hero truck image background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroTruck})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero headline with spring animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, mass: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            The Smarter Way to
            <br />
            <span className="text-accent">Manage Your Fleet</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15, 
              mass: 0.8,
              delay: 0.2 
            }}
            className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto"
          >
            Modern Fleet Management software that handles operations, compliance, costs, communication and more —all on one platform.
          </motion.p>

          {/* Urgency badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15, 
              bounce: 0.4,
              delay: 0.3 
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full mb-8"
          >
            <span className="text-sm font-bold text-white">⚡ Limited founding spots • Applications close December 31st</span>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              delay: 0.4 
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6"
          >
            <Button 
              variant="hero" 
              size="xl"
              onClick={scrollToForm}
              className="shadow-2xl"
            >
              Join the Founding Fleet
            </Button>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-white/70"
          >
            <Shield className="w-4 h-4" />
            <span>Data encrypted • Never shared</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
