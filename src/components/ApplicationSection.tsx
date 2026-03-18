import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName: string;
  email: string;
  company: string;
  trucks: string;
  country: string;
}

export const ApplicationSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    company: "",
    trucks: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.company.trim()) newErrors.company = "Required";
    if (!formData.trucks) newErrors.trucks = "Required";
    if (!formData.country) newErrors.country = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { error: dbError } = await supabase.from("founding_applications").insert({
        full_name: formData.fullName,
        email: formData.email,
        company_name: formData.company,
        trucks: formData.trucks,
        country: formData.country,
        source: "landing_page",
      });
      if (dbError) throw dbError;
      setIsSuccess(true);
      toast.success("Application submitted");
    } catch {
      toast.error("Something went wrong. Try WhatsApp instead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field: keyof FormData) =>
    `w-full bg-white/10 border ${errors[field] ? "border-destructive" : "border-white/20"} text-white px-4 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors`;

  const selectClass = (field: keyof FormData) =>
    `w-full bg-white/10 border ${errors[field] ? "border-destructive" : "border-white/20"} text-white px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors appearance-none`;

  if (isSuccess) {
    return (
      <section id="application-form" className="bg-primary py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-16 h-16 mx-auto mb-6 border-2 border-accent rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Application Received.</h2>
            <p className="text-white/60 text-sm mb-8">
              We respond within 2 business days. No spam. No auto-activation.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ fullName: "", email: "", company: "", trucks: "", country: "" });
              }}
              className="text-accent text-sm font-medium hover:underline"
            >
              Submit another application
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="application-form" className="bg-primary py-20 md:py-28">
      <div className="container mx-auto px-4" ref={ref}>
        {/* Above-form headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            THIS IS NOT
            <br />
            A SIGNUP.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            We review every application personally. We activate accounts ourselves. You speak to a human before anything goes live.
          </p>
        </motion.div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-bold text-white leading-tight mb-12 max-w-lg"
        >
          ONCE YOU KNOW
          <br />
          YOUR REAL NUMBERS,
          <br />
          YOU CANNOT RUN
          <br />
          BLIND AGAIN.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left — Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={inputClass("fullName")}
              />
              {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Company name"
                value={formData.company}
                onChange={(e) => update("company", e.target.value)}
                className={inputClass("company")}
              />
              {errors.company && <p className="text-destructive text-xs mt-1">{errors.company}</p>}
            </div>

            <div>
              <select
                value={formData.trucks}
                onChange={(e) => update("trucks", e.target.value)}
                className={selectClass("trucks")}
              >
                <option value="" disabled className="text-black">Number of trucks</option>
                <option value="1-5" className="text-black">1–5 trucks</option>
                <option value="6-15" className="text-black">6–15 trucks</option>
                <option value="16-50" className="text-black">16–50 trucks</option>
                <option value="50+" className="text-black">50+ trucks</option>
              </select>
              {errors.trucks && <p className="text-destructive text-xs mt-1">{errors.trucks}</p>}
            </div>

            <div>
              <select
                value={formData.country}
                onChange={(e) => update("country", e.target.value)}
                className={selectClass("country")}
              >
                <option value="" disabled className="text-black">Country</option>
                <option value="Zimbabwe" className="text-black">Zimbabwe</option>
                <option value="South Africa" className="text-black">South Africa</option>
                <option value="Mozambique" className="text-black">Mozambique</option>
                <option value="Zambia" className="text-black">Zambia</option>
                <option value="Botswana" className="text-black">Botswana</option>
                <option value="Other SADC" className="text-black">Other SADC</option>
              </select>
              {errors.country && <p className="text-destructive text-xs mt-1">{errors.country}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-accent-foreground py-3.5 text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
            </button>

            <p className="font-mono text-xs text-white/30 text-center">
              We respond within 2 business days. No spam. No auto-activation.
            </p>
          </motion.form>

          {/* Right — Founder statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, type: "spring", stiffness: 80, damping: 20 }}
            className="flex flex-col justify-center"
          >
            <p className="text-white/70 text-base leading-relaxed italic">
              "I built LynkFleet because I watched fleet operators run million-dollar businesses on WhatsApp and Excel. Not because they wanted to — because nothing else existed that worked for them. This platform is the answer to every frustrated conversation I've had with operators who knew there had to be a better way. If you're one of those people, I want to hear from you."
            </p>
            <p className="mt-6 text-white/40 text-sm">— Founder, LynkFleet</p>

            <div className="mt-10 pt-6 border-t border-white/10">
              <p className="text-white/30 text-xs">
                Prefer to talk first?{" "}
                <a
                  href="https://wa.me/263XXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Message us on WhatsApp
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
