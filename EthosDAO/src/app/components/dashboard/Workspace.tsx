import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Brain, 
  Workflow,
  Users,
  Zap,
  GitBranch,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Blocks,
  Sparkles,
  Terminal,
  Network,
  PlayCircle,
  Activity,
  ChevronRight,
  Bot,
  Cpu,
  Database,
  Lock,
  Send,
  Search
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Role = 'protocol' | 'ai' | 'integrator' | 'all';

type TeamMember = {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  expertise: string[];
};

type Project = {
  id: string;
  name: string;
  description: string;
  roles: Role[];
  progress: number;
  status: 'active' | 'review' | 'completed';
  tasks: number;
  completedTasks: number;
  priority: 'high' | 'medium' | 'low';
};

type AIAgent = {
  id: string;
  name: string;
  type: 'code-review' | 'optimizer' | 'security' | 'integration-helper' | 'protocol-analyzer';
  icon: string;
  status: 'active' | 'idle' | 'processing';
  tasksCompleted: number;
  accuracy: number;
};

type Integration = {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  uptime: number;
  requests: number;
  latency: number;
};

export function Workspace() {
  const [activeRole, setActiveRole] = useState<Role>('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'ai-agents' | 'integrations'>('overview');

  // Mock data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'protocol_architect.eth',
      role: 'protocol',
      avatar: 'https://i.pravatar.cc/150?u=protocol1',
      status: 'online',
      expertise: ['Smart Contracts', 'Consensus', 'Tokenomics']
    },
    {
      id: '2',
      name: 'ml_specialist.eth',
      role: 'ai',
      avatar: 'https://i.pravatar.cc/150?u=ai1',
      status: 'online',
      expertise: ['NLP', 'Reinforcement Learning', 'Model Optimization']
    },
    {
      id: '3',
      name: 'integration_master.eth',
      role: 'integrator',
      avatar: 'https://i.pravatar.cc/150?u=int1',
      status: 'away',
      expertise: ['API Design', 'Microservices', 'DevOps']
    },
    {
      id: '4',
      name: 'blockchain_dev.eth',
      role: 'protocol',
      avatar: 'https://i.pravatar.cc/150?u=protocol2',
      status: 'online',
      expertise: ['ZK Proofs', 'Layer 2', 'Security']
    },
    {
      id: '5',
      name: 'ai_researcher.eth',
      role: 'ai',
      avatar: 'https://i.pravatar.cc/150?u=ai2',
      status: 'offline',
      expertise: ['Computer Vision', 'GANs', 'Transfer Learning']
    },
    {
      id: '6',
      name: 'systems_integrator.eth',
      role: 'integrator',
      avatar: 'https://i.pravatar.cc/150?u=int2',
      status: 'online',
      expertise: ['Cloud Architecture', 'Orchestration', 'Monitoring']
    }
  ];

  const projects: Project[] = [
    {
      id: 'proj1',
      name: 'Decentralized AI Inference Layer',
      description: 'Build a protocol layer for distributed AI model inference with verifiable computation',
      roles: ['protocol', 'ai', 'integrator'],
      progress: 68,
      status: 'active',
      tasks: 24,
      completedTasks: 16,
      priority: 'high'
    },
    {
      id: 'proj2',
      name: 'Cross-Chain ML Model Registry',
      description: 'Create an interoperable registry for AI models across multiple blockchains',
      roles: ['protocol', 'ai'],
      progress: 42,
      status: 'active',
      tasks: 18,
      completedTasks: 8,
      priority: 'high'
    },
    {
      id: 'proj3',
      name: 'Federated Learning Marketplace',
      description: 'Develop a marketplace for privacy-preserving federated learning contributions',
      roles: ['ai', 'protocol', 'integrator'],
      progress: 85,
      status: 'review',
      tasks: 31,
      completedTasks: 26,
      priority: 'medium'
    },
    {
      id: 'proj4',
      name: 'Integration SDK for AI Agents',
      description: 'SDK enabling seamless integration of AI agents with Web3 protocols',
      roles: ['integrator', 'ai'],
      progress: 91,
      status: 'review',
      tasks: 12,
      completedTasks: 11,
      priority: 'low'
    }
  ];

  const aiAgents: AIAgent[] = [
    {
      id: 'agent1',
      name: 'CodeGuardian',
      type: 'code-review',
      icon: 'Shield',
      status: 'active',
      tasksCompleted: 1247,
      accuracy: 96.8
    },
    {
      id: 'agent2',
      name: 'OptimizerPro',
      type: 'optimizer',
      icon: 'Zap',
      status: 'processing',
      tasksCompleted: 892,
      accuracy: 94.2
    },
    {
      id: 'agent3',
      name: 'SecurityScan',
      type: 'security',
      icon: 'Lock',
      status: 'active',
      tasksCompleted: 2103,
      accuracy: 98.5
    },
    {
      id: 'agent4',
      name: 'IntegrationHelper',
      type: 'integration-helper',
      icon: 'Network',
      status: 'idle',
      tasksCompleted: 654,
      accuracy: 92.1
    },
    {
      id: 'agent5',
      name: 'ProtocolAnalyzer',
      type: 'protocol-analyzer',
      icon: 'Blocks',
      status: 'active',
      tasksCompleted: 1568,
      accuracy: 95.7
    }
  ];

  const integrations: Integration[] = [
    {
      id: 'int1',
      name: 'Ethereum Mainnet',
      type: 'Blockchain',
      status: 'connected',
      uptime: 99.97,
      requests: 45678,
      latency: 145
    },
    {
      id: 'int2',
      name: 'IPFS Gateway',
      type: 'Storage',
      status: 'connected',
      uptime: 99.85,
      requests: 23401,
      latency: 89
    },
    {
      id: 'int3',
      name: 'The Graph Indexer',
      type: 'Data Query',
      status: 'connected',
      uptime: 99.92,
      requests: 67234,
      latency: 67
    },
    {
      id: 'int4',
      name: 'Chainlink Oracle',
      type: 'Oracle',
      status: 'error',
      uptime: 98.45,
      requests: 12567,
      latency: 234
    },
    {
      id: 'int5',
      name: 'AI Model API',
      type: 'ML Service',
      status: 'connected',
      uptime: 99.78,
      requests: 89012,
      latency: 312
    }
  ];

  // Mock chart data
  const collaborationData = [
    { week: 'Week 1', protocol: 45, ai: 38, integration: 42 },
    { week: 'Week 2', protocol: 52, ai: 44, integration: 49 },
    { week: 'Week 3', protocol: 48, ai: 51, integration: 47 },
    { week: 'Week 4', protocol: 61, ai: 58, integration: 54 }
  ];

  const skillsData = [
    { skill: 'Smart Contracts', protocol: 95, ai: 45, integration: 60 },
    { skill: 'ML/AI', protocol: 40, ai: 98, integration: 55 },
    { skill: 'System Integration', protocol: 50, ai: 50, integration: 95 },
    { skill: 'DevOps', protocol: 65, ai: 60, integration: 92 },
    { skill: 'Security', protocol: 88, ai: 70, integration: 82 },
    { skill: 'Data Engineering', protocol: 55, ai: 85, integration: 78 }
  ];

  const productivityData = [
    { day: 'Mon', tasks: 12, commits: 34, reviews: 8 },
    { day: 'Tue', tasks: 15, commits: 42, reviews: 12 },
    { day: 'Wed', tasks: 18, commits: 38, reviews: 10 },
    { day: 'Thu', tasks: 14, commits: 45, reviews: 15 },
    { day: 'Fri', tasks: 20, commits: 51, reviews: 18 }
  ];

  const filteredMembers = activeRole === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.role === activeRole);

  const filteredProjects = activeRole === 'all'
    ? projects
    : projects.filter(p => p.roles.includes(activeRole));

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'protocol': return <Code2 className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'integrator': return <Workflow className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case 'protocol': return 'from-violet-600 to-indigo-600';
      case 'ai': return 'from-cyan-600 to-blue-600';
      case 'integrator': return 'from-emerald-600 to-teal-600';
      default: return 'from-slate-600 to-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': 
      case 'connected':
      case 'active': 
        return 'bg-emerald-500';
      case 'away':
      case 'processing':
        return 'bg-amber-500';
      case 'offline':
      case 'disconnected':
      case 'idle':
        return 'bg-slate-500';
      case 'error':
        return 'bg-rose-500';
      default: return 'bg-slate-500';
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
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 text-transparent bg-clip-text">
            Collective Workspace
          </h1>
          <p className="text-slate-400">
            Cross-functional collaboration hub for protocol engineering, AI development, and systems integration
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg transition-all flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            New Collaboration
          </button>
        </div>
      </motion.div>

      {/* Role Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { id: 'all', label: 'All Teams', icon: Users },
          { id: 'protocol', label: 'Protocol Engineers', icon: Code2 },
          { id: 'ai', label: 'AI Engineers', icon: Brain },
          { id: 'integrator', label: 'Integrators', icon: Workflow }
        ].map((role) => (
          <button
            key={role.id}
            onClick={() => setActiveRole(role.id as Role)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeRole === role.id
                ? 'bg-gradient-to-r ' + getRoleColor(role.id as Role) + ' text-white shadow-lg scale-105'
                : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
            }`}
          >
            <role.icon className="w-4 h-4" />
            {role.label}
          </button>
        ))}
      </motion.div>

      {/* Main Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden"
      >
        <div className="flex border-b border-slate-700/50">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'projects', label: 'Projects', icon: Blocks },
            { id: 'ai-agents', label: 'AI Agents', icon: Bot },
            { id: 'integrations', label: 'Integrations', icon: Network }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Members', value: filteredMembers.length, icon: Users, color: 'from-violet-600 to-indigo-600' },
                    { label: 'Active Projects', value: filteredProjects.filter(p => p.status === 'active').length, icon: Blocks, color: 'from-cyan-600 to-blue-600' },
                    { label: 'AI Agents', value: aiAgents.filter(a => a.status === 'active').length, icon: Bot, color: 'from-emerald-600 to-teal-600' },
                    { label: 'Integrations', value: integrations.filter(i => i.status === 'connected').length, icon: Network, color: 'from-amber-600 to-orange-600' }
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

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Collaboration Activity */}
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                      Collaboration Activity
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={collaborationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="week" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          labelStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="protocol" stroke="#8b5cf6" strokeWidth={2} name="Protocol" />
                        <Line type="monotone" dataKey="ai" stroke="#06b6d4" strokeWidth={2} name="AI" />
                        <Line type="monotone" dataKey="integration" stroke="#10b981" strokeWidth={2} name="Integration" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Skills Radar */}
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-400" />
                      Cross-Functional Skills
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={skillsData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
                        <PolarRadiusAxis stroke="#94a3b8" />
                        <Radar name="Protocol" dataKey="protocol" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                        <Radar name="AI" dataKey="ai" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                        <Radar name="Integration" dataKey="integration" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Team Members & Real-time Chat */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Team Members */}
                  <div className="lg:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                      Team Members ({filteredMembers.length})
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
                      {filteredMembers.map((member) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors border border-slate-700/30"
                        >
                          <div className="relative">
                            <img 
                              src={member.avatar} 
                              alt={member.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-slate-900`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-200 truncate">{member.name}</span>
                              <div className={`p-1 rounded-md bg-gradient-to-r ${getRoleColor(member.role)}`}>
                                {getRoleIcon(member.role)}
                              </div>
                            </div>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {member.expertise.map((skill, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Collaboration Chat */}
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      Collaboration Feed
                    </h3>
                    <div className="flex-1 space-y-3 mb-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                      {[
                        { user: 'protocol_architect.eth', msg: 'Updated consensus mechanism', time: '2m ago', role: 'protocol' },
                        { user: 'ml_specialist.eth', msg: 'AI model accuracy improved to 96%', time: '5m ago', role: 'ai' },
                        { user: 'integration_master.eth', msg: 'API gateway deployed', time: '12m ago', role: 'integrator' },
                        { user: 'blockchain_dev.eth', msg: 'Security audit completed', time: '18m ago', role: 'protocol' }
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="p-3 bg-slate-900/50 rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1 rounded bg-gradient-to-r ${getRoleColor(item.role as Role)}`}>
                              {getRoleIcon(item.role as Role)}
                            </div>
                            <span className="font-medium text-slate-300 text-xs">{item.user}</span>
                            <span className="text-slate-500 text-xs ml-auto">{item.time}</span>
                          </div>
                          <p className="text-slate-400 text-xs">{item.msg}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Share an update..."
                        className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                      />
                      <button className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Active Projects ({filteredProjects.length})</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredProjects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
                      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                              {project.name}
                            </h4>
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              project.priority === 'high' ? 'bg-rose-500/20 text-rose-400' :
                              project.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {project.priority}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {project.roles.map((role) => (
                              <div key={role} className={`flex items-center gap-1 px-2 py-1 rounded bg-gradient-to-r ${getRoleColor(role)} text-xs`}>
                                {getRoleIcon(role)}
                                <span className="capitalize">{role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className={`p-2 rounded-lg ${
                          project.status === 'active' ? 'bg-emerald-500/20' :
                          project.status === 'review' ? 'bg-amber-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {project.status === 'active' ? <PlayCircle className="w-5 h-5 text-emerald-400" /> :
                           project.status === 'review' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                           <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-300 font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-900/50 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={`h-full rounded-full bg-gradient-to-r ${
                              project.progress >= 80 ? 'from-emerald-500 to-cyan-500' :
                              project.progress >= 50 ? 'from-cyan-500 to-blue-500' :
                              'from-violet-500 to-purple-500'
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>{project.completedTasks}/{project.tasks} tasks completed</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedProject === project.id ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedProject === project.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-slate-700/50"
                          >
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-slate-300">Recent Activity</h5>
                              {[
                                { action: 'Smart contract deployed', user: 'protocol_architect.eth', time: '1h ago' },
                                { action: 'ML model trained', user: 'ml_specialist.eth', time: '3h ago' },
                                { action: 'Integration tests passed', user: 'integration_master.eth', time: '5h ago' }
                              ].map((activity, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                                  <div className="flex-1">
                                    <p className="text-slate-300">{activity.action}</p>
                                    <p className="text-slate-500">{activity.user} • {activity.time}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* Productivity Chart */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-violet-400" />
                    Team Productivity
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#f1f5f9' }}
                      />
                      <Legend />
                      <Bar dataKey="tasks" fill="#8b5cf6" name="Tasks Completed" />
                      <Bar dataKey="commits" fill="#06b6d4" name="Code Commits" />
                      <Bar dataKey="reviews" fill="#10b981" name="Code Reviews" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* AI Agents Tab */}
            {activeTab === 'ai-agents' && (
              <motion.div
                key="ai-agents"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">AI Development Assistants</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition-all flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" />
                    Deploy New Agent
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiAgents.map((agent, idx) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${
                            agent.status === 'active' ? 'from-emerald-600 to-cyan-600' :
                            agent.status === 'processing' ? 'from-amber-600 to-orange-600' :
                            'from-slate-600 to-slate-700'
                          }`}>
                            {agent.type === 'code-review' && <CheckCircle2 className="w-6 h-6" />}
                            {agent.type === 'optimizer' && <Zap className="w-6 h-6" />}
                            {agent.type === 'security' && <Lock className="w-6 h-6" />}
                            {agent.type === 'integration-helper' && <Network className="w-6 h-6" />}
                            {agent.type === 'protocol-analyzer' && <Blocks className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-200">{agent.name}</h4>
                            <p className="text-xs text-slate-400 capitalize">{agent.type.replace('-', ' ')}</p>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${agent.status === 'processing' ? 'animate-pulse' : ''}`} />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Tasks Completed</span>
                          <span className="text-lg font-bold text-slate-200">{agent.tasksCompleted.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">Accuracy</span>
                          <span className="text-lg font-bold text-emerald-400">{agent.accuracy}%</span>
                        </div>
                        <div className="w-full bg-slate-900/50 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.accuracy}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                          />
                        </div>
                        <div className="pt-2">
                          <button className="w-full px-3 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg transition-all text-sm flex items-center justify-center gap-2 text-slate-300">
                            <Terminal className="w-4 h-4" />
                            View Logs
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* AI Agent Capabilities */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    AI-Powered Capabilities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Automated Code Review',
                        desc: 'AI agents scan commits for bugs, style issues, and security vulnerabilities',
                        icon: CheckCircle2,
                        color: 'emerald'
                      },
                      {
                        title: 'Gas Optimization',
                        desc: 'Automatically suggests optimizations to reduce transaction costs',
                        icon: Zap,
                        color: 'amber'
                      },
                      {
                        title: 'Security Analysis',
                        desc: 'Continuous monitoring for common attack vectors and vulnerabilities',
                        icon: Lock,
                        color: 'rose'
                      },
                      {
                        title: 'Integration Assistant',
                        desc: 'Helps configure and troubleshoot API and service integrations',
                        icon: Network,
                        color: 'blue'
                      },
                      {
                        title: 'Protocol Analysis',
                        desc: 'Analyzes protocol design patterns and suggests improvements',
                        icon: Blocks,
                        color: 'violet'
                      },
                      {
                        title: 'Smart Documentation',
                        desc: 'Auto-generates technical documentation from code and comments',
                        icon: Bot,
                        color: 'cyan'
                      }
                    ].map((capability, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 p-4 bg-slate-900/50 rounded-lg"
                      >
                        <div className={`p-2 rounded-lg bg-${capability.color}-500/20 h-fit`}>
                          <capability.icon className={`w-5 h-5 text-${capability.color}-400`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-200 mb-1">{capability.title}</h4>
                          <p className="text-sm text-slate-400">{capability.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <motion.div
                key="integrations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">System Integrations</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg transition-all flex items-center gap-2 text-sm">
                    <Workflow className="w-4 h-4" />
                    Add Integration
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {integrations.map((integration, idx) => (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            integration.status === 'connected' ? 'bg-emerald-500/20' :
                            integration.status === 'error' ? 'bg-rose-500/20' :
                            'bg-slate-500/20'
                          }`}>
                            {integration.type === 'Blockchain' && <GitBranch className={`w-6 h-6 ${
                              integration.status === 'connected' ? 'text-emerald-400' : 'text-slate-400'
                            }`} />}
                            {integration.type === 'Storage' && <Database className={`w-6 h-6 ${
                              integration.status === 'connected' ? 'text-emerald-400' : 'text-slate-400'
                            }`} />}
                            {integration.type === 'Data Query' && <Activity className={`w-6 h-6 ${
                              integration.status === 'connected' ? 'text-emerald-400' : 'text-slate-400'
                            }`} />}
                            {integration.type === 'Oracle' && <Zap className={`w-6 h-6 ${
                              integration.status === 'connected' ? 'text-emerald-400' : 'text-rose-400'
                            }`} />}
                            {integration.type === 'ML Service' && <Brain className={`w-6 h-6 ${
                              integration.status === 'connected' ? 'text-emerald-400' : 'text-slate-400'
                            }`} />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                              {integration.name}
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`} />
                            </h4>
                            <p className="text-sm text-slate-400">{integration.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-sm capitalize ${
                          integration.status === 'connected' ? 'bg-emerald-500/20 text-emerald-400' :
                          integration.status === 'error' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {integration.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400 mb-1">Uptime</div>
                          <div className="text-lg font-bold text-slate-200">{integration.uptime}%</div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400 mb-1">Requests</div>
                          <div className="text-lg font-bold text-slate-200">{integration.requests.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-3">
                          <div className="text-xs text-slate-400 mb-1">Latency</div>
                          <div className="text-lg font-bold text-slate-200">{integration.latency}ms</div>
                        </div>
                      </div>

                      {integration.status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-rose-400">Connection error detected</p>
                            <p className="text-xs text-slate-400 mt-1">Check API credentials and network connectivity</p>
                          </div>
                          <button className="px-3 py-1 bg-rose-600 hover:bg-rose-500 rounded text-xs transition-colors">
                            Retry
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Integration Architecture Diagram */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Network className="w-5 h-5 text-emerald-400" />
                    Integration Architecture
                  </h3>
                  <div className="flex items-center justify-center min-h-[200px]">
                    <div className="grid grid-cols-3 gap-8 max-w-4xl w-full">
                      {/* Protocol Layer */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                      >
                        <div className="text-center mb-4">
                          <div className="inline-block p-3 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl mb-2">
                            <Code2 className="w-8 h-8" />
                          </div>
                          <div className="font-semibold">Protocol Layer</div>
                        </div>
                        {integrations.filter(i => i.type === 'Blockchain' || i.type === 'Oracle').map((item) => (
                          <div key={item.id} className="p-2 bg-slate-900/50 rounded-lg text-xs text-center">
                            {item.name}
                          </div>
                        ))}
                      </motion.div>

                      {/* AI Layer */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                      >
                        <div className="text-center mb-4">
                          <div className="inline-block p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl mb-2">
                            <Brain className="w-8 h-8" />
                          </div>
                          <div className="font-semibold">AI Layer</div>
                        </div>
                        {integrations.filter(i => i.type === 'ML Service').map((item) => (
                          <div key={item.id} className="p-2 bg-slate-900/50 rounded-lg text-xs text-center">
                            {item.name}
                          </div>
                        ))}
                        <div className="p-2 bg-slate-900/50 rounded-lg text-xs text-center">
                          AI Agents Pool
                        </div>
                      </motion.div>

                      {/* Data Layer */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="text-center mb-4">
                          <div className="inline-block p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl mb-2">
                            <Database className="w-8 h-8" />
                          </div>
                          <div className="font-semibold">Data Layer</div>
                        </div>
                        {integrations.filter(i => i.type === 'Storage' || i.type === 'Data Query').map((item) => (
                          <div key={item.id} className="p-2 bg-slate-900/50 rounded-lg text-xs text-center">
                            {item.name}
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
