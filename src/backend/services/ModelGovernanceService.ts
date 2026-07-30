// @ts-nocheck
/**
 * Atlas Model Governance Service
 * 
 * Chief AI & Reasoning Architect: Model Governance Framework
 * 
 * Provides comprehensive model governance including:
 * - Bias auditing across demographic groups
 * - Drift monitoring with multiple statistical tests
 * - Model performance monitoring
 * - Regulatory compliance reporting
 * - Automated remediation workflows
 */

import { Probability } from '@/architecture/AtlasSanctumTypes';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ModelIdentity {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly description: string;
  readonly deployedAt: Date;
  readonly owner: string;
  readonly tags: readonly string[];
}

export interface PredictionRecord {
  readonly predictionId: string;
  readonly modelId: string;
  readonly timestamp: Date;
  readonly inputFeatures: Record<string, number>;
  readonly prediction: number;
  readonly actual?: number;
  readonly group: string; // For bias auditing
  readonly metadata: Record<string, unknown>;
}

export interface BiasAuditConfig {
  readonly protectedAttributes: readonly string[];
  readonly fairnessMetrics: readonly FairnessMetric[];
  readonly thresholds: Record<string, number>;
  readonly auditFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  readonly sampleSize: number;
}

export type FairnessMetric = 
  | 'demographic_parity'
  | 'equal_opportunity'
  | 'predictive_parity'
  | 'calibration'
  | 'treatment_equality'
  | 'impact_parity';

export interface GroupMetrics {
  readonly groupName: string;
  readonly count: number;
  readonly meanPrediction: number;
  readonly stdPrediction: number;
  readonly positiveRate: number;
  readonly truePositiveRate?: number;
  readonly falsePositiveRate?: number;
}

export interface BiasAuditResult {
  readonly modelId: string;
  readonly auditTimestamp: Date;
  readonly overallScore: Probability;
  readonly groupMetrics: readonly GroupMetrics[];
  readonly fairnessMetrics: readonly ComputedFairnessMetric[];
  readonly violations: readonly BiasViolation[];
  readonly recommendations: readonly string[];
  readonly complianceStatus: ComplianceStatus;
}

export interface ComputedFairnessMetric {
  readonly metric: FairnessMetric;
  readonly value: number;
  readonly threshold: number;
  readonly passed: boolean;
  readonly interpretation: string;
  readonly groupDisparities: Record<string, number>;
}

export interface BiasViolation {
  readonly severity: 'critical' | 'high' | 'medium' | 'low';
  readonly metric: FairnessMetric;
  readonly description: string;
  readonly affectedGroups: readonly string[];
  readonly disparity: number;
  readonly remediation: string;
}

export type ComplianceStatus = 
  | 'compliant'
  | 'review_required'
  | 'non_compliant'
  | 'under_review';

export interface DriftMonitorConfig {
  readonly referenceWindow: number; // Number of records for baseline
  readonly monitoringWindow: number; // Number of records for current
  readonly alertThreshold: number;
  readonly checkFrequency: 'realtime' | 'hourly' | 'daily';
  readonly driftTests: readonly DriftTest[];
  readonly featureSubset?: readonly string[];
}

export type DriftTest = 
  | 'kolmogorov_smirnov'
  | 'chi_squared'
  | 'population_stability_index'
  | 'kl_divergence'
  | 'jensen_shannon'
  | 'wasserstein';

export interface DriftDetectionResult {
  readonly modelId: string;
  readonly testTimestamp: Date;
  readonly referencePeriod: { start: Date; end: Date };
  readonly monitoringPeriod: { start: Date; end: Date };
  readonly driftScores: readonly DriftScore[];
  readonly overallDriftScore: number;
  readonly driftDetected: boolean;
  readonly driftSeverity: 'none' | 'mild' | 'moderate' | 'severe' | 'critical';
  readonly affectedFeatures: readonly string[];
  readonly recommendations: readonly string[];
}

