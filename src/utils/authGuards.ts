/**
 * Authentication Guards
 * 
 * Utility functions for protecting routes and checking access permissions
 */

import type {
  DashboardType,
  UserRole,
  AccessCheckResult,
  DashboardConfig,
} from '@/types/auth';
import { DASHBOARD_CONFIGS, ROLE_TO_DASHBOARD } from '@/types/auth';

/**
 * Check if a user role can access a specific dashboard
 */
export const canRoleAccessDashboard = (
  role: UserRole,
  dashboardId: DashboardType
): AccessCheckResult => {
  // Admins can access all dashboards
  if (role === 'administrator' || role === 'super_admin') {
    return { canAccess: true };
  }

  const dashboardConfig = DASHBOARD_CONFIGS.find(d => d.id === dashboardId);
  
  if (!dashboardConfig) {
    return {
      canAccess: false,
      reason: 'Dashboard not found',
    };
  }

  // Check if the dashboard requires a specific role
  if (dashboardConfig.requiredRole && dashboardConfig.requiredRole !== role) {
    return {
      canAccess: false,
      reason: `This dashboard requires ${dashboardConfig.requiredRole} role`,
      requiredRole: dashboardConfig.requiredRole,
    };
  }

  return { canAccess: true };
};

/**
 * Get the default dashboard for a user role
 */
export const getDefaultDashboardForRole = (role: UserRole): DashboardType => {
  return ROLE_TO_DASHBOARD[role] || 'main';
};

/**
 * Get all accessible dashboards for a user role
 */
export const getAccessibleDashboardsForRole = (role: UserRole): DashboardConfig[] => {
  if (role === 'administrator' || role === 'super_admin') {
    return DASHBOARD_CONFIGS;
  }

  return DASHBOARD_CONFIGS.filter(dashboard => {
    if (!dashboard.requiredRole) return true;
    return dashboard.requiredRole === role || dashboard.id === 'main';
  });
};

/**
 * Check if a route is protected
 */
export const isProtectedRoute = (path: string): boolean => {
  const protectedPaths = [
    '/dashboard',
    '/admin',
    '/profile',
    '/settings',
    '/portfolio',
    '/marketplace',
  ];

  return protectedPaths.some(protectedPath => path.startsWith(protectedPath));
};

/**
 * Get the required role for a route
 */
export const getRequiredRoleForRoute = (path: string): UserRole | null => {
  const routeRoleMap: Record<string, UserRole> = {
    '/dashboard/administrator': 'administrator',
    '/dashboard/enterprise': 'enterprise',
    '/dashboard/government': 'government',
    '/dashboard/defi': 'defi',
    '/dashboard/ngo': 'ngo',
    '/admin': 'administrator',
  };

  for (const [route, role] of Object.entries(routeRoleMap)) {
    if (path.startsWith(route)) {
      return role;
    }
  }

  return null;
};

/**
 * Check if user can access a route
 */
export const canAccessRoute = (
  role: UserRole,
  path: string
): AccessCheckResult => {
  if (!isProtectedRoute(path)) {
    return { canAccess: true };
  }

  const requiredRole = getRequiredRoleForRoute(path);

  if (!requiredRole) {
    return { canAccess: true };
  }

  if (role === 'administrator' || role === 'super_admin') {
    return { canAccess: true };
  }

  if (role !== requiredRole) {
    return {
      canAccess: false,
      reason: `This route requires ${requiredRole} role`,
      requiredRole,
    };
  }

  return { canAccess: true };
};

/**
 * Get redirect path based on user role
 */
export const getRedirectPathForRole = (role: UserRole): string => {
  const dashboard = getDefaultDashboardForRole(role);
  return `/dashboard/${dashboard}`;
};

/**
 * Validate dashboard access
 */
export const validateDashboardAccess = (
  role: UserRole,
  dashboardId: DashboardType
): boolean => {
  const result = canRoleAccessDashboard(role, dashboardId);
  return result.canAccess;
};

/**
 * Get dashboard configuration by ID
 */
export const getDashboardConfig = (dashboardId: DashboardType): DashboardConfig | undefined => {
  return DASHBOARD_CONFIGS.find(d => d.id === dashboardId);
};

/**
 * Get dashboard configuration by route
 */
export const getDashboardConfigByRoute = (route: string): DashboardConfig | undefined => {
  return DASHBOARD_CONFIGS.find(d => d.route === route);
};

/**
 * Check if user has admin privileges
 */
export const isAdminRole = (role: UserRole): boolean => {
  return role === 'administrator' || role === 'super_admin';
};

/**
 * Check if user has enterprise privileges
 */
export const isEnterpriseRole = (role: UserRole): boolean => {
  return role === 'enterprise' || isAdminRole(role);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    donor: 'Donor',
    field_agent: 'Field Agent',
    administrator: 'Administrator',
    community: 'Community Manager',
    enterprise: 'Enterprise User',
    government: 'Government Official',
    defi: 'DeFi User',
    ngo: 'NGO Manager',
    super_admin: 'Super Administrator',
    producer: 'Regenerative Producer',
    investor: 'Impact Investor',
    institution: 'Public Institution',
    knowledge_builder: 'Knowledge Builder',
  };

  return roleNames[role] || role;
};

/**
 * Get role description
 */
export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    donor: 'Individual donors and supporters',
    field_agent: 'Field data collectors and monitors',
    administrator: 'Platform administrators with full access',
    community: 'Community managers and coordinators',
    enterprise: 'Enterprise customers and partners',
    government: 'Government agencies and officials',
    defi: 'DeFi users and token holders',
    ngo: 'Non-profit organizations',
    super_admin: 'Super administrators with full system access',
    producer: 'Regenerative land and ocean stewards',
    investor: 'Impact investors seeking verified projects',
    institution: 'Public institutions and government agencies',
    knowledge_builder: 'Researchers, builders, and educators',
  };

  return descriptions[role] || '';
};
