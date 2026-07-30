/**
 * Atlas Sanctum Enhanced Cryptographic Interfaces
 * 
 * Enhanced interfaces for the Chief Cryptographic & Trust Engineer mandate.
 * These interfaces extend the base interfaces with comprehensive cryptographic
 * capabilities including threshold signatures, ZK proofs, MPC, and formal verification.
 * 
 * NOTE: This module contains interface definitions. Implementation classes
 * should be created separately to avoid type conflicts.
 */

import {
  RegenerativeTransaction,
  GeoLocation,
  RegenerativeImpact,
  RegenerativeIntervention,
  RegenerativeAction,
  Result,
  AtlasError,
  Timestamp,
  Probability,
} from './AtlasSanctumTypes';

// ============================================================================
// ENHANCED CRYPTOGRAPHIC SERVICE INTERFACES
// ============================================================================

/**
 * Enhanced cryptographic service interface with comprehensive capabilities
 */
export interface IAtlasCryptographicService {
  // Key Management
  generateKeyPair(keyType: string, purpose: string): Promise<Result<{ privateKey: string; publicKey: string; keyId: string }, AtlasError>>;
  deriveKey(masterKey: string, path: string, purpose: string): Promise<Result<string, AtlasError>>;
  rotateKey(keyId: string): Promise<Result<{ privateKey: string; publicKey: string; newKeyId: string }, AtlasError>>;
  revokeKey(keyId: string, reason: string): Promise<Result<boolean, AtlasError>>;
  getKeyStatus(keyId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  
  // Digital Signatures
  sign(data: string, privateKey: string, algorithm: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  verify(signature: Record<string, unknown>, data: string, publicKey: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  batchVerify(signatures: readonly Record<string, unknown>[], data: readonly string[]): Promise<Result<boolean, AtlasError>>;
  
  // BLS Operations
  blsSign(data: string, privateKey: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  blsVerify(signature: Record<string, unknown>, data: string, publicKey: string): Promise<Result<boolean, AtlasError>>;
  aggregateBLSSignatures(signatures: readonly Record<string, unknown>[]): Promise<Result<Record<string, unknown>, AtlasError>>;
  aggregateBLSPublicKeys(publicKeys: readonly string[]): Promise<Result<string, AtlasError>>;
  verifyBLSAggregationProof(proof: Record<string, unknown>, data: readonly string[]): Promise<Result<boolean, AtlasError>>;
  
  // Threshold Signatures
  generateThresholdKey(threshold: number, totalParties: number): Promise<Result<Record<string, unknown>, AtlasError>>;
  createPartialSignature(share: Record<string, unknown>, message: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  combinePartialSignatures(partials: readonly Record<string, unknown>[], threshold: number): Promise<Result<Record<string, unknown>, AtlasError>>;
  respondToThresholdKeyRefresh(shares: readonly Record<string, unknown>[], newThreshold: number): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
  
  // Zero-Knowledge Proofs
  generateProof(
    circuitId: string,
    publicInputs: readonly string[],
    privateInputs: readonly string[],
    proofSystem?: string
  ): Promise<Result<Record<string, unknown>, AtlasError>>;
  verifyProof(proof: Record<string, unknown>, circuitId: string): Promise<Result<boolean, AtlasError>>;
  batchVerifyProofs(proofs: readonly Record<string, unknown>[], circuitIds: readonly string[]): Promise<Result<boolean, AtlasError>>;
  
  // Commitment Schemes
  createCommitment(value: string, scheme: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  openCommitment(commitment: Record<string, unknown>, value: string, randomness: string): Promise<Result<boolean, AtlasError>>;
  
  // MPC Operations
  createMPCSession(protocol: string, threshold: number, parties: readonly string[]): Promise<Result<Record<string, unknown>, AtlasError>>;
  joinMPCSession(sessionId: string, partyId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  provideMPCInput(sessionId: string, partyId: string, input: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  receiveMPCOutput(sessionId: string, partyId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
}

// ============================================================================
// ENHANCED VERIFIABLE ORACLE INTERFACE
// ============================================================================

/**
 * Enhanced oracle interface with cryptographic attestation and dispute resolution
 */
export interface IVerifiableOracle {
  // Core Data Access
  getData(location: GeoLocation): Promise<Result<Record<string, unknown>, AtlasError>>;
  getHistoricalData(location: GeoLocation, fromTimestamp: Timestamp, toTimestamp: Timestamp): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
  
  // Cryptographic Attestation
  getAttestation(): Promise<Result<Record<string, unknown>, AtlasError>>;
  signData(data: Record<string, unknown>, privateKey: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  verifyAttestation(attestation: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  
  // Identity Management
  getSourceIdentity(): Promise<Result<Record<string, unknown>, AtlasError>>;
  registerOracle(identity: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  rotateOracleIdentity(oracleId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  
  // Dispute Resolution
  openDispute(dataPointId: string, challengerId: string, evidence: readonly Record<string, unknown>[]): Promise<Result<Record<string, unknown>, AtlasError>>;
  respondToDispute(disputeId: string, response: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  resolveDispute(disputeId: string, resolution: string): Promise<Result<boolean, AtlasError>>;
  
  // Metrics and Performance
  getMetrics(): Promise<Result<Record<string, unknown>, AtlasError>>;
  getUptime(): Promise<Result<Probability, AtlasError>>;
  getLatency(): Promise<Result<number, AtlasError>>;
  
  // Health
  getHealth(): Promise<Result<{ status: 'healthy' | 'degraded' | 'unhealthy'; latencyMs: number }, AtlasError>>;
}

// ============================================================================
// ENHANCED LIVING CONTRACT WITH FORMAL VERIFICATION
// ============================================================================

/**
 * Enhanced living contract interface with formal verification support
 */
export interface IVerifiedLivingContract {
  // Core Contract Operations
  execute(data: unknown, oracleData: unknown): Promise<Result<string, AtlasError>>;
  validate(data: unknown): Promise<Result<boolean, AtlasError>>;
  getState(): Promise<Result<Record<string, unknown>, AtlasError>>;
  
  // Formal Verification
  verifyProperties(properties: readonly Record<string, unknown>[]): Promise<Result<Record<string, unknown>, AtlasError>>;
  getInvariantStatus(): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
  checkInvariant(invariantId: string): Promise<Result<boolean, AtlasError>>;
  registerInvariant(invariant: Record<string, unknown>): Promise<Result<Record<string, unknown>, AtlasError>>;
  
  // ZK Proof Generation for State Transitions
  generateStateTransitionProof(
    oldState: Record<string, unknown>,
    newState: Record<string, unknown>,
    inputs: readonly string[],
    circuitId: string
  ): Promise<Result<Record<string, unknown>, AtlasError>>;
  verifyStateTransitionProof(proof: Record<string, unknown>, oldState: Record<string, unknown>, newState: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  
  // Contract Specification and Verification
  getSpecification(): Promise<Result<Record<string, unknown>, AtlasError>>;
  verifySpecification(spec: Record<string, unknown>): Promise<Result<Record<string, unknown>, AtlasError>>;
  
  // Violation Handling
  onInvariantViolation(violation: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  getViolationHistory(): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
}

// ============================================================================
// TRUST ENFORCED SECURITY INTERFACE
// ============================================================================

/**
 * Trust enforced security interface with boundary validation
 */
export interface ITrustEnforcedSecurity {
  // Core Security
  secureTransaction(tx: RegenerativeAction): Promise<Result<{ txId: string; trustLevel: string }, AtlasError>>;
  detectManipulation(data: unknown): Promise<Result<{ detected: boolean; riskScore: Probability; details: Record<string, unknown> }, AtlasError>>;
  authenticate(credentials: unknown): Promise<Result<{ token: string; trustLevel: string }, AtlasError>>;
  authorize(token: string, permission: string): Promise<Result<{ authorized: boolean; trustLevel: string }, AtlasError>>;
  
  // Trust Boundary Methods
  validateClaim(claim: string, evidence: readonly Record<string, unknown>[]): Promise<Result<Record<string, unknown>, AtlasError>>;
  certifyClaim(claim: string, claimType: string, evidence: readonly Record<string, unknown>[]): Promise<Result<Record<string, unknown>, AtlasError>>;
  enforceBoundary(claim: string, boundary: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  getClaimStatus(claim: string): Promise<Result<{ trustLevel: string; assertions: number; decisions: number }, AtlasError>>;
  
  // Audit Trail
  auditTrustDecision(decisionId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  getAuditTrail(claim: string, fromTimestamp?: Timestamp, toTimestamp?: Timestamp): Promise<Result<readonly Record<string, unknown>[], AtlasError>>;
  exportAuditLog(claim: string, format: 'json' | 'csv'): Promise<Result<string, AtlasError>>;
  
  // Policy Management
  getActivePolicy(): Promise<Result<Record<string, unknown>, AtlasError>>;
  evaluatePolicyCompliance(claim: string, category: string): Promise<Result<{ compliant: boolean; violations: readonly string[] }, AtlasError>>;
}

// ============================================================================
// POST-QUANTUM CRYPTOGRAPHY INTERFACE
// ============================================================================

/**
 * Post-quantum cryptographic service interface
 */
export interface IPostQuantumCryptographicService {
  // Key Generation
  generateMLDSAKeyPair(securityLevel: 2 | 3 | 5): Promise<Result<{ publicKey: string; privateKey: string }, AtlasError>>;
  generateSPHINCSKeyPair(securityLevel: 2 | 3 | 5): Promise<Result<{ publicKey: string; privateKey: string }, AtlasError>>;
  
  // Signing
  signMLDSA(message: string, privateKey: string): Promise<Result<string, AtlasError>>;
  signSPHINCS(message: string, privateKey: string): Promise<Result<string, AtlasError>>;
  
  // Verification
  verifyMLDSA(message: string, signature: string, publicKey: string): Promise<Result<boolean, AtlasError>>;
  verifySPHINCS(message: string, signature: string, publicKey: string): Promise<Result<boolean, AtlasError>>;
  
  // Hybrid Operations
  hybridSign(message: string, classicPrivateKey: string, pqPrivateKey: string): Promise<Result<{ classicSig: Record<string, unknown>; pqSig: string }, AtlasError>>;
  hybridVerify(message: string, classicSig: Record<string, unknown>, pqSig: string, classicPublicKey: string, pqPublicKey: string): Promise<Result<boolean, AtlasError>>;
}

// ============================================================================
// MULTI-PARTY COMPUTATION COORDINATOR
// ============================================================================

/**
 * MPC Coordinator interface for distributed key operations
 */
export interface IMPCCoordinator {
  // Session Management
  createSession(protocol: string, threshold: number, partyIds: readonly string[]): Promise<Result<{ sessionId: string; coordinatorKey: string }, AtlasError>>;
  joinSession(sessionId: string, partyId: string): Promise<Result<{ joined: boolean; partyKey: string }, AtlasError>>;
  leaveSession(sessionId: string, partyId: string): Promise<Result<boolean, AtlasError>>;
  terminateSession(sessionId: string): Promise<Result<boolean, AtlasError>>;
  
  // Key Generation
  initiateKeyGen(sessionId: string, keyType: string): Promise<Result<{ round: number; totalRounds: number }, AtlasError>>;
  submitKeyGenShare(sessionId: string, partyId: string, share: string): Promise<Result<boolean, AtlasError>>;
  completeKeyGen(sessionId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  
  // Signing Operations
  initiateSigning(sessionId: string, message: string): Promise<Result<{ round: number; totalRounds: number }, AtlasError>>;
  submitPartialSignature(sessionId: string, partyId: string, partialSig: string): Promise<Result<boolean, AtlasError>>;
  completeSigning(sessionId: string): Promise<Result<{ signature: Record<string, unknown>; signers: readonly string[] }, AtlasError>>;
  
  // Resharing
  initiateReshare(sessionId: string, newThreshold: number, newParties: readonly string[]): Promise<Result<Record<string, unknown>, AtlasError>>;
  completeReshare(sessionId: string): Promise<Result<boolean, AtlasError>>;
}

// ============================================================================
// PROOF REGISTRY SERVICE
// ============================================================================

/**
 * Proof Registry interface for tracking verified proofs
 */
export interface IProofRegistry {
  // Registration
  registerProof(proof: Record<string, unknown>, circuitId: string, metadata: Record<string, unknown>): Promise<Result<{ proofId: string; registeredAt: Timestamp }, AtlasError>>;
  registerVerificationKey(circuitId: string, vk: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  registerProvingKey(circuitId: string, pk: Record<string, unknown>): Promise<Result<boolean, AtlasError>>;
  
  // Verification
  verifyProofRegistration(proofId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  verifyProofWithVK(proof: Record<string, unknown>, circuitId: string): Promise<Result<boolean, AtlasError>>;
  
  // Retrieval
  getProof(proofId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  getVerificationKey(circuitId: string): Promise<Result<Record<string, unknown>, AtlasError>>;
  getProofsByCircuit(circuitId: string): Promise<Result<readonly { proofId: string; registeredAt: Timestamp }[], AtlasError>>;
  
  // Revocation
  revokeProof(proofId: string, reason: string): Promise<Result<boolean, AtlasError>>;
  revokeCircuit(circuitId: string, reason: string): Promise<Result<boolean, AtlasError>>;
}

// ============================================================================
// TYPE ALIASES FOR BACKWARD COMPATIBILITY
// ============================================================================

/**
 * Type alias for enhanced cryptographic operations result
 */
export type CryptoOperationResult<T = void> = 
  T extends void 
    ? Result<boolean, AtlasError>
    : Result<T, AtlasError>;

// ============================================================================
// INTERFACE AGGREGATION FOR EASY IMPORT
// ============================================================================

export type {
  IAtlasCryptographicService,
  IVerifiableOracle,
  IVerifiedLivingContract,
  ITrustEnforcedSecurity,
  IPostQuantumCryptographicService,
  IMPCCoordinator,
  IProofRegistry,
};

// ============================================================================
// DOCUMENTATION
// ============================================================================

/**
 * Atlas Sanctum Enhanced Interfaces
 * 
 * This module provides enhanced interfaces that extend the base cryptographic
 * capabilities with:
 * 
 * - **IAtlasCryptographicService**: Comprehensive crypto operations including
 *   key management, signatures (ECDSA, EdDSA, BLS), threshold signatures,
 *   ZK proofs, commitments, and MPC operations.
 * 
 * - **IVerifiableOracle**: Oracle with cryptographic attestation,
 *   identity management, and dispute resolution.
 * 
 * - **IVerifiedLivingContract**: Smart contracts with formal verification,
 *   invariant checking, and ZK proof generation.
 * 
 * - **ITrustEnforcedSecurity**: Security layer with trust boundary
 *   enforcement, claim certification, and audit trails.
 * 
 * - **IPostQuantumCryptographicService**: Post-quantum algorithms
 *   (ML-DSA, SPHINCS+) for quantum resistance.
 * 
 * - **IMPCCoordinator**: Multi-party computation coordination for
 *   distributed key generation and signing.
 * 
 * - **IProofRegistry**: Registry for tracking verified ZK proofs
 *   and their metadata.
 * 
 * Usage:
 * ```typescript
 * import { IAtlasCryptographicService, IVerifiableOracle } from './AtlasSanctumEnhancedInterfaces';
 * 
 * class MyCryptoService implements IAtlasCryptographicService {
 *   async sign(data: string, privateKey: string, algorithm: string) {
 *     // Implementation
 *   }
 * }
 * ```
 */
