import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building,
  TrendingUp,
  Target,
  CheckCircle,
  AlertTriangle,
  Globe,
  Zap,
  FileText,
  ArrowUpRight,
  Shield,
  Activity,
  Calendar,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard, DashboardChart } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface MetricData {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

const GovernmentDashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const navigate = useNavigate();
  
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [partnershipsActive, setPartnershipsActive] = useState(0);
  const [reportsGenerated, setReportsGenerated] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }

    setComplianceScore(95);
    setPartnershipsActive(8);
    setReportsGenerated(24);
    setMetrics([
      { label: 'Total Budget Allocated', value: 4500000, change: 12.5, trend: 'up', target: 5000000 },
      { label: 'Projects Completed', value: 156, change: 8.3, trend: 'up', target: 200 },
      { label: 'Lives Impacted', value: 125000, change: 15.2, trend: 'up', target: 150000 },
      { label: 'Hectares Restored', value: 45000, change: 22.1, trend: 'up', target: 60000 },
    ]);
  }, [user, loading, navigate]);

  const budgetProgress = (4500000 / 5000000) * 100;
  const projectProgress = (156 / 200) * 100;
  const impactProgress = (125000 / 150000) * 100;
  const restorationProgress = (45000 / 60000) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceLayout title="Government Dashboard" subtitle="Oversee partnerships, compliance, and policy initiatives" userType="government">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetricCard title="Compliance Score" value={`${complianceScore}%`} change={5.2} icon={Shield} iconColor="text-emerald-500" trend="up" description="Regulatory compliance rate" />
          <DashboardMetricCard title="Active Partnerships" value={partnershipsActive} change={-2.1} icon={Building} iconColor="text-blue-500" trend="down" description="Government partnerships" />
          <DashboardMetricCard title="Reports Generated" value={reportsGenerated} change={18.5} icon={FileText} iconColor="text-purple-500" trend="up" description="Monthly reports" />
          <DashboardMetricCard title="Budget Utilized" value="$4.5M" change={8.7} icon={Activity} iconColor="text-amber-500" trend="up" description="Of $5M allocated" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardChart title="Budget Allocation vs Spending" icon={TrendingUp} iconColor="text-emerald-500">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-white">Budget Allocation</span><span className="text-slate-400">$5.0M</span></div>
                <Progress value={100} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-white">Spending</span><span className="text-slate-400">$4.5M</span></div>
                <Progress value={budgetProgress} className="h-3 bg-slate-700" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-white">Remaining</span><span className="text-slate-400">$0.5M</span></div>
                <Progress value={10} className="h-3" />
              </div>
            </div>
          </DashboardChart>

          <DashboardChart title="Program Performance" icon={Target} iconColor="text-blue-500">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-white">Projects Completed</span><span className="text-slate-400">156/200</span></div>
                <Progress value={projectProgress} className="h-3 bg-slate-700" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-white">Lives Impacted</span><span className="text-slate-400">125K/150K</span></div>
                <Progress value={impactProgress} className="h-3 bg-slate-700" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-white">Hectares Restored</span><span className="text-slate-400">45K/60K</span></div>
                <Progress value={restorationProgress} className="h-3 bg-slate-700" />
              </div>
            </div>
          </DashboardChart>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Initiative Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-emerald-500" /></div>
                  <div><h3 className="font-semibold text-white">Carbon Reduction</h3><p className="text-sm text-slate-400">On track for 2030 goals</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Reducing emissions through regenerative agriculture and renewable energy adoption.</p>
                <Progress value={78} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">78% Complete</Badge>
                  <Button variant="ghost" size="sm" className="gap-1">View Details <ArrowUpRight className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center"><Globe className="w-6 h-6 text-blue-500" /></div>
                  <div><h3 className="font-semibold text-white">Biodiversity Protection</h3><p className="text-sm text-slate-400">Endangered species recovery</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Protecting critical habitats and supporting wildlife corridor development.</p>
                <Progress value={62} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">62% Complete</Badge>
                  <Button variant="ghost" size="sm" className="gap-1">View Details <ArrowUpRight className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center"><Database className="w-6 h-6 text-purple-500" /></div>
                  <div><h3 className="font-semibold text-white">Data Transparency</h3><p className="text-sm text-slate-400">Public reporting system</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Real-time tracking and public disclosure of environmental initiatives.</p>
                <Progress value={89} className="h-2 mb-2" />
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">89% Complete</Badge>
                  <Button variant="ghost" size="sm" className="gap-1">View Details <ArrowUpRight className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Policy Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-emerald-500" /></div>
                    <h3 className="font-semibold text-white">Regenerative Agriculture Policy</h3>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Active</Badge>
                </div>
                <p className="text-sm text-slate-400 mb-4">Supporting farmers in transitioning to regenerative practices with subsidies and technical assistance.</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-2xl font-bold text-white">2,450</p><p className="text-xs text-slate-400">Farmers Enrolled</p></div>
                  <div><p className="text-2xl font-bold text-white">15K</p><p className="text-xs text-slate-400">Hectares Converted</p></div>
                  <div><p className="text-2xl font-bold text-white">$4.2M</p><p className="text-xs text-slate-400">Investment</p></div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Zap className="w-5 h-5 text-blue-500" /></div>
                    <h3 className="font-semibold text-white">Renewable Energy Initiative</h3>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">In Progress</Badge>
                </div>
                <p className="text-sm text-slate-400 mb-4">Accelerating the transition to renewable energy in rural communities.</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-2xl font-bold text-white">85</p><p className="text-xs text-slate-400">Communities</p></div>
                  <div><p className="text-2xl font-bold text-white">12MW</p><p className="text-xs text-slate-400">Capacity Added</p></div>
                  <div><p className="text-2xl font-bold text-white">$8.5M</p><p className="text-xs text-slate-400">Investment</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Alerts & Notifications</h2>
          <div className="space-y-3">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="font-medium text-white">Q4 Compliance Report Approved</p>
                      <p className="text-sm text-slate-400">All regulatory requirements met for the fourth quarter</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">2 hours ago</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium text-white">Budget Review Required</p>
                      <p className="text-sm text-slate-400">Quarterly budget review pending approval</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">1 day ago</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-white">New Partnership Opportunity</p>
                      <p className="text-sm text-slate-400">International environmental organization requests meeting</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">3 days ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default GovernmentDashboard;
