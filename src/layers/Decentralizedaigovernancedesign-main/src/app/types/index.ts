// Core Types for Production

export interface Address {
  value: string;
  isValid: boolean;
}

export interface Transaction {
  hash: string;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

export interface SoulboundToken {
  tokenId: string;
  holder: Address;
  mintDate: number;
  reputation: ReputationMetrics;
  domainExpertise: DomainExpertise[];
  badges: Badge[];
  transferable: false;
}

export interface ReputationMetrics {
  overall: number;
  votingAccuracy: number;
  expertiseScore: number;
  participationConsistency: number;
  ethicalAlignment: number;
  contributionValue: number;
}

export interface DomainExpertise {
  domain: string;
  score: number;
  rank: number;
  totalExperts: number;
  verifications: number;
  lastActivity: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: number;
  imageUrl?: string;
}

export interface ZKProof {
  proof: {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
  };
  publicSignals: string[];
}

export interface ZKVote {
  proposalId: string;
  commitment: string;
  nullifier: string;
  proof: ZKProof;
  timestamp: number;
}

export interface OptimisticProposal {
  id: string;
  proposalHash: string;
  proposer: Address;
  bond: bigint;
  timelockEnd: number;
  riskScore: number;
  status: 'pending' | 'challenged' | 'executed' | 'cancelled';
  challenges: Challenge[];
  executionData: string;
}

export interface Challenge {
  id: string;
  proposalId: string;
  challenger: Address;
  bond: bigint;
  reason: string;
  evidence: string[];
  status: 'pending' | 'validated' | 'rejected';
  votes: {
    valid: number;
    invalid: number;
  };
  submittedAt: number;
}

export interface RPGFProject {
  id: string;
  contributor: Address;
  roundId: string;
  title: string;
  description: string;
  impactReport: string;
  impactMetrics: ImpactMetrics;
  attestations: ImpactAttestation[];
  fundingRequested: bigint;
  fundingAllocated?: bigint;
  status: 'submitted' | 'under_review' | 'funded' | 'rejected';
  submittedAt: number;
}

export interface ImpactMetrics {
  usersAffected: number;
  proposalsImproved: number;
  codeContributions: number;
  documentationPages: number;
  securityVulnerabilitiesFixed: number;
  treasuryValueCreated: bigint;
}

export interface ImpactAttestation {
  id: string;
  projectId: string;
  attester: Address;
  attestation: string;
  impactRating: number; // 1-5
  timestamp: number;
  signature: string;
}

export interface ImpactCertificate {
  id: string;
  proposalId: string;
  certificateType: 'hypercert' | 'impact_nft' | 'outcome_token';
  predictedImpact: {
    metric: string;
    value: number;
    confidence: number;
  };
  currentPrice: bigint;
  totalSupply: bigint;
  circulatingSupply: bigint;
  maturityDate: number;
  status: 'active' | 'mature' | 'settled';
  settlementValue?: bigint;
}

export interface ThreatDetection {
  id: string;
  type: 'flash_loan' | 'sybil_attack' | 'vote_buying' | 'whale_manipulation' | 'treasury_drain' | 'coordinated_voting' | 'delegation_anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  detectedAt: number;
  affected: string[];
  status: 'active' | 'mitigated' | 'investigating';
  confidence: number; // 0-100
  automaticResponse?: string;
}

export interface GovernanceMetrics {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  rejectedProposals: number;
  totalVoters: number;
  activeVoters: number;
  participationRate: number;
  averageQuorum: number;
  treasuryBalance: bigint;
  totalDelegated: bigint;
  avgDecisionTime: number; // seconds
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Error Types
export class GovernanceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GovernanceError';
  }
}

export class BlockchainError extends Error {
  constructor(
    public code: string,
    message: string,
    public txHash?: string
  ) {
    super(message);
    this.name = 'BlockchainError';
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
