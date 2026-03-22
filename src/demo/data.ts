/**
 * LynkFleet Demo Mode — All Mock Data
 * ────────────────────────────────────
 * DELETE this entire /src/demo/ folder to remove demo mode.
 * Then remove the /demo routes from App.tsx.
 */

export interface DemoClient {
  id: string; company_name: string; contact_person: string;
  payment_terms_days: number; phone: string; email: string;
  physical_address: string; vat_number: string;
}
export interface DemoFuelSupplier { id: string; supplier_name: string; price_per_litre: number; }
export interface DemoEmployee {
  id: string; full_name: string; job_title: string; department: string;
  phone: string; employment_type: string; is_driver: boolean;
  default_truck_id?: string; basic_salary_usd: number;
}
export interface DemoTruck {
  id: string; registration_number: string; fleet_number: string;
  make: string; model: string; year: number; status: string;
  vehicle_type: string; default_driver_id: string; default_trailer_id: string;
  fuel_tank_capacity_litres: number; estimated_fuel_level_litres: number;
  km_per_litre_loaded: number; anomaly_threshold_percent: number | null;
  total_km: number;
}
export interface DemoTrailer {
  id: string; registration_number: string; status: string;
  assigned_truck_id: string; vehicle_type: string; make: string; model: string;
}
export interface DemoTrip {
  id: string; trip_number: string; origin: string; destination: string;
  distance_km: number; trip_type: string; client_id: string; client_name: string;
  truck_id: string; truck_reg: string; trailer_reg: string;
  driver_id: string; driver_name: string; rate_usd: number;
  total_costs_usd: number; margin_usd: number; status: string;
  created_at: string; bookout_usd?: number; fuel_cost_usd?: number;
}
export interface DemoInvoice {
  id: string; invoice_number: string; trip_number: string;
  client_name: string; client_id: string; total_usd: number;
  amount_paid_usd: number; amount_outstanding_usd: number;
  status: string; invoice_date: string; due_date: string;
}
export interface DemoFuelTransaction {
  id: string; date: string; truck_reg: string; driver_name: string;
  trip_number: string; supplier_name: string; litres: number;
  price_per_litre: number; total_cost: number; anomaly_flagged?: boolean;
}
export interface DemoFuelAnomaly {
  id: string; anomaly_number: string; date: string; trip_number: string;
  truck_reg: string; driver_name: string; route: string;
  variance_percent: number; status: string;
}
export interface DemoAlert { id: string; severity: string; title: string; module: string; }
export interface DemoJobCard {
  id: string; job_card_number: string; truck_reg: string; job_type: string;
  job_source: string; description: string; status: string; opened_at: string;
}
export interface DemoPart {
  id: string; part_number: string; name: string; category: string;
  current_stock: number; min_stock_threshold: number;
  weighted_avg_cost: number; supplier_name: string;
}

// ─── COMPANY ──────────────────────────────────
export const DEMO_COMPANY = {
  company_name: "Mwana Haulage (Pvt) Ltd",
  trading_name: "Mwana Haulage",
  physical_address: "████████████████",
  phone: "████████████",
  email: "ops@mwanahaulage.co.zw",
  vat_number: "████████████",
  registration_number: "████████████",
  country: "Zimbabwe",
  bank_name: "CBZ Bank",
  bank_account: "████████████",
  bank_branch: "████████",
};

// ─── CLIENTS ──────────────────────────────────
export const DEMO_CLIENTS: DemoClient[] = [
  { id: "c1", company_name: "Mega Freight Ltd", contact_person: "Mr P. Chigumba", payment_terms_days: 30, phone: "████████", email: "████████", physical_address: "████████████████", vat_number: "████████" },
  { id: "c2", company_name: "Coastal Cargo Zimbabwe", contact_person: "Mrs R. Dube", payment_terms_days: 14, phone: "████████", email: "████████", physical_address: "████████████████", vat_number: "████████" },
  { id: "c3", company_name: "Inland Logistics (Pvt) Ltd", contact_person: "Mr S. Moyo", payment_terms_days: 45, phone: "████████", email: "████████", physical_address: "████████████████", vat_number: "████████" },
];

