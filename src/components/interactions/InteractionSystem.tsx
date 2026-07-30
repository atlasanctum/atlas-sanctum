import React, { useState, useCallback, useRef, createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import {
  Heart,
  Bookmark,
  Share2,
  Eye,
  Sparkles,
  Zap,
  Bell,
  ArrowUpRight,
  Plus,
  Minus,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================
// TOAST HOOK
// ============================================

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface UseToastReturn {
  toasts: Toast[];
  toast: (type: ToastType, title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}

// ============================================
// TOAST COMPONENT
// ============================================

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-green-500" size={18} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={18} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={18} />;
      case 'info':
        return <Info className="text-blue-500" size={18} />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-500/10';
      case 'error':
        return 'border-l-red-500 bg-red-500/10';
      case 'warning':
        return 'border-l-amber-500 bg-amber-500/10';
      case 'info':
        return 'border-l-blue-500 bg-blue-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={cn(
        'flex items-start gap-3 p-4 bg-card border border-border border-l-4 rounded-lg shadow-lg',
        getBgColor(toast.type)
      )}
    >
      {getIcon(toast.type)}
      <div className="flex-1 min-w-0">
        <p className="font-medium">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-muted-foreground">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-muted rounded"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 w-96">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// INTERACTION CONTEXT
// ============================================

interface InteractionState {
  likes: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  views: Record<string, number>;
  shares: Record<string, number>;
}

interface InteractionContextType {
  state: InteractionState;
  toggleLike: (id: string) => void;
  toggleBookmark: (id: string) => void;
  incrementView: (id: string) => void;
  incrementShare: (id: string) => void;
  getLikeCount: (id: string) => number;
  getShareCount: (id: string) => number;
}

const InteractionContext = createContext<InteractionContextType | null>(null);

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InteractionState>({
    likes: {},
    bookmarks: {},
    views: {},
    shares: {},
  });

  const toggleLike = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      likes: { ...prev.likes, [id]: !prev.likes[id] },
    }));
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: { ...prev.bookmarks, [id]: !prev.bookmarks[id] },
    }));
  }, []);

  const incrementView = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      views: { ...prev.views, [id]: (prev.views[id] || 0) + 1 },
    }));
  }, []);

  const incrementShare = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      shares: { ...prev.shares, [id]: (prev.shares[id] || 0) + 1 },
    }));
  }, []);

  const getLikeCount = useCallback(
    (id: string) => (state.likes[id] ? 1 : 0) + Math.floor(Math.random() * 50),
    [state.likes]
  );

  const getShareCount = useCallback(
    (id: string) => (state.shares[id] || 0) + Math.floor(Math.random() * 20),
    [state.shares]
  );

  return (
    <InteractionContext.Provider
      value={{
        state,
        toggleLike,
        toggleBookmark,
        incrementView,
        incrementShare,
        getLikeCount,
        getShareCount,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteractions() {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteractions must be used within InteractionProvider');
  }
  return context;
}

// ============================================
// MICRO INTERACTIONS
// ============================================

// Animated Heart/Like Button
interface AnimatedLikeProps {
  id: string;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function AnimatedLike({ id, size = 'md', showCount = true }: AnimatedLikeProps) {
  const { toggleLike, state, getLikeCount } = useInteractions();
  const isLiked = state.likes[id];
  const count = getLikeCount(id);

  const sizes = { sm: 16, md: 20, lg: 24 };
  const iconSize = sizes[size];

  return (
    <button
      onClick={() => toggleLike(id)}
      className={cn(
        'relative inline-flex items-center gap-1.5 transition-transform active:scale-95',
        isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
      )}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(isLiked && 'fill-current')}
          size={iconSize}
        />
      </motion.div>
      {showCount && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium"
        >
          {count}
        </motion.span>
      )}
      {isLiked && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Sparkles className="text-yellow-400" size={iconSize} />
        </motion.div>
      )}
    </button>
  );
}

// Animated Bookmark Button
interface AnimatedBookmarkProps {
  id: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedBookmark({ id, size = 'md' }: AnimatedBookmarkProps) {
  const { toggleBookmark, state } = useInteractions();
  const isBookmarked = state.bookmarks[id];

  const sizes = { sm: 16, md: 20, lg: 24 };
  const iconSize = sizes[size];

  return (
    <button
      onClick={() => toggleBookmark(id)}
      className={cn(
        'transition-transform active:scale-95',
        isBookmarked ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'
      )}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isBookmarked ? { y: [-2, 2, -2] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <Bookmark
          className={cn(isBookmarked && 'fill-current')}
          size={iconSize}
        />
      </motion.div>
    </button>
  );
}

// Animated Share Button
interface AnimatedShareProps {
  id: string;
  title?: string;
  url?: string;
}

export function AnimatedShare({ id, title = 'Share', url }: AnimatedShareProps) {
  const { incrementShare, getShareCount } = useInteractions();
  const count = getShareCount(id);
  const [showOptions, setShowOptions] = useState(false);
  const { toast } = useToast();

  const handleShare = async (platform: string) => {
    incrementShare(id);
    setShowOptions(false);
    toast('success', 'Shared!', `Link shared to ${platform}`);
  };

  const handleCopyLink = () => {
    incrementShare(id);
    setShowOptions(false);
    toast('success', 'Copied!', 'Link copied to clipboard');
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowOptions(!showOptions)}
        className="gap-1.5"
      >
        <Share2 size={16} />
        <span>{count}</span>
      </Button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 min-w-[120px]"
          >
            {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
              >
                {platform}
              </button>
            ))}
            <button
              onClick={handleCopyLink}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
            >
              Copy Link
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Animated View Counter
interface AnimatedViewsProps {
  id: string;
  initial?: number;
}

export function AnimatedViews({ id, initial = 0 }: AnimatedViewsProps) {
  const { incrementView, state } = useInteractions();
  const views = state.views[id] || initial;

  useEffect(() => {
    incrementView(id);
  }, [id]);

  return (
    <span className="flex items-center gap-1 text-muted-foreground text-xs">
      <Eye size={12} />
      <motion.span
        key={views}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {views.toLocaleString()}
      </motion.span>
    </span>
  );
}

// Animated Counter
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const spring = useSpring(0, { bounce: 0, duration: duration * 1000 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  );
}

// Loading Spinner
interface LoadingSpinnerProps {
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ progress, size = 'md' }: LoadingSpinnerProps) {
  const sizes = { sm: 16, md: 24, lg: 32 };

  return (
    <div className="relative inline-flex items-center justify-center">
      <Loader2
        className="animate-spin text-primary"
        size={sizes[size]}
      />
      {progress !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] font-bold">{progress}%</span>
        </div>
      )}
    </div>
  );
}

