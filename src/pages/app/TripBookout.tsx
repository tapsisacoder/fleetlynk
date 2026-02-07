import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTrips } from '@/hooks/useTrips';
import { useDrivers } from '@/hooks/useDrivers';
import { useVehicles } from '@/hooks/useVehicles';
import { useCreateBookout } from '@/hooks/useAccounting';
import { 
  ArrowLeft, 
  Truck, 
  User, 
  MapPin, 
  DollarSign,
  Save,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const TripBookout = () => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const { toast } = useToast();

  const { data: trips } = useTrips();
  const { data: drivers } = useDrivers();
  const { data: vehicles } = useVehicles();
  const createBookout = useCreateBookout();

  const [selectedTrip, setSelectedTrip] = useState(tripId || '');
  const [operatorName, setOperatorName] = useState('');
  const [bookoutDate, setBookoutDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Cash allocations - all manual entry, no suggestions
  const [foodAllowance, setFoodAllowance] = useState('');
  const [tollFees, setTollFees] = useState('');
  const [borderFees, setBorderFees] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [airtime, setAirtime] = useState('');
  const [emergencyFund, setEmergencyFund] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');
  const [notes, setNotes] = useState('');

  const activeTrips = trips?.filter(t => t.status === 'scheduled' || t.status === 'in_transit');
  const currentTrip = trips?.find(t => t.id === selectedTrip);
  const tripDriver = drivers?.find(d => d.id === currentTrip?.driver_id);
  const tripVehicle = vehicles?.find(v => v.id === currentTrip?.vehicle_id);

  const totalCashGiven = [
    foodAllowance,
    tollFees,
    borderFees,
    accommodation,
    airtime,
    emergencyFund,
    otherExpenses
  ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  const handleSubmit = async () => {
    if (!selectedTrip) {
      toast({ title: 'Error', description: 'Please select a trip', variant: 'destructive' });
      return;
    }

    if (totalCashGiven <= 0) {
      toast({ title: 'Error', description: 'Please enter cash allocations', variant: 'destructive' });
      return;
    }

    try {
      await createBookout.mutateAsync({
        trip_id: selectedTrip,
        driver_id: currentTrip?.driver_id || '',
        vehicle_id: currentTrip?.vehicle_id || undefined,
        bookout_date: bookoutDate,
        operator_name: operatorName || undefined,
        total_cash_given: totalCashGiven,
        food_allowance: parseFloat(foodAllowance) || undefined,
        toll_fees: parseFloat(tollFees) || undefined,
        border_fees: parseFloat(borderFees) || undefined,
        accommodation: parseFloat(accommodation) || undefined,
        airtime: parseFloat(airtime) || undefined,
        emergency_fund: parseFloat(emergencyFund) || undefined,
        other_expenses: parseFloat(otherExpenses) || undefined,
        notes: notes || undefined,
      });

      toast({ title: 'Bookout created', description: 'Driver cash has been allocated' });
      navigate('/app/trips');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create bookout', variant: 'destructive' });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trip Bookout</h1>
            <p className="text-muted-foreground">Allocate cash to driver for a trip</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>Select the trip for this bookout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Trip *</Label>
                  <Select value={selectedTrip} onValueChange={setSelectedTrip}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trip" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTrips?.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id}>
                          {trip.trip_reference} - {trip.origin} → {trip.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentTrip && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Route</p>
                        <p className="font-medium">{currentTrip.origin} → {currentTrip.destination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{tripVehicle?.registration_number || 'Not assigned'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Driver</p>
                        <p className="font-medium">{tripDriver?.full_name || 'Not assigned'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="font-medium">{currentTrip.distance_km?.toLocaleString() || 0} km</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bookout Date</Label>
                    <Input
                      type="date"
                      value={bookoutDate}
                      onChange={(e) => setBookoutDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Operator Name</Label>
                    <Input
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      placeholder="Person issuing cash"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Allocations */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Allocations</CardTitle>
                <CardDescription>Enter the amount for each expense category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Food Allowance</Label>
                    <Input
                      type="number"
                      value={foodAllowance}
                      onChange={(e) => setFoodAllowance(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Toll Fees</Label>
                    <Input
                      type="number"
                      value={tollFees}
                      onChange={(e) => setTollFees(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Border Fees</Label>
                    <Input
                      type="number"
                      value={borderFees}
                      onChange={(e) => setBorderFees(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accommodation</Label>
                    <Input
                      type="number"
                      value={accommodation}
                      onChange={(e) => setAccommodation(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Airtime</Label>
                    <Input
                      type="number"
                      value={airtime}
                      onChange={(e) => setAirtime(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Fund</Label>
                    <Input
                      type="number"
                      value={emergencyFund}
                      onChange={(e) => setEmergencyFund(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Other Expenses</Label>
                  <Input
                    type="number"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes for this bookout..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Cash Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {parseFloat(foodAllowance) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Food Allowance</span>
                      <span>${parseFloat(foodAllowance).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(tollFees) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Toll Fees</span>
                      <span>${parseFloat(tollFees).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(borderFees) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Border Fees</span>
                      <span>${parseFloat(borderFees).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(accommodation) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Accommodation</span>
                      <span>${parseFloat(accommodation).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(airtime) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Airtime</span>
                      <span>${parseFloat(airtime).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(emergencyFund) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Emergency Fund</span>
                      <span>${parseFloat(emergencyFund).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(otherExpenses) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Other Expenses</span>
                      <span>${parseFloat(otherExpenses).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total Cash</span>
                  <span className="text-primary">${totalCashGiven.toFixed(2)}</span>
                </div>

                {!selectedTrip && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Please select a trip</span>
                  </div>
                )}

                <Button 
                  className="w-full gap-2" 
                  onClick={handleSubmit}
                  disabled={!selectedTrip || totalCashGiven <= 0 || createBookout.isPending}
                >
                  <Save className="w-4 h-4" />
                  {createBookout.isPending ? 'Creating...' : 'Create Bookout'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TripBookout;