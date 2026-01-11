-- =============================================
-- FIX SECURITY WARNINGS
-- =============================================

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.generate_trip_reference()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TRIP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('trip_reference_seq')::text, 3, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_transaction_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TXN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('transaction_number_seq')::text, 5, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_number_seq')::text, 3, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop the overly permissive company insert policy and create a more restrictive one
DROP POLICY IF EXISTS "Authenticated users can create companies" ON public.companies;

-- Create auto-profile creation trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add policy for company creation via service role or owner setup
CREATE POLICY "Users can create company during onboarding" ON public.companies
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND 
        NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND company_id IS NOT NULL)
    );

-- =============================================
-- PRE-POPULATE CHART OF ACCOUNTS (for each company via trigger)
-- =============================================

CREATE OR REPLACE FUNCTION public.setup_company_chart_of_accounts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- ASSETS (1000-1999)
    INSERT INTO chart_of_accounts (company_id, account_code, account_name, account_type, category, is_system) VALUES
    (NEW.id, '1000', 'Cash on Hand', 'ASSET', 'Current Assets', true),
    (NEW.id, '1010', 'Bank Account - USD', 'ASSET', 'Current Assets', true),
    (NEW.id, '1020', 'Bank Account - ZAR', 'ASSET', 'Current Assets', true),
    (NEW.id, '1100', 'Accounts Receivable', 'ASSET', 'Current Assets', true),
    (NEW.id, '1110', 'Driver Advances (Bookouts)', 'ASSET', 'Current Assets', true),
    (NEW.id, '1200', 'Fuel Inventory', 'ASSET', 'Current Assets', true),
    (NEW.id, '1500', 'Vehicles', 'ASSET', 'Fixed Assets', true),
    (NEW.id, '1510', 'Accumulated Depreciation - Vehicles', 'ASSET', 'Fixed Assets', true),
    (NEW.id, '1600', 'Equipment', 'ASSET', 'Fixed Assets', true),
    
    -- LIABILITIES (2000-2999)
    (NEW.id, '2000', 'Accounts Payable', 'LIABILITY', 'Current Liabilities', true),
    (NEW.id, '2100', 'Wages Payable', 'LIABILITY', 'Current Liabilities', true),
    (NEW.id, '2200', 'VAT Payable', 'LIABILITY', 'Current Liabilities', true),
    (NEW.id, '2500', 'Vehicle Loans', 'LIABILITY', 'Long-term Liabilities', true),
    
    -- EQUITY (3000-3999)
    (NEW.id, '3000', 'Owner''s Equity', 'EQUITY', 'Equity', true),
    (NEW.id, '3100', 'Retained Earnings', 'EQUITY', 'Equity', true),
    
    -- INCOME (4000-4999)
    (NEW.id, '4000', 'Freight Revenue - Local', 'INCOME', 'Operating Income', true),
    (NEW.id, '4010', 'Freight Revenue - Cross Border', 'INCOME', 'Operating Income', true),
    (NEW.id, '4020', 'Fuel Surcharge Revenue', 'INCOME', 'Operating Income', true),
    (NEW.id, '4030', 'Demurrage Revenue', 'INCOME', 'Operating Income', true),
    (NEW.id, '4900', 'Other Income', 'INCOME', 'Other Income', true),
    
    -- EXPENSES (5000-5999)
    (NEW.id, '5000', 'Fuel Expense', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5100', 'Toll Fees', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5200', 'Border Fees', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5300', 'Driver Wages', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5310', 'Driver Food Allowance', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5320', 'Driver Accommodation', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5400', 'Vehicle Maintenance', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5410', 'Tyres', 'EXPENSE', 'Direct Costs', true),
    (NEW.id, '5500', 'Insurance', 'EXPENSE', 'Operating Expenses', true),
    (NEW.id, '5510', 'Vehicle Licenses', 'EXPENSE', 'Operating Expenses', true),
    (NEW.id, '5600', 'Communication (Airtime)', 'EXPENSE', 'Operating Expenses', true),
    (NEW.id, '5700', 'Depreciation Expense', 'EXPENSE', 'Operating Expenses', true),
    (NEW.id, '5800', 'Bank Charges', 'EXPENSE', 'Operating Expenses', true),
    (NEW.id, '5900', 'Other Expenses', 'EXPENSE', 'Operating Expenses', true);
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER setup_company_accounts
    AFTER INSERT ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.setup_company_chart_of_accounts();

-- =============================================
-- ADD OWNER ROLE TYPE 
-- =============================================
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'owner';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'driver';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'accountant';