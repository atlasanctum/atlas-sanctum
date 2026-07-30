/**
 * Atlas Sanctum AI — Canonical Type System
 * Regenerative Civilization Intelligence Platform
 *
 * Covers all 10 architectural layers:
 *   1. Foundational Reasoning
 *   2. Predictive Intelligence
 *   3. Optimization
 *   4. Learning
 *   5. Neural Perception
 *   6. Language & Cultural
 *   7. Multi-Agent Civilization
 *   8. Memory & Knowledge Fabric
 *   9. Trust & Verification
 *  10. Planetary Interface
 */

// ─── Primitives ──────────────────────────────────────────────────────────────

export type AgentId       = string & { readonly _brand: 'AgentId' };
export type NodeId        = string & { readonly _brand: 'NodeId' };
export type MemoryId      = string & { readonly _brand: 'MemoryId' };
export type ProofId       = string & { readonly _brand: 'ProofId' };
export type EpochMs       = number & { readonly _brand: 'EpochMs' };
export type Confidence    = number & { readonly _brand: 'Confidence' };  // 0–1
export type LatLng        = { lat: number; lng: number };

export type Result<T, E = AIError> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never>  { return { ok: true,  value }; }
export function err<E>(error: E): Result<never, E> { return { ok: false, error }; }

export class AIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly layer: ArchitectureLayer,
    public readonly recoverable = false,
  ) { super(message); this.name = 'AIError'; }
}

export type ArchitectureLayer =
  | 'foundational' | 'predictive' | 'optimization' | 'learning'
  | 'perception'   | 'language'   | 'multi-agent'  | 'memory'
  | 'trust'        | 'interface';

// ─── Layer 1 — Foundational Reasoning ────────────────────────────────────────

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'concept' | 'entity' | 'relation' | 'axiom' | 'rule';
  properties: Record<string, unknown>;
  embeddings?: Float32Array;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
  relation: string;
  weight: number;
  confidence: Confidence;
}

export interface KnowledgeGraph {
  nodes: Map<string, KnowledgeNode>;
  edges: KnowledgeEdge[];
  query(sparql: string): KnowledgeNode[];
  traverse(startId: string, depth: number): KnowledgeNode[];
}

export interface EthicalConstraint {
  id: string;
  principle: string;
  weight: number;                          // 0–1 priority
  hardBlock: boolean;                      // true = veto power
  evaluate(action: AgentAction): EthicalVerdict;
}

export interface EthicalVerdict {
  permitted: boolean;
  score: number;                           // 0–1 ethical alignment
  violations: string[];
  recommendations: string[];
}

export interface ReasoningState {
  hypothesis: string;
  evidence: string[];
  confidence: Confidence;
  alternativeHypotheses: string[];
  logicalChain: string[];
}

// ─── Layer 2 — Predictive Intelligence ───────────────────────────────────────

export interface BayesianBelief {
  variable: string;
  prior: number;
  likelihood: number;
  posterior: number;
  evidence: string[];
}

export interface ClimateScenario {
  id: string;
  name: string;
  rcp: '2.6' | '4.5' | '6.0' | '8.5';
  horizon: 5 | 10 | 25 | 50 | 100;       // years
  temperatureDeltaC: number;
  precipitationDelta: number;
  seaLevelRiseMm: number;
  biodiversityLoss: number;               // % species at risk
  confidence: Confidence;
}

export interface RiskAssessment {
  category: 'climate' | 'infrastructure' | 'social' | 'economic' | 'ecological';
  severity: 1 | 2 | 3 | 4 | 5;
  probability: Confidence;
  timeHorizonYears: number;
  mitigationOptions: string[];
  residualRisk: Confidence;
}

export interface InfrastructureStressModel {
  assetId: string;
  assetType: string;
  location: LatLng;
  currentLoad: number;                    // 0–1
  projectedLoad: number;
  failureProbability: Confidence;
  criticalityScore: number;
  redundancyLevel: number;
}

// ─── Layer 3 — Optimization ───────────────────────────────────────────────────

export interface ResourceAllocation {
  resourceType: 'water' | 'energy' | 'land' | 'capital' | 'labor';
  totalAvailable: number;
  allocations: { recipient: string; amount: number; priority: number }[];
  efficiency: number;                     // 0–1
  equityScore: number;                    // 0–1 Gini-adjusted
}

