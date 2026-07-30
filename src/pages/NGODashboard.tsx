import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  CheckCircle,
  Plus,
  FileText,
  ArrowUpRight,
  BookOpen,
  Globe,
  Award,
  BarChart3,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard, DashboardTable, type TableColumn } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface ResearchProject {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'completed' | 'upcoming';
  participants: number;
  startDate: string;
  progress: number;
}

interface Publication {
  id: string;
  title: string;
  type: string;
  downloads: number;
  lastUpdated: string;
}

const NGODashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const navigate = useNavigate();
  
  // Use enhanced auth for demo mode, fallback to regular auth
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }

    // Mock data for demo
    const mockResearchProjects: ResearchProject[] = [
      {
        id: '1',
        title: 'Regenerative Agriculture Impact Study',
        type: 'Research',
        participants: 245,
        status: 'active',
        startDate: '2025-01-15',
        progress: 75,
      },
      {
        id: '2',
        title: 'Biodiversity Assessment Protocol',
        type: 'Protocol',
        participants: 189,
        status: 'active',
        startDate: '2025-01-20',
        progress: 60,
      },
      {
        id: '3',
        title: 'Community Engagement Framework',
        type: 'Framework',
        participants: 312,
        status: 'completed',
        startDate: '2024-11-10',
        progress: 100,
      },
      {
        id: '4',
        title: 'Climate Resilience Modeling',
        type: 'Modeling',
        participants: 156,
        status: 'upcoming',
        startDate: '2025-02-15',
        progress: 0,
      },
      {
        id: '5',
        title: 'Ethical AI Guidelines Development',
        type: 'Guidelines',
        participants: 87,
        status: 'completed',
        startDate: '2024-09-20',
        progress: 100,
      },
    ];

    const mockPublications: Publication[] = [
      {
        id: '1',
        title: 'Regenerative Farming Handbook',
        type: 'PDF',
        downloads: 1247,
        lastUpdated: '2025-01-28',
      },
      {
        id: '2',
        title: 'Biodiversity Measurement Guide',
        type: 'PDF',
        downloads: 892,
        lastUpdated: '2025-01-25',
      },
      {
        id: '3',
        title: 'Community Engagement Toolkit',
        type: 'PDF',
        downloads: 654,
        lastUpdated: '2025-01-20',
      },
      {
        id: '4',
        title: 'Climate Adaptation Strategies',
        type: 'PDF',
        downloads: 2341,
        lastUpdated: '2025-01-15',
      },
    ];

    setResearchProjects(mockResearchProjects);
    setPublications(mockPublications);
    setActiveProjects(2);
    setTotalParticipants(989);
    setCompletedProjects(2);
  }, [user, loading, navigate]);

  const projectColumns: TableColumn<ResearchProject>[] = [
    {
      key: 'title',
      title: 'Project Title',
    },
    {
      key: 'type',
      title: 'Type',
      render: (value) => (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500">
          {value}
        </Badge>
      ),
    },
    {
      key: 'participants',
      title: 'Participants',
      render: (value) => `${value} researchers`,
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => {
        const statusConfig = {
          active: { color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
          completed: { color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle },
          upcoming: { color: 'bg-purple-500/10 text-purple-500', icon: Calendar },
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
      key: 'startDate',
      title: 'Start Date',
      render: (value) => new Date(String(value)).toLocaleDateString(),
    },
  ];

  const publicationColumns: TableColumn<Publication>[] = [
    {
      key: 'title',
      title: 'Publication Title',
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
      key: 'downloads',
      title: 'Downloads',
      render: (value) => `${value.toLocaleString()}`,
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      render: (value) => new Date(value).toLocaleDateString(),
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
      title="NGO Dashboard"
      subtitle="Grant management, impact reporting, and donor relations"
      userType="ngo"
    >
      <div className="space-y-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-2">
                NGO Dashboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Research projects and educational resources
              </p>
            </motion.div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardMetricCard
              title="Active Projects"
              value={activeProjects}
              change={10.5}
              icon={BookOpen}
              iconColor="text-emerald-500"
              trend="up"
              description="Research projects currently running"
            />
            <DashboardMetricCard
              title="Total Participants"
              value={totalParticipants}
              change={8.3}
              icon={Users}
              iconColor="text-blue-500"
              trend="up"
              description="Researchers and partners engaged"
            />
            <DashboardMetricCard
              title="Completed Projects"
              value={completedProjects}
              change={15.2}
              icon={Award}
              iconColor="text-purple-500"
              trend="up"
              description="Successfully finished research"
            />
            <DashboardMetricCard
              title="Publications"
              value="5134"
              change={22.1}
              icon={FileText}
              iconColor="text-amber-500"
              trend="up"
              description="Educational materials accessed"
            />
          </div>

          {/* Research Projects */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Research Projects</h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </div>
            <DashboardTable
              title="Active Research Projects"
              icon={BookOpen}
              iconColor="text-emerald-500"
              columns={projectColumns}
              data={researchProjects}
              onRowClick={(project) => console.log('View project:', project.id)}
              emptyMessage="No active projects. Start a new research project today!"
            />
          </div>

          {/* Publications */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Publications</h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Publication
              </Button>
            </div>
            <DashboardTable
              title="Educational Resources"
              icon={FileText}
              iconColor="text-blue-500"
              columns={publicationColumns}
              data={publications}
              onRowClick={(pub) => console.log('View publication:', pub.id)}
              emptyMessage="No publications available."
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
                  <span>New Research Project</span>
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
                  <span>Add Publication</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Globe className="w-6 h-6" />
                  <span>View Community</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Send Announcement</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Research Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Research Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Regenerative Agriculture</h3>
                      <p className="text-sm text-muted-foreground">2 active projects</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sustainable farming practices and soil health research
                  </p>
                  <Progress value={75} className="h-2 mb-2" />
                  <Button variant="ghost" size="sm" className="gap-1 w-full">
                    View Projects <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Biodiversity</h3>
                      <p className="text-sm text-muted-foreground">1 active project</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Species conservation and ecosystem monitoring
                  </p>
                  <Progress value={60} className="h-2 mb-2" />
                  <Button variant="ghost" size="sm" className="gap-1 w-full">
                    View Projects <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Community Engagement</h3>
                      <p className="text-sm text-muted-foreground">2 active projects</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Local community empowerment and education programs
                  </p>
                  <Progress value={100} className="h-2 mb-2" />
                  <Button variant="ghost" size="sm" className="gap-1 w-full">
                    View Projects <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Research Symposium</h3>
                      <p className="text-sm text-muted-foreground">Feb 15, 2025</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Annual regenerative research conference
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/10 text-emerald-500">
                      45 attending
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Register <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Workshop Series</h3>
                      <p className="text-sm text-muted-foreground">Feb 20, 2025</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Community engagement and capacity building
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500/10 text-blue-500">
                      30 spots
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Register <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Publication Launch</h3>
                      <p className="text-sm text-muted-foreground">Feb 25, 2025</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    New research findings and guidelines release
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-500/10 text-purple-500">
                      Open to all
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Details <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export default NGODashboard;
