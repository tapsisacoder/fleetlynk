import { motion } from "framer-motion";
import dashboardScreenshot from "@/assets/dashboard-screenshot.png";

const rows = [
  {
    title: "DEPLOY A TRIP IN 2 MINUTES",
    description: "Enter pickup and destination. System calculates distance and fuel needed based on your truck's engine type and load status.\n\nAssign driver. Add costs. Click deploy. Done.\n\nWhat used to take 20 minutes of calculations and paperwork now takes 2 minutes.",
    detail: "Works offline — syncs when connected",
    imageLeft: true,
  },
  {
    title: "TRACK EVERYTHING IN REAL-TIME",
    description: "See all your trucks on one live map.\n\nNot because you bought expensive GPS hardware. Because the driver's smartphone is the GPS.\n\nZero hardware investment. Immediate visibility.",
    imageLeft: false,
  },
  {
    title: "NEVER MISS A DEADLINE AGAIN",
    description: "Color-coded compliance dashboard shows what's expiring soon.\n\nGreen = you're good. Yellow = expiring in 30 days. Red = urgent.\n\nAutomated WhatsApp reminders sent to you AND the driver.",
    imageLeft: true,
  },
  {
    title: "KNOW WHICH TRUCKS MAKE MONEY",
    description: "Finally see your real numbers.\n\nThis truck is profitable. That route is bleeding money. This driver is efficient. That one wastes fuel.\n\nMake decisions based on data, not feelings.",
    imageLeft: false,
  },
  {
    title: "MANAGE FROM ANYWHERE, ANYTIME",
    description: "At the office. At home. On the road. At a client meeting.\n\nYour entire operation accessible from any device with internet. Desktop, laptop, tablet, or mobile — your choice.\n\nBuilt for the modern fleet operator who refuses to be chained to a desk.",
    imageLeft: true,
  },
  {
    title: "WORKS WHEN INTERNET DOESN'T",
    description: "Poor connectivity? No problem.\n\nEnter trip data offline. It saves locally. Auto-syncs when you're back online.\n\nBuilt for African realities, not Silicon Valley fantasies.",
    imageLeft: false,
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See It In Action: Your Fleet Command Center
          </h2>
        </motion.div>

        <div className="space-y-16 max-w-5xl mx-auto">
          {rows.map((row, index) => (
            <motion.div
              key={row.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className={`flex flex-col ${row.imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
            >
              {/* Image/Screenshot */}
              <div className="flex-1 w-full">
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={dashboardScreenshot} 
                    alt={row.title}
                    className="w-full h-[250px] object-cover object-top"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-bold rounded-full mb-3">
                  Step {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{row.title}</h3>
                <div className="text-muted-foreground space-y-3">
                  {row.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {row.detail && (
                  <p className="text-sm text-accent font-medium mt-4 flex items-center gap-2">
                    📶 {row.detail}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
