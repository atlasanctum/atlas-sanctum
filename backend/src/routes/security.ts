import express from 'express';
import { logSecurityEvent } from '../utils/logger';
import { authenticate, authorize } from '../middleware/auth';
import { query } from '../db';

const router = express.Router();

// CSP violation reporting endpoint
router.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  const violation = req.body['csp-report'];

  if (!violation) {
    return res.status(400).json({ error: 'Invalid CSP report' });
  }

  // Log the CSP violation
  logSecurityEvent('csp_violation', null, {
    documentUri: violation['document-uri'],
    violatedDirective: violation['violated-directive'],
    effectiveDirective: violation['effective-directive'],
    originalPolicy: violation['original-policy'],
    blockedUri: violation['blocked-uri'],
    statusCode: violation['status-code'],
    referrer: violation['referrer'],
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.socket?.remoteAddress || 'unknown'
  }, 'medium');

  // Respond with 204 No Content as per CSP spec
  res.status(204).end();
});

// Security header compliance check endpoint (for monitoring)
router.get('/headers-check', (req, res) => {
  const headers = req.headers;
  const responseHeaders = res.getHeaders();

  const checks = {
    'x-frame-options': !!responseHeaders['x-frame-options'],
    'x-content-type-options': !!responseHeaders['x-content-type-options'],
    'referrer-policy': !!responseHeaders['referrer-policy'],
    'permissions-policy': !!responseHeaders['permissions-policy'],
    'cross-origin-embedder-policy': !!responseHeaders['cross-origin-embedder-policy'],
    'cross-origin-opener-policy': !!responseHeaders['cross-origin-opener-policy'],
    'content-security-policy': !!responseHeaders['content-security-policy'],
    'strict-transport-security': !!responseHeaders['strict-transport-security']
  };

  const missing = Object.keys(checks).filter(key => !(checks as any)[key]);

  if (missing.length > 0) {
    logSecurityEvent('security_headers_missing', null, {
      missingHeaders: missing,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.socket?.remoteAddress || 'unknown'
    }, 'high');
  }

  res.json({
    status: missing.length === 0 ? 'compliant' : 'non-compliant',
    checks,
    missing
  });
});

// API Security Monitoring Dashboard (Admin only)
router.get('/monitoring-dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get security event statistics
    const eventStats = await query(`
      SELECT
        event_type,
        severity,
        COUNT(*) as count,
        MAX(created_at) as last_occurrence
      FROM security_audit_logs
      WHERE created_at >= $1
      GROUP BY event_type, severity
      ORDER BY count DESC
    `, [last24Hours]);

    // Get rate limiting statistics (mock data for now)
    const rateLimitStats = {
      totalRequests: 0,
      blockedRequests: 0,
      activeLimits: 4, // auth, general, strict, marketplace
      topBlockedIPs: []
    };

    // Get API key usage statistics
    const apiKeyStats = await query(`
      SELECT
        COUNT(DISTINCT key_hash) as total_keys,
        COUNT(*) as total_requests,
        AVG(requests_per_hour) as avg_requests_per_hour
      FROM api_keys
      WHERE last_used >= $1
    `, [last24Hours]);

    // Get CORS violation statistics
    const corsStats = await query(`
      SELECT
        COUNT(*) as total_violations,
        COUNT(DISTINCT details->>'origin') as unique_origins
      FROM security_audit_logs
      WHERE event_type = 'cors_violation' AND created_at >= $1
    `, [last24Hours]);

    // Get validation error statistics
    const validationStats = await query(`
      SELECT
        COUNT(*) as total_errors,
        COUNT(DISTINCT details->>'path') as affected_endpoints
      FROM audit_logs
      WHERE event_type IN ('validation_error', 'response_validation_error') AND created_at >= $1
    `, [last24Hours]);

    res.json({
      timestamp: now.toISOString(),
      period: 'last_24_hours',
      securityEvents: {
        total: eventStats.rows.reduce((sum, row) => sum + parseInt(row.count), 0),
        byType: eventStats.rows,
        bySeverity: {
          critical: eventStats.rows.filter(r => r.severity === 'critical').length,
          high: eventStats.rows.filter(r => r.severity === 'high').length,
          medium: eventStats.rows.filter(r => r.severity === 'medium').length,
          low: eventStats.rows.filter(r => r.severity === 'low').length
        }
      },
      rateLimiting: rateLimitStats,
      apiKeys: apiKeyStats.rows[0] || { total_keys: 0, total_requests: 0, avg_requests_per_hour: 0 },
      cors: corsStats.rows[0] || { total_violations: 0, unique_origins: 0 },
      validation: validationStats.rows[0] || { total_errors: 0, affected_endpoints: 0 },
      recommendations: generateSecurityRecommendations(eventStats.rows, rateLimitStats, corsStats.rows[0], validationStats.rows[0])
    });
  } catch (error) {
    console.error('Security monitoring dashboard error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to fetch security monitoring data'
    });
  }
});

// Helper function to generate security recommendations
function generateSecurityRecommendations(events: any[], rateLimitStats: any, corsStats: any, validationStats: any) {
  const recommendations = [];

  if (rateLimitStats.blockedRequests > rateLimitStats.totalRequests * 0.1) {
    recommendations.push({
      priority: 'high',
      type: 'rate_limiting',
      message: 'High rate of blocked requests detected. Consider adjusting rate limits or investigating potential attacks.',
      action: 'Review rate limiting configuration and monitor for DDoS attempts.'
    });
  }

  if (corsStats.total_violations > 10) {
    recommendations.push({
      priority: 'medium',
      type: 'cors',
      message: `${corsStats.total_violations} CORS violations detected. Review allowed origins configuration.`,
      action: 'Check CORS policy and consider updating allowed origins if legitimate traffic is being blocked.'
    });
  }

  if (validationStats.total_errors > 50) {
    recommendations.push({
      priority: 'medium',
      type: 'validation',
      message: 'High number of validation errors detected. Check API client implementations.',
      action: 'Review API documentation and client code for validation issues.'
    });
  }

  const criticalEvents = events.filter(e => e.severity === 'critical');
  if (criticalEvents.length > 0) {
    recommendations.push({
      priority: 'critical',
      type: 'critical_events',
      message: `${criticalEvents.length} critical security events detected.`,
      action: 'Immediate investigation required. Check system logs and security alerts.'
    });
  }

  return recommendations;
}

export default router;