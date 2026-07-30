# packages/

Shared packages published internally across all Atlas Sanctum apps and services.

| Package | Description |
|---------|-------------|
| `sdk/` | Typed JavaScript/TypeScript client SDK — public API for external integrators |
| `ui/` | Shared component library — design system, tokens, accessible primitives |
| `shared/` | Shared utilities, types, validation schemas, constants |
| `config/` | Shared configuration — ESLint, TypeScript, Tailwind, Prettier presets |

## SDK

The Atlas Sanctum SDK (`packages/sdk/`) is the primary integration surface for:
- External developers building on the platform
- Internal apps consuming the backend API
- Partner organizations integrating regenerative data

See `packages/sdk/README.md` for usage.

## Current State

The SDK prototype lives at `atlas-sanctum/packages/sdk/`.
Full SDK with all domain modules is being migrated here.
