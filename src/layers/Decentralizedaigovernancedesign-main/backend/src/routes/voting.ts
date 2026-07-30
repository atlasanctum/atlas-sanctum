import express, { Request, Response } from 'express';
import { query, transaction } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = express.Router();

// Validation schema
const castVoteSchema = z.object({
  proposal_id: z.string().uuid(),
  choice: z.string(),
  voting_power: z.number().positive(),
  justification: z.string().optional(),
  signature: z.string().optional(),
});

// GET votes for a proposal
router.get('/proposal/:proposalId', async (req: Request, res: Response) => {
  try {
    const { proposalId } = req.params;
    const { page = '1', limit = '50' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const result = await query(
      `SELECT v.*, m.display_name, m.avatar_url
       FROM votes v
       LEFT JOIN members m ON v.voter_id = m.id
       WHERE v.proposal_id = $1
       ORDER BY voted_at DESC
       LIMIT $2 OFFSET $3`,
      [proposalId, parseInt(limit as string), offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM votes WHERE proposal_id = $1', [proposalId]);
    
    res.json({
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page as string),
      pageSize: parseInt(limit as string),
      hasMore: offset + result.rows.length < parseInt(countResult.rows[0].count)
    });
  } catch (err: any) {
    console.error('Error fetching votes:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CAST vote
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = castVoteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.errors });
    }
    
    const { proposal_id, choice, voting_power, justification, signature } = validation.data;
    
    // Check if proposal exists and is active
    const proposalResult = await query(
      'SELECT * FROM proposals WHERE id = $1 AND status = $2',
      [proposal_id, 'active']
    );
    
    if (proposalResult.rows.length === 0) {
      return res.status(400).json({ error: 'Proposal not found or not active' });
    }
    
    const proposal = proposalResult.rows[0];
    
    // Calculate quadratic weight
    const quadraticWeight = Math.sqrt(voting_power);
    
    const result = await transaction(async (client) => {
      // Insert vote
      const voteResult = await client.query(
        `INSERT INTO votes (id, proposal_id, choice, voting_power, quadratic_weight, justification, signature)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (proposal_id, voter_id) DO UPDATE SET 
           choice = EXCLUDED.choice,
           voting_power = EXCLUDED.voting_power,
           quadratic_weight = EXCLUDED.quadratic_weight,
           justification = EXCLUDED.justification,
           signature = EXCLUDED.signature,
           voted_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [uuidv4(), proposal_id, choice, voting_power, quadraticWeight, justification, signature]
      );
      
      // Update proposal vote counts
      const vote = voteResult.rows[0];
      await client.query(
        `UPDATE proposals 
         SET total_votes = total_votes + $1,
             yes_votes = yes_votes + CASE WHEN $2 = 'yes' THEN $1 ELSE 0 END,
             no_votes = no_votes + CASE WHEN $2 = 'no' THEN $1 ELSE 0 END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [voting_power, choice.toLowerCase(), proposal_id]
      );
      
      return voteResult.rows[0];
    });
    
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Error casting vote:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET voting results for a proposal
router.get('/results/:proposalId', async (req: Request, res: Response) => {
  try {
    const { proposalId } = req.params;
    
    // Get proposal details
    const proposalResult = await query('SELECT * FROM proposals WHERE id = $1', [proposalId]);
    if (proposalResult.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    // Get vote counts by choice
    const voteCounts = await query(
      `SELECT choice, 
              COUNT(*) as vote_count,
              SUM(voting_power) as total_power,
              SUM(quadratic_weight) as total_quadratic_weight
       FROM votes 
       WHERE proposal_id = $1 
       GROUP BY choice`,
      [proposalId]
    );
    
    // Get voter participation stats
    const participationResult = await query(
      `SELECT 
         COUNT(DISTINCT voter_id) as unique_voters,
         SUM(voting_power) as total_power,
         SUM(quadratic_weight) as total_quadratic_power
       FROM votes WHERE proposal_id = $1`,
      [proposalId]
    );
    
    res.json({
      proposal: proposalResult.rows[0],
      voteCounts: voteCounts.rows,
      participation: participationResult.rows[0]
    });
  } catch (err: any) {
    console.error('Error fetching vote results:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET member's voting history
router.get('/member/:memberId', async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const { page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const result = await query(
      `SELECT v.*, p.title as proposal_title, p.status as proposal_status
       FROM votes v
       JOIN proposals p ON v.proposal_id = p.id
       WHERE v.voter_id = $1
       ORDER BY v.voted_at DESC
       LIMIT $2 OFFSET $3`,
      [memberId, parseInt(limit as string), offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM votes WHERE voter_id = $1', [memberId]);
    
    res.json({
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page as string),
      pageSize: parseInt(limit as string)
    });
  } catch (err: any) {
    console.error('Error fetching member votes:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
