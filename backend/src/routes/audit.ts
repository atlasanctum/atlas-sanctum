/**
 * Audit Log Routes
 * 
 * API endpoints for querying and managing audit logs.
 * Requires appropriate permissions for access.
 */

import express from 'express';
import { auditService } from '../services/audit';
import { adminAuth } from '../middleware/adminAuth';
import { requirePermission } from '../middleware/rbac';

const router = express.Router();

/**
 * GET /api/audit/logs
 * Query audit logs with filters
 */
router.get('/logs', adminAuth, async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId as string,
      organizationId: req.query.organizationId as string,
      action: req.query.action as string,
      resource: req.query.resource as string,
      resourceId: req.query.resourceId as string,
      status: req.query.status as string,
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const logs = await auditService.query(filters);

    res.json({
      success: true,
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('Failed to query audit logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to query audit logs',
    });
  }
});

/**
 * GET /api/audit/logs/:id
 * Get a specific audit log by ID
 */
router.get('/logs/:id', adminAuth, async (req, res) => {
  try {
    const log = await auditService.getById(req.params.id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Audit log not found',
      });
    }

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Failed to get audit log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit log',
    });
  }
});

/**
 * GET /api/audit/statistics
 * Get audit statistics for an organization
 */
router.get('/statistics', adminAuth, async (req, res) => {
  try {
    const organizationId = req.query.organizationId as string;
    
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'organizationId is required',
      });
    }

    const period = {
      from: req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: req.query.to ? new Date(req.query.to as string) : new Date(),
    };

    const stats = await auditService.getStatistics(organizationId, period);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Failed to get audit statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit statistics',
    });
  }
});

/**
 * GET /api/audit/actions
 * Get action breakdown for an organization
 */
router.get('/actions', adminAuth, async (req, res) => {
  try {
    const organizationId = req.query.organizationId as string;
    
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'organizationId is required',
      });
    }

    const period = {
      from: req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: req.query.to ? new Date(req.query.to as string) : new Date(),
    };

    const breakdown = await auditService.getActionBreakdown(organizationId, period);

    res.json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    console.error('Failed to get action breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get action breakdown',
    });
  }
});

/**
 * GET /api/audit/resources
 * Get resource breakdown for an organization
 */
router.get('/resources', adminAuth, async (req, res) => {
  try {
    const organizationId = req.query.organizationId as string;
    
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'organizationId is required',
      });
    }

    const period = {
      from: req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: req.query.to ? new Date(req.query.to as string) : new Date(),
    };

    const breakdown = await auditService.getResourceBreakdown(organizationId, period);

    res.json({
      success: true,
      data: breakdown,
    });
  } catch (error) {
    console.error('Failed to get resource breakdown:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get resource breakdown',
    });
  }
});

/**
 * GET /api/audit/users
 * Get user activity for an organization
 */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const organizationId = req.query.organizationId as string;
    
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'organizationId is required',
      });
    }

    const period = {
      from: req.query.from ? new Date(req.query.from as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: req.query.to ? new Date(req.query.to as string) : new Date(),
    };

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const activity = await auditService.getUserActivity(organizationId, period, limit);

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Failed to get user activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user activity',
    });
  }
});

/**
 * GET /api/audit/export/csv
 * Export audit logs to CSV
 */
router.get('/export/csv', adminAuth, async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId as string,
      organizationId: req.query.organizationId as string,
      action: req.query.action as string,
      resource: req.query.resource as string,
      resourceId: req.query.resourceId as string,
      status: req.query.status as string,
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
    };

    const csv = await auditService.exportToCSV(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Failed to export audit logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export audit logs',
    });
  }
});

/**
 * GET /api/audit/export/json
 * Export audit logs to JSON
 */
router.get('/export/json', adminAuth, async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId as string,
      organizationId: req.query.organizationId as string,
      action: req.query.action as string,
      resource: req.query.resource as string,
      resourceId: req.query.resourceId as string,
      status: req.query.status as string,
      from: req.query.from ? new Date(req.query.from as string) : undefined,
      to: req.query.to ? new Date(req.query.to as string) : undefined,
    };

    const json = await auditService.exportToJSON(filters);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.json`);
    res.send(json);
  } catch (error) {
    console.error('Failed to export audit logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export audit logs',
    });
  }
});

/**
 * GET /api/audit/retention
 * Get audit log retention statistics
 */
router.get('/retention', adminAuth, async (req, res) => {
  try {
    const stats = await auditService.getRetentionStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Failed to get retention stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get retention stats',
    });
  }
});

/**
 * POST /api/audit/cleanup
 * Trigger cleanup of old audit logs
 */
router.post('/cleanup', adminAuth, async (req, res) => {
  try {
    const retentionDays = req.body.retentionDays || 365;

    const deletedCount = await auditService.cleanupOldLogs(retentionDays);

    res.json({
      success: true,
      data: {
        deletedCount,
        retentionDays,
      },
    });
  } catch (error) {
    console.error('Failed to cleanup audit logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup audit logs',
    });
  }
});

/**
 * GET /api/audit/actions/list
 * Get list of available audit actions
 */
router.get('/actions/list', adminAuth, async (req, res) => {
  try {
    const { AuditActions } = await import('../services/audit');
    
    res.json({
      success: true,
      data: Object.entries(AuditActions).map(([key, value]) => ({
        key,
        value,
      })),
    });
  } catch (error) {
    console.error('Failed to get audit actions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit actions',
    });
  }
});

/**
 * GET /api/audit/resources/list
 * Get list of available audit resources
 */
router.get('/resources/list', adminAuth, async (req, res) => {
  try {
    const { AuditResources } = await import('../services/audit');
    
    res.json({
      success: true,
      data: Object.entries(AuditResources).map(([key, value]) => ({
        key,
        value,
      })),
    });
  } catch (error) {
    console.error('Failed to get audit resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit resources',
    });
  }
});

export default router;
