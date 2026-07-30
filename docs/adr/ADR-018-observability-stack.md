# ADR-018: Observability Stack

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

The platform already has OpenTelemetry instrumentation (`backend/src/tracing.ts`),
Winston structured logging, Prometheus metrics (`backend/src/metrics.ts`), and
Sentry error tracking. The question is how to unify these into a coherent
observability strategy with defined SLOs.

## Decision

Standardize on the **OpenTelemetry Collector** as the single egress point for
all telemetry signals (metrics, traces, logs). This decouples instrumentation
from backend choice.

### Backends

| Signal | Backend | Reason |
|--------|---------|--------|
| Metrics | Prometheus + Grafana Cloud | Existing Prometheus setup, cost-effective at scale |
| Traces | Grafana Tempo (via OTel Collector) | Unified with metrics in Grafana |
| Logs | Grafana Loki (via Winston transport) | Correlated with traces via trace IDs |
| Errors | Sentry | Frontend + backend error grouping, source maps |
| Uptime | Lighthouse CI (`.lighthouserc.json`) | Existing setup |
| Alerts | PagerDuty | On-call rotation management |

### Service Level Objectives

| SLI | SLO | Measurement Window |
|-----|-----|--------------------|
| API p99 latency | < 500ms | 30-day rolling |
| AI agent response p95 | < 8s | 30-day rolling |
| Authentication success rate | > 99.9% | 7-day rolling |
| Data ingestion lag | < 5 minutes | 1-hour rolling |
| Platform uptime | > 99.95% | 30-day rolling |
| Error rate (5xx) | < 0.1% | 1-hour rolling |

**Error budget:** 99.95% uptime = 4.38 hours downtime/year = 21.9 minutes/month.
When 50% of the monthly error budget is consumed, a P2 incident is declared.
When 100% is consumed, a P1 incident is declared and the release freeze begins.

### Alerting Rules

See `monitoring/prometheus-rules.yaml` for Prometheus alerting rules.

Critical alerts (PagerDuty, immediate):
- API error rate > 1% for 5 minutes
- Authentication failure rate > 5% for 2 minutes
- Database connection pool exhaustion
- Chain halt (sanctumd block production stops)

Warning alerts (Slack, business hours):
- API p99 latency > 300ms for 10 minutes
- AI agent timeout rate > 10%
- Redis memory usage > 80%

### Correlation

Every request receives a `X-Request-ID` header (UUID). This ID is propagated:
- Through all service-to-service calls as `X-Correlation-ID`
- Into all log entries as `correlationId`
- Into all trace spans as the root span ID
- Into all agent run records in `agent_runs.correlation_id`

## Consequences

**Positive**
- Single pane of glass — metrics, traces, and logs correlated in Grafana
- OTel Collector decouples instrumentation from backend — swap Grafana for Datadog without code changes
- SLOs make reliability expectations explicit and measurable

**Negative**
- Grafana Cloud cost scales with data volume — requires retention policy tuning
- OTel Collector is another infrastructure component to operate
- SLO alerting requires careful threshold tuning to avoid alert fatigue

## References

- `backend/src/tracing.ts` — OpenTelemetry setup
- `backend/src/metrics.ts` — Prometheus metrics
- `monitoring/prometheus-rules.yaml` — alerting rules
- `infrastructure/kubernetes/monitoring/` — monitoring infrastructure
