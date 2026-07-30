/**
 * Blockchain Verification & NFTs Dashboard
 * On-chain project verification, impact NFT certificates, and decentralized governance
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Hash, Vote, FileCheck, Globe, CheckCircle,
  Clock, ExternalLink, Users, Award, Scale, MessageSquare, ChevronRight
} from 'lucide-react';

// Types
interface BlockchainProject {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
  network: string;
  status: 'verified' | 'pending' | 'unverified';
  verificationDate: string;
  impactScore: number;
  carbonCredits: number;
  transactions: number;
  lastUpdated: string;
  metadata: Record<string, string>;
}

interface ImpactNFT {
  id: string;
  name: string;
  description: string;
  image: string;
  projectId: string;
  impactMetrics: NFTImpactMetrics;
  mintedAt: string;
  owner: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  attributes: NFTAttribute[];
  transactionHash: string;
}

interface NFTImpactMetrics {
  carbonOffset: number;
  treesPlanted: number;
  waterSaved: number;
  biodiversityProtected: number;
  communitiesSupported: number;
}

interface NFTAttribute {
  trait: string;
  value: string;
  rarity: string;
}

interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votes: { for: number; against: number; abstain: number };
  threshold: number;
  deadline: string;
  createdAt: string;
  category: 'funding' | 'policy' | 'election' | 'partnership';
}

interface DAOMember {
  address: string;
  name: string;
  avatar: string;
  votingPower: number;
  proposalsCreated: number;
  votesCast: number;
  joinedAt: string;
}

// Mock Data
const blockchainProjects: BlockchainProject[] = [
  { id: 'p1', name: 'Amazon Rainforest Protection', description: 'Preserving 100,000 hectares of pristine rainforest', contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f9bD3a', network: 'Ethereum', status: 'verified', verificationDate: '2024-01-15', impactScore: 95, carbonCredits: 45000, transactions: 1250, lastUpdated: '2024-02-01', metadata: { auditor: 'Verra', standard: 'VCS', methodology: 'AR-ACM0003' } },
  { id: 'p2', name: 'Coral Reef Restoration', description: 'Restoring 500 hectares of coral reef ecosystem', contractAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72', network: 'Polygon', status: 'verified', verificationDate: '2024-01-20', impactScore: 88, carbonCredits: 12000, transactions: 890, lastUpdated: '2024-02-01', metadata: { auditor: 'Gold Standard', standard: 'GS VER', methodology: 'GS-AR-001' } },
  { id: 'p3', name: 'Mangrove Conservation', description: 'Protecting 200km of coastal mangrove forests', contractAddress: '0x123d35Cc6634C0532925a3b844Bc9e7595f9bD3b', network: 'Solana', status: 'pending', verificationDate: '', impactScore: 92, carbonCredits: 28000, transactions: 520, lastUpdated: '2024-02-01', metadata: { auditor: 'Plan Vivo', standard: 'PVS', methodology: 'PV-STRM' } },
  { id: 'p4', name: 'African Savanna Wildlife', description: 'Protecting 50,000 hectares of savanna habitat', contractAddress: '0x9ba1f109551bD432803012645Ac136ddd64DBA73', network: 'Ethereum', status: 'verified', verificationDate: '2024-01-10', impactScore: 85, carbonCredits: 35000, transactions: 1100, lastUpdated: '2024-02-01', metadata: { auditor: 'ACR', standard: 'ACR', methodology: 'ACR-Forest' } },
];

const impactNFTs: ImpactNFT[] = [
  { id: 'nft1', name: 'Amazon Guardian Certificate', description: 'Official impact certificate for Amazon rainforest protection', image: '🌳', projectId: 'p1', impactMetrics: { carbonOffset: 1000, treesPlanted: 50000, waterSaved: 250000, biodiversityProtected: 250, communitiesSupported: 15 }, mintedAt: '2024-01-15', owner: '0x742d...3a', rarity: 'legendary', attributes: [{ trait: 'Region', value: 'Amazon', rarity: '10%' }, { trait: 'Impact Level', value: 'Legendary', rarity: '5%' }, { trait: 'Carbon Tons', value: '1000+', rarity: '15%' }], transactionHash: '0xabc...123' },
  { id: 'nft2', name: 'Ocean Protector Badge', description: 'Recognition for coral reef restoration support', image: '🪸', projectId: 'p2', impactMetrics: { carbonOffset: 250, treesPlanted: 0, waterSaved: 100000, biodiversityProtected: 150, communitiesSupported: 8 }, mintedAt: '2024-01-20', owner: '0x8ba1...72', rarity: 'epic', attributes: [{ trait: 'Region', value: 'Pacific', rarity: '20%' }, { trait: 'Impact Level', value: 'Epic', rarity: '10%' }], transactionHash: '0xdef...456' },
  { id: 'nft3', name: 'Mangrove Guardian', description: 'Certificate for mangrove ecosystem protection', image: '🌿', projectId: 'p3', impactMetrics: { carbonOffset: 500, treesPlanted: 100000, waterSaved: 500000, biodiversityProtected: 100, communitiesSupported: 12 }, mintedAt: '2024-01-25', owner: '0x123d...3b', rarity: 'rare', attributes: [{ trait: 'Region', value: 'Southeast Asia', rarity: '25%' }], transactionHash: '0xghi...789' },
  { id: 'nft4', name: 'Wildlife Champion', description: 'Recognition for savanna wildlife protection', image: '🦁', projectId: 'p4', impactMetrics: { carbonOffset: 750, treesPlanted: 25000, waterSaved: 75000, biodiversityProtected: 200, communitiesSupported: 10 }, mintedAt: '2024-01-10', owner: '0x9ba1...73', rarity: 'common', attributes: [{ trait: 'Region', value: 'Africa', rarity: '30%' }], transactionHash: '0xjkl...012' },
];

const proposals: GovernanceProposal[] = [
  { id: 'prop1', title: 'Increase Carbon Credit Verification Rewards', description: 'Proposal to increase the verification reward pool by 20%', proposer: '0x742d...3a', status: 'active', votes: { for: 125000, against: 45000, abstain: 12000 }, threshold: 100000, deadline: '2024-02-15', createdAt: '2024-02-01', category: 'funding' },
  { id: 'prop2', title: 'Add New Verification Standard', description: 'Integrate the new Verra 4.0 verification standard', proposer: '0x8ba1...72', status: 'pending', votes: { for: 0, against: 0, abstain: 0 }, threshold: 75000, deadline: '2024-02-20', createdAt: '2024-02-05', category: 'policy' },
  { id: 'prop3', title: 'Partnership with Ocean Alliance', description: 'Approve partnership with Global Ocean Alliance', proposer: '0x123d...3b', status: 'passed', votes: { for: 95000, against: 22000, abstain: 8000 }, threshold: 80000, deadline: '2024-01-30', createdAt: '2024-01-15', category: 'partnership' },
  { id: 'prop4', title: 'Elect New Governance Council', description: 'Vote for the next term of the Governance Council', proposer: '0x9ba1...73', status: 'rejected', votes: { for: 45000, against: 68000, abstain: 15000 }, threshold: 100000, deadline: '2024-01-25', createdAt: '2024-01-10', category: 'election' },
];

const daoMembers: DAOMember[] = [
  { address: '0x742d...3a', name: 'EcoValidator_1', avatar: '🛡️', votingPower: 15.2, proposalsCreated: 12, votesCast: 145, joinedAt: '2023-06-15' },
  { address: '0x8ba1...72', name: 'OceanGuardian', avatar: '🌊', votingPower: 12.8, proposalsCreated: 8, votesCast: 98, joinedAt: '2023-07-20' },
  { address: '0x123d...3b', name: 'ForestSteward', avatar: '🌲', votingPower: 10.5, proposalsCreated: 15, votesCast: 120, joinedAt: '2023-05-10' },
  { address: '0x9ba1...73', name: 'ClimateAdvocate', avatar: '🌍', votingPower: 8.2, proposalsCreated: 5, votesCast: 67, joinedAt: '2023-08-05' },
  { address: '0x567d...8c', name: 'ImpactInvestor', avatar: '💎', votingPower: 22.1, proposalsCreated: 22, votesCast: 210, joinedAt: '2023-04-01' },
];

// Components
const ProjectCard: React.FC<{ project: BlockchainProject; index: number }> = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${project.status === 'verified' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
          <Shield className={`w-6 h-6 ${project.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{project.name}</h3>
          <p className="text-sm text-slate-400">{project.network}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'verified' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>
        {project.status}
      </span>
    </div>
    <p className="text-sm text-slate-300 mb-4">{project.description}</p>
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="p-2 rounded bg-slate-700/30 text-center">
        <div className="text-lg font-bold text-white">{project.impactScore}</div>
        <div className="text-xs text-slate-400">Impact Score</div>
      </div>
      <div className="p-2 rounded bg-slate-700/30 text-center">
        <div className="text-lg font-bold text-white">{(project.carbonCredits / 1000).toFixed(0)}K</div>
        <div className="text-xs text-slate-400">tCO2 Credits</div>
      </div>
      <div className="p-2 rounded bg-slate-700/30 text-center">
        <div className="text-lg font-bold text-white">{project.transactions}</div>
        <div className="text-xs text-slate-400">Transactions</div>
      </div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
      <div className="flex items-center gap-2">
        <Hash className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-400 font-mono">{project.contractAddress.slice(0, 10)}...{project.contractAddress.slice(-8)}</span>
      </div>
      <button className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300">
        View <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  </motion.div>
);

const NFTCard: React.FC<{ nft: ImpactNFT; index: number }> = ({ nft, index }) => {
  const rarityColors: Record<string, string> = { common: 'border-slate-500', rare: 'border-blue-500', epic: 'border-purple-500', legendary: 'border-amber-500' };
  const rarityGlow: Record<string, string> = { common: '', rare: 'shadow-blue-500/30', epic: 'shadow-purple-500/30', legendary: 'shadow-amber-500/30' };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-4 rounded-xl bg-slate-800/50 border-2 ${rarityColors[nft.rarity]} shadow-lg ${rarityGlow[nft.rarity]}`}
    >
      {nft.rarity === 'legendary' && (
        <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-white">
          LEGENDARY
        </div>
      )}
      <div className="text-6xl mb-4 text-center">{nft.image}</div>
      <h3 className="font-semibold text-white text-center mb-1">{nft.name}</h3>
      <p className="text-xs text-slate-400 text-center mb-4">{nft.description}</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 rounded bg-slate-700/30 text-center">
          <div className="text-lg font-bold text-emerald-400">{nft.impactMetrics.carbonOffset}</div>
          <div className="text-xs text-slate-400">tCO2 Offset</div>
        </div>
        <div className="p-2 rounded bg-slate-700/30 text-center">
          <div className="text-lg font-bold text-cyan-400">{nft.impactMetrics.treesPlanted.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Trees</div>
        </div>
        <div className="p-2 rounded bg-slate-700/30 text-center">
          <div className="text-lg font-bold text-blue-400">{(nft.impactMetrics.waterSaved / 1000).toFixed(0)}K</div>
          <div className="text-xs text-slate-400">Liters Water</div>
        </div>
        <div className="p-2 rounded bg-slate-700/30 text-center">
          <div className="text-lg font-bold text-purple-400">{nft.impactMetrics.biodiversityProtected}</div>
          <div className="text-xs text-slate-400">Species</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {nft.attributes.map((attr, i) => (
          <span key={i} className="px-2 py-1 rounded bg-slate-700/50 text-xs text-slate-300">
            {attr.trait}: <span className="text-cyan-400">{attr.value}</span>
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <span className="text-xs text-slate-400">Owner: {nft.owner}</span>
        <button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          View on Explorer <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

const ProposalCard: React.FC<{ proposal: GovernanceProposal; index: number }> = ({ proposal, index }) => {
  const totalVotes = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
  const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0;
  const statusColors: Record<string, string> = { active: 'bg-emerald-400/10 text-emerald-400', passed: 'bg-blue-400/10 text-blue-400', rejected: 'bg-red-400/10 text-red-400', pending: 'bg-amber-400/10 text-amber-400' };
  const categoryIcons: Record<string, string> = { funding: '💰', policy: '📋', election: '🗳️', partnership: '🤝' };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{categoryIcons[proposal.category]}</span>
          <div>
            <h3 className="font-semibold text-white">{proposal.title}</h3>
            <p className="text-sm text-slate-400">Proposer: {proposal.proposer}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[proposal.status]}`}>
          {proposal.status}
        </span>
      </div>
      <p className="text-sm text-slate-300 mb-4">{proposal.description}</p>
      {proposal.status !== 'pending' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>For: {proposal.votes.for.toLocaleString()}</span>
            <span>Against: {proposal.votes.against.toLocaleString()}</span>
            <span>Abstain: {proposal.votes.abstain.toLocaleString()}</span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400" style={{ width: `${forPercentage}%` }} />
            <div className="bg-red-400" style={{ width: `${(proposal.votes.against / totalVotes) * 100}%` }} />
            <div className="bg-slate-500" style={{ width: `${(proposal.votes.abstain / totalVotes) * 100}%` }} />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="w-4 h-4" />
          <span>Deadline: {proposal.deadline}</span>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-600/20 text-cyan-400 text-sm font-medium hover:bg-cyan-600/30">
          {proposal.status === 'active' ? 'Vote Now' : 'View Details'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const MemberRow: React.FC<{ member: DAOMember; index: number }> = ({ member, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-colors"
  >
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
      {member.avatar}
    </div>
    <div className="flex-1">
      <div className="font-medium text-white">{member.name}</div>
      <div className="text-xs text-slate-400 font-mono">{member.address}</div>
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-purple-400">{member.votingPower.toFixed(1)}%</div>
      <div className="text-xs text-slate-400">Voting Power</div>
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-white">{member.proposalsCreated}</div>
      <div className="text-xs text-slate-400">Proposals</div>
    </div>
    <div className="text-center">
      <div className="text-lg font-bold text-white">{member.votesCast}</div>
      <div className="text-xs text-slate-400">Votes</div>
    </div>
    <button className="p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50">
      <Vote className="w-5 h-5 text-slate-400" />
    </button>
  </motion.div>
);

// Main Component
export default function BlockchainVerification() {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="w-8 h-8 text-purple-400" />
              Blockchain Verification
            </h1>
            <p className="text-slate-400 mt-1">On-chain verification, NFT certificates, and decentralized governance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400">3 Verified Projects</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30">
              <FileCheck className="w-5 h-5" />
              Submit for Verification
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-slate-400">Verified Projects</span>
            </div>
            <div className="text-2xl font-bold text-white">3</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-slate-400">NFTs Minted</span>
            </div>
            <div className="text-2xl font-bold text-white">4</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Vote className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Active Proposals</span>
            </div>
            <div className="text-2xl font-bold text-white">1</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-slate-400">DAO Members</span>
            </div>
            <div className="text-2xl font-bold text-white">{daoMembers.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'projects', icon: Shield, label: 'Verified Projects' },
            { id: 'nfts', icon: Award, label: 'Impact NFTs' },
            { id: 'governance', icon: Scale, label: 'Governance' },
            { id: 'dao', icon: Users, label: 'DAO Members' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {blockchainProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'nfts' && (
            <motion.div
              key="nfts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-4 gap-4">
                {impactNFTs.map((nft, index) => (
                  <NFTCard key={nft.id} nft={nft} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'governance' && (
            <motion.div
              key="governance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {proposals.map((proposal, index) => (
                  <ProposalCard key={proposal.id} proposal={proposal} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'dao' && (
            <motion.div
              key="dao"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Atlas DAO Governance</h3>
                    <p className="text-slate-400">Decentralized decision-making for regenerative impact</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30">
                    <MessageSquare className="w-5 h-5" />
                    Create Proposal
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {daoMembers.map((member, index) => (
                  <MemberRow key={member.address} member={member} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
