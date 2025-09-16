import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUnreadCount } from '@/store/useStore';
import { cn } from '@/lib/utils';

export function TopBar() {
  const unreadCount = useUnreadCount();

  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 z-50  "
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left side - Settings Icon */}
        <NavLink 
          to="/settings"
          className={({ isActive }) => cn(
            'relative flex items-center bg-black justify-center w-12 h-12 rounded-xl  transition-all duration-200',
            isActive && 'bg-white/10'
          )}
        >
          <Settings className="w-5 h-5 text-foreground" />
        </NavLink>

        {/* Center - App Title */}
        {/* <div className="flex-1 text-center">
          <h1 className="text font-extrabold text-black">Disaster Dashboard</h1>
        </div> */}

        {/* Right side - Notifications Icon */}
        <NavLink 
          to="/notifications"
          className={({ isActive }) => cn(
            'relative flex items-center justify-center w-12 h-12 rounded-xl bg-black  transition-all duration-200',
            isActive && 'bg-white/10'
          )}
        >
          <Bell className="w-5 h-5 text-foreground" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </NavLink>
      </div>
    </motion.div>
  );
}
