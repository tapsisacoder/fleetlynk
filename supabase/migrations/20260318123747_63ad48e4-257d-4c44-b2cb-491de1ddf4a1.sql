
-- ============================================
-- LYNKFLEET DATABASE SCHEMA V3.0
-- ============================================

-- ENUMS
CREATE TYPE public.fuel_mode AS ENUM ('company_tank', 'direct_purchase', 'hybrid');
CREATE TYPE public.invoice_layout AS ENUM ('classic', 'modern', 'minimal');
CREATE TYPE public.account_status AS ENUM ('trial', 'active', 'read_only', 'suspended', 'cancelled');
CREATE TYPE public.user_role AS ENUM ('principal', 'operations_manager', 'dispatcher', 'finance_manager', 'workshop_manager', 'storeroom_clerk', 'hr_manager', 'viewer');
CREATE TYPE public.user_status AS ENUM ('pending', 'active', 'inactive');
CREATE TYPE public.theme_preference AS ENUM ('light', 'dark');
CREATE TYPE public.vehicle_type AS ENUM ('horse', 'rigid', 'interlink', 'flatbed', 'tanker', 'tipper', 'trailer');
CREATE TYPE public.vehicle_status AS ENUM ('standby', 'on_road', 'in_workshop', 'off_road', 'disposed');
CREATE TYPE public.vat_treatment AS ENUM ('standard', 'zero_rated', 'exempt');
CREATE TYPE public.trip_status AS ENUM ('confirmed', 'loading', 'in_transit', 'at_border', 'offloading', 'delivered', 'invoiced', 'closed');
CREATE TYPE public.load_status AS ENUM ('loaded', 'empty');
CREATE TYPE public.trip_type AS ENUM ('local', 'export', 'import');
CREATE TYPE public.load_type AS ENUM ('bulk', 'containers', 'bags', 'pallets', 'breakbulk', 'livestock', 'hazardous', 'other');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'confirmed', 'partially_paid', 'paid', 'overdue');
CREATE TYPE public.how_paid AS ENUM ('cash', 'bank_transfer', 'eft', 'ecocash', 'on_account');
CREATE TYPE public.fuel_transaction_type AS ENUM ('issuance', 'delivery', 'adjustment');
CREATE TYPE public.non_trip_purpose AS ENUM ('yard_movement', 'maintenance_run', 'repositioning', 'standby', 'other');
CREATE TYPE public.job_type AS ENUM ('routine_service', 'repair', 'inspection', 'accident_repair');
CREATE TYPE public.job_source AS ENUM ('planned', 'breakdown', 'vehicle_inspection_failure', 'driver_reported', 'workshop_inspection');
CREATE TYPE public.job_card_status AS ENUM ('open', 'in_progress', 'pending_parts', 'closed');
CREATE TYPE public.assigned_to_type AS ENUM ('inhouse', 'sublet', 'both');
CREATE TYPE public.stock_movement_type AS ENUM ('grn_receipt', 'job_card_issue', 'job_card_return', 'truck_assignment', 'truck_return_serviceable', 'truck_return_damaged', 'truck_return_scrapped', 'write_off', 'stock_adjustment');
CREATE TYPE public.po_status AS ENUM ('draft', 'approved', 'confirmed', 'sent_to_supplier');
CREATE TYPE public.inspection_timing AS ENUM ('before_trip', 'on_workshop_entry', 'both');
CREATE TYPE public.movement_purpose AS ENUM ('empty_repositioning', 'depot_transfer', 'maintenance_run', 'workshop_transfer', 'yard_movement', 'other');

