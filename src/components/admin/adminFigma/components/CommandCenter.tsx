import React, { useState } from 'react';
import { Zap, Play, Pause, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface Action {
  id: string;
  title: string;
  description: string;
  status: 'ready' | 'running' | 'completed' | 'warning';
  impact: 'high' | 'medium' | 'low';
  category: 'ai' | 'finance' | 'governance' | 'impact';
}

const actions: Action[] = [
  {
    id: 'ai-deploy',
    title: 'Deploy Ocean Health Predictor v2.1',
    description: 'Updated AI model with enhanced coral reef monitoring',
    status: 'ready',
    impact: 'high',
    category: 'ai',
  },
  {
    id: 'refi-rebalance',
    title: 'Rebalance ReFi Portfolio',
    description: 'Shift 15% allocation from carbon to biodiversity tokens',
    status: 'running',
    impact: 'medium',
    category: 'finance',
  },
  {
    id: 'dao-execute',
    title: 'Execute DAO Proposal #089',
    description: 'Allocate $500K to Amazon Rainforest Carbon Credits',
    status: 'ready',
    impact: 'high',
    category: 'governance',
  },
  {
    id: 'impact-verify',
    title: 'Verify Impact Metrics - Q1 2025',
    description: 'Third-party audit of carbon offset claims',
    status: 'completed',
    impact: 'high',
    category: 'impact',
  },
  {
    id: 'ai-retrain',
    title: 'Retrain Ethical Validator Model',
    description: 'Incorporate new community feedback data',
    status: 'ready',
    impact: 'medium',
    category: 'ai',
  },
  {
    id: 'treasury-alert',
    title: 'Treasury Threshold Alert',
    description: 'Liquidity below recommended 25% - consider rebalancing',
    status: 'warning',
    impact: 'medium',
    category: 'finance',
  },
];

export function CommandCenter() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'running':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'warning':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      case 'low':
        return 'text-emerald-600 bg-emerald-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return 'bg-purple-500';
      case 'finance':
        return 'bg-amber-500';
      case 'governance':
        return 'bg-emerald-500';
      case 'impact':
        return 'bg-teal-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleExecute = (actionId: string) => {
    console.log('Executing action:', actionId);
    // Trigger action execution
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 shadow-xl border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg text-white flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-amber-400" />
            Command & Control Center
          </h3>
          <p className="text-sm text-slate-400">
            Execute system-wide actions and monitor operational status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-300">System Online</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Ready</p>
          <p className="text-xl text-white">
            {actions.filter(a => a.status === 'ready').length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Running</p>
          <p className="text-xl text-emerald-400">
            {actions.filter(a => a.status === 'running').length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Completed</p>
          <p className="text-xl text-gray-400">
            {actions.filter(a => a.status === 'completed').length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Alerts</p>
          <p className="text-xl text-amber-400">
            {actions.filter(a => a.status === 'warning').length}
          </p>
        </div>
      </div>

      {/* Action Nodes */}
      <div className="space-y-3">
        {actions.map(action => (
          <div
            key={action.id}
            className={`border rounded-lg p-4 transition-all cursor-pointer ${
              selectedAction === action.id
                ? 'bg-slate-700/50 border-teal-500 shadow-lg shadow-teal-500/20'
                : 'bg-slate-800/30 border-slate-700 hover:bg-slate-700/30 hover:border-slate-600'
            }`}
            onClick={() => setSelectedAction(action.id)}
          >
            <div className="flex items-start gap-3">
              {/* Category Indicator */}
              <div className={`w-1 h-full ${getCategoryColor(action.category)} rounded-full`}></div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm text-white mb-1">{action.title}</h4>
                    <p className="text-xs text-slate-400">{action.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`px-2 py-1 rounded text-xs ${getImpactColor(action.impact)}`}>
                      {action.impact} impact
                    </span>
                    <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(action.status)}`}>
                      {action.status === 'running' && <span className="inline-block w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse mr-1"></span>}
                      {action.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-3">
                  {action.status === 'ready' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExecute(action.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Execute
                    </button>
                  )}
                  
                  {action.status === 'running' && (
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs transition-colors">
                      <Pause className="w-3 h-3" />
                      Pause
                    </button>
                  )}
                  
                  {action.status === 'completed' && (
                    <div className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Completed successfully
                    </div>
                  )}
                  
                  {action.status === 'warning' && (
                    <div className="flex items-center gap-1 text-xs text-amber-400">
                      <AlertCircle className="w-3 h-3" />
                      Requires attention
                    </div>
                  )}
                  
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs transition-colors ml-auto">
                    <Settings className="w-3 h-3" />
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Ripple Effect Indicator */}
      {selectedAction && (
        <div className="mt-4 p-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 rounded-lg">
          <p className="text-xs text-teal-300 mb-2">Predicted System Ripple Effects:</p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>AI: +2%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Blockchain: +1%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>DAO: +3%</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Finance: +5%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
