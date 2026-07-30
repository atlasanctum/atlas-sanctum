/**
 * Atlas Sanctum Intermediate Algebra
 *
 * Models real-world regenerative problems using symbolic algebra.
 * Each domain problem is expressed as: identify quantities → assign variables →
 * build model → solve → interpret in context.
 *
 * Depends on: AtlasSanctumAlgebra (engine layer)
 */

import {
  LinearEquations,
  NonlinearEquations,
  OptimizationAlgebra,
  StochasticAlgebra,
  RegenerativeValueFlows,
  ImpactFormulas,
  BalanceEquations,
  type LinearEquation,
  type OptimizationProblem,
  type ImpactFormula,
  type EquilibriumModel,
  type CompoundingBenefit,
  type RegenerativeValueFlow,
} from './AtlasSanctumAlgebra';

// ============================================================================
// MODELING CYCLE TYPE
// ============================================================================

/**
 * The four-step modeling cycle applied to every domain problem:
 *   real situation → algebraic model → mathematical solution → real-world answer
 */
export interface AlgebraicModel<TSolution> {
  /** Human-readable description of the real-world situation */
  readonly situation: string;
  /** Symbolic variable assignments: name → meaning */
  readonly variables: ReadonlyMap<string, string>;
  /** The algebraic form used (linear, quadratic, exponential, rational, inequality) */
  readonly form: 'linear' | 'quadratic' | 'exponential' | 'rational' | 'system' | 'inequality';
  /** Symbolic expression of the model */
  readonly expression: string;
  /** Computed solution */
  readonly solution: TSolution;
  /** Interpretation of the solution in the original context */
  readonly interpretation: string;
}

// ============================================================================
// 1. CLIMATE — LINEAR COST / RATE MODELS
// ============================================================================

/**
 * Models a carbon offset program budget constraint.
 *
 * Pattern: C(x) = mx + b  →  solve for x given C ≤ budget
 *
 * @param costPerTonne   Variable cost per tonne CO₂ sequestered ($)
 * @param fixedCost      Fixed program overhead ($)
 * @param budget         Total available budget ($)
 */
export function modelCarbonBudgetConstraint(
  costPerTonne: number,
  fixedCost: number,
  budget: number
): AlgebraicModel<{ maxTonnes: number; equation: LinearEquation }> {
  const equation = LinearEquations.constructLinearEquation(
    'C', 'x', costPerTonne, fixedCost
  );
  const maxTonnes = (budget - fixedCost) / costPerTonne;

  return {
    situation: `Carbon offset program: $${costPerTonne}/tonne + $${fixedCost} fixed overhead, budget $${budget}`,
    variables: new Map([
      ['x', 'tonnes of CO₂ sequestered'],
      ['C(x)', 'total program cost ($)'],
    ]),
    form: 'linear',
    expression: `C(x) = ${costPerTonne}x + ${fixedCost} ≤ ${budget}  →  x ≤ ${maxTonnes.toFixed(1)}`,
    solution: { maxTonnes, equation },
    interpretation: `Program can sequester at most ${maxTonnes.toFixed(0)} tonnes CO₂ within budget.`,
  };
}

/**
 * Models ecosystem restoration rate vs. degradation rate.
 *
 * Pattern: Net(x) = r_restore × x − r_degrade × x = (r_restore − r_degrade) × x
 * Break-even: find x where Net = 0 (restoration matches degradation)
 */
export function modelEcosystemNetRate(
  restorationRatePerHectare: number,
  degradationRatePerHectare: number,
  targetNetGainTonnes: number
): AlgebraicModel<{ breakEvenHectares: number; targetHectares: number }> {
  const netRate = restorationRatePerHectare - degradationRatePerHectare;
  const breakEvenHectares = netRate === 0 ? Infinity : 0;
  const targetHectares = netRate > 0 ? targetNetGainTonnes / netRate : Infinity;

  return {
    situation: `Ecosystem: restoration ${restorationRatePerHectare} t/ha/yr, degradation ${degradationRatePerHectare} t/ha/yr`,
    variables: new Map([
      ['x', 'hectares under management'],
      ['Net(x)', 'net carbon gain (tonnes/yr)'],
    ]),
    form: 'linear',
    expression: `Net(x) = (${restorationRatePerHectare} − ${degradationRatePerHectare})x = ${netRate}x`,
    solution: { breakEvenHectares, targetHectares },
    interpretation: `Need ${targetHectares.toFixed(0)} ha to achieve ${targetNetGainTonnes} t/yr net gain.`,
  };
}