// ─── FUEL SUPPLIERS ────────────────────────────
export const DEMO_FUEL_SUPPLIERS: DemoFuelSupplier[] = [
  { id: "fs1", supplier_name: "Thuli Petroleum", price_per_litre: 2.05 },
  { id: "fs2", supplier_name: "Energy Park", price_per_litre: 2.05 },
  { id: "fs3", supplier_name: "Redan Fuels", price_per_litre: 2.05 },
  { id: "fs4", supplier_name: "SOM Petroleum", price_per_litre: 1.22 },
];

// ─── EMPLOYEES / DRIVERS ──────────────────────
export const DEMO_EMPLOYEES: DemoEmployee[] = [
  { id: "e1", full_name: "John Moyo", job_title: "Driver", department: "Operations", phone: "+263 77 123 4567", employment_type: "permanent", is_driver: true, default_truck_id: "t1", basic_salary_usd: 450 },
  { id: "e2", full_name: "Tendai Chirwa", job_title: "Driver", department: "Operations", phone: "+263 77 234 5678", employment_type: "permanent", is_driver: true, default_truck_id: "t2", basic_salary_usd: 450 },
  { id: "e3", full_name: "Kevin Sibanda", job_title: "Driver", department: "Operations", phone: "+263 77 345 6789", employment_type: "permanent", is_driver: true, default_truck_id: "t3", basic_salary_usd: 450 },
  { id: "e4", full_name: "Brighton Ncube", job_title: "Driver", department: "Operations", phone: "+263 77 456 7890", employment_type: "permanent", is_driver: true, default_truck_id: "t4", basic_salary_usd: 450 },
  { id: "e5", full_name: "Shame Mutasa", job_title: "Driver", department: "Operations", phone: "+263 77 567 8901", employment_type: "permanent", is_driver: true, default_truck_id: "t5", basic_salary_usd: 450 },
  { id: "e6", full_name: "Grace Nyoni", job_title: "Workshop Manager", department: "Workshop", phone: "+263 77 678 9012", employment_type: "permanent", is_driver: false, basic_salary_usd: 600 },
  { id: "e7", full_name: "Peter Makoni", job_title: "Mechanic", department: "Workshop", phone: "+263 77 789 0123", employment_type: "permanent", is_driver: false, basic_salary_usd: 350 },
  { id: "e8", full_name: "Ruth Dzviti", job_title: "Accounts Clerk", department: "Finance", phone: "+263 77 890 1234", employment_type: "permanent", is_driver: false, basic_salary_usd: 400 },
];

// ─── TRUCKS ───────────────────────────────────
export const DEMO_TRUCKS: DemoTruck[] = [
  { id: "t1", registration_number: "ADZ 9799", fleet_number: "T-01", make: "Volvo", model: "FH16", year: 2019, status: "on_road", vehicle_type: "truck", default_driver_id: "e1", default_trailer_id: "tr1", fuel_tank_capacity_litres: 700, estimated_fuel_level_litres: 140, km_per_litre_loaded: 3.8, anomaly_threshold_percent: 15, total_km: 245000 },
  { id: "t2", registration_number: "AEG 7336", fleet_number: "T-02", make: "Mercedes", model: "Actros 2645", year: 2018, status: "on_road", vehicle_type: "truck", default_driver_id: "e2", default_trailer_id: "tr2", fuel_tank_capacity_litres: 680, estimated_fuel_level_litres: 380, km_per_litre_loaded: 3.6, anomaly_threshold_percent: 15, total_km: 310000 },
  { id: "t3", registration_number: "AGB 1092", fleet_number: "T-03", make: "DAF", model: "XF105", year: 2016, status: "in_workshop", vehicle_type: "truck", default_driver_id: "e3", default_trailer_id: "tr3", fuel_tank_capacity_litres: 650, estimated_fuel_level_litres: 210, km_per_litre_loaded: 3.4, anomaly_threshold_percent: 15, total_km: 420000 },
  { id: "t4", registration_number: "AGL 4688", fleet_number: "T-04", make: "Volvo", model: "FH440", year: 2020, status: "on_road", vehicle_type: "truck", default_driver_id: "e4", default_trailer_id: "tr4", fuel_tank_capacity_litres: 720, estimated_fuel_level_litres: 520, km_per_litre_loaded: 4.0, anomaly_threshold_percent: 15, total_km: 180000 },
  { id: "t5", registration_number: "AEU 1313", fleet_number: "T-05", make: "Freightliner", model: "Columbia 120", year: 2015, status: "standby", vehicle_type: "truck", default_driver_id: "e5", default_trailer_id: "tr5", fuel_tank_capacity_litres: 600, estimated_fuel_level_litres: 0, km_per_litre_loaded: 2.0, anomaly_threshold_percent: null, total_km: 520000 },
];

