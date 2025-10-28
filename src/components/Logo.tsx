import { motion } from "framer-motion";

export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {/* Geometric F icon made of connected nodes */}
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <motion.path
            d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.circle cx="6" cy="6" r="2" fill="hsl(var(--accent))" 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          />
          <motion.circle cx="26" cy="6" r="2" fill="hsl(var(--accent))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          />
          <motion.circle cx="14" cy="12" r="2" fill="hsl(var(--accent))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          />
        </svg>
      </div>
      <div className="font-semibold text-xl text-primary">LynkFleet</div>
    </motion.div>
  );
};

export const LogoHorizontal = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`flex items-center gap-2 ${className}`}
    >
      {/* Geometric F icon */}
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <path
            d="M6 6 L26 6 L26 12 L14 12 L14 18 L22 18"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="6" cy="6" r="2" fill="hsl(var(--accent))" />
          <circle cx="26" cy="6" r="2" fill="hsl(var(--accent))" />
          <circle cx="14" cy="12" r="2" fill="hsl(var(--accent))" />
        </svg>
      </div>
      <div className="font-semibold text-xl text-primary">LynkFleet</div>
    </motion.div>
  );
};
