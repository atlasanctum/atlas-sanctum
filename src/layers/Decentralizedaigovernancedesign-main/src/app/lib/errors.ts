// Comprehensive Error Handling System - Production Ready

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication Errors
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', details?: any) {
    super('AUTH_REQUIRED', message, 401, true, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super('FORBIDDEN', message, 403, true, details);
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid or expired token', details?: any) {
    super('INVALID_TOKEN', message, 401, true, details);
  }
}

// Validation Errors
export class ValidationError extends AppError {
  constructor(field: string, message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, true, { field, ...details });
  }
}

export class InvalidInputError extends AppError {
  constructor(message: string, details?: any) {
    super('INVALID_INPUT', message, 400, true, details);
  }
}

// Resource Errors
export class NotFoundError extends AppError {
  constructor(resource: string, details?: any) {
    super('NOT_FOUND', `${resource} not found`, 404, true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super('CONFLICT', message, 409, true, details);
  }
}

export class AlreadyExistsError extends AppError {
  constructor(resource: string, details?: any) {
    super('ALREADY_EXISTS', `${resource} already exists`, 409, true, details);
  }
}

// Rate Limiting Errors
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Too many requests',
    retryAfter?: number,
    details?: any
  ) {
    super('RATE_LIMIT_EXCEEDED', message, 429, true, {
      retryAfter,
      ...details,
    });
  }
}

// Blockchain Errors
export class BlockchainError extends AppError {
  constructor(message: string, txHash?: string, details?: any) {
    super('BLOCKCHAIN_ERROR', message, 500, true, { txHash, ...details });
  }
}

export class InsufficientFundsError extends AppError {
  constructor(required: string, available: string, details?: any) {
    super('INSUFFICIENT_FUNDS', 'Insufficient funds for transaction', 400, true, {
      required,
      available,
      ...details,
    });
  }
}

export class TransactionFailedError extends AppError {
  constructor(txHash: string, reason?: string, details?: any) {
    super('TRANSACTION_FAILED', reason || 'Transaction failed', 500, true, {
      txHash,
      ...details,
    });
  }
}

export class ContractError extends AppError {
  constructor(contract: string, method: string, reason?: string, details?: any) {
    super('CONTRACT_ERROR', `Contract call failed: ${contract}.${method}`, 500, true, {
      contract,
      method,
      reason,
      ...details,
    });
  }
}

// Governance Errors
export class GovernanceError extends AppError {
  constructor(message: string, details?: any) {
    super('GOVERNANCE_ERROR', message, 400, true, details);
  }
}

export class InvalidProposalError extends AppError {
  constructor(message: string, proposalId?: string, details?: any) {
    super('INVALID_PROPOSAL', message, 400, true, { proposalId, ...details });
  }
}

export class VotingClosedError extends AppError {
  constructor(proposalId: string, details?: any) {
    super('VOTING_CLOSED', 'Voting period has ended', 400, true, {
      proposalId,
      ...details,
    });
  }
}

export class AlreadyVotedError extends AppError {
  constructor(proposalId: string, voter: string, details?: any) {
    super('ALREADY_VOTED', 'User has already voted on this proposal', 400, true, {
      proposalId,
      voter,
      ...details,
    });
  }
}

export class InsufficientVotingPowerError extends AppError {
  constructor(required: string, available: string, details?: any) {
    super('INSUFFICIENT_VOTING_POWER', 'Insufficient voting power', 400, true, {
      required,
      available,
      ...details,
    });
  }
}

export class QuorumNotMetError extends AppError {
  constructor(proposalId: string, current: number, required: number, details?: any) {
    super('QUORUM_NOT_MET', 'Proposal did not meet quorum', 400, true, {
      proposalId,
      current,
      required,
      ...details,
    });
  }
}

// Security Errors
export class SecurityError extends AppError {
  constructor(message: string, threatType?: string, details?: any) {
    super('SECURITY_ERROR', message, 403, true, { threatType, ...details });
  }
}

