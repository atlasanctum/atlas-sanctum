/**
 * Atlas Sanctum — Planetary Digital Twins
 * Real-time sync engine for living digital models of ecosystems.
 *
 * Every ecosystem — forest, ocean, watershed, city, atmosphere —
 * has a digital twin that mirrors real-world state and runs simulations.
 *
 * Implements:
 *   - DigitalTwinRegistry: create and manage twins
 *   - TwinSyncEngine: ingest real-world data and update twin state
 *   - SimulationEngine: run what-if scenarios against twin state
 *   - DivergenceMonitor: alert when twin diverges from reality
 *   - PlanetaryTwinNetwork: top-level orchestrator
 */

// ─── Twin Types ───────────────────────────────────────────────────────────────

export type TwinEntityType =
  | 'biome' | 'ocean' | 'watershed' | 'atmosphere'
  | 'city'  | 'forest'| 'coral_reef'| 'glacier'
  | 'supply_chain' | 'hospital' | 'village';

export interface TwinState {
  [metric: string]: number;
}

export interface DigitalTwin {
  twinId: string;
  name: string;
  entityType: TwinEntityType;
  location: { lat: number; lng: number; bioregion: string };
  realWorldState: TwinState;
  simulatedState?: TwinState;
  baselineState: TwinState;
  divergenceScore: number;       // 0 = perfect sync, 1 = fully diverged
  lastSyncedAt: number;
  syncIntervalSeconds: number;
  dataSources: string[];
  status: 'synced' | 'syncing' | 'diverged' | 'offline';
}

export interface SyncEvent {
  twinId: string;
  source: string;
  incomingState: Partial<TwinState>;
  timestamp: number;
  confidence: number;
}

export interface SimulationScenario {
  scenarioId: string;
  twinId: string;
  name: string;
  interventions: { metric: string; delta: number; rationale: string }[];
  timeHorizonYears: number;
  createdBy: string;
  createdAt: number;
}

export interface SimulationResult {
  scenarioId: string;
  twinId: string;
  projectedState: TwinState;
  deltaFromBaseline: TwinState;
  confidenceInterval: [number, number];
  keyInsights: string[];
  risks: string[];
  completedAt: number;
}

export interface DivergenceAlert {
  alertId: string;
  twinId: string;
  metric: string;
  realValue: number;
  twinValue: number;
  divergencePct: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
}

// ─── Digital Twin Registry ────────────────────────────────────────────────────

export class DigitalTwinRegistry {
  private twins = new Map<string, DigitalTwin>();

  create(twin: DigitalTwin): void {
    this.twins.set(twin.twinId, twin);
  }

  get(twinId: string): DigitalTwin | undefined {
    return this.twins.get(twinId);
  }

  getByType(type: TwinEntityType): DigitalTwin[] {
    return [...this.twins.values()].filter(t => t.entityType === type);
  }

  getHighDivergence(threshold = 0.3): DigitalTwin[] {
    return [...this.twins.values()].filter(t => t.divergenceScore >= threshold);
  }

  update(twinId: string, patch: Partial<DigitalTwin>): void {
    const twin = this.twins.get(twinId);
    if (twin) this.twins.set(twinId, { ...twin, ...patch });
  }

  all(): DigitalTwin[] { return [...this.twins.values()]; }
}

// ─── Twin Sync Engine ─────────────────────────────────────────────────────────

export class TwinSyncEngine {
  private syncLog: SyncEvent[] = [];
  private divergenceAlerts: DivergenceAlert[] = [];

  constructor(private readonly registry: DigitalTwinRegistry) {}

