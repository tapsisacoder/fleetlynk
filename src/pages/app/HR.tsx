import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { AddEmployeeDialog } from "@/components/hr/AddEmployeeDialog";
import { useDemoContext } from "@/demo/DemoContext";

const HR = () => {
  const demo = useDemoContext();
  const [prodEmployees, setProdEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(!demo);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (demo) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("employees").select("*").eq("is_deleted", false).order("full_name");
      setProdEmployees(data || []);
      setLoading(false);
    };
    load();
  }, [demo]);

  const employees = demo ? demo.employees : prodEmployees;
  const filtered = employees.filter(e =>
    e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.job_title?.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AppHeader title="HR">
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> Add Employee</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
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
      </div>
      {!demo && <AddEmployeeDialog open={showAdd} onOpenChange={setShowAdd} onCreated={() => {}} />}
    </>
  );
};

export default HR;
