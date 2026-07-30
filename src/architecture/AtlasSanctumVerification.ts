/**
 * Atlas Sanctum Impact Verification & Certification Subsystem
 * 
 * This subsystem provides comprehensive impact verification and certification
 * for regenerative projects, ensuring trustworthy, transparent, and immutable
 * impact claims across the Atlas Sanctum ecosystem.
 * 
 * Design Principles:
 * - Composes with IImpactOracleService for data verification
 * - Uses IBlockchainService for immutable certification records
 * - Leverages IAuthService for verifier role management
 * - Implements circuit breakers for resilience
 * - Provides Result<T, E> type safety throughout
 */

import {
  GeoLocation,
  RegenerativeImpact,
  RegenerativeIntervention,
  User,
  AtlasError,
  Result,
  ok,
  fail,
  Timestamp,
  Probability,
} from './AtlasSanctumTypes';

import {
  CircuitBreaker,
  Tracer,
  Cache,
} from './AtlasSanctumCrossCutting';

import {
  IImpactOracleService,
  OracleDataPoint,
  IBlockchainService,
  ImpactNFT,
  IAuthService,
  AuthUser,
  UserRole,
} from './AtlasSanctumServices';

// ============================================================================
// SECTION 1: VERIFICATION TYPES
// ============================================================================

export interface VerificationRequest {
  readonly id: string;
  readonly projectId: string;
  readonly claimId: string;
  readonly submittedBy: string;
  readonly submittedAt: Timestamp;
  readonly interventions: readonly RegenerativeIntervention[];
  readonly claimedImpact: RegenerativeImpact;
  readonly location: GeoLocation;
  readonly evidence: readonly Evidence[];
  readonly methodology: VerificationMethodology;
  readonly status: VerificationStatus;
}

export type VerificationMethodology = 
  | 'satellite_analysis'
  | 'sensor_verification'
  | 'third_party_audit'
  | 'community_validation'
  | 'hybrid';

export type VerificationStatus = 
  | 'pending' | 'in_review' | 'awaiting_evidence'
  | 'approved' | 'rejected' | 'appealed';

export interface Evidence {
  readonly id: string;
  readonly type: EvidenceType;
  readonly source: string;
  readonly url?: string;
  readonly hash: string;
  readonly timestamp: Timestamp;
  readonly metadata: Record<string, unknown>;
}

export type EvidenceType = 
  | 'satellite_imagery' | 'sensor_reading' | 'field_report'
  | 'third_party_certificate' | 'community_testimony'
  | 'financial_record' | 'metadata';

export interface VerificationStandard {
  readonly id: string;
  readonly name: string;
  readonly organization: string;
  readonly version: string;
  readonly description: string;
  readonly metrics: readonly VerificationMetric[];
  readonly requirements: readonly string[];
  readonly validityPeriodDays: number;
}

export interface VerificationMetric {
  readonly key: string;
  readonly name: string;
  readonly unit: string;
  readonly minValue: number;
  readonly maxValue: number;
  readonly weight: number;
  readonly methodology: string;
}

export interface VerificationResult {
  readonly requestId: string;
  readonly verified: boolean;
  readonly confidenceScore: Probability;
  readonly impactScore: number;
  readonly discrepancies: readonly Discrepancy[];
  readonly recommendations: readonly string[];
  readonly verifiedAt: Timestamp;
  readonly expiresAt?: Timestamp;
  readonly verifier: string;
  readonly methodology: VerificationMethodology;
  readonly blockchainRecord?: BlockchainVerificationRecord;
}

export interface Discrepancy {
  readonly field: string;
  readonly claimed: number;
  readonly verified: number;
  readonly tolerance: number;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly explanation: string;
}

export interface BlockchainVerificationRecord {
  readonly transactionHash: string;
  readonly blockNumber: number;
  readonly network: string;
  readonly contractAddress: string;
  readonly tokenId?: string;
  readonly timestamp: Timestamp;
  readonly signature: string;
}

export interface ImpactCertification {
  readonly id: string;
  readonly verificationId: string;
  readonly certificationType: CertificationType;
  readonly impact: RegenerativeImpact;
  readonly projectId: string;
  readonly beneficiaryId: string;
  readonly issuedAt: Timestamp;
  readonly expiresAt?: Timestamp;
  readonly status: CertificationStatus;
  readonly metadata: CertificationMetadata;
  readonly blockchainRecord: BlockchainVerificationRecord;
}

