import React from 'react';
import { Activity, Server, Database, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
  icon: React.ReactNode;
  threshold: { warning: number; critical: number };
}

const healthMetrics: HealthMetric[] = [
  {
    name: 'API Response Time',
    status: 'healthy',
    value: 45,
    unit: 'ms',
    icon: <Wifi className="w-5 h-5" />,
    threshold: { warning: 200, critical: 500 },
  },
  {
    name: 'Database Performance',
    status: 'healthy',
    value: 87,
    unit: '%',
    icon: <Database className="w-5 h-5" />,
    threshold: { warning: 70, critical: 50 },
  },
  {
    name: 'CPU Usage',
    status: 'warning',
    value: 72,
    unit: '%',
    icon: <Cpu className="w-5 h-5" />,
    threshold: { warning: 70, critical: 90 },
  },
  {
    name: 'Memory Usage',
    status: 'healthy',
    value: 64,
    unit: '%',
    icon: <HardDrive className="w-5 h-5" />,
    threshold: { warning: 80, critical: 95 },
  },
  {
    name: 'Server Uptime',
    status: 'healthy',
    value: 99.97,
    unit: '%',
    icon: <Server className="w-5 h-5" />,
    threshold: { warning: 99.5, critical: 99.0 },
  },
];

const services = [
  { name: 'AI Model Server', status: 'operational', uptime: '99.98%', latency: '12ms' },
  { name: 'Blockchain Node', status: 'operational', uptime: '100%', latency: '8ms' },
  { name: 'Database Cluster', status: 'operational', uptime: '99.99%', latency: '5ms' },
  { name: 'GraphQL API', status: 'operational', uptime: '99.95%', latency: '18ms' },
  { name: 'WebSocket Server', status: 'degraded', uptime: '98.42%', latency: '25ms' },
  { name: 'Authentication Service', status: 'operational', uptime: '100%', latency: '7ms' },
];

export function SystemHealth() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'warning':
      case 'degraded':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical':
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'critical':
      case 'down':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <Activity className="w-8 h-8 text-purple-600" />
          System Health & Performance
        </h1>
        <p className="text-gray-600">
          Real-time infrastructure monitoring and service status
        </p>
      </div>

      {/* Overall Health Status */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-2">Overall System Health</p>
            <p className="text-4xl">98.7%</p>
            <p className="text-sm opacity-75 mt-2">All critical systems operational</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg px-4 py-2 mb-2">
              <p className="text-xs opacity-75">Active Users</p>
              <p className="text-2xl">2,847</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-xs opacity-75">Requests/min</p>
              <p className="text-2xl">12.4K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {healthMetrics.map((metric, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 border ${
              metric.status === 'healthy'
                ? 'bg-white border-gray-200'
                : metric.status === 'warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={metric.status === 'healthy' ? 'text-gray-600' : metric.status === 'warning' ? 'text-amber-600' : 'text-red-600'}>
                {metric.icon}
              </div>
              {getStatusIcon(metric.status)}
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
            <p className="text-2xl mb-1">
              {metric.value}
              <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${
                  metric.status === 'healthy'
                    ? 'bg-emerald-500'
                    : metric.status === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Service Status</h3>
        <div className="space-y-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="text-sm">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    Uptime: {service.uptime} • Latency: {service.latency}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Recent Incidents & Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">WebSocket Service Degradation</p>
              <p className="text-xs text-gray-600 mb-2">
                Temporary connection delays affecting real-time updates. Engineering team investigating.
              </p>
              <p className="text-xs text-gray-500">Detected: 12 minutes ago • Status: Investigating</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Database Optimization Complete</p>
              <p className="text-xs text-gray-600 mb-2">
                Scheduled maintenance completed successfully. Query performance improved by 15%.
              </p>
              <p className="text-xs text-gray-500">Completed: 2 hours ago • Duration: 15 minutes</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm mb-1">Scheduled Maintenance - AI Model Server</p>
              <p className="text-xs text-gray-600 mb-2">
                Planned upgrade to deploy new Carbon Optimizer v2.2. Expected downtime: 5 minutes.
              </p>
              <p className="text-xs text-gray-500">Scheduled: Tomorrow at 3:00 AM UTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">24-Hour Performance Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">API Response Time</span>
                <span className="text-sm text-emerald-600">-12% ↓</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Error Rate</span>
                <span className="text-sm text-emerald-600">-45% ↓</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Throughput</span>
                <span className="text-sm text-blue-600">+23% ↑</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">Resource Allocation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">AI Processing</span>
                <span className="text-sm">38%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Blockchain Operations</span>
                <span className="text-sm">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Data Analytics</span>
                <span className="text-sm">22%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Other Services</span>
                <span className="text-sm">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
