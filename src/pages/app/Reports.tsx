import { AppHeader } from "@/components/AppHeader";
import { motion } from "framer-motion";
import { BarChart3, DollarSign, Truck, Users, Fuel, Wrench, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reportSections = [
  {
    title: "Financial",
    icon: DollarSign,
    reports: ["P&L Statement", "AR Aging (Money to Collect)", "AP Aging (Bills to Pay)", "VAT Summary", "Invoice Register"],
  },
  {
    title: "Fleet & Trips",
    icon: Truck,
    reports: ["Trip Profitability", "Vehicle Cost Summary", "Route Profitability", "Fleet Utilisation", "Compliance Expiry"],
  },
  {
    title: "Driver",
    icon: Users,
    reports: ["Driver Scorecard", "Driver Cost vs Revenue", "Driver Fuel Efficiency"],
  },
  {
    title: "Fuel",
    icon: Fuel,
    reports: ["Fuel Cost Per Trip", "Fuel Cost Per Vehicle", "Anomaly Report", "Tank Reconciliation", "Fuel Spend by Route"],
  },
  {
    title: "Workshop",
    icon: Wrench,
    reports: ["Workshop Cost Per Vehicle", "Planned vs Unplanned Maintenance", "Job Card Register", "Parts Consumption"],
  },
  {
    title: "Debtors & Creditors",
    icon: FileText,
    reports: ["Client Statement", "Supplier Statement", "Outstanding Invoices"],
  },
  {
    title: "Business Intelligence",
    icon: TrendingUp,
    reports: ["True Cost of a Driver", "Route Profitability Heatmap", "Vehicle True Cost of Ownership", "Client Dependency Risk"],
  },
];

const Reports = () => {
  return (
    <>
      <AppHeader title="Reports" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border p-5 hover:border-accent/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {section.reports.map((r) => (
                  <li key={r} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Reports;
