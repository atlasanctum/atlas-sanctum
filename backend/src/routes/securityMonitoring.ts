import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { query } from '../db';
import { securityPerformanceMonitor } from '../utils/securityPerformance';
import { logSecurityEvent } from '../utils/logger';

const router = express.Router();

// Get security performance metrics dashboard
router.get('/performance-dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get performance statistics
    const performanceStats = securityPerformanceMonitor.getStats();

    // Get recent alerts
    const alerts = await query(`
      SELECT
        operation,
        alert_type,
        severity,
        message,
        metrics,
        threshold,
        created_at
      FROM security_performance_alerts
      WHERE created_at >= $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [last24Hours]);

    // Get security incidents
    const incidents = await query(`
      SELECT
        id,
        incident_type,
        severity,
        title,
        status,
        assigned_to,
        detected_at,
        resolved_at,
        response_time,
        resolution_time,
        affected_users,
        created_at
      FROM security_incidents
      WHERE detected_at >= $1
      ORDER BY detected_at DESC
      LIMIT 20
    `, [last7Days]);

    // Get compliance report summary
    const complianceReports = await query(`
      SELECT
        report_type,
        period_start,
        period_end,
        compliance_score,
        total_violations,
        critical_violations,
        generated_at
      FROM security_compliance_reports
      WHERE generated_at >= $1
      ORDER BY generated_at DESC
      LIMIT 5
    `, [last7Days]);

    // Get security event trends
    const eventTrends = await query(`
      SELECT
        DATE_TRUNC('hour', created_at) as hour,
        event_type,
        severity,
        COUNT(*) as count
      FROM security_audit_logs
      WHERE created_at >= $1
      GROUP BY DATE_TRUNC('hour', created_at), event_type, severity
      ORDER BY hour DESC
    `, [last24Hours]);

    // Calculate health score
    const healthScore = securityPerformanceMonitor.getHealthScore();

    res.json({
      timestamp: now.toISOString(),
      healthScore,
      performance: {
        operations: performanceStats,
        alerts: alerts.rows,
        trends: eventTrends.rows
      },
      incidents: incidents.rows,
      compliance: complianceReports.rows,
      recommendations: generateSecurityRecommendations(performanceStats, alerts.rows, incidents.rows)
    });
  } catch (error) {
    console.error('Security performance dashboard error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to fetch security performance data'
    });
  }
});

// Get detailed performance metrics for a specific operation
router.get('/performance/:operation', authenticate, authorize('admin'), async (req, res) => {
  try {
    const operation = req.params.operation as string;
    const hours = parseInt(req.query.hours as string || '24');

    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    // Get operation statistics
    const stats = securityPerformanceMonitor.getStats(operation);

    // Get recent metrics
    const recentMetrics = securityPerformanceMonitor.getRecentMetrics(operation, 100);

    // Get benchmark
    const benchmark = securityPerformanceMonitor.getBenchmark(operation);

    // Get alerts for this operation
    const alerts = await query(`
      SELECT * FROM security_performance_alerts
      WHERE operation = $1 AND created_at >= $2
      ORDER BY created_at DESC
      LIMIT 20
    `, [operation, startTime]);

    res.json({
      operation,
      benchmark,
      statistics: stats[0] || null,
      recentMetrics,
      alerts: alerts.rows,
      timeRange: `${hours} hours`
    });
  } catch (error) {
    console.error('Security performance operation details error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to fetch operation performance data'
    });
  }
});

// Update performance benchmark
router.put('/benchmarks/:operation', authenticate, authorize('admin'), async (req, res) => {
  try {
    const operation = req.params.operation as string;
    const updates = req.body;

    securityPerformanceMonitor.updateBenchmark(operation, updates);

    // Log the benchmark update
    logSecurityEvent('security_benchmark_updated', req.user!.id, {
      operation,
      updates,
      updatedBy: req.user!.id
    }, 'medium');

    res.json({
      success: true,
      message: `Benchmark updated for ${operation}`,
      operation,
      updates
    });
  } catch (error) {
    console.error('Update benchmark error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to update benchmark'
    });
  }
});

// Get security incidents
router.get('/incidents', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, severity, limit = 50 } = req.query;

    let queryStr = `
      SELECT
        i.*,
        u.display_name as assigned_user_name
      FROM security_incidents i
      LEFT JOIN users u ON i.assigned_to = u.id
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push(`i.status = $${params.length + 1}`);
      params.push(status);
    }

    if (severity) {
      conditions.push(`i.severity = $${params.length + 1}`);
      params.push(severity);
    }

    if (conditions.length > 0) {
      queryStr += ' WHERE ' + conditions.join(' AND ');
    }

    queryStr += ` ORDER BY i.detected_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit as string));

    const incidents = await query(queryStr, params);

    res.json({
      incidents: incidents.rows,
      total: incidents.rowCount
    });
  } catch (error) {
    console.error('Security incidents error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to fetch security incidents'
    });
  }
});

// Create security incident
router.post('/incidents', authenticate, authorize('admin'), async (req, res) => {
  try {
    const {
      incidentType,
      severity,
      title,
      description,
      affectedUsers = 0,
      affectedEndpoints = [],
      mitigationSteps = [],
      rootCause,
      lessonsLearned
    } = req.body;

    const result = await query(`
      INSERT INTO security_incidents (
        incident_type,
        severity,
        title,
        description,
        status,
        assigned_to,
        detected_at,
        affected_users,
        affected_endpoints,
        mitigation_steps,
        root_cause,
        lessons_learned
      ) VALUES ($1, $2, $3, $4, 'open', $5, NOW(), $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      incidentType,
      severity,
      title,
      description,
      req.user!.id,
      affectedUsers,
      JSON.stringify(affectedEndpoints),
      JSON.stringify(mitigationSteps),
      rootCause,
      lessonsLearned
    ]);

    // Log incident creation
    logSecurityEvent('security_incident_created', req.user!.id, {
      incidentId: result.rows[0].id,
      incidentType,
      severity,
      title
    }, 'high');

    res.status(201).json({
      success: true,
      incident: result.rows[0]
    });
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to create security incident'
    });
  }
});

