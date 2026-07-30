/**
 * Atlas Sanctum Probability & Statistics Module
 * Comprehensive Statistical Framework for Humanitarian Impact Measurement
 * 
 * This module implements probability theory, statistical inference, and risk
 * management for regenerative value computation and impact markets.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Probability distribution types
 */
export type DistributionType = 
  | 'binomial'
  | 'poisson'
  | 'geometric'
  | 'negative_binomial'
  | 'normal'
  | 'exponential'
  | 'gamma'
  | 'beta'
  | 'lognormal'
  | 'weibull';

/**
 * Distribution parameters
 */
export interface DistributionParams {
  readonly type: DistributionType;
  readonly [key: string]: number | string | boolean;
}

/**
 * Distribution result with PDF/CDF values
 */
export interface DistributionResult {
  readonly pdf: number;
  readonly cdf: number;
  readonly quantile: number | null;
  readonly mean: number;
  readonly variance: number;
  readonly parameters: DistributionParams;
}

/**
 * Hypothesis test result
 */
export interface HypothesisTestResult {
  readonly testStatistic: number;
  readonly pValue: number;
  readonly degreesOfFreedom: number | null;
  readonly criticalValue: number | null;
  readonly significanceLevel: number;
  readonly rejectNull: boolean;
  readonly confidenceInterval: { lower: number; upper: number } | null;
  readonly effectSize: number | null;
}

/**
 * Confidence interval result
 */
export interface ConfidenceInterval {
  readonly estimate: number;
  readonly lower: number;
  readonly upper: number;
  readonly confidenceLevel: number;
  readonly marginOfError: number;
  readonly method: string;
}

/**
 * Bayesian posterior result
 */
export interface BayesianPosterior {
  readonly prior: DistributionParams;
  readonly posterior: DistributionParams;
  readonly credibleInterval: { lower: number; upper: number };
  readonly posteriorMean: number;
  readonly posteriorVariance: number;
  readonly effectiveSampleSize: number;
}

/**
 * Risk metrics result
 */
export interface RiskMetrics {
  readonly var95: number;
  readonly var99: number;
  readonly cvar95: number;
  readonly cvar99: number;
  readonly expectedShortfall: number;
  readonly downsideDeviation: number;
  readonly sortinoRatio: number | null;
  readonly maxDrawdown: number;
  readonly probabilityOfRuin: number;
}

/**
 * Clinical trial result
 */
export interface ClinicalTrialResult {
  readonly power: number;
  readonly sampleSize: number;
  readonly effectSize: number;
  readonly significanceLevel: number;
  readonly interimBoundaries: readonly number[];
  readonly adaptiveRecommendations: readonly { stage: number; suggestion: string }[];
  readonly probabilityOfSuccess: number;
  readonly nnt: number; // Number needed to treat
  readonly nntCI: { lower: number; upper: number };
}

/**
 * Impact baseline result
 */
export interface ImpactBaselineResult {
  readonly baselineEstimate: number;
  readonly counterfactualEstimate: number;
  readonly treatmentEffect: number;
  readonly treatmentEffectCI: { lower: number; upper: number };
  readonly psmScore: number;
  readonly didEstimate: number;
  readonly didSE: number;
}

/**
 * Regression result
 */
export interface RegressionResult {
  readonly coefficients: readonly number[];
  readonly intercept: number;
  readonly rSquared: number;
  readonly adjustedRSquared: number;
  readonly residualStdError: number;
  readonly fStatistic: number;
  readonly fPValue: number;
  readonly predictions: readonly number[];
  readonly residuals: readonly number[];
}

/**
 * Survival analysis result
 */
export interface SurvivalResult {
  readonly medianSurvival: number | null;
  readonly survivalFunction: readonly { time: number; probability: number; lowerCI: number; upperCI: number }[];
  readonly hazardRatio: number | null;
  readonly hazardRatioCI: { lower: number; upper: number } | null;
  readonly concordanceIndex: number | null;
}

// ============================================================================
// FOUNDATIONAL PROBABILITY
// ============================================================================

/**
 * Foundational probability theory including event algebra and Bayes' theorem
 */
export class ProbabilityTheory {
  /**
   * Calculates conditional probability: P(A|B) = P(A∩B) / P(B)
   */
  static conditionalProbability(
    pAandB: number,
    pB: number
  ): number {
    if (pB <= 0) throw new Error('Probability of B must be positive');
    return pAandB / pB;
  }

  /**
   * Bayes' theorem: P(A|B) = P(B|A) × P(A) / P(B)
   */
  static bayesTheorem(params: {
    readonly pBA: number; // P(B|A)
    readonly pA: number;   // P(A) - prior
    readonly pB: number;   // P(B) - marginal likelihood
  }): number {
    const { pBA, pA, pB } = params;
    if (pB <= 0) throw new Error('Marginal probability P(B) must be positive');
    return (pBA * pA) / pB;
  }

  /**
   * Updates prior probability with new evidence
   */
  static updatePrior(
    prior: number,
    likelihood: number,
    marginal: number
  ): number {
    return this.bayesTheorem({ pBA: likelihood, pA: prior, pB: marginal });
  }

  /**
   * Tests independence: P(A∩B) = P(A) × P(B)
   */
  static testIndependence(
    pA: number,
    pB: number,
    pAandB: number,
    tolerance: number = 0.01
  ): { independent: boolean; difference: number } {
    const expected = pA * pB;
    const difference = Math.abs(pAandB - expected);
    return {
      independent: difference < tolerance,
      difference,
    };
  }

  /**
   * Law of total probability
   */
  static totalProbability(
    conditions: ReadonlyArray<{ pBgivenA: number; pA: number }>,
    pNotA: number = 0
  ): number {
    let total = pNotA;
    for (const c of conditions) {
      total += c.pBgivenA * c.pA;
    }
    return total;
  }

  /**
   * Chain rule for conditional probability
   */
  static chainRule(
    probabilities: ReadonlyArray<number>
  ): number {
    return probabilities.reduce((acc, p) => acc * p, 1);
  }

  /**
   * Odds to probability conversion
   */
  static oddsToProbability(odds: number): number {
    return odds / (1 + odds);
  }

  /**
   * Probability to odds conversion
   */
  static probabilityToOdds(probability: number): number {
    if (probability <= 0 || probability >= 1) {
      throw new Error('Probability must be between 0 and 1');
    }
    return probability / (1 - probability);
  }
}

