import { motion } from "framer-motion";
import { LogoHorizontal } from "./Logo";
import { Linkedin, Facebook, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            <LogoHorizontal className="justify-center [&>div]:text-white [&_path]:stroke-white [&_circle]:fill-accent" />
          </motion.div>
          
          <div className="text-sm text-white/80">
            <p className="mb-2">FleetLynk — Modern Fleet Management for Southern Africa</p>
            <p>Pilot Program Starts Next Year • Built for African Logistics</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
            <a href="mailto:contact@fleetlynk.com" className="hover:text-white transition-colors">
              📧 contact@fleetlynk.com
            </a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">
              📱 +27 XX XXX XXXX
            </a>
          </div>

          <div className="flex justify-center gap-4 text-sm text-white/70">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Data Protection</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="flex justify-center gap-4 text-white/70">
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: "rgba(255,255,255,1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: "rgba(255,255,255,1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Facebook className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: "rgba(255,255,255,1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
          </div>

          <div className="pt-4 border-t border-white/20 text-sm text-white/60">
            © 2025 FleetLynk. Your data. Your rules. Always.
          </div>
        </div>
      </div>
    </footer>
  );
};
