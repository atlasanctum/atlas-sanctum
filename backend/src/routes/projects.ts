import express, { Request, Response } from 'express';
import { query } from '../db';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get All Projects — admins see all, authenticated users see their own + approved
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { status, bioregion, page = 1, size = 20 } = req.query as any;
  const offset = (Number(page) - 1) * Number(size);
  const user = req.user!;
  const isAdmin = user.role === 'admin';

  try {
    let q = 'SELECT * FROM carbon_projects WHERE 1=1';
    const params: any[] = [];

    // Non-admins only see their own projects or approved ones
    if (!isAdmin) {
      q += ` AND (owner_id = $${params.length + 1} OR status = 'approved')`;
      params.push(user.id);
    }

    if (status) {
      q += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    if (bioregion) {
      q += ` AND bioregion = $${params.length + 1}`;
      params.push(bioregion);
    }

    q += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(size), offset);

    const result = await query(q, params);
    const countResult = isAdmin
      ? await query('SELECT COUNT(*) as total FROM carbon_projects')
      : await query('SELECT COUNT(*) as total FROM carbon_projects WHERE owner_id = $1 OR status = $2', [user.id, 'approved']);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      items: result.rows,
      pagination: {
        page: Number(page),
        size: Number(size),
        total,
        totalPages: Math.ceil(total / Number(size))
      }
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Project by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      'SELECT * FROM carbon_projects WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found' });
    }

    // Get associated measurements
    const measurementsResult = await query(
      'SELECT * FROM measurement_data WHERE project_id = $1 ORDER BY measurement_date DESC LIMIT 100',
      [id]
    );

    res.json({
      project: result.rows[0],
      measurements: measurementsResult.rows
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Create New Project
router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const ownerId = user.id; // always scoped to authenticated user
  const {
    name,
    description,
    location,
    bioregion,
    projectType,
    startDate,
    targetCO2Reduction,
    areaHectares,
    biodiversityScore,
    healthImpactScore
  } = req.body;

  if (!name || !projectType) {
    return res.status(422).json({ code: 'invalid', message: 'name and projectType required' });
  }

  try {
    const result = await query(
      `INSERT INTO carbon_projects 
       (owner_id, name, description, location, bioregion, project_type, start_date, target_co2_reduction, area_hectares, biodiversity_score, health_impact_score, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending_approval')
       RETURNING *`,
      [
        ownerId,
        name,
        description || null,
        location || null,
        bioregion || null,
        projectType,
        startDate || new Date(),
        targetCO2Reduction || 0,
        areaHectares || 0,
        biodiversityScore || 0,
        healthImpactScore || 0
      ]
    );

    res.status(201).json({
      project: result.rows[0],
      message: 'Project created successfully'
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Update Project — owner or admin only
router.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const isAdmin = user.role === 'admin';

  // Verify ownership unless admin
  if (!isAdmin) {
    const ownerCheck = await query('SELECT owner_id FROM carbon_projects WHERE id = $1', [req.params.id]);
    if (ownerCheck.rowCount === 0) return res.status(404).json({ code: 'not_found' });
    if (ownerCheck.rows[0].owner_id !== user.id) return res.status(403).json({ code: 'forbidden' });
  }
  const { id } = req.params;
  const { status, biodiversityScore, healthImpactScore, actualCO2Reduction } = req.body;

  try {
    const result = await query(
      `UPDATE carbon_projects 
       SET status = COALESCE($1, status),
           biodiversity_score = COALESCE($2, biodiversity_score),
           health_impact_score = COALESCE($3, health_impact_score),
           actual_co2_reduction = COALESCE($4, actual_co2_reduction),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [status || null, biodiversityScore || null, healthImpactScore || null, actualCO2Reduction || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Project Stats
router.get('/:id/stats', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const projectResult = await query(
      'SELECT * FROM carbon_projects WHERE id = $1',
      [id]
    );

    if (projectResult.rowCount === 0) {
      return res.status(404).json({ code: 'not_found' });
    }

    const project = projectResult.rows[0];

    // Get measurement statistics
    const measurementStats = await query(
      `SELECT 
        COUNT(*) as measurement_count,
        AVG(co2_level) as avg_co2,
        AVG(soil_carbon_ppm) as avg_soil_carbon,
        AVG(biodiversity_score) as avg_biodiversity
       FROM measurement_data WHERE project_id = $1`,
      [id]
    );

    const stats = measurementStats.rows[0];

    // RIU issuance stats
    const riuStats = await query(
      `SELECT
         COUNT(*) FILTER (WHERE status != 'retired') AS issued,
         COUNT(*) FILTER (WHERE status = 'retired') AS retired
       FROM riums WHERE project_id = $1`,
      [id]
    );

    res.json({
      projectId: id,
      projectName: project.name,
      status: project.status,
      co2Target: project.target_co2_reduction,
      co2Achieved: project.actual_co2_reduction || 0,
      co2Percentage: project.target_co2_reduction ? 
        Math.round((project.actual_co2_reduction || 0) / project.target_co2_reduction * 100) : 0,
      biodiversityScore: parseFloat(stats.avg_biodiversity || 0),
      healthImpactScore: project.health_impact_score,
      measurementCount: parseInt(stats.measurement_count || 0),
      areaHectares: project.area_hectares,
      riusIssued: parseInt(riuStats.rows[0]?.issued || 0),
      riusRetired: parseInt(riuStats.rows[0]?.retired || 0)
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Approve Project — admin only
router.post('/:id/approve', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { approverNotes } = req.body;

  try {
    const result = await query(
      `UPDATE carbon_projects 
       SET status = 'approved',
           approval_notes = $1,
           approved_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [approverNotes || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found' });
    }

    res.json({
      project: result.rows[0],
      message: 'Project approved successfully'
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Reject Project — admin only
router.post('/:id/reject', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;

  try {
    const result = await query(
      `UPDATE carbon_projects 
       SET status = 'rejected',
           rejection_reason = $1,
           rejected_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [rejectionReason || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found' });
    }

    res.json({
      project: result.rows[0],
      message: 'Project rejected'
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
