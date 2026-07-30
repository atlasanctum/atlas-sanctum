/**
 * Impact simulation module for carbon credit calculations
 * Uses recursion and dynamic programming to estimate future impact
 */

interface ImpactParams {
  initialCredits: number;
  annualGrowthRate: number; // Annual growth rate in %
  discountRate: number; // Discount rate for present value calculations
  timeHorizon: number; // Number of years to simulate
  carbonSequestrationRate: number; // Tonnes of CO2 sequestered per credit per year
  initialPrice: number; // Initial price per credit
  priceGrowthRate: number; // Annual price growth rate in %
}

interface SimulationResult {
  year: number;
  credits: number;
  sequestration: number;
  price: number;
  value: number;
  presentValue: number;
}

// Recursive function to calculate cumulative impact over time
const calculateImpactRecursive = (
  params: ImpactParams,
  year: number = 0,
  cumulativeCredits: number = 0
): SimulationResult[] => {
  if (year > params.timeHorizon) {
    return [];
  }

  // Calculate values for current year
  const credits = year === 0 
    ? params.initialCredits 
    : cumulativeCredits * (1 + params.annualGrowthRate / 100);
  
  const sequestration = credits * params.carbonSequestrationRate;
  const price = params.initialPrice * Math.pow(1 + params.priceGrowthRate / 100, year);
  const value = credits * price;
  const presentValue = value / Math.pow(1 + params.discountRate / 100, year);

  const result: SimulationResult = {
    year,
    credits,
    sequestration,
    price,
    value,
    presentValue
  };

  // Recursively calculate next year's values
  return [
    result,
    ...calculateImpactRecursive(params, year + 1, credits)
  ];
};

// Memoized version using dynamic programming
const calculateImpactMemoized = (
  params: ImpactParams,
  year: number = 0,
  memo: Record<number, SimulationResult> = {}
): SimulationResult[] => {
  if (year > params.timeHorizon) {
    return [];
  }

  if (memo[year]) {
    return [memo[year]];
  }

  const previousResults = year > 0 ? calculateImpactMemoized(params, year - 1, memo) : [];
  const previousCredits = year > 0 ? previousResults[year - 1].credits : params.initialCredits;

  const credits = year === 0 
    ? params.initialCredits 
    : previousCredits * (1 + params.annualGrowthRate / 100);
  
  const sequestration = credits * params.carbonSequestrationRate;
  const price = params.initialPrice * Math.pow(1 + params.priceGrowthRate / 100, year);
  const value = credits * price;
  const presentValue = value / Math.pow(1 + params.discountRate / 100, year);

  const result: SimulationResult = {
    year,
    credits,
    sequestration,
    price,
    value,
    presentValue
  };

  memo[year] = result;

  return [
    result,
    ...calculateImpactMemoized(params, year + 1, memo)
  ];
};

// Calculate total impact metrics
const calculateTotalMetrics = (results: SimulationResult[]): any => {
  const totalCredits = results.reduce((sum, result) => sum + result.credits, 0);
  const totalSequestration = results.reduce((sum, result) => sum + result.sequestration, 0);
  const totalValue = results.reduce((sum, result) => sum + result.value, 0);
  const totalPresentValue = results.reduce((sum, result) => sum + result.presentValue, 0);

  return {
    totalCredits,
    totalSequestration,
    totalValue,
    totalPresentValue,
    averagePrice: totalValue / totalCredits,
    averageSequestrationPerYear: totalSequestration / results.length
  };
};

// Main simulation function
export const runImpactSimulation = (params: ImpactParams): any => {
  try {
    // Validate parameters
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value !== 'number' || value < 0) {
        throw new Error(`Invalid parameter: ${key} must be a non-negative number`);
      }
    });

    // Run simulation
    const results = calculateImpactMemoized(params);
    
    // Calculate total metrics
    const totalMetrics = calculateTotalMetrics(results);

    return {
      parameters: params,
      results,
      totals: totalMetrics
    };
  } catch (error) {
    console.error('Simulation error:', error);
    return null;
  }
};

// Example usage
const exampleUsage = () => {
  const params: ImpactParams = {
    initialCredits: 1000,
    annualGrowthRate: 5,
    discountRate: 3,
    timeHorizon: 10,
    carbonSequestrationRate: 0.8,
    initialPrice: 25,
    priceGrowthRate: 4
  };

  const result = runImpactSimulation(params);
  
  if (result) {
    console.log('Simulation Results');
    console.log('=================');
    console.log(`Total Credits Generated: ${result.totals.totalCredits.toFixed(0)}`);
    console.log(`Total CO2 Sequestered: ${result.totals.totalSequestration.toFixed(0)} tonnes`);
    console.log(`Total Market Value: $${result.totals.totalValue.toFixed(2)}`);
    console.log(`Present Value: $${result.totals.totalPresentValue.toFixed(2)}`);
    console.log(`Average Price: $${result.totals.averagePrice.toFixed(2)} per credit`);
  }
  
  return result;
};

export default runImpactSimulation;