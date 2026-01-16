import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  MapPin, 
  Fuel, 
  DollarSign, 
  AlertCircle, 
  Plus,
  ArrowRight,
  Clock,
  TrendingUp,
  Receipt,
  CreditCard
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useAccounting';
import { useActiveTrips } from '@/hooks/useTrips';
import { useVehicles } from '@/hooks/useVehicles';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { GPSTrackingWidget } from '@/components/app/GPSTrackingWidget';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activeTrips, isLoading: tripsLoading } = useActiveTrips();
  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();

  const deployedVehicles = vehicles?.filter(v => v.status === 'deployed').length || 0;
  const availableVehicles = vehicles?.filter(v => v.status === 'available').length || 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your fleet overview.</p>
          </div>
          <Button onClick={() => navigate('/app/deploy')} className="gap-2">
            <Plus className="w-4 h-4" />
            Deploy Trip
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Vehicles</p>
                  {vehiclesLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">{deployedVehicles}/{vehicles?.length || 0}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {availableVehicles} available
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Trips</p>
                  {tripsLoading ? (
                    <Skeleton className="h-8 w-12 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">{activeTrips?.length || 0}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">In transit</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-24 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">
                      ${stats?.monthlyRevenue.toLocaleString() || '0'}
                    </p>
                  )}
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    This month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receivables</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">
                      ${stats?.receivables.toLocaleString() || '0'}
                    </p>
                  )}
                  {(stats?.overdueInvoices || 0) > 0 && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {stats?.overdueInvoices} overdue
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        {((stats?.pendingExpenses || 0) > 0 || (stats?.overdueInvoices || 0) > 0) && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(stats?.pendingExpenses || 0) > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span>{stats?.pendingExpenses} expenses need approval</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/app/expenses')}>
                    Review
                  </Button>
                </div>
              )}
              {(stats?.overdueInvoices || 0) > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-destructive" />
                    <span>{stats?.overdueInvoices} invoices overdue</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/app/invoices')}>
                    View
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GPS Tracking Widget */}
          <GPSTrackingWidget />
          {/* Active Trips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Trips</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/app/trips')}>
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {tripsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : activeTrips && activeTrips.length > 0 ? (
                <div className="space-y-3">
                  {activeTrips.slice(0, 3).map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{trip.trip_reference}</p>
                        <p className="text-sm text-muted-foreground">
                          {trip.origin} → {trip.destination}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {trip.vehicle?.registration_number} • {trip.driver?.full_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          In Transit
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {trip.progress_percent}% complete
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active trips</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/app/deploy')}>
                    Deploy a trip
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-14"
                onClick={() => navigate('/app/deploy')}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Deploy New Trip</p>
                  <p className="text-xs text-muted-foreground">Create and dispatch a trip</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-14"
                onClick={() => navigate('/app/calculator')}
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Fuel className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Calculate Fuel</p>
                  <p className="text-xs text-muted-foreground">Estimate fuel for a route</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-14"
                onClick={() => navigate('/app/invoices')}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Create Invoice</p>
                  <p className="text-xs text-muted-foreground">Bill a client for a trip</p>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-14"
                onClick={() => navigate('/app/reports')}
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">View Reports</p>
                  <p className="text-xs text-muted-foreground">Financial & operational reports</p>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
