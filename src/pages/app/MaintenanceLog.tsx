import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Wrench, 
  Plus, 
  Truck, 
  Calendar, 
  DollarSign, 
  User,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { format } from "date-fns";

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  serviceType: string;
  serviceCategory: string;
  description: string;
  laborHours: number;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  mechanic: string;
  serviceDate: string;
  odometer: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

// Demo data for maintenance records
const demoRecords: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    vehicleReg: 'ABC-123-GP',
    serviceType: 'Scheduled Maintenance',
    serviceCategory: 'General Service',
    description: '50,000 km service - Oil change, filter replacement, brake inspection',
    laborHours: 4,
    laborCost: 200,
    partsCost: 450,
    totalCost: 650,
    mechanic: 'John Mthembu',
    serviceDate: '2025-01-10',
    odometer: 50234,
    status: 'completed',
    priority: 'medium',
    notes: 'All filters replaced. Brakes at 60% wear.'
  },
  {
    id: '2',
    vehicleId: '2',
    vehicleReg: 'XYZ-789-GP',
    serviceType: 'Repair',
    serviceCategory: 'Brakes',
    description: 'Front brake pad replacement',
    laborHours: 2,
    laborCost: 100,
    partsCost: 320,
    totalCost: 420,
    mechanic: 'Peter Ndlovu',
    serviceDate: '2025-01-12',
    odometer: 78500,
    status: 'completed',
    priority: 'high',
    notes: 'Brake pads worn to 10%. Replaced with premium pads.'
  },
  {
    id: '3',
    vehicleId: '1',
    vehicleReg: 'ABC-123-GP',
    serviceType: 'Breakdown Repair',
    serviceCategory: 'Electrical',
    description: 'Alternator replacement - vehicle broke down on N1',
    laborHours: 3,
    laborCost: 150,
    partsCost: 850,
    totalCost: 1000,
    mechanic: 'John Mthembu',
    serviceDate: '2025-01-08',
    odometer: 49800,
    status: 'completed',
    priority: 'critical',
    notes: 'Emergency roadside repair. New alternator installed.'
  },
  {
    id: '4',
    vehicleId: '3',
    vehicleReg: 'DEF-456-GP',
    serviceType: 'Scheduled Maintenance',
    serviceCategory: 'Tyre Service',
    description: 'Tyre rotation and balancing',
    laborHours: 1,
    laborCost: 50,
    partsCost: 0,
    totalCost: 50,
    mechanic: 'Peter Ndlovu',
    serviceDate: '2025-01-15',
    odometer: 35000,
    status: 'scheduled',
    priority: 'low',
    notes: 'Scheduled for next week'
  },
  {
    id: '5',
    vehicleId: '2',
    vehicleReg: 'XYZ-789-GP',
    serviceType: 'Pre-trip Inspection Fix',
    serviceCategory: 'Body Work',
    description: 'Side mirror replacement - damaged in parking lot',
    laborHours: 0.5,
    laborCost: 25,
    partsCost: 180,
    totalCost: 205,
    mechanic: 'John Mthembu',
    serviceDate: '2025-01-14',
    odometer: 78600,
    status: 'in_progress',
    priority: 'medium',
    notes: 'Waiting for part delivery'
  }
];

