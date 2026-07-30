/**
 * Atlas Sanctum Covenant Engine
 * Evaluates covenant conditions and determines eligibility
 */

export interface CovenantCheckResult {
  riskThresholdMet: boolean;
  reserveVerified: boolean;
  sufficientBalance: boolean;
  covenantArmed: boolean;
  cooldownPassed: boolean;
  eligible: boolean;
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

export interface Covenant {
  id: string;
  title: string;
  regionId: string;
  minRiskScore: number;
  reserveRequiredUsd: number;
  payoutAmountUsd: number;
  autoExecute: boolean;
  status: 'draft' | 'armed' | 'triggered' | 'executed' | 'verified' | 'failed';
  createdAt: string;
}

export interface RiskSnapshot {
  id: string;
  regionId: string;
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
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

// Cooldown period in milliseconds (1 hour for demo)
const COOLDOWN_PERIOD_MS = 60 * 60 * 1000;

/**
 * Evaluates if a covenant is eligible for execution
 */
export function evaluateCovenant(
  covenant: Covenant,
  latestRisk: RiskSnapshot | null,
  reserve: ReserveAccount | null,
  lastExecutionTime?: string
): CovenantCheckResult {
  // Check risk threshold
  const riskThresholdMet = latestRisk 
    ? latestRisk.riskScore >= covenant.minRiskScore 
    : false;

  // Check reserve verification
  const reserveVerified = reserve 
    ? reserve.proofStatus === 'verified' 
    : false;

  // Check sufficient balance
  const availableBalance = reserve 
    ? reserve.currentBalance - reserve.committedBalance 
    : 0;
  const sufficientBalance = availableBalance >= covenant.reserveRequiredUsd;

  // Check covenant is armed
  const covenantArmed = covenant.status === 'armed';

  // Check cooldown
  let cooldownPassed = true;
  if (lastExecutionTime) {
    const lastExecution = new Date(lastExecutionTime).getTime();
    const now = Date.now();
    cooldownPassed = (now - lastExecution) > COOLDOWN_PERIOD_MS;
  }

  // Determine eligibility
  const eligible = riskThresholdMet && 
                   reserveVerified && 
                   sufficientBalance && 
                   covenantArmed && 
                   cooldownPassed;

  return {
    riskThresholdMet,
    reserveVerified,
    sufficientBalance,
    covenantArmed,
    cooldownPassed,
    eligible,
    details: {
      currentRiskScore: latestRisk?.riskScore ?? 0,
      requiredRiskScore: covenant.minRiskScore,
      reserveStatus: reserve?.proofStatus ?? 'unverified',
      availableBalance,
      requiredBalance: covenant.reserveRequiredUsd,
      covenantStatus: covenant.status,
      lastExecutionTime,
    },
  };
}

/**
 * Checks if a covenant can be armed
 */
export function canArmCovenant(covenant: Covenant): boolean {
  return covenant.status === 'draft';
}

/**
 * Checks if a covenant can be triggered
 */
export function canTriggerCovenant(covenant: Covenant): boolean {
  return covenant.status === 'armed';
}

/**
 * Checks if a covenant can be executed
 */
export function canExecuteCovenant(covenant: Covenant): boolean {
  return covenant.status === 'triggered';
}

/**
 * Checks if a covenant can be verified
 */
export function canVerifyCovenant(covenant: Covenant): boolean {
  return covenant.status === 'executed';
}

/**
 * Gets the next status for a covenant transition
 */
export function getNextStatus(
  currentStatus: Covenant['status']
): Covenant['status'] | null {
  const transitions: Record<string, Covenant['status']> = {
    draft: 'armed',
    armed: 'triggered',
    triggered: 'executed',
    executed: 'verified',
  };
  return transitions[currentStatus] ?? null;
}

/**
 * Generates a covenant ID
 */
export function generateCovenantId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `cov_${timestamp}_${random}`;
}

/**
 * Generates an intervention ID
 */
export function generateInterventionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `int_${timestamp}_${random}`;
}