// ─── TRAILERS ─────────────────────────────────
export const DEMO_TRAILERS: DemoTrailer[] = [
  { id: "tr1", registration_number: "AEZ 1730", status: "on_road", assigned_truck_id: "t1", vehicle_type: "trailer", make: "SA Truck Bodies", model: "Tautliner" },
  { id: "tr2", registration_number: "ABS 0741", status: "on_road", assigned_truck_id: "t2", vehicle_type: "trailer", make: "Afrit", model: "Side Tipper" },
  { id: "tr3", registration_number: "AEZ 8932", status: "in_workshop", assigned_truck_id: "t3", vehicle_type: "trailer", make: "Henred", model: "Flat Deck" },
  { id: "tr4", registration_number: "ACQ 9301", status: "on_road", assigned_truck_id: "t4", vehicle_type: "trailer", make: "SA Truck Bodies", model: "Tautliner" },
  { id: "tr5", registration_number: "AGL 2339", status: "standby", assigned_truck_id: "t5", vehicle_type: "trailer", make: "Afrit", model: "Link" },
];

// ─── CLOSED TRIPS ─────────────────────────────
export const DEMO_CLOSED_TRIPS: DemoTrip[] = [
  { id: "trip20", trip_number: "TRP-2026-0020", origin: "Selous", destination: "Beira", distance_km: 640, trip_type: "Export", client_id: "c3", client_name: "Inland Logistics (Pvt) Ltd", truck_id: "t3", truck_reg: "AGB 1092", trailer_reg: "AEZ 8932", driver_id: "e3", driver_name: "Kevin Sibanda", rate_usd: 1300, total_costs_usd: 1798, margin_usd: -498, status: "closed", created_at: "2026-03-01" },
  { id: "trip21", trip_number: "TRP-2026-0021", origin: "Selous", destination: "Beira", distance_km: 640, trip_type: "Export", client_id: "c1", client_name: "Mega Freight Ltd", truck_id: "t1", truck_reg: "ADZ 9799", trailer_reg: "AEZ 1730", driver_id: "e1", driver_name: "John Moyo", rate_usd: 1300, total_costs_usd: 748, margin_usd: 552, status: "closed", created_at: "2026-03-03" },
  { id: "trip22", trip_number: "TRP-2026-0022", origin: "Kildonan", destination: "Beira", distance_km: 680, trip_type: "Export", client_id: "c2", client_name: "Coastal Cargo Zimbabwe", truck_id: "t2", truck_reg: "AEG 7336", trailer_reg: "ABS 0741", driver_id: "e2", driver_name: "Tendai Chirwa", rate_usd: 1400, total_costs_usd: 797, margin_usd: 603, status: "closed", created_at: "2026-03-05" },
  { id: "trip23", trip_number: "TRP-2026-0023", origin: "Beira", destination: "Harare", distance_km: 600, trip_type: "Import", client_id: "c1", client_name: "Mega Freight Ltd", truck_id: "t4", truck_reg: "AGL 4688", trailer_reg: "ACQ 9301", driver_id: "e4", driver_name: "Brighton Ncube", rate_usd: 1500, total_costs_usd: 678, margin_usd: 822, status: "closed", created_at: "2026-03-07" },
  { id: "trip24", trip_number: "TRP-2026-0024", origin: "Beira", destination: "Harare", distance_km: 600, trip_type: "Import", client_id: "c3", client_name: "Inland Logistics (Pvt) Ltd", truck_id: "t4", truck_reg: "AGL 4688", trailer_reg: "ACQ 9301", driver_id: "e4", driver_name: "Brighton Ncube", rate_usd: 1500, total_costs_usd: 670, margin_usd: 830, status: "closed", created_at: "2026-03-09" },
  { id: "trip25", trip_number: "TRP-2026-0025", origin: "Kildonan", destination: "Beira", distance_km: 680, trip_type: "Export", client_id: "c2", client_name: "Coastal Cargo Zimbabwe", truck_id: "t2", truck_reg: "AEG 7336", trailer_reg: "ABS 0741", driver_id: "e2", driver_name: "Tendai Chirwa", rate_usd: 1400, total_costs_usd: 1450, margin_usd: -50, status: "closed", created_at: "2026-03-11" },
  { id: "trip26", trip_number: "TRP-2026-0026", origin: "Selous", destination: "Beira", distance_km: 640, trip_type: "Export", client_id: "c3", client_name: "Inland Logistics (Pvt) Ltd", truck_id: "t3", truck_reg: "AGB 1092", trailer_reg: "AEZ 8932", driver_id: "e3", driver_name: "Kevin Sibanda", rate_usd: 1300, total_costs_usd: 1546, margin_usd: -246, status: "closed", created_at: "2026-03-13" },
  { id: "trip27", trip_number: "TRP-2026-0027", origin: "Beira", destination: "Harare", distance_km: 600, trip_type: "Import", client_id: "c1", client_name: "Mega Freight Ltd", truck_id: "t4", truck_reg: "AGL 4688", trailer_reg: "ACQ 9301", driver_id: "e4", driver_name: "Brighton Ncube", rate_usd: 1900, total_costs_usd: 1629, margin_usd: 271, status: "closed", created_at: "2026-03-15" },
];

