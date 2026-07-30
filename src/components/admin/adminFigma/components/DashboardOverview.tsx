import React from 'react';
import { StatCard } from './StatCard';
import {
  Globe,
  Brain,
  Leaf,
  Coins,
  Activity,
  TrendingUp,
  Database,
  Users
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { SystemNetworkGraph } from './SystemNetworkGraph';
import { AIReasoningTree } from './AIReasoningTree';
import { CommandCenter } from './CommandCenter';
import { RealTimeEventStream } from './RealTimeEventStream';
import { QuickActions } from './QuickActions';

const impactData = [
  { month: 'Jan', carbon: 4200, biodiversity: 3100, ocean: 2800, health: 3600 },
  { month: 'Feb', carbon: 4800, biodiversity: 3400, ocean: 3100, health: 3900 },
  { month: 'Mar', carbon: 5400, biodiversity: 3900, ocean: 3500, health: 4300 },
  { month: 'Apr', carbon: 6100, biodiversity: 4500, ocean: 4000, health: 4800 },
  { month: 'May', carbon: 6800, biodiversity: 5200, ocean: 4600, health: 5400 },
  { month: 'Jun', carbon: 7600, biodiversity: 5900, ocean: 5300, health: 6100 },
];

const aiModelData = [
  { name: 'Predictive Accuracy', value: 94 },
  { name: 'Ethical Alignment', value: 88 },
  { name: 'Transparency', value: 91 },
  { name: 'Regenerative Impact', value: 86 },
  { name: 'Resource Efficiency', value: 89 },
];

const blockchainActivity = [
  { time: '00:00', transactions: 145, value: 28000 },
  { time: '04:00', transactions: 98, value: 19500 },
  { time: '08:00', transactions: 234, value: 45200 },
  { time: '12:00', transactions: 312, value: 62100 },
  { time: '16:00', transactions: 278, value: 53800 },
  { time: '20:00', transactions: 189, value: 36400 },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Regenerative Systems Map</h1>
        <p className="text-gray-600">
          Real-time intelligence across planetary-scale regeneration systems
        </p>
      </div>

      {/* System Network Graph - New */}
      <SystemNetworkGraph />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active AI Models"
          value="12"
          change={8.3}
          trend="up"
          subtitle="models running"
          icon={<Brain className="w-6 h-6" />}
        />
        <StatCard
          title="Carbon Offset (tons)"
          value="847K"
          change={15.2}
          trend="up"
          subtitle="this month"
          icon={<Leaf className="w-6 h-6" />}
        />
        <StatCard
          title="ReFi Pool Value"
          value="$12.4M"
          change={12.8}
          trend="up"
          subtitle="Total Value Locked"
          icon={<Coins className="w-6 h-6" />}
        />
        <StatCard
          title="Network Nodes"
          value="2,847"
          change={5.4}
          trend="up"
          subtitle="global reach"
          icon={<Globe className="w-6 h-6" />}
        />
      </div>

      {/* Command Center & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommandCenter />
        <RealTimeEventStream />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regenerative Impact Trends */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Regenerative Impact Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={impactData}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="carbon"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorCarbon)"
                name="Carbon Credits"
              />
              <Area
                type="monotone"
                dataKey="biodiversity"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorBio)"
                name="Biodiversity"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Model Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Model Performance Matrix
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={aiModelData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Reasoning Tree */}
      <AIReasoningTree />

      {/* Blockchain Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Blockchain Settlement Activity (24h)
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">Value (USD)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={blockchainActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="transactions" fill="#3b82f6" name="Transactions" />
            <Bar yAxisId="right" dataKey="value" fill="#10b981" name="Value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* System Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-emerald-900">Active Strategies</h4>
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl text-emerald-900 mb-2">8</p>
          <p className="text-sm text-emerald-700">AI-driven regenerative allocation</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-blue-900">DAO Proposals</h4>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl text-blue-900 mb-2">23</p>
          <p className="text-sm text-blue-700">Active governance decisions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-purple-900">Regeneration Index</h4>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl text-purple-900 mb-2">87.4</p>
          <p className="text-sm text-purple-700">+12.3% from last month</p>
        </div>
      </div>
    </div>
  );
}