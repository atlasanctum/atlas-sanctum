/**
 * Fitness tracker-inspired impact tracking system
 * Uses object-oriented principles to model user impact
 */

// Base class for all impact trackers
class ImpactTracker {
  protected name: string;
  protected value: number;
  protected unit: string;
  protected timestamp: Date;

  constructor(name: string, value: number, unit: string) {
    this.name = name;
    this.value = value;
    this.unit = unit;
    this.timestamp = new Date();
  }

  // Get the current value
  getValue(): number {
    return this.value;
  }

  // Update the value with validation
  updateValue(newValue: number): void {
    if (newValue < 0) {
      throw new Error('Value cannot be negative');
    }
    this.value = newValue;
    this.timestamp = new Date();
  }

  // Get formatted value with unit
  getFormattedValue(): string {
    return `${this.value.toFixed(2)} ${this.unit}`;
  }

  // Get timestamp of last update
  getTimestamp(): Date {
    return this.timestamp;
  }

  // Get tracker information as a dictionary
  toJSON(): any {
    return {
      name: this.name,
      value: this.value,
      unit: this.unit,
      timestamp: this.timestamp.toISOString()
    };
  }
}

// Carbon footprint tracker
class CarbonFootprintTracker extends ImpactTracker {
  private offsetPercentage: number = 0;

  constructor(value: number = 0) {
    super('Carbon Footprint', value, 'tonnes CO2');
  }

  // Calculate offset percentage
  calculateOffset(offsetValue: number): number {
    if (offsetValue < 0) {
      throw new Error('Offset value cannot be negative');
    }

    this.offsetPercentage = (offsetValue / this.value) * 100;
    return this.offsetPercentage;
  }

  // Get offset percentage
  getOffsetPercentage(): number {
    return this.offsetPercentage;
  }

  // Get offset status
  getOffsetStatus(): string {
    if (this.offsetPercentage >= 100) {
      return 'Carbon Neutral';
    } else if (this.offsetPercentage >= 50) {
      return 'Partially Offset';
    } else {
      return 'Not Offset';
    }
  }
}

// Carbon credit acquisition tracker
class CreditAcquisitionTracker extends ImpactTracker {
  private purchaseHistory: {
    date: Date;
    amount: number;
    price: number;
  }[] = [];

  constructor(value: number = 0) {
    super('Carbon Credits', value, 'credits');
  }

  // Add a purchase to the history
  addPurchase(amount: number, price: number): void {
    if (amount <= 0 || price <= 0) {
      throw new Error('Amount and price must be positive');
    }

    this.purchaseHistory.push({
      date: new Date(),
      amount,
      price
    });

    this.updateValue(this.value + amount);
  }

  // Get average purchase price
  getAveragePrice(): number {
    if (this.purchaseHistory.length === 0) {
      return 0;
    }

    const totalSpent = this.purchaseHistory.reduce((sum, purchase) => sum + (purchase.amount * purchase.price), 0);
    const totalAmount = this.purchaseHistory.reduce((sum, purchase) => sum + purchase.amount, 0);

    return totalSpent / totalAmount;
  }

  // Get purchase history
  getPurchaseHistory(): any[] {
    return this.purchaseHistory.map(purchase => ({
      date: purchase.date.toISOString(),
      amount: purchase.amount,
      price: purchase.price,
      total: purchase.amount * purchase.price
    }));
  }

  // Get total spent
  getTotalSpent(): number {
    return this.purchaseHistory.reduce((sum, purchase) => sum + (purchase.amount * purchase.price), 0);
  }
}

// Combined impact tracker
class CombinedImpactTracker {
  private trackers: Map<string, ImpactTracker> = new Map();

  // Add a tracker
  addTracker(tracker: ImpactTracker): void {
    this.trackers.set(tracker.constructor.name, tracker);
  }

  // Get a tracker by type
  getTracker<T extends ImpactTracker>(type: new (...args: any[]) => T): T | undefined {
    const tracker = this.trackers.get(type.name);
    return tracker as T;
  }

  // Get all trackers
  getAllTrackers(): ImpactTracker[] {
    return Array.from(this.trackers.values());
  }

  // Get aggregated impact data
  getAggregatedData(): any {
    const data: any = {};

    this.trackers.forEach((tracker, key) => {
      data[key] = tracker.toJSON();
    });

    return data;
  }

  // Calculate overall impact score
  calculateImpactScore(): number {
    let score = 0;
    this.trackers.forEach(tracker => {
      if (tracker instanceof CarbonFootprintTracker) {
        score += tracker.getOffsetPercentage();
      } else if (tracker instanceof CreditAcquisitionTracker) {
        score += tracker.getValue() * 0.1;
      }
    });
    return Math.min(score, 100);
  }

  // Get impact level based on score
  getImpactLevel(): string {
    const score = this.calculateImpactScore();
    
    if (score >= 80) {
      return 'Eco Warrior';
    } else if (score >= 60) {
      return 'Climate Champion';
    } else if (score >= 40) {
      return 'Green Advocate';
    } else if (score >= 20) {
      return 'Conscious Consumer';
    } else {
      return 'Environmentally Aware';
    }
  }
}

// Helper function to create a default tracker setup
export const createDefaultImpactTracker = (): CombinedImpactTracker => {
  const tracker = new CombinedImpactTracker();
  tracker.addTracker(new CarbonFootprintTracker(10)); // 10 tonnes CO2 footprint per year
  tracker.addTracker(new CreditAcquisitionTracker(5)); // 5 credits purchased

  return tracker;
};

// Example usage
const exampleUsage = () => {
  const tracker = createDefaultImpactTracker();
  
  // Get trackers
  const carbonTracker = tracker.getTracker(CarbonFootprintTracker);
  const creditTracker = tracker.getTracker(CreditAcquisitionTracker);
  
  if (carbonTracker && creditTracker) {
    // Calculate offset
    const offsetPercentage = carbonTracker.calculateOffset(creditTracker.getValue() * 0.8); // Assuming 0.8 tonnes per credit
    console.log(`Offset Percentage: ${offsetPercentage.toFixed(1)}%`);
    console.log(`Offset Status: ${carbonTracker.getOffsetStatus()}`);
    
    // Add a purchase
    creditTracker.addPurchase(3, 25); // 3 credits at $25 each
    
    // Get aggregated data
    console.log('Impact Data:', tracker.getAggregatedData());
    console.log('Impact Score:', tracker.calculateImpactScore().toFixed(0));
    console.log('Impact Level:', tracker.getImpactLevel());
  }
  
  return tracker;
};

export {
  ImpactTracker,
  CarbonFootprintTracker,
  CreditAcquisitionTracker,
  CombinedImpactTracker
};

export default CombinedImpactTracker;