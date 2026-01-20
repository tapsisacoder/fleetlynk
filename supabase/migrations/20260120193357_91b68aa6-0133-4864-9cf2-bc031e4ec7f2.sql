-- =============================================
-- WORKSHOP MODULE TABLES
-- =============================================

-- Inventory Items Table
CREATE TABLE public.inventory_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 5,
    unit_cost NUMERIC(12,2) DEFAULT 0,
    location VARCHAR(255),
    supplier VARCHAR(255),
    last_restocked_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Maintenance Records Table
CREATE TABLE public.maintenance_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id),
    driver_id UUID REFERENCES public.drivers(id),
    service_type VARCHAR(100) NOT NULL,
    service_category VARCHAR(100),
    description TEXT NOT NULL,
    parts_used JSONB DEFAULT '[]',
    labor_cost NUMERIC(12,2) DEFAULT 0,
    parts_cost NUMERIC(12,2) DEFAULT 0,
    total_cost NUMERIC(12,2) DEFAULT 0,
    odometer_reading INTEGER,
    service_date DATE NOT NULL,
    next_service_date DATE,
    next_service_odometer INTEGER,
    performed_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Purchase Orders Table
CREATE TABLE public.purchase_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    po_number VARCHAR(50) NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_contact VARCHAR(255),
    supplier_email VARCHAR(255),
    items JSONB NOT NULL DEFAULT '[]',
    subtotal NUMERIC(12,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'draft',
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    received_date DATE,
    notes TEXT,
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vehicle Documents Table
CREATE TABLE public.vehicle_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT,
    issue_date DATE,
    expiry_date DATE,
    reminder_days INTEGER DEFAULT 30,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Maintenance Schedules Table
CREATE TABLE public.maintenance_schedules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    interval_km INTEGER,
    interval_days INTEGER,
    last_service_date DATE,
    last_service_odometer INTEGER,
    next_due_date DATE,
    next_due_odometer INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES FOR INVENTORY ITEMS
-- =============================================

CREATE POLICY "Users can view company inventory"
ON public.inventory_items FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company inventory"
ON public.inventory_items FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company inventory"
ON public.inventory_items FOR UPDATE
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company inventory"
ON public.inventory_items FOR DELETE
USING (company_id = get_user_company_id());

-- =============================================
-- RLS POLICIES FOR MAINTENANCE RECORDS
-- =============================================

CREATE POLICY "Users can view company maintenance records"
ON public.maintenance_records FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company maintenance records"
ON public.maintenance_records FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company maintenance records"
ON public.maintenance_records FOR UPDATE
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company maintenance records"
ON public.maintenance_records FOR DELETE
USING (company_id = get_user_company_id());

-- =============================================
-- RLS POLICIES FOR PURCHASE ORDERS
-- =============================================

CREATE POLICY "Users can view company purchase orders"
ON public.purchase_orders FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company purchase orders"
ON public.purchase_orders FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company purchase orders"
ON public.purchase_orders FOR UPDATE
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company purchase orders"
ON public.purchase_orders FOR DELETE
USING (company_id = get_user_company_id());

-- =============================================
-- RLS POLICIES FOR VEHICLE DOCUMENTS
-- =============================================

CREATE POLICY "Users can view company vehicle documents"
ON public.vehicle_documents FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company vehicle documents"
ON public.vehicle_documents FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company vehicle documents"
ON public.vehicle_documents FOR UPDATE
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company vehicle documents"
ON public.vehicle_documents FOR DELETE
USING (company_id = get_user_company_id());

-- =============================================
-- RLS POLICIES FOR MAINTENANCE SCHEDULES
-- =============================================

CREATE POLICY "Users can view company maintenance schedules"
ON public.maintenance_schedules FOR SELECT
USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company maintenance schedules"
ON public.maintenance_schedules FOR INSERT
WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company maintenance schedules"
ON public.maintenance_schedules FOR UPDATE
USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company maintenance schedules"
ON public.maintenance_schedules FOR DELETE
USING (company_id = get_user_company_id());

-- =============================================
-- UPDATE TRIGGERS
-- =============================================

CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON public.inventory_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at
BEFORE UPDATE ON public.maintenance_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
BEFORE UPDATE ON public.purchase_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicle_documents_updated_at
BEFORE UPDATE ON public.vehicle_documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_schedules_updated_at
BEFORE UPDATE ON public.maintenance_schedules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();