import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Globe, Users, ArrowUpRight, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { analytics } from '@/lib/analytics';

const EnhancedDashboard = () => {
  const { data, isConnected, lastUpdate } = useRealtimeSync();

  React.useEffect(() => {
    analytics.trackPageView('dashboard');
  }, []);

  const metrics = [
    {
      title: 'Carbon Credits',
      value: data.carbonCredits.toLocaleString(),
      change: '+12.5%',
      icon: <Leaf className="w-5 h-5" />,
      color: 'text-emerald-600'
    },
    {
      title: 'Active Projects',
      value: data.activeProjects.toLocaleString(),
      change: '+8.2%',
      icon: <Globe className="w-5 h-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Trading Volume',
      value: `$${(data.tradingVolume / 1000000).toFixed(1)}M`,
      change: '+15.7%',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Ecosystem Health',
      value: `${data.ecosystemHealth.toFixed(1)}%`,
      change: '+2.1%',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-2">
              Atlas Sanctum Dashboard
            </h1>
            <p className="text-slate-400">
              Real-time regenerative impact metrics
              {isConnected && (
                <span className="ml-2 inline-flex items-center gap-1 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Live
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Last updated</p>
            <p className="text-white font-medium">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-emerald-500/50 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">
                    {metric.title}
                  </CardTitle>
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="flex items-center text-sm">
                    <ArrowUpRight className="w-3 h-3 text-emerald-400 mr-1" />
                    <span className="text-emerald-400">{metric.change}</span>
                    <span className="text-slate-400 ml-1">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-slate-400">
                Common platform tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => analytics.trackEvent('quick_action', { action: 'marketplace' })}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Marketplace
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => analytics.trackEvent('quick_action', { action: 'projects' })}
              >
                <Globe className="w-4 h-4 mr-2" />
                Manage Projects
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => analytics.trackEvent('quick_action', { action: 'portfolio' })}
              >
                <Users className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Platform Status</CardTitle>
              <CardDescription className="text-slate-400">
                System health and connectivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Real-time Connection</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className={isConnected ? 'text-emerald-400' : 'text-red-400'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">API Status</span>
                  <span className="text-emerald-400">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Data Sync</span>
                  <span className="text-emerald-400">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;