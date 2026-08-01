# Atlas Sanctum — Backend API

Node.js / Express API server for the Atlas Sanctum platform.

## Open Surface

| Path | Purpose |
|------|---------|
| `src/routes/` | REST API route definitions |
| `src/types/` | TypeScript type contracts |
| `openapi.yaml` | OpenAPI 3.0 specification |
| `.env.example` | Environment variable documentation |

## Getting Started

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Environment

See `.env.example` for all required variables.

## API Reference

See `openapi.yaml` or the live docs at `/api-docs` when running locally.

## Architecture

The backend follows Clean Architecture with hexagonal ports:

- `src/routes/` — HTTP adapters (open)
- `src/types/` — Domain contracts (open)
- `src/services/` — Business logic (private)
- `src/core/` — Auth, RBAC, tenant isolation (private)

See `docs/ARCHITECTURE_DECISIONS.md` for ADRs.
