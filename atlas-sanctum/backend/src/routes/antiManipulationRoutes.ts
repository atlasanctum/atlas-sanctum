/**
 * Atlas Sanctum Anti-Manipulation Engine
 * API Routes
 * 
 * REST API for detection, alerts, cases, and interventions
 */

import { Router, Request, Response } from 'express';
import {
  ingestEvent,
  ingestEventBatch,
  getEvent,
  getEventsByEntity,
  getEventStats
} from '../services/antiManipulation/eventIngestionService';
import {
  upsertEntity,
  getEntity,
  getEntitiesByType,
  searchEntities,
  createEntityLink,
  getEntityLinks,
  getEntityNetwork,
  getEntityStats
} from '../services/antiManipulation/entityResolutionService';
import {
  getAllRules,
  getEnabledRules,
  getRule,
  upsertRule,
  setRuleEnabled,
  evaluateEvent,
  getRuleStats
} from '../services/antiManipulation/rulesEngine';
import {
  detectAnomalies,
  getAnomalyScores,
  getAnomalyStats
} from '../services/antiManipulation/anomalyDetectionService';
import {
  analyzeEntityNetwork,
  getEntityNetworkForVisualization,
  getGraphRiskScores,
  getGraphRiskStats
} from '../services/antiManipulation/graphRiskEngine';
import {
  analyzeNarrativeConsistency,
  getNarrativeAnalysis,
  getNarrativeAnalysesByDocument,
  getNarrativeStats
} from '../services/antiManipulation/narrativeConsistencyEngine';
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
  getInterventionStats
} from '../services/antiManipulation/caseScoringEngine';
import {
  IngestEventRequest,
  UpsertEntityRequest,
  DetectionRequest,
  AlertFilter,
  CasePromotionRequest,
  InterventionRequest,
  NarrativeAnalysisRequest
} from '../types/antiManipulation';

const router = Router();

// ==================== Event Ingestion Routes ====================

/**
 * POST /v1/events
 * Ingest a single operational event
 */
router.post('/v1/events', async (req: Request, res: Response) => {
  try {
    const request: IngestEventRequest = req.body;
    const event = ingestEvent(request);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to ingest event' 
    });
  }
});

/**
 * POST /v1/events/batch
 * Ingest multiple events in batch
 */
router.post('/v1/events/batch', async (req: Request, res: Response) => {
  try {
    const requests: IngestEventRequest[] = req.body.events;
    const events = ingestEventBatch(requests);
    res.status(201).json({
      ingested: events.length,
      events
    });
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to ingest events' 
    });
  }
});

/**
 * GET /v1/events/:id
 * Get event by ID
 */
