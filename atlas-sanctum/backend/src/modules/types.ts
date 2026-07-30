/**
 * Atlas Sanctum — African Economic OS
 * Shared module types across all 6 microservices
 *
 * Inspired by: Ubuntu, Chama/Susu, Barter, Guild/Apprenticeship,
 * Land Stewardship, Council Governance
 */

// ─── Identity ─────────────────────────────────────────────────────────────────

export interface DID {
  id: string;           // did:sanctum:<bioregion>:<uuid>
  publicKey: string;
  bioregion: string;
  createdAt: Date;
}

// ─── Ubuntu Module ────────────────────────────────────────────────────────────

export interface TrustEdge {
  fromUserId: string;
  toUserId: string;
  weight: number;       // 0–1
  context: 'chama' | 'guild' | 'exchange' | 'governance' | 'land';
  createdAt: Date;
  updatedAt: Date;
}

export interface ReputationScore {
  userId: string;
  overall: number;      // 0–100
  byContext: Record<TrustEdge['context'], number>;
  totalEndorsements: number;
  updatedAt: Date;
}

export interface CollectiveDecision {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, string>;   // userId → option
  result?: string;
  bioregion: string;
  closedAt?: Date;
  createdAt: Date;
}

// ─── Chama Module ─────────────────────────────────────────────────────────────

export type ChamaStatus = 'forming' | 'active' | 'paused' | 'dissolved';

export interface Chama {
  id: string;
  name: string;
  bioregion: string;
  members: string[];              // user IDs
  contributionAmount: number;
  currency: string;
  cycleFrequency: 'weekly' | 'biweekly' | 'monthly';
  currentCycle: number;
  payoutOrder: string[];          // ordered user IDs
  status: ChamaStatus;
  walletBalance: number;
  createdAt: Date;
}

export interface ChamaContribution {
  id: string;
  chamaId: string;
  userId: string;
  amount: number;
  cycle: number;
  paidAt: Date;
  txHash?: string;
}

export interface ChamaPayout {
  id: string;
  chamaId: string;
  recipientId: string;
  amount: number;
  cycle: number;
  executedAt: Date;
  txHash?: string;
}

// ─── Exchange Module ──────────────────────────────────────────────────────────

export type AssetType =
  | 'carbon-credit'
  | 'agricultural-output'
  | 'water-right'
  | 'labor-hour'
  | 'impact-credit'
  | 'data-contribution'
  | 'land-stewardship-token';

export interface AssetListing {
  id: string;
  ownerId: string;
  assetType: AssetType;
  quantity: number;
  unit: string;
  askPrice: number;
  askCurrency: string;
  bioregion: string;
  description: string;
  verifiedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface TradeMatch {
  id: string;
  listingId: string;
  buyerId: string;
  quantity: number;
  agreedPrice: number;
  status: 'pending' | 'executed' | 'cancelled';
  matchedAt: Date;
  executedAt?: Date;
  txHash?: string;
}

export interface PriceOracle {
  assetType: AssetType;
  price: number;
  currency: string;
  confidence: number;
  sources: string[];
  updatedAt: Date;
}

// ─── Guild Module ─────────────────────────────────────────────────────────────

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  prerequisites: string[];        // skill IDs
  level: 'apprentice' | 'journeyman' | 'master';
}

export interface GuildProfile {
  userId: string;
  skills: Array<{ skillId: string; level: SkillNode['level']; verifiedBy?: string }>;
  mentorId?: string;
  apprentices: string[];
  reputationScore: number;
  completedTasks: number;
  joinedAt: Date;
}

export interface GuildTask {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];       // skill IDs
  posterId: string;
  assigneeId?: string;
  reward: number;
  rewardCurrency: string;
  status: 'open' | 'assigned' | 'submitted' | 'verified' | 'paid';
  bioregion: string;
  createdAt: Date;
  completedAt?: Date;
}

// ─── Land Module ──────────────────────────────────────────────────────────────

export interface LandParcel {
  id: string;
  registrantId: string;
  bioregion: string;
  coordinates: Array<{ lat: number; lon: number }>;  // polygon
  hectares: number;
  landUse: 'agriculture' | 'forest' | 'wetland' | 'urban' | 'sacred' | 'mixed';
  indigenousCustodians?: string[];
  carbonCreditsIssued: number;
  biodiversityScore: number;      // 0–100
  registeredAt: Date;
  lastAuditAt?: Date;
}

export interface LandUsageRecord {
  id: string;
  parcelId: string;
  reportedBy: string;
  usageType: string;
  ndvi: number;
  soilCarbonTons: number;
  waterQualityScore: number;
  observedAt: Date;
}

export interface ResourceRight {
  id: string;
  parcelId: string;
  holderUserId: string;
  rightType: 'water' | 'timber' | 'mineral' | 'grazing' | 'carbon';
  quantity: number;
  unit: string;
  grantedAt: Date;
  expiresAt?: Date;
  grantedBy: string;              // council ID
}

// ─── Council Module ───────────────────────────────────────────────────────────

export interface Council {
  id: string;
  name: string;
  bioregion: string;
  members: CouncilMember[];
  quorum: number;
  indigenousQuota: number;        // min % indigenous members
  createdAt: Date;
}

export interface CouncilMember {
  userId: string;
  role: 'elder' | 'steward' | 'scientist' | 'youth' | 'observer';
  reputationWeight: number;       // 0–1 multiplier on vote
  isIndigenous: boolean;
  joinedAt: Date;
}

export interface Proposal {
  id: string;
  councilId: string;
  title: string;
  description: string;
  proposedBy: string;
  category: 'land' | 'chama' | 'exchange' | 'guild' | 'ubuntu' | 'general';
  votes: ProposalVote[];
  status: 'open' | 'passed' | 'rejected' | 'vetoed' | 'simulating';
  requiresSupermajority: boolean;
  sacredLandImpact: boolean;
  simulationResult?: DecisionSimulation;
  createdAt: Date;
  closedAt?: Date;
}

export interface ProposalVote {
  memberId: string;
  decision: 'yes' | 'no' | 'abstain' | 'veto';
  rationale?: string;
  weight: number;
  votedAt: Date;
}

export interface DecisionSimulation {
  proposalId: string;
  predictedOutcome: string;
  confidenceScore: number;
  risks: string[];
  opportunities: string[];
  biasFlags: string[];
  recommendedPath: string;
  simulatedAt: Date;
}

// ─── AI Core ──────────────────────────────────────────────────────────────────

export interface AISimulationRequest {
  domain: 'chama' | 'ubuntu' | 'exchange' | 'guild' | 'land' | 'council' | 'cross-domain';
  scenario: string;
  variables: Record<string, number | string>;
  horizon: 1 | 5 | 10 | 25;     // years
  bioregion?: string;
}

export interface AISimulationResult {
  requestId: string;
  domain: AISimulationRequest['domain'];
  projections: Record<string, number[]>;
  risks: Array<{ description: string; probability: number; severity: 'low' | 'medium' | 'high' }>;
  recommendations: string[];
  confidence: number;
  generatedAt: Date;
}

export interface AIRiskAnalysis {
  targetId: string;
  targetType: 'chama' | 'trade' | 'land' | 'proposal' | 'guild-task';
  riskScore: number;              // 0–100
  factors: Array<{ factor: string; contribution: number }>;
  recommendation: 'proceed' | 'caution' | 'block';
  analysedAt: Date;
}
