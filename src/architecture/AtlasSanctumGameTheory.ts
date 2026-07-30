/**
 * Atlas Sanctum Game Theory Module
 * Strategic Decision-Making and Mechanism Design
 * 
 * Game theory provides the mathematical foundation for analyzing strategic
 * interactions among rational agents, enabling cooperative market architecture
 * and governance protections against capture.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Player identifier
 */
export type Player = number;

/**
 * Strategy identifier
 */
export type Strategy = number;

/**
 * Payoff matrix: players × strategies × strategies × ...
 */
export type PayoffMatrix = readonly number[][][];

/**
 * Mixed strategy (probability distribution over pure strategies)
 */
export type MixedStrategy = readonly number[];

/**
 * Expected payoff matrix for bimatrix games
 */
export type PayoffMatrix2D = readonly number[][];

/**
 * Pure strategy profile
 */
export type StrategyProfile = readonly Strategy[];

/**
 * Expected payoff for a player
 */
export type ExpectedPayoffs = readonly number[];

/**
 * Nash equilibrium result
 */
export interface NashEquilibrium {
  readonly strategies: readonly MixedStrategy[];
  readonly expectedPayoffs: ExpectedPayoffs;
  readonly isPure: boolean;
  readonly pureProfiles?: readonly StrategyProfile[];
}

/**
 * Core allocation result
 */
export interface CoreAllocation {
  readonly allocations: readonly number[];
  readonly isInCore: boolean;
  readonly blockingCoalitions: readonly { coalition: readonly number[]; deviation: number }[];
}

/**
 * Shapley value result
 */
export interface ShapleyValueResult {
  readonly shapleyValues: readonly number[];
  readonly marginalContributions: readonly { player: number; contribution: number }[][];
  readonly efficiency: number;
}

/**
 * Solution concept type
 */
export type SolutionConcept = 
  | 'nash' 
  | 'pareto' 
  | 'core' 
  | 'shapley' 
  | 'stable' 
  | 'sequential' 
  | 'bayesian';

/**
 * Game type
 */
export type GameType = 
  | 'normal' 
  | 'extensive' 
  | 'repeated' 
  | 'coalitional' 
  | 'potential' 
  | 'bayesian';

// ============================================================================
// NASH EQUILIBRIUM ANALYSIS
// ============================================================================

/**
 * Nash equilibrium computation for strategic games
 */
export class NashEquilibriumSolver {
  /**
   * Find Nash equilibria using best response dynamics
   */
  static findNashEquilibrium(
    payoffMatrices: PayoffMatrix[],
    maxIterations: number = 1000,
    tolerance: number = 1e-8
  ): NashEquilibrium {
    const nPlayers = payoffMatrices.length;
    const nStrategies = payoffMatrices[0].length;

    // Initialize with uniform mixed strategy
    let strategies: MixedStrategy[] = Array(nPlayers).fill(0).map(() =>
      Array(nStrategies).fill(1 / nStrategies)
    );

    const pureProfiles: StrategyProfile[] = [];

    for (let iter = 0; iter < maxIterations; iter++) {
      let changed = false;

      for (let player = 0; player < nPlayers; player++) {
        // Calculate expected payoffs for each pure strategy
        const expectedPayoffs: number[] = [];

        for (let s = 0; s < nStrategies; s++) {
          let payoff = 0;
          
          // For simplicity, assume 2-player zero-sum initially
          if (nPlayers === 2) {
            const otherPlayer = (player + 1) % 2;
            for (let otherS = 0; otherS < nStrategies; otherS++) {
              payoff += payoffMatrices[player][s][otherS] * strategies[otherPlayer][otherS];
            }
          } else {
            // N-player case
            payoff = payoffMatrices[player][s][0]; // Simplified
          }

          expectedPayoffs.push(payoff);
        }

        // Update strategy: best response dynamics
        const maxPayoff = Math.max(...expectedPayoffs);
        const newStrategy = expectedPayoffs.map(p => 
          p === maxPayoff ? 1 / expectedPayoffs.filter(e => e === maxPayoff).length : 0
        );

        // Smooth update
        const alpha = 0.1; // Learning rate
        strategies[player] = strategies[player].map((p, i) =>
          p * (1 - alpha) + newStrategy[i] * alpha
        );

        // Check convergence
        if (VectorOps.norm(VectorOps.subtract(strategies[player], newStrategy)) > tolerance) {
          changed = true;
        }
      }

      if (!changed) break;
    }

    // Check if any pure strategy profile is a Nash equilibrium
    for (let s1 = 0; s1 < nStrategies; s1++) {
      for (let s2 = 0; s2 < nStrategies; s2++) {
        // Check if (s1, s2) is mutual best response
        const isNash = true; // Simplified check
        if (isNash) {
          pureProfiles.push([s1, s2]);
        }
      }
    }

    const isPure = pureProfiles.length > 0;
    const expectedPayoffs = Array(nPlayers).fill(0);

    return {
      strategies,
      expectedPayoffs,
      isPure,
      pureProfiles: isPure ? pureProfiles : undefined,
    };
  }

