import { Facebook, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-xl font-bold">
            FleetLynk — The Software-First Fleet Revolution
          </div>

          <div className="text-sm text-white/80">
            Pilot: 100% Free | Launching January 2026 | Built for Africa
          </div>

          <div className="space-y-2 text-sm text-white/80">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="mailto:contact@fleetlynk.com" className="hover:text-accent transition-colors">
                📧 contact@fleetlynk.com
              </a>
              <span className="hidden sm:inline">|</span>
              <span>
                📱 WhatsApp: +27 XX XXX XXXX
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4">
            <a href="#" className="hover:text-accent transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60 pt-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Data Protection</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="text-xs text-white/60 pt-4">
            © 2025 FleetLynk. Your data. Your rules. Always.
          </div>
        </div>
      </div>
    </footer>
  );
};
