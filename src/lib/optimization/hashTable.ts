/**
 * Hash table implementation for fast lookup of credit listings
 * Provides efficient O(1) average time complexity for lookups
 */

interface CreditListing {
  id: string;
  price: number;
  quality: number;
  quantity: number;
  seller: string;
  region: string;
  certification: string;
  verified: boolean;
  createdAt: Date;
}

// Simple hash function for strings
const hashString = (key: string): number => {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

class CreditHashTable {
  private table: Array<Array<{ key: string; value: CreditListing }>>;
  private size: number;
  private count: number;

  constructor(initialSize: number = 100) {
    this.size = initialSize;
    this.table = new Array(initialSize).fill(null).map(() => []);
    this.count = 0;
  }

  // Compute hash for a key
  private hash(key: string): number {
    return hashString(key) % this.size;
  }

  // Insert a credit listing
  insert(key: string, value: CreditListing): void {
    const index = this.hash(key);
    const bucket = this.table[index];

    // Check if key already exists and update
    const existing = bucket.find(item => item.key === key);
    if (existing) {
      existing.value = value;
      return;
    }

    // Add new item to bucket
    bucket.push({ key, value });
    this.count++;

    // Resize table if load factor exceeds 0.7
    if (this.count / this.size > 0.7) {
      this.resize(this.size * 2);
    }
  }

  // Get a credit listing
  get(key: string): CreditListing | undefined {
    const index = this.hash(key);
    const bucket = this.table[index];
    const item = bucket.find(item => item.key === key);
    return item?.value;
  }

  // Delete a credit listing
  delete(key: string): CreditListing | undefined {
    const index = this.hash(key);
    const bucket = this.table[index];
    const itemIndex = bucket.findIndex(item => item.key === key);

    if (itemIndex !== -1) {
      const [deleted] = bucket.splice(itemIndex, 1);
      this.count--;

      // Resize table if load factor drops below 0.2 and size > initial size
      if (this.count / this.size < 0.2 && this.size > 50) {
        this.resize(Math.floor(this.size / 2));
      }

      return deleted.value;
    }

    return undefined;
  }

  // Resize the table
  private resize(newSize: number): void {
    const oldTable = this.table;
    this.size = newSize;
    this.table = new Array(newSize).fill(null).map(() => []);
    this.count = 0;

    // Rehash all items
    for (const bucket of oldTable) {
      for (const item of bucket) {
        this.insert(item.key, item.value);
      }
    }
  }

  // Get all keys
  keys(): string[] {
    const keys: string[] = [];
    for (const bucket of this.table) {
      for (const item of bucket) {
        keys.push(item.key);
      }
    }
    return keys;
  }

  // Get all values
  values(): CreditListing[] {
    const values: CreditListing[] = [];
    for (const bucket of this.table) {
      for (const item of bucket) {
        values.push(item.value);
      }
    }
    return values;
  }

  // Get all entries
  entries(): Array<{ key: string; value: CreditListing }> {
    const entries: Array<{ key: string; value: CreditListing }> = [];
    for (const bucket of this.table) {
      for (const item of bucket) {
        entries.push(item);
      }
    }
    return entries;
  }

  // Check if key exists
  has(key: string): boolean {
    const index = this.hash(key);
    const bucket = this.table[index];
    return bucket.some(item => item.key === key);
  }

  // Clear all items
  clear(): void {
    this.table = new Array(this.size).fill(null).map(() => []);
    this.count = 0;
  }

  // Get number of items
  length(): number {
    return this.count;
  }

  // Get load factor
  loadFactor(): number {
    return this.count / this.size;
  }

  // Get bucket size for a specific index
  bucketSize(index: number): number {
    if (index < 0 || index >= this.size) {
      throw new Error('Invalid bucket index');
    }
    return this.table[index].length;
  }

  // Find by criteria
  findByCriteria(predicate: (value: CreditListing) => boolean): CreditListing[] {
    const results: CreditListing[] = [];
    for (const bucket of this.table) {
      for (const item of bucket) {
        if (predicate(item.value)) {
          results.push(item.value);
        }
      }
    }
    return results;
  }

  // Find all listings within price range
  findByPriceRange(minPrice: number, maxPrice: number): CreditListing[] {
    return this.findByCriteria(listing => 
      listing.price >= minPrice && listing.price <= maxPrice
    );
  }

  // Find all verified listings
  findVerifiedListings(): CreditListing[] {
    return this.findByCriteria(listing => listing.verified);
  }

  // Find listings by region
  findByRegion(region: string): CreditListing[] {
    return this.findByCriteria(listing => listing.region === region);
  }

  // Find listings with minimum quality
  findByMinimumQuality(minQuality: number): CreditListing[] {
    return this.findByCriteria(listing => listing.quality >= minQuality);
  }
}

// Example usage
const exampleUsage = () => {
  const hashTable = new CreditHashTable();

  // Sample data
  const sampleListings: CreditListing[] = [
    {
      id: '1',
      price: 25,
      quality: 8,
      quantity: 100,
      seller: 'Seller A',
      region: 'North America',
      certification: 'Verified',
      verified: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      price: 20,
      quality: 6,
      quantity: 50,
      seller: 'Seller B',
      region: 'Europe',
      certification: 'Standard',
      verified: true,
      createdAt: new Date('2024-01-02')
    },
    {
      id: '3',
      price: 30,
      quality: 9,
      quantity: 200,
      seller: 'Seller C',
      region: 'Asia',
      certification: 'Premium',
      verified: false,
      createdAt: new Date('2024-01-03')
    },
    {
      id: '4',
      price: 15,
      quality: 5,
      quantity: 300,
      seller: 'Seller D',
      region: 'South America',
      certification: 'Basic',
      verified: true,
      createdAt: new Date('2024-01-04')
    }
  ];

  // Insert items
  sampleListings.forEach(listing => {
    hashTable.insert(listing.id, listing);
  });

  // Test lookup
  console.log('Lookup ID 2:', hashTable.get('2'));

  // Test range query
  console.log('Price range $18-28:', hashTable.findByPriceRange(18, 28));

  // Test region query
  console.log('North America listings:', hashTable.findByRegion('North America'));

  // Test quality query
  console.log('Quality >= 8:', hashTable.findByMinimumQuality(8));

  // Test deletion
  const deleted = hashTable.delete('3');
  console.log('Deleted listing:', deleted);
  console.log('Remaining count:', hashTable.length());

  return hashTable;
};

export {
  CreditHashTable,
  exampleUsage
};

export default CreditHashTable;