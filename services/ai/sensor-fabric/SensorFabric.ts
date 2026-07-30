/**
 * Atlas Sanctum — Global Sensor Fabric
 *
 * Unified ingestion layer for all physical-world data streams:
 *   - IoT ground sensors (soil, water, air, bioacoustic)
 *   - Satellite observation feeds (Sentinel-2, Landsat-9, Planet)
 *   - Ocean buoys (temperature, pH, dissolved oxygen, plastic)
 *   - Weather stations
 *   - Community field reports
 *
 * Architecture:
 *   SensorRegistry → SensorStream → SensorAggregator → EventBus → AI Layers
 *
 * Production: AWS IoT Greengrass v2 + Kinesis Data Streams + Lambda
 */

// ─── Sensor Types ─────────────────────────────────────────────────────────────

export type SensorType =
  | 'soil_probe'
  | 'bioacoustic'
  | 'microbiome'
  | 'air_quality'
  | 'water_quality'
  | 'ocean_buoy'
  | 'weather_station'
  | 'satellite_ndvi'
  | 'satellite_thermal'
  | 'community_report';

export type SensorStatus = 'online' | 'offline' | 'degraded' | 'calibrating';

export interface SensorDescriptor {
  sensorId: string;
  type: SensorType;
  location: { lat: number; lng: number; bioregion: string; elevation?: number };
  owner: string;
  deployedAt: number;
  calibratedAt?: number;
  status: SensorStatus;
  reportingIntervalSeconds: number;
  metadata: Record<string, unknown>;
}

export interface SensorReading {
  readingId: string;
  sensorId: string;
  type: SensorType;
  timestamp: number;
  location: { lat: number; lng: number };
  measurements: Measurement[];
  qualityScore: number;   // 0–1: raw → calibrated → validated
  anomalyFlag: boolean;
  rawPayload?: Record<string, unknown>;
}

export interface Measurement {
  metric: string;
  value: number;
  unit: string;
  quality: 'raw' | 'calibrated' | 'validated';
}

export interface SensorAlert {
  alertId: string;
  sensorId: string;
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  metric: string;
  observedValue: number;
  threshold: number;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

export interface FabricHealthReport {
  totalSensors: number;
  online: number;
  offline: number;
  degraded: number;
  readingsLast24h: number;
  alertsActive: number;
  coverageBioregions: string[];
  avgQualityScore: number;
}

// ─── Sensor Registry ──────────────────────────────────────────────────────────

export class SensorRegistry {
  private sensors = new Map<string, SensorDescriptor>();

  register(sensor: SensorDescriptor): void {
    this.sensors.set(sensor.sensorId, sensor);
  }

  updateStatus(sensorId: string, status: SensorStatus): void {
    const s = this.sensors.get(sensorId);
    if (s) this.sensors.set(sensorId, { ...s, status });
  }

  getByType(type: SensorType): SensorDescriptor[] {
    return [...this.sensors.values()].filter(s => s.type === type);
  }

  getByBioregion(bioregion: string): SensorDescriptor[] {
    return [...this.sensors.values()].filter(s => s.location.bioregion === bioregion);
  }

  getOnline(): SensorDescriptor[] {
    return [...this.sensors.values()].filter(s => s.status === 'online');
  }

  all(): SensorDescriptor[] { return [...this.sensors.values()]; }
}

// ─── Sensor Stream ────────────────────────────────────────────────────────────

type ReadingHandler = (reading: SensorReading) => void;

export class SensorStream {
  private handlers: ReadingHandler[] = [];
  private readings: SensorReading[] = [];
  private alerts: SensorAlert[] = [];

  private readonly thresholds: Record<string, { warn: number; critical: number }> = {
    ph:                  { warn: 5.5,  critical: 4.5  },
    air_quality_index:   { warn: 100,  critical: 150  },
    temperature_c:       { warn: 35,   critical: 42   },
    plastic_density:     { warn: 0.5,  critical: 1.0  },
    co2_ppm:             { warn: 450,  critical: 500  },
    soil_moisture:       { warn: 20,   critical: 10   },
  };

  subscribe(handler: ReadingHandler): () => void {
    this.handlers.push(handler);
    return () => { this.handlers = this.handlers.filter(h => h !== handler); };
  }

  ingest(reading: SensorReading): void {
    this.readings.push(reading);
    this.checkThresholds(reading);
    this.handlers.forEach(h => h(reading));
    // Rolling window: keep last 10,000 readings in memory
    if (this.readings.length > 10_000) this.readings.shift();
  }

  getRecent(sensorId?: string, windowMs = 86_400_000): SensorReading[] {
    const cutoff = Date.now() - windowMs;
    return this.readings.filter(r =>
      r.timestamp >= cutoff && (!sensorId || r.sensorId === sensorId)
    );
  }

  getAlerts(acknowledged = false): SensorAlert[] {
    return this.alerts.filter(a => a.acknowledged === acknowledged);
  }

  acknowledge(alertId: string): void {
    const a = this.alerts.find(x => x.alertId === alertId);
    if (a) a.acknowledged = true;
  }

