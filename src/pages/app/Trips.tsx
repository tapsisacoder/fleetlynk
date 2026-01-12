import { useState } from "react";
import { AppLayout } from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MapPin, 
  Search, 
  Filter, 
  Truck, 
  Calendar, 
  DollarSign,
  ArrowRight,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2
} from "lucide-react";
import { useTrips, useUpdateTrip, useDeleteTrip, Trip } from "@/hooks/useTrips";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusColors: Record<string, { bg: string; text: string }> = {
  planned: { bg: "bg-muted", text: "text-muted-foreground" },
  loading: { bg: "bg-warning/20", text: "text-warning" },
  in_transit: { bg: "bg-primary/20", text: "text-primary" },
  delivered: { bg: "bg-success/20", text: "text-success" },
  completed: { bg: "bg-green-500/20", text: "text-green-600" },
  cancelled: { bg: "bg-destructive/20", text: "text-destructive" },
};

const statusLabels: Record<string, string> = {
  planned: "Planned",
  loading: "Loading",
  in_transit: "In Transit",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function Trips() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: trips = [], isLoading } = useTrips();
  const updateTrip = useUpdateTrip();
  const deleteTrip = useDeleteTrip();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.trip_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle?.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeTrips = filteredTrips.filter(t => 
    ['planned', 'loading', 'in_transit', 'delivered'].includes(t.status)
  );
  
  const completedTrips = filteredTrips.filter(t => 
    ['completed', 'cancelled'].includes(t.status)
  );

  const handleStatusUpdate = async (tripId: string, newStatus: string) => {
    try {
      await updateTrip.mutateAsync({ 
        id: tripId, 
        status: newStatus,
        ...(newStatus === 'completed' ? { completed_at: new Date().toISOString() } : {})
      });
      toast({ title: "Trip status updated" });
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!tripToDelete) return;
    try {
      await deleteTrip.mutateAsync(tripToDelete);
      toast({ title: "Trip deleted" });
      setTripToDelete(null);
    } catch (error) {
      toast({ title: "Failed to delete trip", variant: "destructive" });
    }
  };

  const TripCard = ({ trip }: { trip: Trip }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-sm font-semibold text-primary">
                {trip.trip_reference}
              </span>
              <Badge className={`${statusColors[trip.status]?.bg} ${statusColors[trip.status]?.text} border-0`}>
                {statusLabels[trip.status] || trip.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{trip.origin}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{trip.destination}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mt-3">
              {trip.vehicle && (
                <div className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  <span>{trip.vehicle.registration_number}</span>
                </div>
              )}
              {trip.driver && (
                <div className="flex items-center gap-1">
                  <span>👤</span>
                  <span>{trip.driver.full_name}</span>
                </div>
              )}
              {trip.departure_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(trip.departure_date), 'dd MMM yyyy')}</span>
                </div>
              )}
              {trip.rate && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${trip.rate.toLocaleString()}</span>
                </div>
              )}
            </div>

            {trip.status === 'in_transit' && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{trip.progress_percent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${trip.progress_percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedTrip(trip)}>
                <Eye className="w-4 h-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/app/deploy?edit=${trip.id}`)}>
                <Edit className="w-4 h-4 mr-2" /> Edit Trip
              </DropdownMenuItem>
              {trip.status === 'planned' && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(trip.id, 'loading')}>
                  <Play className="w-4 h-4 mr-2" /> Start Loading
                </DropdownMenuItem>
              )}
              {trip.status === 'loading' && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(trip.id, 'in_transit')}>
                  <Truck className="w-4 h-4 mr-2" /> Depart
                </DropdownMenuItem>
              )}
              {trip.status === 'in_transit' && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(trip.id, 'delivered')}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Mark Delivered
                </DropdownMenuItem>
              )}
              {trip.status === 'delivered' && (
                <DropdownMenuItem onClick={() => handleStatusUpdate(trip.id, 'completed')}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Complete Trip
                </DropdownMenuItem>
              )}
              {!['completed', 'cancelled'].includes(trip.status) && (
                <DropdownMenuItem 
                  onClick={() => handleStatusUpdate(trip.id, 'cancelled')}
                  className="text-destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Cancel Trip
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => setTripToDelete(trip.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trips</h1>
            <p className="text-muted-foreground">Manage all your trips in one place</p>
          </div>
          <Button onClick={() => navigate('/app/deploy')} className="bg-secondary hover:bg-secondary/90">
            <Plus className="w-4 h-4 mr-2" /> Deploy New Trip
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search trips, vehicles, drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="loading">Loading</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Active ({activeTrips.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              History ({completedTrips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading trips...</div>
            ) : activeTrips.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active trips found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/app/deploy')}
                  >
                    Deploy Your First Trip
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {completedTrips.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No completed trips yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Trip Details Dialog */}
      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trip Details - {selectedTrip?.trip_reference}</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Route</p>
                  <p className="font-medium">{selectedTrip.origin} → {selectedTrip.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={`${statusColors[selectedTrip.status]?.bg} ${statusColors[selectedTrip.status]?.text}`}>
                    {statusLabels[selectedTrip.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{selectedTrip.vehicle?.registration_number || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Driver</p>
                  <p className="font-medium">{selectedTrip.driver?.full_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedTrip.client?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-medium">{selectedTrip.distance_km ? `${selectedTrip.distance_km} km` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="font-medium">{selectedTrip.rate ? `$${selectedTrip.rate.toLocaleString()}` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Allocated</p>
                  <p className="font-medium">{selectedTrip.fuel_allocated_liters ? `${selectedTrip.fuel_allocated_liters} L` : '-'}</p>
                </div>
              </div>
              {selectedTrip.cargo_description && (
                <div>
                  <p className="text-sm text-muted-foreground">Cargo</p>
                  <p className="font-medium">{selectedTrip.cargo_description}</p>
                </div>
              )}
              {selectedTrip.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{selectedTrip.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!tripToDelete} onOpenChange={() => setTripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trip record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
