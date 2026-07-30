import React from 'react';
import {
  LayoutDashboard,
  Brain,
  Link2,
  TrendingUp,
  BookOpen,
  Coins,
  Users,
  Settings,
  Activity,
  Bell,
  ChevronRight,
  Shield,
  Key,
  Database,
  BarChart3,
  Lock,
  MessageSquare,
  Folder,
  Calculator,
  Trophy,
  FileText,
  Globe,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'ai-console', label: 'Moral AI Console', icon: Brain },
  { id: 'blockchain', label: 'Blockchain Monitor', icon: Link2 },
  { id: 'impact', label: 'Impact Dashboard', icon: TrendingUp },
  { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
  { id: 'finance', label: 'ReFi Console', icon: Coins },
  { id: 'governance', label: 'DAO Governance', icon: Users },
];

const innovationItems = [
  { id: 'predictive', label: 'Predictive Analytics', icon: Brain },
  { id: 'nl-query', label: 'Ask AI Anything', icon: MessageSquare },
  { id: 'autonomous-agents', label: 'Autonomous Agents', icon: Zap },
  { id: 'dynamic-nfts', label: 'Dynamic NFTs', icon: Coins },
  { id: 'zk-proofs', label: 'Zero-Knowledge Proofs', icon: Lock },
  { id: 'impact-globe', label: '3D Impact Globe', icon: Globe },
  { id: 'roi-calculator', label: 'ROI Calculator', icon: Calculator },
  { id: 'compliance', label: 'Auto Compliance', icon: FileText },
  { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
  { id: 'collaborative-canvas', label: 'Collaborative Canvas', icon: Users },
  { id: 'blockchain-audit', label: 'Blockchain Audit Trail', icon: Shield },
  { id: 'edge-computing', label: 'Edge Computing', icon: Zap },
  { id: 'virtual-tours', label: 'Virtual Tours', icon: Sparkles },
  { id: 'ar-overlay', label: 'AR Impact Overlay', icon: Sparkles },
  { id: 'graphql-federation', label: 'GraphQL Federation', icon: Sparkles },
  { id: 'universal-design', label: 'Universal Design', icon: Sparkles },
];

const adminItems = [
  { id: 'users', label: 'User Management', icon: Shield },
  { id: 'roles', label: 'Roles & Permissions', icon: Lock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'security', label: 'Security Monitor', icon: Shield },
];

const systemItems = [
  { id: 'health', label: 'System Health', icon: Activity },
  { id: 'alerts', label: 'Alerts Center', icon: Bell },
  { id: 'activity-log', label: 'Activity Log', icon: Activity },
  { id: 'api-config', label: 'API Configuration', icon: Key },
  { id: 'data-backup', label: 'Data Backup', icon: Database },
];

const supportItems = [
  { id: 'support', label: 'Support Tickets', icon: MessageSquare },
  { id: 'files', label: 'File Manager', icon: Folder },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen fixed left-0 top-0 border-r border-slate-700 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700 flex-shrink-0">
        <h1 className="text-xl mb-1 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Atlas Sanctum
        </h1>
        <p className="text-xs text-slate-400">Regenerative Value Platform</p>
      </div>

      {/* Main Navigation - Scrollable */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs text-slate-500 mb-2 px-2">MAIN MODULES</p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-slate-700 pt-4 pb-20">
          <p className="text-xs text-slate-500 mb-2 px-2">INNOVATION</p>
          <ul className="space-y-1">
            {innovationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-slate-700 pt-4 pb-20">
          <p className="text-xs text-slate-500 mb-2 px-2">SYSTEM</p>
          <ul className="space-y-1">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {item.id === 'alerts' && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-slate-700 pt-4 pb-20">
          <p className="text-xs text-slate-500 mb-2 px-2">ADMIN</p>
          <ul className="space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-slate-700 pt-4 pb-20">
          <p className="text-xs text-slate-500 mb-2 px-2">SUPPORT</p>
          <ul className="space-y-1">
            {supportItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm flex-1 text-left">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-300">All Systems Online</span>
          </div>
          <div className="text-xs text-slate-500">
            <div className="flex justify-between mb-1">
              <span>Uptime</span>
              <span className="text-emerald-400">99.98%</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span className="text-teal-400">2,847</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}