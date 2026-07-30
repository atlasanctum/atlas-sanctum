// @ts-nocheck
import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import type { Achievement } from './AchievementBadge';
import { cn } from '@/lib/utils';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

const tierColors = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-400 to-slate-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-cyan-300 to-purple-500',
};

const tierEmoji = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Shoot from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      fireConfetti();
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, fireConfetti, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto"
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl p-1 shadow-2xl",
              "bg-gradient-to-r",
              tierColors[achievement.tier]
            )}
          >
            <div className="bg-card/95 backdrop-blur-xl rounded-xl p-6 min-w-[320px] max-w-[400px]">
              {/* Sparkle decorations */}
              <Sparkles className="absolute top-2 right-2 w-5 h-5 text-yellow-400 animate-pulse" />
              <Star className="absolute bottom-2 left-2 w-4 h-4 text-yellow-400 animate-pulse" />
              
              <div className="flex items-center gap-4">
                {/* Badge Icon */}
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br shadow-lg",
                    tierColors[achievement.tier]
                  )}
                >
                  <Trophy className="w-8 h-8 text-white drop-shadow-md" />
                </motion.div>

                {/* Content */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Achievement Unlocked! {tierEmoji[achievement.tier]}
                    </p>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Points Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-2 -right-2"
              >
                <div className="bg-gradient-to-r from-primary to-accent rounded-full px-3 py-1 shadow-lg">
                  <span className="text-xs font-bold text-primary-foreground">
                    +{achievement.tier === 'bronze' ? 10 : achievement.tier === 'silver' ? 25 : achievement.tier === 'gold' ? 50 : 100} pts
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to track and display new achievements
export function useAchievementNotifications(achievements: Achievement[]) {
  const [notificationQueue, setNotificationQueue] = useState<Achievement[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  const [previouslyUnlocked, setPreviouslyUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newlyUnlocked = achievements.filter(
      a => a.unlocked && !previouslyUnlocked.has(a.id)
    );

    if (newlyUnlocked.length > 0) {
      setNotificationQueue(prev => [...prev, ...newlyUnlocked]);
      setPreviouslyUnlocked(prev => {
        const newSet = new Set(prev);
        newlyUnlocked.forEach(a => newSet.add(a.id));
        return newSet;
      });
    }
  }, [achievements, previouslyUnlocked]);

  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      setCurrentNotification(notificationQueue[0]);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [currentNotification, notificationQueue]);

  const dismissNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  return {
    currentNotification,
    dismissNotification,
  };
}
