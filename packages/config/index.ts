/**
 * @atlas-sanctum/config
 *
 * Shared engineering standards for Atlas Sanctum.
 * Consumed by the Engineering Copilot to ground every LLM prompt
 * in the actual conventions, domain language, and quality gates
 * of this codebase — not generic best practices.
 */

// ─── Domain Glossary ──────────────────────────────────────────────────────────
// Canonical terms used across the platform. The copilot injects these
// so the LLM never invents synonyms or misuses domain language.

export const DOMAIN_GLOSSARY: Record<string, string> = {
  'Regenerative Intelligence':
    'AI that optimises for ecological restoration, human flourishing, and institutional trust — not engagement or extraction.',
  'Observatory':
    'The planetary sensing layer: IoT sensors, satellite feeds, drone observations, and ocean stations feeding the Intelligence Engine.',
  'Intelligence Engine':
    'The 13-layer AI system (src/sanctum-ai/) that reasons, predicts, optimises, and governs AI actions.',
  'Covenant Code':
    'The constitutional operating system (src/sanctum/) that encodes ethical constraints as hard-coded rules, not soft guidelines.',
  'COS (Constitutional Operating System)':
    'Five planes — Intelligence, Trust, Coordination, Planetary, Value — that form the platform backbone (backend/src/sanctum/).',
  'RVX (Regenerative Value Exchange)':
    'The economic layer that converts verified regenerative actions into tradeable credits (carbon, biodiversity, water, ocean, community).',
  'Steward Network':
    'The distributed network of field agents, NGOs, governments, and communities who generate and verify impact data.',
  'Bioregion':
    'An ecologically defined territory used as the primary unit of environmental governance (see BIOREGIONS in @atlas-sanctum/shared).',
  'Seven Generation Horizon':
    'Planning horizon of ~175 years (7 × 25 years). Every governance proposal must state its seven-generation impact.',
  'FPIC':
    'Free, Prior, and Informed Consent — required before any indigenous knowledge is accessed, stored, or used.',
  'Digital Twin':
    'A real-time computational model of a physical ecosystem (forest, ocean, watershed) synchronised with sensor data.',
  'Sanctum-1':
    'The native Cosmos SDK blockchain (chain/) used for immutable impact anchoring and on-chain governance.',
  'RIU (Regenerative Impact Unit)':
    'The native token of Sanctum-1, earned by verified regenerative actions.',
  'Agent Council':
    'The multi-agent AI system (services/ai/agents/) where domain agents (Governance, Ecology, Economics…) deliberate collectively.',
  'Bounded Context':
    'A DDD module boundary. Current contexts: identity, marketplace, intelligence, governance, finance, measurement, knowledge, notifications.',
  'Audit Ledger':
    'The append-only, hash-chained log of every AI action, ethics evaluation, and human override (Layer 13 — GovernanceAuditLayer).',
};

// ─── Architecture Principles ──────────────────────────────────────────────────
// Derived from accepted ADRs. The copilot uses these to evaluate
// whether a proposed implementation fits the existing architecture.

export const ARCHITECTURE_PRINCIPLES = [
  {
    id: 'ADR-011',
    principle: 'Modular Monolith',
    rule: 'Cross-module imports are forbidden. Bounded contexts communicate only via the internal event bus (backend/src/events/bus.ts). Each module exposes a public API through its index.ts barrel.',
  },
  {
    id: 'ADR-012',
    principle: 'Supabase as Identity Provider',
    rule: 'Authentication is delegated to Supabase. The backend never stores passwords. Row-Level Security (RLS) enforces data isolation at the database layer.',
  },
  {
    id: 'ADR-013',
    principle: 'Cosmos SDK Chain',
    rule: 'On-chain anchoring uses Sanctum-1 (chain/). Smart contracts for EVM-compatible credits use Ethereum/Polygon. Never anchor mutable data on-chain.',
  },
  {
    id: 'ADR-014',
    principle: 'Event-Driven Integration',
    rule: 'Domain events are the integration contract between bounded contexts. Every state change that crosses a module boundary must be expressed as a named domain event.',
  },
  {
    id: 'ADR-015',
    principle: 'MCP Agent Architecture',
    rule: 'Agents communicate through the orchestrator only — never directly. Every agent response passes: prompt injection filter, factual grounding check, confidence threshold (≥0.6), ethics pre-check, PII stripping.',
  },
  {
    id: 'ADR-016',
    principle: 'API Versioning',
    rule: 'URL path versioning: /api/v1/, /api/v2/, /api/v3/. Breaking changes require a new version. Minimum 12-month deprecation notice with Sunset header.',
  },
  {
    id: 'ADR-017',
    principle: 'Zero Trust Security',
    rule: 'Every request is authenticated and authorised regardless of network origin. mTLS between services. JWT expiry ≤15 minutes. All secrets via AWS Secrets Manager — never in environment variables committed to git.',
  },
  {
    id: 'ADR-018',
    principle: 'Observability Stack',
    rule: 'OpenTelemetry traces on every request. Prometheus metrics exposed at /metrics. Grafana dashboards for all bounded contexts. Alert on p99 latency >2s, error rate >1%, ethics block rate >5%.',
  },
] as const;