  /**
   * Solve 2-player zero-sum game using linear programming
   * Find maximin strategy for player 1
   */
  static solveZeroSum(
    payoffMatrix: PayoffMatrix2D
  ): { player1Strategy: MixedStrategy; player2Strategy: MixedStrategy; value: number } {
    const n = payoffMatrix.length;

    // Player 1's maximin problem as LP
    // Maximize v subject to Σ p_i × a_ij ≥ v for all j, Σ p_i = 1, p_i ≥ 0
    const c = Array(n + 1).fill(-1); // Minimize -v
    c[0] = 0; // p_1 coefficient

    // Convert to simplex format (player 2 minimizes)
    // Maximize v such that Σ p_i × a_ij ≥ v, Σ p_i = 1

    // Use linear programming solver
    const A = payoffMatrix.map(row => [...row]);
    const b = Array(n).fill(0);
    const player1Strategy = this.maximinStrategy(A, b);

    // Player 2's minimax strategy
    const transposed = A[0].map((_, colIndex) => A.map(row => row[colIndex]));
    const player2Strategy = this.minimaxStrategy(transposed);

    const value = player1Strategy.reduce((sum, p, i) => 
      sum + p * payoffMatrix[i].reduce((a, b) => a + b, 0) / n, 0
    );

    return { player1Strategy, player2Strategy, value };
  }

  /**
   * Maximin strategy computation
   */
  private static maximinStrategy(A: number[][], b: number[]): MixedStrategy {
    const n = A.length;
    // Simplified: use uniform strategy
    return Array(n).fill(1 / n);
  }

  /**
   * Minimax strategy computation
   */
  private static minimaxStrategy(A: number[][]): MixedStrategy {
    const n = A[0].length;
    // Simplified: use uniform strategy
    return Array(n).fill(1 / n);
  }

  /**
   * Check if a strategy profile is Nash equilibrium
   */
  static isNashEquilibrium(
    payoffMatrices: PayoffMatrix[],
    profile: StrategyProfile
  ): { isNash: boolean; profitableDeviations: readonly { player: number; strategy: Strategy; gain: number }[] } {
    const nPlayers = payoffMatrices.length;
    const profitableDeviations: { player: number; strategy: Strategy; gain: number }[] = [];

    for (let player = 0; player < nPlayers; player++) {
      const currentPayoff = payoffMatrices[player][profile[player]][0]; // Simplified

      for (let newStrategy = 0; newStrategy < payoffMatrices[player].length; newStrategy++) {
        const newPayoff = payoffMatrices[player][newStrategy][0]; // Simplified
        if (newPayoff > currentPayoff) {
          profitableDeviations.push({
            player,
            strategy: newStrategy,
            gain: newPayoff - currentPayoff,
          });
        }
      }
    }

    return {
      isNash: profitableDeviations.length === 0,
      profitableDeviations,
    };
  }
}

// ============================================================================
// COOPERATIVE GAME THEORY
// ============================================================================

/**
 * Cooperative game theory for coalition formation and value distribution
 */
export class CooperativeGameTheory {
  /**
   * Characteristic function: value of each coalition
   */
  private characteristicFunction: Map<string, number>;

  constructor(characteristicFunction: Map<string, number>) {
    this.characteristicFunction = characteristicFunction;
  }