// ============================================================================
// 2. FOOD SECURITY — SYSTEMS OF EQUATIONS (COMPETING CONSTRAINTS)
// ============================================================================

/**
 * Models a food relief allocation problem with two food sources and two constraints.
 *
 * Pattern: two unknowns → two equations → substitution
 *
 * @param totalMeals       Required total meal portions
 * @param budget           Total budget ($)
 * @param costA            Cost per unit of food A ($)
 * @param costB            Cost per unit of food B ($)
 */
export function modelFoodAllocation(
  totalMeals: number,
  budget: number,
  costA: number,
  costB: number
): AlgebraicModel<{ unitsA: number; unitsB: number }> {
  // s + w = totalMeals
  // costA·s + costB·w = budget
  // → s = totalMeals − w
  // → costA(totalMeals − w) + costB·w = budget
  // → w(costB − costA) = budget − costA·totalMeals
  const unitsB = (budget - costA * totalMeals) / (costB - costA);
  const unitsA = totalMeals - unitsB;

  return {
    situation: `Food relief: ${totalMeals} portions needed, $${budget} budget. Food A=$${costA}, Food B=$${costB}`,
    variables: new Map([
      ['a', 'units of food A'],
      ['b', 'units of food B'],
    ]),
    form: 'system',
    expression: `a + b = ${totalMeals}  |  ${costA}a + ${costB}b = ${budget}`,
    solution: { unitsA: Math.round(unitsA), unitsB: Math.round(unitsB) },
    interpretation: `Procure ${Math.round(unitsA)} units of food A and ${Math.round(unitsB)} units of food B.`,
  };
}

// ============================================================================
// 3. INFRASTRUCTURE — QUADRATIC OPTIMIZATION (AREA / RESOURCE)
// ============================================================================

/**
 * Models optimal land allocation for a community facility with one fixed boundary.
 *
 * Pattern: A(x) = x(L − 2x) = Lx − 2x²  →  vertex at x = L/4
 *
 * @param fencingMeters  Total fencing available (three sides; one side is a wall)
 */
export function modelOptimalLandAllocation(
  fencingMeters: number
): AlgebraicModel<{ optimalWidth: number; optimalLength: number; maxArea: number }> {
  // A(x) = x(fencingMeters − 2x), vertex at x = fencingMeters/4
  const optimalWidth = fencingMeters / 4;
  const optimalLength = fencingMeters - 2 * optimalWidth;
  const maxArea = optimalWidth * optimalLength;

  return {
    situation: `Community facility: ${fencingMeters}m fencing, one side borders existing wall`,
    variables: new Map([
      ['x', 'width (m) — two sides'],
      ['L − 2x', 'length (m) — one side'],
      ['A(x)', 'enclosed area (m²)'],
    ]),
    form: 'quadratic',
    expression: `A(x) = x(${fencingMeters} − 2x) = ${fencingMeters}x − 2x²  →  vertex x = ${optimalWidth}`,
    solution: { optimalWidth, optimalLength, maxArea },
    interpretation: `Optimal dimensions: ${optimalWidth}m × ${optimalLength}m = ${maxArea}m² maximum area.`,
  };
}

// ============================================================================
// 4. HEALTH — RATIONAL MODEL (INVERSE PROPORTIONALITY)
// ============================================================================

/**
 * Models volunteer/worker scaling for a time-constrained health intervention.
 *
 * Pattern: n₁t₁ = n₂t₂  (inverse proportionality)
 *
 * @param currentWorkers   Current number of health workers
 * @param currentDays      Days currently required to complete intervention
 * @param targetDays       Target days to complete intervention
 */
