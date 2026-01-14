import { AppLayout } from "@/components/app/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText, Calendar, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { format, differenceInDays, addDays } from "date-fns";

export default function Documents() {
  const { data: vehicles = [] } = useVehicles();

  // Generate document reminders based on vehicle data
  const generateReminders = () => {
    const reminders: Array<{
      id: string;
      vehicle: string;
      vehicleId: string;
      documentType: string;
      expiryDate: Date;
      daysUntilExpiry: number;
      status: 'expired' | 'critical' | 'warning' | 'ok';
    }> = [];

    vehicles.forEach(vehicle => {
      const docs = [
        { type: 'License', expiry: vehicle.license_expiry },
        { type: 'Insurance', expiry: vehicle.insurance_expiry },
        { type: 'Roadworthy', expiry: vehicle.roadworthy_expiry },
      ];

      docs.forEach(doc => {
        if (doc.expiry) {
          const expiryDate = new Date(doc.expiry);
          const daysUntil = differenceInDays(expiryDate, new Date());
          
          let status: 'expired' | 'critical' | 'warning' | 'ok' = 'ok';
          if (daysUntil < 0) status = 'expired';
          else if (daysUntil <= 7) status = 'critical';
          else if (daysUntil <= 30) status = 'warning';

          reminders.push({
            id: `${vehicle.id}-${doc.type}`,
            vehicle: vehicle.registration_number,
            vehicleId: vehicle.id,
            documentType: doc.type,
            expiryDate,
            daysUntilExpiry: daysUntil,
            status,
          });
        }
      });
    });

    return reminders.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  };

  const reminders = generateReminders();
  const expired = reminders.filter(r => r.status === 'expired');
  const critical = reminders.filter(r => r.status === 'critical');
  const warnings = reminders.filter(r => r.status === 'warning');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'critical':
        return <Badge className="bg-orange-500">Due Soon</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-black">Upcoming</Badge>;
      default:
        return <Badge className="bg-green-500">Valid</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'warning':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Reminders</h1>
          <p className="text-muted-foreground">Track vehicle licenses, insurance, and roadworthy certificates</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expired</p>
                  <p className="text-3xl font-bold text-destructive">{expired.length}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical (≤7 days)</p>
                  <p className="text-3xl font-bold text-orange-500">{critical.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Warning (≤30 days)</p>
                  <p className="text-3xl font-bold text-yellow-500">{warnings.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Vehicles</p>
                  <p className="text-3xl font-bold text-foreground">{vehicles.length}</p>
                </div>
                <Truck className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Reminders */}
        {(expired.length > 0 || critical.length > 0) && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Urgent Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...expired, ...critical].map(reminder => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(reminder.status)}
                      <div>
                        <p className="font-medium text-foreground">{reminder.vehicle}</p>
                        <p className="text-sm text-muted-foreground">{reminder.documentType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(reminder.status)}
                      <p className="text-sm text-muted-foreground mt-1">
                        {reminder.status === 'expired' 
                          ? `Expired ${Math.abs(reminder.daysUntilExpiry)} days ago`
                          : `${reminder.daysUntilExpiry} days left`
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              All Document Expiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reminders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No document expiry dates set for your vehicles.</p>
                <p className="text-sm">Add license, insurance, and roadworthy dates to your fleet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Document</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Expiry Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Days Left</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reminders.map(reminder => (
                      <tr key={reminder.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{reminder.vehicle}</td>
                        <td className="py-3 px-4">{reminder.documentType}</td>
                        <td className="py-3 px-4">{format(reminder.expiryDate, 'dd MMM yyyy')}</td>
                        <td className="py-3 px-4">
                          {reminder.daysUntilExpiry < 0 
                            ? <span className="text-destructive">{Math.abs(reminder.daysUntilExpiry)} days overdue</span>
                            : `${reminder.daysUntilExpiry} days`
                          }
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(reminder.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
