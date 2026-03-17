import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { LogoHorizontal } from "./Logo";

export const Navigation = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById("application-form");
    formSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <LogoHorizontal />
          
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20"
            >
              <span className="text-xs font-semibold text-accent">
                Pilot: Free
              </span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                variant="cta" 
                size="default"
                onClick={scrollToForm}
                className="font-semibold"
              >
                Apply Now
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};
