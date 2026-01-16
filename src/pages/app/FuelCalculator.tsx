import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  Fuel, 
  Truck, 
  TrendingDown,
  Droplets,
  RefreshCw
} from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { useTrips } from "@/hooks/useTrips";

export default function FuelCalculator() {
  const { data: vehicles = [] } = useVehicles();
  const { data: trips = [] } = useTrips();

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [distance, setDistance] = useState("");
  const [loadStatus, setLoadStatus] = useState<"loaded" | "empty">("loaded");
  const [trafficAllowance, setTrafficAllowance] = useState("0");
  const [calculated, setCalculated] = useState(false);

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  // Get consumption rates from vehicle (km per liter)
  const loadedRatio = selectedVehicleData?.fuel_consumption_loaded || 2; // 1L per 2km when loaded
  const emptyRatio = selectedVehicleData?.fuel_consumption_empty || 2.5; // 1L per 2.5km when empty

  const distanceNum = parseFloat(distance) || 0;
  const allowancePercent = parseFloat(trafficAllowance) || 0;
  const reserve = 17.5;

  // Calculate fuel: distance / ratio + reserve + allowance
  const ratio = loadStatus === "loaded" ? loadedRatio : emptyRatio;
  const baseFuel = distanceNum > 0 ? (distanceNum / ratio) + reserve : 0;
  const allowanceFuel = baseFuel * (allowancePercent / 100);
  const fuelNeeded = baseFuel + allowanceFuel;

  const fuelIfEmpty = distanceNum > 0 ? (distanceNum / emptyRatio) + reserve : 0;
  const fuelIfLoaded = distanceNum > 0 ? (distanceNum / loadedRatio) + reserve : 0;
  const fuelSavings = Math.abs(fuelIfLoaded - fuelIfEmpty);

  const handleCalculate = () => {
    if (distanceNum > 0) {
      setCalculated(true);
    }
  };

  const handleReset = () => {
    setSelectedVehicle("");
    setDistance("");
    setLoadStatus("loaded");
    setTrafficAllowance("0");
    setCalculated(false);
  };

  // Get recent trips for quick selection
  const recentTrips = trips
    .filter(t => t.distance_km && t.distance_km > 0)
    .slice(0, 5);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="w-7 h-7 text-secondary" />
            Fuel Calculator
          </h1>
          <p className="text-muted-foreground">Calculate fuel requirements for your trips</p>
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

              {/* Traffic/Terrain Allowance */}
              <div>
                <Label htmlFor="trafficAllowance">Allowance for Traffic/Terrain/Idling (%)</Label>
                <Input
                  id="trafficAllowance"
                  type="number"
                  step="1"
                  min="0"
                  max="50"
                  value={trafficAllowance}
                  onChange={(e) => {
                    setTrafficAllowance(e.target.value);
                    setCalculated(false);
                  }}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add extra fuel buffer for uncertain conditions (0-50%)
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
                  THE BIG RESULT
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
                      ({distance}km ÷ {ratio}km/L) + {reserve}L reserve = {baseFuel.toFixed(1)}L
                    </p>
                    {allowancePercent > 0 && (
                      <p className="font-mono text-muted-foreground">
                        + {allowancePercent}% allowance = {fuelNeeded.toFixed(1)}L total
                      </p>
                    )}
                    <p className="text-xs text-blue-600 mt-2">
                      📊 ML Ready: This calculation will be used to improve future predictions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comparison Card */}
            {calculated && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${loadStatus === 'loaded' ? 'bg-secondary/10 ring-2 ring-secondary' : 'bg-muted/50'}`}>
                      <p className="text-sm text-muted-foreground">If Loaded</p>
                      <p className="text-2xl font-bold">{fuelIfLoaded.toFixed(1)} L</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ({distance} ÷ {loadedRatio}) + {reserve}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${loadStatus === 'empty' ? 'bg-secondary/10 ring-2 ring-secondary' : 'bg-muted/50'}`}>
                      <p className="text-sm text-muted-foreground">If Empty</p>
                      <p className="text-2xl font-bold">{fuelIfEmpty.toFixed(1)} L</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        ({distance} ÷ {emptyRatio}) + {reserve}
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg">
                    <p className="text-sm text-green-600">
                      Empty trips use <span className="font-bold">{fuelSavings.toFixed(1)} liters less</span> fuel
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