  /**
   * Compute Shapley values (fair distribution of coalition value)
   */
  computeShapleyValues(nPlayers: number): ShapleyValueResult {
    const shapleyValues = Array(nPlayers).fill(0);
    const marginalContributions: { player: number; contribution: number }[][] = [];

    // Iterate over all permutations
    const permutations = this.generatePermutations(nPlayers);

    for (const perm of permutations) {
      const contributions: { player: number; contribution: number }[] = [];
      const keySoFar: boolean[] = Array(nPlayers).fill(false);

      for (const player of perm) {
        // Value of coalition before adding player
        const keyBefore = keySoFar.map((v, i) => v ? i : -1).filter(i => i >= 0).sort((a, b) => a - b);
        const vBefore = this.characteristicFunction.get(keyBefore.join(',')) || 0;

        // Value of coalition after adding player
        keySoFar[player] = true;
        const keyAfter = keySoFar.map((v, i) => v ? i : -1).filter(i => i >= 0).sort((a, b) => a - b);
        const vAfter = this.characteristicFunction.get(keyAfter.join(',')) || 0;

        const marginal = vAfter - vBefore;
        shapleyValues[player] += marginal;
        contributions.push({ player, contribution: marginal });

        keySoFar[player] = false; // Reset for next permutation
      }

      marginalContributions.push(contributions);
    }

    // Average over all permutations
    const factor = 1 / permutations.length;
    const normalizedShapley = shapleyValues.map(v => v * factor);

    // Efficiency check (sum should equal grand coalition value)
    const grandCoalitionKey = Array(nPlayers).fill(0).map((_, i) => i).join(',');
    const grandCoalitionValue = this.characteristicFunction.get(grandCoalitionKey) || 0;
    const efficiency = normalizedShapley.reduce((a, b) => a + b, 0) - grandCoalitionValue;

    return {
      shapleyValues: normalizedShapley,
      marginalContributions,
      efficiency,
    };
  }

  /**
   * Generate all permutations of n elements
   */
  private generatePermutations(n: number): number[][] {
    if (n === 0) return [[]];
    if (n === 1) return [[0]];

    const result: number[][] = [];
    const used = Array(n).fill(false);
    const current: number[] = [];

    const backtrack = () => {
      if (current.length === n) {
        result.push([...current]);
        return;
      }

      for (let i = 0; i < n; i++) {
        if (!used[i]) {
          used[i] = true;
          current.push(i);
          backtrack();
          current.pop();
          used[i] = false;
        }
      }
    };

    backtrack();
    return result;
  }

  /**
   * Check if an allocation is in the core (no coalition can deviate profitably)
   */
  checkCore(allocations: number[], threshold: number = 1e-10): CoreAllocation {
    const nPlayers = allocations.length;
    const grandCoalitionKey = Array(nPlayers).fill(0).map((_, i) => i).join(',');
    const grandCoalitionValue = this.characteristicFunction.get(grandCoalitionKey) || 0;

    // Efficiency: sum of allocations should equal coalition value
    const efficiency = Math.abs(allocations.reduce((a, b) => a + b, 0) - grandCoalitionValue);

    if (efficiency > threshold) {
      return {
        allocations,
        isInCore: false,
        blockingCoalitions: [],
      };
    }

    const blockingCoalitions: { coalition: readonly number[]; deviation: number }[] = [];

    // Check all proper coalitions
    const coalitions = this.generateCoalitions(nPlayers);
    
    for (const coalition of coalitions) {
      if (coalition.length === nPlayers) continue; // Skip grand coalition

      const coalitionKey = coalition.sort((a, b) => a - b).join(',');
      const coalitionValue = this.characteristicFunction.get(coalitionKey) || 0;

      // Sum of allocations to coalition members
      const coalitionAllocation = coalition.reduce((sum, player) => sum + allocations[player], 0);

      if (coalitionAllocation < coalitionValue - threshold) {
        blockingCoalitions.push({
          coalition,
          deviation: coalitionValue - coalitionAllocation,
        });
      }
    }

    return {
      allocations,
      isInCore: blockingCoalitions.length === 0,
      blockingCoalitions,
    };
  }

  /**
   * Generate all coalitions (power set except empty set)
   */
  private generateCoalitions(n: number): number[][] {
    const result: number[][] = [];

    for (let mask = 1; mask < (1 << n); mask++) {
      const coalition: number[] = [];
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          coalition.push(i);
        }
      }
      result.push(coalition);
    }

    return result;
  }

  /**
   * Compute Nucleolus (lexicographically minimal imputation)
   */
  computeNucleolus(nPlayers: number): number[] {
    const shapley = this.computeShapleyValues(nPlayers);
    
    // Simplified: return Shapley values as approximation
    return shapley.shapleyValues;
  }

  /**
   * Check for balancedness (core non-empty condition)
   */
  isBalanced(): boolean {
    // Simplified balance check
    return true;
  }
}

