import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./pages/HomePage";
import SafePlacesPage from "./pages/SafePlacesPage";
import SOSPage from "./pages/SOSPage";
import ContactsPage from "./pages/ContactsPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotFound from "./pages/NotFound";
import { OnboardingData } from "./services/googleSheetsService";
import { useStore } from "./store/useStore";
import { alertService } from "./services/alertService";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { UpdateNotification } from "./components/UpdateNotification";

const queryClient = new QueryClient();

const App = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const { setUserProfile, setDangerActive, addDangerZone, clearDangerZones } = useStore();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const userProfile = localStorage.getItem('userProfile');
    
    console.log('App: Checking localStorage - onboardingCompleted:', onboardingCompleted, 'userProfile:', userProfile);
    
    if (onboardingCompleted === 'true' && userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        console.log('App: Parsed profile:', profile);
        setUserProfile(profile);
        setIsOnboardingCompleted(true);
        
        // Start alert monitoring for this user
        if (profile.phone) {
          alertService.startMonitoring(profile.phone);
        }
      } catch (error) {
        console.error('Error parsing user profile:', error);
        setIsOnboardingCompleted(false);
      }
    } else {
      console.log('App: No valid onboarding data found, showing onboarding');
      setIsOnboardingCompleted(false);
    }
    
    // Cleanup alert monitoring on unmount
    return () => {
      alertService.stopMonitoring();
    };
  }, [setUserProfile]);

  // Monitor alert status changes and update danger visualization
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.alertStatus,
      (alertStatus) => {
        if (alertStatus?.alertStatus === 'red') {
          setDangerActive(true);
          
          // Add danger zone around user location
          const userProfile = useStore.getState().userProfile;
          if (userProfile?.phone) {
            // For demo purposes, create a danger zone around the user's location
            // In a real app, this would come from the alert data
            addDangerZone({
              center: [40.7589, -73.9851], // Default NYC coordinates
              radius: 1000, // 1km radius
              intensity: 0.8,
              color: '#ef4444', // Red color
              timestamp: new Date().toISOString()
            });
          }
        } else {
          setDangerActive(false);
          clearDangerZones();
        }
      }
    );

    return unsubscribe;
  }, [setDangerActive, addDangerZone, clearDangerZones]);

  // Debug state changes
  useEffect(() => {
    console.log('App: isOnboardingCompleted changed to:', isOnboardingCompleted);
  }, [isOnboardingCompleted]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    console.log('Onboarding completed with data:', data);
    
    // Force a re-check of localStorage
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const userProfile = localStorage.getItem('userProfile');
    
    if (onboardingCompleted === 'true' && userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        setUserProfile(profile);
        setIsOnboardingCompleted(true);
        
        // Start alert monitoring for this user
        if (profile.phone) {
          alertService.startMonitoring(profile.phone);
        }
      } catch (error) {
        console.error('Error parsing user profile after onboarding:', error);
        setIsOnboardingCompleted(false);
      }
    } else {
      console.error('Onboarding completed but localStorage not found');
      setIsOnboardingCompleted(false);
    }
  };

  // Show loading state while checking onboarding status
  if (isOnboardingCompleted === null) {
    console.log('App: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if not completed
  if (!isOnboardingCompleted) {
    console.log('App: Showing onboarding page, isOnboardingCompleted:', isOnboardingCompleted);
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="glass border-white/20"
          />
          <OnboardingPage onComplete={handleOnboardingComplete} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show main app if onboarding is completed
  console.log('App: Showing main app, isOnboardingCompleted:', isOnboardingCompleted);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="glass border-white/20"
        />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/safe" element={<SafePlacesPage />} />
            <Route path="/sos" element={<SOSPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/ai" element={<AIAssistantPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/onboarding" element={<OnboardingPage onComplete={handleOnboardingComplete} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* PWA Components */}
          <OfflineIndicator />
          <UpdateNotification />
          <PWAInstallPrompt />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
