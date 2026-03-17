import { motion } from "framer-motion";

export const Logo = ({ className = "", variant = "dark" }: { className?: string; variant?: "dark" | "light" }) => {
  const textColor = variant === "light" ? "text-white" : "text-primary";
  const strokeColor = variant === "light" ? "#ffffff" : "hsl(210, 50%, 12%)";
  const accentColor = "hsl(22, 91%, 47%)";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-7 h-7">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <path
            d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="6" cy="6" r="2" fill={accentColor} />
          <circle cx="26" cy="6" r="2" fill={accentColor} />
          <circle cx="14" cy="12" r="2" fill={accentColor} />
        </svg>
      </div>
      <span className={`font-semibold text-lg tracking-tight ${textColor}`}>LynkFleet</span>
    </div>
  );
};

export const LogoHorizontal = Logo;
