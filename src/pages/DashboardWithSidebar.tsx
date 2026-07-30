import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  TreePine,
  ShoppingCart,
  Briefcase,
  Globe,
  Settings,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { InteractiveChartsDashboard } from '@/components/InteractiveChartsDashboard';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  full_name: string | null;
  organization: string | null;
}

interface CreditHolding {
  id: string;
  quantity: number;
  purchase_price: number;
  project_id: string;
}

export default function DashboardPage() {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [holdings, setHoldings] = React.useState<CreditHolding[]>([]);
  const [totalCredits, setTotalCredits] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, organization')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileData) setProfile(profileData);

        const { data: holdingsData } = await supabase
          .from('credit_holdings')
          .select('id, quantity, purchase_price, project_id')
          .eq('user_id', user.id);

        if (holdingsData) {
          setHoldings(holdingsData);
          const credits = holdingsData.reduce((sum, h) => sum + h.quantity, 0);
          setTotalCredits(credits);
        }
      }
    };

    fetchData();
  }, [user]);

  const quickLinks = [
    { label: 'Browse Marketplace', icon: ShoppingCart, href: '/marketplace', color: 'bg-primary/10 text-primary' },
    { label: 'View Portfolio', icon: Briefcase, href: '/portfolio', color: 'bg-ocean/10 text-ocean' },
    { label: 'Explore Bioregions', icon: Globe, href: '/bioregions', color: 'bg-accent/10 text-accent' },
    { label: 'Settings', icon: Settings, href: '/settings', color: 'bg-muted text-muted-foreground' },
  ];

  const recentActivity = totalCredits > 0 ? [
    { title: 'Carbon credit purchase', description: 'Credits from verified projects', time: 'Recent', type: 'purchase' },
    { title: 'Impact verification', description: 'Continuous monitoring active', time: 'Ongoing', type: 'milestone' },
    { title: 'Portfolio growth', description: 'Your impact is growing', time: 'This month', type: 'partnership' },
  ] : [];

  return (
    <DashboardLayout
      title={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Explorer'}`}
      description={
        totalCredits > 0
          ? 'Track your regenerative impact and manage your portfolio'
          : 'Start your regenerative investment journey today'
      }
    >
      <div className="space-y-6">
        {/* Empty State CTA */}
        {totalCredits === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                      <Button asChild>
                        <Link to="/marketplace">
                          Browse Projects
                          <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/bioregions">Explore Bioregions</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link, index) => (
            <Link key={link.label} to={link.href}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
        </div>

        {/* Interactive Charts Dashboard */}
        <InteractiveChartsDashboard />

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
