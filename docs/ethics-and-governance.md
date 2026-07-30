# Moral AI, Governance & Trust — Phase 0 Foundations

This document describes the Phase 0 foundation for: Moral AI Protocols (Ethics Engine), Governance Framework (DAO templates), Values Engine (real-time policy filter), Identity & Reputation (DID & VC stubs), and Transparency & Audit (anchoring & logs).

Goals
- Provide clear interfaces and lightweight implementations so Phase 0 can demonstrate ethical policy enforcement, basic governance voting, identity issuance, and auditable anchors.
- Keep components modular, testable, and replaceable by more powerful services in Phase 1.

Design Principles
- Policy-as-data: policies are represented in a small DSL/JSON schema, stored in DB, and evaluated deterministically.
- Human-in-the-loop: every automated decision logs a finding and offers an override API for authorized roles.
- Anchored evidence: important events (policy violations, governance actions) are anchored to an on-chain hash and stored with encrypted payloads.

Components

1) Ethics Engine (Moral AI Protocols)
- Purpose: Score actions/transactions and flag policy violations.
- Inputs: action object (type, actor, payload, metadata), current policy set.
- Outputs: {score: number, pass: boolean, violations: [{ruleId, message}], recommendedAction: allow|block|manualReview}
- Policy DSL (Phase 0): JSON rules with simple operators (equals, contains, regex, range) and weights. Example:

```json
{
  "id": "no_deforestation",
  "description": "Block assets that indicate deforestation",
  "when": {"payload.landUse":"deforestation"},
  "action": "block",
  "weight": 10
}
```

- Implementation notes: provide an evaluator service (synchronous) and a policy store (DB). Keep ML evaluators as optional plug-ins — in Phase 0 we provide a mock ML scorer that returns deterministic values.

APIs (Phase 0)
- POST /api/ethics/evaluate — body: {action} -> returns evaluation object.
- GET /api/ethics/policies — list active policies.
- POST /api/ethics/policies — create policy (admin).
- POST /api/ethics/override — admin override an evaluation (records decision).

2) Governance Framework (DAO templates)
- Purpose: Provide on-chain voting + off-chain mirrors for UX.
- Contracts: simple VoteToken (ERC20) + DAO contract with proposals, casting votes, and tallying.
- Off-chain: mirror proposals and votes for fast UI (we store proposals in Postgres and periodically reconcile with chain).

On-chain patterns
- Use upgradeable proxy pattern for DAO contract in later phases.
- Keep gas abstraction via relayer: backend signs or relays transactions for users who opt-in.

APIs (Phase 0)
- POST /api/governance/proposals — create proposal (backed in Postgres)
- POST /api/governance/proposals/:id/submit-onchain — optional: submit proposal to DAO contract
- POST /api/governance/proposals/:id/vote — record vote off-chain and optionally on-chain

3) Values Engine (Real-time policy filter)
- Purpose: Enforce policy across modules in real-time (marketplace listing checks, model output filters, transaction gating).
- Implementation (Phase 0): middleware functions and a small policy cache that the middleware queries. Marketplace route calls the values engine before creating a listing.

4) Identity & Reputation
- Purpose: Allow verifiable accounts (DIDs) and reputation scoring.
- Phase 0: DID-style identifiers and verifiable credential issuance stub. Reputation score computed from simple metrics: verified (KYC), assets issued, successful projects.

APIs (Phase 0)
- POST /api/identity/issue-credential — body: {subjectDid, type, claims} -> returns signed VC (JSON-LD or JWT format)
- GET /api/identity/did/:id — return DID document (keys, service endpoints)

5) Transparency & Audit
- Purpose: Store immutable audit records, anchor hashes on-chain, and keep encrypted payloads in storage.
- Phase 0: store audits in Postgres `audits` table, compute SHA256 of payload and record the hash. Provide an endpoint to request an on-chain anchor (transaction) — stubbed to write anchor reference to `tokens` or `audits` table; full on-chain anchoring implemented in Phase 1.

APIs (Phase 0)
- POST /api/audit — body: {eventType, payload, actorId} -> returns {id, hash}
- GET /api/audit/:id -> returns record (redact payload unless authorized)

Security & Compliance Notes
- Sign and verify webhooks and uploads (HMAC or asymmetric signatures).
- Encrypt sensitive payloads at rest (AES-256-GCM) with keys managed via secrets manager.

Developer & Integration Notes
- Services expose OpenAPI endpoints and are packaged in the backend service.
- Provide unit tests for the rule evaluator and sample policies.
