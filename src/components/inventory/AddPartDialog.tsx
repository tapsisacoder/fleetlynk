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

export const AddPartDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    part_number: "", name: "", category: "", unit_of_measure: "each",
    min_stock_threshold: "0", reorder_quantity: "1", default_supplier_id: "",
    disposal_method: "repairable",
  });

  useEffect(() => {
    if (!open) return;
    supabase.from("suppliers").select("id, supplier_name").eq("is_deleted", false).order("supplier_name")
      .then(({ data }) => setSuppliers(data || []));
  }, [open]);

  const handleSave = async () => {
    if (!form.part_number || !form.name) { toast.error("Part number and name are required"); return; }
    setSaving(true);
    try {
      const { data: company } = await supabase.from("companies").select("id").single();
      if (!company) throw new Error("Company not found");

      const { error } = await supabase.from("parts_catalogue").insert({
        company_id: company.id,
        part_number: form.part_number, name: form.name,
        category: form.category || null, unit_of_measure: form.unit_of_measure,
        min_stock_threshold: Number(form.min_stock_threshold),
        reorder_quantity: Number(form.reorder_quantity),
        default_supplier_id: form.default_supplier_id || null,
        disposal_method: form.disposal_method,
      });
      if (error) throw error;

      toast.success(`Part ${form.part_number} added`);
      onCreated();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to add part");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Add Part</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Part Number <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input value={form.part_number} onChange={(e) => setForm((f) => ({ ...f, part_number: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Name <span className="text-[hsl(var(--red))]">*</span></Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Unit of Measure</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.unit_of_measure} onChange={(e) => setForm((f) => ({ ...f, unit_of_measure: e.target.value }))}>
                {["each","litre","kg","metre","set","pair","box"].map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Min Stock</Label>
              <Input type="number" value={form.min_stock_threshold} onChange={(e) => setForm((f) => ({ ...f, min_stock_threshold: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reorder Qty</Label>
              <Input type="number" value={form.reorder_quantity} onChange={(e) => setForm((f) => ({ ...f, reorder_quantity: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Default Supplier</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.default_supplier_id} onChange={(e) => setForm((f) => ({ ...f, default_supplier_id: e.target.value }))}>
                <option value="">None</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Disposal Method</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.disposal_method} onChange={(e) => setForm((f) => ({ ...f, disposal_method: e.target.value }))}>
                <option value="consumable">Consumable</option>
                <option value="repairable">Repairable</option>
                <option value="returnable">Returnable</option>
              </select>
            </div>
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
            {saving ? "Adding..." : "Add Part"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
