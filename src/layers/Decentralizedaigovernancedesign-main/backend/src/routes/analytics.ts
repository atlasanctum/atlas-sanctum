import express, { Request, Response } from 'express';
import { query } from '../db';

const router = express.Router();

// GET governance metrics snapshot
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const startDate = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);
    
    const metrics = await query(`
      SELECT 
        snapshot_date,
        total_proposals,
        active_proposals,
        passed_proposals,
        rejected_proposals,
        total_voters,
        active_voters,
        participation_rate,
        average_quorum,
        treasury_balance,
        total_delegated,
        avg_decision_time_seconds
      FROM governance_metrics_snapshots
      WHERE snapshot_date >= $1
      ORDER BY snapshot_date DESC
    `, [startDate]);
    
    res.json(metrics.rows);
  } catch (err: any) {
    console.error('Error fetching metrics:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET current governance overview
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM proposals) as total_proposals,
        (SELECT COUNT(*) FROM proposals WHERE status = 'active') as active_proposals,
        (SELECT COUNT(*) FROM proposals WHERE status IN ('executed', 'passed')) as passed_proposals,
        (SELECT COUNT(*) FROM proposals WHERE status IN ('rejected', 'defeated')) as rejected_proposals,
        (SELECT COUNT(DISTINCT voter_id) FROM votes) as total_voters,
        (SELECT COUNT(DISTINCT voter_id) FROM votes WHERE voted_at > NOW() - INTERVAL '30 days') as active_voters_30d,
        (SELECT COUNT(*) FROM members WHERE is_active = true) as total_members,
        (SELECT SUM(voting_power) FROM delegations WHERE is_active = true) as total_delegated,
        (SELECT AVG(participation_rate) FROM members) as avg_participation
    `);
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error fetching overview:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET voting participation stats
router.get('/participation', async (req: Request, res: Response) => {
  try {
    const { days = '90' } = req.query;
    
    const result = await query(`
      SELECT 
        DATE(voted_at) as date,
        COUNT(DISTINCT voter_id) as unique_voters,
        COUNT(*) as total_votes,
        SUM(voting_power) as total_power
      FROM votes
      WHERE voted_at > NOW() - INTERVAL '${parseInt(days as string)} days'
      GROUP BY DATE(voted_at)
      ORDER BY date DESC
    `);
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching participation:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET proposal type distribution
router.get('/proposal-types', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT 
        proposal_type,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE status IN ('executed', 'passed')) as passed,
        COUNT(*) FILTER (WHERE status IN ('rejected', 'defeated')) as rejected
      FROM proposals
      GROUP BY proposal_type
      ORDER BY count DESC
    `);
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching proposal types:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET threat detection stats
router.get('/threats', async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    
    const result = await query(`
      SELECT 
        threat_type,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE severity = 'critical') as critical,
        COUNT(*) FILTER (WHERE severity = 'high') as high,
        COUNT(*) FILTER (WHERE status = 'mitigated') as mitigated,
        AVG(confidence) as avg_confidence
      FROM threat_detections
      WHERE detected_at > NOW() - INTERVAL '${parseInt(days as string)} days'
      GROUP BY threat_type
      ORDER BY count DESC
    `);
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching threats:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// CREATE metrics snapshot (for cron job)
router.post('/snapshot', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      INSERT INTO governance_metrics_snapshots (
        total_proposals, active_proposals, passed_proposals, rejected_proposals,
        total_voters, active_voters, participation_rate, average_quorum,
        treasury_balance, total_delegated, avg_decision_time_seconds
      )
      SELECT 
        (SELECT COUNT(*) FROM proposals),
        (SELECT COUNT(*) FROM proposals WHERE status = 'active'),
        (SELECT COUNT(*) FROM proposals WHERE status IN ('executed', 'passed')),
        (SELECT COUNT(*) FROM proposals WHERE status IN ('rejected', 'defeated')),
        (SELECT COUNT(DISTINCT voter_id) FROM votes),
        (SELECT COUNT(DISTINCT voter_id) FROM votes WHERE voted_at > NOW() - INTERVAL '30 days'),
        (SELECT AVG(participation_rate) FROM members WHERE participation_rate IS NOT NULL),
        (SELECT AVG(quorum) FROM proposals WHERE quorum IS NOT NULL),
        0, -- treasury_balance
        (SELECT SUM(voting_power) FROM delegations WHERE is_active = true),
        0 -- avg_decision_time_seconds
      RETURNING *
    `);
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error creating snapshot:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
