import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Shield,
  AlertTriangle,
  Activity,
  Zap,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface SecurityMetrics {
  timestamp: string;
  healthScore: number;
  performance: {
    operations: PerformanceOperation[];
    alerts: SecurityAlert[];
    trends: SecurityTrend[];
  };
  incidents: SecurityIncident[];
  compliance: ComplianceReport[];
  recommendations: SecurityRecommendation[];
}

interface PerformanceOperation {
  operation: string;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  p95Duration: number;
  p99Duration: number;
  errorRate: number;
  lastUpdated: string;
}

interface SecurityAlert {
  operation: string;
  alertType: string;
  severity: string;
  message: string;
  metrics: any;
  threshold: any;
  createdAt: string;
}

interface SecurityTrend {
  hour: string;
  eventType: string;
  severity: string;
  count: number;
}

interface SecurityIncident {
  id: string;
  incidentType: string;
  severity: string;
  title: string;
  status: string;
  assignedTo?: string;
  detectedAt: string;
  resolvedAt?: string;
  responseTime?: string;
  resolutionTime?: string;
  affectedUsers: number;
}

interface ComplianceReport {
  reportType: string;
  periodStart: string;
  periodEnd: string;
  complianceScore: number;
  totalViolations: number;
  criticalViolations: number;
  generatedAt: string;
}

interface SecurityRecommendation {
  priority: string;
  type: string;
  message: string;
  action: string;
  details?: string[];
}

const SecurityMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSecurityMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/security-monitoring/performance-dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch security metrics');
      }
      const data = await response.json();
      setMetrics(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityMetrics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSecurityMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading security metrics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-500">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Security Metrics</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={fetchSecurityMetrics} className="mt-2">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            Security Monitoring Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time security performance monitoring and incident management
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button onClick={fetchSecurityMetrics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthScoreColor(metrics?.healthScore || 0)}`}>
              {metrics?.healthScore || 0}%
            </div>
            <Progress value={metrics?.healthScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics?.incidents.filter(i => i.status === 'open').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.incidents.filter(i => i.status === 'open').length === 1 ? 'incident' : 'incidents'} requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Alerts</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics?.performance.alerts.filter(a => ['high', 'critical'].includes(a.severity)).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              critical/high severity alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics?.compliance[0]?.complianceScore || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              latest compliance report
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="incidents">Security Incidents</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Operation Performance</CardTitle>
              <CardDescription>
                Real-time performance metrics for security operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Operation</TableHead>
                    <TableHead>Total Calls</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg Duration</TableHead>
                    <TableHead>P95 Duration</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics?.performance.operations.map((op) => (
                    <TableRow key={op.operation}>
                      <TableCell className="font-medium">{op.operation}</TableCell>
                      <TableCell>{op.totalCalls.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          {((op.successfulCalls / op.totalCalls) * 100).toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>{op.averageDuration.toFixed(2)}ms</TableCell>
                      <TableCell>{op.p95Duration.toFixed(2)}ms</TableCell>
                      <TableCell>
                        <Badge variant={op.errorRate > 0.05 ? "destructive" : "secondary"}>
                          {(op.errorRate * 100).toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={op.errorRate > 0.1 ? "destructive" : "default"}>
                          {op.errorRate > 0.1 ? 'Degraded' : 'Healthy'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Incidents</CardTitle>
              <CardDescription>
                Track and manage security incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Affected Users</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics?.incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.incidentType}</TableCell>
                      <TableCell className="font-medium">{incident.title}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={incident.status === 'open' ? 'destructive' : 'default'}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(incident.detectedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{incident.affectedUsers}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Alerts</CardTitle>
              <CardDescription>
                Current performance and security alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.performance.alerts.map((alert, index) => (
                  <Alert key={index} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>{alert.operation} - {alert.alertType}</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription>
                      <p>{alert.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </AlertDescription>
                  </Alert>
                ))}
                {(!metrics?.performance.alerts || metrics.performance.alerts.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active alerts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Security compliance reports and audit trails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Total Violations</TableHead>
                    <TableHead>Critical Violations</TableHead>
                    <TableHead>Generated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics?.compliance.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="capitalize">{report.reportType}</TableCell>
                      <TableCell>
                        {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={report.complianceScore} className="w-16 mr-2" />
                          {report.complianceScore}%
                        </div>
                      </TableCell>
                      <TableCell>{report.totalViolations}</TableCell>
                      <TableCell>
                        <Badge variant={report.criticalViolations > 0 ? "destructive" : "secondary"}>
                          {report.criticalViolations}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>
                AI-powered recommendations to improve security posture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.recommendations.map((rec, index) => (
                  <Card key={index} className={`border-l-4 ${getPriorityColor(rec.priority)}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{rec.message}</CardTitle>
                        <Badge className={getSeverityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-2">{rec.action}</p>
                      {rec.details && (
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {rec.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {(!metrics?.recommendations || metrics.recommendations.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No recommendations at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityMonitoringDashboard;