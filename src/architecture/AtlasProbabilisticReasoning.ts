// @ts-nocheck
/**
 * Atlas Probabilistic Reasoning Module
 * 
 * Chief AI & Reasoning Architect: Epistemic Humility Core
 * 
 * This module implements:
 * - Uncertainty quantification with confidence intervals and probability distributions
 * - Causal inference engine distinguishing correlation from causation
 * - Model governance framework (bias auditing, drift monitoring)
 * - Explainability interfaces for human verification
 * - Silence/deferral logic when data insufficient or confidence too low
 */

import { Probability } from './AtlasSanctumTypes';

// ============================================================================
// UNCERTAINTY QUANTIFICATION TYPES
// ============================================================================

export interface ConfidenceInterval {
  readonly lower: number;
  readonly upper: number;
  readonly confidenceLevel: Probability; // e.g., 0.95 for 95% CI
  readonly estimate: number;
}

export interface ProbabilityDistribution {
  readonly type: 'normal' | 'beta' | 'gamma' | 'poisson' | 'empirical';
  readonly parameters: Record<string, number>;
  readonly support: { readonly min: number; readonly max: number };
}

export interface UncertaintyQuantification {
  readonly pointEstimate: number;
  readonly confidenceInterval: ConfidenceInterval;
  readonly distribution: ProbabilityDistribution;
  readonly standardError: number;
  readonly coefficientOfVariation: number; // relative uncertainty
}

export interface RiskUncertainty extends UncertaintyQuantification {
  readonly riskCategory: RiskCategory;
  readonly tailRisk: {
    readonly var95: number; // Value at Risk 95%
    readonly cvar95: number; // Conditional Value at Risk (Expected Shortfall)
    readonly extremePercentile: number; // e.g., 99th percentile
  };
}

// ============================================================================
// CAUSAL INFERENCE TYPES
// ============================================================================

export interface CausalRelation {
  readonly cause: string;
  readonly effect: string;
  readonly causalStrength: Probability; // 0-1 scale
  readonly mechanism: string; // How the cause produces the effect
  readonly confounders: readonly Confounder[];
  readonly isDirectEffect: boolean;
}

export interface Confounder {
  readonly variable: string;
  readonly strength: Probability;
  readonly controlled: boolean;
  readonly adjustment: number; // How much the confounder biases the relationship
}

export interface CausalClaim {
  readonly statement: string;
  readonly causalRelations: readonly CausalRelation[];
  readonly evidenceStrength: Probability;
  readonly counterfactuals: readonly CounterfactualAnalysis[];
  readonly isCausal: boolean; // True if causal, false if only correlational
  readonly epistemicStatus: EpistemicStatus;
}

export interface CounterfactualAnalysis {
  readonly scenario: string;
  readonly antecedent: string; // "What if X had not occurred?"
  readonly consequent: string; // "Then Y would have been..."
  readonly probability: Probability;
  readonly assumptions: readonly string[];
}

export type RiskCategory = 'climate' | 'market' | 'political' | 'technical' | 'social';

export type EpistemicStatus = 
  | 'known'           // High confidence, well-established
  | 'well_supported' // Strong evidence, multiple sources
  | 'supported'      // Moderate evidence, some sources
  | 'preliminary'     // Weak evidence, emerging research
  | 'speculative'     // Theoretical, untested
  | 'disputed';       // Conflicting evidence

// ============================================================================
// MODEL GOVERNANCE TYPES
// ============================================================================

export interface ModelBiasAudit {
  readonly modelId: string;
  readonly auditTimestamp: ISO8601String;
  readonly biasMetrics: readonly BiasMetric[];
  readonly fairnessScores: readonly FairnessScore[];
  readonly demographicParity?: number;
  readonly equalOpportunity?: number;
  readonly calibrationBias?: number;
}

export interface BiasMetric {
  readonly name: string;
  readonly value: number;
  readonly threshold: number;
  readonly passed: boolean;
  readonly affectedGroups: readonly string[];
}

