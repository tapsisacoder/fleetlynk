export interface FoundingApplication {
  id: string;
  timestamp: string;
  region: string;
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  trucks: string;
  biggestPain: string;
  fuelTracking: string;
  trackingMethod: string[];
  priorityFactor: string;
  mustHaveFeature: string;
  source: string;
}

export interface ApplicationFormData {
  region: string;
  trucks: string;
  biggestPain: string;
  fuelTracking: string;
  trackingMethod: string[];
  priorityFactor: string;
  mustHaveFeature: string;
  name: string;
  email: string;
  whatsapp: string;
  company: string;
}
