import type { User, UserRole, ConsentOption, ConsentState, AuthenticationMethod, RoleSpecificData } from "@/types/auth";

// Role-specific authentication methods
export const getAuthenticationMethods = (role: UserRole): AuthenticationMethod[] => {
  const baseMethods: AuthenticationMethod[] = [
    {
      id: "sms",
      name: "Phone Number",
      icon: "📱",
      description: "Get a login code via SMS",
      isDefault: role === 'producer'
    },
    {
      id: "email-passkey",
      name: "Email + Passkey",
      icon: "📧",
      description: "Secure login with passkey",
      isDefault: role === 'investor' || role === 'knowledge_builder'
    },
    {
      id: "wallet",
      name: "Wallet Login",
      icon: "🪪",
      description: "Login with Web3 wallet",
      isDefault: false
    }
  ];

  if (role === 'institution') {
    baseMethods.push({
      id: "sso",
      name: "Institutional SSO",
      icon: "🏛️",
      description: "Single Sign-On",
      isDefault: true
    });
  }

  return baseMethods;
};

// Consent options for ethical data collection
export const getConsentOptions = (role: UserRole): ConsentOption[] => {
  const baseOptions: ConsentOption[] = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Share your name and contact information to use the platform",
      isRequired: true
    },
    {
      id: "usage",
      title: "Usage Analytics",
      description: "Help us improve by sharing how you use the platform",
      isRequired: false
    },
    {
      id: "impact",
      title: "Impact Data",
      description: "Share anonymized impact data to contribute to research",
      isRequired: false
    }
  ];

  if (role === 'producer') {
    baseOptions.push({
      id: "location",
      title: "Location Data",
      description: "Share location to find relevant regeneration opportunities",
      isRequired: false
    });
  }

  if (role === 'investor') {
    baseOptions.push({
      id: "investment-profile",
      title: "Investment Profile",
      description: "Share investment preferences to find suitable opportunities",
      isRequired: false
    });
  }

  return baseOptions;
};

