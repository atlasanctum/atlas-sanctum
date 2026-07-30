# ADR-011: Modular Monolith as Primary Backend Pattern

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

The backend (`backend/src/`) has no enforced module boundaries. Services import
from each other freely across domain lines. This creates hidden coupling that
makes future extraction painful and testing unreliable.

The platform currently has routes, services, agents, middleware, and utilities
all co-located with no structural enforcement of who may call whom.

## Decision

Enforce module boundaries using TypeScript path aliases and ESLint
`import/no-restricted-paths` rules. Each bounded context becomes a module with:

- A public API surface (`index.ts` barrel export)
- Private internals that are not importable from outside the module
- Cross-module communication exclusively via the internal event bus (`events/bus.ts`)

Bounded contexts: `identity`, `marketplace`, `intelligence`, `governance`,
`finance`, `measurement`, `knowledge`, `notifications`.

Direct cross-module imports are forbidden by lint rule. Synchronous REST calls
are permitted only within the same bounded context.

## Consequences

**Positive**
- Enables future extraction of hot modules into independent services without rewriting
- Makes the dependency graph explicit and auditable via lint
- Reduces blast radius of changes — a bug in `finance` cannot corrupt `governance`
- Simplifies testing: each module can be tested with its own mocks

**Negative**
- Requires refactoring existing cross-module imports (one-time cost)
- Barrel files can hide tree-shaking issues in the frontend bundle
- Event-driven cross-module calls introduce eventual consistency

## Alternatives Considered

| Option | Reason Rejected |
|--------|----------------|
| Full microservices | Operational overhead exceeds current team capacity; distributed systems multiply failure modes |
| Pure monolith | No path to scale; no seam for future extraction |
| NestJS modules | Would require full framework migration; existing Express codebase is production-stable |

## Migration Path

1. Add `eslint-plugin-import` with `no-restricted-paths` rules per bounded context
2. Create `index.ts` barrel for each module exposing only public API
3. Run lint — fix violations module by module, starting with `identity` (most depended-upon)
4. Replace direct cross-module calls with event bus publications

## References

- [Modular Monolith: A Primer](https://www.kamilgrzybek.com/design/modular-monolith-primer/)
- Shopify, Stack Overflow, Basecamp architecture case studies
