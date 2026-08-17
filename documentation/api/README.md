# API Reference

Atlas Sanctum exposes three API layers. All are versioned and documented via OpenAPI.

## REST API (primary)

Base URL: `https://api.atlassanctum.com`
Spec: [`backend/openapi.yaml`](../../backend/openapi.yaml) · [`docs/openapi.yaml`](../../docs/openapi.yaml)

### Versioning

| Version | Status | Notes |
|---------|--------|-------|
| `/api/v1` | Stable | Core impact, governance, identity |
| `/api/v2` | Stable | Marketplace, analytics, billing |
| `/api/v3` | Active | AI orchestration, sensor fabric, digital twins |

### Authentication

All endpoints require a Bearer JWT unless marked `[public]`.

```
Authorization: Bearer <jwt>
```

JWTs are issued by Supabase Auth. Expiry: 15 minutes. Refresh via `/auth/refresh`.

### Core Endpoints

#### Impact

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/impact/planetary-metrics` | Real-time planetary health indicators |
| GET | `/api/v1/impact/projects` | List impact projects (filterable) |
| GET | `/api/v1/impact/projects/:id` | Get project detail |
| POST | `/api/v1/impact/verifications` | Submit impact verification |
| GET | `/api/v1/impact/credits` | List regenerative credits |

#### Governance

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/governance/proposals` | List DAO proposals |
| POST | `/api/v1/governance/proposals` | Submit new proposal |
| POST | `/api/v1/governance/proposals/:id/votes` | Cast vote |
| GET | `/api/v1/governance/proposals/:id/tally` | Get vote tally |

#### AI Orchestration

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v3/sanctum/ai/process` | Run constitutional AI request |
| GET | `/api/v3/sanctum/ai/agents` | List agent network status |
| GET | `/api/v3/sanctum/ai/explainability/:id` | Get AI decision explanation |

#### Marketplace

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v2/marketplace/listings` | List credit listings |
| POST | `/api/v2/marketplace/orders` | Place buy order |
| GET | `/api/v2/marketplace/orders/:id` | Get order status |

---

## GraphQL API (read layer)

Endpoint: `https://api.atlassanctum.com/graphql`
Schema: [`services/ai/graphql/schema.graphql`](../../services/ai/graphql/schema.graphql)

The GraphQL layer is the primary read interface for the Atlas Dashboard and external integrators.
All queries are read-only (CQRS read model). Mutations go through the REST API.

### Example Query

```graphql
query PlanetaryDashboard {
  planetaryMetrics {
    carbonBudgetRemainingGt
    biodiversityIntactnessIndex
    hectaresProtected
    agentsOnline
  }
  agents {
    agentId
    role
    status
    ethicsScore
  }
}
```

---

## gRPC API (chain)

The Cosmos SDK chain exposes gRPC services for on-chain operations.
Proto definitions: [`chain/proto/`](../../chain/proto/)

| Service | Package | Description |
|---------|---------|-------------|
| `Msg` / `Query` | `sanctum.impact.v1` | Impact anchoring |
| `Msg` / `Query` | `sanctum.governance.v1` | On-chain governance |
| `Msg` / `Query` | `sanctum.identity.v1` | DID management |
| `Msg` / `Query` | `sanctum.rewards.v1` | RIU token rewards |
| `Msg` / `Query` | `sanctum.oracle.v1` | Oracle attestations |
| `Msg` / `Query` | `sanctum.regeneration.v1` | Regeneration actions |

---

## SDK

```bash
npm install @atlas-sanctum/sdk
```

```typescript
import { AtlasSanctumClient } from '@atlas-sanctum/sdk';

const client = new AtlasSanctumClient({
  apiUrl: 'https://api.atlassanctum.com',
  token: '<your-jwt>',
});

const metrics = await client.impact.getPlanetaryMetrics();
```

Full SDK reference: [`packages/sdk/`](../../packages/sdk/)
Quickstart example: [`examples/sdk/quickstart.ts`](../../examples/sdk/quickstart.ts)

---

## Webhooks

Atlas Sanctum emits webhooks for key platform events.

| Event | Trigger |
|-------|---------|
| `impact.project.verified` | Project verification completed |
| `governance.proposal.passed` | DAO proposal passed |
| `marketplace.order.settled` | Credit trade settled |
| `payment.processed` | Payment confirmed |
| `agent.ethics.blocked` | AI action blocked by ethics engine |
| `sensor.alert.critical` | Critical sensor threshold exceeded |

Register webhook endpoints via `POST /api/v2/webhooks`.
All payloads are signed with HMAC-SHA256 using your webhook secret.
