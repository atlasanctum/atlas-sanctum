import { z } from 'zod';

// Base schemas for reusable validation
export const sanitizedString = (fieldName: string, maxLength: number = 1000) =>
  z.string()
    .min(1, `${fieldName} is required`)
    .max(maxLength, `${fieldName} is too long`)
    .transform((val) => val.trim())
    .refine((val) => !/<script|javascript:|on\w+=/i.test(val), `${fieldName} contains invalid content`);

export const urlSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val), 'Invalid URL format');

export const positiveNumber = (fieldName: string) =>
  z.number().min(0.01, `${fieldName} must be greater than 0`);

export const nonNegativeInteger = (fieldName: string) =>
  z.number().int().min(0, `${fieldName} cannot be negative`);

// Project creation/update schema
export const projectSchema = z.object({
  title: sanitizedString('Title', 200),
  description: sanitizedString('Description', 5000),
  location: sanitizedString('Location', 200),
  country: sanitizedString('Country', 100),
  project_type: z.enum([
    'reforestation',
    'renewable_energy',
    'methane_capture',
    'ocean_restoration',
    'soil_carbon',
    'direct_air_capture'
  ], { required_error: 'Project type is required' }),
  status: z.enum([
    'active',
    'pending',
    'completed',
    'suspended'
  ]).default('active'),
  price_per_credit: positiveNumber('Price per credit').max(10000, 'Price per credit is too high'),
  total_credits: nonNegativeInteger('Total credits').max(10000000, 'Total credits is too high'),
  available_credits: nonNegativeInteger('Available credits'),
  vintage_year: z.number()
    .int()
    .min(2000, 'Vintage year must be 2000 or later')
    .max(new Date().getFullYear() + 10, 'Vintage year is too far in the future'),
  certification: sanitizedString('Certification', 200),
  developer_name: sanitizedString('Developer name', 200),
  co2_offset_per_credit: positiveNumber('CO2 offset per credit').max(100, 'CO2 offset per credit is too high'),
  methodology: z.string().max(500, 'Methodology is too long').optional(),
  image_url: urlSchema,
}).refine((data) => data.available_credits <= data.total_credits, {
  message: 'Available credits cannot exceed total credits',
  path: ['available_credits'],
});

// Project filters schema
export const projectFiltersSchema = z.object({
  project_type: z.array(z.enum([
    'reforestation',
    'renewable_energy',
    'methane_capture',
    'ocean_restoration',
    'soil_carbon',
    'direct_air_capture'
  ])).optional(),
  country: z.array(z.string()).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  min_credits: z.number().int().min(1).optional(),
  max_credits: z.number().int().min(1).optional(),
  vintage_year: z.number().int().min(2000).optional(),
  certification: z.array(z.string()).optional(),
  status: z.array(z.enum(['active', 'pending', 'completed', 'suspended'])).optional(),
});

// Project search schema
export const projectSearchSchema = z.object({
  query: z.string().max(100, 'Search query is too long').optional(),
  sort_by: z.enum(['price', 'credits', 'vintage_year', 'created_at']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Types
export type ProjectFormData = z.infer<typeof projectSchema>;
export type ProjectFiltersData = z.infer<typeof projectFiltersSchema>;
export type ProjectSearchData = z.infer<typeof projectSearchSchema>;