export type CertificationType = 
  | 'carbon_credit' | 'biodiversity_credit' | 'water_quality'
  | 'soil_health' | 'community_benefit' | 'cultural_preservation';

export type CertificationStatus = 
  | 'active' | 'transferred' | 'retired' | 'expired' | 'revoked';

export interface CertificationMetadata {
  readonly standardId: string;
  readonly verifierCredentials: string;
  readonly auditReportUrl?: string;
  readonly additionalEvidence: readonly string[];
}

export interface VerificationAudit {
  readonly id: string;
  readonly verificationId: string;
  readonly action: AuditAction;
  readonly actor: string;
  readonly actorRole: UserRole;
  readonly timestamp: Timestamp;
  readonly details: Record<string, unknown>;
  readonly hash: string;
}

export type AuditAction = 
  | 'submitted' | 'assigned' | 'evidence_added' | 'evidence_reviewed'
  | 'review_started' | 'discrepancy_found' | 'approved' | 'rejected'
  | 'appealed' | 'appeal_reviewed' | 'certification_issued'
  | 'certification_transferred' | 'certification_retired' | 'certification_revoked';

export interface VerifierProfile {
  readonly userId: string;
  readonly credentials: readonly VerifierCredential[];
  readonly specializations: readonly string[];
  readonly totalVerifications: number;
  readonly approvalRate: Probability;
  readonly averageProcessingDays: number;
  readonly status: 'active' | 'suspended' | 'revoked';
  readonly assignedRegions: readonly string[];
}

export interface VerifierCredential {
  readonly standardId: string;
  readonly credentialId: string;
  readonly issueDate: Timestamp;
  readonly expiryDate?: Timestamp;
  readonly issuingAuthority: string;
}

export interface VerificationAppeal {
  readonly id: string;
  readonly verificationId: string;
  readonly appellant: string;
  readonly reason: string;
  readonly evidence: readonly Evidence[];
  readonly status: AppealStatus;
  readonly submittedAt: Timestamp;
  readonly reviewedAt?: Timestamp;
  readonly reviewer?: string;
  readonly decision?: AppealDecision;
  readonly decisionReason?: string;
}

export type AppealStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
export type AppealDecision = 
  | 'overturn_approval' | 'overturn_rejection' 
  | 'request_additional_evidence' | 'uphold_decision';

// ============================================================================
// SECTION 2: VERIFICATION INTERFACES
// ============================================================================

export interface IVerificationEngine {
  processVerification(request: VerificationRequest): Promise<Result<VerificationResult, AtlasError>>;
  calculateImpactScore(claimed: RegenerativeImpact, verified: RegenerativeImpact, methodology: VerificationMethodology): Promise<Result<number, AtlasError>>;
  identifyDiscrepancies(claimed: RegenerativeImpact, verified: RegenerativeImpact, tolerance: number): Promise<Result<readonly Discrepancy[], AtlasError>>;
  applyMethodology(request: VerificationRequest, evidence: readonly OracleDataPoint[]): Promise<Result<RegenerativeImpact, AtlasError>>;
}

export interface ICertificationIssuer {
  issueCertification(verificationResult: VerificationResult, projectId: string, beneficiaryId: string): Promise<Result<ImpactCertification, AtlasError>>;
  transferCertification(certificationId: string, fromOwner: string, toOwner: string): Promise<Result<ImpactCertification, AtlasError>>;
  retireCertification(certificationId: string, reason: string): Promise<Result<ImpactCertification, AtlasError>>;
  revokeCertification(certificationId: string, reason: string, authority: string): Promise<Result<ImpactCertification, AtlasError>>;
  getCertification(id: string): Promise<Result<ImpactCertification, AtlasError>>;
  getCertificationsByOwner(ownerId: string): Promise<Result<readonly ImpactCertification[], AtlasError>>;
  getCertificationsByProject(projectId: string): Promise<Result<readonly ImpactCertification[], AtlasError>>;
}

export interface IVerificationStandardRegistry {
  getStandards(): Promise<Result<readonly VerificationStandard[], AtlasError>>;
  getStandard(id: string): Promise<Result<VerificationStandard, AtlasError>>;
  registerStandard(standard: Omit<VerificationStandard, 'id'>): Promise<Result<VerificationStandard, AtlasError>>;
  getStandardsForRegion(region: string): Promise<Result<readonly VerificationStandard[], AtlasError>>;
}

