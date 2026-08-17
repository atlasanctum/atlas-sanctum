# Architecture

Atlas Sanctum is a cloud-native, AI-native regenerative operating system.
This document describes the high-level architecture and key design decisions.

For detailed ADRs, see [`docs/adr/`](../../docs/adr/).

---

## System Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Client Applications                    │
│  Dashboard · Marketplace · Governance · Mobile · SDK    │
├─────────────────────────────────────────────────────────┤
│                    API Gateway                           │
│         REST (v1/v2/v3) · GraphQL · WebSocket           │
├─────────────────────────────────────────────────────────┤
│              Constitutional Operating System             │
│   Intelligence · Trust · Coordination · Planetary · RVX │
├─────────────────────────────────────────────────────────┤
│                  Backend Services                        │
│  Identity · Marketplace · Governance · Finance · AI     │
├─────────────────────────────────────────────────────────┤
│                  AI Service Layer                        │
│  Agent Network · LangGraph · Knowledge Commons · Twins  │
├─────────────────────────────────────────────────────────┤
│                  Data & Chain Layer                      │
│  PostgreSQL · Redis · Neo4j · InfluxDB · Sanctum-1      │
├─────────────────────────────────────────────────────────┤
│                  Sensor & Observation Layer              │
│  IoT Greengrass · Satellite · Ocean Buoys · Community   │
└─────────────────────────────────────────────────────────┘
```

---

## Bounded Contexts (DDD)

Each bounded context owns its data and communicates only via domain events.

| Context | Owns | Events Published |
|---------|------|-----------------|
| `identity` | users, profiles, DIDs, credentials | `user.registered`, `did.created` |
| `marketplace` | listings, orders, credits | `listing.created`, `trade.settled` |
| `intelligence` | agent_runs, audit_entries | `ai.request.processed`, `ethics.blocked` |
| `governance` | proposals, votes, covenants | `proposal.passed`, `vote.cast` |
| `finance` | subscriptions, invoices, payments | `payment.processed` |
| `measurement` | measurements, twins, sensors | `measurement.ingested`, `twin.updated` |
| `knowledge` | knowledge_assets, research | `knowledge.indexed` |

---

## Constitutional Operating System (COS)

The COS is the ethical backbone of the platform. Five planes:

### Intelligence Plane
- 13-layer AI type system (`src/sanctum-ai/`)
- Constitutional pre-flight on every AI action
- Ethics scoring (0–1) with hard block at < 0.3
- Human-in-the-loop gates for high-stakes decisions

### Trust Plane
- Zero-trust architecture (ADR-017)
- mTLS between all services
- JWT expiry ≤ 15 minutes
- ZK proofs for impact verification

### Coordination Plane
- Event-driven integration (ADR-014)
- Domain event bus (`backend/src/events/`)
- CQRS: separate write (commands) and read (queries) models

### Planetary Plane
- Digital twins for every monitored ecosystem
- Real-time sensor fabric (IoT + satellite + ocean)
- Divergence monitoring with automated alerts

### Value Plane (RVX)
- Regenerative Value Exchange
- Credit types: carbon, biodiversity, water, ocean, community, healthcare
- On-chain anchoring via Sanctum-1 (Cosmos SDK)
- Cross-chain bridges to Ethereum/Polygon

---

## AI Architecture (13 Layers)

```
Layer 1  — Perception          (sensor ingestion, satellite, community reports)
Layer 2  — Memory              (vector DB, knowledge graph, episodic memory)
Layer 3  — Reasoning           (LLM inference, chain-of-thought, uncertainty)
Layer 4  — Planning            (goal decomposition, resource allocation)
Layer 5  — Learning            (feedback loops, model fine-tuning)
Layer 6  — Communication       (natural language, multi-lingual, accessibility)
Layer 7  — Collaboration       (multi-agent coalitions, consensus protocols)
Layer 8  — Ethics              (constitutional pre-flight, FPIC, harm prevention)
Layer 9  — Adaptation          (context switching, domain specialization)
Layer 10 — Planetary Twins     (real-time ecosystem digital models)
Layer 11 — Civilizational      (long-horizon planning, seven-generation modeling)
Layer 12 — Consciousness       (self-monitoring, meta-cognition, drift detection)
Layer 13 — Governance Audit    (immutable audit ledger, explainability, appeals)
```

---

## Data Flow

```
IoT Sensors / Satellites
        │
        ▼
  Kinesis Data Streams (AWS)
        │
        ▼
  Sensor Fabric (SensorFabric.ts)
        │
        ▼
  Digital Twin Sync (PlanetaryTwins.ts)
        │
        ▼
  AI Analysis (AgentNetwork / LangGraph)
        │
        ▼
  Knowledge Commons (Neo4j + Weaviate)
        │
        ▼
  Impact Verification (ZK Proof + Oracle)
        │
        ▼
  Blockchain Anchoring (Sanctum-1)
        │
        ▼
  GraphQL API → Atlas Dashboard
```

---

## Infrastructure

- **Cloud**: AWS (primary), Azure (secondary), GCP (AI/ML)
- **Orchestration**: Kubernetes (EKS) with ArgoCD GitOps
- **IaC**: Terraform (variables open, state private)
- **Observability**: OpenTelemetry → Prometheus → Grafana
- **CI/CD**: GitHub Actions (`.github/workflows/`)
- **Secrets**: AWS Secrets Manager (never in env vars)

See [`infrastructure/`](../../infrastructure/) for K8s manifests and Terraform variables.

---

## Security Model

- Zero Trust: every request authenticated regardless of network origin
- mTLS between all internal services
- Input validation on every API endpoint
- Prompt injection filter on every LLM-bound input
- PII stripped from all logs
- FPIC check before any indigenous knowledge access
- Ethics pre-flight before any AI action with real-world consequences

See [`docs/ZERO_TRUST_ARCHITECTURE.md`](../../docs/ZERO_TRUST_ARCHITECTURE.md) for full details.
