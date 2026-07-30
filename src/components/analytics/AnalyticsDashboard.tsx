// Advanced Analytics Dashboard Component
import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Download,
  RefreshCw,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type {
  DashboardTemplate,
  DashboardWidget,
  ChartConfig,
  TimeSeriesData,
  PerformanceMetric,
  WebSocketMessage,
} from '../../types/analytics';

// Color palette for charts
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// Mock data generators
const generateTimeSeriesData = (points: number = 24): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const now = Date.now();
  for (let i = points; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 3600000).toISOString(),
      value: Math.floor(Math.random() * 1000) + 500,
    });
  }
  return data;
};

const generatePieData = () => [
  { name: 'Direct', value: 400 },
  { name: 'Social', value: 300 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
  { name: 'Email', value: 100 },
];

const generateBarData = () => [
  { name: 'Mon', visits: 4000, conversions: 2400 },
  { name: 'Tue', visits: 3000, conversions: 1398 },
  { name: 'Wed', visits: 2000, conversions: 9800 },
  { name: 'Thu', visits: 2780, conversions: 3908 },
  { name: 'Fri', visits: 1890, conversions: 4800 },
  { name: 'Sat', visits: 2390, conversions: 3800 },
  { name: 'Sun', visits: 3490, conversions: 4300 },
];

const generateRadarData = () => [
  { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Reliability', A: 98, B: 130, fullMark: 150 },
  { subject: 'Comfort', A: 86, B: 130, fullMark: 150 },
  { subject: 'Safety', A: 99, B: 100, fullMark: 150 },
  { subject: 'Usability', A: 85, B: 90, fullMark: 150 },
];

// Chart Component Factory
interface ChartRendererProps {
  config: ChartConfig;
  data: unknown[];
  height?: number;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({ config, data, height = 300 }) => {
  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  switch (config.type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.colors?.[0] || '#3b82f6'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {(data as Array<{ name: string }>).map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.colors?.[0] || '#10b981'}
              fill={config.colors?.[0] || '#10b981'}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <CartesianGrid stroke="#374151" />
            <XAxis dataKey="subject" tick={{ fill: '#9ca3af' }} />
            <YAxis tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Radar name="System A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Radar name="System B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      );

    default:
      return <div>Unsupported chart type: {config.type}</div>;
  }
};

// Widget Card Component
interface WidgetCardProps {
  widget: DashboardWidget;
  data: unknown[];
  onRemove?: () => void;
  onRefresh?: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ widget, data, onRemove, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <div
      className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-200"
      style={{
        gridColumn: `span ${widget.position.width}`,
        gridRow: `span ${widget.position.height}`,
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
        <h3 className="text-sm font-medium text-gray-200">{widget.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors" title="More options">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <ChartRenderer config={widget.config} data={data} height={widget.position.height * 120} />
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, unit, trend }) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-gray-400 mb-1">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm">{Math.abs(change).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

// Main Analytics Dashboard Component
interface AnalyticsDashboardProps {
  templateId?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ templateId }) => {
  const [templates, setTemplates] = useState<DashboardTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [realTimeData, setRealTimeData] = useState<Map<string, unknown>>(new Map());
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);

  // Fetch templates and metrics
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [templatesRes, metricsRes] = await Promise.all([
          fetch('/api/analytics/templates'),
          fetch('/api/analytics/metrics'),
        ]);
        const templatesData = await templatesRes.json();
        const metricsData = await metricsRes.json();

        if (templatesData.success) {
          setTemplates(templatesData.data);
          const template = templateId
            ? templatesData.data.find((t: DashboardTemplate) => t.id === templateId)
            : templatesData.data.find((t: DashboardTemplate) => t.isDefault);
          setSelectedTemplate(template || templatesData.data[0]);
        }

        if (metricsData.success) {
          setPerformanceMetrics(metricsData.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        // Use mock data for demo
        setPerformanceMetrics([
          { name: 'API Response', value: 145, unit: 'ms', status: 'healthy', history: [] },
          { name: 'Error Rate', value: 0.12, unit: '%', status: 'healthy', history: [] },
          { name: 'Throughput', value: 12500, unit: 'req/s', status: 'healthy', history: [] },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // WebSocket connection for real-time updates
    const ws = new WebSocket(`ws://${window.location.host}/ws/analytics`);
    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      if (message.type === 'metric_update') {
        setPerformanceMetrics((prev) =>
          prev.map((m) =>
            m.name === (message.payload as { metricId: string }).metricId
              ? { ...m, value: (message.payload as { value: number }).value }
              : m
          )
        );
      }
    };

    return () => ws.close();
  }, [templateId]);

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In production, this would fetch updated data
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Generate mock chart data
  const getChartData = useCallback((dataSource: string): unknown[] => {
    switch (dataSource) {
      case 'revenue':
        return generateTimeSeriesData(24);
      case 'users':
        return generateTimeSeriesData(24);
      case 'conversions':
        return generateBarData();
      case 'revenue-breakdown':
        return generatePieData();
      case 'health':
        return generateRadarData();
      case 'sessions':
        return generateTimeSeriesData(48);
      default:
        return generateTimeSeriesData(12);
    }
  }, []);

  const handleRefreshWidget = useCallback((widgetId: string) => {
    // In production, this would fetch fresh data for the specific widget
    console.log(`Refreshing widget: ${widgetId}`);
  }, []);

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: selectedTemplate?.id, format }),
      });
      const data = await response.json();
      if (data.success) {
        // Trigger download
        window.open(data.data.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => {
              const template = templates.find((t) => t.id === e.target.value);
              setSelectedTemplate(template || null);
            }}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 first:rounded-t-lg"
              >
                Export as PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 last:rounded-b-lg"
              >
                Export as Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {performanceMetrics.slice(0, 4).map((metric) => (
          <MetricCard
            key={metric.name}
            title={metric.name}
            value={metric.value.toFixed(metric.value < 10 ? 2 : 0)}
            unit={metric.unit}
            change={Math.random() * 20 - 10}
            trend={Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'}
          />
        ))}
      </div>

      {/* Dashboard Grid */}
      {selectedTemplate && (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${12}, minmax(0, 1fr))`,
          }}
        >
          {selectedTemplate.widgets.map((widget) => (
            <WidgetCard
              key={widget.id}
              widget={widget}
              data={getChartData(widget.config.dataSource || 'revenue')}
              onRefresh={() => handleRefreshWidget(widget.id)}
            />
          ))}
        </div>
      )}

      {/* Additional Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {performanceMetrics.slice(4).map((metric) => (
          <MetricCard
            key={metric.name}
            title={metric.name}
            value={metric.value.toFixed(metric.value < 10 ? 2 : 0)}
            unit={metric.unit}
            change={Math.random() * 15 - 7.5}
            trend={Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
