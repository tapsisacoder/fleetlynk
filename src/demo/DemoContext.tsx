/**
 * LynkFleet Demo Context — State Management
 * Provides reactive mock data with actions for demo interactions.
 * DELETE this file (and entire /src/demo/ folder) to remove demo mode.
 */
import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react";
import * as D from "./data";

export interface DemoContextType {
  company: typeof D.DEMO_COMPANY;
  clients: D.DemoClient[];
  fuelSuppliers: D.DemoFuelSupplier[];
  employees: D.DemoEmployee[];
  closedTrips: D.DemoTrip[];
  jobCards: D.DemoJobCard[];
  parts: D.DemoPart[];
  trucks: D.DemoTruck[];
  trailers: D.DemoTrailer[];
  openTrips: D.DemoTrip[];
  invoices: D.DemoInvoice[];
  fuelTransactions: D.DemoFuelTransaction[];
  fuelAnomalies: D.DemoFuelAnomaly[];
  alerts: D.DemoAlert[];
  allTrips: D.DemoTrip[];
  moneyToCollect: number;
  confirmTrip: () => void;
  issueFuel: (truckReg: string, litres: number, supplierName: string, tripNumber: string) => void;
  resolveAnomaly: (anomalyId: string) => void;
  raiseInvoice: (tripNumber: string) => void;
  confirmInvoice: (invoiceNumber: string) => void;
  tripCreated: boolean;
  invoiceRaised: string | null;
  invoiceConfirmed: boolean;
}

const DemoContext = createContext<DemoContextType | null>(null);

