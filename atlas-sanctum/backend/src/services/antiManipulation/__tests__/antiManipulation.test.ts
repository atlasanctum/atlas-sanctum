/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Comprehensive Test Suite
 */

import {
  ingestEvent,
  ingestEventBatch,
  getEvent,
  getEventsByEntity,
  getEventStats,
  clearEvents
} from '../eventIngestionService';

import {
  upsertEntity,
  getEntity,
  getEntitiesByType,
  searchEntities,
  createEntityLink,
  getEntityLinks,
  getEntityNetwork,
  findEntitiesBySharedAttribute,
  resolveDuplicates,
  updateEntityRiskScore,
  updateEntityWatchStatus,
  getEntityStats,
  clearEntities
} from '../entityResolutionService';

import {
  getAllRules,
  getEnabledRules,
  getRule,
  upsertRule,
  setRuleEnabled,
  evaluateEvent,
  getRuleStats,
  initializeDefaultRules
} from '../rulesEngine';

import {
  detectAnomalies,
  getAnomalyScores,
  getAnomalyStats,
  clearAnomalyScores
} from '../anomalyDetectionService';

import {
  analyzeEntityNetwork,
  getEntityNetworkForVisualization,
  getGraphRiskScores,
  getGraphRiskStats,
  clearGraphRiskScores
} from '../graphRiskEngine';

import {
  analyzeNarrativeConsistency,
  getNarrativeAnalysis,
  getNarrativeAnalysesByDocument,
  getNarrativeStats,
  clearNarrativeAnalyses
} from '../narrativeConsistencyEngine';

import {
  calculateRiskScore,
  createCase,
  getCase,
  getAllCases,
  getCasesByStatus,
  updateCaseStatus,
  assignCase,
  determineIntervention,
  createIntervention,
  getIntervention,
  getInterventionsByCase,
  executeIntervention,
  getCaseStats,
  getInterventionStats,
  clearCases
} from '../caseScoringEngine';

