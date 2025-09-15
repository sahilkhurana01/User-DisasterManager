import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ExternalLink, Shield, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/layout/PageLayout';
import { useSafeZones, useUserLocation } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

// Mock safe zones data
const mockSafeZones = [
  {
    id: '1',
    name: 'Central Park Emergency Shelter',
    type: 'Emergency Shelter',
    coordinates: [40.7829, -73.9654] as [number, number],
    capacity: 500,
    available: true,
    distance: 2.1,
    tags: ['flood', 'hurricane', 'general'],
    contact: '+1-212-555-0123'
  },
  {
    id: '2', 
    name: 'NYC Fire Department Station 1',
    type: 'Fire Station',
    coordinates: [40.7505, -73.9956] as [number, number],
    capacity: 50,
    available: true,
    distance: 0.8,
    tags: ['fire', 'medical', 'rescue'],
    contact: '911'
  },
  {
    id: '3',
    name: 'Mount Sinai Hospital',
    type: 'Medical Center',
    coordinates: [40.7903, -73.9527] as [number, number],
    capacity: 200,
    available: true,
    distance: 3.2,
    tags: ['medical', 'trauma', 'emergency'],
    contact: '+1-212-241-6500'
  },
  {
    id: '4',
    name: 'Brooklyn Community Center',
    type: 'Community Shelter',
    coordinates: [40.6892, -73.9442] as [number, number],
    capacity: 300,
    available: false,
    distance: 8.7,
    tags: ['flood', 'hurricane', 'community'],
    contact: '+1-718-555-0199'
  }
];

export default function SafePlacesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredZones, setFilteredZones] = useState(mockSafeZones);
  const [isSearching, setIsSearching] = useState(false);
  const userLocation = useUserLocation();
  const safeZones = useSafeZones();

  useEffect(() => {
    // Filter safe zones based on search query
    if (searchQuery.trim() === '') {
      setFilteredZones(mockSafeZones);
    } else {
      const filtered = mockSafeZones.filter(zone =>
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredZones(filtered);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI search with Gemini
    try {
      // In real app, this would call /api/safe-zones with Gemini integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "🤖 AI Analysis Complete",
        description: `Found ${filteredZones.length} safe locations matching your search criteria.`
      });
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Unable to complete AI analysis. Showing local results.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigate = (zone: typeof mockSafeZones[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${zone.coordinates[0]},${zone.coordinates[1]}`;
    window.open(url, '_blank');
    
    toast({
      title: "🗺️ Opening Navigation",
      description: `Navigating to ${zone.name}`
    });
  };

  const handleCall = (contact: string) => {
    window.open(`tel:${contact}`, '_self');
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'emergency shelter': return 'bg-safe/20 text-safe';
      case 'fire station': return 'bg-emergency/20 text-emergency';
      case 'medical center': return 'bg-info/20 text-info';
      case 'community shelter': return 'bg-warning/20 text-warning';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <PageLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-4"
        >
          <h1 className="text-3xl font-bold mb-2">Safe Places</h1>
          <p className="text-muted-foreground">Find nearby shelters and emergency services</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass p-4 rounded-xl"
        >
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
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-safe hover:bg-safe/90"
            >
              {isSearching ? (
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
          
          {userLocation && (
            <p className="text-xs text-muted-foreground mt-2">
              📍 Searching near your current location
            </p>
          )}
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          {filteredZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Card className="glass border-white/20 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-safe" />
                        {zone.name}
                      </CardTitle>
                      <Badge className={getTypeColor(zone.type)} variant="outline">
                        {zone.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-safe">{zone.distance}km</div>
                      <div className="text-xs text-muted-foreground">away</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Availability & Capacity */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${zone.available ? 'bg-safe pulse-safe' : 'bg-muted'}`} />
                      <span className="text-sm">
                        {zone.available ? 'Available' : 'At Capacity'}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Capacity: {zone.capacity}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {zone.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handleNavigate(zone)}
                      className="flex-1 bg-safe hover:bg-safe/90"
                      disabled={!zone.available}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCall(zone.contact)}
                      className="glass border-white/20"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://maps.google.com/?q=${zone.coordinates[0]},${zone.coordinates[1]}`, '_blank')}
                      className="glass border-white/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredZones.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or check your spelling.
            </p>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}