export function modelHealthWorkerScaling(
  currentWorkers: number,
  currentDays: number,
  targetDays: number
): AlgebraicModel<{ workersRequired: number; additionalWorkers: number }> {
  const workersRequired = (currentWorkers * currentDays) / targetDays;
  const additionalWorkers = Math.ceil(workersRequired - currentWorkers);

  return {
    situation: `Health intervention: ${currentWorkers} workers complete in ${currentDays} days, target ${targetDays} days`,
    variables: new Map([
      ['n', 'number of workers'],
      ['t', 'days to completion'],
      ['W', 'total work (person-days) — constant'],
    ]),
    form: 'rational',
    expression: `n₁t₁ = n₂t₂  →  ${currentWorkers}×${currentDays} = n₂×${targetDays}  →  n₂ = ${workersRequired.toFixed(1)}`,
    solution: { workersRequired: Math.ceil(workersRequired), additionalWorkers },
    interpretation: `Need ${Math.ceil(workersRequired)} workers total (${additionalWorkers} additional) to meet ${targetDays}-day target.`,
  };
}

// ============================================================================
// 5. POPULATION / ECONOMIC GROWTH — EXPONENTIAL MODEL
// ============================================================================

/**
 * Models population or economic growth and solves for time to reach a target.
 *
 * Pattern: P(t) = P₀ × r^t  →  t = log(target/P₀) / log(r)
 *
 * @param initialValue   Starting value (population, GDP, fund size, etc.)
 * @param growthRate     Annual growth rate (e.g. 0.08 for 8%)
 * @param targetValue    Target value to reach
 */
export function modelExponentialGrowth(
  initialValue: number,
  growthRate: number,
  targetValue: number
): AlgebraicModel<{ yearsToTarget: number; compoundingBenefit: CompoundingBenefit }> {
  const yearsToTarget = Math.log(targetValue / initialValue) / Math.log(1 + growthRate);
  const compoundingBenefit = NonlinearEquations.modelCompoundingBenefit(
    initialValue, growthRate, Math.ceil(yearsToTarget)
  );

  return {
    situation: `Growth from ${initialValue.toLocaleString()} at ${(growthRate * 100).toFixed(1)}%/yr to ${targetValue.toLocaleString()}`,
    variables: new Map([
      ['P₀', `initial value (${initialValue.toLocaleString()})`],
      ['r', `growth factor (${1 + growthRate})`],
      ['t', 'years'],
      ['P(t)', 'value at time t'],
    ]),
    form: 'exponential',
    expression: `P(t) = ${initialValue} × ${(1 + growthRate).toFixed(3)}^t  →  t = log(${targetValue}/${initialValue}) / log(${(1 + growthRate).toFixed(3)}) ≈ ${yearsToTarget.toFixed(1)} yr`,
    solution: { yearsToTarget, compoundingBenefit },
    interpretation: `Reaches target in approximately ${Math.ceil(yearsToTarget)} years.`,
  };
}

// ============================================================================
// 6. GOVERNANCE — INEQUALITY / FEASIBILITY MODEL
// ============================================================================

/**
 * Models a multi-resource governance constraint (feasible region).
 *
 * Pattern: multiple linear inequalities → feasible region
 * Used for: budget allocation, resource distribution, policy compliance
 *
 * @param resources  Array of { name, unitCostA, unitCostB, limit, type }
 */
export interface GovernanceConstraint {
  readonly name: string;
  readonly coefficientA: number;
  readonly coefficientB: number;
  readonly limit: number;
  readonly type: 'min' | 'max';
}

export function modelGovernanceFeasibility(
  constraints: readonly GovernanceConstraint[],
  programA: string,
  programB: string
): AlgebraicModel<{ feasible: boolean; constraintExpressions: readonly string[] }> {
  const expressions = constraints.map(c =>
    `${c.coefficientA}${programA} ${c.type === 'max' ? '≤' : '≥'} ${c.limit} − ${c.coefficientB}${programB}`
  );

  return {
    situation: `Governance allocation: programs "${programA}" and "${programB}" under ${constraints.length} constraints`,
    variables: new Map([
      [programA, `units of program ${programA}`],
      [programB, `units of program ${programB}`],
    ]),
    form: 'inequality',
    expression: expressions.join('  |  '),
    solution: {
      feasible: true,
      constraintExpressions: expressions,
    },
    interpretation: `Feasible region defined by ${constraints.length} constraints. Any (${programA}, ${programB}) satisfying all inequalities is a valid policy allocation.`,
  };
}

// ============================================================================
// 7. REGENERATIVE VALUE — EQUILIBRIUM & FLOW MODELS
// ============================================================================

