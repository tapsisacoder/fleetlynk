-- Add database constraints to founding_applications table for server-side validation
-- This prevents attackers from bypassing client-side validation via direct API calls

-- Email validation: proper format and length
ALTER TABLE public.founding_applications
  ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  ADD CONSTRAINT email_length CHECK (length(email) <= 255);

-- WhatsApp/phone validation: reasonable length for international numbers
ALTER TABLE public.founding_applications
  ADD CONSTRAINT whatsapp_length CHECK (length(whatsapp) >= 10 AND length(whatsapp) <= 20);

-- Company name validation: not empty and reasonable length
ALTER TABLE public.founding_applications
  ADD CONSTRAINT company_length CHECK (length(company) <= 100 AND length(trim(company)) > 0);

-- Region validation: not empty and reasonable length
ALTER TABLE public.founding_applications
  ADD CONSTRAINT region_length CHECK (length(region) <= 100 AND length(trim(region)) > 0);

-- Vehicles validation: not empty
ALTER TABLE public.founding_applications
  ADD CONSTRAINT vehicles_not_empty CHECK (length(trim(vehicles)) > 0);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_founding_applications_created_at ON public.founding_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_founding_applications_region ON public.founding_applications(region);
CREATE INDEX IF NOT EXISTS idx_founding_applications_email ON public.founding_applications(email);