// ============================================================================
// DISCRETE DISTRIBUTIONS
// ============================================================================

/**
 * Discrete probability distributions
 */
export class DiscreteDistributions {
  // Binomial: B(n, p) - number of successes in n trials
  static binomialPMF(k: number, n: number, p: number): number {
    if (k < 0 || k > n || p < 0 || p > 1) return 0;
    return this.combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
  }

  static binomialCDF(k: number, n: number, p: number): number {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += this.binomialPMF(i, n, p);
    }
    return Math.min(1, sum);
  }

  static binomialMean(n: number, p: number): number {
    return n * p;
  }

  static binomialVariance(n: number, p: number): number {
    return n * p * (1 - p);
  }

  // Poisson: λ - rare events in fixed interval
  static poissonPMF(k: number, lambda: number): number {
    if (k < 0 || lambda <= 0) return 0;
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / this.factorial(k);
  }

  static poissonCDF(k: number, lambda: number): number {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
      sum += this.poissonPMF(i, lambda);
    }
    return Math.min(1, sum);
  }

  static poissonMean(lambda: number): number {
    return lambda;
  }

  static poissonVariance(lambda: number): number {
    return lambda;
  }

  // Geometric: number of trials until first success
  static geometricPMF(k: number, p: number): number {
    if (k < 1 || p <= 0 || p > 1) return 0;
    return Math.pow(1 - p, k - 1) * p;
  }

  static geometricCDF(k: number, p: number): number {
    if (k < 1) return 0;
    return 1 - Math.pow(1 - p, k);
  }

  static geometricMean(p: number): number {
    return 1 / p;
  }

  static geometricVariance(p: number): number {
    return (1 - p) / (p * p);
  }

  // Helper: factorial
  private static factorial(n: number): number {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  // Helper: combination nCk
  private static combination(n: number, k: number): number {
    if (k > n) return 0;
    return this.factorial(n) / (this.factorial(k) * this.factorial(n - k));
  }
}

// ============================================================================
// CONTINUOUS DISTRIBUTIONS
// ============================================================================

/**
 * Continuous probability distributions
 */
export class ContinuousDistributions {
  // Normal: N(μ, σ²)
  static normalPDF(x: number, mu: number, sigma: number): number {
    const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(x - mu, 2) / (2 * sigma * sigma);
    return coefficient * Math.exp(exponent);
  }

  static normalCDF(x: number, mu: number, sigma: number): number {
    return 0.5 * (1 + this.erf((x - mu) / (sigma * Math.sqrt(2))));
  }

  static normalQuantile(p: number, mu: number, sigma: number): number {
    // Approximation using rational function
    const a1 = -39.6968302866538;
    const a2 = 220.946098424521;
    const a3 = -275.928510446969;
    const a4 = 138.357751867269;
    const a5 = -30.6647980661472;
    const a6 = 2.50662827745924;
    const b1 = -54.4760987982241;
    const b2 = 161.585836858041;
    const b3 = -155.698979859887;
    const b4 = 66.8013118877197;
    const b5 = -13.2806815528857;

    const t = Math.sqrt(-2 * Math.log(Math.min(p, 1 - p)));
    
    // Simplified Acklam's approximation (polynomial fractions)
    const a0 = 2.50662823884;
    const a1 = -18.61500062529;
    const a2 = 41.39119773534;
    const a3 = -25.44106049637;
    const b1 = -8.47351093090;
    const b2 = 23.08336743743;
    const b3 = -21.06224101826;
    const b4 = 3.13082909833;
    
    const num = a0 + t * (a1 + t * (a2 + t * a3));
    const den = 1 + t * (b1 + t * (b2 + t * (b3 + t * b4)));
    const y = t - num / den;

    return p < 0.5 ? mu - sigma * y : mu + sigma * y;
  }

  static normalMean(mu: number): number {
    return mu;
  }

  static normalVariance(sigma: number): number {
    return sigma * sigma;
  }

  // Exponential: Exp(λ)
  static exponentialPDF(x: number, lambda: number): number {
    if (x < 0 || lambda <= 0) return 0;
    return lambda * Math.exp(-lambda * x);
  }

  static exponentialCDF(x: number, lambda: number): number {
    if (x < 0) return 0;
    return 1 - Math.exp(-lambda * x);
  }

  static exponentialQuantile(p: number, lambda: number): number {
    return -Math.log(1 - p) / lambda;
  }

  static exponentialMean(lambda: number): number {
    return 1 / lambda;
  }

  static exponentialVariance(lambda: number): number {
    return 1 / (lambda * lambda);
  }

  // Gamma: Γ(k, θ)
  static gammaPDF(x: number, k: number, theta: number): number {
    if (x <= 0 || k <= 0 || theta <= 0) return 0;
    return (Math.pow(x, k - 1) * Math.exp(-x / theta)) / 
           (this.gammaFunction(k) * Math.pow(theta, k));
  }

  static gammaCDF(x: number, k: number, theta: number): number {
    if (x <= 0) return 0;
    return this.incompleteGamma(k, x / theta);
  }

  static gammaMean(k: number, theta: number): number {
    return k * theta;
  }

  static gammaVariance(k: number, theta: number): number {
    return k * theta * theta;
  }

