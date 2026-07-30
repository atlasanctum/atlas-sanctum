import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { 
  Workflow, 
  Play, 
  Pause, 
  RotateCw, 
  Settings2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Database,
  Filter,
  Zap,
  Save
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion } from 'motion/react';

interface PipelineNode {
  id: string;
  type: 'source' | 'transform' | 'validate' | 'enrich' | 'destination';
  name: string;
  status: 'idle' | 'running' | 'success' | 'error' | 'warning';
  config?: Record<string, any>;
  duration?: number;
  processedRecords?: number;
}

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'error';
  nodes: PipelineNode[];
  schedule: string;
  lastRun?: Date;
  nextRun?: Date;
  successRate: number;
  avgDuration: number;
}

export const DataPipelineOrchestrator: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'IoT Sensor Data Pipeline',
      description: 'Ingests and processes real-time sensor data from agriculture sector',
      status: 'active',
      schedule: 'Every 5 minutes',
      lastRun: new Date(Date.now() - 300000),
      nextRun: new Date(Date.now() + 300000),
      successRate: 98.7,
      avgDuration: 12,
      nodes: [
        { 
          id: 'n1', 
          type: 'source', 
          name: 'IoT Sensors', 
          status: 'success',
          processedRecords: 15420,
          duration: 2 
        },
        { 
          id: 'n2', 
          type: 'validate', 
          name: 'Data Validation', 
          status: 'success',
          processedRecords: 15398,
          duration: 3 
        },
        { 
          id: 'n3', 
          type: 'transform', 
          name: 'Transform & Normalize', 
          status: 'success',
          processedRecords: 15398,
          duration: 4 
        },
        { 
          id: 'n4', 
          type: 'enrich', 
          name: 'ML Enrichment', 
          status: 'success',
          processedRecords: 15398,
          duration: 2 
        },
        { 
          id: 'n5', 
          type: 'destination', 
          name: 'Data Warehouse', 
          status: 'success',
          processedRecords: 15398,
          duration: 1 
        },
      ],
    },
    {
      id: '2',
      name: 'Satellite Imagery Processing',
      description: 'Processes satellite imagery for oceanic monitoring',
      status: 'active',
      schedule: 'Daily at 2:00 AM',
      lastRun: new Date(Date.now() - 43200000),
      nextRun: new Date(Date.now() + 43200000),
      successRate: 95.2,
      avgDuration: 45,
      nodes: [
        { id: 'n6', type: 'source', name: 'Satellite Feed', status: 'running', duration: 15 },
        { id: 'n7', type: 'transform', name: 'Image Processing', status: 'idle' },
        { id: 'n8', type: 'validate', name: 'Quality Check', status: 'idle' },
        { id: 'n9', type: 'destination', name: 'Image Store', status: 'idle' },
      ],
    },
    {
      id: '3',
      name: 'Healthcare Data Integration',
      description: 'Aggregates healthcare metrics from multiple sources',
      status: 'paused',
      schedule: 'Every hour',
      lastRun: new Date(Date.now() - 7200000),
      successRate: 99.1,
      avgDuration: 8,
      nodes: [
        { id: 'n10', type: 'source', name: 'Healthcare APIs', status: 'idle' },
        { id: 'n11', type: 'validate', name: 'HIPAA Validation', status: 'idle' },
        { id: 'n12', type: 'transform', name: 'Data Harmonization', status: 'idle' },
        { id: 'n13', type: 'destination', name: 'Analytics DB', status: 'idle' },
      ],
    },
  ]);

  const [selectedPipeline, setSelectedPipeline] = useState<string>('1');

  const getNodeTypeConfig = (type: PipelineNode['type']) => {
    switch (type) {
      case 'source':
        return { icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Source' };
      case 'transform':
        return { icon: Settings2, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Transform' };
      case 'validate':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Validate' };
      case 'enrich':
        return { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Enrich' };
      case 'destination':
        return { icon: Save, color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'Destination' };
    }
  };

  const getStatusConfig = (status: PipelineNode['status']) => {
    switch (status) {
      case 'idle':
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Idle' };
      case 'running':
        return { icon: Play, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Running' };
      case 'success':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Success' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Error' };
      case 'warning':
        return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Warning' };
    }
  };

  const togglePipelineStatus = (id: string) => {
    setPipelines(prev =>
      prev.map(p => 
        p.id === id 
          ? { ...p, status: p.status === 'active' ? 'paused' as const : 'active' as const }
          : p
      )
    );
  };

  const activePipeline = pipelines.find(p => p.id === selectedPipeline);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-indigo-500" />
              Data Pipeline Orchestrator
            </CardTitle>
            <CardDescription>
              Visual pipeline builder and workflow automation
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              {pipelines.filter(p => p.status === 'active').length} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pipeline List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Pipelines</h3>
            <Button size="sm" variant="outline">
              <Settings2 className="h-3 w-3 mr-2" />
              New Pipeline
            </Button>
          </div>
          <div className="grid gap-3">
            {pipelines.map((pipeline) => (
              <motion.div
                key={pipeline.id}
                whileHover={{ scale: 1.01 }}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all",
                  selectedPipeline === pipeline.id
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/30 hover:bg-muted/50"
                )}
                onClick={() => setSelectedPipeline(pipeline.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{pipeline.name}</h4>
                      <Badge 
                        variant="outline"
                        className={cn(
                          pipeline.status === 'active' ? 'text-green-600 border-green-500/20' :
                          pipeline.status === 'paused' ? 'text-gray-600 border-gray-500/20' :
                          'text-red-600 border-red-500/20'
                        )}
                      >
                        {pipeline.status === 'active' ? <Play className="h-3 w-3 mr-1" /> :
                         pipeline.status === 'paused' ? <Pause className="h-3 w-3 mr-1" /> :
                         <AlertCircle className="h-3 w-3 mr-1" />}
                        {pipeline.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {pipeline.description}
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Schedule:</span>
                        <div className="font-medium">{pipeline.schedule}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate:</span>
                        <div className="font-medium text-green-600">{pipeline.successRate}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <div className="font-medium">{pipeline.avgDuration}s</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePipelineStatus(pipeline.id);
                      }}
                    >
                      {pipeline.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress for running pipelines */}
                {pipeline.nodes.some(n => n.status === 'running') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Processing...</span>
                      <span className="font-medium">
                        {Math.round((pipeline.nodes.filter(n => n.status === 'success').length / pipeline.nodes.length) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(pipeline.nodes.filter(n => n.status === 'success').length / pipeline.nodes.length) * 100} 
                      className="h-1.5"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pipeline Visualization */}
        {activePipeline && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Pipeline Flow</h3>
            <ScrollArea className="w-full">
              <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border min-w-max">
                {activePipeline.nodes.map((node, index) => {
                  const typeConfig = getNodeTypeConfig(node.type);
                  const statusConfig = getStatusConfig(node.status);
                  const TypeIcon = typeConfig.icon;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <React.Fragment key={node.id}>
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "relative p-4 rounded-lg border bg-background min-w-[180px]",
                          node.status === 'running' && "ring-2 ring-blue-500 ring-offset-2"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={cn("p-2 rounded-lg", typeConfig.bg)}>
                            <TypeIcon className={cn("h-4 w-4", typeConfig.color)} />
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", statusConfig.color)}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{node.name}</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Type:</span>
                            <span className="font-medium">{typeConfig.label}</span>
                          </div>
                          {node.processedRecords !== undefined && (
                            <div className="flex items-center justify-between">
                              <span>Records:</span>
                              <span className="font-medium">{node.processedRecords.toLocaleString()}</span>
                            </div>
                          )}
                          {node.duration !== undefined && (
                            <div className="flex items-center justify-between">
                              <span>Duration:</span>
                              <span className="font-medium">{node.duration}s</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      {index < activePipeline.nodes.length - 1 && (
                        <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Pipeline Stats */}
        {activePipeline && (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-muted/30 border">
              <div className="text-xs text-muted-foreground mb-1">Last Run</div>
              <div className="font-semibold text-sm">
                {activePipeline.lastRun?.toLocaleTimeString() || 'Never'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border">
              <div className="text-xs text-muted-foreground mb-1">Next Run</div>
              <div className="font-semibold text-sm">
                {activePipeline.nextRun?.toLocaleTimeString() || 'N/A'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border">
              <div className="text-xs text-muted-foreground mb-1">Total Nodes</div>
              <div className="font-semibold text-sm">
                {activePipeline.nodes.length} steps
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};