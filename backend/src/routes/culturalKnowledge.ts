/**
 * Cultural Knowledge Impact Platform API Routes
 * Routes for managing cultural knowledge records and impact metrics
 */

import { Router, Request, Response } from 'express';
import culturalKnowledgeConnector, { CulturalKnowledgeRecord, CulturalKnowledgeQueryParams } from '../services/culturalKnowledge';

const router = Router();

// ==========================================
// Cultural Knowledge Record Routes
// ==========================================

/**
 * POST /api/cultural-knowledge/records
 * Create a new cultural knowledge record
 */
router.post('/records', async (req: Request, res: Response) => {
  try {
    const record = await culturalKnowledgeConnector.createRecord(req.body);
    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error creating cultural knowledge record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create cultural knowledge record'
    });
  }
});

/**
 * GET /api/cultural-knowledge/records
 * List cultural knowledge records with filtering
 */
router.get('/records', async (req: Request, res: Response) => {
  try {
    const { culture, region, category, preservationStatus, limit, offset } = req.query;
    
    const params: CulturalKnowledgeQueryParams = {
      culture: culture as string,
      region: region as string,
      category: category as string,
      preservationStatus: preservationStatus as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    };
    
    const records = await culturalKnowledgeConnector.listRecords(params);
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    console.error('Error listing cultural knowledge records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list cultural knowledge records'
    });
  }
});

/**
 * GET /api/cultural-knowledge/records/:id
 * Get cultural knowledge record by ID
 */
router.get('/records/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Record ID is required'
      });
    }
    const record = await culturalKnowledgeConnector.getRecordById(id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Cultural knowledge record not found'
      });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error getting cultural knowledge record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cultural knowledge record'
    });
  }
});

/**
 * PUT /api/cultural-knowledge/records/:id
 * Update cultural knowledge record
 */
router.put('/records/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Record ID is required'
      });
    }
    const record = await culturalKnowledgeConnector.updateRecord(id, req.body);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Cultural knowledge record not found'
      });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error updating cultural knowledge record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cultural knowledge record'
    });
  }
});

/**
 * DELETE /api/cultural-knowledge/records/:id
 * Delete cultural knowledge record
 */
router.delete('/records/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Record ID is required'
      });
    }
    const deleted = await culturalKnowledgeConnector.deleteRecord(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Cultural knowledge record not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Cultural knowledge record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cultural knowledge record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete cultural knowledge record'
    });
  }
});

/**
 * GET /api/cultural-knowledge/search
 * Search cultural knowledge records
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, limit } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const records = await culturalKnowledgeConnector.searchRecords(
      q,
      limit ? parseInt(limit as string) : 20
    );
    
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    console.error('Error searching cultural knowledge records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search cultural knowledge records'
    });
  }
});

// ==========================================
// Cultural Impact Metrics Routes
// ==========================================

/**
 * GET /api/cultural-knowledge/metrics
 * Get cultural impact metrics
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await culturalKnowledgeConnector.getImpactMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error getting cultural impact metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cultural impact metrics'
    });
  }
});

/**
 * POST /api/cultural-knowledge/sync
 * Sync records from external Cultural Knowledge Platform
 */
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const { externalRecords } = req.body;
    
    if (!Array.isArray(externalRecords)) {
      return res.status(400).json({
        success: false,
        error: 'externalRecords must be an array'
      });
    }
    
    const result = await culturalKnowledgeConnector.syncFromExternalApi(externalRecords);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error syncing cultural knowledge records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync cultural knowledge records'
    });
  }
});

export default router;
