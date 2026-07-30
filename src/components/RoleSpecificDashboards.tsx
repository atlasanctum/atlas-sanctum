import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Briefcase, Globe, BarChart3, TrendingUp, History,
  Target, DollarSign, Shield, Building, Sprout, Factory, 
  Leaf, Zap, Heart, Users, Lock, BookOpen, GraduationCap,
  Award, HelpCircle, Phone, ChevronDown, ChevronRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  description?: string;
  submenu?: MenuItem[];
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  features: string[];
}

export const RoleSpecificDashboards: React.FC = () => {
  const [activeRole, setActiveRole] = useState<string>('enterprise');
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const userRoles: UserRole[] = [
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Large-scale carbon programs and sustainability initiatives',
      primaryColor: 'blue',
      features: ['Bulk Credit Purchasing', 'Custom Reporting', 'API Integration', 'Dedicated Support']
    },
    {
      id: 'smb',
      name: 'Small & Medium Business',
      description: 'Accessible sustainability solutions for growing companies',
      primaryColor: 'green',
      features: ['Affordable Credits', 'Simple Dashboard', 'Compliance Tools', 'Educational Resources']
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      description: 'Regenerative farming and soil health optimization',
      primaryColor: 'amber',
      features: ['Soil Carbon Credits', 'Farm Monitoring', 'Biodiversity Tracking', 'Yield Optimization']
    },
    {
      id: 'investor',
      name: 'Impact Investor',
      description: 'Generate returns while creating environmental impact',
      primaryColor: 'purple',
      features: ['Portfolio Analytics', 'Risk Assessment', 'Impact Metrics', 'Market Intelligence']
    }
  ];

  const navigationStructure: MenuItem[] = [
    {
      id: 'core',
      label: 'CORE FEATURES',
      icon: Target,
      path: '',
      submenu: [
        { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/marketplace', description: 'Browse and purchase carbon credits' },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/portfolio', description: 'Track your carbon investments' },
        { id: 'bioregions', label: 'Bioregions', icon: Globe, path: '/bioregions', description: 'Explore geographic impact zones' },
        { id: 'measurements', label: 'Measurements', icon: BarChart3, path: '/measurements', description: 'Real-time environmental data' }
      ]
    },
    {
      id: 'analytics',
      label: 'ANALYTICS & INSIGHTS',
      icon: TrendingUp,
      path: '',
      submenu: [
        { id: 'valuation', label: 'Valuation Engine', icon: DollarSign, path: '/valuation', description: 'Credit pricing and analysis' },
        { id: 'transactions', label: 'Transactions', icon: History, path: '/transactions', description: 'Complete transaction history' }
      ]
    },
    {
      id: 'usecase',
      label: 'BY USE CASE',
      icon: Target,
      path: '',
      submenu: [
        { id: 'offsetting', label: 'Carbon Offsetting', icon: Leaf, path: '/offsetting', description: 'Neutralize your carbon footprint' },
        { id: 'investment', label: 'Impact Investment', icon: TrendingUp, path: '/investment', description: 'Generate returns while doing good' },
        { id: 'compliance', label: 'Regulatory Compliance', icon: Shield, path: '/compliance', description: 'Meet sustainability requirements' }
      ]
    },
    {
      id: 'industry',
      label: 'BY INDUSTRY',
      icon: Building,
      path: '',
      submenu: [
        { id: 'enterprise-solutions', label: 'Enterprise', icon: Building, path: '/enterprise', description: 'Large-scale carbon programs' },
        { id: 'smb-solutions', label: 'SMB', icon: Factory, path: '/smb', description: 'Accessible sustainability solutions' },
        { id: 'agriculture-solutions', label: 'Agriculture', icon: Sprout, path: '/agriculture', description: 'Regenerative farming credits' }
      ]
    },
    {
      id: 'environmental',
      label: 'ENVIRONMENTAL',
      icon: Leaf,
      path: '',
      submenu: [
        { id: 'regenerative-agriculture', label: 'Regenerative Agriculture', icon: Sprout, path: '/regenerative-agriculture', description: 'Soil health and biodiversity' },
        { id: 'renewable-energy', label: 'Renewable Energy', icon: Zap, path: '/renewable-energy', description: 'Clean energy transition projects' },
        { id: 'ecosystem-health', label: 'Ecosystem Health', icon: Heart, path: '/health', description: 'Human and planet wellness' }
      ]
    },
    {
      id: 'governance',
      label: 'GOVERNANCE',
      icon: Users,
      path: '',
      submenu: [
        { id: 'community-governance', label: 'Community Governance', icon: Users, path: '/governance', description: 'Democratic decision-making' },
        { id: 'security', label: 'Security & Trust', icon: Lock, path: '/security', description: 'Blockchain verification' },
        { id: 'adoption', label: 'Global Adoption', icon: Globe, path: '/adoption', description: 'Worldwide scaling' }
      ]
    },
    {
      id: 'learn',
      label: 'LEARN',
      icon: BookOpen,
      path: '',
      submenu: [
        { id: 'documentation', label: 'Documentation', icon: BookOpen, path: '/docs', description: 'Guides and API reference' },
        { id: 'education', label: 'Education Hub', icon: GraduationCap, path: '/education', description: 'Carbon market education' },
        { id: 'certifications', label: 'Certifications', icon: Award, path: '/certifications', description: 'Standards and methodologies' }
      ]
    },
    {
      id: 'support',
      label: 'SUPPORT',
      icon: HelpCircle,
      path: '',
      submenu: [
        { id: 'help', label: 'Help Center', icon: HelpCircle, path: '/help', description: 'FAQs and troubleshooting' },
        { id: 'contact', label: 'Contact Sales', icon: Phone, path: '/contact', description: 'Enterprise inquiries' }
      ]
    }
  ];

  const toggleMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const RoleCard: React.FC<{ role: UserRole; isActive: boolean }> = ({ role, isActive }) => {
    const colorClasses = {
      blue: 'border-blue-500/20 bg-blue-500/5 text-blue-500',
      green: 'border-green-500/20 bg-green-500/5 text-green-500',
      amber: 'border-amber-500/20 bg-amber-500/5 text-amber-500',
      purple: 'border-purple-500/20 bg-purple-500/5 text-purple-500'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg border cursor-pointer transition-all ${
          isActive 
            ? `${colorClasses[role.primaryColor as keyof typeof colorClasses]} shadow-glow` 
            : 'border-border/50 bg-card hover:border-primary/20'
        }`}
        onClick={() => setActiveRole(role.id)}
      >
        <h3 className="text-lg font-semibold text-foreground mb-2">{role.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
        <div className="space-y-2">
          {role.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const NavigationMenu: React.FC<{ menu: MenuItem; level: number }> = ({ menu, level }) => {
    const isExpanded = expandedMenus.has(menu.id);
    const Icon = menu.icon;

    return (
      <div className="space-y-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
            level === 0 
              ? 'bg-muted/50 text-muted-foreground font-medium text-sm' 
              : 'hover:bg-muted/30 text-foreground'
          }`}
          onClick={() => menu.submenu ? toggleMenu(menu.id) : null}
        >
          <div className="flex items-center space-x-3">
            {level > 0 && <Icon className="w-4 h-4" />}
            <span className={level === 0 ? 'text-xs font-bold tracking-wider' : ''}>{menu.label}</span>
          </div>
          {menu.submenu && (
            isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          )}
        </div>

        <AnimatePresence>
          {isExpanded && menu.submenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-4 space-y-1"
            >
              {menu.submenu.map((submenu) => (
                <div key={submenu.id} className="p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-all">
                  <div className="flex items-center space-x-3 mb-1">
                    <submenu.icon className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{submenu.label}</span>
                  </div>
                  {submenu.description && (
                    <p className="text-xs text-muted-foreground ml-7">{submenu.description}</p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const activeRoleData = userRoles.find(role => role.id === activeRole);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Role-Specific Dashboards</h1>
              <p className="text-muted-foreground mt-1">Tailored experiences for every user type</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">47</div>
                <div className="text-xs text-muted-foreground">Features</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Role Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Select Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRoles.map((role) => (
              <RoleCard key={role.id} role={role} isActive={activeRole === role.id} />
            ))}
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border/50 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                {activeRoleData?.name} Dashboard
              </h3>
              <div className="space-y-4">
                {navigationStructure.map((menu) => (
                  <NavigationMenu key={menu.id} menu={menu} level={0} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Role Overview */}
              <div className="bg-card border border-border/50 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {activeRoleData?.name} Overview
                </h2>
                <p className="text-muted-foreground mb-6">{activeRoleData?.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Key Features</h3>
                    {activeRoleData?.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                        Get Started
                      </button>
                      <button className="w-full p-3 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors">
                        View Documentation
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {navigationStructure.slice(0, 4).map((category) => (
                  <div key={category.id} className="bg-card border border-border/50 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <category.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{category.label}</h3>
                    </div>
                    <div className="space-y-3">
                      {category.submenu?.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/30 cursor-pointer">
                          <item.icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-foreground">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Implementation Status */}
              <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Implementation Roadmap</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">✓</div>
                    <h3 className="font-semibold text-foreground mb-2">Core Features</h3>
                    <p className="text-sm text-muted-foreground">Marketplace, Portfolio, Analytics</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">⚡</div>
                    <h3 className="font-semibold text-foreground mb-2">Advanced Features</h3>
                    <p className="text-sm text-muted-foreground">AI Analytics, Quantum Modeling</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500 mb-2">🚀</div>
                    <h3 className="font-semibold text-foreground mb-2">Future Innovations</h3>
                    <p className="text-sm text-muted-foreground">Interplanetary, Consciousness Interface</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSpecificDashboards;