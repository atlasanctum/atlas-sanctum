// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  FileText,
  Globe,
  Zap,
  BarChart3,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardMetricCard, DashboardChart, DashboardTable, type TableColumn } from '@/components/dashboard/shared';
import WorkspaceLayout from '@/components/WorkspaceLayout';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { useIsAdmin } from '@/hooks/useAdmin';

interface SystemMetric {
  category: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  change?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  projects: number;
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'data';
  severity: 'high' | 'medium' | 'low';
  message: string;
  time: string;
}

const AdministratorDashboard = () => {
  const { user, loading } = useAuth();
  const { user: enhancedUser, loading: enhancedLoading } = useEnhancedAuth();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  
  // Use enhanced auth for demo mode, fallback to regular auth
  const currentUser = enhancedUser || user;
  const isLoading = enhancedLoading || loading;
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [apiRequests, setApiRequests] = useState(0);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/auth');
      return;
    }

    if (!isAdmin && currentUser?.role !== 'administrator' && currentUser?.role !== 'super_admin') {
      navigate('/dashboard');
      return;
    }

    // Mock data for demo
    const mockSystemMetrics: SystemMetric[] = [
      { category: 'Server Uptime', value: '99.9%', status: 'healthy', change: 0.1 },
      { category: 'API Response Time', value: '45ms', status: 'healthy', change: -5.2 },
      { category: 'Database Performance', value: '92%', status: 'healthy', change: 2.1 },
      { category: 'Storage Usage', value: '67%', status: 'warning', change: 8.5 },
      { category: 'Memory Usage', value: '78%', status: 'healthy', change: -3.2 },
      { category: 'Active Connections', value: 1247, status: 'healthy', change: 12.4 },
    ];

    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'Administrator',
        status: 'active',
        lastActive: '2025-01-31 10:30',
        projects: 12,
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'Field Agent',
        status: 'active',
        lastActive: '2025-01-31 09:15',
        projects: 8,
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael@example.com',
        role: 'Donor',
        status: 'active',
        lastActive: '2025-01-30 16:45',
        projects: 5,
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'Field Agent',
        status: 'inactive',
        lastActive: '2025-01-25 14:20',
        projects: 3,
      },
      {
        id: '5',
        name: 'Robert Wilson',
        email: 'robert@example.com',
        role: 'Donor',
        status: 'suspended',
        lastActive: '2025-01-20 11:00',
        projects: 2,
      },
    ];

    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'security',
        severity: 'high',
        message: 'Unusual login activity detected from IP 192.168.1.100',
        time: '2025-01-31 10:45',
      },
      {
        id: '2',
        type: 'performance',
        severity: 'medium',
        message: 'API response time increased by 15% in last hour',
        time: '2025-01-31 09:30',
      },
      {
        id: '3',
        type: 'data',
        severity: 'low',
        message: 'Scheduled database backup completed successfully',
        time: '2025-01-31 08:00',
      },
    ];

    setSystemMetrics(mockSystemMetrics);
    setUsers(mockUsers);
    setAlerts(mockAlerts);
    setTotalUsers(15247);
    setActiveUsers(3842);
    setSystemHealth(98.5);
    setApiRequests(124567);
  }, [user, loading, isAdmin, navigate]);

  const userColumns: TableColumn<User>[] = [
    {
      key: 'name',
      title: 'Name',
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'role',
      title: 'Role',
      render: (value) => (
        <Badge
          variant="outline"
          className={
            value === 'Administrator'
              ? 'bg-purple-500/10 text-purple-500 border-purple-500'
              : value === 'Field Agent'
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500'
              : 'bg-blue-500/10 text-blue-500 border-blue-500'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => {
        const statusConfig = {
          active: { color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
          inactive: { color: 'bg-slate-500/10 text-slate-500', icon: Clock },
          suspended: { color: 'bg-red-500/10 text-red-500', icon: XCircle },
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
      key: 'projects',
      title: 'Projects',
      render: (value) => `${value} active`,
    },
    {
      key: 'lastActive',
      title: 'Last Active',
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  const alertColumns: TableColumn<SystemAlert>[] = [
    {
      key: 'type',
      title: 'Type',
      render: (value) => {
        const typeConfig = {
          security: { color: 'bg-red-500/10 text-red-500', icon: Shield },
          performance: { color: 'bg-amber-500/10 text-amber-500', icon: Zap },
          data: { color: 'bg-blue-500/10 text-blue-500', icon: Database },
        };
        const config = typeConfig[value as keyof typeof typeConfig];
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
      key: 'severity',
      title: 'Severity',
      render: (value) => {
        const severityConfig = {
          high: { color: 'bg-red-500/10 text-red-500' },
          medium: { color: 'bg-amber-500/10 text-amber-500' },
          low: { color: 'bg-blue-500/10 text-blue-500' },
        };
        const config = severityConfig[value];
        return (
          <Badge className={config.color}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: 'message',
      title: 'Message',
    },
    {
      key: 'time',
      title: 'Time',
      render: (value) => new Date(value).toLocaleString(),
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <Lock className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            Administrator privileges are required to access this dashboard.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <WorkspaceLayout
      title="Administrator Dashboard"
      subtitle="System oversight and user management"
      userType="administrator"
    >
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardMetricCard
              title="Total Users"
              value={totalUsers}
              change={8.2}
              icon={Users}
              iconColor="text-emerald-500"
              trend="up"
              description="Registered users across all segments"
            />
            <DashboardMetricCard
              title="Active Users"
              value={activeUsers}
              change={12.5}
              icon={Activity}
              iconColor="text-blue-500"
              trend="up"
              description="Users active in last 24 hours"
            />
            <DashboardMetricCard
              title="System Health"
              value={`${systemHealth}%`}
              change={0.5}
              icon={Server}
              iconColor="text-emerald-500"
              trend="up"
              description="Overall system performance score"
            />
            <DashboardMetricCard
              title="API Requests"
              value={apiRequests.toLocaleString()}
              change={15.3}
              icon={Zap}
              iconColor="text-purple-500"
              trend="up"
              description="Requests in last 24 hours"
            />
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <DashboardChart
              title="System Metrics"
              icon={Server}
              iconColor="text-emerald-500"
              description="Real-time system performance indicators"
            >
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{metric.value}</span>
                        {metric.change !== undefined && (
                          <span
                            className={`text-xs ${
                              metric.change > 0 ? 'text-emerald-500' : 'text-red-500'
                            }`}
                          >
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={typeof metric.value === 'number' ? 75 : 85}
                        className={`h-2 flex-1 ${
                          metric.status === 'healthy'
                            ? 'bg-emerald-500'
                            : metric.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                      {metric.status === 'healthy' && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                      {metric.status === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                      {metric.status === 'critical' && (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardChart>

            <DashboardChart
              title="System Alerts"
              icon={AlertTriangle}
              iconColor="text-amber-500"
              description="Recent system notifications and alerts"
            >
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high'
                        ? 'bg-red-500/10 border-red-500'
                        : alert.severity === 'medium'
                        ? 'bg-amber-500/10 border-amber-500'
                        : 'bg-blue-500/10 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {alert.type === 'security' && (
                          <Shield className="w-5 h-5 text-red-500" />
                        )}
                        {alert.type === 'performance' && (
                          <Zap className="w-5 h-5 text-amber-500" />
                        )}
                        {alert.type === 'data' && (
                          <Database className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardChart>
          </div>

          {/* User Management */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">User Management</h2>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </div>
            <DashboardTable
              title="Recent Users"
              icon={Users}
              iconColor="text-emerald-500"
              columns={userColumns}
              data={users}
              onRowClick={(user) => console.log('View user:', user.id)}
              emptyMessage="No users found"
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
                <a href="/admin" className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <span>System Settings</span>
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
                  <span>View Reports</span>
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
                  <span>Analytics</span>
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 h-auto py-6 flex-col"
              >
                <a href="#" className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>Performance</span>
                </a>
              </Button>
            </div>
          </div>

          {/* User Segments Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">User Segments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Producers</h3>
                      <p className="text-sm text-muted-foreground">3,245 users</p>
                    </div>
                  </div>
                  <Progress value={65} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">65% active this month</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Communities</h3>
                      <p className="text-sm text-muted-foreground">2,891 users</p>
                    </div>
                  </div>
                  <Progress value={72} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">72% active this month</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Investors</h3>
                      <p className="text-sm text-muted-foreground">1,567 users</p>
                    </div>
                  </div>
                  <Progress value={58} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">58% active this month</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Governments</h3>
                      <p className="text-sm text-muted-foreground">892 users</p>
                    </div>
                  </div>
                  <Progress value={45} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">45% active this month</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    );
  };

  export default AdministratorDashboard;
