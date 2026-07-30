import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'funding' | 'policy' | 'technical' | 'governance';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  proposer: string;
  createdAt: Date;
  votingEnds: Date;
  votesFor: number;
  votesAgainst: number;
  quorum: number;
  threshold: number;
  tags: string[];
  budget?: number;
  executionStatus?: 'pending' | 'executing' | 'completed' | 'failed';
}

interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  totalVotes: number;
  activeVoters: number;
  participationRate: number;
  averageQuorum: number;
  governanceScore: number;
}

interface Voter {
  id: string;
  address: string;
  votingPower: number;
  reputation: number;
  proposalsCreated: number;
  votesCast: number;
  lastActive: Date;
  delegations: number;
}

interface GovernanceMechanism {
  name: string;
  type: 'direct' | 'representative' | 'liquid' | 'quadratic';
  description: string;
  advantages: string[];
  challenges: string[];
  adoption: number;
  effectiveness: number;
}

const DecentralizedGovernance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'voting' | 'delegation' | 'analytics'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [userVotingPower, setUserVotingPower] = useState(1250);

  const [governanceStats, setGovernanceStats] = useState<GovernanceStats>({
    totalProposals: 847,
    activeProposals: 23,
    passedProposals: 623,
    totalVotes: 156789,
    activeVoters: 3456,
    participationRate: 68.5,
    averageQuorum: 75.2,
    governanceScore: 89.3
  });

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Increase Biodiversity Monitoring Budget',
      description: 'Allocate additional 2.5M tokens for enhanced satellite monitoring and AI-powered biodiversity tracking across key conservation areas.',
      type: 'funding',
      status: 'active',
      proposer: '0x742d35Cc6634C0532925a3b8444c35848',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      votingEnds: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      votesFor: 125000,
      votesAgainst: 45000,
      quorum: 150000,
      threshold: 0.6,
      tags: ['funding', 'biodiversity', 'monitoring'],
      budget: 2500000
    },
    {
      id: '2',
      title: 'Implement Quadratic Voting for Major Decisions',
      description: 'Adopt quadratic voting mechanism for proposals with budget impact over 1M tokens to ensure fair representation.',
      type: 'governance',
      status: 'active',
      proposer: '0x8ba1f109551bD432803012645Ac136216',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      votingEnds: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      votesFor: 98000,
      votesAgainst: 32000,
      quorum: 120000,
      threshold: 0.67,
      tags: ['governance', 'voting', 'fairness']
    },
    {
      id: '3',
      title: 'Carbon Credit Verification Standards Update',
      description: 'Update verification standards to include AI-powered anomaly detection and real-time monitoring requirements.',
      type: 'technical',
      status: 'passed',
      proposer: '0x9cd2f210652cD543814023756Bc247327',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      votingEnds: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      votesFor: 145000,
      votesAgainst: 25000,
      quorum: 140000,
      threshold: 0.6,
      tags: ['technical', 'verification', 'standards'],
      executionStatus: 'executing'
    },
    {
      id: '4',
      title: 'Emergency Drought Response Fund',
      description: 'Establish 5M token emergency fund for rapid response to drought-affected regeneration projects.',
      type: 'funding',
      status: 'draft',
      proposer: '0x5a4b3c2d1e0f9g8h7i6j5k4l3m2n1o',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      votingEnds: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      votesFor: 0,
      votesAgainst: 0,
      quorum: 200000,
      threshold: 0.7,
      tags: ['emergency', 'funding', 'drought'],
      budget: 5000000
    }
  ]);

  const [voters, setVoters] = useState<Voter[]>([
    {
      id: '1',
      address: '0x742d35Cc6634C0532925a3b8444c35848',
      votingPower: 50000,
      reputation: 95,
      proposalsCreated: 12,
      votesCast: 234,
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
      delegations: 8
    },
    {
      id: '2',
      address: '0x8ba1f109551bD432803012645Ac136216',
      votingPower: 75000,
      reputation: 98,
      proposalsCreated: 8,
      votesCast: 189,
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 6),
      delegations: 15
    },
    {
      id: '3',
      address: '0x9cd2f210652cD543814023756Bc247327',
      votingPower: 25000,
      reputation: 87,
      proposalsCreated: 5,
      votesCast: 156,
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
      delegations: 3
    }
  ]);

  const [governanceMechanisms, setGovernanceMechanisms] = useState<GovernanceMechanism[]>([
    {
      name: 'Direct Democracy',
      type: 'direct',
      description: 'One person, one vote system for all governance decisions',
      advantages: ['Equal representation', 'High participation', 'Transparent decisions'],
      challenges: ['Scalability issues', 'Voter fatigue', 'Low expertise'],
      adoption: 0.3,
      effectiveness: 0.7
    },
    {
      name: 'Liquid Democracy',
      type: 'liquid',
      description: 'Delegative voting system allowing vote delegation and direct participation',
      advantages: ['Flexible participation', 'Expert involvement', 'Scalable'],
      challenges: ['Complexity', 'Delegate accountability', 'Manipulation risks'],
      adoption: 0.6,
      effectiveness: 0.85
    },
    {
      name: 'Quadratic Voting',
      type: 'quadratic',
      description: 'Voting power increases quadratically with tokens, favoring broad consensus',
      advantages: ['Prevents plutocracy', 'Encourages compromise', 'Fair representation'],
      challenges: ['Mathematical complexity', 'Higher costs', 'Learning curve'],
      adoption: 0.4,
      effectiveness: 0.9
    }
  ]);

  const tabs = [
    { id: 'proposals', label: 'Proposals', icon: FileText },
    { id: 'voting', label: 'Voting', icon: Vote },
    { id: 'delegation', label: 'Delegation', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const ProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => {
    const statusColors = {
      draft: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      active: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      passed: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
      executed: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };

    const typeColors = {
      funding: 'bg-green-500/10 text-green-500',
      policy: 'bg-blue-500/10 text-blue-500',
      technical: 'bg-purple-500/10 text-purple-500',
      governance: 'bg-orange-500/10 text-orange-500'
    };

    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const approvalRate = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const quorumProgress = (totalVotes / proposal.quorum) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setSelectedProposal(proposal)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${typeColors[proposal.type]}`}>
                {proposal.type.toUpperCase()}
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[proposal.status]}`}>
                {proposal.status.toUpperCase()}
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-2">{proposal.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{proposal.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Approval</span>
              <span className="font-medium">{approvalRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(approvalRate, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Quorum</span>
              <span className="font-medium">{quorumProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(quorumProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              {proposal.votesFor.toLocaleString()} For
            </span>
            <span className="text-muted-foreground">
              {proposal.votesAgainst.toLocaleString()} Against
            </span>
          </div>
          <span className="text-muted-foreground">
            Ends: {proposal.votingEnds.toLocaleDateString()}
          </span>
        </div>

        {proposal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {proposal.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-muted/50 text-xs rounded border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const VoterCard: React.FC<{ voter: Voter }> = ({ voter }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border/50 rounded-lg p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground font-mono text-sm">
            {voter.address.substring(0, 10)}...
          </h3>
          <p className="text-sm text-muted-foreground">
            Last active: {voter.lastActive.toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{voter.votingPower.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Voting Power</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-500">{voter.reputation}</div>
          <div className="text-xs text-muted-foreground">Reputation</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-500">{voter.proposalsCreated}</div>
          <div className="text-xs text-muted-foreground">Proposals</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-500">{voter.delegations}</div>
          <div className="text-xs text-muted-foreground">Delegations</div>
        </div>
      </div>
    </motion.div>
  );

  const MechanismCard: React.FC<{ mechanism: GovernanceMechanism }> = ({ mechanism }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-lg p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{mechanism.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{mechanism.type} voting</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">{(mechanism.effectiveness * 100).toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Effectiveness</div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{mechanism.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-foreground text-sm mb-2">Advantages</h4>
          <ul className="space-y-1">
            {mechanism.advantages.slice(0, 2).map((advantage, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground text-sm mb-2">Challenges</h4>
          <ul className="space-y-1">
            {mechanism.challenges.slice(0, 2).map((challenge, index) => (
              <li key={index} className="flex items-start space-x-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Adoption Rate</span>
        <span className="font-medium">{(mechanism.adoption * 100).toFixed(1)}%</span>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Decentralized Governance</h1>
              <p className="text-muted-foreground mt-1">Community-driven decision making and transparent governance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Vote className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{userVotingPower.toLocaleString()} Voting Power</span>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <FileText className="w-4 h-4 inline mr-2" />
                Create Proposal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{governanceStats.totalProposals.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Proposals</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{governanceStats.activeProposals}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{governanceStats.passedProposals.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{governanceStats.totalVotes.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{governanceStats.activeVoters.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Active Voters</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-500">{governanceStats.participationRate}%</div>
              <div className="text-xs text-muted-foreground">Participation</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pink-500">{governanceStats.averageQuorum}%</div>
              <div className="text-xs text-muted-foreground">Avg Quorum</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-500">{governanceStats.governanceScore}</div>
              <div className="text-xs text-muted-foreground">Governance Score</div>
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
                  onClick={() => setActiveTab(tab.id as 'proposals' | 'voting' | 'delegation' | 'analytics')}
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
          {activeTab === 'proposals' && (
            <motion.div
              key="proposals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Proposal Filters */}
              <div className="flex flex-wrap gap-4">
                <select className="px-4 py-2 border border-border/50 rounded-lg bg-background">
                  <option>All Types</option>
                  <option>Funding</option>
                  <option>Policy</option>
                  <option>Technical</option>
                  <option>Governance</option>
                </select>
                <select className="px-4 py-2 border border-border/50 rounded-lg bg-background">
                  <option>All Status</option>
                  <option>Draft</option>
                  <option>Active</option>
                  <option>Passed</option>
                  <option>Rejected</option>
                </select>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-border/50" />
                  <span className="text-sm">My Proposals</span>
                </div>
              </div>

              {/* Proposals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>

              {/* Proposal Details Modal */}
              <AnimatePresence>
                {selectedProposal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedProposal(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-6 border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold text-foreground">{selectedProposal.title}</h2>
                          <button
                            onClick={() => setSelectedProposal(null)}
                            className="p-2 hover:bg-muted rounded-lg"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-muted-foreground mt-2 capitalize">
                          {selectedProposal.type} • {selectedProposal.status}
                        </p>
                      </div>

                      <div className="p-6 space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                          <p className="text-muted-foreground">{selectedProposal.description}</p>
                        </div>

                        {selectedProposal.budget && (
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">Budget Request</h3>
                            <div className="text-2xl font-bold text-primary">
                              ${selectedProposal.budget.toLocaleString()}
                            </div>
                          </div>
                        )}

                        {/* Voting Progress */}
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">Voting Progress</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Approval Rate</span>
                                <span className="font-medium">
                                  {((selectedProposal.votesFor / (selectedProposal.votesFor + selectedProposal.votesAgainst)) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3">
                                <div
                                  className="bg-primary h-3 rounded-full"
                                  style={{
                                    width: `${(selectedProposal.votesFor / (selectedProposal.votesFor + selectedProposal.votesAgainst)) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-muted-foreground">Quorum Progress</span>
                                <span className="font-medium">
                                  {(((selectedProposal.votesFor + selectedProposal.votesAgainst) / selectedProposal.quorum) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3">
                                <div
                                  className="bg-green-500 h-3 rounded-full"
                                  style={{
                                    width: `${Math.min(((selectedProposal.votesFor + selectedProposal.votesAgainst) / selectedProposal.quorum) * 100, 100)}%`
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Voting Actions */}
                        {selectedProposal.status === 'active' && (
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">Cast Your Vote</h3>
                            <div className="flex space-x-4">
                              <button className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                <CheckCircle className="w-5 h-5 inline mr-2" />
                                Vote For ({userVotingPower} power)
                              </button>
                              <button className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                <XCircle className="w-5 h-5 inline mr-2" />
                                Vote Against
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Proposal Metadata */}
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Proposer:</span>
                            <div className="font-mono text-xs mt-1">{selectedProposal.proposer}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <div className="mt-1">{selectedProposal.createdAt.toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Voting Ends:</span>
                            <div className="mt-1">{selectedProposal.votingEnds.toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Threshold:</span>
                            <div className="mt-1">{(selectedProposal.threshold * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'voting' && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Voting Power */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Your Voting Power</h3>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{userVotingPower.toLocaleString()}</div>
                    <p className="text-muted-foreground">Available Voting Power</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Power</span>
                      <span className="font-medium">1,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reputation Bonus</span>
                      <span className="font-medium text-green-500">+150</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Participation Bonus</span>
                      <span className="font-medium text-green-500">+100</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-border/50 pt-2">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-primary">1,250</span>
                    </div>
                  </div>
                </div>

                {/* Voting History */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Recent Votes</h3>
                  <div className="space-y-4">
                    {[
                      { proposal: 'Biodiversity Monitoring Budget', vote: 'For', power: 1250, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
                      { proposal: 'Quadratic Voting Implementation', vote: 'For', power: 1200, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) },
                      { proposal: 'Carbon Verification Standards', vote: 'Against', power: 1150, date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12) }
                    ].map((vote, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground text-sm">{vote.proposal}</div>
                          <div className="text-xs text-muted-foreground">{vote.date.toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium text-sm ${
                            vote.vote === 'For' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {vote.vote}
                          </div>
                          <div className="text-xs text-muted-foreground">{vote.power} power</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Governance Mechanisms */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Voting Mechanisms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {governanceMechanisms.map((mechanism) => (
                    <MechanismCard key={mechanism.name} mechanism={mechanism} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'delegation' && (
            <motion.div
              key="delegation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Delegation Overview */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Delegation Overview</h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">23</div>
                      <p className="text-muted-foreground">Active Delegations</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500 mb-2">156,780</div>
                      <p className="text-muted-foreground">Delegated Voting Power</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-2">89%</div>
                      <p className="text-muted-foreground">Delegation Efficiency</p>
                    </div>
                  </div>
                </div>

                {/* Top Delegates */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Top Delegates</h3>
                  <div className="space-y-4">
                    {voters.slice(0, 5).map((voter) => (
                      <div key={voter.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground font-mono text-sm">
                              {voter.address.substring(0, 8)}...
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {voter.delegations} delegations
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">{voter.votingPower.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Power</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delegate Management */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Delegate Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-4">Your Delegates</h4>
                    <div className="space-y-3">
                      {voters.slice(0, 3).map((voter) => (
                        <div key={voter.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                          <div className="font-mono text-sm">{voter.address.substring(0, 10)}...</div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{voter.votingPower}</span>
                            <button className="text-red-500 hover:text-red-600 text-sm">
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-4">Add Delegate</h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Delegate wallet address"
                        className="w-full px-4 py-2 border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <input
                        type="number"
                        placeholder="Voting power to delegate"
                        className="w-full px-4 py-2 border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        Add Delegate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Participation Trends</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Participation trend charts would be displayed here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Proposal Success Rates</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Success rate charts would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Governance Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: 'Most Active Voters',
                      value: 'Top 10% cast 45% of votes',
                      trend: 'up',
                      color: 'text-green-500'
                    },
                    {
                      title: 'Proposal Categories',
                      value: 'Funding proposals: 60% success rate',
                      trend: 'up',
                      color: 'text-blue-500'
                    },
                    {
                      title: 'Voting Patterns',
                      value: '89% of proposals reach quorum',
                      trend: 'up',
                      color: 'text-purple-500'
                    },
                    {
                      title: 'Delegation Growth',
                      value: '+23% delegation in 6 months',
                      trend: 'up',
                      color: 'text-orange-500'
                    }
                  ].map((insight, index) => (
                    <div key={index} className="p-4 border border-border/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">{insight.title}</h4>
                      <p className={`text-sm font-semibold ${insight.color} mb-2`}>{insight.value}</p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">Positive trend</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DecentralizedGovernance;