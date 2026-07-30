import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Heart,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Users,
  Shield,
  Target,
  RefreshCw,
  Wifi,
  WifiOff,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';

interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  lastIncident: Date | null;
  activeAlerts: number;
}

interface ComponentHealth {
  id: string;
  name: string;
  type: 'api' | 'database' | 'blockchain' | 'ai' | 'storage' | 'network';
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  uptime: number;
  responseTime: number;
  errorRate: number;
  lastChecked: Date;
  dependencies: string[];
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  threshold: number;
  status: 'normal' | 'warning' | 'critical';
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  component: string;
  timestamp: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
}

interface UserExperience {
  totalUsers: number;
  activeUsers: number;
  sessionDuration: number;
  bounceRate: number;
  satisfactionScore: number;
  supportTickets: number;
  featureUsage: Record<string, number>;
}

const HealthMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'performance' | 'alerts' | 'ux'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'healthy',
    uptime: 99.97,
    responseTime: 245,
    errorRate: 0.02,
    throughput: 1250,
    lastIncident: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    activeAlerts: 3
  });

  const [components, setComponents] = useState<ComponentHealth[]>([
    {
      id: 'api-gateway',
      name: 'API Gateway',
      type: 'api',
      status: 'healthy',
      uptime: 99.99,
      responseTime: 45,
      errorRate: 0.01,
      lastChecked: new Date(),
      dependencies: ['authentication', 'rate-limiting']
    },
    {
      id: 'postgres-db',
      name: 'PostgreSQL Database',
      type: 'database',
      status: 'healthy',
      uptime: 99.95,
      responseTime: 12,
      errorRate: 0.005,
      lastChecked: new Date(),
      dependencies: ['connection-pool', 'backup-system']
    },
    {
      id: 'blockchain-node',
      name: 'Blockchain Network',
      type: 'blockchain',
      status: 'healthy',
      uptime: 99.98,
      responseTime: 234,
      errorRate: 0.02,
      lastChecked: new Date(),
      dependencies: ['consensus', 'peer-network']
    },
    {
      id: 'ai-engine',
      name: 'AI Processing Engine',
      type: 'ai',
      status: 'healthy',
      uptime: 99.90,
      responseTime: 156,
      errorRate: 0.03,
      lastChecked: new Date(),
      dependencies: ['gpu-cluster', 'model-registry']
    },
    {
      id: 'storage-system',
      name: 'Distributed Storage',
      type: 'storage',
      status: 'degraded',
      uptime: 99.85,
      responseTime: 89,
      errorRate: 0.08,
      lastChecked: new Date(),
      dependencies: ['ipfs-network', 'backup-storage']
    },
    {
      id: 'network-infra',
      name: 'Network Infrastructure',
      type: 'network',
      status: 'healthy',
      uptime: 99.99,
      responseTime: 5,
      errorRate: 0.001,
      lastChecked: new Date(),
      dependencies: ['cdn', 'load-balancer']
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([
    { name: 'CPU Usage', value: 68, unit: '%', trend: 'stable', threshold: 80, status: 'normal' },
    { name: 'Memory Usage', value: 74, unit: '%', trend: 'up', threshold: 85, status: 'warning' },
    { name: 'Disk I/O', value: 45, unit: 'MB/s', trend: 'down', threshold: 100, status: 'normal' },
    { name: 'Network Latency', value: 23, unit: 'ms', trend: 'stable', threshold: 50, status: 'normal' },
    { name: 'Database Connections', value: 89, unit: '%', trend: 'up', threshold: 90, status: 'warning' },
    { name: 'API Rate Limit', value: 67, unit: '%', trend: 'stable', threshold: 80, status: 'normal' }
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'High Memory Usage',
      description: 'Memory usage has exceeded 70% threshold on production servers',
      severity: 'medium',
      status: 'active',
      component: 'Application Servers',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: '2',
      title: 'Storage System Degradation',
      description: 'Distributed storage system showing increased response times',
      severity: 'high',
      status: 'acknowledged',
      component: 'Storage System',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      acknowledgedBy: 'System Admin'
    },
    {
      id: '3',
      title: 'Database Connection Pool Warning',
      description: 'Database connection pool utilization approaching limit',
      severity: 'low',
      status: 'resolved',
      component: 'PostgreSQL Database',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
    }
  ]);

  const [userExperience, setUserExperience] = useState<UserExperience>({
    totalUsers: 15420,
    activeUsers: 8920,
    sessionDuration: 1247, // seconds
    bounceRate: 23.5,
    satisfactionScore: 4.2,
    supportTickets: 45,
    featureUsage: {
      'marketplace': 68,
      'measurements': 45,
      'governance': 23,
      'bioregions': 34,
      'regeneration': 28,
      'valuation': 19
    }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'components', label: 'Components', icon: Shield },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'ux', label: 'User Experience', icon: Users }
  ];

  const ComponentCard: React.FC<{ component: ComponentHealth }> = ({ component }) => {
    const statusColors = {
      healthy: 'bg-green-500/10 text-green-500 border-green-500/20',
      degraded: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      down: 'bg-red-500/10 text-red-500 border-red-500/20',
      maintenance: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };

    const typeIcons = {
      api: Network,
      database: HardDrive,
      blockchain: Zap,
      ai: Cpu,
      storage: HardDrive,
      network: Wifi
    };

    const StatusIcon = component.status === 'healthy' ? CheckCircle :
                      component.status === 'degraded' ? AlertTriangle :
                      component.status === 'down' ? WifiOff : Clock;

    const TypeIcon = typeIcons[component.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{component.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{component.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${
              component.status === 'healthy' ? 'text-green-500' :
              component.status === 'degraded' ? 'text-yellow-500' :
              component.status === 'down' ? 'text-red-500' : 'text-blue-500'
            }`} />
            <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[component.status]}`}>
              {component.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">{component.uptime}%</div>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-500">{component.responseTime}ms</div>
            <p className="text-xs text-muted-foreground">Response Time</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Error Rate</span>
            <span className="font-medium">{component.errorRate}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Checked</span>
            <span className="font-medium">{component.lastChecked.toLocaleTimeString()}</span>
          </div>
        </div>

        {component.dependencies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Dependencies</p>
            <div className="flex flex-wrap gap-1">
              {component.dependencies.map((dep) => (
                <span
                  key={dep}
                  className="px-2 py-1 bg-muted/50 text-xs rounded border border-border/50"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const MetricCard: React.FC<{ metric: PerformanceMetric }> = ({ metric }) => {
    const statusColors = {
      normal: 'text-green-500',
      warning: 'text-yellow-500',
      critical: 'text-red-500'
    };

    const trendIcons = {
      up: TrendingUp,
      down: TrendingDown,
      stable: Activity
    };

    const TrendIcon = trendIcons[metric.trend];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{metric.name}</h3>
          <div className={`flex items-center space-x-1 ${statusColors[metric.status]}`}>
            <TrendIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="text-3xl font-bold text-primary mb-2">
          {metric.value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full ${
              metric.status === 'critical' ? 'bg-red-500' :
              metric.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(metric.value / metric.threshold) * 100}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Threshold: {metric.threshold}{metric.unit}
        </p>
      </motion.div>
    );
  };

  const AlertCard: React.FC<{ alert: Alert }> = ({ alert }) => {
    const severityColors = {
      low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      critical: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const statusColors = {
      active: 'bg-red-500/10 text-red-500',
      acknowledged: 'bg-yellow-500/10 text-yellow-500',
      resolved: 'bg-green-500/10 text-green-500'
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg bg-card"
      >
        <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
          alert.severity === 'critical' ? 'bg-red-500' :
          alert.severity === 'high' ? 'bg-orange-500' :
          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
        }`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">{alert.title}</h4>
            <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[alert.status]}`}>
              {alert.status.toUpperCase()}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{alert.component}</span>
            <span>{alert.timestamp.toLocaleString()}</span>
          </div>
          {alert.acknowledgedBy && (
            <p className="text-xs text-muted-foreground mt-1">
              Acknowledged by {alert.acknowledgedBy}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setPerformanceMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 5
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Health Monitoring</h1>
              <p className="text-muted-foreground mt-1">Real-time system health and performance monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  systemHealth.overall === 'healthy' ? 'bg-green-500' :
                  systemHealth.overall === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium capitalize">{systemHealth.overall} Status</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`p-2 rounded-lg border transition-colors ${
                    autoRefresh ? 'bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${autoRefresh ? '' : 'animate-spin'}`} />
                </button>
                <span className="text-sm text-muted-foreground">
                  {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{systemHealth.uptime}%</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{systemHealth.responseTime}ms</div>
              <div className="text-xs text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{systemHealth.errorRate}%</div>
              <div className="text-xs text-muted-foreground">Error Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{systemHealth.throughput}</div>
              <div className="text-xs text-muted-foreground">Requests/min</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{systemHealth.activeAlerts}</div>
              <div className="text-xs text-muted-foreground">Active Alerts</div>
            </div>
            <div className="text-center col-span-2">
              <div className="text-sm font-medium text-foreground">
                {systemHealth.lastIncident ? systemHealth.lastIncident.toLocaleDateString() : 'No incidents'}
              </div>
              <div className="text-xs text-muted-foreground">Last Incident</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'components' | 'performance' | 'alerts' | 'ux')}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Health Status Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Heart className="w-8 h-8 text-green-500" />
                    <span className="text-sm font-medium text-green-500">Healthy</span>
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {components.filter(c => c.status === 'healthy').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Components Healthy</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500">Attention</span>
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {components.filter(c => c.status === 'degraded').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Components Degraded</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="w-8 h-8 text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">Protected</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {Math.round((components.filter(c => c.status === 'healthy').length / components.length) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Recent Alerts</h3>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {alerts.slice(0, 5).map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>

              {/* Component Status Grid */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Component Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {components.map((component) => (
                    <ComponentCard key={component.id} component={component} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Component Health Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {components.filter(c => c.status === 'healthy').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Healthy</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {components.filter(c => c.status === 'degraded').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Degraded</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <WifiOff className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    {components.filter(c => c.status === 'down').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Down</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {components.filter(c => c.status === 'maintenance').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                </div>
              </div>

              {/* Detailed Component Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {components.map((component) => (
                  <ComponentCard key={component.id} component={component} />
                ))}
              </div>

              {/* Dependency Map */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">System Dependencies</h3>
                <div className="h-96 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive dependency map would be displayed here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing component relationships and health status
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceMetrics.map((metric) => (
                  <MetricCard key={metric.name} metric={metric} />
                ))}
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Response Time Trends</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Response time trend charts would be displayed here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Resource Utilization</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Resource utilization charts would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Performance Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Optimization Opportunities</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Database Query Optimization</p>
                          <p className="text-xs text-muted-foreground">Potential 40% improvement in query performance</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Caching Strategy Enhancement</p>
                          <p className="text-xs text-muted-foreground">Implement Redis for frequently accessed data</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Performance Alerts</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Memory Usage Warning</p>
                          <p className="text-xs text-muted-foreground">Memory usage approaching 80% threshold</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Network Latency Normal</p>
                          <p className="text-xs text-muted-foreground">All network metrics within acceptable ranges</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Alert Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    {alerts.filter(a => a.severity === 'critical').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="text-3xl font-bold text-orange-500 mb-2">
                    {alerts.filter(a => a.severity === 'high').length}
                  </div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {alerts.filter(a => a.status === 'active').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {alerts.filter(a => a.status === 'resolved').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Resolved Today</p>
                </div>
              </div>

              {/* Alert Management */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Alert Management</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-1 border border-border/50 rounded text-sm">
                      <option>All Severities</option>
                      <option>Critical</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <select className="px-3 py-1 border border-border/50 rounded text-sm">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Acknowledged</option>
                      <option>Resolved</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>

              {/* Alert Configuration */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Alert Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Threshold Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">CPU Usage Alert</span>
                        <span className="text-sm font-medium">80%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Memory Usage Alert</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Response Time Alert</span>
                        <span className="text-sm font-medium">500ms</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Notification Channels</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Email Alerts</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">SMS Alerts</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Slack Integration</span>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ux' && (
            <motion.div
              key="ux"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* User Experience Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {userExperience.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {userExperience.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {Math.round(userExperience.sessionDuration / 60)}m
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Session</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {userExperience.satisfactionScore}
                  </div>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </div>
              </div>

              {/* User Experience Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Feature Usage</h3>
                  <div className="space-y-4">
                    {Object.entries(userExperience.featureUsage).map(([feature, usage]) => (
                      <div key={feature} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                          <span className="text-sm font-medium capitalize">{feature.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{usage}%</span>
                          <div className="w-16 h-2 bg-muted rounded-full">
                            <div className="h-2 bg-primary rounded-full" style={{ width: `${usage}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">User Journey</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bounce Rate</span>
                      <span className="text-sm font-medium text-red-500">{userExperience.bounceRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Support Tickets</span>
                      <span className="text-sm font-medium text-orange-500">{userExperience.supportTickets}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <span className="text-sm font-medium text-green-500">3.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Retention Rate</span>
                      <span className="text-sm font-medium text-blue-500">78.5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Feedback */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">User Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Recent Reviews</h4>
                    <div className="space-y-3">
                      <div className="p-3 border border-border/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-500">★</span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "Excellent platform for carbon trading. The verification process is seamless."
                        </p>
                      </div>
                      <div className="p-3 border border-border/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex space-x-1">
                            {[...Array(4)].map((_, i) => (
                              <span key={i} className="text-yellow-500">★</span>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">1 week ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          "Great governance features. Love the transparency in decision making."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Improvement Suggestions</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Mobile App</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          45 users requested mobile application
                        </p>
                      </div>
                      <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">API Documentation</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          23 users requested better API docs
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                        <p className="text-sm font-medium text-foreground">Multi-language Support</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          18 users requested additional languages
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HealthMonitoring;