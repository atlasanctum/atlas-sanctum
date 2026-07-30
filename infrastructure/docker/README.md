# infrastructure/docker/

Docker configurations for local development and CI.

Production Docker files live at the repo root (`Dockerfile`, `Dockerfile.production`).
This directory contains service-specific and compose configurations.

## Files

| File | Purpose |
|------|---------|
| `docker-compose.dev.yml` | Full local development stack |
| `docker-compose.test.yml` | Integration test stack (ephemeral) |
| `Dockerfile.backend` | Backend service image |
| `Dockerfile.chain` | Cosmos chain node image |

## Quick Start (Local Dev)

```bash
# Start full local stack
docker compose -f infrastructure/docker/docker-compose.dev.yml up

# Services started:
#   - PostgreSQL      :5432
#   - Redis           :6379
#   - Backend API     :3001
#   - Chain node      :26657
#   - Prometheus      :9090
```

## Production

Production images are built via GitHub Actions (`.github/workflows/atlas-cicd.yml`).
See `DEPLOYMENT_GUIDE.md` for production deployment instructions.