export interface DriftScore {
  readonly feature: string;
  readonly test: DriftTest;
  readonly statistic: number;
  readonly pValue?: number;
  readonly threshold: number;
  readonly drifted: boolean;
  readonly changeDirection: 'increase' | 'decrease' | 'shift';
}

export interface PerformanceMetrics {
  readonly accuracy?: number;
  readonly precision?: number;
  readonly recall?: number;
  readonly f1Score?: number;
  readonly rmse?: number;
  readonly mae?: number;
  readonly auc?: number;
  readonly sampleSize: number;
  readonly timestamp: Date;
}

export interface GovernanceReport {
  readonly reportId: string;
  readonly modelId: string;
  readonly generatedAt: Date;
  readonly period: { start: Date; end: Date };
  readonly biasAudit: BiasAuditResult;
  readonly driftDetection: DriftDetectionResult;
  readonly performanceMetrics: PerformanceMetrics;
  readonly governanceScore: Probability;
  readonly riskLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly complianceStatus: ComplianceStatus;
  readonly actionItems: readonly ActionItem[];
  readonly exportedAt?: Date;
}

export interface ActionItem {
  readonly id: string;
  readonly type: 'retrain' | 'feature_update' | 'threshold_adjustment' | 'investigation' | 'model_replacement';
  readonly priority: 'critical' | 'high' | 'medium' | 'low';
  readonly description: string;
  readonly createdAt: Date;
  readonly status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  readonly assignee?: string;
  readonly dueDate?: Date;
}

// ============================================================================
// MODEL GOVERNANCE SERVICE
// ============================================================================

export class ModelGovernanceService {
  private readonly predictionsStore: Map<string, PredictionRecord[]>;
  private readonly audits: Map<string, BiasAuditResult[]>;
  private readonly drifts: Map<string, DriftDetectionResult[]>;
  private readonly configs: Map<string, { biasConfig: BiasAuditConfig; driftConfig: DriftMonitorConfig }>;

  constructor() {
    this.predictionsStore = new Map();
    this.audits = new Map();
    this.drifts = new Map();
    this.configs = new Map();
  }

  /**
   * Register a model for governance monitoring
   */
  registerModel(
    model: ModelIdentity,
    biasConfig: BiasAuditConfig,
    driftConfig: DriftMonitorConfig
  ): void {
    this.configs.set(model.modelId, { biasConfig, driftConfig });
    this.predictionsStore.set(model.modelId, []);
    this.audits.set(model.modelId, []);
    this.drifts.set(model.modelId, []);
  }

  /**
   * Record a prediction for governance analysis
   */
  recordPrediction(record: PredictionRecord): void {
    const predictions = this.predictionsStore.get(record.modelId) || [];
    predictions.push(record);
    
    // Keep only the last 100,000 predictions per model
    if (predictions.length > 100000) {
      predictions.splice(0, predictions.length - 100000);
    }
    
    this.predictionsStore.set(record.modelId, predictions);
  }

  /**
   * Run bias audit for a model
   */
  async runBiasAudit(modelId: string): Promise<BiasAuditResult> {
    const predictions = this.predictionsStore.get(modelId) || [];
    const config = this.configs.get(modelId)?.biasConfig;

    if (!config || predictions.length < config.sampleSize) {
      return this.createInsufficientDataResult(modelId, config?.sampleSize || 100);
    }

    const groupMetrics = this.computeGroupMetrics(predictions, config.protectedAttributes);
    const fairnessMetrics = this.computeFairnessMetrics(groupMetrics, predictions, config);
    const violations = this.detectViolations(fairnessMetrics, config);
    const overallScore = this.computeOverallBiasScore(fairnessMetrics);

    const result: BiasAuditResult = {
      modelId,
      auditTimestamp: new Date(),
      overallScore,
      groupMetrics,
      fairnessMetrics,
      violations,
      recommendations: this.generateBiasRecommendations(violations),
      complianceStatus: this.determineComplianceStatus(violations),
    };

    // Store the audit result
    const audits = this.audits.get(modelId) || [];
    audits.push(result);
    this.audits.set(modelId, audits);

    return result;
  }

