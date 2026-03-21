import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export const IssueFuelDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    truck_id: "", transaction_date: new Date().toISOString().split("T")[0],
    litres: "", price_per_litre_usd: "", how_paid: "cash" as string,
    trip_id: "", non_trip_purpose: "" as string,
  });

  const totalCost = (Number(form.litres) * Number(form.price_per_litre_usd)) || 0;

  useEffect(() => {
    if (!open) return;
    Promise.all([
      supabase.from("trucks").select("id, registration_number").eq("is_deleted", false).neq("vehicle_type", "trailer").order("registration_number"),
      supabase.from("trips").select("id, trip_number").eq("is_deleted", false).neq("status", "closed").order("created_at", { ascending: false }),
    ]).then(([t, tr]) => {
      setTrucks(t.data || []);
      setTrips(tr.data || []);
    });
  }, [open]);

  const handleSave = async () => {
    if (!form.truck_id || !form.litres || !form.price_per_litre_usd) {
      toast.error("Please fill all required fields"); return;
    }
    setSaving(true);
    try {
      const { data: company } = await supabase.from("companies").select("id").single();
      if (!company) throw new Error("Company not found");

      const { error } = await supabase.from("fuel_transactions").insert({
        company_id: company.id,
        truck_id: form.truck_id,
        transaction_date: form.transaction_date,
        litres: Number(form.litres),
        price_per_litre_usd: Number(form.price_per_litre_usd),
        total_cost_usd: totalCost,
        how_paid: form.how_paid as any,
        trip_id: form.trip_id || null,
        non_trip_purpose: form.non_trip_purpose ? form.non_trip_purpose as any : null,
        transaction_type: "issuance" as any,
      });
      if (error) throw error;

      // Update truck estimated fuel level
      const { data: truck } = await supabase.from("trucks").select("estimated_fuel_level_litres").eq("id", form.truck_id).single();
      if (truck) {
        const newLevel = Math.max(0, Number(truck.estimated_fuel_level_litres) - Number(form.litres));
        await supabase.from("trucks").update({ estimated_fuel_level_litres: newLevel }).eq("id", form.truck_id);
      }

      toast.success("Fuel issued successfully");
      onCreated();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to issue fuel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Issue Fuel</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Truck <span className="text-[hsl(var(--red))]">*</span></Label>
            <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.truck_id} onChange={(e) => setForm((f) => ({ ...f, truck_id: e.target.value }))}>
              <option value="">Select truck</option>
              {trucks.map((t) => <option key={t.id} value={t.id}>{t.registration_number}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={form.transaction_date} onChange={(e) => setForm((f) => ({ ...f, transaction_date: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Litres <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input type="number" value={form.litres} onChange={(e) => setForm((f) => ({ ...f, litres: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Price/Litre (USD) <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input type="number" step="0.01" value={form.price_per_litre_usd} onChange={(e) => setForm((f) => ({ ...f, price_per_litre_usd: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">How Paid</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.how_paid} onChange={(e) => setForm((f) => ({ ...f, how_paid: e.target.value }))}>
                {["cash","bank_transfer","eft","ecocash","on_account"].map((h) => <option key={h} value={h}>{h.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Trip Number</Label>
            <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.trip_id} onChange={(e) => setForm((f) => ({ ...f, trip_id: e.target.value }))}>
              <option value="">No trip (non-trip)</option>
              {trips.map((t) => <option key={t.id} value={t.id}>{t.trip_number}</option>)}
            </select>
          </div>
          {!form.trip_id && (
            <div className="space-y-1.5">
              <Label className="text-xs">Purpose</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.non_trip_purpose} onChange={(e) => setForm((f) => ({ ...f, non_trip_purpose: e.target.value }))}>
                {["yard_movement","maintenance_run","repositioning","standby","other"].map((p) => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          )}
          {/* Auto-calculated total */}
          <div className="bg-muted p-3 rounded-[var(--radius)]">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Cost</span>
              <span className="font-mono font-bold text-foreground">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
            {saving ? "Issuing..." : "Issue Fuel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
