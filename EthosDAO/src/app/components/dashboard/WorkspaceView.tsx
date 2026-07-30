import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Brain,
  Workflow,
  GitBranch,
  MessageSquare,
  FileCode,
  Terminal,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Users,
  Plus,
  X,
  Send,
  Paperclip,
  Sparkles,
  Zap,
  Database,
  Lock,
  Activity
} from 'lucide-react';

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
type Priority = 'high' | 'medium' | 'low';

type Task = {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
    role: 'protocol' | 'ai' | 'integrator';
  };
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  labels: string[];
};

type CodeReview = {
  id: string;
  title: string;
  author: string;
  status: 'pending' | 'approved' | 'changes-requested';
  comments: number;
  linesChanged: number;
  timestamp: string;
};

type Message = {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
  role: 'protocol' | 'ai' | 'integrator';
};

export function WorkspaceView() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [activePanel, setActivePanel] = useState<'tasks' | 'code' | 'chat'>('tasks');

  // Mock data
  const tasks: Task[] = [
    {
      id: 'task1',
      title: 'Implement ZK-SNARK verification layer',
      description: 'Create smart contract functions for zero-knowledge proof verification in the consensus layer',
      assignee: {
        name: 'protocol_architect.eth',
        avatar: 'https://i.pravatar.cc/150?u=protocol1',
        role: 'protocol'
      },
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-01-25',
      labels: ['Smart Contracts', 'Cryptography', 'Security']
    },
    {
      id: 'task2',
      title: 'Train federated learning model',
      description: 'Develop and train distributed ML model for privacy-preserving inference',
      assignee: {
        name: 'ml_specialist.eth',
        avatar: 'https://i.pravatar.cc/150?u=ai1',
        role: 'ai'
      },
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-01-24',
      labels: ['ML', 'Privacy', 'Federated Learning']
    },
    {
      id: 'task3',
      title: 'Build integration SDK for Web3 providers',
      description: 'Create SDK that enables seamless integration with multiple Web3 wallet providers',
      assignee: {
        name: 'integration_master.eth',
        avatar: 'https://i.pravatar.cc/150?u=int1',
        role: 'integrator'
      },
      status: 'review',
      priority: 'medium',
      dueDate: '2026-01-26',
      labels: ['SDK', 'Integration', 'Web3']
    },
    {
      id: 'task4',
      title: 'Optimize gas costs for multi-sig transactions',
      description: 'Refactor smart contract code to reduce gas consumption in multi-signature operations',
      assignee: {
        name: 'blockchain_dev.eth',
        avatar: 'https://i.pravatar.cc/150?u=protocol2',
        role: 'protocol'
      },
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-01-28',
      labels: ['Gas Optimization', 'Smart Contracts']
    },
    {
      id: 'task5',
      title: 'Implement AI model compression',
      description: 'Compress ML model for efficient on-chain or edge deployment',
      assignee: {
        name: 'ai_researcher.eth',
        avatar: 'https://i.pravatar.cc/150?u=ai2',
        role: 'ai'
      },
      status: 'done',
      priority: 'low',
      dueDate: '2026-01-22',
      labels: ['Optimization', 'Compression', 'ML']
    }
  ];

  const codeReviews: CodeReview[] = [
    {
      id: 'pr1',
      title: 'feat: Add verifiable computation proofs',
      author: 'protocol_architect.eth',
      status: 'pending',
      comments: 3,
      linesChanged: 247,
      timestamp: '2h ago'
    },
    {
      id: 'pr2',
      title: 'refactor: Optimize inference latency',
      author: 'ml_specialist.eth',
      status: 'approved',
      comments: 8,
      linesChanged: 156,
      timestamp: '5h ago'
    },
    {
      id: 'pr3',
      title: 'fix: Integration SDK connection pooling',
      author: 'integration_master.eth',
      status: 'changes-requested',
      comments: 12,
      linesChanged: 89,
      timestamp: '1d ago'
    }
  ];

  const messages: Message[] = [
    {
      id: 'msg1',
      sender: 'protocol_architect.eth',
      avatar: 'https://i.pravatar.cc/150?u=protocol1',
      message: 'Just pushed the ZK-SNARK verification module. Ready for review!',
      timestamp: '10:45 AM',
      role: 'protocol'
    },
    {
      id: 'msg2',
      sender: 'ml_specialist.eth',
      avatar: 'https://i.pravatar.cc/150?u=ai1',
      message: 'Model accuracy improved to 96.8%. Need protocol team to test integration.',
      timestamp: '11:12 AM',
      role: 'ai'
    },
    {
      id: 'msg3',
      sender: 'integration_master.eth',
      avatar: 'https://i.pravatar.cc/150?u=int1',
      message: 'SDK is stable. All integration tests passing. 🎉',
      timestamp: '11:34 AM',
      role: 'integrator'
    }
  ];

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'review': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'done': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getRoleColor = (role: 'protocol' | 'ai' | 'integrator') => {
    switch (role) {
      case 'protocol': return 'from-violet-600 to-indigo-600';
      case 'ai': return 'from-cyan-600 to-blue-600';
      case 'integrator': return 'from-emerald-600 to-teal-600';
    }
  };

  const getRoleIcon = (role: 'protocol' | 'ai' | 'integrator') => {
    switch (role) {
      case 'protocol': return <Code2 className="w-3 h-3" />;
      case 'ai': return <Brain className="w-3 h-3" />;
      case 'integrator': return <Workflow className="w-3 h-3" />;
    }
  };

  const getReviewStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'changes-requested': return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default: return null;
    }
  };

  const groupedTasks = {
    'todo': tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    'review': tasks.filter(t => t.status === 'review'),
    'done': tasks.filter(t => t.status === 'done')
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Panel Selector */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'tasks', label: 'Task Board', icon: CheckCircle2 },
          { id: 'code', label: 'Code Reviews', icon: GitBranch },
          { id: 'chat', label: 'Team Chat', icon: MessageSquare }
        ].map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id as any)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              activePanel === panel.id
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
          >
            <panel.icon className="w-4 h-4" />
            {panel.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Task Board */}
        {activePanel === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 grid grid-cols-4 gap-4 overflow-hidden"
          >
            {Object.entries(groupedTasks).map(([status, statusTasks]) => (
              <div key={status} className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold capitalize text-slate-200">
                      {status.replace('-', ' ')}
                    </h3>
                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {statusTasks.length}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2">
                  {statusTasks.map((task, idx) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedTask(task.id === selectedTask ? null : task.id)}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`w-1 h-1 rounded-full ${getPriorityColor(task.priority)} mt-2`} />
                        <div className={`p-1 rounded bg-gradient-to-r ${getRoleColor(task.assignee.role)}`}>
                          {getRoleIcon(task.assignee.role)}
                        </div>
                      </div>

                      <h4 className="font-medium text-slate-200 text-sm mb-2 group-hover:text-cyan-400 transition-colors">
                        {task.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.labels.map((label, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-900/50 text-slate-400 rounded">
                            {label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full border border-slate-600"
                        />
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          {task.dueDate}
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedTask === task.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 pt-3 border-t border-slate-700/50"
                          >
                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Assigned to:</span>
                                <span className="text-slate-300">{task.assignee.name}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Priority:</span>
                                <span className={`capitalize ${
                                  task.priority === 'high' ? 'text-rose-400' :
                                  task.priority === 'medium' ? 'text-amber-400' :
                                  'text-blue-400'
                                }`}>{task.priority}</span>
                              </div>
                              <button className="w-full mt-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-xs transition-colors">
                                View Details
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Code Reviews */}
        {activePanel === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Open Pull Requests</h3>
              <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg flex items-center gap-2 transition-all text-sm">
                <GitBranch className="w-4 h-4" />
                Create PR
              </button>
            </div>

            <div className="space-y-3">
              {codeReviews.map((pr, idx) => (
                <motion.div
                  key={pr.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-violet-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getReviewStatusIcon(pr.status)}
                        <h4 className="font-semibold text-slate-200">{pr.title}</h4>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {pr.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {pr.comments} comments
                        </span>
                        <span className="flex items-center gap-1">
                          <FileCode className="w-4 h-4" />
                          +{pr.linesChanged} lines
                        </span>
                        <span>{pr.timestamp}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs capitalize ${
                      pr.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                      pr.status === 'changes-requested' ? 'bg-rose-500/20 text-rose-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {pr.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-slate-900/50 hover:bg-slate-900/70 rounded-lg text-sm transition-colors">
                      <Terminal className="w-4 h-4 inline mr-2" />
                      View Code
                    </button>
                    {pr.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm transition-colors">
                          <CheckCircle2 className="w-4 h-4 inline mr-2" />
                          Approve
                        </button>
                        <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-sm transition-colors">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          Request Changes
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Code Analysis */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl p-6 border border-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-600/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-cyan-400 mb-2">AI Code Analysis Results</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Security vulnerabilities detected</span>
                      <span className="text-rose-400 font-medium">2 issues</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Gas optimization opportunities</span>
                      <span className="text-emerald-400 font-medium">5 improvements</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Code quality score</span>
                      <span className="text-cyan-400 font-medium">8.7/10</span>
                    </div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm transition-colors">
                    View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Team Chat */}
        {activePanel === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img src="https://i.pravatar.cc/150?u=protocol1" className="w-8 h-8 rounded-full border-2 border-slate-900" alt="" />
                    <img src="https://i.pravatar.cc/150?u=ai1" className="w-8 h-8 rounded-full border-2 border-slate-900" alt="" />
                    <img src="https://i.pravatar.cc/150?u=int1" className="w-8 h-8 rounded-full border-2 border-slate-900" alt="" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">Project Team Chat</h3>
                    <p className="text-xs text-slate-400">3 members online</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-3"
                  >
                    <img
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-200 text-sm">{msg.sender}</span>
                        <div className={`p-1 rounded bg-gradient-to-r ${getRoleColor(msg.role)}`}>
                          {getRoleIcon(msg.role)}
                        </div>
                        <span className="text-xs text-slate-500">{msg.timestamp}</span>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-3 text-sm text-slate-300">
                        {msg.message}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* AI Assistant Suggestion */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-violet-900/20 to-purple-900/20 border border-violet-500/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-violet-600/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-violet-400 text-sm">AI Assistant</span>
                        <span className="text-xs text-slate-500">Just now</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-2">
                        I've analyzed the recent code changes and suggest optimizing the ML model inference latency by implementing batch processing. This could reduce computational costs by ~35%.
                      </p>
                      <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                        View Optimization Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-slate-400" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors">
                    <Send className="w-5 h-5" />
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
