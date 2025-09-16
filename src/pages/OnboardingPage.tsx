import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { googleSheetsService, OnboardingData, PUNJAB_CITIES } from '@/services/googleSheetsService';
import { useStore } from '@/store/useStore';

interface OnboardingPageProps {
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    phone: '',
    email: '',
    city: '',
    locality: '',
    fullAddress: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [localityOpen, setLocalityOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState(PUNJAB_CITIES);
  const [filteredLocalities, setFilteredLocalities] = useState<string[]>([]);

  const { setUserProfile } = useStore();

  useEffect(() => {
    // Filter localities based on selected city
    if (data.city) {
      const selectedCity = PUNJAB_CITIES.find(city => city.name === data.city);
      if (selectedCity) {
        setFilteredLocalities(selectedCity.localities);
        // Reset locality if it's not in the new city
        if (data.locality && !selectedCity.localities.includes(data.locality)) {
          setData(prev => ({ ...prev, locality: '' }));
        }
      }
    }
  }, [data.city]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!data.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\+?[0-9\s\-()]{7,20}$/.test(data.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    if (step === 2) {
      if (!data.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 3) {
      if (!data.city) {
        newErrors.city = 'Please select a city';
      }
      if (!data.locality) {
        newErrors.locality = 'Please select a locality';
      }
      if (!data.fullAddress.trim()) {
        newErrors.fullAddress = 'Full address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save to Google Sheets
      const success = await googleSheetsService.saveUserData(data);
      
      if (success) {
        // Convert to user profile and save locally
        const userProfile = googleSheetsService.convertToUserProfile(data);
        setUserProfile(userProfile);
        
        // Save to localStorage as well
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('onboardingCompleted', 'true');
        
        toast({
          title: "Welcome!",
          description: "Your information has been saved successfully.",
        });
        
        onComplete(data);
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySearch = (search: string) => {
    if (!search) {
      setFilteredCities(PUNJAB_CITIES);
    } else {
      setFilteredCities(
        PUNJAB_CITIES.filter(city =>
          city.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  const handleLocalitySearch = (search: string) => {
    if (!search) {
      setFilteredLocalities(
        PUNJAB_CITIES.find(city => city.name === data.city)?.localities || []
      );
    } else {
      const cityLocalities = PUNJAB_CITIES.find(city => city.name === data.city)?.localities || [];
      setFilteredLocalities(
        cityLocalities.filter(locality =>
          locality.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  const steps = [
    { number: 1, title: "Phone Number", icon: Phone },
    { number: 2, title: "Email Address", icon: Mail },
    { number: 3, title: "Location Details", icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-green-500 text-white",
                      isActive && !isCompleted && "bg-blue-500 text-white",
                      !isActive && !isCompleted && "bg-gray-200 text-gray-500"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-8 h-0.5 mx-2 transition-all duration-300",
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {currentStep === 1 && "Let's get started!"}
              {currentStep === 2 && "Contact Information"}
              {currentStep === 3 && "Location Details"}
            </CardTitle>
            <p className="text-gray-600">
              {currentStep === 1 && "We need your phone number to get started"}
              {currentStep === 2 && "Please provide your email address"}
              {currentStep === 3 && "Help us locate you in case of emergencies"}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={data.phone}
                      onChange={(e) => setData(prev => ({ ...prev, phone: e.target.value }))}
                      className={cn(errors.phone && "border-red-500")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={data.email}
                      onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Popover open={cityOpen} onOpenChange={setCityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={cityOpen}
                          className={cn(
                            "w-full justify-between",
                            !data.city && "text-muted-foreground",
                            errors.city && "border-red-500"
                          )}
                        >
                          {data.city || "Select city..."}
                          <ArrowRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search cities..."
                            onValueChange={handleCitySearch}
                          />
                          <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                              {filteredCities.map((city) => (
                                <CommandItem
                                  key={city.name}
                                  value={city.name}
                                  onSelect={() => {
                                    setData(prev => ({ ...prev, city: city.name }));
                                    setCityOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      data.city === city.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {city.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Locality</Label>
                    <Popover open={localityOpen} onOpenChange={setLocalityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={localityOpen}
                          className={cn(
                            "w-full justify-between",
                            !data.locality && "text-muted-foreground",
                            errors.locality && "border-red-500"
                          )}
                          disabled={!data.city}
                        >
                          {data.locality || "Select locality..."}
                          <ArrowRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search localities..."
                            onValueChange={handleLocalitySearch}
                          />
                          <CommandList>
                            <CommandEmpty>No locality found.</CommandEmpty>
                            <CommandGroup>
                              {filteredLocalities.map((locality) => (
                                <CommandItem
                                  key={locality}
                                  value={locality}
                                  onSelect={() => {
                                    setData(prev => ({ ...prev, locality }));
                                    setLocalityOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      data.locality === locality ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {locality}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.locality && (
                      <p className="text-sm text-red-500">{errors.locality}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullAddress">Full Address</Label>
                    <Input
                      id="fullAddress"
                      placeholder="House number, street name, etc."
                      value={data.fullAddress}
                      onChange={(e) => setData(prev => ({ ...prev, fullAddress: e.target.value }))}
                      className={cn(errors.fullAddress && "border-red-500")}
                    />
                    {errors.fullAddress && (
                      <p className="text-sm text-red-500">{errors.fullAddress}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : currentStep === 3 ? (
                  <>
                    Complete
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
