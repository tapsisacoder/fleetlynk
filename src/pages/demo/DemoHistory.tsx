import { DemoLayout } from "@/components/demo/DemoLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tripHistory } from "@/data/demoData";
import { Search } from "lucide-react";

export default function DemoHistory() {
  const getStatusBadge = (variance: number) => {
    if (variance < -5) return { text: "✅ Excellent", color: "text-green-600" };
    if (variance < 0) return { text: "✅ Good", color: "text-green-600" };
    if (variance > 10) return { text: "⚠️ Alert", color: "text-red-600" };
    return { text: "⚠️ Check", color: "text-orange-600" };
  };

  const getVariancePercent = (variance: number, fuel: number) => {
    return ((variance / (fuel - variance)) * 100).toFixed(1);
  };

  return (
    <DemoLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Trip History</h1>
          <p className="text-gray-600">Complete record of all fleet trips</p>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Select defaultValue="30">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select defaultValue="all-vehicles">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-vehicles">All Vehicles</SelectItem>
                  <SelectItem value="ZWE-8472">ZWE-8472</SelectItem>
                  <SelectItem value="RSA-2341">RSA-2341</SelectItem>
                  <SelectItem value="ZWE-9123">ZWE-9123</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select defaultValue="all-status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="good">Good ✓</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by trip reference..."
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Trips Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Route</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Distance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fuel</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tripHistory.map((trip) => {
                  const status = getStatusBadge(trip.variance);
                  const variancePercent = getVariancePercent(trip.variance, trip.fuel);
                  
                  return (
                    <tr key={trip.reference} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{trip.reference}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{trip.vehicle}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{trip.route}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{trip.distance} km</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{trip.fuel} L</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{trip.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Trips</p>
            <p className="text-3xl font-bold text-gray-900">{tripHistory.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Distance</p>
            <p className="text-3xl font-bold text-gray-900">6,258 km</p>
          </Card>
        </div>
      </div>
    </DemoLayout>
  );
}
