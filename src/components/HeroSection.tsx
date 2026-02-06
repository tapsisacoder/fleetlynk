import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Shield, Smartphone, Truck, MapPin, TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react";
import heroTruckBg from "@/assets/hero-truck-bg.jpg";

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

          {/* Right Column - Laptop + Phone Mockup */}
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
            <div className="relative">
              {/* Laptop Frame */}
              <div className="relative">
                {/* Laptop Screen */}
                <div className="relative w-[500px] md:w-[580px] bg-gray-800 rounded-t-xl p-2 shadow-2xl">
                  {/* Screen bezel */}
                  <div className="w-full h-[320px] md:h-[360px] bg-background rounded-lg overflow-hidden relative">
                    {/* Dashboard Preview Content */}
                    <div className="p-4 h-full overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                            <span className="text-primary-foreground text-xs font-bold">L</span>
                          </div>
                          <span className="font-semibold text-foreground text-sm">LynkFleet Dashboard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">Live</span>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-[10px] text-muted-foreground">Active Vehicles</p>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-primary" />
                            <span className="text-lg font-bold text-foreground">12/15</span>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-[10px] text-muted-foreground">Active Trips</p>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="text-lg font-bold text-foreground">8</span>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-[10px] text-muted-foreground">Monthly Revenue</p>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-lg font-bold text-green-500">$48,250</span>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-[10px] text-muted-foreground">Profit Margin</p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-lg font-bold text-green-500">24%</span>
                          </div>
                        </div>
                      </div>

                      {/* Chart and Trips Row */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* Mini Chart */}
                        <div className="col-span-2 bg-muted/30 p-3 rounded-lg">
                          <p className="text-[10px] text-muted-foreground mb-2">Revenue vs Expenses</p>
                          <div className="flex items-end gap-1 h-20">
                            {[65, 80, 45, 90, 70, 85, 55].map((height, i) => (
                              <div key={i} className="flex-1 flex flex-col gap-0.5">
                                <div className="bg-primary rounded-t" style={{ height: `${height}%` }}></div>
                                <div className="bg-destructive/50 rounded-b" style={{ height: `${height * 0.4}%` }}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Active Trips List */}
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <p className="text-[10px] text-muted-foreground mb-2">In Transit</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px]">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-foreground">HRE→Beira</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-foreground">JHB→Maputo</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-foreground">Durban→HRE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Camera notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
                
                {/* Laptop Base */}
                <div className="w-[540px] md:w-[620px] h-4 bg-gray-700 rounded-b-xl mx-auto relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-600 rounded-b"></div>
                </div>
                <div className="w-[600px] md:w-[680px] h-2 bg-gray-800 rounded-b-lg mx-auto"></div>
              </div>

              {/* Phone Frame - Positioned to overlap */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 80 }}
                className="absolute -right-4 -bottom-8 md:-right-8 md:-bottom-12"
              >
                <div className="relative w-[160px] md:w-[180px] h-[320px] md:h-[360px] bg-gray-900 rounded-[2rem] p-2 shadow-2xl border-2 border-gray-800">
                  {/* Screen */}
                  <div className="w-full h-full bg-background rounded-[1.5rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="h-6 bg-primary flex items-center justify-between px-4 text-white text-[10px]">
                      <span>9:41</span>
                      <div className="flex gap-0.5">
                        <div className="w-3 h-1.5 bg-white/80 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Reports Preview */}
                    <div className="p-3 space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Reports</span>
                      </div>

                      {/* Mini Pie Chart */}
                      <div className="bg-muted/50 p-3 rounded-xl">
                        <p className="text-[9px] text-muted-foreground mb-2">Expenses</p>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 rounded-full border-4 border-primary relative">
                            <div className="absolute inset-1 rounded-full border-4 border-accent"></div>
                          </div>
                          <div className="text-[9px] space-y-1">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-primary rounded"></div>
                              <span className="text-muted-foreground">Fuel 45%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-accent rounded"></div>
                              <span className="text-muted-foreground">Tolls 25%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-green-500/10 p-2 rounded-lg">
                          <p className="text-[8px] text-muted-foreground">Revenue</p>
                          <p className="text-sm font-bold text-green-500">$48K</p>
                        </div>
                        <div className="bg-red-500/10 p-2 rounded-lg">
                          <p className="text-[8px] text-muted-foreground">Expenses</p>
                          <p className="text-sm font-bold text-red-500">$36K</p>
                        </div>
                      </div>

                      {/* Profit */}
                      <div className="bg-accent/10 p-2 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[8px] text-muted-foreground">Net Profit</p>
                            <p className="text-base font-bold text-accent">$12,250</p>
                          </div>
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                      </div>

                      {/* Mini Bar Chart */}
                      <div className="flex items-end gap-0.5 h-8">
                        {[40, 60, 35, 80, 55, 70, 45].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/60 rounded-t" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-900 rounded-full"></div>
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
