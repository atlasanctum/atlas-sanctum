# ADR-017: Zero Trust Security Model

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

The platform handles sensitive government, health, financial, and environmental
data. Traditional perimeter security (trust everything inside the network) is
insufficient for a multi-cloud, multi-chain platform with external API consumers,
autonomous agents, and IoT data ingestion.

## Decision

Implement Zero Trust: **never trust, always verify**, regardless of network origin.

### Principles

1. **Every request is authenticated** — no implicit trust based on network location
2. **Every request is authorized** — RBAC + capability checks on every handler
3. **Least privilege** — tokens carry only the permissions needed for the operation
4. **Assume breach** — design for containment, not just prevention
5. **Verify explicitly** — use multiple signals (identity, device, location, behavior)

### Implementation Layers

| Layer | Mechanism | Status |
|-------|-----------|--------|
| Transport | TLS 1.3 everywhere | ✅ Enforced via HSTS |
| Identity | JWT + Supabase GoTrue | ✅ Implemented |
| Authorization | RBAC + RLS | ✅ Implemented |
| Service-to-service | mTLS via SPIFFE/SPIRE | ⚠️ Planned (Phase 1) |
| Secrets | AWS Secrets Manager | ✅ `backend/src/secrets.ts` |
| Secrets rotation | Automated 30/90-day rotation | ⚠️ Planned (Phase 1) |
| Audit log | Append-only, separate account | ✅ `audit_logs` table |
| Prompt injection | Input filter before LLM | ✅ `middleware/promptInjection.ts` |
| Post-quantum crypto | Kyber/Dilithium | ✅ `src/crypto/AtlasSanctumPostQuantumService.ts` |

### Secrets Management

- All secrets in AWS Secrets Manager — never in `.env` files in production
- `.env.example` files contain only placeholder values
- `backend/src/secrets.ts` provides `getSecret()` with Azure Key Vault fallback
- Secret rotation triggers automatic pod restart via Kubernetes secret sync

### Audit Log Requirements

- All privileged actions (role changes, payment operations, admin actions) logged
- Audit log is append-only — no UPDATE or DELETE permitted on `audit_logs`
- Stored in a separate Supabase project with read-only access from the main app
- Retained for 7 years (regulatory compliance)

### Threat Model

See `docs/ZERO_TRUST_ARCHITECTURE.md` for the full STRIDE threat model.

Critical unmitigated threats as of this ADR:
- **Prompt injection** — mitigated by `backend/src/middleware/promptInjection.ts`
- **Agent repudiation** — mitigated by `agent_runs` table (schema in migration)
- **mTLS gap** — service-to-service calls currently use API keys, not certificates

## Consequences

**Positive**
- Breach containment — a compromised service cannot pivot to other services
- Regulatory compliance — audit trail satisfies SOC 2, ISO 27001 requirements
- Defense in depth — multiple independent layers must all fail for a breach

**Negative**
- Operational complexity — mTLS requires certificate lifecycle management
- Latency overhead — every request requires token validation (mitigated by Redis cache)
- Developer friction — local development requires mock auth setup

## References

- `backend/src/middleware/security.ts` — security middleware stack
- `backend/src/secrets.ts` — secrets management
- `docs/ZERO_TRUST_ARCHITECTURE.md` — full security architecture
- `src/crypto/` — cryptographic services
