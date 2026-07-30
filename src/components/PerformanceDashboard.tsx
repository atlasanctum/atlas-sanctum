import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PerformanceMetrics } from '@/hooks/usePerformanceMonitoring';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { Activity, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | null;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor' | null;
  description: string;
  threshold?: {
    good: number;
    poor: number;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  rating,
  description,
  threshold
}) => {
  const getRatingColor = (rating: string | null) => {
    switch (rating) {
      case 'good': return 'bg-green-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getProgressValue = (value: number | null, threshold?: { good: number; poor: number }) => {
    if (!value || !threshold) return 0;
    // Calculate progress based on how far from poor threshold
    const progress = Math.max(0, Math.min(100, ((threshold.poor - value) / (threshold.poor - threshold.good)) * 100));
    return progress;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {rating && (
          <Badge variant="secondary" className={`${getRatingColor(rating)} text-white`}>
            {rating === 'good' && <CheckCircle className="w-3 h-3 mr-1" />}
            {rating === 'needs-improvement' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {rating === 'poor' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {rating.replace('-', ' ')}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value !== null ? `${value.toFixed(1)}${unit}` : 'Loading...'}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {threshold && value !== null && (
          <Progress
            value={getProgressValue(value, threshold)}
            className="mt-2"
          />
        )}
      </CardContent>
    </Card>
  );
};

const PerformanceDashboard: React.FC = () => {
  const { metrics, reportPerformance } = usePerformanceMonitoring();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, [metrics]);

  const getMetricRating = (metric: keyof PerformanceMetrics, value: number | null): 'good' | 'needs-improvement' | 'poor' | null => {
    if (value === null) return null;

    switch (metric) {
      case 'cls':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
      case 'inp':
        return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
      case 'fcp':
      case 'lcp':
        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      case 'ttfb':
        return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const handleManualReport = () => {
    reportPerformance();
    setLastUpdate(new Date());
  };

  const metricsData = [
    {
      key: 'fcp' as keyof PerformanceMetrics,
      title: 'First Contentful Paint',
      unit: 'ms',
      description: 'Time until first content appears',
      threshold: { good: 1800, poor: 3000 }
    },
    {
      key: 'lcp' as keyof PerformanceMetrics,
      title: 'Largest Contentful Paint',
      unit: 'ms',
      description: 'Time until largest content element loads',
      threshold: { good: 2500, poor: 4000 }
    },
    {
      key: 'inp' as keyof PerformanceMetrics,
      title: 'Interaction to Next Paint',
      unit: 'ms',
      description: 'Responsiveness to user interactions',
      threshold: { good: 200, poor: 500 }
    },
    {
      key: 'cls' as keyof PerformanceMetrics,
      title: 'Cumulative Layout Shift',
      unit: '',
      description: 'Visual stability of the page',
      threshold: { good: 0.1, poor: 0.25 }
    },
    {
      key: 'ttfb' as keyof PerformanceMetrics,
      title: 'Time to First Byte',
      unit: 'ms',
      description: 'Server response time',
      threshold: { good: 800, poor: 1800 }
    }
  ];

  const overallScore = metricsData.reduce((score, metric) => {
    const rating = getMetricRating(metric.key, metrics[metric.key]);
    switch (rating) {
      case 'good': return score + 20;
      case 'needs-improvement': return score + 10;
      case 'poor': return score + 0;
      default: return score;
    }
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time Core Web Vitals monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualReport}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Report</span>
          </Button>
          <Badge variant="outline" className="text-xs">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Overall Performance Score</span>
          </CardTitle>
          <CardDescription>
            Combined score based on all Core Web Vitals metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold">{overallScore}/100</div>
            <Progress value={overallScore} className="flex-1" />
            <Badge variant={overallScore >= 80 ? 'default' : overallScore >= 50 ? 'secondary' : 'destructive'}>
              {overallScore >= 80 ? 'Excellent' : overallScore >= 50 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.key}
            title={metric.title}
            value={metrics[metric.key]}
            unit={metric.unit}
            rating={getMetricRating(metric.key, metrics[metric.key])}
            description={metric.description}
            threshold={metric.threshold}
          />
        ))}
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Summary of current performance metrics and their impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Loading Performance</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• FCP: {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : 'N/A'}</li>
                    <li>• LCP: {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : 'N/A'}</li>
                    <li>• TTFB: {metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'N/A'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Interactivity & Stability</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• INP: {metrics.inp ? `${metrics.inp.toFixed(0)}ms` : 'N/A'}</li>
                    <li>• CLS: {metrics.cls ? `${metrics.cls.toFixed(3)}` : 'N/A'}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              Detailed performance metrics are automatically reported to Google Analytics for trend analysis.
              Check the Analytics dashboard for historical performance data.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Recommendations</CardTitle>
              <CardDescription>
                Suggestions to improve your Core Web Vitals scores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics.fcp && metrics.fcp > 2500 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>FCP is slow:</strong> Consider optimizing server response times,
                    removing render-blocking resources, or using a CDN.
                  </AlertDescription>
                </Alert>
              )}
              {metrics.lcp && metrics.lcp > 4000 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>LCP is slow:</strong> Optimize the loading of your largest content element.
                    Consider lazy loading, image optimization, or resource hints.
                  </AlertDescription>
                </Alert>
              )}
              {metrics.cls && metrics.cls > 0.25 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>CLS is high:</strong> Reserve space for dynamic content and avoid
                    inserting content above existing content.
                  </AlertDescription>
                </Alert>
              )}
              {metrics.inp && metrics.inp > 500 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>INP is slow:</strong> Break up long tasks, optimize JavaScript execution,
                    and reduce main thread blocking.
                  </AlertDescription>
                </Alert>
              )}
              {(!metrics.fcp || !metrics.lcp || !metrics.cls || !metrics.inp || !metrics.ttfb) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Some metrics are still loading. Performance data will be available once
                    all user interactions have occurred.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;