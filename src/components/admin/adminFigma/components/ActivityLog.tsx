import React, { useState } from 'react';
import { Activity, Filter, Download, User, Database, Settings, Shield, DollarSign, FileText } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  category: 'system' | 'user' | 'data' | 'security' | 'finance' | 'ai';
  severity: 'info' | 'warning' | 'critical';
  details: string;
  ipAddress?: string;
}

const logs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 2 * 60000),
    user: 'Dr. Elena Chen',
    action: 'Deployed AI Model v2.1',
    category: 'ai',
    severity: 'info',
    details: 'Carbon Optimizer model successfully deployed to production',
    ipAddress: '192.168.1.45',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60000),
    user: 'Marcus Rodriguez',
    action: 'Executed Portfolio Rebalance',
    category: 'finance',
    severity: 'info',
    details: 'Rebalanced $2.4M across 8 regenerative pools',
    ipAddress: '192.168.1.62',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 30 * 60000),
    user: 'System',
    action: 'Failed Login Attempt',
    category: 'security',
    severity: 'warning',
    details: '3 consecutive failed login attempts from unknown IP',
    ipAddress: '45.123.67.89',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 45 * 60000),
    user: 'Aisha Patel',
    action: 'Exported Impact Report',
    category: 'data',
    severity: 'info',
    details: 'Q4 2024 Regenerative Impact Analysis (PDF, 2.4MB)',
    ipAddress: '192.168.1.78',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 60 * 60000),
    user: 'Dr. Elena Chen',
    action: 'Updated System Configuration',
    category: 'system',
    severity: 'warning',
    details: 'Modified AI ethical threshold parameters',
    ipAddress: '192.168.1.45',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 90 * 60000),
    user: 'James Wilson',
    action: 'Created DAO Proposal #092',
    category: 'user',
    severity: 'info',
    details: 'Proposal: Allocate $500K to Ocean Restoration Initiative',
    ipAddress: '192.168.1.91',
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    user: 'System',
    action: 'Database Backup Completed',
    category: 'system',
    severity: 'info',
    details: 'Automated backup created (12.8GB)',
    ipAddress: 'localhost',
  },
  {
    id: '8',
    timestamp: new Date(Date.now() - 3 * 60 * 60000),
    user: 'Marcus Rodriguez',
    action: 'Approved Smart Contract',
    category: 'security',
    severity: 'critical',
    details: 'Multi-sig approval for $1.2M token transfer',
    ipAddress: '192.168.1.62',
  },
];

export function ActivityLog() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'system' | 'user' | 'data' | 'security' | 'finance' | 'ai'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'data':
        return <Database className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'finance':
        return <DollarSign className="w-4 h-4" />;
      case 'ai':
        return <Activity className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'user':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'data':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'security':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'finance':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'ai':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleString();
  };

  const filteredLogs = logs.filter(log => {
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSeverity && matchesSearch;
  });

  const exportLogs = () => {
    console.log('Exporting activity logs...');
    // Export logic here
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          Activity Log
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Complete audit trail of all system activities and user actions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Events (24h)</p>
          <p className="text-xl sm:text-2xl">{logs.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Critical Events</p>
          <p className="text-xl sm:text-2xl text-red-600">
            {logs.filter(l => l.severity === 'critical').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-xl sm:text-2xl">4</p>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Security Alerts</p>
          <p className="text-xl sm:text-2xl text-amber-600">
            {logs.filter(l => l.category === 'security').length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activity logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="all">All Categories</option>
                <option value="system">System</option>
                <option value="user">User</option>
                <option value="data">Data</option>
                <option value="security">Security</option>
                <option value="finance">Finance</option>
                <option value="ai">AI</option>
              </select>
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="all">All Severity</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>

            <button
              onClick={exportLogs}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <div key={log.id} className="flex gap-3 sm:gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`}></div>
                  {index < filteredLogs.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 mt-1"></div>
                  )}
                </div>

                {/* Log Entry */}
                <div className="flex-1 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded text-xs border flex items-center gap-1 ${getCategoryColor(log.category)}`}>
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category}</span>
                      </span>
                      <h4 className="text-sm">{log.action}</h4>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{log.user}</span>
                    </div>
                    {log.ipAddress && (
                      <div className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        <span>{log.ipAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          Load More Events
        </button>
      </div>
    </div>
  );
}
