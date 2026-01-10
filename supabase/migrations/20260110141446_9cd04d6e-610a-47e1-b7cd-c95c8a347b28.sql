-- =============================================
-- PHASE 1: LYNKFLEET CORE ENTITIES & ACCOUNTING MODULE
-- =============================================

-- 1. COMPANIES TABLE (Multi-tenant support)
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    logo_url TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE (User profiles linked to auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    full_name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VEHICLES TABLE
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    registration_number VARCHAR(50) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    engine_type VARCHAR(100),
    tank_capacity_liters INTEGER DEFAULT 800,
    year INTEGER,
    color VARCHAR(50),
    vin VARCHAR(50),
    current_odometer INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available', -- available, deployed, maintenance
    fuel_consumption_empty DECIMAL(5,2) DEFAULT 30,
    fuel_consumption_loaded DECIMAL(5,2) DEFAULT 38,
    insurance_expiry DATE,
    license_expiry DATE,
    roadworthy_expiry DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, registration_number)
);

-- 4. DRIVERS TABLE
CREATE TABLE public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(200) NOT NULL,
    id_number VARCHAR(50),
    license_number VARCHAR(50),
    license_expiry DATE,
    phone VARCHAR(50),
    email VARCHAR(200),
    address TEXT,
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(50),
    employment_status VARCHAR(20) DEFAULT 'active', -- active, suspended, terminated
    hire_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLIENTS TABLE
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    address TEXT,
    payment_terms_days INTEGER DEFAULT 30,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TRIPS TABLE
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    trip_reference VARCHAR(50) NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    
    -- Route
    origin VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    distance_km DECIMAL(10,2),
    
    -- Dates
    departure_date TIMESTAMPTZ,
    eta TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Fuel
    fuel_allocated_liters DECIMAL(10,2),
    fuel_used_liters DECIMAL(10,2),
    
    -- Load info
    load_status VARCHAR(20) DEFAULT 'loaded', -- loaded, empty
    cargo_description TEXT,
    rate DECIMAL(15,2),
    tonnage DECIMAL(10,2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'planned', -- planned, in_transit, completed, cancelled
    progress_percent INTEGER DEFAULT 0,
    
    -- Odometer
    start_odometer INTEGER,
    end_odometer INTEGER,
    
    -- Costs
    trip_costs DECIMAL(15,2) DEFAULT 0,
    toll_fees DECIMAL(15,2) DEFAULT 0,
    
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, trip_reference)
);

-- 7. CHART OF ACCOUNTS TABLE
CREATE TABLE public.chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    account_code VARCHAR(10) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) NOT NULL, -- ASSET, LIABILITY, EQUITY, INCOME, EXPENSE
    category VARCHAR(50),
    parent_code VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    is_system BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, account_code)
);

-- 8. TRANSACTIONS TABLE
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    transaction_number VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    reference VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(12,6) DEFAULT 1.0,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, POSTED, RECONCILED, REVERSED
    posted_at TIMESTAMPTZ,
    posted_by UUID REFERENCES auth.users(id),
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    attachments JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    UNIQUE(company_id, transaction_number)
);

-- 9. JOURNAL ENTRIES TABLE (Double-Entry)
CREATE TABLE public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    account_code VARCHAR(10) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    debit_amount DECIMAL(15,2) DEFAULT 0.00,
    credit_amount DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVOICES TABLE
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    client_name VARCHAR(200),
    client_email VARCHAR(200),
    client_phone VARCHAR(50),
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    route TEXT,
    distance_km DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, SENT, VIEWED, PAID, OVERDUE, CANCELLED
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_terms_days INTEGER DEFAULT 30,
    notes TEXT,
    terms_and_conditions TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    pdf_url TEXT,
    pdf_generated_at TIMESTAMPTZ,
    UNIQUE(company_id, invoice_number)
);

-- 11. EXPENSE RECORDS TABLE
CREATE TABLE public.expense_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    expense_type VARCHAR(50) NOT NULL, -- TOLL, BORDER_FEE, FOOD, ACCOMMODATION, MAINTENANCE, OTHER
    expense_date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    location TEXT,
    vendor VARCHAR(200),
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    receipt_photo_url TEXT,
    receipt_uploaded_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PAYMENT RECORDS TABLE
CREATE TABLE public.payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    payment_date DATE NOT NULL,
    payment_type VARCHAR(30) NOT NULL, -- RECEIVED, PAID_OUT
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL, -- BANK_TRANSFER, CASH, MOBILE_MONEY, CHEQUE
    reference VARCHAR(100),
    bank_account VARCHAR(100),
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TRIP BOOKOUTS TABLE (Driver Cash Advance)
CREATE TABLE public.trip_bookouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    bookout_date DATE NOT NULL,
    total_cash_given DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    food_allowance DECIMAL(15,2) DEFAULT 0,
    accommodation DECIMAL(15,2) DEFAULT 0,
    toll_fees DECIMAL(15,2) DEFAULT 0,
    border_fees DECIMAL(15,2) DEFAULT 0,
    emergency_fund DECIMAL(15,2) DEFAULT 0,
    airtime DECIMAL(15,2) DEFAULT 0,
    other_expenses DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, RECONCILED
    amount_spent DECIMAL(15,2) DEFAULT 0,
    amount_returned DECIMAL(15,2) DEFAULT 0,
    variance DECIMAL(15,2) DEFAULT 0,
    reconciled_at TIMESTAMPTZ,
    reconciled_by UUID REFERENCES auth.users(id),
    bookout_transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    reconciliation_transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    driver_signature_url TEXT,
    operator_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. DOCUMENT ALERTS TABLE
