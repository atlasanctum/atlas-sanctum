/**
 * Atlas Sanctum Encryption Service
 * AES-256-GCM encryption using Web Crypto API
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
} from '../architecture/AtlasSanctumTypes';

import {
  createCryptoError,
  CryptoErrorCodes,
} from '../architecture/AtlasSanctumCryptoTypes';

import { CircuitBreaker } from '../architecture/AtlasSanctumCrossCutting';

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

function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
}

// ============================================================================
// ENCRYPTION SERVICE
// ============================================================================

export interface IEncryptionService {
  encrypt(plaintext: string, key: string, iv: string): Promise<Result<{ ciphertext: string; authTag: string }, AtlasError>>;
  decrypt(ciphertext: string, key: string, iv: string, authTag: string): Promise<Result<string, AtlasError>>;
  generateKey(): Promise<Result<string, AtlasError>>;
  generateIV(): Promise<Result<string, AtlasError>>;
}

export class EncryptionService implements IEncryptionService {
  private readonly circuitBreaker: CircuitBreaker;

  constructor() {
    this.circuitBreaker = new CircuitBreaker('encryption-service', {
      failureThreshold: 3,
      timeoutMs: 30000,
      volumeThreshold: 50,
    });
  }

  async encrypt(
    plaintext: string,
    key: string,
    iv: string
  ): Promise<Result<{ ciphertext: string; authTag: string }, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      try {
        const keyBuffer = hexToBuffer(key);
        const ivBuffer = hexToBuffer(iv);
        const plaintextBuffer = new TextEncoder().encode(plaintext);

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt']
        );

        const encryptedBuffer = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: ivBuffer },
          cryptoKey,
          plaintextBuffer
        );

        // Extract auth tag (last 16 bytes for GCM)
        const encryptedArray = new Uint8Array(encryptedBuffer);
        const ciphertext = encryptedArray.slice(0, -16);
        const authTag = encryptedArray.slice(-16);

        return ok({
          ciphertext: bufferToHex(toArrayBuffer(ciphertext)),
          authTag: bufferToHex(toArrayBuffer(authTag)),
        });
      } catch (error) {
        return fail(createCryptoError(
          `Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.ENCRYPTION_FAILED,
          'cryptographic',
          false
        ));
      }
    });
  }

  async decrypt(
    ciphertext: string,
    key: string,
    iv: string,
    authTag: string
  ): Promise<Result<string, AtlasError>> {
    return this.circuitBreaker.execute(async () => {
      try {
        const keyBuffer = hexToBuffer(key);
        const ivBuffer = hexToBuffer(iv);
        const ciphertextBuffer = hexToBuffer(ciphertext);
        const authTagBuffer = hexToBuffer(authTag);

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        // Combine ciphertext and auth tag
        const combined = new Uint8Array(ciphertextBuffer.length + authTagBuffer.length);
        combined.set(ciphertextBuffer);
        combined.set(authTagBuffer, ciphertextBuffer.length);

        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: ivBuffer },
          cryptoKey,
          combined
        );

        return ok(new TextDecoder().decode(decryptedBuffer));
      } catch (error) {
        return fail(createCryptoError(
          `Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          CryptoErrorCodes.DECRYPTION_FAILED,
          'cryptographic',
          false
        ));
      }
    });
  }

  async generateKey(): Promise<Result<string, AtlasError>> {
    const keyBytes = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    const keyExport = await crypto.subtle.exportKey('raw', keyBytes);
    return ok(bufferToHex(keyExport));
  }

  async generateIV(): Promise<Result<string, AtlasError>> {
    const iv = secureRandomBytes(12); // 96-bit IV for AES-GCM
    return ok(bufferToHex(toArrayBuffer(iv)));
  }
}

// ============================================================================
// KEY DERIVATION SERVICE
// ============================================================================

export interface IKeyDerivationService {
  deriveKey(
    masterKey: string,
    salt: string,
    info: string,
    iterations: number,
    algorithm: string,
    length: number
  ): Promise<Result<string, AtlasError>>;
  deriveFromPassword(
    password: string,
    salt: string,
    iterations: number,
    algorithm: string,
    length: number
  ): Promise<Result<string, AtlasError>>;
}

export class KeyDerivationService implements IKeyDerivationService {
  async deriveKey(
    masterKey: string,
    salt: string,
    info: string,
    iterations: number,
    algorithm: string,
    length: number
  ): Promise<Result<string, AtlasError>> {
    try {
      const keyBuffer = hexToBuffer(masterKey);
      const saltBuffer = new TextEncoder().encode(salt);
      const infoBuffer = new TextEncoder().encode(info);

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HKDF' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          hash: algorithm as any,
          salt: saltBuffer,
          info: infoBuffer,
        },
        keyMaterial,
        { name: 'AES-GCM', length },
        false,
        ['encrypt', 'decrypt']
      );

      const keyExport = await crypto.subtle.exportKey('raw', derivedKey);
      return ok(bufferToHex(keyExport));
    } catch (error) {
      return fail(createCryptoError(
        `Key derivation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        CryptoErrorCodes.ENCRYPTION_FAILED,
        'cryptographic',
        false
      ));
    }
  }

  async deriveFromPassword(
    password: string,
    salt: string,
    iterations: number,
    algorithm: string,
    length: number
  ): Promise<Result<string, AtlasError>> {
    try {
      const passwordBuffer = new TextEncoder().encode(password);
      const saltBuffer = new TextEncoder().encode(salt);

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const derivedKey = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBuffer,
          iterations,
          hash: algorithm as any,
        },
        keyMaterial,
        length * 8
      );

      return ok(bufferToHex(derivedKey));
    } catch (error) {
      return fail(createCryptoError(
        `Password-based key derivation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        CryptoErrorCodes.ENCRYPTION_FAILED,
        'cryptographic',
        false
      ));
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ENCRYPTION_SERVICE = new EncryptionService();
export const KEY_DERIVATION_SERVICE = new KeyDerivationService();
