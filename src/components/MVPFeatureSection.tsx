import { motion } from "framer-motion";
import { Route, FileCheck, Fuel, Receipt, Cloud, Calculator } from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Trip & Driver Management",
    description: "Real-time trip data. Driver assignments. Route history. Performance tracking."
  },
  {
    icon: FileCheck,
    title: "Automated Compliance",
    description: "License renewals. Vehicle inspections. Maintenance schedules. Never miss a deadline."
  },
  {
    icon: Fuel,
    title: "Fuel & Cost Tracking",
    description: "Per-trip fuel logs. Cost analysis. Precise fuel calculation with adaptive machine learning to better understand and optimise your fleet. Spot anomalies before they drain your budget."
  },
  {
    icon: Receipt,
    title: "Simple Invoicing",
    description: "Generate invoices fast. Track payments. Manage documents. No more Excel chaos."
  },
  {
    icon: Cloud,
    title: "Paperless & Connected",
    description: "Go completely paperless. Access your fleet data from anywhere, on any device. Your office travels with you—whether you're on-site or across borders."
  },
  {
    icon: Calculator,
    title: "Full In-House Accounting",
    description: "Complete accounting module built-in. Track income, expenses, invoices, and payments. Daily transaction logging with automated journal entries. No need for separate accounting software."
  }
];

export const MVPFeatureSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center max-w-5xl mx-auto mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            What LynkFleet Does for You
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: index * 0.1
              }}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <feature.icon className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-lg font-bold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-600 italic mt-6"
        >
          More features launching continuously.
        </motion.p>
      </div>
    </section>
  );
};
