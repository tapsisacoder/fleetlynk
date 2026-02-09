import { motion } from "framer-motion";
import { Check, X, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

const benefits = [
  {
    title: "Full Access To LynkFleet Platform",
    description: "Everything. No feature limitations. No \"premium\" upsells. Complete fleet management from day one.",
  },
  {
    title: "50% Founding Member Discount",
    description: "Exclusive pricing for the first 3 months as a founding member. Available only to the first 20 operators.",
  },
  {
    title: "White-Glove Onboarding",
    description: "Personal setup call. We help migrate your data. Training for you and your team. Dedicated support contact.",
  },
  {
    title: "Shape The Product",
    description: "Monthly feedback sessions with our team. Your input directly influences features we build. You're not just a customer — you're a partner.",
  },
  {
    title: "Founding Member Recognition",
    description: "Badge and recognition as one of our founding partners. First to access new features as they launch.",
  },
];

const perfectFor = [
  "Run 3-50 trucks in South Africa, Zimbabwe, or SADC region",
  "Spend 40+ hours per month on manual fleet admin",
  "Are tired of flying blind (no real-time visibility)",
  "Want to work ON your business, not be trapped IN it",
  "Are ready to modernize (but don't want complexity)",
];

const notFor = [
  "Love paperwork and consider spreadsheets \"good enough\"",
  "Run 100+ trucks (we're building enterprise tier next)",
  "Expect magic without any onboarding effort",
  "Want to stay in 1995",
];

export const FoundingFleetSection = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/263780009785?text=Hi%20LynkFleet%2C%20I%27m%20interested%20in%20the%20Founding%20Fleet%20program", "_blank");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,8%)]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join The Founding Fleet Program
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Be one of 20 fleet operators to get early access, exclusive pricing, and direct influence on what we build next.
            </p>
          </motion.div>

          {/* Benefits Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">WHAT YOU GET AS A FOUNDING MEMBER:</h3>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-bold">{benefit.title}</h4>
                    <p className="text-white/70 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scarcity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 20 }}
            className="bg-yellow-500/20 border border-yellow-500/40 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-yellow-400 mb-2">⚠️ ONLY 20 SPOTS. ONLY 3 REMAIN.</h4>
                <p className="text-white/90 mb-4">
                  We're personally onboarding each operator to ensure your success. We physically cannot handle more than 20 during this founding phase.
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                  <div className="h-4 rounded-full bg-accent transition-all" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-white/80">
                  <span className="font-bold">17 Spots Claimed</span>
                  <span className="font-bold text-yellow-400">3 Spots Remaining</span>
                </div>
                <p className="text-sm text-white/60 mt-2">Applications close March 31st, 2025 — or when spots fill (whichever comes first)</p>
              </div>
            </div>
          </motion.div>

          {/* Who This Is For / Not For */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
              className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6"
            >
              <h4 className="text-green-400 font-bold text-lg mb-4">✅ THIS IS PERFECT IF YOU:</h4>
              <ul className="space-y-2">
                {perfectFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 80, damping: 20 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
            >
              <h4 className="text-red-400 font-bold text-lg mb-4">❌ THIS IS NOT RIGHT IF YOU:</h4>
              <ul className="space-y-2">
                {notFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white rounded-2xl p-8 text-center shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-foreground mb-2">
              READY TO STOP WORKING IN YOUR BUSINESS AND START WORKING ON IT?
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero" size="xl" onClick={openWhatsApp} className="shadow-xl">
                  💬 Secure My Spot On WhatsApp →
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Prefer to fill out a form? <a href="#" className="text-accent underline">Click here for quick application</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
