/**
 * Atlas Sanctum — Regenerative Intelligence Engine (AS-RIE)
 * REST API Routes
 *
 * POST /api/v3/rie/execute   — run the full pipeline for a context
 * GET  /api/v3/rie/health    — pipeline health check
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeRIEPipeline } from '../services/regenerativeIntelligenceEngine';
import { RIEQuery, RIEContext } from '../types/rie';

const router = Router();

/**
 * POST /api/v3/rie/execute
 *
 * Body: { context: RIEContext, resultSize?: number, diversityEnabled?: boolean, emergingBoostEnabled?: boolean }
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const {
      context,
      resultSize = 5,
      diversityEnabled = true,
      emergingBoostEnabled = true,
    } = req.body as {
      context: RIEContext;
      resultSize?: number;
      diversityEnabled?: boolean;
      emergingBoostEnabled?: boolean;
    };

    if (!context?.actorId || !context?.objective) {
      return res.status(400).json({
        success: false,
        error: 'context.actorId and context.objective are required',
      });
    }

    const query: RIEQuery = {
      context,
      resultSize: Math.min(Math.max(1, resultSize), 20),
      diversityEnabled,
      emergingBoostEnabled,
      requestId: uuidv4(),
      requestedAt: new Date().toISOString(),
    };

    const result = await executeRIEPipeline(query);

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('[AS-RIE] Pipeline execution error:', error);
    return res.status(500).json({
      success: false,
      error: 'Regenerative Intelligence Engine pipeline failed',
    });
  }
});

/**
 * GET /api/v3/rie/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'AS-RIE',
    version: '1.0.0',
    status: 'operational',
    stages: [
      'source',
      'hydrate',
      'filter',
      'emerging_boost',
      'score',
      'select',
      'explain',
      'system_connections',
    ],
  });
});

export default router;
