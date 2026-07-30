/**
 * Atlas Sanctum API Routes
 * REST API for covenant runtime system
 */

import { Router, Request, Response } from 'express';
import { computeRiskScore, validateRiskInputs, generateRiskSnapshotId } from '../services/riskEngine';
import { evaluateCovenant, generateCovenantId, generateInterventionId } from '../services/covenantEngine';

const router = Router();

// ==================== Auth Routes ====================

/**
 * POST /api/auth/wallet/nonce
 * Returns nonce for wallet signature auth
 */
router.post('/auth/wallet/nonce', async (req: Request, res: Response) => {
  try {
    const nonce = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    res.json({ nonce });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

/**
 * POST /api/auth/wallet/verify
 * Verifies signed message and returns session token
 */
router.post('/auth/wallet/verify', async (req: Request, res: Response) => {
  try {
    const { address, signature } = req.body;
    
    // In production, verify the signature
    // For MVP, accept any valid-looking address
    if (!address || !signature) {
      return res.status(400).json({ error: 'Address and signature required' });
    }
    
    // Mock JWT token
    const token = `jwt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    res.json({
      token,
      user: {
        id: `usr_${address.substring(2, 8)}`,
        role: 'steward',
        address,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// ==================== Regions Routes ====================

/**
 * GET /api/regions
 * List all regions
 */
router.get('/regions', async (req: Request, res: Response) => {
  try {
    // Mock data - in production, query database
    const regions = [
      {
        id: 'reg_nairobi_east',
        name: 'Nairobi East Basin',
        country: 'Kenya',
        lat: -1.286,
        lng: 36.817,
        vulnerabilityIndex: 0.82,
      },
    ];
    
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

/**
 * GET /api/regions/:id
 * Get region details
 */
router.get('/regions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock data
    const region = {
      id,
      name: 'Nairobi East Basin',
      country: 'Kenya',
      lat: -1.286,
      lng: 36.817,
      vulnerabilityIndex: 0.82,
    };
    
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch region' });
  }
});

// ==================== Risk Routes ====================

/**
 * POST /api/risk/ingest
 * Ingest new source data for a region
 */
router.post('/risk/ingest', async (req: Request, res: Response) => {
  try {
    const { regionId, rainfallMm24h, forecastRainMm48h, riverLevelMeters, source } = req.body;
    
    // Validate inputs
    const errors = validateRiskInputs({
      rainfallMm24h,
      forecastRainMm48h,
      riverLevelMeters,
      vulnerabilityIndex: 0.82, // Would come from region data
    });
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // In production, store in database
    res.json({ success: true, regionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ingest data' });
  }
});

/**
 * POST /api/risk/score
 * Compute and persist risk snapshot
 */
router.post('/risk/score', async (req: Request, res: Response) => {
  try {
    const { regionId } = req.body;
    
    // Mock inputs - in production, fetch from database
    const inputs = {
      rainfallMm24h: 88,
      forecastRainMm48h: 120,
      riverLevelMeters: 4.2,
      vulnerabilityIndex: 0.82,
    };
    
    const result = computeRiskScore(inputs);
    const snapshotId = generateRiskSnapshotId(regionId);
    
    res.json({
      snapshotId,
      regionId,
      riskScore: result.riskScore,
      severity: result.severity,
      factors: result.factors,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compute risk score' });
  }
});

/**
 * GET /api/risk/latest/:regionId
 * Get latest risk snapshot
 */
router.get('/risk/latest/:regionId', async (req: Request, res: Response) => {
  try {
    const { regionId } = req.params;
    
    // Mock data
    const snapshot = {
      id: 'risk_001',
      regionId,
      rainfallMm24h: 88,
      riverLevelMeters: 4.2,
      soilSaturation: 0.75,
      forecastRainMm48h: 120,
      vulnerabilityIndex: 0.82,
      riskScore: 78,
      severity: 'critical',
      modelVersion: '1.0.0',
      createdAt: new Date().toISOString(),
    };
    
    res.json(snapshot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch risk snapshot' });
  }
});

/**
 * GET /api/risk/history/:regionId
 * Get risk trend for charts
 */
router.get('/risk/history/:regionId', async (req: Request, res: Response) => {
  try {
    const { regionId } = req.params;
    
    // Mock trend data
    const history = [
      { date: '2026-03-16', riskScore: 45 },
      { date: '2026-03-17', riskScore: 52 },
      { date: '2026-03-18', riskScore: 58 },
      { date: '2026-03-19', riskScore: 65 },
      { date: '2026-03-20', riskScore: 72 },
      { date: '2026-03-21', riskScore: 75 },
      { date: '2026-03-22', riskScore: 78 },
    ];
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch risk history' });
  }
});

// ==================== Covenants Routes ====================

/**
 * POST /api/covenants
 * Create covenant draft
 */
router.post('/covenants', async (req: Request, res: Response) => {
  try {
    const { title, description, regionId, minRiskScore, reserveRequiredUsd, payoutAmountUsd, autoExecute } = req.body;
    
    const covenantId = generateCovenantId();
    
    // In production, store in database
    res.json({
      id: covenantId,
      status: 'draft',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create covenant' });
  }
});

/**
 * POST /api/covenants/:id/arm
 * Arm covenant for execution
 */
router.post('/covenants/:id/arm', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In production, update database
    res.json({
      id,
      status: 'armed',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to arm covenant' });
  }
});

/**
 * GET /api/covenants
 * List covenants
 */
router.get('/covenants', async (req: Request, res: Response) => {
  try {
    // Mock data
    const covenants = [
      {
        id: 'cov_001',
        title: 'Flood Response Covenant - Nairobi East',
        regionId: 'reg_nairobi_east',
        minRiskScore: 70,
        reserveRequiredUsd: 10000,
        payoutAmountUsd: 5000,
        autoExecute: true,
        status: 'armed',
        createdAt: new Date().toISOString(),
      },
    ];
    
    res.json(covenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch covenants' });
  }
});

/**
 * GET /api/covenants/:id
 * Get covenant details
 */
router.get('/covenants/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock data
    const covenant = {
      id,
      title: 'Flood Response Covenant - Nairobi East',
      description: 'Release emergency funds when flood risk exceeds threshold and reserves are verified.',
      regionId: 'reg_nairobi_east',
      triggerType: 'flood_response',
      minRiskScore: 70,
      reserveRequiredUsd: 10000,
      payoutAmountUsd: 5000,
      autoExecute: true,
      status: 'armed',
      createdBy: '0x123...',
      createdAt: new Date().toISOString(),
    };
    
    res.json(covenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch covenant' });
  }
});

/**
 * POST /api/covenants/:id/evaluate
 * Run covenant engine evaluation
 */
router.post('/covenants/:id/evaluate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock covenant data
    const covenant = {
      id,
      title: 'Flood Response Covenant - Nairobi East',
      regionId: 'reg_nairobi_east',
      minRiskScore: 70,
      reserveRequiredUsd: 10000,
      payoutAmountUsd: 5000,
      autoExecute: true,
      status: 'armed' as const,
      createdAt: new Date().toISOString(),
    };
    
    // Mock risk data
    const latestRisk = {
      id: 'risk_001',
      regionId: 'reg_nairobi_east',
      riskScore: 78,
      severity: 'critical' as const,
      createdAt: new Date().toISOString(),
    };
    
    // Mock reserve data
    const reserve = {
      id: 'res_001',
      name: 'Emergency Response Reserve',
      assetSymbol: 'USDC',
      currentBalance: 25000,
      committedBalance: 0,
      proofStatus: 'verified' as const,
      lastCheckedAt: new Date().toISOString(),
    };
    
    const result = evaluateCovenant(covenant, latestRisk, reserve);
    
    res.json({
      covenantId: id,
      eligible: result.eligible,
      checks: {
        riskThresholdMet: result.riskThresholdMet,
        reserveVerified: result.reserveVerified,
        sufficientBalance: result.sufficientBalance,
        covenantArmed: result.covenantArmed,
        cooldownPassed: result.cooldownPassed,
      },
      details: result.details,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate covenant' });
  }
});

/**
 * POST /api/covenants/:id/execute
 * Trigger offchain workflow + onchain tx
 */
router.post('/covenants/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const interventionId = generateInterventionId();
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    // In production:
    // 1. Update covenant status to 'triggered'
    // 2. Create intervention record
    // 3. Call smart contract
    // 4. Update intervention with txHash
    
    res.json({
      interventionId,
      executionStatus: 'submitted',
      txHash,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute covenant' });
  }
});

// ==================== Reserves Routes ====================

/**
 * GET /api/reserves
 * List reserve pools
 */
router.get('/reserves', async (req: Request, res: Response) => {
  try {
    // Mock data
    const reserves = [
      {
        id: 'res_001',
        name: 'Emergency Response Reserve',
        assetSymbol: 'USDC',
        currentBalance: 25000,
        committedBalance: 0,
        proofStatus: 'verified',
        lastCheckedAt: new Date().toISOString(),
      },
    ];
    
    res.json(reserves);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reserves' });
  }
});

/**
 * POST /api/reserves/verify
 * Run reserve verification
 */
router.post('/reserves/verify', async (req: Request, res: Response) => {
  try {
    const { reserveAccountId } = req.body;
    
    // In production, verify onchain balance
    res.json({
      reserveAccountId,
      proofStatus: 'verified',
      currentBalance: 25000,
      committedBalance: 0,
      availableBalance: 25000,
      lastCheckedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify reserve' });
  }
});

// ==================== Interventions Routes ====================

/**
 * GET /api/interventions
 * List interventions
 */
router.get('/interventions', async (req: Request, res: Response) => {
  try {
    // Mock data
    const interventions = [
      {
        id: 'int_001',
        covenantId: 'cov_001',
        regionId: 'reg_nairobi_east',
        type: 'cash_release',
        amountUsd: 5000,
        txHash: '0xdeadbeef...',
        executionStatus: 'confirmed',
        createdAt: new Date().toISOString(),
      },
    ];
    
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interventions' });
  }
});

/**
 * GET /api/interventions/:id
 * Get intervention state
 */
router.get('/interventions/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock data
    const intervention = {
      id,
      covenantId: 'cov_001',
      regionId: 'reg_nairobi_east',
      type: 'cash_release',
      amountUsd: 5000,
      txHash: '0xdeadbeef...',
      executionStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    
    res.json(intervention);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch intervention' });
  }
});

/**
 * POST /api/interventions/:id/confirm
 * Manually confirm execution
 */
router.post('/interventions/:id/confirm', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In production, update database
    res.json({
      id,
      executionStatus: 'confirmed',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm intervention' });
  }
});

// ==================== Verification Routes ====================

/**
 * POST /api/verifications/evidence
 * Upload proof
 */
router.post('/verifications/evidence', async (req: Request, res: Response) => {
  try {
    const { interventionId, fileUrl, fileType, latitude, longitude, timestamp, notes, hash } = req.body;
    
    const evidenceId = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // In production, store in database
    res.json({
      evidenceId,
      status: 'submitted',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit evidence' });
  }
});

/**
 * POST /api/verifications/:interventionId/evaluate
 * Aggregate evidence and compute confidence
 */
router.post('/verifications/:interventionId/evaluate', async (req: Request, res: Response) => {
  try {
    const { interventionId } = req.params;
    
    // In production, aggregate evidence and compute confidence
    res.json({
      interventionId,
      deliveryConfirmed: true,
      confidenceScore: 0.91,
      householdsReached: 340,
      suppliesDelivered: 1200,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to evaluate verification' });
  }
});

/**
 * POST /api/verifications/:interventionId/finalize
 * Write verified result onchain
 */
router.post('/verifications/:interventionId/finalize', async (req: Request, res: Response) => {
  try {
    const { interventionId } = req.params;
    
    // In production, call smart contract
    const txHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    res.json({
      interventionId,
      verificationTxHash: txHash,
      status: 'verified',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to finalize verification' });
  }
});

// ==================== Dashboard Routes ====================

/**
 * GET /api/dashboard/summary
 * Returns homepage summary
 */
router.get('/dashboard/summary', async (req: Request, res: Response) => {
  try {
    // Mock data
    res.json({
      activeCovenants: 4,
      criticalRegions: 2,
      verifiedInterventions: 9,
      reserveCoverageUsd: 48000,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

export default router;
