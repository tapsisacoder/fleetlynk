import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Truck, Settings, ExternalLink, Signal, SignalZero } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVehicles } from '@/hooks/useVehicles';

export function GPSTrackingWidget() {
  const navigate = useNavigate();
  const { data: vehicles = [] } = useVehicles();
  
  // Simulated GPS status - in real implementation, this would come from GPS provider API
  const deployedVehicles = vehicles.filter(v => v.status === 'deployed');
  const connectedDevices = Math.min(deployedVehicles.length, 2); // Simulated
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" />
            GPS Tracking
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {connectedDevices > 0 ? (
              <><Signal className="w-3 h-3 mr-1 text-green-500" /> Live</>
            ) : (
              <><SignalZero className="w-3 h-3 mr-1" /> Offline</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Tracked Vehicles</span>
            <span className="font-bold">{connectedDevices}/{deployedVehicles.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all"
              style={{ 
                width: deployedVehicles.length > 0 
                  ? `${(connectedDevices / deployedVehicles.length) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </div>

        {/* Quick Vehicle Status */}
        {deployedVehicles.length > 0 ? (
          <div className="space-y-2">
            {deployedVehicles.slice(0, 3).map((vehicle, index) => (
              <div 
                key={vehicle.id}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{vehicle.registration_number}</span>
                </div>
                <Badge 
                  variant={index < connectedDevices ? "default" : "secondary"}
                  className="text-xs"
                >
                  {index < connectedDevices ? "Online" : "No Signal"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No vehicles deployed</p>
          </div>
        )}

        {/* API Integration Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 mb-2">
            🔌 <strong>GPS Provider Integration Ready</strong>
          </p>
          <p className="text-xs text-blue-600">
            Connect your GPS provider (Flespi, Wialon, Traccar, etc.) to enable real-time tracking.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate('/app/tracking')}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Open Map
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/app/tracking')}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