export class SuspiciousActivityError extends AppError {
  constructor(activity: string, details?: any) {
    super('SUSPICIOUS_ACTIVITY', `Suspicious activity detected: ${activity}`, 403, true, details);
  }
}

export class AttackDetectedError extends AppError {
  constructor(attackType: string, details?: any) {
    super('ATTACK_DETECTED', `Potential attack detected: ${attackType}`, 403, true, details);
  }
}

// AI/ML Errors
export class AIServiceError extends AppError {
  constructor(service: string, message: string, details?: any) {
    super('AI_SERVICE_ERROR', `AI service error (${service}): ${message}`, 500, true, details);
  }
}

export class ModelPredictionError extends AppError {
  constructor(model: string, details?: any) {
    super('MODEL_PREDICTION_ERROR', `Model prediction failed: ${model}`, 500, true, details);
  }
}

// External Service Errors
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: any) {
    super('EXTERNAL_SERVICE_ERROR', `External service error (${service}): ${message}`, 503, true, details);
  }
}

export class IPFSError extends AppError {
  constructor(message: string, details?: any) {
    super('IPFS_ERROR', `IPFS error: ${message}`, 503, true, details);
  }
}

// Database Errors
export class DatabaseError extends AppError {
  constructor(message: string, query?: string, details?: any) {
    super('DATABASE_ERROR', message, 500, false, { query, ...details });
  }
}

export class ConnectionError extends AppError {
  constructor(service: string, details?: any) {
    super('CONNECTION_ERROR', `Failed to connect to ${service}`, 503, false, details);
  }
}

// System Errors
export class ConfigurationError extends AppError {
  constructor(message: string, details?: any) {
    super('CONFIGURATION_ERROR', message, 500, false, details);
  }
}

export class MaintenanceError extends AppError {
  constructor(message?: string, details?: any) {
    super('MAINTENANCE', message || 'System is under maintenance', 503, true, details);
  }
}

// Error Handler
export class ErrorHandler {
  static handle(error: Error): {
    code: string;
    message: string;
    statusCode: number;
    details?: any;
  } {
    // Handle known errors
    if (error instanceof AppError) {
      return {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
      };
    }

    // Handle unknown errors
    console.error('Unhandled error:', error);
    
    return {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred'
        : error.message,
      statusCode: 500,
    };
  }

  static isOperational(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }

  static logError(error: Error, context?: any): void {
    const errorInfo = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    if (error instanceof AppError) {
      errorInfo['code'] = error.code;
      errorInfo['statusCode'] = error.statusCode;
      errorInfo['details'] = error.details;
      errorInfo['isOperational'] = error.isOperational;
    }

    // In production, send to monitoring service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry or similar
      console.error('Production error:', errorInfo);
    } else {
      console.error('Development error:', errorInfo);
    }
  }
}

// Error boundary for React components
export function handleComponentError(error: Error, errorInfo: any) {
  ErrorHandler.logError(error, { componentStack: errorInfo.componentStack });
  
  // Return user-friendly message
  if (error instanceof ValidationError) {
    return 'Please check your input and try again.';
  }
  
  if (error instanceof BlockchainError) {
    return 'Blockchain transaction failed. Please try again.';
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please connect your wallet to continue.';
  }
  
  if (error instanceof RateLimitError) {
    return 'Too many requests. Please wait and try again.';
  }
  
  return 'An unexpected error occurred. Please try again later.';
}

// Helper to create error responses
export function createErrorResponse(error: Error) {
  const handled = ErrorHandler.handle(error);
  
  return {
    success: false,
    error: {
      code: handled.code,
      message: handled.message,
      details: handled.details,
    },
    timestamp: Date.now(),
  };
}

// Helper to check if error is retryable
export function isRetryableError(error: Error): boolean {
  if (error instanceof AppError) {
    return [
      'NETWORK_ERROR',
      'TIMEOUT',
      'CONNECTION_ERROR',
      'EXTERNAL_SERVICE_ERROR',
      'RATE_LIMIT_EXCEEDED',
    ].includes(error.code);
  }
  return false;
}
