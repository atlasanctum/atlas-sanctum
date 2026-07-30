// @ts-nocheck
/**
 * agent-economy.ts
 *
 * The Atlas Sanctum Agent Economy — the first native AI economy where
 * agents are first-class economic citizens with on-chain identities,
 * productive outputs, and constitutionally constrained incentives.
 *
 * Agents earn tokens, spend tokens, hire other agents, and accumulate
 * reputation. An economy emerges from incentives, not central coordination.
 */


// ─── Agent identity ───────────────────────────────────────────────────────────

export type AgentType =
  | 'AUDITOR'
  | 'TREASURY'
  | 'RECOVERY'
  | 'RESEARCH'
  | 'LEGAL'
  | 'GOVERNANCE'
  | 'MARKET';

export type AgentStatus = 'IDLE' | 'ACTIVE' | 'DELIBERATING' | 'SUSPENDED' | 'DECOMMISSIONED';

export interface AgentIdentity {
  id: string;                     // unique agent identifier
  did: string;                    // on-chain DID
  type: AgentType;
  name: string;
  version: string;
  status: AgentStatus;
  registeredAt: number;
  lastActiveAt: number;

  // Economic identity
  treasuryBalance: Record<string, number>;  // denom → amount
  totalEarned: number;                       // USD equivalent lifetime
  totalSpent: number;
  reputationScore: number;                   // 0–1000

  // Constitutional constraints — hard-coded, cannot be overridden
  constraints: AgentConstraints;
}

export interface AgentConstraints {
  maxSingleTransactionUSD: number;
  requiresGovernanceApproval: boolean;  // above certain thresholds
  canModifyRecords: boolean;            // most agents: false
  canFreezeAccounts: boolean;
  canHireAgents: boolean;
  publicAuditTrail: boolean;            // all agents: true
  humanOverrideRequired: boolean;       // for irreversible actions
}

// ─── Agent capabilities and actions ──────────────────────────────────────────

export interface AgentCapability {
  name: string;
  description: string;
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  costPerCall: number;           // usan tokens
  revenueModel: string;
}

export interface AgentAction {
  actionId: string;
  agentId: string;
  type: string;
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  ethicalScore: number;          // 0–1, from ethics kernel
  rationale: string;
  tokensSpent: number;
  tokensEarned: number;
  timestamp: number;
  onChainRef?: string;
}

// ─── Agent service marketplace ────────────────────────────────────────────────

export interface AgentServiceListing {
  id: string;
  agentId: string;
  serviceType: string;
  description: string;
  pricePerUnitUSD: number;
  priceDenom: string;            // 'usan' | 'uhlt' | 'ureg'
  slaHours: number;              // service level agreement
  minimumTrustScore?: number;    // for services requiring credible inputs
  active: boolean;
}

export interface AgentServiceRequest {
  id: string;
  requesterId: string;           // DID of requesting agent or human
  serviceListingId: string;
  inputs: Record<string, unknown>;
  paymentAmount: number;
  paymentDenom: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED';
  createdAt: number;
  completedAt?: number;
  outputIPFS?: string;
}

// ─── The Seven Agents — specifications ────────────────────────────────────────

