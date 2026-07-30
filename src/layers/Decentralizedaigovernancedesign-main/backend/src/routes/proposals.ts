import express, { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const createProposalSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  proposal_type: z.enum(['parameter_change', 'treasury_allocation', 'partnership', 'upgrade', 'emergency', 'constitutional']),
  voting_mechanism: z.enum(['quadratic', 'conviction', 'holographic', 'futarchy', 'liquid', 'optimistic', 'zk']),
  start_at: z.string().optional(),
  end_at: z.string().optional(),
  choices: z.array(z.string()).optional(),
  quorum: z.number().optional(),
  execution_data: z.record(z.any()).optional(),
});

// GET all proposals
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, type, page = '1', limit = '20' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let sql = 'SELECT * FROM proposals WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    if (type) {
      params.push(type);
      sql += ` AND proposal_type = $${params.length}`;
    }
    
    sql += ' ORDER BY created_at DESC';
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit as string), offset);
    
    const result = await query(sql, params);
    
    // Get total count
    let countSql = 'SELECT COUNT(*) FROM proposals WHERE 1=1';
    if (status) countSql += ` AND status = $1`;
    if (type) countSql += ` AND proposal_type = $${status ? 2 : 1}`;
    const countResult = await query(countSql, params.slice(0, status ? 2 : 1));
    
    const total = parseInt(countResult.rows[0].count);
    
    res.json({
      items: result.rows,
      total,
      page: parseInt(page as string),
      pageSize: parseInt(limit as string),
      hasMore: offset + result.rows.length < total
    });
  } catch (err: any) {
    console.error('Error fetching proposals:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET single proposal
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM proposals WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    // Get choices
    const choicesResult = await query('SELECT * FROM proposal_choices WHERE proposal_id = $1 ORDER BY sort_order', [id]);
    
    res.json({
      ...result.rows[0],
      choices: choicesResult.rows
    });
  } catch (err: any) {
    console.error('Error fetching proposal:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE proposal
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = createProposalSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.errors });
    }
    
    const { title, description, proposal_type, voting_mechanism, start_at, end_at, choices, quorum, execution_data } = validation.data;
    
    const proposalId = uuidv4();
    
    // Insert proposal
    const result = await query(
      `INSERT INTO proposals (id, title, description, proposal_type, voting_mechanism, start_at, end_at, quorum, execution_data, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft')
       RETURNING *`,
      [proposalId, title, description, proposal_type, voting_mechanism, start_at || null, end_at || null, quorum || 0, execution_data ? JSON.stringify(execution_data) : null]
    );
    
    // Insert choices if provided
    if (choices && choices.length > 0) {
      for (let i = 0; i < choices.length; i++) {
        await query(
          'INSERT INTO proposal_choices (id, proposal_id, label, sort_order) VALUES ($1, $2, $3, $4)',
          [uuidv4(), proposalId, choices[i], i]
        );
      }
    }
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating proposal:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// UPDATE proposal
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, start_at, end_at, quorum } = req.body;
    
    const result = await query(
      `UPDATE proposals 
       SET title = COALESCE($2, title), 
           description = COALESCE($3, description),
           status = COALESCE($4, status),
           start_at = COALESCE($5, start_at),
           end_at = COALESCE($6, end_at),
           quorum = COALESCE($7, quorum),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, title, description, status, start_at, end_at, quorum]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error updating proposal:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// DELETE proposal
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM proposals WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    res.json({ message: 'Proposal deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting proposal:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET proposal statistics
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) as total_proposals,
        COUNT(*) FILTER (WHERE status = 'active') as active_proposals,
        COUNT(*) FILTER (WHERE status = 'passed' OR status = 'executed') as passed_proposals,
        COUNT(*) FILTER (WHERE status = 'rejected' OR status = 'defeated') as rejected_proposals,
        SUM(yes_votes) as total_yes_votes,
        SUM(no_votes) as total_no_votes,
        SUM(total_votes) as total_votes_cast
      FROM proposals
    `);
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error fetching proposal stats:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
