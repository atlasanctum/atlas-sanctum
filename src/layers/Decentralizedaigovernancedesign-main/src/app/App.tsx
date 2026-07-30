import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, LayoutDashboard, FileText, BarChart3, Shield, BookOpen, Menu, X, Wallet, Users, Activity, Bell, Lock, Zap, Award, AlertTriangle, Target, DollarSign } from "lucide-react";
import { ProposalCard, Proposal } from "./components/ProposalCard";
import { EthicsFramework } from "./components/EthicsFramework";
import { GovernanceStats } from "./components/GovernanceStats";
import { CreateProposal } from "./components/CreateProposal";
import { TransparencyLog } from "./components/TransparencyLog";
import { VotingPower } from "./components/VotingPower";
import { DelegationManager } from "./components/DelegationManager";
import { TreasuryDashboard } from "./components/TreasuryDashboard";
import { ActivityFeed } from "./components/ActivityFeed";
import { NotificationCenter } from "./components/NotificationCenter";
import { SoulboundReputation } from "./components/SoulboundReputation";
import { RetroactiveFunding } from "./components/RetroactiveFunding";
import { ZKPrivacyVoting } from "./components/ZKPrivacyVoting";
import { OptimisticGovernance } from "./components/OptimisticGovernance";
import { GovernanceRiskDashboard } from "./components/GovernanceRiskDashboard";
import { ImpactCertificates } from "./components/ImpactCertificates";