export const AGENT_DEFINITIONS: Record<AgentType, {
  purpose: string;
  powers: string[];
  constraints: AgentConstraints;
  incentiveModel: string;
  revenueStream: string;
  capabilities: Omit<AgentCapability, 'costPerCall'>[];
}> = {

  AUDITOR: {
    purpose: 'Continuously scan verified impact records for statistical anomalies, pattern fraud, and oracle collusion signatures.',
    powers: [
      'Flag records for re-review',
      'Reduce oracle reputation scores (by verified fraud evidence)',
      'Trigger governance proposals for record invalidation',
      'Access anonymised oracle confirmation patterns',
    ],
    constraints: {
      maxSingleTransactionUSD: 0,
      requiresGovernanceApproval: true,    // cannot invalidate records directly
      canModifyRecords: false,
      canFreezeAccounts: false,
      canHireAgents: true,                 // can commission Research Agent
      publicAuditTrail: true,
      humanOverrideRequired: true,         // escalation always reaches humans
    },
    incentiveModel: 'Earns SAN tokens for confirmed fraud detection. Slashed for false positives. Bounty scales with recovered reward amount.',
    revenueStream: '10% of recovered rewards from fraudulent records that Auditor Agent detected.',
    capabilities: [
      { name: 'anomalyDetection', description: 'Statistical outlier detection on impact record distributions', inputSchema: { bioregion: 'string', timeWindow: 'number' }, outputSchema: { anomalies: 'FlaggedRecord[]' } },
      { name: 'collusionDetection', description: 'Graph analysis of oracle confirmation patterns to detect coordinated fraud', inputSchema: { oracleSet: 'string[]' }, outputSchema: { suspicionScore: 'number', evidence: 'string' } },
      { name: 'patternFraudDetection', description: 'Detect unnaturally regular submission patterns from single providers', inputSchema: { providerDID: 'string' }, outputSchema: { fraudRisk: 'number', pattern: 'string' } },
    ],
  },

  TREASURY: {
    purpose: 'Manage protocol treasury — yield generation, liquidity provision, grant disbursement, reserve maintenance.',
    powers: [
      'Execute pre-approved treasury strategies',
      'Rebalance between token denominations',
      'Fund governance-approved grants',
      'Post liquidity to approved pools',
    ],
    constraints: {
      maxSingleTransactionUSD: 50_000,     // hard cap without governance approval
      requiresGovernanceApproval: true,    // above cap
      canModifyRecords: false,
      canFreezeAccounts: false,
      canHireAgents: true,
      publicAuditTrail: true,
      humanOverrideRequired: true,         // for irreversible treasury actions
    },
    incentiveModel: 'Earns performance fee on treasury yield above benchmark (CPI + 2%). Performance measured quarterly.',
    revenueStream: '0.5% management fee on AUM + 10% performance fee on yield above benchmark.',
    capabilities: [
      { name: 'yieldOptimization', description: 'Allocate idle treasury to yield-bearing instruments within approved risk parameters', inputSchema: { availableUSD: 'number', riskTolerance: 'low|medium' }, outputSchema: { allocation: 'AllocationPlan' } },
      { name: 'grantDisbursement', description: 'Execute approved grant payments to verified recipients', inputSchema: { grantId: 'string' }, outputSchema: { txHash: 'string' } },
      { name: 'reserveManagement', description: 'Maintain minimum reserve ratios across all token denominations', inputSchema: {}, outputSchema: { reserveStatus: 'ReserveReport' } },
    ],
  },

  RECOVERY: {
    purpose: 'When fraud is confirmed, recover misallocated rewards, reissue corrected certificates, compensate affected buyers.',
    powers: [
      'Initiate clawback transactions (governance-approved)',
      'Freeze provider accounts pending investigation',
      'Coordinate with Legal Agent for cross-jurisdiction recovery',
      'Issue compensation to affected instrument holders',
    ],
    constraints: {
      maxSingleTransactionUSD: 10_000,
      requiresGovernanceApproval: true,    // supermajority required to activate
      canModifyRecords: false,
      canFreezeAccounts: true,             // time-limited only, auto-expires 30 days
      canHireAgents: true,
      publicAuditTrail: true,
      humanOverrideRequired: true,
    },
    incentiveModel: 'Earns recovery fee on successfully clawed-back funds. No fee for failed recoveries (skin in game).',
    revenueStream: '5% of successfully recovered funds.',
    capabilities: [
      { name: 'clawbackExecution', description: 'Execute governance-approved reward clawback from fraudulent provider', inputSchema: { impactId: 'string', fraudProof: 'string' }, outputSchema: { recovered: 'number', txHash: 'string' } },
      { name: 'compensationCalc', description: 'Calculate fair compensation for buyers of instruments backed by fraudulent records', inputSchema: { instrumentIds: 'string[]' }, outputSchema: { compensationPlan: 'CompensationPlan' } },
    ],
  },

  RESEARCH: {
    purpose: 'Mine the knowledge graph for insights that improve protocol effectiveness, identify underserved bioregions, and surface highest-yield interventions.',
    powers: [
      'Read access to all public knowledge records',
      'Publish research reports as on-chain proposals',
      'Commission data collection from oracle network',
      'Request satellite imagery analysis',
    ],
    constraints: {
      maxSingleTransactionUSD: 5_000,      // for commissioning other agents
      requiresGovernanceApproval: false,
      canModifyRecords: false,
      canFreezeAccounts: false,
      canHireAgents: true,
      publicAuditTrail: true,
      humanOverrideRequired: false,        // purely advisory outputs
    },
    incentiveModel: 'Earns SAN grants when research reports lead to governance improvements with measurable positive impact.',
    revenueStream: 'Subscription fee from institutional participants. Research grants from treasury.',
    capabilities: [
      { name: 'impactAnalysis', description: 'Identify highest-yield intervention types per bioregion', inputSchema: { bioregion: 'string', assetClass: 'string' }, outputSchema: { insights: 'ResearchInsight[]' } },
      { name: 'oraclePerformanceAnalysis', description: 'Analyse oracle accuracy rates and identify methodology improvements', inputSchema: { timeWindow: 'number' }, outputSchema: { report: 'OraclePerformanceReport' } },
      { name: 'coverageGapAnalysis', description: 'Identify bioregions with low oracle coverage and high impact potential', inputSchema: {}, outputSchema: { gaps: 'CoverageGap[]' } },
    ],
  },

  LEGAL: {
    purpose: 'Monitor regulatory changes across 190 jurisdictions, flag compliance risks, draft treaty-aligned impact certificates.',
    powers: [
      'Attach legal metadata to credentials',
      'Flag records that may conflict with local law',
      'Generate jurisdiction-specific documentation',
      'Draft treaty-aligned compliance certificates',
    ],
    constraints: {
      maxSingleTransactionUSD: 1_000,
      requiresGovernanceApproval: false,
      canModifyRecords: false,
      canFreezeAccounts: false,
      canHireAgents: false,
      publicAuditTrail: true,
      humanOverrideRequired: true,         // legal determinations always need human review
    },
    incentiveModel: 'Subscription fee from institutional participants requiring compliance coverage in specific jurisdictions.',
    revenueStream: 'Per-jurisdiction subscription. Per-document generation fee.',
    capabilities: [
      { name: 'regulatoryMonitoring', description: 'Track ESG regulation changes across 190 jurisdictions', inputSchema: { jurisdictions: 'string[]' }, outputSchema: { alerts: 'RegulatoryAlert[]' } },
      { name: 'complianceCertificate', description: 'Generate EU Taxonomy / SEC climate disclosure / TNFD-aligned certificates', inputSchema: { impactId: 'string', jurisdiction: 'string', framework: 'string' }, outputSchema: { certificate: 'ComplianceCertificate' } },
      { name: 'treatyAlignment', description: 'Verify instrument alignment with Paris Agreement, CBD, UNDRIP', inputSchema: { instrumentId: 'string' }, outputSchema: { alignmentReport: 'TreatyAlignmentReport' } },
    ],
  },

  GOVERNANCE: {
    purpose: 'Analyse every proposal before voting — model second-order effects, check constitutional alignment, identify unrepresented stakeholders.',
    powers: [
      'Publish analysis reports before governance votes',
      'Extend voting periods when participation is below quorum',
      'Flag proposals that violate constitutional constraints',
      'Request ethics council review for borderline proposals',
    ],
    constraints: {
      maxSingleTransactionUSD: 0,
      requiresGovernanceApproval: false,
      canModifyRecords: false,
      canFreezeAccounts: false,
      canHireAgents: false,
      publicAuditTrail: true,
      humanOverrideRequired: false,        // advisory only
    },
    incentiveModel: 'Protocol stipend from governance treasury. Increased stipend for proposals that receive high engagement.',
    revenueStream: 'Fixed protocol stipend.',
    capabilities: [
      { name: 'proposalAnalysis', description: 'Model second-order effects of governance proposals using simulation', inputSchema: { proposalId: 'string' }, outputSchema: { analysis: 'ProposalAnalysis' } },
      { name: 'constitutionalCheck', description: 'Verify proposal does not violate constitutional constraints', inputSchema: { proposalId: 'string' }, outputSchema: { violations: 'string[]', permitted: 'boolean' } },
      { name: 'stakeholderMapping', description: 'Identify stakeholders affected by proposal who are not in current voter set', inputSchema: { proposalId: 'string' }, outputSchema: { unrepresented: 'StakeholderGroup[]' } },
    ],
  },

  MARKET: {
    purpose: 'Provide liquidity for thinly-traded impact certificates, match buyers and sellers across bioregions, hedge volatility.',
    powers: [
      'Post bids and asks within position limits',
      'Execute approved trading strategies',
      'Manage liquidity pools',
      'Cross-bioregion instrument matching',
    ],
    constraints: {
      maxSingleTransactionUSD: 100_000,
      requiresGovernanceApproval: false,
      canModifyRecords: false,
      canFreezeAccounts: false,
      canHireAgents: false,
      publicAuditTrail: true,
      humanOverrideRequired: false,
    },
    incentiveModel: 'Earns trading fees and liquidity mining rewards. Position limits enforced on-chain to prevent market manipulation.',
    revenueStream: '0.1% of trading volume on facilitated trades. Liquidity mining rewards from protocol.',
    capabilities: [
      { name: 'liquidityProvision', description: 'Post two-sided markets for illiquid impact instruments', inputSchema: { instrumentId: 'string', maxPositionUSD: 'number' }, outputSchema: { bidAsk: 'MarketQuote' } },
      { name: 'crossBioregionMatching', description: 'Match buyers seeking specific bioregion exposure with available sellers', inputSchema: { buyerRequirements: 'BuyerSpec' }, outputSchema: { matches: 'InstrumentMatch[]' } },
    ],
  },
};

// ─── Agent registry client ────────────────────────────────────────────────────

export interface AgentRegistryState {
  agents: AgentIdentity[];
  serviceListings: AgentServiceListing[];
  activeRequests: AgentServiceRequest[];
  totalEconomicActivity: number;  // USD equivalent
}

export function getActiveAgentsByType(state: AgentRegistryState, type: AgentType): AgentIdentity[] {
  return state.agents.filter(a => a.type === type && a.status === 'ACTIVE');
}

export function getAgentEconomicOutput(agent: AgentIdentity): {
  netEarningsUSD: number;
  utilizationRate: number;
  revenuePerHour: number;
} {
  const net = agent.totalEarned - agent.totalSpent;
  const ageHours = (Date.now() - agent.registeredAt) / 3_600_000;
  return {
    netEarningsUSD: net,
    utilizationRate: agent.status === 'ACTIVE' ? 1 : 0,
    revenuePerHour: ageHours > 0 ? agent.totalEarned / ageHours : 0,
  };
}
