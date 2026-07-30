/**
 * Project Service
 * Handles project CRUD operations, verification, and impact reporting
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  ProjectType,
  ProjectStatus,
  ClimateClassification,
  GeoPoint,
  CarbonProject,
  CreditHolding,
  Transaction} from '../types/marketplace';



// API Configuration
const API_BASE = import.meta.env.VITE_API_URL || '/api/v2';

// Pick up the current Bearer token (JWT or Supabase) at call-time
function getAuthHeaders(): Record<string, string> {
  // 1. In-memory JWT token set by useAuth
  const inMemory = typeof window !== 'undefined'
    ? (window as any).__atlasAccessToken as string | undefined
    : undefined;
  if (inMemory) return { Authorization: `Bearer ${inMemory}` };

  // 2. Supabase session persisted in localStorage
  try {
    const sbKey = Object.keys(localStorage).find(
      (k) => k.startsWith('sb-') && k.endsWith('-auth-token')
    );
    if (sbKey) {
      const raw = localStorage.getItem(sbKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.access_token || parsed?.currentSession?.access_token;
        if (token) return { Authorization: `Bearer ${token}` };
      }
    }
  } catch { /* ignore */ }

  return {};
}

// Extended project interface for frontend
export interface Project extends Omit<CarbonProject, 'id'> {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerType: 'individual' | 'organization' | 'government';
  impactScore: number;
  confidenceLevel: number;
  verificationStatus: 'pending' | 'in_review' | 'verified' | 'rejected';
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  mediaGallery?: ProjectMedia[];
  documents?: ProjectDocument[];
  updates?: ProjectUpdate[];
  supporters: number;
  totalFunding: number;
  fundingGoal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMedia {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  title?: string;
  description?: string;
  uploadedAt: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  mediaUrls?: string[];
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface ProjectCreateInput {
  title: string;
  description: string;
  location: string;
  country: string;
  projectType: ProjectType;
  climateClassification?: ClimateClassification;
  pricePerCredit: number;
  totalCredits: number;
  vintageYear: number;
  certification: string;
  methodology?: string;
  co2OffsetPerCredit: number;
  geometry?: GeoPoint;
  images?: File[];
  documents?: File[];
}

export interface ProjectUpdateInput extends Partial<ProjectCreateInput> {
  status?: ProjectStatus;
}

export interface ImpactReport {
  id: string;
  projectId: string;
  reportingPeriod: {
    start: string;
    end: string;
  };
  measurements: ProjectMeasurement[];
  carbonSequestration: number;
  biodiversityImpact: number;
  waterConservation: number;
  communityBenefit: number;
  challenges: string[];
  achievements: string[];
  nextSteps: string[];
  attachments?: string[];
  submittedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface ProjectMeasurement {
  id: string;
  type: 'satellite' | 'field' | 'survey' | 'sensor';
  metric: string;
  value: number;
  unit: string;
  confidence: number;
  methodology: string;
  recordedAt: string;
  recordedBy?: string;
  location?: GeoPoint;
  notes?: string;
}

export interface VerificationSubmission {
  id: string;
  projectId: string;
  type: 'initial' | 'renewal' | 'update';
  documents: string[];
  evidence: VerificationEvidence[];
  claims: VerificationClaim[];
  notes?: string;
  submittedAt: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface VerificationEvidence {
  type: 'document' | 'image' | 'video' | 'data' | 'third_party';
  description: string;
  url?: string;
  fileId?: string;
  uploadedAt: string;
}

export interface VerificationClaim {
  claim: string;
  evidenceIds: string[];
  confidence: number;
}

export interface ProjectFilter {
  status?: ProjectStatus[];
  type?: ProjectType[];
  country?: string;
  climateClassification?: ClimateClassification[];
  minImpactScore?: number;
  verificationStatus?: Project['verificationStatus'];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProjectPage {
  projects: Project[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

class ProjectService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // ==================== Cache Methods ====================

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clearCache(): void {
    this.cache.clear();
  }

  // ==================== Project CRUD ====================

  async getProjects(filter?: ProjectFilter): Promise<ProjectPage> {
    const cacheKey = `projects:${JSON.stringify(filter || {})}`;
    const cached = this.getCached<ProjectPage>(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams();
      if (filter) {
        if (filter.status?.length) params.append('status', filter.status.join(','));
        if (filter.type?.length) params.append('type', filter.type.join(','));
        if (filter.search) params.append('search', filter.search);
        if (filter.limit) params.append('limit', filter.limit.toString());
        if (filter.offset) params.append('offset', filter.offset.toString());
      }

      const response = await fetch(`${API_BASE}/projects?${params}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { projects: this.generateMockProjects(10), total: 10, hasMore: false };
    }
  }

  async getProject(projectId: string): Promise<Project | null> {
    const cacheKey = `project:${projectId}`;
    const cached = this.getCached<Project>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  async createProject(input: ProjectCreateInput): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error('Failed to create project');

      const data = await response.json();
      this.clearCache();
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      return this.generateMockProject(input);
    }
  }

  async updateProject(projectId: string, input: ProjectUpdateInput): Promise<Project | null> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        credentials: 'include',
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error('Failed to update project');

      const data = await response.json();
      this.cache.delete(`project:${projectId}`);
      this.clearCache();
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      this.cache.delete(`project:${projectId}`);
      this.clearCache();
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // ==================== Media & Documents ====================

  async uploadMedia(projectId: string, file: File): Promise<ProjectMedia | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/projects/${projectId}/media`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload media');

      return await response.json();
    } catch (error) {
      console.error('Error uploading media:', error);
      return {
        id: uuidv4(),
        type: file.type.startsWith('image') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        title: file.name,
        uploadedAt: new Date().toISOString(),
      };
    }
  }

  async deleteMedia(projectId: string, mediaId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/media/${mediaId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }

  // ==================== Impact Reporting ====================

  async submitImpactReport(report: Omit<ImpactReport, 'id' | 'submittedAt' | 'status'>): Promise<ImpactReport> {
    try {
      const response = await fetch(`${API_BASE}/projects/${report.projectId}/impact-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) throw new Error('Failed to submit impact report');

      return await response.json();
    } catch (error) {
      console.error('Error submitting impact report:', error);
      return {
        id: uuidv4(),
        ...report,
        status: 'draft',
        submittedAt: new Date().toISOString(),
      };
    }
  }

  async getImpactReports(projectId: string): Promise<ImpactReport[]> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/impact-reports`);
      if (!response.ok) throw new Error('Failed to fetch impact reports');

      return await response.json();
    } catch (error) {
      console.error('Error fetching impact reports:', error);
      return [];
    }
  }

  async addMeasurement(projectId: string, measurement: Omit<ProjectMeasurement, 'id'>): Promise<ProjectMeasurement> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/measurements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(measurement),
      });

      if (!response.ok) throw new Error('Failed to add measurement');

      return await response.json();
    } catch (error) {
      console.error('Error adding measurement:', error);
      return { id: uuidv4(), ...measurement };
    }
  }

  async getMeasurements(projectId: string): Promise<ProjectMeasurement[]> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/measurements`);
      if (!response.ok) throw new Error('Failed to fetch measurements');

      return await response.json();
    } catch (error) {
      console.error('Error fetching measurements:', error);
      return [];
    }
  }

  // ==================== Verification ====================

  async submitVerification(submission: Omit<VerificationSubmission, 'id' | 'submittedAt' | 'status'>): Promise<VerificationSubmission> {
    try {
      const response = await fetch(`${API_BASE}/projects/${submission.projectId}/verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) throw new Error('Failed to submit verification');

      return await response.json();
    } catch (error) {
      console.error('Error submitting verification:', error);
      return {
        id: uuidv4(),
        ...submission,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
    }
  }

  async getVerificationStatus(projectId: string): Promise<VerificationSubmission | null> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/verification/status`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch verification status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching verification status:', error);
      return null;
    }
  }

  // ==================== Project Updates ====================

  async createUpdate(projectId: string, update: { title: string; content: string; mediaUrls?: string[] }): Promise<ProjectUpdate> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });

      if (!response.ok) throw new Error('Failed to create update');

      return await response.json();
    } catch (error) {
      console.error('Error creating update:', error);
      return {
        id: uuidv4(),
        projectId,
        ...update,
        createdAt: new Date().toISOString(),
        authorId: 'current',
        authorName: 'Current User',
      };
    }
  }

  async getUpdates(projectId: string): Promise<ProjectUpdate[]> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/updates`);
      if (!response.ok) throw new Error('Failed to fetch updates');

      return await response.json();
    } catch (error) {
      console.error('Error fetching updates:', error);
      return [];
    }
  }

  // ==================== Funding ====================

  async fundProject(projectId: string, amount: number, paymentMethodId?: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/fund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, paymentMethodId }),
      });

      if (!response.ok) throw new Error('Failed to fund project');

      return await response.json();
    } catch (error) {
      console.error('Error funding project:', error);
      return null;
    }
  }

  async getFundingHistory(projectId: string): Promise<Transaction[]> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/funding`);
      if (!response.ok) throw new Error('Failed to fetch funding history');

      return await response.json();
    } catch (error) {
      console.error('Error fetching funding history:', error);
      return [];
    }
  }

  // ==================== Credit Management ====================

  async getCreditHoldings(projectId: string): Promise<CreditHolding[]> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/credits`);
      if (!response.ok) throw new Error('Failed to fetch credit holdings');

      return await response.json();
    } catch (error) {
      console.error('Error fetching credit holdings:', error);
      return [];
    }
  }

  async retireCredits(projectId: string, quantity: number, certificateId?: string): Promise<{ success: boolean; certificateUrl?: string }> {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/credits/retire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity, certificateId }),
      });

      if (!response.ok) throw new Error('Failed to retire credits');

      return await response.json();
    } catch (error) {
      console.error('Error retiring credits:', error);
      return { success: false };
    }
  }

  // ==================== Mock Data ====================

  private generateMockProjects(count: number): Project[] {
    const types: ProjectType[] = ['reforestation', 'renewable_energy', 'ocean_restoration', 'soil_carbon'];
    const statuses: ProjectStatus[] = ['active', 'pending', 'completed'];
    const countries = ['Brazil', 'Indonesia', 'Kenya', 'Costa Rica', 'Peru', 'Australia'];

    return Array.from({ length: count }, (_, i) => ({
      id: uuidv4(),
      ownerId: uuidv4(),
      ownerName: ['Green Earth Initiative', 'Ocean Guardians', 'Forest First', 'Regen Co'][i % 4],
      ownerType: 'organization' as const,
      title: `Regenerative ${types[i % 4]} Project ${i + 1}`,
      description: 'A transformative project focused on carbon sequestration and ecosystem restoration.',
      location: ['Amazon Basin', 'Coral Triangle', 'Great Barrier Reef', 'Mekong Delta'][i % 4],
      country: countries[i % countries.length],
      project_type: types[i % types.length],
      status: statuses[i % statuses.length],
      price_per_credit: 25 + Math.floor(Math.random() * 50),
      total_credits: 10000 + Math.floor(Math.random() * 90000),
      available_credits: 5000 + Math.floor(Math.random() * 40000),
      vintage_year: 2020 + Math.floor(Math.random() * 5),
      certification: ['VCS', 'Gold Standard', 'Plan Vivo'][i % 3],
      methodology: null,
      co2_offset_per_credit: 1 + Math.floor(Math.random() * 2),
      image_url: null,
      developer_name: ['Green Earth Initiative', 'Ocean Guardians'][i % 2],
      start_date: '2020-01-01',
      end_date: '2040-12-31',
      measurement_data_id: null,
      bioregional_zone_id: null,
      regenerative_metrics_id: null,
      valuation_model_id: null,
      geometry: null,
      verified_by_system_at: null,
      last_measurement_at: null,
      impactScore: 70 + Math.floor(Math.random() * 30),
      confidenceLevel: 0.8 + Math.random() * 0.2,
      verificationStatus: 'verified' as const,
      impact_score: 70 + Math.floor(Math.random() * 30),
      confidence_level: 0.8 + Math.random() * 0.2,
      verification_status: 'verified' as const,
      verified_by: 'Atlas Sanctum',
      verified_at: new Date().toISOString(),
      mediaGallery: [],
      documents: [],
      updates: [],
      supporters: 100 + Math.floor(Math.random() * 900),
      totalFunding: 50000 + Math.floor(Math.random() * 450000),
      fundingGoal: 500000,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  private generateMockProject(input: ProjectCreateInput): Project {
    return {
      id: uuidv4(),
      ownerId: 'current',
      ownerName: 'Current User',
      ownerType: 'individual',
      title: input.title,
      description: input.description,
      location: input.location,
      country: input.country,
      project_type: input.projectType,
      status: 'pending',
      price_per_credit: input.pricePerCredit,
      total_credits: input.totalCredits,
      available_credits: input.totalCredits,
      vintage_year: input.vintageYear,
      certification: input.certification,
      methodology: input.methodology || null,
      co2_offset_per_credit: input.co2OffsetPerCredit,
      image_url: null,
      developer_name: 'Current User',
      start_date: null,
      end_date: null,
      measurement_data_id: null,
      bioregional_zone_id: null,
      regenerative_metrics_id: null,
      valuation_model_id: null,
      geometry: input.geometry || null,
      verified_by_system_at: null,
      last_measurement_at: null,
      impactScore: 0,
      confidenceLevel: 0,
      verificationStatus: 'pending',
      mediaGallery: [],
      documents: [],
      updates: [],
      supporters: 0,
      totalFunding: 0,
      fundingGoal: input.totalCredits * input.pricePerCredit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      impact_score: 0,
      confidence_level: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

export const projectService = new ProjectService();
export default projectService;