// Skeleton Pulse
interface SkeletonPulseProps {
  className?: string;
  delay?: number;
}

export function SkeletonPulse({ className, delay = 0 }: SkeletonPulseProps) {
  return (
    <motion.div
      initial={{ opacity: 0.3 }}
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, delay }}
      className={cn('bg-muted rounded', className)}
    />
  );
}

// ============================================
// MACRO INTERACTIONS
// ============================================

// Full Purchase Flow
interface PurchaseFlowProps {
  item: {
    id: string;
    title: string;
    price: number;
    available: number;
  };
  onComplete: (quantity: number) => void;
  onCancel: () => void;
}

export function PurchaseFlow({ item, onComplete, onCancel }: PurchaseFlowProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const total = item.price * quantity;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
    toast('success', 'Purchase Successful!', `You now own ${quantity} ${item.title}`);
  };

  const handleComplete = () => {
    onComplete(quantity);
    setStep('details');
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {step === 'details' && 'Purchase Details'}
            {step === 'payment' && 'Payment'}
            {step === 'success' && 'Success!'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-muted rounded-full" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-medium mb-4">{item.title}</h3>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-6 p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-1 rounded-full hover:bg-background transition-colors disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(item.available, quantity + 1))}
                      disabled={quantity >= item.available}
                      className="p-1 rounded-full hover:bg-background transition-colors disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per unit</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={() => setStep('payment')} className="w-full">
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="text-primary" size={32} />
                  </div>
                  <p className="text-muted-foreground">
                    Payment method integration would go here
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Items</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setStep('details')}
                  className="w-full mt-2"
                >
                  Back
                </Button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="text-green-500" size={40} />
                </motion.div>

                <h3 className="text-xl font-bold mb-2">Purchase Complete!</h3>
                <p className="text-muted-foreground mb-6">
                  Your {quantity} {item.title} has been added to your portfolio
                </p>

                <Button onClick={handleComplete} className="w-full">
                  View Portfolio
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-1 p-4 border-t border-border">
          {['details', 'payment', 'success'].map((s, i) => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                (step === s ||
                  (step === 'success' && s !== 'details'))
                  ? 'bg-primary'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Onboarding Tour
interface TourStep {
  target: string;
  title: string;
  content: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
}

export function OnboardingTour({ steps, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      toast('success', 'Welcome!', "You're all set to explore Atlas Sanctum");
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Progress */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={20} />
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mb-8">{steps[currentStep].content}</p>

            {/* Demo Element */}
            <div className="bg-muted rounded-lg p-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ArrowUpRight className="text-primary" size={20} />
                </div>
                <div>
                  <div className="font-medium">{steps[currentStep].target}</div>
                  <div className="text-sm text-muted-foreground">
                    Interactive demo element
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Tour
          </Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            <ArrowUpRight size={16} className="ml-1" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Notification Center
interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onRead: (id: string) => void;
  onClear: () => void;
}

export function NotificationCenter({
  notifications,
  onRead,
  onClear,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-green-500" size={18} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={18} />;
      case 'warning':
        return <AlertTriangle className="text-amber-500" size={18} />;
      case 'info':
        return <Info className="text-blue-500" size={18} />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                  Clear all
                </Button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => onRead(notification.id)}
                    className={cn(
                      'p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors',
                      !notification.read && 'bg-muted/30'
                    )}
                  >
                    <div className="flex gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{notification.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Command Palette
interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
        onClose();
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center px-4 border-b border-border">
          <Zap className="text-primary mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 py-4 bg-transparent outline-none"
          />
          <kbd className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 transition-colors',
                  index === selectedIndex
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted'
                )}
              >
                {cmd.icon}
                <span>{cmd.label}</span>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">ESC</kbd> Close
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Export types
export type { ToastType };
export type { AnimatedLikeProps, AnimatedBookmarkProps, AnimatedShareProps, AnimatedViewsProps, AnimatedCounterProps, LoadingSpinnerProps, SkeletonPulseProps };
export type { PurchaseFlowProps, OnboardingTourProps, NotificationCenterProps, CommandPaletteProps };
