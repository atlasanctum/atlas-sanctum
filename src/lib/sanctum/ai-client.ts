/**
 * ai-client.ts
 *
 * Typed client for the Atlas Sanctum AI v3 FastAPI layer.
 * Bridges the TypeScript front-end to the Python AI backend
 * that implements the 10-layer architecture defined in
 * src/sanctum-ai/AtlasSanctumAI.types.ts.
 */

import { sanctumFetch } from './http';
import { SANCTUM_CONFIG } from './config';
import type {
  LatLng,
  SatelliteObservation,
  CarbonRestorationPlan,
  PolicyCopilotRequest,
  ClimateScenario,
  ResourceAllocation,
  PlanetaryDashboardMetrics,
  CarbonValidationRecord,
  ZKProofBundle,
} from '@/sanctum-ai/AtlasSanctumAI.types';

const V3 = SANCTUM_CONFIG.ai.v3;

// ─── System ───────────────────────────────────────────────────────────────────

export const aiSystemApi = {
  health: () =>
    sanctumFetch<{ status: string; layers: number; agents: number; version: string }>(`${V3}/health`),

  planetaryStatus: () =>
    sanctumFetch<PlanetaryDashboardMetrics>(`${V3}/planetary/status`),

  simulate: (scenario: { interventions: CarbonRestorationPlan[]; horizonYears: number }) =>
    sanctumFetch<{ projectedOutcomes: Record<string, number>; confidenceInterval: [number, number] }>(
      `${V3}/planetary/simulate`,
      { method: 'POST', body: JSON.stringify(scenario) },
    ),
};

// ─── Ecology / Perception ─────────────────────────────────────────────────────

export const aiEcologyApi = {
  assess: (location: LatLng, satelliteObs: SatelliteObservation) =>
    sanctumFetch<{ ndvi: number; carbonDensity: number; biodiversityScore: number; alerts: string[] }>(
      `${V3}/ecology/assess`,
      { method: 'POST', body: JSON.stringify({ location, satelliteObs }) },
    ),

  satellite: (obs: SatelliteObservation) =>
    sanctumFetch<{ analysis: Record<string, number> }>(`${V3}/ecology/satellite`, {
      method: 'POST',
      body: JSON.stringify(obs),
    }),

  alerts: () =>
    sanctumFetch<{ alerts: Array<{ severity: string; message: string; location: LatLng }> }>(
      `${V3}/ecology/alerts`,
    ),
};

// ─── Carbon & Restoration ─────────────────────────────────────────────────────

export const aiCarbonApi = {
  validate: (projectId: string, claimedTonnes: number, evidence: string[]) =>
    sanctumFetch<CarbonValidationRecord>(`${V3}/carbon/validate`, {
      method: 'POST',
      body: JSON.stringify({ projectId, claimedTonnes, evidence }),
    }),

  planRestoration: (location: LatLng, budget: number, projects: CarbonRestorationPlan[]) =>
    sanctumFetch<{ plan: CarbonRestorationPlan[]; totalSequestration: number; roi: number }>(
      `${V3}/restoration/plan`,
      { method: 'POST', body: JSON.stringify({ location, budget, projects }) },
    ),

  credits: () => sanctumFetch<{ credits: unknown[] }>(`${V3}/carbon/credits`),
};

// ─── Governance ───────────────────────────────────────────────────────────────

export const aiGovernanceApi = {
  submitProposal: (proposal: Record<string, unknown>) =>
    sanctumFetch<{ proposalId: string; status: string }>(`${V3}/governance/proposals`, {
      method: 'POST',
      body: JSON.stringify(proposal),
    }),

  vote: (proposalId: string, vote: { voter: string; vote: 'yes' | 'no' | 'abstain'; weight?: number }) =>
    sanctumFetch<{ recorded: boolean }>(`${V3}/governance/proposals/${proposalId}/vote`, {
      method: 'POST',
      body: JSON.stringify(vote),
    }),

  tally: (proposalId: string) =>
    sanctumFetch<{ yes: number; no: number; abstain: number; outcome: string }>(
      `${V3}/governance/proposals/${proposalId}/tally`,
    ),

  councilMembers: (bioregion: string) =>
    sanctumFetch<{ members: unknown[] }>(`${V3}/governance/councils/${bioregion}`),
};

