import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface ModelVersion {
  id: string;
  model_name: string;
  version: string;
  model_type: 'fragility' | 'forecast' | 'simulation' | 'anomaly' | 'custom';
  status: 'draft' | 'approved' | 'archived';
  config_json: any;
  created_by: string | null;
  created_at: Date;
}

export interface FragilityRun {
  id: string;
  organization_id: string;
  model_version_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  scope_json: any;
  started_by: string | null;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
}

export interface FragilityScore {
  id: number;
  run_id: string;
  region_id: string;
  score: number;
  economic_score: number | null;
  ecological_score: number | null;
  institutional_score: number | null;
  human_score: number | null;
  risk_band: 'low' | 'moderate' | 'high' | 'critical';
  computed_at: Date;
}

export interface FragilityDriver {
  id: number;
  fragility_score_id: number;
  indicator_id: string | null;
  driver_label: string | null;
  impact: number;
  direction: 'positive' | 'negative' | 'neutral';
}

export class FragilityService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Model versions
  async createModelVersion(data: {
    model_name: string;
    version: string;
    model_type: ModelVersion['model_type'];
    config_json: any;
    created_by?: string;
  }): Promise<ModelVersion> {
    const id = `mver_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO model_versions (id, model_name, version, model_type, status, config_json, created_by)
       VALUES ($1, $2, $3, $4, 'draft', $5, $6)
       RETURNING *`,
      [id, data.model_name, data.version, data.model_type, data.config_json, data.created_by || null]
    );

    return result.rows[0];
  }

  async getModelVersion(id: string): Promise<ModelVersion | null> {
    const result = await this.pool.query(
      `SELECT * FROM model_versions WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listModelVersions(filters?: {
    model_type?: string;
    status?: string;
  }): Promise<ModelVersion[]> {
    let query = `SELECT * FROM model_versions WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.model_type) {
      query += ` AND model_type = $${paramIndex++}`;
      params.push(filters.model_type);
    }
    if (filters?.status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async approveModelVersion(id: string): Promise<ModelVersion> {
    const result = await this.pool.query(
      `UPDATE model_versions SET status = 'approved' WHERE id = $1 RETURNING *`,
      [id]
    );

    return result.rows[0];
  }

  // Fragility runs
  async createFragilityRun(data: {
    organization_id: string;
    model_version_id: string;
    scope_json: any;
    started_by?: string;
  }): Promise<FragilityRun> {
    const id = `frun_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO fragility_runs (id, organization_id, model_version_id, status, scope_json, started_by)
       VALUES ($1, $2, $3, 'queued', $4, $5)
       RETURNING *`,
      [id, data.organization_id, data.model_version_id, data.scope_json, data.started_by || null]
    );

    return result.rows[0];
  }

  async getFragilityRun(id: string): Promise<FragilityRun | null> {
    const result = await this.pool.query(
      `SELECT * FROM fragility_runs WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async updateFragilityRun(id: string, updates: Partial<FragilityRun>): Promise<FragilityRun> {
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
      `UPDATE fragility_runs SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async listFragilityRuns(filters?: {
    organization_id?: string;
    status?: string;
  }): Promise<FragilityRun[]> {
    let query = `SELECT * FROM fragility_runs WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.organization_id) {
      query += ` AND organization_id = $${paramIndex++}`;
      params.push(filters.organization_id);
    }
    if (filters?.status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Fragility scores
  async createFragilityScore(data: {
    run_id: string;
    region_id: string;
    score: number;
    economic_score?: number;
    ecological_score?: number;
    institutional_score?: number;
    human_score?: number;
    risk_band: FragilityScore['risk_band'];
  }): Promise<FragilityScore> {
    const result = await this.pool.query(
      `INSERT INTO fragility_scores (run_id, region_id, score, economic_score, ecological_score, institutional_score, human_score, risk_band)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [data.run_id, data.region_id, data.score, data.economic_score || null, 
       data.ecological_score || null, data.institutional_score || null, 
       data.human_score || null, data.risk_band]
    );

    return result.rows[0];
  }

  async getFragilityScore(id: number): Promise<FragilityScore | null> {
    const result = await this.pool.query(
      `SELECT * FROM fragility_scores WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async getLatestFragilityScore(regionId: string): Promise<FragilityScore | null> {
    const result = await this.pool.query(
      `SELECT * FROM latest_fragility_scores WHERE region_id = $1`,
      [regionId]
    );

    return result.rows[0] || null;
  }

  async listFragilityScores(filters?: {
    region_id?: string;
    level?: string;
    min_score?: number;
    max_score?: number;
    risk_band?: string;
    sort?: string;
    limit?: number;
  }): Promise<FragilityScore[]> {
    let query = `SELECT fs.*, r.name as region_name, r.level as region_level
                 FROM fragility_scores fs
                 JOIN regions r ON r.id = fs.region_id
                 WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.region_id) {
      query += ` AND fs.region_id = $${paramIndex++}`;
      params.push(filters.region_id);
    }
    if (filters?.level) {
      query += ` AND r.level = $${paramIndex++}`;
      params.push(filters.level);
    }
    if (filters?.min_score !== undefined) {
      query += ` AND fs.score >= $${paramIndex++}`;
      params.push(filters.min_score);
    }
    if (filters?.max_score !== undefined) {
      query += ` AND fs.score <= $${paramIndex++}`;
      params.push(filters.max_score);
    }
    if (filters?.risk_band) {
      query += ` AND fs.risk_band = $${paramIndex++}`;
      params.push(filters.risk_band);
    }

    // Sort
    if (filters?.sort === 'score_asc') {
      query += ` ORDER BY fs.score ASC`;
    } else if (filters?.sort === 'score_desc') {
      query += ` ORDER BY fs.score DESC`;
    } else {
      query += ` ORDER BY fs.computed_at DESC`;
    }

    if (filters?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(filters.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  // Fragility drivers
  async createFragilityDriver(data: {
    fragility_score_id: number;
    indicator_id?: string;
    driver_label?: string;
    impact: number;
    direction: FragilityDriver['direction'];
  }): Promise<FragilityDriver> {
    const result = await this.pool.query(
      `INSERT INTO fragility_drivers (fragility_score_id, indicator_id, driver_label, impact, direction)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.fragility_score_id, data.indicator_id || null, data.driver_label || null, 
       data.impact, data.direction]
    );

    return result.rows[0];
  }

  async getFragilityDrivers(fragilityScoreId: number): Promise<FragilityDriver[]> {
    const result = await this.pool.query(
      `SELECT fd.*, i.name as indicator_name, i.code as indicator_code
       FROM fragility_drivers fd
       LEFT JOIN indicators i ON i.id = fd.indicator_id
       WHERE fd.fragility_score_id = $1
       ORDER BY ABS(fd.impact) DESC`,
      [fragilityScoreId]
    );

    return result.rows;
  }

  async getRegionTopDrivers(regionId: string, limit: number = 5): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT fd.*, i.name as indicator_name, i.code as indicator_code
       FROM fragility_drivers fd
       JOIN fragility_scores fs ON fs.id = fd.fragility_score_id
       LEFT JOIN indicators i ON i.id = fd.indicator_id
       WHERE fs.region_id = $1
       ORDER BY ABS(fd.impact) DESC
       LIMIT $2`,
      [regionId, limit]
    );

    return result.rows;
  }

  // Compute fragility score (simplified algorithm)
  async computeFragilityScore(
    regionId: string,
    modelVersionId: string
  ): Promise<{ score: FragilityScore; drivers: FragilityDriver[] }> {
    // Get latest indicator values for the region
    const indicatorResult = await this.pool.query(
      `SELECT lri.*, i.category, i.directionality
       FROM latest_region_indicator_values lri
       JOIN indicators i ON i.id = lri.indicator_id
       WHERE lri.region_id = $1`,
      [regionId]
    );

    const indicators = indicatorResult.rows;

    // Calculate sub-scores by category
    const categories = ['economic', 'ecological', 'institutional', 'human'];
    const subScores: Record<string, number> = {};
    const drivers: any[] = [];

    for (const category of categories) {
      const categoryIndicators = indicators.filter(i => i.category === category);
      
      if (categoryIndicators.length > 0) {
        // Normalize and average indicators
        let totalScore = 0;
        let count = 0;

        for (const indicator of categoryIndicators) {
          // Simplified normalization (0-1 scale)
          const normalizedValue = this.normalizeIndicatorValue(indicator.value, indicator.directionality);
          totalScore += normalizedValue;
          count++;

          // Track as driver if significant impact
          if (Math.abs(normalizedValue - 0.5) > 0.2) {
            drivers.push({
              indicator_id: indicator.indicator_id,
              indicator_name: indicator.name,
              impact: normalizedValue - 0.5,
              direction: normalizedValue > 0.5 ? 'negative' : 'positive'
            });
          }
        }

        subScores[category] = count > 0 ? totalScore / count : 0.5;
      } else {
        subScores[category] = 0.5; // Default if no indicators
      }
    }

    // Calculate overall fragility score (weighted average)
    const weights = {
      economic: 0.3,
      ecological: 0.25,
      institutional: 0.25,
      human: 0.2
    };

    const overallScore = 
      subScores.economic * weights.economic +
      subScores.ecological * weights.ecological +
      subScores.institutional * weights.institutional +
      subScores.human * weights.human;

    // Determine risk band
    let riskBand: FragilityScore['risk_band'];
    if (overallScore < 0.3) {
      riskBand = 'low';
    } else if (overallScore < 0.5) {
      riskBand = 'moderate';
    } else if (overallScore < 0.7) {
      riskBand = 'high';
    } else {
      riskBand = 'critical';
    }

    // Create fragility score
    const score = await this.createFragilityScore({
      run_id: `manual_${Date.now()}`,
      region_id: regionId,
      score: overallScore,
      economic_score: subScores.economic,
      ecological_score: subScores.ecological,
      institutional_score: subScores.institutional,
      human_score: subScores.human,
      risk_band: riskBand
    });

    // Create drivers
    const createdDrivers = [];
    for (const driver of drivers.slice(0, 5)) { // Top 5 drivers
      const createdDriver = await this.createFragilityDriver({
        fragility_score_id: score.id,
        indicator_id: driver.indicator_id,
        driver_label: driver.indicator_name,
        impact: driver.impact,
        direction: driver.direction
      });
      createdDrivers.push(createdDriver);
    }

    return { score, drivers: createdDrivers };
  }

  private normalizeIndicatorValue(value: number, directionality: string): number {
    // Simplified normalization - in production this would be more sophisticated
    // Returns 0-1 where 1 = high fragility
    if (directionality === 'higher_is_better') {
      // Invert so higher values = lower fragility
      return Math.max(0, Math.min(1, 1 - (value / 100)));
    } else if (directionality === 'lower_is_better') {
      // Higher values = higher fragility
      return Math.max(0, Math.min(1, value / 100));
    } else {
      // Neutral - assume value is already 0-1
      return Math.max(0, Math.min(1, value));
    }
  }

  // Run full fragility analysis for multiple regions
  async runFragilityAnalysis(
    organizationId: string,
    regionIds: string[],
    modelVersionId: string,
    startedBy?: string
  ): Promise<FragilityRun> {
    const run = await this.createFragilityRun({
      organization_id: organizationId,
      model_version_id: modelVersionId,
      scope_json: { region_ids: regionIds },
      started_by: startedBy
    });

    // Update to running
    await this.updateFragilityRun(run.id, {
      status: 'running',
      started_at: new Date()
    });

    // Process each region
    for (const regionId of regionIds) {
      try {
        await this.computeFragilityScore(regionId, modelVersionId);
      } catch (error) {
        console.error(`Error computing fragility for region ${regionId}:`, error);
      }
    }

    // Update to completed
    const completedRun = await this.updateFragilityRun(run.id, {
      status: 'completed',
      completed_at: new Date()
    });

    return completedRun;
  }
}
