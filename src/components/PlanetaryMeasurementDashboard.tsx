import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Activity, Leaf, Thermometer, Droplets, Cloud, TrendingUp, TrendingDown, Bell, CheckCircle, Clock, Download, RefreshCw, Eye, Trees, Bug } from 'lucide-react';

// ============================================
// Type Definitions
// ============================================

interface EnvironmentalDashboardData {
  carbon: {
    totalMeasurements: number;
    averageNEE: number;
    averageSequestration: number;
    carbonSinkRegions: number;
    carbonSourceRegions: number;
    netCarbonStatus: string;
    monthlyTrends: Array<{ month: string; sequestration: number }>;
  };
  deforestation: {
    activeAlerts: number;
    critical: number;
    recentAlerts: Array<{
      id: string;
      alertType: string;
      severity: string;
      detectionDate: string;
      estimatedAreaHectares: number;
      location: string;
    }>;
  };
  biodiversity: {
    totalRecords: number;
    uniqueSpecies: number;
    averageDiversity: number;
    totalIndividuals: number;
    averageConfidence: number;
    byMonitoringType: Array<{ type: string; records: number; species: number; diversity: number }>;
    monthlyTrends: Array<{ month: string; diversity: number; richness: number }>;
  };
  soil: {
    totalStations: number;
    averages: {
      moisture: number;
      ph: number;
      organicMatter: number;
      microbialBiomass: number;
      quality: number;
    };
    trends: Array<{ day: string; moisture: number; ph: number; organicMatter: number }>;
  };
  alerts: {
    total: number;
    critical: number;
    recent: Array<{
      id: string;
      alertType: string;
      category: string;
      severity: string;
      title: string;
      description: string;
      triggeredAt: string;
      acknowledged: boolean;
    }>;
  };
  lastUpdated: string;
}

interface Alert {
  id: string;
  alertType: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  triggeredAt: string;
  acknowledged: boolean;
}

const COLORS = {
  primary: '#10B981',
  secondary: '#3B82F6',
  warning: '#F59E0B',
  danger: '#EF4444',
  success: '#22C55E',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899'
};

// ============================================
// API Functions
// ============================================

const fetchDashboardData = async (): Promise<EnvironmentalDashboardData> => {
  const response = await fetch('/api/v3/measurements/dashboard');
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
};

const fetchAlerts = async (severity?: string): Promise<Alert[]> => {
  const params = severity ? `?severity=${severity}` : '';
  const response = await fetch(`/api/v3/measurements/alerts${params}`);
  if (!response.ok) throw new Error('Failed to fetch alerts');
  const data = await response.json();
  return data.alerts;
};

const acknowledgeAlert = async (alertId: string, userId: string): Promise<void> => {
  const response = await fetch(`/api/v3/measurements/alerts/${alertId}/acknowledge`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  if (!response.ok) throw new Error('Failed to acknowledge alert');
};

const exportReport = async (regionId: string, reportType: string, startDate: string, endDate: string): Promise<void> => {
  const response = await fetch('/api/v3/measurements/reports/compliance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regionId, reportType, startDate, endDate, format: 'pdf' })
  });
  if (!response.ok) throw new Error('Failed to generate report');
  const data = await response.json();
  // In production, this would trigger a download
  console.log('Report generated:', data.report.reportId);
};

// ============================================
// Dashboard Component
// ============================================

