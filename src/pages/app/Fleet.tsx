import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { downloadCsv } from "@/lib/exports";
import { useExportContext } from "@/hooks/use-export-context";
import { toast } from "sonner";
import { AddVehicleDialog } from "@/components/fleet/AddVehicleDialog";
import { useDemoContext } from "@/demo/DemoContext";

const Fleet = () => {
  const demo = useDemoContext();
  const [prodTrucks, setProdTrucks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(!demo);
  const [tab, setTab] = useState<"trucks" | "trailers">("trucks");
  const [showAdd, setShowAdd] = useState(false);
  const exportCtx = useExportContext();

  useEffect(() => {
    if (demo) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("trucks").select("*, employees(full_name)").eq("is_deleted", false).order("registration_number");
      setProdTrucks(data || []);
      setLoading(false);
    };
    load();
  }, [demo]);

  const allVehicles = demo
    ? (tab === "trucks"
        ? demo.trucks.map(t => {
            const driver = demo.employees.find(e => e.id === t.default_driver_id);
            const trailer = demo.trailers.find(tr => tr.id === t.default_trailer_id);
            return { ...t, employees: { full_name: driver?.full_name || "" }, trailer_reg: trailer?.registration_number || "" };
          })
        : demo.trailers.map(tr => ({
            id: tr.id, registration_number: tr.registration_number, fleet_number: "",
            make: tr.make, model: tr.model, status: tr.status, vehicle_type: "trailer",
            employees: { full_name: "" }, fuel_tank_capacity_litres: 0, estimated_fuel_level_litres: 0,
            assigned_truck: demo.trucks.find(t => t.id === tr.assigned_truck_id)?.registration_number || "",
          }))
      )
    : prodTrucks.filter(t => tab === "trucks" ? t.vehicle_type !== "trailer" : t.vehicle_type === "trailer");

  const filtered = allVehicles.filter((t: any) =>
    t.registration_number?.toLowerCase().includes(search.toLowerCase()) ||
    t.make?.toLowerCase().includes(search.toLowerCase()) ||
    t.fleet_number?.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const c: Record<string, string> = { standby: "bg-muted text-muted-foreground", on_road: "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]", in_workshop: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]", off_road: "bg-[hsl(var(--red))]/10 text-[hsl(var(--red))]", disposed: "bg-muted text-muted-foreground line-through" };
    return c[status] || "bg-muted text-muted-foreground";
  };

  const fuelGauge = (level: number, capacity: number) => {
    if (!capacity) return null;
    const pct = Math.min(100, (level / capacity) * 100);
    const color = pct > 50 ? "bg-[hsl(var(--green))]" : pct > 25 ? "bg-[hsl(var(--amber))]" : "bg-[hsl(var(--red))]";
    return (
      <div className="w-24 h-3 bg-muted rounded-sm overflow-hidden relative">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
        <span className="absolute inset-0 text-[9px] font-mono text-foreground flex items-center justify-center">{Math.round(level)}L</span>
      </div>
    );
  };

  return (
    <>
      <AppHeader title="Fleet">
        <Button variant="outline" size="sm" className="mr-2" onClick={async () => {
          const companyName = demo ? demo.company.company_name : await exportCtx.loadCompanyName();
          downloadCsv({ companyName, reportName: "Vehicle Register", generatedBy: exportCtx.generatedBy,
            columns: [{ key: "registration_number", label: "Registration" }, { key: "fleet_number", label: "Fleet #" }, { key: "make", label: "Make" }, { key: "model", label: "Model" }, { key: "status", label: "Status" }],
            data: filtered.map(t => ({ ...t })),
          }, "vehicle_register.csv");
          toast.success("Vehicle register exported");
        }}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> Add Vehicle</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-1 mb-4">
          {(["trucks", "trailers"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{t === "trucks" ? "Trucks" : "Trailers"}</button>
          ))}
        </div>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr>
                <th className="text-left px-4 py-3 text-xs font-semibold">Registration</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Fleet #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Make / Model</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">{tab === "trucks" ? "Driver" : "Assigned Truck"}</th>
                {tab === "trucks" && <th className="text-left px-4 py-3 text-xs font-semibold">Fuel Level</th>}
                <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No vehicles found.</td></tr>
                : filtered.map((v: any, i: number) => (
                  <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                    <td className="px-4 py-3 font-mono text-xs font-medium">{v.registration_number}</td>
                    <td className="px-4 py-3 font-mono text-xs">{v.fleet_number || "—"}</td>
                    <td className="px-4 py-3 text-xs">{[v.make, v.model].filter(Boolean).join(" ") || "—"}</td>
                    <td className="px-4 py-3 text-xs">{tab === "trucks" ? (v.employees?.full_name || "—") : (v.assigned_truck || "—")}</td>
                    {tab === "trucks" && <td className="px-4 py-3">{fuelGauge(Number(v.estimated_fuel_level_litres), Number(v.fuel_tank_capacity_litres))}</td>}
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusBadge(v.status)}`}>{v.status.replace(/_/g, " ")}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {!demo && <AddVehicleDialog open={showAdd} onOpenChange={setShowAdd} onCreated={() => {}} />}
    </>
  );
};

export default Fleet;
