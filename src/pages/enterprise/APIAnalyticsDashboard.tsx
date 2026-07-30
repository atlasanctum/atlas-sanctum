/**
 * API Analytics Dashboard
 * 
 * Enterprise-grade API analytics dashboard with usage metrics, performance tracking, and insights.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Download,
  RefreshCw,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface TimeSeriesData {
  timestamp: string;
  requests: number;
  errors: number;
  avgResponseTime: number;
}

interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  p50ResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  requestsByEndpoint: Record<string, number>;
  requestsByMethod: Record<string, number>;
  requestsByHour: Record<string, number>;
  requestsByDay: Record<string, number>;
  requestsByMonth: Record<string, number>;
  topEndpoints: Array<{ endpoint: string; count: number; avgResponseTime: number }>;
  topErrors: Array<{ statusCode: number; count: number }>;
}

export default function APIAnalyticsDashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<APIMetrics | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [interval, setInterval] = useState<'hour' | 'day' | 'week' | 'month'>('hour');

  useEffect(() => {
    fetchMetrics();
    fetchTimeSeries();
  }, [timeRange, interval]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keys/organization/default/analytics', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch API metrics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSeries = async () => {
    try {
      const response = await fetch(`/api/keys/organization/default/timeseries?interval=${interval}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTimeSeries(data.data);
      }
    } catch (error) {
      console.error('Error fetching time series:', error);
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await fetch('/api/keys/organization/default/report?format=csv', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast({
          title: 'Success',
          description: 'Report exported successfully',
        });
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatResponseTime = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
    return `${ms.toFixed(0)}ms`;
  };

  const getSuccessRate = () => {
    if (!metrics) return 0;
    const total = metrics.totalRequests;
    if (total === 0) return 100;
    return ((metrics.successfulRequests / total) * 100).toFixed(1);
  };

  const getErrorRate = () => {
    if (!metrics) return 0;
    const total = metrics.totalRequests;
    if (total === 0) return 0;
    return ((metrics.failedRequests / total) * 100).toFixed(1);
  };

  const getStatusCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-600';
    if (code >= 300 && code < 400) return 'text-yellow-600';
    if (code >= 400 && code < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                API Analytics Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Monitor API usage, performance, and insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Last Hour</SelectItem>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={fetchMetrics}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics ? formatNumber(metrics.totalRequests) : '-'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                All API calls
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {getSuccessRate()}%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {metrics ? formatNumber(metrics.successfulRequests) : '-'} successful
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {getErrorRate()}%
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {metrics ? formatNumber(metrics.failedRequests) : '-'} failed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics ? formatResponseTime(metrics.averageResponseTime) : '-'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                P95: {metrics ? formatResponseTime(metrics.p95ResponseTime) : '-'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Response Time Distribution</CardTitle>
              <CardDescription>Percentile breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">P50</span>
                    <span className="font-semibold">
                      {formatResponseTime(metrics.p50ResponseTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">P95</span>
                    <span className="font-semibold">
                      {formatResponseTime(metrics.p95ResponseTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">P99</span>
                    <span className="font-semibold">
                      {formatResponseTime(metrics.p99ResponseTime)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400">Loading...</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Requests by Method</CardTitle>
              <CardDescription>HTTP method distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics ? (
                <div className="space-y-3">
                  {Object.entries(metrics.requestsByMethod).map(([method, count]) => (
                    <div key={method} className="flex items-center justify-between">
                      <Badge variant="outline">{method}</Badge>
                      <span className="font-semibold">{formatNumber(count)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400">Loading...</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Errors</CardTitle>
              <CardDescription>Most common error codes</CardDescription>
            </CardHeader>
            <CardContent>
              {metrics && metrics.topErrors.length > 0 ? (
                <div className="space-y-3">
                  {metrics.topErrors.map((error) => (
                    <div key={error.statusCode} className="flex items-center justify-between">
                      <Badge variant="destructive">{error.statusCode}</Badge>
                      <span className="font-semibold">{formatNumber(error.count)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400">No errors</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="endpoints" className="space-y-4">
          <TabsList>
            <TabsTrigger value="endpoints">Top Endpoints</TabsTrigger>
            <TabsTrigger value="requests">Requests Over Time</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle>Top Endpoints</CardTitle>
                <CardDescription>Most frequently accessed API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics && metrics.topEndpoints.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.topEndpoints.map((endpoint, index) => (
                      <motion.div
                        key={endpoint.endpoint}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="font-mono text-sm text-slate-900 dark:text-white mb-1">
                            {endpoint.endpoint}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            Avg: {formatResponseTime(endpoint.avgResponseTime)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">
                            {formatNumber(endpoint.count)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            requests
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No endpoint data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Requests Over Time</CardTitle>
                <CardDescription>API request trends</CardDescription>
              </CardHeader>
              <CardContent>
                {timeSeries.length > 0 ? (
                  <div className="space-y-2">
                    {timeSeries.map((data, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-32 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(data.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(data.requests / Math.max(...timeSeries.map(d => d.requests))) * 100}%` }}
                                className="bg-blue-600 h-full rounded-full"
                              />
                            </div>
                            <span className="text-sm font-semibold w-16 text-right">
                              {formatNumber(data.requests)}
                            </span>
                          </div>
                          {data.errors > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-red-100 dark:bg-red-900/30 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(data.errors / data.requests) * 100}%` }}
                                  className="bg-red-600 h-full rounded-full"
                                />
                              </div>
                              <span className="text-xs text-red-600 w-16 text-right">
                                {formatNumber(data.errors)} errors
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No time series data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors">
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
                <CardDescription>Detailed error breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics && metrics.topErrors.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.topErrors.map((error) => (
                      <div key={error.statusCode} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="destructive" className="text-lg px-3 py-1">
                            {error.statusCode}
                          </Badge>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {formatNumber(error.count)} occurrences
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {error.statusCode >= 400 && error.statusCode < 500
                            ? 'Client error - Check request parameters'
                            : error.statusCode >= 500
                            ? 'Server error - Contact support'
                            : 'Other error'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <p>No errors detected in the selected time range</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
