import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Shield, Smartphone } from "lucide-react";

export const HeroSection = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById("application-form");
    formSection?.scrollIntoView({ behavior: "smooth" });
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/263780009785?text=Hi%20LynkFleet%2C%20I%27m%20interested%20in%20the%20Founding%20Fleet%20program", "_blank");
  };

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,8%)]">
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="text-left">
            {/* Hero headline with spring animation */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, mass: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Stop Running Your Fleet.
              <br />
              <span className="text-accent">Start Owning Your Profit.</span>
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
              className="text-lg md:text-xl text-white/90 mb-8 max-w-xl"
            >
              LynkFleet is the Command Center for fleet operators who are tired of manual chaos. Get total visibility of your fleet, fuel, finance, compliance and more —all from your phone.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                delay: 0.4 
              }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={openWhatsApp}
                  className="shadow-2xl w-full sm:w-auto"
                >
                  SECURE YOUR MARGINS ON WHATSAPP
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={scrollToForm}
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Apply for the Founding Fleet
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-sm text-white/70"
            >
              <Shield className="w-4 h-4" />
              <span>No hardware required • No long-term contracts</span>
            </motion.div>
          </div>

          {/* Right Column - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 80, 
              damping: 20,
              delay: 0.3 
            }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] md:w-[320px] h-[560px] md:h-[640px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800">
                {/* Screen */}
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-8 bg-primary flex items-center justify-between px-6 text-white text-xs">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* Dashboard Preview */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Good morning</p>
                        <p className="font-semibold text-foreground text-sm">Fleet Manager</p>
                      </div>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-accent/10 p-3 rounded-xl">
                        <p className="text-xs text-muted-foreground">Active Trips</p>
                        <p className="text-2xl font-bold text-accent">4</p>
                      </div>
                      <div className="bg-green-500/10 p-3 rounded-xl">
                        <p className="text-xs text-muted-foreground">Today's Profit</p>
                        <p className="text-2xl font-bold text-green-500">$2,450</p>
                      </div>
                    </div>
                    
                    {/* Fuel Card */}
                    <div className="bg-muted/50 p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-medium text-foreground">Fuel Efficiency</p>
                        <span className="text-xs text-green-500">↓ 12% saved</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    {/* Compliance Alert */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl">
                      <p className="text-xs font-medium text-yellow-600">⚠️ License expires in 12 days</p>
                      <p className="text-xs text-muted-foreground">ZWE-8472 • Renew now</p>
                    </div>
                    
                    {/* Trip Card */}
                    <div className="bg-muted/50 p-3 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">In Transit</p>
                          <p className="text-sm font-medium text-foreground">Harare → Beira</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">ETA</p>
                          <p className="text-sm font-medium text-accent">14:00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full"></div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-10 bg-accent/20 blur-3xl rounded-full -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
