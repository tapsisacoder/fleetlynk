-- GPS Integrations table to store company tracking provider credentials
CREATE TABLE public.gps_integrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    api_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    api_secret TEXT,
    additional_config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(company_id, provider_name)
);

-- Enable RLS
ALTER TABLE public.gps_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only owners/managers can manage GPS integrations
CREATE POLICY "Users can view company GPS integrations"
ON public.gps_integrations FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company GPS integrations"
ON public.gps_integrations FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company GPS integrations"
ON public.gps_integrations FOR UPDATE
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company GPS integrations"
ON public.gps_integrations FOR DELETE
USING (company_id = get_user_company_id());

-- Update trigger
CREATE TRIGGER update_gps_integrations_updated_at
BEFORE UPDATE ON public.gps_integrations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();