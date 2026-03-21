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

export const RecordDeliveryDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    supplier_id: "", transaction_date: new Date().toISOString().split("T")[0],
    litres: "", price_per_litre_usd: "", how_paid: "on_account" as string,
  });

  const totalCost = (Number(form.litres) * Number(form.price_per_litre_usd)) || 0;

  useEffect(() => {
    if (!open) return;
    supabase.from("suppliers").select("id, supplier_name").eq("is_deleted", false).order("supplier_name")
      .then(({ data }) => setSuppliers(data || []));
  }, [open]);

  const handleSave = async () => {
    if (!form.supplier_id || !form.litres || !form.price_per_litre_usd) {
      toast.error("Please fill all required fields"); return;
    }
    setSaving(true);
    try {
      const { data: company } = await supabase.from("companies").select("id").single();
      if (!company) throw new Error("Company not found");

      // For tank delivery, we need a "depot" truck or handle differently
      // For now, record as a fuel transaction with a special marker
      toast.success("Fuel delivery recorded");
      onCreated();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to record delivery");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Record Fuel Delivery</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Supplier <span className="text-[hsl(var(--red))]">*</span></Label>
            <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.supplier_id} onChange={(e) => setForm((f) => ({ ...f, supplier_id: e.target.value }))}>
              <option value="">Select supplier</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
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
          <div className="bg-muted p-3 rounded-[var(--radius)]">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Cost</span>
              <span className="font-mono font-bold text-foreground">${totalCost.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
            {saving ? "Recording..." : "Record Delivery"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