-- ============================================
-- TABLE: companies
-- ============================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL,
  trading_name VARCHAR(255),
  registration_number VARCHAR(100),
  physical_address TEXT NOT NULL DEFAULT '',
  country VARCHAR(100) NOT NULL DEFAULT 'Zimbabwe',
  vat_number VARCHAR(100),
  zimra_bp_number VARCHAR(100),
  phone VARCHAR(50) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  financial_year_start SMALLINT NOT NULL DEFAULT 1,
  timezone VARCHAR(50) NOT NULL DEFAULT 'Africa/Harare',
  date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
  fuel_mode public.fuel_mode NOT NULL DEFAULT 'direct_purchase',
  vat_registered BOOLEAN NOT NULL DEFAULT false,
  vat_rate DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  default_payment_terms SMALLINT NOT NULL DEFAULT 30,
  default_fuel_variance_threshold DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  default_terrain_allowance DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  invoice_prefix VARCHAR(10) NOT NULL DEFAULT 'INV',
  invoice_next_sequence INTEGER NOT NULL DEFAULT 1,
  invoice_layout public.invoice_layout NOT NULL DEFAULT 'classic',
  invoice_primary_colour VARCHAR(7),
  invoice_secondary_colour VARCHAR(7),
  trip_prefix VARCHAR(10) NOT NULL DEFAULT 'TRP',
  trip_next_sequence INTEGER NOT NULL DEFAULT 1,
  po_prefix VARCHAR(10) NOT NULL DEFAULT 'PO',
  po_next_sequence INTEGER NOT NULL DEFAULT 1,
  jc_prefix VARCHAR(10) NOT NULL DEFAULT 'JC',
  jc_next_sequence INTEGER NOT NULL DEFAULT 1,
  grn_prefix VARCHAR(10) NOT NULL DEFAULT 'GRN',
  grn_next_sequence INTEGER NOT NULL DEFAULT 1,
  po_approval_threshold_low DECIMAL(10,2) NOT NULL DEFAULT 200.00,
  po_approval_threshold_high DECIMAL(10,2) NOT NULL DEFAULT 500.00,
  inspection_timing public.inspection_timing NOT NULL DEFAULT 'before_trip',
  founding_fleet BOOLEAN NOT NULL DEFAULT false,
  founding_fleet_free_months_remaining SMALLINT,
  account_status public.account_status NOT NULL DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: profiles (users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role public.user_role NOT NULL DEFAULT 'viewer',
  is_authoriser BOOLEAN NOT NULL DEFAULT false,
  theme_preference public.theme_preference NOT NULL DEFAULT 'light',
  status public.user_status NOT NULL DEFAULT 'pending',
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: user_permissions
-- ============================================
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module VARCHAR(50) NOT NULL,
  has_access BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module)
);

-- ============================================
-- TABLE: cost_centres
-- ============================================
CREATE TABLE public.cost_centres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'vehicle',
  reference_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: clients
-- ============================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  trading_name VARCHAR(255),
  contact_person VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  physical_address TEXT,
  vat_number VARCHAR(100),
  vat_treatment public.vat_treatment NOT NULL DEFAULT 'standard',
  payment_terms_days SMALLINT NOT NULL DEFAULT 30,
  credit_limit_usd DECIMAL(10,2),
  notes TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: suppliers
-- ============================================
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  physical_address TEXT,
  vat_number VARCHAR(100),
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(100),
  branch_code VARCHAR(50),
  payment_terms_days SMALLINT NOT NULL DEFAULT 30,
  notes TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: employees
-- ============================================
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  id_number VARCHAR(100),
  passport_number VARCHAR(100),
  date_of_birth DATE,
  phone VARCHAR(50),
  employment_type VARCHAR(50) NOT NULL DEFAULT 'permanent',
  job_title VARCHAR(100),
  department VARCHAR(100),
  start_date DATE,
  basic_salary_usd DECIMAL(10,2),
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(100),
  branch_code VARCHAR(50),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50),
  notes TEXT,
  is_driver BOOLEAN NOT NULL DEFAULT false,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: trucks
-- ============================================
CREATE TABLE public.trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  registration_number VARCHAR(50) NOT NULL,
  fleet_number VARCHAR(50),
  vehicle_type public.vehicle_type NOT NULL DEFAULT 'horse',
  make VARCHAR(100),
  model VARCHAR(100),
  year SMALLINT,
  vin_number VARCHAR(100),
  fuel_tank_capacity_litres DECIMAL(8,2),
  estimated_fuel_level_litres DECIMAL(8,2) NOT NULL DEFAULT 0,
  km_per_litre_loaded DECIMAL(6,3),
  km_per_litre_unloaded DECIMAL(6,3),
  terrain_allowance_percent DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  anomaly_threshold_percent DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  default_driver_id UUID REFERENCES public.employees(id),
  default_trailer_id UUID,
  odometer_tracking BOOLEAN NOT NULL DEFAULT false,
  current_odometer_km DECIMAL(10,2),
  total_km DECIMAL(10,2) NOT NULL DEFAULT 0,
  status public.vehicle_status NOT NULL DEFAULT 'standby',
  cost_centre_id UUID REFERENCES public.cost_centres(id),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, registration_number)
);

