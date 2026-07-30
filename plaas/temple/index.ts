/**
 * PLAAS Layer 2 — THE TEMPLE
 * Ethical & Sacred Governance Layer
 *
 * Atlas Sanctum as trusted civic infrastructure.
 * Inspired by: ancient council systems, Ubuntu philosophy,
 * Andean Sumak Kawsay, indigenous consensus traditions.
 *
 * Responsibilities:
 *  - Sacred Governance Core (wisdom councils, supermajority voting)
 *  - Ethical AI alignment guardrails
 *  - Cultural preservation chambers
 *  - Stewardship protocols & covenant ethics
 *  - Anti-manipulation & anti-surveillance safeguards
 *  - Truth integrity verification
 */

import type { WisdomCouncil, CouncilMember, Covenant } from '../packages/types';

// ─── Ethical Guardrails ───────────────────────────────────────────────────────

export type EthicalViolationType =
  | 'surveillance-capitalism'
  | 'addictive-pattern'
  | 'exploitative-ux'
  | 'centralized-domination'
  | 'cultural-appropriation'
  | 'sacred-land-violation'
  | 'data-extraction';

export interface EthicalAudit {
  id: string;
  targetId: string;           // component, route, or service ID
  targetType: 'ui' | 'api' | 'model' | 'covenant';
  violations: EthicalViolationType[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  reviewedBy: string[];       // council member IDs
  resolvedAt?: Date;
  notes: string;
}

// ─── Sacred Governance ────────────────────────────────────────────────────────

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  council: WisdomCouncil;
  votes: GovernanceVote[];
  status: 'open' | 'passed' | 'rejected' | 'vetoed';
  requiresSupermajority: boolean;  // 67%+ for sacred land decisions
  sacredLandImpact: boolean;
  createdAt: Date;
  closedAt?: Date;
}

export interface GovernanceVote {
  memberId: string;
  decision: 'yes' | 'no' | 'abstain' | 'veto';
  rationale?: string;
  votedAt: Date;
}

// ─── Cultural Preservation ────────────────────────────────────────────────────

export interface CulturalChamber {
  id: string;
  tradition: string;
  bioregion: string;
  custodians: CouncilMember[];
  sacredSites: SacredSite[];
  protectedKnowledge: string[];   // wisdom entry IDs — access-controlled
}

export interface SacredSite {
  id: string;
  name: string;
  coordinates: { lat: number; lon: number };
  protectionLevel: 'community' | 'bioregional' | 'planetary';
  accessPolicy: 'open' | 'consent-required' | 'closed';
}

// ─── Temple Layer Interface ───────────────────────────────────────────────────

export interface TempleLayer {
  auditForEthics(targetId: string, targetType: EthicalAudit['targetType']): Promise<EthicalAudit>;
  submitProposal(proposal: Omit<GovernanceProposal, 'id' | 'votes' | 'status' | 'createdAt'>): Promise<GovernanceProposal>;
  castVote(proposalId: string, vote: GovernanceVote): Promise<GovernanceProposal>;
  validateCovenant(covenant: Covenant): Promise<{ approved: boolean; concerns: string[] }>;
  getSacredSites(bioregion: string): Promise<SacredSite[]>;
}
