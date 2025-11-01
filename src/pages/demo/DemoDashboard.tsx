import { useNavigate } from "react-router-dom";
import { DemoLayout } from "@/components/demo/DemoLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { activeTrips, recentActivity } from "@/data/demoData";
import { Truck, MapPin, TrendingDown, AlertTriangle, Plus } from "lucide-react";

export default function DemoDashboard() {
  const navigate = useNavigate();

  return (
    <DemoLayout>
      <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">8 Active Trucks</p>
                <p className="text-xs text-gray-500 mt-1">2 In Transit • 6 Available</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-gray-900">2 Trips Active</p>
                <p className="text-xs text-gray-500 mt-1">1 Expected Today • 0 Overdue</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">12,480 L Fuel Used</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  vs 13,200 L Expected • -720 L Saved! (R15,840)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-gray-900">3 Documents Expiring</p>
                <button 
                  onClick={() => navigate("/demo/documents")}
                  className="text-xs text-accent font-medium mt-1 hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
          <Button 
            onClick={() => navigate("/demo/calculator")}
            className="bg-accent hover:bg-accent/90 gap-2"
          >
            🧮 Calculate Fuel
          </Button>
          <Button 
            onClick={() => navigate("/demo/deploy")}
            className="bg-accent hover:bg-accent/90 gap-2"
          >
            🚀 Deploy Trip
          </Button>
        </div>

        {/* Active Trips Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Active Trips</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="ghost" size="sm">In Transit</Button>
              <Button variant="ghost" size="sm">Arriving Today</Button>
            </div>
          </div>

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
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{trip.progress}%</span>
                    </div>
                    <Progress value={trip.progress} className="h-2" />
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="text-gray-600">Expected Fuel:</span>{" "}
                      <span className="font-medium">{trip.fuel.expected} L</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Used So Far:</span>{" "}
                      <span className="font-medium">{trip.fuel.used} L</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Variance:</span>{" "}
                      <span className={`font-medium ${trip.fuel.variance < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {trip.fuel.variance > 0 ? '+' : ''}{trip.fuel.variance}L ✅{" "}
                        ({Math.abs((trip.fuel.variance / trip.fuel.expected) * 100).toFixed(1)}% {trip.fuel.variance < 0 ? 'under' : 'over'})
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Started: {trip.started}</span>
                    <span className="text-gray-600">ETA: {trip.eta}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Log Fuel Stop
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <span className="text-xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DemoLayout>
  );
}
