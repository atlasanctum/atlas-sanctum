// Comprehensive Validation Library for Production

import { ValidationError } from '@/app/types';

export class Validator {
  // Address validation
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  static validateAddress(address: string, fieldName: string = 'address'): void {
    if (!address) {
      throw new ValidationError(fieldName, `${fieldName} is required`);
    }
    if (!this.isValidAddress(address)) {
      throw new ValidationError(fieldName, `Invalid Ethereum address: ${address}`);
    }
  }

  // Proposal validation
  static validateProposal(data: {
    title: string;
    description: string;
    category: string;
    endDate: Date;
  }): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('title', 'Title is required');
    }
    if (data.title.length < 10) {
      throw new ValidationError('title', 'Title must be at least 10 characters');
    }
    if (data.title.length > 200) {
      throw new ValidationError('title', 'Title must be less than 200 characters');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new ValidationError('description', 'Description is required');
    }
    if (data.description.length < 50) {
      throw new ValidationError('description', 'Description must be at least 50 characters');
    }
    if (data.description.length > 10000) {
      throw new ValidationError('description', 'Description must be less than 10000 characters');
    }

    const validCategories = ['technical', 'funding', 'governance', 'ethics'];
    if (!validCategories.includes(data.category)) {
      throw new ValidationError('category', `Category must be one of: ${validCategories.join(', ')}`);
    }

    if (!(data.endDate instanceof Date) || isNaN(data.endDate.getTime())) {
      throw new ValidationError('endDate', 'Invalid end date');
    }
    if (data.endDate <= new Date()) {
      throw new ValidationError('endDate', 'End date must be in the future');
    }
    const maxEndDate = new Date();
    maxEndDate.setMonth(maxEndDate.getMonth() + 6);
    if (data.endDate > maxEndDate) {
      throw new ValidationError('endDate', 'End date cannot be more than 6 months in the future');
    }
  }

  // Vote validation
  static validateVote(vote: 'for' | 'against'): void {
    if (vote !== 'for' && vote !== 'against') {
      throw new ValidationError('vote', 'Vote must be either "for" or "against"');
    }
  }

  // Quadratic voting validation
  static validateQuadraticVote(credits: number, maxCredits: number): void {
    if (!Number.isInteger(credits)) {
      throw new ValidationError('credits', 'Credits must be an integer');
    }
    if (credits < 0) {
      throw new ValidationError('credits', 'Credits cannot be negative');
    }
    if (credits > maxCredits) {
      throw new ValidationError('credits', `Credits cannot exceed ${maxCredits}`);
    }
  }

  // Reputation validation
  static validateReputationScore(score: number): void {
    if (typeof score !== 'number' || isNaN(score)) {
      throw new ValidationError('score', 'Score must be a number');
    }
    if (score < 0 || score > 100) {
      throw new ValidationError('score', 'Score must be between 0 and 100');
    }
  }

  // Bond validation
  static validateBond(bond: bigint, minBond: bigint): void {
    if (bond < minBond) {
      throw new ValidationError('bond', `Bond must be at least ${minBond.toString()}`);
    }
  }

  // RPGF project validation
  static validateRPGFProject(data: {
    title: string;
    description: string;
    impactReport: string;
    fundingRequested: bigint;
  }): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new ValidationError('title', 'Title is required');
    }
    if (data.title.length < 10 || data.title.length > 200) {
      throw new ValidationError('title', 'Title must be between 10 and 200 characters');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new ValidationError('description', 'Description is required');
    }
    if (data.description.length < 50 || data.description.length > 5000) {
      throw new ValidationError('description', 'Description must be between 50 and 5000 characters');
    }

    if (!data.impactReport || data.impactReport.trim().length === 0) {
      throw new ValidationError('impactReport', 'Impact report is required');
    }
    if (data.impactReport.length < 100) {
      throw new ValidationError('impactReport', 'Impact report must be at least 100 characters');
    }

    if (data.fundingRequested <= 0n) {
      throw new ValidationError('fundingRequested', 'Funding requested must be positive');
    }
  }

  // Impact attestation validation
  static validateAttestation(data: {
    attestation: string;
    impactRating: number;
  }): void {
    if (!data.attestation || data.attestation.trim().length === 0) {
      throw new ValidationError('attestation', 'Attestation is required');
    }
    if (data.attestation.length < 20) {
      throw new ValidationError('attestation', 'Attestation must be at least 20 characters');
    }
    if (data.attestation.length > 1000) {
      throw new ValidationError('attestation', 'Attestation must be less than 1000 characters');
    }

    if (!Number.isInteger(data.impactRating)) {
      throw new ValidationError('impactRating', 'Impact rating must be an integer');
    }
    if (data.impactRating < 1 || data.impactRating > 5) {
      throw new ValidationError('impactRating', 'Impact rating must be between 1 and 5');
    }
  }

  // Challenge validation
  static validateChallenge(data: {
    reason: string;
    evidence: string[];
  }): void {
    if (!data.reason || data.reason.trim().length === 0) {
      throw new ValidationError('reason', 'Challenge reason is required');
    }
    if (data.reason.length < 50) {
      throw new ValidationError('reason', 'Challenge reason must be at least 50 characters');
    }
    if (data.reason.length > 2000) {
      throw new ValidationError('reason', 'Challenge reason must be less than 2000 characters');
    }

    if (!Array.isArray(data.evidence) || data.evidence.length === 0) {
      throw new ValidationError('evidence', 'At least one piece of evidence is required');
    }
    data.evidence.forEach((item, index) => {
      if (!item || item.trim().length === 0) {
        throw new ValidationError(`evidence[${index}]`, 'Evidence item cannot be empty');
      }
      if (item.length > 5000) {
        throw new ValidationError(`evidence[${index}]`, 'Evidence item too long');
      }
    });
  }

  // Sanitization
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim();
  }

  static sanitizeAddress(address: string): string {
    return address.toLowerCase().trim();
  }

  // Rate limiting check
  static checkRateLimit(
    userId: string,
    action: string,
    cache: Map<string, number[]>,
    maxRequests: number,
    windowMs: number
  ): boolean {
    const key = `${userId}:${action}`;
    const now = Date.now();
    const timestamps = cache.get(key) || [];
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (validTimestamps.length >= maxRequests) {
      return false;
    }
    
    validTimestamps.push(now);
    cache.set(key, validTimestamps);
    return true;
  }
}

