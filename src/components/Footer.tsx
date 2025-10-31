import { motion } from "framer-motion";
import { LogoHorizontal } from "./Logo";

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
            <p className="mb-2">LynkFleet — Modern Fleet Management for Southern Africa</p>
            <p>Founding Fleet Program Starts Next Year • Built for African Logistics</p>
          </div>

          <div className="flex justify-center gap-4 text-sm text-white/70">
            <a href="https://docs.lovable.dev/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy</a>
            <span>|</span>
            <a href="https://docs.lovable.dev/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Data Protection</a>
            <span>|</span>
            <a href="https://docs.lovable.dev/legal/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="pt-4 border-t border-white/20 text-sm text-white/60">
            © 2025 LynkFleet. Your data. Your rules. Always.
          </div>
        </div>
      </div>
    </footer>
  );
};
