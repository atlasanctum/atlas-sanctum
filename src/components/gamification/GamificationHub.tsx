// @ts-nocheck
/**
 * Gamification & Community Challenges Hub
 * Achievement badges, leaderboards, team challenges, and social impact quests
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Target, Users, Zap, Award, Medal, Calendar, Clock, ChevronRight, Flame, Heart,
  Search, Crown, Rocket, Gift, Lock
} from 'lucide-react';

// Types
interface Achievement {
  id: string; name: string; description: string; icon: string; category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary'; points: number; progress: number;
  unlocked: boolean; unlockedAt?: string; rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardEntry {
  rank: number; userId: string; name: string; avatar: string;
  score: number; change: number; badges: number; streak: number;
}

interface TeamChallenge {
  id: string; name: string; description: string; type: 'collective' | 'competitive' | 'collaborative';
  goal: number; current: number; unit: string; participants: number;
  prize: string; deadline: string; status: 'active' | 'completed' | 'upcoming';
  teams: { name: string; progress: number; members: number }[];
}

interface Quest {
  id: string; title: string; description: string; category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: string; xp: number; steps: QuestStep[];
  progress: number; started: boolean; completed: boolean;
}

interface QuestStep {
  id: string; title: string; description: string; completed: boolean;
}

// Mock Data
const achievements: Achievement[] = [
  { id: 'a1', name: 'First Steps', description: 'Complete your first carbon offset', icon: '🌱', category: 'offset', tier: 'bronze', points: 50, progress: 100, unlocked: true, unlockedAt: '2024-01-15', rarity: 'common' },
  { id: 'a2', name: 'Carbon Warrior', description: 'Offset 100 tons of CO2', icon: '⚔️', category: 'offset', tier: 'gold', points: 500, progress: 78, unlocked: false, rarity: 'rare' },
  { id: 'a3', name: 'Forest Guardian', description: 'Support 5 forest conservation projects', icon: '🌲', category: 'conservation', tier: 'silver', points: 200, progress: 60, unlocked: false, rarity: 'common' },
  { id: 'a4', name: 'Ocean Champion', description: 'Fund 3 ocean restoration initiatives', icon: '🌊', category: 'conservation', tier: 'gold', points: 450, progress: 66, unlocked: false, rarity: 'rare' },
  { id: 'a5', name: 'Community Leader', description: 'Refer 10 new members', icon: '👥', category: 'social', tier: 'platinum', points: 1000, progress: 40, unlocked: false, rarity: 'legendary' },
  { id: 'a6', name: 'Streak Master', description: 'Maintain a 30-day impact streak', icon: '🔥', category: 'engagement', tier: 'gold', points: 600, progress: 23, unlocked: false, rarity: 'epic' },
  { id: 'a7', name: 'Knowledge Seeker', description: 'Complete 5 educational courses', icon: '📚', category: 'education', tier: 'silver', points: 150, progress: 80, unlocked: false, rarity: 'common' },
  { id: 'a8', name: 'Impact Investor', description: 'Invest $10,000 in regenerative projects', icon: '💰', category: 'investment', tier: 'platinum', points: 1500, progress: 35, unlocked: false, rarity: 'legendary' },
  { id: 'a9', name: 'Climate Hero', description: 'Offset 1000 tons of CO2', icon: '🦸', category: 'offset', tier: 'platinum', points: 2000, progress: 12, unlocked: false, rarity: 'legendary' },
  { id: 'a10', name: 'Early Adopter', description: 'Join within the first year', icon: '🚀', category: 'special', tier: 'gold', points: 300, progress: 100, unlocked: true, unlockedAt: '2024-01-01', rarity: 'epic' },
  { id: 'a11', name: 'Team Player', description: 'Join 3 team challenges', icon: '🤝', category: 'social', tier: 'silver', points: 175, progress: 66, unlocked: false, rarity: 'common' },
  { id: 'a12', name: 'Biodiversity Defender', description: 'Support 10 wildlife projects', icon: '🦁', category: 'conservation', tier: 'gold', points: 550, progress: 30, unlocked: false, rarity: 'rare' },
];

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'EcoWarrior_42', avatar: '🦁', score: 15420, change: 0, badges: 28, streak: 45 },
  { rank: 2, userId: 'u2', name: 'GreenGiant', avatar: '🌿', score: 14850, change: 2, badges: 25, streak: 32 },
  { rank: 3, userId: 'u3', name: 'PlanetProtector', avatar: '🌍', score: 13500, change: -1, badges: 22, streak: 28 },
  { rank: 4, userId: 'u4', name: 'CarbonCrusader', avatar: '⚡', score: 12800, change: 5, badges: 20, streak: 15 },
  { rank: 5, userId: 'u5', name: 'OceanGuardian', avatar: '🌊', score: 11500, change: -2, badges: 18, streak: 22 },
  { rank: 6, userId: 'u6', name: 'ForestGuardian', avatar: '🌲', score: 10800, change: 3, badges: 16, streak: 18 },
  { rank: 7, userId: 'u7', name: 'ClimateChampion', avatar: '🏆', score: 9800, change: -1, badges: 14, streak: 12 },
  { rank: 8, userId: 'u8', name: 'SustainableStar', avatar: '⭐', score: 9200, change: 4, badges: 12, streak: 8 },
  { rank: 9, userId: 'u9', name: 'RegenRocket', avatar: '🚀', score: 8500, change: -3, badges: 10, streak: 5 },
  { rank: 10, userId: 'u10', name: 'ImpactInnovator', avatar: '💡', score: 7800, change: 1, badges: 8, streak: 3 },
];

const teamChallenges: TeamChallenge[] = [
  { id: 'tc1', name: 'Global Reforestation Sprint', description: 'Collectively plant 1 million trees this quarter', type: 'collective', goal: 1000000, current: 750000, unit: 'trees', participants: 12500, prize: 'Exclusive Forest Badge + 50% bonus XP', deadline: '2024-03-31', status: 'active', teams: [{ name: 'Amazon Defenders', progress: 75, members: 2500 }, { name: 'Borneo Heroes', progress: 68, members: 2100 }, { name: 'Congo Champions', progress: 62, members: 1800 }] },
  { id: 'tc2', name: 'Ocean Cleanup Challenge', description: 'Remove 500 tons of ocean plastic', type: 'collaborative', goal: 500000, current: 320000, unit: 'kg', participants: 8200, prize: 'Ocean Guardian Title + Limited NFT', deadline: '2024-02-28', status: 'active', teams: [{ name: 'Coral Crusaders', progress: 64, members: 1640 }, { name: 'Deep Sea Defenders', progress: 58, members: 1400 }] },
  { id: 'tc3', name: 'Carbon Reduction Race', description: 'Teams compete to reduce the most carbon', type: 'competitive', goal: 10000, current: 6800, unit: 'tons', participants: 5600, prize: 'First Place: $5,000 + Gold Trophy', deadline: '2024-02-15', status: 'active', teams: [{ name: 'Green Giants', progress: 72, members: 1120 }, { name: 'Eco Warriors', progress: 68, members: 980 }, { name: 'Planet Savers', progress: 65, members: 890 }, { name: 'Climate Crusaders', progress: 60, members: 750 }] },
  { id: 'tc4', name: 'Community Garden Project', description: 'Create 100 community gardens worldwide', type: 'collective', goal: 100, current: 100, unit: 'gardens', participants: 15000, prize: 'Community Hero Badge + 100 Bonus XP', deadline: '2024-01-30', status: 'completed', teams: [{ name: 'Urban Farmers', progress: 100, members: 5000 }, { name: 'Suburb Sustainers', progress: 100, members: 4500 }] },
];

const quests: Quest[] = [
  { id: 'q1', title: 'Carbon Offset Starter', description: 'Learn the basics of carbon offsetting and make your first offset', category: 'Getting Started', difficulty: 'easy', duration: '30 min', xp: 100, progress: 33, started: true, completed: false, steps: [{ id: 's1', title: 'What is Carbon Offsetting?', description: 'Read the educational guide', completed: true }, { id: 's2', title: 'Calculate Your Footprint', description: 'Use the carbon calculator', completed: true }, { id: 's3', title: 'Make Your First Offset', description: 'Offset at least 1 ton of CO2', completed: false }] },
  { id: 'q2', title: 'Community Connector', description: 'Build your impact network by connecting with other changemakers', category: 'Social', difficulty: 'medium', duration: '1 week', xp: 300, progress: 0, started: false, completed: false, steps: [{ id: 's1', title: 'Join a Community Group', description: 'Find and join a local group', completed: false }, { id: 's2', title: 'Invite 3 Friends', description: 'Share your referral link', completed: false }, { id: 's3', title: 'Attend a Virtual Event', description: 'Join one community event', completed: false }, { id: 's4', title: 'Share Your Story', description: 'Post about your impact journey', completed: false }] },
  { id: 'q3', title: 'Climate Data Explorer', description: 'Dive deep into climate analytics and learn to interpret impact data', category: 'Education', difficulty: 'hard', duration: '2 hours', xp: 500, progress: 0, started: false, completed: false, steps: [{ id: 's1', title: 'Understanding Carbon Credits', description: 'Complete the carbon credits module', completed: false }, { id: 's2', title: 'Analyze Project Data', description: 'Review 5 project impact reports', completed: false }, { id: 's3', title: 'Create Your Impact Report', description: 'Generate and export your personal impact report', completed: false }] },
  { id: 'q4', title: 'Impact Investor Path', description: 'Learn sustainable investing principles and build a regenerative portfolio', category: 'Investment', difficulty: 'expert', duration: '2 weeks', xp: 1000, progress: 0, started: false, completed: false, steps: [{ id: 's1', title: 'Sustainable Investing 101', description: 'Complete the investment course', completed: false }, { id: 's2', title: 'Diversify Your Portfolio', description: 'Invest in 3 different project types', completed: false }, { id: 's3', title: 'Track Your Returns', description: 'Monitor your investments for 30 days', completed: false }, { id: 's4', title: 'Share Investment Strategy', description: 'Write about your approach', completed: false }] },
];

// Components
const AchievementBadge: React.FC<{ achievement: Achievement; index: number }> = ({ achievement, index }) => {
  const tierColors = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', platinum: '#e5e4e2' };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-4 rounded-xl bg-slate-800/50 border ${achievement.unlocked ? 'border-emerald-500/30' : 'border-slate-700/50 opacity-60'} ${achievement.unlocked ? '' : 'grayscale'}`}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
          style={{ background: achievement.unlocked ? `linear-gradient(135deg, ${tierColors[achievement.tier]}40, ${tierColors[achievement.tier]}20)` : 'transparent' }}
        >
          {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-slate-500" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{achievement.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs uppercase ${achievement.tier === 'legendary' ? 'bg-purple-500/20 text-purple-400' : `bg-[${tierColors[achievement.tier]}]20 text-[${tierColors[achievement.tier]}]`}`} style={{ color: achievement.tier === 'legendary' ? '#a855f7' : tierColors[achievement.tier] }}>
              {achievement.tier}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
          {achievement.unlocked ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-emerald-400">+{achievement.points} XP</span>
              <span className="text-xs text-slate-500">{achievement.rarity}</span>
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{achievement.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${achievement.progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry; index: number }> = ({ entry, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex items-center gap-4 p-4 rounded-xl ${entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30' : 'bg-slate-800/50 border border-slate-700/50'}`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${entry.rank <= 3 ? 'bg-yellow-500/20' : 'bg-slate-700'}`}>
      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
    </div>
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xl">
      {entry.avatar}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white">{entry.name}</span>
        {entry.streak >= 7 && <Flame className="w-4 h-4 text-orange-400" />}
        {entry.rank <= 3 && <Crown className="w-4 h-4 text-yellow-400" />}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span>{entry.badges} badges</span>
        <span>{entry.streak} day streak</span>
      </div>
    </div>
    <div className="text-right">
      <div className="text-xl font-bold text-white">{entry.score.toLocaleString()}</div>
      <div className={`text-sm ${entry.change > 0 ? 'text-emerald-400' : entry.change < 0 ? 'text-red-400' : 'text-slate-400'}`}>
        {entry.change > 0 ? '+' : ''}{entry.change} positions
      </div>
    </div>
  </motion.div>
);

const ChallengeCard: React.FC<{ challenge: TeamChallenge; index: number }> = ({ challenge, index }) => {
  const progress = Math.min(100, Math.round((challenge.current / challenge.goal) * 100));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {challenge.type === 'collective' && <Users className="w-5 h-5 text-blue-400" />}
            {challenge.type === 'competitive' && <Trophy className="w-5 h-5 text-amber-400" />}
            {challenge.type === 'collaborative' && <Heart className="w-5 h-5 text-pink-400" />}
            <span className="text-sm text-slate-400 uppercase">{challenge.type}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">{challenge.name}</h3>
          <p className="text-sm text-slate-400 mt-1">{challenge.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${challenge.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : challenge.status === 'completed' ? 'bg-blue-400/10 text-blue-400' : 'bg-slate-400/10 text-slate-400'}`}>
          {challenge.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Progress</span>
          <span className="text-white font-medium">{challenge.current.toLocaleString()} / {challenge.goal.toLocaleString()} {challenge.unit}</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {challenge.participants.toLocaleString()} participants</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {challenge.deadline}</span>
        </div>
      </div>

      {challenge.type === 'competitive' && (
        <div className="space-y-2 mb-4">
          {challenge.teams.map((team, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/30">
              <div className="text-sm font-medium text-white w-32 truncate">{team.name}</div>
              <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{ width: `${team.progress}%` }} />
              </div>
              <div className="text-xs text-slate-400 w-16 text-right">{team.progress}%</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-slate-300">{challenge.prize}</span>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-400 text-sm font-medium hover:bg-cyan-600/30 transition-colors">
          {challenge.status === 'active' ? 'Join Challenge' : challenge.status === 'completed' ? 'View Results' : 'Notify Me'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const QuestCard: React.FC<{ quest: Quest; index: number }> = ({ quest, index }) => {
  const difficultyColors = { easy: 'text-emerald-400 bg-emerald-400/10', medium: 'text-amber-400 bg-amber-400/10', hard: 'text-orange-400 bg-orange-400/10', expert: 'text-red-400 bg-red-400/10' };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{quest.title}</h3>
            <p className="text-sm text-slate-400">{quest.category}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[quest.difficulty]}`}>
          {quest.difficulty}
        </span>
      </div>

      <p className="text-sm text-slate-300 mb-4">{quest.description}</p>

      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quest.duration}</span>
        <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> {quest.xp} XP</span>
        <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {quest.steps.length} steps</span>
      </div>

      {quest.started && !quest.completed && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span>{quest.progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${quest.progress}%` }} />
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {quest.steps.slice(0, 3).map((step, i) => (
          <div key={step.id} className={`flex items-center gap-2 p-2 rounded-lg ${step.completed ? 'bg-emerald-400/10' : 'bg-slate-700/30'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.completed ? 'bg-emerald-400' : 'bg-slate-600'}`}>
              {step.completed ? <span className="text-xs">✓</span> : <span className="text-xs">{i + 1}</span>}
            </div>
            <span className={`text-sm ${step.completed ? 'text-emerald-400' : 'text-slate-300'}`}>{step.title}</span>
          </div>
        ))}
      </div>

      <button className={`w-full py-2 rounded-lg font-medium transition-colors ${quest.completed ? 'bg-emerald-400/10 text-emerald-400' : quest.started ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}>
        {quest.completed ? 'Completed ✓' : quest.started ? 'Continue Quest' : 'Start Quest'}
      </button>
    </motion.div>
  );
};

// Main Component
export default function GamificationHub() {
  const [activeTab, setActiveTab] = useState('achievements');
  const [userPoints] = useState(1250);
  const [userRank] = useState(15);
  const [userStreak] = useState(12);
  const [totalBadges] = useState(8);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-400" />
              Impact Challenges
            </h1>
            <p className="text-slate-400 mt-1">Earn badges, join challenges, and track your regenerative impact</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{userPoints.toLocaleString()}</div>
              <div className="text-xs text-slate-400">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">#{userRank}</div>
              <div className="text-xs text-slate-400">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{userStreak}</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{totalBadges}</div>
              <div className="text-xs text-slate-400">Badges</div>
            </div>
          </div>
        </div>

        {/* User Progress Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-emerald-500/30 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-3xl">
                🌍
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">EcoChampion_2024</h2>
                <p className="text-slate-400">Level 8 • Regenerative Pioneer</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-slate-300">{userStreak} day streak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Medal className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">8 badges earned</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Level 8</span>
                <span className="text-slate-400">Level 9</span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '65%' }}
                  animate={{ width: '65%' }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                />
              </div>
              <div className="text-center text-xs text-slate-400 mt-1">350 XP to next level</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'achievements', icon: Award, label: 'Achievements' },
            { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
            { id: 'challenges', icon: Target, label: 'Team Challenges' },
            { id: 'quests', icon: Rocket, label: 'Quests' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filter */}
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm">All</button>
                <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 text-sm hover:text-white">Unlocked</button>
                <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 text-sm hover:text-white">In Progress</button>
                <button className="px-4 py-2 rounded-lg bg-slate-800 text-slate-400 text-sm hover:text-white">Locked</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-sm text-slate-400">Unlocked</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">{achievements.filter(a => !a.unlocked).length}</div>
                  <div className="text-sm text-slate-400">In Progress</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-sm text-slate-400">Rare/Epic</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">3,150</div>
                  <div className="text-sm text-slate-400">XP Earned</div>
                </div>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Search players..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400" />
                </div>
                <select className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
                  <option>All Time</option>
                  <option>This Month</option>
                  <option>This Week</option>
                  <option>Today</option>
                </select>
                <select className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white">
                  <option>Global</option>
                  <option>Friends</option>
                  <option>Country</option>
                </select>
              </div>

              {/* User's Position Highlight */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xl">🌍</div>
                    <div>
                      <div className="font-semibold text-white">EcoChampion_2024</div>
                      <div className="text-sm text-slate-400">Level 8 • Regenerative Pioneer</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">#15</div>
                    <div className="text-xs text-slate-400">Your Position</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">1,250</div>
                    <div className="text-xs text-slate-400">Your XP</div>
                  </div>
                </div>
              </div>

              {/* Rankings */}
              <div className="space-y-3">
                {leaderboardData.map((entry, index) => (
                  <LeaderboardRow key={entry.userId} entry={entry} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Active Challenges */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Active Challenges</h3>
                <div className="grid grid-cols-2 gap-4">
                  {teamChallenges.filter(c => c.status === 'active').map((challenge, index) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                  ))}
                </div>
              </div>

              {/* Completed & Upcoming */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Completed</h3>
                  {teamChallenges.filter(c => c.status === 'completed').map((challenge, index) => (
                    <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                  ))}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Coming Soon</h3>
                  {teamChallenges.filter(c => c.status === 'upcoming').length === 0 && (
                    <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                      <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">New challenges coming soon!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quest Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">1</div>
                  <div className="text-sm text-slate-400">Active Quests</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-slate-400">Completed</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-sm text-slate-400">Available</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                  <div className="text-2xl font-bold text-white">1,900</div>
                  <div className="text-sm text-slate-400">Total XP Available</div>
                </div>
              </div>

              {/* Quests Grid */}
              <div className="grid grid-cols-2 gap-4">
                {quests.map((quest, index) => (
                  <QuestCard key={quest.id} quest={quest} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
