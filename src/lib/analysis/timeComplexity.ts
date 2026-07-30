/**
 * Time complexity analyzer for measuring algorithm performance
 * Implements counting operations and big O notation analysis
 */

// Define types for operation counters
interface OperationCounters {
  assignments: number;
  comparisons: number;
  arithmetic: number;
  methodCalls: number;
  memoryAccess: number;
}

// Class to track operation counts
class OperationCounter {
  private counters: OperationCounters;

  constructor() {
    this.counters = {
      assignments: 0,
      comparisons: 0,
      arithmetic: 0,
      methodCalls: 0,
      memoryAccess: 0
    };
  }

  // Increment specific operation counter
  increment(operation: keyof OperationCounters, count: number = 1): void {
    this.counters[operation] += count;
  }

  // Get all counters
  getCounters(): OperationCounters {
    return { ...this.counters };
  }

  // Reset all counters
  reset(): void {
    this.counters = {
      assignments: 0,
      comparisons: 0,
      arithmetic: 0,
      methodCalls: 0,
      memoryAccess: 0
    };
  }

  // Calculate total operations
  getTotalOperations(): number {
    return Object.values(this.counters).reduce((sum, value) => sum + value, 0);
  }

  // Get operation distribution as percentages
  getOperationDistribution(): Record<string, number> {
    const total = this.getTotalOperations();
    return Object.keys(this.counters).reduce((result, key) => {
      const value = this.counters[key as keyof OperationCounters];
      result[key] = total > 0 ? (value / total) * 100 : 0;
      return result;
    }, {} as Record<string, number>);
  }

  // Pretty print operation summary
  printSummary(): string {
    const total = this.getTotalOperations();
    const distribution = this.getOperationDistribution();
    
    return `
Operation Summary:
==================
Total operations: ${total.toLocaleString()}

Operations breakdown:
- Assignments: ${this.counters.assignments.toLocaleString()} (${distribution.assignments.toFixed(1)}%)
- Comparisons: ${this.counters.comparisons.toLocaleString()} (${distribution.comparisons.toFixed(1)}%)
- Arithmetic: ${this.counters.arithmetic.toLocaleString()} (${distribution.arithmetic.toFixed(1)}%)
- Method calls: ${this.counters.methodCalls.toLocaleString()} (${distribution.methodCalls.toFixed(1)}%)
- Memory access: ${this.counters.memoryAccess.toLocaleString()} (${distribution.memoryAccess.toFixed(1)}%)
    `.trim();
  }
}

// Function decorator to measure execution time
const measureExecutionTimeInternal = <T extends (...args: any[]) => any>(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor => {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]): any {
    const startTime = performance.now();
    const result = originalMethod.apply(this, args);
    const endTime = performance.now();
    
    const executionTime = endTime - startTime;
    console.log(`[${propertyKey}] Execution time: ${executionTime.toFixed(2)}ms`);
    
    return result;
  };
  
  return descriptor;
};

// Function decorator to count operations (simplified version)
const countOperationsInternal = <T extends (...args: any[]) => any>(
  operationCounter: OperationCounter
): ((target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]): any {
      operationCounter.increment('methodCalls');
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
};

// Measure algorithm performance
const measureAlgorithmPerformanceInternal = <T extends (...args: any[]) => any>(
  algorithm: T,
  ...args: Parameters<T>
): {
  result: ReturnType<T>;
  executionTime: number;
  operations: OperationCounters;
} => {
  const operationCounter = new OperationCounter();
  const startTime = performance.now();
  
  // Create a proxy around the algorithm to count operations
  const proxiedAlgorithm = new Proxy(algorithm, {
    apply(target, thisArg, argumentsList) {
      // Count operations by analyzing arguments and result
      operationCounter.increment('methodCalls');
      
      // This is a simplification - in real applications, you would
      // instrument the algorithm with specific counter increments
      
      // Execute the algorithm
      const result = target.apply(thisArg, argumentsList);
      
      // Count basic operations based on input size
      if (argumentsList.length > 0 && Array.isArray(argumentsList[0])) {
        const inputSize = argumentsList[0].length;
        operationCounter.increment('assignments', inputSize);
        operationCounter.increment('comparisons', inputSize);
        operationCounter.increment('memoryAccess', inputSize);
      }
      
      return result;
    }
  });
  
  const result = proxiedAlgorithm(...args);
  const endTime = performance.now();
  
  return {
    result,
    executionTime: endTime - startTime,
    operations: operationCounter.getCounters()
  };
};

