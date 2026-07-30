import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db';
import { verifyAccessToken } from '../utils/auth';
import { logSecurityEvent } from '../utils/logger';
import { 
  generalRateLimit, 
  validateApiKey, 
  sanitizeInput,
  securityHeaders 
} from '../middleware/security';

// Optional auth middleware - allows both authenticated and anonymous requests
const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      verifyAccessToken(authHeader.replace('Bearer ', ''));
    } catch {
      // Ignore token errors for optional auth
    }
  }
  
  next();
};

const router = Router();

// Apply security middleware
router.use(securityHeaders);
router.use(validateApiKey);
router.use(sanitizeInput);
router.use(generalRateLimit);

// ============================================
// Impact Economy Routes
// ============================================

// GET /api/global-impact-economy/dashboard - Get dashboard data
router.get('/dashboard', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;

    // Get impact metrics
    const metricsResult = await query(`
      SELECT 
        COUNT(DISTINCT project_id) as total_projects,
        SUM(impact_score) as total_impact_score,
        SUM(carbon_credits) as total_carbon_credits,
        SUM(value_generated) as total_value_generated,
        COUNT(DISTINCT beneficiary_id) as total_beneficiaries
      FROM impact_metrics
      WHERE status = 'active'
    `);

    // Get recent projects
    const projectsResult = await query(`
      SELECT 
        id,
        name,
        description,
        impact_category,
        impact_score,
        carbon_credits,
        value_generated,
        status,
        created_at
      FROM projects
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Get community impact
    const communityResult = await query(`
      SELECT 
        COUNT(*) as total_contributors,
        SUM(contribution_value) as total_contributions,
        AVG(impact_score) as avg_impact_score
      FROM community_contributions
      WHERE verified = true
    `);

    res.json({
      success: true,
      data: {
        metrics: metricsResult.rows[0] || {},
        projects: projectsResult.rows || [],
        community: communityResult.rows[0] || {},
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/global-impact-economy/projects - List all projects
router.get('/projects', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      status,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions: string[] = ["status = 'active'"];
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`impact_category = $${paramIndex++}`);
      params.push(category);
    }

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const validSortColumns = ['name', 'impact_score', 'created_at', 'value_generated'];
    const sortColumn = validSortColumns.includes(sortBy as string) ? sortBy : 'created_at';
    const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const countResult = await query(
      `SELECT COUNT(*) FROM projects ${whereClause}`,
      params
    );

    const projectsResult = await query(`
      SELECT 
        id,
        name,
        description,
        impact_category,
        impact_score,
        carbon_credits,
        value_generated,
        status,
        location,
        beneficiaries_count,
        created_at,
        updated_at
      FROM projects 
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), offset]);

    res.json({
      success: true,
      data: {
        projects: projectsResult.rows || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: parseInt(countResult.rows[0]?.count || '0'),
          totalPages: Math.ceil(parseInt(countResult.rows[0]?.count || '0') / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/global-impact-economy/projects/:id - Get single project
router.get('/projects/:id', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', mi.id,
              'metric_type', mi.metric_type,
              'value', mi.value,
              'unit', mi.unit,
              'timestamp', mi.timestamp
            )
          ) FILTER (WHERE mi.id IS NOT NULL),
          '[]'
        ) as impact_metrics
      FROM projects p
      LEFT JOIN measurement_instances mi ON mi.project_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/global-impact-economy/projects - Create new project
router.post('/projects', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { name, description, impact_category, location, beneficiaries_count } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Name and description are required'
      });
    }

    const result = await query(`
      INSERT INTO projects (
        name, description, impact_category, location, beneficiaries_count, 
        created_by, status, impact_score, carbon_credits, value_generated
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active', 0, 0, 0)
      RETURNING *
    `, [name, description, impact_category, location, beneficiaries_count, userId]);

    logSecurityEvent('project_created', userId, {
      projectId: result.rows[0].id,
      name
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/global-impact-economy/impact-bonds - List impact bonds
router.get('/impact-bonds', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const result = await query(`
      SELECT 
        id,
        name,
        issuer,
        face_value,
        current_price,
        impact_targets,
        return_rate,
        maturity_date,
        status,
        created_at
      FROM impact_bonds
      WHERE status = 'active'
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [Number(limit), offset]);

    res.json({
      success: true,
      data: result.rows || []
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/global-impact-economy/microfinance - List microfinance opportunities
router.get('/microfinance', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, sector } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const conditions: string[] = ["status = 'active'"];
    const params: any[] = [];
    let paramIndex = 1;

    if (sector) {
      conditions.push(`sector = $${paramIndex++}`);
      params.push(sector);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(`
      SELECT 
        id,
        borrower_name,
        sector,
        loan_amount,
        repayment_term,
        interest_rate,
        impact_score,
        description,
        status,
        created_at
      FROM microfinance_opportunities
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...params, Number(limit), offset]);

    res.json({
      success: true,
      data: result.rows || []
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/global-impact-economy/microfinance - Create microfinance opportunity
router.post('/microfinance', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { borrower_name, sector, loan_amount, repayment_term, interest_rate, description } = req.body;

    if (!borrower_name || !loan_amount) {
      return res.status(400).json({
        success: false,
        error: 'Borrower name and loan amount are required'
      });
    }

    const result = await query(`
      INSERT INTO microfinance_opportunities (
        borrower_name, sector, loan_amount, repayment_term, 
        interest_rate, description, created_by, status, impact_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', 0)
      RETURNING *
    `, [borrower_name, sector, loan_amount, repayment_term, interest_rate, description, userId]);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/global-impact-economy/analytics - Get analytics data
router.get('/analytics', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
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

    // Get time series data
    const timeSeriesResult = await query(`
      SELECT 
        DATE_TRUNC('day', created_at) as date,
        COUNT(*) as project_count,
        SUM(impact_score) as total_impact,
        SUM(carbon_credits) as total_carbon,
        SUM(value_generated) as total_value
      FROM projects
      WHERE created_at >= NOW() - INTERVAL '${interval}'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date
    `);

    // Get category breakdown
    const categoryResult = await query(`
      SELECT 
        impact_category,
        COUNT(*) as project_count,
        AVG(impact_score) as avg_impact_score,
        SUM(value_generated) as total_value
      FROM projects
      WHERE status = 'active'
      GROUP BY impact_category
      ORDER BY total_value DESC
    `);

    res.json({
      success: true,
      data: {
        timeSeries: timeSeriesResult.rows || [],
        categories: categoryResult.rows || [],
        period
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/global-impact-economy/my-impact - Get user's impact
router.get('/my-impact', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;

    const userImpact = await query(`
      SELECT 
        COALESCE(SUM(impact_score), 0) as total_impact_score,
        COALESCE(SUM(carbon_credits), 0) as total_carbon_credits,
        COALESCE(SUM(value_generated), 0) as total_value_generated,
        COUNT(*) as projects_supported
      FROM user_impact
      WHERE user_id = $1
    `, [userId]);

    const userProjects = await query(`
      SELECT 
        id,
        name,
        impact_score,
        carbon_credits,
        value_generated,
        created_at
      FROM projects
      WHERE created_by = $1
      ORDER BY created_at DESC
      LIMIT 10
    `, [userId]);

    res.json({
      success: true,
      data: {
        summary: userImpact.rows[0] || {},
        projects: userProjects.rows || []
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/global-impact-economy/support/:projectId - Support a project
router.post('/support/:projectId', verifyAccessToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.params;
    const { support_type, amount } = req.body;

    if (!support_type || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Support type and amount are required'
      });
    }

    const result = await query(`
      INSERT INTO user_impact (
        user_id, project_id, support_type, amount, impact_score
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, projectId, support_type, amount, amount * 0.1]);

    logSecurityEvent('project_support', userId, {
      projectId,
      supportType: support_type,
      amount
    });

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export default router;