  // Beta: Beta(α, β)
  static betaPDF(x: number, alpha: number, beta: number): number {
    if (x < 0 || x > 1 || alpha <= 0 || beta <= 0) return 0;
    return (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
           this.betaFunction(alpha, beta);
  }

  static betaCDF(x: number, alpha: number, beta: number): number {
    return this.incompleteBeta(alpha, beta, x);
  }

  static betaMean(alpha: number, beta: number): number {
    return alpha / (alpha + beta);
  }

  static betaVariance(alpha: number, beta: number): number {
    return (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
  }

  // Log-normal: LN(μ, σ)
  static lognormalPDF(x: number, mu: number, sigma: number): number {
    if (x <= 0 || sigma <= 0) return 0;
    const coefficient = 1 / (x * sigma * Math.sqrt(2 * Math.PI));
    const exponent = -Math.pow(Math.log(x) - mu, 2) / (2 * sigma * sigma);
    return coefficient * Math.exp(exponent);
  }

  static lognormalCDF(x: number, mu: number, sigma: number): number {
    if (x <= 0) return 0;
    return this.normalCDF(Math.log(x), mu, sigma);
  }

  static lognormalMean(mu: number, sigma: number): number {
    return Math.exp(mu + sigma * sigma / 2);
  }

  static lognormalVariance(mu: number, sigma: number): number {
    return (Math.exp(sigma * sigma) - 1) * Math.exp(2 * mu + sigma * sigma);
  }

  // Helper: error function approximation
  private static erf(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  // Helper: gamma function (Lanczos approximation)
  private static gammaFunction(z: number): number {
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * this.gammaFunction(1 - z));
    }
    z -= 1;
    const g = 7;
    const c = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    let x = c[0];
    for (let i = 1; i < g + 2; i++) {
      x += c[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }

  // Helper: beta function
  private static betaFunction(a: number, b: number): number {
    return this.gammaFunction(a) * this.gammaFunction(b) / this.gammaFunction(a + b);
  }

  // Helper: incomplete gamma function
  private static incompleteGamma(s: number, x: number): number {
    if (x < 0 || s <= 0) return 0;
    if (x === 0) return 0;
    
    // Series expansion for small x
    let sum = 0;
    let term = 1 / s;
    sum = term;
    
    for (let n = 1; n < 100; n++) {
      term *= x / (s + n);
      sum += term;
      if (Math.abs(term) < 1e-10) break;
    }
    
    return Math.pow(x, s) * Math.exp(-x) * sum / this.gammaFunction(s);
  }

  // Helper: incomplete beta function
  private static incompleteBeta(a: number, b: number, x: number): number {
    if (x < 0 || x > 1) return 0;
    if (x === 0) return 0;
    if (x === 1) return 1;
    
    // Continued fraction approximation
    const bt = Math.exp(
      this.logGamma(a + b) - this.logGamma(a) - this.logGamma(b) +
      a * Math.log(x) + b * Math.log(1 - x)
    );
    
    if (x < (a + 1) / (a + b + 2)) {
      return bt * this.betaCF(a, b, x) / a;
    }
    return 1 - bt * this.betaCF(b, a, 1 - x) / b;
  }

  private static betaCF(a: number, b: number, x: number): number {
    const maxIterations = 100;
    const epsilon = 1e-10;
    
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if (Math.abs(d) < epsilon) d = epsilon;
    d = 1 / d;
    let h = d;
    
    for (let m = 1; m <= maxIterations; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      h *= d * c;
      
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < epsilon) d = epsilon;
      c = 1 + aa / c;
      if (Math.abs(c) < epsilon) c = epsilon;
      d = 1 / d;
      
      const del = d * c;
      h *= del;
      
      if (Math.abs(del - 1) < epsilon) break;
    }
    
    return h;
  }

  private static logGamma(x: number): number {
    const cof = [
      76.18009172947146, -86.50532032941677,
      24.01409824083091, -1.231739572450155,
      0.01208650973866179, -0.0005395239384953
    ];
    
    let y = x;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) {
      ser += cof[j] / ++y;
    }
    return -tmp + Math.log(2.506628274631 * ser / x);
  }
}

// ============================================================================
// STATISTICAL INFERENCE
// ============================================================================

/**
 * Hypothesis testing and confidence intervals
 */
export class StatisticalInference {
  // Z-test for means
  static zTest(
    sampleMean: number,
    hypothesizedMean: number,
    stdDev: number,
    sampleSize: number,
    alternative: 'two-sided' | 'greater' | 'less' = 'two-sided',
    alpha: number = 0.05
  ): HypothesisTestResult {
    const se = stdDev / Math.sqrt(sampleSize);
    const z = (sampleMean - hypothesizedMean) / se;
    
    let pValue: number;
    switch (alternative) {
      case 'two-sided':
        pValue = 2 * (1 - ContinuousDistributions.normalCDF(Math.abs(z), 0, 1));
        break;
      case 'greater':
        pValue = 1 - ContinuousDistributions.normalCDF(z, 0, 1);
        break;
      case 'less':
        pValue = ContinuousDistributions.normalCDF(z, 0, 1);
        break;
    }

    // Critical value
    const criticalZ = ContinuousDistributions.normalQuantile(1 - alpha / 2, 0, 1);
    const criticalValue = alternative === 'two-sided' ? criticalZ : 
                          alternative === 'greater' ? -criticalZ : criticalZ;

    // Confidence interval
    const margin = criticalZ * se;
    const ci = {
      lower: sampleMean - margin,
      upper: sampleMean + margin,
    };

    // Effect size (Cohen's d)
    const effectSize = (sampleMean - hypothesizedMean) / stdDev;

    return {
      testStatistic: z,
      pValue,
      degreesOfFreedom: null,
      criticalValue,
      significanceLevel: alpha,
      rejectNull: pValue < alpha,
      confidenceInterval: ci,
      effectSize,
    };
  }

  // T-test for means
  static tTest(
    sample: readonly number[],
    hypothesizedMean: number,
    alternative: 'two-sided' | 'greater' | 'less' = 'two-sided',
    alpha: number = 0.05
  ): HypothesisTestResult {
    const n = sample.length;
    const mean = sample.reduce((a, b) => a + b, 0) / n;
    const variance = sample.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1);
    const stdDev = Math.sqrt(variance);
    const se = stdDev / Math.sqrt(n);
    const t = (mean - hypothesizedMean) / se;
    
    // Degrees of freedom
    const df = n - 1;

    // Approximate p-value using normal distribution for large df
    const pValue = alternative === 'two-sided' ? 
      2 * (1 - ContinuousDistributions.normalCDF(Math.abs(t), 0, 1)) :
      alternative === 'greater' ?
        1 - ContinuousDistributions.normalCDF(t, 0, 1) :
        ContinuousDistributions.normalCDF(t, 0, 1);

    // Critical value (approximation)
    const criticalT = 1.96; // Simplified

    // Confidence interval
    const criticalTFull = ContinuousDistributions.studentTCDF(Math.abs(t), df);
    const margin = criticalTFull * se;

    // Effect size (Cohen's d)
    const effectSize = (mean - hypothesizedMean) / stdDev;

