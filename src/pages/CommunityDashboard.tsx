import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Plus,
  FileText,
  Award,
  Globe,
  Heart,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard, DashboardTable, type TableColumn } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface Program {
  id: string;
  name: string;
  type: string;
  participants: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: string;
  progress: number;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  downloads: number;
  lastUpdated: string;
}

const CommunityDashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const navigate = useNavigate();
  
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;
  const [programs, setPrograms] = useState<Program[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activePrograms, setActivePrograms] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [completedPrograms, setCompletedPrograms] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }

    const mockPrograms: Program[] = [
      { id: '1', name: 'Regenerative Agriculture Training', type: 'Education', participants: 245, status: 'active', startDate: '2025-01-15', progress: 75 },
      { id: '2', name: 'Youth Environmental Stewardship', type: 'Community', participants: 189, status: 'active', startDate: '2025-01-20', progress: 60 },
      { id: '3', name: 'Sustainable Fishing Practices', type: 'Training', participants: 156, status: 'completed', startDate: '2025-01-10', progress: 100 },
      { id: '4', name: 'Community Garden Initiative', type: 'Project', participants: 312, status: 'active', startDate: '2025-01-25', progress: 45 },
      { id: '5', name: 'Water Conservation Workshop', type: 'Workshop', participants: 87, status: 'upcoming', startDate: '2025-02-05', progress: 0 },
    ];

    const mockResources: Resource[] = [
      { id: '1', title: 'Regenerative Farming Guide', type: 'PDF', downloads: 1247, lastUpdated: '2025-01-28' },
      { id: '2', title: 'Community Engagement Toolkit', type: 'PDF', downloads: 892, lastUpdated: '2025-01-25' },
      { id: '3', title: 'Impact Measurement Handbook', type: 'PDF', downloads: 654, lastUpdated: '2025-01-20' },
      { id: '4', title: 'Educational Videos Series', type: 'Video', downloads: 2341, lastUpdated: '2025-01-30' },
    ];

    setPrograms(mockPrograms);
    setResources(mockResources);
    setActivePrograms(2);
    setTotalParticipants(989);
    setCompletedPrograms(1);
  }, [user, loading, navigate]);

  const programColumns: TableColumn<Program>[] = [
    { key: 'name', title: 'Program Name' },
    { key: 'type', title: 'Type', render: (value) => <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">{value}</Badge> },
    { key: 'participants', title: 'Participants', render: (value) => `${value} enrolled` },
    { key: 'status', title: 'Status', render: (value) => {
      const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
        active: { color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
        completed: { color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle },
        upcoming: { color: 'bg-purple-500/10 text-purple-500', icon: Calendar },
      };
      const config = statusConfig[value as string];
      const Icon = config.icon;
      return <Badge className={config.color}><Icon className="w-3 h-3 mr-1" />{value}</Badge>;
    }},
    { key: 'progress', title: 'Progress', render: (value) => <div className="w-24"><Progress value={value as number} className="h-2" /><span className="text-xs text-muted-foreground mt-1">{value}%</span></div> },
    { key: 'startDate', title: 'Start Date', render: (value) => new Date(String(value)).toLocaleDateString() },
  ];

  const resourceColumns: TableColumn<Resource>[] = [
    { key: 'title', title: 'Resource Title' },
    { key: 'type', title: 'Type', render: (value) => <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500">{value}</Badge> },
    { key: 'downloads', title: 'Downloads', render: (value) => `${Number(value).toLocaleString()}` },
    { key: 'lastUpdated', title: 'Last Updated', render: (value) => new Date(String(value)).toLocaleDateString() },
  ];

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
    <WorkspaceLayout title="Community Dashboard" subtitle="Engage with community programs and track participation" userType="community">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetricCard title="Active Programs" value={activePrograms} change={12.5} icon={GraduationCap} iconColor="text-emerald-500" trend="up" description="Programs currently running" />
          <DashboardMetricCard title="Total Participants" value={totalParticipants} change={8.3} icon={Users} iconColor="text-blue-500" trend="up" description="People engaged in programs" />
          <DashboardMetricCard title="Completed Programs" value={completedPrograms} change={15.2} icon={Award} iconColor="text-purple-500" trend="up" description="Programs successfully finished" />
          <DashboardMetricCard title="Resource Downloads" value={5134} change={22.1} icon={BookOpen} iconColor="text-amber-500" trend="up" description="Educational materials accessed" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardTable title="Active Programs" icon={GraduationCap} iconColor="text-emerald-500" columns={programColumns} data={programs} emptyMessage="No active programs. Start a new program today!" />
          <DashboardTable title="Educational Resources" icon={BookOpen} iconColor="text-purple-500" columns={resourceColumns} data={resources} emptyMessage="No resources available." />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button size="lg" className="gap-2 h-auto py-6 flex-col"><Plus className="w-6 h-6" /><span>New Program</span></Button>
            <Button variant="outline" size="lg" className="gap-2 h-auto py-6 flex-col"><FileText className="w-6 h-6" /><span>Add Resource</span></Button>
            <Button variant="outline" size="lg" className="gap-2 h-auto py-6 flex-col"><MessageSquare className="w-6 h-6" /><span>Send Announcement</span></Button>
            <Button variant="outline" size="lg" className="gap-2 h-auto py-6 flex-col"><Globe className="w-6 h-6" /><span>View Community</span></Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Program Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center"><GraduationCap className="w-6 h-6 text-emerald-500" /></div>
                  <div><h3 className="font-semibold text-white">Education</h3><p className="text-sm text-slate-400">3 active programs</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">School programs, youth education, and community workshops</p>
                <Progress value={75} className="h-2 mb-2" />
                <Button variant="ghost" size="sm" className="gap-1 w-full">View Programs <ArrowUpRight className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center"><Users className="w-6 h-6 text-blue-500" /></div>
                  <div><h3 className="font-semibold text-white">Community</h3><p className="text-sm text-slate-400">2 active programs</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Community engagement, local initiatives, and cooperative projects</p>
                <Progress value={60} className="h-2 mb-2" />
                <Button variant="ghost" size="sm" className="gap-1 w-full">View Programs <ArrowUpRight className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center"><Heart className="w-6 h-6 text-purple-500" /></div>
                  <div><h3 className="font-semibold text-white">Training</h3><p className="text-sm text-slate-400">4 active programs</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Skill development, capacity building, and technical training</p>
                <Progress value={45} className="h-2 mb-2" />
                <Button variant="ghost" size="sm" className="gap-1 w-full">View Programs <ArrowUpRight className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0"><Calendar className="w-5 h-5 text-emerald-500" /></div>
                  <div><h3 className="font-semibold text-white">Community Meeting</h3><p className="text-sm text-slate-400">Feb 5, 2025</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Monthly community gathering to discuss regenerative initiatives</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">45 attending</Badge>
                  <Button variant="ghost" size="sm" className="gap-1">Details <ArrowUpRight className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0"><GraduationCap className="w-5 h-5 text-blue-500" /></div>
                  <div><h3 className="font-semibold text-white">Training Workshop</h3><p className="text-sm text-slate-400">Feb 10, 2025</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Sustainable farming techniques for local producers</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">78 spots left</Badge>
                  <Button variant="ghost" size="sm" className="gap-1">Register <ArrowUpRight className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0"><Heart className="w-5 h-5 text-purple-500" /></div>
                  <div><h3 className="font-semibold text-white">Impact Showcase</h3><p className="text-sm text-slate-400">Feb 15, 2025</p></div>
                </div>
                <p className="text-sm text-slate-400 mb-4">Present community achievements and success stories</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">Free event</Badge>
                  <Button variant="ghost" size="sm" className="gap-1">Learn More <ArrowUpRight className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};

export default CommunityDashboard;
