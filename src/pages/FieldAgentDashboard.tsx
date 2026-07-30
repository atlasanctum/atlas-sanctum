import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Upload,
  Camera,
  Leaf,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  FileText,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard, DashboardChart, DashboardTable, type TableColumn } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'active' | 'pending' | 'completed' | 'review';
  progress: number;
  lastUpdate: string;
  dataPoints: number;
}

interface DataCollection {
  id: string;
  project: string;
  type: string;
  date: string;
  status: 'submitted' | 'verified' | 'rejected';
}

const FieldAgentDashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const navigate = useNavigate();
  
  // Use enhanced auth for demo mode, fallback to regular auth
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;
  const [projects, setProjects] = useState<Project[]>([]);
  const [dataCollections, setDataCollections] = useState<DataCollection[]>([]);
  const [activeProjects, setActiveProjects] = useState(0);
  const [pendingData, setPendingData] = useState(0);
  const [verifiedData, setVerifiedData] = useState(0);
  const [totalArea, setTotalArea] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }

    // Mock data for demo
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Amazon Rainforest Monitoring',
        location: 'Amazon Basin, Brazil',
        type: 'Forest Conservation',
        status: 'active',
        progress: 75,
        lastUpdate: '2025-01-30',
        dataPoints: 245,
      },
      {
        id: '2',
        name: 'Coral Reef Assessment',
        location: 'Great Barrier Reef, Australia',
        type: 'Marine Conservation',
        status: 'active',
        progress: 60,
        lastUpdate: '2025-01-29',
        dataPoints: 189,
      },
      {
        id: '3',
        name: 'Sustainable Agriculture Tracking',
        location: 'Nairobi, Kenya',
        type: 'Agriculture',
        status: 'pending',
        progress: 30,
        lastUpdate: '2025-01-28',
        dataPoints: 87,
      },
      {
        id: '4',
        name: 'Wetland Restoration',
        location: 'Florida Everglades, USA',
        type: 'Ecosystem Restoration',
        status: 'review',
        progress: 90,
        lastUpdate: '2025-01-25',
        dataPoints: 312,
      },
      {
        id: '5',
        name: 'Urban Green Spaces',
        location: 'Tokyo, Japan',
        type: 'Urban Forestry',
        status: 'completed',
        progress: 100,
        lastUpdate: '2025-01-20',
        dataPoints: 156,
      },
    ];

    const mockDataCollections: DataCollection[] = [
      {
        id: '1',
        project: 'Amazon Rainforest Monitoring',
        type: 'Soil Sample',
        date: '2025-01-30',
        status: 'verified',
      },
      {
        id: '2',
        project: 'Coral Reef Assessment',
        type: 'Water Quality',
        date: '2025-01-29',
        status: 'verified',
      },
      {
        id: '3',
        project: 'Sustainable Agriculture',
        type: 'Growth Measurement',
        date: '2025-01-28',
        status: 'submitted',
      },
      {
        id: '4',
        project: 'Wetland Restoration',
        type: 'Biodiversity Survey',
        date: '2025-01-25',
        status: 'verified',
      },
      {
        id: '5',
        project: 'Urban Green Spaces',
        type: 'Tree Health',
        date: '2025-01-20',
        status: 'verified',
      },
    ];

    setProjects(mockProjects);
    setDataCollections(mockDataCollections);
    setActiveProjects(2);
    setPendingData(1);
    setVerifiedData(4);
    setTotalArea(12500);
  }, [user, loading, navigate]);

  const projectColumns: TableColumn<Project>[] = [
    {
      key: 'name',
      title: 'Project Name',
    },
    {
      key: 'location',
      title: 'Location',
      render: (value) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'type',
      title: 'Type',
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
      key: 'status',
      title: 'Status',
      render: (value) => {
        const statusConfig = {
          active: { color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
          pending: { color: 'bg-amber-500/10 text-amber-500', icon: Clock },
          completed: { color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle },
          review: { color: 'bg-purple-500/10 text-purple-500', icon: AlertTriangle },
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
      key: 'lastUpdate',
      title: 'Last Update',
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const dataCollectionColumns: TableColumn<DataCollection>[] = [
    {
      key: 'project',
      title: 'Project',
    },
    {
      key: 'type',
      title: 'Data Type',
    },
    {
      key: 'date',
      title: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => {
        const statusConfig = {
          submitted: { color: 'bg-amber-500/10 text-amber-500' },
          verified: { color: 'bg-emerald-500/10 text-emerald-500' },
          rejected: { color: 'bg-red-500/10 text-red-500' },
        };
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <Badge className={config.color}>
            {value}
          </Badge>
        );
      },
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
      title="Field Agent Dashboard"
      subtitle="Manage projects and collect regenerative impact data"
      userType="field-agent"
    >
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardMetricCard
              title="Active Projects"
              value={activeProjects}
              change={10.5}
              icon={ClipboardList}
              iconColor="text-emerald-500"
              trend="up"
              description="Projects currently being monitored"
            />
            <DashboardMetricCard
              title="Data Points Collected"
              value={989}
              change={15.2}
              icon={BarChart3}
              iconColor="text-blue-500"
              trend="up"
              description="Total measurements recorded"
            />
            <DashboardMetricCard
              title="Pending Verification"
              value={pendingData}
              change={-5.3}
              icon={Clock}
              iconColor="text-amber-500"
              trend="down"
              description="Data awaiting verification"
            />
            <DashboardMetricCard
              title="Area Monitored"
              value={`${totalArea.toLocaleString()} ha`}
              change={8.7}
              icon={MapPin}
              iconColor="text-purple-500"
              trend="up"
              description="Total hectares under observation"
            />
          </div>

          {/* Projects Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DashboardTable
              title="Active Projects"
              icon={ClipboardList}
              iconColor="text-emerald-500"
              columns={projectColumns}
              data={projects}
              onRowClick={(project) => console.log('View project:', project.id)}
              emptyMessage="No active projects. Start a new project today!"
            />

            <DashboardTable
              title="Recent Data Collections"
              icon={FileText}
              iconColor="text-blue-500"
              columns={dataCollectionColumns}
              data={dataCollections}
              onRowClick={(data) => console.log('View data:', data.id)}
              emptyMessage="No data collections yet."
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
                  <Upload className="w-6 h-6" />
                  <span>Upload Data</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  <span>Capture Photo</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <Leaf className="w-6 h-6" />
                  <span>Record Measurement</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Project Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DashboardChart
              title="Project Status Distribution"
              icon={TrendingUp}
              iconColor="text-emerald-500"
              description="Overview of all project statuses"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                    <div>
                      <p className="font-semibold">Active Projects</p>
                      <p className="text-sm text-muted-foreground">Currently in progress</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-emerald-500">2</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-amber-500" />
                    <div>
                      <p className="font-semibold">Pending Projects</p>
                      <p className="text-sm text-muted-foreground">Awaiting approval</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-amber-500">1</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-semibold">Completed Projects</p>
                      <p className="text-sm text-muted-foreground">Successfully finished</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-500">1</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="font-semibold">Under Review</p>
                      <p className="text-sm text-muted-foreground">Verification pending</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-purple-500">1</span>
                </div>
              </div>
            </DashboardChart>

            <DashboardChart
              title="Data Collection Trends"
              icon={BarChart3}
              iconColor="text-blue-500"
              description="Your data collection activity over time"
            >
              <div className="space-y-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{month}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 100 + 50)} data points
                      </span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 40 + 60)} className="h-2" />
                  </div>
                ))}
              </div>
            </DashboardChart>
          </div>

          {/* Upcoming Tasks */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Upcoming Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Monthly Soil Sample</h3>
                      <p className="text-sm text-muted-foreground">Amazon Rainforest</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Collect soil samples from 5 monitoring points
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/10 text-emerald-500">
                      Due Tomorrow
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Photo Documentation</h3>
                      <p className="text-sm text-muted-foreground">Coral Reef</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Capture before/after photos of restoration area
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500/10 text-blue-500">
                      Due in 3 days
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Community Meeting</h3>
                      <p className="text-sm text-muted-foreground">Sustainable Agriculture</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Meet with local farmers to discuss progress
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-500/10 text-purple-500">
                      Due in 5 days
                    </Badge>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    );
  };

  export default FieldAgentDashboard;
