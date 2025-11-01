import { DemoLayout } from "@/components/demo/DemoLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vehicles } from "@/data/demoData";
import { Plus } from "lucide-react";

export default function DemoVehicles() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "text-green-600";
      case "available":
        return "text-gray-600";
      default:
        return "text-gray-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "deployed":
        return "🟢 DEPLOYED";
      case "available":
        return "⚪ AVAILABLE";
      default:
        return "⚫ INACTIVE";
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance < 0) return "text-green-600";
    if (variance > 2) return "text-orange-600";
    return "text-gray-600";
  };

  return (
    <DemoLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">My Fleet</h1>
          <Button className="bg-primary gap-2">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button variant="default">All Vehicles (8)</Button>
          <Button variant="ghost">Available (6)</Button>
          <Button variant="ghost">Deployed (2)</Button>
          <Button variant="ghost">Inactive (0)</Button>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{vehicle.id}</h3>
                  <p className={`text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                    {getStatusBadge(vehicle.status)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">{vehicle.model}</p>
                  <p className="text-sm text-gray-600">Tank: {vehicle.tankCapacity}L</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">Consumption:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Empty:</span>{" "}
                      <span className="font-medium">{vehicle.consumption.empty} L/100km</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Loaded:</span>{" "}
                      <span className="font-medium">{vehicle.consumption.loaded} L/100km</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Performance:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trips:</span>
                      <span className="font-medium">{vehicle.performance.trips}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Efficiency:</span>
                      <span className="font-medium">{vehicle.performance.avgEfficiency} L/100km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variance:</span>
                      <span className={`font-medium ${getVarianceColor(vehicle.performance.variance)}`}>
                        {vehicle.performance.variance > 0 ? '+' : ''}{vehicle.performance.variance}%{' '}
                        {vehicle.performance.variance < -2 ? '✅ (Better than expected)' : 
                         vehicle.performance.variance > 2 ? '⚠️ (Check this)' : '✅'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Last Trip:</span>
                    <span className="font-medium">{vehicle.lastTrip}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Odometer:</span>
                    <span className="font-medium">{vehicle.odometer.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="icon">
                    <span>•••</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DemoLayout>
  );
}
