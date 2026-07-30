import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
  HelpCircle,
  Building2,
  Users,
  Briefcase,
  Building,
  Globe,
  Shield,
  Hexagon,
  Users as UsersIcon,
  TrendingUp,
  Target,
  Award,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  userType: 'donor' | 'field-agent' | 'administrator' | 'community' | 'enterprise' | 'government' | 'defi' | 'ngo';
}

const userTypeConfig = {
  donor: { icon: User, label: 'Donor Workspace', color: 'from-blue-400 to-cyan-500' },
  'field-agent': { icon: Users, label: 'Field Agent Workspace', color: 'from-green-400 to-emerald-500' },
  administrator: { icon: Shield, label: 'Administrator Workspace', color: 'from-red-400 to-orange-500' },
  community: { icon: Globe, label: 'Community Workspace', color: 'from-purple-400 to-pink-500' },
  enterprise: { icon: Building2, label: 'Enterprise Workspace', color: 'from-indigo-400 to-violet-500' },
  government: { icon: Building, label: 'Government Workspace', color: 'from-slate-400 to-slate-600' },
  defi: { icon: Briefcase, label: 'DeFi Workspace', color: 'from-yellow-400 to-amber-500' },
  ngo: { icon: Globe, label: 'NGO Workspace', color: 'from-teal-400 to-cyan-500' },
};

const quickLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/checkout', icon: CreditCard, label: 'Purchase Credits' },
  { href: '/marketplace', icon: Leaf, label: 'Marketplace' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

// Collective impact data
const impactMetrics = [
  { label: 'Carbon Sequestered', value: '12,234 t', change: '+19%', icon: TrendingUp, color: 'text-emerald-500' },
  { label: 'Water Conserved', value: '450M L', change: '+12%', icon: Heart, color: 'text-blue-500' },
  { label: 'Active Stewards', value: '2,847', change: '+156', icon: UsersIcon, color: 'text-purple-500' },
  { label: 'Biodiversity Score', value: '87/100', change: 'Above target', icon: Target, color: 'text-pink-500' },
];

// Collective achievements
const achievements = [
  { title: 'Carbon Neutral Certified', description: '3 consecutive years', icon: Award },
  { title: '1000 Projects Funded', description: 'Restoration initiatives', icon: TrendingUp },
  { title: 'Knowledge Shared', description: '500+ research papers', icon: Heart },
];

// Team members
const teamMembers = [
  { id: '1', name: 'Regen Leader', role: 'Steward', avatar: '🌱', status: 'online', contributions: 1247 },
  { id: '2', name: 'Climate Scientist', role: 'Researcher', avatar: '🔬', status: 'online', contributions: 892 },
  { id: '3', name: 'Community Builder', role: 'Facilitator', avatar: '🤝', status: 'away', contributions: 756 },
];

export default function WorkspaceLayout({
  children,
  title,
  subtitle,
  userType
}: WorkspaceLayoutProps) {
  const location = useLocation();
  const { isDemoMode, currentDemoUser, exitDemoMode } = useEnhancedAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCollective, setShowCollective] = useState(true);

  const config = userTypeConfig[userType];
  const Icon = config.icon;

  const handleExitDemo = async () => {
    await exitDemoMode();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className={`flex flex-col ${isCollapsed ? 'hidden' : 'block'}`}>
                <span className="text-lg font-bold text-white">Atlas Sanctum</span>
                <span className="text-xs text-slate-400">{config.label}</span>
              </div>
            </Link>
          </div>

          {/* Center - Title */}
          <div className="hidden md:flex flex-col items-center">
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>

          {/* Right - User Menu */}
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Demo Mode
              </Badge>
            )}

            {/* Collective Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCollective(!showCollective)}
              className={`flex items-center gap-2 ${showCollective ? 'text-emerald-400' : 'text-slate-400'}`}
            >
              <Hexagon className="w-4 h-4" />
              <span className="hidden sm:inline">Collective</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Bell className="w-5 h-5" />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block">
                  {currentDemoUser?.displayName || 'Demo User'}
                </span>
              </Button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 py-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl"
                  >
                    <div className="px-4 py-2 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">{currentDemoUser?.displayName}</p>
                      <p className="text-xs text-slate-400">{currentDemoUser?.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <Link
                      to="/help"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help Center
                    </Link>
                    <button
                      onClick={handleExitDemo}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Exit Demo
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`sticky top-16 h-[calc(100vh-4rem)] border-r border-slate-700/50 bg-slate-900/50 backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
          <nav className="flex flex-col h-full p-4">
            {/* Quick Links */}
            <div className="space-y-1 mb-6">
              <p className={`text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 ${isCollapsed ? 'hidden' : 'block'}`}>
                Quick Links
              </p>
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === link.href
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Navigation Toggle */}
            <div className="mt-auto pt-4 border-t border-slate-700/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center text-slate-400 hover:text-white"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 p-6">
          {/* Dashboard Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex-1 ${showCollective ? 'lg:w-2/3' : 'w-full'}`}
          >
            {children}
          </motion.div>

          {/* EthosDAO Collective Panel */}
          <AnimatePresence>
            {showCollective && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block w-1/3 space-y-6"
              >
                {/* Collective Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Hexagon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">EthosDAO Collective</h2>
                    <p className="text-xs text-slate-400">Regenerative ecosystem</p>
                  </div>
                </div>

                {/* Impact Metrics */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Impact Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {impactMetrics.map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <metric.icon className={`w-4 h-4 ${metric.color}`} />
                          <span className="text-sm text-slate-400">{metric.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">{metric.value}</div>
                          <div className="text-xs text-emerald-500">{metric.change}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Active Team */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Active Stewards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-sm">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{member.name}</div>
                          <div className="text-xs text-slate-400">{member.role}</div>
                        </div>
                        <div className="text-right">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full text-xs text-slate-400 hover:text-white">
                      View All Members
                    </Button>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Collective Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {achievements.map((achievement) => (
                      <div key={achievement.title} className="flex items-start gap-3 p-2 rounded-lg bg-slate-700/30">
                        <Award className="w-5 h-5 text-emerald-500 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-white">{achievement.title}</div>
                          <div className="text-xs text-slate-400">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Voting Progress */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-300">Active Proposals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">Expand Rainforest Initiative</span>
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      </div>
                      <Progress value={72} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>72% Yes</span>
                        <span>2 days left</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View All Proposals
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