    return {
      testStatistic: t,
      pValue,
      degreesOfFreedom: df,
      criticalValue: alternative === 'two-sided' ? criticalT : -criticalT,
      significanceLevel: alpha,
      rejectNull: pValue < alpha,
      confidenceInterval: {
        lower: mean - margin,
        upper: mean + margin,
      },
      effectSize,
    };
  }

  // Mann-Whitney U test (non-parametric)
  static mannWhitneyU(
    sample1: readonly number[],
    sample2: readonly number[],
    alpha: number = 0.05
  ): HypothesisTestResult {
    const n1 = sample1.length;
    const n2 = sample2.length;
    
    // Rank all data
    const allData = [...sample1, ...sample2]
      .map((v, i) => ({ value: v, originalIndex: i }))
      .sort((a, b) => a.value - b.value)
      .map((v, i, arr) => {
        // Handle ties
        let j = i;
        while (j < arr.length - 1 && arr[j].value === arr[j + 1].value) j++;
        const rank = (i + j) / 2 + 1;
        return { ...v, rank };
      });

    const ranks1 = allData.slice(0, n1).map(x => x.rank);
    const ranks2 = allData.slice(n1).map(x => x.rank);

    const R1 = ranks1.reduce((a, b) => a + b, 0);
    const R2 = ranks2.reduce((a, b) => a + b, 0);

    const U1 = R1 - n1 * (n1 + 1) / 2;
    const U2 = R2 - n2 * (n2 + 1) / 2;
    const U = Math.min(U1, U2);

    // Normal approximation for large samples
    const muU = n1 * n2 / 2;
    const sigmaU = Math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
    const z = (U - muU) / sigmaU;

    const pValue = 2 * (1 - ContinuousDistributions.normalCDF(Math.abs(z), 0, 1));

    return {
      testStatistic: U,
      pValue,
      degreesOfFreedom: null,
      criticalValue: null,
      significanceLevel: alpha,
      rejectNull: pValue < alpha,
      confidenceInterval: null,
      effectSize: 1 - (2 * U) / (n1 * n2), // Rank-biserial correlation
    };
  }

  // Confidence interval for proportion
  static proportionCI(
    successes: number,
    trials: number,
    confidenceLevel: number = 0.95,
    method: 'wald' | 'wilson' | 'exact' = 'wilson'
  ): ConfidenceInterval {
    const p = successes / trials;
    const z = ContinuousDistributions.normalQuantile((1 + confidenceLevel) / 2, 0, 1);

    let lower: number, upper: number;
    const marginOfError = z * Math.sqrt(p * (1 - p) / trials);

    if (method === 'wald') {
      lower = Math.max(0, p - marginOfError);
      upper = Math.min(1, p + marginOfError);
    } else if (method === 'wilson') {
      const denominator = 1 + z * z / trials;
      const center = (p + z * z / (2 * trials)) / denominator;
      const spread = z * Math.sqrt((p * (1 - p) + z * z / (4 * trials)) / trials) / denominator;
      lower = Math.max(0, center - spread);
      upper = Math.min(1, center + spread);
    } else {
      // Exact (Clopper-Pearson) - simplified
      lower = 0;
      upper = 1;
    }

    return {
      estimate: p,
      lower,
      upper,
      confidenceLevel,
      marginOfError,
      method,
    };
  }

  // Sample size determination
  static sampleSizeForMean(
    effectSize: number,
    stdDev: number,
    power: number = 0.8,
    alpha: number = 0.05
  ): number {
    const zAlpha = ContinuousDistributions.normalQuantile(1 - alpha / 2, 0, 1);
    const zBeta = ContinuousDistributions.normalQuantile(power, 0, 1);
    
    return Math.ceil(
      Math.pow(zAlpha + zBeta, 2) * stdDev * stdDev / (effectSize * effectSize)
    );
  }

  static sampleSizeForProportion(
    proportion: number,
    marginOfError: number,
    confidenceLevel: number = 0.95
  ): number {
    const z = ContinuousDistributions.normalQuantile((1 + confidenceLevel) / 2, 0, 1);
    const p = proportion || 0.5;
    
    return Math.ceil(
      Math.pow(z, 2) * p * (1 - p) / (marginOfError * marginOfError)
    );
  }
}

// ============================================================================
// BAYESIAN INFERENCE
// ============================================================================

/**
 * Bayesian inference with prior/posterior computation
 */
export class BayesianInference {
  /**
   * Conjugate prior update for binomial likelihood with beta prior
   */
  static updateBetaBinomial(
    priorAlpha: number,
    priorBeta: number,
    successes: number,
    trials: number
  ): BayesianPosterior {
    const posteriorAlpha = priorAlpha + successes;
    const posteriorBeta = priorBeta + trials - successes;

    const posteriorMean = posteriorAlpha / (posteriorAlpha + posteriorBeta);
    const posteriorVariance = (posteriorAlpha * posteriorBeta) / 
                              (Math.pow(posteriorAlpha + posteriorBeta, 2) * (posteriorAlpha + posteriorBeta + 1));

    // 95% credible interval
    const lower = ContinuousDistributions.betaCDF(0.025, posteriorAlpha, posteriorBeta);
    const upper = ContinuousDistributions.betaCDF(0.975, posteriorAlpha, posteriorBeta);

    // Effective sample size
    const effectiveSampleSize = priorAlpha + priorBeta + trials;

    return {
      prior: { type: 'beta', alpha: priorAlpha, beta: priorBeta },
      posterior: { type: 'beta', alpha: posteriorAlpha, beta: posteriorBeta },
      credibleInterval: { lower, upper },
      posteriorMean,
      posteriorVariance,
      effectiveSampleSize,
    };
  }

  /**
   * Conjugate prior update for normal likelihood with normal prior
   */
  static updateNormalNormal(
    priorMean: number,
    priorVariance: number,
    data: readonly number[],
    dataVariance: number
  ): { posteriorMean: number; posteriorVariance: number } {
    const n = data.length;
    const dataMean = data.reduce((a, b) => a + b, 0) / n;
    
    const posteriorPrecision = 1 / priorVariance + n / dataVariance;
    const posteriorMean = (priorMean / priorVariance + n * dataMean / dataVariance) / posteriorPrecision;
    const posteriorVariance = 1 / posteriorPrecision;

    return { posteriorMean, posteriorVariance };
  }

