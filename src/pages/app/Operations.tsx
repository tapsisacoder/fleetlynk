import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, History, Download, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { downloadCsv } from "@/lib/exports";
import { useExportContext } from "@/hooks/use-export-context";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CreateTripDialog } from "@/components/operations/CreateTripDialog";
import { useDemoContext } from "@/demo/DemoContext";
import { DemoCreateTripDialog } from "@/demo/DemoCreateTripDialog";
import { DemoInvoiceDialog } from "@/demo/DemoInvoiceDialog";

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    confirmed: "bg-muted text-muted-foreground", loading: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]",
    in_transit: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]", at_border: "bg-purple-500/10 text-purple-600",
    offloading: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]", delivered: "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]",
    invoiced: "bg-accent/10 text-accent", closed: "bg-muted text-muted-foreground",
  };
  return colors[status] || "bg-muted text-muted-foreground";
};

const Operations = () => {
  const demo = useDemoContext();
  const [prodTrips, setProdTrips] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [loading, setLoading] = useState(!demo);
  const [invoiceTrip, setInvoiceTrip] = useState<string | null>(null);
  const exportCtx = useExportContext();

  useEffect(() => {
    if (demo) return;
    loadTrips();
  }, [demo]);

  const loadTrips = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("trips").select("*, clients(company_name), trucks(registration_number), employees(full_name)")
      .eq("is_deleted", false).order("created_at", { ascending: false }).limit(50);
    setProdTrips(data || []);
    setLoading(false);
  };

  const trips = demo
    ? [...demo.openTrips, ...demo.closedTrips].map(t => ({
        id: t.id, trip_number: t.trip_number, trip_type: t.trip_type, status: t.status,
        clients: { company_name: t.client_name }, trucks: { registration_number: t.truck_reg },
        employees: { full_name: t.driver_name }, origin: t.origin, destination: t.destination,
        distance_km: t.distance_km, rate_usd: t.rate_usd, created_at: t.created_at,
        total_costs_usd: t.total_costs_usd, margin_usd: t.margin_usd, trailer_reg: t.trailer_reg,
        _raw: t,
      }))
    : prodTrips;

  const filtered = trips.filter(t =>
    t.trip_number?.toLowerCase().includes(search.toLowerCase()) ||
    t.origin?.toLowerCase().includes(search.toLowerCase()) ||
    t.destination?.toLowerCase().includes(search.toLowerCase()) ||
    t.clients?.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCsv = async () => {
    const companyName = demo ? demo.company.company_name : await exportCtx.loadCompanyName();
    downloadCsv({
      companyName, reportName: "Trip Archive", generatedBy: exportCtx.generatedBy,
      columns: [
        { key: "trip_number", label: "Trip Number" }, { key: "trip_type", label: "Trip Type" },
        { key: "status", label: "Status" }, { key: "client", label: "Client" },
        { key: "truck", label: "Truck" }, { key: "driver", label: "Driver" },
        { key: "origin", label: "Origin" }, { key: "destination", label: "Destination" },
        { key: "rate_usd", label: "Rate (USD)", format: "decimal2" },
      ],
      data: filtered.map(t => ({
        trip_number: t.trip_number, trip_type: t.trip_type, status: t.status,
        client: t.clients?.company_name || "", truck: t.trucks?.registration_number || "",
        driver: t.employees?.full_name || "", origin: t.origin, destination: t.destination,
        rate_usd: t.rate_usd,
      })),
    }, "trip_archive.csv");
    toast.success("Trip archive exported");
  };

  const canRaiseInvoice = (trip: any) => {
    if (!demo) return false;
    const hasInvoice = demo.invoices.some(inv => inv.trip_number === trip.trip_number);
    return (trip.status === "confirmed" || trip.status === "in_transit" || trip.status === "delivered" || trip.status === "closed") && !hasInvoice;
  };

  return (
    <>
      <AppHeader title="Operations">
        <Button variant="outline" size="sm" className="mr-2" onClick={handleExportCsv}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" className="mr-2"><History className="h-4 w-4 mr-1" /> Trip History</Button>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowCreateTrip(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Trip
        </Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trips..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Trip #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Route</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Truck</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Driver</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Rate (USD)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Status</th>
                {demo && <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Actions</th>}
              </tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No trips found.</td></tr>
                ) : filtered.map((trip, i) => (
                  <motion.tr key={trip.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer transition-colors`}>
                    <td className="px-4 py-3 font-mono text-xs font-medium">{trip.trip_number}</td>
                    <td className="px-4 py-3 text-xs">{trip.clients?.company_name || "—"}</td>
                    <td className="px-4 py-3 text-xs">{trip.origin} → {trip.destination}</td>
                    <td className="px-4 py-3 font-mono text-xs">{trip.trucks?.registration_number || "—"}</td>
                    <td className="px-4 py-3 text-xs">{trip.employees?.full_name || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">${Number(trip.rate_usd).toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusColor(trip.status)}`}>{trip.status.replace(/_/g, " ")}</span></td>
                    {demo && (
                      <td className="px-4 py-3">
                        {canRaiseInvoice(trip) && (
                          <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => setInvoiceTrip(trip.trip_number)}>
                            <FileText className="h-3 w-3 mr-1" /> Raise Invoice
                          </Button>
                        )}
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {demo ? (
        <DemoCreateTripDialog open={showCreateTrip} onOpenChange={setShowCreateTrip} />
      ) : (
        <CreateTripDialog open={showCreateTrip} onOpenChange={setShowCreateTrip} onCreated={loadTrips} />
      )}
      {invoiceTrip && <DemoInvoiceDialog open={!!invoiceTrip} onOpenChange={() => setInvoiceTrip(null)} tripNumber={invoiceTrip} />}
    </>
  );
};

export default Operations;
