import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calculator, 
  Truck, 
  Droplets,
  RefreshCw,
  Fuel
} from "lucide-react";
import { useVehicles, useUpdateVehicle } from "@/hooks/useVehicles";
import { useTrips } from "@/hooks/useTrips";
import { useToast } from "@/hooks/use-toast";

export default function FuelCalculator() {
  const { data: vehicles = [] } = useVehicles();
  const { data: trips = [] } = useTrips();
  const updateVehicle = useUpdateVehicle();
  const { toast } = useToast();

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [distance, setDistance] = useState("");
  const [loadStatus, setLoadStatus] = useState<"loaded" | "empty">("loaded");
  const [uncertaintyLiters, setUncertaintyLiters] = useState("0");
  const [calculated, setCalculated] = useState(false);

  // Fuel up dialog state
  const [fuelUpOpen, setFuelUpOpen] = useState(false);
  const [fuelUpVehicle, setFuelUpVehicle] = useState("");
  const [fuelUpAmount, setFuelUpAmount] = useState("");

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  // Get consumption rates from vehicle (km per liter)
  const loadedRatio = selectedVehicleData?.fuel_consumption_loaded || 2;
  const emptyRatio = selectedVehicleData?.fuel_consumption_empty || 2.5;

  const distanceNum = parseFloat(distance) || 0;
  const uncertaintyNum = parseFloat(uncertaintyLiters) || 0;

  // Calculate fuel: distance / ratio + uncertainty (no reserve)
  const ratio = loadStatus === "loaded" ? loadedRatio : emptyRatio;
  const baseFuel = distanceNum > 0 ? (distanceNum / ratio) : 0;
  const fuelNeeded = baseFuel + uncertaintyNum;

  const handleCalculate = () => {
    if (distanceNum > 0) {
      setCalculated(true);
    }
  };

  const handleReset = () => {
    setSelectedVehicle("");
    setDistance("");
    setLoadStatus("loaded");
    setUncertaintyLiters("0");
    setCalculated(false);
  };

  const handleFuelUp = async () => {
    if (!fuelUpVehicle || !fuelUpAmount) {
      toast({ title: 'Please select vehicle and enter amount', variant: 'destructive' });
      return;
    }

    const vehicle = vehicles.find(v => v.id === fuelUpVehicle);
    if (!vehicle) return;

    const currentLevel = vehicle.current_fuel_level || 0;
    const tankCapacity = vehicle.tank_capacity_liters || 800;
    const addAmount = parseFloat(fuelUpAmount);
    const newLevel = Math.min(currentLevel + addAmount, tankCapacity);

    try {
      // Use any cast since current_fuel_level was just added to schema
      await updateVehicle.mutateAsync({
        id: fuelUpVehicle,
        current_fuel_level: newLevel,
      } as any);
      toast({ 
        title: 'Fuel added successfully',
        description: `Added ${addAmount}L to ${vehicle.registration_number}. New level: ${newLevel}L`
      });
      setFuelUpOpen(false);
      setFuelUpVehicle("");
      setFuelUpAmount("");
    } catch (error: any) {
      toast({ title: 'Error adding fuel', description: error.message, variant: 'destructive' });
    }
  };

  // Get recent trips for quick selection
  const recentTrips = trips
    .filter(t => t.distance_km && t.distance_km > 0)
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calculator className="w-7 h-7 text-secondary" />
              Fuel Calculator
            </h1>
            <p className="text-muted-foreground">Calculate fuel requirements for your trips</p>
          </div>
          <Dialog open={fuelUpOpen} onOpenChange={setFuelUpOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Fuel className="w-4 h-4" />
                Fuel Up
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Fuel to Vehicle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Select Vehicle *</Label>
                  <Select value={fuelUpVehicle} onValueChange={setFuelUpVehicle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.filter(v => v.is_active).map(vehicle => {
                        const currentLevel = vehicle.current_fuel_level || 0;
                        const tankCapacity = vehicle.tank_capacity_liters || 800;
                        return (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registration_number} ({currentLevel}L / {tankCapacity}L)
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuel Amount (Liters) *</Label>
                  <Input
                    type="number"
                    value={fuelUpAmount}
                    onChange={(e) => setFuelUpAmount(e.target.value)}
                    placeholder="e.g., 500"
                  />
                </div>

                {fuelUpVehicle && (
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    {(() => {
                      const vehicle = vehicles.find(v => v.id === fuelUpVehicle);
                      if (!vehicle) return null;
                      const currentLevel = vehicle.current_fuel_level || 0;
                      const tankCapacity = vehicle.tank_capacity_liters || 800;
                      const addAmount = parseFloat(fuelUpAmount) || 0;
                      const newLevel = Math.min(currentLevel + addAmount, tankCapacity);
                      return (
                        <>
                          <p>Current: <span className="font-medium">{currentLevel}L</span></p>
                          <p>After fill: <span className="font-medium">{newLevel}L</span></p>
                          <p className="text-muted-foreground">Tank capacity: {tankCapacity}L</p>
                        </>
                      );
                    })()}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setFuelUpOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleFuelUp} 
                    disabled={!fuelUpVehicle || !fuelUpAmount || updateVehicle.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {updateVehicle.isPending ? 'Adding...' : 'Add Fuel'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Selection */}
              <div>
                <Label>Vehicle (optional)</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle for specific consumption rates" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.is_active).map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.registration_number} - {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVehicleData && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Loaded: 1L per {selectedVehicleData.fuel_consumption_loaded}km | 
                    Empty: 1L per {selectedVehicleData.fuel_consumption_empty}km
                  </p>
                )}
              </div>

              {/* Distance */}
              <div>
                <Label htmlFor="distance">Distance Traveled (km) *</Label>
                <Input
                  id="distance"
                  type="number"
                  value={distance}
                  onChange={(e) => {
                    setDistance(e.target.value);
                    setCalculated(false);
                  }}
                  placeholder="e.g., 560"
                  className="text-lg"
                />
              </div>

              {/* Quick Select from Recent Trips */}
              {recentTrips.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Quick select from recent trips:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recentTrips.map(trip => (
                      <Button
                        key={trip.id}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDistance(trip.distance_km?.toString() || "");
                          setCalculated(false);
                        }}
                      >
                        {trip.origin.split(',')[0]} → {trip.destination.split(',')[0]} ({trip.distance_km}km)
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Load Status */}
              <div>
                <Label>Load Status</Label>
                <Select value={loadStatus} onValueChange={(v: "loaded" | "empty") => {
                  setLoadStatus(v);
                  setCalculated(false);
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loaded">🚛 Loaded (Full Cargo)</SelectItem>
                    <SelectItem value="empty">📦 Empty (No Cargo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Uncertainty Allowance - In Liters */}
              <div>
                <Label htmlFor="uncertaintyLiters">Allowance for Uncertainties (Liters)</Label>
                <Input
                  id="uncertaintyLiters"
                  type="number"
                  step="1"
                  min="0"
                  value={uncertaintyLiters}
                  onChange={(e) => {
                    setUncertaintyLiters(e.target.value);
                    setCalculated(false);
                  }}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add extra fuel buffer for traffic, terrain, or idling
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleCalculate} 
                  className="flex-1 bg-secondary hover:bg-secondary/90"
                  disabled={!distance || parseFloat(distance) <= 0}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {/* Main Result */}
            <Card className={`${calculated ? 'ring-2 ring-secondary' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-secondary" />
                  Fuel Required
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-6xl font-bold text-secondary">
                    {calculated ? fuelNeeded.toFixed(1) : "—"}
                  </p>
                  <p className="text-xl text-muted-foreground mt-2">LITERS</p>
                </div>
                {calculated && (
                  <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                    <p className="font-medium mb-1">Formula Used:</p>
                    <p className="font-mono text-muted-foreground">
                      {distance}km ÷ {ratio}km/L = {baseFuel.toFixed(1)}L
                    </p>
                    {uncertaintyNum > 0 && (
                      <p className="font-mono text-muted-foreground">
                        + {uncertaintyNum}L uncertainty = {fuelNeeded.toFixed(1)}L total
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle Tank Info */}
            {calculated && selectedVehicleData && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Tank Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Tank Size:</span>
                    <span className="font-bold">{selectedVehicleData.tank_capacity_liters} L</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 mb-2">
                    <div 
                      className={`h-4 rounded-full transition-all ${
                        (fuelNeeded / (selectedVehicleData.tank_capacity_liters || 800)) > 0.9 
                          ? 'bg-destructive' 
                          : 'bg-secondary'
                      }`}
                      style={{ 
                        width: `${Math.min((fuelNeeded / (selectedVehicleData.tank_capacity_liters || 800)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {fuelNeeded <= (selectedVehicleData.tank_capacity_liters || 800) 
                      ? `✓ Single tank sufficient (${((fuelNeeded / (selectedVehicleData.tank_capacity_liters || 800)) * 100).toFixed(0)}% of capacity)`
                      : `⚠ Requires refueling en-route`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