  /**
   * Run drift detection for a model
   */
  async runDriftDetection(modelId: string): Promise<DriftDetectionResult> {
    const predictions = this.predictionsStore.get(modelId) || [];
    const config = this.configs.get(modelId)?.driftConfig;

    if (!config || predictions.length < config.referenceWindow + config.monitoringWindow) {
      return this.createInsufficientDataDriftResult(modelId);
    }

    // Split into reference and monitoring windows
    const sortedPredictions = [...predictions].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    const referenceWindow = sortedPredictions.slice(0, config.referenceWindow);
    const monitoringWindow = sortedPredictions.slice(-config.monitoringWindow);

    const driftScores = this.computeDriftScores(
      referenceWindow,
      monitoringWindow,
      config.driftTests,
      config.featureSubset
    );

    const overallDriftScore = this.computeOverallDriftScore(driftScores);
    const affectedFeatures = driftScores.filter(d => d.drifted).map(d => d.feature);
    const driftSeverity = this.classifyDriftSeverity(overallDriftScore);

    const result: DriftDetectionResult = {
      modelId,
      testTimestamp: new Date(),
      referencePeriod: {
        start: referenceWindow[0]?.timestamp || new Date(),
        end: referenceWindow[referenceWindow.length - 1]?.timestamp || new Date(),
      },
      monitoringPeriod: {
        start: monitoringWindow[0]?.timestamp || new Date(),
        end: monitoringWindow[monitoringWindow.length - 1]?.timestamp || new Date(),
      },
      driftScores,
      overallDriftScore,
      driftDetected: overallDriftScore > config.alertThreshold,
      driftSeverity,
      affectedFeatures,
      recommendations: this.generateDriftRecommendations(driftScores, driftSeverity),
    };

    // Store the drift result
    const drifts = this.drifts.get(modelId) || [];
    drifts.push(result);
    this.drifts.set(modelId, drifts);

    return result;
  }