CREATE TABLE public.document_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- LICENSE, INSURANCE, ROADWORTHY, PERMIT
    title VARCHAR(200) NOT NULL,
    expires_at DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, snoozed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_bookouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_alerts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Helper function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE user_id = auth.uid()
$$;

-- COMPANIES policies
CREATE POLICY "Users can view their own company" ON public.companies
    FOR SELECT USING (id = get_user_company_id() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own company" ON public.companies
    FOR UPDATE USING (id = get_user_company_id());

CREATE POLICY "Authenticated users can create companies" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- PROFILES policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (user_id = auth.uid() OR company_id = get_user_company_id());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- VEHICLES policies
CREATE POLICY "Users can view company vehicles" ON public.vehicles
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company vehicles" ON public.vehicles
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company vehicles" ON public.vehicles
    FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company vehicles" ON public.vehicles
    FOR DELETE USING (company_id = get_user_company_id());

-- DRIVERS policies
CREATE POLICY "Users can view company drivers" ON public.drivers
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company drivers" ON public.drivers
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company drivers" ON public.drivers
    FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company drivers" ON public.drivers
    FOR DELETE USING (company_id = get_user_company_id());

-- CLIENTS policies
CREATE POLICY "Users can view company clients" ON public.clients
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company clients" ON public.clients
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company clients" ON public.clients
    FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company clients" ON public.clients
    FOR DELETE USING (company_id = get_user_company_id());

-- TRIPS policies
CREATE POLICY "Users can view company trips" ON public.trips
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company trips" ON public.trips
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company trips" ON public.trips
    FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company trips" ON public.trips
    FOR DELETE USING (company_id = get_user_company_id());

-- CHART_OF_ACCOUNTS policies
CREATE POLICY "Users can view company accounts" ON public.chart_of_accounts
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company accounts" ON public.chart_of_accounts
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company accounts" ON public.chart_of_accounts
    FOR UPDATE USING (company_id = get_user_company_id());

-- TRANSACTIONS policies
CREATE POLICY "Users can view company transactions" ON public.transactions
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company transactions" ON public.transactions
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company transactions" ON public.transactions
    FOR UPDATE USING (company_id = get_user_company_id());

-- JOURNAL_ENTRIES policies (via transaction)
CREATE POLICY "Users can view company journal entries" ON public.journal_entries
    FOR SELECT USING (
        transaction_id IN (SELECT id FROM public.transactions WHERE company_id = get_user_company_id())
    );

CREATE POLICY "Users can insert company journal entries" ON public.journal_entries
    FOR INSERT WITH CHECK (
        transaction_id IN (SELECT id FROM public.transactions WHERE company_id = get_user_company_id())
    );

-- INVOICES policies
CREATE POLICY "Users can view company invoices" ON public.invoices
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company invoices" ON public.invoices
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company invoices" ON public.invoices
    FOR UPDATE USING (company_id = get_user_company_id());

-- EXPENSE_RECORDS policies
CREATE POLICY "Users can view company expenses" ON public.expense_records
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company expenses" ON public.expense_records
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company expenses" ON public.expense_records
    FOR UPDATE USING (company_id = get_user_company_id());

-- PAYMENT_RECORDS policies
CREATE POLICY "Users can view company payments" ON public.payment_records
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company payments" ON public.payment_records
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

-- TRIP_BOOKOUTS policies
CREATE POLICY "Users can view company bookouts" ON public.trip_bookouts
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company bookouts" ON public.trip_bookouts
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company bookouts" ON public.trip_bookouts
    FOR UPDATE USING (company_id = get_user_company_id());

-- DOCUMENT_ALERTS policies
CREATE POLICY "Users can view company alerts" ON public.document_alerts
    FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company alerts" ON public.document_alerts
    FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company alerts" ON public.document_alerts
    FOR UPDATE USING (company_id = get_user_company_id());

-- =============================================
-- AUTO-UPDATE TIMESTAMP TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON public.drivers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chart_of_accounts_updated_at BEFORE UPDATE ON public.chart_of_accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- SEQUENCE GENERATORS FOR REFERENCE NUMBERS
-- =============================================
CREATE SEQUENCE IF NOT EXISTS trip_reference_seq START 100;
CREATE SEQUENCE IF NOT EXISTS transaction_number_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- Function to generate trip reference
CREATE OR REPLACE FUNCTION public.generate_trip_reference()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TRIP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('trip_reference_seq')::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate transaction number
CREATE OR REPLACE FUNCTION public.generate_transaction_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TXN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('transaction_number_seq')::text, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_number_seq')::text, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_vehicles_company_id ON public.vehicles(company_id);
CREATE INDEX idx_drivers_company_id ON public.drivers(company_id);
CREATE INDEX idx_clients_company_id ON public.clients(company_id);
CREATE INDEX idx_trips_company_id ON public.trips(company_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_driver_id ON public.trips(driver_id);
CREATE INDEX idx_trips_vehicle_id ON public.trips(vehicle_id);
CREATE INDEX idx_transactions_company_id ON public.transactions(company_id);
CREATE INDEX idx_transactions_trip_id ON public.transactions(trip_id);
CREATE INDEX idx_invoices_company_id ON public.invoices(company_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_expense_records_company_id ON public.expense_records(company_id);
CREATE INDEX idx_expense_records_trip_id ON public.expense_records(trip_id);
CREATE INDEX idx_trip_bookouts_trip_id ON public.trip_bookouts(trip_id);