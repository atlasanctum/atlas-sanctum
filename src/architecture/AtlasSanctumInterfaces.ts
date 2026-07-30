/**
 * Atlas Sanctum Interfaces
 * Interface contracts for all major system components
 * 
 * These interfaces establish the coherence contracts between layers,
 * enabling loose coupling and testability across the architecture.
 */

import {
  RegenerativeTransaction,
  TransactionResult,
  GeoLocation,
  RegenerativeImpact,
  RegenerativeIntervention,
  RegenerativeForecast,
  RegenerativeValue,
  User,
  RegenerativeAction,
  CivilizationalResponse,
  Result,
  AtlasError,
} from './AtlasSanctumTypes';

// ============================================================================
// INFRASTRUCTURE LAYER INTERFACES
// ============================================================================

export interface ISystemNode {
  readonly region: string;
  process(tx: RegenerativeTransaction): Promise<Result<{ processed: boolean; region: string }, AtlasError>>;
  getHealth(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; latencyMs: number }>;
}

export interface IConsensusMechanism {
  validate(tx: RegenerativeTransaction): Promise<Result<RegenerativeTransaction, AtlasError>>;
  getConsensus(nodes: readonly ISystemNode[]): Promise<Result<boolean, AtlasError>>;
}

export interface IDecentralizedInfrastructure {
  readonly nodes: Map<string, ISystemNode>;
  readonly consensus: IConsensusMechanism;
  processTransaction(tx: RegenerativeTransaction): Promise<Result<TransactionResult, AtlasError>>;
  getNodeHealth(): Promise<readonly { region: string; status: string; latencyMs: number }[]>;
  addNode(node: ISystemNode): void;
  removeNode(region: string): boolean;
}

// ============================================================================
// BLOCKCHAIN & PROTOCOL LAYER INTERFACES
// ============================================================================

export interface ILivingContract {
  execute(data: unknown, oracleData: unknown): Promise<Result<string, AtlasError>>;
  validate(data: unknown): Promise<Result<boolean, AtlasError>>;
  getState(): Promise<Record<string, unknown>>;
}

export interface IOracle {
  getData(location: GeoLocation): Promise<Result<Record<string, unknown>, AtlasError>>;
  getConfidence(): number;
}

export interface IRegenerativeProtocol {
  readonly contracts: Map<string, ILivingContract>;
  readonly oracles: readonly IOracle[];
  executeRegenerativeTransaction(params: {
    type: string;
    location: GeoLocation;
    data: unknown;
  }): Promise<Result<string, AtlasError>>;
  aggregateOracleData(location: GeoLocation): Promise<Result<Record<string, unknown>, AtlasError>>;
  validateAntiGaming(params: unknown): Promise<Result<boolean, AtlasError>>;
}

// ============================================================================
// DATA INFRASTRUCTURE INTERFACES
// ============================================================================

export interface IDataStream {
  getLatestData(): Promise<Result<Record<string, unknown>, AtlasError>>;
  getSourceName(): string;
}

export interface ISensorNetwork {
  collectData(): Promise<Result<Record<string, unknown>, AtlasError>>;
  getSensorId(): string;
  calibrate(): Promise<Result<void, AtlasError>>;
}

export interface IPlanetaryDataSystem {
  readonly satellites: readonly IDataStream[];
  readonly sensors: readonly ISensorNetwork[];
  ingestPlanetaryData(forceRefresh?: boolean): Promise<Result<Record<string, unknown>, AtlasError>>;
  generateVerifiableMetrics(location: GeoLocation): Promise<Result<Record<string, unknown>, AtlasError>>;
  clearCache(): void;
  getCacheStatus(): { cachedItems: number; lastUpdated: number };
}

// ============================================================================
// AI & FORECASTING LAYER INTERFACES
// ============================================================================

export interface IEcosystemModel {
  forecast(
    location: GeoLocation,
    interventions: readonly RegenerativeIntervention[]
  ): Promise<Result<Record<string, unknown>, AtlasError>>;
  getModelVersion(): string;
  calibrate(data: Record<string, unknown>): Promise<Result<void, AtlasError>>;
}

