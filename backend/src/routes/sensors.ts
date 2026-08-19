/**
 * Atlas Sanctum — IoT Sensor Stream API
 * REST interface over GlobalSensorFabric + InfluxDB
 *
 * GET  /api/v3/sensors/health          — fabric health report
 * GET  /api/v3/sensors                 — list registered sensors
 * POST /api/v3/sensors/ingest          — ingest a reading (field agents / test)
 * GET  /api/v3/sensors/:sensorId/readings — InfluxDB time-series query
 * GET  /api/v3/sensors/aggregate/:bioregion — aggregated metrics by bioregion
 * GET  /api/v3/sensors/alerts          — active threshold alerts
 * PUT  /api/v3/sensors/alerts/:alertId/acknowledge — acknowledge alert
 * GET  /api/v3/sensors/latest/:type    — latest reading per sensor for a metric type
 */

import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { AtlasSensorFabric } from '../../../services/ai/sensor-fabric/SensorFabric';
import {
  querySensorReadings,
  queryLatestBySensor,
} from '../../../services/analytics/influxdb/InfluxDBClient';
import type { SensorReading, Measurement } from '../../../services/ai/sensor-fabric/SensorFabric';

const router = express.Router();

// GET /health — fabric-wide health report
router.get('/health', (_req: Request, res: Response) => {
  res.json(AtlasSensorFabric.health());
});

// GET / — all registered sensors
router.get('/', (_req: Request, res: Response) => {
  const sensors = AtlasSensorFabric.registry.all();
  res.json({ sensors, total: sensors.length });
});

// POST /ingest — accept a reading from field agents or test harness
router.post('/ingest', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { sensorId, type, timestamp, location, measurements, qualityScore, anomalyFlag } = req.body;

  if (!sensorId || !type || !measurements) {
    return res.status(422).json({ code: 'invalid', message: 'sensorId, type, and measurements required' });
  }

  const reading: SensorReading = {
    readingId:    `api-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sensorId,
    type,
    timestamp:    timestamp ?? Date.now(),
    location:     location ?? { lat: 0, lng: 0 },
    measurements: measurements as Measurement[],
    qualityScore: qualityScore ?? 0.9,
    anomalyFlag:  anomalyFlag ?? false,
  };

  AtlasSensorFabric.ingest(reading);
  res.status(201).json({ message: 'Reading ingested', readingId: reading.readingId });
});

// GET /:sensorId/readings — InfluxDB time-series query
router.get('/:sensorId/readings', async (req: Request, res: Response) => {
  const { sensorId } = req.params;
  const { type, from = '-24h', to, limit } = req.query as Record<string, string>;

  try {
    const readings = await querySensorReadings({
      sensorId,
      type,
      from,
      to,
      limit: limit ? parseInt(limit) : 1000,
    });
    res.json({ sensorId, readings, count: readings.length });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

// GET /aggregate/:bioregion — aggregated metrics for a bioregion
router.get('/aggregate/:bioregion', (req: Request, res: Response) => {
  const { bioregion } = req.params;
  const windowMs = parseInt((req.query.windowMs as string) ?? '86400000');
  const result = AtlasSensorFabric.aggregator.aggregate(bioregion, windowMs);
  res.json(result);
});

// GET /alerts — active (unacknowledged) threshold alerts
router.get('/alerts', (_req: Request, res: Response) => {
  const alerts = AtlasSensorFabric.stream.getAlerts(false);
  res.json({ alerts, count: alerts.length });
});

// PUT /alerts/:alertId/acknowledge
router.put('/alerts/:alertId/acknowledge', authenticate, (req: AuthenticatedRequest, res: Response) => {
  AtlasSensorFabric.stream.acknowledge(req.params.alertId);
  res.json({ message: 'Alert acknowledged' });
});

// GET /latest/:type — latest reading per sensor for a given metric type (from InfluxDB)
router.get('/latest/:type', async (req: Request, res: Response) => {
  try {
    const latest = await queryLatestBySensor(req.params.type);
    res.json({ type: req.params.type, readings: latest });
  } catch (err: any) {
    res.status(500).json({ code: 'server_error', message: err.message });
  }
});

export default router;
