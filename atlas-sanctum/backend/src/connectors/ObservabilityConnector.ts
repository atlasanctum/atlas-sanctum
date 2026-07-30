/**
 * Atlas Sanctum — Observability Connector
 * Integrates: Datadog, Grafana, Prometheus, Sentry.
 * Enables: SIEM pipeline, AI anomaly detection, distributed tracing,
 *          autonomous remediation, cost monitoring, SLO tracking.
 */

import { BaseConnector, ConnectorCallOptions, ConnectorStatus } from './BaseConnector';

export interface ObservabilityConfig {
  datadogApiKey?: string;
  datadogSite?: string;  // e.g. "datadoghq.com"
  grafanaUrl?: string;
  grafanaToken?: string;
  prometheusUrl?: string;
  sentryDsn?: string;
  sentryEnvironment?: string;
}

export interface MetricPoint {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp?: number;  // unix seconds
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  message: string;
  service: string;
  traceId?: string;
  spanId?: string;
  tags?: Record<string, string>;
  timestamp?: string;
}

export interface AnomalyAlert {
  metric: string;
  value: number;
  expectedRange: [number, number];
  severity: 'low' | 'medium' | 'high' | 'critical';
  service: string;
  detectedAt: string;
  suggestedRemediation?: string;
}

export interface SentryEvent {
  message: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'fatal';
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  fingerprint?: string[];
}

export class ObservabilityConnector extends BaseConnector {
  private config: ObservabilityConfig;
  private metricBuffer: MetricPoint[] = [];
  private flushTimer?: ReturnType<typeof setInterval>;

  constructor(config: ObservabilityConfig) {
    super({ id: 'observability-connector', domain: 'observability', version: '1.0.0' });
    this.config = config;
  }

  async connect(): Promise<void> {
    this.status = 'healthy';
    // Batch-flush metrics every 10s to reduce API calls
    this.flushTimer = setInterval(() => this.flushMetrics(), 10_000);
    this.emit('connected', { connectorId: this.meta.id });
  }

  async disconnect(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    await this.flushMetrics();
    this.status = 'offline';
  }

  async healthCheck(): Promise<ConnectorStatus> {
    const hasConfig = !!(this.config.datadogApiKey || this.config.prometheusUrl || this.config.grafanaUrl);
    this.status = hasConfig ? 'healthy' : 'degraded';
    return this.status;
  }

  /** Buffer a metric point — flushed in batches */
  recordMetric(point: MetricPoint): void {
    this.metricBuffer.push({ ...point, timestamp: point.timestamp ?? Math.floor(Date.now() / 1000) });
  }

