/**
 * Atlas Sanctum — Sensor Fabric + Digital Twin Integration Example
 *
 * Shows how IoT sensor readings flow into the planetary twin network
 * and trigger divergence alerts.
 *
 * Run: npx ts-node examples/integrations/sensor-twin.ts
 */

import AtlasSensorFabric, { SensorReading } from '../../services/ai/sensor-fabric/SensorFabric.js';
import AtlasPlanetaryTwins, { SyncEvent, SimulationScenario } from '../../services/ai/digital-twins/PlanetaryTwins.js';

async function main() {
  console.log('🌍 Atlas Sanctum — Sensor Fabric + Digital Twin Demo\n');

  // ── Sensor Fabric Health ──────────────────────────────────────────────────
  const fabricHealth = AtlasSensorFabric.health();
  console.log('📡 Sensor Fabric Health:');
  console.log(`  Total sensors:    ${fabricHealth.totalSensors}`);
  console.log(`  Online:           ${fabricHealth.online}`);
  console.log(`  Bioregions:       ${fabricHealth.coverageBioregions.join(', ')}\n`);

  // ── Subscribe to sensor stream ────────────────────────────────────────────
  const unsubscribe = AtlasSensorFabric.stream.subscribe(reading => {
    if (reading.anomalyFlag) {
      console.log(`  ⚠️  Anomaly detected: ${reading.sensorId} at ${new Date(reading.timestamp).toISOString()}`);
    }
  });

  // ── Ingest a soil probe reading ───────────────────────────────────────────
  const soilReading: SensorReading = {
    readingId: 'r-001',
    sensorId: 'soil-amazon-001',
    type: 'soil_probe',
    timestamp: Date.now(),
    location: { lat: -3.4, lng: -62.2 },
    measurements: [
      { metric: 'soil_moisture',    value: 42,  unit: '%',   quality: 'calibrated' },
      { metric: 'soil_carbon_pct',  value: 3.8, unit: '%',   quality: 'calibrated' },
      { metric: 'ph',               value: 6.2, unit: 'pH',  quality: 'validated'  },
      { metric: 'temperature_c',    value: 28,  unit: '°C',  quality: 'calibrated' },
    ],
    qualityScore: 0.92,
    anomalyFlag: false,
  };

  AtlasSensorFabric.ingest(soilReading);
  console.log('✅ Soil reading ingested: amazon-basin\n');

  // ── Ingest a critical ocean buoy reading ──────────────────────────────────
  const oceanReading: SensorReading = {
    readingId: 'r-002',
    sensorId: 'ocean-coral-001',
    type: 'ocean_buoy',
    timestamp: Date.now(),
    location: { lat: -18.3, lng: 147.7 },
    measurements: [
      { metric: 'temperature_c',  value: 31.5, unit: '°C',  quality: 'calibrated' },  // above critical
      { metric: 'ph',             value: 8.02, unit: 'pH',  quality: 'validated'  },
      { metric: 'dissolved_o2',   value: 6.8,  unit: 'mg/L',quality: 'calibrated' },
    ],
    qualityScore: 0.88,
    anomalyFlag: true,
  };

  AtlasSensorFabric.ingest(oceanReading);
  const alerts = AtlasSensorFabric.stream.getAlerts(false);
  console.log(`🚨 Active Alerts: ${alerts.length}`);
  for (const a of alerts) {
    console.log(`  [${a.severity.toUpperCase()}] ${a.message}`);
  }
  console.log();

  // ── Sync Digital Twin with sensor data ───────────────────────────────────
  const syncEvent: SyncEvent = {
    twinId: 'twin-coral-triangle',
    source: 'ocean-coral-001',
    incomingState: {
      seaTempC: 31.5,
      phLevel: 8.02,
      bleachingRisk: 0.72,
    },
    timestamp: Date.now(),
    confidence: 0.88,
  };

  const syncResult = AtlasPlanetaryTwins.sync(syncEvent);
  console.log('🔄 Digital Twin Sync — Coral Triangle:');
  console.log(`  Divergence score: ${(syncResult.divergenceScore * 100).toFixed(1)}%`);
  console.log(`  Divergence alerts: ${syncResult.alerts.length}`);
  for (const a of syncResult.alerts) {
    console.log(`    [${a.severity}] ${a.metric}: real=${a.realValue.toFixed(2)}, twin=${a.twinValue.toFixed(2)}`);
  }
  console.log();

  // ── Run a simulation scenario ─────────────────────────────────────────────
  const scenario: SimulationScenario = {
    scenarioId: 'scenario-coral-cooling',
    twinId: 'twin-coral-triangle',
    name: 'Ocean Cooling Intervention',
    interventions: [
      { metric: 'seaTempC',     delta: -2.5, rationale: 'Marine cloud brightening reduces SST' },
      { metric: 'bleachingRisk',delta: -0.4, rationale: 'Reduced thermal stress' },
      { metric: 'coralCoverPct',delta: +8,   rationale: 'Recovery over 5 years' },
    ],
    timeHorizonYears: 10,
    createdBy: 'did:sanctum:researcher-001',
    createdAt: Date.now(),
  };

  AtlasPlanetaryTwins.simulation.register(scenario);
  const simResult = AtlasPlanetaryTwins.simulation.run('scenario-coral-cooling');

  if (simResult) {
    console.log('🔬 Simulation: Ocean Cooling Intervention');
    console.log('  Key insights:');
    for (const insight of simResult.keyInsights) {
      console.log(`    • ${insight}`);
    }
    console.log(`  Confidence: ${(simResult.confidenceInterval[0] * 100).toFixed(0)}–${(simResult.confidenceInterval[1] * 100).toFixed(0)}%`);
  }

  // ── Network status ────────────────────────────────────────────────────────
  console.log('\n🌐 Planetary Twin Network Status:');
  const status = AtlasPlanetaryTwins.networkStatus();
  console.log(`  Total twins:   ${status.totalTwins}`);
  console.log(`  Synced:        ${status.synced}`);
  console.log(`  Diverged:      ${status.diverged}`);
  console.log(`  Active alerts: ${status.activeAlerts}`);

  unsubscribe();
}

main().catch(console.error);