// ─── OPEN TRIPS ───────────────────────────────
export const DEMO_OPEN_TRIPS: DemoTrip[] = [
  { id: "trip28", trip_number: "TRP-2026-0028", origin: "Selous", destination: "Beira", distance_km: 640, trip_type: "Export", client_id: "c1", client_name: "Mega Freight Ltd", truck_id: "t1", truck_reg: "ADZ 9799", trailer_reg: "AEZ 1730", driver_id: "e1", driver_name: "John Moyo", rate_usd: 1300, total_costs_usd: 369, margin_usd: 931, status: "in_transit", created_at: "2026-03-21", bookout_usd: 280, fuel_cost_usd: 369 },
  { id: "trip26b", trip_number: "TRP-2026-0026B", origin: "Kildonan", destination: "Beira", distance_km: 680, trip_type: "Export", client_id: "c2", client_name: "Coastal Cargo Zimbabwe", truck_id: "t2", truck_reg: "AEG 7336", trailer_reg: "ABS 0741", driver_id: "e2", driver_name: "Tendai Chirwa", rate_usd: 1400, total_costs_usd: 0, margin_usd: 1400, status: "at_border", created_at: "2026-03-20" },
  { id: "trip25b", trip_number: "TRP-2026-0025B", origin: "Beira", destination: "Harare", distance_km: 600, trip_type: "Import", client_id: "c3", client_name: "Inland Logistics (Pvt) Ltd", truck_id: "t4", truck_reg: "AGL 4688", trailer_reg: "ACQ 9301", driver_id: "e4", driver_name: "Brighton Ncube", rate_usd: 1500, total_costs_usd: 0, margin_usd: 1500, status: "loading", created_at: "2026-03-22" },
];

