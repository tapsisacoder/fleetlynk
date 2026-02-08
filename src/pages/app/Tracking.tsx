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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MapPin, Satellite, Truck, Signal,
  Navigation, Clock, Wifi
} from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { useActiveTrips } from '@/hooks/useTrips';
import { useGPSIntegrations, useCreateGPSIntegration } from '@/hooks/useGPSIntegrations';
import { useToast } from '@/hooks/use-toast';

const Tracking = () => {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [providerName, setProviderName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const { data: vehicles } = useVehicles();
  const { data: activeTrips } = useActiveTrips();
  const { data: integrations = [] } = useGPSIntegrations();
  const createIntegration = useCreateGPSIntegration();
  const { toast } = useToast();

  const isConnected = integrations.some(i => i.is_active);
  const activeIntegration = integrations.find(i => i.is_active);

  const handleConnect = async () => {
    if (!providerName || !apiUrl || !apiKey) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    
    try {
      await createIntegration.mutateAsync({
        provider_name: providerName,
        api_url: apiUrl,
        api_key: apiKey,
        is_active: true,
      });
      toast({ title: 'GPS provider connected successfully' });
      setIsConnectOpen(false);
      setProviderName('');
      setApiUrl('');
      setApiKey('');
    } catch (error: any) {
      toast({ title: 'Error connecting provider', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'bg-green-100 text-green-800';
      case 'stationary': return 'bg-amber-100 text-amber-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Count vehicles by status (based on active trips)
  const movingCount = activeTrips?.filter(t => t.status === 'in_transit').length || 0;
  const stationaryCount = (vehicles?.length || 0) - movingCount;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">GPS Tracking</h1>
            <p className="text-muted-foreground">Real-time fleet tracking and monitoring</p>
          </div>
          <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Satellite className="w-4 h-4" />
                {isConnected ? 'Manage Connection' : 'Connect GPS Provider'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect GPS Provider</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Provider Name *</Label>
                  <Input
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g., Cartrack, Netstar, MiX Telematics"
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Endpoint URL *</Label>
                  <Input
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://api.yourprovider.com/v1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Key / Access Token *</Label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get this from your GPS provider's dashboard
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Integration Benefits:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Real-time vehicle location tracking</li>
                    <li>Speed and route monitoring</li>
                    <li>Fuel level and ignition status</li>
                    <li>Geofence alerts and notifications</li>
                    <li>Historical trip playback</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsConnectOpen(false)}>Cancel</Button>
                  <Button onClick={handleConnect} disabled={!providerName || !apiUrl || !apiKey || createIntegration.isPending}>
                    {createIntegration.isPending ? 'Connecting...' : 'Connect Provider'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Connection Status */}
        {isConnected ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">GPS Connected</p>
                  <p className="text-sm text-green-600">
                    {activeIntegration?.provider_name} - Live tracking active
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <Satellite className="w-12 h-12 mx-auto mb-4 text-amber-600" />
              <h3 className="text-lg font-semibold mb-2">No GPS Provider Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your GPS tracking provider to enable real-time fleet monitoring
              </p>
              <Button onClick={() => setIsConnectOpen(true)}>
                <Satellite className="w-4 h-4 mr-2" />
                Connect GPS Provider
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Moving</p>
                  <p className="text-2xl font-bold text-green-600">{movingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stationary</p>
                  <p className="text-2xl font-bold text-amber-600">{stationaryCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Signal className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-red-600">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tracked</p>
                  <p className="text-2xl font-bold">{vehicles?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-[400px] flex items-center justify-center relative overflow-hidden">
              {/* Simulated map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-blue-100 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-muted-foreground">Map Integration Ready</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isConnected 
                      ? 'GPS data is being received. Map will display vehicle locations.'
                      : 'Connect a GPS provider to view live vehicle positions'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: Google Maps, Leaflet, Mapbox
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicles && vehicles.length > 0 ? (
              <div className="space-y-4">
                {vehicles.map((vehicle) => {
                  const isMoving = activeTrips?.some(t => t.vehicle_id === vehicle.id && t.status === 'in_transit');
                  return (
                    <div 
                      key={vehicle.id} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isMoving ? 'bg-green-100' : 'bg-amber-100'
                        }`}>
                          <Truck className={`w-6 h-6 ${
                            isMoving ? 'text-green-600' : 'text-amber-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold">{vehicle.registration_number}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>—</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(isMoving ? 'moving' : 'stationary')}>
                          {isMoving ? '🟢 Moving' : '🟡 Parked'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No vehicles in your fleet yet.</p>
                <p className="text-sm">Add vehicles to start tracking them.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Tracking;
