import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Coins,
  Trophy,
  Link2,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Innovation data
const innovations = [
  {
    id: 'ai',
    title: 'AI Insights',
    description: 'AI-powered impact predictions & personalized recommendations',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500',
    stats: [
      { label: 'Predictions', value: '12', sub: 'Active' },
      { label: 'Accuracy', value: '94%', sub: 'Avg' },
    ],
    actions: [
      { label: 'View Predictions', href: '/ai-insights' },
      { label: 'Get Recommendations', href: '/ai-insights?tab=recommendations' },
    ],
  },
  {
    id: 'defi',
    title: 'Carbon Market',
    description: 'Real-time carbon credit trading & tokenized impact bonds',
    icon: Coins,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    stats: [
      { label: 'Credits', value: '$2.4M', sub: 'Volume' },
      { label: 'Bonds', value: '8', sub: 'Active' },
    ],
    actions: [
      { label: 'Browse Marketplace', href: '/carbon-marketplace' },
      { label: 'Trade Credits', href: '/carbon-marketplace?tab=trading' },
    ],
  },
  {
    id: 'gamification',
    title: 'Challenges',
    description: 'Achievements, leaderboards & team impact quests',
    icon: Trophy,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-500',
    stats: [
      { label: 'Achievements', value: '24', sub: 'Earned' },
      { label: 'Points', value: '12.5K', sub: 'Total' },
    ],
    actions: [
      { label: 'View Achievements', href: '/impact-challenges' },
      { label: 'Join Challenges', href: '/impact-challenges?tab=teams' },
    ],
  },
  {
    id: 'blockchain',
    title: 'Blockchain',
    description: 'On-chain verification, NFTs & DAO governance',
    icon: Link2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500',
    stats: [
      { label: 'Verified', value: '12', sub: 'Projects' },
      { label: 'NFTs', value: '4', sub: 'Collected' },
    ],
    actions: [
      { label: 'Verify Project', href: '/blockchain-verification' },
      { label: 'Vote on DAO', href: '/blockchain-verification?tab=governance' },
    ],
  },
];

interface InnovationCardProps {
  innovation: typeof innovations[0];
  isActive: boolean;
  onClick: () => void;
}

function InnovationCard({ innovation, isActive, onClick }: InnovationCardProps) {
  const Icon = innovation.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300',
        'border border-border/50 bg-card hover:border-primary/50',
        isActive && 'ring-2 ring-primary/50'
      )}
    >
      <div className={cn('absolute inset-0 opacity-5 bg-gradient-to-br', innovation.color)} />
      
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2 rounded-lg', innovation.bgColor)}>
            <Icon className={cn('w-5 h-5', innovation.textColor)} />
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {innovation.title}
          </Badge>
        </div>

        <h3 className="font-semibold text-foreground mb-1">{innovation.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {innovation.description}
        </p>

        <div className="flex gap-4 mb-3">
          {innovation.stats.map((stat, idx) => (
            <div key={idx}>
              <div className={cn('text-lg font-bold', innovation.textColor)}>
                {stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {innovation.actions.slice(0, 2).map((action, idx) => (
            <Button
              key={idx}
              variant="ghost"
              size="sm"
              className={cn(
                'text-xs h-7',
                innovation.textColor,
                'hover:bg-opacity-20'
              )}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = action.href;
              }}
            >
              {action.label}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface InnovationDetailProps {
  innovation: typeof innovations[0];
  onClose: () => void;
}

function InnovationDetail({ innovation, onClose }: InnovationDetailProps) {
  const Icon = innovation.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn('relative h-32 bg-gradient-to-br', innovation.color)}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
          <div className="absolute -bottom-8 left-6">
            <div className={cn('p-3 rounded-xl bg-card shadow-lg', innovation.bgColor)}>
              <Icon className={cn('w-8 h-8', innovation.textColor)} />
            </div>
          </div>
        </div>

        <div className="pt-12 px-6 pb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{innovation.title}</h2>
          <p className="text-muted-foreground mb-6">{innovation.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {innovation.stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/50">
                <div className={cn('text-2xl font-bold', innovation.textColor)}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {innovation.actions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.location.href = action.href}
              >
                {action.label}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function InnovationsHub() {
  const [activeInnovation, setActiveInnovation] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeData = innovations.find((i) => i.id === activeInnovation);

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Platform Innovations</h2>
            <p className="text-sm text-muted-foreground">
              Explore AI-powered insights, DeFi trading, gamification & blockchain
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>

        <div
          className={cn(
            'grid gap-4 transition-all duration-300',
            isExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          )}
        >
          {innovations.map((innovation) => (
            <InnovationCard
              key={innovation.id}
              innovation={innovation}
              isActive={activeInnovation === innovation.id}
              onClick={() => setActiveInnovation(innovation.id)}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {activeInnovation && activeData && (
          <InnovationDetail
            innovation={activeData}
            onClose={() => setActiveInnovation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Mini widget version for embedding in other dashboards
export function InnovationsWidget({ className }: { className?: string }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {innovations.map((innovation) => {
            const Icon = innovation.icon;
            return (
              <a
                key={innovation.id}
                href={innovation.actions[0].href}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg',
                  'hover:bg-muted transition-colors',
                  innovation.bgColor
                )}
              >
                <Icon className={cn('w-5 h-5', innovation.textColor)} />
                <span className="text-[10px] text-center text-muted-foreground truncate w-full">
                  {innovation.title}
                </span>
              </a>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
