# Phase 0 Technical Specification — Atlas Sanctum (MVP)

Summary
- Goal: Deliver a minimal, production-directional MVP enabling user auth, asset creation (token prototype), marketplace browse, measurement ingestion (CSV/API), and simple governance voting (testnet).
- Scope: Frontend (React/Vite), Backend (Node/Express or Nest), Database (Postgres via Supabase), Contracts (Hardhat on testnet), Hosting (Vercel + Supabase), CI (GitHub Actions).

Key Principles
- Reuse Supabase for auth, Postgres, and storage to accelerate development.
- Keep on-chain interactions in a separated contracts service with clear testnet deployments.
- Deterministic metrics calculations in backend; ML/streaming deferred to Phase 1.

Endpoints (HTTP / REST + GraphQL suggestions)

Auth
- POST /api/auth/signup — body: {email,password,displayName} -> 201 {user}
- POST /api/auth/login — body: {email,password} -> 200 {token, user}
- GET /api/auth/me — header: Authorization: Bearer -> 200 {user}

Users & Orgs
- GET /api/users/:id
- POST /api/orgs — create organization, owner becomes admin

Assets (RVE assets)
- POST /api/assets — create asset (draft) {title,type,metadata,ownerId} -> 201 {asset}
- GET /api/assets?status=&type=&owner=&page=&size=
- GET /api/assets/:id
- POST /api/assets/:id/issue-token — mint token (backend triggers contract call or returns transaction payload)

Measurements
- POST /api/measurements — ingest measurement {assetId,source,timestamp,geo,metrics,attachments}
- GET /api/assets/:id/measurements

Marketplace
- GET /api/marketplace/listings
- POST /api/marketplace/listings — create listing (escrow integration later)
- POST /api/marketplace/:id/purchase — checkout flow (create order)

Governance (Phase 0 lightweight)
- POST /api/governance/proposals — create proposal {title,body,choices,creatorId}
- GET /api/governance/proposals
- POST /api/governance/proposals/:id/vote — {choice, voterId}

Metrics & Reporting
- GET /api/metrics/asset/:id — returns deterministic metrics (e.g., tCO2e)
- GET /api/metrics/dashboard — aggregate platform KPIs

Webhooks & Background
- POST /api/webhooks/oracle — receive verified oracle updates (HMAC signed)
- Background workers: measurement validation, metrics recalculation, notification delivery

Data Model (Postgres, high-level)
- users (id PK, email, display_name, did, role, created_at)
- orgs (id PK, name, slug, metadata, created_at)
- assets (id PK, org_id FK, owner_id FK, type, metadata jsonb, status, created_at, updated_at)
- measurements (id PK, asset_id FK, source, timestamp, geo jsonb, metrics jsonb, provenance jsonb, created_at)
- tokens (id PK, asset_id FK, token_address, token_id, minted_by, status, metadata jsonb)
- listings (id PK, asset_id FK, seller_id FK, price_amount, currency, status)
- orders (id PK, listing_id FK, buyer_id FK, status, payment_ref)
- proposals (id PK, title, body, choices jsonb, status, start_at, end_at)
- votes (id PK, proposal_id FK, voter_id FK, choice, weight)

Example SQL snippet (assets)
```
CREATE TABLE assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid REFERENCES orgs(id),
  owner_id uuid REFERENCES users(id),
  type text NOT NULL,
  metadata jsonb,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

Cloud Infrastructure (recommended minimal stack)
- Auth & DB: Supabase (Postgres, Auth, Storage) — quick start and local dev via supabase CLI.
- Frontend: Vercel (or Netlify) automatic deploy from GitHub.
- Backend: Node service deployed to Vercel Serverless Functions or Cloud Run (for background jobs use Cloud Run or a worker pool).
- Contracts: use Hardhat locally; deployments to testnets (Goerli/Sepolia/Polygon Mumbai). Store contract artifacts in `contracts/` and as release assets.
- Storage: Supabase Storage (for attachments) or S3 if using AWS infra.
- Background / Queues: Supabase Edge Functions or managed worker (e.g., Cloud Run + Redis / BullMQ). Alternatively, use Supabase Realtime + PostgreSQL LISTEN/NOTIFY.
- Observability: Sentry for errors, Prometheus + Grafana or DataDog for metrics, and Honeycomb for tracing.

Security & Compliance (brief)
- Enforce JWT-based auth, secure refresh token rotation, server-side role checks.
- Sign external measurement uploads and webhooks (HMAC or signature verification).
- Data residency: Supabase allows region selection; plan per jurisdiction.

Developer DX
- Local dev: supabase start (local Postgres), pnpm/yarn workspaces for frontend/backend, Hardhat for contracts.
- CI: GitHub Actions pipeline to lint, test, build, compile contracts, run unit tests.

Next steps (Phase 0 deliverables)
1. Implement Supabase schema migrations for core tables.
2. Scaffold frontend pages: auth, dashboard, asset create, marketplace browse.
3. Implement backend API with validation and auth middleware.
4. Create Hardhat contract for a simple ERC-721/1155 or ERC-20 representing asset tokens and deploy to testnet.