export default function MaintenanceLog() {
  const { data: vehicles = [] } = useVehicles();
  const [records, setRecords] = useState<MaintenanceRecord[]>(demoRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    vehicleId: '',
    serviceType: '',
    serviceCategory: '',
    description: '',
    laborHours: '',
    laborCost: '',
    partsCost: '',
    mechanic: '',
    serviceDate: '',
    odometer: '',
    priority: 'medium',
    notes: ''
  });

  const serviceTypes = [
    'Scheduled Maintenance',
    'Repair',
    'Breakdown Repair',
    'Pre-trip Inspection Fix',
    'Accident Repair',
    'Modification/Upgrade'
  ];

  const serviceCategories = [
    'General Service',
    'Engine Work',
    'Transmission/Drivetrain',
    'Brakes',
    'Suspension',
    'Electrical',
    'Body Work',
    'Tyre Service'
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.vehicleReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.mechanic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesVehicle = filterVehicle === 'all' || record.vehicleId === filterVehicle;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-500 text-black">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 text-black">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleSubmit = () => {
    const vehicle = vehicles.find(v => v.id === newRecord.vehicleId);
    const laborCost = parseFloat(newRecord.laborCost) || 0;
    const partsCost = parseFloat(newRecord.partsCost) || 0;
    
    const record: MaintenanceRecord = {
      id: Date.now().toString(),
      vehicleId: newRecord.vehicleId,
      vehicleReg: vehicle?.registration_number || 'Unknown',
      serviceType: newRecord.serviceType,
      serviceCategory: newRecord.serviceCategory,
      description: newRecord.description,
      laborHours: parseFloat(newRecord.laborHours) || 0,
      laborCost,
      partsCost,
      totalCost: laborCost + partsCost,
      mechanic: newRecord.mechanic,
      serviceDate: newRecord.serviceDate,
      odometer: parseFloat(newRecord.odometer) || 0,
      status: 'scheduled',
      priority: newRecord.priority as MaintenanceRecord['priority'],
      notes: newRecord.notes
    };

    setRecords([record, ...records]);
    setIsDialogOpen(false);
    setNewRecord({
      vehicleId: '',
      serviceType: '',
      serviceCategory: '',
      description: '',
      laborHours: '',
      laborCost: '',
      partsCost: '',
      mechanic: '',
      serviceDate: '',
      odometer: '',
      priority: 'medium',
      notes: ''
    });
  };

  // Calculate summary stats
  const totalCostThisMonth = records
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.totalCost, 0);
  const completedThisMonth = records.filter(r => r.status === 'completed').length;
  const pendingJobs = records.filter(r => r.status !== 'completed').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Maintenance Log</h1>
            <p className="text-muted-foreground">Track vehicle service history and workshop jobs</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Service Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Service Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle</Label>
                    <Select value={newRecord.vehicleId} onValueChange={(v) => setNewRecord({...newRecord, vehicleId: v})}>
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
                  <div>
                    <Label>Service Date</Label>
                    <Input 
                      type="date" 
                      value={newRecord.serviceDate}
                      onChange={(e) => setNewRecord({...newRecord, serviceDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Type</Label>
                    <Select value={newRecord.serviceType} onValueChange={(v) => setNewRecord({...newRecord, serviceType: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={newRecord.serviceCategory} onValueChange={(v) => setNewRecord({...newRecord, serviceCategory: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe the work to be done..."
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Odometer (km)</Label>
                    <Input 
                      type="number" 
                      placeholder="Current reading"
                      value={newRecord.odometer}
                      onChange={(e) => setNewRecord({...newRecord, odometer: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Mechanic</Label>
                    <Input 
                      placeholder="Technician name"
                      value={newRecord.mechanic}
                      onChange={(e) => setNewRecord({...newRecord, mechanic: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select value={newRecord.priority} onValueChange={(v) => setNewRecord({...newRecord, priority: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Labor Hours</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={newRecord.laborHours}
                      onChange={(e) => setNewRecord({...newRecord, laborHours: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Labor Cost ($)</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={newRecord.laborCost}
                      onChange={(e) => setNewRecord({...newRecord, laborCost: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Parts Cost ($)</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={newRecord.partsCost}
                      onChange={(e) => setNewRecord({...newRecord, partsCost: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea 
                    placeholder="Additional notes..."
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit} className="bg-secondary hover:bg-secondary/90">
                    Create Service Entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spend (Month)</p>
                  <p className="text-2xl font-bold text-foreground">${totalCostThisMonth.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Jobs</p>
                  <p className="text-2xl font-bold text-green-500">{completedThisMonth}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Jobs</p>
                  <p className="text-2xl font-bold text-yellow-500">{pendingJobs}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fleet Size</p>
                  <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
                </div>
                <Truck className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by vehicle, description, or mechanic..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterVehicle} onValueChange={setFilterVehicle}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  {vehicles.map(v => (
                    <SelectItem key={v.id} value={v.id}>{v.registration_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Service Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Service History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No maintenance records found</p>
                </div>
              ) : (
                filteredRecords.map(record => (
                  <div key={record.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{record.vehicleReg}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{record.serviceType}</span>
                          {getPriorityBadge(record.priority)}
                        </div>
                        <p className="text-foreground">{record.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(record.serviceDate), 'dd MMM yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {record.mechanic}
                          </span>
                          <span>Odometer: {record.odometer.toLocaleString()} km</span>
                        </div>
                        {record.notes && (
                          <p className="text-sm text-muted-foreground italic">{record.notes}</p>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        {getStatusBadge(record.status)}
                        <p className="text-lg font-bold text-foreground">${record.totalCost}</p>
                        <p className="text-xs text-muted-foreground">
                          Labor: ${record.laborCost} | Parts: ${record.partsCost}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
