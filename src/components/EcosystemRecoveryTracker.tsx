import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { RegenerativeMetrics } from "@/types/marketplace";
import { Leaf, Zap, Droplet, TrendingUp } from "lucide-react";

interface RegenerativeMetricsTrend {
  microbiome_trend_30d: number | null;
  biodiversity_trend_30d: number | null;
  crop_diversity_trend_30d: number | null;
  pollinator_trend_30d: number | null;
  latest_scores: RegenerativeMetrics | null;
  health_status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface EcosystemRecoveryTrackerProps {
  metrics: RegenerativeMetrics[];
  trend?: RegenerativeMetricsTrend;
  isLoading?: boolean;
}

interface TimeSeriesData {
  date: string;
  value: number;
  category: string;
}

const generateTimeSeriesData = (metrics: RegenerativeMetrics[]): TimeSeriesData[] => {
  return metrics.map((m) => ({
    date: new Date(m.last_measured_at || m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: m.current_value,
    category: m.metric_category,
  }));
};

export const EcosystemRecoveryTracker: React.FC<EcosystemRecoveryTrackerProps> = ({
  metrics = [],
  trend,
  isLoading = false,
}) => {
  const timeSeriesData = useMemo(() => generateTimeSeriesData(metrics), [metrics]);
  
  // Group metrics by category
  const metricsByCategory = useMemo(() => {
    const grouped: Record<string, RegenerativeMetrics[]> = {};
    metrics.forEach(m => {
      if (!grouped[m.metric_category]) {
        grouped[m.metric_category] = [];
      }
      grouped[m.metric_category].push(m);
    });
    return grouped;
  }, [metrics]);

  // Health score summary from actual metrics
  const healthSummary = useMemo(() => {
    const carbonMetric = metrics.find(m => m.metric_category === 'Carbon');
    const biodiversityMetric = metrics.find(m => m.metric_category === 'Biodiversity');
    const soilMetric = metrics.find(m => m.metric_category === 'Soil');
    const waterMetric = metrics.find(m => m.metric_category === 'Water');
    
    return {
      carbon: carbonMetric?.current_value || 0,
      biodiversity: (biodiversityMetric?.current_value || 0) * 100,
      soil: soilMetric?.current_value || 0,
      water: waterMetric?.current_value || 0,
    };
  }, [metrics]);

  // Radar chart data
  const radarData = [
    { metric: "Carbon", value: healthSummary.carbon, fullMark: 20 },
    { metric: "Biodiversity", value: healthSummary.biodiversity, fullMark: 100 },
    { metric: "Soil Health", value: healthSummary.soil, fullMark: 100 },
    { metric: "Water Quality", value: healthSummary.water, fullMark: 100 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ecosystem Recovery Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-b from-slate-200 to-slate-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Carbon Sequestration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{healthSummary.carbon.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground mt-2">tonnes CO₂/ha/year</p>
            <p className="text-xs text-emerald-600 mt-1">
              {trend?.microbiome_trend_30d ? (trend.microbiome_trend_30d > 0 ? "📈" : "📉") : "—"} 
              {trend?.microbiome_trend_30d?.toFixed(1)}% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Biodiversity Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{healthSummary.biodiversity.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground mt-2">Species Richness</p>
            <p className="text-xs text-blue-600 mt-1">
              {trend?.biodiversity_trend_30d ? (trend.biodiversity_trend_30d > 0 ? "📈" : "📉") : "—"} 
              {trend?.biodiversity_trend_30d?.toFixed(1)}% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Soil Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{healthSummary.soil.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">Health Score</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Droplet className="h-4 w-4" />
              Water Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-cyan-600">{healthSummary.water.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground mt-2">Quality Index</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">All Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ecosystem Health Radar</CardTitle>
              <CardDescription>Multi-dimensional health assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current Status" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Regenerative Metrics</CardTitle>
              <CardDescription>Complete metrics from database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => (
                  <div key={category}>
                    <h4 className="font-semibold mb-3 text-foreground">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryMetrics.map((metric) => (
                        <div key={metric.id} className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{metric.metric_name}</span>
                            <span className="text-sm text-muted-foreground">{metric.trend || 'stable'}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold">{metric.current_value.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">{metric.unit}</span>
                          </div>
                          {metric.improvement_percentage && (
                            <div className={`text-xs mt-1 ${metric.improvement_percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {metric.improvement_percentage > 0 ? '+' : ''}{metric.improvement_percentage.toFixed(1)}% vs baseline
                            </div>
                          )}
                          {metric.target_value && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progress to target</span>
                                <span>{metric.target_value} {metric.unit}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{ width: `${Math.min((metric.current_value / metric.target_value) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Trends</CardTitle>
              <CardDescription>Progress across all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric) => (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{metric.metric_name}</span>
                      <span className={`text-sm font-bold ${(metric.improvement_percentage || 0) > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {metric.improvement_percentage ? `+${metric.improvement_percentage.toFixed(1)}%` : 'No change'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(Math.abs(metric.improvement_percentage || 0), 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Baseline: {metric.baseline_value?.toFixed(1) || 'N/A'} {metric.unit}</span>
                      <span>Current: {metric.current_value.toFixed(1)} {metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Overall Health Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{metrics.length}</p>
              <p className="text-xs text-muted-foreground">Total Metrics</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {metrics.filter((m) => (m.improvement_percentage || 0) > 0).length}
              </p>
              <p className="text-xs text-muted-foreground">Improving</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {metrics.filter((m) => m.trend === 'stable').length}
              </p>
              <p className="text-xs text-muted-foreground">Stable</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {Object.keys(metricsByCategory).length}
              </p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcosystemRecoveryTracker;
