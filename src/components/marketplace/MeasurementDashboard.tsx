import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingDown, TrendingUp, Eye, CheckCircle2 } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMeasurementData } from '@/hooks/useMeasurementData';

interface MeasurementDashboardProps {
  projectId: string;
}

export function MeasurementDashboard({ projectId }: MeasurementDashboardProps) {
  const { data: measurements, summary, isLoading } = useMeasurementData(projectId, { days: 30 });
  const [selectedMetric, setSelectedMetric] = useState<'co2' | 'ndvi' | 'soil_carbon'>('co2');

  if (isLoading) {
    return (
      <Card className="bg-card-gradient border-border/50">
        <CardHeader>
          <CardTitle>Measurement Dashboard</CardTitle>
          <CardDescription>Loading satellite data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!measurements || measurements.length === 0) {
    return (
      <Card className="bg-card-gradient border-border/50">
        <CardHeader>
          <CardTitle>Measurement Dashboard</CardTitle>
          <CardDescription>No measurement data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Waiting for first satellite reading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by date and prepare chart data
  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
  );

  const chartData = sortedMeasurements.map((m) => ({
    date: new Date(m.measurement_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    co2: m.co2_level ? parseFloat(m.co2_level.toFixed(2)) : null,
    ndvi: m.ndvi_index ? parseFloat(m.ndvi_index.toFixed(3)) : null,
    soil_carbon: m.soil_carbon_ppm ? parseFloat(m.soil_carbon_ppm.toFixed(2)) : null,
    timestamp: m.measurement_date,
  }));

  // Get anomaly records
  const anomalies = sortedMeasurements.filter((m) => m.anomaly_flag);

  // Latest measurement
  const latest = sortedMeasurements[sortedMeasurements.length - 1];

  // Trend calculation
  const sevenDaysAgo = sortedMeasurements.slice(-7);
  const firstWeekAvg = sevenDaysAgo.length > 0 
    ? sevenDaysAgo.reduce((sum, m) => sum + (m.co2_level || 0), 0) / sevenDaysAgo.length 
    : 0;
  const currentWeekAvg = sevenDaysAgo.length > 0 
    ? sevenDaysAgo.slice(-3).reduce((sum, m) => sum + (m.co2_level || 0), 0) / sevenDaysAgo.slice(-3).length 
    : 0;
  const trend = currentWeekAvg < firstWeekAvg ? 'improving' : 'increasing';

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'CO₂ Level (Latest)',
            value: latest?.co2_level?.toFixed(1) || 'N/A',
            unit: 'ppm',
            icon: trend === 'improving' ? TrendingDown : TrendingUp,
            color: trend === 'improving' ? 'text-green-500' : 'text-orange-500',
          },
          {
            label: 'Vegetation Index (NDVI)',
            value: latest?.ndvi_index?.toFixed(3) || 'N/A',
            unit: '(-1 to +1)',
            icon: latest?.ndvi_index && latest.ndvi_index > 0.4 ? CheckCircle2 : AlertCircle,
            color: latest?.ndvi_index && latest.ndvi_index > 0.4 ? 'text-green-500' : 'text-yellow-500',
          },
          {
            label: 'Soil Carbon',
            value: latest?.soil_carbon_ppm?.toFixed(1) || 'N/A',
            unit: 'ppm',
            icon: CheckCircle2,
            color: 'text-blue-500',
          },
          {
            label: 'Confidence Level',
            value: `${((latest?.confidence_level || 0) * 100).toFixed(0)}%`,
            unit: 'Data Quality',
            icon: CheckCircle2,
            color: 'text-emerald-500',
          },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-card-gradient border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.unit}</p>
                  </div>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <Card className="bg-card-gradient border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>30-Day Measurement Trends</CardTitle>
              <CardDescription>Continuous satellite and sensor data</CardDescription>
            </div>
            <div className="flex gap-2">
              {(['co2', 'ndvi', 'soil_carbon'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedMetric === metric
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  aria-pressed={selectedMetric === metric}
                  aria-label={`View ${metric} measurement data`}
                >
                  {metric === 'co2' ? 'CO₂' : metric === 'ndvi' ? 'NDVI' : 'Soil C'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300} aria-label={`30-day ${selectedMetric} measurement trends chart`}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value) => {
                  if (value === null || value === undefined) return 'N/A';
                  return typeof value === 'number' ? value.toFixed(2) : value;
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="hsl(var(--primary))"
                fill={`url(#gradient-${selectedMetric})`}
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Anomaly Alerts Section */}
      {anomalies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          aria-live="polite"
        >
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <div>
                  <CardTitle className="text-lg">Anomalies Detected</CardTitle>
                  <CardDescription>{anomalies.length} unusual reading(s) flagged for review</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalies.map((anomaly, i) => (
                  <motion.div
                    key={`${anomaly.id}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/30"
                  >
                    <AlertCircle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {new Date(anomaly.measurement_date).toLocaleDateString()} -{' '}
                        {new Date(anomaly.measurement_date).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {anomaly.anomaly_reason || 'Unusual pattern detected in sensor data'}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {anomaly.satellite_source}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Confidence: {((anomaly.confidence_level || 0) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Last Verified Info */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>Last verified:</span>
          <span className="font-medium text-foreground">
            {latest && new Date(latest.measurement_date).toLocaleDateString()} at{' '}
            {latest && new Date(latest.measurement_date).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Satellite Source:</span>
          <Badge variant="secondary">{latest?.satellite_source || 'N/A'}</Badge>
        </div>
      </div>
    </div>
  );
}
