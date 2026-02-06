-- Create trailers table
CREATE TABLE public.trailers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  registration_number VARCHAR NOT NULL,
  trailer_type VARCHAR DEFAULT 'flatbed', -- flatbed, tanker, refrigerated, container, lowbed, tipper
  make VARCHAR,
  model VARCHAR,
  year INTEGER,
  capacity_tons NUMERIC DEFAULT 34,
  length_meters NUMERIC,
  axle_count INTEGER DEFAULT 3,
  license_expiry DATE,
  roadworthy_expiry DATE,
  insurance_expiry DATE,
  status VARCHAR DEFAULT 'available', -- available, in_use, maintenance, decommissioned
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vehicle_trailers junction table (max 2 trailers per vehicle)
CREATE TABLE public.vehicle_trailers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  trailer_id UUID NOT NULL REFERENCES public.trailers(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 1, -- 1 = first trailer, 2 = second trailer (dolly)
  attached_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  detached_at TIMESTAMP WITH TIME ZONE,
  attached_by UUID,
  CONSTRAINT position_check CHECK (position IN (1, 2)),
  CONSTRAINT unique_active_attachment UNIQUE (trailer_id, vehicle_id, position)
);

-- Enable RLS on trailers
ALTER TABLE public.trailers ENABLE ROW LEVEL SECURITY;

-- RLS policies for trailers
CREATE POLICY "Users can view company trailers" 
ON public.trailers FOR SELECT 
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company trailers" 
ON public.trailers FOR INSERT 
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company trailers" 
ON public.trailers FOR UPDATE 
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company trailers" 
ON public.trailers FOR DELETE 
USING (company_id = get_user_company_id());

-- Enable RLS on vehicle_trailers
ALTER TABLE public.vehicle_trailers ENABLE ROW LEVEL SECURITY;

-- RLS policies for vehicle_trailers
CREATE POLICY "Users can view company vehicle trailers" 
ON public.vehicle_trailers FOR SELECT 
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company vehicle trailers" 
ON public.vehicle_trailers FOR INSERT 
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company vehicle trailers" 
ON public.vehicle_trailers FOR UPDATE 
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company vehicle trailers" 
ON public.vehicle_trailers FOR DELETE 
USING (company_id = get_user_company_id());

-- Create index for faster trailer lookups
CREATE INDEX idx_trailers_company ON public.trailers(company_id);
CREATE INDEX idx_vehicle_trailers_vehicle ON public.vehicle_trailers(vehicle_id);
CREATE INDEX idx_vehicle_trailers_trailer ON public.vehicle_trailers(trailer_id);

-- Add trigger for updated_at on trailers
CREATE TRIGGER update_trailers_updated_at
  BEFORE UPDATE ON public.trailers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();