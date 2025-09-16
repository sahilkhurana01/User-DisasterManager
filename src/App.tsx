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

const queryClient = new QueryClient();

const App = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const { setUserProfile } = useStore();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const userProfile = localStorage.getItem('userProfile');
    
    if (onboardingCompleted === 'true' && userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        setUserProfile(profile);
        setIsOnboardingCompleted(true);
      } catch (error) {
        console.error('Error parsing user profile:', error);
        setIsOnboardingCompleted(false);
      }
    } else {
      setIsOnboardingCompleted(false);
    }
  }, [setUserProfile]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setIsOnboardingCompleted(true);
  };

  // Show loading state while checking onboarding status
  if (isOnboardingCompleted === null) {
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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/safe" element={<SafePlacesPage />} />
            <Route path="/sos" element={<SOSPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/ai" element={<AIAssistantPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
