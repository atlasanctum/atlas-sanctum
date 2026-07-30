/**
 * Audit Logs Routes
 * 
 * API endpoints for querying and managing audit trail logs.
 */

import express, { Request, Response } from 'express';
import { 
  queryAuditLogs, 
  getAuditStats, 
  getUserAuditActivity, 
  getActivityTimeline,
  AUDIT_EVENTS,
  AuditLogQuery 
} from '../services/auditLogging';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { logSecurityEvent } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/audit/logs
 * Query audit logs with filters
 * Requires authentication
 */
router.get('/logs', authenticate, async (req: Request, res: Response) => {
  try {
    const query: AuditLogQuery = {
      userId: req.query.userId as string,
      action: req.query.action as string,
      resourceType: req.query.resourceType as string,
      resourceId: req.query.resourceId as string,
      status: req.query.status as 'success' | 'failure' | 'pending',
      severity: req.query.severity as 'info' | 'warning' | 'error' | 'critical',
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      orderBy: req.query.orderBy as 'timestamp' | 'severity',
      order: req.query.order as 'asc' | 'desc'
    };

    const result = await queryAuditLogs(query);
    
    res.json({
      logs: result.logs,
      total: result.total,
      limit: query.limit,
      offset: query.offset
    });
  } catch (error) {
    logSecurityEvent('audit_query_failed', (req as any).user?.id || null, {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip
    }, 'medium');
    
    res.status(500).json({
      error: 'Failed to query audit logs',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/audit/logs/user/:userId
 * Get audit logs for a specific user
 * Requires authentication (admin or self)
 */
router.get('/logs/user/:userId', authenticate, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    
    // Only allow users to see their own logs or admins
    if (userId !== currentUserId && userRole !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only view your own audit logs'
      });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const logs = await getUserAuditActivity(userId, limit);
    
    res.json({
      userId,
      logs,
      count: logs.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get user audit logs',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/audit/logs/:id
 * Get a specific audit log by ID
 * Requires authentication
 */
router.get('/logs/detail/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await queryAuditLogs({ limit: 1 });
    const log = result.logs.find(l => l.id === id);
    
    if (!log) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Audit log not found'
      });
    }
    
    res.json(log);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get audit log',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/audit/statistics
 * Get audit statistics and aggregations
 * Requires admin role
 */
router.get('/statistics', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
    const stats = await getAuditStats(startDate, endDate);
    
    res.json({
      statistics: stats,
      period: {
        startDate: startDate?.toISOString() || 'all time',
        endDate: endDate?.toISOString() || 'all time'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get audit statistics',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/audit/timeline
 * Get activity timeline for dashboard
 * Requires authentication
 */
router.get('/timeline', authenticate, async (req: Request, res: Response) => {
  try {
    const hours = req.query.hours ? parseInt(req.query.hours as string) : 24;
    const timeline = await getActivityTimeline(hours);
    
    res.json({
      hours,
      timeline
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get activity timeline',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/audit/events
 * Get list of available audit event types
 * Requires authentication
 */
router.get('/events', authenticate, async (req: Request, res: Response) => {
  try {
    const events = Object.entries(AUDIT_EVENTS).map(([key, value]) => ({
      key,
      value,
      category: getEventCategory(key)
    }));
    
    res.json({
      events
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get audit events',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/audit/export
 * Export audit logs (admin only)
 * Requires admin role
 */
router.get('/export', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    const format = req.query.format as string || 'json';
    
    const result = await queryAuditLogs({
      startDate,
      endDate,
      limit: 10000, // Max export limit
      order: 'desc'
    });
    
    if (format === 'csv') {
      // Export as CSV
      const headers = ['ID', 'User ID', 'Action', 'Resource Type', 'Resource ID', 'Status', 'Severity', 'IP Address', 'Timestamp'];
      const rows = result.logs.map(log => [
        log.id,
        log.userId || '',
        log.action,
        log.resourceType,
        log.resourceId || '',
        log.status,
        log.severity,
        log.ipAddress || '',
        log.timestamp.toISOString()
      ]);
      
      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      return res.send(csv);
    }
    
    // Default to JSON
    res.json({
      exportedAt: new Date().toISOString(),
      period: { startDate, endDate },
      totalLogs: result.total,
      logs: result.logs
    });
  } catch (error) {
    logSecurityEvent('audit_export_failed', (req as any).user?.id || null, {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip
    }, 'high');
    
    res.status(500).json({
      error: 'Failed to export audit logs',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Helper function to get event category
 */
function getEventCategory(eventKey: string): string {
  if (eventKey.includes('login') || eventKey.includes('logout') || eventKey.includes('session') || eventKey.includes('mfa')) {
    return 'authentication';
  }
  if (eventKey.includes('permission') || eventKey.includes('role') || eventKey.includes('access')) {
    return 'authorization';
  }
  if (eventKey.includes('read') || eventKey.includes('export') || eventKey.includes('download')) {
    return 'data_access';
  }
  if (eventKey.includes('create') || eventKey.includes('update') || eventKey.includes('delete') || eventKey.includes('restore')) {
    return 'data_modification';
  }
  if (eventKey.includes('security') || eventKey.includes('rate_limit') || eventKey.includes('blocked')) {
    return 'security';
  }
  return 'system';
}

export default router;
