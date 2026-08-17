/**
 * Atlas Sanctum — Regenerative Intelligence Engine (AS-RIE)
 * Type System
 *
 * Mirrors the x-algorithm candidate-pipeline architecture:
 * Source → Hydrate → Filter → Score → Select → SideEffect
 * but optimises for regenerative value, not engagement.
 */

// ─── Context ──────────────────────────────────────────────────────────────────

export type EvidenceClass = 'FACT' | 'INFERENCE' | 'PREDICTION' | 'ASSUMPTION';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT';
export type FilterVerdict = 'ALLOW' | 'REVIEW' | 'DROP';

export interface RIEContext {
  actorId: string;
  geography?: string;
  community?: string;
  institution?: string;
  objective: string;
  availableResources?: Record<string, number>;
  timeHorizonMonths: number;
  constraints?: string[];
  previousActions?: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  sdgObjectives?: string[];
  environmentalConditions?: Record<string, unknown>;
  economicConditions?: Record<string, unknown>;
  socialConditions?: Record<string, unknown>;
}

// ─── Candidate ────────────────────────────────────────────────────────────────

export interface RIECandidate {
  id: string;
  name: string;
  category: string;
  sourceLayer: 'known_network' | 'semantic' | 'ecosystem_cluster' | 'emerging';

  // Hydrated evidence
  mission?: string;
  location?: string;
  beneficiaries?: string[];
  problemAddressed?: string;
  intervention?: string;
  operatingModel?: string;
  capitalRequirements?: number;
  existingEvidence?: string[];
  outcomeData?: Record<string, number>;
  implementationMaturity?: 'concept' | 'pilot' | 'scaling' | 'mature';
  partners?: string[];
  communityParticipation?: boolean;
  governanceModel?: string;
  risks?: string[];
  dependencies?: string[];
  historicalPerformance?: number; // 0–1
  sourceProvenance?: string;
  confidenceLevel?: ConfidenceLevel;

  // Pre-scoring filter result
  filterVerdict?: FilterVerdict;
  filterReasons?: string[];

  // Predicted outcomes (0–1 normalised)
  predictedOutcomes?: PredictedOutcomes;

  // Scores
  regenerativeValueScore?: number;
  sevenCapitalProfile?: SevenCapitalProfile;
  temporalProfile?: TemporalProfile;

  // Explanation
  explanation?: CandidateExplanation;

  // Diversity tags
  diversityTags?: string[];

  // Emerging boost applied
  emergingBoost?: number;
}

// ─── Predicted Outcomes ───────────────────────────────────────────────────────

export interface PredictedOutcomes {
  // Human Flourishing
  healthBenefit: number;
  educationBenefit: number;
  livelihoodImprovement: number;
  dignity: number;
  agency: number;
  socialCohesion: number;
  safety: number;
  opportunityCreation: number;

  // Ecological Regeneration
  ecosystemRestoration: number;
  biodiversityBenefit: number;
  waterResilience: number;
  soilHealth: number;
  carbonImpact: number;
  climateResilience: number;
  pollutionReduction: number;

  // Economic Regeneration
  productiveCapacity: number;
  incomeGeneration: number;
  employment: number;
  capitalEfficiency: number;
  localEconomicCirculation: number;
  financialSustainability: number;

  // Institutional Regeneration
  institutionalCapacity: number;
  governanceQuality: number;
  accountability: number;
  scalability: number;

  // Knowledge Regeneration
  knowledgeCreation: number;
  localKnowledgePreservation: number;
  transferability: number;

  // Risk
  failureProbability: number;
  misuseProbability: number;
  unintendedHarm: number;
  concentrationRisk: number;
  environmentalDownside: number;
}

// ─── Seven Capital Profile ────────────────────────────────────────────────────

export interface CapitalDelta {
  created: number;
  preserved: number;
  consumed: number;
  transferred: number;
  atRisk: number;
}

export interface SevenCapitalProfile {
  human: CapitalDelta;
  social: CapitalDelta;
  intellectual: CapitalDelta;
  natural: CapitalDelta;
  financial: CapitalDelta;
  institutional: CapitalDelta;
  cultural: CapitalDelta;
}

// ─── Temporal Profile ─────────────────────────────────────────────────────────

export interface TemporalProfile {
  immediate: number;   // 0–12 months
  mediumTerm: number;  // 1–5 years
  longTerm: number;    // 5–25+ years
  irreversibleEffects: string[];
  compoundingBenefits: string[];
  pathDependencies: string[];
}

// ─── Explanation ──────────────────────────────────────────────────────────────

export interface CandidateExplanation {
  whyAppeared: string;
  whyRankedHighly: string;
  whatCouldInvalidate: string;
  primaryRisks: string[];
  whatWouldChangeRanking: string;
  recommendedNextAction: string;
  requiresHumanReview: boolean;
  humanReviewReason?: string;
}

// ─── Pipeline Query ───────────────────────────────────────────────────────────

export interface RIEQuery {
  context: RIEContext;
  resultSize: number;
  diversityEnabled: boolean;
  emergingBoostEnabled: boolean;
  requestId: string;
  requestedAt: string;
}

// ─── Pipeline Result ──────────────────────────────────────────────────────────

export interface RIEResult {
  requestId: string;
  context: RIEContext;
  topOpportunities: RIECandidate[];
  droppedCandidates: RIECandidate[];
  systemConnections: SystemConnections;
  pipelineStats: PipelineStats;
  generatedAt: string;
}

export interface SystemConnections {
  missingLinks: string[];
  bottlenecks: string[];
  bridges: string[];
  leveragePoints: string[];
}

export interface PipelineStats {
  sourcedCount: number;
  hydratedCount: number;
  filteredCount: number;
  scoredCount: number;
  selectedCount: number;
  latencyMs: number;
  stageBreakdown: Record<string, number>;
}
