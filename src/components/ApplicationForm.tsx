import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import { storage } from "@/lib/storage";
import { ApplicationFormData, FoundingApplication } from "@/types/founding";
import { toast } from "sonner";

export const ApplicationForm = () => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    region: "",
    trucks: "",
    biggestPain: "",
    fuelTracking: "",
    trackingMethod: [],
    priorityFactor: "",
    mustHaveFeature: "",
    name: "",
    email: "",
    whatsapp: "",
    company: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedAt, setSubmittedAt] = useState("");

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      trackingMethod: checked
        ? [...prev.trackingMethod, value]
        : prev.trackingMethod.filter(v => v !== value)
    }));
    if (errors.trackingMethod) {
      setErrors(prev => ({ ...prev, trackingMethod: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.region) newErrors.region = "Please select your region";
    if (!formData.trucks) newErrors.trucks = "Please select fleet size";
    if (formData.biggestPain.length < 20) newErrors.biggestPain = "Please provide at least 20 characters";
    if (!formData.fuelTracking) newErrors.fuelTracking = "Please select fuel tracking method";
    if (formData.trackingMethod.length === 0) newErrors.trackingMethod = "Please select at least one method";
    if (!formData.priorityFactor) newErrors.priorityFactor = "Please select your priority";
    if (formData.mustHaveFeature.length < 15) newErrors.mustHaveFeature = "Please provide at least 15 characters";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
    else if (formData.whatsapp.replace(/\D/g, "").length < 10) newErrors.whatsapp = "Please enter a valid phone number (at least 10 digits)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const application: FoundingApplication = {
        id: `founding_${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...formData,
        company: formData.company || "Not provided",
        source: "landing_page",
      };

      await storage.set(`founding:${Date.now()}`, JSON.stringify(application));

      const now = new Date();
      setSubmittedAt(now.toLocaleString("en-ZA", {
        dateStyle: "long",
        timeStyle: "short",
      }));
      
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReferAnother = () => {
    setIsSuccess(false);
    setFormData({
      region: "",
      trucks: "",
      biggestPain: "",
      fuelTracking: "",
      trackingMethod: [],
      priorityFactor: "",
      mustHaveFeature: "",
      name: "",
      email: "",
      whatsapp: "",
      company: "",
    });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <section id="application-form" className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-bounce-in">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                You're In. Welcome to the Founding Fleet.
              </h2>

              <div className="space-y-4 text-muted-foreground mb-8">
                <p className="text-lg">We're reviewing applications now.</p>
                <p>
                  Expect a WhatsApp from us within 5 business days. If you're selected, we'll get you set up in January.
                </p>
                <p className="text-foreground font-medium">
                  You just helped build the future of African logistics. Thank you.
                </p>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Applied on {submittedAt}
              </p>

              <Button variant="cta" size="lg" onClick={handleReferAnother}>
                Refer Another Fleet Manager
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="application-form" className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-4">
              Apply in 3 Minutes
            </h2>
            <p className="text-center text-muted-foreground mb-8">
              6 questions. Honest answers. We'll contact you within 5 business days.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Question 1: Region */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Where do you operate? <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.region}
                  onValueChange={(value) => {
                    setFormData({ ...formData, region: value });
                    setErrors({ ...errors, region: "" });
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="south-africa" id="region-sa" />
                    <Label htmlFor="region-sa" className="font-normal cursor-pointer">
                      🇿🇦 South Africa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zimbabwe" id="region-zw" />
                    <Label htmlFor="region-zw" className="font-normal cursor-pointer">
                      🇿🇼 Zimbabwe
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="region-both" />
                    <Label htmlFor="region-both" className="font-normal cursor-pointer">
                      🌍 Both SA & Zimbabwe
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other-southern" id="region-other-south" />
                    <Label htmlFor="region-other-south" className="font-normal cursor-pointer">
                      🌍 Other Southern Africa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outside" id="region-outside" />
                    <Label htmlFor="region-outside" className="font-normal cursor-pointer">
                      🌐 Outside Southern Africa
                    </Label>
                  </div>
                </RadioGroup>
                {errors.region && (
                  <p className="text-sm text-destructive animate-shake">{errors.region}</p>
                )}
              </div>

              {/* Question 2: Fleet Size */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  How many trucks in your fleet? <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.trucks}
                  onValueChange={(value) => {
                    setFormData({ ...formData, trucks: value });
                    setErrors({ ...errors, trucks: "" });
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-5" id="trucks-1-5" />
                    <Label htmlFor="trucks-1-5" className="font-normal cursor-pointer">
                      1-5 trucks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6-15" id="trucks-6-15" />
                    <Label htmlFor="trucks-6-15" className="font-normal cursor-pointer">
                      6-15 trucks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="16-50" id="trucks-16-50" />
                    <Label htmlFor="trucks-16-50" className="font-normal cursor-pointer">
                      16-50 trucks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="50+" id="trucks-50plus" />
                    <Label htmlFor="trucks-50plus" className="font-normal cursor-pointer">
                      50+ trucks
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="researching" id="trucks-research" />
                    <Label htmlFor="trucks-research" className="font-normal cursor-pointer">
                      Just researching (not a fleet manager)
                    </Label>
                  </div>
                </RadioGroup>
                {errors.trucks && (
                  <p className="text-sm text-destructive animate-shake">{errors.trucks}</p>
                )}
              </div>

              {/* Question 3: Biggest Pain */}
              <div className="space-y-3">
                <Label htmlFor="pain" className="text-base font-semibold">
                  What's costing you sleep right now? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="pain"
                  placeholder="e.g., Fuel vanishes. Drivers go dark. Maintenance surprises drain cash."
                  rows={3}
                  value={formData.biggestPain}
                  onChange={(e) => {
                    setFormData({ ...formData, biggestPain: e.target.value });
                    setErrors({ ...errors, biggestPain: "" });
                  }}
                  className={errors.biggestPain ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.biggestPain.length}/20 minimum
                </p>
                {errors.biggestPain && (
                  <p className="text-sm text-destructive animate-shake">{errors.biggestPain}</p>
                )}
              </div>

              {/* Question 4: Fuel Tracking */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  How do you track fuel today? <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.fuelTracking}
                  onValueChange={(value) => {
                    setFormData({ ...formData, fuelTracking: value });
                    setErrors({ ...errors, fuelTracking: "" });
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual-logbook" id="fuel-manual" />
                    <Label htmlFor="fuel-manual" className="font-normal cursor-pointer">
                      Manual logbook
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excel-receipts" id="fuel-excel" />
                    <Label htmlFor="fuel-excel" className="font-normal cursor-pointer">
                      Excel + paper receipts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fuel-card" id="fuel-card" />
                    <Label htmlFor="fuel-card" className="font-normal cursor-pointer">
                      Fuel card system
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gps-hardware" id="fuel-gps" />
                    <Label htmlFor="fuel-gps" className="font-normal cursor-pointer">
                      GPS hardware with sensors
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no-tracking" id="fuel-none" />
                    <Label htmlFor="fuel-none" className="font-normal cursor-pointer">
                      I don't track it formally
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="fuel-other" />
                    <Label htmlFor="fuel-other" className="font-normal cursor-pointer">
                      Other method
                    </Label>
                  </div>
                </RadioGroup>
                {errors.fuelTracking && (
                  <p className="text-sm text-destructive animate-shake">{errors.fuelTracking}</p>
                )}
              </div>

              {/* Question 5: Current Tracking */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Current vehicle tracking? (Check all) <span className="text-destructive">*</span>
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-whatsapp"
                      checked={formData.trackingMethod.includes("whatsapp")}
                      onCheckedChange={(checked) => handleCheckboxChange("whatsapp", !!checked)}
                    />
                    <Label htmlFor="track-whatsapp" className="font-normal cursor-pointer">
                      WhatsApp/phone calls
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-gps"
                      checked={formData.trackingMethod.includes("gps")}
                      onCheckedChange={(checked) => handleCheckboxChange("gps", !!checked)}
                    />
                    <Label htmlFor="track-gps" className="font-normal cursor-pointer">
                      GPS hardware
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-excel"
                      checked={formData.trackingMethod.includes("excel")}
                      onCheckedChange={(checked) => handleCheckboxChange("excel", !!checked)}
                    />
                    <Label htmlFor="track-excel" className="font-normal cursor-pointer">
                      Excel spreadsheets
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-paper"
                      checked={formData.trackingMethod.includes("paper")}
                      onCheckedChange={(checked) => handleCheckboxChange("paper", !!checked)}
                    />
                    <Label htmlFor="track-paper" className="font-normal cursor-pointer">
                      Paper logs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-nothing"
                      checked={formData.trackingMethod.includes("nothing")}
                      onCheckedChange={(checked) => handleCheckboxChange("nothing", !!checked)}
                    />
                    <Label htmlFor="track-nothing" className="font-normal cursor-pointer">
                      Nothing formal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="track-other"
                      checked={formData.trackingMethod.includes("other")}
                      onCheckedChange={(checked) => handleCheckboxChange("other", !!checked)}
                    />
                    <Label htmlFor="track-other" className="font-normal cursor-pointer">
                      Other
                    </Label>
                  </div>
                </div>
                {errors.trackingMethod && (
                  <p className="text-sm text-destructive animate-shake">{errors.trackingMethod}</p>
                )}
              </div>

              {/* Question 6: Priority */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  What matters most when choosing fleet software? <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">Help us understand your priorities.</p>
                <RadioGroup
                  value={formData.priorityFactor}
                  onValueChange={(value) => {
                    setFormData({ ...formData, priorityFactor: value });
                    setErrors({ ...errors, priorityFactor: "" });
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="affordable" id="priority-affordable" />
                    <Label htmlFor="priority-affordable" className="font-normal cursor-pointer">
                      It must be affordable (flexible payment terms)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reliable" id="priority-reliable" />
                    <Label htmlFor="priority-reliable" className="font-normal cursor-pointer">
                      It must be reliable (no downtime)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="simple" id="priority-simple" />
                    <Label htmlFor="priority-simple" className="font-normal cursor-pointer">
                      It must be simple (my team isn't technical)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="support" id="priority-support" />
                    <Label htmlFor="priority-support" className="font-normal cursor-pointer">
                      It must have great support (I need help fast)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="integration" id="priority-integration" />
                    <Label htmlFor="priority-integration" className="font-normal cursor-pointer">
                      It must integrate with my fuel cards/accounting
                    </Label>
                  </div>
                </RadioGroup>
                {errors.priorityFactor && (
                  <p className="text-sm text-destructive animate-shake">{errors.priorityFactor}</p>
                )}
              </div>

              {/* Question 7: Must-Have Feature */}
              <div className="space-y-3">
                <Label htmlFor="feature" className="text-base font-semibold">
                  One feature that would make this essential? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="feature"
                  placeholder="e.g., Instant fuel alerts, driver behavior scores, maintenance reminders"
                  rows={3}
                  value={formData.mustHaveFeature}
                  onChange={(e) => {
                    setFormData({ ...formData, mustHaveFeature: e.target.value });
                    setErrors({ ...errors, mustHaveFeature: "" });
                  }}
                  className={errors.mustHaveFeature ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.mustHaveFeature.length}/15 minimum
                </p>
                {errors.mustHaveFeature && (
                  <p className="text-sm text-destructive animate-shake">{errors.mustHaveFeature}</p>
                )}
              </div>

              {/* Contact Details Section */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-primary mb-4">Your Contact Details</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Mthembu"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setErrors({ ...errors, name: "" });
                      }}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive animate-shake">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@yourcompany.co.za"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: "" });
                      }}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive animate-shake">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">
                      WhatsApp <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="082 123 4567"
                      value={formData.whatsapp}
                      onChange={(e) => {
                        setFormData({ ...formData, whatsapp: e.target.value });
                        setErrors({ ...errors, whatsapp: "" });
                      }}
                      className={errors.whatsapp ? "border-destructive" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      This is how we'll reach you first
                    </p>
                    {errors.whatsapp && (
                      <p className="text-sm text-destructive animate-shake">{errors.whatsapp}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name (optional)</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your company (optional)"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Note */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Military-grade encryption. Your data never leaves our secure servers. No sharing. Ever.</span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application →
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
