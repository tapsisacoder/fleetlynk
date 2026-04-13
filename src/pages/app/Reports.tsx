import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { DollarSign, Truck, Fuel, FileText, TrendingUp, ArrowLeft, Download } from "lucide-react";
import { useDemoContext } from "@/demo/DemoContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadReportPdf } from "@/lib/exports/pdf-report";
import { downloadCsv } from "@/lib/exports/csv-export";

const reportSections = [
  { title: "Financial Reports", icon: DollarSign, reports: ["P&L Statement", "Invoice Register"] },
  { title: "Fleet Reports", icon: Truck, reports: ["Compliance Expiry", "Vehicle Costs"] },
  { title: "Fuel Reports", icon: Fuel, reports: ["Cost Per Trip", "Anomaly Report", "Spend by Route"] },
  { title: "Debtors & Creditors", icon: FileText, reports: ["AR Aging", "AP Aging", "Client Statements"] },
  { title: "Trip Profitability", icon: TrendingUp, reports: ["Trip Profitability"] },
];

const plTrucks = ["ADZ-9799", "AEG 7336", "AGB 1092", "AGL 4688", "AEU 1313"] as const;

const plData: Record<string, { revenue: number; fuel: number; maintenance: number; bookouts: number; tolls: number; insurance: number }> = {
  "ADZ-9799":  { revenue: 18500, fuel: 5200, maintenance: 1800, bookouts: 2400, tolls: 680, insurance: 450 },
  "AEG 7336":  { revenue: 22300, fuel: 4800, maintenance: 1200, bookouts: 3100, tolls: 720, insurance: 450 },
  "AGB 1092":  { revenue: 15800, fuel: 4600, maintenance: 2100, bookouts: 2000, tolls: 580, insurance: 450 },
  "AGL 4688":  { revenue: 19200, fuel: 4400, maintenance: 1500, bookouts: 2600, tolls: 640, insurance: 450 },
  "AEU 1313":  { revenue: 16900, fuel: 4900, maintenance: 1600, bookouts: 2200, tolls: 610, insurance: 450 },
};

(() => {
  const targets: Record<string, number> = { "ADZ-9799": 21.3, "AEG 7336": 30.3, "AGB 1092": 18.8, "AGL 4688": 24.0, "AEU 1313": 22.2 };
  for (const truck of plTrucks) {
    const d = plData[truck];
    const totalCost = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
    d.revenue = Math.round(totalCost / (1 - targets[truck] / 100));
  }
})();

type ViewMode = "index" | "report" | "pl-page";

