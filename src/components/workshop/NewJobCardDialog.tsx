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

export const NewJobCardDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    truck_id: "", job_type: "repair", job_source: "planned",
    assigned_to: "inhouse", description: "",
  });

  useEffect(() => {
    if (!open) return;
    supabase.from("trucks").select("id, registration_number").eq("is_deleted", false).order("registration_number")
      .then(({ data }) => setTrucks(data || []));
  }, [open]);

  const handleSave = async () => {
    if (!form.truck_id) { toast.error("Vehicle is required"); return; }
    setSaving(true);
    try {
      const { data: company } = await supabase.from("companies").select("id, jc_prefix, jc_next_sequence").single();
      if (!company) throw new Error("Company not found");

      const year = new Date().getFullYear();
      const seq = String(company.jc_next_sequence).padStart(4, "0");
      const jcNumber = `${company.jc_prefix}-${year}-${seq}`;

      const { error } = await supabase.from("job_cards").insert({
        company_id: company.id,
        job_card_number: jcNumber,
        truck_id: form.truck_id,
        job_type: form.job_type as any,
        job_source: form.job_source as any,
        assigned_to: form.assigned_to as any,
        description: form.description || null,
      });
      if (error) throw error;

      await supabase.from("companies").update({ jc_next_sequence: company.jc_next_sequence + 1 }).eq("id", company.id);

      // Update truck status to in_workshop
      await supabase.from("trucks").update({ status: "in_workshop" as any }).eq("id", form.truck_id);

      toast.success(`Job card ${jcNumber} created`);
      onCreated();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create job card");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New Job Card</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Vehicle <span className="text-[hsl(var(--red))]">*</span></Label>
            <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.truck_id} onChange={(e) => setForm((f) => ({ ...f, truck_id: e.target.value }))}>
              <option value="">Select vehicle</option>
              {trucks.map((t) => <option key={t.id} value={t.id}>{t.registration_number}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Job Type</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.job_type} onChange={(e) => setForm((f) => ({ ...f, job_type: e.target.value }))}>
                {["routine_service","repair","inspection","accident_repair"].map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Job Source</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.job_source} onChange={(e) => setForm((f) => ({ ...f, job_source: e.target.value }))}>
                {["planned","breakdown","vehicle_inspection_failure","driver_reported","workshop_inspection"].map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Assigned To</Label>
            <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.assigned_to} onChange={(e) => setForm((f) => ({ ...f, assigned_to: e.target.value }))}>
              <option value="inhouse">In-House</option>
              <option value="sublet">Sublet</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input placeholder="Job description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
            {saving ? "Creating..." : "Create Job Card"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