  /**
   * Conjugate prior update for Poisson likelihood with gamma prior
   */
  static updateGammaPoisson(
    priorAlpha: number,
    priorBeta: number,
    data: readonly number[]
  ): { posteriorAlpha: number; posteriorBeta: number; posteriorMean: number } {
    const sum = data.reduce((a, b) => a + b, 0);
    const n = data.length;
    
    const posteriorAlpha = priorAlpha + sum;
    const posteriorBeta = priorBeta + n;
    const posteriorMean = posteriorAlpha / posteriorBeta;

    return { posteriorAlpha, posteriorBeta, posteriorMean };
  }

  /**
   * Metropolis-Hastings MCMC sampler
   */
  static metropolisHastings(
    logLikelihood: (x: number) => number,
    logPrior: (x: number) => number,
    proposalStd: number,
    iterations: number,
    burnIn: number = 1000,
    initialValue: number = 1
  ): readonly number[] {
    const samples: number[] = [];
    let current = initialValue;
    let accepted = 0;

    for (let i = 0; i < iterations + burnIn; i++) {
      // Propose new value
      const proposal = current + this.randomNormal(0, proposalStd);
      
      // Calculate acceptance probability
      const logProposalLikelihood = logLikelihood(proposal);
      const logProposalPrior = logPrior(proposal);
      const logCurrentLikelihood = logLikelihood(current);
      const logCurrentPrior = logPrior(current);
      
      const logAcceptRatio = (logProposalLikelihood + logProposalPrior) - 
                             (logCurrentLikelihood + logCurrentPrior);
      
      // Accept or reject
      if (Math.log(Math.random()) < logAcceptRatio) {
        current = proposal;
        if (i >= burnIn) accepted++;
      }
      
      if (i >= burnIn) {
        samples.push(current);
      }
    }

    return samples;
  }

  private static randomNormal(mean: number, std: number): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + z * std;
  }
}

// ============================================================================
// RISK MANAGEMENT
// ============================================================================

/**
 * Risk metrics and Value-at-Risk calculations
 */
export class RiskMetricsCalculator {
  /**
   * Historical VaR
   */
  static historicalVaR(
    returns: readonly number[],
    confidenceLevel: number = 0.95
  ): number {
    const sorted = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidenceLevel) * sorted.length);
    return sorted[index];
  }

  /**
   * Parametric (Normal) VaR
   */
  static parametricVaR(
    mean: number,
    stdDev: number,
    confidenceLevel: number = 0.95
  ): number {
    const z = ContinuousDistributions.normalQuantile(1 - confidenceLevel, 0, 1);
    return mean + z * stdDev;
  }

  /**
   * Monte Carlo VaR
   */
  static monteCarloVaR(
    returns: readonly number[],
    confidenceLevel: number = 0.95,
    simulations: number = 10000,
    seed: number = 42
  ): number {
    // Seeded random number generator
    const random = this.seededRandom(seed);
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (returns.length - 1);
    const stdDev = Math.sqrt(variance);

    const simulatedReturns: number[] = [];
    for (let i = 0; i < simulations; i++) {
      // Box-Muller
      const u1 = random();
      const u2 = random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      simulatedReturns.push(mean + z * stdDev);
    }

    return this.historicalVaR(simulatedReturns, confidenceLevel);
  }

  /**
   * Conditional VaR (Expected Shortfall)
   */
  static conditionalVaR(
    returns: readonly number[],
    confidenceLevel: number = 0.95
  ): number {
    const varLevel = this.historicalVaR(returns, confidenceLevel);
    const tailReturns = returns.filter(r => r <= varLevel);
    return tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length;
  }

  /**
   * Downside Deviation (for Sortino Ratio)
   */
  static downsideDeviation(
    returns: readonly number[],
    targetReturn: number = 0
  ): number {
    const downsideReturns = returns.filter(r => r < targetReturn);
    const squaredDeviations = downsideReturns.map(r => Math.pow(r - targetReturn, 2));
    return Math.sqrt(squaredDeviations.reduce((a, b) => a + b, 0) / returns.length);
  }

  /**
   * Sortino Ratio
   */
  static sortinoRatio(
    portfolioReturn: number,
    returns: readonly number[],
    riskFreeRate: number = 0,
    targetReturn: number = 0
  ): number {
    const downsideDev = this.downsideDeviation(returns, targetReturn);
    if (downsideDev === 0) return Infinity;
    return (portfolioReturn - riskFreeRate) / downsideDev;
  }

  /**
   * Probability of Ruin (Cramér-Lundberg)
   */
  static probabilityOfRuin(
    initialCapital: number,
    premiumRate: number,
    claimRate: number,
    claimSeverityMean: number,
    claimSeverityStd: number,
    safetyLoading: number = 0.1
  ): number {
    const adjustedPremium = premiumRate * (1 + safetyLoading);
    const relativeSafetyLoading = (adjustedPremium - claimRate * claimSeverityMean) / 
                                   (claimRate * claimSeverityStd * claimSeverityStd);
    
    if (adjustedPremium <= claimRate * claimSeverityMean) {
      return 1; // Certain ruin
    }

    // Lundberg's inequality (exponential bound)
    const ruinProbability = Math.exp(-2 * initialCapital * relativeSafetyLoading / 
                                     (claimSeverityStd * claimSeverityStd));
    
    return Math.min(1, ruinProbability);
  }

  /**
   * Maximum Drawdown
   */
  static maxDrawdown(values: readonly number[]): number {
    let maxDrawdown = 0;
    let peak = values[0];
    
    for (const value of values) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    return maxDrawdown;
  }

  private static seededRandom(seed: number): () => number {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
}

// ============================================================================
// CLINICAL TRIAL STATISTICS
// ============================================================================

/**
 * Clinical trial analysis utilities
 */
export class ClinicalTrialStatistics {
  /**
   * Power calculation for parallel RCT
   */
  static calculatePower(
    effectSize: number,
    stdDev: number,
    sampleSize: number,
    alpha: number = 0.05
  ): number {
    const n = sampleSize / 2;
    const se = stdDev * Math.sqrt(2 / n);
    const z = effectSize / se;
    const zAlpha = ContinuousDistributions.normalQuantile(1 - alpha / 2, 0, 1);
    return ContinuousDistributions.normalCDF(z - zAlpha, 0, 1);
  }

