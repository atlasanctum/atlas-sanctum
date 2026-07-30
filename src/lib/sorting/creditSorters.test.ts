import { describe, it, expect, beforeEach } from 'vitest';
import sortCreditListings from './creditSorters';

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

describe('Credit Sorters', () => {
  let sampleListings: CreditListing[];

  beforeEach(() => {
    sampleListings = [
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
  });

  describe('Basic Sorting', () => {
    it('should sort by price in ascending order', () => {
      const sorted = sortCreditListings(sampleListings, 'price', true);
      
      expect(sorted).toBeDefined();
      expect(sorted.length).toBe(sampleListings.length);
      
      const prices = sorted.map(listing => listing.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    it('should sort by quality in descending order', () => {
      const sorted = sortCreditListings(sampleListings, 'quality', false);
      
      expect(sorted).toBeDefined();
      expect(sorted.length).toBe(sampleListings.length);
      
      const qualities = sorted.map(listing => listing.quality);
      for (let i = 1; i < qualities.length; i++) {
        expect(qualities[i]).toBeLessThanOrEqual(qualities[i - 1]);
      }
    });

    it('should sort by quantity in ascending order', () => {
      const sorted = sortCreditListings(sampleListings, 'quantity', true);
      
      expect(sorted).toBeDefined();
      expect(sorted.length).toBe(sampleListings.length);
      
      const quantities = sorted.map(listing => listing.quantity);
      for (let i = 1; i < quantities.length; i++) {
        expect(quantities[i]).toBeGreaterThanOrEqual(quantities[i - 1]);
      }
    });

    it('should sort by region in ascending order', () => {
      const sorted = sortCreditListings(sampleListings, 'region', true);
      
      expect(sorted).toBeDefined();
      expect(sorted.length).toBe(sampleListings.length);
      
      const regions = sorted.map(listing => listing.region);
      for (let i = 1; i < regions.length; i++) {
        expect(regions[i].localeCompare(regions[i - 1])).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      const sorted = sortCreditListings([], 'price', true);
      expect(sorted).toEqual([]);
    });

    it('should handle single item array', () => {
      const singleItem = [sampleListings[0]];
      const sorted = sortCreditListings(singleItem, 'price', true);
      expect(sorted).toEqual(singleItem);
    });

    it('should handle all items with the same value', () => {
      const samePriceListings = sampleListings.map(listing => ({
        ...listing,
        price: 25
      }));
      
      const sorted = sortCreditListings(samePriceListings, 'price', true);
      expect(sorted.length).toBe(samePriceListings.length);
      
      const prices = sorted.map(listing => listing.price);
      expect(new Set(prices).size).toBe(1);
    });
  });

  describe('Performance', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset: CreditListing[] = [];
      const regions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
      const certifications = ['Basic', 'Standard', 'Verified', 'Premium'];
      
      for (let i = 0; i < 1000; i++) {
        largeDataset.push({
          id: `test-${i}`,
          price: Math.floor(Math.random() * 100) + 10,
          quality: Math.floor(Math.random() * 10) + 1,
          quantity: Math.floor(Math.random() * 1000) + 10,
          seller: `Seller ${i}`,
          region: regions[Math.floor(Math.random() * regions.length)],
          certification: certifications[Math.floor(Math.random() * certifications.length)],
          verified: Math.random() > 0.2,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000))
        });
      }

      const startTime = performance.now();
      const sorted = sortCreditListings(largeDataset, 'price', true);
      const endTime = performance.now();

      expect(sorted.length).toBe(largeDataset.length);
      expect(endTime - startTime).toBeLessThan(1000);

      const prices = sorted.map(listing => listing.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });
  });
});
