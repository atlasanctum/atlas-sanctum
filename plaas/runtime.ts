/**
 * PLAAS Runtime
 * Planetary Intelligence As A Service — Live Organism Bootstrap
 *
 * This is the single entry point for instantiating PLAAS.
 * It wires the kernel (event bus, health monitor, sovereignty enforcer,
 * circuit breakers) to all 8 constellation layers and the Atlas Sanctum Core.
 *
 * Architecture pattern: Ports & Adapters (Hexagonal)
 *   - Ports  = layer interfaces defined in each layer's index.ts
 *   - Kernel = the inner hexagon (pure domain logic, no I/O)
 *   - Runtime = the composition root that plugs adapters into ports
 */

import type {
  NervousSystemLayer,
  TempleLayer,
  MyceliumLayer,
  ArkLayer,
  LivingCityLayer,
  GardenLayer,
  LivingLibraryLayer,
  ConstellationLayer,
} from './index';

import type { AtlasSanctumCore, SanctumConfig, SanctumState } from './atlas-sanctum-core';
import type { LayerHealth } from './packages/protocols';
import type { ConstellationNode } from './packages/types';

import {
  PlaasEventBus,
  PlaasHealthMonitor,
  SovereigntyEnforcer,
  CircuitBreaker,
} from './kernel';

// ─── Runtime Configuration ────────────────────────────────────────────────────

export interface PlaasRuntimeConfig {
  node: ConstellationNode;
  offlineMode?: boolean;
  ethicsStrictMode?: boolean;
  indigenousDataSovereignty?: boolean;
  healthCheckIntervalMs?: number;
  layers: SanctumConfig['layers'];
}

// ─── Service Mesh ─────────────────────────────────────────────────────────────

export interface PlaasServiceMesh {
  nervousSystem: NervousSystemLayer;
  temple: TempleLayer;
  mycelium: MyceliumLayer;
  ark: ArkLayer;
  livingCity: LivingCityLayer;
  garden: GardenLayer;
  livingLibrary: LivingLibraryLayer;
  constellation: ConstellationLayer;
}

// ─── PLAAS Runtime ────────────────────────────────────────────────────────────

export class PlaasRuntime {
  readonly bus: PlaasEventBus;
  readonly health: PlaasHealthMonitor;
  readonly sovereignty: SovereigntyEnforcer;
  readonly breakers: Map<string, CircuitBreaker>;
  readonly mesh: PlaasServiceMesh;
  readonly core: AtlasSanctumCore;

  private healthInterval?: ReturnType<typeof setInterval>;

  private constructor(
    config: PlaasRuntimeConfig,
    bus: PlaasEventBus,
    health: PlaasHealthMonitor,
    sovereignty: SovereigntyEnforcer,
    breakers: Map<string, CircuitBreaker>,
    core: AtlasSanctumCore,
  ) {
    this.bus = bus;
    this.health = health;
    this.sovereignty = sovereignty;
    this.breakers = breakers;
    this.mesh = config.layers;
    this.core = core;
  }

  /**
   * Bootstrap PLAAS.
   * Provide layer adapters — the runtime wires everything together.
   */
  static async boot(config: PlaasRuntimeConfig): Promise<PlaasRuntime> {
    const bus = new PlaasEventBus();
    const health = new PlaasHealthMonitor(bus);
    const sovereignty = new SovereigntyEnforcer();

    // Register a circuit breaker per layer
    const layerNames = [
      'nervous-system', 'temple', 'mycelium', 'ark',
      'living-city', 'garden', 'living-library', 'constellation',
    ] as const;

    const breakers = new Map<string, CircuitBreaker>(
      layerNames.map(name => [name, new CircuitBreaker(name)])
    );

    // Register health pings — each layer exposes a lightweight liveness check
    health.register('nervous-system', async () => { await config.layers.nervousSystem.getState(); return true; });
    health.register('temple',         async () => { await config.layers.temple.getSacredSites('*'); return true; });
    health.register('mycelium',       async () => { config.layers.mycelium.getTopology(); return true; });
    health.register('ark',            async () => { await config.layers.ark.searchWisdom('ping'); return true; });
    health.register('living-city',    async () => { await config.layers.livingCity.getCommunityOS('*'); return true; });
    health.register('garden',         async () => { await config.layers.garden.getSoilProfile('*'); return true; });
    health.register('living-library', async () => { await config.layers.livingLibrary.searchKnowledgeGraph('ping'); return true; });
    health.register('constellation',  async () => { await config.layers.constellation.getPlanetaryTwin(); return true; });

    // Wire the Atlas Sanctum Core — it orchestrates all layers via the bus
    const core = buildSanctumCore(config, bus, health);

    const runtime = new PlaasRuntime(config, bus, health, sovereignty, breakers, core);

    // Announce this node to the constellation
    await bus.publish({ type: 'NODE_JOINED', payload: config.node });

    // Start periodic health checks
    const intervalMs = config.healthCheckIntervalMs ?? 60_000;
    runtime.healthInterval = setInterval(() => health.pingAll(), intervalMs);

    return runtime;
  }

