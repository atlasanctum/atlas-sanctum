import React from 'react';
import { Brain, CheckCircle, AlertTriangle, Activity, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ethicalMetrics = [
  { time: '00:00', alignment: 88, transparency: 91, fairness: 86 },
  { time: '04:00', alignment: 89, transparency: 90, fairness: 87 },
  { time: '08:00', alignment: 91, transparency: 92, fairness: 89 },
  { time: '12:00', alignment: 90, transparency: 93, fairness: 88 },
  { time: '16:00', alignment: 92, transparency: 91, fairness: 90 },
  { time: '20:00', alignment: 91, transparency: 94, fairness: 89 },
];

const aiModels = [
  {
    id: 'M-001',
    name: 'Predictive Carbon Optimizer',
    status: 'active',
    accuracy: 94.2,
    ethicalScore: 88,
    lastUpdate: '2 min ago',
    decisions: '14.2K',
  },
  {
    id: 'M-002',
    name: 'Biodiversity Impact Analyzer',
    status: 'active',
    accuracy: 91.7,
    ethicalScore: 92,
    lastUpdate: '5 min ago',
    decisions: '9.8K',
  },
  {
    id: 'M-003',
    name: 'Regenerative Finance Allocator',
    status: 'active',
    accuracy: 89.3,
    ethicalScore: 85,
    lastUpdate: '1 min ago',
    decisions: '18.6K',
  },
  {
    id: 'M-004',
    name: 'Moral Ontology Validator',
    status: 'active',
    accuracy: 96.1,
    ethicalScore: 95,
    lastUpdate: '3 min ago',
    decisions: '6.4K',
  },
  {
    id: 'M-005',
    name: 'Ocean Health Predictor',
    status: 'monitoring',
    accuracy: 88.9,
    ethicalScore: 87,
    lastUpdate: '12 min ago',
    decisions: '5.1K',
  },
  {
    id: 'M-006',
    name: 'Social Impact Synthesizer',
    status: 'active',
    accuracy: 90.4,
    ethicalScore: 91,
    lastUpdate: '4 min ago',
    decisions: '11.3K',
  },
];

const recentDecisions = [
  {
    model: 'Predictive Carbon Optimizer',
    decision: 'Allocated $45K to forest restoration in Amazon basin',
    confidence: 94,
    impact: 'High positive',
    timestamp: '2 minutes ago',
  },
  {
    model: 'Regenerative Finance Allocator',
    decision: 'Rebalanced portfolio toward ocean carbon credits',
    confidence: 89,
    impact: 'Medium positive',
    timestamp: '8 minutes ago',
  },
  {
    model: 'Moral Ontology Validator',
    decision: 'Approved ethical framework update for community health',
    confidence: 96,
    impact: 'High positive',
    timestamp: '15 minutes ago',
  },
];

export function AIConsole() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          Moral AI Console
        </h1>
        <p className="text-gray-600">
          Configure moral ontologies, monitor ethical alignment, and oversee AI governance protocols
        </p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-700">Active Models</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl text-emerald-900">12</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">Avg Ethical Score</span>
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl text-blue-900">89.7%</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700">Decisions Today</span>
            <CheckCircle className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl text-purple-900">65.4K</p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-700">Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl text-amber-900">3</p>
        </div>
      </div>

      {/* Ethical Metrics Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Ethical Alignment Metrics (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ethicalMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[80, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="alignment"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Moral Alignment"
              dot={{ fill: '#8b5cf6' }}
            />
            <Line
              type="monotone"
              dataKey="transparency"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Transparency"
              dot={{ fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="fairness"
              stroke="#10b981"
              strokeWidth={2}
              name="Fairness"
              dot={{ fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Models Grid */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">AI Model Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm text-gray-600">Model ID</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Accuracy</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Ethical Score</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Decisions</th>
                <th className="text-right py-3 px-4 text-sm text-gray-600">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {aiModels.map((model) => (
                <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{model.id}</td>
                  <td className="py-3 px-4 text-sm">{model.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        model.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          model.status === 'active' ? 'bg-emerald-600' : 'bg-amber-600'
                        }`}
                      ></span>
                      {model.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right">{model.accuracy}%</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs ${
                        model.ethicalScore >= 90
                          ? 'bg-emerald-100 text-emerald-700'
                          : model.ethicalScore >= 85
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {model.ethicalScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">{model.decisions}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-500">{model.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent AI Decisions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Recent AI Decisions & Explanations</h3>
        <div className="space-y-4">
          {recentDecisions.map((decision, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-purple-600 mb-1">{decision.model}</p>
                  <p className="text-sm mb-2">{decision.decision}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Confidence: {decision.confidence}%</span>
                    <span className="text-emerald-600">• {decision.impact}</span>
                    <span>{decision.timestamp}</span>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
