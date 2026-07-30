/**
 * API Response Types
 * 
 * Standardized response types for all API endpoints.
 */

// ============================================================================
// Generic API Response
// ============================================================================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: ResponseMeta;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  requestId?: string;
  timestamp: string;
}

// ============================================================================
// Pagination
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: ResponseMeta & {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function createPaginatedMeta(
  params: PaginationParams,
  total: number
): PaginatedResponse<unknown>['meta'] {
  const page = params.page || 1;
  const limit = params.limit || 20;
  
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// Authentication Responses
// ============================================================================

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
    tenantId: string;
  };
  session?: {
    id: string;
    expiresAt: Date;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface TokenRefreshResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// ============================================================================
// User Responses
// ============================================================================

export interface UserResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
    tenantId: string;
    organizationId?: string;
    emailVerified: boolean;
    mfaEnabled: boolean;
    lastLogin?: Date;
    createdAt: Date;
  };
}

export interface UserListResponse extends PaginatedResponse<UserResponse['user']> {}

// ============================================================================
// Tenant Responses
// ============================================================================

export interface TenantResponse {
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
    status: string;
    settings: {
      requireMFA: boolean;
      sessionTimeout: number;
      maxSessionsPerUser: number;
    };
    limits: {
      users: number;
      apiCalls: number;
    };
    createdAt: Date;
  };
}

// ============================================================================
// Error Response Factories
// ============================================================================

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>
): APIResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details })
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  };
}

// Common error responses
export const Errors = {
  UNAUTHORIZED: (message = 'Authentication required') => 
    createErrorResponse('UNAUTHORIZED', message),
  
  FORBIDDEN: (message = 'Access denied') => 
    createErrorResponse('FORBIDDEN', message),
  
  NOT_FOUND: (resource = 'Resource') => 
    createErrorResponse('NOT_FOUND', `${resource} not found`),
  
  VALIDATION_ERROR: (details?: Record<string, unknown>) => 
    createErrorResponse('VALIDATION_ERROR', 'Request validation failed', details),
  
  RATE_LIMITED: (retryAfter?: number) => 
    createErrorResponse('RATE_LIMITED', 'Too many requests', { retryAfter }),
  
  INTERNAL_ERROR: (message = 'An internal error occurred') => 
    createErrorResponse('INTERNAL_ERROR', message),
  
  CONFLICT: (message = 'Resource conflict') => 
    createErrorResponse('CONFLICT', message),
  
  TOO_MANY_REQUESTS: (retryAfter: number) => 
    createErrorResponse('TOO_MANY_REQUESTS', 'Rate limit exceeded', { retryAfter })
};

// ============================================================================
// Success Response Factories
// ============================================================================

export function createSuccessResponse<T>(
  data: T,
  meta?: Partial<ResponseMeta>
): APIResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  meta: ResponseMeta
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    meta
  };
}

// ============================================================================
// Request ID Middleware
// ============================================================================

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
