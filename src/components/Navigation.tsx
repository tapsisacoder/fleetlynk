import { Button } from "./ui/button";
import { LogoHorizontal } from "./Logo";

export const Navigation = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById("application-form");
    formSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <LogoHorizontal className="animate-fade-in-up" />
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20 animate-pulse-subtle">
              <span className="text-xs font-semibold text-accent">
                ⚡ Pilot: 100% Free
              </span>
            </div>
            
            <Button 
              variant="cta" 
              size="default"
              onClick={scrollToForm}
              className="font-semibold"
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
