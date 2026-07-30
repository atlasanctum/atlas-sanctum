import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useAuth } from '@/hooks/useAuth';
import { useSocket, useRealtimeNotifications, useRealtimeMarketplace, useRealtimeGovernance } from '@/hooks/useSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Leaf,
  BarChart3,
  Users,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
} from 'lucide-react';
import Header from '@/components/EnterpriseHeader';
import Footer from '@/components/Footer';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface KPIMetric {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'trade' | 'project' | 'user' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Real-time hooks
  const { isConnected } = useSocket({ channels: ['notifications', 'marketplace', 'governance'] });
  const { notifications } = useRealtimeNotifications();
  const { marketplaceActivity } = useRealtimeMarketplace();
  const { governanceUpdates } = useRealtimeGovernance();

  // Mock data - replace with API calls
  const [kpiData, setKpiData] = useState<KPIMetric[]>([
    {
      label: 'RIU Circulation',
      value: '2,450,000',
      change: '+12.5%',
      changeType: 'positive',
      icon: Leaf,
      color: 'text-green-600',
    },
    {
      label: 'Trading Volume',
      value: '$1,250,000',
      change: '+8.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      label: 'Active Projects',
      value: '156',
      change: '+5',
      changeType: 'positive',
      icon: Activity,
      color: 'text-purple-600',
    },
    {
      label: 'Total Users',
      value: '12,847',
      change: '+15.2%',
      changeType: 'positive',
      icon: Users,
      color: 'text-orange-600',
    },
  ]);

  const [marketTrendsData, setMarketTrendsData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'RIU Price',
        data: [45, 52, 48, 61, 55, 67, 72],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      },
      {
        label: 'Trading Volume',
        data: [120000, 150000, 180000, 140000, 200000, 170000, 220000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  });

  const [co2ReductionsData, setCo2ReductionsData] = useState<ChartData>({
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'CO2 Reductions (tons)',
        data: [12500, 15800, 18200, 22100],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'trade',
      title: 'Large RIU Trade Executed',
      description: '500,000 RIU traded between institutional investors',
      timestamp: '2 minutes ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'project',
      title: 'New Carbon Project Verified',
      description: 'Amazon Restoration Project #47 approved and listed',
      timestamp: '15 minutes ago',
      status: 'success',
    },
    {
      id: '3',
      type: 'user',
      title: 'User Registration Spike',
      description: '247 new users registered in the last hour',
      timestamp: '1 hour ago',
      status: 'success',
    },
    {
      id: '4',
      type: 'system',
      title: 'System Maintenance Completed',
      description: 'Scheduled maintenance window closed successfully',
      timestamp: '3 hours ago',
      status: 'success',
    },
  ]);

  // Combine real-time activity with static data
  const combinedActivity = useMemo(() => {
    const realtimeItems: ActivityItem[] = [];

    // Convert notifications to activity items
    notifications.slice(0, 5).forEach(notification => {
      realtimeItems.push({
        id: `notification-${notification.id}`,
        type: 'system' as const,
        title: notification.title,
        description: notification.message,
        timestamp: 'Just now',
        status: 'success' as const,
      });
    });

    // Convert marketplace activity to activity items
    marketplaceActivity.slice(0, 5).forEach(activity => {
      let title = '';
      let description = '';

      switch (activity.type) {
        case 'listing_created':
          title = 'New RIU Listing';
          description = `${activity.data.quantity} RIUs listed at $${activity.data.price}`;
          break;
        case 'purchase':
          title = 'RIU Purchase Completed';
          description = `${activity.data.quantity} RIUs purchased for $${activity.data.amount}`;
          break;
        default:
          title = 'Marketplace Activity';
          description = `${activity.type} event occurred`;
      }

      realtimeItems.push({
        id: `marketplace-${activity.listingId}-${Date.now()}`,
        type: 'trade' as const,
        title,
        description,
        timestamp: 'Just now',
        status: 'success' as const,
      });
    });

    // Convert governance updates to activity items
    governanceUpdates.slice(0, 3).forEach(update => {
      let title = '';
      let description = '';

      switch (update.type) {
        case 'created':
          title = 'New Governance Proposal';
          description = `Proposal "${update.proposal?.title || 'Unknown'}" created`;
          break;
        case 'voted':
          title = 'Governance Vote Cast';
          description = `Vote cast on proposal ${update.proposalId}`;
          break;
        default:
          title = 'Governance Update';
          description = `Proposal ${update.proposalId} ${update.type}`;
      }

      realtimeItems.push({
        id: `governance-${update.proposalId}-${Date.now()}`,
        type: 'system' as const,
        title,
        description,
        timestamp: 'Just now',
        status: 'success' as const,
      });
    });

    // Combine and limit to 20 items
    return [...realtimeItems, ...recentActivity].slice(0, 20);
  }, [notifications, marketplaceActivity, governanceUpdates, recentActivity]);

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Attempt to load real data from backend endpoints. If any call fails,
        // we fall back to the in-file mock data so the dashboard still renders.
        const endpoints = [
          '/api/dashboard/kpis',
          '/api/dashboard/market-trends',
          '/api/dashboard/co2-reductions',
          '/api/dashboard/recent-activity',
        ];

        const results = await Promise.allSettled(endpoints.map(ep => fetch(ep)));

        // Helper to safely parse JSON from a settled fetch
        const parseIfOk = async (res: PromiseSettledResult<Response> | undefined) => {
          if (!res || res.status !== 'fulfilled') return null;
          const response = res.value;
          if (!response.ok) return null;
          try {
            return await response.json();
          } catch {
            return null;
          }
        };

        const [kpiJson, trendsJson, co2Json, activityJson] = await Promise.all(
          results.map(r => parseIfOk(r))
        );

        if (kpiJson && Array.isArray(kpiJson)) {
          setKpiData(kpiJson as KPIMetric[]);
        }

        if (trendsJson && typeof trendsJson === 'object') {
          setMarketTrendsData(trendsJson as ChartData);
        }

        if (co2Json && typeof co2Json === 'object') {
          setCo2ReductionsData(co2Json as ChartData);
        }

        if (activityJson && Array.isArray(activityJson)) {
          setRecentActivity(activityJson as ActivityItem[]);
        }

        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }), []);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">Please sign in to view the dashboard.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Dashboard</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">
                Real-time analytics and platform insights
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                      </div>
                      <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                    </div>
                    <div className="flex items-center mt-4">
                      {kpi.changeType === 'positive' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : kpi.changeType === 'negative' ? (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      ) : null}
                      <span
                        className={`text-sm font-medium ${
                          kpi.changeType === 'positive'
                            ? 'text-green-500'
                            : kpi.changeType === 'negative'
                            ? 'text-red-500'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {kpi.change}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">vs last period</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>RIU price and trading volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line data={marketTrendsData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CO2 Reductions</CardTitle>
                <CardDescription>Quarterly carbon offset achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar data={co2ReductionsData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {combinedActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.status === 'success' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : activity.status === 'warning' ? (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Personalized Widgets */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Review Projects
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardOverview;