import { useNavigate } from "react-router-dom";
import { DemoLayout } from "@/components/demo/DemoLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { activeTrips } from "@/data/demoData";
import { Search } from "lucide-react";

export default function DemoActiveTrips() {
  const navigate = useNavigate();

  return (
    <DemoLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Active Trips</h1>
          <Button 
            onClick={() => navigate("/demo/deploy")}
            className="bg-accent hover:bg-accent/90 gap-2"
          >
            🚀 Deploy Trip
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search trips by reference, vehicle, or route..."
            className="pl-10"
          />
        </div>

        {/* Active Trips Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {activeTrips.map((trip) => (
            <Card key={trip.reference} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{trip.reference}</h3>
                  <p className="text-sm text-gray-600">
                    Status: <span className="text-green-600 font-medium">IN TRANSIT 🟢</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                    Vehicle: <span className="font-medium text-gray-900">{trip.vehicle} ({trip.vehicleModel})</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Route: <span className="font-medium text-gray-900">{trip.route.from} → {trip.route.to}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Driver: <span className="font-medium text-gray-900">{trip.driver}</span>
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    ⏳ Awaiting Proof of Delivery...
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Started: {trip.started}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Log Fuel Stop
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  Generate Invoice
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DemoLayout>
  );
}
