import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Network,
  FileText,
  Settings,
  Activity,
  Zap
} from 'lucide-react';

interface EnterpriseMetrics {
  activeUsers: number;
  totalProjects: number;
  verifiedTransactions: number;
  securityIncidents: number;
  uptime: number;
  responseTime: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'transaction' | 'access' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  user?: string;
  ip?: string;
  resolved: boolean;
}

interface ComplianceStatus {
  category: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  lastAudit: Date;
  nextAudit: Date;
  score: number;
}

const EnterpriseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'compliance' | 'integrations'>('overview');
  const [metrics, setMetrics] = useState<EnterpriseMetrics>({
    activeUsers: 15420,
    totalProjects: 2847,
    verifiedTransactions: 89234,
    securityIncidents: 3,
    uptime: 99.97,
    responseTime: 245,
    complianceScore: 98.5,
    riskLevel: 'low'
  });

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'login',
      severity: 'medium',
      message: 'Multiple failed login attempts detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      user: 'user@enterprise.com',
      ip: '192.168.1.100',
      resolved: false
    },
    {
      id: '2',
      type: 'transaction',
      severity: 'low',
      message: 'Large transaction flagged for review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      user: 'admin@corp.com',
      resolved: true
    }
  ]);

  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([
    {
      category: 'GDPR',
      status: 'compliant',
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 335),
      score: 98
    },
    {
      category: 'SOX',
      status: 'compliant',
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 275),
      score: 97
    },
    {
      category: 'ISO 27001',
      status: 'pending',
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 185),
      score: 85
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'compliance', label: 'Compliance', icon: FileText },
    { id: 'integrations', label: 'Integrations', icon: Network }
  ];

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }> = ({ title, value, change, icon: Icon, trend, color = 'text-primary' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-primary/10 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-green-500' :
            trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );

  const SecurityEventCard: React.FC<{ event: SecurityEvent }> = ({ event }) => {
    const severityColors = {
      low: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      medium: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      high: 'bg-red-500/10 text-red-500 border-red-500/20',
      critical: 'bg-red-600/10 text-red-600 border-red-600/20'
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card"
      >
        <div className="flex items-center space-x-4">
          <div className={`px-2 py-1 rounded text-xs font-medium border ${severityColors[event.severity]}`}>
            {event.severity.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-foreground">{event.message}</p>
            <p className="text-sm text-muted-foreground">
              {event.user && `${event.user} • `}
              {event.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {event.resolved ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
      </motion.div>
    );
  };

  const ComplianceCard: React.FC<{ compliance: ComplianceStatus }> = ({ compliance }) => {
    const statusColors = {
      compliant: 'bg-green-500/10 text-green-500 border-green-500/20',
      'non-compliant': 'bg-red-500/10 text-red-500 border-red-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">{compliance.category}</h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[compliance.status]}`}>
            {compliance.status.replace('-', ' ').toUpperCase()}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Compliance Score</span>
            <span className="font-medium">{compliance.score}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${compliance.score}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Last Audit: {compliance.lastAudit.toLocaleDateString()}</span>
            <span>Next: {compliance.nextAudit.toLocaleDateString()}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Enterprise Dashboard</h1>
              <p className="text-muted-foreground mt-1">Comprehensive enterprise management and monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  metrics.riskLevel === 'low' ? 'bg-green-500' :
                  metrics.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium capitalize">{metrics.riskLevel} Risk</span>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
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
                  onClick={() => setActiveTab(tab.id as any)}
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
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Active Users"
                  value={metrics.activeUsers.toLocaleString()}
                  change="+12.5%"
                  icon={Users}
                  trend="up"
                />
                <MetricCard
                  title="Total Projects"
                  value={metrics.totalProjects.toLocaleString()}
                  change="+8.2%"
                  icon={Building2}
                  trend="up"
                />
                <MetricCard
                  title="Verified Transactions"
                  value={metrics.verifiedTransactions.toLocaleString()}
                  change="+15.3%"
                  icon={TrendingUp}
                  trend="up"
                />
                <MetricCard
                  title="Security Incidents"
                  value={metrics.securityIncidents}
                  change="-25%"
                  icon={AlertTriangle}
                  trend="down"
                  color="text-red-500"
                />
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">System Uptime</h3>
                    <Activity className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">{metrics.uptime}%</div>
                  <p className="text-sm text-muted-foreground">Last 30 days</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Avg Response Time</h3>
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">{metrics.responseTime}ms</div>
                  <p className="text-sm text-muted-foreground">Global average</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Compliance Score</h3>
                    <Shield className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">{metrics.complianceScore}%</div>
                  <p className="text-sm text-muted-foreground">Overall rating</p>
                </div>
              </div>

              {/* Recent Security Events */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Recent Security Events</h3>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {securityEvents.slice(0, 5).map((event) => (
                    <SecurityEventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Security Overview */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Security Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Multi-Factor Authentication</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">End-to-End Encryption</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Zero-Knowledge Architecture</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Real-time Threat Detection</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Security Events */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Security Events</h3>
                  <div className="space-y-4">
                    {securityEvents.map((event) => (
                      <SecurityEventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complianceStatus.map((compliance) => (
                  <ComplianceCard key={compliance.category} compliance={compliance} />
                ))}
              </div>

              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Compliance Actions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Schedule ISO 27001 Audit</p>
                      <p className="text-sm text-muted-foreground">Due in 185 days</p>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Schedule
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Update Data Processing Records</p>
                      <p className="text-sm text-muted-foreground">GDPR requirement</p>
                    </div>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'SAP', status: 'connected', lastSync: '2 minutes ago' },
                  { name: 'Salesforce', status: 'connected', lastSync: '5 minutes ago' },
                  { name: 'Microsoft Dynamics', status: 'connected', lastSync: '1 hour ago' },
                  { name: 'Oracle ERP', status: 'pending', lastSync: 'Never' },
                  { name: 'Workday', status: 'connected', lastSync: '30 minutes ago' },
                  { name: 'ServiceNow', status: 'connected', lastSync: '15 minutes ago' }
                ].map((integration) => (
                  <div key={integration.name} className="bg-card border border-border/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">{integration.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'connected' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Status: {integration.status}</p>
                    <p className="text-xs text-muted-foreground">Last sync: {integration.lastSync}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">API Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                    <p className="text-sm text-muted-foreground">API Calls Today</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">99.8%</div>
                    <p className="text-sm text-muted-foreground">API Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">45ms</div>
                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
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

export default EnterpriseDashboard;