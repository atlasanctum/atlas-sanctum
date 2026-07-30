import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface AlertRule {
  id: string;
  organization_id: string;
  name: string;
  metric: string;
  operator: string;
  threshold: number;
  scope_json: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  is_active: boolean;
  created_by: string | null;
  created_at: Date;
}

export interface Alert {
  id: string;
  organization_id: string;
  alert_rule_id: string | null;
  region_id: string | null;
  metric: string;
  metric_value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  message: string;
  triggered_at: Date;
  resolved_at: Date | null;
}

export class AlertService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Alert rules
  async createAlertRule(data: {
    organization_id: string;
    name: string;
    metric: string;
    operator: string;
    threshold: number;
    scope_json: any;
    severity: AlertRule['severity'];
    created_by?: string;
  }): Promise<AlertRule> {
    const id = `arule_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO alert_rules (id, organization_id, name, metric, operator, threshold, scope_json, severity, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, data.organization_id, data.name, data.metric, data.operator, data.threshold,
       data.scope_json, data.severity, data.created_by || null]
    );

    return result.rows[0];
  }

  async getAlertRule(id: string): Promise<AlertRule | null> {
    const result = await this.pool.query(
      `SELECT * FROM alert_rules WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listAlertRules(filters?: {
    organization_id?: string;
    is_active?: boolean;
  }): Promise<AlertRule[]> {
    let query = `SELECT * FROM alert_rules WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.organization_id) {
      query += ` AND organization_id = $${paramIndex++}`;
      params.push(filters.organization_id);
    }
    if (filters?.is_active !== undefined) {
      query += ` AND is_active = $${paramIndex++}`;
      params.push(filters.is_active);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateAlertRule(id: string, updates: Partial<AlertRule>): Promise<AlertRule> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.metric) {
      fields.push(`metric = $${paramIndex++}`);
      values.push(updates.metric);
    }
    if (updates.operator) {
      fields.push(`operator = $${paramIndex++}`);
      values.push(updates.operator);
    }
    if (updates.threshold !== undefined) {
      fields.push(`threshold = $${paramIndex++}`);
      values.push(updates.threshold);
    }
    if (updates.scope_json !== undefined) {
      fields.push(`scope_json = $${paramIndex++}`);
      values.push(updates.scope_json);
    }
    if (updates.severity) {
      fields.push(`severity = $${paramIndex++}`);
      values.push(updates.severity);
    }
    if (updates.is_active !== undefined) {
      fields.push(`is_active = $${paramIndex++}`);
      values.push(updates.is_active);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE alert_rules SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteAlertRule(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM alert_rules WHERE id = $1`,
      [id]
    );
  }

  // Alerts
  async createAlert(data: {
    organization_id: string;
    alert_rule_id?: string;
    region_id?: string;
    metric: string;
    metric_value: number;
    severity: Alert['severity'];
    message: string;
  }): Promise<Alert> {
    const id = `alert_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO alerts (id, organization_id, alert_rule_id, region_id, metric, metric_value, severity, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, data.organization_id, data.alert_rule_id || null, data.region_id || null,
       data.metric, data.metric_value, data.severity, data.message]
    );

    return result.rows[0];
  }

  async getAlert(id: string): Promise<Alert | null> {
    const result = await this.pool.query(
      `SELECT * FROM alerts WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listAlerts(filters?: {
    organization_id?: string;
    region_id?: string;
    status?: string;
    severity?: string;
  }): Promise<Alert[]> {
    let query = `SELECT * FROM alerts WHERE 1=1`;
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
    if (filters?.severity) {
      query += ` AND severity = $${paramIndex++}`;
      params.push(filters.severity);
    }

    query += ` ORDER BY triggered_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.resolved_at) {
      fields.push(`resolved_at = $${paramIndex++}`);
      values.push(updates.resolved_at);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE alerts SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async acknowledgeAlert(id: string): Promise<Alert> {
    return this.updateAlert(id, { status: 'acknowledged' });
  }

  async resolveAlert(id: string): Promise<Alert> {
    return this.updateAlert(id, { 
      status: 'resolved',
      resolved_at: new Date()
    });
  }

  // Check alert rules against current values
  async checkAlertRules(organizationId: string): Promise<Alert[]> {
    const rules = await this.listAlertRules({
      organization_id: organizationId,
      is_active: true
    });

    const triggeredAlerts: Alert[] = [];

    for (const rule of rules) {
      try {
        const shouldTrigger = await this.evaluateAlertRule(rule);
        if (shouldTrigger) {
          const alert = await this.createAlert({
            organization_id: organizationId,
            alert_rule_id: rule.id,
            metric: rule.metric,
            metric_value: shouldTrigger.value,
            severity: rule.severity,
            message: `Alert: ${rule.name} - ${rule.metric} ${rule.operator} ${rule.threshold} (current: ${shouldTrigger.value})`
          });
          triggeredAlerts.push(alert);
        }
      } catch (error) {
        console.error(`Error evaluating alert rule ${rule.id}:`, error);
      }
    }

    return triggeredAlerts;
  }

  private async evaluateAlertRule(rule: AlertRule): Promise<{ value: number } | null> {
    // Simplified evaluation - in production this would be more sophisticated
    let query: string;
    const params: any[] = [];

    switch (rule.metric) {
      case 'fragility_score':
        query = `
          SELECT fs.score as value
          FROM latest_fragility_scores fs
          JOIN regions r ON r.id = fs.region_id
          WHERE r.country_code = $1
        `;
        params.push(rule.scope_json?.country_code || 'KE');
        break;

      case 'economic_score':
      case 'ecological_score':
      case 'institutional_score':
      case 'human_score':
        query = `
          SELECT fs.${rule.metric} as value
          FROM latest_fragility_scores fs
          JOIN regions r ON r.id = fs.region_id
          WHERE r.country_code = $1
        `;
        params.push(rule.scope_json?.country_code || 'KE');
        break;

      default:
        return null;
    }

    const result = await this.pool.query(query, params);
    
    if (result.rows.length === 0) {
      return null;
    }

    const value = parseFloat(result.rows[0].value);
    
    // Evaluate condition
    let shouldTrigger = false;
    switch (rule.operator) {
      case '>=':
        shouldTrigger = value >= rule.threshold;
        break;
      case '>':
        shouldTrigger = value > rule.threshold;
        break;
      case '<=':
        shouldTrigger = value <= rule.threshold;
        break;
      case '<':
        shouldTrigger = value < rule.threshold;
        break;
      case '==':
        shouldTrigger = value === rule.threshold;
        break;
      case '!=':
        shouldTrigger = value !== rule.threshold;
        break;
    }

    return shouldTrigger ? { value } : null;
  }

  // Get active alerts count
  async getActiveAlertsCount(organizationId: string): Promise<number> {
    const result = await this.pool.query(
      `SELECT COUNT(*) as count FROM alerts 
       WHERE organization_id = $1 AND status = 'open'`,
      [organizationId]
    );

    return parseInt(result.rows[0].count);
  }

  // Get alerts by severity
  async getAlertsBySeverity(organizationId: string): Promise<any[]> {
    const result = await this.pool.query(
      `SELECT severity, COUNT(*) as count
       FROM alerts 
       WHERE organization_id = $1 AND status = 'open'
       GROUP BY severity
       ORDER BY 
         CASE severity
           WHEN 'critical' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END`,
      [organizationId]
    );

    return result.rows;
  }
}
