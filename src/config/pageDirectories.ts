/**
 * Atlas Sanctum - Improved Page Structure & Routing
 * Organized by Platform, Solutions, Impact, Resources
 */

export const pageDirectories = {
  // ============================================================================
  // PLATFORM - Core Features & Analytics
  // ============================================================================
  platform: {
    core: {
      marketplace: '/marketplace',
      portfolio: '/portfolio', 
      bioregions: '/bioregions',
      measurements: '/measurements'
    },
    analytics: {
      valuation: '/valuation',
      transactions: '/transactions',
      dashboard: '/dashboard'
    },
    advanced: {
      architecture: '/architecture',
      dashboards: '/dashboards'
    }
  },

  // ============================================================================
  // SOLUTIONS - Use Cases & Industries
  // ============================================================================
  solutions: {
    useCase: {
      offsetting: '/solutions/offsetting',
      investment: '/solutions/investment', 
      compliance: '/solutions/compliance'
    },
    industry: {
      enterprise: '/solutions/enterprise',
      smb: '/solutions/smb',
      agriculture: '/solutions/agriculture'
    }
  },

  // ============================================================================
  // IMPACT - Environmental & Governance
  // ============================================================================
  impact: {
    environmental: {
      regenerativeAgriculture: '/regenerative-agriculture',
      renewableEnergy: '/impact/renewable-energy',
      ecosystemHealth: '/health'
    },
    governance: {
      communityGovernance: '/governance',
      security: '/security',
      adoption: '/adoption'
    }
  },

  // ============================================================================
  // RESOURCES - Learn & Support
  // ============================================================================
  resources: {
    learn: {
      documentation: '/docs',
      education: '/resources/education',
      certifications: '/resources/certifications'
    },
    support: {
      helpCenter: '/help',
      contact: '/contact'
    }
  }
};

// Route configuration for improved organization
export const routeConfig = [
  // Platform Routes
  { path: '/marketplace', component: 'Marketplace', category: 'platform' },
  { path: '/portfolio', component: 'Portfolio', category: 'platform' },
  { path: '/bioregions', component: 'Bioregions', category: 'platform' },
  { path: '/measurements', component: 'Measurements', category: 'platform' },
  { path: '/valuation', component: 'Valuation', category: 'platform' },
  { path: '/transactions', component: 'Transactions', category: 'platform' },
  { path: '/dashboard', component: 'Dashboard', category: 'platform' },
  { path: '/architecture', component: 'CivilizationalArchitectureDashboard', category: 'platform' },
  { path: '/dashboards', component: 'RoleSpecificDashboards', category: 'platform' },

  // Solutions Routes
  { path: '/solutions/offsetting', component: 'CarbonOffsetting', category: 'solutions' },
  { path: '/solutions/investment', component: 'ImpactInvestment', category: 'solutions' },
  { path: '/solutions/compliance', component: 'RegulatoryCompliance', category: 'solutions' },
  { path: '/solutions/enterprise', component: 'EnterpriseSolutions', category: 'solutions' },
  { path: '/solutions/smb', component: 'SMBSolutions', category: 'solutions' },
  { path: '/solutions/agriculture', component: 'AgricultureSolutions', category: 'solutions' },

  // Impact Routes
  { path: '/regenerative-agriculture', component: 'RegenerativeAgriculture', category: 'impact' },
  { path: '/impact/renewable-energy', component: 'RenewableEnergy', category: 'impact' },
  { path: '/health', component: 'Health', category: 'impact' },
  { path: '/governance', component: 'Governance', category: 'impact' },
  { path: '/security', component: 'Security', category: 'impact' },
  { path: '/adoption', component: 'Adoption', category: 'impact' },

  // Resources Routes
  { path: '/docs', component: 'Documentation', category: 'resources' },
  { path: '/resources/education', component: 'EducationHub', category: 'resources' },
  { path: '/resources/certifications', component: 'Certifications', category: 'resources' },
  { path: '/help', component: 'HelpCenter', category: 'resources' },
  { path: '/contact', component: 'Contact', category: 'resources' }
];

export default pageDirectories;