// ─── Coding Standards ─────────────────────────────────────────────────────────
// The copilot injects these as hard constraints on every code generation request.

export const CODING_STANDARDS = {
  typescript: [
    'Strict mode enabled (tsconfig strict: true). No implicit any.',
    'Branded primitives for domain IDs (e.g. UserId, ProjectId) — never raw string.',
    'Result<T, E> pattern for all fallible operations — no thrown exceptions in domain logic.',
    'Dependency injection via constructor parameters — no module-level singletons in domain code.',
    'Every public function has a JSDoc comment with @param, @returns, @throws.',
    'No barrel re-exports that cross bounded context boundaries.',
  ],
  react: [
    'React 18 with concurrent features. No class components.',
    'Tailwind CSS for styling — no inline styles, no CSS modules.',
    'Framer Motion for animations — no CSS transitions on interactive elements.',
    'Every page component has a corresponding SEO component.',
    'Accessibility: WCAG 2.1 AA minimum. Every interactive element has aria-label.',
    'Error boundaries on every route. Loading states with skeleton components.',
  ],
  backend: [
    'Express routes are thin adapters — no business logic in route handlers.',
    'All database access through Supabase client — no raw SQL in application code.',
    'Every route is authenticated via authenticate middleware unless explicitly public.',
    'Rate limiting on all public endpoints via rate-limits middleware.',
    'Structured logging via logger utility — no console.log in production code.',
    'Every new route must have a corresponding entry in backend/openapi.yaml.',
  ],
  testing: [
    'Unit tests for all domain logic (Vitest).',
    'Integration tests for all API routes (Vitest + supertest).',
    'E2E tests for critical user journeys (Playwright).',
    'Test coverage ≥80% for new modules.',
    'No test should depend on external services — mock at the boundary.',
    'Every AI agent has a golden dataset test that runs weekly.',
  ],
  security: [
    'Input validation on every API endpoint using the validation middleware.',
    'Prompt injection filter on every LLM-bound input.',
    'PII stripped from all logs before writing.',
    'No secrets in code, comments, or git history.',
    'FPIC check before any indigenous knowledge is accessed.',
    'Ethics pre-flight before any AI action with real-world consequences.',
  ],
} as const;

// ─── Quality Gates ────────────────────────────────────────────────────────────
// Checklist the copilot runs against every proposed implementation
// before declaring it production-ready.

export const QUALITY_GATES = [
  { gate: 'Domain model defined',         description: 'Entities, aggregates, events, commands, and queries are named before any code is written.' },
  { gate: 'Bounded context respected',    description: 'No direct imports across module boundaries. Cross-context communication via event bus.' },
  { gate: 'API contract documented',      description: 'New endpoints added to backend/openapi.yaml before implementation.' },
  { gate: 'Database schema migrated',     description: 'Schema changes expressed as Supabase migrations in supabase/migrations/.' },
  { gate: 'RLS policy defined',           description: 'Every new table has a Row-Level Security policy. No table is publicly readable without explicit intent.' },
  { gate: 'Domain events emitted',        description: 'Every state change that crosses a bounded context emits a named domain event.' },
  { gate: 'Audit ledger entry',           description: 'Every AI action and human override is recorded to the GovernanceAuditLayer.' },
  { gate: 'Ethics pre-flight',            description: 'Every AI capability with real-world consequences passes constitutional_preflight.' },
  { gate: 'Tests written',               description: 'Unit + integration tests with ≥80% coverage for new modules.' },
  { gate: 'Observability hooks',          description: 'Prometheus counter/histogram for new operations. Alert threshold defined.' },
  { gate: 'ADR or RFC filed',            description: 'Architectural decisions documented in docs/adr/ or docs/rfcs/ before merging.' },
  { gate: 'Regenerative alignment check', description: 'Feature answers: how does this improve Human Flourishing, Ecological Health, Institutional Trust, Economic Regeneration, Knowledge Sharing, or Ethical Governance?' },
] as const;

// ─── Bounded Context Map ──────────────────────────────────────────────────────
// Used by the copilot to identify which modules a feature touches
// and which event bus topics it should publish/subscribe to.

