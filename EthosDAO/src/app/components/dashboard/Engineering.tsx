import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GitBranch,
  Gauge,
  Shield,
  Zap,
  Database,
  Server,
  Cloud,
  Container,
  Layers,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Code2,
  FileCode,
  TestTube,
  Rocket,
  Eye,
  Lock,
  Cpu,
  HardDrive,
  Network,
  BarChart3,
  LineChart,
  PackageCheck,
  Bug,
  Workflow,
  Terminal,
  Boxes,
  Sparkles
} from 'lucide-react';
import { LineChart as RechartsLine, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type PipelineStage = 'build' | 'test' | 'security' | 'deploy';
type PipelineStatus = 'success' | 'failed' | 'running' | 'pending';

type Pipeline = {
  id: string;
  name: string;
  branch: string;
  commit: string;
  author: string;
  stages: {
    stage: PipelineStage;
    status: PipelineStatus;
    duration: string;
  }[];
  timestamp: string;
  overallStatus: PipelineStatus;
};

type PerformanceMetric = {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
};

type SecurityIssue = {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affected: string;
  status: 'open' | 'in-progress' | 'resolved';
};

type TestSuite = {
  name: string;
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
  duration: string;
};

export function Engineering() {
  const [activeTab, setActiveTab] = useState<'cicd' | 'performance' | 'security' | 'testing' | 'infrastructure'>('cicd');
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);

  // Mock data for CI/CD pipelines
  const pipelines: Pipeline[] = [
    {
      id: 'pipe1',
      name: 'Protocol Smart Contracts',
      branch: 'main',
      commit: 'a3f4b2c',
      author: 'protocol_architect.eth',
      stages: [
        { stage: 'build', status: 'success', duration: '2m 14s' },
        { stage: 'test', status: 'success', duration: '5m 32s' },
        { stage: 'security', status: 'success', duration: '3m 45s' },
        { stage: 'deploy', status: 'success', duration: '1m 52s' }
      ],
      timestamp: '5m ago',
      overallStatus: 'success'
    },
    {
      id: 'pipe2',
      name: 'AI Model Training Pipeline',
      branch: 'feature/federated-learning',
      commit: '7e8d9f1',
      author: 'ml_specialist.eth',
      stages: [
        { stage: 'build', status: 'success', duration: '3m 22s' },
        { stage: 'test', status: 'running', duration: '2m 10s' },
        { stage: 'security', status: 'pending', duration: '-' },
        { stage: 'deploy', status: 'pending', duration: '-' }
      ],
      timestamp: '12m ago',
      overallStatus: 'running'
    },
    {
      id: 'pipe3',
      name: 'Integration SDK',
      branch: 'develop',
      commit: 'c9a1e5b',
      author: 'integration_master.eth',
      stages: [
        { stage: 'build', status: 'success', duration: '1m 45s' },
        { stage: 'test', status: 'failed', duration: '4m 18s' },
        { stage: 'security', status: 'pending', duration: '-' },
        { stage: 'deploy', status: 'pending', duration: '-' }
      ],
      timestamp: '28m ago',
      overallStatus: 'failed'
    }
  ];

  // Performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    {
      name: 'Response Time',
      value: 145,
      target: 200,
      unit: 'ms',
      trend: 'down',
      status: 'good'
    },
    {
      name: 'Throughput',
      value: 2340,
      target: 2000,
      unit: 'req/s',
      trend: 'up',
      status: 'good'
    },
    {
      name: 'Error Rate',
      value: 0.12,
      target: 0.5,
      unit: '%',
      trend: 'down',
      status: 'good'
    },
    {
      name: 'CPU Usage',
      value: 68,
      target: 80,
      unit: '%',
      trend: 'stable',
      status: 'good'
    },
    {
      name: 'Memory Usage',
      value: 72,
      target: 85,
      unit: '%',
      trend: 'up',
      status: 'warning'
    },
    {
      name: 'Smart Contract Gas',
      value: 45000,
      target: 50000,
      unit: 'gas',
      trend: 'down',
      status: 'good'
    }
  ];

  // Security issues
  const securityIssues: SecurityIssue[] = [
    {
      id: 'sec1',
      severity: 'critical',
      title: 'SQL Injection Vulnerability',
      description: 'Unsanitized user input in database query',
      affected: 'API Gateway v2.3.1',
      status: 'in-progress'
    },
    {
      id: 'sec2',
      severity: 'high',
      title: 'Outdated Dependency',
      description: 'OpenSSL version contains known CVE',
      affected: 'Backend Services',
      status: 'open'
    },
    {
      id: 'sec3',
      severity: 'medium',
      title: 'Weak Password Policy',
      description: 'Password requirements below recommended standards',
      affected: 'Authentication Service',
      status: 'resolved'
    },
    {
      id: 'sec4',
      severity: 'low',
      title: 'Missing CORS Headers',
      description: 'Some endpoints missing proper CORS configuration',
      affected: 'REST API',
      status: 'open'
    }
  ];

  // Test suites
  const testSuites: TestSuite[] = [
    {
      name: 'Smart Contract Unit Tests',
      passed: 247,
      failed: 3,
      skipped: 5,
      coverage: 94.2,
      duration: '5m 32s'
    },
    {
      name: 'AI Model Integration Tests',
      passed: 156,
      failed: 0,
      skipped: 2,
      coverage: 88.7,
      duration: '8m 14s'
    },
    {
      name: 'API Endpoint Tests',
      passed: 189,
      failed: 1,
      skipped: 0,
      coverage: 91.5,
      duration: '3m 45s'
    },
    {
      name: 'End-to-End Tests',
      passed: 67,
      failed: 2,
      skipped: 8,
      coverage: 76.3,
      duration: '12m 22s'
    }
  ];

  // Chart data
  const performanceHistory = [
    { time: '00:00', responseTime: 152, throughput: 2100, errorRate: 0.15 },
    { time: '04:00', responseTime: 148, throughput: 2200, errorRate: 0.13 },
    { time: '08:00', responseTime: 165, throughput: 2400, errorRate: 0.18 },
    { time: '12:00', responseTime: 142, throughput: 2350, errorRate: 0.11 },
    { time: '16:00', responseTime: 138, throughput: 2280, errorRate: 0.09 },
    { time: '20:00', responseTime: 145, throughput: 2340, errorRate: 0.12 }
  ];

  const buildTrends = [
    { week: 'W1', success: 45, failed: 5, duration: 8.2 },
    { week: 'W2', success: 52, failed: 3, duration: 7.8 },
    { week: 'W3', success: 48, failed: 7, duration: 8.5 },
    { week: 'W4', success: 58, failed: 2, duration: 7.1 }
  ];

  const infrastructureMetrics = [
    { resource: 'Compute', utilization: 68, capacity: 85 },
    { resource: 'Storage', utilization: 72, capacity: 80 },
    { resource: 'Network', utilization: 45, capacity: 90 },
    { resource: 'Database', utilization: 82, capacity: 88 }
  ];

  const testCoverage = [
    { module: 'Smart Contracts', coverage: 94, target: 95 },
    { module: 'AI Models', coverage: 89, target: 90 },
    { module: 'API Layer', coverage: 92, target: 95 },
    { module: 'Frontend', coverage: 78, target: 85 },
    { module: 'Integration', coverage: 76, target: 80 }
  ];

  const getStatusColor = (status: PipelineStatus | string) => {
    switch (status) {
      case 'success':
      case 'resolved':
      case 'good':
        return 'text-emerald-400 bg-emerald-500/20';
      case 'failed':
      case 'critical':
        return 'text-rose-400 bg-rose-500/20';
      case 'running':
      case 'in-progress':
      case 'warning':
        return 'text-amber-400 bg-amber-500/20';
      case 'pending':
      case 'open':
        return 'text-slate-400 bg-slate-500/20';
      default:
        return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getStageIcon = (stage: PipelineStage) => {
    switch (stage) {
      case 'build': return <Boxes className="w-4 h-4" />;
      case 'test': return <TestTube className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'deploy': return <Rocket className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: PipelineStatus) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'running': return <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Activity className="w-4 h-4 text-amber-400" /></motion.div>;
      case 'pending': return <Clock className="w-4 h-4 text-slate-400" />;
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
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
            Engineering Infrastructure
          </h1>
          <p className="text-slate-400">
            DevOps pipeline, performance monitoring, security, and testing infrastructure
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-emerald-400">All Systems Operational</span>
          </div>
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
          { id: 'cicd', label: 'CI/CD Pipeline', icon: GitBranch },
          { id: 'performance', label: 'Performance', icon: Gauge },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'testing', label: 'Testing', icon: TestTube },
          { id: 'infrastructure', label: 'Infrastructure', icon: Server }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105'
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
        {/* CI/CD Pipeline Tab */}
        {activeTab === 'cicd' && (
          <motion.div
            key="cicd"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Pipeline Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Builds', value: '234', icon: Boxes, color: 'from-violet-600 to-purple-600' },
                { label: 'Success Rate', value: '94.2%', icon: CheckCircle2, color: 'from-emerald-600 to-teal-600' },
                { label: 'Avg Duration', value: '7.1m', icon: Clock, color: 'from-cyan-600 to-blue-600' },
                { label: 'Active Pipelines', value: '3', icon: Activity, color: 'from-amber-600 to-orange-600' }
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

            {/* Recent Pipelines */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-violet-400" />
                Recent Pipeline Runs
              </h3>
              {pipelines.map((pipeline, idx) => (
                <motion.div
                  key={pipeline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedPipeline(pipeline.id === selectedPipeline ? null : pipeline.id)}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-200">{pipeline.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(pipeline.overallStatus)}`}>
                          {pipeline.overallStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-4 h-4" />
                          {pipeline.branch}
                        </span>
                        <span className="flex items-center gap-1">
                          <Code2 className="w-4 h-4" />
                          {pipeline.commit}
                        </span>
                        <span>{pipeline.author}</span>
                        <span>{pipeline.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pipeline Stages */}
                  <div className="grid grid-cols-4 gap-3">
                    {pipeline.stages.map((stage, stageIdx) => (
                      <div
                        key={stageIdx}
                        className={`p-3 rounded-lg border ${
                          stage.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
                          stage.status === 'failed' ? 'bg-rose-500/10 border-rose-500/30' :
                          stage.status === 'running' ? 'bg-amber-500/10 border-amber-500/30' :
                          'bg-slate-500/10 border-slate-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          {getStageIcon(stage.stage)}
                          {getStatusIcon(stage.status)}
                        </div>
                        <div className="text-xs font-medium text-slate-300 mb-1 capitalize">
                          {stage.stage}
                        </div>
                        <div className="text-xs text-slate-500">{stage.duration}</div>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedPipeline === pipeline.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-slate-700/50"
                      >
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Pipeline ID:</span>
                            <span className="text-slate-300 font-mono">{pipeline.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Total Duration:</span>
                            <span className="text-slate-300">
                              {pipeline.stages.reduce((sum, s) => {
                                const match = s.duration.match(/(\d+)m/);
                                return sum + (match ? parseInt(match[1]) : 0);
                              }, 0)}m
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button className="flex-1 px-3 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg transition-colors text-xs">
                              View Logs
                            </button>
                            <button className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors text-xs">
                              Restart Pipeline
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Build Trends Chart */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Build Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={buildTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="week" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar dataKey="success" fill="#10b981" name="Successful Builds" />
                  <Bar dataKey="failed" fill="#ef4444" name="Failed Builds" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-200">{metric.name}</h4>
                    {metric.trend === 'up' ? (
                      <TrendingUp className={`w-5 h-5 ${metric.status === 'good' ? 'text-emerald-400' : 'text-rose-400'}`} />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className={`w-5 h-5 ${metric.status === 'good' ? 'text-emerald-400' : 'text-rose-400'}`} />
                    ) : (
                      <Activity className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-3xl font-bold ${
                      metric.status === 'good' ? 'text-emerald-400' :
                      metric.status === 'warning' ? 'text-amber-400' :
                      'text-rose-400'
                    }`}>
                      {metric.value.toLocaleString()}
                    </span>
                    <span className="text-slate-400 text-sm">{metric.unit}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Target: {metric.target.toLocaleString()} {metric.unit}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-slate-900/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${
                        metric.status === 'good' ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' :
                        metric.status === 'warning' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        'bg-gradient-to-r from-rose-500 to-red-500'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Performance History Chart */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-cyan-400" />
                Performance History (24h)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="responseTime" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Response Time (ms)" />
                  <Area type="monotone" dataKey="throughput" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Throughput (req/s)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* System Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  System Resources
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'CPU Usage', value: 68, icon: Cpu, color: 'cyan' },
                    { name: 'Memory', value: 72, icon: HardDrive, color: 'purple' },
                    { name: 'Disk I/O', value: 45, icon: Database, color: 'emerald' },
                    { name: 'Network', value: 52, icon: Network, color: 'amber' }
                  ].map((resource) => (
                    <div key={resource.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <resource.icon className={`w-4 h-4 text-${resource.color}-400`} />
                          <span className="text-sm text-slate-300">{resource.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{resource.value}%</span>
                      </div>
                      <div className="w-full bg-slate-900/50 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${resource.value}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full rounded-full bg-${resource.color}-500`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Optimization Recommendations
                </h3>
                <div className="space-y-3">
                  {[
                    { title: 'Enable Response Caching', impact: 'High', savings: '30% faster' },
                    { title: 'Optimize Database Queries', impact: 'Medium', savings: '15% reduction' },
                    { title: 'Implement CDN', impact: 'High', savings: '40% bandwidth' },
                    { title: 'Compress Static Assets', impact: 'Low', savings: '10% size' }
                  ].map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-200">{rec.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            rec.impact === 'High' ? 'bg-rose-500/20 text-rose-400' :
                            rec.impact === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {rec.impact}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400">{rec.savings}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Security Score', value: '8.7/10', icon: Shield, color: 'from-emerald-600 to-teal-600' },
                { label: 'Critical Issues', value: '1', icon: AlertTriangle, color: 'from-rose-600 to-red-600' },
                { label: 'Last Audit', value: '2d ago', icon: Eye, color: 'from-cyan-600 to-blue-600' },
                { label: 'Compliance', value: '98%', icon: CheckCircle2, color: 'from-violet-600 to-purple-600' }
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

            {/* Security Issues */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-400" />
                  Security Issues ({securityIssues.length})
                </h3>
                <button className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-lg transition-all flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Run Security Scan
                </button>
              </div>

              {securityIssues.map((issue, idx) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(issue.severity)}`} />
                      <div>
                        <h4 className="font-semibold text-slate-200">{issue.title}</h4>
                        <p className="text-sm text-slate-400 mt-1">{issue.description}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs capitalize ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className={`px-2 py-1 rounded text-xs capitalize ${getSeverityColor(issue.severity)} text-white`}>
                        {issue.severity}
                      </span>
                      <span>Affected: {issue.affected}</span>
                    </div>
                    {issue.status !== 'resolved' && (
                      <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-xs transition-colors">
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security Tools */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Security Tools
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Smart Contract Audit', status: 'active', lastRun: '2h ago' },
                    { name: 'Dependency Scanner', status: 'active', lastRun: '1d ago' },
                    { name: 'SAST Analysis', status: 'pending', lastRun: '3d ago' },
                    { name: 'Penetration Testing', status: 'scheduled', lastRun: '1w ago' }
                  ].map((tool, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-200">{tool.name}</div>
                        <div className="text-xs text-slate-500">Last run: {tool.lastRun}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tool.status)}`}>
                        {tool.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-xl p-6 border border-violet-500/30">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  AI Security Assistant
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">
                    Our AI has analyzed your codebase and identified potential security improvements:
                  </p>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Implement rate limiting on API endpoints',
                      'Add input validation for user-supplied data',
                      'Enable HTTPS-only cookies',
                      'Update authentication token expiration'
                    ].map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors text-sm">
                    Apply AI Recommendations
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Testing Tab */}
        {activeTab === 'testing' && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Test Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Tests', value: '770', icon: TestTube, color: 'from-cyan-600 to-blue-600' },
                { label: 'Passed', value: '759', icon: CheckCircle2, color: 'from-emerald-600 to-teal-600' },
                { label: 'Failed', value: '6', icon: XCircle, color: 'from-rose-600 to-red-600' },
                { label: 'Coverage', value: '87.2%', icon: BarChart3, color: 'from-violet-600 to-purple-600' }
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

            {/* Test Suites */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-cyan-400" />
                Test Suites
              </h3>
              {testSuites.map((suite, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-200">{suite.name}</h4>
                    <span className="text-sm text-slate-400">{suite.duration}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">{suite.passed}</div>
                      <div className="text-xs text-slate-500">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-400">{suite.failed}</div>
                      <div className="text-xs text-slate-500">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-400">{suite.skipped}</div>
                      <div className="text-xs text-slate-500">Skipped</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-violet-400">{suite.coverage}%</div>
                      <div className="text-xs text-slate-500">Coverage</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-900/50 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(suite.passed / (suite.passed + suite.failed + suite.skipped)) * 100}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                      />
                    </div>
                    <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded text-xs transition-colors">
                      Run Tests
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Test Coverage Chart */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-violet-400" />
                Test Coverage by Module
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={testCoverage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="module" type="category" stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar dataKey="coverage" fill="#8b5cf6" name="Current Coverage %" />
                  <Bar dataKey="target" fill="#06b6d4" name="Target Coverage %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Infrastructure Tab */}
        {activeTab === 'infrastructure' && (
          <motion.div
            key="infrastructure"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Infrastructure Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Services', value: '24', icon: Server, color: 'from-cyan-600 to-blue-600' },
                { label: 'Containers', value: '156', icon: Container, color: 'from-violet-600 to-purple-600' },
                { label: 'Uptime', value: '99.97%', icon: Activity, color: 'from-emerald-600 to-teal-600' },
                { label: 'Regions', value: '5', icon: Cloud, color: 'from-amber-600 to-orange-600' }
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

            {/* Infrastructure Resources */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Resource Utilization
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={infrastructureMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="resource" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Legend />
                  <Bar dataKey="utilization" fill="#8b5cf6" name="Current Utilization %" />
                  <Bar dataKey="capacity" fill="#10b981" name="Total Capacity %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Service Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-violet-400" />
                  Core Services
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'API Gateway', status: 'operational', load: 68 },
                    { name: 'Database Cluster', status: 'operational', load: 72 },
                    { name: 'Cache Layer', status: 'operational', load: 45 },
                    { name: 'Message Queue', status: 'degraded', load: 89 }
                  ].map((service, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            service.status === 'operational' ? 'bg-emerald-400' :
                            service.status === 'degraded' ? 'bg-amber-400' :
                            'bg-rose-400'
                          }`} />
                          <span className="text-sm font-medium text-slate-200">{service.name}</span>
                        </div>
                        <span className="text-xs text-slate-400">{service.load}% load</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${service.load}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full rounded-full ${
                            service.load < 70 ? 'bg-emerald-500' :
                            service.load < 85 ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Container className="w-5 h-5 text-emerald-400" />
                  Container Orchestration
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-400">142</div>
                      <div className="text-xs text-slate-400">Running</div>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-400">8</div>
                      <div className="text-xs text-slate-400">Pending</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Workflow className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-cyan-400 mb-1">Auto-scaling Active</div>
                        <p className="text-xs text-slate-400">
                          System automatically scaled up 12 containers in response to increased load
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors text-sm">
                    View Orchestration Dashboard
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
