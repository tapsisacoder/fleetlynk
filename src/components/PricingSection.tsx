import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  "All 10 modules included",
  "Unlimited users",
  "Onboarding call — we import your data",
  "Bank transfer, EFT, or EcoCash",
  "Annual plan: pay 10 months, get 12",
];

export const PricingSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-3xl" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-3xl md:text-4xl font-bold text-primary tracking-tight mb-12"
        >
          STRAIGHTFORWARD PRICING
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, type: "spring", stiffness: 80, damping: 20 }}
          className="mb-12"
        >
          <p className="font-mono text-6xl md:text-7xl font-bold text-primary">$40</p>
          <p className="text-sm text-muted-foreground mt-2 tracking-wide uppercase">Per truck / Per month · VAT inclusive</p>
        </motion.div>

        {/* Hormozi block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl font-bold text-primary leading-tight">
            YOUR TRUCKS GENERATE
            <br />
            REAL MONEY EVERY DAY.
          </p>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            $40 a month per truck is what it costs to know exactly where it goes.
          </p>
        </motion.div>

        {/* Feature list */}
        <div className="space-y-0">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="py-3 border-b border-border text-sm text-primary"
            >
              {feature}
            </motion.div>
          ))}
        </div>

        {/* Founding fleet callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 border-2 border-accent p-6"
        >
          <p className="font-mono text-sm font-bold text-accent tracking-wider">
            FOUNDING FLEET — FIRST 20 CLIENTS RECEIVE 2 MONTHS FREE AFTER TRIAL
          </p>
        </motion.div>
      </div>
    </section>
  );
};
