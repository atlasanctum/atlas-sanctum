import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Database,
  GitBranch,
  Layers,
  Zap,
  Network,
  FileCode,
  Terminal,
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  Cloud,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Eye,
  Gauge,
  Cpu,
  HardDrive,
  Radio,
  Workflow,
  Box,
  Boxes,
  Sparkles,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Play,
  Pause,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart,
  Share2,
  Link,
  Webhook,
  Key,
  Shield,
  Flame,
  Crosshair,
  CircuitBoard,
  Binary,
  Bug,
  Package
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

type TraceSpan = {
  service: string;
  operation: string;
  duration: number;
  status: 'success' | 'error' | 'slow';
  timestamp: string;
};

type APIEndpoint = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  latency: number;
  requests: number;
  errorRate: number;
  status: 'healthy' | 'degraded' | 'down';
};

type DatabaseQuery = {
  query: string;
  duration: number;
  executions: number;
  avgTime: number;
  optimization: 'good' | 'warning' | 'critical';
};

type FeatureFlag = {
  name: string;
  enabled: boolean;
  rollout: number;
  environment: string;
  description: string;
};

export function Platform() {
  const [activeTab, setActiveTab] = useState<'observability' | 'api' | 'database' | 'architecture' | 'devtools'>('observability');
  const [selectedTrace, setSelectedTrace] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('1h');

  // Mock data for distributed tracing
  const traceSpans: TraceSpan[] = [
    { service: 'API Gateway', operation: 'POST /api/transactions', duration: 145, status: 'success', timestamp: '10:23:45.123' },
    { service: 'Auth Service', operation: 'validateToken', duration: 12, status: 'success', timestamp: '10:23:45.135' },
    { service: 'Smart Contract', operation: 'executeTransaction', duration: 892, status: 'slow', timestamp: '10:23:45.147' },
    { service: 'Database', operation: 'INSERT transaction', duration: 34, status: 'success', timestamp: '10:23:46.039' },
    { service: 'Cache', operation: 'SET user_balance', duration: 8, status: 'success', timestamp: '10:23:46.073' },
    { service: 'Event Bus', operation: 'publish txComplete', duration: 15, status: 'success', timestamp: '10:23:46.081' }
  ];

  // API endpoints data
  const apiEndpoints: APIEndpoint[] = [
    { path: '/api/v1/transactions', method: 'POST', latency: 145, requests: 45678, errorRate: 0.12, status: 'healthy' },
    { path: '/api/v1/users', method: 'GET', latency: 67, requests: 123456, errorRate: 0.05, status: 'healthy' },
    { path: '/api/v1/smart-contracts/deploy', method: 'POST', latency: 892, requests: 2341, errorRate: 0.34, status: 'degraded' },
    { path: '/api/v1/marketplace/assets', method: 'GET', latency: 89, requests: 67890, errorRate: 0.08, status: 'healthy' },
    { path: '/api/v1/ai/inference', method: 'POST', latency: 312, requests: 8901, errorRate: 1.24, status: 'degraded' },
    { path: '/api/v1/governance/proposals', method: 'GET', latency: 45, requests: 34567, errorRate: 0.02, status: 'healthy' }
  ];

  // Database queries
  const databaseQueries: DatabaseQuery[] = [
    {
      query: 'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      duration: 234,
      executions: 12456,
      avgTime: 189,
      optimization: 'warning'
    },
    {
      query: 'INSERT INTO user_activities (user_id, action, metadata) VALUES (?, ?, ?)',
      duration: 12,
      executions: 45678,
      avgTime: 11,
      optimization: 'good'
    },
    {
      query: 'SELECT COUNT(*) FROM proposals WHERE status = "active" AND expires_at > NOW()',
      duration: 567,
      executions: 3421,
      avgTime: 523,
      optimization: 'critical'
    },
    {
      query: 'UPDATE user_balances SET balance = balance - ? WHERE user_id = ?',
      duration: 45,
      executions: 23456,
      avgTime: 43,
      optimization: 'good'
    }
  ];

  // Feature flags
  const featureFlags: FeatureFlag[] = [
    { name: 'ai_code_review', enabled: true, rollout: 100, environment: 'production', description: 'AI-powered code review assistant' },
    { name: 'federated_learning', enabled: true, rollout: 75, environment: 'production', description: 'Federated learning for privacy-preserving ML' },
    { name: 'zk_proofs', enabled: true, rollout: 50, environment: 'staging', description: 'Zero-knowledge proof verification' },
    { name: 'multi_chain_support', enabled: false, rollout: 0, environment: 'development', description: 'Support for multiple blockchain networks' },
    { name: 'advanced_analytics', enabled: true, rollout: 25, environment: 'production', description: 'Enhanced analytics dashboard' }
  ];

  // Chart data
  const requestLatency = [
    { time: '00:00', p50: 89, p95: 234, p99: 456 },
    { time: '04:00', p50: 92, p95: 245, p99: 478 },
    { time: '08:00', p50: 145, p95: 389, p99: 678 },
    { time: '12:00', p50: 167, p95: 412, p99: 712 },
    { time: '16:00', p50: 134, p95: 367, p99: 634 },
    { time: '20:00', p50: 98, p95: 256, p99: 512 }
  ];

  const errorDistribution = [
    { code: '200', count: 1245678 },
    { code: '400', count: 3456 },
    { code: '401', count: 1234 },
    { code: '404', count: 5678 },
    { code: '500', count: 234 },
    { code: '503', count: 89 }
  ];

  const serviceMap = [
    { from: 'Client', to: 'API Gateway', requests: 156789 },
    { from: 'API Gateway', to: 'Auth Service', requests: 156789 },
    { from: 'API Gateway', to: 'Business Logic', requests: 145678 },
    { from: 'Business Logic', to: 'Database', requests: 234567 },
    { from: 'Business Logic', to: 'Cache', requests: 123456 },
    { from: 'Business Logic', to: 'Event Bus', requests: 89012 },
    { from: 'Event Bus', to: 'AI Service', requests: 45678 },
    { from: 'Event Bus', to: 'Blockchain', requests: 23456 }
  ];

  const databaseMetrics = [
    { metric: 'Connections', current: 156, max: 200 },
    { metric: 'Query Rate', current: 2340, max: 3000 },
    { metric: 'Cache Hit', current: 94, max: 100 },
    { metric: 'Replication Lag', current: 234, max: 1000 }
  ];

  const architectureComplexity = [
    { module: 'Smart Contracts', complexity: 8.7, loc: 12456, dependencies: 23 },
    { module: 'AI Models', complexity: 7.2, loc: 34567, dependencies: 45 },
    { module: 'API Layer', complexity: 6.8, loc: 23456, dependencies: 67 },
    { module: 'Frontend', complexity: 5.4, loc: 45678, dependencies: 89 },
    { module: 'Integration Services', complexity: 7.9, loc: 19876, dependencies: 34 }
  ];

  const technicalDebt = [
    { category: 'Code Smells', count: 234, severity: 'medium' },
    { category: 'Duplications', count: 567, severity: 'low' },
    { category: 'Security Hotspots', count: 12, severity: 'high' },
    { category: 'Coverage Gaps', count: 89, severity: 'medium' },
    { category: 'Outdated Dependencies', count: 45, severity: 'high' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
      case 'good':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'slow':
      case 'degraded':
      case 'warning':
        return 'text-amber-400 bg-amber-500/20';
      case 'error':
      case 'down':
      case 'critical':
        return 'text-rose-400 bg-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500/20 text-blue-400';
      case 'POST': return 'bg-emerald-500/20 text-emerald-400';
      case 'PUT': return 'bg-amber-500/20 text-amber-400';
      case 'DELETE': return 'bg-rose-500/20 text-rose-400';
      case 'PATCH': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text">
            Platform Engineering
          </h1>
          <p className="text-slate-400">
            Advanced observability, API management, database optimization, and architectural insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
          >
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last hour</option>
            <option value="6h">Last 6 hours</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>
          <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { id: 'observability', label: 'Observability', icon: Eye },
          { id: 'api', label: 'API Management', icon: Share2 },
          { id: 'database', label: 'Database', icon: Database },
          { id: 'architecture', label: 'Architecture', icon: Boxes },
          { id: 'devtools', label: 'Dev Tools', icon: Terminal }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* Observability Tab */}
        {activeTab === 'observability' && (
          <motion.div
            key="observability"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Req/sec', value: '2,340', change: '+12%', icon: Activity, color: 'from-cyan-600 to-blue-600' },
                { label: 'Avg Latency', value: '145ms', change: '-8%', icon: Gauge, color: 'from-emerald-600 to-teal-600' },
                { label: 'Error Rate', value: '0.12%', change: '-15%', icon: AlertTriangle, color: 'from-amber-600 to-orange-600' },
                { label: 'Uptime', value: '99.97%', change: '+0.02%', icon: CheckCircle2, color: 'from-violet-600 to-purple-600' }
              ].map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${metric.color} p-6 rounded-xl shadow-lg relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <metric.icon className="w-8 h-8 text-white/90" />
                      <span className={`text-xs px-2 py-1 rounded ${
                        metric.change.startsWith('+') ? 'bg-emerald-500/30 text-emerald-200' : 'bg-rose-500/30 text-rose-200'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-white/80 text-sm">{metric.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Distributed Tracing */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-cyan-400" />
                  Distributed Tracing
                </h3>
                <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs transition-colors flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  Search Traces
                </button>
              </div>

              <div className="space-y-2">
                {traceSpans.map((span, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative"
                  >
                    <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors">
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`w-2 h-2 rounded-full ${
                          span.status === 'success' ? 'bg-emerald-400' :
                          span.status === 'slow' ? 'bg-amber-400' :
                          'bg-rose-400'
                        }`} />
                        <span className="text-sm font-medium text-slate-300 w-32">{span.service}</span>
                        <span className="text-sm text-slate-400 flex-1">{span.operation}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{span.timestamp}</span>
                      <span className={`text-sm font-semibold ${
                        span.status === 'success' ? 'text-emerald-400' :
                        span.status === 'slow' ? 'text-amber-400' :
                        'text-rose-400'
                      }`}>
                        {span.duration}ms
                      </span>
                    </div>
                    {idx < traceSpans.length - 1 && (
                      <div className="absolute left-6 top-full w-0.5 h-2 bg-slate-700" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-cyan-400 mb-1">Performance Insight</div>
                    <p className="text-xs text-slate-400">
                      Smart Contract operation is taking 892ms (61% of total trace). Consider optimizing gas usage or implementing caching.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Latency Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <LineChartIcon className="w-5 h-5 text-cyan-400" />
                  Request Latency Percentiles
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={requestLatency}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2} name="p50" />
                    <Line type="monotone" dataKey="p95" stroke="#f59e0b" strokeWidth={2} name="p95" />
                    <Line type="monotone" dataKey="p99" stroke="#ef4444" strokeWidth={2} name="p99" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-violet-400" />
                  HTTP Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={errorDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="code" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Service Dependency Map */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-emerald-400" />
                Service Dependency Map
              </h3>
              <div className="grid grid-cols-8 gap-2 min-h-[300px]">
                {/* Visual service map */}
                <div className="col-span-8 flex items-center justify-center">
                  <div className="flex gap-8 items-center flex-wrap justify-center">
                    {['Client', 'API Gateway', 'Auth', 'Business Logic', 'Database', 'Cache', 'Event Bus', 'AI Service', 'Blockchain'].map((service, idx) => (
                      <motion.div
                        key={service}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div className={`p-4 rounded-xl ${
                          service === 'Client' ? 'bg-gradient-to-br from-violet-600 to-purple-600' :
                          service === 'API Gateway' ? 'bg-gradient-to-br from-cyan-600 to-blue-600' :
                          service === 'Database' || service === 'Cache' ? 'bg-gradient-to-br from-emerald-600 to-teal-600' :
                          'bg-gradient-to-br from-amber-600 to-orange-600'
                        } shadow-lg`}>
                          {service === 'Database' ? <Database className="w-6 h-6 text-white" /> :
                           service === 'Client' ? <Box className="w-6 h-6 text-white" /> :
                           service === 'API Gateway' ? <Share2 className="w-6 h-6 text-white" /> :
                           <Server className="w-6 h-6 text-white" />}
                        </div>
                        <span className="text-xs text-slate-400 mt-2 text-center">{service}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Management Tab */}
        {activeTab === 'api' && (
          <motion.div
            key="api"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* API Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Endpoints', value: '156', icon: Link, color: 'from-cyan-600 to-blue-600' },
                { label: 'Avg Response', value: '89ms', icon: Gauge, color: 'from-emerald-600 to-teal-600' },
                { label: 'Webhooks', value: '23', icon: Webhook, color: 'from-violet-600 to-purple-600' },
                { label: 'API Keys', value: '342', icon: Key, color: 'from-amber-600 to-orange-600' }
              ].map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${metric.color} p-6 rounded-xl shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="w-8 h-8 text-white/90" />
                    <span className="text-3xl font-bold text-white">{metric.value}</span>
                  </div>
                  <div className="text-white/80 text-sm">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {/* API Endpoints Table */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-cyan-400" />
                  API Endpoints
                </h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search endpoints..."
                      className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                    />
                  </div>
                  <button className="p-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Endpoint</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Method</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Requests</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Latency</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Error Rate</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiEndpoints.map((endpoint, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-700/30 hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-slate-300 font-mono">{endpoint.path}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300 text-right">{endpoint.requests.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-slate-300 text-right">{endpoint.latency}ms</td>
                        <td className="py-3 px-4 text-sm text-right">
                          <span className={endpoint.errorRate > 1 ? 'text-rose-400' : endpoint.errorRate > 0.5 ? 'text-amber-400' : 'text-emerald-400'}>
                            {endpoint.errorRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(endpoint.status)}`}>
                            {endpoint.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Documentation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-violet-400" />
                  Interactive API Docs
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">POST</span>
                      <span className="text-sm font-mono text-slate-300">/api/v1/transactions</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Create a new blockchain transaction</p>
                    <button className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs transition-colors">
                      Try it out
                    </button>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">GET</span>
                      <span className="text-sm font-mono text-slate-300">/api/v1/marketplace/assets</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">Retrieve marketplace assets</p>
                    <button className="w-full px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs transition-colors">
                      Try it out
                    </button>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm transition-colors">
                  View Full Documentation
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-emerald-400" />
                  Webhook Management
                </h3>
                <div className="space-y-3">
                  {[
                    { event: 'transaction.created', url: 'https://api.example.com/webhooks/tx', status: 'active' },
                    { event: 'proposal.voted', url: 'https://api.example.com/webhooks/vote', status: 'active' },
                    { event: 'asset.purchased', url: 'https://api.example.com/webhooks/purchase', status: 'failed' }
                  ].map((webhook, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">{webhook.event}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(webhook.status)}`}>
                          {webhook.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono truncate block">{webhook.url}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                  <Webhook className="w-4 h-4" />
                  Add Webhook
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <motion.div
            key="database"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Database Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {databaseMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.metric}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-slate-400">{metric.metric}</h4>
                    <Database className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-200 mb-2">
                    {metric.current.toLocaleString()}
                    {metric.metric === 'Cache Hit' ? '%' : metric.metric === 'Replication Lag' ? 'ms' : ''}
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(metric.current / metric.max) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${
                        (metric.current / metric.max) < 0.7 ? 'bg-emerald-500' :
                        (metric.current / metric.max) < 0.85 ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Max: {metric.max.toLocaleString()}</div>
                </motion.div>
              ))}
            </div>

            {/* Slow Queries */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" />
                Query Performance Analysis
              </h3>
              <div className="space-y-3">
                {databaseQueries.map((query, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 pr-4">
                        <code className="text-xs text-slate-300 font-mono block mb-2">
                          {query.query}
                        </code>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Executions: {query.executions.toLocaleString()}</span>
                          <span>Avg: {query.avgTime}ms</span>
                          <span>Last: {query.duration}ms</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${getStatusColor(query.optimization)}`}>
                        {query.optimization}
                      </span>
                    </div>
                    {query.optimization !== 'good' && (
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-amber-300">
                            {query.optimization === 'critical' 
                              ? 'Consider adding an index on the filtered columns or implementing query result caching.'
                              : 'This query could benefit from optimization. Review the execution plan.'}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Database Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CircuitBoard className="w-5 h-5 text-violet-400" />
                  Schema Management
                </h3>
                <div className="space-y-3">
                  {[
                    { table: 'users', rows: '1.2M', size: '450MB', indexes: 8 },
                    { table: 'transactions', rows: '5.7M', size: '2.3GB', indexes: 12 },
                    { table: 'proposals', rows: '45K', size: '89MB', indexes: 6 },
                    { table: 'marketplace_assets', rows: '234K', size: '156MB', indexes: 10 }
                  ].map((table, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">{table.table}</span>
                        <span className="text-xs text-slate-500">{table.size}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{table.rows} rows</span>
                        <span>{table.indexes} indexes</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm transition-colors">
                  View Schema Diagram
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Backup & Recovery
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-emerald-400">Last Backup</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-400">2 hours ago • Full backup • 12.5 GB</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-lg font-bold text-slate-200">7</div>
                      <div className="text-xs text-slate-500">Daily Backups</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="text-lg font-bold text-slate-200">4</div>
                      <div className="text-xs text-slate-500">Weekly Backups</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs transition-colors">
                      Backup Now
                    </button>
                    <button className="flex-1 px-3 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg text-xs transition-colors">
                      Restore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Architecture Tab */}
        {activeTab === 'architecture' && (
          <motion.div
            key="architecture"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Architecture Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Microservices', value: '24', icon: Boxes, color: 'from-cyan-600 to-blue-600' },
                { label: 'Code Complexity', value: '7.2', icon: Binary, color: 'from-violet-600 to-purple-600' },
                { label: 'Dependencies', value: '167', icon: Package, color: 'from-emerald-600 to-teal-600' },
                { label: 'Tech Debt', value: '947', icon: Bug, color: 'from-rose-600 to-red-600' }
              ].map((metric, idx) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${metric.color} p-6 rounded-xl shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="w-8 h-8 text-white/90" />
                    <span className="text-3xl font-bold text-white">{metric.value}</span>
                  </div>
                  <div className="text-white/80 text-sm">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Code Complexity */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Code Complexity Analysis
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={architectureComplexity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="module" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar dataKey="complexity" fill="#06b6d4" name="Cyclomatic Complexity" />
                  <Bar dataKey="dependencies" fill="#8b5cf6" name="Dependencies" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Technical Debt */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bug className="w-5 h-5 text-rose-400" />
                Technical Debt Breakdown
              </h3>
              <div className="space-y-3">
                {technicalDebt.map((debt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-slate-900/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          debt.severity === 'high' ? 'bg-rose-500' :
                          debt.severity === 'medium' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`} />
                        <span className="text-sm font-medium text-slate-300">{debt.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-200">{debt.count}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          debt.severity === 'high' ? 'bg-rose-500/20 text-rose-400' :
                          debt.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {debt.severity}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Architecture Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-violet-400" />
                  Design Patterns in Use
                </h3>
                <div className="space-y-3">
                  {[
                    { pattern: 'Event-Driven Architecture', usage: 'High', benefit: 'Loose coupling' },
                    { pattern: 'CQRS Pattern', usage: 'Medium', benefit: 'Read/Write separation' },
                    { pattern: 'Microservices', usage: 'High', benefit: 'Scalability' },
                    { pattern: 'Repository Pattern', usage: 'High', benefit: 'Data abstraction' },
                    { pattern: 'Factory Pattern', usage: 'Medium', benefit: 'Object creation' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-300">{item.pattern}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          item.usage === 'High' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.usage}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{item.benefit}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-xl p-6 border border-violet-500/30">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  Architecture Recommendations
                </h3>
                <div className="space-y-3">
                  {[
                    'Implement Circuit Breaker pattern for external API calls',
                    'Add caching layer between API and database',
                    'Consider implementing GraphQL for flexible queries',
                    'Migrate to event sourcing for audit trails',
                    'Implement API versioning strategy'
                  ].map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm transition-colors">
                  View Detailed Analysis
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dev Tools Tab */}
        {activeTab === 'devtools' && (
          <motion.div
            key="devtools"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Feature Flags */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  Feature Flags
                </h3>
                <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-xs transition-colors">
                  New Flag
                </button>
              </div>
              <div className="space-y-3">
                {featureFlags.map((flag, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium text-slate-200">{flag.name}</h4>
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              flag.enabled ? 'bg-emerald-600' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                flag.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{flag.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-400">
                            {flag.environment}
                          </span>
                          <span className="text-xs text-slate-500">Rollout: {flag.rollout}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${flag.rollout}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Development Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  Developer Console
                </h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs mb-4 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <div className="text-emerald-400">$ npm run build</div>
                  <div className="text-slate-500">Building application...</div>
                  <div className="text-blue-400">✓ Smart contracts compiled</div>
                  <div className="text-blue-400">✓ AI models loaded</div>
                  <div className="text-blue-400">✓ Frontend bundled</div>
                  <div className="text-emerald-400">Build completed in 8.4s</div>
                  <div className="text-slate-500 mt-2">$ _</div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                    <Play className="w-3 h-3" />
                    Run Build
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg text-xs transition-colors">
                    Clear Console
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-violet-400" />
                  Code Snippets
                </h3>
                <div className="space-y-3">
                  {[
                    { title: 'Smart Contract Template', lang: 'Solidity' },
                    { title: 'AI Model Integration', lang: 'Python' },
                    { title: 'API Endpoint Boilerplate', lang: 'TypeScript' },
                    { title: 'Database Migration', lang: 'SQL' }
                  ].map((snippet, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-violet-500/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-300">{snippet.title}</div>
                          <div className="text-xs text-slate-500">{snippet.lang}</div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Profiler */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-amber-400" />
                Performance Profiler
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'CPU Time', value: '2.34s', status: 'good' },
                  { label: 'Memory Used', value: '156MB', status: 'good' },
                  { label: 'Network I/O', value: '45KB', status: 'good' }
                ].map((metric, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
                    <div className={`text-2xl font-bold ${
                      metric.status === 'good' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Profiling Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
