import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';

export function UpdateNotification() {
  const { updateAvailable, updateApp } = usePWA();

  if (!updateAvailable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <Card className="glass border-blue-500/30 backdrop-blur-md shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Download className="w-6 h-6 text-blue-500" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  Update Available
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  A new version of AI Disaster Management Platform is available with improved features and security updates.
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={updateApp}
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Update Now
                  </Button>
                  
                  <Button
                    onClick={() => window.location.reload()}
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
    </AnimatePresence>
  );
}
