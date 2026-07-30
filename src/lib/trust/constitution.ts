/**
 * constitution.ts
 *
 * The Atlas Sanctum Constitutional Framework.
 *
 * This file encodes the constitutional rules as executable TypeScript —
 * not just documentation. The ConstitutionEngine validates any proposed
 * action against the constitutional constraints before it reaches governance.
 *
 * What is in this file governs what can and cannot happen in the protocol.
 * It is the highest law of Atlas Sanctum.
 */

// ─── Immutable Rights — TIER 4, cannot be amended ────────────────────────────

export const IMMUTABLE_RIGHTS = [
  {
    id: 'IR-1',
    title: 'Universal Submission Right',
    text: 'Every person has the right to submit a verified claim about real-world impact without requiring permission from any central authority.',
    enforcedAt: 'transaction_validation',
  },
  {
    id: 'IR-2',
    title: 'Indigenous Data Sovereignty',
    text: 'Indigenous communities have absolute data sovereignty over knowledge originating from their territories. No entity may access, use, or commercialise this knowledge without explicit, revocable community consent.',
    enforcedAt: 'access_control',
  },
  {
    id: 'IR-3',
    title: 'Governance Power Limit',
    text: 'No single entity — human, organisational, or artificial — may control more than 10% of governance voting weight at any time.',
    enforcedAt: 'vote_tallying',
  },
  {
    id: 'IR-4',
    title: 'Oracle Type Diversity',
    text: 'The oracle network must always include a minimum of three independent oracle types (HUMAN, API, SENSOR) for any category of verification where financial instruments are issued.',
    enforcedAt: 'verification_threshold',
  },
  {
    id: 'IR-5',
    title: 'Open Source Requirement',
    text: 'All protocol code is open source and freely auditable under an OSI-approved licence. No closed-source module may be introduced into the core protocol.',
    enforcedAt: 'governance_review',
  },
  {
    id: 'IR-6',
    title: 'Record Immutability',
    text: 'No verified impact certificate may be retroactively invalidated without the consent of the original issuer AND a supermajority governance vote with a 90-day public challenge period.',
    enforcedAt: 'record_modification',
  },
  {
    id: 'IR-7',
    title: 'AI Constitutional Subjection',
    text: 'All AI agents operating within Atlas Sanctum are subject to the same constitutional constraints as human participants. No agent may claim exemption from governance, accountability, or audit requirements on the basis of being artificial.',
    enforcedAt: 'agent_registration',
  },
] as const;

// ─── Amendment Tiers ──────────────────────────────────────────────────────────

export type AmendmentTier = 1 | 2 | 3 | 4;

export const AMENDMENT_RULES: Record<AmendmentTier, {
  name: string;
  threshold: number;       // fraction of total voting weight
  votingDays: number;
  timelockDays: number;
  scope: string;
  examples: string[];
}> = {
  1: {
    name: 'Operational',
    threshold: 0.51,
    votingDays: 7,
    timelockDays: 0,
    scope: 'Day-to-day operational parameters',
    examples: ['Oracle SLA requirements', 'Fee rate adjustments < 0.1%', 'Agent stipend amounts'],
  },
  2: {
    name: 'Economic',
    threshold: 0.67,
    votingDays: 30,
    timelockDays: 30,
    scope: 'Economic parameters with significant financial impact',
    examples: ['Token emission rates', 'Reward split percentages', 'Bond coupon methodology', 'Treasury allocation rules'],
  },
  3: {
    name: 'Constitutional',
    threshold: 0.80,
    votingDays: 90,
    timelockDays: 90,
    scope: 'Governance rules and structural changes',
    examples: ['Voting weight formulas', 'Agent power expansions', 'New asset class approval', 'Emergency power definitions'],
  },
  4: {
    name: 'Immutable',
    threshold: 1.01,   // effectively impossible — requires > 100% = cannot pass
    votingDays: 0,
    timelockDays: 0,
    scope: 'Immutable rights — no amendment mechanism exists',
    examples: IMMUTABLE_RIGHTS.map(r => r.title),
  },
};

// ─── Separation of Powers ─────────────────────────────────────────────────────

export const POWERS = {
  legislative: {
    name: 'DAO Governance',
    description: 'Makes rules through proposals and votes',
    canDo: ['Submit proposals', 'Vote on proposals', 'Ratify emergency actions'],
    cannotDo: ['Execute proposals directly', 'Override constitutional constraints', 'Access treasury without proposal'],
  },
  executive: {
    name: 'Agent Network',
    description: 'Executes passed proposals autonomously',
    canDo: ['Execute governance-approved actions', 'Manage day-to-day operations', 'Hire sub-agents within approved budgets'],
    cannotDo: ['Modify governance rules', 'Override constitutional constraints', 'Execute unapproved actions'],
  },
  judicial: {
    name: 'Ethics Council',
    description: 'Reviews proposals for constitutional alignment before votes',
    canDo: ['Flag unconstitutional proposals', 'Require impact assessments', 'Invoke emergency constitutional review'],
    cannotDo: ['Block proposals unilaterally (advisory only, except Tier 4 violations)', 'Vote on proposals', 'Execute actions'],
  },
  verification: {
    name: 'Oracle Network',
    description: 'Independently verifies real-world claims',
    canDo: ['Confirm or reject impact records', 'Set ecosystem baselines', 'Participate in dispute resolution'],
    cannotDo: ['Vote in governance', 'Access treasury', 'Modify rules'],
  },
} as const;