const Reports = () => {
  const demo = useDemoContext();
  const [activeReport, setActiveReport] = useState<string | null>(demo ? "Trip Profitability" : null);
  const [viewMode, setViewMode] = useState<ViewMode>("index");
  const [truckFilter, setTruckFilter] = useState("ALL");

  const profitabilityData = demo ? demo.closedTrips.map(t => ({
    trip: t.trip_number.replace("TRP-2026-", ""),
    margin: Math.round((t.margin_usd / t.rate_usd) * 100),
    marginUsd: t.margin_usd,
    profitable: t.margin_usd >= 0,
  })) : [];

  const filteredTrucks = truckFilter === "ALL" ? [...plTrucks] : [truckFilter as typeof plTrucks[number]];

  const totals = filteredTrucks.reduce((acc, t) => {
    const d = plData[t];
    acc.revenue += d.revenue;
    acc.fuel += d.fuel;
    acc.maintenance += d.maintenance;
    acc.bookouts += d.bookouts;
    acc.tolls += d.tolls;
    acc.insurance += d.insurance;
    return acc;
  }, { revenue: 0, fuel: 0, maintenance: 0, bookouts: 0, tolls: 0, insurance: 0 });

  const totalCosts = totals.fuel + totals.maintenance + totals.bookouts + totals.tolls + totals.insurance;
  const netProfit = totals.revenue - totalCosts;
  const marginPct = totals.revenue > 0 ? ((netProfit / totals.revenue) * 100).toFixed(1) : "0.0";

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  const handleReportClick = (report: string) => {
    if (report === "P&L Statement") {
      setViewMode("pl-page");
      setActiveReport("P&L Statement");
    } else {
      setActiveReport(report);
      setViewMode("report");
    }
  };

  const handleExportPdf = () => {
    const costRows = [
      { label: "Fuel", key: "fuel" as const },
      { label: "Maintenance", key: "maintenance" as const },
      { label: "Driver Bookouts", key: "bookouts" as const },
      { label: "Tolls & Borders", key: "tolls" as const },
      { label: "Insurance", key: "insurance" as const },
    ];
    const columns = [
      { key: "category", label: "Category", width: 120 },
      ...filteredTrucks.map(t => ({ key: t, label: t, width: 80, align: "right" as const })),
      ...(filteredTrucks.length > 1 ? [{ key: "total", label: "Total", width: 80, align: "right" as const }] : []),
    ];
    const data: Record<string, string>[] = [];
    const revRow: Record<string, string> = { category: "Revenue" };
    filteredTrucks.forEach(t => { revRow[t] = fmt(plData[t].revenue); });
    if (filteredTrucks.length > 1) revRow.total = fmt(totals.revenue);
    data.push(revRow);
    costRows.forEach(cr => {
      const row: Record<string, string> = { category: cr.label };
      filteredTrucks.forEach(t => { row[t] = `(${fmt(plData[t][cr.key])})`; });
      if (filteredTrucks.length > 1) row.total = `(${fmt(filteredTrucks.reduce((s, t) => s + plData[t][cr.key], 0))})`;
      data.push(row);
    });
    const tcRow: Record<string, string> = { category: "Total Costs" };
    filteredTrucks.forEach(t => {
      const d = plData[t]; tcRow[t] = `(${fmt(d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance)})`;
    });
    if (filteredTrucks.length > 1) tcRow.total = `(${fmt(totalCosts)})`;
    data.push(tcRow);
    const npRow: Record<string, string> = { category: "Net Profit" };
    filteredTrucks.forEach(t => {
      const d = plData[t]; const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
      npRow[t] = fmt(d.revenue - tc);
    });
    if (filteredTrucks.length > 1) npRow.total = fmt(netProfit);
    data.push(npRow);
    const mRow: Record<string, string> = { category: "Profit Margin" };
    filteredTrucks.forEach(t => {
      const d = plData[t]; const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
      mRow[t] = `${((d.revenue - tc) / d.revenue * 100).toFixed(1)}%`;
    });
    if (filteredTrucks.length > 1) mRow.total = `${marginPct}%`;
    data.push(mRow);

    downloadReportPdf({
      reportName: "Profit & Loss Statement",
      module: "Financial",
      companyName: "Mwana Haulage (Pvt) Ltd",
      periodFrom: "2026-03-01",
      periodTo: "2026-04-13",
      generatedBy: { name: "Tapiwa Chamuka", role: "Admin" },
      columns,
      data,
    }, "PL_Statement_Mar2026");
  };

  const handleExportCsv = () => {
    const costKeys = ["fuel", "maintenance", "bookouts", "tolls", "insurance"] as const;
    const costLabels = ["Fuel", "Maintenance", "Driver Bookouts", "Tolls & Borders", "Insurance"];
    const columns = [
      { key: "category", label: "Category" },
      ...filteredTrucks.map(t => ({ key: t, label: t })),
      ...(filteredTrucks.length > 1 ? [{ key: "total", label: "Total" }] : []),
    ];
    const data: Record<string, string | number>[] = [];
    const revRow: Record<string, string | number> = { category: "Revenue" };
    filteredTrucks.forEach(t => { revRow[t] = plData[t].revenue; });
    if (filteredTrucks.length > 1) revRow.total = totals.revenue;
    data.push(revRow);
    costKeys.forEach((k, i) => {
      const row: Record<string, string | number> = { category: costLabels[i] };
      filteredTrucks.forEach(t => { row[t] = plData[t][k]; });
      if (filteredTrucks.length > 1) row.total = filteredTrucks.reduce((s, t) => s + plData[t][k], 0);
      data.push(row);
    });
    const tcRow: Record<string, string | number> = { category: "Total Costs" };
    filteredTrucks.forEach(t => {
      const d = plData[t]; tcRow[t] = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
    });
    if (filteredTrucks.length > 1) tcRow.total = totalCosts;
    data.push(tcRow);
    const npRow: Record<string, string | number> = { category: "Net Profit" };
    filteredTrucks.forEach(t => {
      const d = plData[t]; const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
      npRow[t] = d.revenue - tc;
    });
    if (filteredTrucks.length > 1) npRow.total = netProfit;
    data.push(npRow);

    downloadCsv({
      companyName: "Mwana Haulage (Pvt) Ltd",
      reportName: "Profit & Loss Statement",
      periodFrom: "2026-03-01",
      periodTo: "2026-04-13",
      generatedBy: { name: "Tapiwa Chamuka", role: "Admin" },
      columns,
      data,
    }, "PL_Statement_Mar2026");
  };

  // ── P&L dedicated page ──
  if (viewMode === "pl-page") {
    return (
      <>
        <AppHeader title="Reports" />
        <div className="flex-1 overflow-auto p-6">
          {/* Back + title + export buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <button onClick={() => { setViewMode("index"); setActiveReport(demo ? "Trip Profitability" : null); }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Reports
            </button>
            <h2 className="text-base font-semibold text-foreground sm:ml-4">Profit & Loss Statement</h2>
            <div className="flex items-center gap-2 sm:ml-auto">
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={handleExportPdf}>
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={handleExportCsv}>
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border p-4 mb-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Truck</label>
              <select value={truckFilter} onChange={e => setTruckFilter(e.target.value)}
                className="text-xs bg-background border border-border rounded px-2 py-1.5 text-foreground">
                <option value="ALL">All Trucks</option>
                {plTrucks.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground">Date Range</label>
              <input type="date" defaultValue="2026-03-01" className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground" />
              <span className="text-xs text-muted-foreground">—</span>
              <input type="date" defaultValue="2026-04-13" className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground" />
            </div>
          </div>

          {/* P&L Table */}
          <div className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold">Category</th>
                    {filteredTrucks.map(t => (
                      <th key={t} className="text-right px-4 py-3 text-xs font-semibold font-mono">{t}</th>
                    ))}
                    {filteredTrucks.length > 1 && <th className="text-right px-4 py-3 text-xs font-semibold font-mono">Total</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border bg-[hsl(var(--green))]/5">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">Revenue</td>
                    {filteredTrucks.map(t => (
                      <td key={t} className="px-4 py-3 text-xs font-mono text-right text-foreground">{fmt(plData[t].revenue)}</td>
                    ))}
                    {filteredTrucks.length > 1 && <td className="px-4 py-3 text-xs font-mono text-right font-semibold text-foreground">{fmt(totals.revenue)}</td>}
                  </tr>
                  {[
                    { label: "Fuel", key: "fuel" as const },
                    { label: "Maintenance", key: "maintenance" as const },
                    { label: "Driver Bookouts", key: "bookouts" as const },
                    { label: "Tolls & Borders", key: "tolls" as const },
                    { label: "Insurance", key: "insurance" as const },
                  ].map((row, ri) => (
                    <tr key={row.key} className={`border-t border-border ${ri % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{row.label}</td>
                      {filteredTrucks.map(t => (
                        <td key={t} className="px-4 py-3 text-xs font-mono text-right text-muted-foreground">({fmt(plData[t][row.key])})</td>
                      ))}
                      {filteredTrucks.length > 1 && (
                        <td className="px-4 py-3 text-xs font-mono text-right text-muted-foreground">
                          ({fmt(filteredTrucks.reduce((s, t) => s + plData[t][row.key], 0))})
                        </td>
                      )}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border bg-muted/40">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">Total Costs</td>
                    {filteredTrucks.map(t => {
                      const d = plData[t]; const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
                      return <td key={t} className="px-4 py-3 text-xs font-mono text-right font-semibold text-foreground">({fmt(tc)})</td>;
                    })}
                    {filteredTrucks.length > 1 && <td className="px-4 py-3 text-xs font-mono text-right font-semibold text-foreground">({fmt(totalCosts)})</td>}
                  </tr>
                  <tr className="border-t-2 border-border bg-[hsl(var(--green))]/5">
                    <td className="px-4 py-3 text-xs font-bold text-foreground">Net Profit</td>
                    {filteredTrucks.map(t => {
                      const d = plData[t]; const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance; const np = d.revenue - tc;
                      return <td key={t} className={`px-4 py-3 text-xs font-mono text-right font-bold ${np >= 0 ? "text-[hsl(var(--green))]" : "text-[hsl(var(--red))]"}`}>{fmt(np)}</td>;
                    })}
                    {filteredTrucks.length > 1 && <td className={`px-4 py-3 text-xs font-mono text-right font-bold ${netProfit >= 0 ? "text-[hsl(var(--green))]" : "text-[hsl(var(--red))]"}`}>{fmt(netProfit)}</td>}
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">Profit Margin</td>
                    {filteredTrucks.map(t => {
                      const d = plData[t]; const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
                      const m = ((d.revenue - tc) / d.revenue * 100).toFixed(1);
                      return <td key={t} className="px-4 py-3 text-xs font-mono text-right font-semibold text-accent">{m}%</td>;
                    })}
                    {filteredTrucks.length > 1 && <td className="px-4 py-3 text-xs font-mono text-right font-semibold text-accent">{marginPct}%</td>}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Main reports index ──
  return (
    <>
      <AppHeader title="Reports" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {reportSections.map((section, i) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card border border-border p-5 hover:border-accent/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {section.reports.map(r => (
                  <li key={r} onClick={() => handleReportClick(r)}
                    className={`text-xs cursor-pointer transition-colors ${activeReport === r ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Trip Profitability Chart */}
        {demo && activeReport === "Trip Profitability" && (
          <div className="bg-card border border-border p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Trip Profitability — Closed Trips</h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(218, 18%, 88%)" />
                  <XAxis dataKey="trip" tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} />
                  <YAxis tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(210, 50%, 12%)", border: "none", borderRadius: 4, color: "#fff", fontSize: 12, fontFamily: "IBM Plex Sans" }}
                    formatter={(value: any, _name: any, props: any) => [`$${props.payload.marginUsd.toLocaleString()} (${value}%)`, "Margin"]}
                    labelFormatter={l => `TRP-2026-${l}`}
                  />
                  <ReferenceLine y={0} stroke="hsl(215, 12%, 59%)" strokeWidth={1} />
                  <Bar dataKey="margin" radius={[2, 2, 0, 0]}>
                    {profitabilityData.map((entry, index) => (
                      <Cell key={index} fill={entry.profitable ? "hsl(152, 64%, 29%)" : "hsl(0, 64%, 42%)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[hsl(var(--green))]" />Profitable</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[hsl(var(--red))]" />Loss</div>
            </div>
          </div>
        )}

        {/* Anomaly Report */}
        {demo && activeReport === "Anomaly Report" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="p-4 border-b border-border"><h2 className="text-sm font-semibold">Fuel Anomaly Report</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted"><tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Anomaly #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Trip</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Truck</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Driver</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Route</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Variance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
                </tr></thead>
                <tbody>
                  {demo.fuelAnomalies.map((a, i) => (
                    <tr key={a.id} className={`border-t border-border ${a.status === "open" ? "bg-[hsl(var(--red))]/5" : i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                      <td className="px-4 py-3 font-mono text-xs font-medium">{a.anomaly_number}</td>
                      <td className="px-4 py-3 text-xs">{new Date(a.date).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-3 font-mono text-xs">{a.trip_number}</td>
                      <td className="px-4 py-3 font-mono text-xs">{a.truck_reg}</td>
                      <td className="px-4 py-3 text-xs">{a.driver_name}</td>
                      <td className="px-4 py-3 text-xs">{a.route}</td>
                      <td className="px-4 py-3 font-mono text-xs font-medium text-[hsl(var(--red))]">+{a.variance_percent}%</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${a.status === "open" ? "bg-[hsl(var(--red))]/10 text-[hsl(var(--red))]" : "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]"}`}>
                          {a.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
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

export default Reports;
