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
              WHY FLEETLYNK EXISTS
            </p>
            
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              African Fleets Deserve Better Than Broken Hardware and Empty Promises
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
              Every day, fleet managers across Southern Africa lose money to fuel theft, vehicle downtime, and chaos they can't see or control.
            </p>

            <p>
              The only solutions? Expensive GPS devices that break, get stolen, or stop working when you need them most. You're stuck paying thousands per truck, locked into contracts, and still blind when hardware fails.
            </p>

            <p className="font-semibold text-primary">
              There's a better way.
            </p>

            <p>
              FleetLynk uses the phones your drivers already carry. No devices to install. No hardware to replace. Just software that works—tracking vehicles, monitoring fuel, and putting you back in control.
            </p>

            <p>
              We're not building this alone. We're building it with 30 fleet managers who are tired of the old way and ready to shape the future of African logistics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
            className="mt-6 border-l-4 border-accent bg-accent/5 p-6 italic text-gray-700"
          >
            "You're not just testing software. You're helping build the tool that will run thousands of African fleets. That's why this matters."
          </motion.div>
        </div>
      </div>
    </section>
  );
};
