import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const formSchema = z.object({
  region: z.string()
    .trim()
    .min(1, "Please enter your region")
    .max(100, "Region must be less than 100 characters"),
  vehicles: z.string().min(1, "Please select fleet size"),
  company: z.string()
    .trim()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  whatsapp: z.string()
    .trim()
    .min(10, "Please enter a valid phone number")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[+]?[\d\s()-]+$/, "Please enter a valid phone number")
});

interface FormData {
  region: string;
  vehicles: string;
  company: string;
  email: string;
  countryCode: string;
  whatsapp: string;
}

interface FormErrors {
  [key: string]: string;
}

export const ApplicationFormNew = () => {
  const [formData, setFormData] = useState<FormData>({
    region: "",
    vehicles: "",
    company: "",
    email: "",
    countryCode: "+27",
    whatsapp: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    try {
      formSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('founding_applications')
        .insert([
          {
            region: formData.region,
            company: formData.company.trim(),
            email: formData.email.trim().toLowerCase(),
            whatsapp: formData.whatsapp.trim(),
            vehicles: formData.vehicles,
            timestamp: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
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
      company: "",
      email: "",
      countryCode: "+27",
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
                  Quick questions. No time wasted.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question 1: Region */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="region" className="text-primary font-semibold">Where do you operate?</Label>
                  <Input
                    id="region"
                    placeholder="e.g., Johannesburg, South Africa"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="mt-2"
                  />
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

                {/* Contact Details */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-primary font-semibold mb-4">Your Contact Details</h3>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
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
                      transition={{ delay: 0.4 }}
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
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="countryCode" className="font-medium">Country</Label>
                      <Select value={formData.countryCode} onValueChange={(value) => setFormData({ ...formData, countryCode: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+27">🇿🇦 South Africa (+27)</SelectItem>
                          <SelectItem value="+263">🇿🇼 Zimbabwe (+263)</SelectItem>
                          <SelectItem value="+267">🇧🇼 Botswana (+267)</SelectItem>
                          <SelectItem value="+258">🇲🇿 Mozambique (+258)</SelectItem>
                          <SelectItem value="+260">🇿🇲 Zambia (+260)</SelectItem>
                          <SelectItem value="+264">🇳🇦 Namibia (+264)</SelectItem>
                          <SelectItem value="+266">🇱🇸 Lesotho (+266)</SelectItem>
                          <SelectItem value="+268">🇸🇿 Eswatini (+268)</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <Label htmlFor="whatsapp" className="font-medium">Mobile Number</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={formData.countryCode}
                          readOnly
                          className="w-20 bg-gray-50"
                        />
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="82 123 4567"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          className="flex-1"
                        />
                      </div>
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
                  transition={{ delay: 0.6 }}
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
                <p className="text-gray-600">
                  Your application to join the Founding fleet has been received, thank you for your time.
                </p>

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
