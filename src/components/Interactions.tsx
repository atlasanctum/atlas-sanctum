import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// ============================================================================
// MICRO INTERACTIONS
// ============================================================================

// Hover Button with Ripple Effect
export const InteractiveButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', size = 'md', loading = false, disabled = false }) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      className={`relative overflow-hidden rounded-lg font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
      }`}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      
      <span className="relative flex items-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </motion.button>
  );
};

// Animated Counter
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ value, duration = 2, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}{count.toFixed(decimals)}{suffix}
    </motion.span>
  );
};

// Progress Bar with Animation
export const AnimatedProgress: React.FC<{
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
}> = ({ value, max = 100, color = 'bg-primary', height = 'h-2', showLabel = false }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-muted rounded-full overflow-hidden`}>
        <motion.div
          className={`${height} ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <motion.div
          className="text-sm text-muted-foreground mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value} / {max}
        </motion.div>
      )}
    </div>
  );
};

// Floating Action Button
export const FloatingActionButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}> = ({ icon, onClick, position = 'bottom-right' }) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <motion.button
      className={`fixed ${positions[position]} z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {icon}
    </motion.button>
  );
};

// ============================================================================
// MACRO INTERACTIONS
// ============================================================================

// Page Transition Wrapper
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Staggered List Animation
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
}> = ({ children, staggerDelay = 0.1 }) => (
  <div>
    {children.map((child, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * staggerDelay }}
      >
        {child}
      </motion.div>
    ))}
  </div>
);

// Card Hover Effects
export const InteractiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <motion.div
    className={`bg-card border border-border/50 rounded-lg p-6 cursor-pointer ${className}`}
    onClick={onClick}
    whileHover={{ 
      scale: 1.02, 
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      borderColor: "hsl(var(--primary))"
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

// Toast Notification System
export const ToastNotification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}> = ({ message, type, isVisible, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Zap className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white'
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${colors[type]}`}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {icons[type]}
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-2 hover:opacity-70">
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading States
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`${sizes[size]} border-2 border-primary border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

// Skeleton Loading
export const SkeletonLoader: React.FC<{
  width?: string;
  height?: string;
  className?: string;
}> = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <motion.div
    className={`${width} ${height} bg-muted rounded ${className}`}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
);

// Parallax Scroll Effect
export const ParallaxSection: React.FC<{
  children: React.ReactNode;
  speed?: number;
}> = ({ children, speed = 0.5 }) => {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      style={{ transform: `translateY(${offsetY * speed}px)` }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
};

export default {
  InteractiveButton,
  AnimatedCounter,
  AnimatedProgress,
  FloatingActionButton,
  PageTransition,
  StaggeredList,
  InteractiveCard,
  ToastNotification,
  LoadingSpinner,
  SkeletonLoader,
  ParallaxSection
};