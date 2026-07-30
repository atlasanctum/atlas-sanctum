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
// Carbon Credits Routes
// ============================================

// GET /api/rve/credits - List carbon credits
router.get('/credits', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, project_type, limit = 50, offset = 0 } = req.query;

    let conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (project_type) {
      conditions.push(`project_type = $${paramIndex++}`);
      params.push(project_type);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        cc.*,
        p.name as project_name,
        p.location as project_location,
        p.beneficiaries_count,
        COALESCE(SUM(t.amount), 0) as total_traded
      FROM carbon_credits cc
      JOIN projects p ON cc.project_id = p.id
      LEFT JOIN trades t ON t.credit_id = cc.id
      ${whereClause}
      GROUP BY cc.id, p.name, p.location, p.beneficiaries_count
      ORDER BY cc.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM carbon_credits ${whereClause}`, params);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rve/credits/:id - Get carbon credit details
router.get('/credits/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        cc.*,
        p.name as project_name,
        p.description as project_description,
        p.location as project_location,
        p.beneficiaries_count,
        p.impact_score,
        ver.name as verifier_name,
        ver.certification_body
      FROM carbon_credits cc
      JOIN projects p ON cc.project_id = p.id
      LEFT JOIN verifiers ver ON cc.verifier_id = ver.id
      WHERE cc.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Carbon credit not found'
      });
    }

    // Get trade history
    const tradeHistory = await query(`
      SELECT * FROM trades
      WHERE credit_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `, [id]);

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        trade_history: tradeHistory.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rve/credits - Mint new carbon credits
router.post('/credits', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { project_id, credit_type, quantity, unit_price, vintage_year, certification_standard } = req.body;

    if (!project_id || !quantity || !unit_price) {
      return res.status(400).json({
        success: false,
        error: 'project_id, quantity, and unit_price are required'
      });
    }

    const result = await query(`
      INSERT INTO carbon_credits (
        project_id, credit_type, quantity, unit_price, vintage_year,
        certification_standard, status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, 'available', $7)
      RETURNING *
    `, [project_id, credit_type, quantity, unit_price, vintage_year, certification_standard, userId]);

    logSecurityEvent('carbon_credit_minted', userId, {
      creditId: result.rows[0].id,
      quantity,
      unitPrice: unit_price
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
// Trading Routes
// ============================================

// POST /api/rve/trades - Execute trade
router.post('/trades', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { credit_id, amount, trade_type } = req.body;

    if (!credit_id || !amount || !trade_type) {
      return res.status(400).json({
        success: false,
        error: 'credit_id, amount, and trade_type are required'
      });
    }

    // Get credit details
    const creditResult = await query(`
      SELECT * FROM carbon_credits WHERE id = $1 AND status = 'available'
    `, [credit_id]);

    if (creditResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Carbon credit not found or not available'
      });
    }

    const credit = creditResult.rows[0];
    const total_price = Number(amount) * Number(credit.unit_price);

    // Create trade
    const result = await query(`
      INSERT INTO trades (
        credit_id, buyer_id, seller_id, amount, unit_price, total_price, trade_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [credit_id, userId, credit.created_by, amount, credit.unit_price, total_price, trade_type]);

    // Update credit quantity
    await query(`
      UPDATE carbon_credits
      SET quantity = quantity - $1, updated_at = NOW()
      WHERE id = $2
    `, [amount, credit_id]);

    // Update seller balance
    await query(`
      UPDATE user_wallets
      SET balance = balance + $1, updated_at = NOW()
      WHERE user_id = $2
    `, [total_price, credit.created_by]);

    logSecurityEvent('carbon_credit_trade', userId, {
      tradeId: result.rows[0].id,
      creditId: credit_id,
      amount,
      totalPrice: total_price,
      tradeType: trade_type
    });

    res.status(201).json({
      success: true,
      data: {
        ...result.rows[0],
        credit_details: credit,
        total_price
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rve/trades - Get trade history
router.get('/trades', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credit_id, buyer_id, seller_id, limit = 50, offset = 0 } = req.query;

    let conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (credit_id) {
      conditions.push(`credit_id = $${paramIndex++}`);
      params.push(credit_id);
    }

    if (buyer_id) {
      conditions.push(`buyer_id = $${paramIndex++}`);
      params.push(buyer_id);
    }

    if (seller_id) {
      conditions.push(`seller_id = $${paramIndex++}`);
      params.push(seller_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        t.*,
        cc.credit_type,
        cc.vintage_year,
        p.name as project_name
      FROM trades t
      JOIN carbon_credits cc ON t.credit_id = cc.id
      JOIN projects p ON cc.project_id = p.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    const countResult = await query(`SELECT COUNT(*) FROM trades ${whereClause}`, params);

    res.json({
      success: true,
      data: result.rows,
      count: parseInt(countResult.rows[0]?.count || '0')
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Token Economics Routes
// ============================================

// GET /api/rve/tokens - Get token information
router.get('/tokens', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT 
        tk.*,
        SUM(tm.amount) as total_minted,
        SUM(CASE WHEN tm.burned = true THEN tm.amount ELSE 0 END) as total_burned,
        COUNT(DISTINCT tm.wallet_id) as holder_count
      FROM token_config tk
      LEFT JOIN token_mints tm ON tm.token_id = tk.id
      GROUP BY tk.id
      ORDER BY tk.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rve/tokens/mint - Mint tokens
router.post('/tokens/mint', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { token_id, wallet_id, amount, reason } = req.body;

    if (!token_id || !wallet_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'token_id, wallet_id, and amount are required'
      });
    }

    // Get token config
    const tokenResult = await query(`SELECT * FROM token_config WHERE id = $1`, [token_id]);
    if (tokenResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    // Create mint record
    const result = await query(`
      INSERT INTO token_mints (token_id, wallet_id, amount, minted_by, reason)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [token_id, wallet_id, amount, userId, reason]);

    // Update wallet balance
    await query(`
      INSERT INTO user_wallets (user_id, token_id, balance, updated_at)
      VALUES ($2, $1, $3, NOW())
      ON CONFLICT (user_id, token_id)
      DO UPDATE SET balance = user_wallets.balance + $3, updated_at = NOW()
    `, [token_id, wallet_id, amount]);

    logSecurityEvent('tokens_minted', userId, {
      tokenId: token_id,
      walletId: wallet_id,
      amount,
      reason
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rve/tokens/burn - Burn tokens
router.post('/tokens/burn', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { token_id, amount, reason } = req.body;

    if (!token_id || !amount) {
      return res.status(400).json({
        success: false,
        error: 'token_id and amount are required'
      });
    }

    // Check wallet balance
    const walletResult = await query(`
      SELECT * FROM user_wallets
      WHERE user_id = $1 AND token_id = $2
    `, [userId, token_id]);

    if (walletResult.rows.length === 0 || Number(walletResult.rows[0].balance) < Number(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance'
      });
    }

    // Create burn record
    const result = await query(`
      INSERT INTO token_mints (token_id, wallet_id, amount, minted_by, reason, burned)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *
    `, [token_id, userId, amount, userId, reason]);

    // Update wallet balance
    await query(`
      UPDATE user_wallets
      SET balance = balance - $1, updated_at = NOW()
      WHERE user_id = $2 AND token_id = $3
    `, [amount, userId, token_id]);

    logSecurityEvent('tokens_burned', userId, {
      tokenId: token_id,
      amount,
      reason
    });

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rve/wallets/:userId - Get user wallet
router.get('/wallets/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const result = await query(`
      SELECT 
        uw.*,
        tk.symbol,
        tk.name as token_name,
        tk.current_price,
        (uw.balance * tk.current_price) as usd_value
      FROM user_wallets uw
      JOIN token_config tk ON uw.token_id = tk.id
      WHERE uw.user_id = $1
      ORDER BY usd_value DESC
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
// Impact Derivatives Routes
// ============================================

// GET /api/rve/derivatives - List impact derivatives
router.get('/derivatives', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { derivative_type, status, limit = 50, offset = 0 } = req.query;

    let conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (derivative_type) {
      conditions.push(`derivative_type = $${paramIndex++}`);
      params.push(derivative_type);
    }

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT * FROM impact_derivatives
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), Number(offset)]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rve/derivatives - Create derivative
router.post('/derivatives', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { name, description, derivative_type, underlying_metric, strike_value, expiration_date, notional_amount } = req.body;

    if (!name || !derivative_type || !underlying_metric) {
      return res.status(400).json({
        success: false,
        error: 'name, derivative_type, and underlying_metric are required'
      });
    }

    const result = await query(`
      INSERT INTO impact_derivatives (
        name, description, derivative_type, underlying_metric, strike_value,
        expiration_date, notional_amount, status, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8)
      RETURNING *
    `, [name, description, derivative_type, underlying_metric, strike_value, expiration_date, notional_amount, userId]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Analytics Routes
// ============================================

// GET /api/rve/analytics - Get trading analytics
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

    const [trades, credits, tokens, volume] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as total_trades,
          SUM(total_price) as total_volume,
          AVG(total_price) as avg_trade_size
        FROM trades
        WHERE created_at >= NOW() - INTERVAL '${interval}'
      `),
      query(`
        SELECT 
          COUNT(*) as total_credits,
          SUM(quantity) as total_quantity,
          SUM(quantity * unit_price) as total_value
        FROM carbon_credits
        WHERE created_at >= NOW() - INTERVAL '${interval}'
      `),
      query(`
        SELECT 
          COUNT(*) as total_mints,
          SUM(amount) as total_minted,
          SUM(CASE WHEN burned = true THEN amount ELSE 0 END) as total_burned
        FROM token_mints
        WHERE created_at >= NOW() - INTERVAL '${interval}'
      `),
      query(`
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          SUM(total_price) as daily_volume,
          COUNT(*) as daily_trades
        FROM trades
        WHERE created_at >= NOW() - INTERVAL '${interval}'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date
      `)
    ]);

    res.json({
      success: true,
      data: {
        period,
        trades: trades.rows[0],
        credits: credits.rows[0],
        tokens: tokens.rows[0],
        volumeTrend: volume.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rve/market-overview - Get market overview
router.get('/market-overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'available') as available_credits,
        COUNT(*) FILTER (WHERE status = 'traded') as traded_credits,
        SUM(quantity) FILTER (WHERE status = 'available') as available_quantity,
        AVG(unit_price) as avg_price,
        COUNT(DISTINCT wallet_id) as active_wallets
      FROM carbon_credits
      LEFT JOIN user_wallets ON true
    `);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
