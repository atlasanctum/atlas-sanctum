# ADR-014: Event-Driven Integration Between Bounded Contexts

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

Bounded contexts must communicate without tight coupling. The current codebase
has direct service-to-service imports across domain lines, creating hidden
dependencies that make independent deployment and testing impossible.

Options: direct REST calls, shared database tables, message queue, event bus.

## Decision

**Redis Streams** as the internal event bus for MVP and Phase 1.  
**Kafka** as the upgrade path when message volume exceeds Redis capacity
(trigger: sustained >10K events/second or need for multi-consumer fan-out
beyond Redis Streams capabilities).

Cross-context communication rules:
1. Async cross-context: publish a domain event to the bus, never import directly
2. Sync within-context: direct function calls are permitted
3. No shared database tables across bounded contexts — each context owns its schema
4. Events are immutable once published — never mutate a published event

**Event naming convention:** `{context}.{entity}.{past-tense-verb}`

Examples:
- `marketplace.credit.issued`
- `identity.user.verified`
- `governance.proposal.passed`
- `finance.payment.succeeded`

**Event schema versioning:** Events include a `schemaVersion` field. Consumers
must handle unknown fields gracefully (forward compatibility). Breaking schema
changes require a new event type, not a mutation of the existing one.

## Event Bus Implementation

See `backend/src/events/bus.ts` and `backend/src/events/catalog.ts`.

The bus exposes:
- `publish(event)` — fire-and-forget with at-least-once delivery via Redis Streams
- `subscribe(eventType, handler)` — consumer group subscription with auto-ack
- `subscribeMany(eventTypes[], handler)` — multi-type subscription

## Consequences

**Positive**
- Bounded contexts are independently deployable and testable
- New consumers can be added without modifying publishers
- Event log provides a natural audit trail
- Enables event sourcing patterns in the future

**Negative**
- Eventual consistency requires careful UI design (optimistic updates, loading states)
- Event schema evolution requires discipline — breaking changes are costly
- Debugging distributed flows requires correlation IDs and distributed tracing
- Redis Streams does not provide the durability guarantees of Kafka

## Failure Modes

| Failure | Mitigation |
|---------|-----------|
| Redis unavailable | Events buffered in memory, flushed on reconnect (short outages only) |
| Consumer crashes mid-processing | Redis Streams pending entry list — redelivered after timeout |
| Schema mismatch | `schemaVersion` field + forward-compatible consumers |
| Event storm | Per-context rate limiting on publish |

## References

- `backend/src/events/bus.ts` — implementation
- `backend/src/events/catalog.ts` — authoritative event catalog
- ADR-011 — Modular Monolith (defines the bounded contexts)
