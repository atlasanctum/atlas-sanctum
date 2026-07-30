// Core Types for Decentralized AI Governance

export interface Member {
  id: string;
  wallet_address: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  soulbound_token_id?: string;
  voting_power: string;
  reputation_score: number;
  participation_rate: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface Domain {
  id: string;
  name: string;
  description?: string;
  color_code?: string;
  created_at: Date;
}

export interface Proposal {
  id: string;
  proposer_id?: string;
  title: string;
  description: string;
  proposal_hash?: string;
  proposal_type: 'parameter_change' | 'treasury_allocation' | 'partnership' | 'upgrade' | 'emergency' | 'constitutional';
  status: 'draft' | 'active' | 'pending_execution' | 'executed' | 'rejected' | 'defeated' | 'expired';
  voting_mechanism: 'quadratic' | 'conviction' | 'holographic' | 'futarchy' | 'liquid' | 'optimistic' | 'zk';
  start_at?: Date;
  end_at?: Date;
  quorum: number;
  yes_votes: string;
  no_votes: string;
  total_votes: string;
  execution_data?: Record<string, any>;
  risk_score: number;
  ai_ethics_score: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProposalChoice {
  id: string;
  proposal_id: string;
  label: string;
  description?: string;
  sort_order: number;
}

export interface Vote {
  id: string;
  proposal_id: string;
  voter_id?: string;
  choice_id?: string;
  voting_power: string;
  quadratic_weight: string;
  justification?: string;
  signature?: string;
  voted_at: Date;
}

export interface Delegation {
  id: string;
  delegator_id: string;
  delegate_id: string;
  voting_power: string;
  domains?: string[];
  expires_at?: Date;
  is_active: boolean;
  created_at: Date;
}

export interface Challenge {
  id: string;
  proposal_id: string;
  challenger_id?: string;
  bond: string;
  reason: string;
  evidence?: string[];
  status: 'pending' | 'validated' | 'rejected' | 'resolved';
  valid_votes: string;
  invalid_votes: string;
  submitted_at: Date;
  resolved_at?: Date;
}

export interface ImpactCertificate {
  id: string;
  proposal_id?: string;
  certificate_type: 'hypercert' | 'impact_nft' | 'outcome_token';
  predicted_impact: {
    metric: string;
    value: number;
    confidence: number;
  };
  current_price?: string;
  total_supply?: string;
  circulating_supply?: string;
  maturity_date?: Date;
  status: 'active' | 'mature' | 'settled';
  settlement_value?: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface RGFProject {
  id: string;
  round_id?: string;
  contributor_id?: string;
  title: string;
  description: string;
  impact_report?: string;
  impact_metrics?: Record<string, any>;
  funding_requested?: string;
  funding_allocated?: string;
  status: 'submitted' | 'under_review' | 'funded' | 'rejected';
  submitted_at: Date;
}

export interface ThreatDetection {
  id: string;
  proposal_id?: string;
  threat_type: 'flash_loan' | 'sybil_attack' | 'vote_buying' | 'whale_manipulation' | 'treasury_drain' | 'coordinated_voting' | 'delegation_anomaly';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affected_entities?: string[];
  status: 'active' | 'mitigated' | 'investigating';
  confidence: number;
  automatic_response?: string;
  detected_at: Date;
}

// Request Types
export interface CreateProposalRequest {
  title: string;
  description: string;
  proposal_type: Proposal['proposal_type'];
  voting_mechanism: Proposal['voting_mechanism'];
  start_at?: string;
  end_at?: string;
  choices?: string[];
  quorum?: number;
  execution_data?: Record<string, any>;
}

export interface CastVoteRequest {
  proposal_id: string;
  choice: string;
  voting_power: number;
  justification?: string;
  signature?: string;
}

export interface CreateDelegationRequest {
  delegate_id: string;
  voting_power: number;
  domains?: string[];
  expires_at?: string;
}

export interface CreateChallengeRequest {
  proposal_id: string;
  bond: number;
  reason: string;
  evidence?: string[];
}

export interface CreateRGFProjectRequest {
  round_id: string;
  title: string;
  description: string;
  impact_report?: string;
  impact_metrics?: Record<string, any>;
  funding_requested: number;
}
