import { z } from 'zod';

// Base schemas for reusable validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password is too long')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');

export const fullNameSchema = z
  .string()
  .min(1, 'Full name is required')
  .max(100, 'Full name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes')
  .transform((val) => val.trim());

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
  userType: z.enum(['individual', 'organization', 'institution']).default('individual'),
});

// Password reset schemas
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Email verification schema
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// Profile update schema
export const updateProfileSchema = z.object({
  fullName: fullNameSchema.optional(),
  email: emailSchema.optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;