// Role-specific onboarding data
export const getRoleSpecificData = (role: UserRole): RoleSpecificData | undefined => {
  const roleData: Partial<Record<UserRole, RoleSpecificData>> = {
    producer: {
      role: 'producer',
      title: "Regenerative Producer",
      description: "Join a community of land and ocean stewards",
      icon: "🌱",
      steps: [
        { id: "where-care", title: "Where do you care for life?", description: "Select your primary environment", type: 'form' },
        { id: "proof-of-place", title: "Proof of Place", description: "Verify your connection to the land or sea", type: 'form' },
        { id: "immediate-value", title: "Immediate Value", description: "See the potential benefits", type: 'info' }
      ],
      firstDayExperience: { metric: "Your soil could recover 18% organic matter in 3 years.", action: "Explore nearby regeneration opportunities", story: "Meet Maria, who increased her farm's yield by 25% using regenerative practices" }
    },
    investor: {
      role: 'investor',
      title: "Impact Investor",
      description: "Invest in regenerative impact that matters",
      icon: "💰",
      steps: [
        { id: "investment-intent", title: "Investment Intent", description: "What impact do you want to create?", type: 'form' },
        { id: "risk-profile", title: "Risk & Values Profile", description: "What are your investment preferences?", type: 'form' },
        { id: "transparency", title: "Transparency Preview", description: "See how impact is verified", type: 'info' }
      ],
      firstDayExperience: { metric: "This mangrove project protects 12,000 lives from flooding.", action: "View verified regeneration projects", story: "See how investors are creating lasting impact" }
    },
    institution: {
      role: 'institution',
      title: "Public Institution",
      description: "Shape policy and governance",
      icon: "🏛️",
      steps: [
        { id: "authority", title: "Authority Verification", description: "Verify your institutional identity", type: 'form' },
        { id: "jurisdiction", title: "Jurisdiction Setup", description: "Define your area of responsibility", type: 'form' },
        { id: "governance", title: "Governance Mode", description: "Choose your role in the ecosystem", type: 'form' }
      ],
      firstDayExperience: { metric: "Your jurisdiction has 45 active regeneration projects.", action: "View regional impact data", story: "See how policies are driving regeneration" }
    },
    knowledge_builder: {
      role: 'knowledge_builder',
      title: "Knowledge Builder",
      description: "Research, teach, and build solutions",
      icon: "🧪",
      steps: [
        { id: "purpose", title: "Your Purpose", description: "What brings you to Atlas Sanctum?", type: 'form' },
        { id: "access", title: "Access Level", description: "Select your research focus", type: 'form' },
        { id: "sandbox", title: "Sandbox Access", description: "Get access to tools and data", type: 'action' }
      ],
      firstDayExperience: { metric: "Our ethical AI library has 150+ validated models.", action: "Explore AI research tools", story: "See how researchers are advancing regeneration" }
    },
    donor: {
      role: 'donor',
      title: "Donor",
      description: "Support regenerative projects with your contributions",
      icon: "❤️",
      steps: [
        { id: "giving-goals", title: "Giving Goals", description: "What impact do you want to make?", type: 'form' },
        { id: "preferences", title: "Preferences", description: "Set your donation preferences", type: 'form' },
        { id: "welcome", title: "Welcome", description: "Get started with your first donation", type: 'info' }
      ],
      firstDayExperience: { metric: "Your donations can offset 500 tons of CO2.", action: "Browse donation opportunities", story: "See how donors are making a difference" }
    },
    field_agent: {
      role: 'field_agent',
      title: "Field Agent",
      description: "Collect data and monitor regeneration on the ground",
      icon: "🌍",
      steps: [
        { id: "training", title: "Training Overview", description: "Learn about field data collection", type: 'info' },
        { id: "equipment", title: "Equipment Setup", description: "Configure your monitoring tools", type: 'form' },
        { id: "assignment", title: "First Assignment", description: "Get your first monitoring task", type: 'action' }
      ],
      firstDayExperience: { metric: "12 projects in your region need monitoring.", action: "View assigned projects", story: "Meet agents making a difference on the ground" }
    },
    administrator: {
      role: 'administrator',
      title: "Administrator",
      description: "Manage platform operations and users",
      icon: "⚙️",
      steps: [
        { id: "overview", title: "Platform Overview", description: "Understand admin capabilities", type: 'info' },
        { id: "settings", title: "Initial Settings", description: "Configure platform settings", type: 'form' },
        { id: "dashboard", title: "Dashboard Tour", description: "Explore the admin dashboard", type: 'info' }
      ],
      firstDayExperience: { metric: "15,000 users across 45 countries.", action: "View platform analytics", story: "See how the platform is growing" }
    },
    community: {
      role: 'community',
      title: "Community Manager",
      description: "Build and engage regenerative communities",
      icon: "👥",
      steps: [
        { id: "community-goals", title: "Community Goals", description: "Define your community objectives", type: 'form' },
        { id: "engagement", title: "Engagement Tools", description: "Learn about community features", type: 'info' },
        { id: "launch", title: "Launch Program", description: "Start your first community program", type: 'action' }
      ],
      firstDayExperience: { metric: "850 community members ready to engage.", action: "View community programs", story: "See successful community initiatives" }
    },
    enterprise: {
      role: 'enterprise',
      title: "Enterprise User",
      description: "Access enterprise-grade features and analytics",
      icon: "🏢",
      steps: [
        { id: "business-needs", title: "Business Needs", description: "Tell us about your organization", type: 'form' },
        { id: "integration", title: "Integration Setup", description: "Connect your business systems", type: 'form' },
        { id: "team", title: "Team Setup", description: "Invite your team members", type: 'action' }
      ],
      firstDayExperience: { metric: "$15M in carbon offsets available.", action: "Explore enterprise solutions", story: "See how enterprises are scaling impact" }
    },
    government: {
      role: 'government',
      title: "Government Official",
      description: "Access government partnerships and compliance tools",
      icon: "🏛️",
      steps: [
        { id: "verification", title: "Official Verification", description: "Verify your government credentials", type: 'form' },
        { id: "compliance", title: "Compliance Overview", description: "Learn about reporting requirements", type: 'info' },
        { id: "regional", title: "Regional Dashboard", description: "Access your regional data", type: 'action' }
      ],
      firstDayExperience: { metric: "45 active projects in your jurisdiction.", action: "View compliance reports", story: "See how governments are driving change" }
    },
    defi: {
      role: 'defi',
      title: "DeFi User",
      description: "Access tokenized carbon credits and DeFi protocols",
      icon: "🔗",
      steps: [
        { id: "wallet", title: "Wallet Connection", description: "Connect your Web3 wallet", type: 'form' },
        { id: "tokens", title: "Token Overview", description: "Learn about available tokens", type: 'info' },
        { id: "protocols", title: "DeFi Protocols", description: "Explore yield opportunities", type: 'action' }
      ],
      firstDayExperience: { metric: "$50K TVL in carbon pools.", action: "Explore DeFi opportunities", story: "See how DeFi is funding regeneration" }
    },
    ngo: {
      role: 'ngo',
      title: "NGO Manager",
      description: "Manage grants, partnerships, and impact reporting",
      icon: "🤝",
      steps: [
        { id: "org-profile", title: "Organization Profile", description: "Set up your NGO profile", type: 'form' },
        { id: "grants", title: "Grant Tracking", description: "Learn about grant management", type: 'info' },
        { id: "impact", title: "Impact Reporting", description: "Set up impact metrics", type: 'form' }
      ],
      firstDayExperience: { metric: "$75K in grants available.", action: "View grant opportunities", story: "See successful NGO partnerships" }
    },
    super_admin: {
      role: 'super_admin',
      title: "Super Administrator",
      description: "Full platform access and system configuration",
      icon: "👑",
      steps: [
        { id: "system", title: "System Overview", description: "Full platform capabilities", type: 'info' },
        { id: "security", title: "Security Settings", description: "Configure security policies", type: 'form' },
        { id: "access", title: "Access Control", description: "Manage all access levels", type: 'action' }
      ],
      firstDayExperience: { metric: "Full platform control enabled.", action: "Access admin controls", story: "Manage the entire ecosystem" }
    }
  };

  return roleData[role];
};

// Helper to create temporary user for offline use
export const createTemporaryUser = (role: UserRole): Partial<User> => {
  return {
    id: `temp-${Date.now()}`,
    role,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
};

// Validate consent state
export const validateConsent = (consent: ConsentState, options: ConsentOption[]): boolean => {
  const requiredOptions = options.filter(opt => opt.isRequired);
  return requiredOptions.every(opt => consent[opt.id]);
};