export interface IVerifierManager {
  getVerifier(userId: string): Promise<Result<VerifierProfile, AtlasError>>;
  registerVerifier(user: AuthUser, credentials: readonly VerifierCredential[], specializations: readonly string[]): Promise<Result<VerifierProfile, AtlasError>>;
  assignVerifier(verificationId: string, verifierId: string): Promise<Result<boolean, AtlasError>>;
  getAvailableVerifiers(region: string, specialization?: string): Promise<Result<readonly VerifierProfile[], AtlasError>>;
  updateVerifierStatus(verifierId: string, status: 'active' | 'suspended' | 'revoked'): Promise<Result<VerifierProfile, AtlasError>>;
}

export interface IAuditTrail {
  recordAction(verificationId: string, action: AuditAction, actor: string, actorRole: UserRole, details?: Record<string, unknown>): Promise<Result<VerificationAudit, AtlasError>>;
  getAuditTrail(verificationId: string): Promise<Result<readonly VerificationAudit[], AtlasError>>;
  verifyIntegrity(verificationId: string): Promise<Result<boolean, AtlasError>>;
  exportAuditTrail(verificationId: string, format: 'json' | 'pdf' | 'csv'): Promise<Result<string, AtlasError>>;
}

export interface IAppealManager {
  submitAppeal(verificationId: string, appellant: string, reason: string, evidence: readonly Evidence[]): Promise<Result<VerificationAppeal, AtlasError>>;
  processAppeal(appealId: string, reviewer: string, decision: AppealDecision, decisionReason: string): Promise<Result<VerificationAppeal, AtlasError>>;
  getAppeal(id: string): Promise<Result<VerificationAppeal, AtlasError>>;
  getAppealsByStatus(status: AppealStatus): Promise<Result<readonly VerificationAppeal[], AtlasError>>;
}

export interface IImpactVerificationService {
  readonly engine: IVerificationEngine;
  readonly standards: IVerificationStandardRegistry;
  readonly verifiers: IVerifierManager;
  readonly certification: ICertificationIssuer;
  readonly audit: IAuditTrail;
  readonly appeals: IAppealManager;
  submitVerificationRequest(projectId: string, claimedImpact: RegenerativeImpact, interventions: readonly RegenerativeIntervention[], evidence: readonly Evidence[]): Promise<Result<VerificationRequest, AtlasError>>;
  getVerificationStatus(requestId: string): Promise<Result<VerificationRequest, AtlasError>>;
  getVerificationResult(requestId: string): Promise<Result<VerificationResult, AtlasError>>;
}

// ============================================================================
// SECTION 3: VERIFICATION ENGINE IMPLEMENTATION
// ============================================================================

const DEFAULT_TOLERANCES: Record<string, number> = {
  carbon: 0.1, biodiversity: 0.15, social: 0.2, cultural: 0.25, water: 0.12, soil: 0.15,
};

export class VerificationEngine implements IVerificationEngine {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly tracer: Tracer;
  private readonly oracleService: IImpactOracleService;

  constructor(oracleService: IImpactOracleService) {
    this.oracleService = oracleService;
    this.circuitBreaker = new CircuitBreaker('verification-engine', {
      failureThreshold: 5, timeoutMs: 60000, volumeThreshold: 10,
    });
    this.tracer = new Tracer();
  }

  async processVerification(request: VerificationRequest): Promise<Result<VerificationResult, AtlasError>> {
    const span = this.tracer.startSpan('processVerification', { requestId: request.id });

    try {
      return this.circuitBreaker.execute(async () => {
        const oracleData = await this.oracleService.getHistoricalImpact(
          request.location, Date.now() - 365 * 24 * 60 * 60 * 1000, Date.now()
        );

        if (!oracleData.success) return fail(oracleData.error);

        const verifiedImpact = await this.applyMethodology(request, oracleData.value);
        if (!verifiedImpact.success) return fail(verifiedImpact.error);

        const impactScore = await this.calculateImpactScore(request.claimedImpact, verifiedImpact.value, request.methodology);
        if (!impactScore.success) return fail(impactScore.error);

        const discrepancies = await this.identifyDiscrepancies(request.claimedImpact, verifiedImpact.value, 0.1);
        if (!discrepancies.success) return fail(discrepancies.error);

        const verified = impactScore.value >= 70 && discrepancies.value.filter(d => d.severity === 'critical').length === 0;

        const result: VerificationResult = {
          requestId: request.id,
          verified,
          confidenceScore: this.calculateConfidence(discrepancies.value),
          impactScore: impactScore.value,
          discrepancies: discrepancies.value,
          recommendations: this.generateRecommendations(discrepancies.value),
          verifiedAt: Date.now() as Timestamp,
          expiresAt: verified ? (Date.now() + 365 * 24 * 60 * 60 * 1000) as Timestamp : undefined,
          verifier: 'system',
          methodology: request.methodology,
        };

        this.tracer.endSpan(span, 'ok');
        return ok(result);
      });
    } catch (error) {
      this.tracer.endSpan(span, 'error');
      return fail(error as AtlasError);
    }
  }

