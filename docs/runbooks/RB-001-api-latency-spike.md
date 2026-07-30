# RB-001: API Latency Spike

**Severity:** P2 (escalates to P1 if p99 > 2s for > 10 minutes)  
**SLO Impact:** API p99 latency SLO (< 500ms)  
**On-Call:** Platform Engineering

---

## Detection

Alert fires when: `http_request_duration_seconds{quantile="0.99"} > 0.5` for 5 minutes.

Grafana dashboard: Atlas Platform → API Performance → Latency Heatmap

---

## Immediate Actions (first 5 minutes)

1. Check the Grafana latency heatmap — identify which routes are slow
2. Check database connection pool: `SELECT count(*), state FROM pg_stat_activity GROUP BY state`
3. Check Redis: `redis-cli INFO stats | grep instantaneous_ops_per_sec`
4. Check pod CPU/memory: `kubectl top pods -n atlas-production`
5. Check for a recent deployment: `kubectl rollout history deployment/atlas-api -n atlas-production`

---

## Diagnosis Tree

```
Latency spike
├── All routes slow?
│   ├── YES → Database or Redis issue (go to DB section)
│   └── NO  → Specific route issue (go to Route section)
│
├── Database issue?
│   ├── Connection pool exhausted → increase pool size or kill idle connections
│   ├── Slow query → check pg_stat_statements, add index or optimize query
│   └── Lock contention → check pg_locks, identify blocking query
│
├── Redis issue?
│   ├── Memory pressure → check eviction policy, increase memory limit
│   ├── Connection limit → check maxclients, increase or add replica
│   └── Slow commands → check SLOWLOG GET 10
│
└── Specific route slow?
    ├── AI endpoint → check AI provider latency (ADR-002 circuit breaker)
    ├── Blockchain endpoint → check sanctumd RPC latency
    └── External API → check third-party dependency health
```

---

## Mitigation Options

| Action | Command | When to Use |
|--------|---------|-------------|
| Scale API pods | `kubectl scale deployment atlas-api --replicas=6 -n atlas-production` | CPU-bound latency |
| Restart API pods | `kubectl rollout restart deployment/atlas-api -n atlas-production` | Memory leak suspected |
| Rollback deployment | `kubectl rollout undo deployment/atlas-api -n atlas-production` | Recent deploy caused spike |
| Enable circuit breaker | Set `CIRCUIT_BREAKER_FORCE_OPEN=ai-provider` in ConfigMap | AI provider degraded |
| Increase DB pool | Update `DATABASE_POOL_MAX` in Secrets Manager, restart pods | Pool exhaustion |

---

## Post-Incident

- Write incident report within 24 hours
- Add slow query to `docs/PERFORMANCE_BENCHMARKS.md`
- Create GitHub issue for root cause fix
- Update this runbook if a new failure mode was discovered
