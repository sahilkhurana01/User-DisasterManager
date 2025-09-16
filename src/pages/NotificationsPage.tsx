import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, Info, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/PageLayout';
import { useNotifications, useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

// Mock notifications for demo
const mockNotifications = [
  {
    id: '1',
    title: 'Flash Flood Warning',
    message: 'Heavy rainfall expected in your area. Avoid low-lying areas and be prepared for flash flooding.',
    severity: 'critical' as const,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    read: false,
    location: [40.7589, -73.9851] as [number, number]
  },
  {
    id: '2', 
    title: 'Evacuation Route Update',
    message: 'Highway 95 is now reopened. Use this route for evacuation if needed.',
    severity: 'info' as const,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    location: [40.7489, -73.9851] as [number, number]
  },
  {
    id: '3',
    title: 'Severe Weather Alert',
    message: 'Strong winds and heavy rain expected between 2-6 PM. Secure loose outdoor items.',
    severity: 'warning' as const,
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: true,
    location: [40.7389, -73.9751] as [number, number]
  },
  {
    id: '4',
    title: 'Emergency Shelter Available',
    message: 'Central Park Community Center is now open as an emergency shelter with capacity for 200 people.',
    severity: 'info' as const,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: true,
    location: [40.7829, -73.9654] as [number, number]
  },
  {
    id: '5',
    title: 'System Test',
    message: 'This is a test of the emergency notification system. No action required.',
    severity: 'info' as const,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const { markNotificationRead } = useStore();

  useEffect(() => {
    // Mark all notifications as read after viewing page
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    unreadIds.forEach(id => markNotificationRead(id));
  }, []);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-emergency border-emergency/30 bg-emergency/10';
      case 'warning': return 'text-warning border-warning/30 bg-warning/10';
      case 'info': return 'text-info border-info/30 bg-info/10';
      default: return 'text-foreground border-border';
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleViewLocation = (location: [number, number]) => {
    // In real app, this would navigate to map with location highlighted
    const url = `/?lat=${location[0]}&lng=${location[1]}&zoom=15`;
    window.history.pushState({}, '', url);
    
    toast({
      title: "📍 Location Highlighted",
      description: "Redirecting to map view..."
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    markNotificationRead(id);
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
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell className="w-8 h-8 text-foreground" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          <p className="text-muted-foreground">Emergency alerts and system updates</p>
        </motion.div>

        {/* Notification Timeline */}
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const SeverityIcon = getSeverityIcon(notification.severity);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`glass border-white/20 relative overflow-hidden ${
                    !notification.read ? 'ring-2 ring-primary/30 bg-white/8' : ''
                  }`}
                >
                  {/* Severity Indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    notification.severity === 'critical' ? 'bg-emergency' :
                    notification.severity === 'warning' ? 'bg-warning' :
                    'bg-info'
                  }`} />

                  <CardHeader className="pb-3 pl-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${getSeverityColor(notification.severity)}`}>
                          <SeverityIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            )}
                          </CardTitle>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getBadgeVariant(notification.severity)} className="text-xs">
                              {notification.severity.toUpperCase()}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pl-6 space-y-3">
                    <p className="text-foreground leading-relaxed">{notification.message}</p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        {notification.location && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewLocation(notification.location!)}
                            className="glass border-white/20 text-xs"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            View Location
                          </Button>
                        )}
                      </div>
                      
                      {!notification.read && (
                        <Button 
                          size="sm"
                          variant="ghost" 
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
            <p className="text-muted-foreground">
              You'll receive emergency alerts and system updates here.
            </p>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-8"
        >
          <Card className="glass border-white/10 bg-white/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-info" />
                <span className="text-sm font-medium">Notification Settings</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Critical alerts are always shown. Manage notification preferences in your device settings.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}