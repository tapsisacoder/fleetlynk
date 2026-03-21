import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { AddPartDialog } from "@/components/inventory/AddPartDialog";

const Inventory = () => {
  const [parts, setParts] = useState<any[]>([]);
  const [pos, setPos] = useState<any[]>([]);
  const [grns, setGrns] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"catalogue" | "orders" | "grns">("catalogue");
  const [showAdd, setShowAdd] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [partsRes, posRes, grnsRes] = await Promise.all([
      supabase.from("parts_catalogue").select("*, suppliers(supplier_name)").eq("is_deleted", false).order("name"),
      supabase.from("purchase_orders").select("*, suppliers(supplier_name)").order("created_at", { ascending: false }).limit(50),
      supabase.from("goods_received_notes").select("*, suppliers(supplier_name)").order("created_at", { ascending: false }).limit(50),
    ]);
    setParts(partsRes.data || []);
    setPos(posRes.data || []);
    setGrns(grnsRes.data || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const filtered = parts.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()) || p.part_number?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()));

  const stockColor = (current: number, min: number) => current <= 0 ? "text-[hsl(var(--red))] font-bold" : current <= min ? "text-[hsl(var(--amber))]" : "text-foreground";

  const poStatusColor = (s: string) => {
    const c: Record<string, string> = { draft: "bg-muted text-muted-foreground", approved: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]", confirmed: "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]", sent: "bg-accent/10 text-accent" };
    return c[s] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <AppHeader title="Inventory">
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> Add Part</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-1 mb-4">
          {([["catalogue", "Parts Catalogue"], ["orders", "Purchase Orders"], ["grns", "GRNs"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{label}</button>
          ))}
        </div>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {tab === "catalogue" && (
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
        )}

        {tab === "orders" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">PO #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Total (USD)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Date</th>
                </tr></thead>
                <tbody>
                  {pos.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No purchase orders found.</td></tr>
                  : pos.map((po, i) => (
                    <motion.tr key={po.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{po.po_number}</td>
                      <td className="px-4 py-3 text-xs">{po.suppliers?.supplier_name || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">${Number(po.total_amount_usd).toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${poStatusColor(po.status)}`}>{po.status}</span></td>
                      <td className="px-4 py-3 text-xs">{new Date(po.created_at).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "grns" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">GRN #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Supplier</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Total (USD)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Confirmed</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Date</th>
                </tr></thead>
                <tbody>
                  {grns.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No GRNs found.</td></tr>
                  : grns.map((grn, i) => (
                    <motion.tr key={grn.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{grn.grn_number}</td>
                      <td className="px-4 py-3 text-xs">{grn.suppliers?.supplier_name || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">${Number(grn.total_cost_usd).toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${grn.confirmed ? "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]" : "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]"}`}>{grn.confirmed ? "Yes" : "Pending"}</span></td>
                      <td className="px-4 py-3 text-xs">{new Date(grn.received_date).toLocaleDateString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <AddPartDialog open={showAdd} onOpenChange={setShowAdd} onCreated={loadData} />
    </>
  );
};

export default Inventory;