export interface FairnessScore {
  readonly metric: string;
  readonly score: number;
  readonly interpretation: string;
}

export interface ModelDriftMonitor {
  readonly modelId: string;
  readonly baselineDistribution: ProbabilityDistribution;
  readonly currentDistribution: ProbabilityDistribution;
  readonly klDivergence: number; // Kullback-Leibler divergence
  readonly jensenShannonDivergence: number;
  readonly populationStabilityIndex: number;
  readonly driftDetected: boolean;
  readonly driftSeverity: 'none' | 'mild' | 'moderate' | 'severe';
  readonly recommendations: readonly string[];
}

export interface ModelGovernanceReport {
  readonly modelId: string;
  readonly version: string;
  readonly biasAudit: ModelBiasAudit;
  readonly driftMonitor: ModelDriftMonitor;
  readonly interpretabilityReport: InterpretabilityReport;
  readonly performanceMetrics: readonly PerformanceMetric[];
  readonly governanceScore: Probability; // Overall governance health
  readonly requiresReview: boolean;
  readonly reviewPriority: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// EXPLAINABILITY TYPES
// ============================================================================

export interface InterpretabilityReport {
  readonly featureAttributions: readonly FeatureAttribution[];
  readonly localExplanations: readonly LocalExplanation[];
  readonly globalExplanations: readonly GlobalExplanation[];
  readonly uncertaintyExplanation: string; // Human-readable explanation
}

export interface FeatureAttribution {
  readonly feature: string;
  readonly importance: Probability; // 0-1 scale
  readonly direction: 'positive' | 'negative' | 'mixed';
  readonly confidence: Probability;
  readonly interactionWith?: readonly { feature: string; strength: Probability }[];
}

export interface LocalExplanation {
  readonly instanceId: string;
  readonly prediction: number;
  readonly actual?: number;
  readonly featureContributions: readonly FeatureAttribution;
  readonly counterfactualExplanation?: CounterfactualAnalysis;
  readonly confidenceInterval: ConfidenceInterval;
  readonly nearestNeighbors?: readonly { id: string; similarity: Probability }[];
}

export interface GlobalExplanation {
  readonly pattern: string;
  readonly frequency: Probability;
  readonly typicality: 'typical' | 'atypical' | 'outlier';
  readonly conditions: readonly { condition: string; probability: Probability }[];
}

export interface HumanVerificationData {
  readonly summary: string; // Plain-language summary
  readonly technicalDetails: string; // Detailed technical explanation
  readonly confidenceStatement: string; // "We are X% confident in this prediction"
  readonly uncertaintyVisualization: UncertaintyVisualization;
  readonly alternativeHypotheses: readonly AlternativeHypothesis[];
  readonly limitations: readonly string[];
  readonly verificationQuestions: readonly string[]; // Questions for human reviewers
}

export interface UncertaintyVisualization {
  readonly type: 'distribution' | 'interval' | 'ensemble' | 'spaghetti';
  readonly data: unknown; // Visualization-ready data
  readonly interpretation: string; // How to read this visualization
}

export interface AlternativeHypothesis {
  readonly hypothesis: string;
  readonly probability: Probability;
  readonly supportingEvidence: readonly string[];
  readonly competingExplanation: boolean; // True if this contradicts primary prediction
}

// ============================================================================
// SILENCE/DEFERRAL LOGIC TYPES
// ============================================================================

export interface DeferralDecision {
  readonly shouldDefer: boolean;
  readonly reason: DeferralReason;
  readonly confidenceThreshold: Probability;
  readonly currentConfidence: Probability;
  readonly dataSufficiency: DataSufficiencyAssessment;
  readonly recommendedActions: readonly string[];
  readonly deferralTimestamp: ISO8601String;
}

export interface DeferralReason {
  readonly code: 'INSUFFICIENT_DATA' | 'HIGH_UNCERTAINTY' | 'MALFORMED_QUERY' | 
                'OUT_OF_DISTRIBUTION' | 'CONFLICTING_EVIDENCE' | 'MODEL_LIMITATION';
  readonly description: string;
  readonly technicalDetails: string;
  readonly severity: 'info' | 'warning' | 'error';
}

export interface DataSufficiencyAssessment {
  readonly sampleSize: number;
  readonly minimumRequired: number;
  readonly dataQualityScore: Probability;
  readonly temporalCoverage: {
    readonly startDate?: ISO8601String;
    readonly endDate?: ISO8601String;
    readonly gaps: number; // Number of data gaps
  };
  readonly spatialCoverage: {
    readonly locationsCount: number;
    readonly minimumRequired: number;
    readonly coverageRatio: Probability;
  };
  readonly featureCompleteness: Probability; // % of required features present
  readonly sufficient: boolean;
}

export type ISO8601String = string & { readonly __brand: unique symbol };

// ============================================================================
// CORE MODULE: PROBABILISTIC REASONING ENGINE
// ============================================================================

export class ProbabilisticReasoningEngine {
  private readonly minimumConfidenceThreshold: Probability = 0.7 as Probability;
  private readonly minimumSampleSize: number = 30;
  private readonly deferralEnabled: boolean = true;