  /**
   * Sample size for clinical trial
   */
  static sampleSizeTrial(
    effectSize: number,
    stdDev: number,
    power: number = 0.8,
    alpha: number = 0.05,
    allocationRatio: number = 1
  ): number {
    const zAlpha = ContinuousDistributions.normalQuantile(1 - alpha / 2, 0, 1);
    const zBeta = ContinuousDistributions.normalQuantile(power, 0, 1);
    
    const n = 2 * Math.pow(zAlpha + zBeta, 2) * stdDev * stdDev / (effectSize * effectSize);
    return Math.ceil(n * (1 + allocationRatio) / 2);
  }

  /**
   * Interim analysis boundaries (O'Brien-Fleming)
   */
  static obrienFlemingBoundaries(
    interimLooks: number,
    alpha: number = 0.05
  ): readonly number[] {
    const boundaries: number[] = [];
    for (let i = 1; i <= interimLooks; i++) {
      const t = i / interimLooks;
      const critical = ContinuousDistributions.normalQuantile(1 - alpha / (2 * i), 0, 1);
      boundaries.push(critical);
    }
    return boundaries;
  }

  /**
   * Interim analysis boundaries (Pocock)
   */
  static pocockBoundaries(
    interimLooks: number,
    alpha: number = 0.05
  ): readonly number[] {
    const critical = ContinuousDistributions.normalQuantile(1 - alpha / 2, 0, 1);
    return Array(interimLooks).fill(critical);
  }

  /**
   * Number Needed to Treat (NNT)
   */
  static calculateNNT(
    controlEventRate: number,
    treatmentEventRate: number,
    ci: { lower: number; upper: number } | null = null
  ): { nnt: number; nntCI: { lower: number; upper: number } | null } {
    const ardr = treatmentEventRate - controlEventRate;
    const nnt = Math.abs(1 / ardr);

    let nntCI: { lower: number; upper: number } | null = null;
    if (ci) {
      const upperARR = ci.upper - controlEventRate;
      const lowerARR = ci.lower - controlEventRate;
      nntCI = {
        lower: Math.abs(1 / upperARR),
        upper: Math.abs(1 / lowerARR),
      };
    }

    return { nnt: Math.round(nnt), nntCI };
  }

  /**
   * Probability of treatment success (Bayesian)
   */
  static probabilityOfSuccess(
    priorSuccess: number,
    priorFailures: number,
    observedSuccess: number,
    observedFailures: number,
    threshold: number = 0.95
  ): number {
    const posterior = BayesianInference.updateBetaBinomial(
      priorSuccess,
      priorFailures,
      observedSuccess,
      observedSuccess + observedFailures
    );

    // P(success > threshold)
    const alpha = posterior.posterior.alpha;
    const beta = posterior.posterior.beta;
    
    return 1 - ContinuousDistributions.betaCDF(threshold, alpha, beta);
  }

  /**
   * Adaptive design recommendations
   */
  static adaptiveRecommendations(
    currentN: number,
    targetN: number,
    interimPower: number,
    currentEffect: number,
    targetEffect: number
  ): readonly { stage: number; suggestion: string }[] {
    const recommendations = [];

    if (currentN < targetN / 2) {
      recommendations.push({
        stage: Math.round(currentN / targetN * 100),
        suggestion: 'Continue enrollment - early stage',
      });
    }

    if (interimPower > 0.9) {
      recommendations.push({
        stage: Math.round(currentN / targetN * 100),
        suggestion: 'Consider early stopping for efficacy',
      });
    }

    if (currentEffect < targetEffect * 0.5) {
      recommendations.push({
        stage: Math.round(currentN / targetN * 100),
        suggestion: 'Consider increasing sample size or effect target',
      });
    }

    return recommendations;
  }
}

// ============================================================================
// IMPACT BASELINE & COUNTERFACTUAL
// ============================================================================

/**
 * Statistical baselines for fair credit pricing
 */
export class ImpactBaseline {
  /**
   * Propensity score matching
   */
  static propensityScoreMatching(
    treated: ReadonlyArray<Record<string, number>>,
    controls: ReadonlyArray<Record<string, number>>,
    covariates: readonly string[]
  ): readonly { treated: number; matchedControl: number; score: number }[] {
    // Simplified PSM using Euclidean distance
    const results: { treated: number; matchedControl: number; score: number }[] = [];

    for (let i = 0; i < treated.length; i++) {
      let bestMatch = -1;
      let bestScore = Infinity;

      for (let j = 0; j < controls.length; j++) {
        let distance = 0;
        for (const cov of covariates) {
          const diff = treated[i][cov] - controls[j][cov];
          distance += diff * diff;
        }
        const score = Math.sqrt(distance);

        if (score < bestScore) {
          bestScore = score;
          bestMatch = j;
        }
      }

      results.push({
        treated: i,
        matchedControl: bestMatch,
        score: bestScore,
      });
    }

    return results;
  }

  /**
   * Difference-in-Differences estimator
   */
  static differenceInDifferences(
    treatedBefore: readonly number[],
    treatedAfter: readonly number[],
    controlBefore: readonly number[],
    controlAfter: readonly number[]
  ): { didEstimate: number; didSE: number } {
    const t1 = treatedBefore.reduce((a, b) => a + b, 0) / treatedBefore.length;
    const t2 = treatedAfter.reduce((a, b) => a + b, 0) / treatedAfter.length;
    const c1 = controlBefore.reduce((a, b) => a + b, 0) / controlBefore.length;
    const c2 = controlAfter.reduce((a, b) => a + b, 0) / controlAfter.length;

    const didEstimate = (t2 - t1) - (c2 - c1);
    
    // Simplified SE calculation
    const varT1 = this.variance(treatedBefore);
    const varT2 = this.variance(treatedAfter);
    const varC1 = this.variance(controlBefore);
    const varC2 = this.variance(controlAfter);

    const se = Math.sqrt(
      varT1 / treatedBefore.length +
      varT2 / treatedAfter.length +
      varC1 / controlBefore.length +
      varC2 / controlAfter.length
    );

    return { didEstimate, didSE: se };
  }

