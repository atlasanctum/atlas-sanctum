import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db';
import { verifyAccessToken } from '../utils/auth';
import { logSecurityEvent } from '../utils/logger';
import { generalRateLimit, validateApiKey, sanitizeInput, securityHeaders } from '../middleware/security';

const router = Router();

// Apply security middleware
router.use(securityHeaders);
router.use(validateApiKey);
router.use(sanitizeInput);
router.use(generalRateLimit);

// ============================================
// Quadratic Voting Utility Functions
// ============================================

function calculateQuadraticCost(votes: number): number {
  return Math.floor(votes * votes);
}

function calculateVotingPower(cost: number): number {
  return Math.floor(Math.sqrt(cost));
}

// ============================================
// Proposals Routes
// ============================================

router.get('/proposals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, category, limit = 50, offset = 0 } = req.query;

    let conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        p.*,
        COUNT(DISTINCT pv.id) as vote_count,
        SUM(pv.voting_power) as total_votes,
        COALESCE(SUM(CASE WHEN pv.vote_type = 'for' THEN pv.voting_power ELSE 0 END), 0) as votes_for,
        COALESCE(SUM(CASE WHEN pv.vote_type = 'against' THEN pv.voting_power ELSE 0 END), 0) as votes_against,
        COALESCE(SUM(CASE WHEN pv.vote_type = 'abstain' THEN pv.voting_power ELSE 0 END), 0) as votes_abstain
      FROM proposals p
      LEFT JOIN proposal_votes pv ON p.id = pv.proposal_id
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM proposals ${whereClause}`, params);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

router.get('/proposals/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        p.*,
        COUNT(DISTINCT pv.id) as vote_count,
        SUM(pv.voting_power) as total_votes
      FROM proposals p
      LEFT JOIN proposal_votes pv ON p.id = pv.proposal_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Proposal not found'
      });
    }

    const voteBreakdown = await query(`
      SELECT 
        vote_type,
        COUNT(*) as count,
        SUM(voting_power) as power
      FROM proposal_votes
      WHERE proposal_id = $1
      GROUP BY vote_type
    `, [id]);

    const comments = await query(`
      SELECT * FROM proposal_comments
      WHERE proposal_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `, [id]);

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        vote_breakdown: voteBreakdown.rows,
        comments: comments.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/proposals', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { title, description, category, funding_amount, voting_period_days } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    const result = await query(`
      INSERT INTO proposals (
        title, description, category, funding_amount, voting_period_days,
        status, created_by, quorum_threshold
      ) VALUES ($1, $2, $3, $4, $5, 'active', $6, 0.1)
      RETURNING *
    `, [title, description, category, funding_amount, voting_period_days || 7, userId]);

    logSecurityEvent('proposal_created', userId, {
      proposalId: result.rows[0].id,
      title
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Voting Routes
// ============================================

router.post('/proposals/:id/vote', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    const { vote_type, voting_tokens } = req.body;

    if (!vote_type || voting_tokens === undefined) {
      return res.status(400).json({
        success: false,
        error: 'vote_type and voting_tokens are required'
      });
    }

    const validVoteTypes = ['for', 'against', 'abstain'];
    if (!validVoteTypes.includes(vote_type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote_type. Must be: for, against, or abstain'
      });
    }

    const voting_power = calculateVotingPower(voting_tokens);
    const cost = calculateQuadraticCost(voting_tokens);

    const existingVote = await query(`
      SELECT * FROM proposal_votes
      WHERE proposal_id = $1 AND user_id = $2
    `, [id, userId]);

    if (existingVote.rows.length > 0) {
      await query(`
        UPDATE proposal_votes
        SET vote_type = $1, voting_tokens = $2, voting_power = $3, updated_at = NOW()
        WHERE proposal_id = $4 AND user_id = $5
      `, [vote_type, voting_tokens, voting_power, id, userId]);
    } else {
      await query(`
        INSERT INTO proposal_votes (proposal_id, user_id, vote_type, voting_tokens, voting_power)
        VALUES ($1, $2, $3, $4, $5)
      `, [id, userId, vote_type, voting_tokens, voting_power]);
    }

    logSecurityEvent('proposal_vote', userId, {
      proposalId: id,
      voteType: vote_type,
      votingPower: voting_power,
      cost
    });

    res.json({
      success: true,
      data: {
        vote_type,
        voting_tokens,
        voting_power,
        cost,
        message: `Vote cast. Cost: ${cost} tokens for ${voting_power} voting power.`
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/proposals/:id/votes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        vote_type,
        COUNT(DISTINCT user_id) as voter_count,
        SUM(voting_power) as total_power,
        SUM(voting_tokens) as total_tokens_spent,
        AVG(voting_power) as avg_power
      FROM proposal_votes
      WHERE proposal_id = $1
      GROUP BY vote_type
      ORDER BY 
        CASE vote_type 
          WHEN 'for' THEN 1 
          WHEN 'against' THEN 2 
          WHEN 'abstain' THEN 3 
        END
    `, [id]);

    const stats = await query(`
      SELECT 
        COUNT(DISTINCT user_id) as total_voters,
        SUM(voting_power) as total_voting_power,
        SUM(voting_tokens) as total_tokens_spent,
        AVG(voting_power) as avg_voting_power
      FROM proposal_votes
      WHERE proposal_id = $1
    `, [id]);

    res.json({
      success: true,
      data: {
        breakdown: result.rows,
        statistics: stats.rows[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Delegation Routes
// ============================================

router.post('/delegate', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { delegate_to, category, percentage } = req.body;

    if (!delegate_to) {
      return res.status(400).json({
        success: false,
        error: 'delegate_to address is required'
      });
    }

    const result = await query(`
      INSERT INTO voting_delegations (user_id, delegate_to, category, percentage)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, category)
      DO UPDATE SET delegate_to = $2, percentage = $4, updated_at = NOW()
      RETURNING *
    `, [userId, delegate_to, category || 'all', percentage || 100]);

    logSecurityEvent('voting_delegation', userId, {
      delegateTo: delegate_to,
      category,
      percentage
    });

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

router.get('/delegations/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const result = await query(`
      SELECT * FROM voting_delegations
      WHERE user_id = $1 OR delegate_to = $1
      ORDER BY category
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// DAO Membership Routes
// ============================================

router.get('/members', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await query(`
      SELECT 
        id,
        token_balance,
        voting_power,
        proposals_created,
        votes_cast,
        delegations_received,
        created_at
      FROM dao_members
      ORDER BY voting_power DESC
      LIMIT $1 OFFSET $2
    `, [Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM dao_members`);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

router.post('/join', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { token_balance } = req.body;

    if (!token_balance || token_balance <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Positive token balance is required'
      });
    }

    const result = await query(`
      INSERT INTO dao_members (id, token_balance, voting_power, proposals_created, votes_cast, delegations_received)
      VALUES ($1, $2, $2, 0, 0, 0)
      ON CONFLICT (id)
      DO UPDATE SET token_balance = $2, voting_power = $2, updated_at = NOW()
      RETURNING *
    `, [userId, token_balance]);

    logSecurityEvent('dao_member_joined', userId, { tokenBalance: token_balance });

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Governance Analytics Routes
// ============================================

router.get('/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = '30d' } = req.query;

    let interval: string;
    switch (period) {
      case '7d': interval = '7 days'; break;
      case '30d': interval = '30 days'; break;
      case '90d': interval = '90 days'; break;
      case '1y': interval = '1 year'; break;
      default: interval = '30 days';
    }

    const [proposals, votes, members, activity] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'passed') as passed,
          COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
          COUNT(*) FILTER (WHERE status = 'active') as active
        FROM proposals
        WHERE created_at >= NOW() - INTERVAL '${interval}'
      `),
      query(`
        SELECT 
          COUNT(*) as total_votes,
          SUM(voting_power) as total_voting_power,
          COUNT(DISTINCT user_id) as unique_voters
        FROM proposal_votes
        WHERE created_at >= NOW() - INTERVAL '${interval}'
      `),
      query(`
        SELECT 
          COUNT(*) as total_members,
          SUM(token_balance) as total_tokens,
          SUM(voting_power) as total_voting_power
        FROM dao_members
      `),
      query(`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as vote_count
        FROM proposal_votes
        WHERE created_at >= NOW() - INTERVAL '${interval}'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date
      `)
    ]);

    res.json({
      success: true,
      data: {
        period,
        proposals: proposals.rows[0],
        votes: votes.rows[0],
        members: members.rows[0],
        activityTrend: activity.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/quadratic-analysis', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT 
        proposal_id,
        title,
        COUNT(DISTINCT user_id) as unique_voters,
        SUM(voting_tokens) as total_tokens_spent,
        SUM(voting_power) as total_voting_power,
        SUM(voting_tokens) - SUM(voting_power) as quadratic_effect
      FROM proposal_votes pv
      JOIN proposals p ON pv.proposal_id = p.id
      GROUP BY proposal_id, title
      ORDER BY quadratic_effect DESC
      LIMIT 20
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Comments Routes
// ============================================

router.post('/proposals/:id/comments', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { id } = req.params;
    const { content, parent_id } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    const result = await query(`
      INSERT INTO proposal_comments (proposal_id, user_id, content, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id, userId, content, parent_id]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
