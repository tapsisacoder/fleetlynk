import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DemoLayout } from "@/components/demo/DemoLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vehicles } from "@/data/demoData";

export default function DemoCalculator() {
  const navigate = useNavigate();
  const [startPoint, setStartPoint] = useState("Beira");
  const [endPoint, setEndPoint] = useState("Harare");
  const [loadStatus, setLoadStatus] = useState("loaded");
  const [selectedEngine, setSelectedEngine] = useState("Scania DC13");
  const [buffer, setBuffer] = useState("5");
  const [calculated, setCalculated] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [notes, setNotes] = useState("Harare to Beira route");
  
  const distance = 560;

  const handleCalculate = () => {
    setCalculated(true);
  };

  const bufferValue = 17.5;
  const fuelNeeded = 297.5;
  const baseFuel = 280.0;
  const emptyFuel = 241.5;
  const fuelEfficiency = loadStatus === "loaded" ? 2 : 2.5;

  return (
    <DemoLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Fuel Calculator
          </h1>
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">TRIP DETAILS</h2>

          <div className="space-y-6">
            <div>
              <Label className="text-base mb-2 block">Route:</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start" className="text-sm">Start Point:</Label>
                  <Select value={startPoint} onValueChange={setStartPoint}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Harare">Harare, Zimbabwe</SelectItem>
                      <SelectItem value="Beira">Beira, Mozambique</SelectItem>
                      <SelectItem value="Johannesburg">Johannesburg, South Africa</SelectItem>
                      <SelectItem value="Lusaka">Lusaka, Zambia</SelectItem>
                      <SelectItem value="Bulawayo">Bulawayo, Zimbabwe</SelectItem>
                      <SelectItem value="Mutare">Mutare, Zimbabwe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="end" className="text-sm">End Point:</Label>
                  <Select value={endPoint} onValueChange={setEndPoint}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Harare">Harare, Zimbabwe</SelectItem>
                      <SelectItem value="Beira">Beira, Mozambique</SelectItem>
                      <SelectItem value="Johannesburg">Johannesburg, South Africa</SelectItem>
                      <SelectItem value="Lusaka">Lusaka, Zambia</SelectItem>
                      <SelectItem value="Bulawayo">Bulawayo, Zimbabwe</SelectItem>
                      <SelectItem value="Mutare">Mutare, Zimbabwe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Distance: <span className="font-medium">{distance} km</span>
              </p>
            </div>

            <div>
              <Label className="text-base mb-3 block">Load Status:</Label>
              <RadioGroup value={loadStatus} onValueChange={setLoadStatus}>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="loaded" id="loaded" />
                    <Label htmlFor="loaded" className="cursor-pointer">Loaded</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="empty" id="empty" />
                    <Label htmlFor="empty" className="cursor-pointer">Empty</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="engine" className="text-base">Engine:</Label>
              <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scania DC13">Scania DC13</SelectItem>
                  <SelectItem value="Cummins X15">Cummins X15</SelectItem>
                  <SelectItem value="Volvo D13">Volvo D13</SelectItem>
                  <SelectItem value="Mercedes OM 471">Mercedes OM 471</SelectItem>
                  <SelectItem value="Detroit DD15">Detroit DD15</SelectItem>
                  <SelectItem value="Renault DTI 13">Renault DTI 13</SelectItem>
                  <SelectItem value="Scania DC16">Scania DC16</SelectItem>
                  <SelectItem value="Cummins X12">Cummins X12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="buffer" className="text-base">Buffer for Uncertainty:</Label>
              <Select value={buffer} onValueChange={setBuffer}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1% - Ideal conditions</SelectItem>
                  <SelectItem value="2">2% - Good conditions</SelectItem>
                  <SelectItem value="3">3% - Normal conditions</SelectItem>
                  <SelectItem value="4">4% - Some traffic</SelectItem>
                  <SelectItem value="5">5% - Moderate traffic/terrain</SelectItem>
                  <SelectItem value="6">6% - Heavy traffic</SelectItem>
                  <SelectItem value="7">7% - Difficult terrain</SelectItem>
                  <SelectItem value="8">8% - Very difficult</SelectItem>
                  <SelectItem value="9">9% - Extreme conditions</SelectItem>
                  <SelectItem value="10">10% - Maximum buffer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                ℹ️ Account for terrain, idling, and traffic conditions
              </p>
            </div>

            <Button 
              onClick={handleCalculate}
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            >
              Calculate Fuel →
            </Button>
          </div>
        </Card>

        {calculated && (
          <>
            {/* Big Result */}
            <Card className="p-12 bg-gradient-to-br from-accent to-accent/90 text-white text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-2">
                💧 FUEL NEEDED: {fuelNeeded} LITERS
              </h2>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">CALCULATION BREAKDOWN</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Load Status:</span>
                  <span className="font-medium capitalize">{loadStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Efficiency:</span>
                  <span className="font-medium">{fuelEfficiency} km/litre ({loadStatus})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine:</span>
                  <span className="font-medium">{selectedEngine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Buffer:</span>
                  <span className="font-medium">{buffer}%</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="font-mono text-sm mb-2">Formula Used:</p>
                <p className="font-mono text-sm">({distance} ÷ {fuelEfficiency}) + buffer ({buffer}%) = {fuelNeeded} litres</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fuel:</span>
                  <span className="font-medium">{baseFuel} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Buffer Reserve:</span>
                  <span className="font-medium">+{bufferValue} L</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total Fuel Needed:</span>
                  <span className="font-bold text-gray-900">{fuelNeeded} L</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  💡 Comparison if empty:
                </p>
                <p className="text-sm text-gray-700">
                  {emptyFuel} litres (-{(fuelNeeded - emptyFuel).toFixed(1)}L difference)
                </p>
                <p className="text-xs text-gray-600 mt-1 font-mono">
                  Formula for empty: ({distance} ÷ 2.5) + buffer ({buffer}%) = {emptyFuel} litres
                </p>
              </div>
            </Card>

            {/* Visual Comparison */}
            <Card className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">LOADED vs EMPTY COMPARISON</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Loaded:</span>
                    <span className="text-sm font-bold">{fuelNeeded} L</span>
                  </div>
                  <div className="h-8 bg-accent rounded-lg" style={{ width: '100%' }}></div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Empty:</span>
                    <span className="text-sm font-bold">{emptyFuel} L</span>
                  </div>
                  <div className="h-8 bg-primary rounded-lg" style={{ width: `${(emptyFuel / fuelNeeded) * 100}%` }}></div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg mt-4">
                  <p className="text-sm font-medium text-green-800">
                    Saving when empty: {(fuelNeeded - emptyFuel).toFixed(1)} litres 
                    ({(((fuelNeeded - emptyFuel) / fuelNeeded) * 100).toFixed(1)}% less fuel)
                  </p>
                </div>
              </div>
            </Card>

            {/* Save Options */}
            <Card className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Save Calculation</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehicle">Vehicle (optional):</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select vehicle to link calculation" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.id} - {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="trip-ref">Trip Reference (optional):</Label>
                  <Input
                    id="trip-ref"
                    value="TRIP-2025-043"
                    readOnly
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes:</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setCalculated(false)}>
                    Clear & Recalculate
                  </Button>
                  <Button 
                    className="flex-1 bg-accent hover:bg-accent/90"
                    onClick={() => navigate("/demo/deploy")}
                  >
                    Deploy Trip Now →
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </DemoLayout>
  );
}