// Update security incident
router.put('/incidents/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const setParts: string[] = [];
    const params: any[] = [id];
    let paramIndex = 2;

    if (updates.status) {
      setParts.push(`status = $${paramIndex++}`);
      params.push(updates.status);
    }

    if (updates.assignedTo) {
      setParts.push(`assigned_to = $${paramIndex++}`);
      params.push(updates.assignedTo);
    }

    if (updates.resolutionTime) {
      setParts.push(`resolution_time = $${paramIndex++}`);
      params.push(updates.resolutionTime);
    }

    if (updates.responseTime) {
      setParts.push(`response_time = $${paramIndex++}`);
      params.push(updates.responseTime);
    }

    if (updates.mitigationSteps) {
      setParts.push(`mitigation_steps = $${paramIndex++}`);
      params.push(JSON.stringify(updates.mitigationSteps));
    }

    if (updates.rootCause) {
      setParts.push(`root_cause = $${paramIndex++}`);
      params.push(updates.rootCause);
    }

    if (updates.lessonsLearned) {
      setParts.push(`lessons_learned = $${paramIndex++}`);
      params.push(updates.lessonsLearned);
    }

    if (updates.status === 'resolved' || updates.status === 'closed') {
      setParts.push('resolved_at = NOW()');
    }

    setParts.push('updated_at = NOW()');

    const result = await query(`
      UPDATE security_incidents
      SET ${setParts.join(', ')}
      WHERE id = $1
      RETURNING *
    `, params);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'not_found',
        message: 'Security incident not found'
      });
    }

    // Log incident update
    logSecurityEvent('security_incident_updated', req.user!.id, {
      incidentId: id,
      updates
    }, 'medium');

    res.json({
      success: true,
      incident: result.rows[0]
    });
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to update security incident'
    });
  }
});

