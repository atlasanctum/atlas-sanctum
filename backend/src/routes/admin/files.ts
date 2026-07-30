import express from 'express';
import { query } from '../../db';
import { authenticate, authorize } from '../../middleware/auth';
import { validateWithZod } from '../../middleware/validation';
import { fileUploadPolicySchema } from '../../validation/schemas';
import { logSecurityEvent } from '../../utils/logger';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Get file upload policies
router.get('/policies', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM file_upload_policies ORDER BY created_at DESC'
    );

    res.json({
      policies: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Get policies error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to retrieve policies',
      timestamp: new Date().toISOString()
    });
  }
});

// Create file upload policy
router.post('/policies', validateWithZod(fileUploadPolicySchema), async (req, res) => {
  try {
    const {
      name,
      description,
      maxFileSize,
      allowedMimeTypes,
      allowedExtensions,
      blockedPatterns,
      rateLimitRequests,
      rateLimitWindowMinutes,
      quarantineSuspicious,
      requireScan,
      isActive
    } = req.body;

    const userId = (req as any).user?.id;

    const result = await query(`
      INSERT INTO file_upload_policies (
        name, description, max_file_size, allowed_mime_types, allowed_extensions,
        blocked_patterns, rate_limit_requests, rate_limit_window_minutes,
        quarantine_suspicious, require_scan, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now(), now())
      RETURNING *
    `, [
      name,
      description,
      maxFileSize,
      allowedMimeTypes,
      allowedExtensions,
      blockedPatterns || [],
      rateLimitRequests,
      rateLimitWindowMinutes,
      quarantineSuspicious,
      requireScan,
      isActive
    ]);

    logSecurityEvent('file_policy_created', userId, {
      policyId: result.rows[0].id,
      policyName: name,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Create policy error:', err);

    if (err.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        code: 'policy_name_exists',
        message: 'Policy name already exists',
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      code: 'server_error',
      message: 'Failed to create policy',
      timestamp: new Date().toISOString()
    });
  }
});

// Update file upload policy
router.put('/policies/:id', validateWithZod(fileUploadPolicySchema), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      maxFileSize,
      allowedMimeTypes,
      allowedExtensions,
      blockedPatterns,
      rateLimitRequests,
      rateLimitWindowMinutes,
      quarantineSuspicious,
      requireScan,
      isActive
    } = req.body;

    const userId = (req as any).user?.id;

    const result = await query(`
      UPDATE file_upload_policies SET
        name = $1, description = $2, max_file_size = $3, allowed_mime_types = $4,
        allowed_extensions = $5, blocked_patterns = $6, rate_limit_requests = $7,
        rate_limit_window_minutes = $8, quarantine_suspicious = $9, require_scan = $10,
        is_active = $11, updated_at = now()
      WHERE id = $12
      RETURNING *
    `, [
      name,
      description,
      maxFileSize,
      allowedMimeTypes,
      allowedExtensions,
      blockedPatterns || [],
      rateLimitRequests,
      rateLimitWindowMinutes,
      quarantineSuspicious,
      requireScan,
      isActive,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'policy_not_found',
        message: 'Policy not found',
        timestamp: new Date().toISOString()
      });
    }

    logSecurityEvent('file_policy_updated', userId, {
      policyId: id,
      policyName: name,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'medium');

    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Update policy error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to update policy',
      timestamp: new Date().toISOString()
    });
  }
});

// Delete file upload policy
router.delete('/policies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    // Check if policy is in use (you might want to add this check)
    const usageCheck = await query(`
      SELECT COUNT(*) as usage_count FROM assets WHERE type = 'policy_' || $1
    `, [id]);

    if (parseInt(usageCheck.rows[0].usage_count) > 0) {
      return res.status(409).json({
        code: 'policy_in_use',
        message: 'Cannot delete policy that is currently in use',
        timestamp: new Date().toISOString()
      });
    }

    const result = await query(
      'DELETE FROM file_upload_policies WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'policy_not_found',
        message: 'Policy not found',
        timestamp: new Date().toISOString()
      });
    }

    logSecurityEvent('file_policy_deleted', userId, {
      policyId: id,
      policyName: result.rows[0].name,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'high');

    res.json({
      message: 'Policy deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Delete policy error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to delete policy',
      timestamp: new Date().toISOString()
    });
  }
});

