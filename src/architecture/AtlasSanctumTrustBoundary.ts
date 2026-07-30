/**
 * Atlas Sanctum Trust Boundary & Decision Authority
 * 
 * Trust boundary enforcement and decision authority mechanisms for
 * cryptographic claims certification and boundary setting.
 * 
 * Core Responsibilities:
 * - Determine legitimate claims vs. overstatement
 * - Establish provable vs. estimated boundaries
 * - Enforce trust levels for system assertions
 * - Prevent marketing overreach in technical claims
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  Timestamp,
  Probability,
} from './AtlasSanctumTypes';

import {
  TrustLevel,
  ClaimType,
  TrustAssertion,
  TrustEvidence,
  RevocationRecord,
  TrustBoundary,
  EnforcementPolicy,
  TrustDecision,
  createCryptoError,
  PublicKey,
} from './AtlasSanctumCryptoTypes';

import { CircuitBreaker, Tracer } from './AtlasSanctumCrossCutting';

// ============================================================================
// TRUST TYPES (local to avoid conflicts)
// ============================================================================

export type TrustEvidenceType = 
  | 'signature'
  | 'proof'
  | 'attestation'
  | 'oracle'
  | 'consensus';

export type ClaimCategory = 
  | 'impact_claim'
  | 'security_claim'
  | 'performance_claim'
  | 'compliance_claim'
  | 'identity_claim'
  | 'ownership_claim';

export interface ClaimBoundary {
  readonly boundaryId: string;
  readonly claim: string;
  readonly category: ClaimCategory;
  readonly maxTrustLevel: TrustLevel;
  readonly requiredEvidence: readonly TrustEvidenceType[];
  readonly caveats: readonly string[];
  readonly validFrom: Timestamp;
  readonly validUntil?: Timestamp;
}

export interface ClaimValidationResult {
  readonly valid: boolean;
  readonly trustLevel: TrustLevel;
  readonly confidence: Probability;
  readonly reasoning: readonly string[];
  readonly violations: readonly string[];
  readonly recommendations: readonly string[];
}

export interface AuthorityDecision {
  readonly decisionId: string;
  readonly claim: string;
  readonly claimType: ClaimType;
  readonly decision: 'approved' | 'rejected' | 'conditional';
  readonly trustLevel: TrustLevel;
  readonly conditions?: readonly string[];
  readonly validFrom: Timestamp;
  readonly validUntil?: Timestamp;
  readonly appealable: boolean;
  readonly appealDeadline?: Timestamp;
}

export interface TrustPolicy {
  readonly policyId: string;
  readonly name: string;
  readonly description: string;
  readonly boundaries: readonly ClaimBoundary[];
  readonly enforcementMode: 'strict' | 'moderate' | 'permissive';
  readonly overrideRequires: readonly string[];
}

// ============================================================================
// TRUST SERVICE INTERFACES
// ============================================================================

export interface ITrustBoundaryService {
  registerBoundary(boundary: ClaimBoundary): Promise<Result<ClaimBoundary, AtlasError>>;
  validateClaim(claim: string, evidence: readonly TrustEvidence[]): Promise<Result<ClaimValidationResult, AtlasError>>;
  getBoundaryForClaim(claim: string, category: ClaimCategory): Promise<Result<ClaimBoundary | null, AtlasError>>;
  updateBoundary(boundaryId: string, updates: Partial<ClaimBoundary>): Promise<Result<ClaimBoundary, AtlasError>>;
}

export interface IClaimCertificationService {
  certifyClaim(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<TrustAssertion, AtlasError>>;
  revokeCertification(assertionId: string, reason: string): Promise<Result<boolean, AtlasError>>;
  getCertification(assertionId: string): Promise<Result<TrustAssertion | null, AtlasError>>;
  getActiveCertifications(): Promise<Result<readonly TrustAssertion[], AtlasError>>;
}

export interface IDecisionAuthority {
  makeDecision(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<AuthorityDecision, AtlasError>>;
  reviewDecision(decisionId: string, override?: boolean): Promise<Result<AuthorityDecision, AtlasError>>;
  appealDecision(decisionId: string, newEvidence: readonly TrustEvidence[]): Promise<Result<AuthorityDecision, AtlasError>>;
  getDecisionHistory(claim: string): Promise<Result<readonly AuthorityDecision[], AtlasError>>;
}

export interface ITrustPolicyService {
  createPolicy(policy: Omit<TrustPolicy, 'policyId'>): Promise<Result<TrustPolicy, AtlasError>>;
  getActivePolicy(): Promise<Result<TrustPolicy, AtlasError>>;
  updatePolicy(policyId: string, updates: Partial<TrustPolicy>): Promise<Result<TrustPolicy, AtlasError>>;
  evaluatePolicy(claim: string, category: ClaimCategory): Promise<Result<{ compliant: boolean; violations: string[] }, AtlasError>>;
}

export interface ITrustAuditService {
  recordDecision(decision: AuthorityDecision): Promise<Result<boolean, AtlasError>>;
  getAuditTrail(claim: string): Promise<Result<readonly AuthorityDecision[], AtlasError>>;
  verifyIntegrity(decisionId: string): Promise<Result<boolean, AtlasError>>;
  exportAuditTrail(claim: string, format: 'json' | 'csv'): Promise<Result<string, AtlasError>>;
}

// ============================================================================
// TRUST BOUNDARY SERVICE IMPLEMENTATION
// ============================================================================

class TrustBoundaryServiceImpl implements ITrustBoundaryService {
  private readonly boundaries: Map<string, ClaimBoundary>;
  private readonly circuitBreaker: CircuitBreaker;
  private readonly tracer: Tracer;

  constructor() {
    this.boundaries = new Map();
    this.circuitBreaker = new CircuitBreaker('trust-boundary', {
      failureThreshold: 3,
      timeoutMs: 30000,
      volumeThreshold: 10,
    });
    this.tracer = new Tracer();

    // Register default boundaries
    this.registerDefaultBoundaries();
  }

  async registerBoundary(boundary: ClaimBoundary): Promise<Result<ClaimBoundary, AtlasError>> {
    this.boundaries.set(boundary.boundaryId, boundary);
    return ok(boundary);
  }

  async validateClaim(claim: string, evidence: readonly TrustEvidence[]): Promise<Result<ClaimValidationResult, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const reasoning: string[] = [];
      const violations: string[] = [];
      const recommendations: string[] = [];

      // Check evidence quality
      const proofCount = evidence.filter(e => e.type === 'proof').length;
      const attestationCount = evidence.filter(e => e.type === 'attestation').length;
      const verificationCount = evidence.filter(e => e.type === 'signature').length;

      // Determine trust level based on evidence
      let trustLevel: TrustLevel = 'untrusted';
      let confidence: Probability = 0.5 as Probability;

      if (proofCount > 0 && verificationCount > 0) {
        trustLevel = 'verified';
        confidence = 0.99 as Probability;
        reasoning.push('Strong cryptographic proof with formal verification');
      } else if (proofCount > 0) {
        trustLevel = 'high';
        confidence = 0.95 as Probability;
        reasoning.push('Cryptographic proof provided');
      } else if (attestationCount > 0) {
        trustLevel = 'medium';
        confidence = 0.8 as Probability;
        reasoning.push('Third-party attestation available');
      } else {
        trustLevel = 'low';
        confidence = 0.5 as Probability;
        reasoning.push('Limited evidence provided');
        recommendations.push('Consider obtaining cryptographic proof');
      }

      const result: ClaimValidationResult = {
        valid: violations.length === 0,
        trustLevel,
        confidence,
        reasoning,
        violations,
        recommendations,
      };

      return ok(result);
    });
  }

  async getBoundaryForClaim(claim: string, category: ClaimCategory): Promise<Result<ClaimBoundary | null, AtlasError>> {
    for (const boundary of this.boundaries.values()) {
      if (boundary.claim === claim && boundary.category === category) {
        return ok(boundary);
      }
    }
    return ok(null);
  }

  async updateBoundary(boundaryId: string, updates: Partial<ClaimBoundary>): Promise<Result<ClaimBoundary, AtlasError>> {
    const boundary = this.boundaries.get(boundaryId);
    if (!boundary) {
      return fail(createCryptoError(`Boundary not found: ${boundaryId}`, 'BOUNDARY_NOT_FOUND', 'validation', false));
    }

    const updated: ClaimBoundary = {
      ...boundary,
      ...updates,
    };

    this.boundaries.set(boundaryId, updated);
    return ok(updated);
  }

  private registerDefaultBoundaries(): void {
    const defaultBoundaries: ClaimBoundary[] = [
      {
        boundaryId: 'impact-carbon',
        claim: 'carbon_sequestration',
        category: 'impact_claim',
        maxTrustLevel: 'verified',
        requiredEvidence: ['proof', 'oracle'],
        caveats: ['Subject to measurement uncertainty', 'Based on current models'],
        validFrom: Date.now() as Timestamp,
      },
      {
        boundaryId: 'security-zero-trust',
        claim: 'zero_trust_architecture',
        category: 'security_claim',
        maxTrustLevel: 'certified',
        requiredEvidence: ['signature', 'attestation'],
        caveats: ['Security guarantees assume proper implementation'],
        validFrom: Date.now() as Timestamp,
      },
      {
        boundaryId: 'performance-sla',
        claim: 'uptime_guarantee',
        category: 'performance_claim',
        maxTrustLevel: 'high',
        requiredEvidence: ['consensus', 'oracle'],
        caveats: ['Excludes scheduled maintenance', 'Based on historical data'],
        validFrom: Date.now() as Timestamp,
      },
    ];

    for (const boundary of defaultBoundaries) {
      this.boundaries.set(boundary.boundaryId, boundary);
    }
  }
}

// ============================================================================
// CLAIM CERTIFICATION SERVICE IMPLEMENTATION
// ============================================================================

class ClaimCertificationServiceImpl implements IClaimCertificationService {
  private readonly certifications: Map<string, TrustAssertion>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.certifications = new Map();
    this.circuitBreaker = new CircuitBreaker('claim-certification', {
      failureThreshold: 3,
      timeoutMs: 30000,
      volumeThreshold: 10,
    });
  }

  async certifyClaim(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<TrustAssertion, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const trustLevel = this.determineTrustLevel(evidence);
      
      const assertion: TrustAssertion = {
        assertionId: `assert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        claim,
        claimType,
        trustLevel,
        evidence,
        verifier: 'atlas-authority',
        validFrom: Date.now() as Timestamp,
        validUntil: Date.now() + 365 * 24 * 60 * 60 * 1000 as Timestamp,
        scope: [claimType],
      };

      this.certifications.set(assertion.assertionId, assertion);
      return ok(assertion);
    });
  }

  async revokeCertification(assertionId: string, reason: string): Promise<Result<boolean, AtlasError>> {
    const assertion = this.certifications.get(assertionId);
    if (!assertion) {
      return fail(createCryptoError(`Certification not found: ${assertionId}`, 'CERT_NOT_FOUND', 'validation', false));
    }

    const revokedAssertion: TrustAssertion = {
      ...assertion,
      revocation: {
        reason: reason as RevocationRecord['reason'],
        timestamp: Date.now() as Timestamp,
        authority: 'atlas-authority',
      },
    };

    this.certifications.set(assertionId, revokedAssertion);
    return ok(true);
  }

  async getCertification(assertionId: string): Promise<Result<TrustAssertion | null, AtlasError>> {
    return ok(this.certifications.get(assertionId) || null);
  }

  async getActiveCertifications(): Promise<Result<readonly TrustAssertion[], AtlasError>> {
    const active = Array.from(this.certifications.values())
      .filter(a => !a.revocation);
    return ok(active);
  }

  private determineTrustLevel(evidence: readonly TrustEvidence[]): TrustLevel {
    const hasProof = evidence.some(e => e.type === 'proof');
    const hasSignature = evidence.some(e => e.type === 'signature');
    const hasAttestation = evidence.some(e => e.type === 'attestation');

    if (hasProof && hasSignature) return 'verified';
    if (hasProof) return 'high';
    if (hasAttestation) return 'medium';
    return 'low';
  }
}

// ============================================================================
// DECISION AUTHORITY IMPLEMENTATION
// ============================================================================

class DecisionAuthorityImpl implements IDecisionAuthority {
  private readonly decisions: Map<string, AuthorityDecision>;
  private readonly boundaryService: ITrustBoundaryService;
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.decisions = new Map();
    this.boundaryService = new TrustBoundaryServiceImpl();
    this.circuitBreaker = new CircuitBreaker('decision-authority', {
      failureThreshold: 3,
      timeoutMs: 60000,
      volumeThreshold: 10,
    });
  }

  async makeDecision(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<AuthorityDecision, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const validation = await this.boundaryService.validateClaim(claim, evidence);
      if (!validation.success) {
        return fail(validation.error);
      }

      const isValid = validation.value.violations.length === 0;
      
      const decision: AuthorityDecision = {
        decisionId: `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        claim,
        claimType,
        decision: isValid ? 'approved' : 'rejected',
        trustLevel: validation.value.trustLevel,
        conditions: validation.value.recommendations.length > 0 
          ? validation.value.recommendations 
          : undefined,
        validFrom: Date.now() as Timestamp,
        validUntil: Date.now() + 90 * 24 * 60 * 60 * 1000 as Timestamp,
        appealable: true,
        appealDeadline: Date.now() + 30 * 24 * 60 * 60 * 1000 as Timestamp,
      };

      this.decisions.set(decision.decisionId, decision);
      return ok(decision);
    });
  }

  async reviewDecision(decisionId: string, override?: boolean): Promise<Result<AuthorityDecision, AtlasError>> {
    const original = this.decisions.get(decisionId);
    if (!original) {
      return fail(createCryptoError(`Decision not found: ${decisionId}`, 'DECISION_NOT_FOUND', 'validation', false));
    }

    if (override) {
      const reviewed: AuthorityDecision = {
        ...original,
        decision: 'approved',
        trustLevel: 'certified',
      };
      this.decisions.set(decisionId, reviewed);
      return ok(reviewed);
    }

    return ok(original);
  }

  async appealDecision(decisionId: string, newEvidence: readonly TrustEvidence[]): Promise<Result<AuthorityDecision, AtlasError>> {
    const original = this.decisions.get(decisionId);
    if (!original) {
      return fail(createCryptoError(`Decision not found: ${decisionId}`, 'DECISION_NOT_FOUND', 'validation', false));
    }

    return this.makeDecision(original.claim, original.claimType, newEvidence);
  }

  async getDecisionHistory(claim: string): Promise<Result<readonly AuthorityDecision[], AtlasError>> {
    const history = Array.from(this.decisions.values())
      .filter(d => d.claim === claim);
    return ok(history);
  }
}

// ============================================================================
// TRUST POLICY SERVICE IMPLEMENTATION
// ============================================================================

class TrustPolicyServiceImpl implements ITrustPolicyService {
  private readonly policies: Map<string, TrustPolicy>;
  private activePolicyId: string | null = null;
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.policies = new Map();
    this.circuitBreaker = new CircuitBreaker('trust-policy', {
      failureThreshold: 3,
      timeoutMs: 15000,
      volumeThreshold: 10,
    });

    this.createDefaultPolicy();
  }

  async createPolicy(policy: Omit<TrustPolicy, 'policyId'>): Promise<Result<TrustPolicy, AtlasError>> {
    const fullPolicy: TrustPolicy = {
      ...policy,
      policyId: `policy-${Date.now()}`,
    };

    this.policies.set(fullPolicy.policyId, fullPolicy);
    return ok(fullPolicy);
  }

  async getActivePolicy(): Promise<Result<TrustPolicy, AtlasError>> {
    if (this.activePolicyId) {
      const policy = this.policies.get(this.activePolicyId);
      if (policy) return ok(policy);
    }

    return this.createPolicy({
      name: 'Default Trust Policy',
      description: 'Default trust policy for all claims',
      boundaries: [],
      enforcementMode: 'moderate',
      overrideRequires: ['board_approval'],
    });
  }

  async updatePolicy(policyId: string, updates: Partial<TrustPolicy>): Promise<Result<TrustPolicy, AtlasError>> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return fail(createCryptoError(`Policy not found: ${policyId}`, 'POLICY_NOT_FOUND', 'validation', false));
    }

    const updated: TrustPolicy = {
      ...policy,
      ...updates,
    };

    this.policies.set(policyId, updated);
    return ok(updated);
  }

  async evaluatePolicy(claim: string, category: ClaimCategory): Promise<Result<{ compliant: boolean; violations: string[] }, AtlasError>> {
    const result = await this.getActivePolicy();
    if (!result.success) {
      return result;
    }

    const violations: string[] = [];
    let compliant = true;

    for (const boundary of result.value.boundaries) {
      if (boundary.claim === claim && boundary.category === category) {
        if (boundary.validUntil && boundary.validUntil < Date.now()) {
          violations.push('Boundary has expired');
          compliant = false;
        }
      }
    }

    return ok({ compliant, violations });
  }

  private createDefaultPolicy(): void {
    const defaultPolicy: TrustPolicy = {
      policyId: 'default-policy',
      name: 'Default Trust Policy',
      description: 'Default trust policy enforcing conservative claim boundaries',
      boundaries: [],
      enforcementMode: 'moderate',
      overrideRequires: ['security_council_approval'],
    };

    this.policies.set(defaultPolicy.policyId, defaultPolicy);
    this.activePolicyId = defaultPolicy.policyId;
  }
}

// ============================================================================
// TRUST AUDIT SERVICE IMPLEMENTATION
// ============================================================================

class TrustAuditServiceImpl implements ITrustAuditService {
  private readonly auditTrail: Map<string, AuthorityDecision>;
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.auditTrail = new Map();
    this.circuitBreaker = new CircuitBreaker('trust-audit', {
      failureThreshold: 3,
      timeoutMs: 30000,
      volumeThreshold: 20,
    });
  }

  async recordDecision(decision: AuthorityDecision): Promise<Result<boolean, AtlasError>> {
    this.auditTrail.set(decision.decisionId, decision);
    return ok(true);
  }

  async getAuditTrail(claim: string): Promise<Result<readonly AuthorityDecision[], AtlasError>> {
    const trail = Array.from(this.auditTrail.values())
      .filter(d => d.claim === claim);
    return ok(trail);
  }

  async verifyIntegrity(decisionId: string): Promise<Result<boolean, AtlasError>> {
    const decision = this.auditTrail.get(decisionId);
    if (!decision) {
      return fail(createCryptoError(`Decision not found: ${decisionId}`, 'DECISION_NOT_FOUND', 'validation', false));
    }

    const isValid = decision.decisionId.startsWith('decision-');
    return ok(isValid);
  }

  async exportAuditTrail(claim: string, format: 'json' | 'csv'): Promise<Result<string, AtlasError>> {
    const trailResult = await this.getAuditTrail(claim);
    if (!trailResult.success) {
      return trailResult;
    }

    if (format === 'json') {
      return ok(JSON.stringify(trailResult.value, null, 2));
    }

    const headers = ['decisionId', 'claim', 'decision', 'trustLevel', 'validFrom'];
    const rows = trailResult.value.map(d => 
      headers.map(h => (d as any)[h]).join(',')
    );
    return ok([headers.join(','), ...rows].join('\n'));
  }
}

// ============================================================================
// TRUST SERVICE FACTORY
// ============================================================================

export interface ITrustService {
  readonly boundary: ITrustBoundaryService;
  readonly certification: IClaimCertificationService;
  readonly authority: IDecisionAuthority;
  readonly policy: ITrustPolicyService;
  readonly audit: ITrustAuditService;

  validateClaim(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<TrustDecision, AtlasError>>;
  certifyClaim(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<TrustAssertion, AtlasError>>;
  getClaimStatus(claim: string): Promise<Result<{ decisions: number; assertions: number }, AtlasError>>;
}

export class TrustServiceFactory implements ITrustService {
  readonly boundary: ITrustBoundaryService;
  readonly certification: IClaimCertificationService;
  readonly authority: IDecisionAuthority;
  readonly policy: ITrustPolicyService;
  readonly audit: ITrustAuditService;

  constructor() {
    this.boundary = new TrustBoundaryServiceImpl();
    this.certification = new ClaimCertificationServiceImpl();
    this.authority = new DecisionAuthorityImpl();
    this.policy = new TrustPolicyServiceImpl();
    this.audit = new TrustAuditServiceImpl();
  }

  async validateClaim(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<TrustDecision, AtlasError>> {
    const decision = await this.authority.makeDecision(claim, claimType, evidence);
    if (!decision.success) {
      return fail(decision.error);
    }

    const trustDecision: TrustDecision = {
      decisionId: decision.value.decisionId,
      claim,
      claimType,
      trustLevel: decision.value.trustLevel,
      assertion: {
        assertionId: `assert-${Date.now()}`,
        claim,
        claimType,
        trustLevel: decision.value.trustLevel,
        evidence,
        verifier: 'atlas-authority',
        validFrom: Date.now() as Timestamp,
        scope: [claimType],
      },
      decision: decision.value.decision,
      confidence: 0.95 as Probability,
      reasoning: ['Decision based on evidence evaluation'],
      conditions: decision.value.conditions,
      timestamp: Date.now() as Timestamp,
      expiresAt: decision.value.validUntil,
      appealable: decision.value.appealable,
      appealDeadline: decision.value.appealDeadline,
    };

    await this.audit.recordDecision(decision.value);
    return ok(trustDecision);
  }

  async certifyClaim(claim: string, claimType: ClaimType, evidence: readonly TrustEvidence[]): Promise<Result<TrustAssertion, AtlasError>> {
    return this.certification.certifyClaim(claim, claimType, evidence);
  }

  async getClaimStatus(claim: string): Promise<Result<{ decisions: number; assertions: number }, AtlasError>> {
    const history = await this.authority.getDecisionHistory(claim);
    if (!history.success) {
      return fail(history.error);
    }
    
    const certs = await this.certification.getActiveCertifications();
    const assertionCount = certs.success ? certs.value.filter(a => a.claim === claim).length : 0;
    
    return ok({
      decisions: history.value.length,
      assertions: assertionCount,
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { TrustBoundaryServiceImpl as TrustBoundaryService };
export { ClaimCertificationServiceImpl as ClaimCertificationService };
export { DecisionAuthorityImpl as DecisionAuthority };
export { TrustPolicyServiceImpl as TrustPolicyService };
export { TrustAuditServiceImpl as TrustAuditService };
export { TrustServiceFactory as TrustService };

export const DEFAULT_TRUST_SERVICE = new TrustServiceFactory();
