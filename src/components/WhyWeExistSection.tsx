import { motion } from "framer-motion";

export const WhyWeExistSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <p className="text-accent uppercase tracking-wide text-sm font-bold mb-4">
              WHO ARE WE?
            </p>
            
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Who are we?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            <p>
              LynkFleet is a next-generation fleet management platform built for Southern Africa's trucking industry. We empower transport operators to take full control of their fleets — no expensive hardware required. From live trip tracking and fuel intelligence to driver performance and maintenance insights, FleetLynk brings every moving part of your business into one simple, powerful dashboard. Built for Africa's roads, designed for its realities, and ready to drive your fleet further.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
