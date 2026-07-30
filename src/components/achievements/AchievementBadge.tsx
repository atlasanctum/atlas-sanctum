import { motion } from 'framer-motion';
import { Award, Leaf, Shield, TrendingUp, Users, Star, Target, Trophy, Zap, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SocialShareButtons } from '@/components/social/SocialShareButtons';
import { cn } from '@/lib/utils';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'award' | 'leaf' | 'shield' | 'trending' | 'users' | 'star' | 'target' | 'trophy' | 'zap' | 'heart';
  category: 'purchase' | 'offset' | 'engagement' | 'milestone';
  progress: number; // 0-100
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

const iconMap = {
  award: Award,
  leaf: Leaf,
  shield: Shield,
  trending: TrendingUp,
  users: Users,
  star: Star,
  target: Target,
  trophy: Trophy,
  zap: Zap,
  heart: Heart,
};

const tierColors = {
  bronze: 'from-amber-600 to-amber-800 border-amber-500',
  silver: 'from-slate-400 to-slate-600 border-slate-400',
  gold: 'from-yellow-400 to-yellow-600 border-yellow-500',
  platinum: 'from-indigo-400 to-purple-600 border-purple-500',
};

const tierBgColors = {
  bronze: 'bg-amber-500/10',
  silver: 'bg-slate-400/10',
  gold: 'bg-yellow-500/10',
  platinum: 'bg-purple-500/10',
};

interface AchievementBadgeProps {
  achievement: Achievement;
  showShare?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ achievement, showShare = false, size = 'md' }: AchievementBadgeProps) {
  const Icon = iconMap[achievement.icon];
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
        achievement.unlocked
          ? `${tierBgColors[achievement.tier]} border-${achievement.tier === 'bronze' ? 'amber' : achievement.tier === 'silver' ? 'slate' : achievement.tier === 'gold' ? 'yellow' : 'purple'}-500/30`
          : 'bg-muted/30 border-border/30 opacity-60'
      )}
    >
      {/* Badge Icon */}
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center',
          sizeClasses[size],
          achievement.unlocked
            ? `bg-gradient-to-br ${tierColors[achievement.tier]}`
            : 'bg-muted border border-border/50'
        )}
      >
        <Icon
          className={cn(
            iconSizes[size],
            achievement.unlocked ? 'text-white' : 'text-muted-foreground'
          )}
        />
        
        {/* Progress Ring for locked achievements */}
        {!achievement.unlocked && achievement.progress > 0 && (
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeDasharray={`${achievement.progress * 2.83} 283`}
              className="transition-all duration-500"
            />
          </svg>
        )}
        
        {/* Unlocked checkmark */}
        {achievement.unlocked && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <p className={cn(
          'font-semibold text-sm',
          achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {achievement.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {achievement.description}
        </p>
        <Badge
          variant="outline"
          className={cn(
            'mt-2 text-xs capitalize',
            achievement.unlocked && tierBgColors[achievement.tier]
          )}
        >
          {achievement.tier}
        </Badge>
      </div>

      {/* Progress */}
      {!achievement.unlocked && (
        <div className="w-full mt-2">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            {achievement.progress}% - {achievement.requirement}
          </p>
        </div>
      )}

      {/* Share Button */}
      {showShare && achievement.unlocked && (
        <div className="mt-2">
          <SocialShareButtons
            title={`I earned the "${achievement.name}" badge!`}
            description={`${achievement.description} - Join me in making a positive impact!`}
            type="achievement"
          />
        </div>
      )}
    </motion.div>
  );
}
