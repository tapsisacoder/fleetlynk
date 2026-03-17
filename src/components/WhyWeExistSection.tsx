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
              WHO WE ARE
            </p>
            
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              We Understand Your Daily Struggles
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-4 text-lg text-gray-700 leading-relaxed"
          >
            <p>
              Every day across Southern Africa, fleet managers juggle spreadsheets, WhatsApp messages, paper receipts, and guesswork. Compliance deadlines sneak up. Fuel costs spiral. Maintenance surprises drain cash. You're working IN your business when you should be working ON it.
            </p>

            <p>
              We built FleetLynk because we've seen these struggles firsthand. This isn't Silicon Valley software adapted for Africa—it's built from the ground up for how Southern African logistics actually works.
            </p>

            <p>
              FleetLynk gives you one platform to manage trips, drivers, compliance, costs, invoicing, and documents. Vehicle tracking is optional (using driver smartphones or affordable hardware we're integrating soon). Everything you need, nothing you don't.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
            className="mt-6 border-l-4 border-accent bg-accent/5 p-6 text-gray-700"
          >
            <span className="font-semibold">💡 Our mission:</span> Make professional fleet management accessible to every operator, not just the big companies with massive budgets.
          </motion.div>
        </div>
      </div>
    </section>
  );
};
