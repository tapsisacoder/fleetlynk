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

export const AddVehicleDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    registration_number: "", fleet_number: "", vehicle_type: "horse",
    make: "", model: "", year: "", vin_number: "",
    fuel_tank_capacity_litres: "", km_per_litre_loaded: "", km_per_litre_unloaded: "",
    terrain_allowance_percent: "10", anomaly_threshold_percent: "15",
    default_driver_id: "", odometer_tracking: false,
  });

  useEffect(() => {
    if (!open) return;
    supabase.from("employees").select("id, full_name").eq("is_deleted", false).eq("is_driver", true).order("full_name")
      .then(({ data }) => setDrivers(data || []));
  }, [open]);

  const handleSave = async () => {
    if (!form.registration_number) { toast.error("Registration number is required"); return; }
    setSaving(true);
    try {
      const { data: company } = await supabase.from("companies").select("id").single();
      if (!company) throw new Error("Company not found");

      // Create cost centre first
      const { data: cc, error: ccErr } = await supabase.from("cost_centres").insert({
        company_id: company.id, name: form.registration_number, type: "vehicle",
      }).select("id").single();
      if (ccErr) throw ccErr;

      const { error } = await supabase.from("trucks").insert({
        company_id: company.id,
        registration_number: form.registration_number,
        fleet_number: form.fleet_number || null,
        vehicle_type: form.vehicle_type as any,
        make: form.make || null, model: form.model || null,
        year: form.year ? Number(form.year) : null,
        vin_number: form.vin_number || null,
        fuel_tank_capacity_litres: form.fuel_tank_capacity_litres ? Number(form.fuel_tank_capacity_litres) : null,
        km_per_litre_loaded: form.km_per_litre_loaded ? Number(form.km_per_litre_loaded) : null,
        km_per_litre_unloaded: form.km_per_litre_unloaded ? Number(form.km_per_litre_unloaded) : null,
        terrain_allowance_percent: Number(form.terrain_allowance_percent),
        anomaly_threshold_percent: Number(form.anomaly_threshold_percent),
        default_driver_id: form.default_driver_id || null,
        odometer_tracking: form.odometer_tracking,
        cost_centre_id: cc.id,
      });
      if (error) throw error;

      toast.success(`Vehicle ${form.registration_number} registered`);
      onCreated();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to register vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Register Vehicle</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Registration # <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input value={form.registration_number} onChange={(e) => setForm((f) => ({ ...f, registration_number: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Fleet #</Label>
              <Input value={form.fleet_number} onChange={(e) => setForm((f) => ({ ...f, fleet_number: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.vehicle_type} onChange={(e) => setForm((f) => ({ ...f, vehicle_type: e.target.value }))}>
                {["horse","rigid","interlink","flatbed","tanker","tipper","trailer"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Make</Label>
              <Input value={form.make} onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Model</Label>
              <Input value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Year</Label>
              <Input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tank Capacity (L)</Label>
              <Input type="number" value={form.fuel_tank_capacity_litres} onChange={(e) => setForm((f) => ({ ...f, fuel_tank_capacity_litres: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">VIN</Label>
              <Input value={form.vin_number} onChange={(e) => setForm((f) => ({ ...f, vin_number: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">km/L Loaded</Label>
              <Input type="number" step="0.1" value={form.km_per_litre_loaded} onChange={(e) => setForm((f) => ({ ...f, km_per_litre_loaded: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">km/L Unloaded</Label>
              <Input type="number" step="0.1" value={form.km_per_litre_unloaded} onChange={(e) => setForm((f) => ({ ...f, km_per_litre_unloaded: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Default Driver</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.default_driver_id} onChange={(e) => setForm((f) => ({ ...f, default_driver_id: e.target.value }))}>
                <option value="">None</option>
                {drivers.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Terrain Allowance %</Label>
              <Input type="number" value={form.terrain_allowance_percent} onChange={(e) => setForm((f) => ({ ...f, terrain_allowance_percent: e.target.value }))} />
            </div>
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
            {saving ? "Registering..." : "Register Vehicle"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
