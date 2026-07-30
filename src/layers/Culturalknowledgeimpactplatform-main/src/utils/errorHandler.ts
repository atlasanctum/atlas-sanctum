// Utility for consistent error handling across the application

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ApiError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Handles API errors and returns a user-friendly error message
 */
export function handleApiError(error: unknown): AppError {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
      };
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        code: 'TIMEOUT_ERROR',
      };
    }

    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Retry logic for failed API requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.code?.startsWith('4')) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
}

/**
 * Logs errors to console with context
 */
export function logError(context: string, error: unknown, additionalInfo?: any) {
  console.error(`[${context}] Error:`, error);
  if (additionalInfo) {
    console.error(`[${context}] Additional info:`, additionalInfo);
  }
}
