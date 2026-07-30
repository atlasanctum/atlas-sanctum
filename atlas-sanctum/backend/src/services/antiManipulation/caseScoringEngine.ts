/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Case Scoring and Intervention Engine
 * 
 * Turns noisy signals into action with composite risk scoring
 */

import {
  Case,
  Alert,
  Intervention,
  InterventionAction,
  RiskScoreResult,
  RiskScoreComponents,
  AlertExplanation,
  Severity,
  CaseStatus,
  CasePriority
} from '../../types/antiManipulation';

// In-memory stores for demo (would be PostgreSQL in production)
const cases: Map<string, Case> = new Map();
const interventions: Map<string, Intervention> = new Map();

/**
 * Generates a unique case ID
 */
function generateCaseId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `case_${timestamp}_${random}`;
}

/**
 * Generates a unique intervention ID
 */
function generateInterventionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `int_${timestamp}_${random}`;
}

/**
 * Calculates composite risk score from multiple signal sources
 */
export function calculateRiskScore(
  ruleAlerts: AlertExplanation[],
  anomalyScore: number,
  graphRiskScore: number,
  narrativeContradictionScore: number,
  accessAbuseScore: number = 0,
  historicalRecurrenceScore: number = 0
): RiskScoreResult {
  // Calculate component scores
  const components: RiskScoreComponents = {
    ruleSeverity: calculateRuleSeverity(ruleAlerts),
    statisticalAnomaly: anomalyScore,
    graphCollusion: graphRiskScore,
    narrativeContradiction: narrativeContradictionScore,
    accessAbuse: accessAbuseScore,
    historicalRecurrence: historicalRecurrenceScore
  };

  // Weighted combination
  const baseScore =
    0.25 * components.ruleSeverity +
    0.20 * components.statisticalAnomaly +
    0.25 * components.graphCollusion +
    0.15 * components.narrativeContradiction +
    0.10 * components.accessAbuse +
    0.05 * components.historicalRecurrence;

  // Apply multipliers
  const financialExposureMultiplier = 1.0; // Would be calculated based on exposure
  const publicHarmMultiplier = 1.0; // Would be calculated based on impact

  const overallScore = Math.min(100, Math.round(
    baseScore * 100 * financialExposureMultiplier * publicHarmMultiplier
  ));

  // Calculate confidence
  const confidence = calculateConfidence(ruleAlerts, anomalyScore, graphRiskScore);

  // Generate explanation
  const explanation = generateExplanation(
    ruleAlerts,
    anomalyScore,
    graphRiskScore,
    narrativeContradictionScore
  );

  // Identify uncertainties
  const uncertainty = identifyUncertainties(
    ruleAlerts,
    anomalyScore,
    graphRiskScore
  );

  // Recommend next step
  const recommendedNextStep = recommendNextStep(overallScore, confidence, components);

  return {
    overallScore,
    confidence,
    components,
    multipliers: {
      financialExposure: financialExposureMultiplier,
      publicHarm: publicHarmMultiplier
    },
    explanation,
    uncertainty,
    recommendedNextStep
  };
}

/**
 * Calculates rule severity score from alerts
 */
