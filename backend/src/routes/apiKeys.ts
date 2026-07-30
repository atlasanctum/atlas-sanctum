/**
 * API Key Routes
 * 
 * Routes for API key management.
 */

import { Router } from 'express';
import { apiKeyService } from '../services/apiKeys';
import { apiAnalyticsService } from '../services/apiAnalytics';
import { rateLimitingService } from '../services/rateLimiting';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';

const router = Router();

/**
 * @route   POST /api/keys
 * @desc    Generate a new API key
 * @access  Private
 */
router.post('/', authenticate, async (req: any, res) => {
  try {
    const { name, scopes, expiresAt, allowedIPs, allowedOrigins } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
        code: 'MISSING_NAME',
      });
    }

    const apiKey = await apiKeyService.generateKey(
      req.user.id,
      req.user.tenantId || req.user.organizationId || 'default',
      name,
      {
        scopes: scopes || ['read'],
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        allowedIPs,
        allowedOrigins,
      }
    );

    res.status(201).json({
      success: true,
      data: apiKey,
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({
      error: 'Failed to generate API key',
      code: 'GENERATION_FAILED',
    });
  }
});

/**
 * @route   GET /api/keys
 * @desc    Get all API keys for the current user
 * @access  Private
 */
router.get('/', authenticate, async (req: any, res) => {
  try {
    const keys = await apiKeyService.getKeysForUser(req.user.id);

    res.json({
      success: true,
      data: keys,
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({
      error: 'Failed to fetch API keys',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/keys/organization/:organizationId
 * @desc    Get all API keys for an organization
 * @access  Private (requires organization admin)
 */
router.get(
  '/organization/:organizationId',
  authenticate,
  requirePermission('api_keys:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;

      const keys = await apiKeyService.getKeysForOrganization(organizationId);

      res.json({
        success: true,
        data: keys,
      });
    } catch (error) {
      console.error('Error fetching organization API keys:', error);
      res.status(500).json({
        error: 'Failed to fetch organization API keys',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   GET /api/keys/:id
 * @desc    Get a specific API key
 * @access  Private
 */
router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    res.json({
      success: true,
      data: key,
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({
      error: 'Failed to fetch API key',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   PUT /api/keys/:id
 * @desc    Update an API key
 * @access  Private
 */
router.put('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, scopes, expiresAt, allowedIPs, allowedOrigins, isActive } = req.body;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    const updatedKey = await apiKeyService.updateKey(
      id,
      req.user.id,
      {
        name,
        scopes,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        allowedIPs,
        allowedOrigins,
      }
    );

    res.json({
      success: true,
      data: updatedKey,
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({
      error: 'Failed to update API key',
      code: 'UPDATE_FAILED',
    });
  }
});

/**
 * @route   DELETE /api/keys/:id
 * @desc    Delete an API key
 * @access  Private
 */
router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    await apiKeyService.deleteKey(id, req.user.id);

    res.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({
      error: 'Failed to delete API key',
      code: 'DELETE_FAILED',
    });
  }
});

/**
 * @route   POST /api/keys/:id/revoke
 * @desc    Revoke an API key
 * @access  Private
 */
router.post('/:id/revoke', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    await apiKeyService.revokeKey(id, req.user.id);

    res.json({
      success: true,
      message: 'API key revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    res.status(500).json({
      error: 'Failed to revoke API key',
      code: 'REVOKE_FAILED',
    });
  }
});

/**
 * @route   GET /api/keys/:id/usage
 * @desc    Get usage statistics for an API key
 * @access  Private
 */
router.get('/:id/usage', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const usage = await apiKeyService.getUsageStatistics(id, start, end);

    res.json({
      success: true,
      data: usage,
    });
  } catch (error) {
    console.error('Error fetching API key usage:', error);
    res.status(500).json({
      error: 'Failed to fetch API key usage',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/keys/:id/analytics
 * @desc    Get detailed analytics for an API key
 * @access  Private
 */
router.get('/:id/analytics', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, interval } = req.query;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const metrics = await apiAnalyticsService.getMetrics(id, start, end);

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching API key analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch API key analytics',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/keys/:id/timeseries
 * @desc    Get time series data for an API key
 * @access  Private
 */
router.get('/:id/timeseries', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, interval } = req.query;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const timeSeries = await apiAnalyticsService.getTimeSeries(
      id,
      start,
      end,
      (interval as 'hour' | 'day' | 'week' | 'month') || 'hour'
    );

    res.json({
      success: true,
      data: timeSeries,
    });
  } catch (error) {
    console.error('Error fetching time series data:', error);
    res.status(500).json({
      error: 'Failed to fetch time series data',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/keys/:id/health
 * @desc    Get health metrics for an API key
 * @access  Private
 */
router.get('/:id/health', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;

    const key = await apiKeyService.getKeyById(id, req.user.id);

    if (!key) {
      return res.status(404).json({
        error: 'API key not found',
        code: 'NOT_FOUND',
      });
    }

    const health = await apiAnalyticsService.getKeyHealthMetrics(id);

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error('Error fetching API key health:', error);
    res.status(500).json({
      error: 'Failed to fetch API key health',
      code: 'FETCH_FAILED',
    });
  }
});

/**
 * @route   GET /api/keys/organization/:organizationId/statistics
 * @desc    Get organization API statistics
 * @access  Private (requires organization admin)
 */
router.get(
  '/organization/:organizationId/statistics',
  authenticate,
  requirePermission('api_keys:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;

      const stats = await apiKeyService.getOrganizationStatistics(organizationId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching organization statistics:', error);
      res.status(500).json({
        error: 'Failed to fetch organization statistics',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   GET /api/keys/organization/:organizationId/analytics
 * @desc    Get organization API analytics
 * @access  Private (requires organization admin)
 */
router.get(
  '/organization/:organizationId/analytics',
  authenticate,
  requirePermission('api_keys:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const analytics = await apiAnalyticsService.getOrganizationMetrics(organizationId, start, end);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error('Error fetching organization analytics:', error);
      res.status(500).json({
        error: 'Failed to fetch organization analytics',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   GET /api/keys/organization/:organizationId/usage-trends
 * @desc    Get organization usage trends
 * @access  Private (requires organization admin)
 */
router.get(
  '/organization/:organizationId/usage-trends',
  authenticate,
  requirePermission('api_keys:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { days } = req.query;

      const trends = await apiAnalyticsService.getUsageTrends(
        organizationId,
        days ? parseInt(days as string) : 30
      );

      res.json({
        success: true,
        data: trends,
      });
    } catch (error) {
      console.error('Error fetching usage trends:', error);
      res.status(500).json({
        error: 'Failed to fetch usage trends',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   GET /api/keys/organization/:organizationId/slow-endpoints
 * @desc    Get slow endpoints for organization
 * @access  Private (requires organization admin)
 */
router.get(
  '/organization/:organizationId/slow-endpoints',
  authenticate,
  requirePermission('api_keys:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { startDate, endDate, threshold } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const slowEndpoints = await apiAnalyticsService.getSlowEndpoints(
        organizationId,
        start,
        end,
        threshold ? parseInt(threshold as string) : 1000
      );

      res.json({
        success: true,
        data: slowEndpoints,
      });
    } catch (error) {
      console.error('Error fetching slow endpoints:', error);
      res.status(500).json({
        error: 'Failed to fetch slow endpoints',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   GET /api/keys/organization/:organizationId/error-rates
 * @desc    Get error rates by status code for organization
 * @access  Private (requires organization admin)
 */
router.get(
  '/organization/:organizationId/error-rates',
  authenticate,
  requirePermission('api_keys:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const errorRates = await apiAnalyticsService.getErrorRateByStatus(organizationId, start, end);

      res.json({
        success: true,
        data: errorRates,
      });
    } catch (error) {
      console.error('Error fetching error rates:', error);
      res.status(500).json({
        error: 'Failed to fetch error rates',
        code: 'FETCH_FAILED',
      });
    }
  }
);

/**
 * @route   GET /api/keys/organization/:organizationId/report
 * @desc    Generate analytics report for organization
 * @access  Private (requires organization admin)
 */
router.get(
  '/organization/:organizationId/report',
  authenticate,
  requirePermission('api_keys:read'),
  async (req: any, res) => {
    try {
      const { organizationId } = req.params;
      const { startDate, endDate, format } = req.query;

      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();

      const report = await apiAnalyticsService.generateReport(
        organizationId,
        start,
        end,
        (format as 'json' | 'csv') || 'json'
      );

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="api-report-${organizationId}.csv"`);
        return res.send(report);
      }

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({
        error: 'Failed to generate report',
        code: 'GENERATION_FAILED',
      });
    }
  }
);

export default router;
