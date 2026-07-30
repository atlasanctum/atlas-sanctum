import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface Action {
  id: string;
  organization_id: string;
  region_id: string | null;
  related_scenario_id: string | null;
  related_project_id: string | null;
  type: string;
  title: string;
  description: string | null;
  owner_user_id: string | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  due_date: Date | null;
  completed_at: Date | null;
  created_by: string | null;
  created_at: Date;
}

export class ActionService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createAction(data: {
    organization_id: string;
    region_id?: string;
    related_scenario_id?: string;
    related_project_id?: string;
    type: string;
    title: string;
    description?: string;
    owner_user_id?: string;
    due_date?: Date;
    created_by?: string;
  }): Promise<Action> {
    const id = `act_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO actions (id, organization_id, region_id, related_scenario_id, related_project_id, type, title, description, owner_user_id, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [id, data.organization_id, data.region_id || null, data.related_scenario_id || null,
       data.related_project_id || null, data.type, data.title, data.description || null,
       data.owner_user_id || null, data.due_date || null, data.created_by || null]
    );

    return result.rows[0];
  }

  async getAction(id: string): Promise<Action | null> {
    const result = await this.pool.query(
      `SELECT * FROM actions WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listActions(filters?: {
    organization_id?: string;
    region_id?: string;
    status?: string;
    type?: string;
    owner_user_id?: string;
  }): Promise<Action[]> {
    let query = `SELECT * FROM actions WHERE 1=1`;
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
    if (filters?.type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(filters.type);
    }
    if (filters?.owner_user_id) {
      query += ` AND owner_user_id = $${paramIndex++}`;
      params.push(filters.owner_user_id);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateAction(id: string, updates: Partial<Action>): Promise<Action> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.type) {
      fields.push(`type = $${paramIndex++}`);
      values.push(updates.type);
    }
    if (updates.title) {
      fields.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.owner_user_id !== undefined) {
      fields.push(`owner_user_id = $${paramIndex++}`);
      values.push(updates.owner_user_id);
    }
    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.due_date !== undefined) {
      fields.push(`due_date = $${paramIndex++}`);
      values.push(updates.due_date);
    }
    if (updates.completed_at) {
      fields.push(`completed_at = $${paramIndex++}`);
      values.push(updates.completed_at);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE actions SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteAction(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM actions WHERE id = $1`,
      [id]
    );
  }

  async startAction(id: string): Promise<Action> {
    return this.updateAction(id, { status: 'in_progress' });
  }

  async completeAction(id: string): Promise<Action> {
    return this.updateAction(id, { 
      status: 'completed',
      completed_at: new Date()
    });
  }

  async cancelAction(id: string): Promise<Action> {
    return this.updateAction(id, { status: 'cancelled' });
  }

  // Get actions summary
  async getActionsSummary(organizationId: string): Promise<any> {
    const result = await this.pool.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COUNT(CASE WHEN due_date < NOW() AND status IN ('open', 'in_progress') THEN 1 END) as overdue
       FROM actions 
       WHERE organization_id = $1`,
      [organizationId]
    );

    return result.rows[0];
  }

  // Get overdue actions
  async getOverdueActions(organizationId: string): Promise<Action[]> {
    const result = await this.pool.query(
      `SELECT * FROM actions 
       WHERE organization_id = $1 
       AND due_date < NOW() 
       AND status IN ('open', 'in_progress')
       ORDER BY due_date ASC`,
      [organizationId]
    );

    return result.rows;
  }

  // Get actions by type
  async getActionsByType(organizationId: string): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT type, COUNT(*) as count
       FROM actions 
       WHERE organization_id = $1
       GROUP BY type
       ORDER BY count DESC`,
      [organizationId]
    );

    return result.rows;
  }

  // Get recent actions
  async getRecentActions(organizationId: string, limit: number = 10): Promise<Action[]> {
    const result = await this.pool.query(
      `SELECT * FROM actions 
       WHERE organization_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [organizationId, limit]
    );

    return result.rows;
  }
}
