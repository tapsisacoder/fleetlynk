import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import heroTruck from "@/assets/hero-truck.jpg";

const comparisons = [
  { old: "Buy devices (R2,000+ each)", new: "Use phones drivers have" },
  { old: "Installation headaches", new: "Works immediately" },
  { old: "Drivers \"lose\" them", new: "Cloud-based, always on" },
  { old: "Locked to one vendor", new: "You own your data" },
  { old: "You're working IN the business", new: "You work ON the business" }
];

export const ComparisonSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Hardware Trap vs. Software Freedom
            </h2>

            <div className="space-y-4">
              {comparisons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: index * 0.1
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-start gap-2 text-gray-500">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                    <span className="text-sm">{item.old}</span>
                  </div>
                  <div className="flex items-start gap-2 text-primary">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
                    <span className="text-sm font-semibold">{item.new}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 text-sm mt-6"
            >
              More features launching continuously. You decide what we build next.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.img
                src={heroTruck}
                alt="Modern connected truck"
                className="rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
