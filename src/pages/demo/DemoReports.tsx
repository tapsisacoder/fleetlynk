import { DemoLayout } from "@/components/demo/DemoLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { monthlyReport } from "@/data/demoData";
import { Download, Mail } from "lucide-react";

export default function DemoReports() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return { text: "🌟 Excellent", color: "text-green-600 bg-green-50" };
      case "good":
        return { text: "✅ Good", color: "text-green-600 bg-green-50" };
      case "check":
        return { text: "⚠️ Check", color: "text-orange-600 bg-orange-50" };
      default:
        return { text: "❌ Alert", color: "text-red-600 bg-red-50" };
    }
  };

  return (
    <DemoLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Fuel Consumption Report</h1>
            <p className="text-gray-600">Date Range: November 2025</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button className="gap-2 bg-primary">
              <Mail className="w-4 h-4" />
              Email Report
            </Button>
          </div>
        </div>

        {/* Big Numbers */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-600 mb-2">TOTAL FUEL USED</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {monthlyReport.totalFuel.toLocaleString()} L
            </p>
          </Card>

          <Card className="p-8 text-center">
            <p className="text-sm text-gray-600 mb-2">EXPECTED FUEL</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">
              {monthlyReport.expectedFuel.toLocaleString()} L
            </p>
          </Card>
        </div>

        {/* Fuel Variance Trend Graph */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Fuel Variance Trend - November</h2>
          
          <div className="relative h-64 bg-gray-50 rounded-lg p-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>+10%</span>
              <span>+5%</span>
              <span>0%</span>
              <span>-5%</span>
              <span>-10%</span>
            </div>

            {/* Chart area */}
            <div className="ml-8 h-full relative">
              {/* Zero line */}
              <div className="absolute w-full border-t-2 border-gray-300 top-1/2"></div>
              
              {/* Trend line visual representation */}
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <polyline
                  points="0,80 50,100 100,85 150,70 200,90 250,65 300,60 350,55 400,50 450,45 500,40 550,35 600,30"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <polyline
                  points="0,80 50,100 100,85 150,70 200,90 250,65 300,60 350,55 400,50 450,45 500,40 550,35 600,30"
                  fill="url(#gradient)"
                  opacity="0.2"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>

              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              📈 Trend Analysis: Fuel efficiency improving over time. Your fleet is performing 5.5% better than expected, trending towards -8% by month end.
            </p>
          </div>
        </Card>

        {/* Vehicle Performance Table */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Performance Breakdown</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trips</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expected</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actual</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Variance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyReport.vehiclePerformance.map((vehicle) => {
                  const variancePercent = ((vehicle.variance / vehicle.expected) * 100).toFixed(1);
                  const status = getStatusBadge(vehicle.status);
                  
                  return (
                    <tr key={vehicle.vehicle} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{vehicle.vehicle}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{vehicle.trips}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{vehicle.expected.toLocaleString()} L</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{vehicle.actual.toLocaleString()} L</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`text-sm font-medium ${vehicle.variance < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                            {vehicle.variance > 0 ? '+' : ''}{vehicle.variance} L
                          </span>
                          <br />
                          <span className="text-xs text-gray-600">
                            ({variancePercent}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Key Insights */}
        <Card className="p-8 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Key Insights</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>ZWE-9123</strong> is your most efficient vehicle with 6.6% fuel savings</li>
            <li>• <strong>RSA-2341</strong> needs attention - consuming 2.6% more fuel than expected</li>
            <li>• Overall fleet performance trending positively - savings increasing each week</li>
            <li>• You are saving 720L of fuel per month compared to expected consumption</li>
          </ul>
        </Card>
      </div>
    </DemoLayout>
  );
}
