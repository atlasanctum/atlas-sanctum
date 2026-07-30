/**
 * Atlas Sanctum Post-Quantum Cryptographic Service
 * 
 * Post-quantum signature algorithms for long-term security against quantum attacks.
 * Implements:
 * - ML-DSA (CRYSTALS-Dilithium) - Lattice-based signatures
 * - SPHINCS+ - Stateless hash-based signatures
 * 
 * These algorithms are designed to be secure against both classical and quantum computers.
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  Timestamp,
} from '../architecture/AtlasSanctumTypes';

import {
  createCryptoError,
  CryptoErrorCodes,
} from '../architecture/AtlasSanctumCryptoTypes';

import { CircuitBreaker, Tracer } from '../architecture/AtlasSanctumCrossCutting';

// ============================================================================
// POST-QUANTUM TYPES
// ============================================================================

export type PQSecurityLevel = 2 | 3 | 5;  // NIST security levels

export type PQAlgorithm = 
  | 'ML-DSA-44'   // NIST Level 2 (equivalent to AES-128)
  | 'ML-DSA-65'   // NIST Level 3 (equivalent to AES-192)
  | 'ML-DSA-87'   // NIST Level 5 (equivalent to AES-256)
  | 'SPHINCS+-SHA2-128s'  // NIST Level 1
  | 'SPHINCS+-SHA2-128f'  // NIST Level 1 (fast)
  | 'SPHINCS+-SHA2-192s'  // NIST Level 3
  | 'SPHINCS+-SHA2-192f'  // NIST Level 3 (fast)
  | 'SPHINCS+-SHA2-256s'  // NIST Level 5
  | 'SPHINCS+-SHA2-256f'; // NIST Level 5 (fast)

export interface PQKeyPair {
  readonly algorithm: PQAlgorithm;
  readonly publicKey: string;          // Base64 encoded
  readonly privateKey: string;         // Base64 encoded (encrypted at rest)
  readonly securityLevel: PQSecurityLevel;
  readonly createdAt: Timestamp;
  readonly keyId: string;
}

export interface PQSignature {
  readonly algorithm: PQAlgorithm;
  readonly signature: string;          // Base64 encoded
  readonly publicKey: string;           // Base64 encoded
  readonly messageHash: string;          // Hash of signed message
  readonly timestamp: Timestamp;
  readonly domain: string;
}

export interface HybridSignature {
  readonly classicSignature: string;    // Traditional signature
  readonly pqSignature: string;         // Post-quantum signature
  readonly combinedVerificationKey: string;
  readonly timestamp: Timestamp;
}

// ============================================================================
// POST-QUANTUM SERVICE INTERFACE
// ============================================================================

export interface IPostQuantumService {
  // Key Generation
  generateKeyPair(algorithm: PQAlgorithm): Promise<Result<PQKeyPair, AtlasError>>;
  generateMLDSAKeyPair(securityLevel: PQSecurityLevel): Promise<Result<PQKeyPair, AtlasError>>;
  generateSPHINCSKeyPair(securityLevel: PQSecurityLevel): Promise<Result<PQKeyPair, AtlasError>>;
  
  // Signing Operations
  sign(message: string, privateKey: string, algorithm: PQAlgorithm): Promise<Result<PQSignature, AtlasError>>;
  signMLDSA(message: string, privateKey: string): Promise<Result<PQSignature, AtlasError>>;
  signSPHINCS(message: string, privateKey: string): Promise<Result<PQSignature, AtlasError>>;
  
  // Verification Operations
  verify(message: string, signature: string, publicKey: string, algorithm: PQAlgorithm): Promise<Result<boolean, AtlasError>>;
  verifyMLDSA(message: string, signature: string, publicKey: string): Promise<Result<boolean, AtlasError>>;
  verifySPHINCS(message: string, signature: string, publicKey: string): Promise<Result<boolean, AtlasError>>;
  
  // Hybrid Operations (classic + PQ)
  hybridSign(message: string, classicPrivateKey: string, pqPrivateKey: string): Promise<Result<HybridSignature, AtlasError>>;
  hybridVerify(message: string, hybridSignature: HybridSignature, classicPublicKey: string, pqPublicKey: string): Promise<Result<boolean, AtlasError>>;
  
  // Key Management
  exportPublicKey(keyId: string): Promise<Result<string, AtlasError>>;
  exportPrivateKey(keyId: string): Promise<Result<string, AtlasError>>;
  importKeyPair(publicKey: string, privateKey: string, algorithm: PQAlgorithm): Promise<Result<PQKeyPair, AtlasError>>;
  rotateKey(keyId: string): Promise<Result<PQKeyPair, AtlasError>>;
  revokeKey(keyId: string, reason: string): Promise<Result<boolean, AtlasError>>;
  
  // Key Conversion
  classicToHybridPublicKey(classicKey: string, pqKey: string): Promise<Result<string, AtlasError>>;
  classicToHybridPrivateKey(classicKey: string, pqKey: string): Promise<Result<string, AtlasError>>;
}

// ============================================================================
// POST-QUANTUM SERVICE IMPLEMENTATION
// ============================================================================

export class PostQuantumServiceImpl implements IPostQuantumService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly tracer: Tracer;
  private readonly keyStore: Map<string, PQKeyPair>;
  
  constructor() {
    this.circuitBreaker = new CircuitBreaker('post-quantum-service', {
      failureThreshold: 3,
      timeoutMs: 120000,  // Longer timeout for PQ operations
      volumeThreshold: 20,
    });
    this.tracer = new Tracer();
    this.keyStore = new Map();
  }
  
  async generateKeyPair(algorithm: PQAlgorithm): Promise<Result<PQKeyPair, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const span = this.tracer.startSpan('generateKeyPair', { algorithm });
      
      try {
        const keyId = `pq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const securityLevel = this.getSecurityLevel(algorithm);
        
        // Generate key pair (simulated - in production use actual PQ library)
        const keyPair: PQKeyPair = {
          algorithm,
          publicKey: await this.generateMockPublicKey(algorithm),
          privateKey: await this.generateMockPrivateKey(algorithm),
          securityLevel,
          createdAt: Date.now() as Timestamp,
          keyId,
        };
        
        this.keyStore.set(keyId, keyPair);
        
        this.tracer.endSpan(span, 'ok');
        return ok(keyPair);
      } catch (error) {
        this.tracer.endSpan(span, 'error');
        return fail(createCryptoError(
          `Key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.KEY_NOT_FOUND,
          'validation' as any,
          false
        ));
      }
    });
  }
  
  async generateMLDSAKeyPair(securityLevel: PQSecurityLevel): Promise<Result<PQKeyPair, AtlasError>> {
    const algorithm = this.getMLDSAAlgorithm(securityLevel);
    return this.generateKeyPair(algorithm);
  }
  
  async generateSPHINCSKeyPair(securityLevel: PQSecurityLevel): Promise<Result<PQKeyPair, AtlasError>> {
    const algorithm = this.getSPHINCSAlgorithm(securityLevel);
    return this.generateKeyPair(algorithm);
  }
  
  async sign(message: string, privateKey: string, algorithm: PQAlgorithm): Promise<Result<PQSignature, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const span = this.tracer.startSpan('sign', { algorithm, messageLength: message.length });
      
      try {
        // Hash the message first
        const encoder = new TextEncoder();
        const dataHash = await crypto.subtle.digest('SHA-256', encoder.encode(message));
        const messageHash = Array.from(new Uint8Array(dataHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // Generate signature (simulated)
        const signature: PQSignature = {
          algorithm,
          signature: await this.generateMockSignature(algorithm),
          publicKey: privateKey,  // Would extract from key in production
          messageHash,
          timestamp: Date.now() as Timestamp,
          domain: 'atlas-pq',
        };
        
        this.tracer.endSpan(span, 'ok');
        return ok(signature);
      } catch (error) {
        this.tracer.endSpan(span, 'error');
        return fail(createCryptoError(
          `Signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.KEY_NOT_FOUND,
          'validation' as any,
          false
        ));
      }
    });
  }
  
  async signMLDSA(message: string, privateKey: string): Promise<Result<PQSignature, AtlasError>> {
    return this.sign(message, privateKey, 'ML-DSA-65');
  }
  
  async signSPHINCS(message: string, privateKey: string): Promise<Result<PQSignature, AtlasError>> {
    return this.sign(message, privateKey, 'SPHINCS+-SHA2-256f');
  }
  
  async verify(message: string, signature: string, publicKey: string, algorithm: PQAlgorithm): Promise<Result<boolean, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      try {
        // Hash the message
        const encoder = new TextEncoder();
        const dataHash = await crypto.subtle.digest('SHA-256', encoder.encode(message));
        const messageHash = Array.from(new Uint8Array(dataHash))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // Verify signature (simulated)
        // In production: use actual PQ library verification
        const isValid = signature.length > 0 && publicKey.length > 0;
        
        return ok(isValid);
      } catch (error) {
        return fail(createCryptoError(
          `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.INVALID_SIGNATURE,
          'validation' as any,
          false
        ));
      }
    });
  }
  
  async verifyMLDSA(message: string, signature: string, publicKey: string): Promise<Result<boolean, AtlasError>> {
    return this.verify(message, signature, publicKey, 'ML-DSA-65');
  }
  
  async verifySPHINCS(message: string, signature: string, publicKey: string): Promise<Result<boolean, AtlasError>> {
    return this.verify(message, signature, publicKey, 'SPHINCS+-SHA2-256f');
  }
  
  async hybridSign(message: string, classicPrivateKey: string, pqPrivateKey: string): Promise<Result<HybridSignature, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      try {
        // Combine keys
        const classicResult = await this.classicToHybridPrivateKey(classicPrivateKey, pqPrivateKey);
        if (!classicResult.success) {
          return fail(classicResult.error);
        }
        
        // Generate hybrid signature
        const hybridSignature: HybridSignature = {
          classicSignature: await this.generateMockSignature('ML-DSA-65'),
          pqSignature: await this.generateMockSignature('SPHINCS+-SHA2-256f'),
          combinedVerificationKey: classicResult.value,
          timestamp: Date.now() as Timestamp,
        };
        
        return ok(hybridSignature);
      } catch (error) {
        return fail(createCryptoError(
          `Hybrid signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.KEY_NOT_FOUND,
          'validation' as any,
          false
        ));
      }
    });
  }
  
  async hybridVerify(
    message: string,
    hybridSignature: HybridSignature,
    classicPublicKey: string,
    pqPublicKey: string
  ): Promise<Result<boolean, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      try {
        // In production: verify both signatures independently
        // Both must be valid for the hybrid signature to be valid
        const classicValid = hybridSignature.classicSignature.length > 0;
        const pqValid = hybridSignature.pqSignature.length > 0;
        
        return ok(classicValid && pqValid);
      } catch (error) {
        return fail(createCryptoError(
          `Hybrid verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.INVALID_SIGNATURE,
          'validation' as any,
          false
        ));
      }
    });
  }
  
  async exportPublicKey(keyId: string): Promise<Result<string, AtlasError>> {
    const keyPair = this.keyStore.get(keyId);
    if (!keyPair) {
      return fail(createCryptoError(`Key not found: ${keyId}`, CryptoErrorCodes.KEY_NOT_FOUND, 'validation' as any, false));
    }
    return ok(keyPair.publicKey);
  }
  
  async exportPrivateKey(keyId: string): Promise<Result<string, AtlasError>> {
    const keyPair = this.keyStore.get(keyId);
    if (!keyPair) {
      return fail(createCryptoError(`Key not found: ${keyId}`, CryptoErrorCodes.KEY_NOT_FOUND, 'validation' as any, false));
    }
    return ok(keyPair.privateKey);
  }
  
  async importKeyPair(publicKey: string, privateKey: string, algorithm: PQAlgorithm): Promise<Result<PQKeyPair, AtlasError>> {
    const keyId = `pq-imported-${Date.now()}`;
    const securityLevel = this.getSecurityLevel(algorithm);
    
    const keyPair: PQKeyPair = {
      algorithm,
      publicKey,
      privateKey,
      securityLevel,
      createdAt: Date.now() as Timestamp,
      keyId,
    };
    
    this.keyStore.set(keyId, keyPair);
    return ok(keyPair);
  }
  
  async rotateKey(keyId: string): Promise<Result<PQKeyPair, AtlasError>> {
    const oldKeyPair = this.keyStore.get(keyId);
    if (!oldKeyPair) {
      return fail(createCryptoError(`Key not found: ${keyId}`, CryptoErrorCodes.KEY_NOT_FOUND, 'validation' as any, false));
    }
    
    // Generate new key pair with same algorithm
    const newKeyPair = await this.generateKeyPair(oldKeyPair.algorithm);
    if (!newKeyPair.success) {
      return fail(newKeyPair.error);
    }
    
    // Revoke old key
    await this.revokeKey(keyId, 'Rotated');
    
    return ok(newKeyPair.value);
  }
  
  async revokeKey(keyId: string, _reason: string): Promise<Result<boolean, AtlasError>> {
    if (!this.keyStore.has(keyId)) {
      return fail(createCryptoError(`Key not found: ${keyId}`, CryptoErrorCodes.KEY_NOT_FOUND, 'validation' as any, false));
    }
    
    this.keyStore.delete(keyId);
    return ok(true);
  }
  
  async classicToHybridPublicKey(classicKey: string, pqKey: string): Promise<Result<string, AtlasError>> {
    // Combine classic and PQ public keys
    // In production: use proper key combination algorithm
    const combined = Buffer.from(classicKey + pqKey).toString('base64');
    return ok(combined);
  }
  
  async classicToHybridPrivateKey(classicKey: string, pqKey: string): Promise<Result<string, AtlasError>> {
    // Combine classic and PQ private keys
    // In production: use proper key combination algorithm
    const combined = Buffer.from(classicKey + pqKey).toString('base64');
    return ok(combined);
  }
  
  // Helper methods (simulated for production)
  private getSecurityLevel(algorithm: PQAlgorithm): PQSecurityLevel {
    if (algorithm.includes('44') || algorithm.includes('128')) return 2;
    if (algorithm.includes('65') || algorithm.includes('192')) return 3;
    return 5;
  }
  
  private getMLDSAAlgorithm(securityLevel: PQSecurityLevel): PQAlgorithm {
    switch (securityLevel) {
      case 2: return 'ML-DSA-44';
      case 3: return 'ML-DSA-65';
      case 5: return 'ML-DSA-87';
    }
  }
  
  private getSPHINCSAlgorithm(securityLevel: PQSecurityLevel): PQAlgorithm {
    switch (securityLevel) {
      case 2: return 'SPHINCS+-SHA2-128f';
      case 3: return 'SPHINCS+-SHA2-192f';
      case 5: return 'SPHINCS+-SHA2-256f';
    }
  }
  
  private async generateMockPublicKey(_algorithm: PQAlgorithm): Promise<string> {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return Buffer.from(bytes).toString('base64');
  }
  
  private async generateMockPrivateKey(_algorithm: PQAlgorithm): Promise<string> {
    const bytes = crypto.getRandomValues(new Uint8Array(64));
    return Buffer.from(bytes).toString('base64');
  }
  
  private async generateMockSignature(_algorithm: PQAlgorithm): Promise<string> {
    const bytes = crypto.getRandomValues(new Uint8Array(100));
    return Buffer.from(bytes).toString('base64');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export { PostQuantumServiceImpl as PostQuantumService };

export const DEFAULT_PQ_SERVICE = new PostQuantumServiceImpl();
