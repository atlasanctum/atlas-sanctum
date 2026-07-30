import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  organization_id: string;
  owner_org_id: string | null;
  region_id: string | null;
  name: string;
  type: string;
  description: string | null;
  status: 'draft' | 'active' | 'under_review' | 'verified' | 'rejected' | 'completed';
  start_date: Date | null;
  end_date: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectSite {
  id: string;
  project_id: string;
  name: string;
  geometry: any; // PostGIS geometry
  centroid: any; // PostGIS geography
  area_hectares: number | null;
  created_at: Date;
}

export interface ProjectTargetMetric {
  id: number;
  project_id: string;
  metric_code: string;
  target_value: number;
  unit: string | null;
}

export interface Evidence {
  id: string;
  project_id: string;
  site_id: string | null;
  submitted_by: string | null;
  evidence_type: 'field_observation' | 'photo' | 'document' | 'sensor_reading' | 'satellite_analysis' | 'audit_note';
  captured_at: Date | null;
  notes: string | null;
  verification_status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: Date;
}

export interface EvidenceMetric {
  id: number;
  evidence_id: string;
  metric_code: string;
  value: number;
  unit: string | null;
}

export interface EvidenceFile {
  id: string;
  evidence_id: string;
  object_key: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: Date;
}

export interface ProjectVerification {
  id: string;
  project_id: string;
  reviewed_by: string | null;
  verification_status: 'verified' | 'rejected' | 'partial';
  summary: string | null;
  created_at: Date;
}

