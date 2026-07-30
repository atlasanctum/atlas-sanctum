import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface Region {
  id: string;
  parent_id: string | null;
  country_code: string;
  level: string;
  code: string | null;
  name: string;
  centroid: any; // PostGIS geography
  boundary: any; // PostGIS geometry
  created_at: Date;
}

export class RegionService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createRegion(data: {
    parent_id?: string;
    country_code: string;
    level: string;
    code?: string;
    name: string;
    centroid?: any;
    boundary?: any;
  }): Promise<Region> {
    const id = `reg_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO regions (id, parent_id, country_code, level, code, name, centroid, boundary)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, data.parent_id || null, data.country_code, data.level, data.code || null, 
       data.name, data.centroid || null, data.boundary || null]
    );

    return result.rows[0];
  }

  async getRegion(id: string): Promise<Region | null> {
    const result = await this.pool.query(
      `SELECT * FROM regions WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listRegions(filters?: {
    level?: string;
    country_code?: string;
    parent_id?: string;
  }): Promise<Region[]> {
    let query = `SELECT * FROM regions WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.level) {
      query += ` AND level = $${paramIndex++}`;
      params.push(filters.level);
    }
    if (filters?.country_code) {
      query += ` AND country_code = $${paramIndex++}`;
      params.push(filters.country_code);
    }
    if (filters?.parent_id) {
      query += ` AND parent_id = $${paramIndex++}`;
      params.push(filters.parent_id);
    }

    query += ` ORDER BY name ASC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateRegion(id: string, updates: Partial<Region>): Promise<Region> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.code !== undefined) {
      fields.push(`code = $${paramIndex++}`);
      values.push(updates.code);
    }
    if (updates.centroid !== undefined) {
      fields.push(`centroid = $${paramIndex++}`);
      values.push(updates.centroid);
    }
    if (updates.boundary !== undefined) {
      fields.push(`boundary = $${paramIndex++}`);
      values.push(updates.boundary);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE regions SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteRegion(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM regions WHERE id = $1`,
      [id]
    );
  }

  async getRegionWithIndicators(regionId: string): Promise<any> {
    const region = await this.getRegion(regionId);
    if (!region) return null;

    // Get latest indicator values
    const indicatorResult = await this.pool.query(
      `SELECT * FROM latest_region_indicator_values WHERE region_id = $1`,
      [regionId]
    );

    // Get latest fragility score
    const fragilityResult = await this.pool.query(
      `SELECT * FROM latest_fragility_scores WHERE region_id = $1`,
      [regionId]
    );

    return {
      ...region,
      latest_indicators: indicatorResult.rows,
      latest_fragility: fragilityResult.rows[0] || null
    };
  }

  async getRegionChildren(regionId: string): Promise<Region[]> {
    const result = await this.pool.query(
      `SELECT * FROM regions WHERE parent_id = $1 ORDER BY name ASC`,
      [regionId]
    );

    return result.rows;
  }

  async getRegionAncestors(regionId: string): Promise<Region[]> {
    const result = await this.pool.query(
      `WITH RECURSIVE ancestors AS (
        SELECT * FROM regions WHERE id = $1
        UNION ALL
        SELECT r.* FROM regions r
        INNER JOIN ancestors a ON r.id = a.parent_id
      )
      SELECT * FROM ancestors WHERE id != $1 ORDER BY level DESC`,
      [regionId]
    );

    return result.rows;
  }

  async searchRegions(query: string, filters?: {
    level?: string;
    country_code?: string;
  }): Promise<Region[]> {
    let sql = `SELECT * FROM regions WHERE (name ILIKE $1 OR code ILIKE $1)`;
    const params: any[] = [`%${query}%`];
    let paramIndex = 2;

    if (filters?.level) {
      sql += ` AND level = $${paramIndex++}`;
      params.push(filters.level);
    }
    if (filters?.country_code) {
      sql += ` AND country_code = $${paramIndex++}`;
      params.push(filters.country_code);
    }

    sql += ` ORDER BY name ASC LIMIT 50`;

    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async getRegionsByBounds(
    minLat: number,
    minLon: number,
    maxLat: number,
    maxLon: number,
    filters?: {
      level?: string;
      country_code?: string;
    }
  ): Promise<Region[]> {
    let query = `
      SELECT * FROM regions 
      WHERE boundary IS NOT NULL
      AND ST_Intersects(
        boundary,
        ST_MakeEnvelope($1, $2, $3, $4, 4326)
      )
    `;
    const params: any[] = [minLon, minLat, maxLon, maxLat];
    let paramIndex = 5;

    if (filters?.level) {
      query += ` AND level = $${paramIndex++}`;
      params.push(filters.level);
    }
    if (filters?.country_code) {
      query += ` AND country_code = $${paramIndex++}`;
      params.push(filters.country_code);
    }

    query += ` ORDER BY name ASC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }
}
