import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: "$1,340 / MONTH",
    description: "Average monthly fuel leakage on a 10-truck fleet with no anomaly detection. Untraced. Unrecovered.",
  },
  {
    value: "0",
    description: "Fleet operators in Zimbabwe who know their exact cost per km, per truck, per month. Do you know yours?",
  },
  {
    value: "34 DAYS",
    description: "Average time between trip completion and invoice collection when managed on WhatsApp and Excel. Your cash sits in someone else's account.",
  },
  {
    value: "1 TRUCK",
    description: "All it takes. One expired document. One roadblock. One impound. Most operators find out when it happens. Not before.",
  },
];

export const LossSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="bg-primary py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16 max-w-2xl"
        >
          WHAT IS YOUR FLEET ACTUALLY COSTING YOU?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 80, damping: 20 }}
            >
              <p className="font-mono text-3xl md:text-4xl font-bold text-accent mb-4">{stat.value}</p>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