/**
 * Models the equilibrium between social benefit and investor return.
 *
 * Pattern: supply/demand binary search from BalanceEquations
 */
export function modelRegenerativeEquilibrium(
  socialBenefit: number,
  investorReturn: number,
  targetRatio: number
): AlgebraicModel<{ equilibriumPrice: number; equilibriumQuantity: number; balanced: boolean }> {
  const equilibrium = BalanceEquations.solveEquilibrium(
    (p) => 100 + 2 * p,
    (p) => 300 - 3 * p,
    { min: 0, max: 200 }
  );

  const actualRatio = socialBenefit / (investorReturn || 1);
  const balanced = actualRatio >= targetRatio;

  return {
    situation: `Regenerative market: social benefit $${socialBenefit}, investor return $${investorReturn}, target ratio ${targetRatio}:1`,
    variables: new Map([
      ['P', 'price of regenerative credit'],
      ['S(P)', 'supply of credits'],
      ['D(P)', 'demand for credits'],
    ]),
    form: 'system',
    expression: `S(P) = D(P)  →  P* = ${equilibrium.equilibriumPrice.toFixed(2)}, Q* = ${equilibrium.equilibriumQuantity.toFixed(0)}`,
    solution: {
      equilibriumPrice: equilibrium.equilibriumPrice,
      equilibriumQuantity: equilibrium.equilibriumQuantity,
      balanced,
    },
    interpretation: balanced
      ? `Social-investor balance achieved (ratio ${actualRatio.toFixed(2)} ≥ ${targetRatio}).`
      : `Rebalancing needed: current ratio ${actualRatio.toFixed(2)} < target ${targetRatio}.`,
  };
}

/**
 * Models value flow efficiency through a regenerative supply chain.
 */
export function modelValueFlowEfficiency(
  sourceSystem: string,
  destinationSystem: string,
  inputValue: number,
  efficiencyRate: number,
  leakageRate: number,
  periods: number
): AlgebraicModel<{ totalFlow: number; compoundedValue: number; efficiencyLoss: number; flow: RegenerativeValueFlow }> {
  const flow = RegenerativeValueFlows.modelValueFlow(
    sourceSystem, destinationSystem, 'ecological', inputValue, efficiencyRate, leakageRate
  );
  const result = RegenerativeValueFlows.calculateFlowWithCompounding(
    inputValue, efficiencyRate, 0, periods
  );

  return {
    situation: `Value flow: ${sourceSystem} → ${destinationSystem}, efficiency ${(efficiencyRate * 100).toFixed(0)}%, leakage ${(leakageRate * 100).toFixed(0)}%`,
    variables: new Map([
      ['V₀', `initial value (${inputValue})`],
      ['η', `efficiency rate (${efficiencyRate})`],
      ['λ', `leakage rate (${leakageRate})`],
      ['t', 'periods'],
    ]),
    form: 'exponential',
    expression: `V(t) = V₀ × η × (1 − λ)  per period  →  total over ${periods} periods`,
    solution: { ...result, flow },
    interpretation: `Total value delivered: ${result.totalFlow.toFixed(2)} over ${periods} periods. Efficiency loss: ${result.efficiencyLoss.toFixed(2)}.`,
  };
}

// ============================================================================
// 8. IMPACT SCORING — MULTI-VARIABLE FORMULA EVALUATION
// ============================================================================

/**
 * Evaluates a composite impact score across climate, health, and biodiversity dimensions.
 *
 * Pattern: weighted linear combination  I = w₁C + w₂H + w₃B
 */
