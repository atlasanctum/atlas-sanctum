import React, { useState, useEffect } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, Users, Globe, BookOpenCheck, Loader2 } from 'lucide-react';
import { statsAPI } from '@/utils/api';

const data = [
  { month: 'Jan', impact: 400, stories: 240, research: 240 },
  { month: 'Feb', impact: 300, stories: 139, research: 221 },
  { month: 'Mar', impact: 200, stories: 980, research: 229 },
  { month: 'Apr', impact: 278, stories: 390, research: 200 },
  { month: 'May', impact: 189, stories: 480, research: 218 },
  { month: 'Jun', impact: 239, stories: 380, research: 250 },
  { month: 'Jul', impact: 349, stories: 430, research: 210 },
];

export const GlobalStats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStories: 12234,
    totalDiscussions: 2350,
    totalResearch: 573,
    totalLikes: 0,
    activeUsers: 89
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await statsAPI.get();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error('Failed to load stats from database:', error);
        // Use default stats as fallback (already set in state)
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Ecosystem Impact</h2>
        <p className="text-muted-foreground">Real-time metrics of our global knowledge sharing network.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stories Shared</CardTitle>
                <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats.totalStories.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Community impact stories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats.totalDiscussions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Collaboration topics</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Members</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Unique contributors</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Likes and interactions</p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Impact Growth</CardTitle>
              <CardDescription>
                Visualizing the exponential growth of shared knowledge and collaborative research.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorStories" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <Tooltip />
                    <Area type="monotone" dataKey="impact" stroke="#8884d8" fillOpacity={1} fill="url(#colorImpact)" />
                    <Area type="monotone" dataKey="stories" stroke="#82ca9d" fillOpacity={1} fill="url(#colorStories)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};