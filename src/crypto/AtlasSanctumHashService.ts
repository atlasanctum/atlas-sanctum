/**
 * Atlas Sanctum Hash Service
 * Production-ready hash implementations using Web Crypto API
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  Timestamp,
} from '../architecture/AtlasSanctumTypes';

import {
  HashAlgorithm,
  HashResult,
  createCryptoError,
  CryptoErrorCodes,
} from '../architecture/AtlasSanctumCryptoTypes';

import { CircuitBreaker, Tracer } from '../architecture/AtlasSanctumCrossCutting';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function secureRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ============================================================================
// HASH SERVICE
// ============================================================================

export interface IHashService {
  hash(data: string, algorithm: HashAlgorithm): Promise<Result<HashResult, AtlasError>>;
  hashBytes(data: Uint8Array, algorithm: HashAlgorithm): Promise<Result<HashResult, AtlasError>>;
  hashBatch(data: string[], algorithm: HashAlgorithm): Promise<Result<readonly HashResult[], AtlasError>>;
  generateRandomHash(algorithm: HashAlgorithm): Promise<Result<string, AtlasError>>;
}

export class HashService implements IHashService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly tracer: Tracer;

  constructor() {
    this.circuitBreaker = new CircuitBreaker('hash-service', {
      failureThreshold: 5,
      timeoutMs: 30000,
      volumeThreshold: 100,
    });
    this.tracer = new Tracer();
  }

  async hash(data: string, algorithm: HashAlgorithm): Promise<Result<HashResult, AtlasError>> {
    const encoder = new TextEncoder();
    return this.hashBytes(encoder.encode(data), algorithm);
  }

  async hashBytes(data: Uint8Array, algorithm: HashAlgorithm): Promise<Result<HashResult, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const span = this.tracer.startSpan('hash', { algorithm });

      try {
        const cryptoAlgo = this.mapAlgorithm(algorithm);
        const hashBuffer = await crypto.subtle.digest(cryptoAlgo, data);
        const hashHex = bufferToHex(hashBuffer);

        const result: HashResult = {
          algorithm,
          hash: hashHex,
          length: hashBuffer.byteLength * 8,
          timestamp: Date.now() as Timestamp,
        };

        this.tracer.endSpan(span, 'ok');
        return ok(result);
      } catch (error) {
        this.tracer.endSpan(span, 'error');
        return fail(createCryptoError(
          `Hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.ENCRYPTION_FAILED,
          'cryptographic',
          false
        ));
      }
    });
  }

  async hashBatch(data: string[], algorithm: HashAlgorithm): Promise<Result<readonly HashResult[], AtlasError>> {
    const results: HashResult[] = [];
    
    for (const item of data) {
      const result = await this.hash(item, algorithm);
      if (!result.success) {
        return fail(result.error);
      }
      results.push(result.value);
    }
    
    return ok(results);
  }

  async generateRandomHash(algorithm: HashAlgorithm): Promise<Result<string, AtlasError>> {
    const randomData = secureRandomBytes(32);
    const result = await this.hashBytes(randomData, algorithm);
    return result.map(h => h.hash);
  }

  private mapAlgorithm(algorithm: HashAlgorithm): string {
    // Web Crypto API natively supports these algorithms
    const nativeAlgorithms: Partial<Record<HashAlgorithm, string>> = {
      'SHA-256': 'SHA-256',
      'SHA-384': 'SHA-384',
      'SHA-512': 'SHA-512',
    };
    // ZK-friendly and non-native algorithms require a WASM/native library.
    // Mapping them silently to SHA-256 would produce incorrect hashes.
    const unsupported: HashAlgorithm[] = [
      'SHA3-256', 'SHA3-384', 'SHA3-512',
      'BLAKE2b', 'BLAKE2s', 'Keccak256',
      'Poseidon', 'MiMC', 'Rescue', 'Pedersen',
    ];
    if (unsupported.includes(algorithm)) {
      throw new Error(
        `Algorithm '${algorithm}' requires a native/WASM implementation and is not supported by the Web Crypto API. ` +
        `Use a dedicated library (e.g. noble-hashes for BLAKE2/Keccak, circomlibjs for Poseidon).`
      );
    }
    return nativeAlgorithms[algorithm] ?? 'SHA-256';
  }

export interface IHmacService {
  generateKey(algorithm: HashAlgorithm): Promise<Result<string, AtlasError>>;
  sign(data: string, key: string, algorithm: HashAlgorithm): Promise<Result<string, AtlasError>>;
  verify(data: string, signature: string, key: string, algorithm: HashAlgorithm): Promise<Result<boolean, AtlasError>>;
}

export class HmacService implements IHmacService {
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.circuitBreaker = new CircuitBreaker('hmac-service', {
      failureThreshold: 3,
      timeoutMs: 30000,
      volumeThreshold: 50,
    });
  }

  async generateKey(algorithm: HashAlgorithm): Promise<Result<string, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const keyLength = algorithm === 'SHA-512' ? 64 : 32;
      const keyBytes = secureRandomBytes(keyLength);
      return ok(bufferToHex(keyBytes.buffer as ArrayBuffer));
    });
  }

  async sign(data: string, key: string, algorithm: HashAlgorithm): Promise<Result<string, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      try {
        const keyBytes = Uint8Array.from(atob(key), c => c.charCodeAt(0));
        const dataBuffer = new TextEncoder().encode(data);
        const cryptoAlgo = this.mapAlgorithm(algorithm);

        const keyImport = await crypto.subtle.importKey(
          'raw',
          keyBytes,
          { name: 'HMAC', hash: cryptoAlgo },
          false,
          ['sign']
        );

        const signatureBuffer = await crypto.subtle.sign('HMAC', keyImport, dataBuffer);
        return ok(bufferToHex(signatureBuffer.buffer as ArrayBuffer));
      } catch (error) {
        return fail(createCryptoError(
          `HMAC signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.ENCRYPTION_FAILED,
          'cryptographic',
          false
        ));
      }
    });
  }

  async verify(data: string, signature: string, key: string, algorithm: HashAlgorithm): Promise<Result<boolean, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const signResult = await this.sign(data, key, algorithm);
      if (!signResult.success) {
        return fail(signResult.error);
      }
      
      // Constant-time comparison
      const expected = signResult.value;
      if (expected.length !== signature.length) {
        return ok(false);
      }
      
      let result = 0;
      for (let i = 0; i < expected.length; i++) {
        result |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
      }

      return ok(result === 0);
    });
  }

  private mapAlgorithm(algorithm: HashAlgorithm): string {
    const nativeAlgorithms: Partial<Record<HashAlgorithm, string>> = {
      'SHA-256': 'SHA-256',
      'SHA-384': 'SHA-384',
      'SHA-512': 'SHA-512',
    };
    const unsupported: HashAlgorithm[] = [
      'SHA3-256', 'SHA3-384', 'SHA3-512',
      'BLAKE2b', 'BLAKE2s', 'Keccak256',
      'Poseidon', 'MiMC', 'Rescue', 'Pedersen',
    ];
    if (unsupported.includes(algorithm)) {
      throw new Error(
        `HMAC algorithm '${algorithm}' is not supported by Web Crypto API. Use a WASM-backed library.`
      );
    }
    return nativeAlgorithms[algorithm] ?? 'SHA-256';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const HASH_SERVICE = new HashService();
export const HMAC_SERVICE = new HmacService();