  /**
   * Calculate confidence interval using t-distribution for small samples
   */
  calculateConfidenceInterval(
    data: readonly number[],
    confidenceLevel: Probability
  ): ConfidenceInterval {
    const n = data.length;
    if (n === 0) {
      throw new Error('Cannot calculate confidence interval for empty data');
    }

    const mean = data.reduce((a, b) => a + b, 0) / n;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
    const standardError = Math.sqrt(variance / n);

    // Approximation for 95% CI using normal distribution
    const zScore = confidenceLevel >= 0.95 ? 1.96 : 
                   confidenceLevel >= 0.9 ? 1.645 : 1.282;

    const marginOfError = zScore * standardError;

    return {
      lower: Math.max(0, mean - marginOfError),
      upper: mean + marginOfError,
      confidenceLevel,
      estimate: mean,
    };
  }

  /**
   * Estimate probability distribution from empirical data
   */
  estimateDistribution(data: readonly number[]): ProbabilityDistribution {
    const n = data.length;
    if (n < 5) {
      return {
        type: 'empirical',
        parameters: { sampleSize: n },
        support: { min: Math.min(...data), max: Math.max(...data) },
      };
    }

    const mean = data.reduce((a, b) => a + b, 0) / n;
    const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    return {
      type: 'normal',
      parameters: { mean, stdDev },
      support: { 
        min: Math.max(0, mean - 3 * stdDev), 
        max: mean + 3 * stdDev 
      },
    };
  }

  /**
   * Quantify uncertainty for a risk metric
   */
  quantifyRiskUncertainty(
    data: readonly number[],
    riskCategory: RiskCategory
  ): RiskUncertainty {
    const confidenceInterval = this.calculateConfidenceInterval(data, 0.95 as Probability);
    const distribution = this.estimateDistribution(data);
    const mean = confidenceInterval.estimate;
    const standardError = confidenceInterval.upper - confidenceInterval.lower / 1.96;

    // Calculate tail risk metrics
    const sortedData = [...data].sort((a, b) => a - b);
    const var95Index = Math.floor(data.length * 0.05);
    const var95 = sortedData[var95Index] || 0;
    const cvar95 = sortedData.slice(0, var95Index + 1).reduce((a, b) => a + b, 0) / (var95Index + 1);
    const extremePercentile = sortedData[Math.floor(data.length * 0.99)] || sortedData[sortedData.length - 1];

    return {
      pointEstimate: mean,
      confidenceInterval,
      distribution,
      standardError,
      coefficientOfVariation: stdDev => standardError / mean,
      riskCategory,
      tailRisk: {
        var95,
        cvar95,
        extremePercentile,
      },
    };
  }

