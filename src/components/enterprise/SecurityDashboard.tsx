/**
 * Security Dashboard Component
 * 
 * Enterprise-grade security dashboard with real-time monitoring,
 * compliance tracking, and incident management.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Lock,
  Eye,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  Globe,
  Clock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface SecurityMetric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

interface ComplianceScore {
  category: string;
  score: number;
  status: 'effective' | 'partially_effective' | 'ineffective';
  trend: number;
}

export const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock data - in production, this would come from API
  const securityMetrics: SecurityMetric[] = [
    {
      label: 'Security Score',
      value: 94,
      change: 2.5,
      trend: 'up',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-emerald-500',
    },
    {
      label: 'Active Threats',
      value: 3,
      change: -1,
      trend: 'down',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-amber-500',
    },
    {
      label: 'Compliance Score',
      value: '98%',
      change: 1.2,
      trend: 'up',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-blue-500',
    },
    {
      label: 'Failed Logins (24h)',
      value: 12,
      change: 5,
      trend: 'up',
      icon: <Lock className="w-5 h-5" />,
      color: 'text-red-500',
    },
  ];

  const recentEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'brute_force_attempt',
      severity: 'high',
      description: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false,
    },
    {
      id: '2',
      type: 'unusual_access_pattern',
      severity: 'medium',
      description: 'Unusual access pattern detected for user john@example.com',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      resolved: true,
    },
    {
      id: '3',
      type: 'data_export_attempt',
      severity: 'low',
      description: 'Large data export attempt by user jane@example.com',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolved: true,
    },
    {
      id: '4',
      type: 'api_rate_limit_exceeded',
      severity: 'medium',
      description: 'API rate limit exceeded for organization Acme Corp',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      resolved: false,
    },
  ];

  const complianceScores: ComplianceScore[] = [
    {
      category: 'Control Environment',
      score: 100,
      status: 'effective',
      trend: 0,
    },
    {
      category: 'Risk Assessment',
      score: 95,
      status: 'effective',
      trend: 2,
    },
    {
      category: 'Monitoring Activities',
      score: 92,
      status: 'partially_effective',
      trend: -1,
    },
    {
      category: 'Access Control',
      score: 98,
      status: 'effective',
      trend: 1,
    },
    {
      category: 'Change Management',
      score: 100,
      status: 'effective',
      trend: 0,
    },
  ];

  const getSeverityBadge = (severity: string) => {
    const config = {
      low: { color: 'bg-blue-500/10 text-blue-500', label: 'Low' },
      medium: { color: 'bg-amber-500/10 text-amber-500', label: 'Medium' },
      high: { color: 'bg-orange-500/10 text-orange-500', label: 'High' },
      critical: { color: 'bg-red-500/10 text-red-500', label: 'Critical' },
    };
    const { color, label } = config[severity as keyof typeof config];

    return <Badge className={color}>{label}</Badge>;
  };

  const getComplianceStatusBadge = (status: string) => {
    const config = {
      effective: { color: 'bg-emerald-500/10 text-emerald-500', label: 'Effective' },
      partially_effective: { color: 'bg-amber-500/10 text-amber-500', label: 'Partially Effective' },
      ineffective: { color: 'bg-red-500/10 text-red-500', label: 'Ineffective' },
    };
    const { color, label } = config[status as keyof typeof config];

    return <Badge className={color}>{label}</Badge>;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 1) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ${minutes}m ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time security monitoring and compliance tracking
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color.replace('text-', 'bg-')}/10`}>
                    {metric.icon}
                  </div>
                  {metric.change !== undefined && (
                    <div className={`flex items-center gap-1 ${metric.color}`}>
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4" />
                      ) : null}
                      <span className="text-sm font-medium">
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Security Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-2xl font-bold text-emerald-500">94/100</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Threats</p>
                    <p className="text-lg font-semibold">3</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved Today</p>
                    <p className="text-lg font-semibold text-emerald-500">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-emerald-500/10">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System scan completed</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-amber-500/10">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Rate limit warning</p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-blue-500/10">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Audit log review</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Security Events
                </div>
                <Badge variant="outline">{recentEvents.length} events</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      event.resolved
                        ? 'border-emerald-500 bg-emerald-500/5'
                        : 'border-amber-500 bg-amber-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(event.severity)}
                        <span className="text-sm font-medium">
                          {event.type.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">{event.description}</p>
                    {event.resolved && (
                      <div className="mt-2 flex items-center gap-1 text-emerald-500">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Resolved</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                SOC 2 Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {complianceScores.map((score) => (
                <div key={score.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{score.category}</span>
                      {getComplianceStatusBadge(score.status)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{score.score}%</span>
                      {score.trend !== 0 && (
                        <div className={`flex items-center gap-1 ${
                          score.trend > 0 ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {score.trend > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {score.trend > 0 ? '+' : ''}{score.trend}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Progress value={score.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Database className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">45,678</p>
                    <p className="text-sm text-muted-foreground">Audit Logs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <Globe className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Compliance Report
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View Audit Logs
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
