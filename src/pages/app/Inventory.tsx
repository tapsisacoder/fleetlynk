import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { AddPartDialog } from "@/components/inventory/AddPartDialog";
import { useDemoContext } from "@/demo/DemoContext";

const Inventory = () => {
  const demo = useDemoContext();
  const [prodParts, setProdParts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(!demo);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (demo) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("parts_catalogue").select("*, suppliers(supplier_name)").eq("is_deleted", false).order("name");
      setProdParts(data || []);
      setLoading(false);
    };
    load();
  }, [demo]);

  const parts = demo
    ? demo.parts.map(p => ({ ...p, suppliers: { supplier_name: p.supplier_name } }))
    : prodParts;

  const filtered = parts.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.part_number?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const stockColor = (current: number, min: number) =>
    current <= 0 ? "text-[hsl(var(--red))] font-bold" : current <= min ? "text-[hsl(var(--amber))]" : "text-foreground";

  return (
    <>
      <AppHeader title="Inventory">
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> Add Part</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search parts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr>
                <th className="text-left px-4 py-3 text-xs font-semibold">Part #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Min</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">WAC (USD)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Supplier</th>
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No parts found.</td></tr>
                : filtered.map((part, i) => (
                  <motion.tr key={part.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                    <td className="px-4 py-3 font-mono text-xs">{part.part_number}</td>
                    <td className="px-4 py-3 text-xs font-medium">{part.name}</td>
                    <td className="px-4 py-3 text-xs">{part.category || "—"}</td>
                    <td className={`px-4 py-3 font-mono text-xs ${stockColor(part.current_stock, part.min_stock_threshold)}`}>{part.current_stock}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{part.min_stock_threshold}</td>
                    <td className="px-4 py-3 font-mono text-xs">${Number(part.weighted_avg_cost).toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs">{part.suppliers?.supplier_name || "—"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {!demo && <AddPartDialog open={showAdd} onOpenChange={setShowAdd} onCreated={() => {}} />}
    </>
  );
};

export default Inventory;
