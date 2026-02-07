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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Wrench, 
  Plus, 
  Truck, 
  Calendar, 
  DollarSign, 
  Search,
  Clock,
  CheckCircle,
  Bell,
  Gauge
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
  'Tyre Service',
  'Custom'
];

interface ServiceReminder {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  serviceType: string;
  nextServiceOdometer: number;
  currentOdometer: number;
  remainingKm: number;
}

export default function MaintenanceLog() {
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles();
  const { data: records = [], isLoading: recordsLoading } = useMaintenanceRecords();
  const createMaintenance = useCreateMaintenance();
  const updateMaintenance = useUpdateMaintenance();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('log');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [serviceReminders, setServiceReminders] = useState<ServiceReminder[]>([]);
  
  const [newRecord, setNewRecord] = useState({
    vehicle_id: '',
    service_type: '',
    service_category: '',
    custom_category: '',
    description: '',
    parts_cost: '',
    service_date: '',
    notes: ''
  });

  const [newReminder, setNewReminder] = useState({
    vehicleId: '',
    serviceType: '',
    nextServiceOdometer: ''
  });

  const isLoading = vehiclesLoading || recordsLoading;

  const filteredRecords = records.filter(record => {
    const vehicleReg = record.vehicle?.registration_number || '';
    const matchesSearch = vehicleReg.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleSubmit = async () => {
    if (!newRecord.vehicle_id || !newRecord.service_type || !newRecord.description || !newRecord.service_date) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    const category = newRecord.service_category === 'Custom' ? newRecord.custom_category : newRecord.service_category;

    try {
      await createMaintenance.mutateAsync({
        vehicle_id: newRecord.vehicle_id,
        service_type: newRecord.service_type,
        service_category: category || undefined,
        description: newRecord.description,
        service_date: newRecord.service_date,
        parts_cost: parseFloat(newRecord.parts_cost) || 0,
        notes: newRecord.notes || undefined,
        status: 'pending'
      });

      toast({ title: 'Service entry created successfully' });
      setIsDialogOpen(false);
      setNewRecord({
        vehicle_id: '',
        service_type: '',
        service_category: '',
        custom_category: '',
        description: '',
        parts_cost: '',
        service_date: '',
        notes: ''
      });
    } catch (error: any) {
      toast({ title: 'Error creating service entry', description: error.message, variant: 'destructive' });
    }
  };

  const handleAddReminder = () => {
    if (!newReminder.vehicleId || !newReminder.serviceType || !newReminder.nextServiceOdometer) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const vehicle = vehicles.find(v => v.id === newReminder.vehicleId);
    if (!vehicle) return;

    const nextOdometer = parseInt(newReminder.nextServiceOdometer);
    const currentOdometer = vehicle.current_odometer || 0;

    const reminder: ServiceReminder = {
      id: crypto.randomUUID(),
      vehicleId: newReminder.vehicleId,
      vehicleReg: vehicle.registration_number,
      serviceType: newReminder.serviceType,
      nextServiceOdometer: nextOdometer,
      currentOdometer: currentOdometer,
      remainingKm: nextOdometer - currentOdometer
    };

    setServiceReminders([...serviceReminders, reminder]);
    setIsReminderDialogOpen(false);
    setNewReminder({ vehicleId: '', serviceType: '', nextServiceOdometer: '' });
    toast({ title: 'Service reminder added' });
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

  // Update reminders with latest odometer readings
  const updatedReminders = serviceReminders.map(reminder => {
    const vehicle = vehicles.find(v => v.id === reminder.vehicleId);
    const currentOdometer = vehicle?.current_odometer || reminder.currentOdometer;
    return {
      ...reminder,
      currentOdometer,
      remainingKm: reminder.nextServiceOdometer - currentOdometer
    };
  });

  const dueReminders = updatedReminders.filter(r => r.remainingKm <= 500);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Maintenance Log</h1>
            <p className="text-muted-foreground">Track vehicle service history and workshop jobs</p>
          </div>
          <div className="flex gap-2">
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

                  {newRecord.service_category === 'Custom' && (
                    <div>
                      <Label>Custom Category Name</Label>
                      <Input 
                        placeholder="Enter custom category"
                        value={newRecord.custom_category}
                        onChange={(e) => setNewRecord({...newRecord, custom_category: e.target.value})}
                      />
                    </div>
                  )}

                  <div>
                    <Label>Description *</Label>
                    <Textarea 
                      placeholder="Describe the work to be done..."
                      value={newRecord.description}
                      onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
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
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="log" className="gap-2">
              <Wrench className="w-4 h-4" />
              Service Log
            </TabsTrigger>
            <TabsTrigger value="reminders" className="gap-2">
              <Bell className="w-4 h-4" />
              Service Reminders
              {dueReminders.length > 0 && (
                <Badge variant="destructive" className="ml-1">{dueReminders.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="mt-4 space-y-6">
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
                        placeholder="Search by vehicle or description..."
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
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Wrench className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{record.service_type}</h3>
                              {getStatusBadge(record.status)}
                              {record.service_category && (
                                <Badge variant="outline">{record.service_category}</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-1">{record.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Truck className="w-4 h-4" />
                                {record.vehicle?.registration_number || 'No vehicle'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(record.service_date), 'dd MMM yyyy')}
                              </span>
                              {record.total_cost > 0 && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  ${record.total_cost.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Select 
                            value={record.status} 
                            onValueChange={(v) => handleStatusChange(record.id, v)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Scheduled</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No maintenance records found</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                    Add First Service Entry
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reminders" className="mt-4 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Service Reminders</h2>
                <p className="text-muted-foreground">Track service intervals by odometer</p>
              </div>
              <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Service Reminder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Vehicle *</Label>
                      <Select value={newReminder.vehicleId} onValueChange={(v) => setNewReminder({...newReminder, vehicleId: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicles.map(v => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.registration_number} (Current: {(v.current_odometer || 0).toLocaleString()} km)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Service Type *</Label>
                      <Select value={newReminder.serviceType} onValueChange={(v) => setNewReminder({...newReminder, serviceType: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Next Service at Odometer (km) *</Label>
                      <Input 
                        type="number"
                        placeholder="e.g., 150000"
                        value={newReminder.nextServiceOdometer}
                        onChange={(e) => setNewReminder({...newReminder, nextServiceOdometer: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddReminder}>Add Reminder</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {updatedReminders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No service reminders set</p>
                  <p className="text-sm">Add reminders to track service intervals by odometer</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {updatedReminders.map((reminder) => (
                  <Card 
                    key={reminder.id} 
                    className={reminder.remainingKm <= 500 ? 'border-destructive' : reminder.remainingKm <= 2000 ? 'border-yellow-500' : ''}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            reminder.remainingKm <= 500 ? 'bg-destructive/10' : 'bg-primary/10'
                          }`}>
                            <Gauge className={`w-6 h-6 ${reminder.remainingKm <= 500 ? 'text-destructive' : 'text-primary'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{reminder.vehicleReg}</h3>
                            <p className="text-muted-foreground">{reminder.serviceType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Next service at</p>
                          <p className="font-semibold">{reminder.nextServiceOdometer.toLocaleString()} km</p>
                          <p className={`text-sm ${reminder.remainingKm <= 500 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                            {reminder.remainingKm > 0 
                              ? `${reminder.remainingKm.toLocaleString()} km remaining`
                              : `${Math.abs(reminder.remainingKm).toLocaleString()} km overdue!`
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}