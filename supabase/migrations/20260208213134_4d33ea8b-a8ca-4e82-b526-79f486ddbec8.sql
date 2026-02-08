-- =====================================================
-- LYNKFLEET ACCOUNTING SYSTEM REBUILD
-- Centralized Financial Events Architecture
-- =====================================================

-- Create ENUMs for financial events
CREATE TYPE financial_event_type AS ENUM (
  'INVOICE_ISSUED',
  'CUSTOMER_PAYMENT',
  'OPERATING_EXPENSE',
  'WORKSHOP_EXPENSE',
  'INVENTORY_ISSUE',
  'SUPPLIER_PAYMENT',
  'OPENING_BALANCE',
  'ADJUSTMENT',
  'REVERSAL',
  'CUSTOM',
  'FUEL_PURCHASE',
  'TRIP_BOOKOUT'
);

CREATE TYPE financial_direction AS ENUM ('IN', 'OUT');

CREATE TYPE financial_category AS ENUM (
  'REVENUE',
  'COST_OF_SALES',
  'OPERATING_EXPENSE',
  'FUEL',
  'MAINTENANCE',
  'INVENTORY',
  'PAYROLL',
  'ADMIN',
  'OTHER'
);

CREATE TYPE financial_source_module AS ENUM (
  'TRIPS',
  'PAYMENTS',
  'WORKSHOP',
  'STOREROOM',
  'ADMIN',
  'MIGRATION',
  'FUEL'
);

CREATE TYPE financial_created_by AS ENUM ('USER', 'SYSTEM', 'AI');

