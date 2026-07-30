import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Leaf,
  LogIn,
  ChevronDown,
  Settings,
  User,
  BarChart3,
  ShoppingBag,
  Wallet,
  Map,
  Sprout,
  Zap,
  Globe,
  Shield,
  Users,
  Heart,
  BookOpen,
  TrendingUp,
  Building2,
  FileText,
  HelpCircle,
  Phone,
  Award,
  Target,
  Layers,
  Database,
  LineChart,
  CreditCard,
  ArrowRight,
  Sun,
  Moon,
  Trophy,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { NotificationCenter } from "@/components/NotificationCenter";

interface DropdownItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

interface DropdownSection {
  title: string;
  items: DropdownItem[];
}

interface NavDropdown {
  label: string;
  sections: DropdownSection[];
  featured?: {
    title: string;
    description: string;
    href: string;
    image?: string;
  };
}

const EnterpriseHeader = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const navigation: Record<string, NavDropdown> = {
    platform: {
      label: "Platform",
      sections: [
         {
            title: "Core Features",
            items: [
              {
                name: "Marketplace",
                href: "/marketplace",
                icon: <ShoppingBag className="w-5 h-5" />,
                description: "Browse and purchase carbon credits",
                badge: "Popular",
              },
              {
                name: "Portfolio",
                href: "/portfolio",
                icon: <Wallet className="w-5 h-5" />,
                description: "Track your carbon investments",
              },
              {
                name: "Bioregions",
                href: "/bioregions",
                icon: <Map className="w-5 h-5" />,
                description: "Explore geographic impact zones",
              },
              {
                name: "Measurements",
                href: "/measurements",
                icon: <BarChart3 className="w-5 h-5" />,
                description: "Real-time environmental data",
              },
              {
                name: "Cardano Layer",
                href: "/cardano-layer",
                icon: <Calculator className="w-5 h-5" />,
                description: "Probabilistic civilization infrastructure",
                badge: "New",
              },
           /*   {
                name: "Mythic Architect",
                href: "/mythic-architect",
                icon: <Layers className="w-5 h-5" />,
                description: "1,000-year civilization blueprint",
                badge: "New",
              }, */
          ],
        },
        {
          title: "Analytics & Insights",
          items: [
            {
              name: "Valuation Engine",
              href: "/valuation",
              icon: <LineChart className="w-5 h-5" />,
              description: "Credit pricing and analysis",
            },
            {
              name: "Transactions",
              href: "/transactions",
              icon: <Database className="w-5 h-5" />,
              description: "Complete transaction history",
            },
            {
              name: "Leaderboard",
              href: "/leaderboard",
              icon: <Trophy className="w-5 h-5" />,
              description: "Top offsetters rankings",
              badge: "New",
            },
            {
              name: "Carbon Calculator",
              href: "/calculator",
              icon: <Calculator className="w-5 h-5" />,
              description: "Calculate your footprint",
            },
          ],
        },
      ],
      featured: {
        title: "New: AI-Powered Insights",
        description: "Get personalized recommendations based on your impact goals",
        href: "/dashboard",
      },
    },
    solutions: {
      label: "Solutions",
      sections: [
        {
          title: "By Use Case",
          items: [
            {
              name: "Carbon Offsetting",
              href: "/carbon-offsetting",
              icon: <Target className="w-5 h-5" />,
              description: "Neutralize your carbon footprint",
            },
            {
              name: "Impact Investment",
              href: "/impact-investment",
              icon: <TrendingUp className="w-5 h-5" />,
              description: "Generate returns while doing good",
            },
            {
              name: "Regulatory Compliance",
              href: "/regulatory-compliance",
              icon: <Shield className="w-5 h-5" />,
              description: "Meet sustainability requirements",
            },
          ],
        },
        {
          title: "By Industry",
          items: [
            {
              name: "Enterprise",
              href: "/enterprise-solutions",
              icon: <Building2 className="w-5 h-5" />,
              description: "Large-scale carbon programs",
              badge: "Enterprise",
            },
            {
              name: "SMB",
              href: "/smb-solutions",
              icon: <Users className="w-5 h-5" />,
              description: "Accessible sustainability solutions",
            },
            {
              name: "Agriculture",
              href: "/agriculture-solutions",
              icon: <Sprout className="w-5 h-5" />,
              description: "Regenerative farming credits",
            },
          ],
        },
      ],
    },
    impact: {
      label: "Impact",
      sections: [
        {
          title: "Environmental",
          items: [
            {
              name: "Regenerative Agriculture",
              href: "/regenerative-agriculture",
              icon: <Sprout className="w-5 h-5" />,
              description: "Soil health and biodiversity",
            },
            {
              name: "Renewable Energy",
              href: "/renewable-energy",
              icon: <Zap className="w-5 h-5" />,
              description: "Clean energy transition projects",
            },
            {
              name: "Ecosystem Health",
              href: "/health",
              icon: <Heart className="w-5 h-5" />,
              description: "Human and planet wellness",
            },
          ],
        },
        {
          title: "Governance",
          items: [
            {
              name: "Community Governance",
              href: "/governance",
              icon: <Users className="w-5 h-5" />,
              description: "Democratic decision-making",
            },
            {
              name: "Security & Trust",
              href: "/security",
              icon: <Shield className="w-5 h-5" />,
              description: "Blockchain verification",
            },
            {
              name: "Global Adoption",
              href: "/adoption",
              icon: <Globe className="w-5 h-5" />,
              description: "Worldwide accessibility",
            },
          ],
        },
      ],
    },
    resources: {
      label: "Resources",
      sections: [
        {
          title: "Learn",
          items: [
            {
              name: "Documentation",
              href: "/help/documentation",
              icon: <FileText className="w-5 h-5" />,
              description: "Guides and API reference",
            },
            {
              name: "Education Hub",
              href: "/education-hub",
              icon: <BookOpen className="w-5 h-5" />,
              description: "Carbon market education",
            },
            {
              name: "Certifications",
              href: "/certifications",
              icon: <Award className="w-5 h-5" />,
              description: "Standards and methodologies",
            },
          ],
        },
        {
          title: "Support",
          items: [
            {
              name: "Help Center",
              href: "/help-center",
              icon: <HelpCircle className="w-5 h-5" />,
              description: "FAQs and troubleshooting",
            },
            {
              name: "Contact Sales",
              href: "/contact",
              icon: <Phone className="w-5 h-5" />,
              description: "Enterprise inquiries",
            },
            {
              name: "Pricing",
              href: "/pricing",
              icon: <CreditCard className="w-5 h-5" />,
              description: "Plans and payment options",
              badge: "New",
            },
          ],
        },
      ],
    },
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-panel ${
        scrolled 
          ? "bg-background/80"
          : "bg-background/60"
      }`}
    >
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                <Leaf className="w-5 h-5 text-primary-foreground" />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-lg text-foreground leading-tight tracking-tight">
                  Atlas <span className="text-primary">Sanctum</span>
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  Regenerative Platform
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {Object.entries(navigation).map(([key, dropdown]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setActiveDropdown(key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeDropdown === key
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {dropdown.label}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeDropdown === key && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 top-full pt-2"
                    >
                      <div className="bg-popover border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden min-w-[520px]">
                        <div className="p-5">
                          <div className="grid grid-cols-2 gap-6">
                            {dropdown.sections.map((section) => (
                              <div key={section.title}>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                                  {section.title}
                                </h4>
                                <div className="space-y-0.5">
                                  {section.items.map((item) => (
                                    <Link
                                      key={item.href + item.name}
                                      to={item.href}
                                      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group ${
                                        isActive(item.href)
                                          ? "bg-primary/10"
                                          : "hover:bg-accent"
                                      }`}
                                    >
                                      <div
                                        className={`p-2 rounded-lg shrink-0 ${
                                          isActive(item.href)
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                        } transition-all duration-200`}
                                      >
                                        {item.icon}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                                            {item.name}
                                          </span>
                                          {item.badge && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary rounded-full">
                                              {item.badge}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                          {item.description}
                                        </p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {dropdown.featured && (
                            <div className="mt-5 pt-5 border-t border-border">
                              <Link
                                to={dropdown.featured.href}
                                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 hover:from-primary/10 hover:via-primary/15 hover:to-primary/10 transition-all duration-300 group border border-primary/10"
                              >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Layers className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {dropdown.featured.title}
                                  </h5>
                                  <p className="text-sm text-muted-foreground">
                                    {dropdown.featured.description}
                                  </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <NotificationCenter />
                <Link
                  to="/settings"
                  className="p-2.5 rounded-lg hover:bg-accent transition-colors"
                >
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div className="w-px h-6 bg-border mx-1" />
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center ring-2 ring-background group-hover:ring-primary/20 transition-all">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <Link to="/contact">
                    Book Demo
                  </Link>
                </Button>
                <Button size="sm" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow" asChild>
                  <Link to="/auth">
                    <LogIn className="w-4 h-4" />
                    Start Free
                  </Link>
                </Button>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-accent transition-colors border border-border/50"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="max-h-[75vh] overflow-y-auto">
              <div className="p-4 space-y-6">
                {Object.entries(navigation).map(([key, dropdown]) => (
                  <div key={key} className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                      {dropdown.label}
                    </h3>
                    {dropdown.sections.map((section) => (
                      <div key={section.title} className="space-y-1">
                        {section.items.map((item) => (
                          <Link
                            key={item.href + item.name}
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                              isActive(item.href) ? "bg-primary/10" : "hover:bg-accent"
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${
                              isActive(item.href) 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-foreground">
                                {item.name}
                              </span>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}

                <div className="pt-4 border-t border-border space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-accent transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Dashboard</span>
                  </Link>
                  
                  {user ? (
                    <Link
                      to="/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-accent transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                        <Settings className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Settings</span>
                    </Link>
                  ) : (
                    <Button asChild className="w-full mt-4 shadow-lg shadow-primary/20">
                      <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Get Started
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default EnterpriseHeader;