// ─── Policy ───────────────────────────────────────────────────────────────────

export const aiPolicyApi = {
  draft: (req: PolicyCopilotRequest) =>
    sanctumFetch<{ draft: string; recommendations: string[] }>(`${V3}/policy/draft`, {
      method: 'POST',
      body: JSON.stringify(req),
    }),

  analyzeTreaty: (treatyText: string, jurisdiction: string) =>
    sanctumFetch<{ obligations: string[]; rights: string[]; indigenousRightsScore: number }>(
      `${V3}/policy/treaty/analyze`,
      { method: 'POST', body: JSON.stringify({ treatyText, jurisdiction }) },
    ),
};

// ─── Agents ───────────────────────────────────────────────────────────────────

export const aiAgentsApi = {
  status: () =>
    sanctumFetch<{ agents: Array<{ id: string; role: string; status: string }> }>(`${V3}/agents`),

  coordinate: (request: Record<string, unknown>) =>
    sanctumFetch<{ result: unknown; agentsInvolved: string[] }>(`${V3}/agents/coordinate`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  memory: (agentId: string) =>
    sanctumFetch<{ memories: unknown[] }>(`${V3}/agents/${agentId}/memory`),
};

// ─── Trust & Verification ─────────────────────────────────────────────────────

export const aiTrustApi = {
  verifyImpact: (projectId: string, claimedTonnes: number, evidence: string[]) =>
    sanctumFetch<{ verified: boolean; confidence: number; record: CarbonValidationRecord }>(
      `${V3}/trust/verify`,
      { method: 'POST', body: JSON.stringify({ projectId, claimedTonnes, evidence }) },
    ),

  generateZKProof: (statement: string, privateInputs: string[]) =>
    sanctumFetch<ZKProofBundle>(`${V3}/trust/zkproof`, {
      method: 'POST',
      body: JSON.stringify({ statement, privateInputs }),
    }),

  auditTrail: (projectId: string) =>
    sanctumFetch<{ records: unknown[] }>(`${V3}/trust/audit/${projectId}`),
};

// ─── Forecasting ──────────────────────────────────────────────────────────────

export const aiForecastApi = {
  climate: (location: LatLng, horizonYears: 5 | 10 | 25 | 50 | 100) =>
    sanctumFetch<{ scenarios: ClimateScenario[] }>(`${V3}/forecast/climate`, {
      method: 'POST',
      body: JSON.stringify({ location, horizonYears }),
    }),

  risk: (context: Record<string, unknown>) =>
    sanctumFetch<{ risks: unknown[] }>(`${V3}/forecast/risk`, {
      method: 'POST',
      body: JSON.stringify(context),
    }),
};

// ─── Optimisation ─────────────────────────────────────────────────────────────

export const aiOptimizeApi = {
  resources: (
    resourceType: ResourceAllocation['resourceType'],
    totalAvailable: number,
    recipients: { id: string; need: number; priority: number }[],
  ) =>
    sanctumFetch<ResourceAllocation>(`${V3}/optimize/resources`, {
      method: 'POST',
      body: JSON.stringify({ resourceType, totalAvailable, recipients }),
    }),

  energy: (grid: Record<string, unknown>) =>
    sanctumFetch<{ dispatch: unknown[] }>(`${V3}/optimize/energy`, {
      method: 'POST',
      body: JSON.stringify(grid),
    }),

  water: (watershed: Record<string, unknown>) =>
    sanctumFetch<{ plan: unknown }>(`${V3}/optimize/water`, {
      method: 'POST',
      body: JSON.stringify(watershed),
    }),
};

// ─── Knowledge ────────────────────────────────────────────────────────────────

export const aiKnowledgeApi = {
  search: (query: string, topK = 10) =>
    sanctumFetch<{ results: unknown[] }>(`${V3}/knowledge/search`, {
      method: 'POST',
      body: JSON.stringify({ query, topK }),
    }),

  indigenous: (community: string) =>
    sanctumFetch<{ knowledge: unknown[] }>(`${V3}/knowledge/indigenous/${community}`),
};
