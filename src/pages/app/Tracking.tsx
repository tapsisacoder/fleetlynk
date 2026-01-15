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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, Satellite, Truck, Activity, Signal, Settings,
  Navigation, Battery, Gauge, Clock, AlertTriangle, Wifi
} from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import { useActiveTrips } from '@/hooks/useTrips';

const GPS_PROVIDERS = [
  { id: 'cartrack', name: 'Cartrack', logo: '🛰️' },
  { id: 'netstar', name: 'Netstar', logo: '📡' },
  { id: 'tracker', name: 'Tracker Connect', logo: '🔗' },
  { id: 'mix', name: 'MiX Telematics', logo: '📍' },
  { id: 'custom', name: 'Custom API', logo: '⚙️' },
];

// Demo tracking data
const demoTrackingData = [
  { 
    vehicleId: '1', 
    registration: 'ABC 123 GP',
    lat: -25.7461, 
    lng: 28.1881, 
    speed: 85, 
    heading: 45,
    lastUpdate: '2 min ago',
    status: 'moving',
    ignition: true,
    fuel: 75,
    driver: 'John Moyo'
  },
  { 
    vehicleId: '2', 
    registration: 'XYZ 456 GP',
    lat: -26.2041, 
    lng: 28.0473, 
    speed: 0, 
    heading: 0,
    lastUpdate: '5 min ago',
    status: 'stationary',
    ignition: false,
    fuel: 45,
    driver: 'Peter Ncube'
  },
  { 
    vehicleId: '3', 
    registration: 'DEF 789 GP',
    lat: -17.8292, 
    lng: 31.0522, 
    speed: 72, 
    heading: 180,
    lastUpdate: '1 min ago',
    status: 'moving',
    ignition: true,
    fuel: 60,
    driver: 'Sarah Dube'
  },
];

const Tracking = () => {
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { data: vehicles } = useVehicles();
  const { data: activeTrips } = useActiveTrips();

  const handleConnect = () => {
    if (!selectedProvider || !apiKey) return;
    setIsConnected(true);
    setIsConnectOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'bg-green-100 text-green-800';
      case 'stationary': return 'bg-amber-100 text-amber-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                  <Label>Select GPS Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your GPS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {GPS_PROVIDERS.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          <span className="flex items-center gap-2">
                            <span>{provider.logo}</span>
                            {provider.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>API Key / Access Token</Label>
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

                {selectedProvider === 'custom' && (
                  <div className="space-y-2">
                    <Label>API Endpoint URL</Label>
                    <Input placeholder="https://api.yourprovider.com/v1" />
                  </div>
                )}

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
                  <Button onClick={handleConnect} disabled={!selectedProvider || !apiKey}>
                    Connect Provider
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
                    {GPS_PROVIDERS.find(p => p.id === selectedProvider)?.name} - Live tracking active
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
                  <p className="text-2xl font-bold text-green-600">
                    {demoTrackingData.filter(v => v.status === 'moving').length}
                  </p>
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
                  <p className="text-2xl font-bold text-amber-600">
                    {demoTrackingData.filter(v => v.status === 'stationary').length}
                  </p>
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
                  <p className="text-2xl font-bold">{demoTrackingData.length}</p>
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
              
              {/* Vehicle markers (demo) */}
              {isConnected && demoTrackingData.map((vehicle, index) => (
                <div 
                  key={vehicle.vehicleId}
                  className="absolute animate-pulse"
                  style={{
                    left: `${20 + (index * 25)}%`,
                    top: `${30 + (index * 15)}%`,
                  }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    vehicle.status === 'moving' ? 'bg-green-500' : 'bg-amber-500'
                  }`}>
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-xs font-medium mt-1 bg-white px-1 rounded shadow">
                    {vehicle.registration}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle List */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoTrackingData.map((vehicle) => (
                <div 
                  key={vehicle.vehicleId} 
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      vehicle.status === 'moving' ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      <Truck className={`w-6 h-6 ${
                        vehicle.status === 'moving' ? 'text-green-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold">{vehicle.registration}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.driver}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Gauge className="w-4 h-4" />
                        <span>{vehicle.speed} km/h</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Battery className="w-4 h-4" />
                        <span>{vehicle.fuel}%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{vehicle.lastUpdate}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status === 'moving' ? '🟢 Moving' : '🟡 Parked'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Tracking;