export const BOUNDED_CONTEXTS = {
  identity: {
    path: 'backend/src/core/',
    publicApi: 'backend/src/routes/auth.ts',
    events: ['user.registered', 'user.verified', 'did.created', 'credential.issued'],
    owns: ['users', 'profiles', 'dids', 'credentials'],
  },
  marketplace: {
    path: 'backend/src/routes/marketplace*.ts',
    publicApi: 'backend/src/routes/marketplace-v2.ts',
    events: ['listing.created', 'order.placed', 'credit.retired', 'trade.settled'],
    owns: ['listings', 'orders', 'credits'],
  },
  intelligence: {
    path: 'backend/src/routes/planes/ai-orchestration.ts',
    publicApi: 'backend/src/routes/planes/ai-orchestration.ts',
    events: ['ai.request.processed', 'ethics.blocked', 'sentinel.alert', 'learning.updated'],
    owns: ['agent_runs', 'audit_entries', 'approval_gates'],
  },
  governance: {
    path: 'backend/src/routes/governance.ts',
    publicApi: 'backend/src/routes/governance.ts',
    events: ['proposal.created', 'vote.cast', 'proposal.passed', 'proposal.rejected'],
    owns: ['proposals', 'votes', 'dao_members'],
  },
  finance: {
    path: 'backend/src/routes/billing.ts',
    publicApi: 'backend/src/routes/billing.ts',
    events: ['payment.processed', 'subscription.activated', 'invoice.generated'],
    owns: ['subscriptions', 'invoices', 'payments'],
  },
  measurement: {
    path: 'backend/src/routes/measurements*.ts',
    publicApi: 'backend/src/routes/measurements-v3.ts',
    events: ['measurement.ingested', 'anomaly.detected', 'twin.updated'],
    owns: ['measurements', 'digital_twins', 'sensor_readings'],
  },
  knowledge: {
    path: 'services/ai/knowledge-commons/',
    publicApi: 'services/ai/graphql/schema.graphql',
    events: ['knowledge.indexed', 'knowledge.accessed', 'fpic.requested'],
    owns: ['knowledge_assets', 'indigenous_knowledge', 'research_papers'],
  },
  notifications: {
    path: 'backend/src/routes/community.ts',
    publicApi: 'backend/src/routes/community.ts',
    events: ['notification.sent', 'alert.escalated'],
    owns: ['notifications', 'subscriptions'],
  },
} as const;

// ─── Regenerative Alignment Rubric ────────────────────────────────────────────
// Every feature must score ≥1 on at least three dimensions.
// The copilot uses this to evaluate alignment before generating code.

export const REGENERATIVE_ALIGNMENT_RUBRIC = [
  {
    dimension: 'Human Flourishing',
    question: 'Does this feature improve health, education, economic opportunity, or dignity for real people?',
    examples: ['Health monitoring', 'Education access', 'Fair payment systems', 'Community voice'],
  },
  {
    dimension: 'Ecological Health',
    question: 'Does this feature protect, restore, or monitor ecosystems, biodiversity, or climate stability?',
    examples: ['Carbon verification', 'Biodiversity tracking', 'Deforestation alerts', 'Ocean health'],
  },
  {
    dimension: 'Institutional Trust',
    question: 'Does this feature make governance more transparent, accountable, or participatory?',
    examples: ['Audit trails', 'DAO voting', 'Explainable AI', 'Open data'],
  },
  {
    dimension: 'Economic Regeneration',
    question: 'Does this feature create economic value that flows back to communities and ecosystems?',
    examples: ['Credit markets', 'Community payments', 'Regenerative finance', 'Fair trade'],
  },
  {
    dimension: 'Knowledge Sharing',
    question: 'Does this feature make knowledge more accessible, verifiable, or interconnected?',
    examples: ['Open research', 'Indigenous knowledge (with FPIC)', 'AI explainability', 'Public datasets'],
  },
  {
    dimension: 'Ethical Governance',
    question: 'Does this feature strengthen ethical constraints, consent mechanisms, or accountability systems?',
    examples: ['FPIC workflows', 'Ethics pre-flight', 'Constitutional AI', 'Human override gates'],
  },
] as const;

// ─── Active Roadmap Phases ────────────────────────────────────────────────────
// The copilot uses this to contextualise feature requests against
// what is currently in progress vs planned.

export const ROADMAP_PHASES = {
  current: [
    'AI Agent Network — full LangGraph orchestration (skeleton complete)',
    'Global Sensor Fabric — IoT Greengrass integration',
    'Knowledge Commons — Neo4j graph service',
    'Planetary Digital Twins — real-time sync',
    'Developer Marketplace',
  ],
  planned: [
    'Global DAO — on-chain governance',
    'Mobile App — field agent interface',
    'LangGraph Agent Orchestration — production deployment',
    'Neo4j Knowledge Graph — production',
  ],
  stable: [
    'Ethical Governance Engine',
    'Regenerative Value Exchange',
    'Constitutional Operating System (Covenant Code)',
    '13-Layer AI Architecture',
    'Zero-Trust Security',
    'Cosmos SDK Chain (Sanctum-1)',
    'GraphQL Schema',
    'Public SDK (@atlas-sanctum/sdk)',
  ],
} as const;

export type ArchitecturePrinciple = typeof ARCHITECTURE_PRINCIPLES[number];
export type QualityGate = typeof QUALITY_GATES[number];
export type BoundedContextName = keyof typeof BOUNDED_CONTEXTS;
export type RegenerativeDimension = typeof REGENERATIVE_ALIGNMENT_RUBRIC[number]['dimension'];
