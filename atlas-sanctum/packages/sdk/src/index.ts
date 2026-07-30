/**
 * Atlas Sanctum SDK
 * Typed client for frontend-backend communication
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// ==================== Types ====================

export interface Region {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  vulnerabilityIndex: number;
}

export interface RiskSnapshot {
  id: string;
  regionId: string;
  rainfallMm24h: number;
  riverLevelMeters?: number;
  soilSaturation?: number;
  forecastRainMm48h?: number;
  vulnerabilityIndex: number;
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  modelVersion: string;
  createdAt: string;
}

export interface Covenant {
  id: string;
  onchainId?: string;
  title: string;
  description?: string;
  regionId: string;
  triggerType: string;
  minRiskScore: number;
  reserveRequiredUsd: number;
  payoutAmountUsd: number;
  autoExecute: boolean;
  status: 'draft' | 'armed' | 'triggered' | 'executed' | 'verified' | 'failed';
  createdBy?: string;
  createdAt: string;
}

export interface ReserveAccount {
  id: string;
  name: string;
  assetSymbol: string;
  currentBalance: number;
  committedBalance: number;
  proofStatus: 'verified' | 'stale' | 'unverified';
  lastCheckedAt?: string;
}

export interface Intervention {
  id: string;
  covenantId: string;
  regionId: string;
  type: 'cash_release' | 'supply_dispatch' | 'hybrid';
  amountUsd: number;
  txHash?: string;
  executionStatus: 'pending' | 'submitted' | 'confirmed' | 'failed';
  createdAt: string;
}

export interface CovenantEligibility {
  covenantId: string;
  eligible: boolean;
  checks: {
    riskThresholdMet: boolean;
    reserveVerified: boolean;
    sufficientBalance: boolean;
    covenantArmed: boolean;
    cooldownPassed: boolean;
  };
  details: {
    currentRiskScore: number;
    requiredRiskScore: number;
    reserveStatus: string;
    availableBalance: number;
    requiredBalance: number;
    covenantStatus: string;
    lastExecutionTime?: string;
  };
}

export interface DashboardSummary {
  activeCovenants: number;
  criticalRegions: number;
  verifiedInterventions: number;
  reserveCoverageUsd: number;
}

export interface VerificationEvidence {
  interventionId: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'json';
  latitude?: number;
  longitude?: number;
  timestamp: string;
  notes?: string;
  hash: string;
}

export interface ImpactReport {
  interventionId: string;
  deliveryConfirmed: boolean;
  householdsReached?: number;
  suppliesDelivered?: number;
  confidenceScore: number;
}

// ==================== API Client ====================

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// ==================== Auth ====================

export async function getWalletNonce(): Promise<{ nonce: string }> {
  return fetchApi('/auth/wallet/nonce', { method: 'POST' });
}

export async function verifyWallet(
  address: string,
  signature: string
): Promise<{ token: string; user: { id: string; role: string; address: string } }> {
  return fetchApi('/auth/wallet/verify', {
    method: 'POST',
    body: JSON.stringify({ address, signature }),
  });
}

// ==================== Regions ====================

export async function getRegions(): Promise<Region[]> {
  return fetchApi('/regions');
}

export async function getRegion(id: string): Promise<Region> {
  return fetchApi(`/regions/${id}`);
}

// ==================== Risk ====================

export async function ingestRiskData(data: {
  regionId: string;
  rainfallMm24h: number;
  forecastRainMm48h?: number;
  riverLevelMeters?: number;
  source: string;
}): Promise<{ success: boolean; regionId: string }> {
  return fetchApi('/risk/ingest', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function computeRiskScore(
  regionId: string
): Promise<{
  snapshotId: string;
  regionId: string;
  riskScore: number;
  severity: string;
  factors: Record<string, number>;
  createdAt: string;
}> {
  return fetchApi('/risk/score', {
    method: 'POST',
    body: JSON.stringify({ regionId }),
  });
}

export async function getLatestRisk(regionId: string): Promise<RiskSnapshot> {
  return fetchApi(`/risk/latest/${regionId}`);
}

export async function getRiskHistory(
  regionId: string
): Promise<{ date: string; riskScore: number }[]> {
  return fetchApi(`/risk/history/${regionId}`);
}

// ==================== Covenants ====================

export async function createCovenant(data: {
  title: string;
  description?: string;
  regionId: string;
  minRiskScore: number;
  reserveRequiredUsd: number;
  payoutAmountUsd: number;
  autoExecute: boolean;
}): Promise<{ id: string; status: string }> {
  return fetchApi('/covenants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function armCovenant(
  covenantId: string
): Promise<{ id: string; status: string }> {
  return fetchApi(`/covenants/${covenantId}/arm`, { method: 'POST' });
}

export async function getCovenants(): Promise<Covenant[]> {
  return fetchApi('/covenants');
}

export async function getCovenant(id: string): Promise<Covenant> {
  return fetchApi(`/covenants/${id}`);
}

export async function evaluateCovenant(
  covenantId: string
): Promise<CovenantEligibility> {
  return fetchApi(`/covenants/${covenantId}/evaluate`, { method: 'POST' });
}

export async function executeCovenant(
  covenantId: string
): Promise<{
  interventionId: string;
  executionStatus: string;
  txHash: string;
}> {
  return fetchApi(`/covenants/${covenantId}/execute`, { method: 'POST' });
}

// ==================== Reserves ====================

export async function getReserves(): Promise<ReserveAccount[]> {
  return fetchApi('/reserves');
}

export async function verifyReserve(
  reserveAccountId: string
): Promise<{
  reserveAccountId: string;
  proofStatus: string;
  currentBalance: number;
  committedBalance: number;
  availableBalance: number;
  lastCheckedAt: string;
}> {
  return fetchApi('/reserves/verify', {
    method: 'POST',
    body: JSON.stringify({ reserveAccountId }),
  });
}

// ==================== Interventions ====================

export async function getInterventions(): Promise<Intervention[]> {
  return fetchApi('/interventions');
}

export async function getIntervention(id: string): Promise<Intervention> {
  return fetchApi(`/interventions/${id}`);
}

export async function confirmIntervention(
  id: string
): Promise<{ id: string; executionStatus: string }> {
  return fetchApi(`/interventions/${id}/confirm`, { method: 'POST' });
}

// ==================== Verification ====================

export async function submitEvidence(
  evidence: VerificationEvidence
): Promise<{ evidenceId: string; status: string }> {
  return fetchApi('/verifications/evidence', {
    method: 'POST',
    body: JSON.stringify(evidence),
  });
}

export async function evaluateVerification(
  interventionId: string
): Promise<ImpactReport> {
  return fetchApi(`/verifications/${interventionId}/evaluate`, {
    method: 'POST',
  });
}

export async function finalizeVerification(
  interventionId: string
): Promise<{
  interventionId: string;
  verificationTxHash: string;
  status: string;
}> {
  return fetchApi(`/verifications/${interventionId}/finalize`, {
    method: 'POST',
  });
}

// ==================== Dashboard ====================

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return fetchApi('/dashboard/summary');
}
