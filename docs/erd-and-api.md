# Minimal ERD and API Contract — Atlas Sanctum (MVP)

ERD (Mermaid)
```
erDiagram
    USERS ||--o{ ORGS : owns
    ORGS ||--o{ ASSETS : contains
    USERS ||--o{ ASSETS : owns
    ASSETS ||--o{ MEASUREMENTS : has
    ASSETS ||--o{ TOKENS : issues
    ASSETS ||--o{ LISTINGS : listed_as
    LISTINGS ||--o{ ORDERS : creates
    PROPOSALS ||--o{ VOTES : receives
    USERS ||--o{ VOTES : casts
```

API Contract (selected endpoints)

1) Auth
- POST /api/auth/signup
  - request: { email, password, displayName }
  - response 201: { id, email, displayName, token }

- POST /api/auth/login
  - request: { email, password }
  - response 200: { token, refreshToken, user }

2) Assets
- POST /api/assets
  - auth required
  - request: { title, type, metadata }
  - response 201: { id, status, ... }

- GET /api/assets/:id
  - response 200: { id, ownerId, metadata, status, metrics }

3) Measurements
- POST /api/measurements
  - auth required or signed upload
  - request: { assetId, source, timestamp, geo, metrics, provenance }
  - response 201: { id, validated: false }

4) Marketplace
- GET /api/marketplace/listings
  - query: ?page&size&status
  - response 200: { listings: [ { id, assetId, price, seller } ], total }

- POST /api/marketplace/:id/purchase
  - auth required
  - request: { buyerId, paymentMethod }
  - response 201: { orderId, status }

5) Governance
- POST /api/governance/proposals
  - request: { title, body, choices, startAt, endAt }
  - response 201: { proposalId }

- POST /api/governance/proposals/:id/vote
  - request: { voterId, choice }
  - response 200: { success: true }

Example JSON schema (asset create)
```
{
  "title": "Reforestation — Lot A",
  "type": "carbon-credit",
  "metadata": {
    "hectares": 25,
    "location": {"lat": 37.7, "lng": -122.4},
    "projectId": "proj_abc123"
  }
}
```

Validation & Errors
- Standardize error envelope: { code, message, details? }
- 401 for unauthorized, 422 for validation errors, 500 for server errors.

Contract Notes
- Prefer GraphQL for frontend efficiency, but REST is fine for Phase 0.
- Provide OpenAPI spec (YAML) from the above contract for client generation.
