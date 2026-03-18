import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Truck, DollarSign, MapPin, AlertTriangle, Plus, FileText, Wrench, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ trucksOnRoad: 0, totalTrucks: 0, moneyToCollect: 0, activeTrips: 0, alerts: 0 });
  const [recentTrips, setRecentTrips] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [trucksRes, tripsRes, invoicesRes, alertsRes] = await Promise.all([
        supabase.from("trucks").select("id, status").eq("is_deleted", false),
        supabase.from("trips").select("id, trip_number, origin, destination, status, client_id, truck_id").neq("status", "closed").eq("is_deleted", false).order("created_at", { ascending: false }).limit(8),
        supabase.from("invoices").select("amount_outstanding_usd").neq("status", "paid").eq("is_voided", false),
        supabase.from("alerts").select("id, severity").eq("is_resolved", false),
      ]);

      const trucks = trucksRes.data || [];
      const trips = tripsRes.data || [];
      const invoices = invoicesRes.data || [];
      const alerts = alertsRes.data || [];

      setStats({
        trucksOnRoad: trucks.filter((t: any) => t.status === "on_road").length,
        totalTrucks: trucks.length,
        moneyToCollect: invoices.reduce((sum: number, inv: any) => sum + Number(inv.amount_outstanding_usd || 0), 0),
        activeTrips: trips.length,
        alerts: alerts.length,
      });
      setRecentTrips(trips);
    };
    load();
  }, []);

  const kpis = [
    {
      label: "Trucks on Road",
      value: `${stats.trucksOnRoad} of ${stats.totalTrucks}`,
      border: stats.trucksOnRoad > 0 ? "border-l-green-500" : "border-l-amber-500",
      icon: Truck,
    },
    {
      label: "Money to Collect",
      value: `$${stats.moneyToCollect.toLocaleString()}`,
      border: "border-l-orange",
      icon: DollarSign,
    },
    {
      label: "Active Trips",
      value: `${stats.activeTrips} active`,
      border: "border-l-blue-500",
      icon: MapPin,
    },
    {
      label: "Alerts",
      value: `${stats.alerts} total`,
      border: stats.alerts === 0 ? "border-l-green-500" : stats.alerts <= 5 ? "border-l-amber-500" : "border-l-red-500",
      icon: AlertTriangle,
    },
  ];

  const quickActions = [
    { label: "New Trip", icon: Plus, action: () => navigate("/app/operations"), module: "operations" },
    { label: "New Invoice", icon: FileText, action: () => navigate("/app/accounts"), module: "accounts" },
    { label: "New Job Card", icon: Wrench, action: () => navigate("/app/workshop"), module: "workshop" },
    { label: "Issue Fuel", icon: Fuel, action: () => navigate("/app/fuel"), module: "fuel" },
  ];

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
              className={`bg-card border border-border border-l-4 ${kpi.border} p-4`}
            >
              <kpi.icon className="h-5 w-5 text-muted-foreground mb-2" />
              <div className="text-xl font-bold font-mono text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{kpi.label}</div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fleet Status / Live Trips */}
          <div className="lg:col-span-2 bg-card border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Live Trips</h2>
            {recentTrips.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No active trips</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Trip #</th>
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Route</th>
                      <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrips.map((trip: any) => (
                      <tr key={trip.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => navigate("/app/operations")}>
                        <td className="py-2 font-mono text-xs">{trip.trip_number}</td>
                        <td className="py-2 text-xs">{trip.origin} → {trip.destination}</td>
                        <td className="py-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                            trip.status === "in_transit" ? "bg-blue-500/10 text-blue-600" :
                            trip.status === "delivered" ? "bg-green-500/10 text-green-600" :
                            "bg-muted text-muted-foreground"
                          }`}>
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

          {/* Alerts */}
          <div className="bg-card border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Requires Action</h2>
            <p className="text-sm text-muted-foreground py-8 text-center">
              {stats.alerts === 0 ? "All clear" : `${stats.alerts} alerts pending`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