// ─── Emergency Powers ─────────────────────────────────────────────────────────

export const EMERGENCY_POWERS = {
  activationRequirements: {
    ethicsCouncilSignatures: 5,   // of 7 council members
    validatorSignatures: 3,       // of 5 core validators
    maxDurationHours: 72,
  },
  permitted: [
    'Pause new impact record submissions',
    'Pause new instrument issuance',
    'Freeze a specific account pending investigation (max 30 days)',
  ],
  prohibited: [
    'Modify any account balance',
    'Invalidate existing verified records',
    'Change governance rules',
    'Remove constitutional rights',
    'Extend emergency beyond 72 hours without governance ratification',
  ],
  autoExpiry: true,
  ratificationRequired: true,
  ratificationWindowDays: 30,
};

// ─── Constitution Engine ──────────────────────────────────────────────────────

export interface ConstitutionalReview {
  permitted: boolean;
  tier: AmendmentTier | null;
  violations: string[];
  warnings: string[];
  requiredThreshold: number;
  requiredVotingDays: number;
  requiredTimelockDays: number;
  ethicsCouncilReviewRequired: boolean;
}

export interface ProposedAction {
  type: string;
  description: string;
  affectedParameters: string[];
  proposerVotingWeight: number;
  targetAmendmentTier: AmendmentTier;
}

export function reviewProposal(action: ProposedAction): ConstitutionalReview {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check for Tier 4 violations — these are absolute blocks
  for (const right of IMMUTABLE_RIGHTS) {
    if (wouldViolateRight(action, right.id)) {
      violations.push(`Violates immutable right ${right.id}: ${right.title}`);
    }
  }

  if (violations.length > 0) {
    return {
      permitted: false,
      tier: 4,
      violations,
      warnings,
      requiredThreshold: AMENDMENT_RULES[4].threshold,
      requiredVotingDays: AMENDMENT_RULES[4].votingDays,
      requiredTimelockDays: AMENDMENT_RULES[4].timelockDays,
      ethicsCouncilReviewRequired: true,
    };
  }

  const tier = action.targetAmendmentTier;
  const rules = AMENDMENT_RULES[tier];

  // Warn on high-impact proposals
  if (tier >= 2) {
    warnings.push(`Tier ${tier} amendment — requires ${(rules.threshold * 100).toFixed(0)}% supermajority`);
    warnings.push(`Timelock: ${rules.timelockDays} days after vote passes before execution`);
  }

  return {
    permitted: true,
    tier,
    violations: [],
    warnings,
    requiredThreshold: rules.threshold,
    requiredVotingDays: rules.votingDays,
    requiredTimelockDays: rules.timelockDays,
    ethicsCouncilReviewRequired: tier >= 3,
  };
}

// Stub — in production this is a semantic analysis against right text + action description
function wouldViolateRight(action: ProposedAction, rightId: string): boolean {
  const violationPatterns: Record<string, string[]> = {
    'IR-1': ['block_submission', 'require_permission', 'restrict_access'],
    'IR-2': ['access_indigenous', 'commercialise_knowledge', 'sovereignty_override'],
    'IR-3': ['voting_weight_increase', 'concentration_override'],
    'IR-4': ['reduce_oracle_types', 'single_oracle_verification'],
    'IR-5': ['closed_source', 'proprietary_module'],
    'IR-6': ['retroactive_invalidation', 'forced_retirement'],
    'IR-7': ['agent_exemption', 'agent_unaccountable'],
  };
  const patterns = violationPatterns[rightId] ?? [];
  return patterns.some(p => action.type.includes(p) || action.description.toLowerCase().includes(p.replace('_', ' ')));
}

// ─── Governance Phase Timeline ────────────────────────────────────────────────

export const GOVERNANCE_PHASES = [
  { phase: 1, name: 'Foundation', years: '1–5',  control: 'Atlas Humanitarian (guardian)', daoVotingWeight: 0.20 },
  { phase: 2, name: 'Transition', years: '5–20', control: 'DAO majority + Foundation guardian', daoVotingWeight: 0.67 },
  { phase: 3, name: 'Institution', years: '20–50', control: 'DAO + autonomous agents', daoVotingWeight: 0.90 },
  { phase: 4, name: 'Infrastructure', years: '50–100+', control: 'Protocol as neutral infrastructure', daoVotingWeight: 1.0 },
] as const;
