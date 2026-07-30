# RB-003: AI Provider Outage

**Severity:** P2 (P1 if all providers unavailable)  
**SLO Impact:** AI agent response p95 SLO (< 8s)  
**On-Call:** Platform Engineering + AI Team

---

## Detection

Alert fires when:
- `ai_provider_error_rate > 0.1` for 2 minutes (circuit breaker opens)
- `ai_agent_timeout_rate > 0.2` for 5 minutes

---

## Circuit Breaker States (ADR-002)

The AI service implements a circuit breaker per provider:
- **Closed** — normal operation
- **Open** — fast-fail, no requests sent to provider
- **Half-Open** — 3 test requests allowed to check recovery

Check current state:
```bash
curl -H "Authorization: Bearer $METRICS_TOKEN" https://api.atlassanctum.org/metrics \
  | grep ai_circuit_breaker_state
```

---

## Immediate Actions

1. Identify which provider is failing (OpenAI, Anthropic, Bedrock, custom)
2. Check provider status pages:
   - OpenAI: https://status.openai.com
   - Anthropic: https://status.anthropic.com
   - AWS Bedrock: https://health.aws.amazon.com
3. Check circuit breaker state via metrics endpoint
4. If primary provider is down, activate fallback:

```bash
# Force fallback to secondary provider
kubectl set env deployment/atlas-api \
  AI_PRIMARY_PROVIDER=anthropic \
  -n atlas-production
kubectl rollout restart deployment/atlas-api -n atlas-production
```

---

## Fallback Priority

| Priority | Provider | Model | Use When |
|----------|----------|-------|----------|
| 1 | OpenAI | gpt-4o | Default |
| 2 | Anthropic | claude-3-5-sonnet | OpenAI down |
| 3 | AWS Bedrock | claude-3-haiku | Both down, reduced capability |
| 4 | Cached responses | — | All providers down, read-only mode |

---

## Degraded Mode

If all providers are unavailable, activate read-only AI mode:

```bash
kubectl set env deployment/atlas-api AI_DEGRADED_MODE=true -n atlas-production
```

In degraded mode:
- Cached responses served for common queries (TTL: 1 hour)
- New AI queries return 503 with `Retry-After` header
- Agent runs are queued (Redis) and replayed when providers recover

---

## Recovery

When provider recovers:
1. Circuit breaker transitions to Half-Open automatically after `resetTimeout` (30s)
2. Monitor error rate — if < 5%, circuit closes automatically
3. If manual intervention needed: restart the AI service pod
4. Drain the agent run queue: `kubectl exec -it atlas-api-xxx -- node scripts/drain-agent-queue.js`

---

## Post-Incident

- Record provider outage duration in `docs/PERFORMANCE_BENCHMARKS.md`
- Review circuit breaker thresholds if false positives occurred
- Consider adding the affected provider to the fallback chain if not already present
