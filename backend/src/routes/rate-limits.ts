/**
 * Rate Limiting Management API Routes
 * 
 * RESTful API endpoints for managing rate limiting configurations,
 * viewing statistics, and managing IP blocks.
 */

import { Router, Request, Response } from 'express';
import { rateLimitingService } from '../services/rateLimitingManagement';
import { authenticate, authorize } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/rate-limits/configs
 * Get all rate limit configurations
 */
router.get('/configs', async (req: Request, res: Response) => {
  try {
    const configs = await rateLimitingService.getConfigs();
    
    res.json({
      success: true,
      data: configs,
      count: configs.length
    });
  } catch (error) {
    logger.error('[rate-limits] Failed to get configs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve rate limit configurations'
    });
  }
});

/**
 * GET /api/rate-limits/configs/:id
 * Get a specific rate limit configuration
 */
router.get('/configs/:id', async (req: Request, res: Response) => {
  try {
    const configId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const config = await rateLimitingService.getConfig(configId);
    
    if (!config) {
      return res.status(404).json({
        success: false,
        error: 'Configuration not found'
      });
    }
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    logger.error('[rate-limits] Failed to get config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve configuration'
    });
  }
});

/**
 * POST /api/rate-limits/configs
 * Create or update a rate limit configuration
 * Requires admin authentication
 */
router.post(
  '/configs',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const config = await rateLimitingService.upsertConfig(req.body);
      
      logger.info(`[rate-limits] Configuration ${config.id} updated by user ${req.user?.id}`);
      
      res.status(201).json({
        success: true,
        data: config,
        message: 'Configuration created/updated successfully'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to create/update config:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create/update configuration'
      });
    }
  }
);

/**
 * DELETE /api/rate-limits/configs/:id
 * Delete a rate limit configuration
 * Requires admin authentication
 */
router.delete(
  '/configs/:id',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const configId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deleted = await rateLimitingService.deleteConfig(configId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Configuration not found'
        });
      }
      
      logger.info(`[rate-limits] Configuration ${configId} deleted by user ${req.user?.id}`);
      
      res.json({
        success: true,
        message: 'Configuration deleted successfully'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to delete config:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete configuration'
      });
    }
  }
);

/**
 * POST /api/rate-limits/configs/reset
 * Reset all configurations to defaults
 * Requires admin authentication
 */
router.post(
  '/configs/reset',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      await rateLimitingService.resetToDefaults();
      
      logger.info(`[rate-limits] Configurations reset to defaults by user ${req.user?.id}`);
      
      res.json({
        success: true,
        message: 'Configurations reset to defaults'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to reset configs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset configurations'
      });
    }
  }
);

/**
 * GET /api/rate-limits/stats
 * Get rate limit statistics for all endpoints
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await rateLimitingService.getAllStats();
    
    res.json({
      success: true,
      data: stats,
      count: stats.length
    });
  } catch (error) {
    logger.error('[rate-limits] Failed to get stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

/**
 * GET /api/rate-limits/stats/:endpoint
 * Get rate limit statistics for a specific endpoint
 */
router.get('/stats/:endpoint(*)', async (req: Request, res: Response) => {
  try {
    const endpoint = Array.isArray(req.params.endpoint) ? req.params.endpoint.join('/') : req.params.endpoint;
    const stats = await rateLimitingService.getStats(endpoint);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'No statistics found for this endpoint'
      });
    }
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('[rate-limits] Failed to get stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

/**
 * DELETE /api/rate-limits/stats/:endpoint
 * Clear rate limit statistics for an endpoint
 * Requires admin authentication
 */
router.delete(
  '/stats/:endpoint(*)',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const endpoint = Array.isArray(req.params.endpoint) ? req.params.endpoint.join('/') : req.params.endpoint;
      const cleared = await rateLimitingService.clearStats(endpoint);
      
      if (!cleared) {
        return res.status(404).json({
          success: false,
          error: 'Statistics not found for this endpoint'
        });
      }
      
      logger.info(`[rate-limits] Stats cleared for ${endpoint} by user ${req.user?.id}`);
      
      res.json({
        success: true,
        message: 'Statistics cleared successfully'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to clear stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear statistics'
      });
    }
  }
);

/**
 * GET /api/rate-limits/blocked-ips
 * Get all blocked IP addresses
 * Requires admin authentication
 */
