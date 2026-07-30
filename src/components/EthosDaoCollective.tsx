import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hexagon,
  LayoutDashboard,
  Scale,
  ChartBar,
  BookOpen,
  Globe,
  Settings,
  Users,
  Target,
  Award,
  Zap,
  Heart,
  TreePine,
  Droplets,
  Wind,
  Sun,
  ArrowUpRight,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// EthosDao navigation items
const navItems = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'collective', label: 'Our Collective', icon: Users },
  { id: 'impact', label: 'Impact Metrics', icon: ChartBar },
  { id: 'governance', label: 'Ethical Governance', icon: Scale },
  { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
  { id: 'economy', label: 'Impact Economy', icon: Globe },
];

// Regenerative impact data
const impactData = [
  { month: 'Jan', carbon: 2400, water: 1800, biodiversity: 65 },
  { month: 'Feb', carbon: 1398, water: 2210, biodiversity: 68 },
  { month: 'Mar', carbon: 3800, water: 2290, biodiversity: 72 },
  { month: 'Apr', carbon: 3908, water: 2000, biodiversity: 75 },
  { month: 'May', carbon: 4800, water: 2181, biodiversity: 78 },
  { month: 'Jun', carbon: 3800, water: 2500, biodiversity: 82 },
];

// Team/Collective members
const collectiveMembers = [
  {
    id: '1',
    name: 'Regen Leader',
    role: 'Steward',
    avatar: '🌱',
    status: 'online',
    contributions: 1247,
    impact: 'High'
  },
  {
    id: '2',
    name: 'Climate Scientist',
    role: 'Researcher',
    avatar: '🔬',
    status: 'online',
    contributions: 892,
    impact: 'High'
  },
  {
    id: '3',
    name: 'Community Builder',
    role: 'Facilitator',
    avatar: '🤝',
    status: 'away',
    contributions: 756,
    impact: 'Medium'
  },
  {
    id: '4',
    name: 'Tech Innovator',
    role: 'Developer',
    avatar: '💻',
    status: 'online',
    contributions: 1024,
    impact: 'High'
  },
  {
    id: '5',
    name: 'Biodiversity Expert',
    role: 'Ecologist',
    avatar: '🦋',
    status: 'offline',
    contributions: 543,
    impact: 'Medium'
  },
];

// Active proposals
const activeProposals = [
  {
    id: '1',
    title: 'Expand Rainforest Restoration Initiative',
    status: 'Active',
    votes: 1247,
    yesPercent: 72,
    endsIn: '2 days'
  },
  {
    id: '2',
    title: 'Launch Coastal Conservation Network',
    status: 'Voting',
    votes: 892,
    yesPercent: 68,
    endsIn: '5 days'
  },
  {
    id: '3',
    title: 'Fund Regenerative Agriculture Program',
    status: 'Review',
    votes: 456,
    yesPercent: 81,
    endsIn: '1 week'
  },
];

interface EthosDaoCollectiveProps {
  userType?: 'donor' | 'field-agent' | 'administrator' | 'community' | 'enterprise' | 'government' | 'defi' | 'ngo';
}

