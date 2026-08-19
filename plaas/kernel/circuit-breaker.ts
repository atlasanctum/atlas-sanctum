/**
 * PLAAS Kernel — Circuit Breaker
 * Wraps layer calls with fault tolerance.
 * A degraded layer never cascades into full system failure.
 *
 * States: CLOSED (normal) → OPEN (failing) → HALF_OPEN (probing)
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitStats {
  state: CircuitState;
  failures: number;
  lastFailure?: Date;
  lastSuccess?: Date;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private lastFailure?: Date;
  private lastSuccess?: Date;

  constructor(
    private readonly name: string,
    private readonly threshold = 3,
    private readonly resetMs = 30_000,
  ) {}

  async call<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - (this.lastFailure?.getTime() ?? 0) > this.resetMs) {
        this.state = 'HALF_OPEN';
      } else {
        if (fallback) return fallback();
        throw new Error(`Circuit OPEN for '${this.name}'`);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      if (fallback) return fallback();
      throw err;
    }
  }

  stats(): CircuitStats {
    return { state: this.state, failures: this.failures, lastFailure: this.lastFailure, lastSuccess: this.lastSuccess };
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
    this.lastSuccess = new Date();
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = new Date();
    if (this.failures >= this.threshold) this.state = 'OPEN';
  }
}
