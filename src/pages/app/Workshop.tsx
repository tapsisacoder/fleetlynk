import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { NewJobCardDialog } from "@/components/workshop/NewJobCardDialog";

const Workshop = () => {
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const loadJobCards = async () => {
    setLoading(true);
    const { data } = await supabase.from("job_cards").select("*, trucks(registration_number)").eq("is_deleted", false).order("opened_at", { ascending: false }).limit(50);
    setJobCards(data || []);
    setLoading(false);
  };

  useEffect(() => { loadJobCards(); }, []);

  const filtered = jobCards.filter((jc) => jc.job_card_number?.toLowerCase().includes(search.toLowerCase()) || jc.trucks?.registration_number?.toLowerCase().includes(search.toLowerCase()) || jc.description?.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s: string) => {
    const c: Record<string, string> = { open: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]", in_progress: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]", pending_parts: "bg-purple-500/10 text-purple-600", closed: "bg-muted text-muted-foreground" };
    return c[s] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <AppHeader title="Workshop">
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-1" /> New Job Card</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search job cards..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr>
                <th className="text-left px-4 py-3 text-xs font-semibold">Job Card #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Vehicle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
              </tr></thead>
              <tbody>
                {loading ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No job cards found.</td></tr>
                : filtered.map((jc, i) => (
                  <motion.tr key={jc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                    <td className="px-4 py-3 font-mono text-xs font-medium">{jc.job_card_number}</td>
                    <td className="px-4 py-3 font-mono text-xs">{jc.trucks?.registration_number || "—"}</td>
                    <td className="px-4 py-3 text-xs capitalize">{jc.job_type?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-xs capitalize">{jc.job_source?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[200px]">{jc.description || "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusColor(jc.status)}`}>{jc.status.replace(/_/g, " ")}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <NewJobCardDialog open={showNew} onOpenChange={setShowNew} onCreated={loadJobCards} />
    </>
  );
};

export default Workshop;