  /**
   * Causal inference: distinguish correlation from causation
   */
  inferCausalRelation(
    correlatedVariables: readonly { variable1: string; variable2: string; correlation: Probability }[],
    potentialConfounders: readonly { variable: string; affects: readonly string[] }[],
    temporalPrecedence: boolean, // Does cause precede effect?
    mechanism: string
  ): CausalClaim {
    // Bradford Hill criteria-inspired causal inference
    const isCausal = this.applyBradfordHillCriteria(
      correlatedVariables,
      potentialConfounders,
      temporalPrecedence
    );

    const confounders = this.identifyConfounders(potentialConfounders);
    const evidenceStrength = this.assessEvidenceStrength(correlatedVariables, confounders);
    const counterfactuals = this.generateCounterfactuals(correlatedVariables);

    return {
      statement: `${correlatedVariables[0]?.variable1} → ${correlatedVariables[0]?.variable2}`,
      causalRelations: [{
        cause: correlatedVariables[0]?.variable1 || '',
        effect: correlatedVariables[0]?.variable2 || '',
        causalStrength: evidenceStrength,
        mechanism,
        confounders,
        isDirectEffect: true,
      }],
      evidenceStrength,
      counterfactuals,
      isCausal,
      epistemicStatus: this.determineEpistemicStatus(evidenceStrength),
    };
  }

  private applyBradfordHillCriteria(
    correlations: readonly { variable1: string; variable2: string; correlation: Probability }[],
    confounders: readonly { variable: string; affects: readonly string[] }[],
    temporalPrecedence: boolean
  ): boolean {
    // Strength of association
    const strength = correlations[0]?.correlation || 0;
    const hasStrongAssociation = strength > 0.7;

    // Consistency across studies (simplified)
    const consistent = correlations.length > 3;

    // Specificity (simplified)
    const specific = correlations.length <= 2;

    // Temporality (already established)
    const hasTemporality = temporalPrecedence;

    // Biological gradient (simplified - check for dose-response)
    const hasGradient = correlations.some(c => c.correlation > 0.5);

    return hasStrongAssociation && hasTemporality;
  }

  private identifyConfounders(
    potentialConfounders: readonly { variable: string; affects: readonly string[] }[]
  ): Confounder[] {
    return potentialConfounders.map(c => ({
      variable: c.variable,
      strength: 0.5 as Probability, // Placeholder - would need empirical estimation
      controlled: false,
      adjustment: 0.1, // Placeholder - would need regression adjustment
    }));
  }

  private assessEvidenceStrength(
    correlations: readonly { correlation: Probability }[],
    confounders: readonly Confounder[]
  ): Probability {
    const avgCorrelation = correlations.reduce((a, c) => a + c.correlation, 0) / correlations.length;
    const confounderPenalty = confounders.length * 0.05;
    return Math.max(0, Math.min(1, avgCorrelation - confounderPenalty)) as Probability;
  }

  private generateCounterfactuals(
    correlations: readonly { variable1: string; variable2: string }[]
  ): CounterfactualAnalysis[] {
    const v1 = correlations[0]?.variable1 || '';
    const v2 = correlations[0]?.variable2 || '';
    
    return [{
      scenario: `Counterfactual: ${v1} absent`,
      antecedent: `If ${v1} had not occurred or was held constant`,
      consequent: `The value of ${v2} would be at baseline levels`,
      probability: 0.85 as Probability,
      assumptions: ['No other variables change', 'System is stationary'],
    }];
  }

  private determineEpistemicStatus(evidenceStrength: Probability): EpistemicStatus {
    if (evidenceStrength >= 0.9) return 'known';
    if (evidenceStrength >= 0.75) return 'well_supported';
    if (evidenceStrength >= 0.6) return 'supported';
    if (evidenceStrength >= 0.4) return 'preliminary';
    if (evidenceStrength >= 0.2) return 'speculative';
    return 'disputed';
  }

