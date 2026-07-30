import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hexagon,
  Users,
  Award,
  TrendingUp,
  Heart,
  Target,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Vote,
  BarChart3,
  Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

// Types
interface EthosMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  contributions: number;
  impactLevel: string;
  expertise: string[];
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'voting' | 'passed' | 'rejected';
  votesYes: number;
  votesNo: number;
  totalVotes: number;
  yesPercent: number;
  proposerName: string;
  endsAt: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface ImpactMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  category: string;
}

// Mock data for demo mode
const mockMembers: EthosMember[] = [
  { id: '1', name: 'Regen Leader', role: 'Steward', avatar: '🌱', status: 'online', contributions: 1247, impactLevel: 'High', expertise: ['Regenerative Agriculture', 'Carbon Markets'] },
  { id: '2', name: 'Climate Scientist', role: 'Researcher', avatar: '🔬', status: 'online', contributions: 892, impactLevel: 'High', expertise: ['Climate Modeling'] },
  { id: '3', name: 'Community Builder', role: 'Facilitator', avatar: '🤝', status: 'away', contributions: 756, impactLevel: 'Medium', expertise: ['Community Engagement'] },
  { id: '4', name: 'Tech Innovator', role: 'Developer', avatar: '💻', status: 'online', contributions: 1024, impactLevel: 'High', expertise: ['Web3', 'Smart Contracts'] },
];

const mockProposals: Proposal[] = [
  { id: '1', title: 'Expand Rainforest Restoration Initiative', description: 'Launch comprehensive reforestation program', status: 'active', votesYes: 892, votesNo: 345, totalVotes: 1237, yesPercent: 72.1, proposerName: 'Regen Leader', endsAt: '2025-02-05' },
  { id: '2', title: 'Launch Coastal Conservation Network', description: 'Establish mangrove restoration network', status: 'voting', votesYes: 567, votesNo: 267, totalVotes: 834, yesPercent: 68.0, proposerName: 'Climate Scientist', endsAt: '2025-02-08' },
  { id: '3', title: 'Fund Regenerative Agriculture Program', description: 'Support smallholder farmers', status: 'active', votesYes: 369, votesNo: 87, totalVotes: 456, yesPercent: 80.9, proposerName: 'Community Builder', endsAt: '2025-02-10' },
];

const mockAchievements: Achievement[] = [
  { id: '1', title: 'Carbon Neutral Certified', description: '3 consecutive years', icon: 'award', unlockedAt: '2024-01-15' },
  { id: '2', title: '1000 Projects Funded', description: 'Restoration initiatives', icon: 'trending-up', unlockedAt: '2024-03-20' },
  { id: '3', title: 'Knowledge Shared', description: '500+ research papers', icon: 'heart', unlockedAt: '2024-06-10' },
];

const mockMetrics: ImpactMetric[] = [
  { id: '1', label: 'Carbon Sequestered', value: '12,234 t', change: '+19%', category: 'carbon' },
  { id: '2', label: 'Water Conserved', value: '450M L', change: '+12%', category: 'water' },
  { id: '3', label: 'Active Stewards', value: '2,847', change: '+156', category: 'stewards' },
  { id: '4', label: 'Biodiversity Score', value: '87/100', change: 'Above target', category: 'biodiversity' },
];

// Icon helper
const getIcon = (name: string) => {
  const icons: Record<string, React.ReactNode> = {
    award: <Award className="w-5 h-5" />,
    'trending-up': <TrendingUp className="w-5 h-5" />,
    heart: <Heart className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
  };
  return icons[name] || <Award className="w-5 h-5" />;
};

interface EthosDaoSidePanelProps {
  userType?: 'donor' | 'field-agent' | 'administrator' | 'community' | 'enterprise' | 'government' | 'defi' | 'ngo';
}

