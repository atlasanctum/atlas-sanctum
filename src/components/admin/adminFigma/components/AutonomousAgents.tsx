import React, { useState } from 'react';
import { Brain, Zap, AlertCircle, CheckCircle, Clock, Settings } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'idle' | 'learning' | 'optimizing';
  tasksCompleted: number;
  efficiency: number;
  lastAction: string;
  autonomyLevel: number;
}

interface AutoAction {
  id: string;
  agent: string;
  action: string;
  impact: string;
  timestamp: Date;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
  confidence: number;
}

export function AutonomousAgents() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Carbon Optimizer',
      domain: 'carbon',
      status: 'optimizing',
      tasksCompleted: 234,
      efficiency: 94,
      lastAction: 'Reallocated $50K to high-impact reforestation',
      autonomyLevel: 85,
    },
    {
      id: '2',
      name: 'Resource Allocator',
      domain: 'finance',
      status: 'active',
      tasksCompleted: 156,
      efficiency: 89,
      lastAction: 'Detected budget inefficiency in ocean restoration',
      autonomyLevel: 75,
    },
    {
      id: '3',
      name: 'System Health Monitor',
      domain: 'infrastructure',
      status: 'active',
      tasksCompleted: 892,
      efficiency: 98,
      lastAction: 'Auto-scaled database resources during peak load',
      autonomyLevel: 95,
    },
    {
      id: '4',
      name: 'Community Engagement AI',
      domain: 'community',
      status: 'learning',
      tasksCompleted: 67,
      efficiency: 82,
      lastAction: 'Identified 12 at-risk community members',
      autonomyLevel: 60,
    },
  ]);

  const [recentActions, setRecentActions] = useState<AutoAction[]>([
    {
      id: '1',
      agent: 'Carbon Optimizer',
      action: 'Shift 15% budget to coastal zones',
      impact: '+$75K annual carbon offset',
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'executed',
      confidence: 92,
    },
    {
      id: '2',
      agent: 'Resource Allocator',
      action: 'Pause low-performing project #A45',
      impact: 'Save $30K/month, reallocate to better ROI',
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'pending',
      confidence: 87,
    },
    {
      id: '3',
      agent: 'System Health Monitor',
      action: 'Increase API rate limits for partners',
      impact: 'Improve partner satisfaction, +20% throughput',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'approved',
      confidence: 95,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'optimizing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'learning':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'idle':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'executed':
        return 'bg-emerald-100 text-emerald-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const approveAction = (actionId: string) => {
    setRecentActions(actions =>
      actions.map(a => a.id === actionId ? { ...a, status: 'executed' as const } : a)
    );
  };

  const rejectAction = (actionId: string) => {
    setRecentActions(actions =>
      actions.map(a => a.id === actionId ? { ...a, status: 'rejected' as const } : a)
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          Autonomous AI Agents
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Self-optimizing agents that monitor, learn, and improve operations 24/7
        </p>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Autonomous Operations Active</h3>
            <p className="text-sm opacity-90 mb-3">
              4 AI agents are continuously monitoring your systems, detecting inefficiencies, and taking corrective actions with your approval.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Self-Healing</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Continuous Learning</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">24/7 Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base">{agent.name}</h3>
                </div>
                <span className={`inline-block px-2 py-1 rounded text-xs border capitalize ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">{agent.lastAction}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Tasks Completed</p>
                <p className="text-xl">{agent.tasksCompleted}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Efficiency</p>
                <p className="text-xl">{agent.efficiency}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Autonomy Level</span>
                <span>{agent.autonomyLevel}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                  style={{ width: `${agent.autonomyLevel}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Actions Requiring Approval */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Actions Requiring Review
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {recentActions.map((action) => (
            <div key={action.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-600">{action.agent}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getActionStatusColor(action.status)}`}>
                      {action.status}
                    </span>
                  </div>
                  
                  <h4 className="text-sm mb-1">{action.action}</h4>
                  <p className="text-xs text-gray-600 mb-2">{action.impact}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{action.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div>Confidence: {action.confidence}%</div>
                  </div>
                </div>

                {action.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveAction(action.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectAction(action.id)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {action.status === 'executed' && (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Executed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Agent Performance Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-1">1,349</p>
            <p className="text-xs text-gray-600">Total Actions</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-1">92%</p>
            <p className="text-xs text-gray-600">Success Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-1">$250K</p>
            <p className="text-xs text-gray-600">Cost Savings</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl mb-1">24/7</p>
            <p className="text-xs text-gray-600">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
