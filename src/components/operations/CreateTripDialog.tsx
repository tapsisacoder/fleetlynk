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

export const CreateTripDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [clients, setClients] = useState<any[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    client_id: "", rate_usd: "", truck_id: "", trailer_id: "", driver_id: "",
    origin: "", destination: "", distance_km: "", load_status: "loaded",
    trip_type: "local", load_type: "bulk", tonnage: "", package_type: "",
    number_of_packages: "", is_cross_border: false, border_post: "",
    trip_bookout_usd: "", notes: "",
  });

  useEffect(() => {
    if (!open) return;
    Promise.all([
      supabase.from("clients").select("id, company_name").eq("is_deleted", false).order("company_name"),
      supabase.from("trucks").select("id, registration_number, default_driver_id, default_trailer_id, vehicle_type").eq("is_deleted", false).neq("vehicle_type", "trailer").order("registration_number"),
      supabase.from("employees").select("id, full_name").eq("is_deleted", false).eq("is_driver", true).order("full_name"),
      supabase.from("trucks").select("id, registration_number").eq("is_deleted", false).eq("vehicle_type", "trailer").order("registration_number"),
    ]).then(([c, t, d, tr]) => {
      setClients(c.data || []);
      setTrucks(t.data || []);
      setDrivers(d.data || []);
      setTrailers(tr.data || []);
    });
  }, [open]);

  const handleTruckChange = (truckId: string) => {
    const truck = trucks.find((t) => t.id === truckId);
    setForm((f) => ({
      ...f,
      truck_id: truckId,
      driver_id: truck?.default_driver_id || f.driver_id,
      trailer_id: truck?.default_trailer_id || f.trailer_id,
    }));
  };

  const handleTripTypeChange = (tripType: string) => {
    const isCross = tripType === "export" || tripType === "import";
    setForm((f) => ({ ...f, trip_type: tripType, is_cross_border: isCross }));
  };

  const handleSave = async () => {
    if (!form.client_id || !form.truck_id || !form.driver_id || !form.origin || !form.destination || !form.rate_usd || !form.distance_km) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      // Get company and generate trip number
      const { data: company } = await supabase.from("companies").select("id, trip_prefix, trip_next_sequence").single();
      if (!company) throw new Error("Company not found");

      const year = new Date().getFullYear();
      const seq = String(company.trip_next_sequence).padStart(4, "0");
      const tripNumber = `${company.trip_prefix}-${year}-${seq}`;

      const { error } = await supabase.from("trips").insert({
        company_id: company.id,
        trip_number: tripNumber,
        client_id: form.client_id,
        truck_id: form.truck_id,
        trailer_id: form.trailer_id || null,
        driver_id: form.driver_id,
        origin: form.origin,
        destination: form.destination,
        distance_km: Number(form.distance_km),
        rate_usd: Number(form.rate_usd),
        load_status: form.load_status as any,
        trip_type: form.trip_type as any,
        load_type: form.load_type as any,
        tonnage: form.tonnage ? Number(form.tonnage) : null,
        package_type: form.package_type || null,
        number_of_packages: form.number_of_packages ? Number(form.number_of_packages) : null,
        is_cross_border: form.is_cross_border,
        border_post: form.border_post || null,
        trip_bookout_usd: form.trip_bookout_usd ? Number(form.trip_bookout_usd) : null,
        notes: form.notes || null,
        status: "confirmed" as any,
      });

      if (error) throw error;

      // Increment sequence
      await supabase.from("companies").update({ trip_next_sequence: company.trip_next_sequence + 1 }).eq("id", company.id);

      // Update truck status to on_road
      await supabase.from("trucks").update({ status: "on_road" as any }).eq("id", form.truck_id);

      toast.success(`Trip ${tripNumber} created`);
      onCreated();
      onOpenChange(false);
      setForm({
        client_id: "", rate_usd: "", truck_id: "", trailer_id: "", driver_id: "",
        origin: "", destination: "", distance_km: "", load_status: "loaded",
        trip_type: "local", load_type: "bulk", tonnage: "", package_type: "",
        number_of_packages: "", is_cross_border: false, border_post: "",
        trip_bookout_usd: "", notes: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to create trip");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Trip</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Row 1: Client & Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Client <span className="text-[hsl(var(--red))]">*</span></Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.client_id} onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}>
                <option value="">Select client</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rate (USD) <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input type="number" placeholder="0.00" value={form.rate_usd} onChange={(e) => setForm((f) => ({ ...f, rate_usd: e.target.value }))} />
            </div>
          </div>

          {/* Row 2: Truck & Trailer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Truck <span className="text-[hsl(var(--red))]">*</span></Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.truck_id} onChange={(e) => handleTruckChange(e.target.value)}>
                <option value="">Select truck</option>
                {trucks.map((t) => <option key={t.id} value={t.id}>{t.registration_number}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Trailer</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.trailer_id} onChange={(e) => setForm((f) => ({ ...f, trailer_id: e.target.value }))}>
                <option value="">Select trailer</option>
                {trailers.map((t) => <option key={t.id} value={t.id}>{t.registration_number}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: Driver */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Driver <span className="text-[hsl(var(--red))]">*</span></Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.driver_id} onChange={(e) => setForm((f) => ({ ...f, driver_id: e.target.value }))}>
                <option value="">Select driver</option>
                {drivers.map((d) => <option key={d.id} value={d.id}>{d.full_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Distance (km) <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input type="number" placeholder="0" value={form.distance_km} onChange={(e) => setForm((f) => ({ ...f, distance_km: e.target.value }))} />
            </div>
          </div>

          {/* Row 4: Origin & Destination */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Origin <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input placeholder="From" value={form.origin} onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Destination <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input placeholder="To" value={form.destination} onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))} />
            </div>
          </div>

          {/* Row 5: Load Status & Trip Type */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Load Status</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.load_status} onChange={(e) => setForm((f) => ({ ...f, load_status: e.target.value }))}>
                <option value="loaded">Loaded</option>
                <option value="empty">Empty</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Trip Type</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.trip_type} onChange={(e) => handleTripTypeChange(e.target.value)}>
                <option value="local">Local</option>
                <option value="export">Export</option>
                <option value="import">Import</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Load Type</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.load_type} onChange={(e) => setForm((f) => ({ ...f, load_type: e.target.value }))}>
                <option value="bulk">Bulk</option>
                <option value="containers">Containers</option>
                <option value="bags">Bags</option>
                <option value="pallets">Pallets</option>
                <option value="breakbulk">Breakbulk</option>
                <option value="livestock">Livestock</option>
                <option value="hazardous">Hazardous</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 6: Tonnage, Package Type, Number of Packages */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Tonnage</Label>
              <Input type="number" placeholder="0" value={form.tonnage} onChange={(e) => setForm((f) => ({ ...f, tonnage: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Package Type</Label>
              <Input placeholder="Optional" value={form.package_type} onChange={(e) => setForm((f) => ({ ...f, package_type: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">No. of Packages</Label>
              <Input type="number" placeholder="0" value={form.number_of_packages} onChange={(e) => setForm((f) => ({ ...f, number_of_packages: e.target.value }))} />
            </div>
          </div>

          {/* Cross-Border Fields */}
          {form.is_cross_border && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Border Post <span className="text-[hsl(var(--red))]">*</span></Label>
                <Input placeholder="Border post name" value={form.border_post} onChange={(e) => setForm((f) => ({ ...f, border_post: e.target.value }))} />
              </div>
            </div>
          )}

          {/* Row 7: Trip Bookout & Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Trip Bookout (USD)</Label>
              <Input type="number" placeholder="Cash advance" value={form.trip_bookout_usd} onChange={(e) => setForm((f) => ({ ...f, trip_bookout_usd: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes</Label>
              <Input placeholder="Optional notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>

          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
            {saving ? "Creating..." : "Create Trip"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
