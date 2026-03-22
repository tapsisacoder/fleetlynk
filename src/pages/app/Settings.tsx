import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Building2, Users, Activity, Receipt, Cog, Shield, FileText, Database, CreditCard, ScrollText } from "lucide-react";
import { useState } from "react";
import { useDemoContext } from "@/demo/DemoContext";

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

const Blurred = ({ text = "████████████████" }: { text?: string }) => (
  <span className="select-none text-muted-foreground/60" style={{ filter: "blur(4px)" }}>{text}</span>
);

const SettingsModule = () => {
  const { profile } = useAuth();
  const demo = useDemoContext();
  const [activeSection, setActiveSection] = useState("Company Profile");

  const isPrincipal = profile?.role === "principal";
  const isFinanceManager = profile?.role === "finance_manager";

  if (!isPrincipal && !isFinanceManager && !demo) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {settingsSections.map((section, i) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setActiveSection(section.title)}
              className={`bg-card border p-5 cursor-pointer transition-colors ${activeSection === section.title ? "border-accent" : "border-border hover:border-accent/30"}`}>
              <div className="flex items-center gap-2 mb-2">
                <section.icon className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </motion.div>
          ))}
        </div>

        {demo && activeSection === "Company Profile" && (
          <div className="bg-card border border-border p-6 max-w-2xl">
            <h2 className="text-sm font-semibold text-foreground mb-4">Company Profile</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Company Name</span>
                <span className="col-span-2 font-medium">{demo.company.company_name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Trading Name</span>
                <span className="col-span-2">{demo.company.trading_name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Country</span>
                <span className="col-span-2">{demo.company.country}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Address</span>
                <span className="col-span-2"><Blurred text="123 Industrial Road, Harare" /></span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Phone</span>
                <span className="col-span-2"><Blurred text="+263 242 123 456" /></span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Email</span>
                <span className="col-span-2">{demo.company.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">VAT Number</span>
                <span className="col-span-2"><Blurred text="1234567890" /></span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Bank</span>
                <span className="col-span-2">{demo.company.bank_name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-muted-foreground">Account #</span>
                <span className="col-span-2"><Blurred text="1234567890123" /></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsModule;