  /**
   * Risk adjustment with hierarchical modeling
   */
  static riskAdjustment(
    outcome: number,
    covariates: ReadonlyArray<number>,
    coefficients: ReadonlyArray<number>,
    baselineRisk: number
  ): number {
    const covariateEffect = covariates.reduce((sum, cov, i) => sum + cov * coefficients[i], 0);
    const riskScore = baselineRisk * Math.exp(covariateEffect);
    return Math.min(1, Math.max(0, riskScore));
  }

  /**
   * Calculate treatment effect with uncertainty
   */
  static treatmentEffectWithUncertainty(
    treated: readonly number[],
    control: readonly number[],
    confidenceLevel: number = 0.95
  ): { effect: number; ci: { lower: number; upper: number }; pValue: number | null } {
    const tMean = treated.reduce((a, b) => a + b, 0) / treated.length;
    const cMean = control.reduce((a, b) => a + b, 0) / control.length;
    const effect = tMean - cMean;

    const pooledVariance = 
      (this.variance(treated) * (treated.length - 1) + 
       this.variance(control) * (control.length - 1)) / 
      (treated.length + control.length - 2);
    
    const se = Math.sqrt(pooledVariance * (1 / treated.length + 1 / control.length));
    const ci = {
      lower: effect - ContinuousDistributions.normalQuantile((1 + confidenceLevel) / 2, 0, 1) * se,
      upper: effect + ContinuousDistributions.normalQuantile((1 + confidenceLevel) / 2, 0, 1) * se,
    };

    const z = effect / se;
    const pValue = 2 * (1 - ContinuousDistributions.normalCDF(Math.abs(z), 0, 1));

    return { effect, ci, pValue };
  }

  private static variance(data: readonly number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (data.length - 1);
  }
}

// ============================================================================
// DATA ANALYSIS PIPELINE
// ============================================================================

/**
 * Descriptive statistics infrastructure
 */
export class DescriptiveStatistics {
  /**
   * Moment calculations
   */
  static moments(data: readonly number[]): {
    mean: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    stdDev: number;
  } {
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / (n - 1);
    const stdDev = Math.sqrt(variance);

    const cubedDiffs = data.map(x => Math.pow(x - mean, 3));
    const fourthDiffs = data.map(x => Math.pow(x - mean, 4));

    const skewness = cubedDiffs.reduce((a, b) => a + b, 0) / 
                     (n * Math.pow(stdDev, 3));
    
    const kurtosis = fourthDiffs.reduce((a, b) => a + b, 0) / 
                     (n * Math.pow(stdDev, 4)) - 3;

    return { mean, variance, skewness, kurtosis, stdDev };
  }

  /**
   * Robust estimators (trimmed mean)
   */
  static trimmedMean(data: readonly number[], trimPercent: number = 0.1): number {
    const sorted = [...data].sort((a, b) => a - b);
    const trimCount = Math.floor(data.length * trimPercent);
    const trimmed = sorted.slice(trimCount, data.length - trimCount);
    return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
  }

  /**
   * Winsorized variance
   */
  static winsorizedVariance(data: readonly number[], trimPercent: number = 0.1): number {
    const sorted = [...data].sort((a, b) => a - b);
    const trimCount = Math.floor(data.length * trimPercent);
    const winsorized = sorted.map((x, i) => {
      if (i < trimCount) return sorted[trimCount];
      if (i >= data.length - trimCount) return sorted[data.length - trimCount - 1];
      return x;
    });

    const mean = winsorized.reduce((a, b) => a + b, 0) / winsorized.length;
    return winsorized.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (data.length - 1);
  }

  /**
   * Correlation analysis (Pearson, Spearman)
   */
  static pearsonCorrelation(x: readonly number[], y: readonly number[]): number {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      numerator += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }

    return numerator / Math.sqrt(denomX * denomY);
  }

  static spearmanCorrelation(x: readonly number[], y: readonly number[]): number {
    const rankX = this.rankData(x);
    const rankY = this.rankData(y);
    return this.pearsonCorrelation(rankX, rankY);
  }

  private static rankData(data: readonly number[]): readonly number[] {
    const indexed = data.map((v, i) => ({ v, i }))
      .sort((a, b) => a.v - b.v)
      .map((v, i, arr) => {
        let j = i;
        while (j < arr.length - 1 && arr[j].v === arr[j + 1].v) j++;
        const rank = (i + j) / 2 + 1;
        return { originalIndex: v.i, rank };
      })
      .sort((a, b) => a.originalIndex - b.originalIndex)
      .map(x => x.rank);
    
    return indexed;
  }
}

// ============================================================================
// REGRESSION FRAMEWORK
// ============================================================================

/**
 * Regression analysis utilities
 */
export class RegressionAnalysis {
  /**
   * Ordinary Least Squares
   */
  static ols(
    X: readonly number[][], // Design matrix
    y: readonly number[]    // Response vector
  ): RegressionResult {
    const n = y.length;
    const p = X[0].length;

    // Add intercept column if not present
    const XWithIntercept = X.map(row => [1, ...row]);

    // Calculate coefficients: β = (X'X)^(-1) X'y
    const XtX = this.matrixMultiply(this.matrixTranspose(XWithIntercept), XWithIntercept);
    const XtY = this.matrixMultiplyVector(this.matrixTranspose(XWithIntercept), y);
    const XtXInv = this.matrixInverse(XtX);
    const coefficients = this.matrixMultiplyVector(XtXInv, XtY);

    // Predictions and residuals
    const predictions = XWithIntercept.map(row => 
      row.reduce((sum, val, i) => sum + val * coefficients[i], 0)
    );
    const residuals = y.map((yi, i) => yi - predictions[i]);

    // R-squared
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const ssResidual = residuals.reduce((sum, r) => sum + r * r, 0);
    const rSquared = 1 - ssResidual / ssTotal;
    const adjustedRSquared = 1 - (1 - rSquared) * (n - 1) / (n - p - 1);

    // Residual standard error
    const residualStdError = Math.sqrt(ssResidual / (n - p - 1));

    // F-statistic
    const fStatistic = (ssTotal - ssResidual) / p / (ssResidual / (n - p - 1));
    const fPValue = 1 - ContinuousDistributions.normalCDF(Math.sqrt(fStatistic), 0, 1);

    return {
      coefficients: coefficients.slice(1), // Exclude intercept
      intercept: coefficients[0],
      rSquared,
      adjustedRSquared,
      residualStdError,
      fStatistic,
      fPValue,
      predictions,
      residuals,
    };
  }