export const useDemoContext = () => useContext(DemoContext);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [trucks, setTrucks] = useState<D.DemoTruck[]>(D.DEMO_TRUCKS.map(t => ({ ...t })));
  const [trailers, setTrailers] = useState<D.DemoTrailer[]>(D.DEMO_TRAILERS.map(t => ({ ...t })));
  const [openTrips, setOpenTrips] = useState<D.DemoTrip[]>(D.DEMO_OPEN_TRIPS.map(t => ({ ...t })));
  const [invoices, setInvoices] = useState<D.DemoInvoice[]>(D.DEMO_INVOICES.map(i => ({ ...i })));
  const [fuelTransactions, setFuelTransactions] = useState<D.DemoFuelTransaction[]>(D.DEMO_FUEL_TRANSACTIONS.map(f => ({ ...f })));
  const [fuelAnomalies, setFuelAnomalies] = useState<D.DemoFuelAnomaly[]>(D.DEMO_FUEL_ANOMALIES.map(a => ({ ...a })));
  const [alerts, setAlerts] = useState<D.DemoAlert[]>(D.DEMO_ALERTS.map(a => ({ ...a })));
  const [tripCreated, setTripCreated] = useState(false);
  const [invoiceRaised, setInvoiceRaised] = useState<string | null>(null);
  const [invoiceConfirmed, setInvoiceConfirmed] = useState(false);

  const allTrips = useMemo(() => [...D.DEMO_CLOSED_TRIPS, ...openTrips], [openTrips]);
  const moneyToCollect = useMemo(() => invoices.reduce((s, i) => s + i.amount_outstanding_usd, 0), [invoices]);

  const confirmTrip = useCallback(() => {
    const newTrip: D.DemoTrip = {
      id: "trip29", trip_number: "TRP-2026-0029", origin: "Beira", destination: "Harare",
      distance_km: 600, trip_type: "Import", client_id: "c3",
      client_name: "Inland Logistics (Pvt) Ltd", truck_id: "t5",
      truck_reg: "AEU 1313", trailer_reg: "AGL 2339", driver_id: "e5",
      driver_name: "Shame Mutasa", rate_usd: 1500, total_costs_usd: 0,
      margin_usd: 1500, status: "confirmed", created_at: "2026-03-23",
    };
    setOpenTrips(prev => [newTrip, ...prev]);
    setTrucks(prev => prev.map(t => t.id === "t5" ? { ...t, status: "on_road" } : t));
    setTrailers(prev => prev.map(t => t.id === "tr5" ? { ...t, status: "on_road" } : t));
    setTripCreated(true);
  }, []);

  const issueFuel = useCallback((truckReg: string, litres: number, supplierName: string, tripNumber: string) => {
    const supplier = D.DEMO_FUEL_SUPPLIERS.find(s => s.supplier_name === supplierName);
    const ppl = supplier?.price_per_litre || 2.05;
    const cost = Math.round(litres * ppl * 100) / 100;
    const isAnomaly = tripNumber === "TRP-2026-0028" && supplierName === "SOM Petroleum";
    const truck = D.DEMO_TRUCKS.find(t => t.registration_number === truckReg);
    const driver = truck ? D.DEMO_EMPLOYEES.find(e => e.id === truck.default_driver_id) : null;

    const tx: D.DemoFuelTransaction = {
      id: `ft-${Date.now()}`, date: "2026-03-23", truck_reg: truckReg,
      driver_name: driver?.full_name || "", trip_number: tripNumber,
      supplier_name: supplierName, litres, price_per_litre: ppl,
      total_cost: cost, anomaly_flagged: isAnomaly,
    };
    setFuelTransactions(prev => [tx, ...prev]);
    setTrucks(prev => prev.map(t =>
      t.registration_number === truckReg
        ? { ...t, estimated_fuel_level_litres: t.estimated_fuel_level_litres + litres }
        : t
    ));
    setOpenTrips(prev => prev.map(trip =>
      trip.trip_number === tripNumber
        ? { ...trip, total_costs_usd: trip.total_costs_usd + cost, fuel_cost_usd: (trip.fuel_cost_usd || 0) + cost, margin_usd: trip.rate_usd - (trip.total_costs_usd + cost) }
        : trip
    ));
    if (isAnomaly) {
      setFuelAnomalies(prev => [{
        id: "ano4", anomaly_number: "ANO-2026-0004", date: "2026-03-23",
        trip_number: "TRP-2026-0028", truck_reg: "ADZ 9799",
        driver_name: "John Moyo", route: "Selous to Beira",
        variance_percent: 61, status: "open",
      }, ...prev]);
      setAlerts(prev => [{
        id: "al-anomaly", severity: "critical",
        title: "Fuel anomaly — TRP-2026-0028 — ADZ 9799 — John Moyo — +61% variance",
        module: "fuel",
      }, ...prev]);
    }
  }, []);

  const resolveAnomaly = useCallback((anomalyId: string) => {
    setFuelAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, status: "resolved" } : a));
    setAlerts(prev => prev.filter(a => a.id !== "al-anomaly"));
  }, []);

  const raiseInvoice = useCallback((tripNumber: string) => {
    const trip = [...D.DEMO_CLOSED_TRIPS, ...openTrips].find(t => t.trip_number === tripNumber);
    if (!trip) return;
    const invNum = `INV-${tripNumber.replace("TRP-", "")}`;
    const inv: D.DemoInvoice = {
      id: `inv-${tripNumber}`, invoice_number: invNum, trip_number: tripNumber,
      client_name: trip.client_name, client_id: trip.client_id,
      total_usd: trip.rate_usd, amount_paid_usd: 0,
      amount_outstanding_usd: trip.rate_usd, status: "draft",
      invoice_date: "2026-03-23", due_date: "",
    };
    setInvoices(prev => [inv, ...prev]);
    setInvoiceRaised(invNum);
  }, [openTrips]);

  const confirmInvoice = useCallback((invoiceNumber: string) => {
    setInvoices(prev => prev.map(inv =>
      inv.invoice_number === invoiceNumber ? { ...inv, status: "confirmed" } : inv
    ));
    setInvoiceConfirmed(true);
  }, []);

  const value = useMemo((): DemoContextType => ({
    company: D.DEMO_COMPANY, clients: D.DEMO_CLIENTS,
    fuelSuppliers: D.DEMO_FUEL_SUPPLIERS, employees: D.DEMO_EMPLOYEES,
    closedTrips: D.DEMO_CLOSED_TRIPS, jobCards: D.DEMO_JOB_CARDS,
    parts: D.DEMO_PARTS, trucks, trailers, openTrips, invoices,
    fuelTransactions, fuelAnomalies, alerts, allTrips, moneyToCollect,
    confirmTrip, issueFuel, resolveAnomaly, raiseInvoice, confirmInvoice,
    tripCreated, invoiceRaised, invoiceConfirmed,
  }), [trucks, trailers, openTrips, invoices, fuelTransactions, fuelAnomalies, alerts, allTrips, moneyToCollect, confirmTrip, issueFuel, resolveAnomaly, raiseInvoice, confirmInvoice, tripCreated, invoiceRaised, invoiceConfirmed]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};
