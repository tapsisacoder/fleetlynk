import { useState } from 'react';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Truck, Search, MoreVertical, Gauge, Fuel, Container, Link2, Unlink, Trash2 } from 'lucide-react';
import { useVehicles, useCreateVehicle, useDeleteVehicle, Vehicle } from '@/hooks/useVehicles';
import { useTrailers, useCreateTrailer, useDeleteTrailer, useAttachTrailer, useDetachTrailer, useVehicleTrailers, Trailer } from '@/hooks/useTrailers';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'deployed':
      return <Badge className="bg-green-100 text-green-700">🚛 Deployed</Badge>;
    case 'available':
      return <Badge className="bg-blue-100 text-blue-700">✓ Available</Badge>;
    case 'in_use':
      return <Badge className="bg-green-100 text-green-700">🔗 In Use</Badge>;
    case 'maintenance':
      return <Badge className="bg-amber-100 text-amber-700">🔧 Maintenance</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const TRAILER_TYPES = [
  { value: 'flatbed', label: 'Flatbed' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'refrigerated', label: 'Refrigerated' },
  { value: 'container', label: 'Container' },
  { value: 'lowbed', label: 'Lowbed' },
  { value: 'tipper', label: 'Tipper' },
  { value: 'side_tipper', label: 'Side Tipper' },
  { value: 'curtain_side', label: 'Curtain Side' },
];

