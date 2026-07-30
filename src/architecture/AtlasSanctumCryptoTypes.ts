/**
 * Atlas Sanctum Cryptographic Primitives & Types
 * 
 * Comprehensive type definitions for cryptographic operations supporting
 * the Chief Cryptographic & Trust Engineer mandate.
 * 
 * This module establishes:
 * - Zero-knowledge proof types and circuits
 * - Multi-party computation protocols
 * - Digital signature schemes (BLS, threshold, post-quantum)
 * - Oracle integrity architecture
 * - Formal verification components
 * - Trust boundary and decision authority mechanisms
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  Timestamp,
  Probability,
  GeoLocation,
  ErrorCategory,
} from './AtlasSanctumTypes';

// ============================================================================
// CRYPTOGRAPHIC IDENTIFIERS
// ============================================================================

export type PrivateKey = string & { readonly __brand: unique symbol };
export type PublicKey = string & { readonly __brand: unique symbol };
export type KeyId = string & { readonly __brand: unique symbol };
export type KeyPurpose = 'signing' | 'encryption' | 'key_agreement' | 'commitment';

export type KeyType = 
  | 'secp256k1'      // Bitcoin/Ethereum signatures
  | 'ed25519'        // High-performance signatures
  | 'bls12-381'      // BLS aggregation
  | 'rsa2048'        // Legacy compatibility
  | 'mlkem768'       // Post-quantum KEM
  | 'mldsa44'       // Post-quantum signatures
  | 'rainbow'        // Multivariate signatures
  | 'threshold'      // Threshold key shares
  | 'dh'             // Diffie-Hellman
  | 'ecdsa'          // ECDSA
  | 'schnorr';      // Schnorr signatures

export type KeyStatus = 'active' | 'rotated' | 'revoked' | 'expired' | 'compromised';

// ============================================================================
// KEY MANAGEMENT TYPES
// ============================================================================

export interface KeyMetadata {
  readonly keyId: KeyId;
  readonly keyType: KeyType;
  readonly purpose: KeyPurpose;
  readonly createdAt: Timestamp;
  readonly expiresAt?: Timestamp;
  readonly status: KeyStatus;
  readonly rotationPolicy?: RotationPolicy;
  readonly hardwareModule?: string;
  readonly mfaRequired: boolean;
}

export interface RotationPolicy {
  readonly automatic: boolean;
  readonly intervalDays: number;
  readonly notifyBeforeDays: number;
  readonly emergencyRotation: boolean;
}

export interface KeyMaterial {
  readonly keyId: KeyId;
  readonly encryptedPrivateKey: string; // Encrypted with master key
  readonly publicKey: PublicKey;
  readonly keyType: KeyType;
  readonly purpose: KeyPurpose;
  readonly metadata: KeyMetadata;
}

export interface KeyDerivationPath {
  readonly purpose: number;
  readonly coin: number;
  readonly account: number;
  readonly change: number;
  readonly address: number;
}

export interface MasterKey {
  readonly id: KeyId;
  readonly encryptedMasterKey: string;
  readonly backupPhrase?: string; // BIP-39 mnemonic
  readonly backupVerified: boolean;
  readonly createdAt: Timestamp;
  readonly lastUsedAt?: Timestamp;
}

// ============================================================================
// DIGITAL SIGNATURE TYPES
// ============================================================================

export interface CryptoSignature {
  readonly algorithm: KeyType;
  readonly r: string; // DER encoding or compact
  readonly s?: string;
  readonly recovery?: number; // For recoverable signatures
  readonly publicKey: PublicKey;
  readonly timestamp: Timestamp;
  readonly domain?: string; // Context for domain separation
}

// Backward compatibility alias
export type Signature = CryptoSignature;

export interface SignatureSet {
  readonly signatures: readonly CryptoSignature[];
  readonly threshold: number;
  readonly totalSigners: number;
  readonly combinedSignature?: string; // Aggregated signature
}

export type SignatureStatus = 'valid' | 'invalid' | 'expired' | 'revoked' | 'unknown';

export interface SignatureVerificationResult {
  readonly valid: boolean;
  readonly status: SignatureStatus;
  readonly confidence: Probability;
  readonly signers: readonly {
    readonly publicKey: PublicKey;
    readonly valid: boolean;
  }[];
  readonly requiresReview: boolean;
  readonly discrepancies?: readonly string[];
}

// ============================================================================
// BLS SIGNATURE TYPES (Boneh-Lynn-Shacham)
// ============================================================================

export interface BLSKeyPair {
  readonly privateKey: PrivateKey;
  readonly publicKey: PublicKey;
  readonly keyId: KeyId;
  readonly threshold: number;
  readonly participants: readonly PublicKey[];
}

export interface BLSSignature {
  readonly signature: string; // G1 point compressed
  readonly publicKey: PublicKey; // G2 point compressed
  readonly domain: string;
}

export interface BLSAggregationProof {
  readonly aggregatedSignature: string;
  readonly bitmap: string; // Which signers participated
  readonly publicKey: PublicKey;
  readonly message: string;
  readonly participants: readonly PublicKey[];
}

export interface BLSSchemeParams {
  readonly curve: 'BLS12-381' | 'BLS12-377' | 'BW6-761';
  readonly hash: 'SHA-256' | 'SHA-512' | 'Keccak256';
  readonly g1Compress: boolean;
  readonly signatureSuite: 'basic' | 'aug' | 'proof-of-possession';
}

// ============================================================================
// THRESHOLD SIGNATURE TYPES
// ============================================================================

export interface ThresholdKeyShare {
  readonly shareIndex: number;
  readonly shareValue: string;
  readonly publicKey: PublicKey;
  readonly threshold: number;
  readonly totalShares: number;
  readonly commitments: readonly string[]; // Pedersen commitments
}

export interface ThresholdSignatureRequest {
  readonly keyId: KeyId;
  readonly message: string;
  readonly threshold: number;
  readonly signers: readonly number[]; // Share indices
}

export interface ThresholdSignaturePartial {
  readonly signerIndex: number;
  readonly partialSignature: string;
  readonly message: string;
  readonly publicKey: PublicKey;
}

export interface ThresholdSignatureComplete {
  readonly signature: Signature;
  readonly signers: readonly number[];
  readonly threshold: number;
  readonly combinedPublicKey: PublicKey;
}

export interface ThresholdKeyGeneration {
  readonly keyId: KeyId;
  readonly shares: readonly ThresholdKeyShare[];
  readonly combinedPublicKey: PublicKey;
  readonly verificationKey: string;
  readonly participants: readonly string[];
  readonly round: number;
}

// ============================================================================
// POST-QUANTUM CRYPTOGRAPHY TYPES
// ============================================================================

export type PQCAlgorithm = 
  | 'CRYSTALS-Dilithium'  // ML-DSA
  | 'CRYSTALS-Kyber'      // ML-KEM
  | 'SPHINCS+'            // Stateless hash-based signatures
  | 'FALCON'              // FFT-based signatures
  | 'Rainbow'             // Multivariate
  | 'NTRU'                // Lattice-based
  | 'BIKE'                // Code-based KEM
  | 'Classic McEliece';    // Code-based encryption

export interface PQPublicKey {
  readonly algorithm: PQCAlgorithm;
  readonly key: string; // Compressed/formatted key
  readonly keyId: KeyId;
  readonly securityLevel: 1 | 3 | 5; // NIST levels
}

export interface PQPrivateKey {
  readonly algorithm: PQCAlgorithm;
  readonly key: string; // Encrypted seed + expanded key
  readonly keyId: KeyId;
  readonly seed?: string;
  readonly expanded: boolean;
}

export interface PQSignature {
  readonly algorithm: PQCAlgorithm;
  readonly signature: string;
  readonly publicKey: PublicKey;
  readonly context?: string;
}

export interface PQCKeyExchange {
  readonly clientPublicKey: string;
  readonly serverPublicKey: string;
  readonly sharedSecret: string;
  readonly ciphertext: string;
}

// ============================================================================
// ZERO-KNOWLEDGE PROOF TYPES
// ============================================================================

export type ZKProofSystem = 
  | 'Groth16'
  | 'PLONK'
  | 'PLONKup'
  | 'Sonic'
  | 'Marlin'
  | 'Halo'
  | 'Halo2'
  | 'Nova'
  | 'Sangria'
  | 'Kimchi'
  | 'SnarkJS'
  | 'Circom';

export type ZKStatement = 
  | 'range_proof'
  | 'membership_proof'
  | 'non_membership_proof'
  | 'set_membership'
  | 'arithmetic_circuit'
  | 'boolean_circuit'
  | 'knowledge_of_discrete_log'
  | 'committed_value'
  | 'encrypted_balance'
  | 'age_verification'
  | 'location_proof'
  | 'impact_verification'
  | 'credential_proof';

export interface ZKProof {
  readonly proofId: string;
  readonly system: ZKProofSystem;
  readonly statement: ZKStatement;
  readonly proof: string; // Serialized proof
  readonly publicInputs: readonly string[];
  readonly provingKeyHash: string;
  readonly verificationKeyHash: string;
  readonly createdAt: Timestamp;
  readonly expiresAt?: Timestamp;
  readonly context: ZKProofContext;
}

export interface ZKProofContext {
  readonly circuitId: string;
  readonly protocolVersion: string;
  readonly maxProofSize: number;
  readonly trustedSetup?: ' PowersOfTau' | 'PerpetualPowersOfTau' | 'Transparent' | 'Universal';
  readonly constraints: number;
  readonly variables: number;
  readonly gates: number;
}

export interface ZKProvingKey {
  readonly keyId: KeyId;
  readonly system: ZKProofSystem;
  readonly circuitId: string;
  readonly key: string;
  readonly hash: string;
  readonly constraints: number;
  readonly createdAt: Timestamp;
}

export interface ZKVerificationKey {
  readonly keyId: KeyId;
  readonly system: ZKProofSystem;
  readonly circuitId: string;
  readonly key: string;
  readonly hash: string;
  readonly verificationHash: string;
  readonly createdAt: Timestamp;
}

export interface ZKProofVerificationResult {
  readonly valid: boolean;
  readonly trustedSetupVerified: boolean;
  readonly proofSystem: ZKProofSystem;
  readonly verificationTime: number;
  readonly confidence: Probability;
  readonly requiresRecomputation: boolean;
  readonly warnings?: readonly string[];
}

export interface ZKProofRequest {
  readonly circuitId: string;
  readonly statement: ZKStatement;
  readonly publicInputs: readonly string[];
  readonly privateInputs: readonly string[]; // Witness
  readonly proofSystem: ZKProofSystem;
  readonly timeout?: number;
}

// ============================================================================
// COMMITMENT SCHEME TYPES
// ============================================================================

export type CommitmentScheme = 
  | 'Pedersen'
  | 'Kate'                // Polynomial commitments
  | 'DARK'               // Discrete-log arithmetic
  | 'Bulletproofs'      // Range proofs
  | 'IPA'               // Inner product arguments
  | 'KZG';              // Kate-Zaverucha-Goldberg

export interface Commitment {
  readonly scheme: CommitmentScheme;
  readonly value: string; // Compressed commitment
  readonly randomness: string; // Blinding factor
  readonly depth?: number; // For Merkle tree commitments
  readonly leafIndex?: number;
}

export interface CommitmentProof {
  readonly commitment: Commitment;
  readonly proof: string;
  readonly path: readonly string[]; // Merkle path
  readonly root: string;
  readonly leafIndex: number;
  readonly siblingIndices: readonly number[];
}

export interface CommitmentOpening {
  readonly value: string;
  readonly randomness: string;
  readonly commitment: Commitment;
  readonly metadata?: Record<string, unknown>;
}

// ============================================================================
// MERKLE TREE TYPES
// ============================================================================

export interface MerkleProof {
  readonly root: string;
  readonly leaf: string;
  readonly path: readonly string[];
  readonly depth: number;
  readonly algorithm: 'SHA-256' | 'SHA-3' | 'Poseidon' | 'Keccak256';
  readonly leavesCount: number;
}

export interface MerkleTree {
  readonly id: string;
  readonly root: string;
  readonly depth: number;
  readonly leavesCount: number;
  readonly algorithm: string;
  readonly createdAt: Timestamp;
  readonly lastUpdated: Timestamp;
}

export interface SparseMerkleTree {
  readonly treeId: string;
  readonly root: string;
  readonly depth: number;
  readonly zeroValue: string;
  readonly defaultValue: string;
  readonly createdAt: Timestamp;
}

export interface MerkleUpdate {
  readonly treeId: string;
  readonly leafIndex: number;
  readonly leafValue: string;
  readonly oldProof?: MerkleProof;
  readonly newProof: MerkleProof;
  readonly witnesses: readonly string[];
}

// ============================================================================
// MULTI-PARTY COMPUTATION TYPES
// ============================================================================

export type MPCProtocol = 
  | 'ShamirSecretSharing'    // SSS
  | 'BGW'                    // Ben-Or-Goldwasser-Wigderson
  | 'GMW'                    // Goldreich-Micali-Wigderson
  | 'SPDZ'                   // Speedz
  | 'MASCOT'                 // Oblivious transfer based
  | 'TinyOT'                 // Optimized OT
  | 'ABY'                    // Arithmetic/Boolean/Yao
  | 'Bristol'                // Secure computation
  | 'Falcon'                // Lattice-based MPC
  | 'FHE'                   // Fully homomorphic encryption
  | 'Threshold';            // Threshold signatures

export interface MPCSession {
  readonly sessionId: string;
  readonly protocol: MPCProtocol;
  parties: MPCParty[];
  readonly threshold: number;
  readonly totalParties: number;
  status: 'initializing' | 'ready' | 'computing' | 'completed' | 'failed';
  readonly createdAt: Timestamp;
  completedAt?: Timestamp;
  readonly metadata?: MPCSessionMetadata;
}

export interface MPCParty {
  readonly partyId: string;
  readonly endpoint: string;
  readonly publicKey: PublicKey;
  readonly status: 'connected' | 'disconnected' | 'ready';
  readonly shares: readonly string[];
  readonly contribution?: string;
}

export interface MPCSessionMetadata {
  readonly computationType: string;
  readonly inputFormat: string;
  readonly outputFormat: string;
  readonly securityModel: 'semi-honest' | 'malicious';
  readonly communicationComplexity: string;
  readonly computationComplexity: string;
}

export interface MPCInput {
  readonly partyId: string;
  readonly encryptedShares: readonly string[];
  readonly commitmentProofs: readonly string[];
  readonly macs: readonly string[]; // Message authentication codes
}

export interface MPCOutput {
  readonly shares: readonly string[];
  readonly reconstructedValue: string;
  readonly verificationProof: string;
  readonly partialResults: readonly {
    readonly partyId: string;
    readonly partial: string;
  }[];
}

export interface MPCKeyGeneration {
  readonly sessionId: string;
  readonly keyId: KeyId;
  readonly shares: readonly string[];
  readonly verificationShares: readonly string[];
  readonly publicKey: PublicKey;
  readonly degree: number;
  readonly commitments: readonly string[];
}

export interface MPCComputation {
  readonly sessionId: string;
  readonly circuit: string;
  readonly inputs: readonly MPCInput[];
  readonly outputs: MPCOutput;
  readonly proof: string; // Zero-knowledge proof of correctness
}

// ============================================================================
// HASH AND DERIVATION TYPES
// ============================================================================

export type HashAlgorithm = 
  | 'SHA-256'
  | 'SHA-384'
  | 'SHA-512'
  | 'SHA3-256'
  | 'SHA3-384'
  | 'SHA3-512'
  | 'BLAKE2b'
  | 'BLAKE2s'
  | 'Keccak256'
  | 'Poseidon'
  | 'MiMC'
  | 'Rescue'
  | 'Pedersen';

export interface HashResult {
  readonly algorithm: HashAlgorithm;
  readonly hash: string;
  readonly length: number;
  readonly timestamp: Timestamp;
}

export interface KeyDerivation {
  readonly masterKey: string;
  readonly purpose: number;
  readonly coin: number;
  readonly account: number;
  readonly chain: number;
  readonly index: number;
  readonly derivedKey: string;
  readonly path: string;
}

export interface HDKey {
  readonly keyId: KeyId;
  readonly masterFingerprint: string;
  readonly path: string;
  readonly privateKey: PrivateKey;
  readonly publicKey: PublicKey;
  readonly chainCode: string;
  readonly depth: number;
  readonly parentFingerprint: string;
  readonly childNumber: number;
}

// ============================================================================
// ENCRYPTION TYPES
// ============================================================================

export type EncryptionScheme = 
  | 'AES-256-GCM'
  | 'AES-256-CBC'
  | 'ChaCha20-Poly1305'
  | 'XChaCha20-Poly1305'
  | 'ECIES'
  | 'ElGamal'
  | 'Paillier'
  | 'ThresholdEncryption'
  | 'ProxyRe-Encryption';

export interface EncryptedData {
  readonly scheme: EncryptionScheme;
  readonly ciphertext: string;
  readonly iv?: string; // Initialization vector
  readonly authTag?: string; // Authentication tag
  readonly publicKey?: PublicKey; // For ECIES
  readonly algorithm: string;
  readonly keyId: KeyId;
}

export interface EncryptionKey {
  readonly keyId: KeyId;
  readonly algorithm: EncryptionScheme;
  readonly encryptedKey: string;
  readonly publicKey: PublicKey;
  readonly keyWrappingKey: string;
}

export interface KeyExchangeResult {
  readonly sharedSecret: string;
  readonly derivedKey: string;
  readonly ephemeralPublicKey: string;
  readonly nonce: string;
}

// ============================================================================
// AUDIT AND PROOF TYPES
// ============================================================================

export interface CryptographicAuditEntry {
  readonly entryId: string;
  readonly timestamp: Timestamp;
  readonly operation: CryptographicOperation;
  readonly keyId: KeyId;
  readonly keyType: KeyType;
  readonly algorithm: string;
  readonly result: 'success' | 'failure';
  readonly inputHash: string; // Hash of operation inputs
  readonly outputHash?: string; // Hash of operation outputs
  readonly party?: string;
  readonly metadata?: Record<string, unknown>;
  readonly signature?: string;
}

export type CryptographicOperation = 
  | 'sign' | 'verify' | 'encrypt' | 'decrypt' | 'key_generation'
  | 'key_derivation' | 'key_rotation' | 'key_revocation'
  | 'proof_generation' | 'proof_verification'
  | 'commitment' | 'opening'
  | 'mpc_share' | 'mpc_reconstruct'
  | 'threshold_sign' | 'aggregate_sign';

export interface AuditTrail {
  readonly entries: readonly CryptographicAuditEntry[];
  readonly merkleRoot: string;
  readonly totalEntries: number;
  readonly lastUpdated: Timestamp;
  readonly signature: string;
}

// ============================================================================
// TRUST BOUNDARY TYPES
// ============================================================================

export type TrustLevel = 
  | 'untrusted'     // No verification
  | 'low'           // Basic validation
  | 'medium'        // Cryptographic verification
  | 'high'          // Multi-source confirmation
  | 'verified'      // Formal verification
  | 'certified';    // Third-party certification

export type ClaimType = 
  | 'impact_claim'
  | 'credential_claim'
  | 'identity_claim'
  | 'location_claim'
  | 'timestamp_claim'
  | 'ownership_claim'
  | 'compliance_claim'
  | 'security_claim';

export interface TrustAssertion {
  readonly assertionId: string;
  readonly claim: string;
  readonly claimType: ClaimType;
  readonly trustLevel: TrustLevel;
  readonly evidence: readonly TrustEvidence[];
  readonly verifier: string;
  readonly validFrom: Timestamp;
  readonly validUntil?: Timestamp;
  readonly scope: readonly string[];
  readonly revocation?: RevocationRecord;
}

export interface TrustEvidence {
  readonly type: 'signature' | 'proof' | 'attestation' | 'oracle' | 'consensus';
  readonly source: string;
  readonly value: string;
  readonly timestamp: Timestamp;
  readonly confidence: Probability;
}

export interface RevocationRecord {
  readonly reason: 'compromised' | 'expired' | 'superseeded' | 'revoked';
  readonly timestamp: Timestamp;
  readonly authority: string;
  readonly evidence?: string;
}

export interface TrustBoundary {
  readonly boundaryId: string;
  readonly name: string;
  readonly description: string;
  readonly requiredTrustLevel: TrustLevel;
  readonly allowedClaimTypes: readonly ClaimType[];
  readonly verifiers: readonly string[];
  readonly enforcementPolicy: EnforcementPolicy;
  readonly exemptions: readonly string[];
}

export interface EnforcementPolicy {
  readonly mode: 'allow' | 'deny' | 'conditional';
  readonly conditions?: readonly string[];
  readonly fallback?: string;
  readonly appealProcess?: string;
  readonly timeoutMs: number;
}

export interface TrustDecision {
  readonly decisionId: string;
  readonly claim: string;
  readonly claimType: ClaimType;
  readonly trustLevel: TrustLevel;
  readonly assertion: TrustAssertion;
  readonly decision: 'approved' | 'rejected' | 'conditional';
  readonly confidence: Probability;
  readonly reasoning: readonly string[];
  readonly conditions?: readonly string[];
  readonly timestamp: Timestamp;
  readonly expiresAt?: Timestamp;
  readonly appealable: boolean;
  readonly appealDeadline?: Timestamp;
}

// ============================================================================
// ORACLE INTEGRITY TYPES
// ============================================================================

export interface OracleAttestation {
  readonly attestationId: string;
  readonly oracleId: string;
  readonly dataSource: string;
  readonly data: string; // Hashed data
  readonly timestamp: Timestamp;
  readonly signature: string;
  readonly publicKey: PublicKey;
  readonly chainOfTrust: readonly string[];
  readonly confidence: Probability;
}

export interface OracleReport {
  readonly reportId: string;
  readonly oracleId: string;
  readonly timestamp: Timestamp;
  readonly dataPoints: readonly OracleDataPoint[];
  readonly aggregation: string;
  readonly metadata: Record<string, unknown>;
  readonly commitment: Commitment;
  readonly proof: MerkleProof;
}

export interface OracleDataPoint {
  readonly pointId: string;
  readonly type: string;
  readonly value: string;
  readonly unit: string;
  readonly timestamp: Timestamp;
  readonly location?: GeoLocation;
  readonly confidence: Probability;
  readonly source: string;
  readonly signature: string;
  readonly sequenceNumber: number;
}

export interface OracleDiscrepancy {
  readonly discrepancyId: string;
  readonly oracleIds: readonly string[];
  readonly expectedValue: string;
  readonly actualValues: readonly {
    readonly oracleId: string;
    readonly value: string;
    readonly deviation: number;
  }[];
  readonly tolerance: number;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly resolution: string;
}

// ============================================================================
// FORMAL VERIFICATION TYPES
// ============================================================================

export interface FormalVerificationClaim {
  readonly claimId: string;
  readonly property: string;
  readonly specification: string;
  readonly language: 'TLA+' | 'Coq' | 'Isabelle' | 'Lean' | 'F*' | 'K' | 'IVy';
  readonly theorem: string;
  readonly proof?: string;
  readonly status: 'unverified' | 'verified' | 'failed' | 'timeout';
  readonly verifier: string;
  readonly verifiedAt?: Timestamp;
  readonly assumptions: readonly string[];
  readonly dependencies: readonly string[];
}

export interface ProtocolVerification {
  readonly protocolId: string;
  readonly name: string;
  readonly specification: string;
  readonly properties: readonly FormalVerificationClaim[];
  readonly model: string;
  readonly verificationResult: VerificationResultType;
  readonly counterexample?: string;
  readonly coverage: Probability;
}

export type VerificationResultType = 
  | 'verified'           // All properties hold
  | 'partially_verified'  // Some properties hold
  | 'failed'              // Counterexample found
  | 'inconclusive'       // Timeout or resource limits
  | 'unknown';           // Not verified

export interface InvariantAssertion {
  readonly invariantId: string;
  readonly description: string;
  readonly formula: string;
  readonly scope: string; // Contract/function/module
  readonly verified: boolean;
  readonly verificationMethod: 'symbolic' | 'model_checking' | 'theorem_proving' | 'testing';
  readonly lastVerified: Timestamp;
  readonly failures: number;
}

export interface ContractSpecification {
  readonly contractId: string;
  readonly preconditions: readonly string[];
  readonly postconditions: readonly string[];
  readonly invariants: readonly string[];
  readonly permissions: readonly string[];
  readonly obligations: readonly string[];
}

// ============================================================================
// ERROR CODES
// ============================================================================

export const CryptoErrorCodes = {
  INVALID_SIGNATURE: 'CRYPTO_INVALID_SIGNATURE',
  KEY_NOT_FOUND: 'CRYPTO_KEY_NOT_FOUND',
  KEY_EXPIRED: 'CRYPTO_KEY_EXPIRED',
  KEY_REVOKED: 'CRYPTO_KEY_REVOKED',
  VERIFICATION_FAILED: 'CRYPTO_VERIFICATION_FAILED',
  PROOF_INVALID: 'CRYPTO_PROOF_INVALID',
  PROOF_EXPIRED: 'CRYPTO_PROOF_EXPIRED',
  COMMITMENT_MISMATCH: 'CRYPTO_COMMITMENT_MISMATCH',
  THRESHOLD_NOT_MET: 'CRYPTO_THRESHOLD_NOT_MET',
  MPC_PARTY_DISCONNECTED: 'CRYPTO_MPC_PARTY_DISCONNECTED',
  ENCRYPTION_FAILED: 'CRYPTO_ENCRYPTION_FAILED',
  DECRYPTION_FAILED: 'CRYPTO_DECRYPTION_FAILED',
  TRUST_BOUNDARY_VIOLATION: 'CRYPTO_TRUST_BOUNDARY_VIOLATION',
  ORACLE_DISCREPANCY: 'CRYPTO_ORACLE_DISCREPANCY',
  POST_QUANTUM_MIGRATION: 'CRYPTO_POST_QUANTUM_MIGRATION',
  ZK_CIRCUIT_ERROR: 'CRYPTO_ZK_CIRCUIT_ERROR',
} as const;

// ============================================================================
// TYPE UTILITIES
// ============================================================================

export type CryptographicResult<T> = Result<T, AtlasError>;

export function createCryptoError(
  message: string,
  code: string = 'CRYPTO_ERROR',
  category: string = 'security',
  recoverable: boolean = false
): AtlasError {
  return new AtlasError(message, code, category as ErrorCategory, recoverable);
}
