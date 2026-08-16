/**
 * Atlas Sanctum — Unit Tests
 * Covers: IdentityService, PaymentsService, AgentNetwork, KnowledgeCommons
 *
 * Run: npx vitest run tests/unit/core.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { IdentityService } from '../../services/identity/IdentityService.js';
import { PaymentsService } from '../../services/payments/PaymentsService.js';
import { AgentNetwork } from '../../services/ai/agents/AgentNetwork.js';
import { KnowledgeCommons } from '../../services/ai/knowledge-commons/KnowledgeCommons.js';

// ─── Identity Service ─────────────────────────────────────────────────────────

describe('IdentityService', () => {
  let svc: IdentityService;

  beforeEach(() => { svc = new IdentityService(); });

  it('creates a DID with did:sanctum: prefix', () => {
    const { did } = svc.register({ publicKey: 'abc123', role: 'individual' });
    expect(did.did).toMatch(/^did:sanctum:/);
    expect(did.role).toBe('individual');
    expect(did.verificationLevel).toBe('unverified');
    expect(did.active).toBe(true);
  });

  it('resolves a created DID', () => {
    const { did } = svc.register({ publicKey: 'key-resolve', role: 'organization' });
    const resolved = svc.registry.resolve(did.did);
    expect(resolved).not.toBeNull();
    expect(resolved!.did).toBe(did.did);
  });

  it('issues a bootstrap credential', () => {
    const { did, credential } = svc.register({
      publicKey: 'key-cred',
      role: 'institution',
      bootstrapCredentialType: 'InstitutionalMemberCredential',
      bootstrapClaims: { institutionName: 'Atlas Foundation', country: 'KE' },
    });
    expect(credential).toBeDefined();
    expect(credential!.type).toContain('InstitutionalMemberCredential');
    expect(credential!.credentialSubject.id).toBe(did.did);
  });

  it('elevates verification level', () => {
    const { did } = svc.register({ publicKey: 'key-verify', role: 'individual' });
    svc.verify(did.did, 'kyc', 'passport-scan-ref');
    const resolved = svc.registry.resolve(did.did);
    expect(resolved!.verificationLevel).toBe('kyc');
  });

  it('binds a covenant', () => {
    const { did } = svc.register({ publicKey: 'key-covenant', role: 'community' });
    svc.bindCovenant(did.did, 'covenant-amazon-2026');
    const resolved = svc.registry.resolve(did.did);
    expect(resolved!.covenantBindings).toContain('covenant-amazon-2026');
  });

  it('deactivates a DID', () => {
    const { did } = svc.register({ publicKey: 'key-deactivate', role: 'individual' });
    svc.registry.deactivate(did.did);
    expect(svc.registry.resolve(did.did)).toBeNull();
  });

  it('verifies a valid credential', () => {
    const { did, credential } = svc.register({
      publicKey: 'key-vc-verify',
      role: 'institution',
      bootstrapCredentialType: 'KYCCredential',
      bootstrapClaims: { level: 'institutional' },
    });
    const result = svc.issuer.verify(credential!);
    expect(result.valid).toBe(true);
  });

  it('revokes a credential', () => {
    const { credential } = svc.register({
      publicKey: 'key-revoke',
      role: 'individual',
      bootstrapCredentialType: 'FieldAgentCredential',
      bootstrapClaims: { region: 'amazon-basin' },
    });
    svc.issuer.revoke(credential!.id, 'Agent left programme');
    const result = svc.issuer.verify(credential!);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('Revoked');
  });

  it('computes reputation score', () => {
    const { did } = svc.register({ publicKey: 'key-rep', role: 'individual' });
    svc.reputation.record({
      did: did.did,
      signalType: 'impact_verified',
      weight: 0.1,
      timestamp: Date.now(),
    });
    const score = svc.refreshReputation(did.did);
    expect(score).toBeGreaterThan(0.5);
    expect(score).toBeLessThanOrEqual(1);
  });
});

// ─── Payments Service ─────────────────────────────────────────────────────────

describe('PaymentsService', () => {
  let svc: PaymentsService;
  const sellerDid = 'did:sanctum:seller-001';
  const buyerDid  = 'did:sanctum:buyer-001';

  beforeEach(() => {
    svc = new PaymentsService();
    // Mint 1000 carbon credits to seller
    svc.ledger.mint({
      toDid: sellerDid,
      creditType: 'carbon',
      amount: 1000,
      projectId: 'proj-amazon-001',
      verificationId: 'ver-001',
    });
  });

  it('mints credits to a DID', () => {
    const balance = svc.ledger.getBalance(sellerDid, 'carbon');
    expect(balance.available).toBe(1000);
    expect(balance.retired).toBe(0);
  });

  it('transfers credits between DIDs', () => {
    svc.ledger.transfer({ fromDid: sellerDid, toDid: buyerDid, creditType: 'carbon', amount: 200 });
    expect(svc.ledger.getBalance(sellerDid, 'carbon').available).toBe(800);
    expect(svc.ledger.getBalance(buyerDid, 'carbon').available).toBe(200);
  });

  it('throws on insufficient balance transfer', () => {
    expect(() =>
      svc.ledger.transfer({ fromDid: sellerDid, toDid: buyerDid, creditType: 'carbon', amount: 9999 })
    ).toThrow('Insufficient');
  });

  it('retires credits permanently', () => {
    svc.ledger.retire({ did: sellerDid, creditType: 'carbon', amount: 100, reason: 'Corporate offset 2026' });
    const balance = svc.ledger.getBalance(sellerDid, 'carbon');
    expect(balance.available).toBe(900);
    expect(balance.retired).toBe(100);
  });

  it('locks and unlocks credits', () => {
    svc.ledger.lock(sellerDid, 'carbon', 300);
    expect(svc.ledger.getBalance(sellerDid, 'carbon').available).toBe(700);
    expect(svc.ledger.getBalance(sellerDid, 'carbon').locked).toBe(300);
    svc.ledger.unlock(sellerDid, 'carbon', 300);
    expect(svc.ledger.getBalance(sellerDid, 'carbon').available).toBe(1000);
  });

  it('places and matches buy/sell orders', async () => {
    const sellOrder = svc.sell({
      sellerDid,
      creditType: 'carbon',
      amount: 100,
      pricePerUnit: 25,
      currency: 'USD',
    });
    expect(sellOrder.status).toBe('open');

    const { trades } = await svc.buy({
      buyerDid,
      creditType: 'carbon',
      amount: 50,
      maxPricePerUnit: 30,
      currency: 'USD',
      rail: 'stripe',
    });

    expect(trades.length).toBeGreaterThan(0);
    expect(trades[0].amount).toBe(50);
    expect(svc.ledger.getBalance(buyerDid, 'carbon').available).toBe(50);
  });

  it('tracks total retired credits', () => {
    svc.ledger.retire({ did: sellerDid, creditType: 'carbon', amount: 500, reason: 'Net zero commitment' });
    expect(svc.ledger.totalRetired('carbon')).toBe(500);
  });

  it('returns order book with mid price', () => {
    svc.market.placeOrder({ type: 'sell', creditType: 'biodiversity', amount: 100, pricePerUnit: 40, currency: 'USD', placedBy: sellerDid });
    svc.market.placeOrder({ type: 'buy',  creditType: 'biodiversity', amount: 50,  pricePerUnit: 38, currency: 'USD', placedBy: buyerDid });
    const book = svc.market.getOrderBook('biodiversity');
    expect(book.asks.length).toBe(1);
    expect(book.bids.length).toBe(1);
    expect(book.midPrice).toBe(39);
  });
});

// ─── Agent Network ────────────────────────────────────────────────────────────

describe('AgentNetwork', () => {
  let network: AgentNetwork;

  beforeEach(() => { network = new AgentNetwork(); });

  it('bootstraps 15 agents', () => {
    const health = network.health();
    expect(health.total).toBe(15);
    expect(health.online).toBe(15);
  });

  it('dispatches a task and returns results', async () => {
    const results = await network.orchestrator.dispatch({
      taskId: 'test-task-001',
      type: 'ecological_assessment',
      payload: { restore: true, explanation: 'test', restoration_path: 'reforestation' },
      priority: 3,
      requiredRoles: ['ecology'],
      createdAt: Date.now(),
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].role).toBe('ecology');
    expect(results[0].ethicsScore).toBeGreaterThanOrEqual(0);
  });

  it('blocks tasks with forbidden signals', async () => {
    const results = await network.orchestrator.dispatch({
      taskId: 'test-task-blocked',
      type: 'ecological_assessment',
      payload: { exploit: true, extract: 'resources', manipulate: 'data' },
      priority: 1,
      requiredRoles: ['ethics'],
      createdAt: Date.now(),
    });
    const ethicsResult = results.find(r => r.role === 'ethics');
    if (ethicsResult) {
      expect(ethicsResult.ethicsScore).toBeLessThan(0.5);
    }
  });

  it('forms a coalition', () => {
    const coalition = network.orchestrator.formCoalition(
      'Amazon Emergency',
      ['ecology', 'disaster', 'governance'],
    );
    expect(coalition.status).toBe('active');
    expect(coalition.members.length).toBeGreaterThan(0);
    expect(coalition.decisionRule).toBe('consensus');
  });

  it('records task results in health report', async () => {
    await network.orchestrator.dispatch({
      taskId: 'test-health-001',
      type: 'restoration_planning',
      payload: { restore: true, explanation: 'test', restoration_path: 'soil' },
      priority: 2,
      requiredRoles: ['restoration'],
      createdAt: Date.now(),
    });
    const report = network.registry.getHealthReport();
    const restorationAgent = report.find(h => h.role === 'restoration');
    expect(restorationAgent?.tasksCompleted).toBeGreaterThan(0);
  });
});

// ─── Knowledge Commons ────────────────────────────────────────────────────────

describe('KnowledgeCommons', () => {
  let commons: KnowledgeCommons;

  beforeEach(() => { commons = new KnowledgeCommons(); });

  it('seeds foundational knowledge assets', () => {
    const stats = commons.repository.stats();
    expect(stats.total).toBeGreaterThanOrEqual(3);
  });

  it('discovers assets by keyword', () => {
    const results = commons.discover('carbon verification');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('contributes and retrieves a new asset', () => {
    commons.contribute({
      assetId: 'test-asset-001',
      type: 'field_observation',
      title: 'Amazon Soil Carbon Measurement 2026',
      summary: 'Field measurement of soil carbon stocks in the Amazon basin.',
      content: 'Detailed methodology and results...',
      authors: ['Dr. Maria Santos'],
      domain: 'climate',
      tags: ['soil', 'carbon', 'amazon', 'measurement'],
      language: 'en',
      accessLevel: 'public',
      dataRights: 'open',
      license: 'CC BY 4.0',
      citationCount: 0,
      verifiedBy: [],
      publishedAt: Date.now(),
      updatedAt: Date.now(),
    });

    const results = commons.discover('amazon soil carbon');
    expect(results.some(r => r.asset.assetId === 'test-asset-001')).toBe(true);
  });

  it('traverses the knowledge graph', () => {
    const nodes = commons.graph.traverse('n-carbon-cycle', 2);
    expect(nodes.length).toBeGreaterThan(0);
    expect(nodes.some(n => n.nodeId === 'n-carbon-cycle')).toBe(true);
  });

  it('enforces FPIC for indigenous knowledge', () => {
    expect(() =>
      commons.indigenous.store(
        {
          assetId: 'sacred-001',
          type: 'indigenous_knowledge',
          title: 'Sacred Plant Medicine',
          summary: 'Traditional healing knowledge',
          content: '...',
          authors: ['Community Elder'],
          domain: 'health',
          tags: ['indigenous', 'medicine'],
          language: 'sw',
          accessLevel: 'sacred',
          dataRights: 'sacred_sovereign',
          license: 'Community Sovereign',
          citationCount: 0,
          verifiedBy: [],
          publishedAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          communityId: 'community-maasai',
          assetId: 'sacred-001',
          consentGranted: false,   // ← FPIC not granted
          grantedBy: [],
          grantedAt: Date.now(),
          conditions: [],
        }
      )
    ).toThrow('FPIC not granted');
  });
});
