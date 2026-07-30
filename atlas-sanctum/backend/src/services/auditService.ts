import { Pool } from 'pg';

export interface AuditLog {
  id: number;
  organization_id: string | null;
  actor_user_id: string | null;
  entity_type: string;
  entity_id: string;
  action: string;
  before_json: any;
  after_json: any;
  created_at: Date;
}

export class AuditService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async log(data: {
    organization_id?: string;
    actor_user_id?: string;
    entity_type: string;
    entity_id: string;
    action: string;
    before_json?: any;
    after_json?: any;
  }): Promise<AuditLog> {
    const result = await this.pool.query(
      `INSERT INTO audit_logs (organization_id, actor_user_id, entity_type, entity_id, action, before_json, after_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.organization_id || null, data.actor_user_id || null, data.entity_type,
       data.entity_id, data.action, data.before_json || null, data.after_json || null]
    );

    return result.rows[0];
  }

  async getAuditLog(id: number): Promise<AuditLog | null> {
    const result = await this.pool.query(
      `SELECT * FROM audit_logs WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listAuditLogs(filters?: {
    organization_id?: string;
    actor_user_id?: string;
    entity_type?: string;
    entity_id?: string;
    action?: string;
    from_date?: Date;
    to_date?: Date;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    let query = `SELECT * FROM audit_logs WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.organization_id) {
      query += ` AND organization_id = $${paramIndex++}`;
      params.push(filters.organization_id);
    }
    if (filters?.actor_user_id) {
      query += ` AND actor_user_id = $${paramIndex++}`;
      params.push(filters.actor_user_id);
    }
    if (filters?.entity_type) {
      query += ` AND entity_type = $${paramIndex++}`;
      params.push(filters.entity_type);
    }
    if (filters?.entity_id) {
      query += ` AND entity_id = $${paramIndex++}`;
      params.push(filters.entity_id);
    }
    if (filters?.action) {
      query += ` AND action = $${paramIndex++}`;
      params.push(filters.action);
    }
    if (filters?.from_date) {
      query += ` AND created_at >= $${paramIndex++}`;
      params.push(filters.from_date);
    }
    if (filters?.to_date) {
      query += ` AND created_at <= $${paramIndex++}`;
      params.push(filters.to_date);
    }

    query += ` ORDER BY created_at DESC`;

    if (filters?.limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(filters.limit);
    }
    if (filters?.offset) {
      query += ` OFFSET $${paramIndex++}`;
      params.push(filters.offset);
    }

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getEntityHistory(entityType: string, entityId: string): Promise<AuditLog[]> {
    const result = await this.pool.query(
      `SELECT * FROM audit_logs 
       WHERE entity_type = $1 AND entity_id = $2
       ORDER BY created_at DESC`,
      [entityType, entityId]
    );

    return result.rows;
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<AuditLog[]> {
    const result = await this.pool.query(
      `SELECT * FROM audit_logs 
       WHERE actor_user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  }

  async getOrganizationActivity(organizationId: string, limit: number = 100): Promise<AuditLog[]> {
    const result = await this.pool.query(
      `SELECT * FROM audit_logs 
       WHERE organization_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [organizationId, limit]
    );

    return result.rows;
  }

  async getRecentActivity(organizationId: string, limit: number = 20): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT 
        al.*,
        u.full_name as actor_name,
        u.email as actor_email
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.actor_user_id
       WHERE al.organization_id = $1
       ORDER BY al.created_at DESC
       LIMIT $2`,
      [organizationId, limit]
    );

    return result.rows;
  }

  async getActivitySummary(organizationId: string, days: number = 30): Promise<any> {
    const result = await this.pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        COUNT(DISTINCT actor_user_id) as unique_actors,
        COUNT(DISTINCT entity_type) as entity_types
       FROM audit_logs 
       WHERE organization_id = $1
       AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [organizationId]
    );

    return result.rows;
  }

  async getActionCounts(organizationId: string, days: number = 30): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT 
        action,
        COUNT(*) as count
       FROM audit_logs 
       WHERE organization_id = $1
       AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY action
       ORDER BY count DESC`,
      [organizationId]
    );

    return result.rows;
  }

  async getEntityTypeCounts(organizationId: string, days: number = 30): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT 
        entity_type,
        COUNT(*) as count
       FROM audit_logs 
       WHERE organization_id = $1
       AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY entity_type
       ORDER BY count DESC`,
      [organizationId]
    );

    return result.rows;
  }
}