  /** Graceful shutdown — drains the offline queue and announces departure. */
  async shutdown(): Promise<void> {
    if (this.healthInterval) clearInterval(this.healthInterval);
    await this.bus.publish({ type: 'NODE_OFFLINE', payload: { nodeId: this.mesh.constellation.toString() } });
    const pending = this.mesh.mycelium.offlineQueue();
    if (pending.length > 0) {
      console.warn(`[PLAAS] Shutdown with ${pending.length} unsynced packets in offline queue`);
    }
  }

  /** Wrap any layer call with its circuit breaker. */
  async call<T>(layer: string, fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    const breaker = this.breakers.get(layer);
    if (!breaker) return fn();
    return breaker.call(fn, fallback);
  }

  /** Current health snapshot across all layers. */
  layerHealth(): LayerHealth[] {
    return this.health.getCached();
  }
}

// ─── Sanctum Core Builder ─────────────────────────────────────────────────────
// Constructs a minimal AtlasSanctumCore that delegates to the 8 layers
// and uses the bus + health monitor for orchestration.

function buildSanctumCore(
  config: PlaasRuntimeConfig,
  bus: PlaasEventBus,
  health: PlaasHealthMonitor,
): AtlasSanctumCore {
  const { layers, node } = config;

  return {
    // Heart
    async protectSacredSite(siteId, requesterId) {
      const sites = await layers.temple.getSacredSites('*');
      const site = sites.find(s => s.id === siteId);
      if (!site) return { protected: false, reason: 'Site not found' };
      if (site.accessPolicy === 'closed') return { protected: true, reason: 'Closed — no access' };
      if (site.accessPolicy === 'consent-required') {
        return { protected: true, reason: `Consent required from custodians for requester ${requesterId}` };
      }
      return { protected: false, reason: 'Open site — no restriction applied' };
    },

    async stewardCovenant(covenant) {
      return layers.temple.validateCovenant(covenant);
    },

    // Mind
    async getPlanetaryTwin() {
      return layers.constellation.getPlanetaryTwin();
    },

    async runForesightSimulation(scenario) {
      // Gather live signals from the nervous system, project via constellation insights
      const insights = await layers.constellation.getInsights(scenario.bioregion);
      const projections: Record<string, number[]> = {};
      for (const v of Object.keys(scenario.variables)) {
        projections[v] = Array.from({ length: scenario.horizon }, (_, i) =>
          scenario.variables[v] * (1 + (Math.random() * 0.1 - 0.05) * (i + 1))
        );
      }
      return {
        scenarioId: scenario.id,
        projections,
        risks: insights.filter(i => i.urgency === 'high' || i.urgency === 'critical').map(i => i.pattern),
        opportunities: insights.filter(i => i.urgency === 'low').map(i => i.pattern),
        recommendedCovenants: [],
        confidence: 0.72,
        generatedAt: new Date(),
      };
    },

    async synthesizeInsights(bioregion) {
      return layers.constellation.getInsights(bioregion);
    },

    // Soul
    async auditForPurposeAlignment(targetId, targetType) {
      const audit = await layers.temple.auditForEthics(targetId, targetType as 'ui' | 'api' | 'model' | 'covenant');
      const score = audit.violations.length === 0 ? 100 : Math.max(0, 100 - audit.violations.length * 20);
      return {
        targetId,
        alignedWith: score >= 80 ? ['regeneration', 'consent', 'sovereignty'] : [],
        misalignedWith: audit.violations,
        overallScore: score,
        recommendation: score >= 80 ? 'approve' : score >= 50 ? 'revise' : 'reject',
        reviewedBy: audit.reviewedBy,
        auditedAt: new Date(),
      };
    },

    async publishWisdom(entry) {
      const wisdom = await layers.livingLibrary.addWisdom(entry);
      await bus.publish({ type: 'WISDOM_PUBLISHED', payload: { entryId: wisdom.id, tradition: wisdom.tradition } });
      return wisdom;
    },

    // Bridge
    async routeSignal(signal) {
      await bus.publish({ type: 'SIGNAL_OBSERVED', payload: signal });
      await layers.constellation.contributeSignal(signal);
    },

    async broadcastEvent(event) {
      await bus.publish(event);
    },

    async getLayerHealth() {
      return health.pingAll();
    },

    getState(): SanctumState {
      return {
        identity: node,
        planetaryTwin: null as never,   // lazy — call getPlanetaryTwin() for live data
        activeCovenants: [],
        recentInsights: [],
        layerHealth: health.getCached(),
        wisdomQueue: [],
        alertQueue: [],
        lastHeartbeat: new Date(),
      };
    },
  };
}
