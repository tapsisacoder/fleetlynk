import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { downloadCsv } from "@/lib/exports";
import { useExportContext } from "@/hooks/use-export-context";
import { toast } from "sonner";
import { useDemoContext } from "@/demo/DemoContext";

const Accounts = () => {
  const demo = useDemoContext();
  const [prodInvoices, setProdInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(!demo);
  const [tab, setTab] = useState<"invoices" | "payments">("invoices");
  const exportCtx = useExportContext();

  useEffect(() => {
    if (demo) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from("invoices").select("*, clients(company_name), trips(trip_number)").eq("is_voided", false).order("created_at", { ascending: false }).limit(50);
      setProdInvoices(data || []);
      setLoading(false);
    };
    load();
  }, [demo]);

  const invoices = demo
    ? demo.invoices.map(inv => ({
        ...inv, clients: { company_name: inv.client_name },
        trips: { trip_number: inv.trip_number },
      }))
    : prodInvoices;

  const filtered = invoices.filter(inv =>
    inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
    inv.clients?.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    inv.trips?.trip_number?.toLowerCase().includes(search.toLowerCase())
  );

  const unpaid = demo
    ? demo.invoices.filter(inv => inv.amount_outstanding_usd > 0)
    : [];

  const statusColor = (s: string) => {
    const c: Record<string, string> = { draft: "bg-muted text-muted-foreground", confirmed: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]", partially_paid: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]", paid: "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]", overdue: "bg-[hsl(var(--red))]/10 text-[hsl(var(--red))]" };
    return c[s] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <AppHeader title="Accounts">
        <Button variant="outline" size="sm" className="mr-2" onClick={async () => {
          const companyName = demo ? demo.company.company_name : await exportCtx.loadCompanyName();
          downloadCsv({ companyName, reportName: "Invoice Register", generatedBy: exportCtx.generatedBy,
            columns: [{ key: "invoice_number", label: "Invoice #" }, { key: "client", label: "Client" }, { key: "total_usd", label: "Total", format: "decimal2" }, { key: "amount_outstanding_usd", label: "Outstanding", format: "decimal2" }, { key: "status", label: "Status" }],
            data: filtered.map(inv => ({ invoice_number: inv.invoice_number, client: inv.clients?.company_name || "", total_usd: inv.total_usd, amount_outstanding_usd: inv.amount_outstanding_usd, status: inv.status })),
          }, "invoice_register.csv");
          toast.success("Invoice register exported");
        }}><Download className="h-4 w-4 mr-1" /> Export CSV</Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-1 mb-4">
          {([["invoices", "Invoices"], ["payments", "Money to Collect"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === key ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{label}</button>
          ))}
        </div>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        {tab === "invoices" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Invoice #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Trip #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Total (USD)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Outstanding</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                </tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                  : filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No invoices found.</td></tr>
                  : filtered.map((inv, i) => (
                    <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer`}>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{inv.invoice_number}</td>
                      <td className="px-4 py-3 font-mono text-xs">{inv.trips?.trip_number || "—"}</td>
                      <td className="px-4 py-3 text-xs">{inv.clients?.company_name || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">${Number(inv.total_usd).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs font-medium">${Number(inv.amount_outstanding_usd).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs">{inv.invoice_date}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusColor(inv.status)}`}>{inv.status.replace(/_/g, " ")}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="bg-card border border-border overflow-hidden">
            {demo && (
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-semibold">Outstanding Invoices</h2>
                <span className="text-lg font-bold font-mono text-accent">${demo.moneyToCollect.toLocaleString()}</span>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Invoice #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Outstanding (USD)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                </tr></thead>
                <tbody>
                  {unpaid.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No outstanding invoices.</td></tr>
                  : unpaid.map((inv, i) => (
                    <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40`}>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{inv.invoice_number}</td>
                      <td className="px-4 py-3 text-xs">{inv.client_name}</td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-[hsl(var(--red))]">${inv.amount_outstanding_usd.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusColor(inv.status)}`}>{inv.status.replace(/_/g, " ")}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Accounts;
