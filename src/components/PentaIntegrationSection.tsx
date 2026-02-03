import { motion } from "framer-motion";
import { Fuel, Wrench, ShieldCheck, DollarSign, Route } from "lucide-react";

const pillars = [
  {
    icon: Fuel,
    title: "Fuel Intelligence",
    leak: "The \"Siphoned Tank\" Leak",
    problem: "Fuel is your biggest expense and your easiest target. Between \"side-selling\" and inefficient routing, 10-15% of your diesel budget never actually moves a load.",
    solution: "We don't just track location; we track consumption vs. weight. Our machine learning spots anomalies instantly. If the tank drops and the wheels aren't turning, you get an alert before the driver even puts the cap back on.",
    result: "Master the tank. Keep the cash.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Wrench,
    title: "Workshop Sovereignty",
    leak: "The \"Disappearing Spares\" Leak",
    problem: "Your yard is a supermarket where everything is \"free\" for the taking. Spares are bought but never fitted; new tires are swapped for old ones on the road.",
    solution: "Digital job cards and inventory lockdown. Every bolt, filter, and tire is assigned to a specific truck and a specific mechanic. If it's not in the system, it's a theft.",
    result: "Protect your assets. End the \"Back-Gate\" tax.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Autopilot",
    leak: "The \"Roadside Fine\" Leak",
    problem: "$200 here, $500 there. Fines for expired permits, late licenses, or missed inspections are \"voluntary taxes\" paid to the authorities because you forgot a date in a notebook.",
    solution: "A central \"Compliance Shield.\" The system tracks every expiry date across SADC borders and pushes alerts to your phone 30 days out. You don't \"forget\"; the system remembers.",
    result: "Zero Fines. Zero Delays.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: DollarSign,
    title: "Financial Command",
    leak: "The \"Accounting Void\" Leak",
    problem: "You think a trip was profitable, but you forgot the driver allowance, the toll fees, and the maintenance wear. You only find out you lost money at the end of the month.",
    solution: "Real-time P&L. Every expense is journaled the moment it happens. You see your net margin while the truck is still in transit. If a route is losing money, you kill it immediately.",
    result: "Know your numbers. Own your profit.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Route,
    title: "Trip Orchestration",
    leak: "The \"Admin Chaos\" Leak",
    problem: "50 WhatsApp groups, 100 phone calls, and piles of paper logbooks. Information gets lost, drivers get confused, and clients get angry.",
    solution: "One screen. One truth. Assign trips, track progress, and communicate with drivers in a single paperless environment. Everything is recorded, and nothing is \"lost in translation.\"",
    result: "Stop the chaos. Scale the fleet.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export const PentaIntegrationSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stop the Invisible Leak in Your Fleet
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The Penta-Integration: Five systems that plug every profit drain
          </p>
        </motion.div>

        <div className="space-y-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring", 
                stiffness: 80, 
                damping: 20,
                delay: index * 0.1 
              }}
              className="relative group"
            >
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:border-accent/30">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon and Title */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 ${pillar.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                      <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {index + 1}. {pillar.title}
                    </h3>
                    <p className={`${pillar.color} font-semibold text-sm`}>
                      {pillar.leak}
                    </p>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">The Leak:</p>
                      <p className="text-muted-foreground">{pillar.problem}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">The LynkFleet Plug:</p>
                      <p className="text-foreground">{pillar.solution}</p>
                    </div>
                    
                    <div className={`inline-block px-4 py-2 ${pillar.bgColor} rounded-lg`}>
                      <p className={`font-bold ${pillar.color}`}>
                        ✓ {pillar.result}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
