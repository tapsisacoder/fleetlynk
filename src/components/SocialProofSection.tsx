import { motion } from "framer-motion";
import { TrendingDown, Clock, ShieldCheck, Eye, Quote } from "lucide-react";

const stats = [
  { icon: TrendingDown, value: "30%", label: "reduction in fuel waste" },
  { icon: Clock, value: "15hrs", label: "per week saved on admin" },
  { icon: ShieldCheck, value: "Zero", label: "compliance surprises in 60 days" },
  { icon: Eye, value: "100%", label: "operational visibility" },
];

export const SocialProofSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built By Fleet Operators, For Fleet Operators
            </h2>
          </motion.div>

          {/* Beta Testing Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
            className="bg-card border border-border rounded-2xl p-8 mb-8"
          >
            <h3 className="text-lg font-bold text-foreground mb-2">CURRENTLY TESTING WITH REAL FLEETS</h3>
            <p className="text-muted-foreground mb-6">
              We're in beta testing with select fleet operators across South Africa and Zimbabwe. Early results from our testing phase:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6 text-center italic">— Beta Testing Program, January 2025</p>
          </motion.div>

          {/* Founder Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
            className="bg-gradient-to-br from-primary to-[hsl(221,47%,12%)] rounded-2xl p-8 text-white"
          >
            <Quote className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-lg font-bold mb-4">WHY WE BUILT THIS</h3>
            <div className="space-y-4 text-white/90">
              <p>
                "My father has run a transport company for 25 years. I watched him work 14-hour days doing things that should take minutes.
              </p>
              <p>
                Stuck in the office on weekends while competitors were with their families. Making decisions based on guesswork instead of data. Finding out about problems only after they became expensive.
              </p>
              <p>
                That's why I built LynkFleet.
              </p>
              <p className="font-bold text-accent">
                Not for Silicon Valley. For operators like him. For roads like ours. For realities like ours. For fleets that deserve better tools."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20">
              <p className="font-bold">— Founder, LynkFleet</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
