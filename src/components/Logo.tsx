export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="font-bold text-2xl text-primary animate-fade-in-up">
        FleetLynk
      </div>
      <div className="w-[60px] h-[2px] bg-accent mt-1 animate-fade-in delay-200"></div>
    </div>
  );
};

export const LogoHorizontal = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="font-bold text-xl md:text-2xl text-primary">
        FleetLynk
      </div>
      <div className="w-[2px] h-6 bg-accent"></div>
      <div className="text-xs md:text-sm text-muted-foreground font-medium">
        Software-First Fleet
      </div>
    </div>
  );
};
