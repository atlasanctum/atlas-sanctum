import React from 'react';
import { Wallet, TrendingUp, DollarSign, PieChart, ArrowUpRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const portfolioPerformance = [
  { month: 'Jan', value: 8200000, refi: 3400000, defi: 4800000 },
  { month: 'Feb', value: 8900000, refi: 3800000, defi: 5100000 },
  { month: 'Mar', value: 9600000, refi: 4300000, defi: 5300000 },
  { month: 'Apr', value: 10500000, refi: 4900000, defi: 5600000 },
  { month: 'May', value: 11200000, refi: 5400000, defi: 5800000 },
  { month: 'Jun', value: 12400000, refi: 6100000, defi: 6300000 },
];

const assetAllocation = [
  { name: 'Carbon Credits', value: 35, amount: 4340000, color: '#10b981' },
  { name: 'Biodiversity Tokens', value: 22, amount: 2728000, color: '#3b82f6' },
  { name: 'Ocean Restoration', value: 18, amount: 2232000, color: '#06b6d4' },
  { name: 'Cultural Heritage', value: 12, amount: 1488000, color: '#8b5cf6' },
  { name: 'Community Health', value: 13, amount: 1612000, color: '#f59e0b' },
];

const recentAllocations = [
  {
    asset: 'Amazon Rainforest Carbon Credits',
    type: 'Carbon',
    amount: '$125,000',
    impact: '+2,500 tCO2',
    roi: '+18.4%',
    date: '2 days ago',
    trend: 'up',
  },
  {
    asset: 'Pacific Ocean Restoration Bonds',
    type: 'Ocean',
    amount: '$87,500',
    impact: '+340 km² protected',
    roi: '+14.2%',
    date: '4 days ago',
    trend: 'up',
  },
  {
    asset: 'Biodiversity Conservation Credits',
    type: 'Bio',
    amount: '$62,000',
    impact: '+45 species',
    roi: '+21.7%',
    date: '6 days ago',
    trend: 'up',
  },
  {
    asset: 'Community Health Impact Fund',
    type: 'Health',
    amount: '$94,000',
    impact: '1,200 lives improved',
    roi: '+12.3%',
    date: '8 days ago',
    trend: 'up',
  },
];

const liquidityPools = [
  {
    name: 'ReFi Alpha Pool',
    tvl: '$8.4M',
    apr: '12.4%',
    impact: 'Carbon + Biodiversity',
    participants: 1247,
  },
  {
    name: 'Ocean Guardian Pool',
    tvl: '$5.2M',
    apr: '10.8%',
    impact: 'Ocean Restoration',
    participants: 892,
  },
  {
    name: 'Community Impact Pool',
    tvl: '$3.7M',
    apr: '14.2%',
    impact: 'Health + Education',
    participants: 634,
  },
];

export function ReFiConsole() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <Wallet className="w-8 h-8 text-emerald-600" />
          Regenerative Finance Console
        </h1>
        <p className="text-gray-600">
          Manage DeFi liquidity, token issuance, and circular regenerative investments
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Portfolio Value</p>
          <p className="text-3xl">$12.4M</p>
          <p className="text-xs mt-2 opacity-75">+18.2% this month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">+12.8%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">ReFi Assets</p>
          <p className="text-3xl">$6.1M</p>
          <p className="text-xs mt-2 opacity-75">49% of portfolio</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Liquidity Pools</p>
          <p className="text-3xl">$17.3M</p>
          <p className="text-xs mt-2 opacity-75">Total Value Locked</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <PieChart className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">+14.2%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Avg APR</p>
          <p className="text-3xl">12.5%</p>
          <p className="text-xs mt-2 opacity-75">Impact-weighted returns</p>
        </div>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance & Allocation Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={portfolioPerformance}>
              <defs>
                <linearGradient id="totalValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value: number) => `$${(value / 1000000).toFixed(2)}M`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#totalValue)"
                name="Total Value"
              />
              <Line
                type="monotone"
                dataKey="refi"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                name="ReFi Assets"
              />
              <Line
                type="monotone"
                dataKey="defi"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6' }}
                name="DeFi Assets"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Asset Allocation & Recent Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string, props: any) => [
                  `$${(props.payload.amount / 1000000).toFixed(2)}M (${value}%)`,
                  name
                ]} />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impact ROI Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Impact ROI Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assetAllocation.map((asset, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    ></div>
                    <div>
                      <p className="text-sm">{asset.name}</p>
                      <p className="text-xs text-gray-500">
                        ${(asset.amount / 1000000).toFixed(2)}M
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{asset.value}%</p>
                    <p className="text-xs text-emerald-600">+{(asset.value * 0.4).toFixed(1)}% ROI</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Allocations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Regenerative Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Asset</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Impact</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">ROI</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAllocations.map((allocation, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{allocation.asset}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {allocation.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right">{allocation.amount}</td>
                    <td className="py-3 px-4 text-sm text-emerald-600">{allocation.impact}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                        <ArrowUpRight className="w-3 h-3" />
                        {allocation.roi}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-500">{allocation.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Pools */}
      <Card>
        <CardHeader>
          <CardTitle>Active Liquidity Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liquidityPools.map((pool, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <h4 className="text-sm mb-3">{pool.name}</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">TVL</span>
                    <span>{pool.tvl}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">APR</span>
                    <span className="text-emerald-600">{pool.apr}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Participants</span>
                    <span>{pool.participants}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Impact Focus</p>
                  <p className="text-xs text-purple-600">{pool.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
