import { DemoLayout } from "@/components/demo/DemoLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { documentAlerts } from "@/data/demoData";
import { AlertTriangle, FileText, CheckCircle } from "lucide-react";

export default function DemoDocuments() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-orange-200 bg-orange-50";
      default:
        return "border-green-200 bg-green-50";
    }
  };

  const getAlertBadge = (type: string, daysLeft: number) => {
    if (type === "urgent") {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600">
          🔴 URGENT - {daysLeft} Days Left
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-orange-500">
        🟡 WARNING - {daysLeft} Days Left
      </span>
    );
  };

  return (
    <DemoLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Document Management</h1>
          <p className="text-gray-600">Track vehicle documents and compliance deadlines</p>
        </div>

        {/* Alert Banner */}
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900 mb-1">
                ⚠️ {documentAlerts.length} DOCUMENTS EXPIRING SOON
              </h2>
              <p className="text-sm text-red-700">
                Take action now to avoid compliance issues and potential fines
              </p>
            </div>
          </div>
        </Card>

        {/* Document Alert Cards */}
        <div className="space-y-4">
          {documentAlerts.map((alert) => (
            <Card key={alert.id} className={`p-6 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1">
                  <div className="mb-3">
                    {getAlertBadge(alert.type, alert.daysLeft)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {alert.title}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Vehicle:</span> {alert.vehicle}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Expires:</span> {alert.expires}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className={alert.type === "urgent" ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}
                    >
                      Renew Now
                    </Button>
                    <Button variant="outline" className="bg-white">
                      View Document
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* All Documents Section */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Vehicle Documents</h2>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Upload Document
            </Button>
          </div>

          <div className="space-y-3">
            {/* Sample document rows */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Vehicle License Disc - ZWE-7651</p>
                  <p className="text-sm text-gray-600">Expires: 20 Jan 2026 • 47 days left</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Insurance Policy - ZWE-9123</p>
                  <p className="text-sm text-gray-600">Expires: 15 Feb 2026 • 73 days left</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Roadworthy Certificate - RSA-8821</p>
                  <p className="text-sm text-gray-600">Expires: 10 Mar 2026 • 96 days left</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Insurance Policy - RSA-2341</p>
                  <p className="text-sm text-green-700">Recently renewed • Valid until 15 May 2026</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Reminder Settings */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">📱 Reminder Settings</h3>
          <p className="text-sm text-gray-700 mb-4">
            Get WhatsApp alerts 30 days before documents expire. Never miss a renewal deadline.
          </p>
          <Button variant="outline" className="bg-white">
            Configure Alerts
          </Button>
        </Card>
      </div>
    </DemoLayout>
  );
}
