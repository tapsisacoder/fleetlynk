import { motion } from "framer-motion";
import { ShieldCheck, X, CreditCard, FileSignature, TrendingUp } from "lucide-react";

const guarantees = [
  {
    icon: CreditCard,
    negativeIcon: X,
    text: "No hardware to buy",
  },
  {
    icon: FileSignature,
    negativeIcon: X,
    text: "No long-term contracts",
  },
  {
    icon: ShieldCheck,
    negativeIcon: X,
    text: "No risk",
  },
];

export const RiskReversalSection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Guarantee Icons */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {guarantees.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1, 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 15 
                }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <item.icon className="w-8 h-8 text-muted-foreground" />
                  <X className="w-4 h-4 text-red-500 absolute -top-1 -right-1" />
                </div>
                <span className="text-foreground font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Main Promise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }}
            className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/30 rounded-2xl p-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                You See the Profit
              </h3>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              "If it doesn't work, you don't pay."
            </p>
            
            <p className="text-sm text-muted-foreground mt-4">
              We're so confident in LynkFleet that we're putting our money where our mouth is.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
