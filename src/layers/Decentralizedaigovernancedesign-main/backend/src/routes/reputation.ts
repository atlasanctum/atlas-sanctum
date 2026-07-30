import express, { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET member reputation
router.get('/member/:memberId', async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    
    const result = await query(
      `SELECT 
         m.id, m.wallet_address, m.display_name, m.avatar_url,
         m.reputation_score, m.participation_rate, m.voting_power,
         m.created_at,
         COALESCE(json_agg(
           json_build_object(
             'domain', d.name,
             'score', mde.expertise_score,
             'rank', mde.rank,
             'verifications', mde.verifications
           )
         ) FILTER (WHERE mde.id IS NOT NULL), '[]') as domain_expertise,
         COALESCE(json_agg(
           json_build_object(
             'id', b.id,
             'name', badges.name,
             'rarity', badges.rarity,
             'earned_at', mb.earned_at
           )
         ) FILTER (WHERE badges.id IS NOT NULL), '[]') as badges
       FROM members m
       LEFT JOIN member_domain_expertise mde ON m.id = mde.member_id
       LEFT JOIN domains d ON mde.domain_id = d.id
       LEFT JOIN member_badges mb ON m.id = mb.member_id
       LEFT JOIN badges ON mb.badge_id = badges.id
       WHERE m.id = $1
       GROUP BY m.id`,
      [memberId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error('Error fetching reputation:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const { metric = 'reputation_score', limit = '20' } = req.query;
    
    const validMetrics = ['reputation_score', 'voting_power', 'participation_rate', 'total_delegated'];
    const metricColumn = validMetrics.includes(metric as string) ? metric : 'reputation_score';
    
    const result = await query(
      `SELECT 
         id, wallet_address, display_name, avatar_url,
         reputation_score, voting_power, participation_rate
       FROM members
       WHERE is_active = true
       ORDER BY ${metricColumn} DESC
       LIMIT $1`,
      [parseInt(limit as string)]
    );
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// UPDATE member reputation (called by background job)
router.post('/calculate/:memberId', async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    
    // Calculate new reputation score based on various factors
    const calcResult = await query(
      `WITH vote_stats AS (
         SELECT 
           voter_id,
           COUNT(*) as total_votes,
           COUNT(*) FILTER (WHERE choice IN ('yes', 'for')) as positive_votes
         FROM votes
         WHERE voter_id = $1
         GROUP BY voter_id
       ),
       proposal_stats AS (
         SELECT 
           proposer_id,
           COUNT(*) as proposals_created
         FROM proposals
         WHERE proposer_id = $1
         GROUP BY proposer_id
       )
       UPDATE members m
       SET 
         participation_rate = COALESCE((SELECT total_votes FROM vote_stats), 0)::decimal / 
           GREATEST(1, (SELECT COUNT(*) FROM proposals WHERE status IN ('active', 'executed', 'rejected'))),
         reputation_score = LEAST(100, 
           COALESCE((SELECT total_votes FROM vote_stats), 0) * 0.5 +
           COALESCE((SELECT positive_votes FROM vote_stats), 0) * 0.3 +
           COALESCE((SELECT proposals_created FROM proposal_stats), 0) * 2.0 +
           COALESCE(m.voting_power / 1000000, 0) * 0.2
         ),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [memberId]
    );
    
    if (calcResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ message: 'Reputation updated', member: calcResult.rows[0] });
  } catch (err: any) {
    console.error('Error calculating reputation:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET domain experts
router.get('/experts/:domainId', async (req: Request, res: Response) => {
  try {
    const { domainId } = req.params;
    const { limit = '10' } = req.query;
    
    const result = await query(
      `SELECT 
         m.id, m.wallet_address, m.display_name, m.avatar_url,
         mde.expertise_score, mde.rank, mde.verifications, mde.last_activity
       FROM member_domain_expertise mde
       JOIN members m ON mde.member_id = m.id
       WHERE mde.domain_id = $1 AND m.is_active = true
       ORDER BY mde.rank ASC NULLS LAST
       LIMIT $2`,
      [domainId, parseInt(limit as string)]
    );
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching domain experts:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// AWARD badge to member
router.post('/badge/award', async (req: Request, res: Response) => {
  try {
    const { member_id, badge_id, transaction_hash } = req.body;
    
    const result = await query(
      `INSERT INTO member_badges (id, member_id, badge_id, transaction_hash)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (member_id, badge_id) DO NOTHING
       RETURNING *`,
      [uuidv4(), member_id, badge_id, transaction_hash]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Badge already awarded or invalid' });
    }
    
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Error awarding badge:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

// GET all badges
router.get('/badges', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM badges ORDER BY rarity, name');
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching badges:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