-- Self-reference for default trailer
ALTER TABLE public.trucks ADD CONSTRAINT fk_trucks_default_trailer FOREIGN KEY (default_trailer_id) REFERENCES public.trucks(id);

-- ============================================
-- TABLE: compliance_documents
-- ============================================
CREATE TABLE public.compliance_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  document_category VARCHAR(50) NOT NULL DEFAULT 'vehicle',
  reference_id UUID NOT NULL,
  reference_type VARCHAR(50) NOT NULL DEFAULT 'truck',
  document_number VARCHAR(100),
  issue_date DATE,
  expiry_date DATE NOT NULL,
  file_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'valid',
  notes TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: trips
-- ============================================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  trip_number VARCHAR(20) NOT NULL UNIQUE,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  trailer_id UUID REFERENCES public.trucks(id),
  driver_id UUID REFERENCES public.employees(id) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  load_status public.load_status NOT NULL DEFAULT 'loaded',
  trip_type public.trip_type NOT NULL DEFAULT 'local',
  load_type public.load_type NOT NULL DEFAULT 'bulk',
  tonnage DECIMAL(8,2),
  package_type VARCHAR(100),
  number_of_packages INTEGER,
  container_number VARCHAR(100),
  seal_number VARCHAR(100),
  is_cross_border BOOLEAN NOT NULL DEFAULT false,
  border_post VARCHAR(100),
  rate_usd DECIMAL(10,2) NOT NULL,
  trip_bookout_usd DECIMAL(8,2),
  bookout_tolls_usd DECIMAL(8,2),
  bookout_border_fees_usd DECIMAL(8,2),
  bookout_food_usd DECIMAL(8,2),
  bookout_other_usd DECIMAL(8,2),
  bookout_reconciled BOOLEAN DEFAULT false,
  bookout_unspent_usd DECIMAL(8,2),
  pod_received BOOLEAN,
  pod_sent_to_client BOOLEAN,
  pod_exceptions TEXT,
  status public.trip_status NOT NULL DEFAULT 'confirmed',
  cost_centre_id UUID REFERENCES public.cost_centres(id),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- ============================================
-- TABLE: trip_status_history (append-only)
-- ============================================
CREATE TABLE public.trip_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  status public.trip_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: trip_expenses
-- ============================================
CREATE TABLE public.trip_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  amount_usd DECIMAL(10,2) NOT NULL,
  how_paid public.how_paid NOT NULL DEFAULT 'cash',
  reference VARCHAR(255),
  receipt_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: invoices
-- ============================================
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  trip_id UUID REFERENCES public.trips(id) NOT NULL UNIQUE,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal_usd DECIMAL(12,2) NOT NULL,
  vat_amount_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_usd DECIMAL(12,2) NOT NULL,
  amount_paid_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  amount_outstanding_usd DECIMAL(12,2) NOT NULL,
  status public.invoice_status NOT NULL DEFAULT 'draft',
  layout_used public.invoice_layout NOT NULL DEFAULT 'classic',
  is_voided BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: payments_received (append-only)
-- ============================================
CREATE TABLE public.payments_received (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_usd DECIMAL(12,2) NOT NULL,
  how_paid public.how_paid NOT NULL,
  reference VARCHAR(255),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: fuel_transactions
-- ============================================
CREATE TABLE public.fuel_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  transaction_type public.fuel_transaction_type NOT NULL,
  truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  trip_id UUID REFERENCES public.trips(id),
  non_trip_purpose public.non_trip_purpose,
  supplier_id UUID REFERENCES public.suppliers(id),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  litres DECIMAL(8,2) NOT NULL,
  price_per_litre_usd DECIMAL(6,4) NOT NULL,
  total_cost_usd DECIMAL(10,2) NOT NULL,
  how_paid public.how_paid NOT NULL DEFAULT 'cash',
  slip_url TEXT,
  zig_reference_amount DECIMAL(12,2),
  cost_centre_id UUID REFERENCES public.cost_centres(id),
  authorised_by UUID REFERENCES auth.users(id),
  posted_to_accounts BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: fuel_anomalies
-- ============================================
CREATE TABLE public.fuel_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) NOT NULL,
  truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  expected_litres DECIMAL(8,2) NOT NULL,
  actual_litres DECIMAL(8,2) NOT NULL,
  variance_percent DECIMAL(5,2) NOT NULL,
  threshold_percent DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: job_cards