router.get(
  '/blocked-ips',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const blockedIPs = await rateLimitingService.getBlockedIPs();
      
      res.json({
        success: true,
        data: blockedIPs,
        count: blockedIPs.length
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to get blocked IPs:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve blocked IPs'
      });
    }
  }
);

/**
 * POST /api/rate-limits/blocked-ips
 * Block an IP address
 * Requires admin authentication
 */
router.post(
  '/blocked-ips',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const { ip, endpoint, durationMinutes, reason } = req.body;
      
      if (!ip) {
        return res.status(400).json({
          success: false,
          error: 'IP address is required'
        });
      }
      
      const block = await rateLimitingService.blockIP(
        ip,
        endpoint || '*',
        durationMinutes || 60,
        reason
      );
      
      logger.warn(`[rate-limits] IP ${ip} blocked by user ${req.user?.id}: ${reason || 'No reason provided'}`);
      
      res.status(201).json({
        success: true,
        data: block,
        message: 'IP blocked successfully'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to block IP:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to block IP'
      });
    }
  }
);

/**
 * DELETE /api/rate-limits/blocked-ips/:ip
 * Unblock an IP address
 * Requires admin authentication
 */
router.delete(
  '/blocked-ips/:ip',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const ip = Array.isArray(req.params.ip) ? req.params.ip[0] : req.params.ip;
      const endpoint = req.query.endpoint as string || '*';
      
      const unblocked = await rateLimitingService.unblockIP(ip, endpoint);
      
      if (!unblocked) {
        return res.status(404).json({
          success: false,
          error: 'IP block not found'
        });
      }
      
      logger.info(`[rate-limits] IP ${ip} unblocked by user ${req.user?.id}`);
      
      res.json({
        success: true,
        message: 'IP unblocked successfully'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to unblock IP:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to unblock IP'
      });
    }
  }
);

/**
 * GET /api/rate-limits/user/:userId
 * Get custom rate limits for a user
 * Requires admin authentication or own user ID
 */
router.get(
  '/user/:userId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      
      // Allow users to view their own limits or admins to view any
      if (req.user?.id !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
      
      const endpoint = req.query.endpoint as string;
      
      if (endpoint) {
        const limit = await rateLimitingService.getUserLimit(userId, endpoint);
        
        res.json({
          success: true,
          data: limit
        });
      } else {
        res.json({
          success: true,
          data: null,
          message: 'Specify endpoint parameter to get user limit'
        });
      }
    } catch (error) {
      logger.error('[rate-limits] Failed to get user limit:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user limit'
      });
    }
  }
);

/**
 * POST /api/rate-limits/user
 * Set custom rate limit for a user
 * Requires admin authentication
 */
router.post(
  '/user',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const { userId, endpoint, windowMs, maxRequests, expiresInHours } = req.body;
      
      if (!userId || !endpoint || !windowMs || !maxRequests) {
        return res.status(400).json({
          success: false,
          error: 'userId, endpoint, windowMs, and maxRequests are required'
        });
      }
      
      const limit = await rateLimitingService.setUserLimit(
        userId,
        endpoint,
        windowMs,
        maxRequests,
        expiresInHours
      );
      
      logger.info(`[rate-limits] Custom limit set for user ${userId} by admin ${req.user?.id}`);
      
      res.status(201).json({
        success: true,
        data: limit,
        message: 'User rate limit set successfully'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to set user limit:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to set user rate limit'
      });
    }
  }
);

/**
 * DELETE /api/rate-limits/user/:userId
 * Remove custom rate limit for a user
 * Requires admin authentication
 */
router.delete(
  '/user/:userId',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response) => {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const endpoint = req.query.endpoint as string;
      
      if (!endpoint) {
        return res.status(400).json({
          success: false,
          error: 'Endpoint parameter is required'
        });
      }
      
      await rateLimitingService.removeUserLimit(userId, endpoint);
      
      logger.info(`[rate-limits] Custom limit removed for user ${userId} by admin ${req.user?.id}`);
      
      res.json({
        success: true,
        message: 'User rate limit removed successfully'
      });
    } catch (error) {
      logger.error('[rate-limits] Failed to remove user limit:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove user rate limit'
      });
    }
  }
);

export default router;