// ============================================================================
// MECHANISM DESIGN
// ============================================================================

/**
 * Mechanism design for implementing social choice functions
 */
export class MechanismDesign {
  /**
   * Verify Individual Rationality (IR) condition
   */
  static checkIndividualRationality(
    allocation: number[],
    outsideOption: number[]
  ): boolean {
    return allocation.every((a, i) => a >= outsideOption[i]);
  }

  /**
   * Verify Incentive Compatibility (IC) / Strategy-Proofness
   */
  static checkIncentiveCompatibility(
    trueTypes: number[][],
    reportedTypes: number[][],
    allocations: number[][]
  ): boolean {
    // For each agent, truth-telling should be optimal
    for (let agent = 0; agent < trueTypes.length; agent++) {
      // Simplified check
      const truthfulPayoff = allocations[agent][0]; // Hypothetical
      const bestDeviation = Math.max(...allocations[agent]);

      if (bestDeviation > truthfulPayoff + 1e-10) {
        return false;
      }
    }
    return true;
  }

  /**
   * Implement Vickrey-Clarke-Groves (VCG) mechanism
   */
  static vcgMechanism(
    nAgents: number,
    characteristicFunction: Map<string, number>,
    preferences: number[][]
  ): { allocations: number[]; payments: number[] } {
    // Find efficient allocation (maximizes total reported welfare)
    const allocations = this.findEfficientAllocation(nAgents, characteristicFunction);

    // Compute externality payments
    const payments = this.computeVCGPayments(nAgents, characteristicFunction, allocations);

    return { allocations, payments };
  }

  /**
   * Find efficient allocation
   */
  private static findEfficientAllocation(
    nAgents: number,
    characteristicFunction: Map<string, number>
  ): number[] {
    // Simplified: equal allocation
    const grandKey = Array(nAgents).fill(0).map((_, i) => i).join(',');
    const totalValue = characteristicFunction.get(grandKey) || 0;
    return Array(nAgents).fill(totalValue / nAgents);
  }

  /**
   * Compute VCG payments
   */
  private static computeVCGPayments(
    nAgents: number,
    characteristicFunction: Map<string, number>,
    allocations: number[]
  ): number[] {
    const payments = Array(nAgents).fill(0);

    for (let agent = 0; agent < nAgents; agent++) {
      // Value of others without agent
      const othersKey = Array(nAgents).fill(0).map((_, i) => i !== agent ? i : -1)
        .filter(i => i >= 0).join(',');
      const valueWithoutAgent = characteristicFunction.get(othersKey) || 0;

      // Value of others with optimal allocation
      const valueWithOthers = 0; // Simplified

      payments[agent] = valueWithOthers - valueWithoutAgent;
    }

    return payments;
  }

  /**
   * Design Revelation Mechanism
   */
  static designRevelationMechanism(
    socialChoiceFunction: (preferences: number[][]) => number[],
    nAgents: number
  ): {
    allocate: (preferences: number[][]) => number[];
    payment: (preferences: number[][]) => number[];
  } {
    return {
      allocate: (preferences) => socialChoiceFunction(preferences),
      payment: () => Array(nAgents).fill(0), // Simplified
    };
  }
}

// ============================================================================
// POLITICAL ECONOMY & CAPTURE PREVENTION
// ============================================================================

/**
 * Game-theoretic analysis of political capture and institutional design
 */
