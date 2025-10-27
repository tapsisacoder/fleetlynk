export interface FoundingApplication {
  id: string;
  timestamp: string;
  region: string;
  email: string;
  whatsapp: string;
  company: string;
  vehicles: string;
}

export interface ApplicationFormData {
  region: string;
  vehicles: string;
  email: string;
  whatsapp: string;
  company: string;
}
