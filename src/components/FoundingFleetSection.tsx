import { motion } from "framer-motion";
import { Lock, Users, Headphones, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

const perks = [
  {
    icon: Lock,
    title: "Locked-in Pricing",
    description: "50% discount for the first 3 months of your commercial rollout.",
  },
  {
    icon: Users,
    title: "Direct Architecture Access",
    description: "You work directly with the founders to tailor the dashboard to your specific routes (Harare, Beira, Jo'burg).",
  },
  {
    icon: Headphones,
    title: "VIP Implementation",
    description: "We don't just give you a login; we ensure your fleet is optimized from Day 1.",
  },
];

export const FoundingFleetSection = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/263780009785?text=Hi%20LynkFleet%2C%20I%27m%20interested%20in%20the%20Founding%20Fleet%20program", "_blank");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,8%)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="inline-block px-4 py-2 bg-accent text-white rounded-full font-bold text-sm mb-6">
                2026 COMMERCIAL PRE-LAUNCH
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                The Founding Fleet
              </h2>
              
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-4">
                Only 20 Spots for the 2026 Commercial Pre-Launch
              </p>
              
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                We are officially launching LynkFleet across Zimbabwe. To ensure the first wave of operators dominates their routes, we are opening 20 Founding Spots.
              </p>
            </motion.div>
          </div>

          {/* Perks Grid */}
          <div className="mb-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, type: "spring", stiffness: 100, damping: 20 }}
              className="text-2xl font-bold text-white text-center mb-6"
            >
              The Founding Advantage
            </motion.h3>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {perks.map((perk, index) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: 0.3 + index * 0.1, 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 20 
                  }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                    <perk.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
                  <p className="text-white/70 text-sm">{perk.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* The Catch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
            className="bg-yellow-500/20 border border-yellow-500/40 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold text-yellow-400 mb-2">The Catch</h4>
                <p className="text-white/90">
                  Once the 20 spots are filled, the commercial rate doubles and the public waitlist begins.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-2xl p-8 text-center shadow-2xl"
          >
            <div className="flex items-center justify-center gap-2 text-accent font-bold text-lg mb-4">
              <span>⚡</span>
              <span>Only 20 spots available • Don't miss out</span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="hero" 
                size="xl"
                onClick={openWhatsApp}
                className="shadow-xl"
              >
                Contact Us on WhatsApp
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