const PlanetaryMeasurementDashboard: React.FC = () => {
  const [data, setData] = useState<EnvironmentalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'carbon' | 'biodiversity' | 'soil' | 'alerts'>('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardData, alertsData] = await Promise.all([
        fetchDashboardData(),
        fetchAlerts()
      ]);
      setData(dashboardData);
      setAlerts(alertsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [loadData]);

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeAlert(alertId, 'current-user');
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return COLORS.danger;
      case 'high': return COLORS.warning;
      case 'medium': return COLORS.secondary;
      default: return COLORS.success;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'carbon': return <Cloud size={16} className="text-blue-500" />;
      case 'biodiversity': return <Bug size={16} className="text-green-500" />;
      case 'soil': return <Droplets size={16} className="text-amber-500" />;
      case 'deforestation': return <Trees size={16} className="text-red-500" />;
      case 'fire': return <Activity size={16} className="text-orange-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-lg">Loading environmental data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <AlertTriangle size={48} className="mx-auto mb-4" />
          <p className="text-lg">Error: {error}</p>
          <button onClick={loadData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="text-green-500" />
            Planetary Measurement & Verification
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time environmental monitoring, carbon tracking, and ecosystem assessment
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={loadData}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <RefreshCw size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: <Activity size={18} /> },
          { id: 'carbon', label: 'Carbon Flux', icon: <Cloud size={18} /> },
          { id: 'biodiversity', label: 'Biodiversity', icon: <Bug size={18} /> },
          { id: 'soil', label: 'Soil Health', icon: <Droplets size={18} /> },
          { id: 'alerts', label: 'Alerts', icon: <Bell size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && data && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Carbon Sequestration"
              value={`${data.carbon.averageSequestration.toFixed(2)}`}
              unit="tCO2e/ha/yr"
              trend={data.carbon.netCarbonStatus === 'NET_SINK' ? 'up' : 'down'}
              icon={<Cloud className="text-blue-500" />}
              color="blue"
            />
            <MetricCard
              title="Active Alerts"
              value={`${data.alerts.total}`}
              unit={`${data.alerts.critical} critical`}
              trend={data.alerts.critical > 0 ? 'up' : 'stable'}
              icon={<Bell className="text-red-500" />}
              color={data.alerts.critical > 0 ? 'red' : 'green'}
            />
            <MetricCard
              title="Species Identified"
              value={data.biodiversity.uniqueSpecies.toLocaleString()}
              unit="unique species"
              trend="up"
              icon={<Bug className="text-green-500" />}
              color="green"
            />
            <MetricCard
              title="Soil Health Score"
              value={data.soil.averages.quality.toFixed(1)}
              unit="/100"
              trend={data.soil.averages.quality > 70 ? 'up' : 'down'}
              icon={<Droplets className="text-amber-500" />}
              color={data.soil.averages.quality > 70 ? 'green' : 'amber'}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carbon Trends */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Carbon Sequestration Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.carbon.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sequestration" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Biodiversity Trends */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Biodiversity Index</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.biodiversity.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="diversity" stroke={COLORS.success} strokeWidth={2} />
                  <Line type="monotone" dataKey="richness" stroke={COLORS.secondary} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Alerts</h3>
              <span className="text-sm text-gray-500">{data.alerts.total} active alerts</span>
            </div>
            <div className="space-y-3">
              {data.alerts.recent.slice(0, 5).map((alert: any) => (
                <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledgeAlert} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Carbon Tab */}
      {activeTab === 'carbon' && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Carbon Flux Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data.carbon.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Sequestration (tCO2e/ha)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sequestration" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Carbon Balance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Carbon Sink', value: data.carbon.carbonSinkRegions },
                      { name: 'Carbon Source', value: data.carbon.carbonSourceRegions }
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    <Cell fill={COLORS.success} />
                    <Cell fill={COLORS.danger} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <span className={`text-2xl font-bold ${data.carbon.netCarbonStatus === 'NET_SINK' ? 'text-green-500' : 'text-red-500'}`}>
                  {data.carbon.netCarbonStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Deforestation Alerts */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trees className="text-red-500" />
              Deforestation Alerts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Severity</th>
                    <th className="text-left p-3">Area (ha)</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.deforestation.recentAlerts.map(alert => (
                    <tr key={alert.id} className="border-b">
                      <td className="p-3 capitalize">{alert.alertType.replace('_', ' ')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold`} style={{ backgroundColor: getSeverityColor(alert.severity) + '20', color: getSeverityColor(alert.severity) }}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-3">{alert.estimatedAreaHectares.toLocaleString()}</td>
                      <td className="p-3">{alert.location}</td>
                      <td className="p-3">{new Date(alert.detectionDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        <button className="text-blue-500 hover:underline text-sm">Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Biodiversity Tab */}
      {activeTab === 'biodiversity' && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BiodiversityMetricCard
              title="Species Richness"
              value={data.biodiversity.uniqueSpecies.toLocaleString()}
              icon={<Bug className="text-green-500" />}
            />
            <BiodiversityMetricCard
              title="Diversity Index"
              value={data.biodiversity.averageDiversity.toFixed(2)}
              icon={<Leaf className="text-green-600" />}
            />
            <BiodiversityMetricCard
              title="Total Records"
              value={data.biodiversity.totalRecords.toLocaleString()}
              icon={<CheckCircle className="text-blue-500" />}
            />
            <BiodiversityMetricCard
              title="Avg Confidence"
              value={`${(data.biodiversity.averageConfidence * 100).toFixed(1)}%`}
              icon={<Eye className="text-purple-500" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Diversity Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.biodiversity.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="diversity" stroke={COLORS.success} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="richness" stroke={COLORS.secondary} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Monitoring Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.biodiversity.byMonitoringType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="records" fill={COLORS.primary} />
                  <Bar dataKey="species" fill={COLORS.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Soil Tab */}
      {activeTab === 'soil' && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <SoilMetricCard
              title="Moisture"
              value={`${data.soil.averages.moisture.toFixed(1)}%`}
              icon={<Droplets className="text-blue-500" />}
            />
            <SoilMetricCard
              title="pH Level"
              value={data.soil.averages.ph.toFixed(2)}
              icon={<Thermometer className="text-amber-500" />}
            />
            <SoilMetricCard
              title="Organic Matter"
              value={`${data.soil.averages.organicMatter.toFixed(1)}%`}
              icon={<Leaf className="text-green-500" />}
            />
            <SoilMetricCard
              title="Microbial Biomass"
              value={`${data.soil.averages.microbialBiomass.toFixed(0)} µgC/g`}
              icon={<Activity className="text-purple-500" />}
            />
            <SoilMetricCard
              title="Health Score"
              value={data.soil.averages.quality.toFixed(0)}
              icon={<CheckCircle className="text-green-600" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Soil Moisture Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.soil.trends.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="moisture" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Soil pH Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.soil.trends.slice(-30)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[4, 9]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="ph" stroke={COLORS.warning} strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <AlertSummaryCard title="Critical" count={alerts.filter(a => a.severity === 'critical').length} color={COLORS.danger} />
            <AlertSummaryCard title="High" count={alerts.filter(a => a.severity === 'high').length} color={COLORS.warning} />
            <AlertSummaryCard title="Medium" count={alerts.filter(a => a.severity === 'medium').length} color={COLORS.secondary} />
            <AlertSummaryCard title="Low" count={alerts.filter(a => a.severity === 'low').length} color={COLORS.success} />
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">All Active Alerts</h3>
            </div>
            <div className="divide-y">
              {alerts.map(alert => (
                <div key={alert.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getCategoryIcon(alert.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold`} style={{ backgroundColor: getSeverityColor(alert.severity) + '20', color: getSeverityColor(alert.severity) }}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{alert.category}</span>
                      </div>
                      <h4 className="font-medium mt-1">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(alert.triggeredAt).toLocaleString()}
                        </span>
                        {alert.acknowledged && (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle size={14} />
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// Sub-components
// ============================================

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'amber';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    red: 'bg-red-50 border-red-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200'
  };

  return (
    <div className={`rounded-xl p-6 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>{icon}</div>
        {trend === 'up' ? (
          <TrendingUp className="text-green-500" size={20} />
        ) : trend === 'down' ? (
          <TrendingDown className="text-red-500" size={20} />
        ) : null}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
    </div>
  );
};

const BiodiversityMetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-3">{icon}</div>
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const SoilMetricCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-3">{icon}</div>
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const AlertCard: React.FC<{ alert: Alert; onAcknowledge: (id: string) => void }> = ({ alert, onAcknowledge }) => {
  const severityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${severityColors[alert.severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} />
          <div>
            <p className="font-medium">{alert.title}</p>
            <p className="text-sm opacity-80">{alert.description}</p>
          </div>
        </div>
        {!alert.acknowledged && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="text-xs bg-white px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};

const AlertSummaryCard: React.FC<{ title: string; count: number; color: string }> = ({ title, count, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm text-center">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-4xl font-bold mt-2" style={{ color }}>{count}</p>
  </div>
);

export default PlanetaryMeasurementDashboard;
