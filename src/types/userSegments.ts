/**
 * User Segment Types
 * Defines all user segments based on pricing structure
 */

export type UserSegment = 
  | 'producers'
  | 'communities'
  | 'buyers'
  | 'enterprises'
  | 'governments'
  | 'investors'
  | 'defi'
  | 'ngos';

export type BusinessModelSegment =
  | 'infrastructure'
  | 'multi-sided-market'
  | 'outcome-based'
  | 'enterprise-intelligence'
  | 'risk-reduction'
  | 'capital-markets'
  | 'commons-stewardship'
  | 'intellectual-infrastructure'
  | 'cultural-institution';

export interface UserSegmentConfig {
  id: UserSegment;
  name: string;
  description: string;
  pricingModel: string;
  priceRange: string;
  onboardingSteps: OnboardingStep[];
  defaultRoute: string;
  features: string[];
  icon: string;
  color: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component?: string;
  required: boolean;
}

export const USER_SEGMENTS: Record<UserSegment, UserSegmentConfig> = {
  producers: {
    id: 'producers',
    name: 'Regenerative Producers',
    description: 'Farmers, fishers, land & ocean stewards',
    pricingModel: 'Free / Subsidized',
    priceRange: '$0',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'profile', title: 'Complete Your Profile', description: 'Tell us about your regenerative work', required: true },
      { id: 'location', title: 'Location Setup', description: 'Set your bioregion and project location', required: true },
      { id: 'verification', title: 'Identity Verification', description: 'Verify your identity for impact tracking', required: true },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to use the platform', required: false },
    ],
    defaultRoute: '/marketplace',
    features: [
      'Mobile access',
      'Onboarding support',
      'AI-assisted regeneration guidance',
      'Impact verification',
      'Access to buyers & finance'
    ],
    icon: 'TreePine',
    color: 'text-green-500',
  },
  communities: {
    id: 'communities',
    name: 'Local Communities & Youth Nodes',
    description: 'Schools, labs, cooperatives',
    pricingModel: 'Free / Grant-backed',
    priceRange: '$0',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'organization', title: 'Organization Details', description: 'Tell us about your community organization', required: true },
      { id: 'education', title: 'Education Setup', description: 'Configure your educational programs', required: true },
      { id: 'dao', title: 'DAO Participation', description: 'Set up your governance participation', required: false },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to use the platform', required: false },
    ],
    defaultRoute: '/community',
    features: [
      'Education access',
      'Impact storytelling tools',
      'Ethical AI library',
      'Participation in DAO'
    ],
    icon: 'GraduationCap',
    color: 'text-blue-500',
  },
  buyers: {
    id: 'buyers',
    name: 'Impact Buyers',
    description: 'Corporates, cities, institutions',
    pricingModel: 'Transaction Fee',
    priceRange: '1–3% per verified transaction',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'company', title: 'Company Information', description: 'Provide your company details', required: true },
      { id: 'goals', title: 'Impact Goals', description: 'Set your sustainability and impact goals', required: true },
      { id: 'payment', title: 'Payment Setup', description: 'Configure payment methods', required: true },
      { id: 'verification', title: 'Business Verification', description: 'Verify your business credentials', required: true },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to purchase and track credits', required: false },
    ],
    defaultRoute: '/marketplace',
    features: [
      'Verified carbon, nature, health & restoration credits',
      'Audit-ready reporting',
      'Reputational protection'
    ],
    icon: 'Briefcase',
    color: 'text-purple-500',
  },
  enterprises: {
    id: 'enterprises',
    name: 'Enterprises & Multinationals',
    description: 'Large organizations with complex needs',
    pricingModel: 'Annual Subscription',
    priceRange: '$100K – $1M+ / year',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'company', title: 'Company Information', description: 'Provide your company details', required: true },
      { id: 'supply-chain', title: 'Supply Chain Setup', description: 'Map your supply chain for regeneration tracking', required: true },
      { id: 'goals', title: 'ESG & Impact Goals', description: 'Set your ESG and impact goals', required: true },
      { id: 'team', title: 'Team Setup', description: 'Invite team members and set permissions', required: true },
      { id: 'integrations', title: 'System Integrations', description: 'Connect with your existing systems', required: false },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to use enterprise features', required: false },
    ],
    defaultRoute: '/marketplace',
    features: [
      'Supply-chain regeneration dashboards',
      'ESG & compliance reporting',
      'Forecasting & scenario modeling'
    ],
    icon: 'Building2',
    color: 'text-orange-500',
  },
  governments: {
    id: 'governments',
    name: 'Governments & Public Institutions',
    description: 'National / regional authorities',
    pricingModel: 'Multi-Year Contract',
    priceRange: '$250K – $5M+ per contract',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'institution', title: 'Institution Details', description: 'Provide government institution details', required: true },
      { id: 'region', title: 'Regional Configuration', description: 'Set up your national/regional dashboard', required: true },
      { id: 'policies', title: 'Policy Integration', description: 'Integrate with existing policies and frameworks', required: true },
      { id: 'funding', title: 'Funding Verification', description: 'Set up outcome-based funding verification', required: true },
      { id: 'team', title: 'Team Setup', description: 'Invite government officials and set permissions', required: true },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to use government features', required: false },
    ],
    defaultRoute: '/outreach',
    features: [
      'National/regional regenerative dashboards',
      'Outcome-based funding verification',
      'Policy simulation'
    ],
    icon: 'Building2',
    color: 'text-red-500',
  },
  investors: {
    id: 'investors',
    name: 'Impact Investors & Funds',
    description: 'Financial institutions and fund managers',
    pricingModel: 'Origination + Performance Fees',
    priceRange: '1–2% origination + success-based upside',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'firm', title: 'Firm Information', description: 'Provide your investment firm details', required: true },
      { id: 'strategy', title: 'Investment Strategy', description: 'Define your impact investment strategy', required: true },
      { id: 'criteria', title: 'Investment Criteria', description: 'Set your project selection criteria', required: true },
      { id: 'verification', title: 'Accreditation Verification', description: 'Verify your investor accreditation', required: true },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to discover and invest in projects', required: false },
    ],
    defaultRoute: '/regenerative-finance',
    features: [
      'Deal flow',
      'Risk-scored regenerative projects',
      'Performance-linked instruments'
    ],
    icon: 'TrendingUp',
    color: 'text-teal-500',
  },
  defi: {
    id: 'defi',
    name: 'DeFi & Capital Market Participants',
    description: 'Tokenized asset and smart contract users',
    pricingModel: 'Protocol & Usage Fees',
    priceRange: 'Low per-transaction; high volume',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'wallet', title: 'Wallet Connection', description: 'Connect your crypto wallet', required: true },
      { id: 'kyc', title: 'KYC Verification', description: 'Complete KYC verification', required: true },
      { id: 'protocol', title: 'Protocol Setup', description: 'Configure protocol access', required: true },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to use DeFi features', required: false },
    ],
    defaultRoute: '/defi',
    features: [
      'Tokenized regenerative assets',
      'Oracle data',
      'Smart contract execution'
    ],
    icon: 'Network',
    color: 'text-indigo-500',
  },
  ngos: {
    id: 'ngos',
    name: 'NGOs & Research Partners',
    description: 'Nonprofits and academic institutions',
    pricingModel: 'Strategic / Sponsored',
    priceRange: 'Often $0 or cost-recovery',
    onboardingSteps: [
      { id: 'welcome', title: 'Welcome to Atlas Sanctum', description: 'Learn about our platform', required: true },
      { id: 'organization', title: 'Organization Details', description: 'Provide your NGO or institution details', required: true },
      { id: 'mission', title: 'Mission Alignment', description: 'Describe your mission and goals', required: true },
      { id: 'research', title: 'Research Interests', description: 'Specify your research areas', required: true },
      { id: 'tutorial', title: 'Platform Tutorial', description: 'Learn how to access data and tools', required: false },
    ],
    defaultRoute: '/community',
    features: [
      'Data access',
      'Co-branded pilots',
      'Ethical AI tools'
    ],
    icon: 'Heart',
    color: 'text-pink-500',
  },
};

export const getSegmentById = (id: string): UserSegmentConfig | undefined => {
  return USER_SEGMENTS[id as UserSegment];
};

export const getSegmentByRoute = (route: string): UserSegment | null => {
  for (const [segmentId, config] of Object.entries(USER_SEGMENTS)) {
    if (config.defaultRoute === route) {
      return segmentId as UserSegment;
    }
  }
  return null;
};
