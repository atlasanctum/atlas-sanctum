# RB-002: Database Connection Exhaustion

**Severity:** P1  
**SLO Impact:** Platform uptime SLO (> 99.95%)  
**On-Call:** Platform Engineering + Database Team

---

## Detection

Alert fires when:
- `pg_stat_activity_count > 0.9 * max_connections` for 2 minutes
- API returns 500 errors with `connection pool exhausted` in logs

---

## Immediate Actions

### 1. Check current connections

```sql
SELECT state, count(*), max(now() - state_change) AS max_duration
FROM pg_stat_activity
WHERE datname = 'atlas_production'
GROUP BY state;
```

### 2. Identify connection hogs

```sql
SELECT pid, usename, application_name, client_addr,
       state, now() - state_change AS duration, query
FROM pg_stat_activity
WHERE datname = 'atlas_production'
  AND state != 'idle'
ORDER BY duration DESC
LIMIT 20;
```

### 3. Kill idle connections older than 10 minutes

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'atlas_production'
  AND state = 'idle'
  AND now() - state_change > INTERVAL '10 minutes';
```

### 4. Kill long-running queries (> 5 minutes)

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'atlas_production'
  AND now() - query_start > INTERVAL '5 minutes'
  AND state = 'active';
```

---

## Mitigation

| Action | When |
|--------|------|
| Restart API pods (releases pooled connections) | Pool leak suspected |
| Increase `DATABASE_POOL_MAX` in Secrets Manager | Legitimate load increase |
| Enable PgBouncer connection pooling | Sustained high connection count |
| Scale down non-critical services | Emergency connection relief |

---

## Root Cause Patterns

| Pattern | Root Cause | Fix |
|---------|-----------|-----|
| Many `idle in transaction` | Missing `COMMIT`/`ROLLBACK` | Fix transaction handling in code |
| Many `idle` connections | Pool not releasing | Check pool `idleTimeoutMillis` config |
| Many `active` slow queries | Missing index or N+1 | Add index, fix query |
| Sudden spike after deploy | New code path opens connections | Rollback, fix, redeploy |

---

## Prevention

- `DATABASE_POOL_MAX` should be `max_connections * 0.8 / num_pods`
- Set `idleTimeoutMillis: 30000` in pg pool config
- Set `connectionTimeoutMillis: 5000` to fail fast
- Enable `pg_stat_statements` for query performance monitoring