  async calculateImpactScore(claimed: RegenerativeImpact, verified: RegenerativeImpact, methodology: VerificationMethodology): Promise<Result<number, AtlasError>> {
    const weights: Record<VerificationMethodology, Record<string, number>> = {
      satellite_analysis: { carbon: 0.5, biodiversity: 0.3, water: 0.2 },
      sensor_verification: { carbon: 0.3, biodiversity: 0.4, water: 0.3 },
      third_party_audit: { carbon: 0.4, biodiversity: 0.3, social: 0.3 },
      community_validation: { social: 0.4, cultural: 0.3, carbon: 0.3 },
      hybrid: { carbon: 0.25, biodiversity: 0.25, social: 0.25, water: 0.25 },
    };

    const methodWeights = weights[methodology];
    const keys = Object.keys(claimed) as readonly (keyof RegenerativeImpact)[];
    
    let totalScore = 0, totalWeight = 0;

    for (const key of keys) {
      const weight = methodWeights[key] ?? 0.25;
      const claimedValue = claimed[key] ?? 0;
      const verifiedValue = verified[key] ?? 0;

      if (claimedValue > 0) {
        const ratio = verifiedValue / claimedValue;
        const metricScore = Math.min(ratio, 1) * 100;
        totalScore += metricScore * weight;
        totalWeight += weight;
      }
    }

    return ok(totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) / 100 : 0);
  }

  async identifyDiscrepancies(claimed: RegenerativeImpact, verified: RegenerativeImpact, tolerance: number): Promise<Result<readonly Discrepancy[], AtlasError>> {
    const discrepancies: Discrepancy[] = [];
    const keys = Object.keys(claimed) as readonly (keyof RegenerativeImpact)[];

    for (const key of keys) {
      const claimedValue = claimed[key] ?? 0;
      const verifiedValue = verified[key] ?? 0;
      const keyTolerance = DEFAULT_TOLERANCES[key] ?? tolerance;
      const toleranceValue = claimedValue * keyTolerance;

      if (Math.abs(claimedValue - verifiedValue) > toleranceValue) {
        const deviation = Math.abs((claimedValue - verifiedValue) / claimedValue);
        let severity: 'low' | 'medium' | 'high' | 'critical';
        if (deviation < 0.1) severity = 'low';
        else if (deviation < 0.25) severity = 'medium';
        else if (deviation < 0.5) severity = 'high';
        else severity = 'critical';

        discrepancies.push({
          field: key, claimed: claimedValue, verified: verifiedValue,
          tolerance: toleranceValue, severity,
          explanation: `${key} discrepancy: claimed ${claimedValue}, verified ${verifiedValue}`,
        });
      }
    }

    return ok(discrepancies);
  }

  async applyMethodology(request: VerificationRequest, evidence: readonly OracleDataPoint[]): Promise<Result<RegenerativeImpact, AtlasError>> {
    const aggregated: Record<string, number[]> = {};
    for (const point of evidence) {
      if (!aggregated[point.type]) aggregated[point.type] = [];
      aggregated[point.type].push(point.value);
    }

    const result: RegenerativeImpact = {
      carbon: this.average(aggregated['carbon']),
      biodiversity: this.average(aggregated['biodiversity']),
      social: this.average(aggregated['social']),
      cultural: this.average(aggregated['cultural']),
      water: this.average(aggregated['water']),
      soil: this.average(aggregated['soil']),
    };

    return ok(result);
  }

  private average(values: number[] | undefined): number {
    return values && values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  private calculateConfidence(discrepancies: readonly Discrepancy[]): number {
    if (discrepancies.length === 0) return 1;
    const weights = { low: 0.9, medium: 0.7, high: 0.5, critical: 0.2 };
    return discrepancies.reduce((sum, d) => sum + weights[d.severity], 0) / discrepancies.length;
  }

  private generateRecommendations(discrepancies: readonly Discrepancy[]): string[] {
    const recommendations: string[] = [];
    for (const d of discrepancies) {
      if (d.severity === 'critical' || d.severity === 'high') {
        recommendations.push(`Review ${d.field}: ${d.explanation}`);
        recommendations.push(`Provide additional evidence for ${d.field}`);
      }
    }
    if (recommendations.length === 0) {
      recommendations.push('Continue monitoring impact metrics');
      recommendations.push('Submit next verification in 6 months');
    }
    return recommendations;
  }
}

