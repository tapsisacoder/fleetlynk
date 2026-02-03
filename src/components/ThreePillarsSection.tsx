import { motion } from "framer-motion";
import { Fuel, DollarSign, ShieldCheck } from "lucide-react";

const pillars = [
  {
    icon: Fuel,
    title: "Fuel Intelligence",
    tagline: "Don't just track liters.",
    description: "Catch theft and optimize routes before the trip ends. Real-time fuel monitoring with variance alerts that protect your margins.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: DollarSign,
    title: "Financial Command",
    tagline: "Real-time P&L for every trip.",
    description: "Know your profit while the wheels are turning. Full accounting integration that shows you exactly where your money goes.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Compliance on Autopilot",
    tagline: "Zero fines. Zero expired permits.",
    description: "The system remembers so you don't have to. Automated alerts for licenses, insurance, roadworthy certificates and more.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

export const ThreePillarsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Three Pillars of Fleet Sovereignty
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take control of the three areas that bleed your profit dry
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring", 
                stiffness: 80, 
                damping: 20,
                delay: index * 0.1 
              }}
              className="relative group"
            >
              <div className="bg-card border border-border rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:border-accent/30">
                <div className={`w-16 h-16 ${pillar.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {pillar.title}
                </h3>
                
                <p className={`${pillar.color} font-semibold text-sm mb-3`}>
                  {pillar.tagline}
                </p>
                
                <p className="text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