const EthosDaoCollective: React.FC<EthosDaoCollectiveProps> = ({ userType = 'donor' }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Sequestered</CardTitle>
            <TreePine className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234 t</div>
            <p className="text-xs text-muted-foreground">+19% month over month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Conserved</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450M L</div>
            <p className="text-xs text-muted-foreground">+12% this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biodiversity Score</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87/100</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stewards</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+156 this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Impact Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Regenerative Impact Flow</CardTitle>
          <CardDescription>Your collective contribution to ecosystem restoration over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={impactData}>
                <defs>
                  <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(71, 85, 105, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="carbon"
                  stroke="#10b981"
                  fill="url(#carbonGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Proposals</CardTitle>
          <CardDescription>Governance proposals currently under consideration.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeProposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <h4 className="font-medium">{proposal.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {proposal.votes.toLocaleString()} votes • Ends in {proposal.endsIn}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{proposal.yesPercent}% Yes</div>
                    <Progress value={proposal.yesPercent} className="w-24 h-2" />
                  </div>
                  <Button variant="ghost" size="sm">
                    Vote <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCollective = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Our Collective</h2>
          <p className="text-muted-foreground">Meet the stewards driving planetary regeneration.</p>
        </div>
        <Button>Invite Member</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collectiveMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-2xl">
                {member.avatar}
              </div>
              <div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant={member.status === 'online' ? 'default' : 'secondary'}>
                  {member.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {member.contributions.toLocaleString()} contributions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">Impact Level: {member.impact}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collective Achievements</CardTitle>
          <CardDescription>Milestones reached by our community.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6 text-emerald-500" />
                <h4 className="font-semibold">Carbon Neutral Certified</h4>
              </div>
              <p className="text-sm text-muted-foreground">Achieved carbon neutrality for 3 consecutive years</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-blue-500" />
                <h4 className="font-semibold">1000 Projects Funded</h4>
              </div>
              <p className="text-sm text-muted-foreground">Land restoration and conservation initiatives</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-6 h-6 text-purple-500" />
                <h4 className="font-semibold">Knowledge Shared</h4>
              </div>
              <p className="text-sm text-muted-foreground">500+ research papers and case studies</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderImpact = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Impact Metrics</h2>
          <p className="text-muted-foreground">Track our collective progress towards planetary health.</p>
        </div>
        <Button variant="outline">Download Report</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-emerald-500" />
              Carbon Sequestration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">45,678 tCO2e</div>
            <Progress value={78} className="mb-2" />
            <p className="text-sm text-muted-foreground">78% towards annual target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Water Conservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">1.2B Liters</div>
            <Progress value={65} className="mb-2" />
            <p className="text-sm text-muted-foreground">65% towards annual target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              Renewable Energy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">2.4 GW</div>
            <Progress value={89} className="mb-2" />
            <p className="text-sm text-muted-foreground">89% renewable energy powered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Biodiversity Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">87/100</div>
            <Progress value={87} className="mb-2" />
            <p className="text-sm text-muted-foreground">Above target threshold</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderGovernance = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ethical Governance</h2>
        <p className="text-muted-foreground">Participate in decentralized decision-making for regenerative initiatives.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Voting Power</CardTitle>
            <CardDescription>Based on your contributions and stake.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">2,456 VP</div>
            <Progress value={45} className="mb-2" />
            <p className="text-sm text-muted-foreground">Ranked in top 20% of contributors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delegation Status</CardTitle>
            <CardDescription>Your governance delegates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                🌱
              </div>
              <div>
                <div className="font-medium">Regen Delegate</div>
                <div className="text-sm text-muted-foreground">Active since Jan 2024</div>
              </div>
            </div>
            <Button variant="outline" size="sm">Manage Delegation</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Governance Proposals</CardTitle>
          <CardDescription>Active and past proposals for collective decision-making.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeProposals.map((proposal) => (
              <div key={proposal.id} className="p-4 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={proposal.status === 'Active' ? 'default' : 'secondary'}>
                    {proposal.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Ends in {proposal.endsIn}</span>
                </div>
                <h4 className="font-medium mb-2">{proposal.title}</h4>
                <div className="flex items-center gap-4">
                  <Progress value={proposal.yesPercent} className="flex-1" />
                  <span className="text-sm font-medium">{proposal.yesPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderKnowledge = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Hub</h2>
        <p className="text-muted-foreground">Access research, case studies, and best practices for regeneration.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="h-40 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-t-lg" />
            <CardHeader>
              <CardTitle className="text-lg">Regenerative Practice Guide {i}</CardTitle>
              <CardDescription>Comprehensive guide for sustainable implementation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Research</Badge>
                <span className="text-sm text-muted-foreground">12 min read</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEconomy = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Impact Economy</h2>
        <p className="text-muted-foreground">Track the economic value generated by regenerative activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Value Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$4.2M</div>
            <p className="text-sm text-emerald-500">+24% this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Impact Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">847K</div>
            <p className="text-sm text-muted-foreground">IMPACT tokens distributed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Carbon Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">12,456</div>
            <p className="text-sm text-muted-foreground">Credits traded this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 h-full border-r border-slate-800 flex flex-col bg-card">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Hexagon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Ethos<span className="text-emerald-400">DAO</span></h1>
            <p className="text-xs text-muted-foreground">Collective Workspace</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-emerald-500 rounded-r" />
                  )}
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-muted-foreground">Your Role</span>
              <Badge variant="outline" className="text-xs">{userType.charAt(0).toUpperCase() + userType.slice(1).replace('-', ' ')}</Badge>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">Demo Mode Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-8">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'collective' && renderCollective()}
            {activeTab === 'impact' && renderImpact()}
            {activeTab === 'governance' && renderGovernance()}
            {activeTab === 'knowledge' && renderKnowledge()}
            {activeTab === 'economy' && renderEconomy()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EthosDaoCollective;