export interface OptimizationObjective {
  name: string;
  weight: number;
  direction: 'maximize' | 'minimize';
  currentValue: number;
  targetValue: number;
  constraint?: { min?: number; max?: number };
}

export interface CarbonRestorationPlan {
  projectId: string;
  location: LatLng;
  interventionType: string;
  estimatedSequestrationTonnes: number;
  costPerTonne: number;
  timelineYears: number;
  cobenefits: string[];
  verificationProtocol: string;
}

// ─── Layer 4 — Learning ───────────────────────────────────────────────────────

export interface RLEnvironment {
  stateSpace: string[];
  actionSpace: string[];
  rewardFunction: (state: unknown, action: string) => number;
  transitionModel: (state: unknown, action: string) => unknown;
}

export interface AdaptivePolicy {
  policyId: string;
  domain: string;
  version: number;
  parameters: Record<string, number>;
  performanceHistory: { epoch: EpochMs; score: number }[];
  lastUpdated: EpochMs;
}

export interface EcologicalFeedback {
  biomeId: string;
  indicator: string;
  observedValue: number;
  baselineValue: number;
  trend: 'improving' | 'stable' | 'degrading';
  feedbackSignal: number;                 // RL reward signal
}

// ─── Layer 5 — Neural Perception ─────────────────────────────────────────────

export interface SatelliteObservation {
  sceneId: string;
  satellite: 'Sentinel-2' | 'Landsat-9' | 'Planet' | 'MODIS';
  capturedAt: EpochMs;
  location: LatLng;
  bands: Record<string, Float32Array>;
  ndvi: number;
  ndwi: number;
  carbonDensityEstimate: number;
  cloudCoverPct: number;
  resolution: number;                     // metres/pixel
}

export interface DroneObservation {
  droneId: string;
  capturedAt: EpochMs;
  location: LatLng;
  altitude: number;
  rgbImage: string;                       // base64 or URL
  thermalImage?: string;
  detectedSpecies: string[];
  canopyCoverPct: number;
}

export interface OceanIntelligence {
  stationId: string;
  timestamp: EpochMs;
  location: LatLng;
  seaSurfaceTempC: number;
  phLevel: number;
  dissolvedOxygenMgL: number;
  plasticDensityIndex: number;
  coralBleachingRisk: Confidence;
  fishBiomassIndex: number;
}

export interface MedicalDiagnostic {
  regionId: string;
  timestamp: EpochMs;
  airQualityIndex: number;
  waterbornePathogenRisk: Confidence;
  malnutritionPrevalence: number;
  climateHealthBurden: number;            // DALYs per 1000
}

// ─── Layer 6 — Language & Cultural ───────────────────────────────────────────

export interface MultilingualContent {
  contentId: string;
  originalLanguage: string;
  translations: Record<string, string>;   // ISO 639-1 → text
  culturalAdaptations: Record<string, string>;
  indigenousLanguages: Record<string, string>;
  readabilityLevel: 1 | 2 | 3 | 4 | 5;
}

export interface TreatyAnalysis {
  treatyId: string;
  parties: string[];
  obligations: string[];
  rights: string[];
  complianceStatus: Record<string, 'compliant' | 'partial' | 'non-compliant'>;
  indigenousRightsScore: number;
  environmentalCommitments: string[];
}

export interface IndigenousKnowledge {
  knowledgeId: string;
  community: string;
  domain: 'ecology' | 'medicine' | 'agriculture' | 'governance' | 'cosmology';
  content: string;
  accessLevel: 'public' | 'community' | 'sacred';
  dataRights: 'sovereign' | 'shared' | 'open';
  validatedBy: string[];
}

export interface PolicyCopilotRequest {
  policyDomain: string;
  jurisdiction: string;
  objectives: string[];
  constraints: string[];
  stakeholders: string[];
  language: string;
}

// ─── Layer 7 — Multi-Agent Civilization ──────────────────────────────────────

export type AgentRole =
  | 'governance'    | 'economics'      | 'restoration'
  | 'medicine'      | 'logistics'      | 'ethics'
  | 'education'     | 'ecology'        | 'disaster'
  | 'forecasting'   | 'culture'        | 'security';

export type AgentStatus = 'idle' | 'active' | 'deliberating' | 'blocked' | 'error';

export interface AgentCapability {
  name: string;
  description: string;
  inputSchema: Record<string, string>;
  outputSchema: Record<string, string>;
  ethicalConstraints: string[];
}

