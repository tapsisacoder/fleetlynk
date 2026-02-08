-- Fix SECURITY DEFINER views by making them SECURITY INVOKER
-- These views should respect the caller's RLS context

DROP VIEW IF EXISTS public.invoice_payment_status;
DROP VIEW IF EXISTS public.client_balances;
DROP VIEW IF EXISTS public.financial_summary;

-- Recreate views with SECURITY INVOKER (default, explicit for clarity)
CREATE VIEW public.invoice_payment_status 
WITH (security_invoker = true)
AS
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

CREATE VIEW public.client_balances
WITH (security_invoker = true)
AS
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

CREATE VIEW public.financial_summary
WITH (security_invoker = true)
AS
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