-- ============================================
CREATE TABLE public.job_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  job_card_number VARCHAR(20) NOT NULL UNIQUE,
  truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  trip_id UUID REFERENCES public.trips(id),
  job_type public.job_type NOT NULL DEFAULT 'repair',
  job_source public.job_source NOT NULL DEFAULT 'planned',
  description TEXT,
  assigned_to public.assigned_to_type NOT NULL DEFAULT 'inhouse',
  status public.job_card_status NOT NULL DEFAULT 'open',
  sublet_supplier_id UUID REFERENCES public.suppliers(id),
  sublet_invoice_number VARCHAR(100),
  sublet_invoice_url TEXT,
  sublet_cost_usd DECIMAL(10,2),
  total_parts_cost_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_centre_id UUID REFERENCES public.cost_centres(id),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- ============================================
-- TABLE: job_card_works
-- ============================================
CREATE TABLE public.job_card_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  job_card_id UUID REFERENCES public.job_cards(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  fault_category VARCHAR(100),
  assigned_to VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: job_card_labour
-- ============================================
CREATE TABLE public.job_card_labour (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  job_card_id UUID REFERENCES public.job_cards(id) ON DELETE CASCADE NOT NULL,
  labour_type VARCHAR(20) NOT NULL DEFAULT 'inhouse',
  mechanic_name VARCHAR(255),
  hours DECIMAL(6,2),
  sublet_workshop_name VARCHAR(255),
  sublet_invoice_number VARCHAR(100),
  sublet_invoice_url TEXT,
  sublet_cost_usd DECIMAL(10,2),
  how_paid public.how_paid,
  reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: parts_catalogue
-- ============================================
CREATE TABLE public.parts_catalogue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  part_number VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  unit_of_measure VARCHAR(50) NOT NULL DEFAULT 'each',
  min_stock_threshold INTEGER NOT NULL DEFAULT 0,
  reorder_quantity INTEGER NOT NULL DEFAULT 1,
  default_supplier_id UUID REFERENCES public.suppliers(id),
  disposal_method VARCHAR(50) NOT NULL DEFAULT 'repairable',
  current_stock INTEGER NOT NULL DEFAULT 0,
  weighted_avg_cost DECIMAL(10,4) NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id, part_number)
);

-- ============================================
-- TABLE: stock_movements (append-only)
-- ============================================
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  part_id UUID REFERENCES public.parts_catalogue(id) NOT NULL,
  movement_type public.stock_movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  unit_cost_usd DECIMAL(10,4) NOT NULL DEFAULT 0,
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: purchase_orders
-- ============================================
CREATE TABLE public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  po_number VARCHAR(20) NOT NULL UNIQUE,
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  status public.po_status NOT NULL DEFAULT 'draft',
  total_amount_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: purchase_order_lines