describe('Anti-Manipulation Engine', () => {
  beforeEach(() => {
    clearEvents();
    clearEntities();
    clearAnomalyScores();
    clearGraphRiskScores();
    clearNarrativeAnalyses();
    clearCases();
  });

  describe('Event Ingestion Service', () => {
    test('should ingest a single event', () => {
      const event = ingestEvent({
        eventType: 'invoice_submitted',
        sourceSystem: 'procurement_erp',
        timestamp: '2026-03-22T12:00:00Z',
        entityRefs: ['vendor_123'],
        payload: {
          invoice_number: 'INV-8832',
          amount: 9800,
          currency: 'USD'
        }
      });

      expect(event).toBeDefined();
      expect(event.id).toMatch(/^event_/);
      expect(event.eventType).toBe('invoice_submitted');
      expect(event.amount).toBe(9800);
      expect(event.processed).toBe(true);
    });

    test('should ingest batch events', () => {
      const events = ingestEventBatch([
        {
          eventType: 'invoice_submitted',
          sourceSystem: 'procurement_erp',
          timestamp: '2026-03-22T12:00:00Z',
          entityRefs: ['vendor_123'],
          payload: { amount: 9800 }
        },
        {
          eventType: 'payment_approved',
          sourceSystem: 'finance_system',
          timestamp: '2026-03-22T12:05:00Z',
          entityRefs: ['vendor_123'],
          payload: { amount: 9800 }
        }
      ]);

      expect(events).toHaveLength(2);
      expect(events[0].eventType).toBe('invoice_submitted');
      expect(events[1].eventType).toBe('payment_approved');
    });

    test('should retrieve events by entity', () => {
      ingestEvent({
        eventType: 'invoice_submitted',
        sourceSystem: 'procurement_erp',
        timestamp: '2026-03-22T12:00:00Z',
        entityRefs: ['vendor_123'],
        payload: { amount: 9800 }
      });

      ingestEvent({
        eventType: 'payment_approved',
        sourceSystem: 'finance_system',
        timestamp: '2026-03-22T12:05:00Z',
        entityRefs: ['vendor_123'],
        payload: { amount: 9800 }
      });

      const events = getEventsByEntity('vendor_123');
      expect(events).toHaveLength(2);
    });

    test('should get event statistics', () => {
      ingestEvent({
        eventType: 'invoice_submitted',
        sourceSystem: 'procurement_erp',
        timestamp: '2026-03-22T12:00:00Z',
        entityRefs: ['vendor_123'],
        payload: { amount: 9800 }
      });

      const stats = getEventStats();
      expect(stats.total).toBe(1);
      expect(stats.processed).toBe(1);
      expect(stats.byType['invoice_submitted']).toBe(1);
    });
  });

  describe('Entity Resolution Service', () => {
    test('should create an entity', () => {
      const entity = upsertEntity({
        entityType: 'vendor',
        externalId: 'ERP-V-882',
        attributes: {
          name: 'Alpha Supply Ltd',
          address: 'Nairobi',
          phone: '+254700123456'
        }
      });

      expect(entity).toBeDefined();
      expect(entity.id).toMatch(/^vendor_/);
      expect(entity.name).toBe('Alpha Supply Ltd');
      expect(entity.riskScore).toBe(0);
    });

    test('should update existing entity', () => {
      const entity1 = upsertEntity({
        entityType: 'vendor',
        externalId: 'ERP-V-882',
        attributes: { name: 'Alpha Supply Ltd' }
      });

      const entity2 = upsertEntity({
        entityType: 'vendor',
        externalId: 'ERP-V-882',
        attributes: { name: 'Alpha Supply Ltd', phone: '+254700123456' }
      });

      expect(entity1.id).toBe(entity2.id);
      expect(entity2.attributes.phone).toBe('+254700123456');
    });

    test('should create entity link', () => {
      const vendor = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Alpha Supply Ltd' }
      });

      const person = upsertEntity({
        entityType: 'person',
        attributes: { name: 'John Kamau' }
      });

      const link = createEntityLink(vendor.id, person.id, 'director_of', { role: 'managing_director' });

      expect(link).toBeDefined();
      expect(link.fromEntityId).toBe(vendor.id);
      expect(link.toEntityId).toBe(person.id);
      expect(link.linkType).toBe('director_of');
    });

    test('should find entities by shared attribute', () => {
      upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Vendor A', phone: '+254700123456' }
      });

      upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Vendor B', phone: '+254700123456' }
      });

      const entities = findEntitiesBySharedAttribute('phone', '+254700123456');
      expect(entities).toHaveLength(2);
    });

    test('should resolve duplicates', () => {
      upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Alpha Supply Ltd', phone: '+254700123456' }
      });

      upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Alpha Supply Limited', phone: '+254700123456' }
      });

      const entity = getEntity('vendor_1');
      if (entity) {
        const duplicates = resolveDuplicates(entity);
        expect(duplicates.length).toBeGreaterThan(0);
      }
    });

    test('should update entity risk score', () => {
      const entity = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Alpha Supply Ltd' }
      });

      const updated = updateEntityRiskScore(entity.id, 75);
      expect(updated?.riskScore).toBe(75);
    });

    test('should update entity watch status', () => {
      const entity = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Alpha Supply Ltd' }
      });

      const updated = updateEntityWatchStatus(entity.id, 'flagged');
      expect(updated?.watchStatus).toBe('flagged');
    });
  });

  describe('Rules Engine', () => {
    test('should have default rules', () => {
      const rules = getAllRules();
      expect(rules.length).toBeGreaterThan(0);
    });

    test('should get enabled rules', () => {
      const rules = getEnabledRules();
      expect(rules.every(r => r.enabled)).toBe(true);
    });

    test('should evaluate event against rules', () => {
      const event = {
        id: 'event_1',
        eventType: 'invoice_submitted' as any,
        sourceSystem: 'procurement_erp',
        timestamp: new Date(),
        amount: 9800,
        currency: 'USD',
        metadata: {},
        processed: false,
        createdAt: new Date()
      };

      const entity = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Alpha Supply Ltd' }
      });

      const alerts = evaluateEvent(event, entity, []);
      expect(Array.isArray(alerts)).toBe(true);
    });

    test('should enable/disable rule', () => {
      const rules = getAllRules();
      const rule = rules[0];
      
      const updated = setRuleEnabled(rule.id, false);
      expect(updated?.enabled).toBe(false);
    });
  });

  describe('Anomaly Detection Service', () => {
    test('should detect anomalies', () => {
      const events = Array.from({ length: 20 }, (_, i) => ({
        id: `event_${i}`,
        eventType: 'invoice_submitted' as any,
        sourceSystem: 'procurement_erp',
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        amount: 9000 + Math.random() * 2000,
        currency: 'USD',
        metadata: {},
        processed: false,
        createdAt: new Date()
      }));

      const scores = detectAnomalies('vendor_123', events);
      expect(Array.isArray(scores)).toBe(true);
    });

    test('should get anomaly scores', () => {
      const events = Array.from({ length: 10 }, (_, i) => ({
        id: `event_${i}`,
        eventType: 'invoice_submitted' as any,
        sourceSystem: 'procurement_erp',
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        amount: 9000 + Math.random() * 2000,
        currency: 'USD',
        metadata: {},
        processed: false,
        createdAt: new Date()
      }));

      detectAnomalies('vendor_123', events);
      const scores = getAnomalyScores('vendor_123');
      expect(scores.length).toBeGreaterThan(0);
    });
  });

  describe('Graph Risk Engine', () => {
    test('should analyze entity network', () => {
      const vendor1 = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Vendor A' }
      });

      const vendor2 = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Vendor B' }
      });

      const person = upsertEntity({
        entityType: 'person',
        attributes: { name: 'John Kamau' }
      });

      createEntityLink(vendor1.id, person.id, 'director_of');
      createEntityLink(vendor2.id, person.id, 'director_of');
      createEntityLink(vendor1.id, vendor2.id, 'shares_phone');

      const entities = new Map([
        [vendor1.id, vendor1],
        [vendor2.id, vendor2],
        [person.id, person]
      ]);

      const links = getEntityLinks(vendor1.id);
      const scores = analyzeEntityNetwork(vendor1.id, entities, links);
      expect(Array.isArray(scores)).toBe(true);
    });

    test('should get graph risk scores', () => {
      const vendor = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Vendor A' }
      });

      const scores = getGraphRiskScores(vendor.id);
      expect(Array.isArray(scores)).toBe(true);
    });
  });

  describe('Narrative Consistency Engine', () => {
    test('should analyze narrative consistency', () => {
      const analysis = analyzeNarrativeConsistency(
        'report_77',
        ['95% of sensors are operational', 'No delays in last-mile delivery'],
        []
      );

      expect(analysis).toBeDefined();
      expect(analysis.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(analysis.consistencyScore).toBeLessThanOrEqual(1);
    });

    test('should get narrative analysis', () => {
      analyzeNarrativeConsistency('report_77', ['All systems operational'], []);
      const analysis = getNarrativeAnalysis(1);
      expect(analysis).toBeDefined();
    });

    test('should get low consistency narratives', () => {
      analyzeNarrativeConsistency('report_77', ['95% operational'], []);
      const analyses = getLowConsistencyNarratives(0.5);
      expect(Array.isArray(analyses)).toBe(true);
    });
  });

  describe('Case Scoring Engine', () => {
    test('should calculate risk score', () => {
      const result = calculateRiskScore(
        [{ source: 'rule_engine', finding: 'Test finding', weight: 0.5 }],
        0.6,
        0.7,
        0.3
      );

      expect(result).toBeDefined();
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    test('should create case', () => {
      const riskScoreResult = calculateRiskScore([], 0.5, 0.5, 0.5);
      
      const newCase = createCase(
        'Test Case',
        'Test description',
        ['vendor_123'],
        ['alert_1'],
        riskScoreResult,
        'high'
      );

      expect(newCase).toBeDefined();
      expect(newCase.id).toMatch(/^case_/);
      expect(newCase.title).toBe('Test Case');
      expect(newCase.status).toBe('open');
    });

    test('should get case by ID', () => {
      const riskScoreResult = calculateRiskScore([], 0.5, 0.5, 0.5);
      
      const newCase = createCase(
        'Test Case',
        'Test description',
        ['vendor_123'],
        ['alert_1'],
        riskScoreResult,
        'high'
      );

      const retrieved = getCase(newCase.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(newCase.id);
    });

    test('should update case status', () => {
      const riskScoreResult = calculateRiskScore([], 0.5, 0.5, 0.5);
      
      const newCase = createCase(
        'Test Case',
        'Test description',
        ['vendor_123'],
        ['alert_1'],
        riskScoreResult,
        'high'
      );

      const updated = updateCaseStatus(newCase.id, 'investigating', 'user_123');
      expect(updated?.status).toBe('investigating');
      expect(updated?.owner).toBe('user_123');
    });

    test('should determine intervention', () => {
      const intervention = determineIntervention(85, 0.9);
      expect(intervention.action).toBe('pause_disbursement');
      expect(intervention.level).toBe(3);
    });

    test('should create intervention', () => {
      const riskScoreResult = calculateRiskScore([], 0.5, 0.5, 0.5);
      
      const newCase = createCase(
        'Test Case',
        'Test description',
        ['vendor_123'],
        ['alert_1'],
        riskScoreResult,
        'high'
      );

      const intervention = createIntervention(
        newCase.id,
        'pause_disbursement',
        3,
        'High risk detected'
      );

      expect(intervention).toBeDefined();
      expect(intervention.id).toMatch(/^int_/);
      expect(intervention.status).toBe('pending');
    });

    test('should execute intervention', () => {
      const riskScoreResult = calculateRiskScore([], 0.5, 0.5, 0.5);
      
      const newCase = createCase(
        'Test Case',
        'Test description',
        ['vendor_123'],
        ['alert_1'],
        riskScoreResult,
        'high'
      );

      const intervention = createIntervention(
        newCase.id,
        'pause_disbursement',
        3,
        'High risk detected'
      );

      const executed = executeIntervention(intervention.id, 'user_123');
      expect(executed?.status).toBe('executed');
      expect(executed?.executedBy).toBe('user_123');
    });

    test('should get case statistics', () => {
      const riskScoreResult = calculateRiskScore([], 0.5, 0.5, 0.5);
      
      createCase('Case 1', 'Desc 1', ['vendor_1'], ['alert_1'], riskScoreResult, 'high');
      createCase('Case 2', 'Desc 2', ['vendor_2'], ['alert_2'], riskScoreResult, 'medium');

      const stats = getCaseStats();
      expect(stats.total).toBe(2);
      expect(stats.byStatus['open']).toBe(2);
    });

    test('should get intervention statistics', () => {
      const riskScoreResult = calculateRiskScore([], 0.5, 0.5, 0.5);
      
      const newCase = createCase('Case 1', 'Desc 1', ['vendor_1'], ['alert_1'], riskScoreResult, 'high');
      
      createIntervention(newCase.id, 'pause_disbursement', 3, 'Test');
      createIntervention(newCase.id, 'require_verification', 2, 'Test');

      const stats = getInterventionStats();
      expect(stats.total).toBe(2);
      expect(stats.byStatus['pending']).toBe(2);
    });
  });

  describe('Integration Tests', () => {
    test('should run full detection pipeline', () => {
      // Create entities
      const vendor = upsertEntity({
        entityType: 'vendor',
        attributes: { name: 'Alpha Supply Ltd', phone: '+254700123456' }
      });

      const person = upsertEntity({
        entityType: 'person',
        attributes: { name: 'John Kamau' }
      });

      // Create links
      createEntityLink(vendor.id, person.id, 'director_of');

      // Ingest events
      const event1 = ingestEvent({
        eventType: 'invoice_submitted',
        sourceSystem: 'procurement_erp',
        timestamp: '2026-03-22T12:00:00Z',
        entityRefs: [vendor.id],
        payload: { amount: 9800 }
      });

      const event2 = ingestEvent({
        eventType: 'invoice_submitted',
        sourceSystem: 'procurement_erp',
        timestamp: '2026-03-22T12:05:00Z',
        entityRefs: [vendor.id],
        payload: { amount: 9500 }
      });

      // Run detection
      const events = getEventsByEntity(vendor.id);
      const ruleAlerts = evaluateEvent(event1, vendor, events);
      const anomalyScores = detectAnomalies(vendor.id, events, vendor);
      const links = getEntityLinks(vendor.id);
      const graphScores = analyzeEntityNetwork(vendor.id, new Map([[vendor.id, vendor]]), links);

      // Calculate risk score
      const avgAnomalyScore = anomalyScores.length > 0
        ? anomalyScores.reduce((a, b) => a + b.score, 0) / anomalyScores.length
        : 0;

      const avgGraphScore = graphScores.length > 0
        ? graphScores.reduce((a, b) => a + b.score, 0) / graphScores.length
        : 0;

      const riskScoreResult = calculateRiskScore(
        ruleAlerts,
        avgAnomalyScore,
        avgGraphScore,
        0
      );

      // Create case
      const newCase = createCase(
        'Suspicious Activity Detected',
        'Multiple risk signals detected',
        [vendor.id],
        [],
        riskScoreResult,
        'high'
      );

      expect(newCase).toBeDefined();
      expect(riskScoreResult.overallScore).toBeGreaterThan(0);
    });
  });
});
