import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { ArrowUpRight, BookOpen, Users, Star, Clock } from 'lucide-react';

const personalData = [
  { day: 'Mon', views: 12 },
  { day: 'Tue', views: 18 },
  { day: 'Wed', views: 24 },
  { day: 'Thu', views: 15 },
  { day: 'Fri', views: 32 },
  { day: 'Sat', views: 45 },
  { day: 'Sun', views: 50 },
];

export const DashboardOverview = () => {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impact Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stories Contributed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Citations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12 since last update</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 project due soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Impact Activity</CardTitle>
            <CardDescription>
                Your content engagement over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={personalData}>
                    <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              You made 24 actions this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-4">
                    RP
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Published Research Paper</p>
                  <p className="text-xs text-muted-foreground">
                    "AI in Agriculture" • 2 hours ago
                  </p>
                </div>
                <div className="ml-auto font-medium text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> Published
                </div>
              </div>
              <div className="flex items-center">
                 <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold mr-4">
                    CO
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Commented on "Ocean Clean"</p>
                  <p className="text-xs text-muted-foreground">
                    Project Discussion • 5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                 <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mr-4">
                    ST
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Drafted New Story</p>
                  <p className="text-xs text-muted-foreground">
                    "The Last Weaver" • Yesterday
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
