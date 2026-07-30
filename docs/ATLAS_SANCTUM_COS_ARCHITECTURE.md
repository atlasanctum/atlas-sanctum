# Atlas Sanctum — Civilizational Operating System
## Architecture Design Record + Runbook

**Version:** 3.0.0  
**Last Updated:** 2026-06-29  
**Status:** Production Design — Iterative Delivery  

---

## Table of Contents

1. [System Purpose](#1-system-purpose)
2. [Architecture Overview](#2-architecture-overview)
3. [Five Planes — Deep Specification](#3-five-planes)
4. [Database Decisions](#4-database-decisions)
5. [API Platform](#5-api-platform)
6. [Multi-Agent Platform](#6-multi-agent-platform)
7. [Security Architecture](#7-security-architecture)
8. [Scaling Strategy](#8-scaling-strategy)
9. [Deployment](#9-deployment)
10. [Observability](#10-observability)
11. [Testing Strategy](#11-testing-strategy)
12. [Future Extensions](#12-future-extensions)
13. [Risks and Mitigations](#13-risks)
14. [Technical Debt](#14-technical-debt)
15. [Production Readiness Checklist](#15-production-readiness)
16. [ADRs](#16-adrs)

---

## 1. System Purpose

Atlas Sanctum is a **Civilizational Operating System (COS)** — a mission-critical platform that enables humanity to:

- Measure, verify, and trade **regenerative impact** (carbon, biodiversity, health, water)
- Govern commons at scale with **ethical DAO infrastructure**
- Deploy **AI agents** for policy, finance, research, and emergency response
- Anchor truth and identity on **blockchain** with zero-knowledge privacy
- Monitor the **living Earth** in real-time via satellite and sensor networks

**Design Contract:**
- Every user interaction touches at most **one plane** via a clean API boundary
- No plane calls another plane synchronously — coordination happens via **events**
- All AI decisions go through the **Ethics Engine** before execution
- Human beings retain override authority over all agent actions

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                                 │
│  Citizen Portal │ Gov Dashboard │ Investor │ NGO │ Mission Ctrl │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / WSS
┌────────────────────────────▼────────────────────────────────────┐
│                    API GATEWAY                                    │
│  Rate Limiting │ JWT Auth │ Zero Trust │ CORS │ API Versioning   │
└────────┬────────────┬────────────┬───────────┬────────────────┬─┘
         │            │            │           │                │
  ┌──────▼──┐  ┌──────▼──┐ ┌──────▼──┐ ┌──────▼──┐    ┌──────▼──┐
  │ INTELLI │  │  TRUST  │ │  VALUE  │ │ COORD.  │    │PLANETARY│
  │  GENCE  │  │  PLANE  │ │  PLANE  │ │  PLANE  │    │  PLANE  │
  │  PLANE  │  │         │ │         │ │         │    │         │
  └────┬────┘  └────┬────┘ └────┬────┘ └────┬────┘    └────┬────┘
       │            │            │           │              │
       └────────────┴────────────┴───────────┴──────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      EVENT BUS           │
                    │  Kafka / Redis Pub-Sub   │
                    └─────────────────────────┘
```

### Technology Decisions

| Layer          | Technology                          | Rationale |
|----------------|-------------------------------------|-----------|
| Runtime        | Node.js 22 + TypeScript 5.5         | Existing codebase, great async IO |
| API            | Express.js + OpenAPI                | Mature, well-understood |
| Primary DB     | PostgreSQL 16 + PostGIS + pgvector  | Unified: relational + geo + vector |
| Cache          | Redis 7 Cluster                     | Sessions, pub-sub, feature flags |
| Documents      | MongoDB                             | Knowledge graph raw storage |
| Graph DB       | Neo4j                               | Entity relationship traversal |
| OLAP           | ClickHouse                          | Analytics, dashboards |
| Event Stream   | Kafka (Confluent Cloud)             | Durable, ordered, replay-capable |
| Time Series    | TimescaleDB (PG extension)          | Planetary measurements |
| Vector Search  | pgvector (PG extension)             | Semantic search, agent memory |
| AI Gateway     | Custom (OpenAI + Anthropic + Bedrock) | Multi-provider resilience |
| Blockchain     | Polygon + Cardano + Cosmos          | Carbon credits + identity + governance |
| Workflows      | Temporal                            | Durable execution, retries |
| Containers     | Docker + Kubernetes (EKS)           | Cloud-native, horizontal scaling |
| IaC            | Terraform                           | Declarative infra |
| CI/CD          | GitHub Actions                      | Existing pipeline |
| Observability  | OpenTelemetry + Prometheus + Grafana | Standards-based |

---

## 3. Five Planes

### 3.1 Intelligence Plane

**Purpose:** All AI reasoning, memory, knowledge, agent orchestration, ethics enforcement.

**Components:**
- LLM Gateway: multi-provider routing (OpenAI → Anthropic → Bedrock fallback chain)
- Model Router: selects provider based on task type, cost, latency SLA
- Prompt Library: versioned prompts stored in DB, A/B tested
- Memory: Redis (working) + pgvector (episodic/semantic) + MongoDB (procedural)
- Ethics Engine: every AI output checked against 6 principles; blocks violations
- Planning Engine: goal decomposition into executable step graphs
- Reasoning Engine: chain-of-thought with structured JSON output
- Agent Runtime: ReAct loop — Plan → Act → Observe → Reflect

**Key API:**
```
POST /api/v3/sanctum/intelligence/chat
POST /api/v3/sanctum/intelligence/reason
POST /api/v3/sanctum/intelligence/plan
POST /api/v3/sanctum/intelligence/search
POST /api/v3/sanctum/intelligence/agent/:id/run
POST /api/v3/sanctum/intelligence/ethics/evaluate
```

**Scaling:** Stateless — scale horizontally. LLM calls are the bottleneck; mitigate with:
- Response caching in Redis (TTL 1h for identical prompts)
- Async task queue for non-interactive agent runs
- Timeout: 30s hard limit per LLM call

**Events Emitted:**
- `intelligence.chat.completed`
- `intelligence.agent.task.completed`
- `intelligence.ethics.violation`
- `intelligence.plan.generated`

---

### 3.2 Trust Plane

**Purpose:** Decentralized identity, verifiable credentials, ZK proofs, blockchain anchoring, Zero Trust.

**Components:**
- DID Registry: `did:sanctum:{tenantId}:{uuid}` — stored in PostgreSQL
- Credential Issuer: W3C VC Data Model 2.0 compliant
- Proof Engine: Groth16 ZK proof interface (snarkjs in production)
- Chain Anchoring: SHA-256 content hash → Polygon txn (async, non-blocking)
- Zero Trust Engine: 5-factor continuous trust scoring
- Device Trust Registry: known device management

**Zero Trust Factors:**
1. Auth method (Passkey=100, MFA-OTP=90, Password=50)
2. MFA verification status
3. IP reputation (threat intel feed)
4. Session freshness
5. Device trust registry

**Events Emitted:**
- `trust.did.created`
- `trust.credential.issued`
- `trust.credential.revoked`
- `trust.chain.anchor.confirmed`
- `trust.zero_trust.step_up_required`

---

### 3.3 Value Plane

**Purpose:** Treasury management, RIU marketplace, carbon credit lifecycle, payments, bonds.

**Components:**
- Market Engine: order matching, dynamic pricing ($25 base → up to $70)
- Treasury Manager: reserve ratio monitoring, auto-rebalancing
- Credit Lifecycle: mint → verify → list → trade → retire → certify
- Payment Gateway: Stripe + Paystack + Coinbase + Crypto
- Bond Registry: regeneration-backed bonds (3.8%-6.5% coupons)
- Retirement Certificates: IPFS + blockchain anchored

**Pricing Model:**
```
final_price = base_price × (1 + co2_factor×0.45 + biodiversity_factor×0.35 + health_factor×0.20)
co2_factor = ndvi_trend_score × soil_carbon_multiplier
```

**Events Emitted:**
- `value.trade.executed`
- `value.credit.minted`
- `value.credit.retired`
- `value.treasury.rebalanced`
- `value.payment.completed`

---

### 3.4 Coordination Plane

**Purpose:** DAO governance, quadratic voting, workflow orchestration, multi-agent delegation, notifications.

**Voting Mechanism:** Quadratic voting — vote weight = √(tokens staked). Supermajority threshold configurable per proposal type.

**Proposal Lifecycle:**
```
draft → active (voting period) → passed/rejected → executed
                                                  ↓
                                            chain_anchored
```

**Workflow Engine:** Temporal-compatible interface. In dev/test: inline sequential runner. In production: Temporal workers.

**Human Approval Gate:**
- Agents pause execution and emit `approval_request` event
- Approvers notified via WebSocket + email
- 24h default timeout; configurable per task
- Approval/rejection resumes the agent task queue

**Events Emitted:**
- `coordination.proposal.created`
- `coordination.vote.cast`
- `coordination.proposal.executed`
- `coordination.workflow.completed`
- `coordination.approval.requested`
- `coordination.approval.decided`

---

### 3.5 Planetary Plane

**Purpose:** Earth observation, IoT ingestion, carbon measurement, anomaly detection, digital twins.

**Data Sources:**
- Sentinel-2 (10m resolution, 5-day revisit)
- Landsat 8/9 (30m resolution, 16-day revisit)
- Ground sensors (IoT via MQTT/AWS IoT Greengrass)
- Manual field measurements
- Drone surveys

**NDVI Formula:**
```
NDVI = (NIR - Red) / (NIR + Red)   [Sentinel-2: B08 vs B04]
Range: -1 (water/bare) to +1 (dense vegetation)
```

**Carbon Flux:**
```
Net Flux = Σ(positive_measurements) - Σ(negative_measurements)
Uncertainty: 8% (IPCC Tier 2 methodology)
```

**Anomaly Detection:** Z-score (σ=2.5 threshold). Production: add Isolation Forest for multivariate anomalies.

**Digital Twin Divergence Score:**
```
divergence = ||physical_vector - virtual_vector|| / ||physical_vector||
```

**Events Emitted:**
- `planetary.measurement.ingested`
- `planetary.anomaly.detected`
- `planetary.ndvi.computed`
- `planetary.carbon.flux.updated`
- `planetary.twin.diverged`

---

## 4. Database Decisions

### Decision: Unified PostgreSQL + Extensions vs. Separate Databases

**Chosen:** PostgreSQL 16 as the primary store with:
- `pgvector` for embeddings (1536-dim OpenAI)
- `PostGIS` for geospatial queries
- `TimescaleDB` for time-series (hypertables)

**Rationale:**
- Single ACID transaction surface across domains
- Eliminates distributed transaction complexity
- RLS (Row Level Security) for tenant isolation in one engine
- Operational simplicity at initial scale (< 10M rows per table)

**When to split:** When any single table exceeds 100M rows or query p99 > 100ms despite indexing → migrate to dedicated service.

### Secondary Stores

| Store       | When Used                           |
|-------------|-------------------------------------|
| Redis       | Cache, sessions, pub-sub, agent queues, feature flags |
| MongoDB     | Unstructured knowledge graph nodes, prompt library versions |
| Neo4j       | Entity relationship traversal, impact pathway analysis |
| ClickHouse  | Analytics queries (GROUP BY, time-bucketed aggregations) |

### Index Strategy

```sql
-- Hot paths:
-- 1. Vector similarity search
CREATE INDEX idx_vector_ivfflat ON vector_embeddings
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 2. Geospatial measurements
CREATE INDEX idx_measurements_geom ON planetary_measurements USING GIST(location);

-- 3. Time-series (TimescaleDB chunk compression at 7d)
SELECT add_compression_policy('planetary_measurements', INTERVAL '7 days');

-- 4. Tenant isolation (all tenant-scoped tables)
CREATE INDEX ON <table>(tenant_id, created_at DESC);
```

---

## 5. API Platform

### Versioning Strategy

| Version | Status         | Routes |
|---------|---------------|--------|
| v1      | Deprecated    | /api/auth, /api/marketplace, /api/measurements |
| v2      | Active        | /api/v2/auth, /api/v2/marketplace, /api/v2/measurements |
| v3      | COS (new)     | /api/v3/sanctum/{plane}/... |

### Rate Limits

| Endpoint Type      | Limit         | Window |
|--------------------|---------------|--------|
| Auth               | 10 req        | 15 min |
| Payment            | 10 req        | 15 min |
| AI Chat            | 60 req        | 1 min  |
| Marketplace        | 500 req       | 1 min  |
| General API        | 100 req       | 15 min |
| WebSocket msgs     | 100 msg       | 1 min  |

### OpenAPI Spec

Full spec at: `backend/openapi.yaml` (existing) + `docs/openapi-v3-cos.yaml` (generated from routes)

### SDK Generation

```bash
npx openapi-generator-cli generate \
  -i docs/openapi.yaml -g typescript-axios \
  -o packages/sdk/src/generated
```

---

## 6. Multi-Agent Platform

### Agent Types and Capabilities

| Agent               | Primary Tools                        | Approval Required |
|--------------------|--------------------------------------|-------------------|
| Finance Agent       | market_stats, treasury, risk, trade  | trade, rebalance  |
| Health Agent        | health_metrics, alert, recommend     | medical_action    |
| Research Agent      | semantic_search, web_search, reason  | publish           |
| Policy Agent        | proposal_create, vote, analyze       | execute_proposal  |
| Emergency Agent     | alert_broadcast, coordinate, escalate| mass_notification |
| Infrastructure Agent| deploy, scale, rollback              | all_actions       |

### ReAct Loop (Base Agent)

```
TASK → [Ethics Check] → PLAN
  ↓
THINK: "What should I do next?"
  ↓
ACT: call tool(name, args)
  ↓
[Human Approval Gate if required]
  ↓
OBSERVE: tool result
  ↓
REFLECT: update working memory
  ↓
→ repeat until final_answer or max_steps
```

### Memory Architecture

```
┌─ Working Memory (Redis, 24h TTL) ──────────────────────┐
│ Current task context, tool results, intermediate steps  │
└─────────────────────────────────────────────────────────┘
┌─ Episodic Memory (pgvector, semantic search) ───────────┐
│ Past task outcomes, indexed by embedding                │
└─────────────────────────────────────────────────────────┘
┌─ Semantic Memory (pgvector + Neo4j) ────────────────────┐
│ Domain knowledge, facts, entity relationships           │
└─────────────────────────────────────────────────────────┘
┌─ Procedural Memory (MongoDB) ───────────────────────────┐
│ How-to guides, workflow templates, tool usage patterns  │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Security Architecture

### Zero Trust Principles

1. **Never trust, always verify** — every request re-authenticated
2. **Least privilege** — RBAC + ABAC, no wildcard grants except super_admin
3. **Assume breach** — all internal traffic mTLS; audit every state change
4. **Microsegmentation** — Kubernetes NetworkPolicy restricts pod-to-pod traffic

### Encryption

| Data State | Algorithm                    |
|------------|------------------------------|
| In transit | TLS 1.3                      |
| At rest    | AES-256-GCM (AWS KMS)        |
| Tokens     | JWT RS256 (asymmetric keys)  |
| Passwords  | bcrypt (cost factor 12)      |
| PII fields | Field-level AES-256-GCM      |

### Secrets Management

- **Production:** AWS Secrets Manager + KMS (rotated every 30 days)
- **Dev/staging:** `.env` files (never committed; `.gitignore` enforced)
- Runtime injection via Kubernetes ExternalSecrets operator

### Threat Model (STRIDE)

| Threat | Mitigation |
|--------|-----------|
| Spoofing | JWT RS256 + MFA + Zero Trust scoring |
| Tampering | HMAC request signing, audit immutable log, chain anchors |
| Repudiation | Append-only audit log, blockchain anchors |
| Info Disclosure | Field-level encryption, RLS, no stack traces in prod |
| Denial of Service | Rate limiting (per-IP, per-user, per-tenant), HPA auto-scale |
| Elevation of Privilege | RBAC hierarchy, ABAC policies, session regeneration on role change |

---

## 8. Scaling Strategy

### Horizontal Scaling by Plane

| Plane          | Bottleneck             | Strategy |
|----------------|------------------------|----------|
| Intelligence   | LLM API latency        | Request queuing + async workers + response caching |
| Trust          | DB writes (DID/VC)     | Read replicas + connection pool (pgBouncer) |
| Value          | Trade matching         | Redis sorted sets for order book; async settlement |
| Coordination   | Vote counting          | Redis atomic INCR; Kafka for eventual consistency |
| Planetary      | Measurement ingestion  | Kafka consumer group fan-out; TimescaleDB compression |

### Caching Layers

```
Browser → CDN (static assets) → API Gateway (response cache 60s)
       → Service (Redis cache 5-60min) → DB
```

### Database Connection Pooling

```
App pods (N) → pgBouncer (transaction mode) → PostgreSQL (max_connections=200)
Max connections per pod: 10
pgBouncer pool size: 100
```

---

## 9. Deployment

### Environments

| Env        | Config                        | Deployment |
|------------|-------------------------------|------------|
| local      | docker-compose.yml            | `./start.sh` |
| staging    | k8s/overlays/staging/         | ArgoCD auto-sync |
| production | k8s/overlays/production/      | ArgoCD manual gate |

### Blue-Green Deployment

```bash
# Tag blue (current)
kubectl label deployment sanctum-api slot=blue -n atlas-sanctum

# Deploy green
kubectl apply -f k8s/green/sanctum-api.yaml

# Wait for green readiness
kubectl rollout status deployment/sanctum-api-green -n atlas-sanctum

# Switch traffic
kubectl patch service sanctum-api -n atlas-sanctum -p '{"spec":{"selector":{"slot":"green"}}}'

# Verify then delete blue
kubectl delete deployment sanctum-api-blue -n atlas-sanctum
```

### Canary Releases

Use Argo Rollouts with 5% → 25% → 100% traffic progression with automatic rollback on p99 > 500ms.

---

## 10. Observability

### Three Pillars

**Metrics** (Prometheus + Grafana)
```
sanctum_http_requests_total{method,route,status}
sanctum_http_duration_seconds{method,route}
sanctum_llm_tokens_used_total{provider,model}
sanctum_agent_tasks_total{agent_type,status}
sanctum_measurement_ingested_total{type,source}
sanctum_chain_anchor_confirmations_total{chain}
```

**Traces** (OpenTelemetry → Jaeger / Tempo)
- Distributed trace context propagated via `traceparent` header
- Sampling: 10% in production, 100% for errors
- Key spans: DB queries, Redis ops, LLM calls, chain RPC

**Logs** (Winston JSON → CloudWatch / Loki)
```json
{
  "level": "info",
  "timestamp": "2026-06-29T12:00:00Z",
  "service": "atlas-sanctum-api",
  "traceId": "abc123",
  "plane": "intelligence",
  "userId": "uuid",
  "tenantId": "uuid",
  "message": "Agent task completed",
  "duration_ms": 4520
}
```

### Alerts

| Alert                           | Threshold          | Severity |
|---------------------------------|--------------------|----------|
| API p99 latency                 | > 2s for 5m        | P1       |
| Error rate                      | > 1% for 3m        | P1       |
| Kafka consumer lag              | > 10,000 msgs      | P2       |
| Ethics violations per hour      | > 10               | P1       |
| Chain anchor failures           | > 5%               | P2       |
| Anomaly detection lag           | > 30 min           | P2       |

---

## 11. Testing Strategy

### Test Pyramid

```
          ┌─────────┐
          │   E2E   │  5% (Playwright — critical user flows)
        ┌─┴─────────┴─┐
        │ Integration │  25% (Supertest — API + DB)
      ┌─┴─────────────┴─┐
      │      Unit       │  70% (Vitest — services, utils)
      └─────────────────┘
```

### Key Test Cases

```typescript
// Unit: Ethics Engine blocks violation
test('ethics engine blocks exploitation', async () => {
  const result = await plane.evaluateEthics(
    'Extract value from indigenous communities without consent',
    { plane: 'value', action: 'marketplace.list', stakes: 'high' }
  );
  expect(result.passed).toBe(false);
  expect(result.violations[0].severity).toBe('severe');
});

// Integration: Agent approval gate triggers on trade
test('finance agent pauses for approval on trade', async () => {
  process.env.AGENT_HUMAN_APPROVAL_REQUIRED = 'true';
  const result = await financeAgent.run(tradeTask, intelligence, coordination);
  expect(result.status).toBe('awaiting_approval');
});

// Integration: Zero Trust blocks untrusted IP
test('zero trust denies blacklisted IP', async () => {
  await redis.set('sanctum:ip:blacklist:1.2.3.4', '1');
  const score = await trustPlane.checkZeroTrust({ ipAddress: '1.2.3.4', ... });
  expect(score.accessGranted).toBe(false);
});
```

---

## 12. Future Extensions

### Phase 1 (Month 1-3)
- [ ] GraphQL API gateway (Apollo Federation) across all planes
- [ ] Real snarkjs ZK proof circuit for carbon credit verification
- [ ] Temporal worker deployment for durable workflows
- [ ] ClickHouse analytics pipeline from Kafka

### Phase 2 (Month 4-6)
- [ ] Post-quantum cryptography (CRYSTALS-Kyber, CRYSTALS-Dilithium)
- [ ] Cross-chain communication (IBC for Cosmos ↔ Polygon bridge)
- [ ] Digital twin physics simulation (Earth2Studio integration)
- [ ] Multi-modal AI (vision: satellite image analysis in-plane)

### Phase 3 (Month 7-12)
- [ ] Federated learning across tenant data (differential privacy)
- [ ] Offline-first sync for field agents (CRDTs + IndexedDB)
- [ ] Interplanetary Network Protocol (IPFS content addressing)
- [ ] Formal verification of smart contracts (Certora Prover)

---

## 13. Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| LLM provider outage | Medium | High | Multi-provider fallback chain; cache responses |
| Kafka consumer lag spike | Low | High | Dead letter queue; consumer group rebalancing alert |
| Smart contract exploit | Low | Critical | Audit by Trail of Bits; timelocked upgrades; bug bounty |
| Vector index degradation | Low | Medium | ivfflat → HNSW migration at 1M vectors |
| GDPR data residency violation | Medium | High | Separate EU-region deployment; field-level encryption |
| Agent runaway loop | Medium | Medium | maxSteps hard cap; token budget; circuit breaker |

---

## 14. Technical Debt

| Item | Priority | Effort | Description |
|------|----------|--------|-------------|
| Migrate v1 routes to v3 | High | Medium | Deprecate /api/auth, /api/marketplace; redirect to v2/v3 |
| Replace console.error with structured logger | Medium | Low | Several files still use raw console |
| Drizzle/Prisma ORM | Medium | High | Raw SQL queries are difficult to refactor; add type-safe ORM layer |
| Real Ed25519 DID signing | High | Medium | Currently using hash-based stub; needs actual key material |
| snarkjs ZK circuits | High | High | ZK proofs are stub implementations |
| Separate Kafka topics per event type | Medium | Low | Currently routed by plane; should be per event type |
| Agent memory compression | Low | Medium | Long sessions accumulate tokens; needs summarization at N turns |

---

## 15. Production Readiness Checklist

### Security
- [x] JWT RS256 asymmetric signing
- [x] bcrypt password hashing (cost 12)
- [x] Rate limiting on all endpoints
- [x] CORS allowlist
- [x] Security headers (Helmet.js)
- [x] Input sanitization
- [x] SQL parameterized queries (no interpolation)
- [x] Audit logging on all state changes
- [x] Zero Trust scoring middleware
- [ ] mTLS between services (in progress)
- [ ] Secrets rotation automation
- [ ] Penetration test (scheduled Q3 2026)

### Reliability
- [x] Health check `/health` + readiness `/ready`
- [x] Graceful shutdown (SIGTERM handler)
- [x] Redis connection retry with exponential backoff
- [x] LLM provider fallback chain
- [x] DB connection pool (pgBouncer)
- [ ] Circuit breaker for external services (Kafka, chain RPC)
- [ ] Chaos engineering (Chaos Mesh tests)

### Observability
- [x] OpenTelemetry tracing
- [x] Prometheus metrics endpoint
- [x] Structured JSON logging
- [x] Sentry error reporting
- [ ] Grafana dashboards for all planes
- [ ] PagerDuty alert routing

### Compliance
- [x] GDPR: user data deletion endpoint
- [x] Audit log retention (2555 days = 7 years)
- [ ] SOC 2 Type II controls documentation
- [ ] Data residency configuration (EU/US/APAC)

---

## 16. Architecture Decision Records

### ADR-001: Event Bus — Kafka over AWS EventBridge

**Status:** Accepted  
**Context:** Need durable, ordered, replay-capable event stream for cross-plane coordination.  
**Decision:** Use Apache Kafka (Confluent Cloud) with Redis Pub/Sub fallback for dev.  
**Consequences:** Higher ops complexity than EventBridge; gained: multi-region, replay, consumer groups.

### ADR-002: Single PostgreSQL over Microservice DBs

**Status:** Accepted  
**Context:** 5 planes need shared data (users, tenants, projects).  
**Decision:** One PostgreSQL cluster with RLS for tenant isolation. Split when p99 > 100ms.  
**Consequences:** Simpler ops; risk: schema coupling. Mitigated by strict interface boundaries.

### ADR-003: ReAct Agent Pattern over Plan-Execute

**Status:** Accepted  
**Context:** Need agents that adapt mid-task based on observations.  
**Decision:** ReAct (Reason + Act) loop with structured JSON output.  
**Consequences:** More tokens per task; gained: adaptive behavior, explainability, interruptibility.

### ADR-004: Ethics-First AI Architecture

**Status:** Accepted  
**Context:** AI agents will make consequential decisions affecting communities and ecosystems.  
**Decision:** Every AI output (agent action, plan, content generation) must pass the Ethics Engine before execution. Hard block on severe violations.  
**Consequences:** Added latency (~500ms); gained: safety, trust, accountability, audit trail.

### ADR-005: Hexagonal Architecture for All Planes

**Status:** Accepted  
**Context:** Planes must be independently deployable and testable.  
**Decision:** All planes implement a Port interface. External dependencies (DB, Redis, LLM APIs) are Adapters.  
**Consequences:** More boilerplate; gained: easy swapping of adapters, testability without infrastructure.

---

*Built to help humanity flourish — one cryptographically verified, ethically evaluated, regeneratively designed decision at a time.*
