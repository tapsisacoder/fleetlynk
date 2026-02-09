import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, FileText, Calendar, CheckCircle, Clock, AlertCircle, Plus, Trash2, RefreshCw } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { format, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const DOCUMENT_TYPES = [
  'License', 'Insurance', 'Roadworthy', 'Permit', 'Registration',
  'COF (Certificate of Fitness)', 'Cross-Border Permit', 'Tax Clearance', 'Other'
];

const DOCUMENT_CATEGORIES = [
  { value: 'vehicle', label: 'Vehicle Document' },
  { value: 'admin', label: 'Admin / Company Document' },
];

interface CustomDocument {
  id: string;
  vehicle: string;
  vehicleId: string;
  documentType: string;
  documentName: string;
  category: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  status: 'expired' | 'critical' | 'warning' | 'ok';
}

export default function Documents() {
  const { data: vehicles = [] } = useVehicles();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [renewDoc, setRenewDoc] = useState<CustomDocument | null>(null);
  const [renewDate, setRenewDate] = useState('');
  const [customDocuments, setCustomDocuments] = useState<CustomDocument[]>([]);

  const [newDocument, setNewDocument] = useState({
    vehicleId: '', documentType: '', documentName: '', expiryDate: '', category: 'vehicle',
  });

  const generateReminders = () => {
    const reminders: CustomDocument[] = [];

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
            documentName: doc.type,
            category: 'vehicle',
            expiryDate,
            daysUntilExpiry: daysUntil,
            status,
          });
        }
      });
    });

    customDocuments.forEach(doc => reminders.push(doc));
    return reminders.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  };

  const handleAddDocument = () => {
    if (!newDocument.documentType || !newDocument.expiryDate) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    if (newDocument.category === 'vehicle' && !newDocument.vehicleId) {
      toast({ title: 'Please select a vehicle for vehicle documents', variant: 'destructive' });
      return;
    }

    const vehicle = newDocument.category === 'vehicle' 
      ? vehicles.find(v => v.id === newDocument.vehicleId) 
      : null;

    const expiryDate = new Date(newDocument.expiryDate);
    const daysUntil = differenceInDays(expiryDate, new Date());
    let status: 'expired' | 'critical' | 'warning' | 'ok' = 'ok';
    if (daysUntil < 0) status = 'expired';
    else if (daysUntil <= 7) status = 'critical';
    else if (daysUntil <= 30) status = 'warning';

    setCustomDocuments([...customDocuments, {
      id: `custom-${Date.now()}`,
      vehicle: vehicle?.registration_number || 'Admin',
      vehicleId: newDocument.vehicleId || '',
      documentType: newDocument.documentType,
      documentName: newDocument.documentName || newDocument.documentType,
      category: newDocument.category,
      expiryDate,
      daysUntilExpiry: daysUntil,
      status,
    }]);
    setIsDialogOpen(false);
    setNewDocument({ vehicleId: '', documentType: '', documentName: '', expiryDate: '', category: 'vehicle' });
    toast({ title: 'Document added successfully' });
  };

  const handleDelete = () => {
    if (!deleteDocId) return;
    setCustomDocuments(customDocuments.filter(d => d.id !== deleteDocId));
    setDeleteDocId(null);
    toast({ title: 'Document removed' });
  };

  const handleRenew = () => {
    if (!renewDoc || !renewDate) return;
    const expiryDate = new Date(renewDate);
    const daysUntil = differenceInDays(expiryDate, new Date());
    let status: 'expired' | 'critical' | 'warning' | 'ok' = 'ok';
    if (daysUntil < 0) status = 'expired';
    else if (daysUntil <= 7) status = 'critical';
    else if (daysUntil <= 30) status = 'warning';

    setCustomDocuments(customDocuments.map(d => 
      d.id === renewDoc.id ? { ...d, expiryDate, daysUntilExpiry: daysUntil, status } : d
    ));
    setRenewDialogOpen(false);
    setRenewDoc(null);
    setRenewDate('');
    toast({ title: 'Document renewed successfully' });
  };

  const reminders = generateReminders();
  const expired = reminders.filter(r => r.status === 'expired');
  const critical = reminders.filter(r => r.status === 'critical');
  const warnings = reminders.filter(r => r.status === 'warning');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'expired': return <Badge variant="destructive">Expired</Badge>;
      case 'critical': return <Badge className="bg-orange-500">Due Soon</Badge>;
      case 'warning': return <Badge className="bg-yellow-500 text-black">Upcoming</Badge>;
      default: return <Badge className="bg-green-500">Valid</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'expired': return <AlertCircle className="w-5 h-5 text-destructive" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'warning': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const isCustomDoc = (id: string) => id.startsWith('custom-');

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
              <Button className="gap-2"><Plus className="w-4 h-4" />Add Document</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Document Reminder</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Document Category *</Label>
                  <Select value={newDocument.category} onValueChange={(v) => setNewDocument({...newDocument, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newDocument.category === 'vehicle' && (
                  <div className="space-y-2">
                    <Label>Vehicle *</Label>
                    <Select value={newDocument.vehicleId} onValueChange={(v) => setNewDocument({...newDocument, vehicleId: v})}>
                      <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                      <SelectContent>
                        {vehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.registration_number} - {v.make} {v.model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Document Type *</Label>
                  <Select value={newDocument.documentType} onValueChange={(v) => setNewDocument({...newDocument, documentType: v})}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Document Name (optional)</Label>
                  <Input value={newDocument.documentName} onChange={(e) => setNewDocument({...newDocument, documentName: e.target.value})} placeholder="e.g., Cross-border Permit ZW-SA" />
                </div>

                <div className="space-y-2">
                  <Label>Expiry Date *</Label>
                  <Input type="date" value={newDocument.expiryDate} onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})} />
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
                <p>No document expiry dates set.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle/Admin</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Document</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Expiry Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Days Left</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reminders.map(reminder => (
                      <tr key={reminder.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {reminder.category === 'admin' ? 'Admin' : 'Vehicle'}
                          </Badge>
                        </td>
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
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {isCustomDoc(reminder.id) && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => { setRenewDoc(reminder); setRenewDialogOpen(true); }}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setDeleteDocId(reminder.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Renew Dialog */}
        <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Renew Document</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              {renewDoc && (
                <p className="text-sm text-muted-foreground">
                  Renewing: <span className="font-medium text-foreground">{renewDoc.documentName}</span> for {renewDoc.vehicle}
                </p>
              )}
              <div className="space-y-2">
                <Label>New Expiry Date *</Label>
                <Input type="date" value={renewDate} onChange={(e) => setRenewDate(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRenewDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleRenew} disabled={!renewDate}>Renew</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={!!deleteDocId} onOpenChange={() => setDeleteDocId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document?</AlertDialogTitle>
              <AlertDialogDescription>This will remove the document reminder permanently.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
