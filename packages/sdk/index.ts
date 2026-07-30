/**
 * @atlas-sanctum/sdk
 *
 * The official typed client SDK for Atlas Sanctum.
 * Covers all platform domains: impact, governance, AI, identity, marketplace.
 *
 * Usage:
 *   import { AtlasSanctumClient } from '@atlas-sanctum/sdk';
 *   const client = new AtlasSanctumClient({ apiUrl: 'https://api.atlassanctum.com', token });
 *   const metrics = await client.impact.getPlanetaryMetrics();
 */

// ─── Client Configuration ─────────────────────────────────────────────────────

export interface AtlasSanctumConfig {
  apiUrl: string;
  token?: string;
  version?: 'v1' | 'v2';
  timeout?: number;
}

// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface GeoLocation {
  lat: number;
  lng: number;
  region?: string;
  bioregion?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

// ─── Impact Domain ────────────────────────────────────────────────────────────

export interface PlanetaryMetrics {
  timestamp: string;
  carbonBudgetRemainingGt: number;
  biodiversityIntactnessIndex: number;
  oceanHealthIndex: number;
  freshwaterStressIndex: number;
  humanFlourishingIndex: number;
  activeRestorationProjects: number;
  hectaresProtected: number;
  carbonVerificationRate: number;
}

export interface ImpactProject {
  id: string;
  name: string;
  type: 'reforestation' | 'ocean_restoration' | 'soil_regeneration' | 'biodiversity' | 'community';
  location: GeoLocation;
  status: 'active' | 'verified' | 'completed' | 'pending';
  carbonSequesteredTonnes: number;
  biodiversityScore: number;
  communitiesImpacted: number;
  verificationLevel: 'self_reported' | 'third_party' | 'oracle_verified' | 'multi_source';
  createdAt: string;
  updatedAt: string;
}

export interface ImpactVerification {
  projectId: string;
  verifier: string;
  methodology: string;
  sequestrationTonnes: number;
  confidence: number;
  satelliteEvidence: string[];
  zkProofId?: string;
  onChainRef?: string;
  verifiedAt: string;
}

export interface RegenerativeCredit {
  id: string;
  type: 'carbon' | 'biodiversity' | 'water' | 'ocean' | 'community' | 'healthcare';
  projectId: string;
  amount: number;
  vintage: number;
  verified: boolean;
  retiredAt?: string;
  price?: number;
  currency?: string;
}

class ImpactClient {
  constructor(private readonly http: HttpClient) {}

  async getPlanetaryMetrics(): Promise<ApiResult<PlanetaryMetrics>> {
    return this.http.get('/v1/impact/planetary-metrics');
  }

  async listProjects(params?: {
    type?: ImpactProject['type'];
    status?: ImpactProject['status'];
    page?: number;
    pageSize?: number;
  }): Promise<ApiResult<PaginatedResponse<ImpactProject>>> {
    return this.http.get('/v1/impact/projects', params);
  }

  async getProject(id: string): Promise<ApiResult<ImpactProject>> {
    return this.http.get(`/v1/impact/projects/${id}`);
  }

  async submitVerification(data: Omit<ImpactVerification, 'verifiedAt'>): Promise<ApiResult<ImpactVerification>> {
    return this.http.post('/v1/impact/verifications', data);
  }

  async listCredits(params?: {
    type?: RegenerativeCredit['type'];
    verified?: boolean;
  }): Promise<ApiResult<PaginatedResponse<RegenerativeCredit>>> {
    return this.http.get('/v1/impact/credits', params);
  }
}

// ─── Governance Domain ────────────────────────────────────────────────────────

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  type: 'policy' | 'constitutional_amendment' | 'resource_allocation' | 'partnership';
  status: 'draft' | 'deliberation' | 'voting' | 'passed' | 'rejected' | 'vetoed';
  affectedBioregions: string[];
  sevenGenerationImpact: string;
  votingDeadline: string;
  createdAt: string;
}

export interface GovernanceVote {
  proposalId: string;
  voter: string;
  vote: 'yes' | 'no' | 'abstain';
  rationale?: string;
  weight: number;
  castAt: string;
}

export interface GovernanceTally {
  proposalId: string;
  yesWeight: number;
  noWeight: number;
  abstainWeight: number;
  quorumReached: boolean;
  supermajorityReached: boolean;
  outcome?: 'passed' | 'rejected' | 'pending';
}

class GovernanceClient {
  constructor(private readonly http: HttpClient) {}

  async listProposals(params?: {
    status?: GovernanceProposal['status'];
    type?: GovernanceProposal['type'];
  }): Promise<ApiResult<PaginatedResponse<GovernanceProposal>>> {
    return this.http.get('/v1/governance/proposals', params);
  }

  async getProposal(id: string): Promise<ApiResult<GovernanceProposal>> {
    return this.http.get(`/v1/governance/proposals/${id}`);
  }

  async submitProposal(data: Omit<GovernanceProposal, 'id' | 'status' | 'createdAt'>): Promise<ApiResult<GovernanceProposal>> {
    return this.http.post('/v1/governance/proposals', data);
  }

  async castVote(vote: Omit<GovernanceVote, 'castAt'>): Promise<ApiResult<GovernanceVote>> {
    return this.http.post(`/v1/governance/proposals/${vote.proposalId}/votes`, vote);
  }

  async getTally(proposalId: string): Promise<ApiResult<GovernanceTally>> {
    return this.http.get(`/v1/governance/proposals/${proposalId}/tally`);
  }
}

// ─── AI Domain ────────────────────────────────────────────────────────────────