  /**
   * Generate comprehensive governance report
   */
  async generateGovernanceReport(
    modelId: string,
    startDate: Date,
    endDate: Date
  ): Promise<GovernanceReport> {
    const [biasAudit, driftDetection] = await Promise.all([
      this.runBiasAudit(modelId),
      this.runDriftDetection(modelId),
    ]);

    const predictions = this.predictionsStore.get(modelId) || [];
    const labeledPredictions = predictions.filter(p => p.actual !== undefined);
    const performanceMetrics = this.computePerformanceMetrics(labeledPredictions);

    const governanceScore = this.computeGovernanceScore(biasAudit, driftDetection, performanceMetrics);
    const riskLevel = this.classifyRiskLevel(governanceScore);
    const actionItems = this.generateActionItems(biasAudit, driftDetection);

    return {
      reportId: `gov-${modelId}-${Date.now()}`,
      modelId,
      generatedAt: new Date(),
      period: { start: startDate, end: endDate },
      biasAudit,
      driftDetection,
      performanceMetrics,
      governanceScore,
      riskLevel,
      complianceStatus: biasAudit.complianceStatus,
      actionItems,
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private computeGroupMetrics(
    predictions: PredictionRecord[],
    protectedAttributes: readonly string[]
  ): GroupMetrics[] {
    const groups = [...new Set(predictions.map(p => p.group))];
    
    return groups.map(group => {
      const groupPreds = predictions.filter(p => p.group === group);
      const values = groupPreds.map(p => p.prediction);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const positives = groupPreds.filter(p => p.prediction >= 0.5);
      const labeledPositives = positives.filter(p => p.actual !== undefined && p.actual >= 0.5);
      const truePositives = labeledPositives.filter(p => p.actual === 1);
      const falsePositives = labeledPositives.filter(p => p.actual === 0);

      return {
        groupName: group,
        count: groupPreds.length,
        meanPrediction: mean,
        stdPrediction: Math.sqrt(variance),
        positiveRate: positives.length / groupPreds.length,
        truePositiveRate: labeledPositives.length > 0 ? truePositives.length / labeledPositives.length : undefined,
        falsePositiveRate: labeledPositives.length > 0 ? falsePositives.length / labeledPositives.length : undefined,
      };
    });
  }

  private computeFairnessMetrics(
    groupMetrics: GroupMetrics[],
    predictions: PredictionRecord[],
    config: BiasAuditConfig
  ): ComputedFairnessMetric[] {
    const metrics: ComputedFairnessMetric[] = [];

    // Demographic Parity
    const positiveRates = groupMetrics.map(g => g.positiveRate);
    const maxDisparity = Math.max(...positiveRates) - Math.min(...positiveRates);
    metrics.push({
      metric: 'demographic_parity',
      value: 1 - maxDisparity,
      threshold: config.thresholds['demographic_parity'] || 0.1,
      passed: maxDisparity < (config.thresholds['demographic_parity'] || 0.1),
      interpretation: this.interpretDisparity(maxDisparity),
      groupDisparities: Object.fromEntries(groupMetrics.map(g => [g.groupName, g.positiveRate])),
    });

    // Equal Opportunity (if labeled data exists)
    const tprs = groupMetrics.filter(g => g.truePositiveRate !== undefined).map(g => g.truePositiveRate!);
    if (tprs.length >= 2) {
      const tprDisparity = Math.max(...tprs) - Math.min(...tprs);
      metrics.push({
        metric: 'equal_opportunity',
        value: 1 - tprDisparity,
        threshold: config.thresholds['equal_opportunity'] || 0.1,
        passed: tprDisparity < (config.thresholds['equal_opportunity'] || 0.1),
        interpretation: this.interpretDisparity(tprDisparity),
        groupDisparities: Object.fromEntries(
          groupMetrics.filter(g => g.truePositiveRate !== undefined).map(g => [g.groupName, g.truePositiveRate!])
        ),
      });
    }

    return metrics;
  }

  private detectViolations(
    fairnessMetrics: ComputedFairnessMetric[],
    config: BiasAuditConfig
  ): BiasViolation[] {
    const violations: BiasViolation[] = [];

    for (const fm of fairnessMetrics) {
      if (!fm.passed) {
        const disparity = 1 - fm.value;
        let severity: BiasViolation['severity'] = 'low';
        if (disparity > 0.5) severity = 'critical';
        else if (disparity > 0.3) severity = 'high';
        else if (disparity > 0.15) severity = 'medium';

        violations.push({
          severity,
          metric: fm.metric,
          description: `${fm.metric.replace(/_/g, ' ')} disparity detected across groups`,
          affectedGroups: Object.entries(fm.groupDisparities)
            .filter(([, v]) => v > fm.value)
            .map(([g]) => g),
          disparity,
          remediation: this.getRemediationForMetric(fm.metric),
        });
      }
    }

    return violations.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  private computeOverallBiasScore(metrics: ComputedFairnessMetric[]): Probability {
    if (metrics.length === 0) return 1 as Probability;
    const score = metrics.reduce((a, m) => a + (m.passed ? 1 : 0), 0) / metrics.length;
    return score as Probability;
  }

  private computeDriftScores(
    reference: PredictionRecord[],
    current: PredictionRecord[],
    tests: readonly DriftTest[],
    featureSubset?: readonly string[]
  ): DriftScore[] {
    const scores: DriftScore[] = [];
    const features = featureSubset || this.getAllFeatures(reference);

    for (const feature of features) {
      const refValues = reference.map(p => p.inputFeatures[feature]).filter(v => v !== undefined);
      const currValues = current.map(p => p.inputFeatures[feature]).filter(v => v !== undefined);

      for (const test of tests) {
        const statistic = this.runStatisticalTest(refValues, currValues, test);
        const threshold = this.getTestThreshold(test);
        
        scores.push({
          feature,
          test,
          statistic,
          pValue: this.estimatePValue(statistic, test),
          threshold,
          drifted: statistic > threshold,
          changeDirection: this.determineDirection(refValues, currValues),
        });
      }
    }

    return scores;
  }

  private runStatisticalTest(
    reference: number[],
    current: number[],
    test: DriftTest
  ): number {
    switch (test) {
      case 'kolmogorov_smirnov':
        return this.ksStatistic(reference, current);
      case 'population_stability_index':
        return this.psi(reference, current);
      case 'kl_divergence':
        return this.klDivergence(reference, current);
      case 'jensen_shannon':
        return this.jensenShannon(reference, current);
      case 'wasserstein':
        return this.wassersteinDistance(reference, current);
      default:
        return this.ksStatistic(reference, current);
    }
  }

  private ksStatistic(reference: number[], current: number[]): number {
    const allValues = [...reference, ...current];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const bins = 10;
    const binWidth = (max - min) / bins;

    const refBins = new Array(bins).fill(0);
    const currBins = new Array(bins).fill(0);

    reference.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      refBins[Math.max(0, bin)]++;
    });

    current.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      currBins[Math.max(0, bin)]++;
    });

