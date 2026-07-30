/**
 * Sorting algorithms for carbon credit listings
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

/**
 * Sort credit listings using various sorting algorithms
 * @param listings - List of credit listings to sort
 * @param sortKey - Key to sort by
 * @param ascending - Whether to sort in ascending order (default: true)
 * @returns Sorted list of credit listings
 */
const sortCreditListings = (
  listings: CreditListing[],
  sortKey: keyof CreditListing,
  ascending: boolean = true
): CreditListing[] => {
  const sorted = [...listings];

  sorted.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue as string);
      return ascending ? comparison : -comparison;
    } else if (typeof aValue === 'number') {
      return ascending ? aValue - (bValue as number) : (bValue as number) - aValue;
    } else if (aValue instanceof Date) {
      return ascending 
        ? aValue.getTime() - (bValue as Date).getTime() 
        : (bValue as Date).getTime() - aValue.getTime();
    } else if (typeof aValue === 'boolean') {
      const aBool = aValue ? 1 : 0;
      const bBool = bValue ? 1 : 0;
      return ascending ? aBool - bBool : bBool - aBool;
    }

    return ascending 
      ? String(aValue).localeCompare(String(bValue)) 
      : String(bValue).localeCompare(String(aValue));
  });

  return sorted;
};

export {
  sortCreditListings
};

export default sortCreditListings;
