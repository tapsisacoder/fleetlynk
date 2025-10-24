import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { storage } from "@/lib/storage";

interface FormData {
  region: string;
  vehicles: string;
  biggestChallenge: string;
  essentialFactor: string;
  mustHaveFeature: string;
  company: string;
  email: string;
  whatsapp: string;
}

interface FormErrors {
  [key: string]: string;
}

export const ApplicationFormNew = () => {
  const [formData, setFormData] = useState<FormData>({
    region: "",
    vehicles: "",
    biggestChallenge: "",
    essentialFactor: "",
    mustHaveFeature: "",
    company: "",
    email: "",
    whatsapp: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.region) newErrors.region = "Please select your region";
    if (!formData.vehicles) newErrors.vehicles = "Please select fleet size";
    if (formData.biggestChallenge.length < 20) newErrors.biggestChallenge = "Please write at least 20 characters";
    if (!formData.essentialFactor) newErrors.essentialFactor = "Please select what's essential";
    if (formData.mustHaveFeature.length < 15) newErrors.mustHaveFeature = "Please write at least 15 characters";
    if (!formData.company) newErrors.company = "Company name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.whatsapp || formData.whatsapp.length < 10) {
      newErrors.whatsapp = "Please enter a valid WhatsApp number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        id: `founding_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...formData
      };

      await storage.set(`founding:${Date.now()}`, JSON.stringify(applicationData));
      
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please WhatsApp us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      region: "",
      vehicles: "",
      biggestChallenge: "",
      essentialFactor: "",
      mustHaveFeature: "",
      company: "",
      email: "",
      whatsapp: ""
    });
    setErrors({});
  };

  return (
    <section id="application-form" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="max-w-2xl mx-auto border border-gray-200 rounded-xl shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Secure Your Spot in 2 Minutes
                </h2>
                <p className="text-gray-600">
                  5 precise questions. We'll contact you within 5 business days.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question 1: Region */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label className="text-primary font-semibold">Where do you operate?</Label>
                  <RadioGroup
                    value={formData.region}
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                    className="mt-2 space-y-2"
                  >
                    {["🇿🇦 South Africa", "🇿🇼 Zimbabwe", "🌍 Both SA & Zimbabwe", "🌍 Other Southern Africa"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.region && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.region}
                    </motion.p>
                  )}
                </motion.div>

                {/* Question 2: Fleet Size */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="text-primary font-semibold">How many vehicles in your fleet?</Label>
                  <RadioGroup
                    value={formData.vehicles}
                    onValueChange={(value) => setFormData({ ...formData, vehicles: value })}
                    className="mt-2 space-y-2"
                  >
                    {["1-5 vehicles", "6-15 vehicles", "16-50 vehicles", "50+ vehicles"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.vehicles && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.vehicles}
                    </motion.p>
                  )}
                </motion.div>

                {/* Question 3: Biggest Challenge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="biggestChallenge" className="text-primary font-semibold">
                    What's the biggest operational challenge you face daily?
                  </Label>
                  <Textarea
                    id="biggestChallenge"
                    placeholder="e.g., Tracking fuel usage, managing compliance deadlines, driver communication, invoice chaos"
                    rows={3}
                    value={formData.biggestChallenge}
                    onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Minimum 20 characters ({formData.biggestChallenge.length}/20)
                  </p>
                  {errors.biggestChallenge && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.biggestChallenge}
                    </motion.p>
                  )}
                </motion.div>

                {/* Question 4: Essential Factor */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label className="text-primary font-semibold">
                    What would make fleet management software essential for you?
                  </Label>
                  <p className="text-gray-500 text-sm italic mt-1">This helps us prioritize what we build first</p>
                  <RadioGroup
                    value={formData.essentialFactor}
                    onValueChange={(value) => setFormData({ ...formData, essentialFactor: value })}
                    className="mt-2 space-y-2"
                  >
                    {[
                      "Affordable pricing with flexible payment options",
                      "Rock-solid reliability (no downtime, always accessible)",
                      "Dead simple to use (my team isn't tech-savvy)",
                      "Great support when I need help fast",
                      "Integrates with my fuel cards or accounting software"
                    ].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.essentialFactor && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.essentialFactor}
                    </motion.p>
                  )}
                </motion.div>

                {/* Question 5: Must-Have Feature */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="mustHaveFeature" className="text-primary font-semibold">
                    One feature that would make you sign up immediately?
                  </Label>
                  <Textarea
                    id="mustHaveFeature"
                    placeholder="e.g., Automated compliance alerts, real-time fuel tracking, simple invoicing, WhatsApp notifications"
                    rows={3}
                    value={formData.mustHaveFeature}
                    onChange={(e) => setFormData({ ...formData, mustHaveFeature: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Minimum 15 characters ({formData.mustHaveFeature.length}/15)
                  </p>
                  {errors.mustHaveFeature && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.mustHaveFeature}
                    </motion.p>
                  )}
                </motion.div>

                {/* Contact Details */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-primary font-semibold mb-4">Your Contact Details</h3>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="company" className="font-medium">Company or Fleet Name</Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="mt-1"
                      />
                      {errors.company && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.company}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Label htmlFor="email" className="font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@company.co.za"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Label htmlFor="whatsapp" className="font-medium">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="082 123 4567"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="mt-1"
                      />
                      <p className="text-gray-500 text-sm mt-1">We'll contact you here first</p>
                      {errors.whatsapp && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.whatsapp}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <p className="text-sm text-gray-600">
                    🔒 <strong>Privacy Guarantee:</strong> Your data is encrypted using military-grade security. We never share your information with third parties. You can request deletion anytime.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full text-lg font-semibold py-6"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, bounce: 0.4 }}
              className="max-w-2xl mx-auto text-center p-12 bg-white rounded-xl shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
              >
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>

                <h2 className="text-2xl font-bold text-primary mb-4">
                  You're In. Welcome to the Founding Fleet.
                </h2>
                <p className="text-gray-600 italic mb-4">
                  Selected members will be contacted in December 2025.
                </p>

              <div className="text-gray-700 space-y-3 max-w-lg mx-auto mb-6">
                <p>Your application is submitted.</p>
                <p>We review applications weekly and contact selected members via WhatsApp within 5 business days.</p>
                <p>
                  You just helped shape the future of African logistics.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={handleReset} variant="cta" size="lg">
                  Refer Another Fleet
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
