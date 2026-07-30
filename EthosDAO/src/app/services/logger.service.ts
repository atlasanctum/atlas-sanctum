/**
 * Production Logging Service
 * Centralized logging with different levels and external service integration
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export type LogEntry = {
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
};

class LoggerService {
  private logLevel: LogLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;
  private logs: LogEntry[] = [];
  private maxLogSize = 1000;
  private externalLoggers: ((entry: LogEntry) => void)[] = [];

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: any): LogEntry {
    return {
      level,
      message,
      context,
      data,
      timestamp: Date.now(),
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    };
  }

  private log(entry: LogEntry) {
    // Store in memory (circular buffer)
    this.logs.push(entry);
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }

    // Console output
    const prefix = `[${LogLevel[entry.level]}] ${entry.context ? `[${entry.context}]` : ''}`;
    const consoleMethod = this.getConsoleMethod(entry.level);
    
    if (entry.data) {
      consoleMethod(prefix, entry.message, entry.data);
    } else {
      consoleMethod(prefix, entry.message);
    }

    // Send to external loggers (e.g., Sentry, Datadog, LogRocket)
    this.externalLoggers.forEach(logger => {
      try {
        logger(entry);
      } catch (error) {
        console.error('Failed to send log to external service:', error);
      }
    });

    // Send critical errors to monitoring service
    if (entry.level >= LogLevel.ERROR) {
      this.reportToMonitoring(entry);
    }
  }

  debug(message: string, context?: string, data?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(this.createLogEntry(LogLevel.DEBUG, message, context, data));
    }
  }

  info(message: string, context?: string, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(this.createLogEntry(LogLevel.INFO, message, context, data));
    }
  }

  warn(message: string, context?: string, data?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(this.createLogEntry(LogLevel.WARN, message, context, data));
    }
  }

  error(message: string, context?: string, data?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.log(this.createLogEntry(LogLevel.ERROR, message, context, data));
    }
  }

  fatal(message: string, context?: string, data?: any) {
    if (this.shouldLog(LogLevel.FATAL)) {
      this.log(this.createLogEntry(LogLevel.FATAL, message, context, data));
    }
  }

  // Performance tracking
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`Timer: ${label} completed in ${duration.toFixed(2)}ms`, 'Performance');
    };
  }

  // User action tracking
  trackAction(action: string, properties?: Record<string, any>) {
    this.info(`User action: ${action}`, 'Analytics', properties);
    
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(action, properties);
    }
  }

  // Error boundary integration
  logReactError(error: Error, errorInfo: any) {
    this.error('React Error Boundary caught error', 'React', {
      error: {
        message: error.message,
        stack: error.stack
      },
      errorInfo
    });
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Export logs for support
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Add external logger integration
  addExternalLogger(logger: (entry: LogEntry) => void) {
    this.externalLoggers.push(logger);
  }

  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }

  private reportToMonitoring(entry: LogEntry) {
    // Integration with monitoring services (Sentry, Datadog, etc.)
    if (typeof window !== 'undefined') {
      // Example: Sentry integration
      if ((window as any).Sentry) {
        (window as any).Sentry.captureException(new Error(entry.message), {
          level: LogLevel[entry.level].toLowerCase(),
          contexts: {
            log: {
              context: entry.context,
              data: entry.data,
              timestamp: entry.timestamp
            }
          }
        });
      }
    }
  }

  private getUserId(): string | undefined {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userId') || undefined;
    }
    return undefined;
  }

  private getSessionId(): string | undefined {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    }
    return undefined;
  }
}

// Export singleton instance
export const logger = new LoggerService();
