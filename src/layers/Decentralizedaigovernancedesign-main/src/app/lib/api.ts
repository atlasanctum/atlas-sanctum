// API Client for Decentralized AI Governance Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/decentralized-api';
const API_TIMEOUT = 30000;

// Types
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any };
  timestamp: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

class GovernanceError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GovernanceError';
  }
}

export class APIClient {
  private baseURL: string;
  private timeout: number;
  private authToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new GovernanceError(
          data.error?.code || 'API_ERROR',
          data.error?.message || 'API request failed',
          data.error?.details
        );
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new GovernanceError('TIMEOUT', 'Request timeout');
      }

      if (error instanceof GovernanceError) {
        throw error;
      }

      throw new GovernanceError('NETWORK_ERROR', error.message || 'Network error occurred');
    }
  }

  // Proposals
  async getProposals(params?: { status?: string; type?: string; page?: number; limit?: number }): Promise<APIResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return this.request(`/proposals${query ? `?${query}` : ''}`);
  }

  async getProposal(id: string): Promise<APIResponse<any>> {
    return this.request(`/proposals/${id}`);
  }

  async createProposal(data: { title: string; description: string; proposal_type: string; voting_mechanism: string; choices?: string[]; quorum?: number; start_at?: string; end_at?: string }): Promise<APIResponse<any>> {
    return this.request('/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Voting
  async getVotes(proposalId: string): Promise<APIResponse<{ items: any[] }>> {
    return this.request(`/voting/proposal/${proposalId}`);
  }

  async castVote(data: { proposal_id: string; choice: string; voting_power: number; justification?: string }): Promise<APIResponse<any>> {
    return this.request('/voting', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getVotingResults(proposalId: string): Promise<APIResponse<any>> {
    return this.request(`/voting/results/${proposalId}`);
  }

  // Delegation
  async createDelegation(data: { delegate_id: string; voting_power: number; domains?: string[]; expires_at?: string }): Promise<APIResponse<any>> {
    return this.request('/delegation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDelegationStats(): Promise<APIResponse<any>> {
    return this.request('/delegation/stats');
  }

  // Challenges
  async createChallenge(data: { proposal_id: string; bond: number; reason: string; evidence?: string[] }): Promise<APIResponse<any>> {
    return this.request('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getActiveChallenges(): Promise<APIResponse<any[]>> {
    return this.request('/challenges/active');
  }

  // Impact & RPGF
  async getRGFRounds(): Promise<APIResponse<any[]>> {
    return this.request('/impact/rounds');
  }

  async createRGFProject(data: { round_id: string; title: string; description: string; impact_report?: string; impact_metrics?: any; funding_requested: number }): Promise<APIResponse<any>> {
    return this.request('/impact/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getImpactCertificates(): Promise<APIResponse<any[]>> {
    return this.request('/impact/certificates');
  }

  // Reputation
  async getReputation(memberId: string): Promise<APIResponse<any>> {
    return this.request(`/reputation/${memberId}`);
  }

  async getLeaderboard(): Promise<APIResponse<any[]>> {
    return this.request('/reputation/leaderboard');
  }

  // Analytics
  async getAnalyticsOverview(): Promise<APIResponse<any>> {
    return this.request('/analytics/overview');
  }

  async getThreats(): Promise<APIResponse<any[]>> {
    return this.request('/analytics/threats');
  }

  // Members
  async getMembers(limit?: number): Promise<APIResponse<{ items: any[] }>> {
    return this.request(`/members${limit ? `?limit=${limit}` : ''}`);
  }

  async createOrUpdateMember(data: { wallet_address: string; display_name?: string; bio?: string; avatar_url?: string }): Promise<APIResponse<any>> {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDomains(): Promise<APIResponse<any[]>> {
    return this.request('/domains');
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Utility: Retry failed requests
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (error.code === 'VALIDATION_ERROR' || error.code === 'AUTH_ERROR') {
        throw error;
      }

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Utility: Batch requests
export async function batchRequests<T>(
  requests: (() => Promise<T>)[],
  batchSize: number = 5
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(req => req()));
    results.push(...batchResults);
  }

  return results;
}

// Export types
export type { APIResponse, PaginatedResponse, GovernanceError };