export class MrvService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Projects
  async createProject(data: {
    organization_id: string;
    owner_org_id?: string;
    region_id?: string;
    name: string;
    type: string;
    description?: string;
    start_date?: Date;
    end_date?: Date;
    created_by?: string;
  }): Promise<Project> {
    const id = `proj_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO projects (id, organization_id, owner_org_id, region_id, name, type, description, start_date, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, data.organization_id, data.owner_org_id || null, data.region_id || null,
       data.name, data.type, data.description || null, data.start_date || null,
       data.end_date || null, data.created_by || null]
    );

    return result.rows[0];
  }

  async getProject(id: string): Promise<Project | null> {
    const result = await this.pool.query(
      `SELECT * FROM projects WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listProjects(filters?: {
    organization_id?: string;
    region_id?: string;
    status?: string;
    type?: string;
  }): Promise<Project[]> {
    let query = `SELECT * FROM projects WHERE 1=1`;
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

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.type) {
      fields.push(`type = $${paramIndex++}`);
      values.push(updates.type);
    }
    if (updates.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.status) {
      fields.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }
    if (updates.start_date !== undefined) {
      fields.push(`start_date = $${paramIndex++}`);
      values.push(updates.start_date);
    }
    if (updates.end_date !== undefined) {
      fields.push(`end_date = $${paramIndex++}`);
      values.push(updates.end_date);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.pool.query(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteProject(id: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM projects WHERE id = $1`,
      [id]
    );
  }

  // Project sites
  async createProjectSite(data: {
    project_id: string;
    name: string;
    geometry?: any;
    centroid?: any;
    area_hectares?: number;
  }): Promise<ProjectSite> {
    const id = `site_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO project_sites (id, project_id, name, geometry, centroid, area_hectares)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, data.project_id, data.name, data.geometry || null, data.centroid || null, data.area_hectares || null]
    );

    return result.rows[0];
  }

  async getProjectSite(id: string): Promise<ProjectSite | null> {
    const result = await this.pool.query(
      `SELECT * FROM project_sites WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listProjectSites(projectId: string): Promise<ProjectSite[]> {
    const result = await this.pool.query(
      `SELECT * FROM project_sites WHERE project_id = $1 ORDER BY created_at`,
      [projectId]
    );

    return result.rows;
  }

  // Project target metrics
  async addTargetMetric(data: {
    project_id: string;
    metric_code: string;
    target_value: number;
    unit?: string;
  }): Promise<ProjectTargetMetric> {
    const result = await this.pool.query(
      `INSERT INTO project_target_metrics (project_id, metric_code, target_value, unit)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.project_id, data.metric_code, data.target_value, data.unit || null]
    );

    return result.rows[0];
  }

  async getProjectTargetMetrics(projectId: string): Promise<ProjectTargetMetric[]> {
    const result = await this.pool.query(
      `SELECT * FROM project_target_metrics WHERE project_id = $1 ORDER BY metric_code`,
      [projectId]
    );

    return result.rows;
  }

  // Evidence
  async createEvidence(data: {
    project_id: string;
    site_id?: string;
    submitted_by?: string;
    evidence_type: Evidence['evidence_type'];
    captured_at?: Date;
    notes?: string;
  }): Promise<Evidence> {
    const id = `evid_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO evidence (id, project_id, site_id, submitted_by, evidence_type, captured_at, notes, verification_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [id, data.project_id, data.site_id || null, data.submitted_by || null,
       data.evidence_type, data.captured_at || null, data.notes || null]
    );

    return result.rows[0];
  }

  async getEvidence(id: string): Promise<Evidence | null> {
    const result = await this.pool.query(
      `SELECT * FROM evidence WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async listEvidence(filters?: {
    project_id?: string;
    site_id?: string;
    verification_status?: string;
    evidence_type?: string;
  }): Promise<Evidence[]> {
    let query = `SELECT * FROM evidence WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.project_id) {
      query += ` AND project_id = $${paramIndex++}`;
      params.push(filters.project_id);
    }
    if (filters?.site_id) {
      query += ` AND site_id = $${paramIndex++}`;
      params.push(filters.site_id);
    }
    if (filters?.verification_status) {
      query += ` AND verification_status = $${paramIndex++}`;
      params.push(filters.verification_status);
    }
    if (filters?.evidence_type) {
      query += ` AND evidence_type = $${paramIndex++}`;
      params.push(filters.evidence_type);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async updateEvidence(id: string, updates: Partial<Evidence>): Promise<Evidence> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.evidence_type) {
      fields.push(`evidence_type = $${paramIndex++}`);
      values.push(updates.evidence_type);
    }
    if (updates.captured_at !== undefined) {
      fields.push(`captured_at = $${paramIndex++}`);
      values.push(updates.captured_at);
    }
    if (updates.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      values.push(updates.notes);
    }
    if (updates.verification_status) {
      fields.push(`verification_status = $${paramIndex++}`);
      values.push(updates.verification_status);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE evidence SET ${fields.join(', ')} WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  // Evidence metrics
  async addEvidenceMetric(data: {
    evidence_id: string;
    metric_code: string;
    value: number;
    unit?: string;
  }): Promise<EvidenceMetric> {
    const result = await this.pool.query(
      `INSERT INTO evidence_metrics (evidence_id, metric_code, value, unit)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.evidence_id, data.metric_code, data.value, data.unit || null]
    );

    return result.rows[0];
  }

  async getEvidenceMetrics(evidenceId: string): Promise<EvidenceMetric[]> {
    const result = await this.pool.query(
      `SELECT * FROM evidence_metrics WHERE evidence_id = $1 ORDER BY metric_code`,
      [evidenceId]
    );

    return result.rows;
  }

  // Evidence files
  async addEvidenceFile(data: {
    evidence_id: string;
    object_key: string;
    file_name: string;
    mime_type?: string;
    size_bytes?: number;
  }): Promise<EvidenceFile> {
    const id = `efile_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO evidence_files (id, evidence_id, object_key, file_name, mime_type, size_bytes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, data.evidence_id, data.object_key, data.file_name, data.mime_type || null, data.size_bytes || null]
    );

    return result.rows[0];
  }

  async getEvidenceFiles(evidenceId: string): Promise<EvidenceFile[]> {
    const result = await this.pool.query(
      `SELECT * FROM evidence_files WHERE evidence_id = $1 ORDER BY created_at`,
      [evidenceId]
    );

    return result.rows;
  }

  // Project verification
  async createVerification(data: {
    project_id: string;
    reviewed_by?: string;
    verification_status: ProjectVerification['verification_status'];
    summary?: string;
  }): Promise<ProjectVerification> {
    const id = `verif_${uuidv4().substring(0, 12)}`;

    const result = await this.pool.query(
      `INSERT INTO project_verifications (id, project_id, reviewed_by, verification_status, summary)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, data.project_id, data.reviewed_by || null, data.verification_status, data.summary || null]
    );

    return result.rows[0];
  }

  async getProjectVerifications(projectId: string): Promise<ProjectVerification[]> {
    const result = await this.pool.query(
      `SELECT * FROM project_verifications WHERE project_id = $1 ORDER BY created_at DESC`,
      [projectId]
    );

    return result.rows;
  }

  async verifyProject(
    projectId: string,
    verificationStatus: ProjectVerification['verification_status'],
    summary: string,
    reviewedBy?: string
  ): Promise<ProjectVerification> {
    // Create verification record
    const verification = await this.createVerification({
      project_id: projectId,
      reviewed_by: reviewedBy,
      verification_status: verificationStatus,
      summary
    });

    // Update project status
    let newStatus: Project['status'];
    if (verificationStatus === 'verified') {
      newStatus = 'verified';
    } else if (verificationStatus === 'rejected') {
      newStatus = 'rejected';
    } else {
      newStatus = 'under_review';
    }

    await this.updateProject(projectId, { status: newStatus });

    return verification;
  }

  // Get project progress summary
  async getProjectProgress(projectId: string): Promise<any> {
    const result = await this.pool.query(
      `SELECT * FROM project_progress_summary WHERE project_id = $1`,
      [projectId]
    );

    return result.rows[0] || null;
  }

  // Get project with full details
  async getProjectWithDetails(projectId: string): Promise<any> {
    const project = await this.getProject(projectId);
    if (!project) return null;

    const [sites, targetMetrics, evidence, verifications, progress] = await Promise.all([
      this.listProjectSites(projectId),
      this.getProjectTargetMetrics(projectId),
      this.listEvidence({ project_id: projectId }),
      this.getProjectVerifications(projectId),
      this.getProjectProgress(projectId)
    ]);

    return {
      ...project,
      sites,
      target_metrics: targetMetrics,
      evidence,
      verifications,
      progress
    };
  }
}
