/**
 * Atlas Model Governance API Routes
 * 
 * RESTful API endpoints for model governance operations
 */

import { Router, Request, Response } from 'express';
import { ModelGovernanceService, ModelIdentity, BiasAuditConfig, DriftMonitorConfig, GovernanceReport } from '../services/ModelGovernanceService';

const router = Router();
const governanceService = new ModelGovernanceService();

/**
 * POST /api/governance/models/:modelId/register
 * Register a model for governance monitoring
 */
router.post('/models/:modelId/register', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const { name, description, owner, tags, biasConfig, driftConfig } = req.body;

    const modelIdentity: ModelIdentity = {
      modelId,
      version: req.body.version || '1.0.0',
      name,
      description,
      deployedAt: new Date(),
      owner,
      tags: tags || [],
    };

    const biasAuditConfig: BiasAuditConfig = {
      protectedAttributes: biasConfig?.protectedAttributes || ['demographic_group'],
      fairnessMetrics: biasConfig?.fairnessMetrics || ['demographic_parity', 'equal_opportunity'],
      thresholds: biasConfig?.thresholds || { demographic_parity: 0.1, equal_opportunity: 0.1 },
      auditFrequency: biasConfig?.auditFrequency || 'daily',
      sampleSize: biasConfig?.sampleSize || 1000,
    };

    const driftMonitorConfig: DriftMonitorConfig = {
      referenceWindow: driftConfig?.referenceWindow || 10000,
      monitoringWindow: driftConfig?.monitoringWindow || 1000,
      alertThreshold: driftConfig?.alertThreshold || 0.2,
      checkFrequency: driftConfig?.checkFrequency || 'daily',
      driftTests: driftConfig?.driftTests || ['population_stability_index', 'kolmogorov_smirnov'],
      featureSubset: driftConfig?.featureSubset,
    };

    governanceService.registerModel(modelIdentity, biasAuditConfig, driftMonitorConfig);

    res.status(201).json({
      success: true,
      message: `Model ${modelId} registered for governance monitoring`,
      data: { modelId, biasConfig: biasAuditConfig, driftConfig: driftMonitorConfig },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * POST /api/governance/predictions
 * Record a prediction for governance analysis
 */
router.post('/predictions', async (req: Request, res: Response) => {
  try {
    const { predictionId, modelId, inputFeatures, prediction, actual, group, metadata } = req.body;

    governanceService.recordPrediction({
      predictionId,
      modelId,
      timestamp: new Date(),
      inputFeatures,
      prediction,
      actual,
      group,
      metadata: metadata || {},
    });

    res.status(201).json({
      success: true,
      message: 'Prediction recorded',
      data: { predictionId },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * POST /api/governance/models/:modelId/audit
 * Run bias audit for a model
 */
router.post('/models/:modelId/audit', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const result = await governanceService.runBiasAudit(modelId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * POST /api/governance/models/:modelId/drift
 * Run drift detection for a model
 */
router.post('/models/:modelId/drift', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const result = await governanceService.runDriftDetection(modelId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/governance/models/:modelId/report
 * Generate comprehensive governance report
 */
router.get('/models/:modelId/report', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const report = await governanceService.generateGovernanceReport(modelId, start, end);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/governance/models/:modelId/status
 * Get current governance status summary
 */
router.get('/models/:modelId/status', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    
    const [latestAudit, latestDrift] = await Promise.all([
      governanceService.runBiasAudit(modelId),
      governanceService.runDriftDetection(modelId),
    ]);

    const governanceScore = (latestAudit.overallScore + (1 - latestDrift.overallDriftScore)) / 2;

    res.json({
      success: true,
      data: {
        modelId,
        governanceScore,
        riskLevel: governanceScore >= 0.75 ? 'low' : governanceScore >= 0.5 ? 'medium' : 'high',
        biasAudit: {
          overallScore: latestAudit.overallScore,
          violationsCount: latestAudit.violations.length,
          complianceStatus: latestAudit.complianceStatus,
        },
        driftDetection: {
          overallDriftScore: latestDrift.overallDriftScore,
          driftDetected: latestDrift.driftDetected,
          severity: latestDrift.driftSeverity,
          affectedFeatures: latestDrift.affectedFeatures,
        },
        lastUpdated: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

/**
 * GET /api/governance/alerts
 * Get all active governance alerts
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    // This would typically query a database of alerts
    res.json({
      success: true,
      data: {
        alerts: [],
        count: 0,
        lastChecked: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default router;
