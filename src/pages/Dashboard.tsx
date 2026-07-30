// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { InteractiveDashboard, InteractiveFeatureGrid } from '@/components/EnhancedPlatformComponents';
import { InnovationsHub } from '@/components/InnovationsHub';
import { PageTransition, InteractiveButton } from '@/components/Interactions';
import {
  Leaf, LogOut, User, BarChart3, ShoppingCart, Briefcase,
  TrendingUp, Activity, Bell, Settings, Globe, TreePine,
  ChevronRight, Shield, Wallet, ArrowUpRight, Plus, HelpCircle,
  Calculator, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import QuickActions from "@/components/dashboard/QuickActions";
import { OnboardingTour } from "@/components/OnboardingTour";
import { ImpactWidget } from "@/components/dashboard/ImpactWidget";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useAdmin";
import { useOnboardingTour } from "@/hooks/useOnboardingTour";
import { usePriceAlertMonitor } from "@/hooks/usePriceAlertMonitor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
interface Profile {
  full_name: string | null;
  organization: string | null;
  avatar_url: string | null;
}

interface CreditHolding {
  id: string;
  quantity: number;
  purchase_price: number;
  project_id: string;
  carbon_projects?: {
    title: string;
    project_type: string;
  };
}

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const { startTour, tourCompleted } = useOnboardingTour();
  usePriceAlertMonitor(); // Start monitoring price alerts
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [holdings, setHoldings] = useState<CreditHolding[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      // Check if onboarding is complete
      const completed = localStorage.getItem(`onboarding_completed_${user.id}`);
      if (!completed) {
        // For demo users, skip onboarding
        if (user.email?.includes('demo')) {
          localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
        } else {
          // For real users, redirect to onboarding if not completed
          // navigate("/onboarding");
          // return;
          // Temporarily skip onboarding for all users
          localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
        }
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // For demo users, create mock data
        if (user.email?.includes('demo')) {
          // Different data for admin and regular users
          if (user.email?.includes('admin')) {
            setProfile({
              full_name: 'Admin User',
              organization: 'Atlas Sanctum Admin',
              avatar_url: null
            });
            
            // Create admin-specific mock holdings
            const mockHoldings: CreditHolding[] = [
              {
                id: '1',
                quantity: 500,
                purchase_price: 15.50,
                project_id: 'proj-1',
                carbon_projects: {
                  title: 'Amazon Rainforest Protection',
                  project_type: 'Forest Conservation'
                }
              },
              {
                id: '2',
                quantity: 250,
                purchase_price: 22.00,
                project_id: 'proj-2',
                carbon_projects: {
                  title: 'Solar Farm Initiative',
                  project_type: 'Renewable Energy'
                }
              },
              {
                id: '3',
                quantity: 300,
                purchase_price: 18.75,
                project_id: 'proj-3',
                carbon_projects: {
                  title: 'Ocean Conservation Project',
                  project_type: 'Marine Protection'
                }
              }
            ];
            
            setHoldings(mockHoldings);
            const credits = mockHoldings.reduce((sum, h) => sum + h.quantity, 0);
            const value = mockHoldings.reduce((sum, h) => sum + h.quantity * h.purchase_price, 0);
            setTotalCredits(credits);
            setPortfolioValue(value);
          } else {
            setProfile({
              full_name: 'Demo User',
              organization: 'Demo Organization',
              avatar_url: null
            });
            
            // Create regular user mock holdings
            const mockHoldings: CreditHolding[] = [
              {
                id: '1',
                quantity: 100,
                purchase_price: 15.50,
                project_id: 'proj-1',
                carbon_projects: {
                  title: 'Amazon Rainforest Protection',
                  project_type: 'Forest Conservation'
                }
              },
              {
                id: '2',
                quantity: 50,
                purchase_price: 22.00,
                project_id: 'proj-2',
                carbon_projects: {
                  title: 'Solar Farm Initiative',
                  project_type: 'Renewable Energy'
                }
              }
            ];
            
            setHoldings(mockHoldings);
            const credits = mockHoldings.reduce((sum, h) => sum + h.quantity, 0);
            const value = mockHoldings.reduce((sum, h) => sum + h.quantity * h.purchase_price, 0);
            setTotalCredits(credits);
            setPortfolioValue(value);
          }
        } else {
          // For real users, fetch from Supabase
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, organization, avatar_url")
            .eq("user_id", user.id)
            .maybeSingle();

          if (profileData) setProfile(profileData);

          // Fetch holdings
          const { data: holdingsData } = await supabase
            .from("credit_holdings")
            .select(`
              id,
              quantity,
              purchase_price,
              project_id,
              carbon_projects (
                title,
                project_type
              )
            `)
            .eq("user_id", user.id);

          if (holdingsData) {
            setHoldings(holdingsData);
            const credits = holdingsData.reduce((sum, h) => sum + h.quantity, 0);
            const value = holdingsData.reduce((sum, h) => sum + h.quantity * h.purchase_price, 0);
            setTotalCredits(credits);
            setPortfolioValue(value);
          }
        }
      }
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    // Using lazy import to avoid circular dependencies
    const DashboardSkeleton = React.lazy(() => import('@/components/skeletons/DashboardSkeleton'));
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      }>
        <DashboardSkeleton />
      </React.Suspense>
    );
  }

  const stats = [
    { 
      label: "Carbon Credits", 
      value: totalCredits > 0 ? totalCredits.toLocaleString() : "0", 
      change: totalCredits > 0 ? "+12.5%" : "Start now", 
      icon: Leaf, 
      color: "text-primary",
      href: "/portfolio"
    },
    { 
      label: "Portfolio Value", 
      value: portfolioValue > 0 ? `$${portfolioValue.toLocaleString()}` : "$0", 
      change: portfolioValue > 0 ? "+8.3%" : "Invest", 
      icon: Wallet, 
      color: "text-accent",
      href: "/marketplace"
    },
    { 
      label: "CO₂ Offset", 
      value: totalCredits > 0 ? `${totalCredits} tons` : "0 tons", 
      change: totalCredits > 0 ? "+5.2%" : "Track",
      icon: TrendingUp, 
      color: "text-ocean",
      href: "/measurements"
    },
    { 
      label: "Active Projects", 
      value: holdings.length.toString(), 
      change: holdings.length > 0 ? `+${holdings.length}` : "Browse", 
      icon: Activity, 
      color: "text-earth",
      href: "/marketplace"
    },
  ];

  const recentActivity = totalCredits > 0 ? [
    { title: "Carbon credit purchase", description: "Credits from verified projects", time: "Recent", type: "purchase" },
    { title: "Impact verification", description: "Continuous monitoring active", time: "Ongoing", type: "milestone" },
    { title: "Portfolio growth", description: "Your impact is growing", time: "This month", type: "partnership" },
  ] : [];

  const quickLinks = [
    { label: "Browse Marketplace", icon: ShoppingCart, href: "/marketplace", color: "bg-primary/10 text-primary" },
    { label: "Carbon Calculator", icon: Calculator, href: "/calculator", color: "bg-accent/10 text-accent" },
    { label: "View Portfolio", icon: Briefcase, href: "/portfolio", color: "bg-ocean/10 text-ocean" },
    { label: "Explore Bioregions", icon: Globe, href: "/bioregions", color: "bg-emerald-500/10 text-emerald-600" },
    { label: "Cardano Layer", icon: Shield, href: "/cardano-layer", color: "bg-purple-500/10 text-purple-600" },
    { label: "Achievements", icon: Trophy, href: "/profile#achievements", color: "bg-amber-500/10 text-amber-600" },
    { label: "Alignment", icon: Scale, href: "/alignment", color: "bg-primary/10 text-primary" },
    { label: "Settings", icon: Settings, href: "/settings", color: "bg-muted text-muted-foreground" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      {/* Onboarding Tour */}
      <OnboardingTour />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-ocean flex items-center justify-center flex-shrink-0">
              <Leaf className="w-4 sm:w-5 h-4 sm:h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-base sm:text-xl font-semibold text-foreground truncate">
              Atlas Sanctum
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground h-10 w-10"
              data-tour="notifications"
            >
              <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
            </Button>
            {tourCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={startTour}
                className="text-muted-foreground hover:text-foreground h-10 w-10"
                title="Restart tour"
              >
                <HelpCircle className="w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            )}
            {isAdmin && (
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link to="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-border">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {profile?.full_name || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.organization || "Investor"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive h-10 w-10">
              <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
          data-tour="welcome"
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Explorer"}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            {totalCredits > 0 
              ? "Track your regenerative impact and manage your portfolio"
              : "Start your regenerative investment journey today"
            }
          </p>
        </motion.div>

        {/* Empty State CTA - Show when no holdings */}
        {totalCredits === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-primary/10 via-ocean/10 to-accent/10 border-primary/20">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <TreePine className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="font-display text-xl font-bold text-foreground mb-2">
                      Start Your Impact Journey
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Explore verified carbon credit projects and make your first investment in planetary regeneration.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <InteractiveButton variant="primary" onClick={() => navigate('/marketplace')}>
                        Browse Projects
                        <ArrowUpRight className="w-4 h-4" />
                      </InteractiveButton>
                      <InteractiveButton variant="secondary" onClick={() => navigate('/bioregions')}>
                        Explore Bioregions
                      </InteractiveButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
          data-tour="stats"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Link to={stat.href}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all cursor-pointer group h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-5 sm:w-6 h-5 sm:h-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs group-hover:bg-primary/10">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 sm:mb-8"
          data-tour="quick-links"
        >
          {quickLinks.map((link, index) => (
            <Link key={link.label} to={link.href}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-lg ${link.color} flex items-center justify-center mb-3`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Carbon Impact Widget */}
        {totalCredits > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8"
          >
            <ImpactWidget />
          </motion.div>
        )}

        {/* Interactive Dashboard Metrics */}
        <InteractiveDashboard />

        {/* Interactive Feature Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Platform Features</h2>
          <InteractiveFeatureGrid />
        </div>

        {/* Platform Innovations Hub */}
        <div className="mt-12">
          <InnovationsHub />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12">
          {/* Recent Activity or Getting Started */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg sm:text-xl">
                    {totalCredits > 0 ? "Recent Activity" : "Getting Started"}
                  </CardTitle>
                  {totalCredits > 0 && (
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      View all <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {totalCredits > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "Explore the Marketplace", description: "Browse verified carbon credit projects", complete: false },
                      { step: 2, title: "Purchase Carbon Credits", description: "Support projects that align with your values", complete: false },
                      { step: 3, title: "Track Your Impact", description: "Monitor CO₂ offset and project progress", complete: false },
                    ].map((item, index) => (
                      <motion.div
                        key={item.step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          item.complete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </main>
    </div>
    </PageTransition>
  );
};

export default Dashboard;
