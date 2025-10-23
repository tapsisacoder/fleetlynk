import { motion } from "framer-motion";
import { Gift, Users, Crown } from "lucide-react";

const valueProps = [
  {
    icon: Gift,
    title: "100% Free Pilot",
    description: "No cost. No credit card. No catch."
  },
  {
    icon: Users,
    title: "Shape the Product",
    description: "Your feedback becomes features."
  },
  {
    icon: Crown,
    title: "Founder Pricing",
    description: "Locked-in rates when we launch."
  }
];

export const ValuePropsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-3xl md:text-4xl font-bold text-primary text-center mb-10"
        >
          Why Founding Members Join
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: index * 0.1
              }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="bg-white p-8 rounded-xl shadow-lg text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-block mb-4"
              >
                <prop.icon className="w-12 h-12 text-accent" />
              </motion.div>
              <h3 className="text-xl font-bold text-primary mb-2">{prop.title}</h3>
              <p className="text-gray-600">{prop.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