type TabType = "dashboard" | "proposals" | "analytics" | "ethics" | "transparency" | "treasury" | "activity" | "reputation" | "rpgf" | "privacy" | "optimistic" | "risk" | "impact";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [showDelegation, setShowDelegation] = useState(false);
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Implement Privacy-Preserving Voting Mechanism",
      description: "Introduce zero-knowledge proof technology to ensure voter privacy while maintaining transparency of results. This will enhance democratic participation without compromising individual anonymity.",
      category: "technical",
      status: "active",
      votesFor: 847,
      votesAgainst: 123,
      totalVoters: 970,
      quorumRequired: 1000,
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      aiRecommendation: {
        score: 92,
        reasoning: "Strongly aligns with privacy protection and transparency principles. Technical feasibility confirmed. Expected to increase voter participation by 34%.",
      },
      ethicsScore: 94,
    },
    {
      id: "2",
      title: "Establish Universal Basic Income for Contributors",
      description: "Create a fair compensation system for active DAO contributors, ensuring equitable distribution of resources and promoting sustained community engagement.",
      category: "funding",
      status: "active",
      votesFor: 1234,
      votesAgainst: 456,
      totalVoters: 1690,
      quorumRequired: 2000,
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      aiRecommendation: {
        score: 88,
        reasoning: "Promotes fairness and global welfare. Budget analysis shows sustainability for 24 months. May increase contributor retention by 45%.",
      },
      ethicsScore: 91,
    },
    {
      id: "3",
      title: "AI Ethics Oversight Committee Formation",
      description: "Form a dedicated committee to review and approve all AI-driven decisions, ensuring human oversight and ethical alignment with universal values.",
      category: "governance",
      status: "active",
      votesFor: 2156,
      votesAgainst: 234,
      totalVoters: 2390,
      quorumRequired: 1500,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      aiRecommendation: {
        score: 96,
        reasoning: "Critical for responsible AI governance. Ensures human dignity and ethical alignment. Recommended best practice by global AI ethics standards.",
      },
      ethicsScore: 97,
    },
    {
      id: "4",
      title: "Open Source All Governance Code",
      description: "Make all smart contracts and AI decision algorithms publicly available for audit and community review, ensuring maximum transparency.",
      category: "ethics",
      status: "active",
      votesFor: 3421,
      votesAgainst: 89,
      totalVoters: 3510,
      quorumRequired: 3000,
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      aiRecommendation: {
        score: 98,
        reasoning: "Exemplary transparency and accountability. Aligns perfectly with open governance principles. Expected to increase trust by 67%.",
      },
      ethicsScore: 99,
    },
    {
      id: "5",
      title: "Carbon Offset Program for Operations",
      description: "Implement a comprehensive carbon offset strategy for all DAO operations, ensuring environmental sustainability and climate responsibility.",
      category: "ethics",
      status: "passed",
      votesFor: 4523,
      votesAgainst: 234,
      totalVoters: 4757,
      quorumRequired: 3000,
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      aiRecommendation: {
        score: 95,
        reasoning: "Strong alignment with global welfare and sustainability. Cost-effective implementation path identified. Industry-leading initiative.",
      },
      ethicsScore: 96,
    },
  ]);

  const handleVote = (proposalId: string, vote: "for" | "against") => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: vote === "for" ? p.votesFor + 1 : p.votesFor,
            votesAgainst: vote === "against" ? p.votesAgainst + 1 : p.votesAgainst,
            totalVoters: p.totalVoters + 1,
          };
        }
        return p;
      })
    );
    setVotedProposals((prev) => new Set(prev).add(proposalId));
  };

  const handleCreateProposal = (
    newProposal: Omit<
      Proposal,
      "id" | "votesFor" | "votesAgainst" | "totalVoters" | "aiRecommendation" | "ethicsScore"
    >
  ) => {
    const id = String(proposals.length + 1);
    const ethicsScore = Math.floor(Math.random() * 20) + 80; // 80-100
    const aiScore = Math.floor(Math.random() * 20) + 75; // 75-95

    const aiReasons = [
      "Aligns with core ethical principles and governance framework",
      "Demonstrates strong community benefit and sustainability",
      "Addresses critical governance needs effectively",
      "Promotes transparency and democratic participation",
      "Shows excellent alignment with universal values",
    ];

    setProposals((prev) => [
      {
        ...newProposal,
        id,
        votesFor: 0,
        votesAgainst: 0,
        totalVoters: 0,
        aiRecommendation: {
          score: aiScore,
          reasoning: aiReasons[Math.floor(Math.random() * aiReasons.length)],
        },
        ethicsScore,
      },
      ...prev,
    ]);
  };

  const activeProposals = proposals.filter((p) => p.status === "active");
  const passedProposals = proposals.filter((p) => p.status === "passed");
  const totalVoters = 5432;
  const participationRate = 68;

  const tabs = [
    { id: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { id: "proposals" as TabType, label: "Proposals", icon: FileText },
    { id: "analytics" as TabType, label: "Analytics", icon: BarChart3 },
    { id: "ethics" as TabType, label: "Ethics Framework", icon: Shield },
    { id: "transparency" as TabType, label: "Transparency", icon: BookOpen },
    { id: "treasury" as TabType, label: "Treasury", icon: Wallet },
    { id: "activity" as TabType, label: "Activity", icon: Activity },
    { id: "reputation" as TabType, label: "Reputation", icon: Lock },
    { id: "rpgf" as TabType, label: "Retroactive Funding", icon: DollarSign },
    { id: "privacy" as TabType, label: "Privacy Voting", icon: Zap },
    { id: "optimistic" as TabType, label: "Optimistic Governance", icon: Award },
    { id: "risk" as TabType, label: "Governance Risk", icon: AlertTriangle },
    { id: "impact" as TabType, label: "Impact Certificates", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl">EthosDAO</h1>
                <p className="text-xs text-gray-600">AI-Driven Ethical Governance</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateProposal(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Proposal
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setShowCreateProposal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg"
              >
                <Plus className="w-4 h-4" />
                New Proposal
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
              <h2 className="mb-2">Welcome to Decentralized AI Governance</h2>
              <p className="text-indigo-100 max-w-2xl">
                Participate in transparent, ethical decision-making powered by AI and universal values.
                Every vote matters, every decision is auditable, and every voice is heard.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-2xl">{proposals.length}</p>
                  <p className="text-sm text-indigo-100">Total Proposals</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-2xl">{activeProposals.length}</p>
                  <p className="text-sm text-indigo-100">Active Votes</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-2xl">{totalVoters.toLocaleString()}</p>
                  <p className="text-sm text-indigo-100">DAO Members</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <p className="text-2xl">{participationRate}%</p>
                  <p className="text-sm text-indigo-100">Participation</p>
                </div>
              </div>
            </div>

            {/* Active Proposals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2>Active Proposals</h2>
                <span className="text-sm text-gray-600">{activeProposals.length} active</span>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {activeProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onVote={handleVote}
                    hasVoted={votedProposals.has(proposal.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "proposals" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="mb-2">All Proposals</h2>
              <p className="text-gray-600">
                Browse and vote on all proposals. Each is evaluated by our AI ethics framework.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onVote={handleVote}
                  hasVoted={votedProposals.has(proposal.id)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="mb-2">Governance Analytics</h2>
              <p className="text-gray-600">
                Real-time insights into DAO participation, proposal trends, and ethics compliance.
              </p>
            </div>

            <GovernanceStats
              totalProposals={proposals.length}
              activeVoters={totalVoters}
              proposalsPassed={passedProposals.length}
              participationRate={participationRate}
            />
          </motion.div>
        )}

        {activeTab === "ethics" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <EthicsFramework />
          </motion.div>
        )}

        {activeTab === "transparency" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <TransparencyLog />
          </motion.div>
        )}

        {activeTab === "treasury" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <TreasuryDashboard />
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ActivityFeed />
          </motion.div>
        )}

        {activeTab === "reputation" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SoulboundReputation />
          </motion.div>
        )}

        {activeTab === "rpgf" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <RetroactiveFunding />
          </motion.div>
        )}

        {activeTab === "privacy" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ZKPrivacyVoting />
          </motion.div>
        )}

        {activeTab === "optimistic" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <OptimisticGovernance />
          </motion.div>
        )}

        {activeTab === "risk" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GovernanceRiskDashboard />
          </motion.div>
        )}

        {activeTab === "impact" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ImpactCertificates />
          </motion.div>
        )}
      </main>

      {/* Create Proposal Modal */}
      {showCreateProposal && (
        <CreateProposal
          onClose={() => setShowCreateProposal(false)}
          onSubmit={handleCreateProposal}
        />
      )}

      {/* Delegation Manager Modal */}
      {showDelegation && (
        <DelegationManager
          onClose={() => setShowDelegation(false)}
          onDelegate={(delegateId) => {
            console.log('Delegated to:', delegateId);
            setShowDelegation(false);
          }}
        />
      )}
    </div>
  );
}