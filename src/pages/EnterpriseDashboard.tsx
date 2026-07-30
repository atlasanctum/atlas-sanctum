// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  TrendingUp,
  Target,
  BarChart3,
  Users,
  CheckCircle,
  AlertTriangle,
  Globe,
  Zap,
  FileText,
  ArrowUpRight,
  Settings,
  Shield,
  Activity,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard, DashboardChart, DashboardTable, type TableColumn } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface ESGMetric {
  category: string;
  current: number;
  target: number;
  progress: number;
  trend: 'up' | 'down' | 'neutral';
}

interface SupplyChainNode {
  id: string;
  name: string;
  type: string;
  status: 'compliant' | 'at-risk' | 'non-compliant';
  lastAudit: string;
  score: number;
}

const EnterpriseDashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const navigate = useNavigate();
  
  // Use enhanced auth for demo mode, fallback to regular auth
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;
  const [esgMetrics, setEsgMetrics] = useState<ESGMetric[]>([]);
  const [supplyChainNodes, setSupplyChainNodes] = useState<SupplyChainNode[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [complianceRate, setComplianceRate] = useState(94.5);
  const [carbonOffset, setCarbonOffset] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }

    // Mock data for demo
    const mockEsgMetrics: ESGMetric[] = [
      { category: 'Carbon Reduction', current: 12500, target: 15000, progress: 83, trend: 'up' },
      { category: 'Energy Efficiency', current: 78, target: 90, progress: 87, trend: 'up' },
      { category: 'Water Usage', current: 450, target: 500, progress: 90, trend: 'down' },
      { category: 'Waste Reduction', current: 65, target: 80, progress: 81, trend: 'up' },
      { category: 'Diversity & Inclusion', current: 72, target: 85, progress: 85, trend: 'up' },
    ];

    const mockSupplyChainNodes: SupplyChainNode[] = [
      {
        id: '1',
        name: 'Raw Materials Supplier',
        type: 'Tier 1',
        status: 'compliant',
        lastAudit: '2025-01-28',
        score: 98,
      },
      {
        id: '2',
        name: 'Manufacturing Facility',
        type: 'Tier 2',
        status: 'compliant',
        lastAudit: '2025-01-25',
        score: 95,
      },
      {
        id: '3',
        name: 'Distribution Center',
        type: 'Tier 2',
        status: 'at-risk',
        lastAudit: '2025-01-20',
        score: 72,
      },
      {
        id: '4',
        name: 'Retail Partner',
        type: 'Tier 3',
        status: 'compliant',
        lastAudit: '2025-01-15',
        score: 96,
      },
      {
        id: '5',
        name: 'End Consumer',
        type: 'Tier 3',
        status: 'non-compliant',
        lastAudit: '2025-01-10',
        score: 65,
      },
    ];

    setEsgMetrics(mockEsgMetrics);
    setSupplyChainNodes(mockSupplyChainNodes);
    setTotalProjects(47);
    setComplianceRate(94.5);
    setCarbonOffset(12500);
  }, [user, loading, navigate]);

  const esgColumns: TableColumn<ESGMetric>[] = [
    {
      key: 'category',
      title: 'ESG Category',
    },
    {
      key: 'current',
      title: 'Current',
      render: (value) => `${Number(value).toLocaleString()}`,
    },
    {
      key: 'target',
      title: 'Target',
      render: (value) => `${Number(value).toLocaleString()}`,
    },
    {
      key: 'progress',
      title: 'Progress',
      render: (value) => (
        <div className="w-24">
          <Progress value={value as number} className="h-2" />
          <span className="text-xs text-muted-foreground mt-1">{value}%</span>
        </div>
      ),
    },
    {
      key: 'trend',
      title: 'Trend',
      render: (value) => {
        const trendConfig = {
          up: { color: 'text-emerald-500', icon: '↑' },
          down: { color: 'text-red-500', icon: '↓' },
          neutral: { color: 'text-slate-500', icon: '→' },
        };
        const config = trendConfig[value];
        return (
          <span className={`text-sm font-medium ${config.color}`}>
            {config.icon}
          </span>
        );
      },
    },
  ];

  const supplyChainColumns: TableColumn<SupplyChainNode>[] = [
    {
      key: 'name',
      title: 'Node Name',
    },
    {
      key: 'type',
      title: 'Type',
      render: (value) => (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => {
        const statusConfig = {
          compliant: { color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
          'at-risk': { color: 'bg-amber-500/10 text-amber-500', icon: AlertTriangle },
          'non-compliant': { color: 'bg-red-500/10 text-red-500', icon: AlertTriangle },
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        const Icon = config.icon;
        return (
          <Badge className={config.color}>
            <Icon className="w-3 h-3 mr-1" />
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'score',
      title: 'ESG Score',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Progress value={value as number} className="h-2 w-16" />
          <span className="text-sm font-semibold">{value}/100</span>
        </div>
      ),
    },
    {
      key: 'lastAudit',
      title: 'Last Audit',
      render: (value) => new Date(String(value)).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceLayout
      title="Enterprise Dashboard"
      subtitle="ESG compliance, supply chain management, and regenerative impact"
      userType="enterprise"
    >
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardMetricCard
              title="Total Projects"
              value={totalProjects}
              change={12.5}
              icon={Building2}
              iconColor="text-emerald-500"
              trend="up"
              description="Active regenerative projects"
            />
            <DashboardMetricCard
              title="Compliance Rate"
              value={`${complianceRate}%`}
              change={2.3}
              icon={Shield}
              iconColor="text-blue-500"
              trend="up"
              description="ESG compliance across supply chain"
            />
            <DashboardMetricCard
              title="Carbon Offset"
              value={`${carbonOffset.toLocaleString()} tons`}
              change={15.2}
              icon={Target}
              iconColor="text-green-500"
              trend="up"
              description="Total CO2 offset this year"
            />
            <DashboardMetricCard
              title="Supply Chain Nodes"
              value={5}
              change={0}
              icon={Globe}
              iconColor="text-purple-500"
              trend="neutral"
              description="Active supply chain partners"
            />
          </div>

          {/* ESG Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DashboardTable
              title="ESG Performance Metrics"
              icon={BarChart3}
              iconColor="text-emerald-500"
              columns={esgColumns}
              data={esgMetrics}
              onRowClick={(metric) => console.log('View metric:', metric.category)}
              emptyMessage="No ESG metrics available."
            />

            <DashboardTable
              title="Supply Chain Compliance"
              icon={Shield}
              iconColor="text-blue-500"
              columns={supplyChainColumns}
              data={supplyChainNodes}
              onRowClick={(node) => console.log('View node:', node.id)}
              emptyMessage="No supply chain nodes found."
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                asChild
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Plus className="w-6 h-6" />
                  <span>New Project</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span>ESG Report</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  <span>Audit Supply Chain</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <span>Settings</span>
                </a>
              </Button>
            </div>
          </div>

          {/* ESG Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">ESG Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Environmental</h3>
                      <p className="text-sm text-muted-foreground">Carbon, energy, water</p>
                    </div>
                  </div>
                  <Progress value={83} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">83% of target</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Social</h3>
                      <p className="text-sm text-muted-foreground">Labor, diversity, inclusion</p>
                    </div>
                  </div>
                  <Progress value={85} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">85% of target</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Governance</h3>
                      <p className="text-sm text-muted-foreground">Ethics, compliance, oversight</p>
                    </div>
                  </div>
                  <Progress value={87} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">87% of target</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Impact</h3>
                      <p className="text-sm text-muted-foreground">Regeneration, community</p>
                    </div>
                  </div>
                  <Progress value={81} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">81% of target</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardChart
                title="ESG Performance Trend"
                icon={TrendingUp}
                iconColor="text-emerald-500"
                description="Your ESG performance over the last 6 months"
              >
                <div className="space-y-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month}</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 10 + 80)}/100
                        </span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 20 + 75)} className="h-2" />
                    </div>
                  ))}
                </div>
              </DashboardChart>

              <DashboardChart
                title="Compliance Alerts"
                icon={AlertTriangle}
                iconColor="text-amber-500"
                description="Recent compliance issues requiring attention"
              >
                <div className="space-y-3">
                  <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Distribution Center - At Risk</p>
                        <p className="text-xs text-muted-foreground">
                          ESG score dropped below threshold. Immediate action required.
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Review <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">Manufacturing Facility - Compliant</p>
                        <p className="text-xs text-muted-foreground">
                          All ESG criteria met. Next audit scheduled for Feb 15.
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Details <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DashboardChart>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    );
  };

  export default EnterpriseDashboard;