    const refCdf = refBins.map((c, i) => 
      refBins.slice(0, i + 1).reduce((a, b) => a + b, 0) / reference.length
    );
    const currCdf = currBins.map((c, i) => 
      currBins.slice(0, i + 1).reduce((a, b) => a + b, 0) / current.length
    );

    return Math.max(...refCdf.map((r, i) => Math.abs(r - currCdf[i])));
  }

  private psi(reference: number[], current: number[]): number {
    const allValues = [...reference, ...current];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const bins = 10;
    const binWidth = (max - min) / bins;

    const refBins = new Array(bins).fill(0);
    const currBins = new Array(bins).fill(0);

    reference.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      refBins[Math.max(0, bin)]++;
    });

    current.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      currBins[Math.max(0, bin)]++;
    });

    let psi = 0;
    for (let i = 0; i < bins; i++) {
      const p = refBins[i] / reference.length || 0.001;
      const q = currBins[i] / current.length || 0.001;
      psi += (q - p) * Math.log(q / p);
    }

    return psi;
  }

  private klDivergence(reference: number[], current: number[]): number {
    const allValues = [...reference, ...current];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const bins = 10;
    const binWidth = (max - min) / bins;

    const refBins = new Array(bins).fill(0);
    const currBins = new Array(bins).fill(0);

    reference.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      refBins[Math.max(0, bin)]++;
    });

    current.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      currBins[Math.max(0, bin)]++;
    });

    const refProbs = refBins.map(b => b / reference.length);
    const currProbs = currBins.map(b => b / current.length);

    let kl = 0;
    for (let i = 0; i < bins; i++) {
      if (refProbs[i] > 0 && currProbs[i] > 0) {
        kl += currProbs[i] * Math.log(currProbs[i] / refProbs[i]);
      }
    }

    return kl;
  }

  private jensenShannon(reference: number[], current: number[]): number {
    const allValues = [...reference, ...current];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const bins = 10;
    const binWidth = (max - min) / bins;

    const refBins = new Array(bins).fill(0);
    const currBins = new Array(bins).fill(0);

    reference.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      refBins[Math.max(0, bin)]++;
    });

    current.forEach(v => {
      const bin = Math.min(Math.floor((v - min) / binWidth), bins - 1);
      currBins[Math.max(0, bin)]++;
    });

    const refProbs = refBins.map(b => b / reference.length);
    const currProbs = currBins.map(b => b / current.length);

    // JSD = 0.5 * KL(P || M) + 0.5 * KL(Q || M) where M = 0.5 * (P + Q)
    const mProbs = refProbs.map((p, i) => (p + currProbs[i]) / 2);
    
    let klP = 0, klQ = 0;
    for (let i = 0; i < bins; i++) {
      if (refProbs[i] > 0 && mProbs[i] > 0) {
        klP += refProbs[i] * Math.log(refProbs[i] / mProbs[i]);
      }
      if (currProbs[i] > 0 && mProbs[i] > 0) {
        klQ += currProbs[i] * Math.log(currProbs[i] / mProbs[i]);
      }
    }

    return 0.5 * (klP + klQ);
  }

  private wassersteinDistance(reference: number[], current: number[]): number {
    const sortedRef = [...reference].sort((a, b) => a - b);
    const sortedCurr = [...current].sort((a, b) => a - b);
    
    // Approximate using sorted quantiles
    const n = Math.min(sortedRef.length, sortedCurr.length, 100);
    let distance = 0;
    
    for (let i = 0; i < n; i++) {
      const refQuantile = sortedRef[Math.floor(i * sortedRef.length / n)];
      const currQuantile = sortedCurr[Math.floor(i * sortedCurr.length / n)];
      distance += Math.abs(refQuantile - currQuantile);
    }
    
    return distance / n;
  }

  private estimatePValue(statistic: number, test: DriftTest): number {
    // Simplified p-value estimation based on statistic magnitude
    const thresholds = {
      kolmogorov_smirnov: 0.2,
      population_stability_index: 0.2,
      kl_divergence: 0.5,
      jensen_shannon: 0.3,
      wasserstein: 0.5,
    };
    
    const threshold = thresholds[test] || 0.2;
    const ratio = statistic / threshold;
    
    if (ratio <= 1) return Math.max(0.05, 1 - ratio);
    if (ratio <= 2) return Math.max(0.01, 0.05 - (ratio - 1) * 0.04);
    if (ratio <= 5) return Math.max(0.001, 0.01 - (ratio - 2) * 0.003);
    return 0.001;
  }

  private getTestThreshold(test: DriftTest): number {
    const thresholds: Record<DriftTest, number> = {
      kolmogorov_smirnov: 0.2,
      chi_squared: 0.1,
      population_stability_index: 0.2,
      kl_divergence: 0.5,
      jensen_shannon: 0.3,
      wasserstein: 0.5,
    };
    return thresholds[test];
  }

  private computeOverallDriftScore(scores: DriftScore[]): number {
    if (scores.length === 0) return 0;
    const driftedCount = scores.filter(s => s.drifted).length;
    return driftedCount / scores.length;
  }

  private classifyDriftSeverity(score: number): DriftDetectionResult['driftSeverity'] {
    if (score < 0.1) return 'none';
    if (score < 0.25) return 'mild';
    if (score < 0.5) return 'moderate';
    if (score < 0.75) return 'severe';
    return 'critical';
  }

  private classifyRiskLevel(score: number): GovernanceReport['riskLevel'] {
    if (score >= 0.9) return 'low';
    if (score >= 0.75) return 'medium';
    if (score >= 0.5) return 'high';
    return 'critical';
  }

  private determineDirection(reference: number[], current: number[]): 'increase' | 'decrease' | 'shift' {
    const refMean = reference.reduce((a, b) => a + b, 0) / reference.length;
    const currMean = current.reduce((a, b) => a + b, 0) / current.length;
    const refStd = Math.sqrt(reference.reduce((a, b) => a + Math.pow(b - refMean, 2), 0) / reference.length);
    
    if (Math.abs(currMean - refMean) < 0.1 * refStd) return 'shift';
    return currMean > refMean ? 'increase' : 'decrease';
  }

  private computePerformanceMetrics(predictions: PredictionRecord[]): PerformanceMetrics {
    if (predictions.length === 0) {
      return { sampleSize: 0, timestamp: new Date() };
    }

    const actuals = predictions.map(p => p.actual!);
    const preds = predictions.map(p => p.prediction);

    const n = predictions.length;
    let correct = 0;
    let truePos = 0, falsePos = 0, falseNeg = 0;
    let sumAbsError = 0;
    let sumSquaredError = 0;

    for (let i = 0; i < n; i++) {
      const predictedClass = preds[i] >= 0.5 ? 1 : 0;
      const actualClass = actuals[i] >= 0.5 ? 1 : 0;

      if (predictedClass === actualClass) correct++;
      if (predictedClass === 1 && actualClass === 1) truePos++;
      if (predictedClass === 1 && actualClass === 0) falsePos++;
      if (predictedClass === 0 && actualClass === 1) falseNeg++;

      const error = actuals[i] - preds[i];
      sumAbsError += Math.abs(error);
      sumSquaredError += error * error;
    }

    const precision = truePos + falsePos > 0 ? truePos / (truePos + falsePos) : undefined;
    const recall = truePos + falseNeg > 0 ? truePos / (truePos + falseNeg) : undefined;

    return {
      accuracy: correct / n,
      precision,
      recall,
      f1Score: precision && recall && precision + recall > 0 
        ? 2 * precision * recall / (precision + recall) 
        : undefined,
      rmse: Math.sqrt(sumSquaredError / n),
      mae: sumAbsError / n,
      sampleSize: n,
      timestamp: new Date(),
    };
  }

  private computeGovernanceScore(
    bias: BiasAuditResult,
    drift: DriftDetectionResult,
    performance: PerformanceMetrics
  ): Probability {
    const biasScore = bias.overallScore;
    const driftScore = 1 - drift.overallDriftScore;
    const perfScore = performance.accuracy || 0.5;

    const weights = { bias: 0.4, drift: 0.3, performance: 0.3 };
    const score = weights.bias * biasScore + weights.drift * driftScore + weights.performance * perfScore;

    return Math.min(1, Math.max(0, score)) as Probability;
  }

  private generateBiasRecommendations(violations: BiasViolation[]): string[] {
    const recommendations: string[] = [];
    
    if (violations.length === 0) {
      recommendations.push('No bias violations detected. Continue monitoring.');
      return recommendations;
    }

    const criticalViolations = violations.filter(v => v.severity === 'critical' || v.severity === 'high');
    if (criticalViolations.length > 0) {
      recommendations.push('URGENT: Address critical/high bias violations immediately');
      recommendations.push('Consider recalibrating model thresholds for affected groups');
    }

    recommendations.push('Review training data for representation imbalances');
    recommendations.push('Consider implementing adversarial debiasing');
    recommendations.push('Increase monitoring frequency for affected metrics');

    return recommendations;
  }

  private generateDriftRecommendations(
    scores: DriftScore[],
    severity: DriftDetectionResult['driftSeverity']
  ): string[] {
    const recommendations: string[] = [];
    const driftedFeatures = [...new Set(scores.filter(s => s.drifted).map(s => s.feature))];

    if (severity === 'none') {
      recommendations.push('No significant drift detected. Continue regular monitoring.');
      return recommendations;
    }

    if (severity === 'critical' || severity === 'severe') {
      recommendations.push('URGENT: Model drift exceeds critical threshold');
      recommendations.push('Consider immediately retraining model with recent data');
      recommendations.push('Investigate data pipeline for changes');
    }

    recommendations.push(`Drift detected in features: ${driftedFeatures.join(', ')}`);
    recommendations.push('Review recent changes to data sources or preprocessing');
    recommendations.push('Update feature engineering if distribution shifts are expected');
    recommendations.push('Consider online learning for gradual adaptation');

    return recommendations;
  }

  private generateActionItems(
    bias: BiasAuditResult,
    drift: DriftDetectionResult
  ): ActionItem[] {
    const items: ActionItem[] = [];

    // Critical bias issues
    for (const violation of bias.violations.filter(v => v.severity === 'critical' || v.severity === 'high')) {
      items.push({
        id: `bias-${violation.metric}-${Date.now()}`,
        type: 'threshold_adjustment',
        priority: violation.severity,
        description: `Fix ${violation.metric} disparity for ${violation.affectedGroups.join(', ')}`,
        createdAt: new Date(),
        status: 'pending',
        remediation: violation.remediation,
      });
    }

    // Critical drift
    if (drift.driftSeverity === 'severe' || drift.driftSeverity === 'critical') {
      items.push({
        id: `drift-${drift.modelId}-${Date.now()}`,
        type: 'retrain',
        priority: drift.driftSeverity === 'critical' ? 'critical' : 'high',
        description: `Retrain model due to ${drift.driftSeverity} drift in ${drift.affectedFeatures.join(', ')}`,
        createdAt: new Date(),
        status: 'pending',
      });
    }

    return items;
  }

  private interpretDisparity(disparity: number): string {
    if (disparity < 0.05) return 'Minimal disparity - within acceptable range';
    if (disparity < 0.1) return 'Minor disparity - monitor closely';
    if (disparity < 0.2) return 'Moderate disparity - intervention recommended';
    return 'Significant disparity - immediate action required';
  }

  private getRemediationForMetric(metric: FairnessMetric): string {
    const remediations: Record<FairnessMetric, string> = {
      demographic_parity: 'Adjust decision thresholds per group or collect more balanced training data',
      equal_opportunity: 'Ensure positive outcomes are equally accessible across groups',
      predictive_parity: 'Verify that predictions are equally accurate across groups',
      calibration: 'Recalibrate model scores for affected groups',
      treatment_equality: 'Balance error rates across protected groups',
      impact_parity: 'Review impact of decisions on different demographic groups',
    };
    return remediations[metric];
  }

  private getAllFeatures(predictions: PredictionRecord[]): string[] {
    const features = new Set<string>();
    predictions.forEach(p => Object.keys(p.inputFeatures).forEach(f => features.add(f)));
    return [...features];
  }

  private createInsufficientDataResult(modelId: string, requiredSample: number): BiasAuditResult {
    return {
      modelId,
      auditTimestamp: new Date(),
      overallScore: 0.5 as Probability,
      groupMetrics: [],
      fairnessMetrics: [],
      violations: [{
        severity: 'medium',
        metric: 'demographic_parity',
        description: 'Insufficient data for reliable bias audit',
        affectedGroups: [],
        disparity: 0,
        remediation: `Collect at least ${requiredSample} predictions`,
      }],
      recommendations: ['Insufficient data for bias audit. Continue collecting predictions.'],
      complianceStatus: 'review_required',
    };
  }

  private createInsufficientDataDriftResult(modelId: string): DriftDetectionResult {
    return {
      modelId,
      testTimestamp: new Date(),
      referencePeriod: { start: new Date(), end: new Date() },
      monitoringPeriod: { start: new Date(), end: new Date() },
      driftScores: [],
      overallDriftScore: 0,
      driftDetected: false,
      driftSeverity: 'none',
      affectedFeatures: [],
      recommendations: ['Insufficient data for drift detection. Continue monitoring.'],
    };
  }

  private determineComplianceStatus(violations: BiasViolation[]): ComplianceStatus {
    const hasCritical = violations.some(v => v.severity === 'critical');
    if (hasCritical) return 'non_compliant';
    
    const hasHigh = violations.some(v => v.severity === 'high');
    if (hasHigh) return 'review_required';
    
    if (violations.length > 0) return 'review_required';
    
    return 'compliant';
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createModelGovernanceService(): ModelGovernanceService {
  return new ModelGovernanceService();
}

export default ModelGovernanceService;
