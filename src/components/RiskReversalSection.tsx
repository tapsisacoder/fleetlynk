import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Undo2, Database, TrendingUp } from "lucide-react";

const guarantees = [
  { icon: CreditCard, text: "No credit card required to apply" },
  { icon: Undo2, text: "30-day money-back guarantee when you start" },
  { icon: ShieldCheck, text: "Cancel anytime, no questions asked, no penalties" },
  { icon: Database, text: "We help you migrate your data (white-glove service)" },
  { icon: TrendingUp, text: "If LynkFleet doesn't save you 10x what you invest, we refund everything" },
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
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-600 font-bold text-sm mb-6">
            <ShieldCheck className="w-5 h-5" />
            ZERO-RISK GUARANTEE
          </div>

          <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/30 rounded-2xl p-8">
            <ul className="space-y-4 text-left max-w-lg mx-auto mb-6">
              {guarantees.map((item, index) => (
                <motion.li
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
                  className="flex items-start gap-3"
                >
                  <item.icon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{item.text}</span>
                </motion.li>
              ))}
            </ul>

            <div className="border-t border-green-500/20 pt-6">
              <p className="text-xl font-bold text-foreground mb-2">
                You literally cannot lose.
              </p>
              <p className="text-muted-foreground">
                Either your fleet operations transform, or you get your money back. That's our promise.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
