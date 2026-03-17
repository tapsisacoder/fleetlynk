import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const outcomes = [
  {
    title: "KNOW YOUR REAL\nCOST PER KM",
    lines: ["Before the truck", "returns. Live.", "Per vehicle."],
  },
  {
    title: "INVOICE THE DAY\nTHE TRIP DELIVERS",
    lines: ["Not weeks later.", "Auto-generated", "from trip data."],
  },
  {
    title: "GET ALERTED\nBEFORE IT FAILS",
    lines: ["Compliance expiry.", "Fuel anomaly.", "Overdue payment.", "Never surprised again."],
  },
];

export const SolutionSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-3xl md:text-5xl font-bold text-primary leading-[1.1] tracking-tight mb-8"
        >
          ONE SYSTEM.
          <br />
          EVERY TRUCK.
          <br />
          TOTAL CONTROL.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 20 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl mb-12"
        >
          LynkFleet is a fleet management platform built specifically for trucking companies in Zimbabwe and Southern Africa. It manages your trips, your fleet compliance, your fuel, your workshop, your parts, your people, and your accounts — in one place. Built because nothing else exists here that was designed for how this industry actually works.
        </motion.p>

        <div className="w-16 h-0.5 bg-accent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {outcomes.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 80, damping: 20 }}
            >
              <h3 className="font-bold text-primary text-sm tracking-wide whitespace-pre-line mb-4">{item.title}</h3>
              {item.lines.map((line, j) => (
                <p key={j} className="text-muted-foreground text-sm leading-relaxed">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