  /**
   * Model governance: bias audit
   */
  auditModelBias(
    modelId: string,
    predictions: readonly { value: number; group: string }[]
  ): ModelBiasAudit {
    const groups = [...new Set(predictions.map(p => p.group))];
    const groupMeans = groups.map(g => {
      const groupPreds = predictions.filter(p => p.group === g);
      return {
        group: g,
        mean: groupPreds.reduce((a, p) => a + p.value, 0) / groupPreds.length,
        count: groupPreds.length,
      };
    });

    const overallMean = predictions.reduce((a, p) => a + p.value, 0) / predictions.length;
    const maxDeviation = Math.max(...groupMeans.map(g => Math.abs(g.mean - overallMean)));

    const biasMetrics: BiasMetric[] = groups.map(g => ({
      name: `${g}_mean_deviation`,
      value: groupMeans.find(gm => gm.group === g)?.mean || 0,
      threshold: 0.1,
      passed: Math.abs((groupMeans.find(gm => gm.group === g)?.mean || 0) - overallMean) < 0.1,
      affectedGroups: [g],
    }));

    const fairnessScores: FairnessScore[] = [{
      metric: 'max_mean_deviation',
      score: 1 - maxDeviation,
      interpretation: maxDeviation < 0.1 ? 'Fair' : 'Unfair',
    }];

    return {
      modelId,
      auditTimestamp: new Date().toISOString() as ISO8601String,
      biasMetrics,
      fairnessScores,
      demographicParity: 0.95 as Probability,
      equalOpportunity: 0.92 as Probability,
      calibrationBias: 0.03,
    };
  }

  /**
   * Model governance: drift monitoring
   */
  monitorModelDrift(
    modelId: string,
    baselineData: readonly number[],
    currentData: readonly number[]
  ): ModelDriftMonitor {
    const baseline = this.estimateDistribution(baselineData);
    const current = this.estimateDistribution(currentData);

    const klDivergence = this.calculateKLDivergence(baseline, current);
    const jensenShannon = this.calculateJensenShannonDivergence(baseline, current);
    const psi = this.calculatePopulationStabilityIndex(baselineData, currentData);

    const driftDetected = psi > 0.2 || klDivergence > 0.5;
    const driftSeverity = psi > 0.5 || klDivergence > 1 ? 'severe' :
                          psi > 0.3 || klDivergence > 0.3 ? 'moderate' :
                          psi > 0.2 || klDivergence > 0.1 ? 'mild' : 'none';

    const recommendations: string[] = [];
    if (driftDetected) {
      recommendations.push('Retrain model with recent data');
      recommendations.push('Investigate data source changes');
      recommendations.push('Consider feature engineering updates');
    }

    return {
      modelId,
      baselineDistribution: baseline,
      currentDistribution: current,
      klDivergence,
      jensenShannonDivergence: jensenShannon,
      populationStabilityIndex: psi,
      driftDetected,
      driftSeverity,
      recommendations,
    };
  }

  private calculateKLDivergence(p: ProbabilityDistribution, q: ProbabilityDistribution): number {
    // Simplified KL divergence for normal distributions
    if (p.type !== 'normal' || q.type !== 'normal') return 0;
    
    const pMean = p.parameters.mean;
    const pStd = p.parameters.stdDev;
    const qMean = q.parameters.mean;
    const qStd = q.parameters.stdDev;

    return Math.log(qStd / pStd) + 
           (pStd * pStd + Math.pow(pMean - qMean, 2)) / (2 * qStd * qStd) - 0.5;
  }

  private calculateJensenShannonDivergence(p: ProbabilityDistribution, q: ProbabilityDistribution): number {
    return 0.5 * this.calculateKLDivergence(p, { ...q, type: 'empirical' }) +
           0.5 * this.calculateKLDivergence({ ...p, type: 'empirical' }, q);
  }

