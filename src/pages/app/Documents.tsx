import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, FileText, Calendar, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { format, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const DOCUMENT_TYPES = [
  'License',
  'Insurance',
  'Roadworthy',
  'Permit',
  'Registration',
  'Other'
];

export default function Documents() {
  const { data: vehicles = [] } = useVehicles();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customDocuments, setCustomDocuments] = useState<Array<{
    id: string;
    vehicle: string;
    vehicleId: string;
    documentType: string;
    documentName: string;
    expiryDate: Date;
    daysUntilExpiry: number;
    status: 'expired' | 'critical' | 'warning' | 'ok';
  }>>([]);

  const [newDocument, setNewDocument] = useState({
    vehicleId: '',
    documentType: '',
    documentName: '',
    expiryDate: '',
  });

  // Generate document reminders based on vehicle data
  const generateReminders = () => {
    const reminders: Array<{
      id: string;
      vehicle: string;
      vehicleId: string;
      documentType: string;
      documentName?: string;
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

    // Add custom documents
    customDocuments.forEach(doc => {
      reminders.push(doc);
    });

    return reminders.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  };

  const handleAddDocument = () => {
    if (!newDocument.vehicleId || !newDocument.documentType || !newDocument.expiryDate) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const vehicle = vehicles.find(v => v.id === newDocument.vehicleId);
    if (!vehicle) return;

    const expiryDate = new Date(newDocument.expiryDate);
    const daysUntil = differenceInDays(expiryDate, new Date());
    
    let status: 'expired' | 'critical' | 'warning' | 'ok' = 'ok';
    if (daysUntil < 0) status = 'expired';
    else if (daysUntil <= 7) status = 'critical';
    else if (daysUntil <= 30) status = 'warning';

    const newDoc = {
      id: `custom-${Date.now()}`,
      vehicle: vehicle.registration_number,
      vehicleId: newDocument.vehicleId,
      documentType: newDocument.documentType,
      documentName: newDocument.documentName || newDocument.documentType,
      expiryDate,
      daysUntilExpiry: daysUntil,
      status,
    };

    setCustomDocuments([...customDocuments, newDoc]);
    setIsDialogOpen(false);
    setNewDocument({ vehicleId: '', documentType: '', documentName: '', expiryDate: '' });
    toast({ title: 'Document added successfully' });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Document Reminders</h1>
            <p className="text-muted-foreground">Track vehicle licenses, insurance, and certificates</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Document Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Vehicle *</Label>
                  <Select 
                    value={newDocument.vehicleId} 
                    onValueChange={(v) => setNewDocument({...newDocument, vehicleId: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.registration_number} - {v.make} {v.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Document Type *</Label>
                  <Select 
                    value={newDocument.documentType} 
                    onValueChange={(v) => setNewDocument({...newDocument, documentType: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Document Name (optional)</Label>
                  <Input
                    value={newDocument.documentName}
                    onChange={(e) => setNewDocument({...newDocument, documentName: e.target.value})}
                    placeholder="e.g., Cross-border Permit"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expiry Date *</Label>
                  <Input
                    type="date"
                    value={newDocument.expiryDate}
                    onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddDocument}>Add Document</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <p className="text-sm text-muted-foreground">
                          {reminder.documentName || reminder.documentType}
                        </p>
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
                        <td className="py-3 px-4">{reminder.documentName || reminder.documentType}</td>
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