export interface IPlanetaryAI {
  readonly models: Map<string, IEcosystemModel>;
  generateRegenerativeForecast(
    location: GeoLocation,
    interventions: readonly RegenerativeIntervention[]
  ): Promise<Result<RegenerativeForecast, AtlasError>>;
  verifyImpactClaims(claims: readonly unknown[]): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
  synthesize(data: Record<string, unknown>): Promise<Result<Record<string, unknown>, AtlasError>>;
  calculateImpactMetrics(
    data: Record<string, unknown>,
    location: GeoLocation
  ): Promise<Result<Record<string, unknown>, AtlasError>>;
}

// ============================================================================
// SECURITY LAYER INTERFACES
// ============================================================================

export interface ICryptographicService {
  encrypt(data: unknown): Promise<Result<Uint8Array, AtlasError>>;
  decrypt(encrypted: Uint8Array): Promise<Result<unknown, AtlasError>>;
  sign(data: unknown): Promise<Result<string, AtlasError>>;
  verify(signature: string, data: unknown): Promise<Result<boolean, AtlasError>>;
}

export interface IPrivacyPreservingProtocol {
  anonymize(data: unknown): Promise<Result<unknown, AtlasError>>;
  differentialPrivacy(data: unknown, epsilon: number): Promise<Result<unknown, AtlasError>>;
  zeroKnowledgeProof(statement: unknown): Promise<Result<Record<string, unknown>, AtlasError>>;
}

export interface IAdversarialDefense {
  protect(data: unknown): Promise<Result<unknown, AtlasError>>;
  analyzeForManipulation(data: unknown): Promise<Result<Record<string, unknown>, AtlasError>>;
  detectAnomalies(data: unknown): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
}

export interface IZeroTrustSecurity {
  readonly crypto: ICryptographicService;
  readonly privacy: IPrivacyPreservingProtocol;
  readonly defense: IAdversarialDefense;
  secureTransaction(tx: RegenerativeAction): Promise<Result<unknown, AtlasError>>;
  detectManipulation(data: unknown): Promise<Result<Record<string, unknown>, AtlasError>>;
  authenticate(credentials: unknown): Promise<Result<string, AtlasError>>;
  authorize(token: string, permission: string): Promise<Result<boolean, AtlasError>>;
}

// ============================================================================
// ECONOMICS LAYER INTERFACES
// ============================================================================

export interface IValuationModel {
  calculate(impact: RegenerativeImpact): Promise<Result<RegenerativeValue, AtlasError>>;
  getMethodology(): string;
}

export interface IAntiGamingMechanism {
  validate(value: RegenerativeValue, impact: RegenerativeImpact): Promise<Result<RegenerativeValue, AtlasError>>;
  detectManipulation(claim: unknown): Promise<Result<{ suspicious: boolean; reason?: string }, AtlasError>>;
}

export interface IRegenerativeEconomics {
  readonly valuationModels: Map<string, IValuationModel>;
  readonly antiGaming: IAntiGamingMechanism;
  calculateRegenerativeValue(impact: RegenerativeImpact): Promise<Result<RegenerativeValue, AtlasError>>;
  aggregateValuations(valuations: readonly RegenerativeValue[]): Result<number, AtlasError>;
  applyMultipliers(value: number, impact: RegenerativeImpact): Result<RegenerativeValue, AtlasError>;
}

// ============================================================================
// INTERFACE LAYER INTERFACES
// ============================================================================

export interface IComplexityTranslator {
  simplify(data: unknown, literacyLevel: number): Promise<Result<unknown, AtlasError>>;
  getComplexityScore(data: unknown): Promise<Result<number, AtlasError>>;
}

export interface IEthicalLiteracySystem {
  contextualize(data: unknown, userValues: readonly string[]): Promise<Result<unknown, AtlasError>>;
  getEthicalScore(data: unknown): Promise<Result<number, AtlasError>>;
  detectMoralHazards(data: unknown): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
}

export interface ICulturalAdaptationEngine {
  adapt(data: unknown, culture: string): Promise<Result<unknown, AtlasError>>;
  getSupportedCultures(): readonly string[];
  translateNarrative(narrative: string, targetCulture: string): Promise<Result<string, AtlasError>>;
}

export interface IEthicalInterfaceEngine {
  readonly translator: IComplexityTranslator;
  readonly ethics: IEthicalLiteracySystem;
  readonly cultural: ICulturalAdaptationEngine;
  renderInterface(
    user: User,
    data: unknown
  ): Promise<Result<{
    content: unknown;
    interactions: readonly unknown[];
    visualizations: readonly unknown[];
    narratives: readonly unknown[];
  }, AtlasError>>;
}

