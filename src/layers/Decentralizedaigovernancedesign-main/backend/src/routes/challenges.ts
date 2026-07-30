import express, { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = express.Router();

const createChallengeSchema = z.object({
  proposal_id: z.string().uuid(),
  bond: z.number().positive(),
  reason: z.string().min(1),
  evidence: z.array(z.string()).optional(),
});

// GET challenges for a proposal
router.get('/proposal/:proposalId', async (req: Request, res: Response) => {
  try {
    const { proposalId } = req.params;
    
    const result = await query(
      `SELECT c.*, 
              m.display_name as challenger_name, m.avatar_url as challenger_avatar
       FROM challenges c
       LEFT JOIN members m ON c.challenger_id = m.id
       WHERE c.proposal_id = $1
       ORDER BY c.submitted_at DESC`,
      [proposalId]
    );
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE challenge
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = createChallengeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.errors });
    }
    
    const { proposal_id, bond, reason, evidence } = validation.data;
    const challenger_id = req.body.challenger_id; // Should come from auth
    
    const result = await query(
      `INSERT INTO challenges (id, proposal_id, challenger_id, bond, reason, evidence)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuidv4(), proposal_id, challenger_id, bond, reason, evidence ? JSON.stringify(evidence) : null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating challenge:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// RESOLVE challenge
router.post('/:challengeId/resolve', async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { status } = req.body;
    
    if (!['validated', 'rejected', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await query(
      `UPDATE challenges 
       SET status = $1, resolved_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, challengeId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error resolving challenge:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET all active challenges
router.get('/active', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT c.*, 
              p.title as proposal_title, p.status as proposal_status,
              m.display_name as challenger_name
       FROM challenges c
       LEFT JOIN proposals p ON c.proposal_id = p.id
       LEFT JOIN members m ON c.challenger_id = m.id
       WHERE c.status = 'pending'
       ORDER BY c.submitted_at ASC`,
    );
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching active challenges:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
