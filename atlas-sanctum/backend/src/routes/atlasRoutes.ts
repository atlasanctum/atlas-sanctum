import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { AuthService } from '../services/authService';
import { OrganizationService } from '../services/organizationService';
import { IngestionService } from '../services/ingestionService';
import { IndicatorService } from '../services/indicatorService';
import { RegionService } from '../services/regionService';
import { FragilityService } from '../services/fragilityService';
import { ScenarioService } from '../services/scenarioService';
import { MrvService } from '../services/mrvService';
import { AlertService } from '../services/alertService';
import { ActionService } from '../services/actionService';
import { AuditService } from '../services/auditService';

export function createAtlasRoutes(pool: Pool): Router {
  const router = Router();

  // Initialize services
  const authService = new AuthService(pool);
  const orgService = new OrganizationService(pool);
  const ingestionService = new IngestionService(pool);
  const indicatorService = new IndicatorService(pool);
  const regionService = new RegionService(pool);
  const fragilityService = new FragilityService(pool);
  const scenarioService = new ScenarioService(pool);
  const mrvService = new MrvService(pool);
  const alertService = new AlertService(pool);
  const actionService = new ActionService(pool);
  const auditService = new AuditService(pool);

  // Auth middleware
  const authenticate = async (req: Request, res: Response, next: Function) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      const decoded = authService.verifyToken(token);
      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // ============================================================
  // Auth & Organizations
  // ============================================================

  router.post('/v1/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const tokens = await authService.login(email, password);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed' });
    }
  });

  router.post('/v1/auth/register', async (req: Request, res: Response) => {
    try {
      const tokens = await authService.register(req.body);
      res.status(201).json(tokens);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Registration failed' });
    }
  });

  router.post('/v1/auth/refresh', async (req: Request, res: Response) => {
    try {
      const { refresh_token } = req.body;
      const tokens = await authService.refreshToken(refresh_token);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'Token refresh failed' });
    }
  });

  router.get('/v1/me', authenticate, async (req: Request, res: Response) => {
    try {
      const user = await authService.getUserById((req as any).user.user_id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  router.get('/v1/organizations/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const org = await orgService.getById(req.params.id);
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      res.json(org);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get organization' });
    }
  });

  // ============================================================
  // Data Sources & Ingestion
  // ============================================================

  router.post('/v1/data-sources', authenticate, async (req: Request, res: Response) => {
    try {
      const dataSource = await ingestionService.createDataSource({
        ...req.body,
        organization_id: (req as any).user.organization_id,
        created_by: (req as any).user.user_id
      });
      res.status(201).json(dataSource);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create data source' });
    }
  });

  router.get('/v1/data-sources', authenticate, async (req: Request, res: Response) => {
    try {
      const dataSources = await ingestionService.listDataSources({
        organization_id: (req as any).user.organization_id
      });
      res.json({ items: dataSources });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list data sources' });
    }
  });

  router.get('/v1/data-sources/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const dataSource = await ingestionService.getDataSource(req.params.id);
      if (!dataSource) {
        return res.status(404).json({ error: 'Data source not found' });
      }
      res.json(dataSource);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get data source' });
    }
  });

  router.post('/v1/data-sources/:id/uploads', authenticate, async (req: Request, res: Response) => {
    try {
      const job = await ingestionService.createIngestionJob({
        data_source_id: req.params.id,
        file_name: req.body.file_name
      });
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create upload job' });
    }
  });

  router.get('/v1/ingestion-jobs/:job_id', authenticate, async (req: Request, res: Response) => {
    try {
      const job = await ingestionService.getIngestionJob(req.params.job_id);
      if (!job) {
        return res.status(404).json({ error: 'Ingestion job not found' });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get ingestion job' });
    }
  });

  router.post('/v1/observations/bulk', authenticate, async (req: Request, res: Response) => {
    try {
      const count = await indicatorService.bulkCreateObservations(req.body.observations);
      res.json({ inserted: count });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to insert observations' });
    }
  });

  // ============================================================
  // Regions & Geospatial
  // ============================================================

  router.get('/v1/regions', authenticate, async (req: Request, res: Response) => {
    try {
      const regions = await regionService.listRegions({
        level: req.query.level as string,
        country_code: req.query.country_code as string,
        parent_id: req.query.parent_id as string
      });
      res.json({ items: regions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list regions' });
    }
  });

  router.get('/v1/regions/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const region = await regionService.getRegionWithIndicators(req.params.id);
      if (!region) {
        return res.status(404).json({ error: 'Region not found' });
      }
      res.json(region);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get region' });
    }
  });

  // ============================================================
  // Indicators
  // ============================================================

  router.post('/v1/indicators', authenticate, async (req: Request, res: Response) => {
    try {
      const indicator = await indicatorService.createIndicator(req.body);
      res.status(201).json(indicator);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create indicator' });
    }
  });

  router.get('/v1/indicators', authenticate, async (req: Request, res: Response) => {
    try {
      const indicators = await indicatorService.listIndicators({
        category: req.query.category as string
      });
      res.json({ items: indicators });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list indicators' });
    }
  });

  router.get('/v1/regions/:id/indicators', authenticate, async (req: Request, res: Response) => {
    try {
      const indicators = await indicatorService.getLatestRegionIndicatorValues(req.params.id);
      res.json({ region_id: req.params.id, items: indicators });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get region indicators' });
    }
  });

  // ============================================================
  // Fragility Engine
  // ============================================================

  router.post('/v1/fragility/runs', authenticate, async (req: Request, res: Response) => {
    try {
      const run = await fragilityService.runFragilityAnalysis(
        (req as any).user.organization_id,
        req.body.scope.region_ids,
        req.body.model_version,
        (req as any).user.user_id
      );
      res.status(201).json(run);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to start fragility run' });
    }
  });

  router.get('/v1/fragility/runs/:run_id', authenticate, async (req: Request, res: Response) => {
    try {
      const run = await fragilityService.getFragilityRun(req.params.run_id);
      if (!run) {
        return res.status(404).json({ error: 'Fragility run not found' });
      }
      res.json(run);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get fragility run' });
    }
  });

  router.get('/v1/fragility/scores', authenticate, async (req: Request, res: Response) => {
    try {
      const scores = await fragilityService.listFragilityScores({
        region_id: req.query.region_id as string,
        level: req.query.level as string,
        min_score: req.query.min_score ? parseFloat(req.query.min_score as string) : undefined,
        sort: req.query.sort as string
      });
      res.json({ items: scores });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list fragility scores' });
    }
  });

  router.get('/v1/fragility/regions/:region_id/drivers', authenticate, async (req: Request, res: Response) => {
    try {
      const drivers = await fragilityService.getRegionTopDrivers(req.params.region_id);
      res.json({ region_id: req.params.region_id, top_drivers: drivers });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get fragility drivers' });
    }
  });

  router.post('/v1/alerts/rules', authenticate, async (req: Request, res: Response) => {
    try {
      const rule = await alertService.createAlertRule({
        ...req.body,
        organization_id: (req as any).user.organization_id,
        created_by: (req as any).user.user_id
      });
      res.status(201).json(rule);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create alert rule' });
    }
  });

  // ============================================================
  // Policy Sandbox
  // ============================================================

  router.post('/v1/scenarios', authenticate, async (req: Request, res: Response) => {
    try {
      const scenario = await scenarioService.createScenario({
        ...req.body,
        organization_id: (req as any).user.organization_id,
        created_by: (req as any).user.user_id
      });
      res.status(201).json(scenario);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create scenario' });
    }
  });

  router.get('/v1/scenarios', authenticate, async (req: Request, res: Response) => {
    try {
      const scenarios = await scenarioService.listScenarios({
        organization_id: (req as any).user.organization_id,
        region_id: req.query.region_id as string,
        status: req.query.status as string
      });
      res.json({ items: scenarios });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list scenarios' });
    }
  });

  router.get('/v1/scenarios/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const scenario = await scenarioService.getScenarioWithResults(req.params.id);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get scenario' });
    }
  });

  router.post('/v1/scenarios/:id/run', authenticate, async (req: Request, res: Response) => {
    try {
      const run = await scenarioService.runSimulation(req.params.id);
      res.status(201).json(run);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to run scenario' });
    }
  });

  router.get('/v1/scenarios/:id/results', authenticate, async (req: Request, res: Response) => {
    try {
      const scenario = await scenarioService.getScenarioWithResults(req.params.id);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get scenario results' });
    }
  });

  router.post('/v1/scenarios/:id/approve', authenticate, async (req: Request, res: Response) => {
    try {
      const scenario = await scenarioService.approveScenario(req.params.id);
      res.json(scenario);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to approve scenario' });
    }
  });

  // ============================================================
  // Restoration MRV
  // ============================================================

  router.post('/v1/projects', authenticate, async (req: Request, res: Response) => {
    try {
      const project = await mrvService.createProject({
        ...req.body,
        organization_id: (req as any).user.organization_id,
        created_by: (req as any).user.user_id
      });
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create project' });
    }
  });

  router.get('/v1/projects', authenticate, async (req: Request, res: Response) => {
    try {
      const projects = await mrvService.listProjects({
        organization_id: (req as any).user.organization_id,
        region_id: req.query.region_id as string,
        status: req.query.status as string
      });
      res.json({ items: projects });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list projects' });
    }
  });

  router.get('/v1/projects/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const project = await mrvService.getProjectWithDetails(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get project' });
    }
  });

  router.post('/v1/projects/:id/sites', authenticate, async (req: Request, res: Response) => {
    try {
      const site = await mrvService.createProjectSite({
        ...req.body,
        project_id: req.params.id
      });
      res.status(201).json(site);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create project site' });
    }
  });

  router.post('/v1/projects/:id/evidence', authenticate, async (req: Request, res: Response) => {
    try {
      const evidence = await mrvService.createEvidence({
        ...req.body,
        project_id: req.params.id,
        submitted_by: (req as any).user.user_id
      });
      res.status(201).json(evidence);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create evidence' });
    }
  });

  router.post('/v1/evidence/:id/files', authenticate, async (req: Request, res: Response) => {
    try {
      const file = await mrvService.addEvidenceFile({
        ...req.body,
        evidence_id: req.params.id
      });
      res.status(201).json(file);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to add evidence file' });
    }
  });

  router.post('/v1/projects/:id/verify', authenticate, async (req: Request, res: Response) => {
    try {
      const verification = await mrvService.verifyProject(
        req.params.id,
        req.body.verification_status,
        req.body.summary,
        (req as any).user.user_id
      );
      res.status(201).json(verification);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to verify project' });
    }
  });

  // ============================================================
  // Command Center & Actions
  // ============================================================

  router.get('/v1/dashboard/overview', authenticate, async (req: Request, res: Response) => {
    try {
      const orgId = (req as any).user.organization_id;
      
      const [hotspots, activeAlerts, projects, actions] = await Promise.all([
        fragilityService.listFragilityScores({ min_score: 0.5, limit: 100 }),
        alertService.getActiveAlertsCount(orgId),
        mrvService.listProjects({ organization_id: orgId }),
        actionService.getActionsSummary(orgId)
      ]);

      const openProjects = projects.filter(p => p.status === 'active').length;
      const verifiedProjects = projects.filter(p => p.status === 'verified').length;

      res.json({
        hotspots: hotspots.length,
        active_alerts: activeAlerts,
        open_projects: openProjects,
        verified_projects: verifiedProjects,
        pending_approvals: parseInt(actions.open) || 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get dashboard overview' });
    }
  });

  router.get('/v1/dashboard/hotspots', authenticate, async (req: Request, res: Response) => {
    try {
      const hotspots = await fragilityService.listFragilityScores({
        min_score: 0.5,
        sort: 'score_desc',
        limit: 20
      });
      res.json({ items: hotspots });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get hotspots' });
    }
  });

  router.post('/v1/actions', authenticate, async (req: Request, res: Response) => {
    try {
      const action = await actionService.createAction({
        ...req.body,
        organization_id: (req as any).user.organization_id,
        created_by: (req as any).user.user_id
      });
      res.status(201).json(action);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create action' });
    }
  });

  router.get('/v1/actions', authenticate, async (req: Request, res: Response) => {
    try {
      const actions = await actionService.listActions({
        organization_id: (req as any).user.organization_id,
        status: req.query.status as string,
        type: req.query.type as string
      });
      res.json({ items: actions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list actions' });
    }
  });

  router.patch('/v1/actions/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const action = await actionService.updateAction(req.params.id, req.body);
      res.json(action);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update action' });
    }
  });

  return router;
}
