import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ExternalLink, Shield, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/layout/PageLayout';
import { useUserLocation } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';
import { fetchNearbySafePlaces, SafePlace, buildGoogleDirectionsUrl } from '@/services/placesService';

export default function SafePlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPlaces, setAllPlaces] = useState<SafePlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<SafePlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userLocation = useUserLocation();

  useEffect(() => {
    (async () => {
      if (!userLocation) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const places = await fetchNearbySafePlaces(userLocation.lat, userLocation.lng, 5000);
        setAllPlaces(places);
        setFilteredPlaces(places);
      } catch (e) {
        console.warn('Failed loading places', e);
        toast({ title: 'Places Error', description: 'Could not fetch nearby places. Showing none.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userLocation]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlaces(allPlaces);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredPlaces(allPlaces.filter(p => (p.name?.toLowerCase().includes(q) || p.type?.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q))));
    }
  }, [searchQuery, allPlaces]);

  const handleSearch = async () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const handleNavigate = (place: SafePlace) => {
    const url = buildGoogleDirectionsUrl(userLocation!.lat, userLocation!.lng, place.lat, place.lng);
    window.open(url, '_blank');
    toast({ title: '🗺️ Opening Navigation', description: `Navigating to ${place.name}` });
  };

  const getTypeColor = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('hospital')) return 'bg-safe/20 text-safe';
    if (t.includes('police')) return 'bg-info/20 text-info';
    if (t.includes('fire')) return 'bg-emergency/20 text-emergency';
    return 'bg-muted/20 text-muted-foreground';
  };

  return (
    <PageLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
          <h1 className="text-3xl font-bold mb-2">Safe Places</h1>
          <p className="text-muted-foreground">Find nearby shelters and emergency services</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass p-4 rounded-xl">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for shelters, hospitals, or emergency services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-white/20"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="bg-safe hover:bg-safe/90">
              {isSearching ? (
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
          {userLocation && (
            <p className="text-xs text-muted-foreground mt-2">📍 Searching near your current location</p>
          )}
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlaces.map((place, index) => (
              <motion.div key={place.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * (index + 1) }}>
                <Card className="glass border-white/20 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-safe" />
                          {place.name}
                        </CardTitle>
                        <Badge className={getTypeColor(place.type)} variant="outline">
                          {place.type}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{place.address}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 pt-2">
                      <Button onClick={() => handleNavigate(place)} className="flex-1 bg-safe hover:bg-safe/90">
                        <MapPin className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(`https://maps.google.com/?q=${place.lat},${place.lng}`, '_blank')} className="glass border-white/20">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredPlaces.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or check your spelling.</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}