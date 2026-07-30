// Analytics API Routes
import { Router, Request, Response } from 'express';
import analyticsService from '../services/analytics';

const router = Router();

// Dashboard Templates
router.get('/templates', (req: Request, res: Response) => {
  const templates = analyticsService.getTemplates();
  res.json({ success: true, data: templates });
});

router.get('/templates/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const template = analyticsService.getTemplate(id);
  if (!template) {
    return res.status(404).json({ success: false, error: 'Template not found' });
  }
  res.json({ success: true, data: template });
});

router.post('/templates', (req: Request, res: Response) => {
  const template = analyticsService.createTemplate(req.body);
  res.status(201).json({ success: true, data: template });
});

router.put('/templates/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const template = analyticsService.updateTemplate(id, req.body);
  if (!template) {
    return res.status(404).json({ success: false, error: 'Template not found' });
  }
  res.json({ success: true, data: template });
});

router.delete('/templates/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = analyticsService.deleteTemplate(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Template not found' });
  }
  res.json({ success: true, message: 'Template deleted' });
});

// Reports
router.get('/reports', (req: Request, res: Response) => {
  const reports = analyticsService.getReports();
  res.json({ success: true, data: reports });
});

router.get('/reports/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const report = analyticsService.getReport(id);
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.json({ success: true, data: report });
});

router.post('/reports', (req: Request, res: Response) => {
  const report = analyticsService.createReport(req.body);
  res.status(201).json({ success: true, data: report });
});

router.put('/reports/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const report = analyticsService.updateReport(id, req.body);
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.json({ success: true, data: report });
});

router.delete('/reports/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = analyticsService.deleteReport(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.json({ success: true, message: 'Report deleted' });
});

// Schedule Report
router.post('/reports/:id/schedule', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const report = analyticsService.scheduleReport(id, req.body);
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.json({ success: true, data: report });
});

// Data Aggregation
router.get('/aggregate', async (req: Request, res: Response) => {
  const { dataSource, groupBy } = req.query;
  const filters = req.query.filters ? JSON.parse(req.query.filters as string) : undefined;
  const dateRange = req.query.dateRange ? JSON.parse(req.query.dateRange as string) : undefined;

  const data = await analyticsService.aggregateData(
    dataSource as string,
    groupBy as string,
    filters,
    dateRange
  );
  res.json({ success: true, data });
});

// Time Series Data
router.get('/timeseries', async (req: Request, res: Response) => {
  const { metric, startDate, endDate, interval } = req.query;
  const data = await analyticsService.getTimeSeriesData(
    metric as string,
    startDate as string,
    endDate as string,
    interval as 'minute' | 'hour' | 'day' | 'week' | 'month'
  );
  res.json({ success: true, data });
});

// Performance Metrics
router.get('/metrics', (req: Request, res: Response) => {
  const metrics = analyticsService.getPerformanceMetrics();
  res.json({ success: true, data: metrics });
});

router.get('/metrics/:name', (req: Request, res: Response) => {
  const name = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
  const metric = analyticsService.getMetric(name);
  if (!metric) {
    return res.status(404).json({ success: false, error: 'Metric not found' });
  }
  res.json({ success: true, data: metric });
});

// Export Reports
router.post('/export', async (req: Request, res: Response) => {
  const { reportId, format, filters } = req.body;
  const result = await analyticsService.generateExport(reportId, format, filters);
  res.json({ success: true, data: result });
});

// Widgets
router.get('/widgets', (req: Request, res: Response) => {
  const widgets = analyticsService.getWidgets();
  res.json({ success: true, data: widgets });
});

router.get('/widgets/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const widget = analyticsService.getWidget(id);
  if (!widget) {
    return res.status(404).json({ success: false, error: 'Widget not found' });
  }
  res.json({ success: true, data: widget });
});

router.post('/widgets', (req: Request, res: Response) => {
  const widget = analyticsService.createWidget(req.body);
  res.status(201).json({ success: true, data: widget });
});

router.put('/widgets/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const widget = analyticsService.updateWidget(id, req.body);
  if (!widget) {
    return res.status(404).json({ success: false, error: 'Widget not found' });
  }
  res.json({ success: true, data: widget });
});

router.delete('/widgets/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = analyticsService.deleteWidget(id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Widget not found' });
  }
  res.json({ success: true, message: 'Widget deleted' });
});

export default router;
