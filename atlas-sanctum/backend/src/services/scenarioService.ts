import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface Scenario {
  id: string;
  organization_id: string;
  region_id: string;
  name: string;
  intervention_type: string;
  baseline_date: Date;
  budget_amount: number | null;
  currency: string | null;
  duration_months: number | null;
  assumptions_json: any;
  status: 'draft' | 'running' | 'completed' | 'approved' | 'archived';
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ScenarioRun {
  id: string;
  scenario_id: string;
  model_version_id: string | null;
  status: 'queued' | 'running' | 'completed' | 'failed';
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
}

export interface ScenarioResult {
  id: number;
  scenario_run_id: string;
  metric_code: string;
  baseline_value: number | null;
  projected_value: number | null;
  delta_value: number | null;
  confidence: number | null;
  notes: string | null;
}

export class ScenarioService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Scenarios
  async createScenario(data: {
    organization_id: string;
    region_id: string;
    name: string;
    intervention_type: string;
    baseline_date: Date;
    budget_amount?: number;
    currency?: string;
    duration_months?: number;
    assumptions_json?: any;
    created_by?: string;
  }): Promise<Scenario> {
    const id = `scn_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO scenarios (id, organization_id, region_id, name, intervention_type, baseline_date, budget_amount, currency, duration_months, assumptions_json, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [id, data.organization_id, data.region_id, data.name, data.intervention_type,
       data.baseline_date, data.budget_amount || null, data.currency || null,
       data.duration_months || null, data.assumptions_json || {}, data.created_by || null]
    );

    return result.rows[0];
  }

  async getScenario(id: string): Promise<Scenario | null> {
    const result = await this.pool.query(
      `SELECT * FROM scenarios WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listScenarios(filters?: {
    organization_id?: string;
    region_id?: string;
    status?: string;
    intervention_type?: string;
  }): Promise<Scenario[]> {
    let query = `SELECT * FROM scenarios WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.organization_id) {
      query += ` AND organization_id = $${paramIndex++}`;
      params.push(filters.organization_id);
    }
    if (filters?.region_id) {
      query += ` AND region_id = $${paramIndex++}`;
      params.push(filters.region_id);
    }
    if (filters?.status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }
    if (filters?.intervention_type) {
      query += ` AND intervention_type = $${paramIndex++}`;
      params.push(filters.intervention_type);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateScenario(id: string, updates: Partial<Scenario>): Promise<Scenario> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.intervention_type) {
      fields.push(`intervention_type = $${paramIndex++}`);
      values.push(updates.intervention_type);
    }
    if (updates.baseline_date) {
      fields.push(`baseline_date = $${paramIndex++}`);
      values.push(updates.baseline_date);
    }
    if (updates.budget_amount !== undefined) {
      fields.push(`budget_amount = $${paramIndex++}`);
      values.push(updates.budget_amount);
    }
    if (updates.currency !== undefined) {
      fields.push(`currency = $${paramIndex++}`);
      values.push(updates.currency);
    }
    if (updates.duration_months !== undefined) {
      fields.push(`duration_months = $${paramIndex++}`);
      values.push(updates.duration_months);
    }
    if (updates.assumptions_json !== undefined) {
      fields.push(`assumptions_json = $${paramIndex++}`);
      values.push(updates.assumptions_json);
    }
    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.pool.query(
      `UPDATE scenarios SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteScenario(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM scenarios WHERE id = $1`,
      [id]
    );
  }

  async approveScenario(id: string): Promise<Scenario> {
    return this.updateScenario(id, { status: 'approved' });
  }

  // Scenario runs
  async createScenarioRun(data: {
    scenario_id: string;
    model_version_id?: string;
  }): Promise<ScenarioRun> {
    const id = `srun_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO scenario_runs (id, scenario_id, model_version_id, status)
       VALUES ($1, $2, $3, 'queued')
       RETURNING *`,
      [id, data.scenario_id, data.model_version_id || null]
    );

    return result.rows[0];
  }

  async getScenarioRun(id: string): Promise<ScenarioRun | null> {
    const result = await this.pool.query(
      `SELECT * FROM scenario_runs WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async updateScenarioRun(id: string, updates: Partial<ScenarioRun>): Promise<ScenarioRun> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.started_at) {
      fields.push(`started_at = $${paramIndex++}`);
      values.push(updates.started_at);
    }
    if (updates.completed_at) {
      fields.push(`completed_at = $${paramIndex++}`);
      values.push(updates.completed_at);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE scenario_runs SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Scenario results
  async createScenarioResult(data: {
    scenario_run_id: string;
    metric_code: string;
    baseline_value?: number;
    projected_value?: number;
    delta_value?: number;
    confidence?: number;
    notes?: string;
  }): Promise<ScenarioResult> {
    const result = await this.pool.query(
      `INSERT INTO scenario_results (scenario_run_id, metric_code, baseline_value, projected_value, delta_value, confidence, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.scenario_run_id, data.metric_code, data.baseline_value || null,
       data.projected_value || null, data.delta_value || null, data.confidence || null, data.notes || null]
    );

    return result.rows[0];
  }

  async getScenarioResults(scenarioRunId: string): Promise<ScenarioResult[]> {
    const result = await this.pool.query(
      `SELECT * FROM scenario_results WHERE scenario_run_id = $1 ORDER BY metric_code`,
      [scenarioRunId]
    );

    return result.rows;
  }

  async getScenarioWithResults(scenarioId: string): Promise<any> {
    const scenario = await this.getScenario(scenarioId);
    if (!scenario) return null;

    // Get latest run
    const runsResult = await this.pool.query(
      `SELECT * FROM scenario_runs WHERE scenario_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [scenarioId]
    );

    const latestRun = runsResult.rows[0];
    let results: ScenarioResult[] = [];

    if (latestRun) {
      results = await this.getScenarioResults(latestRun.id);
    }

    return {
      ...scenario,
      latest_run: latestRun || null,
      results
    };
  }

  // Run simulation (simplified)
  async runSimulation(scenarioId: string, modelVersionId?: string): Promise<ScenarioRun> {
    const scenario = await this.getScenario(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    // Create run
    const run = await this.createScenarioRun({
      scenario_id: scenarioId,
      model_version_id: modelVersionId
    });

    // Update scenario to running
    await this.updateScenario(scenarioId, { status: 'running' });

    // Update run to running
    await this.updateScenarioRun(run.id, {
      status: 'running',
      started_at: new Date()
    });

    // Simulate intervention effects (simplified)
    const results = await this.simulateInterventionEffects(scenario);

    // Create results
    for (const result of results) {
      await this.createScenarioResult({
        scenario_run_id: run.id,
        ...result
      });
    }

    // Update run to completed
    const completedRun = await this.updateScenarioRun(run.id, {
      status: 'completed',
      completed_at: new Date()
    });

    // Update scenario to completed
    await this.updateScenario(scenarioId, { status: 'completed' });

    return completedRun;
  }

  private async simulateInterventionEffects(scenario: Scenario): Promise<any[]> {
    // Simplified simulation - in production this would use ML models
    const results: any[] = [];

    // Get baseline fragility score for the region
    const baselineResult = await this.pool.query(
      `SELECT * FROM latest_fragility_scores WHERE region_id = $1`,
      [scenario.region_id]
    );

    const baselineFragility = baselineResult.rows[0]?.score || 0.5;

    // Simulate effects based on intervention type
    switch (scenario.intervention_type) {
      case 'clinic_staff_expansion':
        const staffIncrease = scenario.assumptions_json?.staff_increase_pct || 20;
        const fragilityReduction = (staffIncrease / 100) * 0.15;
        
        results.push({
          metric_code: 'fragility_score',
          baseline_value: baselineFragility,
          projected_value: Math.max(0, baselineFragility - fragilityReduction),
          delta_value: -fragilityReduction,
          confidence: 0.72,
          notes: 'Institutional hiring delays reduce effect size. Impact strongest under stable funding continuity.'
        });

        results.push({
          metric_code: 'clinic_staff_ratio',
          baseline_value: 0.82,
          projected_value: 0.82 + (staffIncrease / 100),
          delta_value: staffIncrease / 100,
          confidence: 0.85,
          notes: 'Assumes training completion rate of 80%.'
        });
        break;

      case 'water_access_improvement':
        const waterBudget = scenario.budget_amount || 100000;
        const waterImpact = (waterBudget / 100000) * 0.12;
        
        results.push({
          metric_code: 'fragility_score',
          baseline_value: baselineFragility,
          projected_value: Math.max(0, baselineFragility - waterImpact),
          delta_value: -waterImpact,
          confidence: 0.68,
          notes: 'Impact depends on infrastructure maintenance capacity.'
        });

        results.push({
          metric_code: 'water_access_rate',
          baseline_value: 61.2,
          projected_value: 61.2 + (waterBudget / 10000),
          delta_value: waterBudget / 10000,
          confidence: 0.75,
          notes: 'Assumes successful implementation in target areas.'
        });
        break;

      case 'restoration_project_funding':
        const restorationBudget = scenario.budget_amount || 200000;
        const ecologicalImpact = (restorationBudget / 200000) * 0.18;
        
        results.push({
          metric_code: 'fragility_score',
          baseline_value: baselineFragility,
          projected_value: Math.max(0, baselineFragility - ecologicalImpact),
          delta_value: -ecologicalImpact,
          confidence: 0.65,
          notes: 'Ecological restoration shows gradual improvement over project duration.'
        });

        results.push({
          metric_code: 'hectares_restored',
          baseline_value: 0,
          projected_value: restorationBudget / 100,
          delta_value: restorationBudget / 100,
          confidence: 0.70,
          notes: 'Target assumes successful seedling establishment and protection.'
        });
        break;

      default:
        // Generic intervention
        const genericImpact = 0.08;
        results.push({
          metric_code: 'fragility_score',
          baseline_value: baselineFragility,
          projected_value: Math.max(0, baselineFragility - genericImpact),
          delta_value: -genericImpact,
          confidence: 0.60,
          notes: 'Generic intervention impact estimate.'
        });
    }

    return results;
  }

  // Compare scenarios
  async compareScenarios(scenarioIds: string[]): Promise<any[]> {
    const comparisons = [];

    for (const scenarioId of scenarioIds) {
      const scenarioWithResults = await this.getScenarioWithResults(scenarioId);
      if (scenarioWithResults) {
        comparisons.push(scenarioWithResults);
      }
    }

    return comparisons;
  }
}