const EthosDaoSidePanel: React.FC<EthosDaoSidePanelProps> = ({ userType = 'donor' }) => {
  const { currentDemoUser } = useEnhancedAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'proposals' | 'achievements'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'member' | 'proposal' | 'achievement'>('member');
  const [members, setMembers] = useState<EthosMember[]>(mockMembers);
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);

  // CRUD Operations
  const handleAdd = useCallback((item: EthosMember | Proposal | Achievement) => {
    if (modalType === 'member') {
      setMembers(prev => [...prev, item as EthosMember]);
    } else if (modalType === 'proposal') {
      setProposals(prev => [...prev, item as Proposal]);
    } else {
      setAchievements(prev => [...prev, item as Achievement]);
    }
    setShowAddModal(false);
  }, [modalType]);

  const handleDelete = useCallback((id: string, type: 'member' | 'proposal' | 'achievement') => {
    if (type === 'member') {
      setMembers(prev => prev.filter(m => m.id !== id));
    } else if (type === 'proposal') {
      setProposals(prev => prev.filter(p => p.id !== id));
    } else {
      setAchievements(prev => prev.filter(a => a.id !== id));
    }
  }, []);

  const handleVote = useCallback((id: string, vote: 'yes' | 'no') => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          votesYes: vote === 'yes' ? p.votesYes + 1 : p.votesYes,
          votesNo: vote === 'no' ? p.votesNo + 1 : p.votesNo,
          totalVotes: p.totalVotes + 1,
          yesPercent: ((p.votesYes + (vote === 'yes' ? 1 : 0)) / (p.totalVotes + 1)) * 100
        };
      }
      return p;
    }));
  }, []);

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-4">
      {/* Impact Metrics */}
      <div className="space-y-2">
        {mockMetrics.map((metric) => (
          <div key={metric.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
            <div className="flex items-center gap-3">
              {metric.category === 'carbon' && <Leaf className="w-4 h-4 text-emerald-500" />}
              {metric.category === 'water' && <Heart className="w-4 h-4 text-blue-500" />}
              {metric.category === 'stewards' && <Users className="w-4 h-4 text-purple-500" />}
              {metric.category === 'biodiversity' && <Target className="w-4 h-4 text-pink-500" />}
              <div>
                <div className="text-sm text-slate-300">{metric.label}</div>
                <div className="text-xs text-slate-500">{metric.change}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Proposals Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Active Proposals</span>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setActiveTab('proposals')}>
            View All <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="space-y-2">
          {proposals.slice(0, 2).map((proposal) => (
            <div key={proposal.id} className="p-3 rounded-lg bg-slate-700/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white truncate">{proposal.title}</span>
                <Badge variant="secondary" className="text-xs">{proposal.yesPercent.toFixed(0)}%</Badge>
              </div>
              <Progress value={proposal.yesPercent} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Team Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Active Stewards</span>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => setActiveTab('members')}>
            View All <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
        <div className="flex -space-x-2">
          {members.slice(0, 5).map((member) => (
            <div key={member.id} className="relative" title={member.name}>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-slate-600 flex items-center justify-center text-sm">
                {member.avatar}
              </div>
              {member.status === 'online' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-800" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render members tab
  const renderMembers = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-300">Collective Members</h4>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => { setModalType('member'); setShowAddModal(true); }}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-lg">
            {member.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white truncate">{member.name}</span>
              {member.status === 'online' && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
            </div>
            <div className="text-xs text-slate-400">{member.role} • {member.contributions.toLocaleString()} contributions</div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render proposals tab
  const renderProposals = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-300">Governance Proposals</h4>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => { setModalType('proposal'); setShowAddModal(true); }}>
          <Plus className="w-3 h-3 mr-1" /> Create
        </Button>
      </div>
      {proposals.map((proposal) => (
        <div key={proposal.id} className="p-3 rounded-lg bg-slate-700/30">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-white truncate block">{proposal.title}</span>
              <span className="text-xs text-slate-400">by {proposal.proposerName}</span>
            </div>
            <Badge variant="secondary" className="text-xs ml-2">{proposal.status}</Badge>
          </div>
          <p className="text-xs text-slate-400 mb-3 line-clamp-2">{proposal.description}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Progress value={proposal.yesPercent} className="h-2" />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-emerald-400">{proposal.yesPercent.toFixed(1)}% Yes</span>
                <span className="text-slate-400">{proposal.totalVotes} votes</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs bg-emerald-500/10 text-emerald-400" onClick={() => handleVote(proposal.id, 'yes')}>
                <Check className="w-3 h-3 mr-1" /> Yes
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs bg-red-500/10 text-red-400" onClick={() => handleVote(proposal.id, 'no')}>
                <X className="w-3 h-3 mr-1" /> No
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-600/50">
            <span className="text-xs text-slate-500">Ends: {proposal.endsAt}</span>
          </div>
        </div>
      ))}
    </div>
  );

  // Render achievements tab
  const renderAchievements = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-300">Collective Achievements</h4>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => { setModalType('achievement'); setShowAddModal(true); }}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            {getIcon(achievement.icon)}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-white truncate block">{achievement.title}</span>
            <span className="text-xs text-slate-400">{achievement.description}</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-slate-900/95 border-l border-slate-700/50 backdrop-blur-xl flex flex-col z-40 transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-80'}`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 border-b border-slate-700/50 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
          <Hexagon className="w-5 h-5 text-emerald-400" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">EthosDAO</h3>
            <p className="text-xs text-slate-400">Collective Workspace</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Tabs */}
      {!isCollapsed && (
        <div className="flex gap-1 p-2 border-b border-slate-700/50">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'members', icon: Users, label: 'Members' },
            { id: 'proposals', icon: Vote, label: 'Proposals' },
            { id: 'achievements', icon: Award, label: 'Achievements' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-md text-xs transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={tab.label}
            >
              <tab.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'members' && renderMembers()}
              {activeTab === 'proposals' && renderProposals()}
              {activeTab === 'achievements' && renderAchievements()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* User Info */}
      <div className={`p-3 border-t border-slate-700/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-sm">
            {currentDemoUser?.displayName?.[0] || 'U'}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-sm font-medium">
              {currentDemoUser?.displayName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentDemoUser?.displayName || 'Demo User'}</p>
              <p className="text-xs text-slate-400 capitalize">{userType.replace('-', ' ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Add {modalType === 'member' ? 'Member' : modalType === 'proposal' ? 'Proposal' : 'Achievement'}
            </DialogTitle>
          </DialogHeader>
          <AddForm modalType={modalType} onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Add Form Component
const AddForm: React.FC<{
  modalType: 'member' | 'proposal' | 'achievement';
  onSubmit: (item: EthosMember | Proposal | Achievement) => void;
  onCancel: () => void;
}> = ({ modalType, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '🌱',
    title: '',
    description: '',
    achievementTitle: '',
    achievementDescription: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'member') {
      onSubmit({
        id: Date.now().toString(),
        name: formData.name,
        role: formData.role,
        avatar: formData.avatar,
        status: 'offline',
        contributions: 0,
        impactLevel: 'Medium',
        expertise: [],
      });
    } else if (modalType === 'proposal') {
      onSubmit({
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: 'draft',
        votesYes: 0,
        votesNo: 0,
        totalVotes: 0,
        yesPercent: 0,
        proposerName: 'Demo User',
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    } else {
      onSubmit({
        id: Date.now().toString(),
        title: formData.achievementTitle,
        description: formData.achievementDescription,
        icon: 'award',
        unlockedAt: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {modalType === 'member' && (
        <>
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-slate-700 border-slate-600"
          />
          <Input
            placeholder="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="bg-slate-700 border-slate-600"
          />
        </>
      )}
      {modalType === 'proposal' && (
        <>
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-slate-700 border-slate-600"
          />
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-slate-700 border-slate-600"
          />
        </>
      )}
      {modalType === 'achievement' && (
        <>
          <Input
            placeholder="Title"
            value={formData.achievementTitle}
            onChange={(e) => setFormData({ ...formData, achievementTitle: e.target.value })}
            className="bg-slate-700 border-slate-600"
          />
          <Input
            placeholder="Description"
            value={formData.achievementDescription}
            onChange={(e) => setFormData({ ...formData, achievementDescription: e.target.value })}
            className="bg-slate-700 border-slate-600"
          />
        </>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">Add</Button>
      </DialogFooter>
    </form>
  );
};

export default EthosDaoSidePanel;
