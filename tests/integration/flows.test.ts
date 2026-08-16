/**
 * Atlas Sanctum — Integration Tests
 * Tests cross-service flows: sensor → twin, identity → payments, agent → knowledge
 *
 * Run: npx vitest run tests/integration/flows.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GlobalSensorFabric, SensorReading } from '../../services/ai/sensor-fabric/SensorFabric.js';
import { PlanetaryTwinNetwork, SyncEvent } from '../../services/ai/digital-twins/PlanetaryTwins.js';
import { IdentityService } from '../../services/identity/IdentityService.js';
import { PaymentsService } from '../../services/payments/PaymentsService.js';
import { AgentNetwork } from '../../services/ai/agents/AgentNetwork.js';
import { KnowledgeCommons } from '../../services/ai/knowledge-commons/KnowledgeCommons.js';

// ─── Sensor → Digital Twin Pipeline ──────────────────────────────────────────

describe('Sensor → Digital Twin Pipeline', () => {
  let fabric: GlobalSensorFabric;
  let twins: PlanetaryTwinNetwork;

  beforeEach(() => {
    fabric = new GlobalSensorFabric();
    twins  = new PlanetaryTwinNetwork();
  });

  it('ingests a reading and syncs the corresponding twin', () => {
    const reading: SensorReading = {
      readingId: 'int-r-001',
      sensorId: 'ocean-coral-001',
      type: 'ocean_buoy',
      timestamp: Date.now(),
      location: { lat: -18.3, lng: 147.7 },
      measurements: [
        { metric: 'seaTempC',    value: 30.1, unit: '°C',  quality: 'calibrated' },
        { metric: 'phLevel',     value: 8.04, unit: 'pH',  quality: 'validated'  },
        { metric: 'bleachingRisk', value: 0.45, unit: 'index', quality: 'calibrated' },
      ],
      qualityScore: 0.91,
      anomalyFlag: false,
    };

    fabric.ingest(reading);

    const syncEvent: SyncEvent = {
      twinId: 'twin-coral-triangle',
      source: reading.sensorId,
      incomingState: {
        seaTempC:     30.1,
        phLevel:      8.04,
        bleachingRisk: 0.45,
      },
      timestamp: reading.timestamp,
      confidence: reading.qualityScore,
    };

    const result = twins.sync(syncEvent);
    expect(result.divergenceScore).toBeGreaterThanOrEqual(0);
    expect(result.divergenceScore).toBeLessThanOrEqual(1);

    const twin = twins.registry.get('twin-coral-triangle');
    expect(twin).not.toBeUndefined();
    expect(twin!.realWorldState.seaTempC).toBe(30.1);
    expect(twin!.lastSyncedAt).toBeGreaterThan(0);
  });

  it('raises divergence alerts when values exceed thresholds', () => {
    // First sync to establish simulated state
    twins.sync({
      twinId: 'twin-amazon-basin',
      source: 'sat-ndvi-global',
      incomingState: { ndvi: 0.85, carbonStockTonnesHa: 210 },
      timestamp: Date.now() - 86_400_000,
      confidence: 0.95,
    });

    // Force a simulated state
    const twin = twins.registry.get('twin-amazon-basin')!;
    twins.registry.update('twin-amazon-basin', {
      simulatedState: { ndvi: 0.85, carbonStockTonnesHa: 210, deforestationRateHaYr: 2000 },
    });

    // Now sync with diverged real values
    const result = twins.sync({
      twinId: 'twin-amazon-basin',
      source: 'sat-ndvi-global',
      incomingState: { ndvi: 0.55, carbonStockTonnesHa: 140, deforestationRateHaYr: 18000 },
      timestamp: Date.now(),
      confidence: 0.92,
    });

    expect(result.divergenceScore).toBeGreaterThan(0.1);
    expect(result.alerts.length).toBeGreaterThan(0);
  });

  it('generates threshold alerts for critical sensor values', () => {
    const criticalReading: SensorReading = {
      readingId: 'int-r-critical',
      sensorId: 'air-sahel-001',
      type: 'air_quality',
      timestamp: Date.now(),
      location: { lat: 13.5, lng: 2.1 },
      measurements: [
        { metric: 'air_quality_index', value: 175, unit: 'AQI', quality: 'calibrated' }, // > critical 150
      ],
      qualityScore: 0.85,
      anomalyFlag: true,
    };

    fabric.ingest(criticalReading);
    const alerts = fabric.stream.getAlerts(false);
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    expect(criticalAlerts.length).toBeGreaterThan(0);
    expect(criticalAlerts[0].metric).toBe('air_quality_index');
  });

  it('aggregates bioregional metrics', () => {
    const reading: SensorReading = {
      readingId: 'int-r-agg',
      sensorId: 'soil-amazon-001',
      type: 'soil_probe',
      timestamp: Date.now(),
      location: { lat: -3.4, lng: -62.2 },
      measurements: [
        { metric: 'soil_moisture', value: 45, unit: '%', quality: 'calibrated' },
      ],
      qualityScore: 0.9,
      anomalyFlag: false,
    };
    fabric.ingest(reading);

    const agg = fabric.aggregator.aggregate('amazon-basin');
    expect(agg.bioregion).toBe('amazon-basin');
    expect(agg.readingCount).toBeGreaterThan(0);
  });
});

// ─── Identity → Payments Flow ─────────────────────────────────────────────────

describe('Identity → Payments Flow', () => {
  let identity: IdentityService;
  let payments: PaymentsService;

  beforeEach(() => {
    identity = new IdentityService();
    payments = new PaymentsService();
  });

  it('full credit lifecycle: register → mint → sell → buy → retire', async () => {
    // Register seller and buyer
    const { did: seller } = identity.register({ publicKey: 'seller-key', role: 'organization' });
    const { did: buyer }  = identity.register({ publicKey: 'buyer-key',  role: 'institution' });

    identity.verify(seller.did, 'institutional', 'company-reg-KE-001');
    identity.verify(buyer.did,  'institutional', 'company-reg-US-001');

    // Mint credits to seller (verified project)
    payments.ledger.mint({
      toDid: seller.did,
      creditType: 'carbon',
      amount: 500,
      projectId: 'proj-kenya-001',
      verificationId: 'ver-verra-001',
    });

    expect(payments.ledger.getBalance(seller.did, 'carbon').available).toBe(500);

    // Seller lists 200 credits
    const sellOrder = payments.sell({
      sellerDid: seller.did,
      creditType: 'carbon',
      amount: 200,
      pricePerUnit: 28,
      currency: 'USD',
      vintage: 2026,
      projectId: 'proj-kenya-001',
    });
    expect(sellOrder.status).toBe('open');
    // Credits locked
    expect(payments.ledger.getBalance(seller.did, 'carbon').locked).toBe(200);

    // Buyer purchases 100 credits
    const { trades, payments: paymentRecords } = await payments.buy({
      buyerDid: buyer.did,
      creditType: 'carbon',
      amount: 100,
      maxPricePerUnit: 30,
      currency: 'USD',
      rail: 'stablecoin_usdc',
    });

    expect(trades.length).toBeGreaterThan(0);
    expect(paymentRecords[0].status).toBe('settled');
    expect(payments.ledger.getBalance(buyer.did, 'carbon').available).toBe(100);

    // Buyer retires credits for corporate offset
    const retireTx = payments.retire({
      did: buyer.did,
      creditType: 'carbon',
      amount: 100,
      reason: 'Corporate net-zero commitment 2026',
      beneficiary: 'Acme Corp',
    });

    expect(retireTx.type).toBe('retire');
    expect(payments.ledger.getBalance(buyer.did, 'carbon').retired).toBe(100);
    expect(payments.ledger.totalRetired('carbon')).toBe(100);
  });

  it('issues a RegenerativeImpactCredential after verified trade', async () => {
    const { did: issuer }  = identity.register({ publicKey: 'issuer-key', role: 'institution' });
    const { did: subject } = identity.register({ publicKey: 'subject-key', role: 'individual' });

    const credential = identity.issuer.issue({
      issuerDid: issuer.did,
      subjectDid: subject.did,
      type: 'RegenerativeImpactCredential',
      claims: {
        carbonRetiredTonnes: 50,
        projectId: 'proj-kenya-001',
        vintage: 2026,
        verificationMethod: 'Verra VM0042',
      },
      expiresInDays: 365,
    });

    expect(credential.type).toContain('RegenerativeImpactCredential');
    const verification = identity.issuer.verify(credential);
    expect(verification.valid).toBe(true);
  });
});

// ─── Agent → Knowledge Integration ───────────────────────────────────────────

describe('Agent → Knowledge Integration', () => {
  let network: AgentNetwork;
  let commons: KnowledgeCommons;

  beforeEach(() => {
    network = new AgentNetwork();
    commons = new KnowledgeCommons();
  });

  it('knowledge agent indexes and retrieves assets', () => {
    commons.contribute({
      assetId: 'int-k-001',
      type: 'research_paper',
      title: 'Regenerative Agriculture Carbon Sequestration in Sub-Saharan Africa',
      summary: 'Quantifies carbon sequestration potential of regenerative farming practices.',
      content: 'Full paper content...',
      authors: ['Dr. Amara Diallo'],
      domain: 'climate',
      tags: ['regenerative-agriculture', 'carbon', 'africa', 'soil'],
      language: 'en',
      accessLevel: 'public',
      dataRights: 'open',
      license: 'CC BY 4.0',
      citationCount: 42,
      verifiedBy: ['atlas-sanctum'],
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });

    const results = commons.discover('regenerative agriculture carbon africa');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].asset.assetId).toBe('int-k-001');
  });

  it('dispatches a knowledge_query task through the agent network', async () => {
    const results = await network.orchestrator.dispatch({
      taskId: 'int-agent-knowledge-001',
      type: 'knowledge_query',
      payload: {
        query: 'carbon sequestration methodology',
        explanation: 'Research query for restoration planning',
        restoration_path: 'evidence-based',
        educate: true,
      },
      priority: 2,
      requiredRoles: ['knowledge', 'ethics'],
      covenantId: 'covenant-knowledge-2026',
      requestedBy: 'did:sanctum:researcher-001',
      createdAt: Date.now(),
    });

    expect(results.length).toBeGreaterThan(0);
    const knowledgeResult = results.find(r => r.role === 'knowledge');
    expect(knowledgeResult).toBeDefined();
    expect(knowledgeResult!.outcome).toBe('success');
  });

  it('finds shortest path between knowledge graph nodes', () => {
    const path = commons.graph.findPath('n-carbon-cycle', 'n-regeneration');
    expect(path.length).toBeGreaterThan(0);
    expect(path[0].nodeId).toBe('n-carbon-cycle');
    expect(path[path.length - 1].nodeId).toBe('n-regeneration');
  });
});
