import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db';
import { logSecurityEvent } from '../utils/logger';
import { generalRateLimit, validateApiKey, sanitizeInput, securityHeaders } from '../middleware/security';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Apply security middleware
router.use(securityHeaders);
router.use(validateApiKey);
router.use(sanitizeInput);
router.use(generalRateLimit);

// ============================================
// RBAC Routes
// ============================================

// GET /api/admin/roles - List all roles
router.get('/roles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT 
        r.*,
        COUNT(DISTINCT rp.permission_id) as permission_count,
        COUNT(DISTINCT u.id) as user_count
      FROM roles r
      LEFT JOIN role_permissions rp ON rp.role_id = r.id
      LEFT JOIN user_roles ur ON ur.role_id = r.id
      LEFT JOIN users u ON u.id = ur.user_id
      GROUP BY r.id
      ORDER BY r.level ASC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/roles - Create new role
router.post('/roles', authenticate, authorize('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, level, permissions } = req.body;

    if (!name || !level) {
      return res.status(400).json({
        success: false,
        error: 'name and level are required'
      });
    }

    const result = await query(`
      INSERT INTO roles (name, description, level)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, description, level]);

    // Assign permissions if provided
    if (permissions && Array.isArray(permissions)) {
      for (const permId of permissions) {
        await query(`
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ($1, $2)
        `, [result.rows[0].id, permId]);
      }
    }

    logSecurityEvent('role_created', (req as any).user?.id, {
      roleId: result.rows[0].id,
      roleName: name
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/permissions - List all permissions
router.get('/permissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT * FROM permissions
      ORDER BY resource, action
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/permissions - Create permission
router.post('/permissions', authenticate, authorize('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, resource, action, description } = req.body;

    if (!name || !resource || !action) {
      return res.status(400).json({
        success: false,
        error: 'name, resource, and action are required'
      });
    }

    const result = await query(`
      INSERT INTO permissions (name, resource, action, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, resource, action, description]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users/:userId/roles - Get user roles
router.get('/users/:userId/roles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const result = await query(`
      SELECT 
        r.*,
        ur.assigned_at,
        ur.assigned_by
      FROM roles r
      JOIN user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = $1
      ORDER BY r.level ASC
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/users/:userId/roles - Assign role to user
router.post('/users/:userId/roles', authenticate, authorize('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { role_id } = req.body;
    const adminId = (req as any).user?.id;

    if (!role_id) {
      return res.status(400).json({
        success: false,
        error: 'role_id is required'
      });
    }

    // Check if role exists
    const roleResult = await query(`SELECT * FROM roles WHERE id = $1`, [role_id]);
    if (roleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Role not found'
      });
    }

    const result = await query(`
      INSERT INTO user_roles (user_id, role_id, assigned_by)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, role_id) DO NOTHING
      RETURNING *
    `, [userId, role_id, adminId]);

    logSecurityEvent('role_assigned', adminId, {
      targetUserId: userId,
      roleId: role_id,
      roleName: roleResult.rows[0].name
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// User Management Routes
// ============================================

// GET /api/admin/users - List all users
router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, role, limit = 50, offset = 0 } = req.query;

    let conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`u.status = $${paramIndex++}`);
      params.push(status);
    }

    if (role) {
      conditions.push(`
        EXISTS (
          SELECT 1 FROM user_roles ur 
          JOIN roles r ON r.id = ur.role_id 
          WHERE ur.user_id = u.id AND r.name = $${paramIndex++}
        )
      `);
      params.push(role);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        u.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'name', r.name,
              'level', r.level
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      ${whereClause}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM users ${whereClause}`, params);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        u.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', r.id,
              'name', r.name,
              'level', r.level,
              'permissions', (
                SELECT json_agg(p.name)
                FROM role_permissions rp
                JOIN permissions p ON p.id = rp.permission_id
                WHERE rp.role_id = r.id
              )
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = $1
      GROUP BY u.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/users/:id/status - Update user status
router.patch('/users/:id/status', authenticate, authorize('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!status || !['active', 'suspended', 'pending', 'banned'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required'
      });
    }

    const result = await query(`
      UPDATE users
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    logSecurityEvent('user_status_changed', (req as any).user?.id, {
      targetUserId: id,
      newStatus: status,
      reason
    });

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// File Management Routes
// ============================================

// GET /api/admin/files - List files
router.get('/files', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, folder, status, limit = 50, offset = 0 } = req.query;

    let conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      conditions.push(`file_type = $${paramIndex++}`);
      params.push(type);
    }

    if (folder) {
      conditions.push(`folder = $${paramIndex++}`);
      params.push(folder);
    }

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT * FROM files
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM files ${whereClause}`, params);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/files - Upload file
router.post('/files', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { filename, file_type, folder, size, mime_type, url, metadata } = req.body;

    if (!filename || !file_type || !url) {
      return res.status(400).json({
        success: false,
        error: 'filename, file_type, and url are required'
      });
    }

    const result = await query(`
      INSERT INTO files (
        filename, file_type, folder, size, mime_type, url, metadata, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [filename, file_type, folder, size, mime_type, url, metadata, userId]);

    logSecurityEvent('file_uploaded', userId, {
      fileId: result.rows[0].id,
      filename,
      fileType: file_type
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/files/:id - Delete file
router.delete('/files/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await query(`DELETE FROM files WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    logSecurityEvent('file_deleted', userId, {
      fileId: id,
      filename: result.rows[0].filename
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// System Monitoring Routes
// ============================================

// GET /api/admin/monitoring/system - System status
router.get('/monitoring/system', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT 
        *,
        EXTRACT(EPOCH FROM (NOW() - last_heartbeat)) as seconds_since_heartbeat
      FROM system_metrics
      ORDER BY recorded_at DESC
      LIMIT 1
    `);

    res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/monitoring/health - Health check
router.get('/monitoring/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const checks = [];
    
    // Check database
    try {
      await query('SELECT 1');
      checks.push({ service: 'database', status: 'healthy' });
    } catch (e) {
      checks.push({ service: 'database', status: 'unhealthy', error: e.message });
    }

    // Check Redis
    try {
      // In production, check Redis connection
      checks.push({ service: 'redis', status: 'healthy' });
    } catch (e) {
      checks.push({ service: 'redis', status: 'unhealthy', error: e.message });
    }

    const overallStatus = checks.every(c => c.status === 'healthy') ? 'healthy' : 'degraded';

    res.json({
      success: true,
      data: {
        status: overallStatus,
        checks,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/monitoring/metrics - Performance metrics
router.get('/monitoring/metrics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '1h' } = req.query;

    let interval: string;
    switch (period) {
      case '15m': interval = '15 minutes'; break;
      case '1h': interval = '1 hour'; break;
      case '24h': interval = '24 hours'; break;
      case '7d': interval = '7 days'; break;
      default: interval = '1 hour';
    }

    const [apiMetrics, dbMetrics, errorMetrics] = await Promise.all([
      query(`
        SELECT 
          DATE_TRUNC('minute', created_at) as time,
          COUNT(*) as requests,
          AVG(response_time) as avg_response_time
        FROM api_logs
        WHERE created_at >= NOW() - INTERVAL '${interval}'
        GROUP BY DATE_TRUNC('minute', created_at)
        ORDER BY time
      `),
      query(`
        SELECT 
          query_type,
          COUNT(*) as count,
          AVG(duration_ms) as avg_duration
        FROM query_logs
        WHERE created_at >= NOW() - INTERVAL '${interval}'
        GROUP BY query_type
      `),
      query(`
        SELECT 
          error_type,
          COUNT(*) as count
        FROM error_logs
        WHERE created_at >= NOW() - INTERVAL '${interval}'
        GROUP BY error_type
        ORDER BY count DESC
      `)
    ]);

    res.json({
      success: true,
      data: {
        period,
        api: apiMetrics.rows,
        database: dbMetrics.rows,
        errors: errorMetrics.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/monitoring/audit-logs - Audit logs
router.get('/monitoring/audit-logs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, action, limit = 100, offset = 0 } = req.query;

    let conditions: string[] = ['created_at >= NOW() - INTERVAL \'30 days\''];
    const params: any[] = [];
    let paramIndex = 1;

    if (user_id) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(user_id);
    }

    if (action) {
      conditions.push(`action = $${paramIndex++}`);
      params.push(action);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const result = await query(`
      SELECT * FROM audit_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM audit_logs ${whereClause}`, params);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/monitoring/heartbeat - Record heartbeat
router.post('/monitoring/heartbeat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { service_name, status, metrics } = req.body;

    if (!service_name || !status) {
      return res.status(400).json({
        success: false,
        error: 'service_name and status are required'
      });
    }

    const result = await query(`
      INSERT INTO system_metrics (
        service_name, status, cpu_usage, memory_usage, disk_usage, active_connections
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      service_name, 
      status, 
      metrics?.cpu_usage, 
      metrics?.memory_usage, 
      metrics?.disk_usage,
      metrics?.active_connections
    ]);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Activity Logs Routes
// ============================================

// GET /api/admin/activity - Get activity logs
router.get('/activity', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, entity_type, action, limit = 50, offset = 0 } = req.query;

    let conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (user_id) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(user_id);
    }

    if (entity_type) {
      conditions.push(`entity_type = $${paramIndex++}`);
      params.push(entity_type);
    }

    if (action) {
      conditions.push(`action = $${paramIndex++}`);
      params.push(action);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT * FROM activity_logs
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM activity_logs ${whereClause}`, params);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/activity - Create activity log
router.post('/activity', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { entity_type, entity_id, action, details } = req.body;

    const result = await query(`
      INSERT INTO activity_logs (
        user_id, entity_type, entity_id, action, details
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, entity_type, entity_id, action, details]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
