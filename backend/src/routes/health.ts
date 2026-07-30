/**
 * Health Dashboard Routes
 * 
 * Provides comprehensive health check endpoints for monitoring,
 * including quick checks for load balancers and detailed dashboards.
 */

import express, { Request, Response } from 'express';
import { 
  getFullHealthCheck, 
  getQuickHealthCheck, 
  getDetailedServiceStatus,
  getHealthHistory,
  getHealthStatistics,
  HealthStatus,
  ServiceHealth
} from '../services/healthMonitoring';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { logSecurityEvent } from '../utils/logger';

const router = express.Router();

/**
 * GET /api/health
 * Quick health check for load balancers and uptime monitoring
 * Returns minimal response for fast checks
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const health = await getQuickHealthCheck();
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

/**
 * GET /api/health/dashboard
 * Full health dashboard with detailed service status
 * Requires authentication for security
 */
router.get('/dashboard', authenticate, async (req: Request, res: Response) => {
  try {
    const health = await getFullHealthCheck();
    
    res.json({
      status: health.status,
      timestamp: health.timestamp,
      version: health.version,
      uptime: health.uptime,
      environment: health.environment,
      services: health.services,
      system: health.system,
      checks: health.checks
    });
  } catch (error) {
    logSecurityEvent('health_dashboard_error', (req as any).user?.id || null, {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip
    }, 'medium');
    
    res.status(500).json({
      error: 'Failed to generate health dashboard',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/services
 * Detailed status of all individual services
 * Requires authentication
 */
router.get('/services', authenticate, async (req: Request, res: Response) => {
  try {
    const services = await getDetailedServiceStatus();
    
    res.json({
      timestamp: new Date().toISOString(),
      services
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get service status',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/system
 * System resources and performance metrics
 * Requires authentication
 */
router.get('/system', authenticate, async (req: Request, res: Response) => {
  try {
    const health = await getFullHealthCheck();
    
    res.json({
      timestamp: new Date().toISOString(),
      uptime: health.uptime,
      version: health.version,
      environment: health.environment,
      system: health.system
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get system metrics',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/checks/:checkName
 * Historical data for a specific health check
 * Requires authentication
 */
router.get('/checks/:checkName', authenticate, async (req: Request, res: Response) => {
  try {
    const { checkName } = req.params;
    const history = getHealthHistory(checkName);
    
    const checkHistory = history.get(checkName);
    
    if (!checkHistory) {
      return res.status(404).json({
        error: 'Check not found',
        checkName,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      checkName,
      history: checkHistory,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get check history',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/statistics
 * Aggregated health check statistics
 * Requires admin role
 */
router.get('/statistics', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const stats = getHealthStatistics();
    
    res.json({
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get health statistics',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health/ready
 * Kubernetes-style readiness probe
 * Returns 200 if all critical services are healthy
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const health = await getFullHealthCheck();
    
    // Check critical services only
    const criticalServices = ['database', 'redis'];
    const criticalHealthy = health.services
      .filter(s => criticalServices.includes(s.name))
      .every(s => s.status === 'healthy');
    
    if (criticalHealthy) {
      res.status(200).json({
        ready: true,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
        unhealthyServices: health.services
          .filter(s => criticalServices.includes(s.name) && s.status !== 'healthy')
          .map(s => s.name)
      });
    }
  } catch (error) {
    res.status(503).json({
      ready: false,
      timestamp: new Date().toISOString(),
      error: 'Readiness check failed'
    });
  }
});

/**
 * GET /api/health/live
 * Kubernetes-style liveness probe
 * Returns 200 if the service is alive
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString()
  });
});

export default router;
