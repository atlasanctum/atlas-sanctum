import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, Filter, Clock } from 'lucide-react';

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  category: 'ai' | 'blockchain' | 'dao' | 'finance' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  affectedSystems: string[];
  recommendedAction?: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    severity: 'critical',
    category: 'finance',
    title: 'Treasury Liquidity Below Critical Threshold',
    description: 'Available liquidity has dropped to 18%, below the critical threshold of 20%',
    timestamp: new Date(Date.now() - 5 * 60000),
    status: 'active',
    affectedSystems: ['ReFi Console', 'Treasury Management'],
    recommendedAction: 'Immediate rebalancing required. Review liquidity pools and consider emergency withdrawal.',
  },
  {
    id: '2',
    severity: 'warning',
    category: 'ai',
    title: 'Carbon Optimizer Model Accuracy Degradation',
    description: 'Model accuracy decreased to 89.2%, below optimal threshold of 92%',
    timestamp: new Date(Date.now() - 15 * 60000),
    status: 'acknowledged',
    affectedSystems: ['AI Console', 'Carbon Trading'],
    recommendedAction: 'Schedule model retraining with latest carbon market data.',
  },
  {
    id: '3',
    severity: 'warning',
    category: 'blockchain',
    title: 'High Gas Fees Detected',
    description: 'Ethereum network gas fees elevated at 150 gwei, 3x normal levels',
    timestamp: new Date(Date.now() - 25 * 60000),
    status: 'acknowledged',
    affectedSystems: ['Blockchain Monitor', 'Token Transfers'],
    recommendedAction: 'Consider delaying non-urgent transactions or using Layer 2 solutions.',
  },
  {
    id: '4',
    severity: 'info',
    category: 'dao',
    title: 'DAO Proposal Reaching Vote Deadline',
    description: 'Proposal #089 voting ends in 6 hours. Current participation: 87%',
    timestamp: new Date(Date.now() - 45 * 60000),
    status: 'active',
    affectedSystems: ['DAO Governance'],
    recommendedAction: 'Send reminder to remaining stakeholders.',
  },
  {
    id: '5',
    severity: 'success',
    category: 'system',
    title: 'Database Optimization Complete',
    description: 'Scheduled maintenance completed. Query performance improved by 15%',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    status: 'resolved',
    affectedSystems: ['Database', 'All Services'],
  },
  {
    id: '6',
    severity: 'warning',
    category: 'ai',
    title: 'Ethical Validator Flagged Decision',
    description: 'Recent AI decision scored 72% on ethical alignment, below 85% threshold',
    timestamp: new Date(Date.now() - 3 * 60 * 60000),
    status: 'acknowledged',
    affectedSystems: ['AI Console', 'Ethical Validation'],
    recommendedAction: 'Review decision tree and update moral ontology parameters.',
  },
];

export function AlertsCenter() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-300 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'success':
        return 'bg-emerald-50 border-emerald-300 text-emerald-800';
      default:
        return 'bg-blue-50 border-blue-300 text-blue-800';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'acknowledged':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filter === 'all' || alert.severity === filter;
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    return severityMatch && statusMatch;
  });

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length;
  const activeCount = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
          Alerts & Monitoring Center
        </h1>
        <p className="text-gray-600">
          System-wide alerts, warnings, and recommended actions
        </p>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <span className="text-xs text-red-700">Critical</span>
          </div>
          <p className="text-3xl text-red-900">{criticalCount}</p>
          <p className="text-xs text-red-700 mt-1">Immediate attention required</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span className="text-xs text-amber-700">Warnings</span>
          </div>
          <p className="text-3xl text-amber-900">{warningCount}</p>
          <p className="text-xs text-amber-700 mt-1">Action recommended</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Info className="w-6 h-6 text-blue-600" />
            <span className="text-xs text-blue-700">Active</span>
          </div>
          <p className="text-3xl text-blue-900">{activeCount}</p>
          <p className="text-xs text-blue-700 mt-1">Unacknowledged alerts</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span className="text-xs text-emerald-700">24h Resolved</span>
          </div>
          <p className="text-3xl text-emerald-900">18</p>
          <p className="text-xs text-emerald-700 mt-1">Average resolution: 45min</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Severity:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'warning' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Warning
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                filter === 'info' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Info
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                statusFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                statusFilter === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('acknowledged')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                statusFilter === 'acknowledged' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Acknowledged
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                statusFilter === 'resolved' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`border rounded-lg p-5 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getSeverityIcon(alert.severity)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm">{alert.title}</h3>
                      <span className={`px-2 py-0.5 rounded border text-xs ${getStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm opacity-80">{alert.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(alert.timestamp)}
                  </div>
                </div>

                {alert.recommendedAction && (
                  <div className="mt-3 p-3 bg-white/50 rounded border border-current/20">
                    <p className="text-xs mb-1 opacity-70">Recommended Action:</p>
                    <p className="text-sm">{alert.recommendedAction}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs opacity-70">Affected:</span>
                    {alert.affectedSystems.map((system, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white/30 rounded text-xs"
                      >
                        {system}
                      </span>
                    ))}
                  </div>

                  <div className="ml-auto flex items-center gap-2">
                    {alert.status === 'active' && (
                      <button className="px-3 py-1 bg-white/50 hover:bg-white/70 rounded text-xs transition-colors">
                        Acknowledge
                      </button>
                    )}
                    {alert.status === 'acknowledged' && (
                      <button className="px-3 py-1 bg-white/50 hover:bg-white/70 rounded text-xs transition-colors">
                        Mark Resolved
                      </button>
                    )}
                    <button className="px-3 py-1 bg-white/50 hover:bg-white/70 rounded text-xs transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
