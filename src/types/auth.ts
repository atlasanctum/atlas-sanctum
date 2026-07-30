/**
 * Enhanced Authentication Types
 * 
 * Comprehensive type definitions for the enhanced authentication module
 * with demo login access to all dashboards.
 */

// User Roles
export type UserRole = 
  | 'donor'
  | 'field_agent'
  | 'administrator'
  | 'community'
  | 'enterprise'
  | 'government'
  | 'defi'
  | 'ngo'
  | 'super_admin'
  | 'producer'
  | 'investor'
  | 'institution'
  | 'knowledge_builder';

// Consent Option for ethical consent screen
export interface ConsentOption {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  checked?: boolean;
}

// Consent State for tracking user consents
export interface ConsentState {
  [key: string]: boolean | undefined;
}

// Authentication Data for storing auth method info
export interface AuthenticationData {
  method?: string;
  email?: string;
  phone?: string;
  provider?: string;
  [key: string]: unknown;
}

// Authentication Method configuration
export interface AuthenticationMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  isDefault?: boolean;
}

// Role-specific onboarding step
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'form' | 'info' | 'action';
}

// First Day Experience configuration
export interface FirstDayExperienceConfig {
  metric: string;
  action: string;
  story: string;
}

// Role-specific data configuration
export interface RoleSpecificData {
  role: UserRole;
  title: string;
  description: string;
  icon: string;
  steps: OnboardingStep[];
  firstDayExperience: FirstDayExperienceConfig;
}

// Dashboard Types
export type DashboardType = 
  | 'donor'
  | 'field-agent'
  | 'administrator'
  | 'community'
  | 'enterprise'
  | 'government'
  | 'defi'
  | 'ngo'
  | 'main';

// Permission Levels
export type PermissionLevel = 'read' | 'write' | 'admin' | 'owner';

// Auth Status
export type AuthStatus = 
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

// User Interface
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  tenantId?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLogin?: string;
  segment?: string;
  onboardingCompleted?: boolean;
  avatar?: string;
  organization?: string;
  permissions?: Permission[];
  dashboardAccess?: DashboardType[];
  createdAt?: string;
  lastLoginAt?: string;
}

// Tokens Interface
export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType?: string;
}

// Session Interface
export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  deviceInfo?: DeviceInfo;
  ipAddress?: string;
}

// Device Info
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  browser: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

// Permission Interface
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  level: PermissionLevel;
}

// Dashboard Configuration
export interface DashboardConfig {
  id: DashboardType;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  requiredRole?: UserRole;
  permissions?: Permission[];
  features?: string[];
}

// Demo User Configuration
export interface DemoUserConfig {
  id: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  dashboardAccess: DashboardType[];
  mockData?: Record<string, unknown>;
}

// Auth Error
export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Login Credentials
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Register Credentials
export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  organization?: string;
}

// Reset Password Credentials
export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
}

// MFA Setup Data
export interface MFASetupData {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

// Auth Event
export interface AuthEvent {
  type: 'login' | 'logout' | 'token_refresh' | 'permission_change' | 'role_change';
  userId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Access Check Result
export interface AccessCheckResult {
  canAccess: boolean;
  reason?: string;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
}

// Enhanced Auth Context Type
export interface EnhancedAuthContextType {
  // User State
  user: User | null;
  tokens: Tokens | null;
  session: Session | null;
  status: AuthStatus;
  loading: boolean;
  error: AuthError | null;

  // Demo Mode
  isDemoMode: boolean;
  demoUsers: DemoUserConfig[];
  currentDemoUser?: DemoUserConfig;

  // Dashboard Access
  availableDashboards: DashboardConfig[];
  currentDashboard?: DashboardType;

  // Authentication Methods
  signIn: (credentials: LoginCredentials) => Promise<{ error: AuthError | null }>;
  signUp: (credentials: RegisterCredentials) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<{ error: AuthError | null }>;

  // Demo Authentication
  demoSignIn: (demoUserId: string) => Promise<{ error: AuthError | null }>;
  demoSignInByRole: (role: UserRole) => Promise<{ error: AuthError | null }>;
  switchDemoUser: (demoUserId: string) => Promise<{ error: AuthError | null }>;
  exitDemoMode: () => Promise<void>;