router.get('/v1/events/:id', async (req: Request, res: Response) => {
  try {
    const event = getEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

/**
 * GET /v1/events/entity/:entityId
 * Get events for an entity
 */
router.get('/v1/events/entity/:entityId', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const events = getEventsByEntity(req.params.entityId, limit);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

/**
 * GET /v1/events/stats
 * Get event statistics
 */
router.get('/v1/events/stats', async (req: Request, res: Response) => {
  try {
    const stats = getEventStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== Entity Routes ====================

/**
 * POST /v1/entities/upsert
 * Create or update an entity
 */
router.post('/v1/entities/upsert', async (req: Request, res: Response) => {
  try {
    const request: UpsertEntityRequest = req.body;
    const entity = upsertEntity(request);
    res.status(201).json(entity);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to upsert entity' 
    });
  }
});

/**
 * GET /v1/entities/:id
 * Get entity by ID
 */
router.get('/v1/entities/:id', async (req: Request, res: Response) => {
  try {
    const entity = getEntity(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    res.json(entity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entity' });
  }
});

/**
 * GET /v1/entities/type/:type
 * Get entities by type
 */
router.get('/v1/entities/type/:type', async (req: Request, res: Response) => {
  try {
    const entities = getEntitiesByType(req.params.type as any);
    res.json(entities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

/**
 * GET /v1/entities/search
 * Search entities
 */
router.get('/v1/entities/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 50;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }
    const entities = searchEntities(query, limit);
    res.json(entities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search entities' });
  }
});

/**
 * POST /v1/entities/:id/links
 * Create a link between entities
 */
router.post('/v1/entities/:id/links', async (req: Request, res: Response) => {
  try {
    const { toEntityId, linkType, metadata, confidence } = req.body;
    const link = createEntityLink(
      req.params.id,
      toEntityId,
      linkType,
      metadata || {},
      confidence || 1.0
    );
    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to create link' 
    });
  }
});

/**
 * GET /v1/entities/:id/links
 * Get links for an entity
 */
router.get('/v1/entities/:id/links', async (req: Request, res: Response) => {
  try {
    const links = getEntityLinks(req.params.id);
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

/**
 * GET /v1/entities/:id/network
 * Get entity network for visualization
 */
router.get('/v1/entities/:id/network', async (req: Request, res: Response) => {
  try {
    const depth = parseInt(req.query.depth as string) || 2;
    const network = getEntityNetwork(req.params.id, depth);
    res.json(network);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch network' });
  }
});

/**
 * GET /v1/entities/stats
 * Get entity statistics
 */
router.get('/v1/entities/stats', async (req: Request, res: Response) => {
  try {
    const stats = getEntityStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== Detection Routes ====================

/**
 * POST /v1/detect/run
 * Run detection on demand for an entity, project, or region
 */
router.post('/v1/detect/run', async (req: Request, res: Response) => {
  try {
    const request: DetectionRequest = req.body;
    
    // Get entity
    const entity = getEntity(request.scopeId);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Get events for entity
    const events = getEventsByEntity(request.scopeId, 1000);

    // Run rule engine
    const ruleAlerts = evaluateEvent(
      { id: '', eventType: 'invoice_submitted' as any, sourceSystem: 'manual', timestamp: new Date(), currency: 'USD', metadata: {}, processed: false, createdAt: new Date() },
      entity,
      events
    );

    // Run anomaly detection
    const anomalyScores = detectAnomalies(request.scopeId, events, entity);
    const avgAnomalyScore = anomalyScores.length > 0
      ? anomalyScores.reduce((a, b) => a + b.score, 0) / anomalyScores.length
      : 0;

    // Run graph analysis if requested
    let graphRiskScore = 0;
    if (request.includeGraph) {
      const links = getEntityLinks(request.scopeId);
      const graphScores = analyzeEntityNetwork(
        request.scopeId,
        new Map([[entity.id, entity]]),
        links
      );
      graphRiskScore = graphScores.length > 0
        ? graphScores.reduce((a, b) => a + b.score, 0) / graphScores.length
        : 0;
    }

    // Calculate composite risk score
    const riskScoreResult = calculateRiskScore(
      ruleAlerts,
      avgAnomalyScore,
      graphRiskScore,
      0 // narrative score would come from narrative engine
    );

    res.json({
      scopeId: request.scopeId,
      riskScore: riskScoreResult.overallScore,
      confidence: riskScoreResult.confidence,
      alertsCreated: ruleAlerts.length,
      topFindings: riskScoreResult.explanation.map(e => e.finding),
      details: {
        ruleHits: ruleAlerts.length,
        anomaliesDetected: anomalyScores.length,
        graphRiskSignals: graphRiskScore > 0 ? 1 : 0,
        narrativeIssues: 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Detection failed' 
    });
  }
});

// ==================== Rules Routes ====================

/**
 * GET /v1/rules
 * Get all detection rules
 */
router.get('/v1/rules', async (req: Request, res: Response) => {
  try {
    const rules = getAllRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

/**
 * GET /v1/rules/enabled
 * Get enabled rules only
 */
router.get('/v1/rules/enabled', async (req: Request, res: Response) => {
  try {
    const rules = getEnabledRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

/**
 * GET /v1/rules/:id
 * Get rule by ID
 */
router.get('/v1/rules/:id', async (req: Request, res: Response) => {
  try {
    const rule = getRule(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json(rule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rule' });
  }
});

/**
 * PUT /v1/rules/:id
 * Update a rule
 */
router.put('/v1/rules/:id', async (req: Request, res: Response) => {
  try {
    const rule = { ...req.body, id: req.params.id };
    const updated = upsertRule(rule);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to update rule' 
    });
  }
});

/**
 * POST /v1/rules/:id/enable
 * Enable or disable a rule
 */
router.post('/v1/rules/:id/enable', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    const rule = setRuleEnabled(req.params.id, enabled);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json(rule);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to update rule' 
    });
  }
});

/**
 * GET /v1/rules/stats
 * Get rule statistics
 */
router.get('/v1/rules/stats', async (req: Request, res: Response) => {
  try {
    const stats = getRuleStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== Anomaly Routes ====================

/**
 * GET /v1/anomalies/entity/:entityId
 * Get anomaly scores for an entity
 */
router.get('/v1/anomalies/entity/:entityId', async (req: Request, res: Response) => {
  try {
    const scores = getAnomalyScores(req.params.entityId);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch anomalies' });
  }
});

/**
 * GET /v1/anomalies/stats
 * Get anomaly statistics
 */
router.get('/v1/anomalies/stats', async (req: Request, res: Response) => {
  try {
    const stats = getAnomalyStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== Graph Risk Routes ====================

/**
 * GET /v1/graph-risk/entity/:entityId
 * Get graph risk scores for an entity
 */
router.get('/v1/graph-risk/entity/:entityId', async (req: Request, res: Response) => {
  try {
    const scores = getGraphRiskScores(req.params.entityId);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch graph risks' });
  }
});

/**
 * GET /v1/graph-risk/stats
 * Get graph risk statistics
 */
router.get('/v1/graph-risk/stats', async (req: Request, res: Response) => {
  try {
    const stats = getGraphRiskStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== Narrative Routes ====================

/**
 * POST /v1/narratives/analyze
 * Analyze narrative consistency
 */
router.post('/v1/narratives/analyze', async (req: Request, res: Response) => {
  try {
    const request: NarrativeAnalysisRequest = req.body;
    
    // Get evidence events
    const events = getEventsByEntity(request.evidenceScope.entityId || '', 1000);
    
    // Get entity if specified
    const entity = request.evidenceScope.entityId 
      ? getEntity(request.evidenceScope.entityId) 
      : undefined;

    const analysis = analyzeNarrativeConsistency(
      request.documentId,
      request.claims,
      events,
      entity
    );

    res.json(analysis);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Analysis failed' 
    });
  }
});

/**
 * GET /v1/narratives/:id
 * Get narrative analysis by ID
 */
router.get('/v1/narratives/:id', async (req: Request, res: Response) => {
  try {
    const analysis = getNarrativeAnalysis(parseInt(req.params.id));
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

/**
 * GET /v1/narratives/document/:documentId
 * Get narrative analyses for a document
 */
router.get('/v1/narratives/document/:documentId', async (req: Request, res: Response) => {
  try {
    const analyses = getNarrativeAnalysesByDocument(req.params.documentId);
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

/**
 * GET /v1/narratives/stats
 * Get narrative statistics
 */
router.get('/v1/narratives/stats', async (req: Request, res: Response) => {
  try {
    const stats = getNarrativeStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== Case Routes ====================

/**
 * POST /v1/cases
 * Create a new case
 */
router.post('/v1/cases', async (req: Request, res: Response) => {
  try {
    const { title, description, entityIds, alertIds, riskScore, priority } = req.body;
    
    // Calculate risk score if not provided
    let riskScoreResult;
    if (riskScore) {
      riskScoreResult = {
        overallScore: riskScore,
        confidence: 0.8,
        components: {
          ruleSeverity: 0,
          statisticalAnomaly: 0,
          graphCollusion: 0,
          narrativeContradiction: 0,
          accessAbuse: 0,
          historicalRecurrence: 0
        },
        multipliers: { financialExposure: 1, publicHarm: 1 },
        explanation: [],
        uncertainty: [],
        recommendedNextStep: 'Manual case creation'
      };
    } else {
      // Would calculate from alerts
      riskScoreResult = {
        overallScore: 50,
        confidence: 0.5,
        components: {
          ruleSeverity: 0,
          statisticalAnomaly: 0,
          graphCollusion: 0,
          narrativeContradiction: 0,
          accessAbuse: 0,
          historicalRecurrence: 0
        },
        multipliers: { financialExposure: 1, publicHarm: 1 },
        explanation: [],
        uncertainty: [],
        recommendedNextStep: 'Investigate further'
      };
    }

    const newCase = createCase(
      title,
      description || '',
      entityIds || [],
      alertIds || [],
      riskScoreResult,
      priority || 'medium'
    );

    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to create case' 
    });
  }
});

/**
 * GET /v1/cases
 * Get all cases
 */
router.get('/v1/cases', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    
    let cases;
    if (status) {
      cases = getCasesByStatus(status as any);
    } else {
      cases = getAllCases();
    }
    
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

/**
 * GET /v1/cases/:id
 * Get case by ID
 */
router.get('/v1/cases/:id', async (req: Request, res: Response) => {
  try {
    const caseData = getCase(req.params.id);
    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(caseData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

/**
 * PUT /v1/cases/:id/status
 * Update case status
 */
router.put('/v1/cases/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, owner } = req.body;
    const updated = updateCaseStatus(req.params.id, status, owner);
    if (!updated) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to update case' 
    });
  }
});

/**
 * POST /v1/cases/:id/assign
 * Assign case to owner
 */
router.post('/v1/cases/:id/assign', async (req: Request, res: Response) => {
  try {
    const { owner } = req.body;
    const updated = assignCase(req.params.id, owner);
    if (!updated) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to assign case' 
    });
  }
});

/**
 * GET /v1/cases/stats
 * Get case statistics
 */
router.get('/v1/cases/stats', async (req: Request, res: Response) => {
  try {
    const stats = getCaseStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== Intervention Routes ====================

/**
 * POST /v1/interventions
 * Create an intervention
 */
router.post('/v1/interventions', async (req: Request, res: Response) => {
  try {
    const request: InterventionRequest = req.body;
    
    // Determine intervention if not specified
    let action = request.action;
    let actionLevel = 0;
    let reason = request.reason;

    if (!action) {
      const caseData = getCase(request.caseId);
      if (!caseData) {
        return res.status(404).json({ error: 'Case not found' });
      }
      
      const intervention = determineIntervention(caseData.riskScore, caseData.confidence);
      action = intervention.action;
      actionLevel = intervention.level;
      reason = reason || intervention.reason;
    }

    const intervention = createIntervention(
      request.caseId,
      action,
      actionLevel,
      reason,
      req.body.executedBy
    );

    res.status(201).json(intervention);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to create intervention' 
    });
  }
});

/**
 * GET /v1/interventions/:id
 * Get intervention by ID
 */
router.get('/v1/interventions/:id', async (req: Request, res: Response) => {
  try {
    const intervention = getIntervention(req.params.id);
    if (!intervention) {
      return res.status(404).json({ error: 'Intervention not found' });
    }
    res.json(intervention);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch intervention' });
  }
});

/**
 * GET /v1/interventions/case/:caseId
 * Get interventions for a case
 */
router.get('/v1/interventions/case/:caseId', async (req: Request, res: Response) => {
  try {
    const interventions = getInterventionsByCase(req.params.caseId);
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interventions' });
  }
});

/**
 * POST /v1/interventions/:id/execute
 * Execute a pending intervention
 */
router.post('/v1/interventions/:id/execute', async (req: Request, res: Response) => {
  try {
    const { executedBy } = req.body;
    const intervention = executeIntervention(req.params.id, executedBy);
    if (!intervention) {
      return res.status(404).json({ error: 'Intervention not found or already executed' });
    }
    res.json(intervention);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Failed to execute intervention' 
    });
  }
});

/**
 * GET /v1/interventions/stats
 * Get intervention statistics
 */
router.get('/v1/interventions/stats', async (req: Request, res: Response) => {
  try {
    const stats = getInterventionStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