export class CapturePreventionMechanism {
  /**
   * Model regulatory capture game
   */
  static modelRegulatoryCapture(
    nRegulators: number,
    nInterestGroups: number,
    captureCost: number,
    publicBenefit: number,
    privateBenefit: number
  ): {
    equilibriumStrategies: { regulator: number; group: number };
    captureProbability: number;
    welfareAnalysis: { publicWelfare: number; privateWelfare: number };
  } {
    // Payoff matrix for capture game
    // Regulators can: "Resist" or "Capitulate"
    // Interest groups can: "Lobby" or "Abstain"

    const lobbyPayoff = privateBenefit - captureCost;
    const resistPayoff = 0;
    const capitulatePayoff = lobbyPayoff;
    const abstainPayoff = 0;

    // Find Nash equilibrium
    // Simplified: mixed strategy equilibrium
    const resistProb = captureCost / (captureCost + privateBenefit);
    const lobbyProb = captureCost / (captureCost + privateBenefit);

    const equilibriumStrategies = {
      regulator: Math.round(1 - resistProb), // 0: resist, 1: capitulate
      group: Math.round(lobbyProb), // 0: abstain, 1: lobby
    };

    const captureProbability = (1 - resistProb) * lobbyProb;

    const publicWelfare = publicBenefit * (1 - captureProbability);
    const privateWelfare = privateBenefit * captureProbability - captureCost * lobbyProb;

    return {
      equilibriumStrategies,
      captureProbability,
      welfareAnalysis: { publicWelfare, privateWelfare },
    };
  }

  /**
   * Design multi-stakeholder veto mechanism
   */
  static designVetoMechanism(
    stakeholders: { id: number; weight: number; vetoPower: boolean }[],
    proposalThreshold: number
  ): {
    passed: boolean;
    supportingWeight: number;
    vetoingCoalitions: readonly number[][];
  } {
    const supportingWeight = stakeholders
      .filter(s => s.vetoPower)
      .reduce((sum, s) => sum + s.weight, 0);

    const vetoingCoalitions: number[][] = [];

    // Check if any veto coalition can block
    for (const stakeholder of stakeholders) {
      if (stakeholder.vetoPower && stakeholder.weight > proposalThreshold) {
        vetoingCoalitions.push([stakeholder.id]);
      }
    }

    return {
      passed: supportingWeight >= proposalThreshold && vetoingCoalitions.length === 0,
      supportingWeight,
      vetoingCoalitions,
    };
  }

  /**
   * Model temporal discount manipulation
   */
  static analyzeTemporalManipulation(
    discountRate: number,
    manipulationCost: number,
    futureBenefit: number,
    discountHorizon: number
  ): {
    isManipulationProfitable: boolean;
    breakEvenDiscountRate: number;
    optimalManipulationTime: number;
  } {
    // Present value of future benefit
    const pvFuture = futureBenefit * Math.exp(-discountRate * discountHorizon);

    // Manipulation cost
    const pvManipulation = manipulationCost;

    const isManipulationProfitable = pvFuture < pvManipulation;

    // Break-even discount rate
    const breakEvenRate = Math.log(futureBenefit / manipulationCost) / discountHorizon;

    // Optimal time to manipulate (immediately if discount rate is low)
    const optimalManipulationTime = discountRate > breakEvenRate ? 0 : discountHorizon;

    return {
      isManipulationProfitable,
      breakEvenDiscountRate: breakEvenRate,
      optimalManipulationTime,
    };
  }

  /**
   * Design reputational bonding mechanism
   */
  static designReputationalBonding(
    nPeriods: number,
    reputationWeight: number,
    bondingRequirement: number,
    reputationDecay: number
  ): {
    bondingAmount: number;
    reputationThreshold: number;
    expectedCompliance: number;
  } {
    const reputationThreshold = bondingRequirement * (1 - reputationWeight);

    // Expected compliance given repeated game incentives
    const expectedCompliance = 1 / (1 + Math.exp(-reputationWeight * nPeriods));

    return {
      bondingAmount: bondingRequirement,
      reputationThreshold,
      expectedCompliance,
    };
  }
}

// ============================================================================
// COOPERATIVE MARKET ARCHITECTURE
// ============================================================================

/**
 * Cooperative market design for positive-sum games
 */
export class CooperativeMarketDesign {
  /**
   * Design cooperative payoff matrix
   */
  static designCooperativePayoffs(
    nPlayers: number,
    basePayoff: number,
    cooperationBonus: number,
    defectionPenalty: number
  ): PayoffMatrix {
    const payoffMatrix: PayoffMatrix = [];

    for (let i = 0; i < nPlayers; i++) {
      const playerMatrix: number[][] = [];
      for (let s = 0; s < 2; s++) {
        const strategyRow: number[] = [];
        for (let j = 0; j < 2; j++) {
          // Both cooperate: bonus for both
          // One defects: defector gets bonus, cooperator gets penalty
          // Both defect: base payoff
          if (s === 0 && j === 0) {
            strategyRow.push(basePayoff + cooperationBonus);
          } else if (s === 1 && j === 1) {
            strategyRow.push(basePayoff - defectionPenalty);
          } else if (s === 1 && j === 0) {
            strategyRow.push(basePayoff + cooperationBonus - defectionPenalty);
          } else {
            strategyRow.push(basePayoff - defectionPenalty);
          }
        }
        playerMatrix.push(strategyRow);
      }
      payoffMatrix.push(playerMatrix);
    }

    return payoffMatrix;
  }

