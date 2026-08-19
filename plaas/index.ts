/**
 * PLAAS — Planetary Intelligence As A Service
 * Constellation Manifest
 *
 * Primary entry point:
 *   import { PlaasRuntime } from '@atlas-sanctum/plaas';
 *   const plaas = await PlaasRuntime.boot({ node, layers });
 *
 * Architecture: Hexagonal (Ports & Adapters)
 *   Kernel  → pure domain logic, zero I/O
 *   Layers  → ports (interfaces) — implement with any adapter
 *   Runtime → composition root — wires kernel + adapters
 */

// ─── Runtime (primary API) ────────────────────────────────────────────────────
export { PlaasRuntime } from './runtime';
export type { PlaasRuntimeConfig, PlaasServiceMesh } from './runtime';

// ─── Kernel Primitives ────────────────────────────────────────────────────────
export * from './kernel';

// ─── Shared Foundation ────────────────────────────────────────────────────────
export * from './packages/types';
export * from './packages/protocols';

// ─── The 8 Living Layers (port interfaces) ────────────────────────────────────
export * from './nervous-system';   // Layer 1 — Planetary Awareness
export * from './temple';           // Layer 2 — Ethical & Sacred Governance
export * from './mycelium';         // Layer 3 — Decentralized Intelligence
export * from './ark';              // Layer 4 — Preservation & Continuity
export * from './living-city';      // Layer 5 — Civilization Infrastructure
export * from './garden';           // Layer 6 — Regenerative Life Systems
export * from './living-library';   // Layer 7 — Civilization Memory & Wisdom
export * from './constellation';    // Layer 8 — Planetary Coordination

// ─── Atlas Sanctum Core ───────────────────────────────────────────────────────
export * from './atlas-sanctum-core'; // Heart · Mind · Soul · Bridge
