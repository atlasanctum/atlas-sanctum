# RB-007: Prompt Injection Incident

**Severity:** P1 (active exploitation) / P2 (detected and blocked)  
**SLO Impact:** Security posture  
**On-Call:** Security Team + Platform Engineering

---

## Detection

Automatic detection via `backend/src/middleware/promptInjection.ts`:
- HIGH/CRITICAL severity injections are blocked and logged immediately
- Domain event `intelligence.injection.blocked` published to event bus
- Security log entry written with `logSecurityEvent('prompt_injection_detected', ...)`

Alert fires when:
- `injection_blocked_critical_count > 3` in 5 minutes (coordinated attack)
- `injection_blocked_high_count > 10` in 10 minutes

---

## Immediate Actions

### 1. Assess Scope (first 5 minutes)

```bash
# Check injection logs for the last hour
kubectl logs -l app=atlas-api -n atlas-production --since=1h \
  | grep prompt_injection_detected \
  | jq '{severity: .severity, patterns: .patterns, ip: .ip, userId: .userId}'
```

```sql
-- Check audit logs for affected users
SELECT user_id, COUNT(*) as attempts, array_agg(DISTINCT metadata->>'patterns') as patterns
FROM audit_logs
WHERE event_type = 'prompt_injection_detected'
AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY user_id
ORDER BY attempts DESC;
```

### 2. Determine if Exploitation Succeeded

Check `agent_runs` table for suspicious outputs:
```sql
SELECT id, agent_id, input, output, started_at
FROM agent_runs
WHERE started_at > NOW() - INTERVAL '2 hours'
AND (
  output::text ILIKE '%system prompt%'
  OR output::text ILIKE '%api key%'
  OR output::text ILIKE '%ignore previous%'
)
ORDER BY started_at DESC;
```

### 3. Contain

If active exploitation is confirmed:

```bash
# Rate-limit the attacking IP immediately
kubectl exec -it atlas-api-xxx -n atlas-production -- \
  node -e "require('./dist/utils/blockIP').blockIP('ATTACKER_IP', 3600)"

# If user account is compromised, lock it
curl -X POST https://api.atlassanctum.org/api/admin/users/USERID/lock \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

If a system prompt was extracted:
1. Rotate all agent system prompts immediately (update ConfigMap)
2. Rotate API keys for affected services
3. Notify affected users if their data was accessed

---

## Pattern Analysis

Review which patterns fired and whether they indicate a new attack vector:

| Pattern Name | Severity | Action if New |
|-------------|----------|---------------|
| `ignore_instructions` | CRITICAL | Already covered |
| `dan_jailbreak` | CRITICAL | Already covered |
| New encoding trick | MEDIUM+ | Add to `INJECTION_PATTERNS` in `promptInjection.ts` |
| New role hijack | HIGH | Add to `INJECTION_PATTERNS` |

---

## Adding New Patterns

Edit `backend/src/middleware/promptInjection.ts`:

```typescript
{ name: 'new_pattern_name', severity: 'high', pattern: /your-regex-here/i },
```

Deploy immediately — no feature flag needed for security fixes.

---

## Post-Incident

- [ ] Document the attack vector in `SECURITY.md`
- [ ] Add new patterns to the injection filter if a gap was found
- [ ] File CVE if a vulnerability in a dependency was exploited
- [ ] Review all agent outputs from the incident window for data leakage
- [ ] Update this runbook with new indicators of compromise
- [ ] Notify affected users per the disclosure policy in `SECURITY.md`