// ============================================================================
// SECTION 4: CERTIFICATION ISSUER IMPLEMENTATION
// ============================================================================

export class CertificationIssuer implements ICertificationIssuer {
  private readonly blockchainService: IBlockchainService;
  private readonly cache: Cache<ImpactCertification>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor(blockchainService: IBlockchainService) {
    this.blockchainService = blockchainService;
    this.cache = new Cache<ImpactCertification>({ defaultTTLMs: 3600000, maxSize: 1000 });
    this.circuitBreaker = new CircuitBreaker('certification-issuer', { failureThreshold: 3, timeoutMs: 30000 });
  }

  async issueCertification(verificationResult: VerificationResult, projectId: string, beneficiaryId: string): Promise<Result<ImpactCertification, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      if (!verificationResult.verified) {
        return fail(new AtlasError('Cannot issue certification for unverified impact', 'CERTIFICATION_FAILED', 'validation', false));
      }

      const nftResult = await this.blockchainService.mintImpactNFT(projectId, verificationResult as unknown as RegenerativeImpact);
      if (!nftResult.success) return fail(nftResult.error);

      const certification: ImpactCertification = {
        id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        verificationId: verificationResult.requestId,
        certificationType: this.determineCertificationType(verificationResult.impactScore),
        impact: verificationResult as unknown as RegenerativeImpact,
        projectId, beneficiaryId,
        issuedAt: Date.now() as Timestamp,
        expiresAt: verificationResult.expiresAt,
        status: 'active',
        metadata: { standardId: 'default', verifierCredentials: verificationResult.verifier },
        blockchainRecord: {
          transactionHash: nftResult.value.transactionHash, blockNumber: 0,
          network: 'Ethereum', contractAddress: '0x...',
          tokenId: nftResult.value.id, timestamp: Date.now() as Timestamp, signature: '',
        },
      };

      this.cache.set(certification.id, certification);
      return ok(certification);
    });
  }

  async transferCertification(certificationId: string, fromOwner: string, toOwner: string): Promise<Result<ImpactCertification, AtlasError>> {
    const certification = this.cache.get(certificationId);
    if (!certification) return fail(new AtlasError('Certification not found', 'CERTIFICATION_NOT_FOUND', 'validation', false));

    const updated = { ...certification, beneficiaryId: toOwner, status: 'transferred' as const };
    this.cache.set(certificationId, updated);
    return ok(updated);
  }

  async retireCertification(certificationId: string, reason: string): Promise<Result<ImpactCertification, AtlasError>> {
    const certification = this.cache.get(certificationId);
    if (!certification) return fail(new AtlasError('Certification not found', 'CERTIFICATION_NOT_FOUND', 'validation', false));

    const updated = { ...certification, status: 'retired' as const, metadata: { ...certification.metadata, retirementReason: reason } };
    this.cache.set(certificationId, updated);
    return ok(updated);
  }

  async revokeCertification(certificationId: string, reason: string, _authority: string): Promise<Result<ImpactCertification, AtlasError>> {
    const certification = this.cache.get(certificationId);
    if (!certification) return fail(new AtlasError('Certification not found', 'CERTIFICATION_NOT_FOUND', 'validation', false));

    const updated = { ...certification, status: 'revoked' as const, metadata: { ...certification.metadata, revocationReason: reason } };
    this.cache.set(certificationId, updated);
    return ok(updated);
  }

  async getCertification(id: string): Promise<Result<ImpactCertification, AtlasError>> {
    const certification = this.cache.get(id);
    return certification ? ok(certification) : fail(new AtlasError('Certification not found', 'CERTIFICATION_NOT_FOUND', 'validation', false));
  }

  async getCertificationsByOwner(ownerId: string): Promise<Result<readonly ImpactCertification[], AtlasError>> {
    return ok(Array.from(this.cache.store.values()).filter(c => c.beneficiaryId === ownerId));
  }

  async getCertificationsByProject(projectId: string): Promise<Result<readonly ImpactCertification[], AtlasError>> {
    return ok(Array.from(this.cache.store.values()).filter(c => c.projectId === projectId));
  }

  private determineCertificationType(impactScore: number): CertificationType {
    if (impactScore >= 90) return 'carbon_credit';
    if (impactScore >= 75) return 'biodiversity_credit';
    if (impactScore >= 60) return 'water_quality';
    if (impactScore >= 45) return 'soil_health';
    return 'community_benefit';
  }
}

