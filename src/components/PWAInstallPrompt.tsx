import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInStandaloneMode = (window.navigator as any).standalone;
      setIsStandalone(isStandaloneMode || isInStandaloneMode);
      setIsInstalled(isStandaloneMode || isInStandaloneMode);
    };

    // Check if device is iOS
    const checkIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);
    };

    checkInstalled();
    checkIOS();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay (not immediately)
      setTimeout(() => {
        if (!isInstalled && !isStandalone) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if user has dismissed the prompt before
    const hasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (hasDismissed && !isInstalled && !isStandalone) {
      // Show again after 24 hours
      const dismissedTime = parseInt(hasDismissed);
      const now = Date.now();
      if (now - dismissedTime > 24 * 60 * 60 * 1000) {
        setShowInstallPrompt(true);
      }
    } else if (!hasDismissed && !isInstalled && !isStandalone) {
      setShowInstallPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleIOSInstall = () => {
    // For iOS, we show instructions
    setShowInstallPrompt(false);
    // Open the PWA install guide
    window.open('/pwa-install-guide.html', '_blank');
  };

  if (isInstalled || isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <Card className="glass border-white/20 backdrop-blur-md shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {isIOS ? (
                    <Smartphone className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Monitor className="w-6 h-6 text-green-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    Install Disaster AI
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {isIOS 
                      ? "Add to your home screen for quick access to emergency features"
                      : "Install this app for faster access and offline emergency features"
                    }
                  </p>
                  
                  <div className="flex gap-2">
                    {isIOS ? (
                      <Button
                        onClick={handleIOSInstall}
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Show Instructions
                      </Button>
                    ) : (
                      <Button
                        onClick={handleInstallClick}
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Install App
                      </Button>
                    )}
                    
                    <Button
                      onClick={handleDismiss}
                      variant="outline"
                      size="sm"
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
