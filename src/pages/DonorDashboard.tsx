import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, DollarSign, TreePine, Globe, Calendar, Download, ArrowUpRight,
  Award, Target, Users, Search, Filter, Receipt, ShieldCheck, Repeat,
  Sparkles, TrendingUp, FileText, Share2, Trophy, Plus, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import { DashboardMetricCard, DashboardChart, DashboardTable, type TableColumn } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { DonationFormDialog } from '@/components/donor/DonationFormDialog';
import { generateImpactReport, type ReportDonation } from '@/lib/donor/impactReport';
import { RecurringSubscriptions } from '@/components/donor/RecurringSubscriptions';
import { useVerificationSync } from '@/hooks/useVerificationSync';
import { SyncStatusBadge } from '@/components/donor/SyncStatusBadge';

interface Donation {
  id: string;
  date: string;
  amount: number;
  project: string;
  projectId?: string;
  category: 'Forestry' | 'Ocean' | 'Agriculture' | 'Water' | 'Community';
  impact: string;
  status: 'completed' | 'pending' | 'processing';
  txHash?: string;
  taxDeductible?: boolean;
  verified?: boolean;
}

interface ImpactMetric {
  category: string;
  value: number;
  goal: number;
  unit: string;
  change: number;
}

const DonorDashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const { user: supaUser } = useSupabaseAuth();
  const navigate = useNavigate();
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;

  const [donations, setDonations] = useState<Donation[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalImpact, setTotalImpact] = useState(0);
  const [projectsSupported, setProjectsSupported] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [donateOpen, setDonateOpen] = useState(false);
  const [reportRange, setReportRange] = useState<'30d' | '90d' | 'ytd' | 'all'>('ytd');
  const [subsRefresh, setSubsRefresh] = useState(0);

  const projectTypeToCategory = (t: string): Donation['category'] => {
    const map: Record<string, Donation['category']> = {
      forestry: 'Forestry', reforestation: 'Forestry', afforestation: 'Forestry',
      ocean: 'Ocean', blue_carbon: 'Ocean',
      agriculture: 'Agriculture', soil: 'Agriculture', regenerative_agriculture: 'Agriculture',
      water: 'Water',
      community: 'Community',
    };
    return map[t?.toLowerCase?.()] ?? 'Forestry';
  };

  const loadDonations = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, created_at, completed_at, total_amount, quantity, status, project_id, carbon_projects(title, project_type, co2_offset_per_credit)')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (error) { console.error(error); throw new Error(error.message); }
    const rows: Donation[] = (data ?? []).map((t: any) => {
      const proj = t.carbon_projects;
      const offset = (t.quantity ?? 0) * (proj?.co2_offset_per_credit ?? 0);
      return {
        id: t.id,
        date: (t.completed_at ?? t.created_at ?? new Date().toISOString()).slice(0, 10),
        amount: Number(t.total_amount ?? 0),
        project: proj?.title ?? 'Regenerative Project',
        projectId: t.project_id,
        category: projectTypeToCategory(proj?.project_type ?? ''),
        impact: `${offset.toFixed(2)} tons CO₂`,
        status: (t.status === 'completed' ? 'completed' : t.status === 'pending' ? 'pending' : 'processing') as Donation['status'],
        txHash: `atl_${String(t.id).replace(/-/g, '').slice(0, 12)}`,
        taxDeductible: t.status === 'completed',
        verified: t.status === 'completed',
      };
    });
    setDonations(rows);
    const totalAmt = rows.reduce((s, r) => s + (r.status === 'completed' ? r.amount : 0), 0);
    const totalOff = rows.reduce((s, r) => s + parseFloat(r.impact) || 0, 0);
    setTotalDonated(totalAmt);
    setTotalImpact(Math.round(totalOff));
    setProjectsSupported(new Set(rows.map((r) => r.projectId)).size);
  }, []);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }
    const mockImpactMetrics: ImpactMetric[] = [
      { category: 'Carbon Offset', value: 6875, goal: 10000, unit: 'tons', change: 12.5 },
      { category: 'Trees Planted', value: 137500, goal: 200000, unit: 'trees', change: 8.3 },
      { category: 'Lives Impacted', value: 25000, goal: 40000, unit: 'people', change: 15.2 },
      { category: 'Hectares Protected', value: 12500, goal: 20000, unit: 'ha', change: 10.1 },
    ];
    setImpactMetrics(mockImpactMetrics);
  }, [currentUser, isLoading, navigate]);

  // Verification sync — realtime push + polling fallback + retries/backoff
  const fetchDonations = useCallback(async () => {
    if (supaUser?.id) await loadDonations(supaUser.id);
  }, [supaUser?.id, loadDonations]);
  const sync = useVerificationSync({
    fetcher: fetchDonations, userId: supaUser?.id ?? null, table: 'transactions',
  });

  const timelineData = [
    { month: 'Aug', donated: 1500, impact: 375 },
    { month: 'Sep', donated: 2200, impact: 550 },
    { month: 'Oct', donated: 3800, impact: 950 },
    { month: 'Nov', donated: 4500, impact: 1125 },
    { month: 'Dec', donated: 6000, impact: 1500 },
    { month: 'Jan', donated: 10000, impact: 2500 },
  ];

  const categoryData = [
    { name: 'Forestry', value: 15000, color: 'hsl(152, 76%, 40%)' },
    { name: 'Ocean', value: 2500, color: 'hsl(199, 89%, 48%)' },
    { name: 'Agriculture', value: 7500, color: 'hsl(43, 96%, 56%)' },
    { name: 'Water', value: 3000, color: 'hsl(217, 91%, 60%)' },
  ];

  const filteredDonations = donations.filter((d) => {
    const matchesSearch = !search || d.project.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Project', 'Category', 'Amount (USD)', 'Impact', 'Status', 'Tax Deductible', 'Tx Hash'];
    const rows = donations.map((d) =>
      [d.date, d.project, d.category, d.amount, d.impact, d.status, d.taxDeductible ? 'Yes' : 'No', d.txHash ?? '']
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Donation report exported');
  };

  const taxDeductibleTotal = donations
    .filter((d) => d.taxDeductible && d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  const rangeStart = useMemo(() => {
    const d = new Date();
    if (reportRange === '30d') d.setDate(d.getDate() - 30);
    else if (reportRange === '90d') d.setDate(d.getDate() - 90);
    else if (reportRange === 'ytd') { d.setMonth(0); d.setDate(1); }
    else return new Date(0);
    return d;
  }, [reportRange]);

  const donationsInRange = useMemo(
    () => donations.filter((d) => new Date(d.date) >= rangeStart),
    [donations, rangeStart],
  );

  const downloadImpactReport = () => {
    const rows: ReportDonation[] = donationsInRange.map((d) => ({
      date: d.date, project: d.project, category: d.category,
      amount: d.amount, impact: d.impact, status: d.status,
      txHash: d.txHash, taxDeductible: d.taxDeductible,
    }));
    const totals = {
      donated: rows.filter((r) => r.status === 'completed').reduce((s, r) => s + r.amount, 0),
      offsetTons: Math.round(rows.reduce((s, r) => s + (parseFloat(r.impact) || 0), 0)),
      projects: new Set(donationsInRange.map((d) => d.projectId)).size,
    };
    const doc = generateImpactReport({
      donorName: currentUser?.displayName || supaUser?.email?.split('@')[0] || 'Donor',
      donorEmail: supaUser?.email,
      from: rangeStart, to: new Date(),
      donations: rows, totals,
    });
    doc.save(`atlas-impact-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('Impact report downloaded');
  };

  const donationColumns: TableColumn<Donation>[] = [
    { key: 'date', title: 'Date', render: (v) => new Date(v as string).toLocaleDateString() },
    {
      key: 'project', title: 'Project',
      render: (v, row) => (
        row.projectId ? (
          <Link to={`/project/${row.projectId}`} className="flex flex-col group" onClick={(e) => e.stopPropagation()}>
            <span className="font-medium group-hover:text-emerald-600 inline-flex items-center gap-1">
              {v as string} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
            </span>
            <span className="text-xs text-muted-foreground">{row.category}</span>
          </Link>
        ) : (
          <div className="flex flex-col">
            <span className="font-medium">{v as string}</span>
            <span className="text-xs text-muted-foreground">{row.category}</span>
          </div>
        )
      ),
    },
    { key: 'amount', title: 'Amount', render: (v) => <span className="font-semibold tabular-nums">${(v as number).toLocaleString()}</span> },
    { key: 'impact', title: 'Impact' },
    {
      key: 'txHash', title: 'Verification',
      render: (v, row) => {
        const hash = v as string | undefined;
        if (!hash || !row.verified) {
          return <span className="text-xs text-amber-600 inline-flex items-center gap-1">
            <Repeat className="w-3.5 h-3.5 animate-spin" /> Awaiting attestation
          </span>;
        }
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />{hash}
                </div>
              </TooltipTrigger>
              <TooltipContent>Attested donation · reference {hash}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      key: 'status', title: 'Status',
      render: (v) => (
        <Badge variant={v === 'completed' ? 'default' : 'secondary'}
          className={v === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}>
          {v}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceLayout title="Donor Dashboard" subtitle="Track your donations and measure your regenerative impact" userType="donor">
      <div className="space-y-8">
        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <SyncStatusBadge
            status={sync.status}
            lastSyncedAt={sync.lastSyncedAt}
            error={sync.error}
            onRetry={sync.refresh}
          />
          <Select value={reportRange} onValueChange={(v) => setReportRange(v as typeof reportRange)}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={downloadImpactReport}>
            <FileText className="w-4 h-4" /> Impact Report PDF
          </Button>
          <Button size="sm" className="h-9 gap-1.5" onClick={() => setDonateOpen(true)}>
            <Plus className="w-4 h-4" /> New Donation
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetricCard title="Total Donated" value={`$${totalDonated.toLocaleString()}`} change={15.2} icon={DollarSign} iconColor="text-emerald-500" trend="up" description="Lifetime contribution to regenerative projects" />
          <DashboardMetricCard title="Total Impact" value={`${totalImpact.toLocaleString()} tons`} change={12.5} icon={TreePine} iconColor="text-green-500" trend="up" description="CO2 offset through your donations" />
          <DashboardMetricCard title="Projects Supported" value={projectsSupported} change={8.3} icon={Target} iconColor="text-blue-500" trend="up" description="Number of regenerative projects funded" />
          <DashboardMetricCard title="Impact Score" value="94.2" change={5.1} icon={Award} iconColor="text-purple-500" trend="up" description="Your overall impact rating" />
        </div>

        {/* Donor Tier & Tax Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 overflow-hidden border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold">Platinum Regenerator</h3>
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Tier 4</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">$22,000 to Diamond tier · 5% bonus impact score</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="w-4 h-4" /> Share Impact
                </Button>
              </div>
              <div className="mt-5">
                <Progress value={56} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>$28,000 lifetime</span>
                  <span>Diamond at $50,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax-Deductible (2025)</p>
                  <p className="text-2xl font-bold tabular-nums">${taxDeductibleTotal.toLocaleString()}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={exportCSV}>
                <FileText className="w-4 h-4" /> Download 501(c)(3) Receipt
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="timeline" className="gap-1.5"><TrendingUp className="w-4 h-4" />Timeline</TabsTrigger>
            <TabsTrigger value="categories" className="gap-1.5"><Sparkles className="w-4 h-4" />Categories</TabsTrigger>
            <TabsTrigger value="goals" className="gap-1.5"><Target className="w-4 h-4" />Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <DashboardChart title="Donations & Impact Over Time" icon={TrendingUp} iconColor="text-emerald-500" description="Monthly contributions and tons of CO2 offset">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gDon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(152,76%,40%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(152,76%,40%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gImp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(217,91%,60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <RTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="donated" name="Donated ($)" stroke="hsl(152,76%,40%)" strokeWidth={2} fill="url(#gDon)" />
                  <Area type="monotone" dataKey="impact" name="CO2 Offset (tons)" stroke="hsl(217,91%,60%)" strokeWidth={2} fill="url(#gImp)" />
                </AreaChart>
              </ResponsiveContainer>
            </DashboardChart>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardChart title="Allocation by Category" icon={Sparkles} iconColor="text-emerald-500" description="How your donations are distributed">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                      {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RTooltip formatter={(v: number) => `$${v.toLocaleString()}`}
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </DashboardChart>
              <DashboardChart title="Impact per Category" icon={TreePine} iconColor="text-emerald-500" description="CO2 offset by category (tons)">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={categoryData.map((c) => ({ name: c.name, tons: Math.round(c.value / 4), color: c.color }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <RTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                    <Bar dataKey="tons" radius={[8, 8, 0, 0]}>
                      {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </DashboardChart>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-6">
            <DashboardChart title="2025 Impact Goals" icon={Target} iconColor="text-emerald-500" description="Progress toward annual regenerative targets">
              <div className="space-y-5">
                {impactMetrics.map((m) => {
                  const pct = Math.min(100, Math.round((m.value / m.goal) * 100));
                  return (
                    <div key={m.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{m.category}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {m.value.toLocaleString()} / {m.goal.toLocaleString()} {m.unit}
                        </span>
                      </div>
                      <Progress value={pct} className="h-2.5" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{pct}% of goal</span>
                        <span className="text-emerald-500">+{m.change}% this quarter</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashboardChart>
          </TabsContent>
        </Tabs>

        {/* Recurring donations — live from Supabase */}
        <RecurringSubscriptions userId={supaUser?.id ?? null} refreshKey={subsRefresh} />

        {/* Impact Breakdown & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardChart title="Impact Breakdown" icon={Heart} iconColor="text-emerald-500" description="Your regenerative impact across different categories">
            <div className="space-y-4">
              {impactMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.category}</span>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {metric.value.toLocaleString()} {metric.unit}
                    </span>
                  </div>
                  <Progress value={Math.round((metric.value / metric.goal) * 100)} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress toward goal</span>
                    <span className={metric.change > 0 ? 'text-emerald-500' : 'text-red-500'}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardChart>

          <DashboardChart title="Recent Activity" icon={Calendar} iconColor="text-blue-500" description="Your donation history over time">
            <div className="space-y-4">
              {donations.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{donation.project}</p>
                      <p className="text-xs text-muted-foreground">{donation.date} · {donation.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">${donation.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{donation.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </DashboardChart>
        </div>

        {/* Donation History with filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-semibold">Donation History</h3>
                <Badge variant="secondary" className="ml-1">{filteredDonations.length}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 w-[200px]" />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <Filter className="w-3.5 h-3.5 mr-1" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="Forestry">Forestry</SelectItem>
                    <SelectItem value="Ocean">Ocean</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Community">Community</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={exportCSV}>
                  <Download className="w-4 h-4" /> Export CSV
                </Button>
              </div>
            </div>
            <DashboardTable
              title=""
              columns={donationColumns}
              data={filteredDonations}
              onRowClick={(donation) => toast.info(`Opening ${donation.project}`)}
              emptyMessage="No donations match your filters."
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button size="lg" className="gap-2 h-auto py-6 flex-col" onClick={() => setDonateOpen(true)}>
              <Heart className="w-6 h-6" /><span>Make a Donation</span>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 h-auto py-6 flex-col">
              <a href="/portfolio"><Target className="w-6 h-6" /><span>View Portfolio</span></a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 h-auto py-6 flex-col" onClick={downloadImpactReport}>
              <Download className="w-6 h-6" /><span>Download Impact PDF</span>
            </Button>
          </div>
        </div>

        {/* Impact Stories */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Impact Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Amazon Rainforest', location: 'Brazil', icon: TreePine, color: 'emerald',
                text: 'Your donation helped protect 1,250 hectares of pristine rainforest, preserving biodiversity and sequestering carbon.' },
              { title: 'Ocean Restoration', location: 'Pacific Ocean', icon: Globe, color: 'blue',
                text: 'Supporting coral reef restoration and marine ecosystem recovery through sustainable fishing practices.' },
              { title: 'Community Support', location: 'Kenya', icon: Users, color: 'purple',
                text: 'Empowering local communities with sustainable agriculture training and resources.' },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-${s.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 text-${s.color}-500`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{s.title}</h3>
                        <p className="text-sm text-muted-foreground">{s.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{s.text}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={`bg-${s.color}-500/10 text-${s.color}-500`}>Active</Badge>
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Details <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <DonationFormDialog
        open={donateOpen}
        onOpenChange={setDonateOpen}
        userId={supaUser?.id ?? null}
        onSuccess={() => {
          if (supaUser?.id) loadDonations(supaUser.id);
          setSubsRefresh((n) => n + 1);
        }}
      />
    </WorkspaceLayout>
  );
};

export default DonorDashboard;
