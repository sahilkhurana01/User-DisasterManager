import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/layout/PageLayout';
import { useUserLocation } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

export default function SOSPage() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const userLocation = useUserLocation();

  const handleSendSOS = async () => {
    if (!userLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to send emergency alert.",
        variant: "destructive"
      });
      return;
    }

    setIsEmergencyActive(true);
    
    try {
      // Simulate API call to /api/sos
      const sosData = {
        coordinates: [userLocation.lat, userLocation.lng],
        timestamp: new Date().toISOString(),
        accuracy: userLocation.accuracy
      };

      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAlertSent(true);
      
      toast({
        title: "🚨 EMERGENCY ALERT SENT",
        description: "Your distress signal has been sent to emergency services.",
        action: (
          <Button size="sm" onClick={() => window.location.href = '/contacts?auto=help'}>
            Need Help?
          </Button>
        )
      });

    } catch (error) {
      toast({
        title: "Alert Failed",
        description: "Unable to send emergency alert. Please call 911 directly.",
        variant: "destructive"
      });
    } finally {
      setIsEmergencyActive(false);
    }
  };

  const handleCall911 = () => {
    window.open('tel:911', '_self');
  };

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', icon: '🚨' },
    { name: 'Fire Department', number: '911', icon: '🚒' },
    { name: 'Police', number: '911', icon: '👮‍♂️' },
    { name: 'Medical Emergency', number: '911', icon: '🚑' },
  ];

  return (
    <PageLayout>
      <div className="p-4 space-y-6 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8"
        >
          <AlertTriangle className="w-16 h-16 text-emergency mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-emergency mb-2">EMERGENCY SOS</h1>
          <p className="text-muted-foreground">Send immediate distress signal</p>
        </motion.div>

        {/* Location Status */}
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-safe/30">
              <CardContent className="flex items-center gap-3 p-4">
                <MapPin className="w-5 h-5 text-safe" />
                <div>
                  <div className="text-sm font-medium text-safe">Location Acquired</div>
                  <div className="text-xs text-muted-foreground">
                    Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                  </div>
                </div>
                <Badge variant="outline" className="ml-auto text-safe border-safe/30">
                  ±{userLocation.accuracy?.toFixed(0)}m
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main SOS Button */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="flex-1 flex items-center justify-center py-12"
        >
          <div className="text-center">
            <Button
              onClick={handleSendSOS}
              disabled={isEmergencyActive || !userLocation}
              className={`
                w-64 h-64 rounded-full text-2xl font-bold
                ${alertSent 
                  ? 'bg-safe hover:bg-safe/90 animate-pulse-safe' 
                  : 'pulse-emergency bg-emergency hover:bg-emergency/90'
                }
                transition-all duration-300 shadow-2xl
              `}
            >
              {isEmergencyActive ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 animate-spin border-4 border-white border-t-transparent rounded-full" />
                  <span className="text-lg">SENDING...</span>
                </div>
              ) : alertSent ? (
                <div className="flex flex-col items-center gap-3">
                  <Shield className="w-12 h-12" />
                  <span className="text-lg">ALERT SENT</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <AlertTriangle className="w-12 h-12" />
                  <span className="text-lg">SEND SOS</span>
                </div>
              )}
            </Button>

            {!userLocation && (
              <p className="text-warning text-sm mt-4 max-w-md mx-auto">
                ⚠️ Location services required for emergency alerts. Please enable location access in your browser.
              </p>
            )}
          </div>
        </motion.div>

        {/* Alert Status */}
        {alertSent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass border-safe/30 bg-safe/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-safe flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Emergency Alert Active
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-safe" />
                  <span>Sent at {new Date().toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your emergency signal has been broadcast to local authorities. 
                  Help is on the way.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-center">Emergency Contacts</h3>
          <div className="grid grid-cols-2 gap-3">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                <Button
                  onClick={() => window.open(`tel:${contact.number}`, '_self')}
                  variant="outline"
                  className="w-full h-16 glass border-white/20 flex-col gap-1"
                >
                  <span className="text-lg">{contact.icon}</span>
                  <span className="text-xs font-medium">{contact.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Direct 911 Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-4"
        >
          <Button
            onClick={handleCall911}
            size="lg"
            className="w-full bg-emergency hover:bg-emergency/90 text-xl font-bold py-4"
          >
            <Phone className="w-6 h-6 mr-3" />
            CALL 911 NOW
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
}