import { describe, it, expect } from 'vitest';
import { Validator, validateSchema, schemas } from '@/app/lib/validation';
import { ValidationError } from '@/app/types';

describe('Validator', () => {
  describe('isValidAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(Validator.isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb8')).toBe(true);
      expect(Validator.isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(Validator.isValidAddress('0x123')).toBe(false);
      expect(Validator.isValidAddress('not an address')).toBe(false);
      expect(Validator.isValidAddress('')).toBe(false);
    });
  });

  describe('validateProposal', () => {
    const validProposal = {
      title: 'Test Proposal Title',
      description: 'This is a test description that is long enough to pass validation requirements.',
      category: 'technical',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    it('should validate correct proposal data', () => {
      expect(() => Validator.validateProposal(validProposal)).not.toThrow();
    });

    it('should reject proposal with short title', () => {
      expect(() =>
        Validator.validateProposal({ ...validProposal, title: 'Short' })
      ).toThrow(ValidationError);
    });

    it('should reject proposal with short description', () => {
      expect(() =>
        Validator.validateProposal({ ...validProposal, description: 'Too short' })
      ).toThrow(ValidationError);
    });

    it('should reject proposal with invalid category', () => {
      expect(() =>
        Validator.validateProposal({ ...validProposal, category: 'invalid' })
      ).toThrow(ValidationError);
    });

    it('should reject proposal with past end date', () => {
      expect(() =>
        Validator.validateProposal({
          ...validProposal,
          endDate: new Date(Date.now() - 1000),
        })
      ).toThrow(ValidationError);
    });
  });

  describe('validateQuadraticVote', () => {
    it('should validate correct credits', () => {
      expect(() => Validator.validateQuadraticVote(100, 1000)).not.toThrow();
    });

    it('should reject non-integer credits', () => {
      expect(() => Validator.validateQuadraticVote(10.5, 1000)).toThrow(ValidationError);
    });

    it('should reject negative credits', () => {
      expect(() => Validator.validateQuadraticVote(-10, 1000)).toThrow(ValidationError);
    });

    it('should reject credits exceeding max', () => {
      expect(() => Validator.validateQuadraticVote(1500, 1000)).toThrow(ValidationError);
    });
  });

  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      expect(Validator.sanitizeString('<script>alert("xss")</script>')).toBe(
        'scriptalert("xss")/script'
      );
    });

    it('should remove control characters', () => {
      expect(Validator.sanitizeString('test\x00string')).toBe('teststring');
    });

    it('should trim whitespace', () => {
      expect(Validator.sanitizeString('  test  ')).toBe('test');
    });
  });
});

describe('validateSchema', () => {
  it('should validate proposal schema', () => {
    const validData = {
      title: 'Test Proposal',
      description: 'This is a long enough description for the proposal validation.',
      category: 'technical',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    expect(() => validateSchema(validData, schemas.proposal)).not.toThrow();
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      title: 'Test',
    };

    expect(() => validateSchema(invalidData, schemas.proposal)).toThrow(ValidationError);
  });

  it('should validate vote schema', () => {
    const validData = {
      proposalId: '123',
      vote: 'for',
    };

    expect(() => validateSchema(validData, schemas.vote)).not.toThrow();
  });

  it('should reject invalid enum value', () => {
    const invalidData = {
      proposalId: '123',
      vote: 'maybe',
    };

    expect(() => validateSchema(invalidData, schemas.vote)).toThrow(ValidationError);
  });
});
