# ADR-012: Supabase as Identity and Primary Database Provider

**Status:** Accepted  
**Date:** 2026-07-03  
**Deciders:** Platform Architecture Team

## Context

The platform uses Supabase for authentication (GoTrue) and PostgreSQL with
Row Level Security. This is already in production with active migrations in
`supabase/migrations/`. The question is whether to continue or migrate to a
self-hosted stack as the platform scales.

## Decision

Retain Supabase for:
- Authentication (GoTrue) — email/password, OAuth, MFA, magic links
- PostgreSQL with RLS as the primary relational store
- Edge Functions for lightweight serverless operations
- Realtime subscriptions for WebSocket-backed UI updates

Add a self-hosted Supabase instance (via `supabase/config.toml`) as a
disaster recovery target. Do not migrate to a custom auth stack — the
security surface of a custom auth implementation is too large to maintain
correctly with the current team size.

**Migration trigger:** If monthly Supabase cost exceeds $10K, or a critical
auth feature is unavailable, or a security incident is attributable to the
managed service, re-evaluate.

## Consequences

**Positive**
- Managed security patches and CVE response
- Built-in RLS enforced at the database level as a second authorization layer
- Realtime subscriptions without additional infrastructure
- Passkeys and WebAuthn support available without custom implementation

**Negative**
- Vendor dependency — Supabase pricing or API changes affect the platform
- Egress costs at scale (mitigated by connection pooling via PgBouncer)
- Limited customization of GoTrue auth flows (mitigated by custom claims via hooks)

## Row Level Security Policy

All tables containing user data MUST have RLS enabled. The pattern:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_rows" ON <table>
  FOR ALL USING (auth.uid() = user_id);
```

Service-role operations (backend API) bypass RLS via the service role key,
which is stored in AWS Secrets Manager and never in environment files.

## References

- `supabase/migrations/` — existing migration history
- `supabase/config.toml` — project configuration
- ADR-017 — Zero Trust Security Model
