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
import { CheckCircle2 } from "lucide-react";

export default function DemoDeploy() {
  const navigate = useNavigate();
  const [deployed, setDeployed] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("ZWE-8472");
  const [loadStatus, setLoadStatus] = useState("loaded");
  const [notes, setNotes] = useState("Cargo: Steel coils, 22 tons");

  const handleDeploy = () => {
    setDeployed(true);
  };

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  if (deployed) {
    return (
      <DemoLayout>
        <div className="max-w-2xl mx-auto pt-12">
          <Card className="p-12 text-center bg-green-50 border-green-200">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              ✅ Trip Deployed Successfully!
            </h2>
            <p className="text-lg text-gray-700 mb-2">
              TRIP-2025-043 is now active
            </p>
            <p className="text-gray-600 mb-8">
              Vehicle {selectedVehicle} status: Deployed
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => navigate("/demo/dashboard")}
                className="bg-primary"
              >
                View on Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => setDeployed(false)}
              >
                Deploy Another
              </Button>
            </div>
          </Card>
        </div>
      </DemoLayout>
    );
  }

  return (
    <DemoLayout>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form - Left Side (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-primary">Deploy New Trip</h1>

          <Card className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">TRIP DETAILS</h2>

            <div className="space-y-6">
              <div>
                <Label className="text-base">Trip Reference:</Label>
                <Input
                  value="TRIP-2025-043"
                  readOnly
                  className="mt-2 bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">(auto-generated)</p>
              </div>

              <div>
                <Label className="text-base mb-3 block">📍 Route</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from" className="text-sm">From:</Label>
                    <Input id="from" value="Harare, Zimbabwe" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="to" className="text-sm">To:</Label>
                    <Input id="to" value="Beira, Mozambique" className="mt-1" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Distance: 600 km</p>
              </div>

              <div>
                <Label htmlFor="vehicle" className="text-base">🚛 Vehicle</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.status === "available").map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.id} - {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-green-600 mt-1">Status: Available ✅</p>
              </div>

              <div>
                <Label className="text-base mb-3 block">📦 Load Status</Label>
                <RadioGroup value={loadStatus} onValueChange={setLoadStatus}>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="loaded" id="loaded-deploy" />
                      <Label htmlFor="loaded-deploy" className="cursor-pointer">Loaded</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="empty" id="empty-deploy" />
                      <Label htmlFor="empty-deploy" className="cursor-pointer">Empty</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base">⛽ Fuel Allocation</Label>
                <Input
                  value="228 liters"
                  readOnly
                  className="mt-2 bg-gray-50 font-medium"
                />
                <p className="text-sm text-gray-500 mt-1">(Based on your calculation)</p>
              </div>

              <div>
                <Label className="text-base mb-3 block">📅 Departure</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-sm">Date:</Label>
                    <Input id="date" type="date" value="2025-12-03" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-sm">Time:</Label>
                    <Input id="time" type="time" value="08:00" className="mt-1" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="odometer" className="text-base">📝 Start Odometer</Label>
                <Input
                  id="odometer"
                  type="number"
                  value="245670"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">km</p>
              </div>

              <div>
                <Label htmlFor="notes-deploy" className="text-base">Notes (optional):</Label>
                <Textarea
                  id="notes-deploy"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/demo/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDeploy}
                  className="flex-1 bg-accent hover:bg-accent/90 text-lg"
                >
                  🚀 Deploy Trip
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Panel - Right Side (1/3 width) */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">TRIP SUMMARY</h3>
            
            <div className="space-y-3">
              <div className="pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Vehicle:</p>
                <p className="font-medium text-gray-900">{selectedVehicle}</p>
                <p className="text-sm text-gray-600">
                  Engine: {selectedVehicleData?.model}
                </p>
              </div>

              <div className="pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Route:</p>
                <p className="font-medium text-gray-900">600 km</p>
                <p className="text-sm text-gray-600">Harare → Beira</p>
              </div>

              <div className="pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Fuel:</p>
                <p className="font-medium text-gray-900">228 L</p>
                <p className="text-sm text-gray-600">Load: {loadStatus}</p>
              </div>

              <div className="pb-3 border-b border-gray-200">
                <p className="text-sm text-gray-600">Departure:</p>
                <p className="font-medium text-gray-900">03 Dec 2025, 08:00</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Expected Arrival:</p>
                <p className="font-medium text-gray-900">04 Dec 2025, 16:00</p>
                <p className="text-xs text-gray-500">(estimated)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DemoLayout>
  );
}
