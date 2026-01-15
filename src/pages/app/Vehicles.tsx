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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Truck, Search, MoreVertical, Gauge, Fuel } from 'lucide-react';
import { useVehicles, useCreateVehicle, Vehicle } from '@/hooks/useVehicles';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'deployed':
      return <Badge className="bg-green-100 text-green-700">🚛 Deployed</Badge>;
    case 'available':
      return <Badge className="bg-blue-100 text-blue-700">✓ Available</Badge>;
    case 'maintenance':
      return <Badge className="bg-amber-100 text-amber-700">🔧 Maintenance</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const Vehicles = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registration_number: '',
    make: '',
    model: '',
    engine_type: '',
    tank_capacity_liters: 800,
    year: new Date().getFullYear(),
    current_odometer: 0,
    fuel_consumption_loaded: 2.0, // 1L per Xkm when loaded
    fuel_consumption_empty: 2.5, // 1L per Xkm when empty
  });
  
  const { data: vehicles, isLoading } = useVehicles();
  const createVehicle = useCreateVehicle();
  const { toast } = useToast();

  const filteredVehicles = vehicles?.filter(v => {
    const matchesFilter = filter === 'all' || v.status === filter;
    const matchesSearch = 
      v.registration_number.toLowerCase().includes(search.toLowerCase()) ||
      v.make?.toLowerCase().includes(search.toLowerCase()) ||
      v.model?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddVehicle = async () => {
    try {
      await createVehicle.mutateAsync(newVehicle);
      toast({
        title: 'Vehicle added',
        description: `${newVehicle.registration_number} has been added to your fleet.`,
      });
      setDialogOpen(false);
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fleet</h1>
            <p className="text-muted-foreground">
              {vehicles?.length || 0} vehicles in your fleet
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>
                  Enter the vehicle details below.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Registration Number</Label>
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
                      onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
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
                      onChange={(e) => setNewVehicle({ ...newVehicle, tank_capacity_liters: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Current Odometer (km)</Label>
                  <Input
                    type="number"
                    value={newVehicle.current_odometer}
                    onChange={(e) => setNewVehicle({ ...newVehicle, current_odometer: parseInt(e.target.value) })}
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
                      <p className="text-xs text-muted-foreground">Range: 2-3 km/L typical</p>
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
                      <p className="text-xs text-muted-foreground">Range: 2.5-3.5 km/L typical</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full" 
                  onClick={handleAddVehicle}
                  disabled={createVehicle.isPending || !newVehicle.registration_number}
                >
                  {createVehicle.isPending ? 'Adding...' : 'Add Vehicle'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="deployed">Deployed</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Vehicle Grid */}
        {isLoading ? (
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
              <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
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
                    <div className="flex items-center gap-2 text-sm">
                      <Fuel className="w-4 h-4 text-muted-foreground" />
                      <span>{vehicle.tank_capacity_liters}L tank</span>
                    </div>
                    {vehicle.engine_type && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-muted-foreground" />
                        <span>{vehicle.engine_type}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Vehicles;