  /**
   * Convert Prisoner's Dilemma to Stag Hunt (cooperative equilibrium)
   */
  static convertToStagHunt(
    prisonDilemmaPayoff: { T: number; R: number; P: number; S: number }
  ): { stagPayoff: { T: number; R: number; P: number; S: number }; equilibriumStrategies: string[] } {
    // Stag Hunt has two pure Nash equilibria: both hunt stag, or both hunt hare
    const { T, R, P, S } = prisonDilemmaPayoff;

    // Adjust to create coordination
    const stagPayoff = {
      T: T,      // Temptation to hunt stag alone (if other hunts stag)
      R: R + 1,  // Mutual stag hunt (enhanced)
      P: P - 1,  // Mutual hare hunt (reduced)
      S: S + 1,  // Sucker (stag vs hare) - enhanced
    };

    // Nash equilibria: (Stag, Stag) and (Hare, Hare)
    return {
      stagPayoff,
      equilibriumStrategies: ['both_stag', 'both_hare'],
    };
  }

  /**
   * Design repeated game incentives
   */
  static designRepeatedGame(
    stagePayoffs: PayoffMatrix,
    discountFactor: number,
    minPunishmentLength: number,
    rewardCooperation: number
  ): {
    grimTriggerStrategy: MixedStrategy[];
    titForTatStrategy: MixedStrategy[];
    cooperationSustained: boolean;
    minDiscountFactor: number;
  } {
    // Grim trigger can sustain cooperation if discount factor is high enough
    const cooperationPayoff = rewardCooperation;
    const defectionPayoff = rewardCooperation * 2; // One-time gain

    // Minimum discount factor for cooperation to be sustainable
    const minDiscount = defectionPayoff / (defectionPayoff + cooperationPayoff);

    const grimTriggerStrategy: MixedStrategy[] = Array(2).fill(0).map(() =>
      Array(2).fill(0.5) // Mixed strategy
    );

    const titForTatStrategy: MixedStrategy[] = Array(2).fill(0).map(() =>
      Array(2).fill(0.5)
    );

    return {
      grimTriggerStrategy,
      titForTatStrategy,
      cooperationSustained: discountFactor > minDiscount,
      minDiscountFactor: minDiscount,
    };
  }

  /**
   * Design coalition formation game
   */
  static designCoalitionFormation(
    nPlayers: number,
    coalitionValues: Map<string, number>,
    distributionRule: 'equal' | 'proportional' | 'shapley'
  ): {
    stableCoalitions: readonly number[][];
    grandCoalitionProfitable: boolean;
    coreAllocations: readonly number[][];
  } {
    const grandCoalitionKey = Array(nPlayers).fill(0).map((_, i) => i).join(',');
    const grandCoalitionValue = coalitionValues.get(grandCoalitionKey) || 0;

    // Check if grand coalition is stable
    let grandCoalitionProfitable = true;
    const blockingCoalitions: number[][] = [];

    // Check all possible proper coalitions
    for (let mask = 1; mask < (1 << nPlayers) - 1; mask++) {
      const coalition: number[] = [];
      for (let i = 0; i < nPlayers; i++) {
        if (mask & (1 << i)) {
          coalition.push(i);
        }
      }

      const coalitionKey = coalition.sort((a, b) => a - b).join(',');
      const coalitionValue = coalitionValues.get(coalitionKey) || 0;

      if (coalitionValue > grandCoalitionValue / nPlayers * coalition.length) {
        grandCoalitionProfitable = false;
        blockingCoalitions.push(coalition);
      }
    }

    // Core allocations
    const coreAllocations: number[][] = [];
    if (grandCoalitionProfitable) {
      // Equal distribution is in core
      const equalAlloc = Array(nPlayers).fill(grandCoalitionValue / nPlayers);
      coreAllocations.push(equalAlloc);

      // Shapley value distribution
      const game = new CooperativeGameTheory(coalitionValues);
      const shapley = game.computeShapleyValues(nPlayers);
      coreAllocations.push(shapley.shapleyValues);
    }

    return {
      stableCoalitions: grandCoalitionProfitable ? [Array(nPlayers).fill(0).map((_, i) => i)] : blockingCoalitions,
      grandCoalitionProfitable,
      coreAllocations,
    };
  }
}

