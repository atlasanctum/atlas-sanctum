// @ts-nocheck
/**
 * Atlas Sanctum Type System
 * Comprehensive type definitions for civilizational-scale regenerative platform
 * 
 * This module establishes the canonical type contracts for all Atlas Sanctum components.
 * Types defined here serve as the coherence layer ensuring type safety across
 * distributed services, blockchain protocols, and AI systems.
 */

// ============================================================================
// CORE DOMAIN TYPES
// ============================================================================

export interface GeoLocation {
  readonly lat: number;
  readonly lng: number;
  readonly region?: string;
  readonly biome?: string;
  readonly timezone?: string;
}

export interface RegenerativeImpact {
  readonly carbon: number;        // tonnes CO2 equivalent
  readonly biodiversity: number; // species-weighted index
  readonly social: number;       // community benefit score
  readonly cultural: number;     // cultural preservation index
  readonly water: number;        // water quality impact
  readonly soil: number;         // soil health index
}

export interface RegenerativeIntervention {
  readonly type: InterventionType;
  readonly description: string;
  readonly impact: RegenerativeImpact;
  readonly location: GeoLocation;
  readonly timestamp: number;
  readonly duration?: number;     // expected duration in days
}

export type InterventionType = 
  | 'reforestation'
  | 'soil_regeneration'
  | 'water_conservation'
  | 'biodiversity_restoration'
  | 'community_development'
  | 'cultural_preservation'
  | 'renewable_energy'
  | 'waste_management';

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export interface RegenerativeTransaction {
  readonly id: TransactionId;
  readonly type: TransactionType;
  readonly location: GeoLocation;
  readonly impact: RegenerativeImpact;
  readonly timestamp: Timestamp;
  readonly metadata: TransactionMetadata;
}

export type TransactionId = string & { readonly __brand: unique symbol };
export type Timestamp = number & { readonly __brand: unique symbol };

export type TransactionType = 
  | 'impact_registration'
  | 'credit_mint'
  | 'credit_transfer'
  | 'verification'
  | 'oracle_update';

export interface TransactionMetadata {
  readonly version: number;
  readonly source: string;
  readonly signatures: readonly Signature[];
  readonly nonce: number;
}

export interface Signature {
  readonly signer: string;
  readonly algorithm: string;
  readonly value: string;
}

export interface TransactionResult {
  readonly hash: TransactionHash;
  readonly status: TransactionStatus;
  readonly data: TransactionResultData;
  readonly errors?: readonly TransactionError[];
}

export type TransactionHash = string & { readonly __brand: unique symbol };

export type TransactionStatus = 'success' | 'partial' | 'failed';

export interface TransactionResultData {
  readonly transactionId: TransactionId;
  readonly blockNumber?: number;
  readonly gasUsed?: number;
  readonly oracleFeedback?: OracleFeedback;
}

export interface TransactionError {
  readonly code: string;
  readonly message: string;
  readonly recoverable: boolean;
  readonly context?: Record<string, unknown>;
}

// ============================================================================
// FORECASTING TYPES
// ============================================================================

export interface RegenerativeForecast {
  readonly scenarios: readonly ForecastScenario[];
  readonly confidence: Probability;
  readonly recommendations: readonly string[];
  readonly risks: readonly ForecastRisk[];
  readonly metadata: ForecastMetadata;
}

export type Probability = number & { readonly __brand: unique symbol };

export interface ForecastScenario {
  readonly id: string;
  readonly name: string;
  readonly probability: Probability;
  readonly projectedImpact: RegenerativeImpact;
  readonly timeline: Timeline;
  readonly assumptions: readonly string[];
}

export interface Timeline {
  readonly startDate: DateString;
  readonly endDate: DateString;
  readonly milestones: readonly TimelineMilestone[];
}

export type DateString = string & { readonly __brand: unique symbol };

export interface TimelineMilestone {
  readonly date: DateString;
  readonly description: string;
  readonly targetMetrics: RegenerativeImpact;
}

export interface ForecastRisk {
  readonly category: RiskCategory;
  readonly severity: RiskSeverity;
  readonly probability: Probability;
  readonly mitigation: string;
}

export type RiskCategory = 
  | 'climate'
  | 'market'
  | 'political'
  | 'technical'
  | 'social';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ForecastMetadata {
  readonly generatedAt: ISO8601String;
  readonly processingTimeMs: number;
  readonly modelsUsed: readonly ModelIdentifier[];
  readonly dataQualityScore: Probability;
}

export type ModelIdentifier = string & { readonly __brand: unique symbol };
export type ISO8601String = string & { readonly __brand: unique symbol };