export type CivilizationalRequestType =
  | 'ecological_assessment'
  | 'policy_design'
  | 'carbon_validation'
  | 'disaster_response'
  | 'governance_proposal'
  | 'restoration_planning'
  | 'planetary_simulation';

export interface AIRequest {
  type: CivilizationalRequestType;
  location?: GeoLocation;
  context: Record<string, unknown>;
  language?: string;
}

export interface AIResponse {
  requestId: string;
  type: CivilizationalRequestType;
  permitted: boolean;
  ethicsScore: number;
  results: Record<string, unknown>;
  recommendations: string[];
  explanation: string;
  auditEntryId: string;
  timestamp: string;
}

export interface AgentStatus {
  agentId: string;
  role: string;
  status: 'idle' | 'active' | 'deliberating' | 'blocked' | 'error';
  lastActionAt?: string;
  ethicsScore?: number;
}

class AIClient {
  constructor(private readonly http: HttpClient) {}

  async process(request: AIRequest): Promise<ApiResult<AIResponse>> {
    return this.http.post('/v1/ai/process', request);
  }

  async listAgents(): Promise<ApiResult<AgentStatus[]>> {
    return this.http.get('/v1/ai/agents');
  }

  async getExplainability(actionId: string): Promise<ApiResult<{
    actionId: string;
    plainLanguageSummary: string;
    logicalSteps: string[];
    alternativesConsidered: string[];
    appealDeadline: string;
  }>> {
    return this.http.get(`/v1/ai/explainability/${actionId}`);
  }
}

// ─── Identity Domain ──────────────────────────────────────────────────────────

export interface IdentityProfile {
  did: string;
  displayName: string;
  role: 'individual' | 'organization' | 'institution' | 'ai_agent' | 'community';
  verificationLevel: 'unverified' | 'email' | 'kyc' | 'institutional';
  covenantBindings: string[];
  reputationScore: number;
  createdAt: string;
}

class IdentityClient {
  constructor(private readonly http: HttpClient) {}

  async getProfile(did: string): Promise<ApiResult<IdentityProfile>> {
    return this.http.get(`/v1/identity/profiles/${did}`);
  }

  async getMyProfile(): Promise<ApiResult<IdentityProfile>> {
    return this.http.get('/v1/identity/me');
  }
}

// ─── Marketplace Domain ───────────────────────────────────────────────────────

export interface MarketplaceListing {
  id: string;
  creditType: RegenerativeCredit['type'];
  projectId: string;
  projectName: string;
  amount: number;
  pricePerUnit: number;
  currency: string;
  vintage: number;
  verified: boolean;
  seller: string;
  expiresAt?: string;
  createdAt: string;
}

export interface MarketplaceOrder {
  id: string;
  listingId: string;
  buyer: string;
  amount: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'settled' | 'cancelled';
  txHash?: string;
  createdAt: string;
}

class MarketplaceClient {
  constructor(private readonly http: HttpClient) {}

  async listListings(params?: {
    creditType?: RegenerativeCredit['type'];
    verified?: boolean;
    minVintage?: number;
  }): Promise<ApiResult<PaginatedResponse<MarketplaceListing>>> {
    return this.http.get('/v1/marketplace/listings', params);
  }

  async getListing(id: string): Promise<ApiResult<MarketplaceListing>> {
    return this.http.get(`/v1/marketplace/listings/${id}`);
  }

  async placeOrder(data: { listingId: string; amount: number }): Promise<ApiResult<MarketplaceOrder>> {
    return this.http.post('/v1/marketplace/orders', data);
  }

  async getOrder(id: string): Promise<ApiResult<MarketplaceOrder>> {
    return this.http.get(`/v1/marketplace/orders/${id}`);
  }
}

// ─── HTTP Client ──────────────────────────────────────────────────────────────

class HttpClient {
  constructor(private readonly config: AtlasSanctumConfig) {}

  async get<T>(path: string, params?: Record<string, unknown>): Promise<ApiResult<T>> {
    const url = new URL(`${this.config.apiUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v));
      });
    }
    return this.request<T>(url.toString(), { method: 'GET' });
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
    return this.request<T>(`${this.config.apiUrl}${path}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private async request<T>(url: string, init: RequestInit): Promise<ApiResult<T>> {
    try {
      const res = await fetch(url, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.token ? { Authorization: `Bearer ${this.config.token}` } : {}),
        },
        signal: AbortSignal.timeout(this.config.timeout ?? 30_000),
      });

      if (!res.ok) {
        const error: ApiError = await res.json().catch(() => ({
          code: `HTTP_${res.status}`,
          message: res.statusText,
        }));
        return { ok: false, error };
      }

      const data: T = await res.json();
      return { ok: true, data };
    } catch (e) {
      return {
        ok: false,
        error: { code: 'NETWORK_ERROR', message: (e as Error).message },
      };
    }
  }
}

// ─── Main Client ──────────────────────────────────────────────────────────────

export class AtlasSanctumClient {
  readonly impact:      ImpactClient;
  readonly governance:  GovernanceClient;
  readonly ai:          AIClient;
  readonly identity:    IdentityClient;
  readonly marketplace: MarketplaceClient;

  constructor(config: AtlasSanctumConfig) {
    const http = new HttpClient(config);
    this.impact      = new ImpactClient(http);
    this.governance  = new GovernanceClient(http);
    this.ai          = new AIClient(http);
    this.identity    = new IdentityClient(http);
    this.marketplace = new MarketplaceClient(http);
  }
}

export default AtlasSanctumClient;
