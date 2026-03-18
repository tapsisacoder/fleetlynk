import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Operations = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("trips")
      .select("*, clients(company_name), trucks(registration_number), employees(full_name)")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(50);
    setTrips(data || []);
    setLoading(false);
  };

  const filteredTrips = trips.filter((t) =>
    t.trip_number?.toLowerCase().includes(search.toLowerCase()) ||
    t.origin?.toLowerCase().includes(search.toLowerCase()) ||
    t.destination?.toLowerCase().includes(search.toLowerCase()) ||
    t.clients?.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-muted text-muted-foreground",
      loading: "bg-amber-500/10 text-amber-600",
      in_transit: "bg-blue-500/10 text-blue-600",
      at_border: "bg-purple-500/10 text-purple-600",
      offloading: "bg-amber-500/10 text-amber-600",
      delivered: "bg-green-500/10 text-green-600",
      invoiced: "bg-orange/10 text-orange",
      closed: "bg-muted text-muted-foreground",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  return (
    <>
      <AppHeader title="Operations">
        <Button variant="outline" size="sm" className="mr-2">
          <History className="h-4 w-4 mr-1" /> Trip History
        </Button>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setShowCreateTrip(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Trip
        </Button>
      </AppHeader>
      <div className="flex-1 overflow-auto p-6">
        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trips..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {/* Trips Table */}
        <div className="bg-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Trip #</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Route</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Truck</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Driver</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Rate (USD)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                ) : filteredTrips.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No trips found. Create your first trip.</td></tr>
                ) : (
                  filteredTrips.map((trip, i) => (
                    <motion.tr
                      key={trip.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`border-t border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-muted/40 cursor-pointer transition-colors`}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-medium">{trip.trip_number}</td>
                      <td className="px-4 py-3 text-xs">{trip.clients?.company_name || "—"}</td>
                      <td className="px-4 py-3 text-xs">{trip.origin} → {trip.destination}</td>
                      <td className="px-4 py-3 font-mono text-xs">{trip.trucks?.registration_number || "—"}</td>
                      <td className="px-4 py-3 text-xs">{trip.employees?.full_name || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">${Number(trip.rate_usd).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${statusColor(trip.status)}`}>
                          {trip.status.replace(/_/g, " ")}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Trip Dialog */}
      <Dialog open={showCreateTrip} onOpenChange={setShowCreateTrip}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Client</Label>
                <Input placeholder="Select client" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Rate (USD)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Truck</Label>
                <Input placeholder="Select truck" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Driver</Label>
                <Input placeholder="Auto-assigned" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Origin</Label>
                <Input placeholder="From" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Destination</Label>
                <Input placeholder="To" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Distance (km)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Trip Type</Label>
                <select className="w-full h-10 px-3 border border-input bg-background text-sm rounded-md">
                  <option value="local">Local</option>
                  <option value="export">Export</option>
                  <option value="import">Import</option>
                </select>
              </div>
            </div>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Create Trip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Operations;