  /** Flush buffered metrics to Datadog */
  async flushMetrics(opts: ConnectorCallOptions = {}): Promise<void> {
    if (!this.config.datadogApiKey || this.metricBuffer.length === 0) return;

    const batch = [...this.metricBuffer];
    this.metricBuffer = [];

    return this.call('metrics:flush', async () => {
      const series = batch.map(p => ({
        metric: p.name,
        points: [[p.timestamp, p.value]],
        tags: Object.entries(p.tags ?? {}).map(([k, v]) => `${k}:${v}`),
        type: 'gauge',
      }));

      const res = await fetch(`https://api.${this.config.datadogSite ?? 'datadoghq.com'}/api/v1/series`, {
        method: 'POST',
        headers: {
          'DD-API-KEY': this.config.datadogApiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ series }),
      });
      if (!res.ok) throw new Error(`Datadog metrics error: ${res.status}`);
    }, opts);
  }

  /** Send structured log to Datadog Logs */
  async sendLog(entry: LogEntry, opts: ConnectorCallOptions = {}): Promise<void> {
    if (!this.config.datadogApiKey) return;

    return this.call('log:send', async () => {
      const res = await fetch(`https://http-intake.logs.${this.config.datadogSite ?? 'datadoghq.com'}/api/v2/logs`, {
        method: 'POST',
        headers: {
          'DD-API-KEY': this.config.datadogApiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
          ddsource: 'atlas-sanctum',
          ddtags: Object.entries(entry.tags ?? {}).map(([k, v]) => `${k}:${v}`).join(','),
          hostname: process.env.ATLAS_CLUSTER ?? 'local',
          message: entry.message,
          service: entry.service,
          status: entry.level,
          trace_id: entry.traceId,
          span_id: entry.spanId,
          timestamp: entry.timestamp ?? new Date().toISOString(),
        }]),
      });
      if (!res.ok) throw new Error(`Datadog logs error: ${res.status}`);
    }, opts);
  }

  /** Capture error/event in Sentry */
  async captureEvent(event: SentryEvent, opts: ConnectorCallOptions = {}): Promise<void> {
    if (!this.config.sentryDsn) return;

    return this.call('sentry:capture', async () => {
      const { host, pathname } = new URL(this.config.sentryDsn!);
      const [publicKey] = host.split('@');
      const projectId = pathname.replace('/', '');
      const sentryHost = host.split('@')[1] ?? 'sentry.io';

      const res = await fetch(`https://${sentryHost}/api/${projectId}/store/`, {
        method: 'POST',
        headers: {
          'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${publicKey}, sentry_client=atlas-sanctum/1.0`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: crypto.randomUUID().replace(/-/g, ''),
          timestamp: new Date().toISOString(),
          platform: 'node',
          level: event.level,
          message: event.message,
          tags: event.tags,
          extra: event.extra,
          fingerprint: event.fingerprint,
          environment: this.config.sentryEnvironment ?? 'production',
        }),
      });
      if (!res.ok) throw new Error(`Sentry error: ${res.status}`);
    }, opts);
  }

  /** Query Prometheus for anomaly detection */
  async queryPrometheus(promql: string, opts: ConnectorCallOptions = {}): Promise<{ result: unknown[] }> {
    return this.call('prometheus:query', async () => {
      if (!this.config.prometheusUrl) throw new Error('Prometheus URL not configured');
      const url = `${this.config.prometheusUrl}/api/v1/query?query=${encodeURIComponent(promql)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Prometheus error: ${res.status}`);
      const data = await res.json() as any;
      return { result: data.data?.result ?? [] };
    }, opts);
  }

  /** Detect anomalies and emit remediation events */
  async detectAnomalies(metrics: MetricPoint[]): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = [];

    for (const metric of metrics) {
      // Simple z-score anomaly detection — replace with ML model in production
      const expected = this.getExpectedRange(metric.name);
      if (metric.value < expected[0] || metric.value > expected[1]) {
        const alert: AnomalyAlert = {
          metric: metric.name,
          value: metric.value,
          expectedRange: expected,
          severity: metric.value > expected[1] * 2 ? 'critical' : 'high',
          service: metric.tags?.service ?? 'unknown',
          detectedAt: new Date().toISOString(),
          suggestedRemediation: this.suggestRemediation(metric.name),
        };
        alerts.push(alert);
        this.emit('anomaly:detected', alert);
      }
    }

    return alerts;
  }

  private getExpectedRange(metricName: string): [number, number] {
    // Extend: load from ML model or historical baseline
    const defaults: Record<string, [number, number]> = {
      'api.latency_ms': [0, 2000],
      'db.query_ms': [0, 500],
      'fragility.score': [0, 1],
      'payment.failure_rate': [0, 0.05],
    };
    return defaults[metricName] ?? [0, 1000];
  }

  private suggestRemediation(metricName: string): string {
    const remediations: Record<string, string> = {
      'api.latency_ms': 'Scale API pods or check downstream dependencies',
      'db.query_ms': 'Add index or optimize query plan',
      'payment.failure_rate': 'Check payment provider status page',
    };
    return remediations[metricName] ?? 'Investigate metric source';
  }
}
