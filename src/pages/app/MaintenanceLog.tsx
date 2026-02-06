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
  Search,
  Clock,
  CheckCircle,
  Package
} from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { useMaintenanceRecords, useCreateMaintenance, useUpdateMaintenance } from "@/hooks/useMaintenance";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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

export default function MaintenanceLog() {
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { data: records = [], isLoading: recordsLoading } = useMaintenanceRecords();
  const createMaintenance = useCreateMaintenance();
  const updateMaintenance = useUpdateMaintenance();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    vehicle_id: '',
    service_type: '',
    service_category: '',
    description: '',
    labor_cost: '',
    parts_cost: '',
    performed_by: '',
    service_date: '',
    odometer_reading: '',
    priority: 'medium',
    notes: ''
  });

  const isLoading = vehiclesLoading || recordsLoading;

  const filteredRecords = records.filter(record => {
    const vehicleReg = record.vehicle?.registration_number || '';
    const matchesSearch = vehicleReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.performed_by || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesVehicle = filterVehicle === 'all' || record.vehicle_id === filterVehicle;
    return matchesSearch && matchesStatus && matchesVehicle;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
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
      case 'normal':
        return <Badge className="bg-yellow-500 text-black">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleSubmit = async () => {
    if (!newRecord.vehicle_id || !newRecord.service_type || !newRecord.description || !newRecord.service_date) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      await createMaintenance.mutateAsync({
        vehicle_id: newRecord.vehicle_id,
        service_type: newRecord.service_type,
        service_category: newRecord.service_category || undefined,
        description: newRecord.description,
        service_date: newRecord.service_date,
        odometer_reading: newRecord.odometer_reading ? parseInt(newRecord.odometer_reading) : undefined,
        labor_cost: parseFloat(newRecord.labor_cost) || 0,
        parts_cost: parseFloat(newRecord.parts_cost) || 0,
        performed_by: newRecord.performed_by || undefined,
        priority: newRecord.priority,
        notes: newRecord.notes || undefined,
        status: 'pending'
      });

      toast({ title: 'Service entry created successfully' });
      setIsDialogOpen(false);
      setNewRecord({
        vehicle_id: '',
        service_type: '',
        service_category: '',
        description: '',
        labor_cost: '',
        parts_cost: '',
        performed_by: '',
        service_date: '',
        odometer_reading: '',
        priority: 'medium',
        notes: ''
      });
    } catch (error: any) {
      toast({ title: 'Error creating service entry', description: error.message, variant: 'destructive' });
    }
  };

  const handleStatusChange = async (recordId: string, newStatus: string) => {
    try {
      await updateMaintenance.mutateAsync({ id: recordId, status: newStatus });
      toast({ title: `Status updated to ${newStatus}` });
    } catch (error: any) {
      toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
    }
  };

  // Calculate summary stats
  const totalCostThisMonth = records
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.total_cost || 0), 0);
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
                    <Label>Vehicle *</Label>
                    <Select value={newRecord.vehicle_id} onValueChange={(v) => setNewRecord({...newRecord, vehicle_id: v})}>
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
                    <Label>Service Date *</Label>
                    <Input 
                      type="date" 
                      value={newRecord.service_date}
                      onChange={(e) => setNewRecord({...newRecord, service_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Type *</Label>
                    <Select value={newRecord.service_type} onValueChange={(v) => setNewRecord({...newRecord, service_type: v})}>
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
                    <Select value={newRecord.service_category} onValueChange={(v) => setNewRecord({...newRecord, service_category: v})}>
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
                  <Label>Description *</Label>
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
                      value={newRecord.odometer_reading}
                      onChange={(e) => setNewRecord({...newRecord, odometer_reading: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Mechanic</Label>
                    <Input 
                      placeholder="Technician name"
                      value={newRecord.performed_by}
                      onChange={(e) => setNewRecord({...newRecord, performed_by: e.target.value})}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Labor Cost ($)</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={newRecord.labor_cost}
                      onChange={(e) => setNewRecord({...newRecord, labor_cost: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Parts Cost ($)</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={newRecord.parts_cost}
                      onChange={(e) => setNewRecord({...newRecord, parts_cost: e.target.value})}
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
                  <Button 
                    onClick={handleSubmit} 
                    className="bg-secondary hover:bg-secondary/90"
                    disabled={createMaintenance.isPending}
                  >
                    {createMaintenance.isPending ? 'Creating...' : 'Create Service Entry'}
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
                  <p className="text-sm text-muted-foreground">Total Spend</p>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Scheduled</SelectItem>
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

        {/* Records List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <span className="font-bold text-lg">
                          {record.vehicle?.registration_number || 'Unknown Vehicle'}
                        </span>
                        {getStatusBadge(record.status)}
                        {getPriorityBadge(record.priority)}
                      </div>
                      <p className="text-muted-foreground mb-2">{record.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(record.service_date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wrench className="w-4 h-4" />
                          {record.service_type}
                        </span>
                        {record.performed_by && (
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {record.performed_by}
                          </span>
                        )}
                        {record.odometer_reading && (
                          <span>{record.odometer_reading.toLocaleString()} km</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${(record.total_cost || 0).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Labor: ${record.labor_cost || 0} | Parts: ${record.parts_cost || 0}
                      </p>
                      {record.status !== 'completed' && (
                        <div className="mt-2 flex gap-2 justify-end">
                          {record.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(record.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                          <Button 
                            size="sm"
                            onClick={() => handleStatusChange(record.id, 'completed')}
                          >
                            Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No maintenance records found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' || filterVehicle !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Create your first service entry to get started'}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Service Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
