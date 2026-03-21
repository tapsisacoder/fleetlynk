import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Truck, DollarSign, MapPin, AlertTriangle, Plus, FileText, Wrench, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  trucksOnRoad: number;
  trucksInWorkshop: number;
  trucksStandby: number;
  trucksOffRoad: number;
  totalTrucks: number;
  moneyToCollect: number;
  moneyOverdue: number;
  activeTrips: number;
  awaitingInvoice: number;
  alertsTotal: number;
  alertsCritical: number;
  alertsWarning: number;
}

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    trucksOnRoad: 0, trucksInWorkshop: 0, trucksStandby: 0, trucksOffRoad: 0,
    totalTrucks: 0, moneyToCollect: 0, moneyOverdue: 0, activeTrips: 0,
    awaitingInvoice: 0, alertsTotal: 0, alertsCritical: 0, alertsWarning: 0,
  });
  const [liveTrips, setLiveTrips] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [trucksRes, tripsRes, invoicesRes, alertsRes, deliveredRes] = await Promise.all([
        supabase.from("trucks").select("id, status").eq("is_deleted", false),
        supabase.from("trips").select("id, trip_number, origin, destination, status, clients(company_name), trucks(registration_number)")
          .neq("status", "closed").eq("is_deleted", false).order("created_at", { ascending: false }).limit(8),
        supabase.from("invoices").select("amount_outstanding_usd, due_date, status").neq("status", "paid").eq("is_voided", false),
        supabase.from("alerts").select("id, severity, title, module, created_at").eq("is_resolved", false).order("created_at", { ascending: false }).limit(20),
        supabase.from("trips").select("id").eq("status", "delivered").eq("is_deleted", false),
      ]);

      const trucks = trucksRes.data || [];
      const trips = tripsRes.data || [];
      const invoices = invoicesRes.data || [];
      const alertsList = alertsRes.data || [];
      const delivered = deliveredRes.data || [];

      const today = new Date().toISOString().split("T")[0];
      const overdueInvoices = invoices.filter((inv: any) => inv.due_date < today);

      setStats({
        trucksOnRoad: trucks.filter((t: any) => t.status === "on_road").length,
        trucksInWorkshop: trucks.filter((t: any) => t.status === "in_workshop").length,
        trucksStandby: trucks.filter((t: any) => t.status === "standby").length,
        trucksOffRoad: trucks.filter((t: any) => t.status === "off_road" || t.status === "disposed").length,
        totalTrucks: trucks.length,
        moneyToCollect: invoices.reduce((sum: number, inv: any) => sum + Number(inv.amount_outstanding_usd || 0), 0),
        moneyOverdue: overdueInvoices.reduce((sum: number, inv: any) => sum + Number(inv.amount_outstanding_usd || 0), 0),
        activeTrips: trips.length,
        awaitingInvoice: delivered.length,
        alertsTotal: alertsList.length,
        alertsCritical: alertsList.filter((a: any) => a.severity === "critical").length,
        alertsWarning: alertsList.filter((a: any) => a.severity === "warning").length,
      });
      setLiveTrips(trips);
      setAlerts(alertsList);
    };
    load();
  }, []);

  const utilisation = stats.totalTrucks > 0
    ? Math.round((stats.trucksOnRoad / stats.totalTrucks) * 100)
    : 0;

  const kpis = [
    {
      label: "Trucks on Road",
      value: `${stats.trucksOnRoad} of ${stats.totalTrucks}`,
      subText: `${stats.trucksInWorkshop} workshop · ${stats.trucksStandby} standby`,
      borderClass: stats.trucksOnRoad > 0 ? "border-l-[hsl(var(--green))]" : "border-l-[hsl(var(--amber))]",
      icon: Truck,
    },
    {
      label: "Money to Collect",
      value: `$${stats.moneyToCollect.toLocaleString()}`,
      subText: stats.moneyOverdue > 0 ? `$${stats.moneyOverdue.toLocaleString()} overdue` : "All current",
      subTextClass: stats.moneyOverdue > 0 ? "text-[hsl(var(--red))]" : undefined,
      borderClass: "border-l-accent",
      icon: DollarSign,
    },
    {
      label: "Active Trips",
      value: `${stats.activeTrips} active`,
      subText: `${stats.awaitingInvoice} awaiting invoice`,
      borderClass: "border-l-[hsl(var(--blue))]",
      icon: MapPin,
    },
    {
      label: "Alerts",
      value: `${stats.alertsTotal} total`,
      subText: `${stats.alertsCritical} critical · ${stats.alertsWarning} warnings`,
      borderClass: stats.alertsTotal === 0 ? "border-l-[hsl(var(--green))]" : stats.alertsTotal <= 5 ? "border-l-[hsl(var(--amber))]" : "border-l-[hsl(var(--red))]",
      icon: AlertTriangle,
    },
  ];

  const quickActions = [
    { label: "New Trip", icon: Plus, action: () => navigate("/app/operations"), module: "operations" },
    { label: "New Invoice", icon: FileText, action: () => navigate("/app/accounts"), module: "accounts" },
    { label: "New Job Card", icon: Wrench, action: () => navigate("/app/workshop"), module: "workshop" },
    { label: "Issue Fuel", icon: Fuel, action: () => navigate("/app/fuel"), module: "fuel" },
  ];

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-muted text-muted-foreground",
      loading: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]",
      in_transit: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]",
      at_border: "bg-purple-500/10 text-purple-600",
      offloading: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]",
      delivered: "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]",
      invoiced: "bg-accent/10 text-accent",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  const sortedAlerts = [...alerts].sort((a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3));

  const severityBadge = (severity: string) => {
    const c: Record<string, string> = {
      critical: "bg-[hsl(var(--red))]/10 text-[hsl(var(--red))]",
      warning: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]",
      info: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]",
    };
    return c[severity] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="flex-1 overflow-auto p-6">
        {/* KPI Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-card border border-border border-l-4 ${kpi.borderClass} p-4`}
            >
              <kpi.icon className="h-5 w-5 text-muted-foreground mb-2" />
              <div className="text-xl font-bold font-mono text-foreground">{kpi.value}</div>
              <div className={`text-xs mt-1 ${kpi.subTextClass || "text-muted-foreground"}`}>{kpi.subText}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          {quickActions.map((qa) => (
            <Button key={qa.label} variant="outline" size="sm" onClick={qa.action}>
              <qa.icon className="h-4 w-4 mr-1.5" />
              {qa.label}
            </Button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Panel — Fleet Status + Live Trips */}
          <div className="lg:col-span-2 space-y-4">
            {/* Fleet Status Grid */}
            <div className="bg-card border border-border p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">Fleet Status</h2>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "On Road", count: stats.trucksOnRoad, color: "bg-[hsl(var(--green))]" },
                  { label: "In Workshop", count: stats.trucksInWorkshop, color: "bg-[hsl(var(--amber))]" },
                  { label: "Standby", count: stats.trucksStandby, color: "bg-muted-foreground" },
                  { label: "Off Road", count: stats.trucksOffRoad, color: "bg-[hsl(var(--red))]" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold font-mono text-foreground">{s.count}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Utilisation Bar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Fleet Utilisation</span>
                  <span className="text-xs font-mono font-medium text-foreground">{utilisation}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-[hsl(var(--green))] transition-all"
                    style={{ width: `${utilisation}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Live Trips Table */}
            <div className="bg-card border border-border p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">Live Trips</h2>
              {liveTrips.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No active trips</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground">Trip #</th>
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground">Route</th>
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground">Client</th>
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground">Truck</th>
                        <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveTrips.map((trip: any) => (
                        <tr key={trip.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => navigate("/app/operations")}>
                          <td className="py-2 font-mono text-xs font-medium">{trip.trip_number}</td>
                          <td className="py-2 text-xs">{trip.origin} → {trip.destination}</td>
                          <td className="py-2 text-xs">{trip.clients?.company_name || "—"}</td>
                          <td className="py-2 font-mono text-xs">{trip.trucks?.registration_number || "—"}</td>
                          <td className="py-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusBadge(trip.status)}`}>
                              {trip.status.replace(/_/g, " ")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel — Requires Action */}
          <div className="bg-card border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Requires Action</h2>
            {sortedAlerts.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-[hsl(var(--green))] text-lg font-semibold mb-1">All Clear</div>
                <p className="text-xs text-muted-foreground">No alerts pending</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {sortedAlerts.map((alert: any) => (
                  <div key={alert.id} className="flex items-start gap-2 p-2 hover:bg-muted/30 rounded-sm cursor-pointer transition-colors">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5 ${severityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground truncate">{alert.title}</p>
                      <p className="text-[10px] text-muted-foreground">{alert.module}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
