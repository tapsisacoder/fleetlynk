import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { downloadCsv } from "@/lib/exports";
import { useExportContext } from "@/hooks/use-export-context";
import { toast } from "sonner";

const Accounts = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"invoices" | "payments" | "expenses">("invoices");
  const exportCtx = useExportContext();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("invoices")
        .select("*, clients(company_name), trips(trip_number)")
        .eq("is_voided", false)
        .order("created_at", { ascending: false })
        .limit(50);
      setInvoices(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = invoices.filter((inv) =>
    inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
    inv.clients?.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    inv.trips?.trip_number?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    const c: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      confirmed: "bg-blue-500/10 text-blue-600",
      partially_paid: "bg-amber-500/10 text-amber-600",
      paid: "bg-green-500/10 text-green-600",
      overdue: "bg-red-500/10 text-red-600",
    };
    return c[s] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <AppHeader title="Accounts">
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-1" /> New Invoice
        </Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {([["invoices", "Invoices"], ["payments", "Money to Collect"], ["expenses", "Bills to Pay"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                tab === key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {tab === "invoices" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Invoice #</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Trip #</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Total (USD)</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Outstanding</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Due Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No invoices found.</td></tr>
                  ) : (
                    filtered.map((inv, i) => (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}
                      >
                        <td className="px-4 py-3 font-mono text-xs font-medium">{inv.invoice_number}</td>
                        <td className="px-4 py-3 font-mono text-xs">{inv.trips?.trip_number || "—"}</td>
                        <td className="px-4 py-3 text-xs">{inv.clients?.company_name || "—"}</td>
                        <td className="px-4 py-3 font-mono text-xs">${Number(inv.total_usd).toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs font-medium">${Number(inv.amount_outstanding_usd).toLocaleString()}</td>
                        <td className="px-4 py-3 text-xs">{inv.due_date}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusColor(inv.status)}`}>
                            {inv.status.replace(/_/g, " ")}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="bg-card border border-border p-8 text-center text-muted-foreground text-sm">
            Accounts receivable aging will appear here.
          </div>
        )}

        {tab === "expenses" && (
          <div className="bg-card border border-border p-8 text-center text-muted-foreground text-sm">
            Accounts payable aging will appear here.
          </div>
        )}
      </div>
    </>
  );
};

export default Accounts;
