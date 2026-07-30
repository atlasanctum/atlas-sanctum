# ADR-016: API Versioning Strategy

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

The backend currently has three URL-based API versions in production:
- `/api/` — original unversioned routes
- `/api/v2/` — enhanced routes
- `/api/v3/` — COS planes and AI orchestration

Public APIs will be consumed by third parties who cannot absorb breaking
changes without notice. A formal versioning strategy is required.

## Decision

**URL path versioning** for all public-facing APIs: `/api/v1/`, `/api/v2/`, `/api/v3/`

**Header versioning** (`X-API-Version`) for internal service-to-service calls
where URL changes would require infrastructure reconfiguration.

**GraphQL:** Single versioned schema with `@deprecated` directives. No URL
versioning for GraphQL — schema evolution handles compatibility.

### Deprecation Policy

1. Minimum 12 months notice before removing a version
2. `Sunset` response header on all deprecated endpoint responses:
   `Sunset: Sat, 01 Jan 2028 00:00:00 GMT`
3. `Deprecation` response header with deprecation date
4. Migration guide published at time of deprecation announcement
5. Email notification to all API key holders using the deprecated version

### Version Lifecycle

| Version | Status | Sunset Date |
|---------|--------|-------------|
| `/api/` (v0) | Deprecated | 2027-01-01 |
| `/api/v2/` | Stable | — |
| `/api/v3/` | Current | — |

### Breaking vs Non-Breaking Changes

**Non-breaking (allowed without version bump):**
- Adding new optional fields to responses
- Adding new optional query parameters
- Adding new endpoints
- Adding new enum values (consumers must handle unknown values)

**Breaking (requires new version):**
- Removing fields from responses
- Changing field types
- Removing endpoints
- Changing authentication requirements
- Changing error response format

## Consequences

**Positive**
- Third-party integrators have a stable contract with advance notice of changes
- URL versioning is explicit and visible in logs, proxies, and API gateways
- Sunset headers enable automated deprecation monitoring by consumers

**Negative**
- Multiple versions must be maintained simultaneously during transition periods
- URL versioning requires route duplication for minor changes
- Consumers must actively migrate — passive compatibility is not guaranteed

## References

- `backend/src/index.ts` — current route registration
- `backend/openapi.yaml` — OpenAPI specification
- [IETF RFC 8594 — The Sunset HTTP Header Field](https://datatracker.ietf.org/doc/html/rfc8594)
