import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  LayoutGrid, 
  Plus, 
  Save, 
  Trash2, 
  GripVertical, 
  BarChart3,
  PieChart,
  Activity,
  TrendingUp,
  MapPin,
  Eye,
  Edit
} from 'lucide-react';
import { cn } from './ui/utils';
import { motion } from 'motion/react';

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'map' | 'table' | 'alert' | 'insight';
  title: string;
  sector?: string;
  metric?: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
}

interface CustomDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  createdAt: Date;
  lastModified: Date;
  isDefault?: boolean;
}

export const CustomDashboardBuilder: React.FC = () => {
  const [dashboards, setDashboards] = useState<CustomDashboard[]>([
    {
      id: '1',
      name: 'Executive Overview',
      description: 'High-level KPIs and sector performance',
      widgets: [
        { id: 'w1', type: 'metric', title: 'Total Impact Score', size: 'small', position: { x: 0, y: 0 } },
        { id: 'w2', type: 'chart', title: 'Sector Comparison', size: 'medium', position: { x: 1, y: 0 } },
        { id: 'w3', type: 'map', title: 'Global Impact', size: 'large', position: { x: 0, y: 1 } },
      ],
      createdAt: new Date(),
      lastModified: new Date(),
      isDefault: true,
    },
    {
      id: '2',
      name: 'Operations Dashboard',
      description: 'Real-time monitoring and alerts',
      widgets: [
        { id: 'w4', type: 'alert', title: 'System Alerts', size: 'medium', position: { x: 0, y: 0 } },
        { id: 'w5', type: 'metric', title: 'Data Streams', size: 'small', position: { x: 1, y: 0 } },
        { id: 'w6', type: 'table', title: 'Active Data Sources', size: 'large', position: { x: 0, y: 1 } },
      ],
      createdAt: new Date(Date.now() - 86400000),
      lastModified: new Date(Date.now() - 3600000),
    },
  ]);

  const [selectedDashboard, setSelectedDashboard] = useState<string>('1');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardDesc, setNewDashboardDesc] = useState('');

  const widgetTypes = [
    { type: 'metric' as const, icon: Activity, label: 'Metric Card', description: 'Display a single metric' },
    { type: 'chart' as const, icon: BarChart3, label: 'Chart', description: 'Visualize data trends' },
    { type: 'map' as const, icon: MapPin, label: 'Geographic Map', description: 'Regional distribution' },
    { type: 'table' as const, icon: LayoutGrid, label: 'Data Table', description: 'Tabular data view' },
    { type: 'alert' as const, icon: Activity, label: 'Alert Feed', description: 'Live system alerts' },
    { type: 'insight' as const, icon: TrendingUp, label: 'AI Insights', description: 'ML recommendations' },
  ];

  const getSizeClass = (size: DashboardWidget['size']) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-2 row-span-1';
      case 'large': return 'col-span-2 row-span-2';
    }
  };

  const createNewDashboard = () => {
    const newDashboard: CustomDashboard = {
      id: Date.now().toString(),
      name: newDashboardName,
      description: newDashboardDesc,
      widgets: [],
      createdAt: new Date(),
      lastModified: new Date(),
    };
    setDashboards(prev => [...prev, newDashboard]);
    setSelectedDashboard(newDashboard.id);
    setNewDashboardName('');
    setNewDashboardDesc('');
    setIsBuilderOpen(false);
  };

  const deleteDashboard = (id: string) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
    if (selectedDashboard === id) {
      setSelectedDashboard(dashboards[0]?.id || '');
    }
  };

  const activeDashboard = dashboards.find(d => d.id === selectedDashboard);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-blue-500" />
              Custom Dashboard Builder
            </CardTitle>
            <CardDescription>
              Create personalized dashboards with drag-and-drop widgets
            </CardDescription>
          </div>
          <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Dashboard</DialogTitle>
                <DialogDescription>
                  Build a custom dashboard tailored to your needs
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Dashboard Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Agriculture Deep Dive"
                    value={newDashboardName}
                    onChange={(e) => setNewDashboardName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of this dashboard"
                    value={newDashboardDesc}
                    onChange={(e) => setNewDashboardDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={createNewDashboard}
                  disabled={!newDashboardName}
                >
                  Create Dashboard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dashboard Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Your Dashboards</Label>
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    selectedDashboard === dashboard.id
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedDashboard(dashboard.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{dashboard.name}</h4>
                        {dashboard.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {dashboard.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{dashboard.widgets.length} widgets</span>
                        <span>•</span>
                        <span>Modified {dashboard.lastModified.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit functionality
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {!dashboard.isDefault && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDashboard(dashboard.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Widget Palette */}
        {activeDashboard && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Available Widgets</Label>
                <Button variant="outline" size="sm">
                  <Save className="h-3 w-3 mr-2" />
                  Save Layout
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {widgetTypes.map((widget) => {
                  const Icon = widget.icon;
                  return (
                    <motion.div
                      key={widget.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{widget.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {widget.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Dashboard Preview</Label>
              <div className="border rounded-lg p-4 bg-muted/20">
                {activeDashboard.widgets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <LayoutGrid className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">No widgets yet</p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop widgets from above to build your dashboard
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 auto-rows-[100px]">
                    {activeDashboard.widgets.map((widget) => {
                      const widgetType = widgetTypes.find(w => w.type === widget.type);
                      const Icon = widgetType?.icon || Activity;
                      return (
                        <div
                          key={widget.id}
                          className={cn(
                            "p-4 rounded-lg border bg-background relative group",
                            getSizeClass(widget.size)
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <h4 className="font-semibold text-sm">{widget.title}</h4>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {widgetType?.description}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