function calculateRuleSeverity(alerts: AlertExplanation[]): number {
  if (alerts.length === 0) return 0;

  const severityWeights: Record<string, number> = {
    critical: 1.0,
    high: 0.7,
    medium: 0.4,
    low: 0.2
  };

  let totalWeight = 0;
  let weightedSum = 0;

  alerts.forEach(alert => {
    const weight = alert.weight || 0.5;
    totalWeight += weight;
    weightedSum += weight * 0.8; // Base score for any rule hit
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Calculates confidence based on signal diversity
 */
function calculateConfidence(
  ruleAlerts: AlertExplanation[],
  anomalyScore: number,
  graphRiskScore: number
): number {
  let confidence = 0.5; // Base confidence

  // More rule hits increase confidence
  if (ruleAlerts.length > 0) {
    confidence += Math.min(0.3, ruleAlerts.length * 0.1);
  }

  // Strong anomaly signal increases confidence
  if (anomalyScore > 0.7) {
    confidence += 0.15;
  }

  // Graph risk signal increases confidence
  if (graphRiskScore > 0.7) {
    confidence += 0.15;
  }

  return Math.min(1, confidence);
}

/**
 * Generates human-readable explanation
 */
function generateExplanation(
  ruleAlerts: AlertExplanation[],
  anomalyScore: number,
  graphRiskScore: number,
  narrativeContradictionScore: number
): AlertExplanation[] {
  const explanation: AlertExplanation[] = [];

  // Add rule-based explanations
  ruleAlerts.forEach(alert => {
    explanation.push({
      source: 'rule_engine',
      finding: alert.finding,
      weight: alert.weight
    });
  });

  // Add anomaly explanation
  if (anomalyScore > 0.5) {
    explanation.push({
      source: 'anomaly_engine',
      finding: `Statistical anomaly detected (score: ${(anomalyScore * 100).toFixed(0)}%)`,
      weight: 0.20
    });
  }

  // Add graph risk explanation
  if (graphRiskScore > 0.5) {
    explanation.push({
      source: 'graph_engine',
      finding: `Graph-based collusion risk detected (score: ${(graphRiskScore * 100).toFixed(0)}%)`,
      weight: 0.25
    });
  }

  // Add narrative contradiction explanation
  if (narrativeContradictionScore > 0.5) {
    explanation.push({
      source: 'narrative_engine',
      finding: `Narrative inconsistencies detected (score: ${(narrativeContradictionScore * 100).toFixed(0)}%)`,
      weight: 0.15
    });
  }

  return explanation;
}

/**
 * Identifies uncertainties in the assessment
 */
function identifyUncertainties(
  ruleAlerts: AlertExplanation[],
  anomalyScore: number,
  graphRiskScore: number
): string[] {
  const uncertainties: string[] = [];

  if (ruleAlerts.length === 0) {
    uncertainties.push('No deterministic rule violations detected');
  }

  if (anomalyScore < 0.3) {
    uncertainties.push('Limited statistical anomaly signal');
  }

  if (graphRiskScore < 0.3) {
    uncertainties.push('Limited graph-based risk signals');
  }

  if (ruleAlerts.length > 0 && anomalyScore < 0.3 && graphRiskScore < 0.3) {
    uncertainties.push('Single-source detection (rule-based only)');
  }

  return uncertainties;
}

/**
 * Recommends next step based on risk assessment
 */
function recommendNextStep(
  overallScore: number,
  confidence: number,
  components: RiskScoreComponents
): string {
  if (overallScore >= 80 && confidence >= 0.8) {
    return 'Immediate escalation recommended - high risk with high confidence';
  }

  if (overallScore >= 60) {
    return 'Open investigation case and assign to analyst';
  }

  if (overallScore >= 40) {
    return 'Add to watchlist and monitor for recurrence';
  }

  if (components.graphCollusion > 0.7) {
    return 'Investigate network connections - potential collusion detected';
  }

  if (components.narrativeContradiction > 0.7) {
    return 'Verify claims against evidence - narrative inconsistencies detected';
  }

  return 'Continue monitoring - low risk signals';
}

/**
 * Creates a case from alerts
 */
export function createCase(
  title: string,
  description: string,
  entityIds: string[],
  alertIds: string[],
  riskScoreResult: RiskScoreResult,
  priority: CasePriority = 'medium'
): Case {
  const caseId = generateCaseId();

  const newCase: Case = {
    id: caseId,
    title,
    description,
    entityIds,
    alertIds,
    riskScore: riskScoreResult.overallScore,
    confidence: riskScoreResult.confidence,
    riskFactors: riskScoreResult.explanation.map(e => e.finding),
    recommendedAction: riskScoreResult.recommendedNextStep,
    status: 'open',
    priority,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  cases.set(caseId, newCase);
  return newCase;
}

/**
 * Gets a case by ID
 */
export function getCase(caseId: string): Case | undefined {
  return cases.get(caseId);
}

/**
 * Gets all cases
 */
export function getAllCases(): Case[] {
  return Array.from(cases.values());
}

/**
 * Gets cases by status
 */
export function getCasesByStatus(status: CaseStatus): Case[] {
  return Array.from(cases.values()).filter(c => c.status === status);
}

/**
 * Gets cases by priority
 */
export function getCasesByPriority(priority: CasePriority): Case[] {
  return Array.from(cases.values()).filter(c => c.priority === priority);
}

/**
 * Updates case status
 */
export function updateCaseStatus(
  caseId: string,
  status: CaseStatus,
  owner?: string
): Case | undefined {
  const existingCase = cases.get(caseId);
  if (!existingCase) return undefined;

  const updated: Case = {
    ...existingCase,
    status,
    owner: owner || existingCase.owner,
    updatedAt: new Date()
  };

  cases.set(caseId, updated);
  return updated;
}

/**
 * Assigns case to owner
 */
export function assignCase(caseId: string, owner: string): Case | undefined {
  return updateCaseStatus(caseId, 'investigating', owner);
}

/**
 * Determines appropriate intervention based on risk level
 */
export function determineIntervention(
  riskScore: number,
  confidence: number
): { action: InterventionAction; level: number; reason: string } {
  if (riskScore >= 80 && confidence >= 0.8) {
    return {
      action: 'pause_disbursement',
      level: 3,
      reason: 'High risk with high confidence - immediate containment required'
    };
  }

  if (riskScore >= 60) {
    return {
      action: 'require_verification',
      level: 2,
      reason: 'Elevated risk - enhanced verification required'
    };
  }

  if (riskScore >= 40) {
    return {
      action: 'soft_flag',
      level: 1,
      reason: 'Moderate risk - add to watchlist'
    };
  }

  return {
    action: 'observe',
    level: 0,
    reason: 'Low risk - continue monitoring'
  };
}

/**
 * Creates an intervention for a case
 */
export function createIntervention(
  caseId: string,
  action: InterventionAction,
  actionLevel: number,
  reason: string,
  executedBy?: string
): Intervention {
  const interventionId = generateInterventionId();

  const intervention: Intervention = {
    id: interventionId,
    caseId,
    actionType: action,
    actionLevel,
    reason,
    executedBy,
    executedAt: executedBy ? new Date() : undefined,
    status: executedBy ? 'executed' : 'pending',
    metadata: {},
    createdAt: new Date()
  };

  interventions.set(interventionId, intervention);
  return intervention;
}

/**
 * Gets intervention by ID
 */
export function getIntervention(interventionId: string): Intervention | undefined {
  return interventions.get(interventionId);
}

/**
 * Gets interventions for a case
 */
export function getInterventionsByCase(caseId: string): Intervention[] {
  return Array.from(interventions.values()).filter(i => i.caseId === caseId);
}

/**
 * Executes a pending intervention
 */
export function executeIntervention(
  interventionId: string,
  executedBy: string
): Intervention | undefined {
  const intervention = interventions.get(interventionId);
  if (!intervention || intervention.status !== 'pending') return undefined;

  const updated: Intervention = {
    ...intervention,
    executedBy,
    executedAt: new Date(),
    status: 'executed'
  };

  interventions.set(interventionId, updated);
  return updated;
}

/**
 * Gets intervention statistics
 */
export function getInterventionStats(): {
  total: number;
  byStatus: Record<string, number>;
  byAction: Record<string, number>;
  byLevel: Record<number, number>;
} {
  const allInterventions = Array.from(interventions.values());
  const byStatus: Record<string, number> = {};
  const byAction: Record<string, number> = {};
  const byLevel: Record<number, number> = {};

  allInterventions.forEach(intervention => {
    byStatus[intervention.status] = (byStatus[intervention.status] || 0) + 1;
    byAction[intervention.actionType] = (byAction[intervention.actionType] || 0) + 1;
    byLevel[intervention.actionLevel] = (byLevel[intervention.actionLevel] || 0) + 1;
  });

  return {
    total: allInterventions.length,
    byStatus,
    byAction,
    byLevel
  };
}

/**
 * Gets case statistics
 */
export function getCaseStats(): {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  averageRiskScore: number;
  highRiskCount: number;
} {
  const allCases = Array.from(cases.values());
  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};

  allCases.forEach(c => {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
  });

  const averageRiskScore = allCases.length > 0
    ? allCases.reduce((a, b) => a + b.riskScore, 0) / allCases.length
    : 0;

  return {
    total: allCases.length,
    byStatus,
    byPriority,
    averageRiskScore,
    highRiskCount: allCases.filter(c => c.riskScore >= 70).length
  };
}

/**
 * Clears all cases and interventions (for testing)
 */
export function clearCases(): void {
  cases.clear();
  interventions.clear();
}