// Zod-like schema validation (simple version)
export const schemas = {
  proposal: {
    title: { type: 'string', min: 10, max: 200, required: true },
    description: { type: 'string', min: 50, max: 10000, required: true },
    category: { type: 'enum', values: ['technical', 'funding', 'governance', 'ethics'], required: true },
    endDate: { type: 'date', required: true },
  },
  
  vote: {
    proposalId: { type: 'string', required: true },
    vote: { type: 'enum', values: ['for', 'against'], required: true },
  },
  
  delegation: {
    delegateAddress: { type: 'address', required: true },
    category: { type: 'string', required: false },
    conditions: { type: 'object', required: false },
  },
};

export function validateSchema<T>(data: any, schema: any): T {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    const rule = rules as any;
    
    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value === undefined || value === null) continue;
    
    // Type checks
    if (rule.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`${field} must be a string`);
      } else {
        if (rule.min && value.length < rule.min) {
          errors.push(`${field} must be at least ${rule.min} characters`);
        }
        if (rule.max && value.length > rule.max) {
          errors.push(`${field} must be at most ${rule.max} characters`);
        }
      }
    }
    
    if (rule.type === 'number') {
      if (typeof value !== 'number' || isNaN(value)) {
        errors.push(`${field} must be a number`);
      } else {
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`${field} must be at least ${rule.min}`);
        }
        if (rule.max !== undefined && value > rule.max) {
          errors.push(`${field} must be at most ${rule.max}`);
        }
      }
    }
    
    if (rule.type === 'address') {
      if (!Validator.isValidAddress(value)) {
        errors.push(`${field} must be a valid Ethereum address`);
      }
    }
    
    if (rule.type === 'enum') {
      if (!rule.values.includes(value)) {
        errors.push(`${field} must be one of: ${rule.values.join(', ')}`);
      }
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError('validation', errors.join('; '));
  }
  
  return data as T;
}
