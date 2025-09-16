import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Shield, 
  AlertTriangle, 
  Phone, 
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Bottom Container */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 z-40"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Bar background */}
        <div className="mx-4 mb-5 rounded-2xl bg-background/95 border border-white/10 shadow-2xl px-5 py-2 flex items-center justify-between">
          {/* Left group */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive: active }) => cn(
                'flex flex-col items-center justify-center min-w-10',
                active && 'text-foreground'
              )}
            >
              <Home className={cn('w-6 h-6', isActive('/') ? 'text-foreground' : 'text-muted-foreground')} />
              <span className={cn('text-[11px] mt-1', isActive('/') ? 'text-foreground' : 'text-muted-foreground')}>Home</span>
            </NavLink>

            <NavLink
              to="/safe"
              className={({ isActive: active }) => cn(
                'flex flex-col items-center justify-center min-w-10',
                active && 'text-foreground'
              )}
            >
              <Shield className={cn('w-6 h-6', isActive('/safe') ? 'text-safe' : 'text-muted-foreground')} />
              <span className={cn('text-[11px] mt-1', isActive('/safe') ? 'text-safe' : 'text-muted-foreground')}>Safe Places</span>
            </NavLink>
          </div>

          {/* Right group */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/contacts"
              className={({ isActive: active }) => cn(
                'flex flex-col items-center justify-center min-w-10',
                active && 'text-foreground'
              )}
            >
              <Phone className={cn('w-6 h-6', isActive('/contacts') ? 'text-info' : 'text-muted-foreground')} />
              <span className={cn('text-[11px] mt-1', isActive('/contacts') ? 'text-info' : 'text-muted-foreground')}>Contacts</span>
            </NavLink>

            <NavLink
              to="/ai"
              className={({ isActive: active }) => cn(
                'flex flex-col items-center justify-center min-w-10',
                active && 'text-foreground'
              )}
            >
              <Bot className={cn('w-6 h-6', isActive('/ai') ? 'text-accent' : 'text-muted-foreground')} />
              <span className={cn('text-[11px] mt-1', isActive('/ai') ? 'text-accent' : 'text-muted-foreground')}>AI Assistant</span>
            </NavLink>
          </div>
        </div>

        {/* Center SOS button */}
        <div className="pointer-events-none">
          <NavLink
            to="/sos"
            className="pointer-events-auto absolute left-1/2 bottom-8 -translate-x-1/2"
          >
            <div className="pulse-emergency w-20 h-20 rounded-full bg-emergency text-emergency-foreground shadow-2xl flex items-center justify-center border-4 border-white/20">
              <AlertTriangle className="w-5 h-5 mr-1" />
              <span className="text-base font-bold">SOS</span>
            </div>
          </NavLink>
        </div>
      </motion.nav>

      {/* Bottom Safe Area for iOS */}
      <div className="h-safe-bottom bg-background/70 border-t border-white/10" />
    </>
  );
}