  private checkThresholds(reading: SensorReading): void {
    for (const m of reading.measurements) {
      const threshold = this.thresholds[m.metric];
      if (!threshold) continue;
      if (m.value >= threshold.critical) {
        this.alerts.push({
          alertId: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sensorId: reading.sensorId,
          severity: 'critical',
          metric: m.metric,
          observedValue: m.value,
          threshold: threshold.critical,
          message: `CRITICAL: ${m.metric} = ${m.value} ${m.unit} exceeds critical threshold ${threshold.critical}`,
          timestamp: reading.timestamp,
          acknowledged: false,
        });
      } else if (m.value >= threshold.warn) {
        this.alerts.push({
          alertId: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          sensorId: reading.sensorId,
          severity: 'warning',
          metric: m.metric,
          observedValue: m.value,
          threshold: threshold.warn,
          message: `WARNING: ${m.metric} = ${m.value} ${m.unit} exceeds warning threshold ${threshold.warn}`,
          timestamp: reading.timestamp,
          acknowledged: false,
        });
      }
    }
  }
}

// ─── Sensor Aggregator ────────────────────────────────────────────────────────

export interface AggregatedMetrics {
  bioregion: string;
  windowMs: number;
  sensorCount: number;
  readingCount: number;
  metrics: Record<string, { avg: number; min: number; max: number; unit: string }>;
  computedAt: number;
}

export class SensorAggregator {
  constructor(
    private readonly registry: SensorRegistry,
    private readonly stream: SensorStream,
  ) {}

  aggregate(bioregion: string, windowMs = 86_400_000): AggregatedMetrics {
    const sensors = this.registry.getByBioregion(bioregion).map(s => s.sensorId);
    const readings = this.stream.getRecent(undefined, windowMs)
      .filter(r => sensors.includes(r.sensorId));

    const metricAccum: Record<string, { values: number[]; unit: string }> = {};

    for (const reading of readings) {
      for (const m of reading.measurements) {
        if (!metricAccum[m.metric]) metricAccum[m.metric] = { values: [], unit: m.unit };
        metricAccum[m.metric].values.push(m.value);
      }
    }

    const metrics: AggregatedMetrics['metrics'] = {};
    for (const [metric, { values, unit }] of Object.entries(metricAccum)) {
      if (!values.length) continue;
      metrics[metric] = {
        avg: values.reduce((s, v) => s + v, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        unit,
      };
    }

    return {
      bioregion,
      windowMs,
      sensorCount: sensors.length,
      readingCount: readings.length,
      metrics,
      computedAt: Date.now(),
    };
  }

  fabricHealth(): FabricHealthReport {
    const all = this.registry.all();
    const recent = this.stream.getRecent(undefined, 86_400_000);
    const bioregions = [...new Set(all.map(s => s.location.bioregion))];
    const avgQuality = recent.length
      ? recent.reduce((s, r) => s + r.qualityScore, 0) / recent.length
      : 0;

    return {
      totalSensors: all.length,
      online: all.filter(s => s.status === 'online').length,
      offline: all.filter(s => s.status === 'offline').length,
      degraded: all.filter(s => s.status === 'degraded').length,
      readingsLast24h: recent.length,
      alertsActive: this.stream.getAlerts(false).length,
      coverageBioregions: bioregions,
      avgQualityScore: avgQuality,
    };
  }
}

// ─── Global Sensor Fabric ─────────────────────────────────────────────────────

export class GlobalSensorFabric {
  readonly registry   = new SensorRegistry();
  readonly stream     = new SensorStream();
  readonly aggregator = new SensorAggregator(this.registry, this.stream);

  constructor() { this.bootstrapSensors(); }

  ingest(reading: SensorReading): void {
    this.stream.ingest(reading);
  }

  health(): FabricHealthReport {
    return this.aggregator.fabricHealth();
  }

  private bootstrapSensors(): void {
    const sensors: SensorDescriptor[] = [
      { sensorId: 'soil-amazon-001',   type: 'soil_probe',      location: { lat: -3.4,  lng: -62.2, bioregion: 'amazon-basin'      }, owner: 'atlas-sanctum', deployedAt: Date.now(), status: 'online', reportingIntervalSeconds: 3600, metadata: {} },
      { sensorId: 'bio-amazon-001',    type: 'bioacoustic',     location: { lat: -3.5,  lng: -62.3, bioregion: 'amazon-basin'      }, owner: 'atlas-sanctum', deployedAt: Date.now(), status: 'online', reportingIntervalSeconds: 1800, metadata: {} },
      { sensorId: 'ocean-coral-001',   type: 'ocean_buoy',      location: { lat: -18.3, lng: 147.7, bioregion: 'coral-triangle'    }, owner: 'atlas-sanctum', deployedAt: Date.now(), status: 'online', reportingIntervalSeconds: 900,  metadata: {} },
      { sensorId: 'air-sahel-001',     type: 'air_quality',     location: { lat: 13.5,  lng: 2.1,   bioregion: 'sahel'             }, owner: 'atlas-sanctum', deployedAt: Date.now(), status: 'online', reportingIntervalSeconds: 600,  metadata: {} },
      { sensorId: 'water-himalaya-001',type: 'water_quality',   location: { lat: 28.0,  lng: 84.0,  bioregion: 'himalayan-watershed'}, owner: 'atlas-sanctum', deployedAt: Date.now(), status: 'online', reportingIntervalSeconds: 3600, metadata: {} },
      { sensorId: 'sat-ndvi-global',   type: 'satellite_ndvi',  location: { lat: 0,     lng: 0,     bioregion: 'global'            }, owner: 'atlas-sanctum', deployedAt: Date.now(), status: 'online', reportingIntervalSeconds: 432000, metadata: { satellite: 'Sentinel-2' } },
      { sensorId: 'weather-congo-001', type: 'weather_station', location: { lat: -0.2,  lng: 21.8,  bioregion: 'congo-basin'       }, owner: 'atlas-sanctum', deployedAt: Date.now(), status: 'online', reportingIntervalSeconds: 1800, metadata: {} },
    ];
    sensors.forEach(s => this.registry.register(s));
  }
}

export const AtlasSensorFabric = new GlobalSensorFabric();
export default AtlasSensorFabric;
