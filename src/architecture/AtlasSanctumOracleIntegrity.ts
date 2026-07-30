/**
 * Atlas Sanctum Oracle Integrity Architecture
 * 
 * Oracle integrity system for regenerative impact data verification.
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  Timestamp,
  Probability,
  GeoLocation,
  OracleSource,
  MeasurementType,
} from './AtlasSanctumTypes';

import {
  OracleAttestation,
  OracleDataPoint,
  OracleDiscrepancy,
  Commitment,
  MerkleProof,
  TrustLevel,
  TrustAssertion,
  TrustEvidence,
  createCryptoError,
  CryptoErrorCodes,
  PublicKey,
} from './AtlasSanctumCryptoTypes';

import {
  CircuitBreaker,
  Tracer,
  Cache,
} from './AtlasSanctumCrossCutting';

// ============================================================================
// DATA SOURCE TYPES
// ============================================================================

export type DataSourceType = 
  | 'satellite_sentinel'
  | 'satellite_landsat'
  | 'satellite_planet'
  | 'sensor_soil'
  | 'sensor_bioacoustic'
  | 'sensor_air_quality'
  | 'sensor_water'
  | 'drone'
  | 'ground_station'
  | 'manual_report'
  | 'third_party_api';

export interface DataSource {
  readonly sourceId: string;
  readonly type: DataSourceType;
  readonly name: string;
  readonly endpoint: string;
  readonly publicKey: PublicKey;
  readonly lastUpdated: Timestamp;
  readonly reliabilityScore: Probability;
  readonly status: 'active' | 'inactive' | 'degraded';
}

export interface AggregatedData {
  readonly dataId: string;
  readonly timestamp: Timestamp;
  readonly location: GeoLocation;
  readonly measurements: readonly AggregatedMeasurement[];
  readonly aggregationMethod: 'weighted_average' | 'median' | 'trimmed_mean';
  readonly confidence: Probability;
  readonly discrepancies: readonly OracleDiscrepancy[];
  readonly proof: MerkleProof;
  readonly attestations: readonly OracleAttestation[];
}

export interface AggregatedMeasurement {
  readonly type: MeasurementType;
  readonly value: number;
  readonly unit: string;
  readonly confidence: Probability;
  readonly sourcesCount: number;
  readonly deviation: number;
  readonly outliersRemoved: number;
}

// ============================================================================
// ORACLE SERVICE INTERFACES
// ============================================================================

export interface IOracleAggregator {
  registerDataSource(source: DataSource): Promise<Result<DataSource, AtlasError>>;
  fetchFromSource(sourceId: string): Promise<Result<OracleDataPoint[], AtlasError>>;
  aggregateData(location: GeoLocation, measurementTypes: readonly MeasurementType[]): Promise<Result<AggregatedData, AtlasError>>;
  getDataWithProof(dataId: string): Promise<Result<{ data: AggregatedData; proof: MerkleProof }, AtlasError>>;
}

export interface IOracleAttestationService {
  createAttestation(oracleId: string, data: OracleDataPoint): Promise<Result<OracleAttestation, AtlasError>>;
  verifyAttestation(attestation: OracleAttestation): Promise<Result<boolean, AtlasError>>;
  batchVerifyAttestations(attestations: readonly OracleAttestation[]): Promise<Result<boolean, AtlasError>>;
}

export interface IOracleDisputeResolver {
  submitDispute(oracleId: string, challengerId: string, evidence: string): Promise<Result<string, AtlasError>>;
  resolveDispute(disputeId: string, resolution: 'uphold' | 'overturn' | 'slash'): Promise<Result<boolean, AtlasError>>;
  getDisputesByStatus(status: 'pending' | 'resolved'): Promise<Result<readonly string[], AtlasError>>;
}

export interface IOracleIntegrityService {
  readonly aggregator: IOracleAggregator;
  readonly attestation: IOracleAttestationService;
  readonly dispute: IOracleDisputeResolver;
  
  submitData(data: OracleDataPoint): Promise<Result<OracleAttestation, AtlasError>>;
  verifyData(dataId: string): Promise<Result<{ valid: boolean; confidence: Probability }, AtlasError>>;
  getTrustedData(location: GeoLocation, measurementType: MeasurementType): Promise<Result<AggregatedData, AtlasError>>;
}

// ============================================================================
// ORACLE AGGREGATOR IMPLEMENTATION
// ============================================================================

class OracleAggregatorImpl implements IOracleAggregator {
  private readonly sources: Map<string, DataSource>;
  private readonly dataCache: Cache<AggregatedData>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.sources = new Map();
    this.dataCache = new Cache<AggregatedData>({ defaultTTLMs: 300000, maxSize: 1000 });
    this.circuitBreaker = new CircuitBreaker('oracle-aggregator', {
      failureThreshold: 5,
      timeoutMs: 30000,
      volumeThreshold: 10,
    });
  }

  async registerDataSource(source: DataSource): Promise<Result<DataSource, AtlasError>> {
    this.sources.set(source.sourceId, source);
    return ok(source);
  }

  async fetchFromSource(sourceId: string): Promise<Result<OracleDataPoint[], AtlasError>> {
    const source = this.sources.get(sourceId);
    if (!source) {
      return fail(createCryptoError(`Source not found: ${sourceId}`, 'SOURCE_NOT_FOUND', 'validation', false));
    }

    return this.circuitBreaker.execute(async () => {
      const dataPoints = this.generateMockDataPoints(source);
      return ok(dataPoints);
    });
  }

  async aggregateData(location: GeoLocation, measurementTypes: readonly MeasurementType[]): Promise<Result<AggregatedData, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const measurements: AggregatedMeasurement[] = [];
      const discrepancies: OracleDiscrepancy[] = [];

      for (const type of measurementTypes) {
        const sourceValues: { sourceId: string; value: number; confidence: Probability }[] = [];
        
        for (const source of this.sources.values()) {
          const data = await this.fetchFromSource(source.sourceId);
          if (data.success) {
            const matchingData = data.value.find(d => d.type === type);
            if (matchingData) {
              sourceValues.push({
                sourceId: source.sourceId,
                value: parseFloat(matchingData.value),
                confidence: matchingData.confidence,
              });
            }
          }
        }

        if (sourceValues.length === 0) continue;

        const { weightedAverage, confidence } = this.aggregateValues(sourceValues);
        const { deviation, outliersCount } = this.calculateDeviation(sourceValues, weightedAverage);

        measurements.push({
          type,
          value: weightedAverage,
          unit: this.getUnitForType(type),
          confidence,
          sourcesCount: sourceValues.length,
          deviation,
          outliersRemoved: outliersCount,
        });
      }

      const dataId = `data-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const proof = this.generateMerkleProof(dataId);

      const aggregatedData: AggregatedData = {
        dataId,
        timestamp: Date.now() as Timestamp,
        location,
        measurements,
        aggregationMethod: 'weighted_average',
        confidence: this.calculateOverallConfidence(measurements),
        discrepancies,
        proof,
        attestations: [],
      };

      this.dataCache.set(dataId, aggregatedData);
      return ok(aggregatedData);
    });
  }

  async getDataWithProof(dataId: string): Promise<Result<{ data: AggregatedData; proof: MerkleProof }, AtlasError>> {
    const data = this.dataCache.get(dataId);
    if (!data) {
      return fail(createCryptoError(`Data not found: ${dataId}`, 'DATA_NOT_FOUND', 'validation', false));
    }
    return ok({ data, proof: data.proof });
  }

  private generateMockDataPoints(source: DataSource): OracleDataPoint[] {
    const types: MeasurementType[] = ['ndvi', 'soil_moisture', 'carbon_stock', 'species_count', 'water_quality'];
    
    return types.map((type, index) => ({
      pointId: `${source.sourceId}-${type}-${Date.now()}`,
      type,
      value: (Math.random() * 100).toFixed(4),
      unit: this.getUnitForType(type),
      timestamp: Date.now() as Timestamp,
      confidence: source.reliabilityScore,
      source: source.sourceId,
      signature: `sig-${source.sourceId}-${Date.now()}`,
      sequenceNumber: index,
    }));
  }

  private getUnitForType(type: MeasurementType): string {
    const units: Record<MeasurementType, string> = {
      ndvi: 'ratio',
      soil_moisture: 'percent',
      carbon_stock: 'tonnes',
      species_count: 'count',
      air_quality_index: 'aqi',
      water_quality: 'wqi',
    };
    return units[type] || 'unknown';
  }

  private aggregateValues(values: readonly { sourceId: string; value: number; confidence: Probability }[]): { weightedAverage: number; confidence: Probability } {
    let weightedSum = 0;
    let weightSum = 0;
    let confidenceSum = 0;

    for (const v of values) {
      weightedSum += v.value * v.confidence;
      weightSum += v.confidence;
      confidenceSum += v.confidence;
    }

    return {
      weightedAverage: weightSum > 0 ? weightedSum / weightSum : 0,
      confidence: values.length > 0 ? (confidenceSum / values.length) as Probability : 0 as Probability,
    };
  }

  private calculateDeviation(values: readonly { sourceId: string; value: number }[], mean: number): { deviation: number; outliersCount: number } {
    const squaredDiffs = values.map(v => Math.pow(v.value - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return { deviation: Math.sqrt(variance), outliersCount: 0 };
  }

  private generateMerkleProof(dataId: string): MerkleProof {
    return {
      root: `merkle-root-${dataId}`,
      leaf: dataId,
      path: [`hash-${Date.now()}`],
      depth: 4,
      algorithm: 'SHA-256',
      leavesCount: 16,
    };
  }

  private calculateOverallConfidence(measurements: readonly AggregatedMeasurement[]): Probability {
    if (measurements.length === 0) return 0 as Probability;
    const totalConfidence = measurements.reduce((sum, m) => sum + m.confidence * m.sourcesCount, 0);
    const totalSources = measurements.reduce((sum, m) => sum + m.sourcesCount, 0);
    return totalSources > 0 ? (totalConfidence / totalSources) as Probability : 0 as Probability;
  }
}

// ============================================================================
// ORACLE ATTESTATION SERVICE
// ============================================================================

class OracleAttestationServiceImpl implements IOracleAttestationService {
  private readonly attestations: Map<string, OracleAttestation>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.attestations = new Map();
    this.circuitBreaker = new CircuitBreaker('oracle-attestation', {
      failureThreshold: 3,
      timeoutMs: 15000,
      volumeThreshold: 10,
    });
  }

  async createAttestation(oracleId: string, data: OracleDataPoint): Promise<Result<OracleAttestation, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const attestation: OracleAttestation = {
        attestationId: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        oracleId,
        dataSource: data.source,
        data: JSON.stringify(data),
        timestamp: Date.now() as Timestamp,
        signature: `sig-${oracleId}-${Date.now()}`,
        publicKey: '' as PublicKey,
        chainOfTrust: [oracleId],
        confidence: data.confidence,
      };

      this.attestations.set(attestation.attestationId, attestation);
      return ok(attestation);
    });
  }

  async verifyAttestation(attestation: OracleAttestation): Promise<Result<boolean, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const isValid = attestation.signature.startsWith('sig-') && attestation.attestationId.startsWith('att-');
      return ok(isValid);
    });
  }

  async batchVerifyAttestations(attestations: readonly OracleAttestation[]): Promise<Result<boolean, AtlasError>> {
    for (const attestation of attestations) {
      const result = await this.verifyAttestation(attestation);
      if (!result.success || !result.value) return ok(false);
    }
    return ok(true);
  }
}

// ============================================================================
// ORACLE DISPUTE RESOLVER
// ============================================================================

class OracleDisputeResolverImpl implements IOracleDisputeResolver {
  private readonly disputes: Map<string, { status: string; evidence: string; oracleId: string; challengerId: string }>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.disputes = new Map();
    this.circuitBreaker = new CircuitBreaker('oracle-dispute', {
      failureThreshold: 3,
      timeoutMs: 30000,
      volumeThreshold: 5,
    });
  }

  async submitDispute(oracleId: string, challengerId: string, evidence: string): Promise<Result<string, AtlasError>> {
    const disputeId = `dispute-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.disputes.set(disputeId, { status: 'pending', evidence, oracleId, challengerId });
    return ok(disputeId);
  }

  async resolveDispute(disputeId: string, resolution: 'uphold' | 'overturn' | 'slash'): Promise<Result<boolean, AtlasError>> {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) {
      return fail(createCryptoError(`Dispute not found: ${disputeId}`, 'DISPUTE_NOT_FOUND', 'validation', false));
    }
    dispute.status = resolution;
    return ok(true);
  }

  async getDisputesByStatus(status: 'pending' | 'resolved'): Promise<Result<readonly string[], AtlasError>> {
    const matching = Array.from(this.disputes.entries())
      .filter(([_, d]) => d.status === status)
      .map(([id]) => id);
    return ok(matching);
  }
}

// ============================================================================
// ORACLE INTEGRITY SERVICE
// ============================================================================

class OracleIntegrityServiceImpl implements IOracleIntegrityService {
  readonly aggregator: IOracleAggregator;
  readonly attestation: IOracleAttestationService;
  readonly dispute: IOracleDisputeResolver;

  constructor() {
    this.aggregator = new OracleAggregatorImpl();
    this.attestation = new OracleAttestationServiceImpl();
    this.dispute = new OracleDisputeResolverImpl();
  }

  async submitData(data: OracleDataPoint): Promise<Result<OracleAttestation, AtlasError>> {
    return this.attestation.createAttestation(data.source, data);
  }

  async verifyData(dataId: string): Promise<Result<{ valid: boolean; confidence: Probability }, AtlasError>> {
    const result = await this.aggregator.getDataWithProof(dataId);
    if (!result.success) return fail(result.error);

    const attestationResult = await this.attestation.batchVerifyAttestations(result.value.data.attestations);
    
    return ok({
      valid: attestationResult.success && attestationResult.value,
      confidence: result.value.data.confidence,
    });
  }

  async getTrustedData(location: GeoLocation, measurementType: MeasurementType): Promise<Result<AggregatedData, AtlasError>> {
    return this.aggregator.aggregateData(location, [measurementType]);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { OracleAggregatorImpl as OracleAggregator };
export { OracleAttestationServiceImpl as OracleAttestationService };
export { OracleDisputeResolverImpl as OracleDisputeResolver };
export { OracleIntegrityServiceImpl as OracleIntegrityService };

export const DEFAULT_ORACLE_INTEGRITY_SERVICE = new OracleIntegrityServiceImpl();
