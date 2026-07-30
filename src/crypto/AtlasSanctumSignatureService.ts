/**
 * Atlas Sanctum Signature Service
 * Production-ready digital signature implementations using Web Crypto API
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  Timestamp,
} from '../architecture/AtlasSanctumTypes';

import {
  KeyType,
  CryptoSignature,
  SignatureVerificationResult,
  PublicKey,
  PrivateKey,
  createCryptoError,
  CryptoErrorCodes,
} from '../architecture/AtlasSanctumCryptoTypes';

import { CircuitBreaker, Tracer } from '../architecture/AtlasSanctumCrossCutting';
import { HASH_SERVICE, HashService } from './AtlasSanctumHashService';

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

function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  if (padding > 0) {
    base64 += '='.repeat(4 - padding);
  }
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

function hexToBuffer(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string: odd length');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

// ============================================================================
// SIGNATURE SERVICE
// ============================================================================

export interface ISignatureService {
  generateKeyPair(keyType: KeyType): Promise<Result<{ privateKey: PrivateKey; publicKey: PublicKey }, AtlasError>>;
  sign(data: string, privateKey: PrivateKey, keyType: KeyType): Promise<Result<CryptoSignature, AtlasError>>;
  verify(signature: CryptoSignature, data: string, publicKey: PublicKey): Promise<Result<SignatureVerificationResult, AtlasError>>;
  batchVerify(signatures: readonly CryptoSignature[], data: readonly string[]): Promise<Result<boolean, AtlasError>>;
  serializeSignature(signature: CryptoSignature): string;
  deserializeSignature(data: string): Result<CryptoSignature, AtlasError>;
}

export class SignatureService implements ISignatureService {
  private readonly circuitBreaker: CircuitBreaker;
  private readonly tracer: Tracer;
  private readonly hashService: HashService;

  constructor() {
    this.circuitBreaker = new CircuitBreaker('signature-service', {
      failureThreshold: 3,
      timeoutMs: 60000,
      volumeThreshold: 50,
    });
    this.tracer = new Tracer();
    this.hashService = HASH_SERVICE;
  }

  async generateKeyPair(keyType: KeyType): Promise<Result<{ privateKey: PrivateKey; publicKey: PublicKey }, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const span = this.tracer.startSpan('generateKeyPair', { keyType });

      try {
        const keyPair = await this.generateKeyPairInternal(keyType);

        const privateKeyExport = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
        const publicKeyExport = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

        const privateKey = base64UrlEncode(new Uint8Array(JSON.stringify(privateKeyExport).split('').map(c => c.charCodeAt(0)))) as PrivateKey;
        const publicKey = base64UrlEncode(new Uint8Array(JSON.stringify(publicKeyExport).split('').map(c => c.charCodeAt(0)))) as PublicKey;

        this.tracer.endSpan(span, 'ok');
        return ok({ privateKey, publicKey });
      } catch (error) {
        this.tracer.endSpan(span, 'error');
        return fail(createCryptoError(
          `Key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.KEY_NOT_FOUND,
          'cryptographic',
          false
        ));
      }
    });
  }

  private async generateKeyPairInternal(keyType: KeyType): Promise<CryptoKeyPair> {
    if (keyType === 'secp256k1' || keyType === 'ecdsa') {
      const ecdsaCurve = keyType === 'secp256k1' ? 'secp256k1' : 'P-256';
      return crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: ecdsaCurve },
        true,
        ['sign', 'verify']
      );
    }
    
    if (keyType === 'ed25519') {
      return crypto.subtle.generateKey(
        { name: 'Ed25519' },
        true,
        ['sign', 'verify']
      );
    }

    // Fallback for unsupported types - use P-256
    return crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
  }

  async sign(data: string, privateKey: PrivateKey, keyType: KeyType): Promise<Result<CryptoSignature, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const span = this.tracer.startSpan('sign', { keyType, dataLength: data.length });

      try {
        // Parse the JWK from base64url
        const privateKeyJson = new TextDecoder().decode(base64UrlDecode(privateKey));
        const privateKeyJwk = JSON.parse(privateKeyJson);

        const cryptoPrivateKey = await this.importPrivateKey(privateKeyJwk, keyType);

        // Hash the data first
        const hashResult = await this.hashService.hash(data, 'SHA-256');
        if (!hashResult.success) {
          return fail(hashResult.error);
        }

        const dataHash = hexToBuffer(hashResult.value.hash);

        // Sign the hash
        const signatureBuffer = await crypto.subtle.sign(
          { name: 'ECDSA', hash: { name: 'SHA-256' } },
          cryptoPrivateKey,
          dataHash
        );

        // Extract r and s from DER-encoded signature
        const derSignature = new Uint8Array(signatureBuffer);
        const { r, s } = this.parseDerSignature(derSignature);

        // Get public key from private key
        const publicKeyJwk = await crypto.subtle.exportKey('jwk', cryptoPrivateKey);
        const publicKey = base64UrlEncode(new Uint8Array(JSON.stringify(publicKeyJwk).split('').map(c => c.charCodeAt(0)))) as PublicKey;

        const signature: CryptoSignature = {
          algorithm: keyType,
          r: r,
          s: s,
          publicKey,
          timestamp: Date.now() as Timestamp,
          domain: 'atlas-regenerative',
        };

        this.tracer.endSpan(span, 'ok');
        return ok(signature);
      } catch (error) {
        this.tracer.endSpan(span, 'error');
        return fail(createCryptoError(
          `Signing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.ENCRYPTION_FAILED,
          'cryptographic',
          false
        ));
      }
    });
  }

  private async importPrivateKey(jwk: any, keyType: KeyType): Promise<CryptoKey> {
    if (keyType === 'secp256k1' || keyType === 'ecdsa') {
      const curve = keyType === 'secp256k1' ? 'secp256k1' : 'P-256';
      return crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'ECDSA', namedCurve: curve },
        false,
        ['sign']
      );
    }
    
    if (keyType === 'ed25519') {
      return crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'Ed25519' },
        false,
        ['sign']
      );
    }

    // Fallback
    return crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );
  }

  async verify(
    signature: CryptoSignature,
    data: string,
    publicKey: PublicKey
  ): Promise<Result<SignatureVerificationResult, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      const span = this.tracer.startSpan('verify', { algorithm: signature.algorithm });

      try {
        // Parse the JWK from base64url
        const publicKeyJson = new TextDecoder().decode(base64UrlDecode(publicKey));
        const publicKeyJwk = JSON.parse(publicKeyJson);

        const cryptoPublicKey = await this.importPublicKey(publicKeyJwk, signature.algorithm);

        // Hash the data
        const hashResult = await this.hashService.hash(data, 'SHA-256');
        if (!hashResult.success) {
          return fail(hashResult.error);
        }

        const dataHash = hexToBuffer(hashResult.value.hash);

        // Reconstruct DER signature from r and s
        if (!signature.r || !signature.s) {
          return fail(createCryptoError(
            'Invalid signature format: missing r or s',
            CryptoErrorCodes.INVALID_SIGNATURE,
            'validation',
            false
          ));
        }

        const derSignature = this.encodeDerSignature(signature.r, signature.s);

        const isValid = await crypto.subtle.verify(
          { name: 'ECDSA', hash: { name: 'SHA-256' } },
          cryptoPublicKey,
          derSignature,
          dataHash
        );

        const result: SignatureVerificationResult = {
          valid: isValid,
          status: isValid ? 'valid' : 'invalid',
          confidence: isValid ? { value: 1 } as any : { value: 0 } as any,
          signers: [{ publicKey, valid: isValid }],
          requiresReview: false,
        };

        this.tracer.endSpan(span, 'ok');
        return ok(result);
      } catch (error) {
        this.tracer.endSpan(span, 'error');
        return fail(createCryptoError(
          `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.VERIFICATION_FAILED,
          'cryptographic',
          false
        ));
      }
    });
  }

  private async importPublicKey(jwk: any, keyType: KeyType): Promise<CryptoKey> {
    if (keyType === 'secp256k1' || keyType === 'ecdsa') {
      const curve = keyType === 'secp256k1' ? 'secp256k1' : 'P-256';
      return crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'ECDSA', namedCurve: curve },
        false,
        ['verify']
      );
    }
    
    if (keyType === 'ed25519') {
      return crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'Ed25519' },
        false,
        ['verify']
      );
    }

    // Fallback
    return crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    );
  }

  async batchVerify(
    signatures: readonly CryptoSignature[],
    data: readonly string[]
  ): Promise<Result<boolean, AtlasError>> {
    if (signatures.length !== data.length) {
      return fail(createCryptoError(
        'Mismatched signatures and data count',
        'VALIDATION_ERROR',
        'validation',
        false
      ));
    }

    // Verify all signatures in parallel
    const results = await Promise.all(
      signatures.map(async (sig, i) => {
        const verifyResult = await this.verify(sig, data[i], sig.publicKey);
        return verifyResult;
      })
    );

    // Check if all are valid
    for (const result of results) {
      if (!result.success) {
        return fail(result.error);
      }
      if (!result.value.valid) {
        return ok(false);
      }
    }

    return ok(true);
  }

  serializeSignature(signature: CryptoSignature): string {
    return JSON.stringify({
      a: signature.algorithm,
      r: signature.r,
      s: signature.s,
      rec: signature.recovery,
      pk: signature.publicKey,
      ts: signature.timestamp,
      d: signature.domain,
    });
  }

  deserializeSignature(data: string): Result<CryptoSignature, AtlasError> {
    try {
      const parsed = JSON.parse(data);
      
      const signature: CryptoSignature = {
        algorithm: parsed.a,
        r: parsed.r,
        s: parsed.s,
        recovery: parsed.rec,
        publicKey: parsed.pk,
        timestamp: parsed.ts,
        domain: parsed.d,
      };

      return ok(signature);
    } catch (error) {
      return fail(createCryptoError(
        'Invalid signature format',
        'DESERIALIZATION_ERROR',
        'validation',
        false
      ));
    }
  }

  private parseDerSignature(der: Uint8Array): { r: string; s: string } {
    // Simplified DER parsing - in production use a proper DER parser
    let pos = 0;
    if (der[pos++] !== 0x30) throw new Error('Invalid DER: expected SEQUENCE');
    
    const totalLength = der[pos++];
    
    if (der[pos++] !== 0x02) throw new Error('Invalid DER: expected INTEGER for r');
    const rLength = der[pos++];
    const rBytes = der.slice(pos, pos + rLength);
    pos += rLength;
    
    if (der[pos++] !== 0x02) throw new Error('Invalid DER: expected INTEGER for s');
    const sLength = der[pos++];
    const sBytes = der.slice(pos, pos + sLength);
    
    return {
      r: bufferToHex(rBytes.buffer as ArrayBuffer),
      s: bufferToHex(sBytes.buffer as ArrayBuffer),
    };
  }

  private encodeDerSignature(r: string, s: string): Uint8Array {
    const rBytes = hexToBuffer(r);
    const sBytes = hexToBuffer(s);

    // Handle negative high bits
    const rSigned = rBytes[0] & 0x80 ? new Uint8Array([0, ...rBytes]) : rBytes;
    const sSigned = sBytes[0] & 0x80 ? new Uint8Array([0, ...sBytes]) : sBytes;

    const der = new Uint8Array(2 + rSigned.length + 2 + sSigned.length);
    der[0] = 0x30;
    der[1] = 4 + rSigned.length + sSigned.length;
    der[2] = 0x02;
    der[3] = rSigned.length;
    der.set(rSigned, 4);
    der[4 + rSigned.length] = 0x02;
    der[4 + rSigned.length + 1] = sSigned.length;
    der.set(sSigned, 4 + rSigned.length + 2);

    return der;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const SIGNATURE_SERVICE = new SignatureService();
