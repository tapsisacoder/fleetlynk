import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { DollarSign, Truck, Fuel, FileText, TrendingUp } from "lucide-react";
import { useDemoContext } from "@/demo/DemoContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { useState } from "react";

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

// Ensure margins match requested percentages: 21.3%, 30.3%, 18.8%, 24.0%, 22.2%
// margin = revenue - totalCosts, margin% = margin/revenue
// Adjust revenues to hit targets
(() => {
  const targets: Record<string, number> = { "ADZ-9799": 21.3, "AEG 7336": 30.3, "AGB 1092": 18.8, "AGL 4688": 24.0, "AEU 1313": 22.2 };
  for (const truck of plTrucks) {
    const d = plData[truck];
    const totalCost = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
    // revenue = totalCost / (1 - margin%)
    d.revenue = Math.round(totalCost / (1 - targets[truck] / 100));
  }
})();

const Reports = () => {
  const demo = useDemoContext();
  const [activeReport, setActiveReport] = useState<string | null>(demo ? "Trip Profitability" : null);
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

  return (
    <>
      <AppHeader title="Reports" />
      <div className="flex-1 overflow-auto p-6">
        {/* Report selector cards */}
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
                  <li key={r} onClick={() => setActiveReport(r)}
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

        {/* P&L Statement */}
        {demo && activeReport === "P&L Statement" && (
          <div className="bg-card border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">Profit & Loss Statement</h2>
              <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                <select value={truckFilter} onChange={e => setTruckFilter(e.target.value)}
                  className="text-xs bg-background border border-border rounded px-2 py-1.5 text-foreground">
                  <option value="ALL">All Trucks</option>
                  {plTrucks.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <input type="date" defaultValue="2026-03-01" className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground" />
                  <span>—</span>
                  <input type="date" defaultValue="2026-04-13" className="bg-background border border-border rounded px-2 py-1.5 text-xs text-foreground" />
                </div>
              </div>
            </div>

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
                  {/* Revenue */}
                  <tr className="border-t border-border bg-[hsl(var(--green))]/5">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">Revenue</td>
                    {filteredTrucks.map(t => (
                      <td key={t} className="px-4 py-3 text-xs font-mono text-right text-foreground">{fmt(plData[t].revenue)}</td>
                    ))}
                    {filteredTrucks.length > 1 && <td className="px-4 py-3 text-xs font-mono text-right font-semibold text-foreground">{fmt(totals.revenue)}</td>}
                  </tr>
                  {/* Costs */}
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
                  {/* Total Costs */}
                  <tr className="border-t-2 border-border bg-muted/40">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">Total Costs</td>
                    {filteredTrucks.map(t => {
                      const d = plData[t];
                      const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
                      return <td key={t} className="px-4 py-3 text-xs font-mono text-right font-semibold text-foreground">({fmt(tc)})</td>;
                    })}
                    {filteredTrucks.length > 1 && <td className="px-4 py-3 text-xs font-mono text-right font-semibold text-foreground">({fmt(totalCosts)})</td>}
                  </tr>
                  {/* Net Profit */}
                  <tr className="border-t-2 border-border bg-[hsl(var(--green))]/5">
                    <td className="px-4 py-3 text-xs font-bold text-foreground">Net Profit</td>
                    {filteredTrucks.map(t => {
                      const d = plData[t];
                      const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
                      const np = d.revenue - tc;
                      return <td key={t} className={`px-4 py-3 text-xs font-mono text-right font-bold ${np >= 0 ? "text-[hsl(var(--green))]" : "text-[hsl(var(--red))]"}`}>{fmt(np)}</td>;
                    })}
                    {filteredTrucks.length > 1 && <td className={`px-4 py-3 text-xs font-mono text-right font-bold ${netProfit >= 0 ? "text-[hsl(var(--green))]" : "text-[hsl(var(--red))]"}`}>{fmt(netProfit)}</td>}
                  </tr>
                  {/* Profit Margin */}
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">Profit Margin</td>
                    {filteredTrucks.map(t => {
                      const d = plData[t];
                      const tc = d.fuel + d.maintenance + d.bookouts + d.tolls + d.insurance;
                      const m = ((d.revenue - tc) / d.revenue * 100).toFixed(1);
                      return <td key={t} className="px-4 py-3 text-xs font-mono text-right font-semibold text-accent">{m}%</td>;
                    })}
                    {filteredTrucks.length > 1 && <td className="px-4 py-3 text-xs font-mono text-right font-semibold text-accent">{marginPct}%</td>}
                  </tr>
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