// ─── INVOICES ─────────────────────────────────
export const DEMO_INVOICES: DemoInvoice[] = [
  { id: "inv20", invoice_number: "INV-2026-0020", trip_number: "TRP-2026-0020", client_name: "Inland Logistics (Pvt) Ltd", client_id: "c3", total_usd: 1300, amount_paid_usd: 455, amount_outstanding_usd: 845, status: "confirmed", invoice_date: "2026-03-02", due_date: "2026-04-16" },
  { id: "inv21", invoice_number: "INV-2026-0021", trip_number: "TRP-2026-0021", client_name: "Mega Freight Ltd", client_id: "c1", total_usd: 1300, amount_paid_usd: 1300, amount_outstanding_usd: 0, status: "paid", invoice_date: "2026-03-04", due_date: "2026-04-03" },
  { id: "inv22", invoice_number: "INV-2026-0022", trip_number: "TRP-2026-0022", client_name: "Coastal Cargo Zimbabwe", client_id: "c2", total_usd: 1400, amount_paid_usd: 1400, amount_outstanding_usd: 0, status: "paid", invoice_date: "2026-03-06", due_date: "2026-03-20" },
  { id: "inv23", invoice_number: "INV-2026-0023", trip_number: "TRP-2026-0023", client_name: "Mega Freight Ltd", client_id: "c1", total_usd: 1500, amount_paid_usd: 800, amount_outstanding_usd: 700, status: "partially_paid", invoice_date: "2026-03-08", due_date: "2026-04-07" },
  { id: "inv24", invoice_number: "INV-2026-0024", trip_number: "TRP-2026-0024", client_name: "Inland Logistics (Pvt) Ltd", client_id: "c3", total_usd: 1500, amount_paid_usd: 200, amount_outstanding_usd: 1300, status: "confirmed", invoice_date: "2026-03-10", due_date: "2026-04-24" },
  { id: "inv25", invoice_number: "INV-2026-0025", trip_number: "TRP-2026-0025", client_name: "Coastal Cargo Zimbabwe", client_id: "c2", total_usd: 1400, amount_paid_usd: 1400, amount_outstanding_usd: 0, status: "paid", invoice_date: "2026-03-12", due_date: "2026-03-26" },
  { id: "inv26", invoice_number: "INV-2026-0026", trip_number: "TRP-2026-0026", client_name: "Inland Logistics (Pvt) Ltd", client_id: "c3", total_usd: 1300, amount_paid_usd: 0, amount_outstanding_usd: 1300, status: "confirmed", invoice_date: "2026-03-14", due_date: "2026-04-28" },
  { id: "inv27", invoice_number: "INV-2026-0027", trip_number: "TRP-2026-0027", client_name: "Mega Freight Ltd", client_id: "c1", total_usd: 1900, amount_paid_usd: 1900, amount_outstanding_usd: 0, status: "paid", invoice_date: "2026-03-16", due_date: "2026-04-15" },
];

// ─── FUEL TRANSACTIONS ────────────────────────
export const DEMO_FUEL_TRANSACTIONS: DemoFuelTransaction[] = [
  { id: "ft6", date: "2026-03-21", truck_reg: "ADZ 9799", driver_name: "John Moyo", trip_number: "TRP-2026-0028", supplier_name: "Thuli Petroleum", litres: 180, price_per_litre: 2.05, total_cost: 369.00 },
  { id: "ft5", date: "2026-03-18", truck_reg: "AGB 1092", driver_name: "Kevin Sibanda", trip_number: "TRP-2026-0026", supplier_name: "Thuli Petroleum", litres: 220, price_per_litre: 2.05, total_cost: 451.00 },
  { id: "ft4", date: "2026-03-16", truck_reg: "ADZ 9799", driver_name: "John Moyo", trip_number: "TRP-2026-0021", supplier_name: "SOM Petroleum", litres: 160, price_per_litre: 1.22, total_cost: 195.20 },
  { id: "ft3", date: "2026-03-14", truck_reg: "AGL 4688", driver_name: "Brighton Ncube", trip_number: "TRP-2026-0023", supplier_name: "Redan Fuels", litres: 180, price_per_litre: 2.05, total_cost: 369.00 },
  { id: "ft2", date: "2026-03-10", truck_reg: "AEG 7336", driver_name: "Tendai Chirwa", trip_number: "TRP-2026-0022", supplier_name: "Energy Park", litres: 210, price_per_litre: 2.05, total_cost: 430.50 },
  { id: "ft1", date: "2026-03-08", truck_reg: "ADZ 9799", driver_name: "John Moyo", trip_number: "TRP-2026-0021", supplier_name: "Thuli Petroleum", litres: 195, price_per_litre: 2.05, total_cost: 399.75 },
];

// ─── FUEL ANOMALIES ───────────────────────────
export const DEMO_FUEL_ANOMALIES: DemoFuelAnomaly[] = [
  { id: "ano3", anomaly_number: "ANO-2026-0003", date: "2026-03-18", trip_number: "TRP-2026-0026", truck_reg: "AGB 1092", driver_name: "Kevin Sibanda", route: "Selous to Beira", variance_percent: 38, status: "resolved" },
  { id: "ano2", anomaly_number: "ANO-2026-0002", date: "2026-03-10", trip_number: "TRP-2026-0025", truck_reg: "AEG 7336", driver_name: "Tendai Chirwa", route: "Kildonan to Beira", variance_percent: 28, status: "resolved" },
  { id: "ano1", anomaly_number: "ANO-2026-0001", date: "2026-03-05", trip_number: "TRP-2026-0020", truck_reg: "AGB 1092", driver_name: "Kevin Sibanda", route: "Selous to Beira", variance_percent: 42, status: "resolved" },
];

