// @ts-nocheck
/**
 * ImpactDashboard Page
 * Visualizes user's environmental impact across all investments
 */

import { useState, useEffect } from 'react';
import { useInvestments } from '../hooks/useInvestments';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Leaf, Droplets, Wind, Users, TrendingUp, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Color palette
const COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  tertiary: '#8b5cf6',
  quaternary: '#f59e0b',
  quinary: '#ef4444',
  senary: '#06b6d4',
};

const IMPACT_COLORS = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary];

export default function ImpactDashboard() {
  const { portfolioSummary, portfolioItems, portfolioActivity, refreshPortfolio } = useInvestments();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refreshPortfolio();
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Mock data for charts
  const impactTrendData = [
    { date: '2024-01', carbonOffset: 120, biodiversity: 75, water: 45 },
    { date: '2024-02', carbonOffset: 145, biodiversity: 78, water: 52 },
    { date: '2024-03', carbonOffset: 180, biodiversity: 82, water: 58 },
    { date: '2024-04', carbonOffset: 220, biodiversity: 85, water: 65 },
    { date: '2024-05', carbonOffset: 280, biodiversity: 88, water: 72 },
    { date: '2024-06', carbonOffset: 350, biodiversity: 90, water: 80 },
  ];

  const projectBreakdown = [
    { name: 'Amazon Rainforest', value: 45, color: COLORS.primary },
    { name: 'Coral Restoration', value: 25, color: COLORS.secondary },
    { name: 'Mangrove Conservation', value: 15, color: COLORS.tertiary },
    { name: 'Soil Carbon', value: 15, color: COLORS.quaternary },
  ];

  const metrics = [
    {
      label: 'Total Carbon Offset',
      value: portfolioSummary?.totalCO2Offset?.toLocaleString() || '1,250',
      unit: 'tons CO₂',
      change: '+15%',
      trend: 'up',
      icon: Leaf,
      color: 'emerald',
    },
    {
      label: 'Water Conserved',
      value: '45,000',
      unit: 'liters',
      change: '+8%',
      trend: 'up',
      icon: Droplets,
      color: 'blue',
    },
    {
      label: 'Species Protected',
      value: '156',
      unit: 'species',
      change: '+12%',
      trend: 'up',
      icon: Wind,
      color: 'purple',
    },
    {
      label: 'Communities Supported',
      value: '23',
      unit: 'communities',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'amber',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Impact Dashboard</h1>
            <p className="text-slate-600 mt-2">
              Track your environmental contribution across all investments
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Impact Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${metric.color}-100 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                <p className="text-sm text-slate-500">{metric.unit}</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Impact Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Impact Over Time</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">Carbon</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-slate-600">Biodiversity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm text-slate-600">Water</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={impactTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line type="monotone" dataKey="carbonOffset" stroke={COLORS.primary} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="biodiversity" stroke={COLORS.secondary} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="water" stroke={COLORS.tertiary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Project Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Impact by Project</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Portfolio Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Project</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Credits Owned</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Avg Cost</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Current Value</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">P/L</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Impact Score</th>
                </tr>
              </thead>
              <tbody>
                {(portfolioItems.length > 0 ? portfolioItems : [
                  { projectId: '1', projectName: 'Amazon Rainforest Protection', projectType: 'reforestation', creditsOwned: 250, averageCost: 20, currentValue: 3250, profitLoss: 750, profitLossPercent: 30, impactScore: 95, status: 'active' },
                  { projectId: '2', projectName: 'Coral Reef Restoration', projectType: 'ocean_restoration', creditsOwned: 100, averageCost: 25, currentValue: 2750, profitLoss: 250, profitLossPercent: 10, impactScore: 88, status: 'active' },
                  { projectId: '3', projectName: 'Mangrove Conservation', projectType: 'ocean_restoration', creditsOwned: 150, averageCost: 22, currentValue: 3600, profitLoss: 300, profitLossPercent: 9, impactScore: 85, status: 'active' },
                  { projectId: '4', projectName: 'Soil Carbon Initiative', projectType: 'soil_carbon', creditsOwned: 200, averageCost: 18, currentValue: 4000, profitLoss: 400, profitLossPercent: 11, impactScore: 82, status: 'active' },
                ]).map((item) => (
                  <tr key={item.projectId} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mr-3">
                          <Leaf className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.projectName}</p>
                          <p className="text-xs text-slate-500 capitalize">{item.projectType.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-slate-700">{item.creditsOwned}</td>
                    <td className="text-right py-3 px-4 text-slate-700">${item.averageCost}</td>
                    <td className="text-right py-3 px-4 font-medium text-slate-900">${item.currentValue.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">
                      <div className={`font-medium ${item.profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.profitLoss >= 0 ? '+' : ''}{item.profitLossPercent}%
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">
                      <div className="flex items-center justify-end">
                        <div className="w-24 h-2 bg-slate-200 rounded-full mr-2">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${item.impactScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.impactScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Impact Activity</h2>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {(portfolioActivity.length > 0 ? portfolioActivity : [
              { id: '1', type: 'purchase', projectName: 'Amazon Rainforest Protection', description: 'Purchased 50 carbon credits', credits: 50, amount: 1000, timestamp: new Date(Date.now() - 86400000).toISOString() },
              { id: '2', type: 'impact_update', projectName: 'Coral Reef Restoration', description: 'Impact milestone: 1000 corals planted', timestamp: new Date(Date.now() - 172800000).toISOString() },
              { id: '3', type: 'retirement', projectName: 'Mangrove Conservation', description: 'Retired 25 credits for carbon neutrality', credits: 25, amount: 500, timestamp: new Date(Date.now() - 259200000).toISOString() },
              { id: '4', type: 'impact_update', projectName: 'Soil Carbon Initiative', description: 'Monthly impact report available', timestamp: new Date(Date.now() - 432000000).toISOString() },
            ]).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    activity.type === 'purchase' ? 'bg-emerald-100' :
                    activity.type === 'retirement' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'purchase' && <TrendingUp className="w-5 h-5 text-emerald-600" />}
                    {activity.type === 'retirement' && <Award className="w-5 h-5 text-amber-600" />}
                    {activity.type === 'impact_update' && <Leaf className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{activity.description}</p>
                    <p className="text-sm text-slate-500">{activity.projectName}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.credits && (
                    <p className="font-medium text-slate-900">{activity.credits} credits</p>
                  )}
                  <p className="text-sm text-slate-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <Award className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Carbon Neutral</h3>
            <p className="text-emerald-100">
              You've offset 1,250 tons of CO₂ - equivalent to planting 20,000 trees!
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <Leaf className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Regenerator</h3>
            <p className="text-blue-100">
              Supporting 4 active regenerative projects across 3 continents.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <TrendingUp className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Growing Impact</h3>
            <p className="text-purple-100">
              Your portfolio value has grown 15% since initial investment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
