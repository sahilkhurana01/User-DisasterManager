import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Plus, AlertTriangle, Heart, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/layout/PageLayout';
import { useEmergencyContacts } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

const emergencyTypes = [
  { value: 'ambulance', label: '🚑 Ambulance', color: 'text-emergency' },
  { value: 'fire', label: '🚒 Fire Department', color: 'text-warning' },
  { value: 'rescue', label: '🛟 Search & Rescue', color: 'text-info' },
  { value: 'police', label: '👮‍♂️ Police', color: 'text-info' },
  { value: 'medical', label: '🏥 Medical Emergency', color: 'text-emergency' },
];

export default function ContactsPage() {
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [helpForm, setHelpForm] = useState({
    type: '',
    message: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emergencyContacts = useEmergencyContacts();

  // Check for auto-help parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auto') === 'help') {
      setHelpDialogOpen(true);
    }
  }, []);

  const handleCall = (phone: string, name: string) => {
    window.open(`tel:${phone}`, '_self');
    toast({
      title: "📞 Calling...",
      description: `Dialing ${name} at ${phone}`
    });
  };

  const handleSMS = (phone: string, name: string) => {
    const message = "I need emergency assistance. This is an urgent situation.";
    window.open(`sms:${phone}?body=${encodeURIComponent(message)}`, '_self');
    toast({
      title: "💬 Opening SMS",
      description: `Sending emergency message to ${name}`
    });
  };

  const handleHelpRequest = async () => {
    if (!helpForm.type || !helpForm.message) {
      toast({
        title: "Form Incomplete",
        description: "Please select an emergency type and provide details.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to /api/help-request
      const requestData = {
        type: helpForm.type,
        message: helpForm.message,
        location: helpForm.location || 'Current location',
        timestamp: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "🚨 Help Request Sent",
        description: `Your ${emergencyTypes.find(t => t.value === helpForm.type)?.label} request has been dispatched.`
      });
      
      setHelpDialogOpen(false);
      setHelpForm({ type: '', message: '', location: '' });
      
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Unable to send help request. Please call emergency services directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'medical': return Heart;
      case 'authority': return Shield;
      case 'family': return User;
      default: return Phone;
    }
  };

  const getContactColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'text-emergency';
      case 'medical': return 'text-info';
      case 'authority': return 'text-warning';
      case 'family': return 'text-safe';
      default: return 'text-foreground';
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
          <h1 className="text-3xl font-bold mb-2">Emergency Contacts</h1>
          <p className="text-muted-foreground">Quick access to help when you need it most</p>
        </motion.div>

        {/* Help Request Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-emergency hover:bg-emergency/90 text-lg py-6">
                <AlertTriangle className="w-6 h-6 mr-3" />
                REQUEST IMMEDIATE HELP
              </Button>
            </DialogTrigger>
            
            <DialogContent className="glass border-white/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-emergency" />
                  Emergency Help Request
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="emergency-type">Emergency Type</Label>
                  <Select 
                    value={helpForm.type} 
                    onValueChange={(value) => setHelpForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="Select emergency type..." />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/20">
                      {emergencyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className={type.color}>{type.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="emergency-message">Describe the situation</Label>
                  <Textarea
                    id="emergency-message"
                    placeholder="Briefly describe what type of help you need..."
                    value={helpForm.message}
                    onChange={(e) => setHelpForm(prev => ({ ...prev, message: e.target.value }))}
                    className="glass border-white/20 min-h-20"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input
                    id="location"
                    placeholder="Specify location if different from current..."
                    value={helpForm.location}
                    onChange={(e) => setHelpForm(prev => ({ ...prev, location: e.target.value }))}
                    className="glass border-white/20"
                  />
                </div>

                <Button 
                  onClick={handleHelpRequest}
                  disabled={isSubmitting}
                  className="w-full bg-emergency hover:bg-emergency/90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                      Sending Request...
                    </div>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Send Help Request
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Emergency Contacts Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Dial</h2>
          
          <div className="grid gap-4">
            {emergencyContacts.map((contact, index) => {
              const Icon = getContactIcon(contact.type);
              
              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 2) }}
                >
                  <Card className="glass border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                            {contact.icon ? (
                              <span className="text-xl">{contact.icon}</span>
                            ) : (
                              <Icon className={`w-6 h-6 ${getContactColor(contact.type)}`} />
                            )}
                          </div>
                          
                          <div>
                            <h3 className="font-semibold">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs mt-1 ${getContactColor(contact.type)}`}
                            >
                              {contact.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCall(contact.phone, contact.name)}
                            className="bg-safe hover:bg-safe/90"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSMS(contact.phone, contact.name)}
                            className="glass border-white/20"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Add Contact Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            variant="outline" 
            className="w-full glass border-white/20"
            onClick={() => toast({
              title: "Feature Coming Soon",
              description: "Custom contact management will be available in the next update."
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Emergency Contact
          </Button>
        </motion.div>
      </div>
    </PageLayout>
  );
}