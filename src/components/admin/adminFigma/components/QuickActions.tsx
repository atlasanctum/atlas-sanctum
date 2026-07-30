import React from 'react';
import {
  FileDown,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Settings,
  GitBranch,
  Shield,
  BarChart3,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'data' | 'ai' | 'finance' | 'system';
}

const quickActions: QuickAction[] = [
  {
    id: 'export-data',
    label: 'Export Dashboard Data',
    description: 'Download CSV/JSON reports',
    icon: <FileDown className="w-5 h-5" />,
    color: 'bg-blue-500 hover:bg-blue-600',
    category: 'data',
  },
  {
    id: 'import-data',
    label: 'Import External Data',
    description: 'Upload IoT/satellite feeds',
    icon: <Upload className="w-5 h-5" />,
    color: 'bg-purple-500 hover:bg-purple-600',
    category: 'data',
  },
  {
    id: 'refresh-all',
    label: 'Refresh All Metrics',
    description: 'Force data synchronization',
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    category: 'system',
  },
  {
    id: 'deploy-model',
    label: 'Deploy AI Model',
    description: 'Push trained model to production',
    icon: <Play className="w-5 h-5" />,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    category: 'ai',
  },
  {
    id: 'pause-trading',
    label: 'Pause Auto-Trading',
    description: 'Emergency trading halt',
    icon: <Pause className="w-5 h-5" />,
    color: 'bg-red-500 hover:bg-red-600',
    category: 'finance',
  },
  {
    id: 'rebalance',
    label: 'Portfolio Rebalance',
    description: 'Execute optimization strategy',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'bg-amber-500 hover:bg-amber-600',
    category: 'finance',
  },
  {
    id: 'audit-trail',
    label: 'Generate Audit Trail',
    description: 'Export compliance report',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-teal-500 hover:bg-teal-600',
    category: 'system',
  },
  {
    id: 'create-proposal',
    label: 'Create DAO Proposal',
    description: 'Submit new governance vote',
    icon: <GitBranch className="w-5 h-5" />,
    color: 'bg-cyan-500 hover:bg-cyan-600',
    category: 'finance',
  },
];

export function QuickActions() {
  const handleAction = (actionId: string) => {
    console.log('Executing action:', actionId);
    // Trigger action logic here
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          Quick Actions
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Rapid operations and data management
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            className={`${action.color} text-white rounded-lg p-4 transition-all hover:shadow-lg flex flex-col items-start gap-2 group`}
          >
            <div className="bg-white/20 p-2 rounded group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <div className="text-left">
              <p className="text-sm mb-1">{action.label}</p>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Actions Log */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-3">Recent Actions</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
            <span>Portfolio rebalanced</span>
            <span className="text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
            <span>Data export completed</span>
            <span className="text-gray-400">15 min ago</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
            <span>AI model deployed (v2.1)</span>
            <span className="text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
