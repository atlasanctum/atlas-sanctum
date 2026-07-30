import express, { Request, Response } from 'express';
import { query, transaction } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = express.Router();

const createDelegationSchema = z.object({
  delegate_id: z.string().uuid(),
  voting_power: z.number().positive(),
  domains: z.array(z.string()).optional(),
  expires_at: z.string().optional(),
});

// GET delegations for a member
router.get('/member/:memberId', async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    
    const result = await query(
      `SELECT d.*, 
              m.display_name as delegate_name, m.avatar_url as delegate_avatar,
              m.reputation_score as delegate_reputation
       FROM delegations d
       JOIN members m ON d.delegate_id = m.id
       WHERE d.delegator_id = $1 AND d.is_active = true
       ORDER BY d.created_at DESC`,
      [memberId]
    );
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching delegations:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET received delegations (members delegating to this member)
router.get('/received/:memberId', async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    
    const result = await query(
      `SELECT d.*, 
              m.wallet_address as delegator_address,
              m.display_name as delegator_name
       FROM delegations d
       JOIN members m ON d.delegator_id = m.id
       WHERE d.delegate_id = $1 AND d.is_active = true
       ORDER BY d.voting_power DESC`,
      [memberId]
    );
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching received delegations:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE delegation
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = createDelegationSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.errors });
    }
    
    const { delegate_id, voting_power, domains, expires_at } = validation.data;
    const delegator_id = req.body.delegator_id; // Should come from auth
    
    // Check if delegate exists
    const delegateResult = await query('SELECT * FROM members WHERE id = $1', [delegate_id]);
    if (delegateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Delegate not found' });
    }
    
    const result = await query(
      `INSERT INTO delegations (id, delegator_id, delegate_id, voting_power, domains, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (delegator_id) DO UPDATE SET
         delegate_id = EXCLUDED.delegate_id,
         voting_power = EXCLUDED.voting_power,
         domains = EXCLUDED.domains,
         expires_at = EXCLUDED.expires_at,
         is_active = true
       RETURNING *`,
      [uuidv4(), delegator_id, delegate_id, voting_power, domains || null, expires_at || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating delegation:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// REVOKE delegation
router.delete('/:delegatorId', async (req: Request, res: Response) => {
  try {
    const { delegatorId } = req.params;
    
    const result = await query(
      'UPDATE delegations SET is_active = false, expires_at = CURRENT_TIMESTAMP WHERE delegator_id = $1 RETURNING *',
      [delegatorId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delegation not found' });
    }
    
    res.json({ message: 'Delegation revoked', delegation: result.rows[0] });
  } catch (err: any) {
    console.error('Error revoking delegation:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET delegation stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total_delegations,
        COUNT(*) FILTER (WHERE is_active = true) as active_delegations,
        SUM(voting_power) as total_delegated_power,
        COUNT(DISTINCT delegate_id) as unique_delegates,
        COUNT(DISTINCT delegator_id) as unique_delegators
      FROM delegations
      WHERE is_active = true
    `);
    
    // Top delegates
    const topDelegates = await query(`
      SELECT 
        m.id, m.display_name, m.avatar_url,
        SUM(d.voting_power) as received_votes,
        COUNT(d.delegator_id) as delegators_count
      FROM delegations d
      JOIN members m ON d.delegate_id = m.id
      WHERE d.is_active = true
      GROUP BY m.id
      ORDER BY SUM(d.voting_power) DESC
      LIMIT 10
    `);
    
    res.json({
      ...result.rows[0],
      topDelegates: topDelegates.rows
    });
  } catch (err: any) {
    console.error('Error fetching delegation stats:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