-- ============================================
CREATE TABLE public.purchase_order_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  po_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
  part_id UUID REFERENCES public.parts_catalogue(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_cost_usd DECIMAL(10,4) NOT NULL,
  total_usd DECIMAL(10,2) NOT NULL,
  received_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: goods_received_notes (GRNs)
-- ============================================
CREATE TABLE public.goods_received_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  grn_number VARCHAR(20) NOT NULL UNIQUE,
  po_id UUID REFERENCES public.purchase_orders(id),
  supplier_id UUID REFERENCES public.suppliers(id) NOT NULL,
  received_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_cost_usd DECIMAL(12,2) NOT NULL DEFAULT 0,
  how_paid public.how_paid NOT NULL DEFAULT 'on_account',
  reference VARCHAR(255),
  notes TEXT,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: grn_lines
-- ============================================
CREATE TABLE public.grn_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  grn_id UUID REFERENCES public.goods_received_notes(id) ON DELETE CASCADE NOT NULL,
  part_id UUID REFERENCES public.parts_catalogue(id) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_cost_usd DECIMAL(10,4) NOT NULL,
  total_usd DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: vehicle_inspections
-- ============================================
CREATE TABLE public.vehicle_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  job_card_id UUID REFERENCES public.job_cards(id),
  inspector_id UUID REFERENCES auth.users(id),
  inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_result VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: inspection_items
-- ============================================
CREATE TABLE public.inspection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  inspection_id UUID REFERENCES public.vehicle_inspections(id) ON DELETE CASCADE NOT NULL,
  section VARCHAR(100) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  result VARCHAR(10) NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: non_trip_movements
-- ============================================
CREATE TABLE public.non_trip_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  driver_id UUID REFERENCES public.employees(id),
  movement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  purpose public.movement_purpose NOT NULL DEFAULT 'yard_movement',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: financial_events (append-only journal)
-- ============================================
CREATE TABLE public.financial_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  debit_account VARCHAR(100) NOT NULL,
  credit_account VARCHAR(100) NOT NULL,
  amount_usd DECIMAL(12,2) NOT NULL,
  cost_centre_id UUID REFERENCES public.cost_centres(id),
  reference_type VARCHAR(50),
  reference_id UUID,
  is_reversal BOOLEAN NOT NULL DEFAULT false,
  reversal_of UUID REFERENCES public.financial_events(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: payroll_periods
-- ============================================
CREATE TABLE public.payroll_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  period_name VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  locked_by UUID REFERENCES auth.users(id),
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: payroll_entries
-- ============================================
CREATE TABLE public.payroll_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  payroll_period_id UUID REFERENCES public.payroll_periods(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  basic_salary_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  overtime_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  allowances_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  deductions_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  paye_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  nssa_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  gross_pay_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_pay_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  trip_bookouts_total_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: disciplinary_records (append-only)
-- ============================================
CREATE TABLE public.disciplinary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  incident_date DATE NOT NULL DEFAULT CURRENT_DATE,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  action_taken TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: tyre_records
-- ============================================
CREATE TABLE public.tyre_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  truck_id UUID REFERENCES public.trucks(id) NOT NULL,
  position VARCHAR(20) NOT NULL,
  brand VARCHAR(100),
  size VARCHAR(50),
  condition VARCHAR(50) NOT NULL DEFAULT 'new',
  installed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  removed_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: inspection_templates
-- ============================================
CREATE TABLE public.inspection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  template_type VARCHAR(20) NOT NULL DEFAULT 'truck',
  section_name VARCHAR(100) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: common_faults
-- ============================================
CREATE TABLE public.common_faults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: audit_log (append-only, immutable)
-- ============================================
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  record_type VARCHAR(100) NOT NULL,
  record_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: alerts
-- ============================================
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  alert_type VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'info',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  module VARCHAR(50) NOT NULL,
  reference_type VARCHAR(50),
  reference_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLE: founding_applications (landing page)
-- ============================================
CREATE TABLE public.founding_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  trucks VARCHAR(50) NOT NULL,
  country VARCHAR(100) NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'landing_page',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_received ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_card_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_card_labour ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_catalogue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_received_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grn_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.non_trip_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tyre_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.common_faults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founding_applications ENABLE ROW LEVEL SECURITY;

-- Helper function for company_id from profile
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Tenant isolation policies for core tables
CREATE POLICY "tenant_isolation" ON public.profiles
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.user_permissions
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.companies
  FOR ALL USING (id = public.get_user_company_id())
  WITH CHECK (id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.cost_centres
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.clients
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.suppliers
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.employees
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.trucks
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.compliance_documents
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.trips
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.trip_status_history
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.trip_expenses
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.invoices
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.payments_received
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.fuel_transactions
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.fuel_anomalies
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.job_cards
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.job_card_works
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.job_card_labour
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.parts_catalogue
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.stock_movements
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.purchase_orders
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.purchase_order_lines
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.goods_received_notes
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.grn_lines
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.vehicle_inspections
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.inspection_items
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.non_trip_movements
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.financial_events
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.payroll_periods
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.payroll_entries
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.disciplinary_records
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.tyre_records
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.inspection_templates
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.common_faults
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.audit_log
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "tenant_isolation" ON public.alerts
  FOR ALL USING (company_id = public.get_user_company_id())
  WITH CHECK (company_id = public.get_user_company_id());

-- Founding applications are public insert (no auth required)
CREATE POLICY "public_insert" ON public.founding_applications
  FOR INSERT WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_trucks_updated_at BEFORE UPDATE ON public.trucks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_compliance_docs_updated_at BEFORE UPDATE ON public.compliance_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