  sync(event: SyncEvent): { divergenceScore: number; alerts: DivergenceAlert[] } {
    const twin = this.registry.get(event.twinId);
    if (!twin) return { divergenceScore: 0, alerts: [] };

    this.syncLog.push(event);

    // Merge incoming state
    const newRealState: TwinState = { ...twin.realWorldState, ...event.incomingState };

    // Compute divergence between real and simulated state
    const divergenceScore = twin.simulatedState
      ? this.computeDivergence(newRealState, twin.simulatedState)
      : 0;

    // Detect per-metric divergence alerts
    const newAlerts: DivergenceAlert[] = [];
    if (twin.simulatedState) {
      for (const [metric, realVal] of Object.entries(newRealState)) {
        const simVal = twin.simulatedState[metric];
        if (simVal === undefined) continue;
        const divergencePct = simVal !== 0 ? Math.abs(realVal - simVal) / Math.abs(simVal) : 0;
        if (divergencePct > 0.1) {
          const severity = divergencePct > 0.5 ? 'critical' : divergencePct > 0.3 ? 'high' : divergencePct > 0.2 ? 'medium' : 'low';
          newAlerts.push({
            alertId: `div-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            twinId: event.twinId,
            metric,
            realValue: realVal,
            twinValue: simVal,
            divergencePct,
            severity,
            timestamp: event.timestamp,
          });
        }
      }
    }

    this.divergenceAlerts.push(...newAlerts);

    this.registry.update(event.twinId, {
      realWorldState: newRealState,
      divergenceScore,
      lastSyncedAt: event.timestamp,
      status: divergenceScore > 0.5 ? 'diverged' : 'synced',
    });

    return { divergenceScore, alerts: newAlerts };
  }

  getAlerts(twinId?: string): DivergenceAlert[] {
    return twinId
      ? this.divergenceAlerts.filter(a => a.twinId === twinId)
      : this.divergenceAlerts;
  }

  getSyncLog(twinId: string): SyncEvent[] {
    return this.syncLog.filter(e => e.twinId === twinId);
  }

  private computeDivergence(real: TwinState, simulated: TwinState): number {
    const keys = Object.keys(real).filter(k => simulated[k] !== undefined);
    if (!keys.length) return 0;
    const totalDivergence = keys.reduce((sum, k) => {
      const base = Math.abs(simulated[k]) || 1;
      return sum + Math.abs(real[k] - simulated[k]) / base;
    }, 0);
    return Math.min(1, totalDivergence / keys.length);
  }
}

// ─── Simulation Engine ────────────────────────────────────────────────────────

export class SimulationEngine {
  private scenarios = new Map<string, SimulationScenario>();
  private results   = new Map<string, SimulationResult>();

  constructor(private readonly registry: DigitalTwinRegistry) {}

  register(scenario: SimulationScenario): void {
    this.scenarios.set(scenario.scenarioId, scenario);
  }

  run(scenarioId: string): SimulationResult | null {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return null;
    const twin = this.registry.get(scenario.twinId);
    if (!twin) return null;

    // Apply interventions to baseline state
    const projected: TwinState = { ...twin.realWorldState };
    for (const intervention of scenario.interventions) {
      if (projected[intervention.metric] !== undefined) {
        projected[intervention.metric] += intervention.delta;
      }
    }

    // Compute delta from baseline
    const deltaFromBaseline: TwinState = {};
    for (const [k, v] of Object.entries(projected)) {
      deltaFromBaseline[k] = v - (twin.baselineState[k] ?? v);
    }

    const result: SimulationResult = {
      scenarioId,
      twinId: scenario.twinId,
      projectedState: projected,
      deltaFromBaseline,
      confidenceInterval: [0.65, 0.85],
      keyInsights: scenario.interventions.map(i =>
        `${i.metric} ${i.delta >= 0 ? '+' : ''}${i.delta.toFixed(2)}: ${i.rationale}`
      ),
      risks: scenario.timeHorizonYears > 25
        ? ['Climate tipping point uncertainty increases beyond 25-year horizon']
        : [],
      completedAt: Date.now(),
    };

    this.results.set(scenarioId, result);
    this.registry.update(scenario.twinId, { simulatedState: projected });
    return result;
  }

  getResult(scenarioId: string): SimulationResult | undefined {
    return this.results.get(scenarioId);
  }
}

// ─── Planetary Twin Network ───────────────────────────────────────────────────

// ─── Real Data Source Connectors ─────────────────────────────────────────────
// Fetches live state from NOAA, NASA, and Copernicus APIs.
// Falls back gracefully when API keys are absent.

const _env = (key: string): string | undefined =>
  typeof process !== 'undefined' ? process.env?.[key] : undefined;

export class NOAAOceanConnector {
  private readonly baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
  constructor(private readonly syncEngine: TwinSyncEngine) {}

  async fetchCoralTriangle(): Promise<void> {
    const token = _env('NOAA_API_TOKEN');
    if (!token) return;
    try {
      const url = `${this.baseUrl}?station=1630000&product=water_temperature&datum=MLLW&time_zone=GMT&units=metric&format=json&range=24&application=atlas_sanctum&token=${token}`;
      const res  = await fetch(url);
      if (!res.ok) return;
      const json = await res.json() as { data?: { v: string; t: string }[] };
      const latest = json.data?.[json.data.length - 1];
      if (!latest) return;
      this.syncEngine.sync({
        twinId: 'twin-coral-triangle', source: 'NOAA CO-OPS',
        incomingState: { seaTempC: parseFloat(latest.v) },
        timestamp: new Date(latest.t).getTime(), confidence: 0.95,
      });
    } catch (e) { console.warn('[PlanetaryTwins] NOAA fetch failed:', e); }
  }
}

export class NASAClimateConnector {
  private readonly baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point';
  constructor(private readonly syncEngine: TwinSyncEngine) {}

  async fetchAtmosphere(): Promise<void> {
    try {
      const today = new Date();
      const end   = today.toISOString().slice(0, 10).replace(/-/g, '');
      const start = new Date(today.getTime() - 7 * 86_400_000).toISOString().slice(0, 10).replace(/-/g, '');
      const key   = _env('NASA_API_KEY');
      const url   = `${this.baseUrl}?parameters=T2M&community=RE&longitude=0&latitude=0&start=${start}&end=${end}&format=JSON${key ? `&api_key=${key}` : ''}`;
      const res   = await fetch(url);
      if (!res.ok) return;
      const json  = await res.json() as { properties?: { parameter?: { T2M?: Record<string, number> } } };
      const temps = json.properties?.parameter?.T2M;
      if (!temps) return;
      const values = Object.values(temps).filter(v => v > -900);
      if (!values.length) return;
      const avg = values.reduce((s, v) => s + v, 0) / values.length;
      this.syncEngine.sync({
        twinId: 'twin-global-atmosphere', source: 'NASA POWER',
        incomingState: { globalTempAnomalyC: parseFloat((avg - 13.8).toFixed(2)) },
        timestamp: Date.now(), confidence: 0.75,
      });
    } catch (e) { console.warn('[PlanetaryTwins] NASA fetch failed:', e); }
  }
}

export class CopernicusForestConnector {
  constructor(private readonly syncEngine: TwinSyncEngine) {}

  async fetchAmazonNDVI(): Promise<void> {
    const key = _env('COPERNICUS_API_KEY');
    if (!key) return;
    try {
      const url = 'https://land.copernicus.eu/api/@search?portal_type=DataSet&Subject=NDVI&format=json';
      const res  = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
      if (!res.ok) return;
      const json = await res.json() as { items?: { ndvi_mean?: number }[] };
      const ndvi = json.items?.[0]?.ndvi_mean;
      if (ndvi === undefined) return;
      this.syncEngine.sync({
        twinId: 'twin-amazon-basin', source: 'Copernicus CGLS',
        incomingState: { ndvi },
        timestamp: Date.now(), confidence: 0.9,
      });
    } catch (e) { console.warn('[PlanetaryTwins] Copernicus fetch failed:', e); }
  }
}

export class PlanetaryTwinNetwork {
  readonly registry   = new DigitalTwinRegistry();
  readonly syncEngine = new TwinSyncEngine(this.registry);
  readonly simulation = new SimulationEngine(this.registry);

  readonly noaa       = new NOAAOceanConnector(this.syncEngine);
  readonly nasa       = new NASAClimateConnector(this.syncEngine);
  readonly copernicus = new CopernicusForestConnector(this.syncEngine);

  constructor() {
    this.bootstrapTwins();
    this.refreshAll().catch(() => {});
  }

  sync(event: SyncEvent) { return this.syncEngine.sync(event); }

  /** Refresh all twins from live data sources. Call on a schedule (e.g. every hour). */
  async refreshAll(): Promise<void> {
    await Promise.allSettled([
      this.noaa.fetchCoralTriangle(),
      this.nasa.fetchAtmosphere(),
      this.copernicus.fetchAmazonNDVI(),
    ]);
  }

  networkStatus(): {
    totalTwins: number;
    synced: number;
    diverged: number;
    activeAlerts: number;
    avgDivergenceScore: number;
  } {
    const all = this.registry.all();
    const avgDivergenceScore = all.length
      ? all.reduce((s, t) => s + t.divergenceScore, 0) / all.length
      : 0;
    return {
      totalTwins: all.length,
      synced: all.filter(t => t.status === 'synced').length,
      diverged: all.filter(t => t.status === 'diverged').length,
      activeAlerts: this.syncEngine.getAlerts().filter(a => a.severity === 'critical' || a.severity === 'high').length,
      avgDivergenceScore,
    };
  }

  private bootstrapTwins(): void {
    const twins: DigitalTwin[] = [
      {
        twinId: 'twin-amazon-basin', name: 'Amazon Basin', entityType: 'biome',
        location: { lat: -3.4, lng: -62.2, bioregion: 'amazon-basin' },
        realWorldState:  { ndvi: 0.72, carbonStockTonnesHa: 180, biodiversityIndex: 0.81, deforestationRateHaYr: 11000 },
        baselineState:   { ndvi: 0.85, carbonStockTonnesHa: 210, biodiversityIndex: 0.92, deforestationRateHaYr: 2000 },
        divergenceScore: 0.18, lastSyncedAt: Date.now(), syncIntervalSeconds: 86400,
        dataSources: ['Sentinel-2', 'INPE', 'Global Forest Watch'],
        status: 'synced',
      },
      {
        twinId: 'twin-coral-triangle', name: 'Coral Triangle', entityType: 'coral_reef',
        location: { lat: -8.0, lng: 125.0, bioregion: 'coral-triangle' },
        realWorldState:  { coralCoverPct: 42, seaTempC: 29.2, phLevel: 8.05, bleachingRisk: 0.35 },
        baselineState:   { coralCoverPct: 65, seaTempC: 27.5, phLevel: 8.15, bleachingRisk: 0.10 },
        divergenceScore: 0.28, lastSyncedAt: Date.now(), syncIntervalSeconds: 43200,
        dataSources: ['NOAA', 'Reef Check', 'Copernicus Marine'],
        status: 'synced',
      },
      {
        twinId: 'twin-global-atmosphere', name: 'Global Atmosphere', entityType: 'atmosphere',
        location: { lat: 0, lng: 0, bioregion: 'global' },
        realWorldState:  { co2Ppm: 422, ch4Ppb: 1923, globalTempAnomalyC: 1.2, arcticSeaIceKm2: 4_200_000 },
        baselineState:   { co2Ppm: 280, ch4Ppb: 722,  globalTempAnomalyC: 0.0, arcticSeaIceKm2: 7_200_000 },
        divergenceScore: 0.45, lastSyncedAt: Date.now(), syncIntervalSeconds: 3600,
        dataSources: ['NOAA GML', 'NASA GISS', 'Copernicus C3S'],
        status: 'diverged',
      },
    ];
    twins.forEach(t => this.registry.create(t));
  }
}

export const AtlasPlanetaryTwins = new PlanetaryTwinNetwork();
export default AtlasPlanetaryTwins;
