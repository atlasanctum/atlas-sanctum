import express from 'express';
import crypto from 'crypto';
import { query } from '../db';
import { validateAuditLog } from '../middleware/validation';
import { logSecurityEvent } from '../utils/logger';

const router = express.Router();

// Public audit logging for page accesses (no authentication required)
router.post('/', validateAuditLog, async (req, res) => {
  const { eventType, payload } = req.body;

  // Only allow specific event types for public logging
  const allowedEventTypes = ['page_access'];
  if (!allowedEventTypes.includes(eventType)) {
    return res.status(400).json({ code: 'invalid_event_type', message: 'Event type not allowed for public logging' });
  }

  const payloadStr = JSON.stringify(payload);
  const hash = crypto.createHash('sha256').update(payloadStr).digest('hex');

  try {
    const result = await query(
      'INSERT INTO audits (event_type, payload, payload_hash) VALUES ($1,$2,$3) RETURNING id,payload_hash',
      [eventType, payload, hash]
    );

    // Log the audit event creation
    logSecurityEvent('public_audit_log_created', null, {
      auditId: result.rows[0].id,
      eventType,
    }, 'low');

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    logSecurityEvent('public_audit_log_creation_failed', null, {
      error: err.message,
      eventType,
    }, 'medium');

    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;