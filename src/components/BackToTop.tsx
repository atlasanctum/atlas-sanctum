import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  threshold?: number;
  className?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({ 
  threshold = 400,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      setIsVisible(scrollY > threshold);
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full",
            "bg-primary text-primary-foreground shadow-lg",
            "flex items-center justify-center",
            "hover:shadow-xl transition-shadow duration-300",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            className
          )}
          aria-label="Back to top"
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 48 48"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.2"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={138.23}
              strokeDashoffset={138.23 - (scrollProgress / 100) * 138.23}
              initial={{ strokeDashoffset: 138.23 }}
              animate={{ strokeDashoffset: 138.23 - (scrollProgress / 100) * 138.23 }}
              transition={{ duration: 0.1 }}
            />
          </svg>
          
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
