import { motion } from "framer-motion";

export const SocialProofBar = () => {
  return (
    <div className="bg-accent text-white py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-6 text-sm font-semibold flex-wrap"
        >
          <span>✅ 17 of 20 founding spots claimed</span>
          <span className="hidden sm:inline">•</span>
          <span>⏰ Applications close March 31st, 2025</span>
          <span className="hidden sm:inline">•</span>
          <span>🔥 Only 3 spots remaining</span>
        </motion.div>
      </div>
    </div>
  );
};
