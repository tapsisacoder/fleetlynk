import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Building2, Users, Activity, Receipt, Cog, Shield, FileText, Database, CreditCard, ScrollText } from "lucide-react";
import { useState } from "react";

const settingsSections = [
  { title: "Company Profile", icon: Building2, desc: "Name, address, logo, VAT, timezone" },
  { title: "Users & Roles", icon: Users, desc: "Manage users, assign roles, permissions" },
  { title: "User Activity", icon: Activity, desc: "Online users, recent actions" },
  { title: "Financial Settings", icon: Receipt, desc: "Invoice layout, payment terms, VAT rate" },
  { title: "Operational Defaults", icon: Cog, desc: "Fuel variance, terrain, inspection timing" },
  { title: "Inspection Templates", icon: Shield, desc: "Truck & trailer checklists" },
  { title: "Common Faults Library", icon: FileText, desc: "Pre-loaded fault categories" },
  { title: "Data Import", icon: Database, desc: "Import trucks, drivers, clients, parts" },
  { title: "Data Export", icon: Database, desc: "Export all data by module" },
  { title: "Billing", icon: CreditCard, desc: "Plan, subscription, founding fleet status" },
  { title: "Audit Log", icon: ScrollText, desc: "System-wide activity log" },
];

const SettingsModule = () => {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState("Company Profile");

  // Only principal sees all settings
  const isPrincipal = profile?.role === "principal";
  const isFinanceManager = profile?.role === "finance_manager";

  const visibleSections = settingsSections.filter((s) => {
    if (isPrincipal) return true;
    if (isFinanceManager && s.title === "Financial Settings") return true;
    return false;
  });

  if (!isPrincipal && !isFinanceManager) {
    return (
      <>
        <AppHeader title="Settings" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Settings are only visible to the Principal.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Settings" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveSection(section.title)}
              className={`bg-card border p-5 cursor-pointer transition-colors ${
                activeSection === section.title ? "border-accent" : "border-border hover:border-accent/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <section.icon className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SettingsModule;
