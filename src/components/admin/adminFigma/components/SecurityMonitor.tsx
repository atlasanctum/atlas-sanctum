import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, Globe, Server, Eye, Activity } from 'lucide-react';

export function SecurityMonitor() {
  const [timeRange, setTimeRange] = useState('24h');

  const securityMetrics = [
    {
      label: 'Security Score',
      value: '94/100',
      status: 'good',
      icon: Shield,
      color: 'emerald',
    },
    {
      label: 'Active Threats',
      value: '2',
      status: 'warning',
      icon: AlertTriangle,
      color: 'amber',
    },
    {
      label: 'Blocked Attempts',
      value: '247',
      status: 'good',
      icon: Lock,
      color: 'blue',
    },
    {
      label: 'Active Sessions',
      value: '1,234',
      status: 'info',
      icon: Activity,
      color: 'purple',
    },
  ];

  const securityEvents = [
    {
      id: '1',
      type: 'failed_login',
      severity: 'warning',
      message: 'Multiple failed login attempts detected',
      ip: '45.123.67.89',
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'active',
    },
    {
      id: '2',
      type: 'suspicious_activity',
      severity: 'critical',
      message: 'Unusual API access pattern from unknown IP',
      ip: '192.168.1.156',
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'investigating',
    },
    {
      id: '3',
      type: 'blocked_request',
      severity: 'info',
      message: 'SQL injection attempt blocked',
      ip: '78.45.123.90',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'resolved',
    },
    {
      id: '4',
      type: 'auth_success',
      severity: 'info',
      message: 'New device login approved',
      ip: '192.168.1.45',
      timestamp: new Date(Date.now() - 45 * 60000),
      status: 'resolved',
    },
  ];

  const vulnerabilities = [
    {
      id: '1',
      title: 'Outdated NPM Dependencies',
      severity: 'medium',
      affected: '3 packages',
      cve: 'CVE-2024-1234',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Weak SSL/TLS Configuration',
      severity: 'high',
      affected: 'API Gateway',
      cve: 'N/A',
      status: 'in_progress',
    },
    {
      id: '3',
      title: 'Missing Rate Limiting',
      severity: 'low',
      affected: '/api/public/*',
      cve: 'N/A',
      status: 'pending',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'warning':
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'low':
      case 'info':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-700';
      case 'investigating':
        return 'bg-amber-100 text-amber-700';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              Security Monitor
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Real-time security monitoring and threat detection
            </p>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${
                  metric.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                  metric.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                  metric.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                } flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Security Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg">Recent Security Events</h3>
          <button className="text-sm text-purple-600 hover:text-purple-700">View All</button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Event</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Severity</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">IP Address</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Time</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {securityEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm">{event.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{event.ip}</code>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{formatTimestamp(event.timestamp)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(event.status)}`}>
                      {event.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-3">
          {securityEvents.map((event) => (
            <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs border ${getSeverityColor(event.severity)}`}>
                  {event.severity}
                </span>
                <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
              </div>
              <p className="text-sm mb-2">{event.message}</p>
              <div className="flex items-center justify-between">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{event.ip}</code>
                <span className={`px-2 py-1 rounded text-xs capitalize ${getStatusColor(event.status)}`}>
                  {event.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Vulnerabilities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg">Vulnerabilities</h3>
          </div>
          <div className="p-4 space-y-3">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm flex-1">{vuln.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs border ml-2 ${getSeverityColor(vuln.severity)}`}>
                    {vuln.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                  <div>
                    <span className="text-gray-500">Affected:</span> {vuln.affected}
                  </div>
                  <div>
                    <span className="text-gray-500">CVE:</span> {vuln.cve}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-xs transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs transition-colors">
                    Fix Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings Quick Access */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg">Security Controls</h3>
          </div>
          <div className="p-4 space-y-3">
            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Two-Factor Auth</p>
                  <p className="text-xs text-gray-500">Enabled for all users</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-700" />
                </div>
                <div className="text-left">
                  <p className="text-sm">IP Whitelist</p>
                  <p className="text-xs text-gray-500">4 IP ranges configured</p>
                </div>
              </div>
              <span className="text-xs text-blue-600">Configure</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Firewall Rules</p>
                  <p className="text-xs text-gray-500">12 active rules</p>
                </div>
              </div>
              <span className="text-xs text-purple-600">Manage</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-amber-700" />
                </div>
                <div className="text-left">
                  <p className="text-sm">Rate Limiting</p>
                  <p className="text-xs text-gray-500">1000 req/min</p>
                </div>
              </div>
              <span className="text-xs text-amber-600">Adjust</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
