import express, { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = express.Router();

const createProjectSchema = z.object({
  round_id: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  impact_report: z.string().optional(),
  impact_metrics: z.record(z.any()).optional(),
  funding_requested: z.number().positive(),
});

// GET RGF rounds
router.get('/rounds', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM rgf_rounds ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching rounds:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE RGF round
router.post('/rounds', async (req: Request, res: Response) => {
  try {
    const { name, description, total_funding, start_at, end_at, metadata } = req.body;
    
    const result = await query(
      `INSERT INTO rgf_rounds (id, name, description, total_funding, start_at, end_at, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [uuidv4(), name, description, total_funding, start_at, end_at, metadata ? JSON.stringify(metadata) : null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating round:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET projects for a round
router.get('/projects/:roundId', async (req: Request, res: Response) => {
  try {
    const { roundId } = req.params;
    
    const result = await query(
      `SELECT p.*, m.display_name as contributor_name, m.avatar_url as contributor_avatar
       FROM rgf_projects p
       LEFT JOIN members m ON p.contributor_id = m.id
       WHERE p.round_id = $1
       ORDER BY p.funding_allocated DESC NULLS LAST`,
      [roundId]
    );
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE project
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const validation = createProjectSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.errors });
    }
    
    const { round_id, title, description, impact_report, impact_metrics, funding_requested } = validation.data;
    const contributor_id = req.body.contributor_id; // From auth
    
    const result = await query(
      `INSERT INTO rgf_projects (id, round_id, contributor_id, title, description, impact_report, impact_metrics, funding_requested)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [uuidv4(), round_id, contributor_id, title, description, impact_report, impact_metrics ? JSON.stringify(impact_metrics) : null, funding_requested]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// SUBMIT attestation
router.post('/attestations', async (req: Request, res: Response) => {
  try {
    const { project_id, attestation, impact_rating, signature } = req.body;
    const attester_id = req.body.attester_id; // From auth
    
    const result = await query(
      `INSERT INTO impact_attestations (id, project_id, attester_id, attestation, impact_rating, signature)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuidv4(), project_id, attester_id, attestation, impact_rating, signature]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error submitting attestation:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET impact certificates
router.get('/certificates', async (req: Request, res: Response) => {
  try {
    const { proposal_id } = req.query;
    
    let sql = `
      SELECT ic.*, p.title as proposal_title
      FROM impact_certificates ic
      LEFT JOIN proposals p ON ic.proposal_id = p.id
    `;
    const params: any[] = [];
    
    if (proposal_id) {
      params.push(proposal_id);
      sql += ' WHERE ic.proposal_id = $1';
    }
    
    sql += ' ORDER BY ic.created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE impact certificate
router.post('/certificates', async (req: Request, res: Response) => {
  try {
    const { proposal_id, certificate_type, predicted_impact, current_price, total_supply, maturity_date, metadata } = req.body;
    
    const result = await query(
      `INSERT INTO impact_certificates 
       (id, proposal_id, certificate_type, predicted_impact, current_price, total_supply, maturity_date, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [uuidv4(), proposal_id, certificate_type, JSON.stringify(predicted_impact), current_price, total_supply, maturity_date, metadata ? JSON.stringify(metadata) : null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating certificate:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
