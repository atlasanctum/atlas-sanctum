import express, { Request, Response } from 'express';
import { query } from '../db';

const router = express.Router();

// Get Measurement Data for Project
router.get('/project/:projectId', async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { page = 1, size = 50, sortBy = 'measurement_date', order = 'DESC' } = req.query as any;
  const offset = (Number(page) - 1) * Number(size);

  try {
    const result = await query(
      `SELECT id, measurement_date, satellite_source, co2_level, soil_carbon_ppm, ndvi_index, biodiversity_score, confidence_level, anomaly_flag
       FROM measurement_data
       WHERE project_id = $1
       ORDER BY ${sortBy} ${order === 'ASC' ? 'ASC' : 'DESC'}
       LIMIT $2 OFFSET $3`,
      [projectId, Number(size), offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as total FROM measurement_data WHERE project_id = $1',
      [projectId]
    );

    res.json({
      items: result.rows,
      pagination: {
        page: Number(page),
        size: Number(size),
        total: parseInt(countResult.rows[0].total)
      }
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Record New Measurement
router.post('/', async (req: Request, res: Response) => {
  const {
    projectId,
    measurementDate,
    satelliteSource,
    co2Level,
    soilCarbonPpm,
    ndviIndex,
    biodiversityScore,
    temperature,
    precipitation,
    confidenceLevel,
    location,
    rawData
  } = req.body;

  if (!projectId || !satelliteSource) {
    return res.status(422).json({ code: 'invalid', message: 'projectId and satelliteSource required' });
  }

  try {
    // Detect anomalies: flag if values are extreme
    const isAnomaly = (co2Level > 450 || biodiversityScore > 100 || biodiversityScore < 0);

    const result = await query(
      `INSERT INTO measurement_data 
       (project_id, measurement_date, satellite_source, co2_level, soil_carbon_ppm, ndvi_index, 
        biodiversity_score, temperature_celsius, precipitation_mm, confidence_level, anomaly_flag, location, raw_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, ST_GeomFromText($12, 4326), $13)
       RETURNING *`,
      [
        projectId,
        measurementDate || new Date(),
        satelliteSource,
        co2Level || null,
        soilCarbonPpm || null,
        ndviIndex || null,
        biodiversityScore || null,
        temperature || null,
        precipitation || null,
        confidenceLevel || 0.95,
        isAnomaly,
        location ? `POINT(${location.longitude} ${location.latitude})` : null,
        rawData ? JSON.stringify(rawData) : null
      ]
    );

    res.status(201).json({
      measurement: result.rows[0],
      anomalyDetected: isAnomaly,
      message: 'Measurement recorded successfully'
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Measurement Details
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT id, project_id, measurement_date, satellite_source, co2_level, soil_carbon_ppm, 
              ndvi_index, biodiversity_score, temperature_celsius, precipitation_mm, 
              confidence_level, anomaly_flag, anomaly_reason, created_at,
              ST_AsText(location) as location
       FROM measurement_data WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ code: 'not_found' });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Anomalies
router.get('/anomalies', async (req: Request, res: Response) => {
  const { projectId, page = 1, size = 20 } = req.query as any;
  const offset = (Number(page) - 1) * Number(size);

  try {
    let q = 'SELECT * FROM measurement_data WHERE anomaly_flag = true';
    const params: any[] = [];

    if (projectId) {
      q += ` AND project_id = $${params.length + 1}`;
      params.push(projectId);
    }

    q += ` ORDER BY measurement_date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(Number(size), offset);

    const result = await query(q, params);

    res.json({
      items: result.rows,
      pagination: {
        page: Number(page),
        size: Number(size)
      }
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Measurement Trends
router.get('/:projectId/trends', async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { days = 365 } = req.query as any;

  try {
    const result = await query(
      `SELECT 
        DATE_TRUNC('day', measurement_date) as date,
        AVG(co2_level) as avg_co2,
        AVG(soil_carbon_ppm) as avg_soil_carbon,
        AVG(ndvi_index) as avg_ndvi,
        AVG(biodiversity_score) as avg_biodiversity,
        COUNT(*) as measurement_count
       FROM measurement_data
       WHERE project_id = $1 AND measurement_date >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE_TRUNC('day', measurement_date)
       ORDER BY date DESC`,
      [projectId]
    );

    res.json({
      projectId,
      period: `${days} days`,
      trends: result.rows.map(row => ({
        date: row.date,
        co2: parseFloat(row.avg_co2 || 0),
        soilCarbon: parseFloat(row.avg_soil_carbon || 0),
        ndvi: parseFloat(row.avg_ndvi || 0),
        biodiversity: parseFloat(row.avg_biodiversity || 0),
        measurementCount: parseInt(row.measurement_count)
      }))
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// Get Regional Measurements (Bioregion)
router.get('/bioregion/:bioregionId', async (req: Request, res: Response) => {
  const { bioregionId } = req.params;

  try {
    const result = await query(
      `SELECT 
        cp.id, cp.name, cp.status,
        COUNT(md.id) as measurement_count,
        AVG(md.co2_level) as avg_co2,
        AVG(md.biodiversity_score) as avg_biodiversity,
        AVG(md.confidence_level) as avg_confidence
       FROM carbon_projects cp
       LEFT JOIN measurement_data md ON cp.id = md.project_id
       WHERE cp.bioregion = $1
       GROUP BY cp.id, cp.name, cp.status`,
      [bioregionId]
    );

    res.json({
      bioregionId,
      projects: result.rows
    });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
