import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Navigation, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { PageLayout } from '@/components/layout/PageLayout';
import { MapComponent } from '@/components/MapComponent';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useStore, useDisasterZones, DisasterZone } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

// Mock disaster data for demo
const mockDisasterZones: DisasterZone[] = [
  {
    id: '1',
    type: 'flood',
    severity: 'high',
    coordinates: [
      [40.7589, -73.9851],
      [40.7489, -73.9851], 
      [40.7489, -73.9751],
      [40.7589, -73.9751]
    ],
    title: 'Times Square Flood Warning',
    description: 'Heavy rainfall has caused street flooding in the Times Square area. Avoid the area and seek higher ground.',
    lastUpdated: new Date().toISOString()
  }
];

export default function HomePage() {
  const { location, loading, error, requestLocation } = useGeolocation();
  const disasterZones = useDisasterZones();
  const { setDisasterZones } = useStore();
  const [selectedZone, setSelectedZone] = useState<DisasterZone | null>(null);

  const defaultCenter: [number, number] = [40.7589, -73.9851]; // NYC

  useEffect(() => {
    // Load mock disaster data
    setDisasterZones(mockDisasterZones);
  }, [setDisasterZones]);

  const handleEmergencySOSClick = () => {
    toast({
      title: "🚨 Emergency Mode",
      description: "Redirecting to SOS page for immediate assistance..."
    });
    window.location.href = '/sos';
  };

  const handleViewOnMap = (zone: DisasterZone) => {
    // Simulate opening external map
    const coords = zone.coordinates[0]; // Get first coordinate
    const url = `https://www.google.com/maps/?q=${coords[0]},${coords[1]}`;
    window.open(url, '_blank');
    
    toast({
      title: "🗺️ Opening Map",
      description: "Viewing disaster zone location on external map"
    });
  };

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="glass p-6 max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Location Access Required</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={requestLocation} variant="outline">
              <Navigation className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="relative h-[calc(100vh-5rem)] w-full">
        {/* Interactive Map */}
        <MapComponent 
          userLocation={location}
          disasterZones={disasterZones}
          loading={loading}
          className="h-full w-full"
        />

        {/* Location Status */}
        {location && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 z-30"
          >
            <Card className="glass border-safe/30 backdrop-blur-md">
              <div className="p-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-safe" />
                <div className="text-sm">
                  <div className="font-medium text-safe">Location Found</div>
                  <div className="text-xs text-muted-foreground">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Disaster Zones Overlay */}
        {disasterZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 left-4 z-30 space-y-2 max-w-xs"
          >
            {disasterZones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card 
                  className="glass border-emergency/30 bg-emergency/10 backdrop-blur-md cursor-pointer glass-hover"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-emergency" />
                      <Badge variant="destructive" className="text-xs">
                        {zone.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-emergency">{zone.title}</div>
                    <div className="text-xs text-muted-foreground">{zone.type} Alert</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Floating SOS Button */}
        <motion.div
          className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        >
          <Button 
            size="lg"
            className="pulse-emergency bg-emergency hover:bg-emergency/90 text-emergency-foreground font-bold px-8 py-4 rounded-full shadow-2xl"
            onClick={handleEmergencySOSClick}
          >
            <AlertTriangle className="w-6 h-6 mr-2" />
            EMERGENCY SOS
          </Button>
        </motion.div>
      </div>

      {/* Disaster Zone Details Drawer */}
      {selectedZone && (
        <Drawer open={!!selectedZone} onOpenChange={() => setSelectedZone(null)}>
          <DrawerContent className="glass border-white/20">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-emergency" />
                {selectedZone.title}
              </DrawerTitle>
            </DrawerHeader>
            
            <div className="p-4 space-y-4">
              <Badge 
                variant={selectedZone.severity === 'critical' || selectedZone.severity === 'high' ? 'destructive' : 'secondary'}
                className="mb-2"
              >
                {selectedZone.severity.toUpperCase()} ALERT
              </Badge>
              
              <p className="text-foreground">{selectedZone.description}</p>
              
              <div className="text-sm text-muted-foreground">
                Last Updated: {new Date(selectedZone.lastUpdated).toLocaleString()}
              </div>

              <div className="flex gap-2 mt-4">
                <Button className="flex-1" onClick={() => handleViewOnMap(selectedZone)}>
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate to Safety
                </Button>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Find Shelter
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </PageLayout>
  );
}