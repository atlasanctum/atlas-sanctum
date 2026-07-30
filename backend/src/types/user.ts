/**
 * Core User Identity Types
 * 
 * Comprehensive type definitions for user identities in the multi-tenant platform.
 */

import { Request } from 'express';

// ============================================================================
// User Identity
// ============================================================================

export interface BaseUser {
  id: string;
  email: string;
  phoneNumber?: string;
  displayName: string;
  avatarUrl?: string;
  role: string;
  tenantId: string;
  organizationId?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

export interface UserProfile extends BaseUser {
  profileData?: Record<string, unknown>;
  preferences?: UserPreferences;
}

// ============================================================================
// Authenticated User
// ============================================================================

export interface TokenPayload {
  sub: string;              // User ID
  email: string;
  role: string;
  tenantId: string;
  organizationId?: string;
  permissions: string[];
  sessionId: string;
  deviceFingerprint?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser extends TokenPayload {
  // Additional runtime properties
  sessionToken?: string;
  refreshToken?: string;
  tokenVersion?: number;
}

// ============================================================================
// Express Request Extensions
// ============================================================================

export interface TenantContext {
  tenantId: string;
  organizationId?: string;
  userId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  tenantContext?: TenantContext;
  authMethod?: 'session' | 'jwt' | 'apiKey';
  requestId?: string;
}

// ============================================================================
// Organization
// ============================================================================

export interface Organization {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  type: 'company' | 'ngo' | 'government' | 'individual';
  ownerId: string;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  allowMemberInvites: boolean;
  defaultUserRole: string;
  requireMFA: boolean;
  domainWhitelist?: string[];
}

// ============================================================================
// Tenant
// ============================================================================

export type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise';

export interface TenantLimits {
  users: number;
  storage: number;           // in bytes
  apiCalls: number;          // per month
  rateLimit: number;         // requests per minute
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  settings: TenantSettings;
  limits: TenantLimits;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  allowOAuth: boolean;
  requireMFA: boolean;
  sessionTimeout: number;    // in minutes
  maxSessionsPerUser: number;
  ipWhitelist?: string[];
  domainWhitelist?: string[];
}

// ============================================================================
// Role Hierarchy
// ============================================================================

export const ROLE_HIERARCHY = {
  super_admin: 100,
  tenant_admin: 80,
  organization_admin: 60,
  moderator: 40,
  manager: 30,
  member: 20,
  guest: 10
} as const;

export type Role = keyof typeof ROLE_HIERARCHY;

// ============================================================================
// Capabilities
// ============================================================================

export const ROLE_CAPABILITIES: Record<string, string[]> = {
  super_admin: ['*'],
  tenant_admin: [
    'users:read', 'users:write', 'users:delete', 'users:invite',
    'organizations:read', 'organizations:write', 'organizations:delete',
    'billing:read', 'billing:write',
    'audit:read', 'settings:read', 'settings:write'
  ],
  organization_admin: [
    'users:read', 'users:invite',
    'projects:read', 'projects:write',
    'billing:read',
    'members:manage'
  ],
  moderator: [
    'content:moderate', 'users:manage', 'system:monitor'
  ],
  manager: [
    'projects:read', 'projects:write',
    'team:read', 'team:manage'
  ],
  member: [
    'projects:read',
    'own:profile:read', 'own:profile:write',
    'own:resources:read', 'own:resources:write'
  ],
  guest: [
    'public:read'
  ]
};
