/**
 * hooks.ts
 *
 * Unified React Query hooks for all four ecosystems.
 * One import path for the entire app: '@/lib/sanctum/hooks'
 *
 * Query key factory ensures consistent cache namespacing:
 *   ['api',   ...rest]  — Express REST
 *   ['ai',    ...rest]  — FastAPI AI layer
 *   ['chain', ...rest]  — Cosmos SDK
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authApi, marketplaceApi, projectsApi, measurementsApi,
} from './api-client';
import {
  aiSystemApi, aiEcologyApi, aiCarbonApi, aiGovernanceApi,
  aiPolicyApi, aiTrustApi, aiForecastApi, aiAgentsApi, aiKnowledgeApi,
} from './ai-client';
import {
  chainStatusApi, chainIdentityApi, chainImpactApi,
  chainOracleApi, chainRegenApi, chainBankApi, chainTxApi,
} from './chain-client';
import type { LatLng, SatelliteObservation, PolicyCopilotRequest, CarbonRestorationPlan } from '@/sanctum-ai/AtlasSanctumAI.types';

// ─── Query key factory ────────────────────────────────────────────────────────

export const qk = {
  // REST API
  api: {
    me:           ['api', 'auth', 'me'] as const,
    market:       ['api', 'marketplace', 'market'] as const,
    listings:     (p: number, s: number) => ['api', 'marketplace', 'listings', p, s] as const,
    bonds:        ['api', 'marketplace', 'bonds'] as const,
    tradingVol:   ['api', 'marketplace', 'volume'] as const,
    transactions: (uid?: string) => ['api', 'transactions', uid] as const,
    projects:     (p: number, s: number, status?: string) => ['api', 'projects', p, s, status] as const,
    project:      (id: string) => ['api', 'project', id] as const,
    projectStats: (id: string) => ['api', 'project', id, 'stats'] as const,
    measurements: (pid: string, p: number) => ['api', 'measurements', pid, p] as const,
    anomalies:    (pid?: string) => ['api', 'anomalies', pid] as const,
    trends:       (pid: string, days: number) => ['api', 'trends', pid, days] as const,
  },
  // AI layer
  ai: {
    health:          ['ai', 'health'] as const,
    planetaryStatus: ['ai', 'planetary', 'status'] as const,
    ecologyAlerts:   ['ai', 'ecology', 'alerts'] as const,
    agentStatus:     ['ai', 'agents', 'status'] as const,
    carbonCredits:   ['ai', 'carbon', 'credits'] as const,
    knowledge:       (q: string) => ['ai', 'knowledge', q] as const,
    indigenous:      (community: string) => ['ai', 'knowledge', 'indigenous', community] as const,
    councilMembers:  (bioregion: string) => ['ai', 'governance', 'council', bioregion] as const,
    proposalTally:   (id: string) => ['ai', 'governance', 'tally', id] as const,
    auditTrail:      (pid: string) => ['ai', 'trust', 'audit', pid] as const,
    agentMemory:     (id: string) => ['ai', 'agents', 'memory', id] as const,
  },
  // Chain
  chain: {
    health:       ['chain', 'health'] as const,
    latestBlock:  ['chain', 'block', 'latest'] as const,
    user:         (addr: string) => ['chain', 'identity', 'user', addr] as const,
    usersByRole:  (role: string) => ['chain', 'identity', 'users', role] as const,
    impactRecord: (id: string) => ['chain', 'impact', id] as const,
    impactStatus: (status: string) => ['chain', 'impact', 'status', status] as const,
    impactByProv: (prov: string) => ['chain', 'impact', 'provider', prov] as const,
    oracle:       (addr: string) => ['chain', 'oracle', addr] as const,
    activeOracles: ['chain', 'oracle', 'active'] as const,
    regenProject: (id: string) => ['chain', 'regen', id] as const,
    regenByOwner: (owner: string) => ['chain', 'regen', 'owner', owner] as const,
    balances:     (addr: string) => ['chain', 'bank', 'balances', addr] as const,
    supply:       (denom: string) => ['chain', 'bank', 'supply', denom] as const,
  },
} as const;

// ─── REST API hooks ───────────────────────────────────────────────────────────

export const useCurrentUser = (enabled = true) =>
  useQuery({ queryKey: qk.api.me, queryFn: () => authApi.me(), enabled });

export const useRIUMarket = () =>
  useQuery({ queryKey: qk.api.market, queryFn: () => marketplaceApi.getMarket() });

export const useRIUListings = (page = 1, size = 20) =>
  useQuery({ queryKey: qk.api.listings(page, size), queryFn: () => marketplaceApi.getListings(page, size) });

export const useBonds = () =>
  useQuery({ queryKey: qk.api.bonds, queryFn: () => marketplaceApi.getBonds() });

export const useTradingVolume = () =>
  useQuery({ queryKey: qk.api.tradingVol, queryFn: () => marketplaceApi.getTradingVolume() });

export const useTransactions = (userId?: string) =>
  useQuery({
    queryKey: qk.api.transactions(userId),
    queryFn:  () => marketplaceApi.getTransactions(userId),
    enabled:  !!userId,
  });

export const useProjects = (page = 1, size = 20, status?: string) =>
  useQuery({
    queryKey: qk.api.projects(page, size, status),
    queryFn:  () => projectsApi.list(page, size, status),
  });

export const useProject = (id: string, enabled = true) =>
  useQuery({
    queryKey: qk.api.project(id),
    queryFn:  () => projectsApi.get(id),
    enabled:  !!id && enabled,
  });

export const useProjectStats = (id: string, enabled = true) =>
  useQuery({
    queryKey: qk.api.projectStats(id),
    queryFn:  () => projectsApi.stats(id),
    enabled:  !!id && enabled,
  });

export const useProjectMeasurements = (projectId: string, page = 1) =>
  useQuery({
    queryKey: qk.api.measurements(projectId, page),
    queryFn:  () => measurementsApi.byProject(projectId, page),
    enabled:  !!projectId,
  });

export const useAnomalies = (projectId?: string) =>
  useQuery({
    queryKey: qk.api.anomalies(projectId),
    queryFn:  () => measurementsApi.anomalies(projectId),
  });

export const useMeasurementTrends = (projectId: string, days = 365) =>
  useQuery({
    queryKey: qk.api.trends(projectId, days),
    queryFn:  () => measurementsApi.trends(projectId, days),
    enabled:  !!projectId,
  });

// Mutations — REST
export const usePurchaseRIU = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ riuId, buyerId, quantity }: { riuId: string; buyerId: string; quantity: number }) =>
      marketplaceApi.purchaseRIU(riuId, buyerId, quantity),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.api.market });
      void qc.invalidateQueries({ queryKey: ['api', 'marketplace', 'listings'] });
    },
  });
};

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => projectsApi.create(data),
    onSuccess:  () => void qc.invalidateQueries({ queryKey: ['api', 'projects'] }),
  });
};

export const useApproveProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => projectsApi.approve(id, notes),
    onSuccess:  (_, { id }) => {
      void qc.invalidateQueries({ queryKey: qk.api.project(id) });
      void qc.invalidateQueries({ queryKey: ['api', 'projects'] });
    },
  });
};

export const useRecordMeasurement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => measurementsApi.record(data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['api', 'measurements'] }),
  });
};

// ─── AI layer hooks ───────────────────────────────────────────────────────────

export const useAIHealth = () =>
  useQuery({ queryKey: qk.ai.health, queryFn: () => aiSystemApi.health(), staleTime: 30_000 });

export const usePlanetaryStatus = () =>
  useQuery({ queryKey: qk.ai.planetaryStatus, queryFn: () => aiSystemApi.planetaryStatus(), staleTime: 60_000 });

export const useEcologyAlerts = () =>
  useQuery({ queryKey: qk.ai.ecologyAlerts, queryFn: () => aiEcologyApi.alerts(), staleTime: 30_000 });

export const useAgentStatus = () =>
  useQuery({ queryKey: qk.ai.agentStatus, queryFn: () => aiAgentsApi.status(), staleTime: 15_000 });

export const useCarbonCredits = () =>
  useQuery({ queryKey: qk.ai.carbonCredits, queryFn: () => aiCarbonApi.credits() });

export const useKnowledgeSearch = (query: string, enabled = true) =>
  useQuery({
    queryKey: qk.ai.knowledge(query),
    queryFn:  () => aiKnowledgeApi.search(query),
    enabled:  !!query && enabled,
  });

export const useCouncilMembers = (bioregion: string) =>
  useQuery({
    queryKey: qk.ai.councilMembers(bioregion),
    queryFn:  () => aiGovernanceApi.councilMembers(bioregion),
    enabled:  !!bioregion,
  });

export const useProposalTally = (proposalId: string) =>
  useQuery({
    queryKey: qk.ai.proposalTally(proposalId),
    queryFn:  () => aiGovernanceApi.tally(proposalId),
    enabled:  !!proposalId,
  });

export const useAuditTrail = (projectId: string) =>
  useQuery({
    queryKey: qk.ai.auditTrail(projectId),
    queryFn:  () => aiTrustApi.auditTrail(projectId),
    enabled:  !!projectId,
  });

// AI mutations
export const useAssessEcology = () =>
  useMutation({
    mutationFn: ({ location, obs }: { location: LatLng; obs: SatelliteObservation }) =>
      aiEcologyApi.assess(location, obs),
  });

export const useValidateCarbon = () =>
  useMutation({
    mutationFn: ({ projectId, tonnes, evidence }: { projectId: string; tonnes: number; evidence: string[] }) =>
      aiCarbonApi.validate(projectId, tonnes, evidence),
  });

export const useDraftPolicy = () =>
  useMutation({ mutationFn: (req: PolicyCopilotRequest) => aiPolicyApi.draft(req) });

export const usePlanRestoration = () =>
  useMutation({
    mutationFn: ({ location, budget, projects }: { location: LatLng; budget: number; projects: CarbonRestorationPlan[] }) =>
      aiCarbonApi.planRestoration(location, budget, projects),
  });

export const useClimateforecast = () =>
  useMutation({
    mutationFn: ({ location, horizonYears }: { location: LatLng; horizonYears: 5 | 10 | 25 | 50 | 100 }) =>
      aiForecastApi.climate(location, horizonYears),
  });

export const useGenerateZKProof = () =>
  useMutation({
    mutationFn: ({ statement, privateInputs }: { statement: string; privateInputs: string[] }) =>
      aiTrustApi.generateZKProof(statement, privateInputs),
  });

export const useVoteProposal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ proposalId, vote }: { proposalId: string; vote: { voter: string; vote: 'yes' | 'no' | 'abstain' } }) =>
      aiGovernanceApi.vote(proposalId, vote),
    onSuccess: (_, { proposalId }) => void qc.invalidateQueries({ queryKey: qk.ai.proposalTally(proposalId) }),
  });
};

// ─── Chain hooks ──────────────────────────────────────────────────────────────

export const useChainHealth = () =>
  useQuery({ queryKey: qk.chain.health, queryFn: () => chainStatusApi.health(), staleTime: 10_000 });

export const useLatestBlock = () =>
  useQuery({ queryKey: qk.chain.latestBlock, queryFn: () => chainStatusApi.latestBlock(), staleTime: 6_000 });

export const useChainUser = (address: string) =>
  useQuery({
    queryKey: qk.chain.user(address),
    queryFn:  () => chainIdentityApi.getUser(address),
    enabled:  !!address,
  });

export const useUsersByRole = (role: string) =>
  useQuery({
    queryKey: qk.chain.usersByRole(role),
    queryFn:  () => chainIdentityApi.getUsersByRole(role),
    enabled:  !!role,
  });

export const useImpactRecord = (id: string) =>
  useQuery({
    queryKey: qk.chain.impactRecord(id),
    queryFn:  () => chainImpactApi.getRecord(id),
    enabled:  !!id,
  });

export const useImpactByStatus = (status: 'PENDING' | 'VERIFIED' | 'REJECTED') =>
  useQuery({ queryKey: qk.chain.impactStatus(status), queryFn: () => chainImpactApi.byStatus(status) });

export const useActiveOracles = () =>
  useQuery({ queryKey: qk.chain.activeOracles, queryFn: () => chainOracleApi.activeOracles() });

export const useRegenProject = (id: string) =>
  useQuery({
    queryKey: qk.chain.regenProject(id),
    queryFn:  () => chainRegenApi.getProject(id),
    enabled:  !!id,
  });

export const useTokenBalances = (address: string) =>
  useQuery({
    queryKey: qk.chain.balances(address),
    queryFn:  () => chainBankApi.balances(address),
    enabled:  !!address,
  });

export const useTokenSupply = (denom: 'usan' | 'uhlt' | 'ureg') =>
  useQuery({ queryKey: qk.chain.supply(denom), queryFn: () => chainBankApi.supplyOf(denom), staleTime: 60_000 });

export const useBroadcastTx = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (signedTxBytes: string) => chainTxApi.broadcast(signedTxBytes),
    onSuccess: () => {
      // Invalidate everything that a tx could affect
      void qc.invalidateQueries({ queryKey: ['chain'] });
    },
  });
};

// ─── Re-export clients for direct use ─────────────────────────────────────────
export {
  authApi, marketplaceApi, projectsApi, measurementsApi, paymentsApi,
} from './api-client';
export {
  aiSystemApi, aiEcologyApi, aiCarbonApi, aiGovernanceApi,
  aiPolicyApi, aiTrustApi, aiForecastApi, aiAgentsApi, aiKnowledgeApi,
} from './ai-client';
export {
  chainStatusApi, chainIdentityApi, chainImpactApi,
  chainOracleApi, chainRegenApi, chainBankApi, chainTxApi,
} from './chain-client';
