import express, { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import fs from 'fs/promises';
import path from 'path';
import { query } from '../db';
import { secureFileUpload } from '../middleware/fileUpload';
import { logFileAccess, scanFileContent, ThreatLevel } from '../utils/fileSecurity';
import { logSecurityEvent } from '../utils/logger';
import { authenticate, authorize } from '../middleware/auth';
import { validateWithZod } from '../middleware/validation';
import { fileUploadQuerySchema } from '../validation/schemas';

const router = express.Router();

// File upload endpoint with comprehensive security
router.post('/upload', secureFileUpload('default'), async (req: any, res: Response) => {
  try {
    if (!req.file || !req.fileValidation) {
      return res.status(400).json({
        code: 'no_file_data',
        message: 'No file data available',
        timestamp: new Date().toISOString()
      });
    }

    const userId = (req as any).user?.id;
    const { title, description, type, isPublic, tags, metadata } = req.body;
    const validation = req.fileValidation;

    // Create asset record in database
    const result = await query(`
      INSERT INTO assets (
        title, type, metadata, owner_id, org_id, status,
        file_path, file_name, file_size, mime_type, file_hash,
        upload_status, scan_status, quarantine_reason
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      title || req.file.originalname,
      type || 'other',
      {
        ...metadata,
        description,
        isPublic: isPublic || false,
        tags: tags || [],
        uploadedBy: userId,
        uploadedAt: new Date().toISOString()
      },
      userId,
      null, // orgId
      'active',
      validation.filePath,
      req.file.originalname,
      req.file.size,
      validation.detectedMimeType,
      validation.fileHash,
      validation.status,
      'not_scanned', // Will be updated after scanning
      validation.shouldQuarantine ? 'Security scan detected threats' : null
    ]);

    const asset = result.rows[0];

    // Log the upload
    await logFileAccess(
      asset.id,
      userId,
      'upload',
      req.ip,
      req.get('User-Agent'),
      true,
      undefined,
      {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileHash: validation.fileHash,
        status: validation.status
      }
    );

    // Trigger async scanning if required
    if (validation.status === 'approved') {
      // In a real implementation, this would be queued for background processing
      setImmediate(async () => {
        try {
          const scanResult = scanFileContent(req.file!.buffer);
          await query(`
            UPDATE assets
            SET scan_status = $1, updated_at = now()
            WHERE id = $2
          `, [scanResult.threatLevel === ThreatLevel.CLEAN ? 'clean' : 'infected', asset.id]);

          // Log scan result
          await query(`
            INSERT INTO file_scan_results (asset_id, scanner_name, threat_level, threats_found, scan_metadata)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            asset.id,
            'basic_content_scanner',
            scanResult.threatLevel,
            scanResult.threats,
            { confidence: scanResult.confidence, scannedAt: new Date().toISOString() }
          ]);

          if (scanResult.threatLevel !== ThreatLevel.CLEAN) {
            logSecurityEvent('file_scan_threat_detected', userId, {
              assetId: asset.id,
              fileName: req.file!.originalname,
              threatLevel: scanResult.threatLevel,
              threats: scanResult.threats,
              confidence: scanResult.confidence
            }, scanResult.threatLevel === ThreatLevel.CRITICAL ? 'critical' : 'high');
          }
        } catch (error) {
          console.error('Background scan error:', error);
        }
      });
    }

    res.status(201).json({
      ...asset,
      validation: {
        warnings: validation.warnings,
        status: validation.status
      }
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    logSecurityEvent('file_upload_database_error', (req as any).user?.id || null, {
      error: err.message,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }, 'high');

    res.status(500).json({
      code: 'server_error',
      message: 'File upload failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Get assets with filtering
router.get('/', authenticate, validateWithZod(fileUploadQuerySchema, { logSecurityEvents: true }), async (req: any, res: Response) => {
  try {
    const {
      type,
      status,
      isPublic,
      ownerId,
      page = 1,
      limit = 20
    } = req.query as any;

    const userId = (req as any).user?.id;
    const offset = (Number(page) - 1) * Number(limit);

    // Build query with security filtering
    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    // Users can only see their own assets or public assets
    whereConditions.push(`(owner_id = $${paramIndex} OR (metadata->>'isPublic')::boolean = true)`);
    params.push(userId);
    paramIndex++;

    if (type) {
      whereConditions.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`upload_status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (isPublic !== undefined) {
      whereConditions.push(`(metadata->>'isPublic')::boolean = $${paramIndex}`);
      params.push(isPublic);
      paramIndex++;
    }

    if (ownerId) {
      // Only admins can filter by other owners
      if ((req as any).user?.role === 'admin') {
        whereConditions.push(`owner_id = $${paramIndex}`);
        params.push(ownerId);
        paramIndex++;
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const queryText = `
      SELECT *,
             CASE WHEN owner_id = $1 THEN true ELSE false END as is_owner
      FROM assets
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    params.push(Number(limit), offset);

    const result = await query(queryText, [userId, ...params.slice(1)]);

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM assets ${whereClause}`;
    const countResult = await query(countQuery, params.slice(1, -2)); // Remove limit and offset
    const total = parseInt(countResult.rows[0].total);

    res.json({
      items: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err: any) {
    console.error('Assets query error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to retrieve assets',
      timestamp: new Date().toISOString()
    });
  }
});

// Get specific asset
router.get('/:id', authenticate, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await query(`
      SELECT *,
             CASE WHEN owner_id = $1 THEN true ELSE false END as is_owner
      FROM assets WHERE id = $2
    `, [userId, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'not_found',
        message: 'Asset not found',
        timestamp: new Date().toISOString()
      });
    }

    const asset = result.rows[0];

    const ip = (req.ip || '') as string;
    const userAgent = (req.get('User-Agent') || '') as string;

    // Check access permissions
    if (!asset.is_owner && !asset.metadata?.isPublic) {
      await logFileAccess(id, userId, 'access', ip, userAgent, false, 'Access denied');
      return res.status(403).json({
        code: 'access_denied',
        message: 'Access denied to this asset',
        timestamp: new Date().toISOString()
      });
    }

    // Log access
    await logFileAccess(id, userId, 'access', ip, userAgent, true);

    res.json(asset);
  } catch (err: any) {
    console.error('Asset retrieval error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to retrieve asset',
      timestamp: new Date().toISOString()
    });
  }
});

// Download asset with security headers
router.get('/:id/download', authenticate, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await query(`
      SELECT *,
             CASE WHEN owner_id = $1 THEN true ELSE false END as is_owner
      FROM assets WHERE id = $2
    `, [userId, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'not_found',
        message: 'Asset not found',
        timestamp: new Date().toISOString()
      });
    }

    const asset = result.rows[0];

    // Check access permissions
    if (!asset.is_owner && !asset.metadata?.isPublic) {
      await logFileAccess(id, userId, 'download', req.ip, req.get('User-Agent'), false, 'Access denied');
      return res.status(403).json({
        code: 'access_denied',
        message: 'Access denied to download this asset',
        timestamp: new Date().toISOString()
      });
    }

    // Check if file is quarantined
    if (asset.upload_status === 'quarantined') {
      await logFileAccess(id, userId, 'download', req.ip, req.get('User-Agent'), false, 'File quarantined');
      return res.status(403).json({
        code: 'file_quarantined',
        message: 'File is quarantined and cannot be downloaded',
        timestamp: new Date().toISOString()
      });
    }

    // Check if file exists
    try {
      await fs.access(asset.file_path);
    } catch {
      await logFileAccess(id, userId, 'download', req.ip, req.get('User-Agent'), false, 'File not found on disk');
      return res.status(404).json({
        code: 'file_not_found',
        message: 'File not found on disk',
        timestamp: new Date().toISOString()
      });
    }

    // Log successful download
    await logFileAccess(id, userId, 'download', req.ip, req.get('User-Agent'), true);

    // Set security headers
    res.setHeader('Content-Type', asset.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${asset.file_name}"`);
    res.setHeader('Content-Length', asset.file_size);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'none'");

    // Stream file
    const fileStream = require('fs').createReadStream(asset.file_path);
    fileStream.pipe(res);

  } catch (err: any) {
    console.error('Asset download error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to download asset',
      timestamp: new Date().toISOString()
    });
  }
});

// Delete asset (soft delete with cleanup)
router.delete('/:id', authenticate, async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await query(`
      SELECT *,
             CASE WHEN owner_id = $1 THEN true ELSE false END as is_owner
      FROM assets WHERE id = $2
    `, [userId, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'not_found',
        message: 'Asset not found',
        timestamp: new Date().toISOString()
      });
    }

    const asset = result.rows[0];

    // Check ownership
    if (!asset.is_owner && (req as any).user?.role !== 'admin') {
      await logFileAccess(id, userId, 'delete', req.ip, req.get('User-Agent'), false, 'Access denied');
      return res.status(403).json({
        code: 'access_denied',
        message: 'Access denied to delete this asset',
        timestamp: new Date().toISOString()
      });
    }

    // Mark as deleted (soft delete)
    await query(`
      UPDATE assets
      SET status = 'deleted', updated_at = now()
      WHERE id = $1
    `, [id]);

    // Attempt to delete physical file
    if (asset.file_path) {
      try {
        await fs.unlink(asset.file_path);
      } catch (fileErr) {
        console.warn('Failed to delete physical file:', fileErr);
        // Don't fail the request if file deletion fails
      }
    }

    // Log deletion
    await logFileAccess(id, userId, 'delete', req.ip, req.get('User-Agent'), true);

    res.json({
      message: 'Asset deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Asset deletion error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Failed to delete asset',
      timestamp: new Date().toISOString()
    });
  }
});

