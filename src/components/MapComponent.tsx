import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DisasterZone } from '@/store/useStore';

// MapTiler API key
const MAPTILER_API_KEY = 'xanBpghmk4MnYRATZ0Jd';

interface MapComponentProps {
  userLocation?: { lat: number; lng: number } | null;
  disasterZones?: DisasterZone[];
  loading?: boolean;
  className?: string;
}

export function MapComponent({ 
  userLocation, 
  disasterZones = [], 
  loading = false,
  className = '' 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const disasterLayersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with MapTiler satellite hybrid style
    const map = L.map(mapRef.current, {
      center: userLocation ? [userLocation.lat, userLocation.lng] : [40.7589, -73.9851],
      zoom: userLocation ? 15 : 10,
      zoomControl: true,
      attributionControl: true,
    });

    // Add MapTiler satellite hybrid tiles
    L.tileLayer(
      `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`,
      {
        attribution: '© MapTiler © OpenStreetMap contributors',
        maxZoom: 20,
      }
    ).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
    }

    // Create custom user location icon
    const userIcon = L.divIcon({
      html: `
        <div class="relative">
          <div class="w-6 h-6 bg-safe rounded-full border-2 border-white shadow-lg animate-pulse-safe"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
        </div>
      `,
      className: 'user-location-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Add user marker
    const marker = L.marker([userLocation.lat, userLocation.lng], { 
      icon: userIcon,
      zIndexOffset: 1000 
    })
      .bindPopup(`
        <div class="glass p-3 border border-white/20 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 bg-safe rounded-full"></div>
            <span class="font-medium text-safe">Your Location</span>
          </div>
          <div class="text-sm text-muted-foreground">
            ${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}
          </div>
        </div>
      `)
      .addTo(mapInstanceRef.current);

    userMarkerRef.current = marker;

    // Center map on user location
    mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15);
  }, [userLocation]);

  // Update disaster zones
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing disaster layers
    disasterLayersRef.current.forEach(layer => {
      mapInstanceRef.current?.removeLayer(layer);
    });
    disasterLayersRef.current = [];

    // Add disaster zones
    disasterZones.forEach(zone => {
      if (zone.coordinates && zone.coordinates.length > 0) {
        const coords = zone.coordinates[0]; // Get first coordinate pair
        
        // Create disaster zone icon
        const disasterIcon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-8 h-8 bg-emergency rounded-full border-2 border-white shadow-lg animate-pulse-emergency flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
            </div>
          `,
          className: 'disaster-zone-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([coords[0], coords[1]], { 
          icon: disasterIcon,
          zIndexOffset: 500 
        })
          .bindPopup(`
            <div class="glass p-4 border border-emergency/30 rounded-lg max-w-xs">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 bg-emergency rounded-full animate-pulse"></div>
                <span class="font-medium text-emergency">${zone.title}</span>
              </div>
              <div class="text-sm text-foreground mb-2">${zone.description}</div>
              <div class="text-xs text-muted-foreground">
                Severity: <span class="text-emergency font-medium">${zone.severity.toUpperCase()}</span>
              </div>
              <div class="text-xs text-muted-foreground">
                Type: ${zone.type}
              </div>
            </div>
          `)
          .addTo(mapInstanceRef.current);

        disasterLayersRef.current.push(marker);

        // Add danger zone circle
        const circle = L.circle([coords[0], coords[1]], {
          color: 'hsl(var(--emergency))',
          fillColor: 'hsl(var(--emergency))',
          fillOpacity: 0.1,
          radius: 500,
          weight: 2,
          opacity: 0.6,
        }).addTo(mapInstanceRef.current);

        disasterLayersRef.current.push(circle);
      }
    });
  }, [disasterZones]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="h-full w-full leaflet-container" />
      
      {/* Loading Overlay */}
      {loading && (
        <motion.div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="glass p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-foreground">Loading map...</p>
          </Card>
        </motion.div>
      )}

      {/* Map Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 z-30"
      >
        <Card className="glass border-white/20 backdrop-blur-md">
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-safe rounded-full"></div>
              <span className="text-safe">Your Location</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-3 h-3 text-emergency" />
              <span className="text-emergency">Danger Zone</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}