// ============================================================================
// ECONOMICS TYPES
// ============================================================================

export interface RegenerativeValue {
  readonly total: CurrencyValue;
  readonly breakdown: ValueBreakdown;
  readonly currency: Currency;
  readonly timestamp: Timestamp;
}

export type CurrencyValue = number & { readonly __brand: unique symbol };
export type Currency = string & { readonly __brand: unique symbol };

export interface ValueBreakdown {
  readonly baseValue: CurrencyValue;
  readonly ecologicalMultiplier: number;
  readonly socialMultiplier: number;
  readonly scarcityAdjustment: number;
  readonly verificationBonus: number;
}

export interface ValuationResult {
  readonly impact: RegenerativeImpact;
  readonly value: RegenerativeValue;
  readonly methodology: ValuationMethodology;
  readonly verificationLevel: VerificationLevel;
}

export type ValuationMethodology = 
  | 'market_based'
  | 'cost_based'
  | 'benefit_based'
  | 'hybrid';

export type VerificationLevel = 
  | 'self_reported'
  | 'third_party_verified'
  | 'oracle_verified'
  | 'multi_source_confirmed';

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  readonly id: UserId;
  readonly literacyLevel: LiteracyLevel;
  readonly values: readonly ValueType[];
  readonly culture: CultureCode;
  readonly preferences: UserPreferences;
  readonly permissions: readonly Permission[];
}

export type UserId = string & { readonly __brand: unique symbol };

export type LiteracyLevel = 1 | 2 | 3 | 4 | 5;

export type ValueType = 
  | 'environmental'
  | 'community'
  | 'economic'
  | 'cultural'
  | 'spiritual';

export type CultureCode = string & { readonly __brand: unique symbol };

export interface UserPreferences {
  readonly language: LanguageCode;
  readonly units: MeasurementSystem;
  readonly visualizationStyle: VisualizationStyle;
  readonly notificationPreferences: NotificationPreferences;
}

export type LanguageCode = string & { readonly __brand: unique symbol };
export type MeasurementSystem = 'metric' | 'imperial' | 'indigenous';
export type VisualizationStyle = 'scientific' | 'narrative' | 'artistic' | 'indigenous';

export interface NotificationPreferences {
  readonly impactUpdates: boolean;
  readonly marketAlerts: boolean;
  readonly communityEvents: boolean;
  readonly verificationRequests: boolean;
}

export type Permission = 
  | 'read:impacts'
  | 'write:impacts'
  | 'verify:impacts'
  | 'mint:credits'
  | 'admin:system';

// ============================================================================
// ACTION TYPES
// ============================================================================

export interface RegenerativeAction {
  readonly user: User;
  readonly type: ActionType;
  readonly location: GeoLocation;
  readonly interventions: readonly RegenerativeIntervention[];
  readonly impact: RegenerativeImpact;
  readonly timestamp: Timestamp;
  readonly intent: ActionIntent;
}

export type ActionType = 
  | 'register_impact'
  | 'propose_intervention'
  | 'verify_claim'
  | 'invest'
  | 'volunteer'
  | 'educate';

export interface ActionIntent {
  readonly motivation: readonly string[];
  readonly expectedOutcome: RegenerativeImpact;
  readonly timeline: Timeline;
}

// ============================================================================
// ORACLE TYPES
// ============================================================================

export interface OracleData {
  readonly source: OracleSource;
  readonly location: GeoLocation;
  readonly timestamp: Timestamp;
  readonly measurements: readonly Measurement[];
  readonly confidence: Probability;
  readonly signature: Signature;
}

export type OracleSource = 
  | 'satellite_sentinel'
  | 'satellite_landsat'
  | 'satellite_planet'
  | 'sensor_soil'
  | 'sensor_bioacoustic'
  | 'sensor_air_quality'
  | 'human_report';

export interface Measurement {
  readonly type: MeasurementType;
  readonly value: number;
  readonly unit: string;
  readonly quality: DataQuality;
}

export type MeasurementType = 
  | 'ndvi'
  | 'soil_moisture'
  | 'carbon_stock'
  | 'species_count'
  | 'air_quality_index'
  | 'water_quality';

export type DataQuality = 'raw' | 'calibrated' | 'validated' | 'verified';

export interface OracleFeedback {
  readonly confirmed: boolean;
  readonly confidenceAdjustment: number;
  readonly discrepancies?: readonly Discrepancy[];
}

export interface Discrepancy {
  readonly expectedValue: number;
  readonly actualValue: number;
  readonly tolerance: number;
}

