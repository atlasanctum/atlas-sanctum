import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, MapPin, Check, ChevronRight, BarChart3, Radar, TrendingUp, DollarSign, Leaf, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CarbonProject} from '@/types/marketplace';
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_ICONS } from '@/types/marketplace';
import { Link } from 'react-router-dom';
import { ComparisonChart } from './ComparisonChart';
import { ComparisonPDFExport } from './ComparisonPDFExport';
import { cn } from '@/lib/utils';

interface ProjectComparisonModalProps {
  projects: CarbonProject[];
  isOpen: boolean;
  onClose: () => void;
  maxCompare?: number;
}

export function ProjectComparisonModal({ 
  projects: initialProjects, 
  isOpen, 
  onClose,
  maxCompare = 3 
}: ProjectComparisonModalProps) {
  const [selectedProjects, setSelectedProjects] = useState<CarbonProject[]>(
    initialProjects.slice(0, maxCompare)
  );
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  const toggleProject = (project: CarbonProject) => {
    if (selectedProjects.find(p => p.id === project.id)) {
      setSelectedProjects(selectedProjects.filter(p => p.id !== project.id));
    } else if (selectedProjects.length < maxCompare) {
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  const comparisonMetrics = [
    { label: 'Price per Credit', key: 'price_per_credit', unit: '$', icon: DollarSign },
    { label: 'CO₂ Offset', key: 'co2_offset_per_credit', unit: 't', icon: Leaf },
    { label: 'Available Credits', key: 'available_credits', unit: '', icon: TrendingUp },
    { label: 'Vintage Year', key: 'vintage_year', unit: '', icon: Shield },
    { label: 'Impact Score', key: 'impact_score', unit: '/100', icon: BarChart3 },
  ];

  // Calculate best value for each metric
  const getBestValue = (key: string) => {
    if (selectedProjects.length === 0) return null;
    
    const values = selectedProjects.map(p => (p as any)[key]).filter(v => v != null);
    if (values.length === 0) return null;
    
    // For price, lower is better; for others, higher is better
    if (key === 'price_per_credit') {
      return Math.min(...values);
    }
    return Math.max(...values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border/50" aria-labelledby="compare-projects-title">
        <DialogHeader>
          <DialogTitle id="compare-projects-title" className="text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Compare Projects
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select up to {maxCompare} projects to compare side-by-side with detailed metrics
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="selection" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="selection">Selection</TabsTrigger>
            <TabsTrigger value="table" disabled={selectedProjects.length === 0}>
              Comparison Table
            </TabsTrigger>
            <TabsTrigger value="charts" disabled={selectedProjects.length < 2}>
              Visual Charts
            </TabsTrigger>
          </TabsList>

          {/* Selection Tab */}
          <TabsContent value="selection" className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                Select Projects 
                <Badge variant="secondary">{selectedProjects.length}/{maxCompare}</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                {initialProjects.map((project) => {
                  const isSelected = selectedProjects.find(p => p.id === project.id);
                  const isDisabled = !isSelected && selectedProjects.length >= maxCompare;

                  return (
                    <motion.button
                      key={project.id}
                      onClick={() => !isDisabled && toggleProject(project)}
                      disabled={isDisabled}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all text-left flex items-start justify-between',
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                          : isDisabled
                          ? 'border-border/30 bg-muted/30 opacity-50 cursor-not-allowed'
                          : 'border-border/50 hover:border-primary/30 bg-card/50 hover:bg-card'
                      )}
                      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${project.title} for comparison`}
                      aria-pressed={!!isSelected}
                    >
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="font-medium text-foreground">{project.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {project.location}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {PROJECT_TYPE_ICONS[project.project_type]} {PROJECT_TYPE_LABELS[project.project_type]}
                          </Badge>
                          <span className="text-sm font-semibold text-primary">
                            ${project.price_per_credit.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-2">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* Comparison Table Tab */}
          <TabsContent value="table" className="space-y-4">
            {selectedProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground">Best Price</p>
                    <p className="text-lg font-bold text-primary">
                      ${getBestValue('price_per_credit')?.toFixed(2) || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                    <p className="text-xs text-muted-foreground">Highest CO₂</p>
                    <p className="text-lg font-bold text-chart-2">
                      {getBestValue('co2_offset_per_credit')?.toFixed(1) || 'N/A'}t
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
                    <p className="text-xs text-muted-foreground">Most Credits</p>
                    <p className="text-lg font-bold text-chart-3">
                      {getBestValue('available_credits')?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-chart-4/10 border border-chart-4/20">
                    <p className="text-xs text-muted-foreground">Top Impact</p>
                    <p className="text-lg font-bold text-chart-4">
                      {getBestValue('impact_score') || 'N/A'}/100
                    </p>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full">
                    <tbody>
                      {/* Project Headers */}
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-4 bg-muted/30 font-semibold text-foreground w-40">Project</td>
                        {selectedProjects.map((project) => (
                          <td key={project.id} className="px-4 py-4 bg-muted/30 min-w-48">
                            <div className="flex flex-col gap-2">
                              <div>
                                <p className="font-semibold text-foreground line-clamp-1">{project.title}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {project.location}
                                </p>
                              </div>
                              <Badge className="w-fit">
                                {PROJECT_TYPE_ICONS[project.project_type]} {PROJECT_TYPE_LABELS[project.project_type]}
                              </Badge>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Metrics Rows */}
                      {comparisonMetrics.map((metric, idx) => {
                        const bestValue = getBestValue(metric.key);
                        const MetricIcon = metric.icon;
                        
                        return (
                          <tr key={metric.key} className={idx % 2 === 0 ? 'bg-background/30' : ''}>
                            <td className="px-4 py-3 font-medium text-muted-foreground text-sm">
                              <div className="flex items-center gap-2">
                                <MetricIcon className="w-4 h-4" />
                                {metric.label}
                              </div>
                            </td>
                            {selectedProjects.map((project) => {
                              const value = (project as any)[metric.key];
                              const isBest = value === bestValue && selectedProjects.length > 1;
                              const displayValue = value !== null && value !== undefined 
                                ? typeof value === 'number' 
                                  ? metric.key === 'available_credits'
                                    ? value.toLocaleString()
                                    : value.toFixed(metric.key === 'price_per_credit' ? 2 : 1)
                                  : value
                                : 'N/A';

                              return (
                                <td key={project.id} className={cn(
                                  'px-4 py-3 font-medium',
                                  isBest ? 'text-primary bg-primary/5' : 'text-foreground'
                                )}>
                                  <div className="flex items-center gap-2">
                                    {metric.unit === '$' && metric.unit}
                                    {displayValue}
                                    {metric.unit !== '$' && metric.unit && ` ${metric.unit}`}
                                    {isBest && (
                                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                        Best
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}

                      {/* Certification Row */}
                      <tr className="border-t border-border/30 bg-background/30">
                        <td className="px-4 py-3 font-medium text-muted-foreground text-sm">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Certification
                          </div>
                        </td>
                        {selectedProjects.map((project) => (
                          <td key={project.id} className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {project.certification}
                            </Badge>
                          </td>
                        ))}
                      </tr>

                      {/* Verification Status */}
                      <tr className="bg-background/30">
                        <td className="px-4 py-3 font-medium text-muted-foreground text-sm">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Verification
                          </div>
                        </td>
                        {selectedProjects.map((project) => (
                          <td key={project.id} className="px-4 py-3">
                            {project.verified_by_system_at ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm text-green-600 font-medium">Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <span className="text-sm text-muted-foreground">Pending</span>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-4">
            {selectedProjects.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Visual Comparison</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={chartType === 'radar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('radar')}
                      className="gap-2"
                    >
                      <Radar className="w-4 h-4" />
                      Radar
                    </Button>
                    <Button
                      variant={chartType === 'bar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setChartType('bar')}
                      className="gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Bar
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card/50">
                  <ComparisonChart projects={selectedProjects} chartType={chartType} />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  {chartType === 'radar' 
                    ? 'Radar chart shows normalized scores (0-100) across key metrics. Larger area indicates better overall performance.'
                    : 'Bar chart compares raw values across selected projects for quick metric comparison.'
                  }
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border/30">
          <ComparisonPDFExport projects={selectedProjects} />
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-border/50"
          >
            Done
          </Button>
          {selectedProjects.length > 0 && (
            <Button asChild className="flex-1 bg-primary hover:bg-primary/90 gap-2">
              <Link to="/marketplace">
                Back to Marketplace
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
