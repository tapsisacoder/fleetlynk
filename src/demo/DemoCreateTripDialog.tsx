import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoContext } from "./DemoContext";
import { useState } from "react";
import { toast } from "sonner";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const DemoCreateTripDialog = ({ open, onOpenChange }: Props) => {
  const demo = useDemoContext();
  const [selectedTruck, setSelectedTruck] = useState("");
  const [selectedClient, setSelectedClient] = useState("c3");
  const [origin, setOrigin] = useState("Beira");
  const [destination, setDestination] = useState("Harare");
  const [distance, setDistance] = useState("600");
  const [tripType, setTripType] = useState("Import");
  const [rate, setRate] = useState("1500");
  const [loadType, setLoadType] = useState("Containers");

  if (!demo) return null;

  const truck = demo.trucks.find(t => t.id === selectedTruck);
  const driver = truck ? demo.employees.find(e => e.id === truck.default_driver_id) : null;
  const trailer = truck ? demo.trailers.find(tr => tr.id === truck.default_trailer_id) : null;

  const handleConfirm = () => {
    demo.confirmTrip();
    toast.success("Trip TRP-2026-0029 confirmed — AEU 1313 now ON ROAD");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-foreground">New Trip</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Trip Number</Label>
            <Input value="TRP-2026-0029" disabled className="font-mono bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{demo.clients.map(c => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Trip Type</Label>
              <Select value={tripType} onValueChange={setTripType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Export">Export</SelectItem>
                  <SelectItem value="Import">Import</SelectItem>
                  <SelectItem value="Local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs text-muted-foreground">Origin</Label><Input value={origin} onChange={e => setOrigin(e.target.value)} /></div>
            <div><Label className="text-xs text-muted-foreground">Destination</Label><Input value={destination} onChange={e => setDestination(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs text-muted-foreground">Distance (km)</Label><Input value={distance} onChange={e => setDistance(e.target.value)} type="number" /></div>
            <div><Label className="text-xs text-muted-foreground">Load Type</Label><Input value={loadType} onChange={e => setLoadType(e.target.value)} /></div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Truck</Label>
            <Select value={selectedTruck} onValueChange={setSelectedTruck}>
              <SelectTrigger><SelectValue placeholder="Select truck..." /></SelectTrigger>
              <SelectContent>
                {demo.trucks.map(t => {
                  const avail = t.status === "standby";
                  return (
                    <SelectItem key={t.id} value={t.id} disabled={!avail}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono">{t.registration_number}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${avail ? "bg-[hsl(var(--green))]/10 text-[hsl(var(--green))]" : t.status === "in_workshop" ? "bg-[hsl(var(--amber))]/10 text-[hsl(var(--amber))]" : "bg-[hsl(var(--blue))]/10 text-[hsl(var(--blue))]"}`}>
                          {t.status.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs text-muted-foreground">Trailer (auto)</Label><Input value={trailer?.registration_number || ""} disabled className="bg-muted font-mono" /></div>
            <div><Label className="text-xs text-muted-foreground">Driver (auto)</Label><Input value={driver?.full_name || ""} disabled className="bg-muted" /></div>
          </div>
          <div><Label className="text-xs text-muted-foreground">Rate (USD)</Label><Input value={rate} onChange={e => setRate(e.target.value)} type="number" className="font-mono" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleConfirm} disabled={!selectedTruck || demo.tripCreated}>
            {demo.tripCreated ? "Trip Already Created" : "Confirm Trip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
