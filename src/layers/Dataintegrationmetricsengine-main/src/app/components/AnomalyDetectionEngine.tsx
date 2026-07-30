import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  AlertTriangle, 
  Brain, 
  TrendingUp, 
  Eye, 
  CheckCircle2, 
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Anomaly {
  id: string;
  timestamp: Date;
  metric: string;
  sector: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  actualValue: number;
  expectedValue: number;
  deviation: number;
  confidence: number;
  status: 'detected' | 'investigating' | 'resolved' | 'false_positive';
  autoResolved?: boolean;
}

interface AnomalyPattern {
  pattern: string;
  occurrences: number;
  lastSeen: Date;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export const AnomalyDetectionEngine: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      metric: 'Soil Organic Carbon',
      sector: 'Agriculture',
      severity: 'high',
      actualValue: 2.1,
      expectedValue: 3.2,
      deviation: -34.4,
      confidence: 0.94,
      status: 'investigating',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000),
      metric: 'Coral Coverage',
      sector: 'Oceanic',
      severity: 'critical',
      actualValue: 38,
      expectedValue: 45,
      deviation: -15.6,
      confidence: 0.97,
      status: 'detected',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 900000),
      metric: 'Water pH',
      sector: 'Oceanic',
      severity: 'medium',
      actualValue: 8.3,
      expectedValue: 8.1,
      deviation: 2.5,
      confidence: 0.88,
      status: 'resolved',
      autoResolved: true,
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 1200000),
      metric: 'Patient Wait Time',
      sector: 'Healthcare',
      severity: 'high',
      actualValue: 42,
      expectedValue: 18,
      deviation: 133.3,
      confidence: 0.92,
      status: 'detected',
    },
  ]);

  const [patterns, setPatterns] = useState<AnomalyPattern[]>([
    { pattern: 'Oceanic pH fluctuation', occurrences: 12, lastSeen: new Date(), trend: 'decreasing' },
    { pattern: 'Weekend data lag', occurrences: 8, lastSeen: new Date(Date.now() - 86400000), trend: 'stable' },
    { pattern: 'Sensor calibration drift', occurrences: 5, lastSeen: new Date(Date.now() - 172800000), trend: 'decreasing' },
  ]);

  const [detectionRate, setDetectionRate] = useState(98.7);
  const [falsePositiveRate, setFalsePositiveRate] = useState(2.1);

  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    actual: 45 + Math.random() * 10 + (i === 18 ? -15 : 0),
    expected: 50,
    upperBound: 55,
    lowerBound: 45,
  }));

  const getSeverityConfig = (severity: Anomaly['severity']) => {
    switch (severity) {
      case 'critical':
        return { color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical' };
      case 'high':
        return { color: 'text-orange-600', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'High' };
      case 'medium':
        return { color: 'text-yellow-600', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Medium' };
      case 'low':
        return { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Low' };
    }
  };

  const getStatusConfig = (status: Anomaly['status']) => {
    switch (status) {
      case 'detected':
        return { icon: AlertTriangle, color: 'text-red-500', label: 'Detected' };
      case 'investigating':
        return { icon: Eye, color: 'text-orange-500', label: 'Investigating' };
      case 'resolved':
        return { icon: CheckCircle2, color: 'text-green-500', label: 'Resolved' };
      case 'false_positive':
        return { icon: XCircle, color: 'text-gray-500', label: 'False Positive' };
    }
  };

  const updateStatus = (id: string, newStatus: Anomaly['status']) => {
    setAnomalies(prev => 
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
  };

  const activeAnomalies = anomalies.filter(a => a.status === 'detected' || a.status === 'investigating');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Anomaly Detection Engine
            </CardTitle>
            <CardDescription>
              Machine learning-powered real-time anomaly detection and pattern recognition
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              <Zap className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Badge variant="outline">{activeAnomalies.length} Active</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="anomalies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="anomalies">Detected Anomalies</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="anomalies" className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="text-2xl font-bold">{activeAnomalies.length}</div>
                <div className="text-xs text-muted-foreground">Active Anomalies</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="text-2xl font-bold text-green-500">{detectionRate}%</div>
                <div className="text-xs text-muted-foreground">Detection Rate</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="text-2xl font-bold text-blue-500">{falsePositiveRate}%</div>
                <div className="text-xs text-muted-foreground">False Positive Rate</div>
              </div>
            </div>

            {/* Anomaly List */}
            <ScrollArea className="h-[400px]">
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {anomalies.map((anomaly) => {
                    const severityConfig = getSeverityConfig(anomaly.severity);
                    const statusConfig = getStatusConfig(anomaly.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <motion.div
                        key={anomaly.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        layout
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          severityConfig.bg,
                          severityConfig.border
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={cn("p-2 rounded-full", severityConfig.bg)}>
                              <AlertTriangle className={cn("h-4 w-4", severityConfig.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {severityConfig.label}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {anomaly.sector}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs", statusConfig.color)}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                                {anomaly.autoResolved && (
                                  <Badge className="text-xs bg-blue-500/10 text-blue-600">
                                    Auto-Resolved
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-sm mb-1">{anomaly.metric}</h4>
                              <div className="grid grid-cols-3 gap-3 text-xs mb-2">
                                <div>
                                  <span className="text-muted-foreground">Expected:</span>
                                  <span className="font-medium ml-1">{anomaly.expectedValue}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Actual:</span>
                                  <span className="font-medium ml-1">{anomaly.actualValue}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Deviation:</span>
                                  <span className={cn(
                                    "font-medium ml-1",
                                    anomaly.deviation < 0 ? "text-red-500" : "text-orange-500"
                                  )}>
                                    {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {anomaly.timestamp.toLocaleTimeString()}
                                </div>
                                <div>
                                  ML Confidence: {(anomaly.confidence * 100).toFixed(0)}%
                                </div>
                              </div>
                            </div>
                          </div>
                          {anomaly.status !== 'resolved' && anomaly.status !== 'false_positive' && (
                            <div className="flex gap-1 shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus(anomaly.id, 'investigating')}
                                disabled={anomaly.status === 'investigating'}
                              >
                                Investigate
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateStatus(anomaly.id, 'resolved')}
                              >
                                Resolve
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="space-y-3">
              {patterns.map((pattern, index) => (
                <div key={index} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{pattern.pattern}</h4>
                      <p className="text-xs text-muted-foreground">
                        Last seen: {pattern.lastSeen.toLocaleString()}
                      </p>
                    </div>
                    <Badge 
                      variant="outline"
                      className={cn(
                        pattern.trend === 'decreasing' ? 'text-green-600' :
                        pattern.trend === 'increasing' ? 'text-red-600' : 'text-gray-600'
                      )}
                    >
                      <TrendingUp className={cn(
                        "h-3 w-3 mr-1",
                        pattern.trend === 'decreasing' && 'rotate-180'
                      )} />
                      {pattern.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{pattern.occurrences}</div>
                    <div className="text-xs text-muted-foreground">occurrences detected</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-3">24-Hour Anomaly Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false}
                      label={{ value: 'Hour', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false}
                    />
                    <Tooltip />
                    <ReferenceLine y={50} stroke="#888" strokeDasharray="3 3" label="Expected" />
                    <ReferenceLine y={55} stroke="#ef4444" strokeDasharray="3 3" label="Upper Bound" />
                    <ReferenceLine y={45} stroke="#ef4444" strokeDasharray="3 3" label="Lower Bound" />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Detection Accuracy</span>
                    <span className="font-bold">{detectionRate}%</span>
                  </div>
                  <Progress value={detectionRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-bold">1.2s</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