// ============================================================================
// BLOCKCHAIN TYPES
// ============================================================================

export interface SmartContract {
  readonly id: ContractId;
  readonly type: ContractType;
  readonly address: ContractAddress;
  readonly version: number;
  readonly bytecode: string;
  readonly abi: readonly ContractMethod[];
}

export type ContractId = string & { readonly __brand: unique symbol };
export type ContractAddress = string & { readonly __brand: unique symbol };

export type ContractType = 
  | 'carbon_credit'
  | 'biodiversity_bond'
  | 'regenerative_dao'
  | 'impact_nft';

export interface ContractMethod {
  readonly name: string;
  readonly inputs: readonly ContractParameter[];
  readonly outputs: readonly ContractParameter[];
  readonly stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
}

// ============================================================================
// CIVILIZATIONAL RESPONSE
// ============================================================================

export interface CivilizationalResponse {
  readonly transactionHash: TransactionHash;
  readonly planetaryImpact: RegenerativeForecast;
  readonly economicValue: RegenerativeValue;
  readonly humanInterface: HumanInterfaceResponse;
  readonly systemEvolution: SystemEvolutionStatus;
}

export interface HumanInterfaceResponse {
  readonly content: InterfaceContent;
  readonly interactions: readonly InterfaceInteraction[];
  readonly visualizations: readonly InterfaceVisualization[];
  readonly narratives: readonly InterfaceNarrative[];
}

export interface InterfaceContent {
  readonly title: string;
  readonly summary: string;
  readonly details: string;
  readonly callsToAction: readonly CallToAction[];
}

export interface CallToAction {
  readonly text: string;
  readonly type: 'primary' | 'secondary';
  readonly destination: string;
}

export interface InterfaceInteraction {
  readonly type: InteractionType;
  readonly description: string;
  readonly handler: string;
}

export type InteractionType = 
  | 'button'
  | 'slider'
  | 'map_zoom'
  | 'timeline_drag'
  | 'data_filter';

export interface InterfaceVisualization {
  readonly type: VisualizationType;
  readonly dataSource: string;
  readonly configuration: Record<string, unknown>;
}

export type VisualizationType = 
  | 'impact_map'
  | 'timeline_chart'
  | 'value_gauge'
  | 'network_graph';

export interface InterfaceNarrative {
  readonly culture: CultureCode;
  readonly story: string;
  readonly metaphors: readonly string[];
}

export interface SystemEvolutionStatus {
  readonly phase: EvolutionPhase;
  readonly adaptations: number;
  readonly learningEfficiency: Probability;
  readonly nextMilestone: string;
}

export type EvolutionPhase = 
  | 'initialization'
  | 'learning'
  | 'adaptation'
  | 'optimization'
  | 'evolution';

// ============================================================================
// HEALTH & OBSERVABILITY TYPES
// ============================================================================

export interface HealthStatus {
  readonly status: HealthCheckStatus;
  readonly components: readonly ComponentHealth[];
  readonly lastChecked: Timestamp;
  readonly uptime: number;
}

export type HealthCheckStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ComponentHealth {
  readonly name: string;
  readonly status: HealthCheckStatus;
  readonly latencyMs: number;
  readonly errorRate: Probability;
  readonly details?: Record<string, unknown>;
}

export interface MetricsSnapshot {
  readonly timestamp: Timestamp;
  readonly transactions: TransactionMetrics;
  readonly system: SystemMetrics;
  readonly impact: ImpactMetrics;
}

export interface TransactionMetrics {
  readonly total: number;
  readonly successful: number;
  readonly failed: number;
  readonly averageLatencyMs: number;
  readonly throughputPerSecond: number;
}

export interface SystemMetrics {
  readonly cpuUsage: Probability;
  readonly memoryUsage: Probability;
  readonly networkLatencyMs: number;
  readonly diskUsage: Probability;
}

export interface ImpactMetrics {
  readonly totalCarbonSequestered: number;
  readonly totalBiodiversityScore: number;
  readonly totalCommunitiesImpacted: number;
  readonly economicValueGenerated: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AtlasError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly category: ErrorCategory,
    public readonly recoverable: boolean,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AtlasError';
  }
}

export type ErrorCategory = 
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'resource_not_found'
  | 'conflict'
  | 'rate_limit'
  | 'internal'
  | 'external_dependency';

// ============================================================================
// RESULT TYPE FOR FUNCTIONAL ERROR HANDLING
// ============================================================================

export type Result<T, E = AtlasError> = 
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function fail<T, E extends AtlasError>(error: E): Result<T, E> {
  return { success: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success;
}

export function isFail<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}