export function modelCompositeImpactScore(
  carbonTonnes: number,
  healthCasesAverted: number,
  biodiversityIndexPoints: number,
  weights: { climate: number; health: number; biodiversity: number } = { climate: 0.4, health: 0.35, biodiversity: 0.25 }
): AlgebraicModel<{ score: number; breakdown: ReadonlyMap<string, number> }> {
  const carbonFormula = ImpactFormulas.constructCarbonImpact(0, 1, carbonTonnes, 1);
  const healthFormula = ImpactFormulas.constructHealthImpact(healthCasesAverted, 1, 1, 1);

  const score =
    weights.climate * carbonTonnes +
    weights.health * healthCasesAverted +
    weights.biodiversity * biodiversityIndexPoints;

  const breakdown = new Map([
    ['climate', weights.climate * carbonTonnes],
    ['health', weights.health * healthCasesAverted],
    ['biodiversity', weights.biodiversity * biodiversityIndexPoints],
  ]);

  return {
    situation: `Composite impact: ${carbonTonnes}t CO₂, ${healthCasesAverted} cases averted, ${biodiversityIndexPoints} biodiversity pts`,
    variables: new Map([
      ['C', `carbon impact (${carbonTonnes} tonnes)`],
      ['H', `health impact (${healthCasesAverted} cases)`],
      ['B', `biodiversity impact (${biodiversityIndexPoints} pts)`],
      ['I', 'composite impact score'],
    ]),
    form: 'linear',
    expression: `I = ${weights.climate}C + ${weights.health}H + ${weights.biodiversity}B = ${score.toFixed(2)}`,
    solution: { score, breakdown },
    interpretation: `Composite impact score: ${score.toFixed(2)}. Dominant dimension: ${
      [...breakdown.entries()].sort((a, b) => b[1] - a[1])[0][0]
    }.`,
  };
}

// ============================================================================
// 9. UNCERTAINTY — MONTE CARLO CONFIDENCE INTERVALS
// ============================================================================

/**
 * Runs a Monte Carlo simulation on a regenerative impact model to produce
 * confidence intervals — satisfying the PHILOSOPHY requirement that AI
 * recommendations include uncertainty factors.
 *
 * @param nominalImpact   Central estimate of impact
 * @param relativeUncertainty  Fractional uncertainty (e.g. 0.2 = ±20%)
 * @param iterations      Number of simulation runs
 */
export function modelImpactUncertainty(
  nominalImpact: number,
  relativeUncertainty: number,
  iterations: number = 1000
): AlgebraicModel<{ mean: number; ci95: { lower: number; upper: number }; coefficientOfVariation: number }> {
  const stdDev = nominalImpact * relativeUncertainty;
  const dist = StochasticAlgebra.constructNormalDistribution(nominalImpact, stdDev);
  const ci = StochasticAlgebra.calculateConfidenceInterval(nominalImpact, stdDev, iterations, 0.95);
  const cv = stdDev / nominalImpact;

  return {
    situation: `Impact estimate: ${nominalImpact} ± ${(relativeUncertainty * 100).toFixed(0)}% uncertainty`,
    variables: new Map([
      ['μ', `mean impact (${nominalImpact})`],
      ['σ', `standard deviation (${stdDev.toFixed(2)})`],
      ['CI', '95% confidence interval'],
    ]),
    form: 'linear',
    expression: `I ~ N(${nominalImpact}, ${stdDev.toFixed(2)}²)  →  CI₉₅ = [${ci.lower.toFixed(2)}, ${ci.upper.toFixed(2)}]`,
    solution: { mean: dist.mean, ci95: ci, coefficientOfVariation: cv },
    interpretation: `With 95% confidence, true impact lies between ${ci.lower.toFixed(1)} and ${ci.upper.toFixed(1)}. CV = ${(cv * 100).toFixed(1)}% — ${cv < 0.1 ? 'low' : cv < 0.3 ? 'moderate' : 'high'} uncertainty.`,
  };
}

// ============================================================================
// MODELING CYCLE RUNNER
// ============================================================================

/**
 * The meta-skill: runs the full four-step modeling cycle and returns a
 * structured trace for audit, education, and explainability.
 */
export interface ModelingCycleTrace<TSolution> {
  readonly step1_situation: string;
  readonly step2_variables: ReadonlyMap<string, string>;
  readonly step3_expression: string;
  readonly step4_solution: TSolution;
  readonly step5_interpretation: string;
  readonly step6_reasonableness: 'reasonable' | 'check_units' | 'revise_model';
}

export function runModelingCycle<TSolution>(
  model: AlgebraicModel<TSolution>,
  reasonablenessCheck: (solution: TSolution) => boolean
): ModelingCycleTrace<TSolution> {
  return {
    step1_situation: model.situation,
    step2_variables: model.variables,
    step3_expression: model.expression,
    step4_solution: model.solution,
    step5_interpretation: model.interpretation,
    step6_reasonableness: reasonablenessCheck(model.solution) ? 'reasonable' : 'revise_model',
  };
}
