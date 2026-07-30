import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AchievementBadge } from './AchievementBadge';
import { useAchievements } from '@/hooks/useAchievements';

export function AchievementsPanel() {
  const { achievements, totalPoints, currentLevel, nextLevelPoints } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  }, [achievements, selectedCategory]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressToNextLevel = ((totalPoints % 100) / 100) * 100;

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'purchase', label: 'Purchases' },
    { id: 'offset', label: 'Offsets' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'milestone', label: 'Milestones' },
  ];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-accent" />
              Achievements
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Track your sustainability milestones
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{unlockedCount}/{achievements.length}</p>
            <p className="text-xs text-muted-foreground">Badges Earned</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">{currentLevel}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Level {currentLevel}</p>
                <p className="text-xs text-muted-foreground">{totalPoints} total points</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent">
              {nextLevelPoints - (totalPoints % 100)} pts to next level
            </Badge>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-1"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AchievementBadge
                achievement={achievement}
                showShare={achievement.unlocked}
                size="md"
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No achievements in this category yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
