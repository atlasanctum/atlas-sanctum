// @ts-nocheck
import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, LogIn, ShoppingBag, Briefcase, LayoutDashboard, Crown, Award, Zap, Shield, TrendingUp, Globe, Heart, Network, Grid3X3, Calculator, Users, Trophy, Settings, FileText, BarChart3, Cog, Factory, Sprout, BookOpen, Building2, Zap as Lightning, TreePine, GraduationCap, CreditCard, Receipt, Wallet, Award as Certificate, ChevronDown, Puzzle, Smartphone, Bot, Layers, Map, FlaskConical, Lightbulb, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Navigation = () => {
  const { user } = useSupabaseAuth();
  const { isAdmin } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Check if user has completed onboarding
  const hasCompletedOnboarding = (user as any)?.onboardingCompleted || false;

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const closeDropdown = () => setOpenDropdown(null);

  const navLinks = [
    { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
    { name: "Measurements", href: "/measurements", icon: LayoutDashboard },
    { name: "Bioregions", href: "/bioregions", icon: Briefcase },
    { name: "Regeneration", href: "/regenerative-agriculture", icon: Award },
    { name: "Valuation", href: "/valuation", icon: TrendingUp },
    { name: "Governance", href: "/governance", icon: Crown },
    { name: "Health", href: "/health", icon: Heart },
    { name: "Outreach", href: "/outreach", icon: Globe },
    { name: "Security", href: "/security", icon: Shield },
    { name: "Adoption", href: "/adoption", icon: Zap },
    { name: "Architecture", href: "/architecture", icon: Network },
    { name: "Dashboards", href: "/dashboards", icon: Grid3X3 },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { 
      name: "Analytics & Insights", 
      href: "#", 
      icon: TrendingUp,
      children: [
        { name: "Careers", href: "/careers", icon: Users },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { name: "Calculator", href: "/calculator", icon: Calculator },
        { name: "Reports & Analytics", href: "/reports-analytics", icon: BarChart3 },
      ]
    },
    { 
      name: "Solutions", 
      href: "#", 
      icon: Factory,
      children: [
        { name: "Carbon Offsetting", href: "/carbon-offsetting", icon: TreePine },
        { name: "Impact Investment", href: "/impact-investment", icon: TrendingUp },
        { name: "Regulatory Compliance", href: "/regulatory-compliance", icon: Shield },
        { name: "Enterprise Solutions", href: "/enterprise-solutions", icon: Building2 },
        { name: "SMB Solutions", href: "/smb-solutions", icon: Briefcase },
        { name: "Agriculture Solutions", href: "/agriculture-solutions", icon: Sprout },
        { name: "Renewable Energy", href: "/renewable-energy", icon: Lightning },
      ]
    },
    {
      name: "Intelligence",
      href: "#",
      icon: Bot,
      children: [
        { name: "Knowledge Graph", href: "/knowledge-graph", icon: Network },
        { name: "Satellite Integration", href: "/satellite-integration", icon: Map },
        { name: "Predictive Analytics", href: "/predictive-analytics", icon: TrendingUp },
        { name: "Multi-Agent AI", href: "/multi-agent-intelligence", icon: Bot },
        { name: "Digital Twins", href: "/digital-twins", icon: Layers },
        { name: "Simulation Engine", href: "/simulation-engine", icon: FlaskConical },
        { name: "Decision Intelligence", href: "/decision-intelligence", icon: Lightbulb },
      ]
    },
    {
      name: "Ecosystem",
      href: "#",
      icon: Globe,
      children: [
        { name: "Global Marketplace", href: "/global-marketplace", icon: ShoppingBag },
        { name: "Open Research", href: "/open-research", icon: BookOpen },
        { name: "Community Ecosystem", href: "/community-ecosystem", icon: Users },
        { name: "Developer SDK", href: "/developer-sdk", icon: Code2 },
        { name: "Plugin Marketplace", href: "/plugin-marketplace", icon: Puzzle },
        { name: "Public APIs", href: "/public-apis", icon: Zap },
        { name: "Mobile App", href: "/mobile-app", icon: Smartphone },
      ]
    },
    {
      name: "Resources",
      href: "#",
      icon: BookOpen,
      children: [
        { name: "Roadmap", href: "/roadmap", icon: TrendingUp },
        { name: "Education Hub", href: "/education-hub", icon: GraduationCap },
        { name: "Certifications", href: "/certifications", icon: Certificate },
        { name: "Privacy Policy", href: "/privacy-policy", icon: Shield },
        { name: "Terms of Service", href: "/terms-of-service", icon: FileText },
      ]
    },
    { 
      name: "Billing", 
      href: "#", 
      icon: CreditCard,
      children: [
        { name: "Billing Dashboard", href: "/billing", icon: CreditCard },
        { name: "Invoices", href: "/invoices", icon: Receipt },
        { name: "Payment Methods", href: "/payment-methods", icon: Wallet },
      ]
    },
  ];

  // Admin link - only visible to admin users
  const adminLink = {
    name: "Command Center",
    href: "/admin",
    icon: Settings,
    adminOnly: true
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Enterprise Innovations */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 min-w-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-9 sm:w-10 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-ocean flex items-center justify-center shadow-glow flex-shrink-0">
              <Leaf className="w-4 sm:w-5 h-4 sm:h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-1 min-w-0">
                <span className="font-display text-base sm:text-xl font-semibold text-foreground truncate">
                  Atlas <span className="text-gradient hidden xs:inline">Sanctum</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 flex-wrap">
                <Badge variant="secondary" className="h-5 gap-1 text-xs px-1.5 sm:px-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 whitespace-nowrap">
                  <Award className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span className="hidden sm:inline">Enterprise</span>
                </Badge>
                <Badge variant="secondary" className="h-5 gap-1 text-xs px-1.5 sm:px-2 bg-blue-500/10 text-blue-600 border-blue-500/20 whitespace-nowrap">
                  <Shield className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span className="hidden sm:inline">Verified</span>
                </Badge>
                <Badge variant="secondary" className="h-5 gap-1 text-xs px-1.5 sm:px-2 bg-amber-500/10 text-amber-600 border-amber-500/20 whitespace-nowrap">
                  <Zap className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span className="hidden sm:inline">Innovative</span>
                </Badge>
              </div>
            </div>
          </motion.div>

            {/* Desktop Navigation */}
            <motion.nav
              className="hidden md:flex items-center gap-6 lg:gap-8 overflow-x-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                if (link.children) {
                  const isDropdownOpen = openDropdown === link.name;
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      ref={el => { dropdownRefs.current[link.name] = el; }}
                    >
                      <button
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1 transition-colors duration-300 font-medium whitespace-nowrap hover:bg-muted/50"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                        aria-label={link.name}
                        onClick={() => toggleDropdown(link.name)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') closeDropdown();
                        }}
                      >
                        <link.icon className="w-4 h-4" aria-hidden="true" />
                        {link.name}
                        <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div
                          className="absolute left-0 top-full mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-50"
                          role="menu"
                        >
                          <div className="py-2">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                role="menuitem"
                                className={`flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus:bg-muted/50 ${
                                  location.pathname === child.href
                                    ? "text-foreground bg-primary/10"
                                    : ""
                                }`}
                                aria-label={child.name}
                                onClick={closeDropdown}
                              >
                                <child.icon className="w-4 h-4" aria-hidden="true" />
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1 transition-colors duration-300 font-medium whitespace-nowrap ${
                      location.pathname === link.href 
                        ? "text-foreground bg-primary/10" 
                        : "hover:bg-muted/50"
                    }`}
                    aria-label={link.name}
                  >
                    <link.icon className="w-4 h-4" aria-hidden="true" />
                    {link.name}
                  </Link>
                );
              })}
              {/* Admin Link - Only visible to admin users */}
              {isAdmin && (
                <Link
                  to={adminLink.href}
                  className={`flex items-center gap-1.5 text-amber-600 hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md px-2 py-1 transition-colors duration-300 font-medium whitespace-nowrap ${
                    location.pathname === adminLink.href 
                      ? "text-amber-700 bg-amber-500/10" 
                      : "hover:bg-amber-500/10"
                  }`}
                  aria-label={adminLink.name}
                >
                  <adminLink.icon className="w-4 h-4" aria-hidden="true" />
                  {adminLink.name}
                </Link>
              )}
            </motion.nav>

          {/* Desktop CTA */}
          <motion.div 
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/settings">
                    <Cog className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to={hasCompletedOnboarding ? "/dashboard" : "/segment-selection"}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    {hasCompletedOnboarding ? "Dashboard" : "Complete Setup"}
                  </Link>
                </Button>
              </>
            ) : (
              <Button variant="hero" size="sm" asChild>
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 hover:bg-muted/50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border overflow-hidden"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3">
              {navLinks.map((link) => {
                if (link.children) {
                  return (
                    <div key={link.name} className="space-y-2">
                      <div className="flex items-center justify-between text-muted-foreground hover:text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-colors py-3 px-2 font-medium">
                        <div className="flex items-center gap-2">
                          <link.icon className="w-4 h-4" aria-hidden="true" />
                          {link.name}
                        </div>
                      </div>
                      <div className="pl-6 space-y-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-lg ${
                              location.pathname === child.href 
                                ? "text-foreground bg-primary/10" 
                                : ""
                            }`}
                            onClick={() => setIsOpen(false)}
                            aria-label={child.name}
                          >
                            <child.icon className="w-4 h-4" aria-hidden="true" />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition-colors py-3 px-2 font-medium ${
                      location.pathname === link.href 
                        ? "text-foreground bg-primary/10" 
                        : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                    aria-label={link.name}
                  >
                    <link.icon className="w-4 h-4" aria-hidden="true" />
                    {link.name}
                  </Link>
                );
              })}
              {/* Admin Link - Only visible to admin users in mobile menu */}
              {isAdmin && (
                <Link
                  to={adminLink.href}
                  className={`flex items-center gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg transition-colors py-3 px-2 font-medium ${
                    location.pathname === adminLink.href 
                      ? "text-amber-700 bg-amber-500/10" 
                      : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                  aria-label={adminLink.name}
                >
                  <adminLink.icon className="w-4 h-4" aria-hidden="true" />
                  {adminLink.name}
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/settings">
                        <Cog className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="hero" asChild className="w-full">
                      <Link to={hasCompletedOnboarding ? "/dashboard" : "/segment-selection"}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {hasCompletedOnboarding ? "Dashboard" : "Complete Setup"}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button variant="hero" asChild className="w-full">
                    <Link to="/auth">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
