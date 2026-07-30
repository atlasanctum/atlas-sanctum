// Enhanced Error Handling System
export class PlatformError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'PlatformError';
  }
}

export const errorHandler = {
  handle: (error: Error | PlatformError, context?: Record<string, any>) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Platform Error:', errorData);
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD) {
      try {
        // Integration point for error monitoring
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: error instanceof PlatformError && error.severity === 'critical'
          });
        }
      } catch (gtagError) {
        // Silently fail if gtag is not available
        console.debug('Failed to send error to gtag:', gtagError);
      }
    }

    return errorData;
  },

  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries exceeded');
  }
};
