import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { AddEmployeeDialog } from "@/components/hr/AddEmployeeDialog";

const HR = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [payrollPeriods, setPayrollPeriods] = useState<any[]>([]);
  const [disciplinary, setDisciplinary] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"employees" | "payroll" | "disciplinary">("employees");
  const [showAdd, setShowAdd] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [empRes, payRes, discRes] = await Promise.all([
      supabase.from("employees").select("*").eq("is_deleted", false).order("full_name"),
      supabase.from("payroll_periods").select("*").order("start_date", { ascending: false }).limit(20),
      supabase.from("disciplinary_records").select("*, employees(full_name)").order("incident_date", { ascending: false }).limit(50),
    ]);
    setEmployees(empRes.data || []);
    setPayrollPeriods(payRes.data || []);
    setDisciplinary(discRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = employees.filter((e) => e.full_name?.toLowerCase().includes(search.toLowerCase()) || e.job_title?.toLowerCase().includes(search.toLowerCase()) || e.department?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <AppHeader title="HR">
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> Add Employee</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-1 mb-4">
          {([["employees", "Employees"], ["payroll", "Payroll"], ["disciplinary", "Disciplinary"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{label}</button>
          ))}
        </div>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {tab === "employees" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Job Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Driver</th>
                </tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                  : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No employees found.</td></tr>
                  : filtered.map((emp, i) => (
                    <motion.tr key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                      <td className="px-4 py-3 text-xs font-medium">{emp.full_name}</td>
                      <td className="px-4 py-3 text-xs">{emp.job_title || "—"}</td>
                      <td className="px-4 py-3 text-xs">{emp.department || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{emp.phone || "—"}</td>
                      <td className="px-4 py-3 text-xs capitalize">{emp.employment_type}</td>
                      <td className="px-4 py-3">{emp.is_driver && <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]">Driver</span>}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "payroll" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Period</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Start Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">End Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                </tr></thead>
                <tbody>
                  {payrollPeriods.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No payroll periods found.</td></tr>
                  : payrollPeriods.map((pp, i) => (
                    <motion.tr key={pp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                      <td className="px-4 py-3 text-xs font-medium">{pp.period_name}</td>
                      <td className="px-4 py-3 text-xs">{new Date(pp.start_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs">{new Date(pp.end_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${pp.is_locked ? "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]" : "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]"}`}>{pp.is_locked ? "Locked" : "Open"}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "disciplinary" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Employee</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Action Taken</th>
                </tr></thead>
                <tbody>
                  {disciplinary.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No disciplinary records found.</td></tr>
                  : disciplinary.map((dr, i) => (
                    <motion.tr key={dr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                      <td className="px-4 py-3 text-xs font-medium">{dr.employees?.full_name || "—"}</td>
                      <td className="px-4 py-3 text-xs capitalize">{dr.category}</td>
                      <td className="px-4 py-3 text-xs truncate max-w-[200px]">{dr.description}</td>
                      <td className="px-4 py-3 text-xs">{new Date(dr.incident_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs">{dr.action_taken || "—"}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <AddEmployeeDialog open={showAdd} onOpenChange={setShowAdd} onCreated={loadData} />
    </>
  );
};

export default HR;
