import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface Indicator {
  id: string;
  code: string;
  name: string;
  category: 'economic' | 'ecological' | 'institutional' | 'human' | 'custom';
  unit: string;
  aggregation_method: string;
  directionality: 'higher_is_better' | 'lower_is_better' | 'neutral';
  description: string | null;
  metadata_json: any;
  created_at: Date;
}

export interface Observation {
  id: number;
  indicator_id: string;
  region_id: string;
  source_id: string | null;
  ingestion_job_id: string | null;
  observed_at: Date;
  value: number;
  unit: string;
  confidence: number | null;
  metadata_json: any;
  created_at: Date;
}

export class IndicatorService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createIndicator(data: {
    code: string;
    name: string;
    category: Indicator['category'];
    unit: string;
    aggregation_method: string;
    directionality: Indicator['directionality'];
    description?: string;
    metadata_json?: any;
  }): Promise<Indicator> {
    const id = `ind_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO indicators (id, code, name, category, unit, aggregation_method, directionality, description, metadata_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, data.code, data.name, data.category, data.unit, 
       data.aggregation_method, data.directionality, data.description || null, data.metadata_json || {}]
    );

    return result.rows[0];
  }

  async getIndicator(id: string): Promise<Indicator | null> {
    const result = await this.pool.query(
      `SELECT * FROM indicators WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async getIndicatorByCode(code: string): Promise<Indicator | null> {
    const result = await this.pool.query(
      `SELECT * FROM indicators WHERE code = $1`,
      [code]
    );

    return result.rows[0] || null;
  }

  async listIndicators(filters?: {
    category?: string;
  }): Promise<Indicator[]> {
    let query = `SELECT * FROM indicators WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.category) {
      query += ` AND category = $${paramIndex++}`;
      params.push(filters.category);
    }

    query += ` ORDER BY name ASC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createObservation(data: {
    indicator_id: string;
    region_id: string;
    source_id?: string;
    ingestion_job_id?: string;
    observed_at: Date;
    value: number;
    unit: string;
    confidence?: number;
    metadata_json?: any;
  }): Promise<Observation> {
    const result = await this.pool.query(
      `INSERT INTO observations (indicator_id, region_id, source_id, ingestion_job_id, observed_at, value, unit, confidence, metadata_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [data.indicator_id, data.region_id, data.source_id || null, data.ingestion_job_id || null,
       data.observed_at, data.value, data.unit, data.confidence || null, data.metadata_json || {}]
    );

    return result.rows[0];
  }

  async bulkCreateObservations(observations: Array<{
    indicator_id: string;
    region_id: string;
    source_id?: string;
    ingestion_job_id?: string;
    observed_at: Date;
    value: number;
    unit: string;
    confidence?: number;
    metadata_json?: any;
  }>): Promise<number> {
    if (observations.length === 0) return 0;

    const values: any[] = [];
    const placeholders: string[] = [];
    let paramIndex = 1;

    for (const obs of observations) {
      placeholders.push(
        `($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`
      );
      values.push(
        obs.indicator_id, obs.region_id, obs.source_id || null, obs.ingestion_job_id || null,
        obs.observed_at, obs.value, obs.unit, obs.confidence || null, obs.metadata_json || {}
      );
    }

    const result = await this.pool.query(
      `INSERT INTO observations (indicator_id, region_id, source_id, ingestion_job_id, observed_at, value, unit, confidence, metadata_json)
       VALUES ${placeholders.join(', ')}`,
      values
    );

    return result.rowCount || 0;
  }

  async getObservation(id: number): Promise<Observation | null> {
    const result = await this.pool.query(
      `SELECT * FROM observations WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async getRegionIndicators(regionId: string, options?: {
    indicator_id?: string;
    from_date?: Date;
    to_date?: Date;
    limit?: number;
  }): Promise<Observation[]> {
    let query = `SELECT * FROM observations WHERE region_id = $1`;
    const params: any[] = [regionId];
    let paramIndex = 2;

    if (options?.indicator_id) {
      query += ` AND indicator_id = $${paramIndex++}`;
      params.push(options.indicator_id);
    }
    if (options?.from_date) {
      query += ` AND observed_at >= $${paramIndex++}`;
      params.push(options.from_date);
    }
    if (options?.to_date) {
      query += ` AND observed_at <= $${paramIndex++}`;
      params.push(options.to_date);
    }

    query += ` ORDER BY observed_at DESC`;

    if (options?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(options.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getLatestRegionIndicatorValues(regionId: string): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT * FROM latest_region_indicator_values WHERE region_id = $1`,
      [regionId]
    );

    return result.rows;
  }

  async getIndicatorTimeSeries(
    indicatorId: string,
    regionId: string,
    options?: {
      from_date?: Date;
      to_date?: Date;
      limit?: number;
    }
  ): Promise<Observation[]> {
    let query = `SELECT * FROM observations WHERE indicator_id = $1 AND region_id = $2`;
    const params: any[] = [indicatorId, regionId];
    let paramIndex = 3;

    if (options?.from_date) {
      query += ` AND observed_at >= $${paramIndex++}`;
      params.push(options.from_date);
    }
    if (options?.to_date) {
      query += ` AND observed_at <= $${paramIndex++}`;
      params.push(options.to_date);
    }

    query += ` ORDER BY observed_at ASC`;

    if (options?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(options.limit);
    }

    const result = await this.pool.query(query, params);
    return result.rows;
  }
}