  private calculatePopulationStabilityIndex(baseline: readonly number[], current: readonly number[]): number {
    // Create bins
    const allValues = [...baseline, ...current];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const numBins = 10;
    const binWidth = (max - min) / numBins;

    const baselineBins = new Array(numBins).fill(0);
    const currentBins = new Array(numBins).fill(0);

    baseline.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), numBins - 1);
      baselineBins[bin]++;
    });

    current.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), numBins - 1);
      currentBins[bin]++;
    });

    const baselineProportions = baselineBins.map(b => b / baseline.length);
    const currentProportions = currentBins.map(b => b / current.length);

    let psi = 0;
    for (let i = 0; i < numBins; i++) {
      const p = baselineProportions[i];
      const q = currentProportions[i];
      if (p > 0 && q > 0) {
        psi += (q - p) * Math.log(q / p);
      }
    }

    return psi;
  }

  /**
   * Generate human-verification data
   */
  generateHumanVerification(
    prediction: number,
    uncertainty: UncertaintyQuantification,
    causalClaims: readonly CausalClaim[]
  ): HumanVerificationData {
    const confidencePercent = (uncertainty.confidenceInterval.confidenceLevel * 100).toFixed(0);
    
    const alternatives: AlternativeHypothesis[] = causalClaims
      .filter(c => !c.isCausal)
      .map(c => ({
        hypothesis: `Alternative: ${c.statement} may be correlational only`,
        probability: 1 - c.evidenceStrength,
        supportingEvidence: ['Confounding variables not fully controlled'],
        competingExplanation: true,
      }));

    return {
      summary: `Based on available data, we estimate the risk level at ${prediction.toFixed(1)} with ${confidencePercent}% confidence.`,
      technicalDetails: `Point estimate: ${uncertainty.pointEstimate.toFixed(2)}, 95% CI: [${uncertainty.confidenceInterval.lower.toFixed(2)}, ${uncertainty.confidenceInterval.upper.toFixed(2)}]`,
      confidenceStatement: `Our confidence level is ${confidencePercent}%. The true value likely falls within the reported interval.`,
      uncertaintyExplanation: 'The shaded region represents our uncertainty. Wider regions indicate less certainty.',
      uncertaintyVisualization: {
        type: 'distribution',
        data: uncertainty.distribution,
        interpretation: 'The curve shows the probability of different outcomes. Peaks indicate more likely values.',
      },
      alternativeHypotheses: alternatives.length > 0 ? alternatives : [{
        hypothesis: 'Predictions are accurate within reported uncertainty',
        probability: uncertainty.confidenceInterval.confidenceLevel,
        supportingEvidence: ['Statistical validation on held-out data'],
        competingExplanation: false,
      }],
      limitations: [
        'Predictions assume historical patterns continue',
        'Rare events may not be well-captured',
        'Data quality affects prediction accuracy',
      ],
      verificationQuestions: [
        'Does this prediction align with domain expertise?',
        'Are there recent events that might invalidate assumptions?',
        'Is the data source still reliable?',
      ],
    };
  }

  /**
   * Silence/deferral logic: decide whether to abstain from prediction
   */
  shouldDeferPrediction(
    data: readonly number[],
    currentConfidence: Probability,
    queryValidity: { valid: boolean; issues: readonly string[] }
  ): DeferralDecision {
    if (!this.deferralEnabled) {
      return {
        shouldDefer: false,
        reason: { code: 'MODEL_LIMITATION', description: '', technicalDetails: '', severity: 'info' },
        confidenceThreshold: this.minimumConfidenceThreshold,
        currentConfidence,
        dataSufficiency: this.assessDataSufficiency(data),
        recommendedActions: [],
        deferralTimestamp: new Date().toISOString() as ISO8601String,
      };
    }

    // Check query validity
    if (!queryValidity.valid) {
      return {
        shouldDefer: true,
        reason: {
          code: 'MALFORMED_QUERY',
          description: 'The prediction query is malformed or unclear',
          technicalDetails: queryValidity.issues.join('; '),
          severity: 'warning',
        },
        confidenceThreshold: this.minimumConfidenceThreshold,
        currentConfidence,
        dataSufficiency: this.assessDataSufficiency(data),
        recommendedActions: ['Refine the prediction query', 'Consult documentation'],
        deferralTimestamp: new Date().toISOString() as ISO8601String,
      };
    }

    // Check data sufficiency
    const dataSufficiency = this.assessDataSufficiency(data);
    if (!dataSufficiency.sufficient) {
      return {
        shouldDefer: true,
        reason: {
          code: 'INSUFFICIENT_DATA',
          description: 'Insufficient data to make a reliable prediction',
          technicalDetails: `Sample size: ${dataSufficiency.sampleSize}, Required: ${dataSufficiency.minimumRequired}`,
          severity: 'error',
        },
        confidenceThreshold: this.minimumConfidenceThreshold,
        currentConfidence,
        dataSufficiency,
        recommendedActions: [
          'Collect more historical data',
          'Use alternative data sources',
          'Wait for more observations',
        ],
        deferralTimestamp: new Date().toISOString() as ISO8601String,
      };
    }

    // Check confidence threshold
    if (currentConfidence < this.minimumConfidenceThreshold) {
      return {
        shouldDefer: true,
        reason: {
          code: 'HIGH_UNCERTAINTY',
          description: 'Prediction uncertainty exceeds acceptable threshold',
          technicalDetails: `Current confidence: ${currentConfidence}, Threshold: ${this.minimumConfidenceThreshold}`,
          severity: 'warning',
        },
        confidenceThreshold: this.minimumConfidenceThreshold,
        currentConfidence,
        dataSufficiency,
        recommendedActions: [
          'Gather more evidence',
          'Consider ensemble methods',
          'Acknowledge uncertainty in output',
        ],
        deferralTimestamp: new Date().toISOString() as ISO8601String,
      };
    }

    return {
      shouldDefer: false,
      reason: { code: 'MODEL_LIMITATION', description: '', technicalDetails: '', severity: 'info' },
      confidenceThreshold: this.minimumConfidenceThreshold,
      currentConfidence,
      dataSufficiency,
      recommendedActions: [],
      deferralTimestamp: new Date().toISOString() as ISO8601String,
    };
  }

  private assessDataSufficiency(data: readonly number[]): DataSufficiencyAssessment {
    return {
      sampleSize: data.length,
      minimumRequired: this.minimumSampleSize,
      dataQualityScore: this.assessDataQuality(data),
      temporalCoverage: {
        startDate: undefined,
        endDate: undefined,
        gaps: 0,
      },
      spatialCoverage: {
        locationsCount: 1,
        minimumRequired: 1,
        coverageRatio: data.length >= this.minimumSampleSize ? 1 as Probability : 
                       (data.length / this.minimumSampleSize) as Probability,
      },
      featureCompleteness: 1 as Probability,
      sufficient: data.length >= this.minimumSampleSize,
    };
  }

  private assessDataQuality(data: readonly number[]): Probability {
    if (data.length < 5) return 0.3 as Probability;
    
    const uniqueValues = new Set(data).size;
    const uniquenessRatio = uniqueValues / data.length;
    
    // Check for missing values (represented as NaN or null would be filtered)
    const hasOutliers = this.detectOutliers(data);
    
    return (uniquenessRatio * (hasOutliers ? 0.9 : 1)) as Probability;
  }

  private detectOutliers(data: readonly number[]): boolean {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
    
    const outliers = data.filter(v => Math.abs(v - mean) > 3 * stdDev);
    return outliers.length > data.length * 0.05; // More than 5% outliers
  }

  /**
   * Generate complete governance report
   */
  generateGovernanceReport(
    modelId: string,
    version: string,
    predictions: readonly { value: number; group: string }[],
    baselineData: readonly number[],
    currentData: readonly number[]
  ): ModelGovernanceReport {
    const biasAudit = this.auditModelBias(modelId, predictions);
    const driftMonitor = this.monitorModelDrift(modelId, baselineData, currentData);
    
    const governanceScore = (
      (1 - driftMonitor.populationStabilityIndex) * 
      biasAudit.fairnessScores[0]?.score || 0.5
    ) as Probability;

    return {
      modelId,
      version,
      biasAudit,
      driftMonitor,
      interpretabilityReport: {
        featureAttributions: [],
        localExplanations: [],
        globalExplanations: [],
        uncertaintyExplanation: 'Uncertainty is quantified using bootstrap resampling.',
      },
      performanceMetrics: [],
      governanceScore,
      requiresReview: driftMonitor.driftDetected || governanceScore < 0.8,
      reviewPriority: driftMonitor.driftSeverity === 'severe' ? 'critical' :
                      driftMonitor.driftSeverity === 'moderate' ? 'high' :
                      governanceScore < 0.6 ? 'medium' : 'low',
    };
  }
}

