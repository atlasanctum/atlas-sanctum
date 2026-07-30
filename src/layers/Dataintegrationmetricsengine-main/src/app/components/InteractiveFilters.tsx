import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Filter, 
  X, 
  Calendar,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface FilterState {
  dateRange: string;
  impactScoreRange: [number, number];
  sectors: string[];
  dataQuality: string[];
  trends: string[];
  showOnlyActive: boolean;
  showAnomalies: boolean;
}

interface InteractiveFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export const InteractiveFilters: React.FC<InteractiveFiltersProps> = ({ 
  onFilterChange 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '30d',
    impactScoreRange: [0, 100],
    sectors: [],
    dataQuality: ['excellent', 'good'],
    trends: [],
    showOnlyActive: false,
    showAnomalies: false,
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dateRange: true,
    impactScore: true,
    sectors: false,
    quality: false,
    advanced: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleArrayFilter = (key: 'sectors' | 'dataQuality' | 'trends', value: string) => {
    const current = filters[key];
    const newValue = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, newValue);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      dateRange: '30d',
      impactScoreRange: [0, 100],
      sectors: [],
      dataQuality: ['excellent', 'good'],
      trends: [],
      showOnlyActive: false,
      showAnomalies: false,
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFilterCount = 
    (filters.dateRange !== '30d' ? 1 : 0) +
    (filters.impactScoreRange[0] !== 0 || filters.impactScoreRange[1] !== 100 ? 1 : 0) +
    filters.sectors.length +
    (filters.dataQuality.length !== 2 ? 1 : 0) +
    filters.trends.length +
    (filters.showOnlyActive ? 1 : 0) +
    (filters.showAnomalies ? 1 : 0);

  const dateRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'custom', label: 'Custom' },
  ];

  const sectorOptions = [
    { value: 'agriculture', label: 'Agriculture', color: 'bg-green-500' },
    { value: 'oceanic', label: 'Oceanic', color: 'bg-blue-500' },
    { value: 'healthcare', label: 'Healthcare', color: 'bg-red-500' },
    { value: 'circular', label: 'Circular Economy', color: 'bg-amber-500' },
  ];

  const qualityOptions = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-600' },
    { value: 'good', label: 'Good', color: 'text-blue-600' },
    { value: 'fair', label: 'Fair', color: 'text-yellow-600' },
    { value: 'poor', label: 'Poor', color: 'text-red-600' },
  ];

  const trendOptions = [
    { value: 'up', label: 'Trending Up', icon: TrendingUp, color: 'text-green-500' },
    { value: 'down', label: 'Trending Down', icon: TrendingDown, color: 'text-red-500' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle>Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} Active</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <Collapsible open={expandedSections.dateRange} onOpenChange={() => toggleSection('dateRange')}>
          <CollapsibleTrigger className="w-full flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Date Range</span>
            </div>
            {expandedSections.dateRange ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                {dateRangeOptions.map(option => (
                  <Button
                    key={option.value}
                    variant={filters.dateRange === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('dateRange', option.value)}
                    className="h-8 text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Impact Score Range */}
        <Collapsible open={expandedSections.impactScore} onOpenChange={() => toggleSection('impactScore')}>
          <CollapsibleTrigger className="w-full flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Impact Score</span>
            </div>
            {expandedSections.impactScore ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 space-y-3 px-2"
            >
              <Slider
                min={0}
                max={100}
                step={1}
                value={filters.impactScoreRange}
                onValueChange={(value) => updateFilter('impactScoreRange', value as [number, number])}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{filters.impactScoreRange[0]}</span>
                <span className="font-medium text-foreground">
                  {filters.impactScoreRange[0]} - {filters.impactScoreRange[1]}
                </span>
                <span>{filters.impactScoreRange[1]}</span>
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Sectors */}
        <Collapsible open={expandedSections.sectors} onOpenChange={() => toggleSection('sectors')}>
          <CollapsibleTrigger className="w-full flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sectors</span>
              {filters.sectors.length > 0 && (
                <Badge variant="secondary" className="h-5 text-xs">
                  {filters.sectors.length}
                </Badge>
              )}
            </div>
            {expandedSections.sectors ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 space-y-2"
            >
              <AnimatePresence mode="popLayout">
                {sectorOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleArrayFilter('sectors', option.value)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      filters.sectors.includes(option.value)
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-muted/50 border-2 border-transparent hover:bg-muted"
                    )}
                  >
                    <div className={cn("w-3 h-3 rounded-full", option.color)} />
                    <span className="flex-1 text-left">{option.label}</span>
                    {filters.sectors.includes(option.value) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Data Quality */}
        <Collapsible open={expandedSections.quality} onOpenChange={() => toggleSection('quality')}>
          <CollapsibleTrigger className="w-full flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Data Quality</span>
              {filters.dataQuality.length !== qualityOptions.length && (
                <Badge variant="secondary" className="h-5 text-xs">
                  {filters.dataQuality.length}
                </Badge>
              )}
            </div>
            {expandedSections.quality ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 space-y-2"
            >
              {qualityOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.dataQuality.includes(option.value)}
                    onChange={() => toggleArrayFilter('dataQuality', option.value)}
                    className="rounded border-gray-300"
                  />
                  <span className={cn("text-sm font-medium", option.color)}>
                    {option.label}
                  </span>
                </label>
              ))}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Advanced Filters */}
        <Collapsible open={expandedSections.advanced} onOpenChange={() => toggleSection('advanced')}>
          <CollapsibleTrigger className="w-full flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2 transition-colors">
            <span className="text-sm font-medium">Advanced</span>
            {expandedSections.advanced ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 space-y-4 px-2"
            >
              {/* Trend Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Show Trends</Label>
                <div className="space-y-2">
                  {trendOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleArrayFilter('trends', option.value)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                          filters.trends.includes(option.value)
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-muted/50 border-2 border-transparent hover:bg-muted"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", option.color)} />
                        <span className="flex-1 text-left">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="active-only" className="text-sm cursor-pointer">
                    Active Data Only
                  </Label>
                  <Switch
                    id="active-only"
                    checked={filters.showOnlyActive}
                    onCheckedChange={(checked) => updateFilter('showOnlyActive', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="anomalies" className="text-sm cursor-pointer">
                    Show Anomalies
                  </Label>
                  <Switch
                    id="anomalies"
                    checked={filters.showAnomalies}
                    onCheckedChange={(checked) => updateFilter('showAnomalies', checked)}
                  />
                </div>
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