  // Email Verification
  verifyEmail: (token: string) => Promise<{ error: AuthError | null }>;
  resendVerification: () => Promise<{ error: AuthError | null }>;

  // Password Reset
  forgotPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<{ error: AuthError | null }>;

  // MFA
  setupMFA: () => Promise<{ error: AuthError | null; data?: MFASetupData }>;
  verifyMFA: (code: string) => Promise<{ error: AuthError | null }>;
  disableMFA: () => Promise<{ error: AuthError | null }>;

  // Profile Management
  updateProfile: (data: Partial<User>) => Promise<{ error: AuthError | null }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: AuthError | null }>;

  // Dashboard Access
  canAccessDashboard: (dashboardId: DashboardType) => AccessCheckResult;
  switchDashboard: (dashboardId: DashboardType) => void;
  getAvailableDashboards: () => DashboardConfig[];

  // Permission Checks
  hasPermission: (permissionId: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;

  // Session Management
  getActiveSessions: () => Session[];
  revokeSession: (sessionId: string) => Promise<{ error: AuthError | null }>;
  revokeAllSessions: () => Promise<{ error: AuthError | null }>;

  // Auth Events
  getAuthEvents: () => AuthEvent[];
}

// Dashboard Routes Mapping
export const DASHBOARD_ROUTES: Record<DashboardType, string> = {
  donor: '/dashboard/donor',
  'field-agent': '/dashboard/field-agent',
  administrator: '/dashboard/administrator',
  community: '/dashboard/community',
  enterprise: '/dashboard/enterprise',
  government: '/dashboard/government',
  defi: '/dashboard/defi',
  ngo: '/dashboard/ngo',
  main: '/dashboard',
};

// Role to Dashboard Mapping
export const ROLE_TO_DASHBOARD: Record<UserRole, DashboardType> = {
  donor: 'donor',
  field_agent: 'field-agent',
  administrator: 'administrator',
  community: 'community',
  enterprise: 'enterprise',
  government: 'government',
  defi: 'defi',
  ngo: 'ngo',
  super_admin: 'administrator',
  producer: 'main',
  investor: 'donor',
  institution: 'government',
  knowledge_builder: 'main',
};

// Dashboard Configurations
export const DASHBOARD_CONFIGS: DashboardConfig[] = [
  {
    id: 'donor',
    name: 'Donor Dashboard',
    description: 'Track your donations, impact, and contribution history',
    icon: 'Users',
    route: '/dashboard/donor',
    color: 'from-emerald-500 to-emerald-600',
    requiredRole: 'donor',
    features: ['Donation Tracking', 'Impact Metrics', 'Portfolio Management', 'Reports'],
  },
  {
    id: 'field-agent',
    name: 'Field Agent Dashboard',
    description: 'Manage field data collection, project monitoring, and reporting',
    icon: 'Leaf',
    route: '/dashboard/field-agent',
    color: 'from-green-500 to-green-600',
    requiredRole: 'field_agent',
    features: ['Data Collection', 'Project Monitoring', 'Field Reports', 'GPS Tracking'],
  },
  {
    id: 'administrator',
    name: 'Administrator Dashboard',
    description: 'Platform administration, user management, and system settings',
    icon: 'Shield',
    route: '/dashboard/administrator',
    color: 'from-blue-500 to-blue-600',
    requiredRole: 'administrator',
    features: ['User Management', 'System Settings', 'Analytics', 'Audit Logs'],
  },
  {
    id: 'community',
    name: 'Community Dashboard',
    description: 'Community engagement, events, and collaboration tools',
    icon: 'Globe',
    route: '/dashboard/community',
    color: 'from-purple-500 to-purple-600',
    requiredRole: 'community',
    features: ['Community Events', 'Collaboration Tools', 'Forums', 'Resource Sharing'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Dashboard',
    description: 'Enterprise features, billing, and advanced analytics',
    icon: 'Building2',
    route: '/dashboard/enterprise',
    color: 'from-indigo-500 to-indigo-600',
    requiredRole: 'enterprise',
    features: ['Billing Management', 'API Access', 'Advanced Analytics', 'Team Management'],
  },
  {
    id: 'government',
    name: 'Government Dashboard',
    description: 'Government partnerships, compliance, and reporting',
    icon: 'Award',
    route: '/dashboard/government',
    color: 'from-amber-500 to-amber-600',
    requiredRole: 'government',
    features: ['Compliance Reports', 'Partnership Management', 'Government Analytics', 'Regulatory Tools'],
  },
  {
    id: 'defi',
    name: 'DeFi Dashboard',
    description: 'Decentralized finance, token management, and DeFi protocols',
    icon: 'TrendingUp',
    route: '/dashboard/defi',
    color: 'from-pink-500 to-pink-600',
    requiredRole: 'defi',
    features: ['Token Management', 'DeFi Protocols', 'Yield Farming', 'Staking'],
  },
  {
    id: 'ngo',
    name: 'NGO Dashboard',
    description: 'Non-profit organization management, grant tracking, and impact reporting',
    icon: 'Factory',
    route: '/dashboard/ngo',
    color: 'from-cyan-500 to-cyan-600',
    requiredRole: 'ngo',
    features: ['Grant Management', 'Impact Reporting', 'Donor Relations', 'Project Tracking'],
  },
];

// Demo Users Configuration
export const DEMO_USERS: DemoUserConfig[] = [
  {
    id: 'demo-donor',
    email: 'donor@demo.com',
    password: 'demo123',
    displayName: 'Demo Donor',
    role: 'donor',
    dashboardAccess: ['donor', 'main'],
    mockData: {
      totalDonated: 28000,
      totalImpact: 6875,
      projectsSupported: 5,
    },
  },
  {
    id: 'demo-field-agent',
    email: 'field-agent@demo.com',
    password: 'demo123',
    displayName: 'Demo Field Agent',
    role: 'field_agent',
    dashboardAccess: ['field-agent', 'main'],
    mockData: {
      projectsMonitored: 12,
      dataPointsCollected: 450,
      reportsSubmitted: 8,
    },
  },
  {
    id: 'demo-administrator',
    email: 'admin@demo.com',
    password: 'demo123',
    displayName: 'Demo Administrator',
    role: 'administrator',
    dashboardAccess: ['administrator', 'main', 'donor', 'field-agent', 'community', 'enterprise', 'government', 'defi', 'ngo'],
    mockData: {
      totalUsers: 1250,
      activeProjects: 45,
      systemHealth: 98,
    },
  },
  {
    id: 'demo-community',
    email: 'community@demo.com',
    password: 'demo123',
    displayName: 'Demo Community Manager',
    role: 'community',
    dashboardAccess: ['community', 'main'],
    mockData: {
      communityMembers: 850,
      eventsOrganized: 15,
      engagementRate: 78,
    },
  },
  {
    id: 'demo-enterprise',
    email: 'enterprise@demo.com',
    password: 'demo123',
    displayName: 'Demo Enterprise User',
    role: 'enterprise',
    dashboardAccess: ['enterprise', 'main'],
    mockData: {
      monthlySpend: 15000,
      apiCalls: 250000,
      teamMembers: 25,
    },
  },
  {
    id: 'demo-government',
    email: 'government@demo.com',
    password: 'demo123',
    displayName: 'Demo Government Official',
    role: 'government',
    dashboardAccess: ['government', 'main'],
    mockData: {
      complianceScore: 95,
      partnershipsActive: 8,
      reportsGenerated: 24,
    },
  },
  {
    id: 'demo-defi',
    email: 'defi@demo.com',
    password: 'demo123',
    displayName: 'Demo DeFi User',
    role: 'defi',
    dashboardAccess: ['defi', 'main'],
    mockData: {
      totalValueLocked: 50000,
      yieldEarned: 2500,
      tokensStaked: 1000,
    },
  },
  {
    id: 'demo-ngo',
    email: 'ngo@demo.com',
    password: 'demo123',
    displayName: 'Demo NGO Manager',
    role: 'ngo',
    dashboardAccess: ['ngo', 'main'],
    mockData: {
      grantsReceived: 75000,
      impactScore: 92,
      donorsActive: 150,
    },
  },
];
