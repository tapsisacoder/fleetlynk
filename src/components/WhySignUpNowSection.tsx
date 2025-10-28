import { motion } from "framer-motion";
import { TrendingDown, Lock, Users } from "lucide-react";

const urgencyCards = [
  {
    icon: TrendingDown,
    iconColor: "text-red-500",
    title: "Your Competition Is Moving",
    description: "Fleet operators who adopt management software gain 30-50% better operational visibility. Those who don't? They're losing money they can't even see."
  },
  {
    icon: Lock,
    iconColor: "text-accent",
    title: "Lock In Founder Pricing",
    description: "Early users get permanent discounted rates. When we launch commercially, new customers will pay full price. You won't."
  },
  {
    icon: Users,
    iconColor: "text-green-600",
    title: "Shape What We Build",
    description: "We're building LynkFleet with 30 founding members, not for them. Your feedback becomes features. Your challenges become solutions."
  }
];

export const WhySignUpNowSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center max-w-4xl mx-auto mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            The Founding Fleet
          </h2>
          <p className="text-xl text-gray-600">
            We're hand-picking 100 operators to test and help shape LynkFleet. This isn't just about testing software. It's about not falling behind.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {urgencyCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: index * 0.1
              }}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <card.icon className={`w-12 h-12 ${card.iconColor} mb-4`} />
              <h3 className="text-xl font-bold text-primary mb-3">
                {card.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-accent font-bold text-lg mt-8"
        >
          ⏰ Applications close November 30th. Pilot starts next year. Don't miss this.
        </motion.p>
      </div>
    </section>
  );
};
