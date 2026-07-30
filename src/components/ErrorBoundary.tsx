/**
 * Atlas Sanctum Error Boundary
 * React error boundary with graceful degradation and retry support
 */

import type { ErrorInfo, ReactNode} from 'react';
import React, { Component, Suspense } from 'react';
import { RefreshCw, AlertTriangle, Home, Bug } from 'lucide-react';

// ============================================================================
// ERROR BOUNDARY PROPS & STATE
// ============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetCount: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class AtlasErrorBoundaryError extends Error {
  readonly code: string;
  readonly recoverable: boolean;
  readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    recoverable: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AtlasErrorBoundaryError';
    this.code = code;
    this.recoverable = recoverable;
    this.context = context;
  }
}

// ============================================================================
// DEFAULT ERROR FALLBACK UI
// ============================================================================

interface DefaultFallbackProps {
  error: Error;
  reset: () => void;
  level: 'page' | 'section' | 'component';
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({ error, reset, level }) => {
  const isPage = level === 'page';
  
  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-8
        ${isPage ? 'min-h-screen' : 'min-h-[200px]'}
        bg-gradient-to-br from-slate-900 to-slate-800
        text-white
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className={`
          w-20 h-20 mx-auto rounded-full flex items-center justify-center
          ${isPage ? 'bg-red-500/20' : 'bg-amber-500/20'}
        `}>
          <AlertTriangle className={`
            w-10 h-10
            ${isPage ? 'text-red-400' : 'text-amber-400'}
          `} />
        </div>

        {/* Error Message */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {isPage ? 'Something went wrong' : 'Component Error'}
          </h2>
          <p className="text-slate-400">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error instanceof AtlasErrorBoundaryError && error.code && (
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Error Code: {error.code}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 
                       text-primary-foreground rounded-lg transition-colors"
            aria-label="Try again"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {isPage && (
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 
                         text-white rounded-lg transition-colors"
              aria-label="Go to homepage"
            >
              <Home className="w-4 h-4" />
              Home
            </a>
          )}
        </div>

        {/* Debug Toggle */}
        <details className="text-left">
          <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-400">
            <Bug className="w-4 h-4 inline mr-1" />
            Show error details
          </summary>
          <pre className="mt-3 p-4 bg-slate-950 rounded-lg text-xs overflow-auto max-h-40 font-mono">
            {error.stack}
          </pre>
        </details>
      </div>
    </div>
  );
};

// ============================================================================
// LOADING FALLBACK
// ============================================================================

const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8 min-h-[200px]" role="status" aria-live="polite">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  </div>
);

// ============================================================================
// ASYNC ERROR BOUNDARY (FOR LAZY COMPONENTS)
// ============================================================================

interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback?: ReactNode;
  rejectFallback?: (error: Error) => ReactNode;
  onError?: (error: Error) => void;
}

interface AsyncBoundaryState {
  error: Error | null;
}

export class AsyncErrorBoundary extends Component<
  AsyncBoundaryProps,
  AsyncBoundaryState
> {
  state: AsyncBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AsyncBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error);
  }

  render(): ReactNode {
    const { children, pendingFallback, rejectFallback } = this.props;
    const { error } = this.state;

    if (error) {
      if (rejectFallback) {
        return rejectFallback(error);
      }
      return (
        <DefaultFallback
          error={error}
          reset={() => this.setState({ error: null })}
          level="section"
        />
      );
    }

    return (
      <Suspense fallback={pendingFallback ?? <LoadingFallback />}>
        {children}
      </Suspense>
    );
  }
}

// ============================================================================
// MAIN ERROR BOUNDARY CLASS
// ============================================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    resetCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to monitoring service (would integrate with external service)
    console.error('[ErrorBoundary] Caught error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  resetErrorBoundary = (): void => {
    this.props.onError?.(this.state.error!, this.state.errorInfo!);
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      resetCount: this.state.resetCount + 1,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, resetCount } = this.state;
    const { children, fallback, level = 'section' } = this.props;

    if (hasError && error) {
      // Custom fallback function
      if (typeof fallback === 'function') {
        return fallback(error, this.resetErrorBoundary);
      }

      // Custom fallback component
      if (fallback) {
        return fallback;
      }

      // Default fallback with reset count to force re-render
      return (
        <DefaultErrorBoundaryWrapper 
          key={`error-${resetCount}`}
          error={error}
          reset={this.resetErrorBoundary}
          level={level}
        />
      );
    }

    // Wrap children with key to allow complete re-mount on error reset
    return (
      <React.Fragment key={`children-${resetCount}`}>
        {children}
      </React.Fragment>
    );
  }
}

// ============================================================================
// WRAPPER COMPONENT (FOR KEY RESET)
// ============================================================================

interface DefaultErrorBoundaryWrapperProps {
  error: Error;
  reset: () => void;
  level: 'page' | 'section' | 'component';
}

const DefaultErrorBoundaryWrapper: React.FC<DefaultErrorBoundaryWrapperProps> = ({
  error,
  reset,
  level,
}) => <DefaultFallback error={error} reset={reset} level={level} />;

// ============================================================================
// ERROR HANDLER HOOK
// ============================================================================

interface UseErrorHandlerOptions {
  level?: 'page' | 'section' | 'component';
  onError?: (error: Error) => void;
}

export function useErrorHandler(
  options: UseErrorHandlerOptions = {}
): (error: Error) => void {
  const { onError } = options;

  return (error: Error) => {
    console.error('[useErrorHandler] Reported error:', error);
    onError?.(error);
    
    // In development, also log to console
    if (import.meta.env?.DEV) {
      console.group('🚨 Error Handler');
      console.error('Error:', error);
      console.groupEnd();
    }
  };
}

// ============================================================================
// WITH ERROR BOUNDARY HOC
// ============================================================================

interface WithErrorBoundaryProps {
  errorBoundary?: {
    fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    level?: 'page' | 'section' | 'component';
  };
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: WithErrorBoundaryProps['errorBoundary']
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary
      fallback={errorBoundaryProps?.fallback}
      onError={errorBoundaryProps?.onError}
      level={errorBoundaryProps?.level}
    >
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ErrorBoundary;