// Get file access logs with filtering
router.get('/access-logs', async (req, res) => {
  try {
    const {
      assetId,
      userId,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query as any;

    const offset = (Number(page) - 1) * Number(limit);

    // Build query with filters
    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    if (assetId) {
      whereConditions.push(`asset_id = $${paramIndex}`);
      params.push(assetId);
      paramIndex++;
    }

    if (userId) {
      whereConditions.push(`user_id = $${paramIndex}`);
      params.push(userId);
      paramIndex++;
    }

    if (action) {
      whereConditions.push(`action = $${paramIndex}`);
      params.push(action);
      paramIndex++;
    }

    if (startDate) {
      whereConditions.push(`created_at >= $${paramIndex}`);
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereConditions.push(`created_at <= $${paramIndex}`);
      params.push(endDate);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get logs
    const logsQuery = `
      SELECT fal.*, a.file_name, a.file_size, u.display_name as user_name
      FROM file_access_logs fal
      LEFT JOIN assets a ON fal.asset_id = a.id
      LEFT JOIN users u ON fal.user_id = u.id
      ${whereClause}
      ORDER BY fal.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(Number(limit), offset);

    const logsResult = await query(logsQuery, params);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM file_access_logs fal ${whereClause}`;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      logs: logsResult.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Get access logs error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to retrieve access logs',
      timestamp: new Date().toISOString()
    });
  }
});

// Get file scan results
router.get('/scan-results', async (req, res) => {
  try {
    const { assetId, threatLevel, page = 1, limit = 50 } = req.query as any;
    const offset = (Number(page) - 1) * Number(limit);

    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    if (assetId) {
      whereConditions.push(`asset_id = $${paramIndex}`);
      params.push(assetId);
      paramIndex++;
    }

    if (threatLevel) {
      whereConditions.push(`threat_level = $${paramIndex}`);
      params.push(threatLevel);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const resultsQuery = `
      SELECT fsr.*, a.file_name, a.file_size, u.display_name as scanned_by_name
      FROM file_scan_results fsr
      LEFT JOIN assets a ON fsr.asset_id = a.id
      LEFT JOIN users u ON fsr.scan_metadata->>'requestedBy' = u.id::text
      ${whereClause}
      ORDER BY fsr.scanned_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(Number(limit), offset);

    const resultsResult = await query(resultsQuery, params);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM file_scan_results fsr ${whereClause}`;
    const countParams = params.slice(0, -2);
    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      scanResults: resultsResult.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Get scan results error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to retrieve scan results',
      timestamp: new Date().toISOString()
    });
  }
});

// Get quarantined files
router.get('/quarantined', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query as any;
    const offset = (Number(page) - 1) * Number(limit);

    const result = await query(`
      SELECT a.*, u.display_name as owner_name
      FROM assets a
      LEFT JOIN users u ON a.owner_id = u.id
      WHERE a.upload_status = 'quarantined'
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
    `, [Number(limit), offset]);

    // Get total count
    const countResult = await query(
      "SELECT COUNT(*) as total FROM assets WHERE upload_status = 'quarantined'"
    );
    const total = parseInt(countResult.rows[0].total);

    res.json({
      quarantinedFiles: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Get quarantined files error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to retrieve quarantined files',
      timestamp: new Date().toISOString()
    });
  }
});

// Approve quarantined file
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await query(`
      UPDATE assets
      SET upload_status = 'approved', quarantine_reason = NULL, updated_at = now()
      WHERE id = $1 AND upload_status = 'quarantined'
      RETURNING *
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'file_not_found_or_not_quarantined',
        message: 'File not found or not quarantined',
        timestamp: new Date().toISOString()
      });
    }

    logSecurityEvent('quarantined_file_approved', userId, {
      assetId: id,
      fileName: result.rows[0].file_name,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'high');

    res.json({
      message: 'File approved successfully',
      asset: result.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Approve file error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to approve file',
      timestamp: new Date().toISOString()
    });
  }
});

// Reject quarantined file
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = (req as any).user?.id;

    const result = await query(`
      UPDATE assets
      SET upload_status = 'rejected', quarantine_reason = $1, updated_at = now()
      WHERE id = $2 AND upload_status = 'quarantined'
      RETURNING *
    `, [reason || 'Rejected by administrator', id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'file_not_found_or_not_quarantined',
        message: 'File not found or not quarantined',
        timestamp: new Date().toISOString()
      });
    }

    // Optionally delete the physical file
    const asset = result.rows[0];
    if (asset.file_path) {
      try {
        const fs = require('fs/promises');
        await fs.unlink(asset.file_path);
      } catch (fileErr) {
        console.warn('Failed to delete rejected file:', fileErr);
      }
    }

    logSecurityEvent('quarantined_file_rejected', userId, {
      assetId: id,
      fileName: asset.file_name,
      reason: reason || 'Rejected by administrator',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'high');

    res.json({
      message: 'File rejected successfully',
      asset: result.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Reject file error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to reject file',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;