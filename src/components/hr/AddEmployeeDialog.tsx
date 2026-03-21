import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export const AddEmployeeDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "", id_number: "", phone: "", job_title: "",
    department: "", employment_type: "permanent", is_driver: false,
    start_date: new Date().toISOString().split("T")[0],
    basic_salary_usd: "", bank_name: "", bank_account_number: "",
  });

  const handleSave = async () => {
    if (!form.full_name) { toast.error("Full name is required"); return; }
    setSaving(true);
    try {
      const { data: company } = await supabase.from("companies").select("id").single();
      if (!company) throw new Error("Company not found");

      const { error } = await supabase.from("employees").insert({
        company_id: company.id,
        full_name: form.full_name,
        id_number: form.id_number || null,
        phone: form.phone || null,
        job_title: form.job_title || null,
        department: form.department || null,
        employment_type: form.employment_type,
        is_driver: form.is_driver,
        start_date: form.start_date || null,
        basic_salary_usd: form.basic_salary_usd ? Number(form.basic_salary_usd) : null,
        bank_name: form.bank_name || null,
        bank_account_number: form.bank_account_number || null,
      });
      if (error) throw error;

      toast.success(`Employee ${form.full_name} added`);
      onCreated();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to add employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Full Name <span className="text-[hsl(var(--red))]">*</span></Label>
            <Input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">ID Number</Label>
              <Input value={form.id_number} onChange={(e) => setForm((f) => ({ ...f, id_number: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Job Title</Label>
              <Input value={form.job_title} onChange={(e) => setForm((f) => ({ ...f, job_title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Input value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Employment Type</Label>
              <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-[var(--radius)]" value={form.employment_type} onChange={(e) => setForm((f) => ({ ...f, employment_type: e.target.value }))}>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_driver" checked={form.is_driver} onChange={(e) => setForm((f) => ({ ...f, is_driver: e.target.checked }))} className="rounded border-input" />
            <Label htmlFor="is_driver" className="text-xs">This employee is a driver</Label>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Basic Salary (USD)</Label>
            <Input type="number" value={form.basic_salary_usd} onChange={(e) => setForm((f) => ({ ...f, basic_salary_usd: e.target.value }))} />
          </div>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave} disabled={saving}>
            {saving ? "Adding..." : "Add Employee"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
