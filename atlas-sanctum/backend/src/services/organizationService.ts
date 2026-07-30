import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  country_code: string | null;
  created_at: Date;
  updated_at: Date;
}

export class OrganizationService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async create(data: {
    name: string;
    slug: string;
    country_code?: string;
  }): Promise<Organization> {
    const id = `org_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO organizations (id, name, slug, country_code)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, data.name, data.slug, data.country_code || null]
    );

    return result.rows[0];
  }

  async getById(id: string): Promise<Organization | null> {
    const result = await this.pool.query(
      `SELECT * FROM organizations WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async getBySlug(slug: string): Promise<Organization | null> {
    const result = await this.pool.query(
      `SELECT * FROM organizations WHERE slug = $1`,
      [slug]
    );

    return result.rows[0] || null;
  }

  async list(filters?: {
    country_code?: string;
  }): Promise<Organization[]> {
    let query = `SELECT * FROM organizations WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.country_code) {
      query += ` AND country_code = $${paramIndex++}`;
      params.push(filters.country_code);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async update(id: string, updates: Partial<Organization>): Promise<Organization> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.slug) {
      fields.push(`slug = $${paramIndex++}`);
      values.push(updates.slug);
    }
    if (updates.country_code !== undefined) {
      fields.push(`country_code = $${paramIndex++}`);
      values.push(updates.country_code);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.pool.query(
      `UPDATE organizations SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM organizations WHERE id = $1`,
      [id]
    );
  }

  async getOrganizationUsers(orgId: string): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT id, email, full_name, role, is_active, created_at, updated_at
       FROM users WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [orgId]
    );

    return result.rows;
  }
}
