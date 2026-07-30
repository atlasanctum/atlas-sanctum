/**
 * Atlas Sanctum — Five Intelligence Models
 * React Query hooks for all five engines.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/atlasClient';

const BASE = '/v3/intelligence';

// ─── Types (mirrors backend) ──────────────────────────────────────────────────

export interface FlourishingSnapshot {
  id: string;
  entityId: string;
  entityType: string;
  entityName: string;
  physicalHealth: number;
  mentalWellbeing: number;
  education: number;
  employment: number;
  incomeMobility: number;
  communityTrust: number;
  environmentalQuality: number;
  purposeMeaning: number;
  flourishingScore: number;
  communityResilienceScore: number;
  futureOpportunityIndex: number;
  riskIndicators: Array<{ dimension: string; severity: string; value: number; description: string }>;
  rootCauses: Array<{ factor: string; contribution: number; direction: string; intervention: string }>;
  confidence: number;
  measuredAt: string;
}

export interface FlourishingTrend {
  entityId: string;
  entityName: string;
  snapshots: Array<{ measuredAt: string; flourishingScore: number }>;
  trend: 'improving' | 'stable' | 'declining';
  changeRate: number;
  forecast90d: number;
}

export interface RegenerativeValuation {
  id: string;
  projectId: string;
  projectName: string;
  regenerativeValueScore: number;
  ecologicalRoi: number;
  restorationYield: number;
  circularEconomyIndex: number;
  hiddenCostsUsd: number;
  hiddenBenefitsUsd: number;
  trueValueUsd: number;
  verdict: 'regenerative' | 'neutral' | 'extractive';
  breakdown: {
    carbonValueUsd: number;
    waterValueUsd: number;
    biodiversityValueUsd: number;
    soilValueUsd: number;
    employmentValueUsd: number;
    communityValueUsd: number;
    totalEcologicalUsd: number;
    totalSocialUsd: number;
  };
  createdAt: string;
}

export interface InnovationSignal {
  id: string;
  signalType: string;
  title: string;
  description: string;
  tags: string[];
  innovationProbability: number;
  adoptionForecastYrs: number;
  breakthroughPotential: number;
  intersectingDomains: string[];
  detectedAt: string;
}

export interface InnovationOpportunity {
  id: string;
  title: string;
  description: string;
  domains: string[];
  opportunityScore: number;
  timeHorizonYrs: number;
  marketSizeUsd: number;
  keyDependencies: string[];
  recommendedActions: string[];
  status: string;
  signalCount: number;
}

export interface EthicalEvaluation {
  id: string;
  evaluationRef: string;
  entityType: string;
  proposedAction: string;
  ethicalRiskScore: number;
  humanBenefitScore: number;
  longTermSustainability: number;
  utilitarianScore: number;
  rightsBased: number;
  virtueEthics: number;
  indigenousEthics: number;
  violations: Array<{ principle: string; lens: string; severity: string; description: string; mitigation: string }>;
  recommendedActions: string[];
  requiresHumanReview: boolean;
  auditTrail: string;
  evaluatedAt: string;
}

export interface EcosystemAssessment {
  id: string;
  regionId: string;
  regionName: string;
  regionType: string;
  areaHectares: number;
  ecosystemHealthScore: number;
  carbonScore: number;
  waterScore: number;
  biodiversityScore: number;
  soilScore: number;
  resilienceScore: number;
  trend: 'recovering' | 'stable' | 'degrading' | 'critical' | 'unknown';
  trendConfidence: number;
  restorationOpportunities: Array<{
    type: string; priority: string; estimatedCostUsd: number;
    estimatedBenefitUsd: number; roi: number; timeToImpactYears: number; description: string;
  }>;
  environmentalAlerts: Array<{ metric: string; severity: string; currentValue: number; description: string; recommendedAction: string }>;
  scenarios: {
    baseline: { name: string; year5Score: number; year10Score: number; year25Score: number; carbonSequestrationT: number; biodiversityTrend: string };
    intervention: { name: string; year5Score: number; year10Score: number; year25Score: number; carbonSequestrationT: number; biodiversityTrend: string };
    worstCase: { name: string; year5Score: number; year10Score: number; year25Score: number; carbonSequestrationT: number; biodiversityTrend: string };
  };
  assessedAt: string;
}

// ─── Model I — Human Flourishing ─────────────────────────────────────────────

export function useFlourishingSnapshot(entityId: string) {
  return useQuery({
    queryKey: ['flourishing', 'snapshot', entityId],
    queryFn: () => apiFetch<{ success: boolean; data: FlourishingSnapshot }>(`${BASE}/flourishing/snapshots/${entityId}`).then(r => r.data),
    enabled: !!entityId,
  });
}

export function useFlourishingTrend(entityId: string, days = 180) {
  return useQuery({
    queryKey: ['flourishing', 'trend', entityId, days],
    queryFn: () => apiFetch<{ success: boolean; data: FlourishingTrend }>(`${BASE}/flourishing/trends/${entityId}?days=${days}`).then(r => r.data),
    enabled: !!entityId,
  });
}

export function useFlourishingDashboard(entityType?: string) {
  return useQuery({
    queryKey: ['flourishing', 'dashboard', entityType],
    queryFn: () => apiFetch<{ success: boolean; data: Record<string, unknown> }>(`${BASE}/flourishing/dashboard${entityType ? `?entityType=${entityType}` : ''}`).then(r => r.data),
  });
}

export function useRecordFlourishing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Record<string, unknown>) =>
      apiFetch<{ success: boolean; data: FlourishingSnapshot }>(`${BASE}/flourishing/snapshots`, { method: 'POST', body: JSON.stringify(input) }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['flourishing'] }),
  });
}

export function useCompareFlourishingEntities() {
  return useMutation({
    mutationFn: (entityIds: string[]) =>
      apiFetch<{ success: boolean; data: unknown }>(`${BASE}/flourishing/compare`, { method: 'POST', body: JSON.stringify({ entityIds }) }).then(r => r.data),
  });
}

// ─── Model II — Regenerative Economy ─────────────────────────────────────────

export function useRegenerativeValuation(projectId: string) {
  return useQuery({
    queryKey: ['regen', 'valuation', projectId],
    queryFn: () => apiFetch<{ success: boolean; data: RegenerativeValuation }>(`${BASE}/regenerative-economy/projects/${projectId}`).then(r => r.data),
    enabled: !!projectId,
  });
}

export function useRegenerativeLeaderboard(limit = 20) {
  return useQuery({
    queryKey: ['regen', 'leaderboard', limit],
    queryFn: () => apiFetch<{ success: boolean; data: { projects: RegenerativeValuation[] } }>(`${BASE}/regenerative-economy/leaderboard?limit=${limit}`).then(r => r.data),
  });
}

export function useValuateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Record<string, unknown>) =>
      apiFetch<{ success: boolean; data: RegenerativeValuation }>(`${BASE}/regenerative-economy/valuate`, { method: 'POST', body: JSON.stringify(input) }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['regen'] }),
  });
}

// ─── Model III — Innovation Genesis ──────────────────────────────────────────

export function useInnovationSignals(limit = 20, type?: string) {
  return useQuery({
    queryKey: ['innovation', 'signals', limit, type],
    queryFn: () => apiFetch<{ success: boolean; data: InnovationSignal[] }>(`${BASE}/innovation/signals?limit=${limit}${type ? `&type=${type}` : ''}`).then(r => r.data),
  });
}

export function useInnovationOpportunities() {
  return useQuery({
    queryKey: ['innovation', 'opportunities'],
    queryFn: () => apiFetch<{ success: boolean; data: InnovationOpportunity[] }>(`${BASE}/innovation/opportunities`).then(r => r.data),
  });
}

export function useIngestSignal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Record<string, unknown>) =>
      apiFetch<{ success: boolean; data: InnovationSignal }>(`${BASE}/innovation/signals`, { method: 'POST', body: JSON.stringify(input) }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['innovation'] }),
  });
}

// ─── Model IV — Ethical Decision ─────────────────────────────────────────────

export function useEthicsHistory(ref: string) {
  return useQuery({
    queryKey: ['ethics', 'history', ref],
    queryFn: () => apiFetch<{ success: boolean; data: EthicalEvaluation[] }>(`${BASE}/ethics/history/${ref}`).then(r => r.data),
    enabled: !!ref,
  });
}

export function useEthicsPendingReviews() {
  return useQuery({
    queryKey: ['ethics', 'pending'],
    queryFn: () => apiFetch<{ success: boolean; data: EthicalEvaluation[] }>(`${BASE}/ethics/pending-reviews`).then(r => r.data),
  });
}

export function useEvaluateEthics() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Record<string, unknown>) =>
      apiFetch<{ success: boolean; data: EthicalEvaluation }>(`${BASE}/ethics/evaluate`, { method: 'POST', body: JSON.stringify(input) }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ethics'] }),
  });
}

// ─── Model V — Ecosystem Intelligence ────────────────────────────────────────

export function useEcosystemAssessment(regionId: string) {
  return useQuery({
    queryKey: ['ecosystem', 'assessment', regionId],
    queryFn: () => apiFetch<{ success: boolean; data: EcosystemAssessment }>(`${BASE}/ecosystem/regions/${regionId}`).then(r => r.data),
    enabled: !!regionId,
  });
}

export function useEcosystemHistory(regionId: string, days = 365) {
  return useQuery({
    queryKey: ['ecosystem', 'history', regionId, days],
    queryFn: () => apiFetch<{ success: boolean; data: Array<{ assessedAt: string; healthScore: number; trend: string }> }>(`${BASE}/ecosystem/regions/${regionId}/history?days=${days}`).then(r => r.data),
    enabled: !!regionId,
  });
}

export function useEcosystemGlobalDashboard() {
  return useQuery({
    queryKey: ['ecosystem', 'global'],
    queryFn: () => apiFetch<{ success: boolean; data: Record<string, unknown> }>(`${BASE}/ecosystem/dashboard`).then(r => r.data),
  });
}

export function useEcosystemCriticalRegions(limit = 10) {
  return useQuery({
    queryKey: ['ecosystem', 'critical', limit],
    queryFn: () => apiFetch<{ success: boolean; data: EcosystemAssessment[] }>(`${BASE}/ecosystem/critical?limit=${limit}`).then(r => r.data),
  });
}

export function useAssessEcosystem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Record<string, unknown>) =>
      apiFetch<{ success: boolean; data: EcosystemAssessment }>(`${BASE}/ecosystem/assess`, { method: 'POST', body: JSON.stringify(input) }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ecosystem'] }),
  });
}

// ─── Cross-model: Decision Support Log ───────────────────────────────────────

export function useLogDecision() {
  return useMutation({
    mutationFn: (input: { model: string; sourceId: string; decisionMade: string; decisionMaker?: string }) =>
      apiFetch<{ success: boolean; data: unknown }>(`${BASE}/decisions`, { method: 'POST', body: JSON.stringify(input) }).then(r => r.data),
  });
}

export function useRecordOutcome() {
  return useMutation({
    mutationFn: ({ id, outcome, outcomeScore, feedback }: { id: string; outcome: string; outcomeScore?: number; feedback?: string }) =>
      apiFetch<{ success: boolean; data: unknown }>(`${BASE}/decisions/${id}/outcome`, { method: 'PATCH', body: JSON.stringify({ outcome, outcomeScore, feedback }) }).then(r => r.data),
  });
}
