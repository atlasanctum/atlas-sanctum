import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { Achievement } from '@/components/achievements/AchievementBadge';

// Define all possible achievements
const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  // Purchase Achievements
  {
    id: 'first_purchase',
    name: 'First Purchase',
    description: 'Made your first carbon credit purchase',
    icon: 'leaf',
    category: 'purchase',
    requirement: 'Complete 1 purchase',
    tier: 'bronze',
  },
  {
    id: 'investor_5',
    name: 'Climate Investor',
    description: 'Completed 5 carbon credit purchases',
    icon: 'trending',
    category: 'purchase',
    requirement: 'Complete 5 purchases',
    tier: 'silver',
  },
  {
    id: 'investor_20',
    name: 'Impact Champion',
    description: 'Completed 20 carbon credit purchases',
    icon: 'trophy',
    category: 'purchase',
    requirement: 'Complete 20 purchases',
    tier: 'gold',
  },

  // Offset Achievements
  {
    id: 'offset_1',
    name: 'First Tonne',
    description: 'Offset your first tonne of CO₂',
    icon: 'star',
    category: 'offset',
    requirement: 'Offset 1 tonne of CO₂',
    tier: 'bronze',
  },
  {
    id: 'offset_10',
    name: 'Decade Defender',
    description: 'Offset 10 tonnes of CO₂',
    icon: 'shield',
    category: 'offset',
    requirement: 'Offset 10 tonnes of CO₂',
    tier: 'silver',
  },
  {
    id: 'offset_50',
    name: 'Carbon Crusader',
    description: 'Offset 50 tonnes of CO₂',
    icon: 'zap',
    category: 'offset',
    requirement: 'Offset 50 tonnes of CO₂',
    tier: 'gold',
  },
  {
    id: 'offset_100',
    name: 'Planet Protector',
    description: 'Offset 100 tonnes of CO₂',
    icon: 'heart',
    category: 'offset',
    requirement: 'Offset 100 tonnes of CO₂',
    tier: 'platinum',
  },

  // Engagement Achievements
  {
    id: 'portfolio_guardian',
    name: 'Portfolio Guardian',
    description: 'Invested in 3 different project types',
    icon: 'target',
    category: 'engagement',
    requirement: 'Invest in 3 project categories',
    tier: 'silver',
  },
  {
    id: 'diversified',
    name: 'Diversified Investor',
    description: 'Hold credits from 5 different projects',
    icon: 'users',
    category: 'engagement',
    requirement: 'Own credits from 5 projects',
    tier: 'gold',
  },

  // Milestone Achievements
  {
    id: 'retired_credits',
    name: 'Permanent Impact',
    description: 'Retired carbon credits for permanent offset',
    icon: 'award',
    category: 'milestone',
    requirement: 'Retire credits once',
    tier: 'silver',
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined the platform in its early stages',
    icon: 'star',
    category: 'milestone',
    requirement: 'Be an early member',
    tier: 'gold',
  },
  {
    id: 'streak_30',
    name: 'Consistent Contributor',
    description: 'Active on the platform for 30 days',
    icon: 'zap',
    category: 'milestone',
    requirement: 'Be active for 30 days',
    tier: 'bronze',
  },
];

export function useAchievements() {
  const { user } = useSupabaseAuth();

  // Fetch user's holdings and transactions
  const { data: holdings } = useQuery({
    queryKey: ['holdings-for-achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('credit_holdings')
        .select('*, carbon_projects(project_type)')
        .eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions-for-achievements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed');
      return data || [];
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile-for-achievements', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const achievements: Achievement[] = useMemo(() => {
    if (!holdings || !transactions) {
      return ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        progress: 0,
        unlocked: false,
      }));
    }

    const totalCredits = holdings.reduce((sum, h) => sum + h.quantity, 0);
    const purchaseCount = transactions.filter(t => t.transaction_type === 'purchase').length;
    const retiredCredits = holdings.filter(h => h.retired).length;
    const uniqueProjects = new Set(holdings.map(h => h.project_id)).size;
    const uniqueProjectTypes = new Set(
      holdings.map(h => (h.carbon_projects as any)?.project_type).filter(Boolean)
    ).size;

    // Calculate days since signup
    const daysSinceSignup = profile?.created_at
      ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    // Check if early adopter (signed up in first 6 months of platform)
    const isEarlyAdopter = profile?.created_at
      ? new Date(profile.created_at) < new Date('2025-06-01')
      : false;

    return ACHIEVEMENT_DEFINITIONS.map((def): Achievement => {
      let progress = 0;
      let unlocked = false;

      switch (def.id) {
        case 'first_purchase':
          progress = Math.min(purchaseCount * 100, 100);
          unlocked = purchaseCount >= 1;
          break;
        case 'investor_5':
          progress = Math.min((purchaseCount / 5) * 100, 100);
          unlocked = purchaseCount >= 5;
          break;
        case 'investor_20':
          progress = Math.min((purchaseCount / 20) * 100, 100);
          unlocked = purchaseCount >= 20;
          break;
        case 'offset_1':
          progress = Math.min(totalCredits * 100, 100);
          unlocked = totalCredits >= 1;
          break;
        case 'offset_10':
          progress = Math.min((totalCredits / 10) * 100, 100);
          unlocked = totalCredits >= 10;
          break;
        case 'offset_50':
          progress = Math.min((totalCredits / 50) * 100, 100);
          unlocked = totalCredits >= 50;
          break;
        case 'offset_100':
          progress = Math.min((totalCredits / 100) * 100, 100);
          unlocked = totalCredits >= 100;
          break;
        case 'portfolio_guardian':
          progress = Math.min((uniqueProjectTypes / 3) * 100, 100);
          unlocked = uniqueProjectTypes >= 3;
          break;
        case 'diversified':
          progress = Math.min((uniqueProjects / 5) * 100, 100);
          unlocked = uniqueProjects >= 5;
          break;
        case 'retired_credits':
          progress = retiredCredits > 0 ? 100 : 0;
          unlocked = retiredCredits > 0;
          break;
        case 'early_adopter':
          progress = isEarlyAdopter ? 100 : 0;
          unlocked = isEarlyAdopter;
          break;
        case 'streak_30':
          progress = Math.min((daysSinceSignup / 30) * 100, 100);
          unlocked = daysSinceSignup >= 30;
          break;
        default:
          break;
      }

      return {
        ...def,
        progress: Math.round(progress),
        unlocked,
        unlockedAt: unlocked ? new Date() : undefined,
      };
    });
  }, [holdings, transactions, profile]);

  // Calculate total points and level
  const totalPoints = useMemo(() => {
    const tierPoints = { bronze: 10, silver: 25, gold: 50, platinum: 100 };
    return achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + tierPoints[a.tier], 0);
  }, [achievements]);

  const currentLevel = Math.floor(totalPoints / 100) + 1;
  const nextLevelPoints = 100;

  return {
    achievements,
    totalPoints,
    currentLevel,
    nextLevelPoints,
  };
}
