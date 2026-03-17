import { motion } from "framer-motion";
import dashboardImg from "@/assets/dashboard-hero.png";

export const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] bg-primary overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left — Copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, mass: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              YOUR TRUCKS
              <br />
              ARE MAKING MONEY.
              <br />
              <br />
              <span className="text-muted-foreground">ARE YOU?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
              className="mt-8 text-lg text-white/70 max-w-md"
            >
              LynkFleet tells you exactly where it goes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={scrollToForm}
                className="mt-8 bg-accent text-accent-foreground px-8 py-3.5 text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                REQUEST ACCESS
              </button>
            </motion.div>
          </div>

          {/* Right — Dashboard Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }}
            className="hidden lg:block"
          >
            <img
              src={dashboardImg}
              alt="LynkFleet dashboard showing live fleet status, trip tracking, and cost per kilometer"
              className="w-full max-w-2xl ml-auto"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom data strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-primary"
      >
        <div className="container mx-auto px-4 py-4">
          <p className="font-mono text-xs sm:text-sm text-white/50 tracking-wider text-center">
            $40 / TRUCK / MONTH &nbsp;·&nbsp; FOUNDING FLEET — 20 SPOTS ONLY
          </p>
        </div>
      </motion.div>
    </section>
  );
};
