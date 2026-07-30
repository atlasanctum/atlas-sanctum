# Architecture

This document describes Atlas Sanctum's system architecture. For high-level platform overview, see `README.md`. For deployment, see `docs/DEPLOYMENT_GUIDE.md`.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Experience Layer                          │
│   React/Next.js SPA  │  Mobile (iOS/Android)  │  Developer SDK  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS / WebSocket
┌──────────────────────────────▼──────────────────────────────────┐
│                         API Gateway                              │
│          Rate Limiting  │  Auth  │  CORS  │  Routing            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼───────┐   ┌──────────▼──────────┐  ┌───────▼───────┐
│  REST API     │   │   AI Services        │  │  WebSocket    │
│  (NestJS)     │   │   (FastAPI/Python)   │  │  (Socket.io)  │
└───────┬───────┘   └──────────┬──────────┘  └───────┬───────┘
        │                      │                      │
┌───────▼──────────────────────▼──────────────────────▼───────┐
│                        Data Layer                             │
│  PostgreSQL  │  Redis  │  Neo4j  │  Pinecone  │  Elasticsearch│
└──────────────────────────────────────────────────────────────┘
```

---

## Frontend

### Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router v6 | Client-side routing |
| Supabase JS | Auth + realtime |
| Tanstack Query | Server state |

### Key Patterns

**Code Splitting** — All page-level components are lazy-loaded via `React.lazy()`. The initial bundle contains only the shell, providers, and routing.

**Context Architecture**
```
OnboardingProvider
  └── EnhancedAuthProvider
        └── AIProvider
              └── BlockchainProvider
                    └── App (routes)
```

**Route Protection**
- `ProtectedRoute` — requires authenticated user, optional role check
- `AdminProtectedRoute` — requires admin role via `useAdminAuth`

**Error Boundaries** — `SentryErrorBoundary` at root, `RouteErrorBoundary` per route.

---

## Backend

### Stack

| Technology | Purpose |
|-----------|---------|
| Node.js 20 | Runtime |
| Express / NestJS | HTTP framework |
| TypeScript | Type safety |
| Supabase | Auth + PostgreSQL |
| Redis | Caching + sessions |
| Winston | Structured logging |
| OpenTelemetry | Distributed tracing |

### Directory Structure

```
backend/src/
├── agents/        — AI agent orchestration
├── config/        — Environment and feature flags
├── core/          — Core business logic
├── middleware/     — Auth, rate limiting, logging
├── routes/        — API route handlers
├── sanctum/       — COS plane interfaces
├── services/      — External service clients
├── types/         — Shared TypeScript types
├── utils/         — Utilities
└── validation/    — Request validation schemas
```

### API Design

- REST with OpenAPI 3.0 specification (`openapi.yaml`)
- Versioned at `/api/v2/`
- JSON responses with consistent envelope: `{ data, meta, error }`
- Pagination via cursor (not offset)
- Rate limits: 100 req/15min general, 10 req/15min auth, 10 req/hour payments

---

## Authentication & Authorization

```
User → Supabase Auth → JWT → API Gateway → RBAC Middleware → Handler
```

### Roles

| Role | Access |
|------|--------|
| `public` | Read-only public data |
| `user` | Own data + marketplace |
| `donor` | Donor dashboard |
| `field_agent` | Field data entry |
| `enterprise` | Enterprise features + billing |
| `government` | Government dashboard |
| `ngo` | NGO dashboard |
| `admin` | Full platform access |

### Token Flow

1. User authenticates via Supabase (email/password, OAuth, MFA)
2. Supabase issues JWT with role claims
3. JWT validated on every API request via middleware
4. Row Level Security (RLS) enforced at database level as second layer

---

## Database

### PostgreSQL (Primary)

Hosted on Supabase. All tables have RLS policies enabled.

Key tables:
- `profiles` — User profiles
- `carbon_projects` — Verified regenerative projects
- `credit_holdings` — User carbon credit positions
- `transactions` — Payment and credit transactions
- `api_keys` — Developer API keys
- `feature_flags` — Runtime feature toggles
- `audit_logs` — Security audit trail

Migrations in `supabase/migrations/` and `database/migrations/`.

### Redis

Used for:
- Session caching
- Rate limit counters
- Real-time pub/sub for WebSocket events
- API response caching (TTL: 60s for market data, 300s for static data)

### Neo4j (Knowledge Graph)

Stores entity relationships across climate, economic, health, and governance domains. Queried via Cypher for relationship traversal and pattern matching.

### Pinecone (Vector Database)

Stores embeddings for:
- Document semantic search
- AI agent memory
- Similarity matching for project recommendations

---

## AI Pipeline

```
User Query
    │
    ▼