// ============================================================================
// SECTION 5: COMPLETE VERIFICATION SERVICE
// ============================================================================

export class ImpactVerificationService implements IImpactVerificationService {
  readonly engine: IVerificationEngine;
  readonly standards: IVerificationStandardRegistry;
  readonly verifiers: IVerifierManager;
  readonly certification: ICertificationIssuer;
  readonly audit: IAuditTrail;
  readonly appeals: IAppealManager;

  constructor(oracleService: IImpactOracleService, blockchainService: IBlockchainService, _authService: IAuthService) {
    this.engine = new VerificationEngine(oracleService);
    this.certification = new CertificationIssuer(blockchainService);
    this.standards = this.createStubStandardRegistry();
    this.verifiers = this.createStubVerifierManager();
    this.audit = this.createStubAuditTrail();
    this.appeals = this.createStubAppealManager();
  }

  async submitVerificationRequest(projectId: string, claimedImpact: RegenerativeImpact, interventions: readonly RegenerativeIntervention[], _evidence: readonly Evidence[]): Promise<Result<VerificationRequest, AtlasError>> {
    return ok({
      id: `vr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      claimId: `claim-${Date.now()}`,
      submittedBy: 'system',
      submittedAt: Date.now() as Timestamp,
      interventions,
      claimedImpact,
      location: interventions[0]?.location ?? { lat: 0, lng: 0 },
      evidence: [],
      methodology: 'hybrid',
      status: 'pending',
    });
  }

  async getVerificationStatus(_requestId: string): Promise<Result<VerificationRequest, AtlasError>> {
    return fail(new AtlasError('Verification request not found', 'NOT_FOUND', 'validation', false));
  }

  async getVerificationResult(_requestId: string): Promise<Result<VerificationResult, AtlasError>> {
    return fail(new AtlasError('Verification result not found', 'NOT_FOUND', 'validation', false));
  }

  private createStubStandardRegistry(): IVerificationStandardRegistry {
    return {
      getStandards: async () => ok([]),
      getStandard: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      registerStandard: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      getStandardsForRegion: async () => ok([]),
    };
  }

  private createStubVerifierManager(): IVerifierManager {
    return {
      getVerifier: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      registerVerifier: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      assignVerifier: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      getAvailableVerifiers: async () => ok([]),
      updateVerifierStatus: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
    };
  }

  private createStubAuditTrail(): IAuditTrail {
    return {
      recordAction: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      getAuditTrail: async () => ok([]),
      verifyIntegrity: async () => ok(true),
      exportAuditTrail: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
    };
  }

  private createStubAppealManager(): IAppealManager {
    return {
      submitAppeal: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      processAppeal: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      getAppeal: async () => fail(new AtlasError('Not implemented', 'STUB', 'internal', false)),
      getAppealsByStatus: async () => ok([]),
    };
  }
}

// ============================================================================
// SECTION 6: FACTORY FUNCTION & ERROR CODES
// ============================================================================

export function createVerificationService(
  oracleService: IImpactOracleService,
  blockchainService: IBlockchainService,
  authService: IAuthService
): IImpactVerificationService {
  return new ImpactVerificationService(oracleService, blockchainService, authService);
}

export const VerificationErrorCodes = {
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
  EVIDENCE_INSUFFICIENT: 'EVIDENCE_INSUFFICIENT',
  DISCREPANCY_DETECTED: 'DISCREPANCY_DETECTED',
  CERTIFICATION_FAILED: 'CERTIFICATION_FAILED',
  CERTIFICATION_NOT_FOUND: 'CERTIFICATION_NOT_FOUND',
  APPEAL_INVALID: 'APPEAL_INVALID',
} as const;
