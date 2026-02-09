import { motion } from "framer-motion";
import { Eye, Shield, TrendingUp } from "lucide-react";

const pillars = [
  {
    icon: Eye,
    title: "COMPLETE VISIBILITY",
    subtitle: "Know Everything, Instantly",
    features: [
      "See every truck on one map (live)",
      "Real-time trip progress & ETAs",
      "Fuel consumption vs. expected",
      "Cost tracking per trip/route/driver",
      "Access from anywhere, anytime — desktop, tablet, or mobile",
    ],
    before: '"Let me call the driver and find out"',
    after: '"Let me check the dashboard" (2 seconds)',
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "ZERO SURPRISES",
    subtitle: "Sleep At Night Again",
    features: [
      "License expiry alerts (30, 14, 7 days)",
      "Maintenance reminders based on mileage",
      "Insurance & permit tracking",
      "Fuel anomaly detection",
      "Document expiry dashboard",
    ],
    before: "Getting fined because something expired",
    after: "Warning 30 days before anything expires",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: TrendingUp,
    title: "DATA-DRIVEN DECISIONS",
    subtitle: "Finally Know Your Real Numbers",
    features: [
      "Profit per trip (not just revenue)",
      "Cost per kilometer by vehicle",
      "Driver performance metrics",
      "Profitable routes vs. money losers",
      "Custom reports for your business",
    ],
    before: "Guessing which trucks make money",
    after: "Know exactly where every dollar goes",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

export const ProblemSection = () => {
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
            What If Your Entire Fleet Ran Like A Swiss Watch—
            <br />
            <span className="text-accent">Without You Micromanaging Every Detail?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            That's exactly what LynkFleet does. Not by adding MORE work to your plate.
            By automating the mundane, so you can focus on what actually grows your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: index * 0.15 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-accent/30"
            >
              <div className={`w-14 h-14 ${pillar.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                <pillar.icon className={`w-7 h-7 ${pillar.color}`} />
              </div>
              <h3 className={`text-lg font-bold ${pillar.color} mb-1`}>{pillar.title}</h3>
              <p className="text-foreground font-semibold mb-4">{pillar.subtitle}</p>
              
              <ul className="space-y-2 mb-6">
                {pillar.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 font-bold">NO MORE:</span>
                  <span className="text-muted-foreground">{pillar.before}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 font-bold">NOW:</span>
                  <span className="text-foreground font-medium">{pillar.after}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
