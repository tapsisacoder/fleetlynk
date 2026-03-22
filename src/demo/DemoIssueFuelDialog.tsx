import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoContext } from "./DemoContext";
import { useState } from "react";
import { toast } from "sonner";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export const DemoIssueFuelDialog = ({ open, onOpenChange }: Props) => {
  const demo = useDemoContext();
  const [truckReg, setTruckReg] = useState("");
  const [tripNumber, setTripNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [litres, setLitres] = useState("");

  if (!demo) return null;

  const truckTrips = demo.openTrips.filter(t => t.truck_reg === truckReg);
  const selectedSupplier = demo.fuelSuppliers.find(s => s.supplier_name === supplier);
  const totalCost = selectedSupplier && litres ? Number(litres) * selectedSupplier.price_per_litre : 0;
  const isAnomaly = tripNumber === "TRP-2026-0028" && supplier === "SOM Petroleum";

  const handleConfirm = () => {
    if (!truckReg || !tripNumber || !supplier || !litres) return;
    demo.issueFuel(truckReg, Number(litres), supplier, tripNumber);
    if (isAnomaly) {
      toast.error("⚠ FUEL ANOMALY DETECTED — TRP-2026-0028 — +61% variance", { duration: 5000 });
    } else {
      toast.success(`${litres}L issued to ${truckReg}`);
    }
    onOpenChange(false);
    setTruckReg(""); setTripNumber(""); setSupplier(""); setLitres("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-foreground">Issue Fuel</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Truck</Label>
            <Select value={truckReg} onValueChange={v => { setTruckReg(v); setTripNumber(""); }}>
              <SelectTrigger><SelectValue placeholder="Select truck..." /></SelectTrigger>
              <SelectContent>
                {demo.trucks.map(t => (
                  <SelectItem key={t.id} value={t.registration_number}>
                    <span className="font-mono">{t.registration_number}</span> ({t.fleet_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Trip</Label>
            <Select value={tripNumber} onValueChange={setTripNumber}>
              <SelectTrigger><SelectValue placeholder="Select trip..." /></SelectTrigger>
              <SelectContent>
                {truckTrips.map(t => (
                  <SelectItem key={t.id} value={t.trip_number}>
                    {t.trip_number} — {t.origin} → {t.destination}
                  </SelectItem>
                ))}
                {truckTrips.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">No active trips for this truck</div>}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger><SelectValue placeholder="Select supplier..." /></SelectTrigger>
              <SelectContent>
                {demo.fuelSuppliers.map(s => (
                  <SelectItem key={s.id} value={s.supplier_name}>
                    {s.supplier_name} — ${s.price_per_litre.toFixed(2)}/L
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Litres</Label>
            <Input value={litres} onChange={e => setLitres(e.target.value)} type="number" className="font-mono" placeholder="e.g. 120" />
          </div>
          {totalCost > 0 && (
            <div className={`p-3 rounded-sm ${isAnomaly ? "bg-destructive/10 border border-destructive/20" : "bg-muted"}`}>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Cost</span>
                <span className="font-mono font-bold">${totalCost.toFixed(2)}</span>
              </div>
              {isAnomaly && <p className="text-[10px] text-destructive mt-1 font-medium">⚠ This will trigger a fuel anomaly alert (+61% variance)</p>}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleConfirm} disabled={!truckReg || !tripNumber || !supplier || !litres}>
            Confirm Fuel Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