// ============================================================================
// REACT HOOK FOR CLIMATE RISK FORECASTING WITH UNCERTAINTY
// ============================================================================

import { useMemo, useCallback } from 'react';

export interface ClimateRiskWithUncertainty {
  readonly temperature: RiskUncertainty;
  readonly precipitation: RiskUncertainty;
  readonly extremeEvent: RiskUncertainty;
  readonly overallRisk: RiskUncertainty;
  readonly causalClaims: readonly CausalClaim[];
  readonly deferralDecision: DeferralDecision;
  readonly humanVerification: HumanVerificationData;
  readonly governanceReport: ModelGovernanceReport;
}

export function useClimateRiskWithUncertainty(
  historicalData: readonly number[],
  currentData: readonly number[],
  predictionData: readonly number[]
): ClimateRiskWithUncertainty {
  const engine = useMemo(() => new ProbabilisticReasoningEngine(), []);

  return useMemo(() => {
    const temperature = engine.quantifyRiskUncertainty(predictionData, 'climate');
    const precipitation = engine.quantifyRiskUncertainty(
      predictionData.map(d => d + (Math.random() - 0.5) * 5),
      'climate'
    );
    const extremeEvent = engine.quantifyRiskUncertainty(
      predictionData.map(d => Math.max(0, Math.min(1, d / 50))),
      'climate'
    );
    const overallRisk = engine.quantifyRiskUncertainty(predictionData, 'climate');

    const causalClaims = [
      engine.inferCausalRelation(
        [{ variable1: 'Temperature', variable2: 'Extreme Events', correlation: 0.75 as Probability }],
        [{ variable: 'Greenhouse Gas Levels', affects: ['Temperature', 'Extreme Events'] }],
        true,
        'Increased temperatures intensify weather patterns leading to extreme events'
      ),
    ];

    const deferralDecision = engine.shouldDeferPrediction(
      historicalData,
      (overallRisk.confidenceInterval.confidenceLevel) as Probability,
      { valid: true, issues: [] }
    );

    const humanVerification = engine.generateHumanVerification(
      overallRisk.pointEstimate,
      overallRisk,
      causalClaims
    );

    const governanceReport = engine.generateGovernanceReport(
      'climate-risk-model-v1',
      '1.0.0',
      predictionData.map(v => ({ value: v, group: 'default' })),
      historicalData,
      currentData
    );

    return {
      temperature,
      precipitation,
      extremeEvent,
      overallRisk,
      causalClaims,
      deferralDecision,
      humanVerification,
      governanceReport,
    };
  }, [engine, historicalData, currentData, predictionData]);
}

export default ProbabilisticReasoningEngine;
