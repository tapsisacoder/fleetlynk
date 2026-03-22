import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { BarChart3, DollarSign, Truck, Users, Fuel, Wrench, FileText, TrendingUp } from "lucide-react";
import { useDemoContext } from "@/demo/DemoContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { useState } from "react";

const reportSections = [
  { title: "Financial", icon: DollarSign, reports: ["P&L Statement", "AR Aging", "AP Aging", "VAT Summary", "Invoice Register"] },
  { title: "Fleet & Trips", icon: Truck, reports: ["Trip Profitability", "Vehicle Cost Summary", "Route Profitability", "Fleet Utilisation", "Compliance Expiry"] },
  { title: "Driver", icon: Users, reports: ["Driver Scorecard", "Driver Cost vs Revenue", "Driver Fuel Efficiency"] },
  { title: "Fuel", icon: Fuel, reports: ["Fuel Cost Per Trip", "Fuel Cost Per Vehicle", "Anomaly Report", "Tank Reconciliation"] },
  { title: "Workshop", icon: Wrench, reports: ["Workshop Cost Per Vehicle", "Planned vs Unplanned Maintenance", "Job Card Register", "Parts Consumption"] },
  { title: "Debtors & Creditors", icon: FileText, reports: ["Client Statement", "Supplier Statement", "Outstanding Invoices"] },
  { title: "Business Intelligence", icon: TrendingUp, reports: ["True Cost of a Driver", "Route Profitability Heatmap", "Vehicle True Cost of Ownership", "Client Dependency Risk"] },
];

const Reports = () => {
  const demo = useDemoContext();
  const [activeReport, setActiveReport] = useState<string | null>(demo ? "Trip Profitability" : null);

  const profitabilityData = demo ? demo.closedTrips.map(t => ({
    trip: t.trip_number.replace("TRP-2026-", ""),
    margin: Math.round((t.margin_usd / t.rate_usd) * 100),
    marginUsd: t.margin_usd,
    profitable: t.margin_usd >= 0,
  })) : [];

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

        {/* Active Report Display */}
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