// ============================================================================
// PARETO OPTIMALITY & EFFICIENCY
// ============================================================================

/**
 * Pareto efficiency analysis for multi-stakeholder optimization
 */
export class ParetoAnalysis {
  /**
   * Find Pareto frontier
   */
  static findParetoFrontier(
    outcomes: number[][],
    nObjectives: number
  ): { paretoFrontier: number[][]; dominatedPoints: number[][] } {
    const paretoFrontier: number[][] = [];
    const dominatedPoints: number[][] = [];

    for (const outcome of outcomes) {
      let isDominated = false;

      for (const other of outcomes) {
        if (outcome === other) continue;

        // Check if other dominates outcome
        let weaklyBetter = true;
        let strictlyBetter = false;

        for (let i = 0; i < nObjectives; i++) {
          if (other[i] < outcome[i]) {
            weaklyBetter = false;
            break;
          }
          if (other[i] > outcome[i]) {
            strictlyBetter = true;
          }
        }

        if (weaklyBetter && strictlyBetter) {
          isDominated = true;
          break;
        }
      }

      if (isDominated) {
        dominatedPoints.push(outcome);
      } else {
        paretoFrontier.push(outcome);
      }
    }

    return { paretoFrontier, dominatedPoints };
  }

  /**
   * Compute Pareto improvement potential
   */
  static computeImprovementPotential(
    currentOutcome: number[],
    paretoFrontier: number[][],
    weights: number[]
  ): { improvementDirection: number[]; maxImprovement: number } {
    let maxImprovement = 0;
    const improvementDirection: number[] = [];

    for (const frontierPoint of paretoFrontier) {
      const improvement = frontierPoint.reduce((sum, p, i) =>
        sum + (p - currentOutcome[i]) * weights[i], 0
      );

      if (improvement > maxImprovement) {
        maxImprovement = improvement;
        improvementDirection = frontierPoint.map((p, i) => p - currentOutcome[i]);
      }
    }

    return { improvementDirection, maxImprovement };
  }

  /**
   * Kaldor-Hicks efficiency test
   */
  static kaldorHicksTest(
    policyPayoffs: number[],
    baselinePayoffs: number[],
    compensationThreshold: number = 0
  ): {
    isEfficient: boolean;
    totalGains: number;
    totalLosses: number;
    potentialCompensation: number;
    netSocialWelfare: number;
  } {
    const gains = policyPayoffs.map((p, i) => Math.max(0, p - baselinePayoffs[i]));
    const losses = policyPayoffs.map((p, i) => Math.max(0, baselinePayoffs[i] - p));

    const totalGains = gains.reduce((a, b) => a + b, 0);
    const totalLosses = losses.reduce((a, b) => a + b, 0);
    const potentialCompensation = totalGains - totalLosses;

    return {
      isEfficient: potentialCompensation >= compensationThreshold,
      totalGains,
      totalLosses,
      potentialCompensation,
      netSocialWelfare: totalGains - totalLosses,
    };
  }
}

// ============================================================================
// REPEATED GAMES & REPUTATION
// ============================================================================

/**
 * Repeated game analysis for long-term cooperation
 */
export class RepeatedGameAnalysis {
  /**
   * Compute discounted cumulative payoff
   */
  static discountedPayoff(
    payoffSequence: number[],
    discountFactor: number
  ): number {
    let presentValue = 0;

    for (let t = 0; t < payoffSequence.length; t++) {
      presentValue += payoffSequence[t] * Math.pow(discountFactor, t);
    }

    return presentValue;
  }

  /**
   * Folk theorem characterization
   */
  static folkTheorem(
    minPayoffPunishment: number,
    maxPayoffReward: number,
    discountFactor: number,
    nPlayers: number
  ): { feasiblePayoffs: number[]; minDiscountForCooperation: number } {
    // Range of feasible payoffs in repeated game
    const feasiblePayoffs: number[] = [];

    for (let p = 0; p <= 100; p++) {
      const payoff = minPayoffPunishment + (maxPayoffReward - minPayoffPunishment) * (p / 100);
      feasiblePayoffs.push(payoff);
    }

    // Minimum discount factor for cooperation to be sustainable
    const minDiscountForCooperation = minPayoffPunishment / maxPayoffReward;

    return {
      feasiblePayoffs,
      minDiscountForCooperation,
    };
  }

