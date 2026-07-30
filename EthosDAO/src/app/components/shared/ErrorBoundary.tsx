import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '@/app/services/logger.service';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to our logging service
    logger.logReactError(error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // If too many errors, might want to redirect or show different UI
    if (this.state.errorCount > 5) {
      logger.fatal('Too many errors caught by boundary', 'ErrorBoundary', {
        error: error.message,
        count: this.state.errorCount
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  exportErrorLog = () => {
    const errorData = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-rose-400" />
                </div>
              </div>

              {/* Error Title */}
              <h1 className="text-3xl font-bold text-center mb-3 text-slate-100">
                Something went wrong
              </h1>
              <p className="text-center text-slate-400 mb-8">
                We've encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>

              {/* Error Details (collapsible) */}
              <details className="mb-8">
                <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-300 transition-colors mb-2">
                  View technical details
                </summary>
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-slate-400 mb-1">Error Message:</div>
                    <div className="text-sm text-rose-400 font-mono">
                      {this.state.error?.toString()}
                    </div>
                  </div>
                  {this.state.error?.stack && (
                    <div>
                      <div className="text-xs font-semibold text-slate-400 mb-1">Stack Trace:</div>
                      <pre className="text-xs text-slate-500 overflow-auto max-h-48 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-medium"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-4">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
                <button
                  onClick={this.exportErrorLog}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors text-sm"
                >
                  <Bug className="w-4 h-4" />
                  Export Log
                </button>
              </div>

              {/* Error Count Warning */}
              {this.state.errorCount > 2 && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-amber-400 mb-1">
                        Multiple errors detected
                      </div>
                      <div className="text-xs text-amber-300">
                        You've encountered {this.state.errorCount} errors. Consider reloading the page or clearing your browser cache.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Support Info */}
            <div className="mt-6 text-center text-sm text-slate-500">
              Need help? Contact support at{' '}
              <a href="mailto:support@ethosdao.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                support@ethosdao.com
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