// Manual scan endpoint (admin only)
router.post('/:id/scan', authenticate, authorize('admin'), async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const result = await query('SELECT * FROM assets WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 'not_found',
        message: 'Asset not found',
        timestamp: new Date().toISOString()
      });
    }

    const asset = result.rows[0];

    // Read file content
    let buffer: Buffer;
    try {
      buffer = await fs.readFile(asset.file_path);
    } catch {
      return res.status(404).json({
        code: 'file_not_found',
        message: 'File not found on disk',
        timestamp: new Date().toISOString()
      });
    }

    // Perform scan
    const scanResult = scanFileContent(buffer);

    // Update asset scan status
    await query(`
      UPDATE assets
      SET scan_status = $1, updated_at = now()
      WHERE id = $2
    `, [scanResult.threatLevel === ThreatLevel.CLEAN ? 'clean' : 'infected', id]);

    // Log scan result
    await query(`
      INSERT INTO file_scan_results (asset_id, scanner_name, threat_level, threats_found, scan_metadata)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      id,
      'manual_scan',
      scanResult.threatLevel,
      scanResult.threats,
      {
        confidence: scanResult.confidence,
        scannedAt: new Date().toISOString(),
        requestedBy: userId
      }
    ]);

    // Log scan action
    await logFileAccess(id, userId, 'scan', req.ip, req.get('User-Agent'), true);

    res.json({
      assetId: id,
      scanResult: {
        threatLevel: scanResult.threatLevel,
        threats: scanResult.threats,
        confidence: scanResult.confidence,
        scannedAt: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error('Manual scan error:', err);
    res.status(500).json({
      code: 'server_error',
      message: 'Scan failed',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
