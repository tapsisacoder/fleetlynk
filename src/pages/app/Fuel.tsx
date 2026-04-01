import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Droplets, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { IssueFuelDialog } from "@/components/fuel/IssueFuelDialog";
import { RecordDeliveryDialog } from "@/components/fuel/RecordDeliveryDialog";
import { useDemoContext } from "@/demo/DemoContext";
import { DemoIssueFuelDialog } from "@/demo/DemoIssueFuelDialog";
import { toast } from "sonner";

const FuelModule = () => {
  const demo = useDemoContext();
  const [prodTrucks, setProdTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(!demo);
  const [showIssue, setShowIssue] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [tab, setTab] = useState<"overview" | "history" | "anomalies">("overview");

  useEffect(() => {
    if (demo) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("trucks")
        .select("id, registration_number, fleet_number, estimated_fuel_level_litres, fuel_tank_capacity_litres, status")
        .eq("is_deleted", false).neq("vehicle_type", "trailer").order("registration_number");
      setProdTrucks(data || []);
      setLoading(false);
    };
    load();
  }, [demo]);

  const trucks = demo ? demo.trucks : prodTrucks;

  const fuelBar = (level: number, capacity: number) => {
    if (!capacity) return <span className="text-xs text-muted-foreground">N/A</span>;
    const pct = Math.min(100, Math.max(0, (level / capacity) * 100));
    const color = pct > 50 ? "bg-[hsl(var(--green))]" : pct > 25 ? "bg-[hsl(var(--amber))]" : "bg-[hsl(var(--red))]";
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-4 bg-muted rounded-sm overflow-hidden relative min-w-[120px]">
          <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
          <span className="absolute inset-0 text-[10px] font-mono text-foreground flex items-center justify-center">{Math.round(level)}L / {Math.round(capacity)}L</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono w-10 text-right">{Math.round(pct)}%</span>
      </div>
    );
  };

  return (
    <>
      <AppHeader title="Fuel">
        <Button variant="outline" size="sm" className="mr-2" onClick={() => setShowDelivery(true)}><Droplets className="h-4 w-4 mr-1" /> Record Delivery</Button>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowIssue(true)}><Plus className="h-4 w-4 mr-1" /> Issue Fuel</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-1 mb-4">
          {([["overview", "Fleet Fuel Overview"], ["history", "Fuel History"], ["anomalies", "Anomaly Report"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{label}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="bg-card border border-border">
            <div className="p-4 border-b border-border"><h2 className="text-sm font-semibold">Estimated Fleet Fuel Levels at beginning/end of trip</h2></div>
            <div className="divide-y divide-border">
              {loading ? <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
              : trucks.map((truck: any, i: number) => (
                <motion.div key={truck.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 min-w-[180px]">
                    <span className="font-mono text-xs font-medium">{truck.registration_number}</span>
                    {truck.fleet_number && <span className="text-xs text-muted-foreground">({truck.fleet_number})</span>}
                  </div>
                  <div className="flex-1 max-w-md">{fuelBar(Number(truck.estimated_fuel_level_litres), Number(truck.fuel_tank_capacity_litres))}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {tab === "history" && demo && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Truck</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Driver</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Trip</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Litres</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Rate</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Flag</th>
                </tr></thead>
                <tbody>
                  {demo.fuelTransactions.map((tx, i) => (
                    <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40`}>
                      <td className="px-4 py-3 text-xs">{new Date(tx.date).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-3 font-mono text-xs">{tx.truck_reg}</td>
                      <td className="px-4 py-3 text-xs">{tx.driver_name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{tx.trip_number}</td>
                      <td className="px-4 py-3 text-xs">{tx.supplier_name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{tx.litres}L</td>
                      <td className="px-4 py-3 font-mono text-xs">${tx.price_per_litre.toFixed(2)}/L</td>
                      <td className="px-4 py-3 font-mono text-xs font-medium">${tx.total_cost.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {tx.anomaly_flagged && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[hsl(var(--red))]/10 text-[hsl(var(--red))]">ANOMALY</span>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "history" && !demo && (
          <div className="bg-card border border-border p-8 text-center text-muted-foreground text-sm">
            Connect to database to view fuel history.
          </div>
        )}

        {tab === "anomalies" && demo && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Anomaly #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Trip</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Truck</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Driver</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Route</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Variance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Action</th>
                </tr></thead>
                <tbody>
                  {demo.fuelAnomalies.map((a, i) => (
                    <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${a.status === "open" ? "bg-[hsl(var(--red))]/5" : i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40`}>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{a.anomaly_number}</td>
                      <td className="px-4 py-3 text-xs">{new Date(a.date).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-3 font-mono text-xs">{a.trip_number}</td>
                      <td className="px-4 py-3 font-mono text-xs">{a.truck_reg}</td>
                      <td className="px-4 py-3 text-xs">{a.driver_name}</td>
                      <td className="px-4 py-3 text-xs">{a.route}</td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-[hsl(var(--red))]">+{a.variance_percent}%</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${a.status === "open" ? "bg-[hsl(var(--red))]/10 text-[hsl(var(--red))]" : "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]"}`}>
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {a.status === "open" && (
                          <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => { demo.resolveAnomaly(a.id); toast.success("Anomaly resolved"); }}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "anomalies" && !demo && (
          <div className="bg-card border border-border p-8 text-center text-muted-foreground text-sm">
            Connect to database to view anomaly reports.
          </div>
        )}
      </div>
      {demo ? (
        <DemoIssueFuelDialog open={showIssue} onOpenChange={setShowIssue} />
      ) : (
        <IssueFuelDialog open={showIssue} onOpenChange={setShowIssue} onCreated={() => {}} />
      )}
      {!demo && <RecordDeliveryDialog open={showDelivery} onOpenChange={setShowDelivery} onCreated={() => {}} />}
    </>
  );
};

export default FuelModule;
