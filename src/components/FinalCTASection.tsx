import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Lock, Check, Globe, Monitor, Wifi } from "lucide-react";

export const FinalCTASection = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/263780009785?text=Hi%20LynkFleet%2C%20I%27m%20ready%20to%20secure%20my%20founding%20spot", "_blank");
  };

  // Countdown to March 31, 2025
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2025-03-31T23:59:59').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,8%)]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              3 Spots Left. Deadline: March 31st.
            </h2>

            <div className="text-lg text-white/80 space-y-2 mb-8">
              <p>Every day you wait is another <span className="text-accent font-bold">$250</span> in hidden losses.</p>
              <p>That's <span className="font-bold text-white">$1,750 per week. $7,500 per month. $90,000 per year.</span></p>
              <p className="text-white/60">Gone. Preventable. Invisible.</p>
              <p className="text-accent font-bold text-xl mt-4">You can stop it today.</p>
            </div>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Mins', value: timeLeft.minutes },
                { label: 'Secs', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-3xl font-bold text-white">{String(item.value).padStart(2, '0')}</p>
                  <p className="text-xs text-white/60 uppercase">{item.label}</p>
                </div>
              ))}
            </div>

            <p className="text-white/80 mb-6">
              Join the 17 fleet operators who've already secured their founding spot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero" size="xl" onClick={openWhatsApp} className="shadow-2xl text-lg">
                  💬 I'm Ready — WhatsApp Me The Details →
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-white/60">
              Or <a href="#" className="text-accent underline">fill out quick application form</a>
            </p>

            {/* Trust Elements */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white/70">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Built in Africa, for Africa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Monitor className="w-4 h-4" />
                <span>Any device, anywhere</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-4 h-4" />
                <span>Works offline</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
