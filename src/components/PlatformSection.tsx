import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const modules = [
  { name: "DASHBOARD", desc: "Live fleet status. Alerts. Quick actions." },
  { name: "OPERATIONS", desc: "Trips from creation to invoice." },
  { name: "FLEET", desc: "Vehicles, compliance, tyres, movements." },
  { name: "FUEL", desc: "Tank levels, issuance, anomaly detection." },
  { name: "WORKSHOP", desc: "Job cards, inspections, maintenance." },
  { name: "INVENTORY", desc: "Parts, GRNs, purchase orders." },
  { name: "ACCOUNTS", desc: "Invoicing, payments, P&L." },
  { name: "HR", desc: "Drivers, payroll, scorecards." },
  { name: "REPORTS", desc: "Business intelligence built for fleets." },
  { name: "SETTINGS", desc: "Users, roles, company configuration." },
];

export const PlatformSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="the-platform" className="bg-primary py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16"
        >
          THE PLATFORM
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 80, damping: 20 }}
              className="flex gap-6 py-3 border-b border-white/10"
            >
              <span className="font-mono text-sm font-bold text-white w-28 shrink-0">{mod.name}</span>
              <span className="text-sm text-white/50">{mod.desc}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-6 border-t border-accent"
        >
          <p className="font-mono text-xs text-accent tracking-wider">
            ALL 10 MODULES. ONE PRICE. NO ADD-ONS.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
