import { motion } from "framer-motion";

export const FoundingProgramSectionNew = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-[hsl(221,47%,12%)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="text-center mb-6"
          >
            <div className="inline-block px-4 py-2 bg-accent text-white rounded-full font-bold text-sm mb-4">
              FOUNDING FLEET PROGRAM
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Limited Spots. Unlimited Input.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center text-gray-700 space-y-4 max-w-2xl mx-auto"
          >
            <p className="text-lg">
              We are selecting 100 fleet managers for our Beta test Founding Fleet program.
            </p>

            <p className="text-lg">
              The 100 get unfiltered access to the product before its commercial launch, direct contact with our technical team and all at discounted pricing of up to 50% for a limited time only.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: 0.5, 
              type: "spring", 
              stiffness: 200, 
              damping: 15, 
              bounce: 0.4 
            }}
            className="mt-8 text-center"
          >
            <p className="text-accent font-bold text-lg">
              Applications close April 30th • Only 100 spots available
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
