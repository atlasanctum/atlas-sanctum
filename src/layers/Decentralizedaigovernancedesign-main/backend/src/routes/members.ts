import express, { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = express.Router();

const createMemberSchema = z.object({
  wallet_address: z.string().min(42).max(66),
  display_name: z.string().min(1).max(255).optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

// GET all members
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '20', sort = 'created_at' } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const validSorts = ['created_at', 'voting_power', 'reputation_score', 'participation_rate'];
    const sortColumn = validSorts.includes(sort as string) ? sort : 'created_at';
    
    const result = await query(
      `SELECT id, wallet_address, display_name, avatar_url, voting_power, 
              reputation_score, participation_rate, created_at
       FROM members 
       WHERE is_active = true
       ORDER BY ${sortColumn} DESC
       LIMIT $1 OFFSET $2`,
      [parseInt(limit as string), offset]
    );
    
    const countResult = await query('SELECT COUNT(*) FROM members WHERE is_active = true');
    
    res.json({
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page as string),
      pageSize: parseInt(limit as string),
      hasMore: offset + result.rows.length < parseInt(countResult.rows[0].count)
    });
  } catch (err: any) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET single member
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT * FROM members WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET member by wallet address
router.get('/wallet/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    const result = await query(
      `SELECT * FROM members WHERE wallet_address = $1`,
      [walletAddress.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE or update member (upsert based on wallet address)
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = createMemberSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.errors });
    }
    
    const { wallet_address, display_name, bio, avatar_url } = validation.data;
    
    const result = await query(
      `INSERT INTO members (id, wallet_address, display_name, bio, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (wallet_address) DO UPDATE SET
         display_name = COALESCE(EXCLUDED.display_name, members.display_name),
         bio = COALESCE(EXCLUDED.bio, members.bio),
         avatar_url = COALESCE(EXCLUDED.avatar_url, members.avatar_url),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [uuidv4(), wallet_address.toLowerCase(), display_name, bio, avatar_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating member:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// UPDATE member
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { display_name, bio, avatar_url } = req.body;
    
    const result = await query(
      `UPDATE members 
       SET display_name = COALESCE($2, display_name),
           bio = COALESCE($3, bio),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, display_name, bio, avatar_url]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error updating member:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// DEACTIVATE member
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'UPDATE members SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ message: 'Member deactivated successfully' });
  } catch (err: any) {
    console.error('Error deactivating member:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET domains
router.get('/domains/list', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM domains ORDER BY name');
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching domains:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