// ============================================================================
// EVOLUTION LAYER INTERFACES
// ============================================================================

export interface IEvolutionaryEngine {
  learn(action: unknown, result: unknown): Promise<Result<void, AtlasError>>;
  getStatus(): Promise<Result<{
    phase: string;
    adaptations: number;
    learningEfficiency: number;
  }, AtlasError>>;
  evolve(): Promise<Result<boolean, AtlasError>>;
  rollback(version: string): Promise<Result<void, AtlasError>>;
}

// ============================================================================
// COMPOSITION ROOT
// ============================================================================

export interface IAtlasSanctumOS {
  readonly infrastructure: IDecentralizedInfrastructure;
  readonly protocol: IRegenerativeProtocol;
  readonly dataSystem: IPlanetaryDataSystem;
  readonly ai: IPlanetaryAI;
  readonly security: IZeroTrustSecurity;
  readonly economics: IRegenerativeEconomics;
  readonly interface: IEthicalInterfaceEngine;
  readonly evolution: IEvolutionaryEngine;
  
  processRegenerativeAction(action: RegenerativeAction): Promise<Result<CivilizationalResponse, AtlasError>>;
  ensureDecadalResilience(): Promise<Result<Record<string, unknown>, AtlasError>>;
  getSystemHealth(): Promise<Result<Record<string, unknown>, AtlasError>>;
}

// ============================================================================
// FACTORY FUNCTIONS FOR DEPENDENCY INJECTION
// ============================================================================

export interface DependencyContainer {
  register<T>(token: string, factory: () => T): void;
  registerInstance<T>(token: string, instance: T): void;
  resolve<T>(token: string): T;
  registerScoped<T>(token: string, factory: () => T): void;
  clear(): void;
}

export function createDependencyContainer(): DependencyContainer {
  const registry = new Map<string, { factory?: () => unknown; instance?: unknown; scoped?: () => unknown }>();
  const instances = new Map<string, unknown>();

  return {
    register(token, factory) {
      registry.set(token, { factory });
    },
    registerInstance(token, instance) {
      registry.set(token, { instance });
    },
    registerScoped(token, factory) {
      registry.set(token, { scoped: factory });
    },
    resolve(token) {
      const entry = registry.get(token);
      if (!entry) {
        throw new Error(`Dependency not found: ${token}`);
      }
      
      if (entry.instance) {
        return entry.instance;
      }
      
      if (entry.scoped) {
        if (!instances.has(token)) {
          instances.set(token, entry.scoped());
        }
        return instances.get(token);
      }
      
      if (entry.factory) {
        return entry.factory();
      }
      
      throw new Error(`No factory or instance for: ${token}`);
    },
    clear() {
      registry.clear();
      instances.clear();
    },
  };
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface AtlasConfig {
  readonly infrastructure: {
    readonly nodeCount: number;
    readonly regions: readonly string[];
    readonly consensusThreshold: number;
  };
  readonly security: {
    readonly encryptionAlgorithm: string;
    readonly keyRotationDays: number;
    readonly maxFailedAttempts: number;
  };
  readonly cache: {
    readonly defaultTTLMs: number;
    readonly maxSize: number;
  };
  readonly retry: {
    readonly maxAttempts: number;
    readonly baseDelayMs: number;
  };
  readonly circuitBreaker: {
    readonly failureThreshold: number;
    readonly timeoutMs: number;
  };
}

export const defaultConfig: AtlasConfig = {
  infrastructure: {
    nodeCount: 5,
    regions: ['americas-aws', 'europe-gcp', 'asia-azure', 'africa-local', 'oceania-edge'],
    consensusThreshold: 0.51,
  },
  security: {
    encryptionAlgorithm: 'AES-256-GCM',
    keyRotationDays: 30,
    maxFailedAttempts: 5,
  },
  cache: {
    defaultTTLMs: 3600000,
    maxSize: 1000,
  },
  retry: {
    maxAttempts: 3,
    baseDelayMs: 1000,
  },
  circuitBreaker: {
    failureThreshold: 5,
    timeoutMs: 30000,
  },
};
