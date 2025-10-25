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
              Who We Are
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-700 leading-relaxed"
          >
            <p className="mb-4">
              We are operators who got tired of watching good fleet managers drown in chaos.
            </p>

            <p>
              We are a fleet management platform designed for African logistics —affordable, mobile-first, convenient and efficient.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
