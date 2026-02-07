import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";
import heroTruckBg from "@/assets/hero-truck-bg.jpg";
import dashboardScreenshot from "@/assets/dashboard-screenshot.png";

export const HeroSection = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/263780009785?text=Hi%20LynkFleet%2C%20I%27m%20interested%20in%20the%20Founding%20Fleet%20program", "_blank");
  };

  return (
    <section 
      className="relative min-h-[90vh] overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom right, hsla(221, 47%, 11%, 0.85), hsla(221, 47%, 8%, 0.9)), url(${heroTruckBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
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
                  CONTACT US ON WHATSAPP AND SECURE YOUR MARGINS
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

          {/* Right Column - Laptop + Phone Mockup (Smaller) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 80, 
              damping: 20,
              delay: 0.3 
            }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative scale-75 md:scale-85 lg:scale-90 origin-center">
              {/* Laptop Frame */}
              <div className="relative">
                {/* Laptop Screen */}
                <div className="relative w-[420px] md:w-[480px] bg-gray-800 rounded-t-xl p-2 shadow-2xl">
                  {/* Screen bezel */}
                  <div className="w-full h-[260px] md:h-[300px] bg-background rounded-lg overflow-hidden relative">
                    {/* Dashboard Screenshot */}
                    <img 
                      src={dashboardScreenshot} 
                      alt="LynkFleet Dashboard"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  
                  {/* Camera notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
                
                {/* Laptop Base */}
                <div className="w-[460px] md:w-[520px] h-4 bg-gray-700 rounded-b-xl mx-auto relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-b"></div>
                </div>
                <div className="w-[500px] md:w-[560px] h-2 bg-gray-800 rounded-b-lg mx-auto"></div>
              </div>

              {/* Phone Frame - Positioned to overlap */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
                className="absolute -right-2 -bottom-6 md:-right-4 md:-bottom-8"
              >
                <div className="relative w-[120px] md:w-[140px] h-[240px] md:h-[280px] bg-gray-900 rounded-[1.5rem] p-1.5 shadow-2xl border-2 border-gray-800">
                  {/* Screen */}
                  <div className="w-full h-full bg-background rounded-[1.2rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-5 bg-primary flex items-center justify-between px-3 text-white text-[8px]">
                      <span>9:41</span>
                      <div className="flex gap-0.5">
                        <div className="w-2 h-1 bg-white/80 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Reports Preview */}
                    <div className="p-2 space-y-2">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-3 h-3 bg-primary rounded flex items-center justify-center">
                          <span className="text-[6px] text-white font-bold">📊</span>
                        </div>
                        <span className="text-[9px] font-semibold text-foreground">Reports</span>
                      </div>

                      {/* Mini Stats */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-green-500/10 p-1.5 rounded">
                          <p className="text-[6px] text-muted-foreground">Revenue</p>
                          <p className="text-[10px] font-bold text-green-500">$48K</p>
                        </div>
                        <div className="bg-red-500/10 p-1.5 rounded">
                          <p className="text-[6px] text-muted-foreground">Expenses</p>
                          <p className="text-[10px] font-bold text-red-500">$36K</p>
                        </div>
                      </div>

                      {/* Profit */}
                      <div className="bg-accent/10 p-1.5 rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[6px] text-muted-foreground">Net Profit</p>
                            <p className="text-xs font-bold text-accent">$12,250</p>
                          </div>
                          <span className="text-green-500">↑</span>
                        </div>
                      </div>

                      {/* Mini Bar Chart */}
                      <div className="flex items-end gap-0.5 h-6 mt-2">
                        {[40, 60, 35, 80, 55, 70, 45].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/60 rounded-t" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-gray-900 rounded-full"></div>
                </div>
              </motion.div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-10 bg-accent/20 blur-3xl rounded-full -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};