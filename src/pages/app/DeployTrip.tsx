import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, MapPin, Calendar, User, Package, DollarSign, Fuel, Save, ArrowLeft, Calculator
} from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";
import { useDrivers } from "@/hooks/useDrivers";
import { useClients } from "@/hooks/useClients";
import { useDriverAssignments } from "@/hooks/useDriverAssignments";
import { useCreateTrip, useTrip, useUpdateTrip } from "@/hooks/useTrips";
import { useToast } from "@/hooks/use-toast";

export default function DeployTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { toast } = useToast();
  
  const { data: vehicles = [] } = useVehicles();
  const { data: drivers = [] } = useDrivers();
  const { data: clients = [] } = useClients();
  const { data: driverAssignments = [] } = useDriverAssignments();
  const { data: existingTrip } = useTrip(editId || '');
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  const [formData, setFormData] = useState({
    vehicle_id: "",
    driver_id: "",
    client_id: "",
    origin: "",
    destination: "",
    distance_km: "",
    departure_date: "",
    eta: "",
    rate: "",
    tonnage: "",
    cargo_description: "",
    fuel_allocated_liters: "",
    load_status: "loaded",
    trip_costs: "",
    notes: "",
  });

  useEffect(() => {
    if (existingTrip) {
      setFormData({
        vehicle_id: existingTrip.vehicle_id || "",
        driver_id: existingTrip.driver_id || "",
        client_id: existingTrip.client_id || "",
        origin: existingTrip.origin,
        destination: existingTrip.destination,
        distance_km: existingTrip.distance_km?.toString() || "",
        departure_date: existingTrip.departure_date?.split('T')[0] || "",
        eta: existingTrip.eta?.split('T')[0] || "",
        rate: existingTrip.rate?.toString() || "",
        tonnage: existingTrip.tonnage?.toString() || "",
        cargo_description: existingTrip.cargo_description || "",
        fuel_allocated_liters: existingTrip.fuel_allocated_liters?.toString() || "",
        load_status: existingTrip.load_status,
        trip_costs: existingTrip.trip_costs?.toString() || "",
        notes: existingTrip.notes || "",
      });
    }
  }, [existingTrip]);

  // Auto-assign driver when vehicle is selected
  useEffect(() => {
    if (formData.vehicle_id && !editId) {
      const assignment = driverAssignments.find(a => a.vehicle_id === formData.vehicle_id);
      if (assignment) {
        setFormData(prev => ({ ...prev, driver_id: assignment.driver_id }));
      }
    }
  }, [formData.vehicle_id, driverAssignments, editId]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get assigned driver for selected vehicle
  const assignedDriver = driverAssignments.find(a => a.vehicle_id === formData.vehicle_id);
  const hasAssignedDriver = !!assignedDriver;

  const calculateFuel = () => {
    const distance = parseFloat(formData.distance_km);
    if (!distance) return;
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
    const ratio = formData.load_status === "loaded" 
      ? (selectedVehicle?.fuel_consumption_loaded || 2) 
      : (selectedVehicle?.fuel_consumption_empty || 2.5);
    const fuelNeeded = distance / ratio;
    handleChange('fuel_allocated_liters', fuelNeeded.toFixed(1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) {
      toast({ title: "Please fill in origin and destination", variant: "destructive" });
      return;
    }

    try {
      const tripData = {
        trip_reference: editId ? existingTrip!.trip_reference : `TRIP-${Date.now()}`,
        vehicle_id: formData.vehicle_id || undefined,
        driver_id: formData.driver_id || undefined,
        client_id: formData.client_id || undefined,
        origin: formData.origin,
        destination: formData.destination,
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : undefined,
        departure_date: formData.departure_date || undefined,
        eta: formData.eta || undefined,
        rate: formData.rate ? parseFloat(formData.rate) : undefined,
        tonnage: formData.tonnage ? parseFloat(formData.tonnage) : undefined,
        cargo_description: formData.cargo_description || undefined,
        fuel_allocated_liters: formData.fuel_allocated_liters ? parseFloat(formData.fuel_allocated_liters) : undefined,
        load_status: formData.load_status,
        trip_costs: formData.trip_costs ? parseFloat(formData.trip_costs) : undefined,
        notes: formData.notes || undefined,
        status: 'planned',
      };

      if (editId) {
        await updateTrip.mutateAsync({ id: editId, ...tripData });
        toast({ title: "Trip updated successfully" });
      } else {
        await createTrip.mutateAsync(tripData);
        toast({ title: "Trip deployed successfully" });
      }
      
      navigate('/app/trips');
    } catch (error) {
      toast({ title: "Failed to save trip", variant: "destructive" });
    }
  };

  const availableVehicles = vehicles.filter(v => v.is_active && v.status === 'available');
  const availableDrivers = drivers.filter(d => d.is_active);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/trips')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {editId ? 'Edit Trip' : 'Deploy New Trip'}
            </h1>
            <p className="text-muted-foreground">
              {editId ? 'Update trip details' : 'Set up a new trip with all the details'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origin *</Label>
                  <Input id="origin" placeholder="e.g., Johannesburg, South Africa" value={formData.origin} onChange={(e) => handleChange('origin', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="destination">Destination *</Label>
                  <Input id="destination" placeholder="e.g., Harare, Zimbabwe" value={formData.destination} onChange={(e) => handleChange('destination', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="distance_km">Distance (km)</Label>
                  <Input id="distance_km" type="number" placeholder="560" value={formData.distance_km} onChange={(e) => handleChange('distance_km', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="departure_date">Departure Date</Label>
                  <Input id="departure_date" type="date" value={formData.departure_date} onChange={(e) => handleChange('departure_date', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="eta">ETA</Label>
                  <Input id="eta" type="date" value={formData.eta} onChange={(e) => handleChange('eta', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-secondary" />
                Vehicle & Driver Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Vehicle</Label>
                  <Select value={formData.vehicle_id} onValueChange={(v) => handleChange('vehicle_id', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.registration_number} - {vehicle.make} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Driver</Label>
                  {hasAssignedDriver ? (
                    <div className="flex items-center gap-2 h-10 px-3 bg-muted rounded-md border border-border">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{assignedDriver.driver?.full_name || 'Assigned Driver'}</span>
                      <Badge variant="outline" className="text-xs ml-auto">Auto-assigned</Badge>
                    </div>
                  ) : (
                    <Select value={formData.driver_id} onValueChange={(v) => handleChange('driver_id', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDrivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {hasAssignedDriver && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Driver auto-assigned from vehicle. Change in Fleet tab.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label>Client</Label>
                <Select value={formData.client_id} onValueChange={(v) => handleChange('client_id', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cargo & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-secondary" />
                Cargo & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Load Status</Label>
                  <Select value={formData.load_status} onValueChange={(v) => handleChange('load_status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loaded">Loaded</SelectItem>
                      <SelectItem value="empty">Empty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tonnage">Tonnage</Label>
                  <Input id="tonnage" type="number" placeholder="30" value={formData.tonnage} onChange={(e) => handleChange('tonnage', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="rate">Rate ($)</Label>
                  <Input id="rate" type="number" placeholder="2500" value={formData.rate} onChange={(e) => handleChange('rate', e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="cargo_description">Cargo Description</Label>
                <Textarea id="cargo_description" placeholder="Describe the cargo..." value={formData.cargo_description} onChange={(e) => handleChange('cargo_description', e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Fuel Allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-secondary" />
                Fuel Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <Label htmlFor="fuel_allocated_liters">Fuel Allocated (Liters)</Label>
                  <Input id="fuel_allocated_liters" type="number" placeholder="Auto-calculated or enter manually" value={formData.fuel_allocated_liters} onChange={(e) => handleChange('fuel_allocated_liters', e.target.value)} />
                </div>
                <Button type="button" variant="outline" onClick={calculateFuel} disabled={!formData.distance_km}>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trip Costs (Book Out) - Manual Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                Trip Costs (Book Out)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="trip_costs">Total Book Out Amount ($)</Label>
                <Input
                  id="trip_costs"
                  type="number"
                  value={formData.trip_costs}
                  onChange={(e) => handleChange('trip_costs', e.target.value)}
                  placeholder="Enter total book out amount manually"
                  className="text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  Includes tolls, food, accommodation, and other trip expenses. Enter the exact amount.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle>Additional Notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="Any additional notes..." value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={4} />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/app/trips')}>Cancel</Button>
            <Button type="submit" className="bg-secondary hover:bg-secondary/90" disabled={createTrip.isPending || updateTrip.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update Trip' : 'Deploy Trip'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
