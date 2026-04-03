import { AppHeader } from "@/components/AppHeader";
import { useDemoContext } from "@/demo/DemoContext";
import { motion } from "framer-motion";
import { Truck, DollarSign, MapPin, AlertTriangle, Plus, FileText, Wrench, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  trucksOnRoad: number; trucksInWorkshop: number; trucksStandby: number;
  trucksOffRoad: number; totalTrucks: number; moneyToCollect: number;
  moneyPayable: number; moneyOverdue: number; activeTrips: number; awaitingInvoice: number;
  alertsTotal: number; alertsCritical: number; alertsWarning: number;
  avgCostPerKm: number;
}

const Dashboard = () => {
  const demo = useDemoContext();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/demo") ? "/demo" : "/app";

  const [prodStats, setProdStats] = useState<Stats>({
    trucksOnRoad: 0, trucksInWorkshop: 0, trucksStandby: 0, trucksOffRoad: 0,
    totalTrucks: 0, moneyToCollect: 0, moneyPayable: 0, moneyOverdue: 0, activeTrips: 0,
    awaitingInvoice: 0, alertsTotal: 0, alertsCritical: 0, alertsWarning: 0, avgCostPerKm: 0,
  });
  const [prodLiveTrips, setProdLiveTrips] = useState<any[]>([]);
  const [prodAlerts, setProdAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (demo) return;
    const load = async () => {
      const [trucksRes, tripsRes, invoicesRes, alertsRes, deliveredRes] = await Promise.all([
        supabase.from("trucks").select("id, status").eq("is_deleted", false),
        supabase.from("trips").select("id, trip_number, origin, destination, status, clients(company_name), trucks(registration_number)")
          .neq("status", "closed").eq("is_deleted", false).order("created_at", { ascending: false }).limit(8),
        supabase.from("invoices").select("amount_outstanding_usd, due_date, status").neq("status", "paid").eq("is_voided", false),
        supabase.from("alerts").select("id, severity, title, module, created_at").eq("is_resolved", false).order("created_at", { ascending: false }).limit(20),
        supabase.from("trips").select("id").eq("status", "delivered").eq("is_deleted", false),
      ]);
      const trucks = trucksRes.data || []; const trips = tripsRes.data || [];
      const invoices = invoicesRes.data || []; const alertsList = alertsRes.data || [];
      const delivered = deliveredRes.data || [];
      const today = new Date().toISOString().split("T")[0];
      const overdue = invoices.filter((inv: any) => inv.due_date < today);
      setProdStats({
        trucksOnRoad: trucks.filter((t: any) => t.status === "on_road").length,
        trucksInWorkshop: trucks.filter((t: any) => t.status === "in_workshop").length,
        trucksStandby: trucks.filter((t: any) => t.status === "standby").length,
        trucksOffRoad: trucks.filter((t: any) => t.status === "off_road" || t.status === "disposed").length,
        totalTrucks: trucks.length,
        moneyToCollect: invoices.reduce((s: number, i: any) => s + Number(i.amount_outstanding_usd || 0), 0),
        moneyPayable: 0, moneyOverdue: overdue.reduce((s: number, i: any) => s + Number(i.amount_outstanding_usd || 0), 0),
        activeTrips: trips.length, awaitingInvoice: delivered.length,
        alertsTotal: alertsList.length,
        alertsCritical: alertsList.filter((a: any) => a.severity === "critical").length,
        alertsWarning: alertsList.filter((a: any) => a.severity === "warning").length,
        avgCostPerKm: 0,
      });
      setProdLiveTrips(trips); setProdAlerts(alertsList);
    };
    load();
  }, [demo]);

  const stats = useMemo<Stats>(() => {
    if (!demo) return prodStats;
    const t = demo.trucks;
    // Calculate fleet average cost/km from closed trips
    const closedTrips = demo.closedTrips;
    const totalCosts = closedTrips.reduce((s, tr) => s + tr.total_costs_usd, 0);
    const totalKm = closedTrips.reduce((s, tr) => s + tr.distance_km, 0);
    const avgCpk = totalKm > 0 ? totalCosts / totalKm : 0;
    return {
      trucksOnRoad: t.filter(x => x.status === "on_road").length,
      trucksInWorkshop: t.filter(x => x.status === "in_workshop").length,
      trucksStandby: t.filter(x => x.status === "standby").length,
      trucksOffRoad: t.filter(x => x.status === "off_road").length,
      totalTrucks: t.length, moneyToCollect: demo.moneyToCollect, moneyPayable: 1278, moneyOverdue: 0,
      activeTrips: demo.openTrips.length,
      awaitingInvoice: demo.openTrips.filter(x => x.status === "delivered").length,
      alertsTotal: demo.alerts.length,
      alertsCritical: demo.alerts.filter(a => a.severity === "critical").length,
      alertsWarning: demo.alerts.filter(a => a.severity === "warning").length,
      avgCostPerKm: Math.round(avgCpk * 10) / 10,
    };
  }, [demo, demo?.trucks, demo?.openTrips, demo?.alerts, demo?.moneyToCollect, demo?.closedTrips, prodStats]);

  const liveTrips = useMemo(() => {
    if (!demo) return prodLiveTrips;
    return demo.openTrips.map(t => ({
      id: t.id, trip_number: t.trip_number, origin: t.origin,
      destination: t.destination, status: t.status,
      clients: { company_name: t.client_name },
      trucks: { registration_number: t.truck_reg },
    }));
  }, [demo, demo?.openTrips, prodLiveTrips]);

  const alerts = useMemo(() => demo ? demo.alerts : prodAlerts, [demo, demo?.alerts, prodAlerts]);

  const kpis = [
    {
      label: "Fleet Status",
      value: `Fleet Average cost per KM`,
      subText: `${stats.avgCostPerKm.toFixed(1)} cost/km`,
      borderClass: "border-l-[hsl(var(--green))]",
      icon: Truck,
    },
    {
      label: "Money to Collect",
      value: `$${stats.moneyToCollect.toLocaleString()}`,
      subText: `$${stats.moneyToCollect.toLocaleString()} receivable`,
      subText2: `$${stats.moneyPayable.toLocaleString()} payable`,
      borderClass: "border-l-accent",
      icon: DollarSign,
    },
    { label: "Active Trips", value: `${stats.activeTrips} active`, subText: `${stats.awaitingInvoice} awaiting invoice`, borderClass: "border-l-[hsl(var(--blue))]", icon: MapPin },
    { label: "Alerts", value: `${stats.alertsTotal} total`, subText: `${stats.alertsCritical} critical · ${stats.alertsWarning} warnings`, borderClass: stats.alertsTotal === 0 ? "border-l-[hsl(var(--green))]" : stats.alertsCritical > 0 ? "border-l-[hsl(var(--red))]" : "border-l-[hsl(var(--amber))]", icon: AlertTriangle },
  ];

  const quickActions = [
    { label: "New Trip", icon: Plus, action: () => navigate(`${basePath}/operations`), module: "operations" },
    { label: "New Invoice", icon: FileText, action: () => navigate(`${basePath}/accounts`), module: "accounts" },
    { label: "New Job Card", icon: Wrench, action: () => navigate(`${basePath}/workshop`), module: "workshop" },
    { label: "Issue Fuel", icon: Fuel, action: () => navigate(`${basePath}/fuel`), module: "fuel" },
  ];

  const statusBadge = (status: string) => {
    const c: Record<string, string> = { confirmed: "bg-muted text-muted-foreground", loading: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]", in_transit: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]", at_border: "bg-purple-500/10 text-purple-600", offloading: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]", delivered: "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]", invoiced: "bg-accent/10 text-accent" };
    return c[status] || "bg-muted text-muted-foreground";
  };

  const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  const sortedAlerts = [...alerts].sort((a: any, b: any) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3));
  const severityBadge = (s: string) => {
    const c: Record<string, string> = { critical: "bg-[hsl(var(--red))]/10 text-[hsl(var(--red))]", warning: "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]", info: "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]" };
    return c[s] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-card border border-border border-l-4 ${kpi.borderClass} p-4`}>
              <kpi.icon className="h-5 w-5 text-muted-foreground mb-2" />
              {kpi.label === "Fleet Status" ? (
                <>
                  <div className="text-sm font-semibold text-foreground">{kpi.value}</div>
                  <div className="text-xl font-bold font-mono text-foreground mt-1">{kpi.subText}</div>
                </>
              ) : (
                <>
                  <div className="text-xl font-bold font-mono text-foreground">{kpi.value}</div>
                  <div className="text-xs mt-1 text-muted-foreground">{kpi.subText}</div>
                  {(kpi as any).subText2 && <div className="text-xs text-muted-foreground">{(kpi as any).subText2}</div>}
                </>
              )}
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {quickActions.map(qa => (
            <Button key={qa.label} variant="outline" size="sm" onClick={qa.action}>
              <qa.icon className="h-4 w-4 mr-1.5" />{qa.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Fleet Utilisation Bar */}
            <div className="bg-card border border-border p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">Fleet Utilisation</h2>
              {(() => {
                const total = stats.totalTrucks || 1;
                const onRoadPct = Math.round((stats.trucksOnRoad / total) * 100);
                const workshopPct = Math.round((stats.trucksInWorkshop / total) * 100);
                const standbyPct = Math.round((stats.trucksStandby / total) * 100);
                const offRoadPct = Math.round((stats.trucksOffRoad / total) * 100);
                return (
                  <>
                    <div className="flex h-6 w-full rounded-sm overflow-hidden mb-3">
                      {onRoadPct > 0 && <div className="bg-[hsl(var(--green))] transition-all" style={{ width: `${onRoadPct}%` }} />}
                      {workshopPct > 0 && <div className="bg-[hsl(var(--amber))] transition-all" style={{ width: `${workshopPct}%` }} />}
                      {standbyPct > 0 && <div className="bg-muted-foreground/50 transition-all" style={{ width: `${standbyPct}%` }} />}
                      {offRoadPct > 0 && <div className="bg-[hsl(var(--red))] transition-all" style={{ width: `${offRoadPct}%` }} />}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs">
                      {[
                        { label: "On Road", count: stats.trucksOnRoad, color: "bg-[hsl(var(--green))]" },
                        { label: "In Workshop", count: stats.trucksInWorkshop, color: "bg-[hsl(var(--amber))]" },
                        { label: "Standby", count: stats.trucksStandby, color: "bg-muted-foreground/50" },
                        { label: "Off Road", count: stats.trucksOffRoad, color: "bg-[hsl(var(--red))]" },
                      ].map(s => (
                        <div key={s.label} className="flex items-center gap-1.5">
                          <div className={`h-2.5 w-2.5 rounded-sm ${s.color}`} />
                          <span className="text-muted-foreground">{s.label}</span>
                          <span className="font-bold font-mono text-foreground">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="bg-card border border-border p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">Fleet Status</h2>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "On Road", count: stats.trucksOnRoad, color: "bg-[hsl(var(--green))]" },
                  { label: "In Workshop", count: stats.trucksInWorkshop, color: "bg-[hsl(var(--amber))]" },
                  { label: "Standby", count: stats.trucksStandby, color: "bg-muted-foreground" },
                  { label: "Off Road", count: stats.trucksOffRoad, color: "bg-[hsl(var(--red))]" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold font-mono text-foreground">{s.count}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border p-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">Live Trips</h2>
              {liveTrips.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No active trips</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border">
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Trip #</th>
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Route</th>
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Client</th>
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Truck</th>
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                    </tr></thead>
                    <tbody>
                      {liveTrips.map((trip: any) => (
                        <tr key={trip.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => navigate(`${basePath}/operations`)}>
                          <td className="py-2 font-mono text-xs font-medium">{trip.trip_number}</td>
                          <td className="py-2 text-xs">{trip.origin} → {trip.destination}</td>
                          <td className="py-2 text-xs">{trip.clients?.company_name || "—"}</td>
                          <td className="py-2 font-mono text-xs">{trip.trucks?.registration_number || "—"}</td>
                          <td className="py-2"><span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusBadge(trip.status)}`}>{trip.status.replace(/_/g, " ")}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

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
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm shrink-0 mt-0.5 ${severityBadge(alert.severity)}`}>{alert.severity}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-foreground">{alert.title}</p>
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
