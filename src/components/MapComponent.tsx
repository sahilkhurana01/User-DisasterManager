import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DisasterZone, useStore } from '@/store/useStore';
import { fetchNearbySafePlaces, SafePlace, buildGoogleDirectionsUrl } from '@/services/placesService';

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
  const safePlaceMarkersRef = useRef<L.Layer[]>([]);
  const [cityName, setCityName] = useState<string>('');

  const setSafeZones = useStore((s) => s.setSafeZones);

  // Function to get city name from coordinates
  const getCityName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching city name:', error);
      return 'Unknown Location';
    }
  };

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

  // Update user location marker and fetch places
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
    }

    // Fetch city name
    getCityName(userLocation.lat, userLocation.lng).then(setCityName);

    // Create custom blue pin icon for user location
    const userIcon = L.divIcon({
      html: `
        <div class="relative">
          <div class="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-500"></div>
        </div>
      `,
      className: 'user-location-marker',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
    });

    // Add user marker
    const marker = L.marker([userLocation.lat, userLocation.lng], { 
      icon: userIcon,
      zIndexOffset: 1000 
    })
      .bindPopup(`
        <div class="glass p-3 border border-white/20 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="font-medium text-blue-500">My Location</span>
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

    // Fetch nearby safe places and display
    (async () => {
      try {
        // Clear previous safe place markers
        safePlaceMarkersRef.current.forEach(layer => mapInstanceRef.current?.removeLayer(layer));
        safePlaceMarkersRef.current = [];

        const places: SafePlace[] = await fetchNearbySafePlaces(userLocation.lat, userLocation.lng, 5000);

        // Update store with simplified safe zones
        setSafeZones(
          places.map(p => ({
            id: p.id,
            name: p.name,
            type: p.type,
            coordinates: [p.lat, p.lng] as [number, number],
            capacity: 0,
            available: true,
            tags: [],
            contact: ''
          }))
        );

        const iconForType = (type: string) => {
          const color = type.includes('hospital') ? '#22c55e' : type.includes('police') ? '#3b82f6' : type.includes('fire') ? '#ef4444' : '#14b8a6';
          return L.divIcon({
            html: `
              <div class="relative">
                <div class="w-6 h-6" style="background:${color}; border:2px solid white; border-radius:9999px; box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-4" style="border-left-color:transparent;border-right-color:transparent;border-top-color:${color}"></div>
              </div>
            `,
            className: 'safe-place-marker',
            iconSize: [24, 32],
            iconAnchor: [12, 32]
          });
        };

        places.forEach((p) => {
          const m = L.marker([p.lat, p.lng], { icon: iconForType(p.type) })
            .bindPopup(`
              <div class="glass p-3 border border-white/20 rounded-lg">
                <div class="font-medium">${p.name}</div>
                <div class="text-xs text-muted-foreground mb-2">${p.address}</div>
                <a href="${buildGoogleDirectionsUrl(userLocation.lat, userLocation.lng, p.lat, p.lng)}" target="_blank" class="text-green-400 underline">Directions</a>
              </div>
            `)
            .addTo(mapInstanceRef.current!);
          safePlaceMarkersRef.current.push(m);
        });
      } catch (e) {
        console.warn('Failed to load nearby places', e);
      }
    })();
  }, [userLocation, setSafeZones]);

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
                <span class="font-medium text-emergency">${(zone as any).title || 'Alert Zone'}</span>
              </div>
              <div class="text-xs text-muted-foreground">
                Severity: <span class="text-emergency font-medium">${zone.severity.toUpperCase()}</span>
              </div>
              <div class="text-xs text-muted-foreground">Type: ${zone.type}</div>
            </div>
          `)
          .addTo(mapInstanceRef.current!);

        disasterLayersRef.current.push(marker);

        // Add danger zone circle
        const circle = L.circle([coords[0], coords[1]], {
          color: 'hsl(var(--emergency))',
          fillColor: 'hsl(var(--emergency))',
          fillOpacity: 0.1,
          radius: 500,
          weight: 2,
          opacity: 0.6,
        }).addTo(mapInstanceRef.current!);

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
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-500">My Location</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-3 h-3 text-emergency" />
              <span className="text-emergency">Danger Zone</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* City Name Overlay */}
      {cityName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 z-30"
        >
          <Card className="glass border-white/20 backdrop-blur-md">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-500">{cityName}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}