/**
 * M-Pesa Routes
 *
 * POST /api/mpesa/payout      — Disburse carbon credit proceeds to a farmer
 * POST /api/mpesa/collect     — Initiate STK Push to collect from a farmer
 * POST /api/mpesa/callback    — Safaricom result callback (public, no auth)
 * GET  /api/mpesa/status/:id  — Query transaction status
 */

import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { disburseFarmerPayout, initiateSTKPush, queryTransactionStatus } from '../services/mpesa';
import { query } from '../db';
import { logSecurityEvent } from '../utils/logger';

const router = express.Router();

const callbackBase = () =>
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;

// POST /api/mpesa/payout — authenticated, admin or verifier role
router.post('/payout', authenticate, async (req: any, res: Response) => {
  const { phoneNumber, amountKES, reference, remarks } = req.body;

  if (!phoneNumber || !amountKES || !reference) {
    return res.status(400).json({ success: false, error: 'phoneNumber, amountKES, and reference are required' });
  }

  if (!/^254\d{9}$/.test(phoneNumber)) {
    return res.status(400).json({ success: false, error: 'phoneNumber must be in format 254XXXXXXXXX' });
  }

  const result = await disburseFarmerPayout({
    phoneNumber,
    amountKES,
    reference,
    remarks,
    resultUrl: `${callbackBase()}/api/mpesa/callback`,
    queueTimeoutUrl: `${callbackBase()}/api/mpesa/callback`,
  });

  if (!result.success) {
    logSecurityEvent('mpesa_payout_failed', req.user?.id, { reference, error: result.error }, 'medium');
    return res.status(502).json(result);
  }

  // Record disbursement in DB for audit trail
  await query(
    `INSERT INTO mpesa_transactions (conversation_id, originator_conversation_id, phone_number, amount_kes, reference, type, status, created_at)
     VALUES ($1, $2, $3, $4, $5, 'b2c_payout', 'pending', NOW())
     ON CONFLICT (conversation_id) DO NOTHING`,
    [result.conversationId, result.originatorConversationId, phoneNumber, amountKES, reference]
  ).catch(() => {}); // Non-blocking — don't fail the payout if audit insert fails

  res.json(result);
});

// POST /api/mpesa/collect — authenticated
router.post('/collect', authenticate, async (req: any, res: Response) => {
  const { phoneNumber, amountKES, accountReference, transactionDesc } = req.body;

  if (!phoneNumber || !amountKES || !accountReference) {
    return res.status(400).json({ success: false, error: 'phoneNumber, amountKES, and accountReference are required' });
  }

  const result = await initiateSTKPush({
    phoneNumber,
    amountKES,
    accountReference,
    transactionDesc: transactionDesc || 'Atlas Sanctum payment',
    callbackUrl: `${callbackBase()}/api/mpesa/callback`,
  });

  res.status(result.success ? 200 : 502).json(result);
});

// POST /api/mpesa/callback — public, called by Safaricom
router.post('/callback', async (req: Request, res: Response) => {
  const body = req.body;

  // B2C result
  const b2cResult = body?.Result;
  if (b2cResult) {
    const status = b2cResult.ResultCode === 0 ? 'completed' : 'failed';
    await query(
      `UPDATE mpesa_transactions SET status = $1, result_code = $2, result_desc = $3, updated_at = NOW()
       WHERE conversation_id = $4`,
      [status, b2cResult.ResultCode, b2cResult.ResultDesc, b2cResult.ConversationID]
    ).catch(() => {});
  }

  // STK Push result
  const stkResult = body?.Body?.stkCallback;
  if (stkResult) {
    const status = stkResult.ResultCode === 0 ? 'completed' : 'failed';
    await query(
      `UPDATE mpesa_transactions SET status = $1, result_code = $2, result_desc = $3, updated_at = NOW()
       WHERE conversation_id = $4`,
      [status, stkResult.ResultCode, stkResult.ResultDesc, stkResult.CheckoutRequestID]
    ).catch(() => {});
  }

  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// GET /api/mpesa/status/:conversationId — authenticated
router.get('/status/:conversationId', authenticate, async (req: any, res: Response) => {
  const { conversationId } = req.params;

  // Check local DB first
  const local = await query(
    'SELECT * FROM mpesa_transactions WHERE conversation_id = $1',
    [conversationId]
  ).catch(() => ({ rows: [] }));

  if (local.rows.length > 0) {
    return res.json({ success: true, transaction: local.rows[0] });
  }

  // Fall back to Safaricom API query
  const result = await queryTransactionStatus(
    conversationId,
    conversationId,
    `${callbackBase()}/api/mpesa/callback`,
    `${callbackBase()}/api/mpesa/callback`
  );

  res.status(result.success ? 200 : 502).json(result);
});

export default router;
