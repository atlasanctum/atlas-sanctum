import React, { useState } from 'react';
import { Trophy, Award, Target, TrendingUp, Users, Zap } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  user: string;
  avatar: string;
  carbonOffset: number;
  level: number;
  badges: number;
  streak: number;
}

export function ImpactLeaderboards() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'alltime'>('month');
  const [category, setCategory] = useState<'carbon' | 'biodiversity' | 'community' | 'all'>('all');

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, user: 'EcoWarrior2024', avatar: '👑', carbonOffset: 25420, level: 12, badges: 45, streak: 127 },
    { rank: 2, user: 'GreenGuardian', avatar: '🌟', carbonOffset: 22150, level: 11, badges: 38, streak: 94 },
    { rank: 3, user: 'PlanetProtector', avatar: '🛡️', carbonOffset: 19870, level: 10, badges: 42, streak: 156 },
    { rank: 4, user: 'RegenRanger', avatar: '🌱', carbonOffset: 18340, level: 10, badges: 35, streak: 67 },
    { rank: 5, user: 'ImpactHero', avatar: '⚡', carbonOffset: 16890, level: 9, badges: 29, streak: 45 },
  ];

  const achievements = [
    { id: 1, name: 'Carbon Champion', description: 'Offset 10,000 tons', icon: '🏆', unlocked: true, progress: 100 },
    { id: 2, name: 'Tree Planter', description: 'Plant 1,000 trees', icon: '🌳', unlocked: true, progress: 100 },
    { id: 3, name: 'Ocean Defender', description: 'Support 10 marine projects', icon: '🌊', unlocked: false, progress: 70 },
    { id: 4, name: 'Community Leader', description: '100 volunteer hours', icon: '👥', unlocked: false, progress: 45 },
    { id: 5, name: 'Streak Master', description: '100 day streak', icon: '🔥', unlocked: true, progress: 100 },
    { id: 6, name: 'Impact Influencer', description: 'Refer 50 users', icon: '📢', unlocked: false, progress: 32 },
  ];

  const challenges = [
    {
      id: 1,
      name: 'February Carbon Sprint',
      description: 'Offset 500 tons this month',
      reward: '1000 points + Exclusive NFT',
      progress: 68,
      participants: 234,
      endsIn: '12 days',
    },
    {
      id: 2,
      name: 'Community Building',
      description: 'Recruit 10 new members',
      reward: '500 points + Badge',
      progress: 40,
      participants: 567,
      endsIn: '5 days',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
          Impact Leaderboards
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Compete, achieve, and celebrate regenerative impact
        </p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg p-4">
          <p className="text-xs opacity-80 mb-1">Your Rank</p>
          <p className="text-2xl">#127</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg p-4">
          <p className="text-xs opacity-80 mb-1">Level</p>
          <p className="text-2xl">8</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg p-4">
          <p className="text-xs opacity-80 mb-1">Badges</p>
          <p className="text-2xl">23</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg p-4">
          <p className="text-xs opacity-80 mb-1">Streak</p>
          <p className="text-2xl">🔥 42</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {['week', 'month', 'alltime'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-3 py-2 rounded-lg text-sm capitalize ${
                timeframe === tf
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tf === 'alltime' ? 'All Time' : `This ${tf}`}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'carbon', 'biodiversity', 'community'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat as any)}
              className={`px-3 py-2 rounded-lg text-sm capitalize ${
                category === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg">Top Contributors</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {leaderboard.map((entry) => (
            <div key={entry.rank} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl ${
                  entry.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' :
                  entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                  entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {entry.rank <= 3 ? entry.avatar : `#${entry.rank}`}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm">{entry.user}</h4>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      Lv {entry.level}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      {entry.carbonOffset.toLocaleString()} tons
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" />
                      {entry.badges} badges
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-orange-600" />
                      {entry.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Your Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`text-center p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-amber-50 border-amber-300 hover:shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h4 className="text-xs mb-1">{achievement.name}</h4>
              <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
              {!achievement.unlocked && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{achievement.progress}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Active Challenges
        </h3>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm mb-1">{challenge.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
                  <p className="text-xs text-emerald-600">🎁 {challenge.reward}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs whitespace-nowrap">
                  {challenge.endsIn}
                </span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {challenge.participants} participants
                </span>
                <button className="text-blue-600 hover:text-blue-700">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
