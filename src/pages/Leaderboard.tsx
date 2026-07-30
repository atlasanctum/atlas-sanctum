import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Crown, Flame, TrendingUp, Users, Leaf, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import PageLayout from '@/components/PageLayout';
import { SocialShareButtons } from '@/components/social/SocialShareButtons';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  user_id: string;
  full_name: string | null;
  organization: string | null;
  total_offset: number;
  achievement_score: number;
  rank: number;
  project_count: number;
}

const rankStyles = {
  1: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  2: { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
  3: { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30' },
};

export default function Leaderboard() {
  const { user } = useSupabaseAuth();
  const [selectedTab, setSelectedTab] = useState<'offset' | 'achievements'>('offset');
  const [shareEntry, setShareEntry] = useState<LeaderboardEntry | null>(null);

  // Fetch leaderboard data
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedTab],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      // Get all profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, organization');

      if (!profiles) return [];

      // Get holdings for each user
      const { data: holdings } = await supabase
        .from('credit_holdings')
        .select('user_id, quantity, project_id');

      if (!holdings) return [];

      // Aggregate by user
      const userStats: Record<string, { offset: number; projects: Set<string> }> = {};
      
      holdings.forEach(h => {
        if (!userStats[h.user_id]) {
          userStats[h.user_id] = { offset: 0, projects: new Set() };
        }
        userStats[h.user_id].offset += h.quantity;
        userStats[h.user_id].projects.add(h.project_id);
      });

      // Calculate scores and create entries
      const entries: LeaderboardEntry[] = profiles.map(p => {
        const stats = userStats[p.user_id] || { offset: 0, projects: new Set() };
        const projectCount = stats.projects.size;
        
        // Achievement score based on offset milestones and diversity
        const offsetScore = Math.min(stats.offset * 10, 500); // Max 500 from offset
        const diversityScore = projectCount * 50; // 50 points per project type
        const achievementScore = offsetScore + diversityScore;

        return {
          user_id: p.user_id,
          full_name: p.full_name,
          organization: p.organization,
          total_offset: stats.offset,
          achievement_score: achievementScore,
          rank: 0,
          project_count: projectCount,
        };
      });

      // Sort and assign ranks
      entries.sort((a, b) => 
        selectedTab === 'offset' 
          ? b.total_offset - a.total_offset 
          : b.achievement_score - a.achievement_score
      );

      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      return entries.filter(e => e.total_offset > 0 || e.achievement_score > 0);
    },
  });

  const currentUserRank = leaderboard?.find(e => e.user_id === user?.id);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            See how you rank among climate champions in offsetting CO₂ and earning achievements
          </p>
        </motion.div>

        {/* User's Current Rank */}
        {currentUserRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">#{currentUserRank.rank}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Your Ranking</p>
                      <p className="text-sm text-muted-foreground">
                        {currentUserRank.total_offset} tonnes CO₂ offset • {currentUserRank.achievement_score} pts
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShareEntry(currentUserRank)}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Rank
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'offset' | 'achievements')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="offset" className="gap-2">
              <Leaf className="w-4 h-4" />
              CO₂ Offset
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offset">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Top Climate Champions
                </CardTitle>
                <CardDescription>
                  Ranked by total CO₂ offset in tonnes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardList 
                  entries={leaderboard} 
                  isLoading={isLoading} 
                  metric="offset" 
                  currentUserId={user?.id}
                  onShare={setShareEntry}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Achievement Leaders
                </CardTitle>
                <CardDescription>
                  Ranked by total achievement points earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LeaderboardList 
                  entries={leaderboard} 
                  isLoading={isLoading} 
                  metric="achievements" 
                  currentUserId={user?.id}
                  onShare={setShareEntry}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Share Modal */}
        {shareEntry && (
          <ShareRankModal 
            entry={shareEntry} 
            onClose={() => setShareEntry(null)} 
          />
        )}

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <Card className="bg-card/50">
            <CardContent className="py-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{leaderboard?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="py-4 text-center">
              <Leaf className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">
                {leaderboard?.reduce((sum, e) => sum + e.total_offset, 0).toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground">Total Tonnes Offset</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50">
            <CardContent className="py-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">
                {leaderboard?.reduce((sum, e) => sum + e.achievement_score, 0).toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground">Total Points Earned</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}

// Leaderboard List Component
function LeaderboardList({ 
  entries, 
  isLoading, 
  metric, 
  currentUserId,
  onShare 
}: { 
  entries?: LeaderboardEntry[]; 
  isLoading: boolean; 
  metric: 'offset' | 'achievements';
  currentUserId?: string;
  onShare: (entry: LeaderboardEntry) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No rankings yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.slice(0, 20).map((entry, index) => {
        const isCurrentUser = entry.user_id === currentUserId;
        const rankStyle = rankStyles[entry.rank as keyof typeof rankStyles];
        const RankIcon = rankStyle?.icon || null;

        return (
          <motion.div
            key={entry.user_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg transition-colors",
              isCurrentUser 
                ? "bg-primary/10 border border-primary/30" 
                : "bg-muted/30 hover:bg-muted/50",
              rankStyle?.bg
            )}
          >
            {/* Rank */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold",
              rankStyle ? rankStyle.color : "text-muted-foreground"
            )}>
              {RankIcon ? (
                <RankIcon className="w-6 h-6" />
              ) : (
                <span>{entry.rank}</span>
              )}
            </div>

            {/* User Info */}
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/20 text-primary">
                {(entry.full_name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {entry.full_name || 'Anonymous User'}
                {isCurrentUser && <Badge variant="secondary" className="ml-2 text-xs">You</Badge>}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {entry.organization || `${entry.project_count} projects`}
              </p>
            </div>

            {/* Stats */}
            <div className="text-right">
              <p className="font-bold text-foreground">
                {metric === 'offset' 
                  ? `${entry.total_offset.toLocaleString()} t`
                  : `${entry.achievement_score.toLocaleString()} pts`
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {metric === 'offset' ? 'CO₂' : 'score'}
              </p>
            </div>

            {/* Share button on hover */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onShare(entry)}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

// Share Modal
function ShareRankModal({ entry, onClose }: { entry: LeaderboardEntry; onClose: () => void }) {
  const shareData = {
    title: `I'm ranked #${entry.rank} on Atlas Climate Leaderboard!`,
    description: `I've offset ${entry.total_offset} tonnes of CO₂ and earned ${entry.achievement_score} achievement points. Join me in fighting climate change!`,
    url: window.location.href,
    type: 'leaderboard' as const,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-6 rounded-xl shadow-2xl max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Your Rank
        </h3>
        
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <p className="font-semibold">#{entry.rank} on the Leaderboard</p>
          <p className="text-sm text-muted-foreground">
            {entry.total_offset} tonnes CO₂ • {entry.achievement_score} points
          </p>
        </div>

        <SocialShareButtons {...shareData} />

        <Button variant="outline" className="w-full mt-4" onClick={onClose}>
          Close
        </Button>
      </motion.div>
    </div>
  );
}
