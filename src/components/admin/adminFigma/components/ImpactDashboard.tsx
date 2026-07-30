import React from 'react';
import { Leaf, Droplet, Heart, TreePine, TrendingUp } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { ImpactGlobe } from './ImpactGlobe';

const impactMetrics = [
  { month: 'Jan', carbon: 4200, soil: 3100, ocean: 2800, health: 3600, investment: 280000 },
  { month: 'Feb', carbon: 4800, soil: 3400, ocean: 3100, health: 3900, investment: 320000 },
  { month: 'Mar', carbon: 5400, soil: 3900, ocean: 3500, health: 4300, investment: 380000 },
  { month: 'Apr', carbon: 6100, soil: 4500, ocean: 4000, health: 4800, investment: 450000 },
  { month: 'May', carbon: 6800, soil: 5200, ocean: 4600, health: 5400, investment: 520000 },
  { month: 'Jun', carbon: 7600, soil: 5900, ocean: 5300, health: 6100, investment: 610000 },
];

const planetaryHealth = [
  { category: 'Carbon Offset', value: 84, fill: '#10b981' },
  { category: 'Biodiversity', value: 76, fill: '#3b82f6' },
  { category: 'Ocean Health', value: 71, fill: '#06b6d4' },
  { category: 'Soil Regeneration', value: 79, fill: '#8b5cf6' },
  { category: 'Human Health', value: 82, fill: '#f59e0b' },
];

const ecosystemProjects = [
  {
    name: 'Amazon Rainforest Restoration',
    location: 'Brazil',
    area: '2,400 hectares',
    carbon: '48,000 tCO2/year',
    biodiversity: '+340 species',
    status: 'Active',
    funding: '$1.2M',
  },
  {
    name: 'Great Barrier Reef Protection',
    location: 'Australia',
    area: '850 km²',
    carbon: '12,000 tCO2/year',
    biodiversity: '+120 marine species',
    status: 'Active',
    funding: '$890K',
  },
  {
    name: 'African Savanna Conservation',
    location: 'Kenya',
    area: '3,200 hectares',
    carbon: '32,000 tCO2/year',
    biodiversity: '+280 species',
    status: 'Active',
    funding: '$1.5M',
  },
  {
    name: 'Coastal Wetland Regeneration',
    location: 'Vietnam',
    area: '1,800 hectares',
    carbon: '28,000 tCO2/year',
    biodiversity: '+190 species',
    status: 'Monitoring',
    funding: '$650K',
  },
];

export function ImpactDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-600" />
          Impact Intelligence Dashboard
        </h1>
        <p className="text-gray-600">
          AI/IoT data visualization for planetary regeneration indicators
        </p>
      </div>

      {/* Impact Globe - New */}
      <ImpactGlobe />

      {/* Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Leaf className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">+15.2%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Carbon Offset</p>
          <p className="text-3xl">847K tons</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TreePine className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">+12.8%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Biodiversity Index</p>
          <p className="text-3xl">76.4</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Droplet className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">+8.9%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Ocean Restoration</p>
          <p className="text-3xl">5,300 km²</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8" />
            <span className="text-sm bg-white/20 px-2 py-1 rounded">+10.3%</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Health Improvement</p>
          <p className="text-3xl">6,100 lives</p>
        </div>
      </div>

      {/* Main Impact Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Regenerative Impact vs Investment Flow</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={impactMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="carbon" fill="#10b981" name="Carbon (tons)" />
            <Bar yAxisId="left" dataKey="soil" fill="#8b5cf6" name="Soil Regen (hectares)" />
            <Bar yAxisId="left" dataKey="ocean" fill="#06b6d4" name="Ocean (km²)" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="investment"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Investment (USD)"
              dot={{ fill: '#f59e0b', r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Planetary Health Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Planetary Health Indicators</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="90%"
              data={planetaryHealth}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                background
                dataKey="value"
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* ROI Calculator */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Return on Regeneration (RoR)</h3>
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <p className="text-sm text-emerald-700 mb-1">Capital to Carbon Efficiency</p>
              <p className="text-2xl text-emerald-900">1.39 tCO2/$1K</p>
              <p className="text-xs text-emerald-600 mt-1">12% improvement this quarter</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-700 mb-1">Ecological Gain per Trade</p>
              <p className="text-2xl text-blue-900">+2.4%</p>
              <p className="text-xs text-blue-600 mt-1">Net positive impact ratio</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-700 mb-1">Regenerative Impact Index (RII)</p>
              <p className="text-2xl text-purple-900">87.4</p>
              <p className="text-xs text-purple-600 mt-1">Composite health score</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-sm text-amber-700 mb-1">Community Benefit Score</p>
              <p className="text-2xl text-amber-900">92.1</p>
              <p className="text-xs text-amber-600 mt-1">Social impact measurement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Ecosystem Projects */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Active Ecosystem Projects</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Project Name</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Location</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Area</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Carbon Impact</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Biodiversity</th>
                <th className="text-center py-3 px-4 text-sm text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Funding</th>
              </tr>
            </thead>
            <tbody>
              {ecosystemProjects.map((project, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{project.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{project.location}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{project.area}</td>
                  <td className="py-3 px-4 text-sm text-right text-emerald-600">{project.carbon}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{project.biodiversity}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs ${
                        project.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right">{project.funding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}