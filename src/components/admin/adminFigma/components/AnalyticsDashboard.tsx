import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Activity, Download, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const metrics = [
    {
      label: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'purple',
    },
    {
      label: 'Active Sessions',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: Activity,
      color: 'blue',
    },
    {
      label: 'Total Transactions',
      value: '45,678',
      change: '+23.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      label: 'Carbon Offset (tons)',
      value: '12,456',
      change: '-2.4%',
      trend: 'down',
      icon: BarChart3,
      color: 'amber',
    },
  ];

  const topPages = [
    { page: '/dashboard', views: 12847, uniqueVisitors: 8234, avgTime: '3m 42s' },
    { page: '/ai-console', views: 9632, uniqueVisitors: 6421, avgTime: '5m 18s' },
    { page: '/blockchain', views: 7845, uniqueVisitors: 5123, avgTime: '4m 32s' },
    { page: '/governance', views: 6234, uniqueVisitors: 4567, avgTime: '6m 12s' },
    { page: '/finance', views: 5123, uniqueVisitors: 3892, avgTime: '4m 45s' },
  ];

  const userActivity = [
    { time: '00:00', users: 234 },
    { time: '04:00', users: 156 },
    { time: '08:00', users: 567 },
    { time: '12:00', users: 892 },
    { time: '16:00', users: 1234 },
    { time: '20:00', users: 789 },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: 'bg-purple-100 text-purple-700',
      blue: 'bg-blue-100 text-blue-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      amber: 'bg-amber-100 text-amber-700',
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              Analytics Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Platform usage metrics and performance insights
            </p>
          </div>
          
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${getColorClasses(metric.color)} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs ${
                  metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* User Activity Chart */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">User Activity Over Time</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Hourly breakdown</span>
          </div>
        </div>
        
        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4">
          {userActivity.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-purple-100 rounded-t-lg relative group">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:from-purple-700 hover:to-purple-500"
                  style={{ height: `${(data.users / 1400) * 100}%`, minHeight: '4px' }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.users} users
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600">{data.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg">Top Pages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600">Page</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600">Views</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600 hidden sm:table-cell">Unique</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs text-gray-600 hidden md:table-cell">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3">
                      <code className="text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded">{page.page}</code>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-sm">{page.views.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3 text-sm hidden sm:table-cell text-gray-600">{page.uniqueVisitors.toLocaleString()}</td>
                    <td className="px-4 sm:px-6 py-3 text-sm hidden md:table-cell text-gray-600">{page.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Direct</span>
                <span className="text-sm">45%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Organic Search</span>
                <span className="text-sm">32%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Social Media</span>
                <span className="text-sm">15%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Referral</span>
                <span className="text-sm">8%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm mb-3">Device Breakdown</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl mb-1">62%</p>
                <p className="text-xs text-gray-600">Desktop</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">28%</p>
                <p className="text-xs text-gray-600">Mobile</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">10%</p>
                <p className="text-xs text-gray-600">Tablet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Top Locations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { country: 'United States', users: 1234, percentage: 43 },
            { country: 'United Kingdom', users: 567, percentage: 20 },
            { country: 'Germany', users: 432, percentage: 15 },
            { country: 'Japan', users: 321, percentage: 11 },
          ].map((location, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm mb-2">{location.country}</p>
              <p className="text-2xl mb-2">{location.users.toLocaleString()}</p>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${location.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