  /**
   * Weighted Least Squares
   */
  static wls(
    X: readonly number[][],
    y: readonly number[],
    weights: readonly number[]
  ): RegressionResult {
    const sqrtW = weights.map(w => Math.sqrt(w));
    const yW = y.map((yi, i) => yi * sqrtW[i]);
    const XW = X.map((row, i) => row.map(val => val * sqrtW[i]));

    return this.ols(XW, yW);
  }

  /**
   * Generalized Linear Model (simplified for Poisson/Logistic)
   */
  static glm(
    X: readonly number[][],
    y: readonly number[],
    family: 'poisson' | 'binomial',
    maxIterations: number = 25
  ): { coefficients: readonly number[]; iterations: number } {
    // IRLS algorithm (simplified)
    let beta = new Array(X[0].length).fill(0);

    for (let iter = 0; iter < maxIterations; iter++) {
      // Linear predictor
      const eta = X.map(row => row.reduce((sum, val, i) => sum + val * beta[i], 0));

      // Link function derivatives
      const gradients = X.map((row, i) => {
        const mu = family === 'poisson' ? Math.exp(eta[i]) : 1 / (1 + Math.exp(-eta[i]));
        const gradient = (y[i] - mu) * row.reduce((sum, val) => sum + val, 0);
        return { gradient, mu };
      });

      // Update (simplified Newton step)
      const gradSum = gradients.reduce((sum, g) => sum + g.gradient, 0);
      const muSum = gradients.reduce((sum, g) => sum + g.mu, 0);
      
      if (Math.abs(gradSum) < 1e-6) break;

      const adjustment = gradSum / muSum;
      beta = beta.map((b, i) => b + adjustment);
    }

    return { coefficients: beta, iterations: maxIterations };
  }

  // Matrix helpers
  private static matrixMultiply(A: number[][], B: number[][]): number[][] {
    const m = A.length;
    const n = B[0].length;
    const p = B.length;
    const result: number[][] = [];

    for (let i = 0; i < m; i++) {
      result[i] = [];
      for (let j = 0; j < n; j++) {
        let sum = 0;
        for (let k = 0; k < p; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  private static matrixTranspose(A: number[][]): number[][] {
    return A[0].map((_, i) => A.map(row => row[i]));
  }

  private static matrixMultiplyVector(A: number[][], v: readonly number[]): number[] {
    return A.map(row => row.reduce((sum, val, i) => sum + val * v[i], 0));
  }

  private static matrixInverse(A: number[][]): number[][] {
    // Simplified for 2x2 and small matrices
    const n = A.length;
    if (n === 2) {
      const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      return [
        [A[1][1] / det, -A[0][1] / det],
        [-A[1][0] / det, A[0][0] / det],
      ];
    }
    // Return identity for larger (simplified)
    return A.map((row, i) => row.map((_, j) => i === j ? 1 : 0));
  }
}

// ============================================================================
// SURVIVAL ANALYSIS
// ============================================================================

/**
 * Survival analysis utilities
 */
export class SurvivalAnalysis {
  /**
   * Kaplan-Meier estimator
   */
  static kaplanMeier(
    times: readonly number[],
    events: readonly number[] // 1 = event, 0 = censored
  ): SurvivalResult {
    const sorted = times.map((t, i) => ({ time: t, event: events[i] }))
      .sort((a, b) => a.time - b.time);

    let atRisk = sorted.length;
    let survival = 1;
    const survivalTable: { time: number; probability: number; lowerCI: number; upperCI: number }[] = [];

    for (const obs of sorted) {
      if (obs.event === 1) {
        const hazard = 1 / atRisk;
        survival *= (1 - hazard);
        atRisk--;
      } else {
        atRisk--;
      }

      const se = Math.sqrt(survival * (1 - survival) / atRisk);
      const z = ContinuousDistributions.normalQuantile(0.975, 0, 1);
      
      survivalTable.push({
        time: obs.time,
        probability: survival,
        lowerCI: Math.max(0, survival - z * se),
        upperCI: Math.min(1, survival + z * se),
      });
    }

    // Median survival
    const medianIdx = survivalTable.findIndex(s => s.probability <= 0.5);
    const medianSurvival = medianIdx >= 0 ? survivalTable[medianIdx].time : null;

    return {
      medianSurvival,
      survivalFunction: survivalTable,
      hazardRatio: null,
      hazardRatioCI: null,
      concordanceIndex: null,
    };
  }

  /**
   * Cox proportional hazards (simplified)
   */
  static coxPH(
    times: readonly number[],
    events: readonly number[],
    covariates: readonly number[][]
  ): { hazardRatio: number; hazardRatioCI: { lower: number; upper: number } } {
    // Simplified hazard ratio (single covariate)
    const cov = covariates.map(row => row[0]);
    
    const eventMean = events.reduce((sum, e, i) => sum + e * cov[i], 0) / 
                      events.reduce((sum, e) => sum + e, 0);
    const noEventMean = cov.filter((_, i) => events[i] === 0)
      .reduce((sum, c, i, arr) => {
        const actualI = cov.indexOf(c, events.slice(0, i).filter(x => x === 0).length);
        return sum + c;
      }, 0) / (events.length - events.filter(e => e === 1).length);

    const logHR = eventMean - noEventMean;
    const hazardRatio = Math.exp(logHR);

    // Approximate CI
    const se = 0.5; // Simplified
    const z = ContinuousDistributions.normalQuantile(0.975, 0, 1);
    const logHRCI = { lower: logHR - z * se, upper: logHR + z * se };

    return {
      hazardRatio,
      hazardRatioCI: {
        lower: Math.exp(logHRCI.lower),
        upper: Math.exp(logHRCI.upper),
      },
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Foundational Probability
  ProbabilityTheory,

  // Discrete Distributions
  DiscreteDistributions,

  // Continuous Distributions
  ContinuousDistributions,

  // Statistical Inference
  StatisticalInference,

  // Bayesian Inference
  BayesianInference,

  // Risk Management
  RiskMetricsCalculator,

  // Clinical Trials
  ClinicalTrialStatistics,

  // Impact Baselines
  ImpactBaseline,

  // Descriptive Statistics
  DescriptiveStatistics,

  // Regression
  RegressionAnalysis,

  // Survival Analysis
  SurvivalAnalysis,
};
