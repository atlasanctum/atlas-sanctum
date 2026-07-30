/**
 * Bisection search algorithm for finding optimal carbon credit price
 * This algorithm helps determine the price at which demand equals supply in the marketplace
 */

// Define a function to represent the demand-supply curve
const demandSupplyFunction = (price: number, baseDemand: number, supply: number): number => {
  // Demand decreases with price (elasticity factor)
  const elasticity = 0.5; // Price elasticity of demand (negative)
  const demand = baseDemand * Math.exp(-elasticity * price);
  
  // Calculate difference between demand and supply
  return demand - supply;
};

// Bisection search implementation
export const findOptimalPrice = (
  baseDemand: number,
  supply: number,
  lowerBound: number = 0,
  upperBound: number = 1000,
  tolerance: number = 0.01,
  maxIterations: number = 100
): number => {
  let left = lowerBound;
  let right = upperBound;
  let mid = (left + right) / 2;
  let iterations = 0;
  
  while (right - left > tolerance && iterations < maxIterations) {
    mid = (left + right) / 2;
    const value = demandSupplyFunction(mid, baseDemand, supply);
    
    // Check if we found the root
    if (Math.abs(value) < tolerance) {
      break;
    }
    
    // Determine which interval to search next
    const leftValue = demandSupplyFunction(left, baseDemand, supply);
    const rightValue = demandSupplyFunction(right, baseDemand, supply);
    
    if (leftValue * value < 0) {
      right = mid;
    } else if (rightValue * value < 0) {
      left = mid;
    } else {
      // No root found in this interval
      throw new Error('No root found in the specified interval');
    }
    
    iterations++;
  }
  
  if (iterations === maxIterations) {
    throw new Error('Maximum iterations exceeded');
  }
  
  return mid;
};

// Example usage
const exampleUsage = () => {
  try {
    const baseDemand = 10000; // Base demand at $0 price
    const supply = 5000; // Available supply
    
    const optimalPrice = findOptimalPrice(baseDemand, supply);
    console.log(`Optimal price: $${optimalPrice.toFixed(2)} per carbon credit`);
    
    // Verify the result
    const demandAtOptimalPrice = baseDemand * Math.exp(-0.5 * optimalPrice);
    console.log(`Demand at optimal price: ${demandAtOptimalPrice.toFixed(0)} credits`);
    console.log(`Supply: ${supply} credits`);
    
    return {
      optimalPrice,
      demand: demandAtOptimalPrice,
      supply
    };
  } catch (error) {
    console.error('Error finding optimal price:', error);
    return null;
  }
};

export default findOptimalPrice;