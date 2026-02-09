import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need to buy expensive GPS hardware?",
    answer: "No. LynkFleet uses the driver's smartphone for GPS tracking. Zero hardware investment required. If you prefer dedicated GPS devices, we can integrate those too.",
  },
  {
    question: "Can I access LynkFleet from my desktop computer?",
    answer: "Absolutely. LynkFleet works on any device — desktop, laptop, tablet, or mobile. Use whichever device you prefer. Many operators use desktop at the office and mobile when they're out.",
  },
  {
    question: 'What if I\'m not "tech-savvy"?',
    answer: "If you can use WhatsApp, you can use LynkFleet. We designed it for fleet operators, not software engineers. Plus, we personally train you during onboarding.",
  },
  {
    question: "What happens if there's no internet connection?",
    answer: "The system works offline. Enter trip data, costs, updates — everything. It syncs automatically when you're back online. Built for African connectivity realities.",
  },
  {
    question: "How long does setup take?",
    answer: "Most operators are fully operational within 24 hours. We handle data migration and walk you through everything personally.",
  },
  {
    question: "What if my drivers don't have smartphones?",
    answer: "You can still use LynkFleet for trip planning, cost tracking, compliance, and reporting. GPS tracking is optional. Most operators find drivers already have phones.",
  },
  {
    question: "Can I cancel if it doesn't work for me?",
    answer: "Absolutely. Cancel anytime in the first 30 days for a full refund. No questions asked. No hard feelings.",
  },
  {
    question: "Why only 20 spots?",
    answer: "We're personally onboarding each operator to ensure success. We can't do that for 100 people at once. Quality over quantity.",
  },
  {
    question: "When will I get pricing details?",
    answer: "Founding members get exclusive pricing at 50% off. We'll discuss specific numbers during your WhatsApp consultation or application call. Every fleet is different, so we tailor the conversation to you.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Questions? We've Got Answers.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