// ─── ALERTS ───────────────────────────────────
export const DEMO_ALERTS: DemoAlert[] = [
  { id: "al1", severity: "warning", title: "INV-2026-0020 unpaid — Inland Logistics — $1,300", module: "accounts" },
  { id: "al2", severity: "warning", title: "INV-2026-0024 unpaid — Inland Logistics — $1,500", module: "accounts" },
  { id: "al3", severity: "warning", title: "INV-2026-0026 unpaid — Inland Logistics — $1,300", module: "accounts" },
];

// ─── JOB CARDS ────────────────────────────────
export const DEMO_JOB_CARDS: DemoJobCard[] = [
  { id: "jc1", job_card_number: "JC-2026-0012", truck_reg: "AGB 1092", job_type: "corrective", job_source: "driver_report", description: "Front left brake pad replacement — excessive wear reported", status: "in_progress", opened_at: "2026-03-19" },
  { id: "jc2", job_card_number: "JC-2026-0011", truck_reg: "AGB 1092", job_type: "corrective", job_source: "inspection", description: "Coolant leak — radiator hose cracked", status: "open", opened_at: "2026-03-19" },
  { id: "jc3", job_card_number: "JC-2026-0010", truck_reg: "ADZ 9799", job_type: "preventive", job_source: "scheduled", description: "250,000km service — oil, filters, brake inspection", status: "closed", opened_at: "2026-03-15" },
  { id: "jc4", job_card_number: "JC-2026-0009", truck_reg: "AEG 7336", job_type: "corrective", job_source: "driver_report", description: "Air compressor abnormal noise — investigated and repaired", status: "closed", opened_at: "2026-03-08" },
];

// ─── PARTS CATALOGUE ──────────────────────────
export const DEMO_PARTS: DemoPart[] = [
  { id: "p1", part_number: "BRK-001", name: "Brake Pad Set (Front)", category: "Brakes", current_stock: 8, min_stock_threshold: 4, weighted_avg_cost: 85.00, supplier_name: "AutoSpares Zimbabwe" },
  { id: "p2", part_number: "FLT-010", name: "Oil Filter", category: "Filters", current_stock: 15, min_stock_threshold: 10, weighted_avg_cost: 12.50, supplier_name: "AutoSpares Zimbabwe" },
  { id: "p3", part_number: "FLT-020", name: "Fuel Filter", category: "Filters", current_stock: 12, min_stock_threshold: 8, weighted_avg_cost: 18.00, supplier_name: "AutoSpares Zimbabwe" },
  { id: "p4", part_number: "FLT-030", name: "Air Filter", category: "Filters", current_stock: 6, min_stock_threshold: 6, weighted_avg_cost: 35.00, supplier_name: "Truck Parts Direct" },
  { id: "p5", part_number: "ENG-005", name: "Engine Oil 15W-40 (20L)", category: "Lubricants", current_stock: 3, min_stock_threshold: 5, weighted_avg_cost: 65.00, supplier_name: "Truck Parts Direct" },
  { id: "p6", part_number: "CLN-002", name: "Coolant Concentrate (5L)", category: "Coolant", current_stock: 7, min_stock_threshold: 4, weighted_avg_cost: 22.00, supplier_name: "AutoSpares Zimbabwe" },
  { id: "p7", part_number: "HSE-001", name: "Radiator Hose (Upper)", category: "Cooling", current_stock: 2, min_stock_threshold: 3, weighted_avg_cost: 45.00, supplier_name: "Truck Parts Direct" },
  { id: "p8", part_number: "TYR-001", name: "Tyre 315/80R22.5 (Steer)", category: "Tyres", current_stock: 4, min_stock_threshold: 4, weighted_avg_cost: 320.00, supplier_name: "Tyre City Harare" },
];
