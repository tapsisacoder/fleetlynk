import { motion } from "framer-motion";
import { Check, Users, Percent, Headphones } from "lucide-react";
import { Button } from "./ui/button";

const perks = [
  {
    icon: Percent,
    title: "50% Off for 3 Months",
    description: "Lock in founder pricing before we go full commercial.",
  },
  {
    icon: Users,
    title: "Direct Product Input",
    description: "Shape the software that will run the SADC region.",
  },
  {
    icon: Headphones,
    title: "White-Glove Onboarding",
    description: "We set it up for you. Zero tech headaches.",
  },
];

export const FoundingFleetSection = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById("application-form");
    formSection?.scrollIntoView({ behavior: "smooth" });
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
                EXCLUSIVE BETA PROGRAM
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Join the Elite 20
              </h2>
              
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                We are selecting 20 forward-thinking operators for our private Beta. 
                Limited spots to ensure every operator succeeds.
              </p>
            </motion.div>
          </div>

          {/* Perks Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
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

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-2xl p-8 text-center shadow-2xl"
          >
            <div className="flex items-center justify-center gap-2 text-accent font-bold text-lg mb-4">
              <span>⚡</span>
              <span>Applications close March 31st • Only 20 spots available</span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="hero" 
                size="xl"
                onClick={scrollToForm}
                className="shadow-xl"
              >
                Apply for Founding Fleet
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
