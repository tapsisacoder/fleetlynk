import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import tripCostsImg from "@/assets/screen-trip-costs.png";
import complianceImg from "@/assets/screen-compliance.png";
import invoiceImg from "@/assets/screen-invoice.png";

const screens = [
  {
    img: tripCostsImg,
    alt: "Live trip costs screen showing real-time margin data per trip",
    caption: ["TRIP MARGIN. LIVE.", "BEFORE THE TRUCK", "IS BACK IN THE YARD."],
  },
  {
    img: complianceImg,
    alt: "Fleet compliance screen showing document expiry tracking for every vehicle",
    caption: ["EVERY DOCUMENT.", "EVERY EXPIRY.", "ZERO SURPRISES."],
  },
  {
    img: invoiceImg,
    alt: "Invoice generation screen creating invoices from trip data in seconds",
    caption: ["GENERATED IN", "SECONDS FROM", "TRIP DATA."],
  },
];

export const VisualSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {screens.map((screen, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 80, damping: 20 }}
              className="text-center"
            >
              <img
                src={screen.img}
                alt={screen.alt}
                className="w-full mb-6"
              />
              <div className="font-mono text-xs text-white/50 tracking-wider leading-relaxed">
                {screen.caption.map((line, j) => (
                  <span key={j}>{line}<br /></span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
