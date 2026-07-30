import { z } from 'zod';

// Purchase schema
export const purchaseSchema = z.object({
  listingId: z.string().uuid('Invalid project ID'),
  quantity: z.number()
    .int()
    .min(1, 'Quantity must be at least 1')
    .max(10000, 'Quantity cannot exceed 10,000 credits'),
  buyerId: z.string().uuid('Invalid buyer ID'),
  email: z.string().email('Invalid email address'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['paystack', 'paypal']).default('paystack'),
}).refine((data) => {
  // Additional validation: amount should be reasonable
  return data.amount <= 1000000; // Max $1M per transaction
}, {
  message: 'Transaction amount is too high',
  path: ['amount'],
});

// Marketplace filters schema
export const marketplaceFiltersSchema = z.object({
  category: z.array(z.enum([
    'reforestation',
    'renewable_energy',
    'methane_capture',
    'ocean_restoration',
    'soil_carbon',
    'direct_air_capture'
  ])).optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  location: z.array(z.string()).optional(),
  certification: z.array(z.string()).optional(),
  vintageYear: z.number().int().min(2000).optional(),
  minCredits: z.number().int().min(1).optional(),
  maxCredits: z.number().int().min(1).optional(),
  sortBy: z.enum(['price', 'rating', 'newest', 'popularity']).default('newest'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Project comparison schema
export const projectComparisonSchema = z.object({
  projectIds: z.array(z.string().uuid())
    .min(2, 'Select at least 2 projects to compare')
    .max(4, 'Cannot compare more than 4 projects'),
});

// Cart/Portfolio schema
export const cartItemSchema = z.object({
  projectId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10000),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema).max(50, 'Cart cannot contain more than 50 items'),
  totalCredits: z.number().int().min(0),
  totalAmount: z.number().min(0),
});

// Measurement data schema
export const measurementDataSchema = z.object({
  projectId: z.string().uuid(),
  timestamp: z.date(),
  co2Captured: z.number().min(0),
  biodiversityIndex: z.number().min(0).max(100).optional(),
  waterQuality: z.number().min(0).max(100).optional(),
  soilHealth: z.number().min(0).max(100).optional(),
  verified: z.boolean().default(false),
});

// Project rating/review schema
export const projectReviewSchema = z.object({
  projectId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string()
    .max(1000, 'Review comment is too long')
    .refine((val) => !/<script|javascript:|on\w+=/i.test(val), 'Review contains invalid content')
    .optional(),
  reviewerId: z.string().uuid(),
  reviewerName: z.string().min(1).max(100),
});

// Types
export type PurchaseFormData = z.infer<typeof purchaseSchema>;
export type MarketplaceFiltersData = z.infer<typeof marketplaceFiltersSchema>;
export type ProjectComparisonData = z.infer<typeof projectComparisonSchema>;
export type CartData = z.infer<typeof cartSchema>;
export type CartItemData = z.infer<typeof cartItemSchema>;
export type MeasurementData = z.infer<typeof measurementDataSchema>;
export type ProjectReviewData = z.infer<typeof projectReviewSchema>;