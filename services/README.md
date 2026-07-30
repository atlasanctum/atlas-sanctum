# services/

Atlas Sanctum backend microservices. Each service owns a bounded domain context.

| Service | Domain | Primary Tech |
|---------|--------|-------------|
| `ai/` | Multi-agent intelligence, LLM orchestration, embeddings | Node.js + Python |
| `blockchain/` | On-chain anchoring, smart contracts, ZK proofs, token issuance | Go + Solidity |
| `analytics/` | Time-series metrics, impact aggregation, CQRS read models | Node.js + ClickHouse |
| `identity/` | DID, verifiable credentials, zero-trust auth, RBAC | Go (Cosmos SDK) |
| `payments/` | Regenerative credit payments, Stripe, PayPal, Paystack, DeFi | Node.js |

## Architecture

All services communicate via the event bus (`backend/src/events/`).
Each service exposes a REST + gRPC interface.
Service boundaries follow Domain-Driven Design — no cross-service database access.

## Current State

Service implementations live in `backend/src/services/` and `chain/x/`.
Migration to this `services/` monorepo structure is in progress.
