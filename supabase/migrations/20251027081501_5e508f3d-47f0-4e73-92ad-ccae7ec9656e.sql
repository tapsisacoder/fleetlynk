-- Create founding_applications table
CREATE TABLE public.founding_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  vehicles TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.founding_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for public signup form)
CREATE POLICY "Anyone can submit applications"
ON public.founding_applications
FOR INSERT
WITH CHECK (true);

-- Create policy to allow reading all applications (for admin page)
-- In production, you'd want to restrict this to admin users only
CREATE POLICY "Anyone can view applications"
ON public.founding_applications
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_founding_applications_timestamp ON public.founding_applications(timestamp DESC);
CREATE INDEX idx_founding_applications_email ON public.founding_applications(email);