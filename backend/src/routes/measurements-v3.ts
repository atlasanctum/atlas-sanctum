import express, { Request, Response, NextFunction } from 'express';
import environmentalMonitoringService from '../services/EnvironmentalMonitoringService';
import { cacheWithRedis, invalidateCache } from '../redisClient';
import { logger } from '../utils/logger';
import { query } from '../db';

const router = express.Router();

// ============================================
// Dashboard & Overview
// ============================================

// GET /api/v3/measurements/dashboard - Main environmental monitoring dashboard
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const dashboard = await environmentalMonitoringService.getDashboard();
    res.json(dashboard);
  } catch (err: any) {
    logger.error('Dashboard error', { error: err.message });
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Carbon Flux & Satellite Data
// ============================================

// GET /api/v3/measurements/carbon/summary - Carbon flux summary
router.get('/carbon/summary', async (req: Request, res: Response) => {
  try {
    const summary = await environmentalMonitoringService.getCarbonFluxSummary();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// GET /api/v3/measurements/carbon/region/:regionId - Carbon flux by region
router.get('/carbon/region/:regionId', async (req: Request, res: Response) => {
  const { regionId } = req.params;
  const { startDate, endDate } = req.query as any;

  try {
    const data = await environmentalMonitoringService.getCarbonFluxByRegion(regionId, { startDate, endDate });
    res.json({ regionId, data });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/carbon - Record carbon flux measurement
router.post('/carbon', async (req: Request, res: Response) => {
  const {
    satelliteImageryId,
    regionId,
    grossPrimaryProductivity,
    ecosystemRespiration,
    netEcosystemExchange,
    carbonSequestrationRate,
    measurementMethod,
    verificationLevel,
    timestamp
  } = req.body;

  if (!satelliteImageryId || !regionId) {
    return res.status(422).json({ code: 'invalid', message: 'satelliteImageryId and regionId required' });
  }

  try {
    const measurement = await environmentalMonitoringService.recordCarbonFlux({
      satelliteImageryId,
      regionId,
      grossPrimaryProductivity,
      ecosystemRespiration,
      netEcosystemExchange,
      carbonSequestrationRate,
      measurementMethod,
      verificationLevel,
      timestamp
    });
    res.status(201).json({ measurement, message: 'Carbon flux recorded successfully' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// GET /api/v3/measurements/land-use - Land use changes
router.get('/land-use', async (req: Request, res: Response) => {
  const { regionId, changeType, limit } = req.query as any;

  try {
    const changes = await environmentalMonitoringService.getLandUseChange({ regionId, changeType, limit: parseInt(limit) });
    res.json({ changes });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Deforestation Alerts
// ============================================

// GET /api/v3/measurements/deforestation/alerts - Get deforestation alerts
router.get('/deforestation/alerts', async (req: Request, res: Response) => {
  const { status, severity, limit } = req.query as any;

  try {
    const alerts = await environmentalMonitoringService.getDeforestationAlerts({ status, severity, limit: parseInt(limit) });
    res.json({ alerts });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/deforestation/alerts - Create deforestation alert
router.post('/deforestation/alerts', async (req: Request, res: Response) => {
  const {
    regionId,
    alertType,
    severity,
    estimatedAreaHectares,
    location,
    satelliteSource,
    detectionDate
  } = req.body;

  if (!regionId || !alertType || !severity) {
    return res.status(422).json({ code: 'invalid', message: 'regionId, alertType, and severity required' });
  }

  try {
    const alert = await environmentalMonitoringService.createDeforestationAlert({
      regionId,
      alertType,
      severity,
      estimatedAreaHectares,
      location,
      satelliteSource,
      detectionDate
    });
    res.status(201).json({ alert, message: 'Deforestation alert created' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// PUT /api/v3/measurements/deforestation/alerts/:id/acknowledge - Acknowledge alert
router.put('/deforestation/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const alert = await environmentalMonitoringService.acknowledgeDeforestationAlert(id, userId);
    if (!alert) {
      return res.status(404).json({ code: 'not_found' });
    }
    res.json({ alert, message: 'Alert acknowledged' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Soil Sensor Data
// ============================================

// GET /api/v3/measurements/soil/summary - Soil health summary
router.get('/soil/summary', async (req: Request, res: Response) => {
  try {
    const summary = await environmentalMonitoringService.getSoilHealthSummary();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// GET /api/v3/measurements/soil/station/:stationId - Soil readings by station
router.get('/soil/station/:stationId', async (req: Request, res: Response) => {
  const { stationId } = req.params;
  const { days, limit } = req.query as any;

  try {
    const readings = await environmentalMonitoringService.getSoilReadingsByStation(stationId, {
      days: parseInt(days) || 30,
      limit: parseInt(limit) || 1000
    });
    res.json({ stationId, readings });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/soil - Record soil sensor reading
router.post('/soil', async (req: Request, res: Response) => {
  const {
    sensorId,
    stationId,
    moistureContent,
    moistureDepthCm,
    nitrogenPpm,
    phosphorusPpm,
    potassiumPpm,
    phLevel,
    organicMatterPercentage,
    microbialBiomassC,
    respirationRate,
    enzymeActivity,
    soilTemperature,
    bulkDensity,
    cationExchangeCapacity,
    timestamp
  } = req.body;

  if (!sensorId || !stationId) {
    return res.status(422).json({ code: 'invalid', message: 'sensorId and stationId required' });
  }

  try {
    const reading = await environmentalMonitoringService.recordSoilSensorReading({
      sensorId,
      stationId,
      moistureContent,
      moistureDepthCm,
      nitrogenPpm,
      phosphorusPpm,
      potassiumPpm,
      phLevel,
      organicMatterPercentage,
      microbialBiomassC,
      respirationRate,
      enzymeActivity,
      soilTemperature,
      bulkDensity,
      cationExchangeCapacity,
      timestamp
    });
    res.status(201).json({ reading, message: 'Soil reading recorded successfully' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Biodiversity Monitoring
// ============================================

// GET /api/v3/measurements/biodiversity/summary - Biodiversity summary
router.get('/biodiversity/summary', async (req: Request, res: Response) => {
  try {
    const summary = await environmentalMonitoringService.getBiodiversitySummary();
    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// GET /api/v3/measurements/biodiversity/species - Species registry
router.get('/biodiversity/species', async (req: Request, res: Response) => {
  const { kingdom, conservationStatus, limit } = req.query as any;

  try {
    const species = await environmentalMonitoringService.getSpeciesRegistry({
      kingdom,
      conservationStatus,
      limit: parseInt(limit) || 100
    });
    res.json({ species });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/biodiversity - Record biodiversity data
router.post('/biodiversity', async (req: Request, res: Response) => {
  const {
    monitoringType,
    stationId,
    speciesDetected,
    diversityIndex,
    richnessEstimate,
    biomassEstimate,
    identificationConfidence,
    audioFileUrl,
    imageUrls,
    timestamp
  } = req.body;

  if (!monitoringType || !stationId || !speciesDetected) {
    return res.status(422).json({ code: 'invalid', message: 'monitoringType, stationId, and speciesDetected required' });
  }

  try {
    const record = await environmentalMonitoringService.recordBiodiversityData({
      monitoringType,
      stationId,
      speciesDetected,
      diversityIndex,
      richnessEstimate,
      biomassEstimate,
      identificationConfidence,
      audioFileUrl,
      imageUrls,
      timestamp
    });
    res.status(201).json({ record, message: 'Biodiversity record created' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/biodiversity/acoustic - Record acoustic monitoring
router.post('/biodiversity/acoustic', async (req: Request, res: Response) => {
  const {
    stationId,
    recordingStart,
    recordingEnd,
    durationSeconds,
    samplingRate,
    acousticBiodiversityIndex,
    speciesDetectedCount,
    vocalActivityIndex,
    noiseLevelDb,
    analysisResults
  } = req.body;

  if (!stationId || !recordingStart || !recordingEnd) {
    return res.status(422).json({ code: 'invalid', message: 'stationId, recordingStart, and recordingEnd required' });
  }

  try {
    const record = await environmentalMonitoringService.recordAcousticMonitoring({
      stationId,
      recordingStart,
      recordingEnd,
      durationSeconds,
      samplingRate,
      acousticBiodiversityIndex,
      speciesDetectedCount,
      vocalActivityIndex,
      noiseLevelDb,
      analysisResults
    });
    res.status(201).json({ record, message: 'Acoustic monitoring record created' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/biodiversity/camera - Record camera trap data
router.post('/biodiversity/camera', async (req: Request, res: Response) => {
  const {
    deviceId,
    deploymentId,
    imageUrl,
    videoUrl,
    speciesDetections,
    animalCount,
    activityPattern,
    behaviorObserved,
    triggerType,
    batteryLevel,
    timestamp
  } = req.body;

  if (!deviceId || !deploymentId || !imageUrl || !speciesDetections) {
    return res.status(422).json({ code: 'invalid', message: 'deviceId, deploymentId, imageUrl, and speciesDetections required' });
  }

  try {
    const record = await environmentalMonitoringService.recordCameraTrapData({
      deviceId,
      deploymentId,
      imageUrl,
      videoUrl,
      speciesDetections,
      animalCount,
      activityPattern,
      behaviorObserved,
      triggerType,
      batteryLevel,
      timestamp
    });
    res.status(201).json({ record, message: 'Camera trap record created' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Ecosystem Health
// ============================================

// GET /api/v3/measurements/ecosystem/health/:regionId - Ecosystem health index
router.get('/ecosystem/health/:regionId', async (req: Request, res: Response) => {
  const { regionId } = req.params;
  const { days } = req.query as any;

  try {
    const history = await environmentalMonitoringService.getEcosystemHealthHistory(regionId, parseInt(days) || 365);
    res.json({ regionId, healthHistory: history });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/ecosystem/health/:regionId/calculate - Calculate ecosystem health
router.post('/ecosystem/health/:regionId/calculate', async (req: Request, res: Response) => {
  const { regionId } = req.params;

  try {
    const healthIndex = await environmentalMonitoringService.calculateEcosystemHealth(regionId);
    res.status(201).json({ healthIndex, message: 'Ecosystem health calculated' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Environmental Alerts
// ============================================

// GET /api/v3/measurements/alerts - Get active alerts
router.get('/alerts', async (req: Request, res: Response) => {
  const { regionId, severity, category } = req.query as any;

  try {
    const alerts = await environmentalMonitoringService.getActiveAlerts({ regionId, severity, category });
    res.json({ alerts });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/alerts - Create new alert
router.post('/alerts', async (req: Request, res: Response) => {
  const {
    alertType,
    category,
    severity,
    title,
    description,
    regionId,
    affectedMetrics,
    thresholdExceeded,
    currentValue,
    thresholdValue
  } = req.body;

  if (!alertType || !category || !severity || !title) {
    return res.status(422).json({ code: 'invalid', message: 'alertType, category, severity, and title required' });
  }

  try {
    const alert = await environmentalMonitoringService.createAlert({
      alertType,
      category,
      severity,
      title,
      description,
      regionId,
      affectedMetrics,
      thresholdExceeded,
      currentValue,
      thresholdValue
    });
    res.status(201).json({ alert, message: 'Alert created' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// PUT /api/v3/measurements/alerts/:id/acknowledge - Acknowledge alert
router.put('/alerts/:id/acknowledge', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const alert = await environmentalMonitoringService.acknowledgeAlert(id, userId);
    if (!alert) {
      return res.status(404).json({ code: 'not_found' });
    }
    res.json({ alert, message: 'Alert acknowledged' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// PUT /api/v3/measurements/alerts/:id/resolve - Resolve alert
router.put('/alerts/:id/resolve', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { resolution } = req.body;

  try {
    const alert = await environmentalMonitoringService.resolveAlert(id, resolution);
    if (!alert) {
      return res.status(404).json({ code: 'not_found' });
    }
    res.json({ alert, message: 'Alert resolved' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Data Validation
// ============================================

// POST /api/v3/measurements/validate - Validate measurement data
router.post('/validate', async (req: Request, res: Response) => {
  const {
    dataSourceId,
    dataType,
    recordId,
    validationMethod,
    data,
    crossReferenceSources
  } = req.body;

  if (!dataSourceId || !dataType || !recordId || !validationMethod || !data) {
    return res.status(422).json({ code: 'invalid', message: 'All fields required' });
  }

  try {
    const result = await environmentalMonitoringService.validateData({
      dataSourceId,
      dataType,
      recordId,
      validationMethod,
      data,
      crossReferenceSources
    });
    res.status(201).json({ validation: result });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Predictive Models
// ============================================

// GET /api/v3/measurements/predictions/:modelType/:regionId - Get predictions
router.get('/predictions/:modelType/:regionId', async (req: Request, res: Response) => {
  const { modelType, regionId } = req.params;

  try {
    const prediction = await environmentalMonitoringService.getPrediction(modelType, regionId);
    res.json({ prediction });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// GET /api/v3/measurements/predictions/:modelType/:regionId/history - Prediction history
router.get('/predictions/:modelType/:regionId/history', async (req: Request, res: Response) => {
  const { modelType, regionId } = req.params;
  const { days } = req.query as any;

  try {
    const history = await environmentalMonitoringService.getModelPredictionsHistory(
      modelType,
      regionId,
      parseInt(days) || 365
    );
    res.json({ history });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/predictions - Save prediction
router.post('/predictions', async (req: Request, res: Response) => {
  const {
    modelType,
    regionId,
    predictionPeriodStart,
    predictionPeriodEnd,
    predictionValue,
    confidenceInterval,
    probabilityDistribution,
    contributingFactors,
    modelVersion
  } = req.body;

  if (!modelType || !regionId || !predictionPeriodStart || !predictionPeriodEnd || predictionValue === undefined) {
    return res.status(422).json({ code: 'invalid', message: 'Required fields missing' });
  }

  try {
    const prediction = await environmentalMonitoringService.savePrediction({
      modelType,
      regionId,
      predictionPeriodStart,
      predictionPeriodEnd,
      predictionValue,
      confidenceInterval,
      probabilityDistribution,
      contributingFactors,
      modelVersion
    });
    res.status(201).json({ prediction, message: 'Prediction saved' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Trends & Analytics
// ============================================

// GET /api/v3/measurements/trends/:regionId - Environmental trends
router.get('/trends/:regionId', async (req: Request, res: Response) => {
  const { regionId } = req.params;
  const { metrics, days } = req.query as any;

  const metricsList = metrics ? metrics.split(',') : ['carbon', 'biodiversity', 'soil'];

  try {
    const trends = await environmentalMonitoringService.getEnvironmentalTrends(
      regionId,
      metricsList,
      parseInt(days) || 365
    );
    res.json(trends);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// GET /api/v3/measurements/anomalies - Anomaly detection report
router.get('/anomalies', async (req: Request, res: Response) => {
  const { regionId, days, severity } = req.query as any;

  try {
    const report = await environmentalMonitoringService.getAnomalyDetectionReport({
      regionId,
      days: parseInt(days) || 30,
      severity
    });
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Reporting & Compliance
// ============================================

// POST /api/v3/measurements/reports/compliance - Generate compliance report
router.post('/reports/compliance', async (req: Request, res: Response) => {
  const {
    regionId,
    reportType,
    startDate,
    endDate,
    format
  } = req.body;

  if (!regionId || !reportType || !startDate || !endDate) {
    return res.status(422).json({ code: 'invalid', message: 'Required fields missing' });
  }

  try {
    const report = await environmentalMonitoringService.generateComplianceReport({
      regionId,
      reportType,
      startDate,
      endDate,
      format
    });
    res.status(201).json({ report });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// POST /api/v3/measurements/export/research - Export data for research
router.post('/export/research', async (req: Request, res: Response) => {
  const {
    regionId,
    dataTypes,
    startDate,
    endDate,
    format,
    sharingAgreement
  } = req.body;

  if (!regionId || !dataTypes || !startDate || !endDate || !format) {
    return res.status(422).json({ code: 'invalid', message: 'Required fields missing' });
  }

  try {
    const exportData = await environmentalMonitoringService.exportDataForResearch({
      regionId,
      dataTypes,
      startDate,
      endDate,
      format,
      sharingAgreement
    });
    res.status(201).json({ export: exportData });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// ============================================
// Legacy Compatibility Routes
// ============================================

// GET /api/v3/measurements/project/:projectId - Get measurements for project (legacy)
router.get('/project/:projectId', async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { page = 1, size = 50 } = req.query as any;
  const offset = (Number(page) - 1) * Number(size);

  try {
    const result = await query(`
      SELECT * FROM measurement_data
      WHERE project_id = $1
      ORDER BY measurement_date DESC
      LIMIT $2 OFFSET $3
    `, [projectId, Number(size), offset]);

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

// POST /api/v3/measurements - Create measurement (legacy)
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
    const result = await query(`
      INSERT INTO measurement_data (
        project_id, measurement_date, satellite_source, co2_level, soil_carbon_ppm,
        ndvi_index, biodiversity_score, temperature_celsius, precipitation_mm,
        confidence_level, location, raw_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
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
      location ? `POINT(${location.longitude} ${location.latitude})` : null,
      rawData ? JSON.stringify(rawData) : null
    ]);

    res.status(201).json({ measurement: result.rows[0], message: 'Measurement created' });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