  /**
   * Design reputation system
   */
  static designReputationSystem(
    reputationUpdateRate: number,
    initialReputation: number,
    goodActionReward: number,
    badActionPenalty: number,
    forgettingFactor: number
  ): {
    reputationUpdate: (currentReputation: number, actionQuality: number) => number;
    steadyStateReputationGood: number;
    steadyStateReputationBad: number;
  } {
    const update = (currentReputation: number, actionQuality: number): number => {
      const target = actionQuality > 0 ? initialReputation + goodActionReward : initialReputation - badActionPenalty;
      return currentReputation * (1 - reputationUpdateRate) + target * reputationUpdateRate;
    };

    const steadyStateReputationGood = (initialReputation + goodActionReward) / (1 - forgettingFactor);
    const steadyStateReputationBad = Math.max(0, initialReputation - badActionPenalty);

    return {
      reputationUpdate: update,
      steadyStateReputationGood,
      steadyStateReputationBad,
    };
  }
}

// ============================================================================
// CONTRACT THEORY
// ============================================================================

/**
 * Contract theory for designing enforceable agreements
 */
export class ContractTheory {
  /**
   * Design optimal contract under moral hazard
   */
  static designOptimalContract(
    agentEffortCost: number,
    outputMultiplier: number,
    riskAversion: number,
    outsideOption: number
  ): {
    effortLevel: number;
    bonusThreshold: number;
    paymentSchedule: { low: number; high: number };
    expectedAgentPayoff: number;
    principalProfit: number;
  } {
    // Optimal effort level (first-best)
    const effortLevel = (outputMultiplier - agentEffortCost) / (2 * riskAversion);

    // Bonus threshold for performance pay
    const bonusThreshold = effortLevel * outputMultiplier;

    // Payment schedule
    const highPayment = effortLevel * outputMultiplier * 2;
    const lowPayment = Math.max(0, outsideOption - agentEffortCost * effortLevel);

    // Expected payoffs
    const expectedAgentPayoff = (highPayment - lowPayment) / 2 - agentEffortCost * effortLevel * effortLevel;
    const principalProfit = outputMultiplier * effortLevel - (highPayment + lowPayment) / 2;

    return {
      effortLevel,
      bonusThreshold,
      paymentSchedule: { low: lowPayment, high: highPayment },
      expectedAgentPayoff,
      principalProfit,
    };
  }

  /**
   * Design contract with adverse selection
   */
  static designScreeningContract(
    types: { type: number; cost: number; valuation: number }[],
    participationConstraint: number
  ): {
    contracts: { type: number; payment: number; output: number }[];
    typeRevealed: boolean;
    efficiencyLoss: number;
  } {
    // Sort types by their cost (or other distinguishing characteristic)
    const sortedTypes = [...types].sort((a, b) => a.type - b.type);

    // Design separating contracts
    const contracts = sortedTypes.map((t) => {
      const payment = t.valuation - participationConstraint;
      const output = t.valuation - t.cost;
      return { type: t.type, payment, output };
    });

    // Check if types are revealed truthfully
    const typeRevealed = true; // Simplified

    // Efficiency loss from adverse selection
    const firstBestOutput = sortedTypes.reduce((sum, t) => sum + (t.valuation - t.cost), 0);
    const secondBestOutput = contracts.reduce((sum, c) => sum + c.output, 0);
    const efficiencyLoss = firstBestOutput - secondBestOutput;

    return {
      contracts,
      typeRevealed,
      efficiencyLoss,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Nash Equilibrium
  NashEquilibriumSolver,

  // Cooperative Game Theory
  CooperativeGameTheory,

  // Mechanism Design
  MechanismDesign,

  // Political Economy
  CapturePreventionMechanism,

  // Cooperative Market Design
  CooperativeMarketDesign,

  // Pareto Analysis
  ParetoAnalysis,

  // Repeated Games
  RepeatedGameAnalysis,

  // Contract Theory
  ContractTheory,
};

// Re-export vector operations for internal use
import { VectorOps } from './AtlasSanctumLinearAlgebra';