// Generate compliance report
router.post('/compliance-reports', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { reportType, periodStart, periodEnd } = req.body;

    // Calculate compliance metrics
    const complianceMetrics = await calculateComplianceMetrics(periodStart, periodEnd);

    const result = await query(`
      INSERT INTO security_compliance_reports (
        report_type,
        period_start,
        period_end,
        compliance_score,
        total_violations,
        critical_violations,
        high_violations,
        medium_violations,
        low_violations,
        security_events,
        performance_issues,
        recommendations,
        generated_at,
        generated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13)
      RETURNING *
    `, [
      reportType,
      periodStart,
      periodEnd,
      complianceMetrics.score,
      complianceMetrics.totalViolations,
      complianceMetrics.criticalViolations,
      complianceMetrics.highViolations,
      complianceMetrics.mediumViolations,
      complianceMetrics.lowViolations,
      complianceMetrics.securityEvents,
      complianceMetrics.performanceIssues,
      JSON.stringify(complianceMetrics.recommendations),
      req.user!.id
    ]);

    res.status(201).json({
      success: true,
      report: result.rows[0]
    });
  } catch (error) {
    console.error('Generate compliance report error:', error);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to generate compliance report'
    });
  }
});

// Helper function to generate security recommendations
function generateSecurityRecommendations(performanceStats: any[], alerts: any[], incidents: any[]) {
  const recommendations = [];

  // Performance-based recommendations
  const slowOperations = performanceStats.filter(stat =>
    stat.averageDuration > 1000 || stat.errorRate > 0.1
  );

  if (slowOperations.length > 0) {
    recommendations.push({
      priority: 'high',
      type: 'performance',
      message: `${slowOperations.length} security operations are performing poorly`,
      action: 'Review and optimize slow security operations',
      details: slowOperations.map(op => op.operation)
    });
  }

  // Alert-based recommendations
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  if (criticalAlerts.length > 0) {
    recommendations.push({
      priority: 'critical',
      type: 'alerts',
      message: `${criticalAlerts.length} critical security alerts detected`,
      action: 'Immediate investigation required for critical alerts',
      details: criticalAlerts.map(alert => alert.operation)
    });
  }

  // Incident-based recommendations
  const openIncidents = incidents.filter(incident => incident.status === 'open');
  if (openIncidents.length > 0) {
    recommendations.push({
      priority: 'high',
      type: 'incidents',
      message: `${openIncidents.length} open security incidents`,
      action: 'Address open security incidents',
      details: openIncidents.map(incident => incident.title)
    });
  }

  return recommendations;
}

// Helper function to calculate compliance metrics
async function calculateComplianceMetrics(periodStart: string, periodEnd: string) {
  // Get security events
  const events = await query(`
    SELECT severity, COUNT(*) as count
    FROM security_audit_logs
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY severity
  `, [periodStart, periodEnd]);

  // Get performance issues
  const performanceIssues = await query(`
    SELECT COUNT(*) as count
    FROM security_performance_alerts
    WHERE created_at BETWEEN $1 AND $2 AND severity IN ('high', 'critical')
  `, [periodStart, periodEnd]);

  const eventCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  };

  events.rows.forEach((row: any) => {
    eventCounts[row.severity as keyof typeof eventCounts] = parseInt(row.count);
  });

  const totalViolations = Object.values(eventCounts).reduce((a, b) => a + b, 0);
  const performanceIssueCount = parseInt(performanceIssues.rows[0]?.count || '0');

  // Calculate compliance score (0-100)
  let score = 100;

  // Deduct points for violations
  score -= Math.min(30, totalViolations * 2); // Max 30 points for violations
  score -= Math.min(20, performanceIssueCount * 5); // Max 20 points for performance issues

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return {
    score,
    totalViolations,
    criticalViolations: eventCounts.critical,
    highViolations: eventCounts.high,
    mediumViolations: eventCounts.medium,
    lowViolations: eventCounts.low,
    securityEvents: totalViolations,
    performanceIssues: performanceIssueCount,
    recommendations: generateComplianceRecommendations(eventCounts, performanceIssueCount)
  };
}

// Helper function to generate compliance recommendations
function generateComplianceRecommendations(eventCounts: any, performanceIssues: number) {
  const recommendations = [];

  if (eventCounts.critical > 0) {
    recommendations.push('Immediate action required for critical security events');
  }

  if (eventCounts.high > 5) {
    recommendations.push('Review high-severity security events and implement additional controls');
  }

  if (performanceIssues > 10) {
    recommendations.push('Address performance issues affecting security operations');
  }

  if (recommendations.length === 0) {
    recommendations.push('Security posture is within acceptable parameters');
  }

  return recommendations;
}

export default router;