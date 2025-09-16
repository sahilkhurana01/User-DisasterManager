import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Mail, Phone, MapPin, Save, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageLayout } from '@/components/layout/PageLayout';
import { toast } from '@/hooks/use-toast';
import { profileService, UserProfile } from '@/services/profileService';
import { googleSheetsService } from '@/services/googleSheetsService';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    medicalInfo: '',
    lastUpdated: new Date().toISOString()
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load profile data on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
      const savedProfile = await profileService.loadProfile();
      if (savedProfile) {
        setProfile(savedProfile);
        console.log('Profile loaded successfully:', savedProfile);
      } else {
        // Create default profile if none exists
        const defaultProfile = profileService.createDefaultProfile();
        setProfile(defaultProfile);
        console.log('Using default profile:', defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoadError('Failed to load profile data');
      
      // Create default profile as fallback
      const defaultProfile = profileService.createDefaultProfile();
      setProfile(defaultProfile);
      
      toast({
        title: "Profile Loaded",
        description: "Using default profile. You can update your information below.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const validation = profileService.validateProfile(profile);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Save to local storage and profile service
      const savedProfile = await profileService.saveProfile(profile);
      setProfile(savedProfile);
      
      // Also update Google Sheets if phone number exists
      if (profile.phone) {
        const success = await googleSheetsService.updateUserData(profile.phone, {
          phone: profile.phone,
          email: profile.email,
          fullAddress: profile.address
        });
        
        if (success) {
          console.log('Profile updated in Google Sheets');
        } else {
          console.warn('Failed to update Google Sheets, but local save succeeded');
        }
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="glass p-6">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-foreground">Loading profile...</p>
          </Card>
        </div>
      </PageLayout>
    );
  }

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
            <Settings className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
          
          {/* Error Display */}
          {loadError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{loadError}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadProfile}
                  className="ml-2 h-6 px-2 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Profile Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`glass border-white/20 mt-1 ${errors.name ? 'border-destructive' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`glass border-white/20 mt-1 ${errors.email ? 'border-destructive' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`glass border-white/20 mt-1 ${errors.phone ? 'border-destructive' : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <div className="flex items-center gap-1 mt-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`glass border-white/20 mt-1 min-h-20 ${errors.address ? 'border-destructive' : ''}`}
                  placeholder="Enter your full address"
                />
                {errors.address && (
                  <div className="flex items-center gap-1 mt-1 text-destructive text-xs">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-emergency" />
                Emergency Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Emergency Contact Field */}
              <div>
                <Label htmlFor="emergencyContact" className="text-sm font-medium">
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  value={profile.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="glass border-white/20 mt-1"
                  placeholder="Enter emergency contact number"
                />
              </div>

              {/* Medical Information Field */}
              <div>
                <Label htmlFor="medicalInfo" className="text-sm font-medium">
                  Medical Information
                </Label>
                <Textarea
                  id="medicalInfo"
                  value={profile.medicalInfo}
                  onChange={(e) => handleInputChange('medicalInfo', e.target.value)}
                  className="glass border-white/20 mt-1 min-h-20"
                  placeholder="Enter medical information, allergies, blood type, etc."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-accent hover:bg-accent/90 px-8 py-3 text-lg"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Changes
              </div>
            )}
          </Button>
        </motion.div>

        {/* Last Updated Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(profile.lastUpdated).toLocaleString()}
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