const Vehicles = () => {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [trailerDialogOpen, setTrailerDialogOpen] = useState(false);
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [trailerToDelete, setTrailerToDelete] = useState<string | null>(null);
  
  const [newVehicle, setNewVehicle] = useState({
    registration_number: '',
    make: '',
    model: '',
    engine_type: '',
    tank_capacity_liters: 800,
    year: new Date().getFullYear(),
    current_odometer: 0,
    fuel_consumption_loaded: 2.0,
    fuel_consumption_empty: 2.5,
  });

  const [newTrailer, setNewTrailer] = useState({
    registration_number: '',
    trailer_type: 'flatbed',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    capacity_tons: 34,
    length_meters: 13.6,
    axle_count: 3,
  });
  
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { data: trailers, isLoading: trailersLoading } = useTrailers();
  const createVehicle = useCreateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const createTrailer = useCreateTrailer();
  const deleteTrailer = useDeleteTrailer();
  const attachTrailer = useAttachTrailer();
  const detachTrailer = useDetachTrailer();
  const { toast } = useToast();

  const filteredVehicles = vehicles?.filter(v => {
    const matchesFilter = filter === 'all' || v.status === filter;
    const matchesSearch = 
      v.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      v.make?.toLowerCase().includes(search.toLowerCase()) ||
      v.model?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredTrailers = trailers?.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = 
      t.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      t.make?.toLowerCase().includes(search.toLowerCase()) ||
      t.trailer_type?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddVehicle = async () => {
    if (!newVehicle.registration_number) {
      toast({ title: 'Please enter registration number', variant: 'destructive' });
      return;
    }
    try {
      await createVehicle.mutateAsync(newVehicle);
      toast({
        title: 'Vehicle added',
        description: `${newVehicle.registration_number} has been added to your fleet.`,
      });
      setVehicleDialogOpen(false);
      setNewVehicle({
        registration_number: '',
        make: '',
        model: '',
        engine_type: '',
        tank_capacity_liters: 800,
        year: new Date().getFullYear(),
        current_odometer: 0,
        fuel_consumption_loaded: 2.0,
        fuel_consumption_empty: 2.5,
      });
    } catch (error: any) {
      toast({
        title: 'Error adding vehicle',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddTrailer = async () => {
    if (!newTrailer.registration_number) {
      toast({ title: 'Please enter registration number', variant: 'destructive' });
      return;
    }
    try {
      await createTrailer.mutateAsync(newTrailer);
      toast({
        title: 'Trailer added',
        description: `${newTrailer.registration_number} has been added to your fleet.`,
      });
      setTrailerDialogOpen(false);
      setNewTrailer({
        registration_number: '',
        trailer_type: 'flatbed',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        capacity_tons: 34,
        length_meters: 13.6,
        axle_count: 3,
      });
    } catch (error: any) {
      toast({
        title: 'Error adding trailer',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    try {
      await deleteVehicle.mutateAsync(vehicleToDelete);
      toast({ title: 'Vehicle deleted successfully' });
      setVehicleToDelete(null);
    } catch (error: any) {
      toast({ title: 'Error deleting vehicle', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteTrailer = async () => {
    if (!trailerToDelete) return;
    try {
      await deleteTrailer.mutateAsync(trailerToDelete);
      toast({ title: 'Trailer deleted successfully' });
      setTrailerToDelete(null);
    } catch (error: any) {
      toast({ title: 'Error deleting trailer', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fleet</h1>
            <p className="text-muted-foreground">
              {vehicles?.length || 0} vehicles, {trailers?.length || 0} trailers
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                  <DialogDescription>
                    Enter the vehicle details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Registration Number *</Label>
                      <Input
                        placeholder="ABC 1234 GP"
                        value={newVehicle.registration_number}
                        onChange={(e) => setNewVehicle({ ...newVehicle, registration_number: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) || new Date().getFullYear() })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Make</Label>
                      <Input
                        placeholder="Scania"
                        value={newVehicle.make}
                        onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input
                        placeholder="R450"
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Engine Type</Label>
                      <Input
                        placeholder="DC13"
                        value={newVehicle.engine_type}
                        onChange={(e) => setNewVehicle({ ...newVehicle, engine_type: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tank Capacity (L)</Label>
                      <Input
                        type="number"
                        value={newVehicle.tank_capacity_liters}
                        onChange={(e) => setNewVehicle({ ...newVehicle, tank_capacity_liters: parseInt(e.target.value) || 800 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Odometer (km)</Label>
                    <Input
                      type="number"
                      value={newVehicle.current_odometer}
                      onChange={(e) => setNewVehicle({ ...newVehicle, current_odometer: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  {/* Fuel Consumption Ratios */}
                  <div className="border-t pt-4 mt-4">
                    <Label className="text-base font-semibold mb-2 block">Fuel Consumption Ratios</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Set how many kilometers your vehicle travels per 1 liter of fuel
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>When Loaded (km/L)</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">1L per</span>
                          <Input
                            type="number"
                            step="0.1"
                            min="1.5"
                            max="4"
                            value={newVehicle.fuel_consumption_loaded}
                            onChange={(e) => setNewVehicle({ ...newVehicle, fuel_consumption_loaded: parseFloat(e.target.value) || 2 })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">km</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>When Empty (km/L)</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">1L per</span>
                          <Input
                            type="number"
                            step="0.1"
                            min="1.5"
                            max="4"
                            value={newVehicle.fuel_consumption_empty}
                            onChange={(e) => setNewVehicle({ ...newVehicle, fuel_consumption_empty: parseFloat(e.target.value) || 2.5 })}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full" 
                    onClick={handleAddVehicle}
                    disabled={createVehicle.isPending}
                  >
                    {createVehicle.isPending ? 'Adding...' : 'Add Vehicle'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={trailerDialogOpen} onOpenChange={setTrailerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Trailer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Trailer</DialogTitle>
                  <DialogDescription>
                    Enter the trailer details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Registration Number *</Label>
                      <Input
                        placeholder="TRL 1234 GP"
                        value={newTrailer.registration_number}
                        onChange={(e) => setNewTrailer({ ...newTrailer, registration_number: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trailer Type</Label>
                      <Select 
                        value={newTrailer.trailer_type} 
                        onValueChange={(v) => setNewTrailer({ ...newTrailer, trailer_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRAILER_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Make</Label>
                      <Input
                        placeholder="Afrit"
                        value={newTrailer.make}
                        onChange={(e) => setNewTrailer({ ...newTrailer, make: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input
                        placeholder="Interlink"
                        value={newTrailer.model}
                        onChange={(e) => setNewTrailer({ ...newTrailer, model: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Year</Label>
                      <Input
                        type="number"
                        value={newTrailer.year}
                        onChange={(e) => setNewTrailer({ ...newTrailer, year: parseInt(e.target.value) || new Date().getFullYear() })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity (tons)</Label>
                      <Input
                        type="number"
                        value={newTrailer.capacity_tons}
                        onChange={(e) => setNewTrailer({ ...newTrailer, capacity_tons: parseFloat(e.target.value) || 34 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Axles</Label>
                      <Input
                        type="number"
                        value={newTrailer.axle_count}
                        onChange={(e) => setNewTrailer({ ...newTrailer, axle_count: parseInt(e.target.value) || 3 })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Length (meters)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newTrailer.length_meters}
                      onChange={(e) => setNewTrailer({ ...newTrailer, length_meters: parseFloat(e.target.value) || 13.6 })}
                    />
                  </div>

                  <Button
                    className="w-full" 
                    onClick={handleAddTrailer}
                    disabled={createTrailer.isPending}
                  >
                    {createTrailer.isPending ? 'Adding...' : 'Add Trailer'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="vehicles" className="gap-2">
              <Truck className="w-4 h-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="trailers" className="gap-2">
              <Container className="w-4 h-4" />
              Trailers
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={activeTab === 'vehicles' ? "Search vehicles..." : "Search trailers..."}
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
                {activeTab === 'vehicles' ? (
                  <TabsTrigger value="deployed">Deployed</TabsTrigger>
                ) : (
                  <TabsTrigger value="in_use">In Use</TabsTrigger>
                )}
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <TabsContent value="vehicles" className="mt-4">
            {vehiclesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredVehicles && filteredVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    trailers={trailers || []}
                    onAttachTrailer={() => {
                      setSelectedVehicle(vehicle);
                      setAttachDialogOpen(true);
                    }}
                    onDelete={() => setVehicleToDelete(vehicle.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Truck className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground mb-4">
                    {search ? 'Try a different search term' : 'Add your first vehicle to get started'}
                  </p>
                  <Button onClick={() => setVehicleDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trailers" className="mt-4">
            {trailersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTrailers && filteredTrailers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTrailers.map((trailer) => (
                  <TrailerCard 
                    key={trailer.id} 
                    trailer={trailer}
                    onDelete={() => setTrailerToDelete(trailer.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Container className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No trailers found</h3>
                  <p className="text-muted-foreground mb-4">
                    {search ? 'Try a different search term' : 'Add your first trailer to get started'}
                  </p>
                  <Button onClick={() => setTrailerDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Trailer
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Attach Trailer Dialog */}
        <AttachTrailerDialog 
          open={attachDialogOpen}
          onOpenChange={setAttachDialogOpen}
          vehicle={selectedVehicle}
          trailers={trailers?.filter(t => t.status === 'available') || []}
        />

        {/* Delete Vehicle Dialog */}
        <AlertDialog open={!!vehicleToDelete} onOpenChange={() => setVehicleToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Vehicle?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the vehicle from your active fleet. Past trips and records will be preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteVehicle} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Trailer Dialog */}
        <AlertDialog open={!!trailerToDelete} onOpenChange={() => setTrailerToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Trailer?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the trailer from your active fleet. Past trip records will be preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTrailer} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

// Vehicle Card Component with fuel tank display
function VehicleCard({ vehicle, trailers, onAttachTrailer, onDelete }: { vehicle: Vehicle; trailers: Trailer[]; onAttachTrailer: () => void; onDelete: () => void }) {
  const { data: attachedTrailers } = useVehicleTrailers(vehicle.id);
  const detachTrailer = useDetachTrailer();
  const { toast } = useToast();

  const handleDetach = async (attachmentId: string, trailerId: string) => {
    try {
      await detachTrailer.mutateAsync({ attachmentId, trailerId });
      toast({ title: 'Trailer detached successfully' });
    } catch (error: any) {
      toast({ title: 'Error detaching trailer', description: error.message, variant: 'destructive' });
    }
  };

  // Calculate fuel level percentage
  const fuelLevel = vehicle.current_fuel_level || 0;
  const tankCapacity = vehicle.tank_capacity_liters || 800;
  const fuelPercentage = Math.min(Math.round((fuelLevel / tankCapacity) * 100), 100);
  const fuelColor = fuelPercentage > 50 ? 'bg-green-500' : fuelPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{vehicle.registration_number}</h3>
            <p className="text-muted-foreground">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
          {getStatusBadge(vehicle.status)}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span>{vehicle.current_odometer.toLocaleString()} km</span>
          </div>
          
          {/* Fuel Tank Display */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-muted-foreground" />
                <span>Fuel Tank</span>
              </div>
              <span className="font-medium">{fuelLevel}L / {tankCapacity}L</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${fuelColor}`}
                style={{ width: `${fuelPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">{fuelPercentage}%</p>
          </div>
          
          {vehicle.engine_type && (
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-muted-foreground" />
              <span>{vehicle.engine_type}</span>
            </div>
          )}
        </div>

        {/* Attached Trailers */}
        {attachedTrailers && attachedTrailers.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Attached Trailers:</p>
            <div className="space-y-2">
              {attachedTrailers.map((att: any) => (
                <div key={att.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Container className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{att.trailer?.registration_number}</span>
                    <Badge variant="outline" className="text-xs">#{att.position}</Badge>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDetach(att.id, att.trailer_id)}
                    disabled={detachTrailer.isPending}
                  >
                    <Unlink className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAttachTrailer}
            disabled={(attachedTrailers?.length || 0) >= 2}
          >
            <Link2 className="w-4 h-4 mr-1" />
            Attach Trailer
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Vehicle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

// Trailer Card Component
function TrailerCard({ trailer, onDelete }: { trailer: Trailer; onDelete: () => void }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{trailer.registration_number}</h3>
            <p className="text-muted-foreground capitalize">
              {trailer.trailer_type?.replace('_', ' ')} {trailer.make && `• ${trailer.make}`}
            </p>
          </div>
          {getStatusBadge(trailer.status)}
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Capacity:</span>
            <span className="font-medium">{trailer.capacity_tons} tons</span>
          </div>
          {trailer.length_meters && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Length:</span>
              <span className="font-medium">{trailer.length_meters}m</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Axles:</span>
            <span className="font-medium">{trailer.axle_count}</span>
          </div>
          {trailer.year && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Year:</span>
              <span className="font-medium">{trailer.year}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Trailer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

// Attach Trailer Dialog Component
function AttachTrailerDialog({ 
  open, 
  onOpenChange, 
  vehicle, 
  trailers 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  vehicle: Vehicle | null;
  trailers: Trailer[];
}) {
  const [selectedTrailerId, setSelectedTrailerId] = useState('');
  const [position, setPosition] = useState('1');
  const attachTrailer = useAttachTrailer();
  const { data: attachedTrailers } = useVehicleTrailers(vehicle?.id);
  const { toast } = useToast();

  const handleAttach = async () => {
    if (!vehicle || !selectedTrailerId) return;
    
    try {
      await attachTrailer.mutateAsync({
        vehicleId: vehicle.id,
        trailerId: selectedTrailerId,
        position: parseInt(position)
      });
      toast({ title: 'Trailer attached successfully' });
      onOpenChange(false);
      setSelectedTrailerId('');
      setPosition('1');
    } catch (error: any) {
      toast({ title: 'Error attaching trailer', description: error.message, variant: 'destructive' });
    }
  };

  const usedPositions = attachedTrailers?.map((a: any) => a.position) || [];
  const availablePositions = [1, 2].filter(p => !usedPositions.includes(p));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach Trailer to {vehicle?.registration_number}</DialogTitle>
          <DialogDescription>
            Select a trailer and position. Max 2 trailers per vehicle.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Select Trailer</Label>
            <Select value={selectedTrailerId} onValueChange={setSelectedTrailerId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a trailer" />
              </SelectTrigger>
              <SelectContent>
                {trailers.map(trailer => (
                  <SelectItem key={trailer.id} value={trailer.id}>
                    {trailer.registration_number} - {trailer.trailer_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availablePositions.map(p => (
                  <SelectItem key={p} value={p.toString()}>
                    Position {p} {p === 1 ? '(Primary)' : '(Dolly/Second)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button 
              onClick={handleAttach} 
              disabled={!selectedTrailerId || attachTrailer.isPending}
            >
              {attachTrailer.isPending ? 'Attaching...' : 'Attach Trailer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Vehicles;