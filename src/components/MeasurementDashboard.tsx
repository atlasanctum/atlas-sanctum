import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { MeasurementData, RegenerativeMetrics } from "@/types/marketplace";
import { Leaf, Droplets, Wind, Zap, AlertCircle, TrendingUp } from "lucide-react";

interface MeasurementDashboardProps {
  projectId: string;
  measurements: MeasurementData[];
  regenerativeMetrics: RegenerativeMetrics[];
  isLoading?: boolean;
}

const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444", "#8b5cf6"];

export const MeasurementDashboard: React.FC<MeasurementDashboardProps> = ({
  projectId,
  measurements = [],
  regenerativeMetrics = [],
  isLoading = false,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<"co2" | "soil" | "ndvi" | "biodiversity">("co2");

  // Latest measurement
  const latestMeasurement = measurements[0];

  // Prepare chart data
  const chartData = measurements.slice(0, 30).reverse().map((m) => ({
    date: new Date(m.measurement_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    co2: m.co2_level || 0,
    soilCarbon: m.soil_carbon_ppm || 0,
    ndvi: m.ndvi_index || 0,
    biodiversity: m.biodiversity_score || 0,
  }));

  // Regenerative metrics pie data - use the new schema
  const healthPieData = regenerativeMetrics.slice(0, 5).map((m) => ({
    name: m.metric_name,
    value: m.current_value,
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-64 bg-gradient-to-b from-slate-200 to-slate-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CO2 Level Card */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CO₂ Level</CardTitle>
              <Wind className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{latestMeasurement?.co2_level?.toFixed(1) || "—"}</div>
              <p className="text-xs text-muted-foreground">ppm (Latest)</p>
              <div className="text-xs text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Via {latestMeasurement?.satellite_source || "Satellite"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Soil Carbon Card */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Soil Carbon</CardTitle>
              <Leaf className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{latestMeasurement?.soil_carbon_ppm?.toFixed(0) || "—"}</div>
              <p className="text-xs text-muted-foreground">ppm (Validated)</p>
              <div className="text-xs text-amber-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Near-infrared confirmed
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NDVI Index Card */}
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">NDVI Index</CardTitle>
              <Droplets className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{latestMeasurement?.ndvi_index?.toFixed(2) || "—"}</div>
              <p className="text-xs text-muted-foreground">Vegetation Health</p>
              <div className="text-xs text-cyan-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {latestMeasurement?.ndvi_index && latestMeasurement.ndvi_index > 0.6 ? "Healthy" : "Monitoring"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biodiversity Score Card */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Biodiversity</CardTitle>
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{latestMeasurement?.biodiversity_score?.toFixed(0) || "—"}</div>
              <p className="text-xs text-muted-foreground">Score (0-100)</p>
              <div className="text-xs text-purple-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                eDNA verified
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confidence & Anomaly Alerts */}
      {latestMeasurement?.anomaly_flag && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-sm">Anomaly Detected</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">{latestMeasurement.anomaly_reason || "Unusual measurement pattern detected"}</p>
            <p className="text-xs text-orange-700 mt-2">Confidence: {(latestMeasurement.confidence_level * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      )}

      {/* Time Series Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Measurement Trends</CardTitle>
          <CardDescription>30-day historical data from satellite and sensor networks</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as typeof selectedMetric)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="co2">CO₂ Level</TabsTrigger>
              <TabsTrigger value="soil">Soil Carbon</TabsTrigger>
              <TabsTrigger value="ndvi">NDVI</TabsTrigger>
              <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
            </TabsList>

            <TabsContent value="co2" className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="soil" className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="soilCarbon" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="ndvi" className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[-1, 1]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ndvi" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="biodiversity" className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="biodiversity" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Regenerative Metrics */}
      {regenerativeMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Regenerative Ecosystem Health</CardTitle>
            <CardDescription>Environmental metrics from database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Health Scores */}
              <div className="space-y-4">
                {regenerativeMetrics.slice(0, 5).map((metric) => (
                  <div key={metric.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{metric.metric_name}</span>
                      <span className="text-sm font-bold text-emerald-600">
                        {metric.current_value.toFixed(1)} {metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((metric.current_value / (metric.target_value || 100)) * 100, 100)}%` }}
                      />
                    </div>
                    {metric.improvement_percentage && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {metric.improvement_percentage > 0 ? '+' : ''}{metric.improvement_percentage.toFixed(1)}% improvement
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Health Pie Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => (typeof value === 'number' ? value.toFixed(1) : value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Quality & Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Verification Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{measurements.length}</p>
              <p className="text-xs text-muted-foreground">Total Measurements</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {measurements.filter((m) => !m.anomaly_flag).length}
              </p>
              <p className="text-xs text-muted-foreground">Verified Records</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{measurements.filter((m) => m.anomaly_flag).length}</p>
              <p className="text-xs text-muted-foreground">Anomalies Detected</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {latestMeasurement ? (latestMeasurement.confidence_level * 100).toFixed(0) : "—"}%
              </p>
              <p className="text-xs text-muted-foreground">Latest Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeasurementDashboard;
