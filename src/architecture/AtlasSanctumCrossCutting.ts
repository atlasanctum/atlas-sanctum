/**
 * Atlas Sanctum Cross-Cutting Concerns
 * Error handling, circuit breakers, retry mechanisms, and observability infrastructure
 * 
 * These patterns ensure system resilience, maintainability, and operational visibility
 * across all Atlas Sanctum components.
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  HealthStatus,
  ComponentHealth,
  HealthCheckStatus,
  MetricsSnapshot,
  TransactionMetrics,
  SystemMetrics,
  ImpactMetrics,
  Timestamp,
} from './AtlasSanctumTypes';

// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerConfig {
  readonly failureThreshold: number;      // Number of failures before opening
  readonly successThreshold: number;       // Number of successes in half-open to close
  readonly timeoutMs: number;               // Time to wait before trying half-open
  readonly volumeThreshold: number;        // Minimum calls before evaluating
  readonly samplingWindowMs: number;        // Time window for failure rate calculation
}

export interface CircuitBreakerMetrics {
  readonly state: CircuitState;
  readonly failureCount: number;
  readonly successCount: number;
  readonly lastFailureTime: Timestamp;
  readonly lastSuccessTime: Timestamp;
  readonly failureRate: number;
  readonly requestCount: number;
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: Timestamp = 0;
  private lastSuccessTime: Timestamp = 0;
  private requestCount: number = 0;
  private readonly config: CircuitBreakerConfig;
  private readonly name: string;
  private readonly onStateChange: (from: CircuitState, to: CircuitState) => void;

  constructor(
    name: string,
    config: Partial<CircuitBreakerConfig> = {},
    onStateChange?: (from: CircuitState, to: CircuitState) => void
  ) {
    this.name = name;
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      successThreshold: config.successThreshold ?? 3,
      timeoutMs: config.timeoutMs ?? 30000,
      volumeThreshold: config.volumeThreshold ?? 10,
      samplingWindowMs: config.samplingWindowMs ?? 60000,
    };
    this.onStateChange = onStateChange ?? (() => {});
  }

  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    if (!this.canExecute()) {
      if (fallback) {
        return fallback();
      }
      throw new AtlasError(
        `Circuit breaker '${this.name}' is open`,
        'CIRCUIT_OPEN',
        'external_dependency',
        false
      );
    }

    this.requestCount++;

    try {
      const result = await operation();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private canExecute(): boolean {
    switch (this.state) {
      case CircuitState.CLOSED:
        return true;
      case CircuitState.OPEN:
        if (Date.now() - this.lastFailureTime > this.config.timeoutMs) {
          this.transitionTo(CircuitState.HALF_OPEN);
          return true;
        }
        return false;
      case CircuitState.HALF_OPEN:
        return true;
    }
  }

  private recordSuccess(): void {
    this.successCount++;
    this.lastSuccessTime = Date.now() as Timestamp;

    if (this.state === CircuitState.HALF_OPEN) {
      if (this.successCount >= this.config.successThreshold) {
        this.transitionTo(CircuitState.CLOSED);
        this.resetCounts();
      }
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now() as Timestamp;

    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionTo(CircuitState.OPEN);
      return;
    }

    if (this.state === CircuitState.CLOSED) {
      const failureRate = this.requestCount > 0 
        ? this.failureCount / this.requestCount 
        : 0;
      
      if (this.requestCount >= this.config.volumeThreshold &&
          failureRate >= this.config.failureThreshold / this.config.volumeThreshold) {
        this.transitionTo(CircuitState.OPEN);
      }
    }
  }

  private transitionTo(newState: CircuitState): void {
    if (this.state !== newState) {
      const previousState = this.state;
      this.state = newState;
      this.onStateChange(previousState, newState);
    }
  }

  private resetCounts(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.requestCount = 0;
  }

  getMetrics(): CircuitBreakerMetrics {
    const failureRate = this.requestCount > 0 
      ? this.failureCount / this.requestCount 
      : 0;

    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      failureRate,
      requestCount: this.requestCount,
    };
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.resetCounts();
  }
}

// ============================================================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

export interface RetryConfig {
  readonly maxAttempts: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
  readonly backoffMultiplier: number;
  readonly retryableErrors: readonly string[];
  readonly nonRetryableErrors: readonly string[];
}

export interface RetryResult<T> {
  readonly success: boolean;
  readonly attempts: number;
  readonly totalTimeMs: number;
  readonly result?: T;
  readonly error?: Error;
}

export class RetryPolicy {
  private readonly config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxAttempts: config.maxAttempts ?? 3,
      baseDelayMs: config.baseDelayMs ?? 1000,
      maxDelayMs: config.maxDelayMs ?? 30000,
      backoffMultiplier: config.backoffMultiplier ?? 2,
      retryableErrors: config.retryableErrors ?? [
        'NETWORK_ERROR',
        'TIMEOUT',
        'SERVICE_UNAVAILABLE',
        'RATE_LIMIT',
      ],
      nonRetryableErrors: config.nonRetryableErrors ?? [
        'VALIDATION_ERROR',
        'UNAUTHORIZED',
        'FORBIDDEN',
      ],
    };
  }

  async execute<T>(
    operation: () => Promise<T>,
    onRetry?: (attempt: number, error: Error, delayMs: number) => void
  ): Promise<RetryResult<T>> {
    const startTime = Date.now();
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        const result = await operation();
        return {
          success: true,
          attempts: attempt,
          totalTimeMs: Date.now() - startTime,
          result,
        };
      } catch (error) {
        lastError = error as Error;

        if (this.isRetryable(error as Error) && attempt < this.config.maxAttempts) {
          const delayMs = this.calculateDelay(attempt);
          if (onRetry) {
            onRetry(attempt, lastError, delayMs);
          }
          await this.sleep(delayMs);
        } else {
          break;
        }
      }
    }

    return {
      success: false,
      attempts: this.config.maxAttempts,
      totalTimeMs: Date.now() - startTime,
      error: lastError,
    };
  }

  private isRetryable(error: Error): boolean {
    const atlasError = error as AtlasError;
    
    if (atlasError.category === 'resource_not_found') {
      return false;
    }
    
    if (this.config.nonRetryableErrors.includes(atlasError.code)) {
      return false;
    }
    
    return this.config.retryableErrors.includes(atlasError.code) ||
           !atlasError.code;
  }

  private calculateDelay(attempt: number): number {
    const delay = this.config.baseDelayMs * 
      Math.pow(this.config.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.config.maxDelayMs);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// RESULT TYPE UTILITIES
// ============================================================================

export function mapResult<T, U>(
  result: Result<T>,
  mapper: (value: T) => U
): Result<U> {
  if (result.success) {
    return ok(mapper(result.value));
  }
  return fail(result.error);
}

export function flatMapResult<T, U>(
  result: Result<T>,
  mapper: (value: T) => Result<U>
): Result<U> {
  if (result.success) {
    return mapper(result.value);
  }
  return fail(result.error);
}

export function unwrapResult<T>(result: Result<T>): T {
  if (result.success) {
    return result.value;
  }
  throw result.error;
}

export function getOrElse<T>(result: Result<T>, defaultValue: T): T {
  if (result.success) {
    return result.value;
  }
  return defaultValue;
}

// ============================================================================
// HEALTH CHECK SYSTEM
// ============================================================================

export interface HealthCheck {
  readonly name: string;
  readonly check: () => Promise<ComponentHealth>;
  readonly dependencies?: readonly string[];
}

export class HealthCheckRegistry {
  private readonly checks: Map<string, HealthCheck> = new Map();
  private readonly circuitBreakers: Map<string, CircuitBreaker> = new Map();

  register(check: HealthCheck): void {
    this.checks.set(check.name, check);
    this.circuitBreakers.set(
      check.name,
      new CircuitBreaker(`health-${check.name}`, {
        failureThreshold: 3,
        timeoutMs: 10000,
        volumeThreshold: 1,
      })
    );
  }

  async checkAll(): Promise<HealthStatus> {
    const componentPromises = Array.from(this.checks.values()).map(async (check) => {
      const breaker = this.circuitBreakers.get(check.name)!;
      
      try {
        const result = await breaker.execute(
          () => check.check(),
          () => Promise.resolve({
            name: check.name,
            status: 'degraded' as HealthCheckStatus,
            latencyMs: 0,
            errorRate: 1,
            details: { error: 'Circuit breaker fallback' },
          })
        );
        return result;
      } catch {
        return {
          name: check.name,
          status: 'unhealthy' as HealthCheckStatus,
          latencyMs: 0,
          errorRate: 1,
          details: { error: 'Health check failed' },
        };
      }
    });

    const components = await Promise.all(componentPromises);
    const overallStatus = this.calculateOverallStatus(components);
    const healthyComponents = components.filter(c => c.status === 'healthy').length;
    const degradedComponents = components.filter(c => c.status === 'degraded').length;

    return {
      status: overallStatus,
      components,
      lastChecked: Date.now() as Timestamp,
      uptime: process.uptime() * 1000,
      summary: {
        healthy: healthyComponents,
        degraded: degradedComponents,
        unhealthy: components.length - healthyComponents - degradedComponents,
      },
    };
  }

  private calculateOverallStatus(components: readonly ComponentHealth[]): HealthCheckStatus {
    if (components.some(c => c.status === 'unhealthy')) {
      return 'unhealthy';
    }
    if (components.some(c => c.status === 'degraded')) {
      return 'degraded';
    }
    return 'healthy';
  }

  async checkOne(name: string): Promise<ComponentHealth | undefined> {
    const check = this.checks.get(name);
    if (!check) {
      return undefined;
    }

    try {
      return await check.check();
    } catch {
      return {
        name,
        status: 'unhealthy',
        latencyMs: 0,
        errorRate: 1,
      };
    }
  }

  getRegisteredChecks(): readonly string[] {
    return Array.from(this.checks.keys());
  }
}

// ============================================================================
// OBSERVABILITY INFRASTRUCTURE
// ============================================================================

export interface TraceContext {
  readonly traceId: string;
  readonly spanId: string;
  readonly parentSpanId?: string;
  readonly timestamp: Timestamp;
  readonly attributes: Record<string, unknown>;
}

export interface Span {
  readonly name: string;
  readonly context: TraceContext;
  readonly startTime: Timestamp;
  readonly endTime?: Timestamp;
  readonly duration?: number;
  readonly status: 'ok' | 'error';
  readonly events: readonly SpanEvent[];
  readonly attributes: Record<string, unknown>;
}

export interface SpanEvent {
  readonly name: string;
  readonly timestamp: Timestamp;
  readonly attributes?: Record<string, unknown>;
}

export class Tracer {
  private readonly spans: Map<string, Span> = new Map();
  private readonly currentSpanStack: Span[] = [];
  private readonly attributePrefix: string = 'atlas.';

  startSpan(
    name: string,
    attributes?: Record<string, unknown>
  ): Span {
    const parent = this.currentSpanStack[this.currentSpanStack.length - 1];
    const traceId = this.generateId();
    const spanId = this.generateId();

    const span: Span = {
      name,
      context: {
        traceId,
        spanId,
        parentSpanId: parent?.context.spanId,
        timestamp: Date.now() as Timestamp,
        attributes: this.prefixAttributes(attributes),
      },
      startTime: Date.now() as Timestamp,
      status: 'ok',
      events: [],
      attributes: this.prefixAttributes(attributes),
    };

    this.spans.set(span.context.spanId, span);
    this.currentSpanStack.push(span);
    return span;
  }

  endSpan(span: Span, status: 'ok' | 'error' = 'ok'): void {
    const endTime = Date.now() as Timestamp;
    span.endTime = endTime;
    span.duration = endTime - span.startTime;
    span.status = status;

    const popped = this.currentSpanStack.pop();
    if (popped !== span) {
      console.warn('Tracer: Attempted to end span that was not on top of stack');
    }
  }

  addEvent(span: Span, eventName: string, attributes?: Record<string, unknown>): void {
    span.events.push({
      name: eventName,
      timestamp: Date.now() as Timestamp,
      attributes: this.prefixAttributes(attributes),
    });
  }

  setSpanAttribute(span: Span, key: string, value: unknown): void {
    span.attributes[`${this.attributePrefix}${key}`] = value;
  }

  getActiveSpan(): Span | undefined {
    return this.currentSpanStack[this.currentSpanStack.length - 1];
  }

  getAllSpans(): readonly Span[] {
    return Array.from(this.spans.values());
  }

  getSpansByName(name: string): readonly Span[] {
    return Array.from(this.spans.values()).filter(s => s.name === name);
  }

  getSpansByTraceId(traceId: string): readonly Span[] {
    return Array.from(this.spans.values()).filter(
      s => s.context.traceId === traceId
    );
  }

  clear(): void {
    this.spans.clear();
    this.currentSpanStack.length = 0;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private prefixAttributes(attributes?: Record<string, unknown>): Record<string, unknown> {
    if (!attributes) {
      return {};
    }
    const prefixed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(attributes)) {
      prefixed[`${this.attributePrefix}${key}`] = value;
    }
    return prefixed;
  }
}

// ============================================================================
// METRICS COLLECTOR
// ============================================================================

export interface MetricsCollectorConfig {
  readonly maxHistorySize: number;
  readonly flushIntervalMs: number;
}

export class MetricsCollector {
  private transactionMetrics: TransactionMetrics[] = [];
  private systemMetrics: SystemMetrics[] = [];
  private impactMetrics: ImpactMetrics[] = [];
  private readonly config: MetricsCollectorConfig;
  private readonly flushCallback?: (snapshot: MetricsSnapshot) => void;
  private flushInterval?: NodeJS.Timeout;

  constructor(
    config: Partial<MetricsCollectorConfig> = {},
    flushCallback?: (snapshot: MetricsSnapshot) => void
  ) {
    this.config = {
      maxHistorySize: config.maxHistorySize ?? 1000,
      flushIntervalMs: config.flushIntervalMs ?? 60000,
    };
    this.flushCallback = flushCallback;

    if (flushCallback) {
      this.startAutoFlush();
    }
  }

  recordTransactionMetrics(metrics: TransactionMetrics): void {
    this.transactionMetrics.push(metrics);
    this.pruneIfNeeded();
  }

  recordSystemMetrics(metrics: SystemMetrics): void {
    this.systemMetrics.push(metrics);
    this.pruneIfNeeded();
  }

  recordImpactMetrics(metrics: ImpactMetrics): void {
    this.impactMetrics.push(metrics);
    this.pruneIfNeeded();
  }

  getCurrentSnapshot(): MetricsSnapshot {
    return {
      timestamp: Date.now() as Timestamp,
      transactions: this.aggregateTransactionMetrics(),
      system: this.aggregateSystemMetrics(),
      impact: this.aggregateImpactMetrics(),
    };
  }

  private aggregateTransactionMetrics(): TransactionMetrics {
    const all = this.transactionMetrics;
    if (all.length === 0) {
      return {
        total: 0,
        successful: 0,
        failed: 0,
        averageLatencyMs: 0,
        throughputPerSecond: 0,
      };
    }

    const total = all.reduce((sum, m) => sum + m.total, 0);
    const successful = all.reduce((sum, m) => sum + m.successful, 0);
    const failed = all.reduce((sum, m) => sum + m.failed, 0);
    const avgLatency = all.reduce((sum, m) => sum + m.averageLatencyMs, 0) / all.length;

    return {
      total,
      successful,
      failed,
      averageLatencyMs: avgLatency,
      throughputPerSecond: total / 60,
    };
  }

  private aggregateSystemMetrics(): SystemMetrics {
    const all = this.systemMetrics;
    if (all.length === 0) {
      return {
        cpuUsage: 0,
        memoryUsage: 0,
        networkLatencyMs: 0,
        diskUsage: 0,
      };
    }

    return {
      cpuUsage: all.reduce((sum, m) => sum + m.cpuUsage, 0) / all.length,
      memoryUsage: all.reduce((sum, m) => sum + m.memoryUsage, 0) / all.length,
      networkLatencyMs: all.reduce((sum, m) => sum + m.networkLatencyMs, 0) / all.length,
      diskUsage: all.reduce((sum, m) => sum + m.diskUsage, 0) / all.length,
    };
  }

  private aggregateImpactMetrics(): ImpactMetrics {
    const all = this.impactMetrics;
    if (all.length === 0) {
      return {
        totalCarbonSequestered: 0,
        totalBiodiversityScore: 0,
        totalCommunitiesImpacted: 0,
        economicValueGenerated: 0,
      };
    }

    return {
      totalCarbonSequestered: all.reduce((sum, m) => sum + m.totalCarbonSequestered, 0),
      totalBiodiversityScore: all.reduce((sum, m) => sum + m.totalBiodiversityScore, 0),
      totalCommunitiesImpacted: all.reduce((sum, m) => sum + m.totalCommunitiesImpacted, 0),
      economicValueGenerated: all.reduce((sum, m) => sum + m.economicValueGenerated, 0),
    };
  }

  private pruneIfNeeded(): void {
    while (this.transactionMetrics.length > this.config.maxHistorySize) {
      this.transactionMetrics.shift();
    }
    while (this.systemMetrics.length > this.config.maxHistorySize) {
      this.systemMetrics.shift();
    }
    while (this.impactMetrics.length > this.config.maxHistorySize) {
      this.impactMetrics.shift();
    }
  }

  startAutoFlush(): void {
    if (this.flushInterval) {
      return;
    }
    this.flushInterval = setInterval(() => {
      if (this.flushCallback) {
        this.flushCallback(this.getCurrentSnapshot());
      }
    }, this.config.flushIntervalMs);
  }

  stopAutoFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = undefined;
    }
  }

  clear(): void {
    this.transactionMetrics = [];
    this.systemMetrics = [];
    this.impactMetrics = [];
  }
}

// ============================================================================
// CACHE WITH TTL AND INVALIDATION
// ============================================================================

export interface CacheEntry<T> {
  readonly key: string;
  readonly value: T;
  readonly createdAt: Timestamp;
  readonly expiresAt: Timestamp;
  readonly accessCount: number;
  readonly lastAccessed: Timestamp;
}

export interface CacheConfig {
  readonly defaultTTLMs: number;
  readonly maxSize: number;
  readonly cleanupIntervalMs: number;
  readonly enableStats: boolean;
}

export interface CacheStats {
  readonly size: number;
  readonly hits: number;
  readonly misses: number;
  readonly hitRate: number;
  readonly evictions: number;
}

export class Cache<T> {
  private readonly store: Map<string, CacheEntry<T>> = new Map();
  private readonly config: CacheConfig;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTLMs: config.defaultTTLMs ?? 3600000,
      maxSize: config.maxSize ?? 1000,
      cleanupIntervalMs: config.cleanupIntervalMs ?? 60000,
      enableStats: config.enableStats ?? true,
    };

    if (this.config.cleanupIntervalMs > 0) {
      this.startCleanup();
    }
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    
    if (!entry) {
      if (this.config.enableStats) {
        this.misses++;
      }
      return undefined;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      if (this.config.enableStats) {
        this.misses++;
      }
      return undefined;
    }

    if (this.config.enableStats) {
      this.hits++;
    }

    const updatedEntry: CacheEntry<T> = {
      ...entry,
      accessCount: entry.accessCount + 1,
      lastAccessed: Date.now() as Timestamp,
    };
    this.store.set(key, updatedEntry);
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    const now = Date.now();
    const expiresAt = (now + (ttlMs ?? this.config.defaultTTLMs)) as Timestamp;

    if (this.store.size >= this.config.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now as Timestamp,
      expiresAt,
      accessCount: 0,
      lastAccessed: now as Timestamp,
    };

    this.store.set(key, entry);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) {
      return false;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  invalidate(pattern: string | RegExp): number {
    const regex = typeof pattern === 'string' 
      ? new RegExp(pattern) 
      : pattern;
    
    let count = 0;
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      evictions: this.evictions,
    };
  }

  private evictLeastRecentlyUsed(): void {
    let oldest: [string, CacheEntry<T>] | null = null;
    
    for (const entry of this.store.entries()) {
      if (!oldest || entry[1].lastAccessed < oldest[1].lastAccessed) {
        oldest = entry;
      }
    }

    if (oldest) {
      this.store.delete(oldest[0]);
      this.evictions++;
    }
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, this.config.cleanupIntervalMs);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }

  destroy(): void {
    this.stopCleanup();
    this.clear();
  }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateGeoLocation(location: unknown): Result<GeoLocation> {
  if (!location || typeof location !== 'object') {
    return fail(new AtlasError(
      'Invalid geo location',
      'VALIDATION_ERROR',
      'validation',
      false
    ));
  }

  const loc = location as Record<string, unknown>;
  const lat = loc.lat as number;
  const lng = loc.lng as number;

  if (typeof lat !== 'number' || lat < -90 || lat > 90) {
    return fail(new AtlasError(
      'Latitude must be between -90 and 90',
      'VALIDATION_ERROR',
      'validation',
      false,
      { field: 'lat', value: lat }
    ));
  }

  if (typeof lng !== 'number' || lng < -180 || lng > 180) {
    return fail(new AtlasError(
      'Longitude must be between -180 and 180',
      'VALIDATION_ERROR',
      'validation',
      false,
      { field: 'lng', value: lng }
    ));
  }

  return ok({
    lat,
    lng,
    region: loc.region as string | undefined,
    biome: loc.biome as string | undefined,
    timezone: loc.timezone as string | undefined,
  });
}

export function validateRegenerativeImpact(impact: unknown): Result<RegenerativeImpact> {
  if (!impact || typeof impact !== 'object') {
    return fail(new AtlasError(
      'Invalid regenerative impact',
      'VALIDATION_ERROR',
      'validation',
      false
    ));
  }

  const imp = impact as Record<string, unknown>;
  const requiredFields = ['carbon', 'biodiversity', 'social', 'cultural'];
  
  for (const field of requiredFields) {
    if (typeof imp[field] !== 'number' || imp[field] < 0) {
      return fail(new AtlasError(
        `Field '${field}' must be a non-negative number`,
        'VALIDATION_ERROR',
        'validation',
        false,
        { field, value: imp[field] }
      ));
    }
  }

  return ok({
    carbon: imp.carbon as number,
    biodiversity: imp.biodiversity as number,
    social: imp.social as number,
    cultural: imp.cultural as number,
    water: imp.water as number ?? 0,
    soil: imp.soil as number ?? 0,
  });
}