export interface AgentAction {
  actionId: string;
  agentId: AgentId;
  type: string;
  payload: Record<string, unknown>;
  timestamp: EpochMs;
  ethicalScore?: number;
  rationale?: string;
}

export interface AgentMessage {
  from: AgentId;
  to: AgentId | 'broadcast';
  type: 'request' | 'response' | 'negotiation' | 'alert' | 'memory_share';
  payload: Record<string, unknown>;
  timestamp: EpochMs;
  priority: 1 | 2 | 3 | 4 | 5;
}

export interface NegotiationProposal {
  proposalId: string;
  proposer: AgentId;
  participants: AgentId[];
  subject: string;
  terms: Record<string, unknown>;
  ethicalImpact: EthicalVerdict;
  deadline: EpochMs;
  status: 'open' | 'accepted' | 'rejected' | 'counter-proposed';
}

export interface AgentCoalition {
  coalitionId: string;
  members: AgentId[];
  sharedObjective: string;
  coordinationProtocol: string;
  decisionRule: 'consensus' | 'majority' | 'supermajority' | 'veto';
  activeUntil: EpochMs;
}

// ─── Layer 8 — Memory & Knowledge Fabric ─────────────────────────────────────

export interface CivilizationMemory {
  memoryId: MemoryId;
  type: 'episodic' | 'semantic' | 'procedural' | 'ecological' | 'cultural';
  content: string;
  embeddings: Float32Array;
  tags: string[];
  importance: number;                     // 0–1
  createdAt: EpochMs;
  lastAccessedAt: EpochMs;
  decayRate: number;                      // 0 = permanent
  sourceAgents: AgentId[];
}

export interface VectorSearchQuery {
  queryEmbedding: Float32Array;
  topK: number;
  filters?: Record<string, unknown>;
  minSimilarity?: number;
}

export interface EcosystemArchive {
  biomeId: string;
  historicalData: {
    timestamp: EpochMs;
    ndvi: number;
    carbonStock: number;
    speciesCount: number;
    waterQuality: number;
  }[];
  baselineYear: number;
  trendAnalysis: Record<string, number>;
}

// ─── Layer 9 — Trust & Verification ──────────────────────────────────────────

export interface BlockchainRecord {
  txHash: string;
  chain: 'ethereum' | 'polkadot' | 'cardano' | 'ipfs';
  blockNumber: number;
  timestamp: EpochMs;
  dataHash: string;
  signers: string[];
  verified: boolean;
}

export interface ZKProofBundle {
  proofId: ProofId;
  system: 'Groth16' | 'PLONK' | 'Halo2' | 'Nova';
  statement: string;
  publicInputs: string[];
  proof: string;
  verificationKey: string;
  createdAt: EpochMs;
  valid?: boolean;
}

export interface CarbonValidationRecord {
  projectId: string;
  methodology: string;
  verifier: string;
  sequestrationTonnes: number;
  confidence: Confidence;
  satelliteEvidence: string[];
  zkProof: ProofId;
  onChainRef: string;
  auditTrail: string[];
}

export interface GovernanceTransparencyLog {
  proposalId: string;
  proposer: string;
  description: string;
  votes: { voter: string; vote: 'yes' | 'no' | 'abstain'; weight: number }[];
  outcome: 'passed' | 'rejected' | 'pending';
  executedAt?: EpochMs;
  onChainRef: string;
}

// ─── Layer 10 — Planetary Interface ──────────────────────────────────────────

export interface DigitalTwinState {
  twinId: string;
  entityType: 'biome' | 'city' | 'watershed' | 'ocean' | 'atmosphere';
  location: LatLng;
  currentState: Record<string, number>;
  simulatedState?: Record<string, number>;
  lastSyncedAt: EpochMs;
  divergenceScore: number;               // real vs simulated
}

export interface PlanetaryDashboardMetrics {
  timestamp: EpochMs;
  globalCarbonBudgetRemaining: number;   // GtCO2
  biodiversityIntactnessIndex: number;   // 0–100
  oceanHealthIndex: number;
  freshwaterStressIndex: number;
  humanFlourishingIndex: number;
  activeRestorationProjects: number;
  totalRIUsCirculating: number;
  agentsOnline: number;
}

export interface SimulationScenario {
  scenarioId: string;
  name: string;
  interventions: CarbonRestorationPlan[];
  policies: string[];
  timeHorizonYears: number;
  projectedOutcomes: Record<string, number>;
  confidenceInterval: [number, number];
}
