import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface DataSource {
  id: string;
  organization_id: string;
  name: string;
  type: 'file_upload' | 'api' | 'manual' | 'external_feed';
  category: string;
  description: string | null;
  config_json: any;
  status: string;
  created_by: string | null;
  created_at: Date;
}

export interface IngestionJob {
  id: string;
  data_source_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  file_name: string | null;
  rows_received: number;
  rows_valid: number;
  rows_rejected: number;
  quality_score: number | null;
  error_log: any;
  started_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
}

export class IngestionService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createDataSource(data: {
    organization_id: string;
    name: string;
    type: DataSource['type'];
    category: string;
    description?: string;
    config_json?: any;
    created_by?: string;
  }): Promise<DataSource> {
    const id = `src_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO data_sources (id, organization_id, name, type, category, description, config_json, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, data.organization_id, data.name, data.type, data.category, 
       data.description || null, data.config_json || {}, data.created_by || null]
    );

    return result.rows[0];
  }

  async getDataSource(id: string): Promise<DataSource | null> {
    const result = await this.pool.query(
      `SELECT * FROM data_sources WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listDataSources(filters?: {
    organization_id?: string;
    type?: string;
    category?: string;
    status?: string;
  }): Promise<DataSource[]> {
    let query = `SELECT * FROM data_sources WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.organization_id) {
      query += ` AND organization_id = $${paramIndex++}`;
      params.push(filters.organization_id);
    }
    if (filters?.type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(filters.type);
    }
    if (filters?.category) {
      query += ` AND category = $${paramIndex++}`;
      params.push(filters.category);
    }
    if (filters?.status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async createIngestionJob(data: {
    data_source_id: string;
    file_name?: string;
  }): Promise<IngestionJob> {
    const id = `job_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO ingestion_jobs (id, data_source_id, file_name, status)
       VALUES ($1, $2, $3, 'queued')
       RETURNING *`,
      [id, data.data_source_id, data.file_name || null]
    );

    return result.rows[0];
  }

  async getIngestionJob(id: string): Promise<IngestionJob | null> {
    const result = await this.pool.query(
      `SELECT * FROM ingestion_jobs WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async updateIngestionJob(id: string, updates: Partial<IngestionJob>): Promise<IngestionJob> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.rows_received !== undefined) {
      fields.push(`rows_received = $${paramIndex++}`);
      values.push(updates.rows_received);
    }
    if (updates.rows_valid !== undefined) {
      fields.push(`rows_valid = $${paramIndex++}`);
      values.push(updates.rows_valid);
    }
    if (updates.rows_rejected !== undefined) {
      fields.push(`rows_rejected = $${paramIndex++}`);
      values.push(updates.rows_rejected);
    }
    if (updates.quality_score !== undefined) {
      fields.push(`quality_score = $${paramIndex++}`);
      values.push(updates.quality_score);
    }
    if (updates.error_log !== undefined) {
      fields.push(`error_log = $${paramIndex++}`);
      values.push(updates.error_log);
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
      `UPDATE ingestion_jobs SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async listIngestionJobs(filters?: {
    data_source_id?: string;
    status?: string;
  }): Promise<IngestionJob[]> {
    let query = `SELECT * FROM ingestion_jobs WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.data_source_id) {
      query += ` AND data_source_id = $${paramIndex++}`;
      params.push(filters.data_source_id);
    }
    if (filters?.status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async processFileUpload(
    dataSourceId: string,
    fileName: string,
    rows: any[]
  ): Promise<IngestionJob> {
    const job = await this.createIngestionJob({
      data_source_id: dataSourceId,
      file_name: fileName
    });

    // Update job to running
    await this.updateIngestionJob(job.id, {
      status: 'running',
      started_at: new Date()
    });

    // Process rows (simplified - in production this would be async)
    let validRows = 0;
    let rejectedRows = 0;
    const errors: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        // Validate row (simplified)
        if (this.validateRow(rows[i])) {
          validRows++;
        } else {
          rejectedRows++;
          errors.push({
            row: i + 1,
            message: 'Invalid row data'
          });
        }
      } catch (error) {
        rejectedRows++;
        errors.push({
          row: i + 1,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const qualityScore = rows.length > 0 ? validRows / rows.length : 0;

    // Update job with results
    const updatedJob = await this.updateIngestionJob(job.id, {
      status: 'completed',
      rows_received: rows.length,
      rows_valid: validRows,
      rows_rejected: rejectedRows,
      quality_score: qualityScore,
      error_log: errors.length > 0 ? errors : null,
      completed_at: new Date()
    });

    return updatedJob;
  }

  private validateRow(row: any): boolean {
    // Simplified validation - in production this would be more comprehensive
    return row && typeof row === 'object' && Object.keys(row).length > 0;
  }
}
