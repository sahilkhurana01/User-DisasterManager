import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <Card className="glass border-white/20 p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="mb-6"
          >
            <MapPin className="w-16 h-16 text-emergency mx-auto mb-4" />
          </motion.div>
          
          <h1 className="text-6xl font-bold text-emergency mb-4">404</h1>
          <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
          <p className="text-muted-foreground mb-8">
            This route doesn't exist in our emergency response system. 
            Let's get you back to safety.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-safe hover:bg-safe/90 text-safe-foreground"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Safety
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