-- Create the canonical financial_events table
CREATE TABLE public.financial_events (
  event_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id),
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  event_type financial_event_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  direction financial_direction NOT NULL,
  category financial_category NOT NULL,
  source_module financial_source_module NOT NULL,
  reference_id TEXT,
  invoice_id UUID REFERENCES public.invoices(id),
  client_id UUID REFERENCES public.clients(id),
  supplier_id UUID,
  vehicle_id UUID REFERENCES public.vehicles(id),
  driver_id UUID,
  trip_id UUID REFERENCES public.trips(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_type financial_created_by NOT NULL DEFAULT 'USER',
  created_by_user UUID,
  reversal_of_event_id UUID REFERENCES public.financial_events(event_id),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX idx_financial_events_company ON public.financial_events(company_id);
CREATE INDEX idx_financial_events_date ON public.financial_events(event_date);
CREATE INDEX idx_financial_events_type ON public.financial_events(event_type);
CREATE INDEX idx_financial_events_invoice ON public.financial_events(invoice_id) WHERE invoice_id IS NOT NULL;
CREATE INDEX idx_financial_events_client ON public.financial_events(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX idx_financial_events_vehicle ON public.financial_events(vehicle_id) WHERE vehicle_id IS NOT NULL;
CREATE INDEX idx_financial_events_trip ON public.financial_events(trip_id) WHERE trip_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.financial_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Events are append-only (no UPDATE, no DELETE for regular users)
CREATE POLICY "Users can view company financial events"
ON public.financial_events FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company financial events"
ON public.financial_events FOR INSERT
WITH CHECK (company_id = get_user_company_id());

-- Create view for invoice payment status (derived from events)
CREATE OR REPLACE VIEW public.invoice_payment_status AS
SELECT 
  i.id AS invoice_id,
  i.invoice_number,
  i.total_amount,
  i.company_id,
  COALESCE(SUM(
    CASE WHEN fe.event_type = 'CUSTOMER_PAYMENT' AND fe.invoice_id = i.id 
    THEN fe.amount ELSE 0 END
  ), 0) AS amount_paid,
  i.total_amount - COALESCE(SUM(
    CASE WHEN fe.event_type = 'CUSTOMER_PAYMENT' AND fe.invoice_id = i.id 
    THEN fe.amount ELSE 0 END
  ), 0) AS balance_due,
  CASE 
    WHEN COALESCE(SUM(CASE WHEN fe.event_type = 'CUSTOMER_PAYMENT' AND fe.invoice_id = i.id THEN fe.amount ELSE 0 END), 0) = 0 THEN 'UNPAID'
    WHEN COALESCE(SUM(CASE WHEN fe.event_type = 'CUSTOMER_PAYMENT' AND fe.invoice_id = i.id THEN fe.amount ELSE 0 END), 0) >= i.total_amount THEN 'PAID'
    ELSE 'PARTIALLY_PAID'
  END AS payment_status
FROM public.invoices i
LEFT JOIN public.financial_events fe ON fe.invoice_id = i.id AND fe.event_type = 'CUSTOMER_PAYMENT'
GROUP BY i.id, i.invoice_number, i.total_amount, i.company_id;

-- Create view for client balances (derived from events)
CREATE OR REPLACE VIEW public.client_balances AS
SELECT 
  c.id AS client_id,
  c.name AS client_name,
  c.company_id,
  COALESCE(SUM(
    CASE WHEN fe.event_type = 'INVOICE_ISSUED' THEN fe.amount ELSE 0 END
  ), 0) AS total_invoiced,
  COALESCE(SUM(
    CASE WHEN fe.event_type = 'CUSTOMER_PAYMENT' THEN fe.amount ELSE 0 END
  ), 0) AS total_paid,
  COALESCE(SUM(
    CASE WHEN fe.event_type = 'INVOICE_ISSUED' THEN fe.amount ELSE 0 END
  ), 0) - COALESCE(SUM(
    CASE WHEN fe.event_type = 'CUSTOMER_PAYMENT' THEN fe.amount ELSE 0 END
  ), 0) AS balance_due
FROM public.clients c
LEFT JOIN public.financial_events fe ON fe.client_id = c.id
GROUP BY c.id, c.name, c.company_id;

-- Create view for financial summary (for reports)
CREATE OR REPLACE VIEW public.financial_summary AS
SELECT 
  company_id,
  event_date,
  SUM(CASE WHEN direction = 'IN' THEN amount ELSE 0 END) AS total_income,
  SUM(CASE WHEN direction = 'OUT' THEN amount ELSE 0 END) AS total_expenses,
  SUM(CASE WHEN direction = 'IN' THEN amount ELSE -amount END) AS net_cashflow,
  SUM(CASE WHEN event_type = 'INVOICE_ISSUED' THEN amount ELSE 0 END) AS invoiced,
  SUM(CASE WHEN event_type = 'CUSTOMER_PAYMENT' THEN amount ELSE 0 END) AS payments_received,
  SUM(CASE WHEN category = 'FUEL' AND direction = 'OUT' THEN amount ELSE 0 END) AS fuel_expenses,
  SUM(CASE WHEN category = 'MAINTENANCE' AND direction = 'OUT' THEN amount ELSE 0 END) AS maintenance_expenses
FROM public.financial_events
GROUP BY company_id, event_date;

-- Add driver_assigned_vehicle table for fleet-driver management
CREATE TABLE IF NOT EXISTS public.driver_vehicle_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id),
  driver_id UUID NOT NULL REFERENCES public.drivers(id),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unassigned_at TIMESTAMP WITH TIME ZONE,
  assigned_by UUID
);

-- Create unique constraint for active assignments
CREATE UNIQUE INDEX unique_active_driver_vehicle 
ON public.driver_vehicle_assignments (driver_id, vehicle_id) 
WHERE unassigned_at IS NULL;

-- Enable RLS
ALTER TABLE public.driver_vehicle_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company driver assignments"
ON public.driver_vehicle_assignments FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company driver assignments"
ON public.driver_vehicle_assignments FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company driver assignments"
ON public.driver_vehicle_assignments FOR UPDATE
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company driver assignments"
ON public.driver_vehicle_assignments FOR DELETE
USING (company_id = get_user_company_id());