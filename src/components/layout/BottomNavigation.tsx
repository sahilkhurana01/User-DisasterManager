import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Shield, 
  AlertTriangle, 
  Phone, 
  Bot,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUnreadCount } from '@/store/useStore';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    icon: Home, 
    label: 'Home', 
    path: '/', 
    color: 'text-foreground' 
  },
  { 
    icon: Shield, 
    label: 'Safe Places', 
    path: '/safe', 
    color: 'text-safe' 
  },
  { 
    icon: AlertTriangle, 
    label: 'SOS', 
    path: '/sos', 
    color: 'text-emergency' 
  },
  { 
    icon: Phone, 
    label: 'Contacts', 
    path: '/contacts', 
    color: 'text-info' 
  },
  { 
    icon: Bot, 
    label: 'AI Assistant', 
    path: '/ai', 
    color: 'text-accent' 
  }
];

export function BottomNavigation() {
  const location = useLocation();
  const unreadCount = useUnreadCount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Notifications Bell - Top Right */}
      <motion.div 
        className="fixed top-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <NavLink 
          to="/notifications"
          className={({ isActive }) => cn(
            'relative flex items-center justify-center w-12 h-12 rounded-xl glass glass-hover transition-all duration-200',
            isActive && 'bg-white/10'
          )}
        >
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse-emergency"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </NavLink>
      </motion.div>

      {/* Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 z-40 nav-glass"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-around px-4 py-3 safe-area-padding-bottom">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isEmergency = item.path === '/sos';
            
            return (
              <motion.div
                key={item.path}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => cn(
                    'relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group min-w-0',
                    isActive && !isEmergency && 'bg-white/10',
                    isEmergency && 'pulse-emergency bg-emergency/20',
                    !isActive && !isEmergency && 'glass-hover'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center transition-all duration-200',
                    isEmergency && 'group-hover:scale-110'
                  )}>
                    <Icon 
                      className={cn(
                        'w-6 h-6 transition-colors duration-200',
                        isActive ? item.color : 'text-muted-foreground',
                        isEmergency && 'text-emergency-foreground'
                      )} 
                    />
                  </div>
                  
                  <span 
                    className={cn(
                      'text-xs mt-1 transition-colors duration-200 font-medium tracking-tight',
                      isActive ? item.color : 'text-muted-foreground',
                      isEmergency && 'text-emergency-foreground'
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Active Indicator */}
                  {isActive && !isEmergency && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/5 rounded-xl border border-white/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>
      
      {/* Bottom Safe Area for iOS */}
      <div className="h-safe-bottom bg-glass/50 backdrop-blur-sm border-t border-white/10" />
    </>
  );
}