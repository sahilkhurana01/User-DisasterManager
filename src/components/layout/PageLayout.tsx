import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BottomNavigation } from './BottomNavigation';
import { TopBar } from './TopBar';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.25
};

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <TopBar />
      
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={`pt-20 pb-28 ${className}`}
      >
        {children}
      </motion.main>
      
      <BottomNavigation />
    </div>
  );
}