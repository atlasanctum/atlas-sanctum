import express, { Request, Response } from 'express';
import { query } from '../db';

const router = express.Router();

// Get All Projects
router.get('/', async (req: Request, res: Response) => {
  const { status, bioregion, page = 1, size = 20 } = req.query as any;
  const offset = (Number(page) - 1) * Number(size);

  try {
    let q = 'SELECT * FROM carbon_projects WHERE 1=1';
    const params: any[] = [];

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
    const countResult = await query('SELECT COUNT(*) as total FROM carbon_projects');
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
router.post('/', async (req: Request, res: Response) => {
  const {
    ownerId,
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

  if (!ownerId || !name || !projectType) {
    return res.status(422).json({ code: 'invalid', message: 'ownerId, name, and projectType required' });
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

// Update Project
router.put('/:id', async (req: Request, res: Response) => {
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
      riusIssued: 0, // To be calculated
      riusRetired: 0  // To be calculated
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Approve Project
router.post('/:id/approve', async (req: Request, res: Response) => {
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

// Reject Project
router.post('/:id/reject', async (req: Request, res: Response) => {
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