// Predict time complexity based on execution times for different input sizes
const predictTimeComplexityInternal = (
  executionTimes: Array<{
    inputSize: number;
    time: number;
  }>
): string => {
  // Calculate differences between consecutive measurements
  const complexities: string[] = [];
  
  for (let i = 0; i < executionTimes.length - 1; i++) {
    const n1 = executionTimes[i].inputSize;
    const t1 = executionTimes[i].time;
    const n2 = executionTimes[i + 1].inputSize;
    const t2 = executionTimes[i + 1].time;
    
    // Calculate growth rate
    const growthRate = t2 / t1;
    const sizeRatio = n2 / n1;
    
    // Determine complexity class based on growth rate
    if (growthRate < 2) {
      complexities.push('O(1)'); // Constant time
    } else if (Math.abs(growthRate - Math.log2(sizeRatio)) < 0.5) {
      complexities.push('O(log n)'); // Logarithmic time
    } else if (Math.abs(growthRate - sizeRatio) < 0.5) {
      complexities.push('O(n)'); // Linear time
    } else if (Math.abs(growthRate - Math.pow(sizeRatio, 2)) < 0.5) {
      complexities.push('O(n²)'); // Quadratic time
    } else if (Math.abs(growthRate - Math.pow(sizeRatio, 3)) < 0.5) {
      complexities.push('O(n³)'); // Cubic time
    } else if (Math.abs(growthRate - Math.pow(2, sizeRatio)) < 0.5) {
      complexities.push('O(2^n)'); // Exponential time
    } else {
      complexities.push('Unknown');
    }
  }
  
  // Determine the most common complexity class
  const complexityCounts = complexities.reduce((counts, complexity) => {
    counts[complexity] = (counts[complexity] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  return Object.entries(complexityCounts)
    .sort(([, a], [, b]) => b - a)[0][0];
};

// Example usage
const exampleUsage = () => {
  const operationCounter = new OperationCounter();
  
  // Create a simple algorithm to measure
  const bubbleSort = (arr: number[]): number[] => {
    operationCounter.increment('methodCalls');
    const sorted = [...arr];
    const n = sorted.length;
    
    for (let i = 0; i < n; i++) {
      operationCounter.increment('assignments');
      operationCounter.increment('comparisons');
      
      for (let j = 0; j < n - i - 1; j++) {
        operationCounter.increment('assignments');
        operationCounter.increment('comparisons', 2);
        
        if (sorted[j] > sorted[j + 1]) {
          operationCounter.increment('comparisons');
          [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
          operationCounter.increment('assignments', 3);
        }
      }
    }
    
    return sorted;
  };
  
  // Measure performance with different input sizes
  const inputSizes = [100, 200, 400, 800, 1600];
  const executionTimes: Array<{
    inputSize: number;
    time: number;
  }> = [];
  
  for (const size of inputSizes) {
    const data = Array.from({ length: size }, () => Math.floor(Math.random() * size));
    const startTime = performance.now();
    bubbleSort(data);
    const endTime = performance.now();
    executionTimes.push({
      inputSize: size,
      time: endTime - startTime
    });
  }
  
  // Predict time complexity
  const predictedComplexity = predictTimeComplexityInternal(executionTimes);
  console.log('Predicted time complexity:', predictedComplexity);
  
  // Print operation summary
  console.log('\nOperation Counter Summary:');
  console.log(operationCounter.printSummary());
  
  // Print execution time results
  console.log('\nExecution Times:');
  executionTimes.forEach((result, index) => {
    console.log(`Input size ${result.inputSize}: ${result.time.toFixed(2)}ms`);
  });
  
  return {
    executionTimes,
    predictedComplexity,
    operationCounter
  };
};

export {
  OperationCounter,
  measureExecutionTimeInternal as measureExecutionTime,
  countOperationsInternal as countOperations,
  measureAlgorithmPerformanceInternal as measureAlgorithmPerformance,
  predictTimeComplexityInternal as predictTimeComplexity,
  exampleUsage
};

export default OperationCounter;