Intent Classification (GPT-4o)
    │
    ▼
Agent Router
    │
    ├── ClimateOracle ──────► Climate Data APIs + Satellite Feeds
    ├── EconoSage ──────────► Economic Indicators + Market Data
    ├── HealthGuardian ─────► Health Surveillance APIs
    ├── GovAnalyst ─────────► Governance Metrics
    ├── AgriAdvisor ────────► Agricultural Data + Soil Sensors
    └── InfraWatcher ───────► Infrastructure Monitoring
    │
    ▼
Response Synthesis
    │
    ▼
Explainability Layer (citations, confidence scores)
    │
    ▼
User Response
```

### AI Services (`src/sanctum-ai/`)

| Module | Purpose |
|--------|---------|
| `agents/` | Individual domain agents |
| `governance/` | AI ethics and alignment checks |
| `interface/` | User-facing AI console |
| `layers/` | Intelligence abstraction layers |
| `memory/` | Agent memory and context |
| `trust/` | Trust scoring and verification |

---

## Blockchain Layer

### Cardano Integration

- Smart contracts for carbon credit verification
- On-chain impact attestation
- Wallet connection via CIP-30

### Cosmos SDK Chain (`sanctumd`)

Custom modules:
- `x/identity` — Decentralized identity (DID)
- `x/impact` — Impact measurement and verification
- `x/oracle` — External data oracle
- `x/rewards` — Regenerative rewards distribution
- `x/governance` — On-chain governance
- `x/knowledge` — Knowledge graph anchoring

---

## Data Ingestion

```
External Sources (APIs, Satellites, IoT)
    │
    ▼
Ingestion Workers (Python/FastAPI)
    │
    ▼
Validation + Normalization
    │
    ▼
PostgreSQL + Neo4j + Elasticsearch
    │
    ▼
Cache Invalidation (Redis)
    │
    ▼
WebSocket Broadcast (real-time subscribers)
```

Data sources include: NASA Earth Data, NOAA, World Bank, WHO, FAO, OpenStreetMap, Copernicus satellite feeds.

---

## Infrastructure

### Cloud

Primary: AWS (EKS, ECR, RDS, ElastiCache, S3)
Secondary: Google Cloud (Earth Engine satellite data)
CDN: Vercel Edge Network (frontend)

### Kubernetes

```
atlas-production namespace
├── atlas-api (3 replicas, HPA)
├── atlas-ai-services (2 replicas)
├── atlas-websocket (2 replicas)
├── redis (StatefulSet)
└── monitoring (Prometheus + Grafana)
```

### CI/CD

```
Push to develop → CI (lint, typecheck, test, build) → Deploy to staging
Push to main    → CI → Deploy to production (blue/green)
```

See `.github/workflows/` for full pipeline definitions.

---

## Security Architecture

- **Zero Trust** — Every request authenticated and authorized, no implicit trust
- **Encryption at rest** — AES-256 for database, S3 server-side encryption
- **Encryption in transit** — TLS 1.3 everywhere
- **Secrets management** — AWS Secrets Manager, never in code or environment files
- **Post-quantum cryptography** — Implemented in `src/crypto/AtlasSanctumPostQuantumService.ts`
- **Audit logging** — All privileged actions logged to immutable audit table

See `docs/ZERO_TRUST_ARCHITECTURE.md` for full security architecture.

---

## Observability

| Signal | Tool |
|--------|------|
| Metrics | Prometheus + Grafana |
| Traces | OpenTelemetry + Jaeger |
| Logs | Winston → CloudWatch |
| Errors | Sentry |
| Uptime | Lighthouse CI |
| Alerts | PagerDuty |

---

## Further Reading

- `docs/ARCHITECTURE_DECISIONS.md` — ADRs for key decisions
- `docs/API_CONTRACTS.md` — API contract specifications
- `docs/ZERO_TRUST_ARCHITECTURE.md` — Security architecture
- `openapi.yaml` — Full API specification
- `src/architecture/` — TypeScript type system and formal specifications
