import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Droplets } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { IssueFuelDialog } from "@/components/fuel/IssueFuelDialog";
import { RecordDeliveryDialog } from "@/components/fuel/RecordDeliveryDialog";

const FuelModule = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIssue, setShowIssue] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const loadTrucks = async () => {
    setLoading(true);
    const { data } = await supabase.from("trucks")
      .select("id, registration_number, fleet_number, estimated_fuel_level_litres, fuel_tank_capacity_litres, status")
      .eq("is_deleted", false).neq("vehicle_type", "trailer").order("registration_number");
    setTrucks(data || []);
    setLoading(false);
  };

  useEffect(() => { loadTrucks(); }, []);

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
        <span className="text-[10px] text-muted-foreground font-mono italic">ESTIMATED</span>
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
        <div className="bg-card border border-border">
          <div className="p-4 border-b border-border"><h2 className="text-sm font-semibold">Fleet Fuel Overview</h2></div>
          <div className="divide-y divide-border">
            {loading ? <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
            : trucks.length === 0 ? <div className="p-8 text-center text-muted-foreground text-sm">No trucks registered.</div>
            : trucks.map((truck, i) => (
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
      </div>
      <IssueFuelDialog open={showIssue} onOpenChange={setShowIssue} onCreated={loadTrucks} />
      <RecordDeliveryDialog open={showDelivery} onOpenChange={setShowDelivery} onCreated={loadTrucks} />
    </>
  );
};

export default FuelModule;
