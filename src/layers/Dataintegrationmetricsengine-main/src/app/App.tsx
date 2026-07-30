import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Leaf,
  Droplets,
  HeartPulse,
  Recycle,
  Settings,
  Bell,
  Menu,
  Database,
  Map as MapIcon,
  ChevronRight,
  Zap,
  Download,
  Filter,
  Search,
  BarChart3,
  Activity,
  Sparkles
} from 'lucide-react';

import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { Input } from './components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Import advanced data
import { 
  sectors, 
  globalMetrics, 
  dataStreams,
  alerts,
  aiInsights,
  systemHealth,
  SectorData 
} from './data/advancedMockData';

// Import components
import { AdvancedMetricCard } from './components/AdvancedMetricCard';
import { AdvancedSectorChart } from './components/AdvancedSectorChart';
import { DataStreamMonitor } from './components/DataStreamMonitor';
import { AlertsPanel } from './components/AlertsPanel';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { SystemHealthDashboard } from './components/SystemHealthDashboard';
import { CorrelationMatrix } from './components/CorrelationMatrix';
import { GeographicImpactMap } from './components/GeographicImpactMap';
import { DataQualityIndicator } from './components/DataQualityIndicator';
import { RealTimeDataFeed } from './components/RealTimeDataFeed';
import { SectorComparisonChart } from './components/SectorComparisonChart';
import { DataExportDialog } from './components/DataExportDialog';
import { AnomalyDetectionEngine } from './components/AnomalyDetectionEngine';
import { CustomDashboardBuilder } from './components/CustomDashboardBuilder';
import { DataPipelineOrchestrator } from './components/DataPipelineOrchestrator';
import { SmartNotificationCenter } from './components/SmartNotificationCenter';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { CommandPalette } from './components/CommandPalette';
import { InteractiveFilters } from './components/InteractiveFilters';
import { DataDrillDown } from './components/DataDrillDown';
import { UserPreferences } from './components/UserPreferences';
import { QuickActions } from './components/QuickActions';

// --- Components ---

const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  isCollapsed = false,
  badge,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed?: boolean;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group relative ${
      isActive
        ? 'bg-primary text-primary-foreground shadow-md'
        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
    }`}
  >
    <Icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
    {!isCollapsed && <span className="font-medium">{label}</span>}
    {!isCollapsed && isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
    {badge && badge > 0 && !isCollapsed && (
      <Badge className="ml-auto h-5 px-1.5 min-w-5 text-xs">{badge}</Badge>
    )}
  </button>
);

const EcosystemMap = () => {
  const nodes = Array.from({ length: 32 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 12 + 4,
    pulse: Math.random() * 2.5 + 1,
    opacity: Math.random() * 0.4 + 0.3,
  }));

  return (
    <Card className="col-span-1 lg:col-span-4 min-h-[500px] overflow-hidden relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-0">
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-blue-400" /> Live Ecosystem Map
            </CardTitle>
            <CardDescription className="text-slate-400">
              Real-time node monitoring across 4 regenerative sectors
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-slate-700 text-white hover:bg-slate-800">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </CardHeader>
      <div className="absolute inset-0 z-0">
        {/* Enhanced Map Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-950" />
        <svg className="w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-700"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Enhanced Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute rounded-full bg-blue-500 blur-[2px]"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: node.size,
              height: node.size,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [node.opacity, node.opacity + 0.4, node.opacity],
            }}
            transition={{
              duration: node.pulse,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Enhanced Connecting Lines */}
        <svg className="absolute inset-0 pointer-events-none opacity-30">
          <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
          <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
          <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
          <line x1="30%" y1="80%" x2="70%" y2="70%" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1.5" />
          <line x1="80%" y1="20%" x2="60%" y2="60%" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1.5" />
        </svg>
      </div>
      
      {/* Enhanced Overlay Stats */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-semibold">Active Nodes:</span> 1,847
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-semibold">Data Stream:</span> 6.8 GB/s
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="font-semibold">ML Processing:</span> 124K ops/s
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-semibold">Sensors:</span> 4,256 online
        </div>
      </div>
    </Card>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertsList, setAlertsList] = useState(alerts);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const activeSector = sectors.find(s => s.id === activeView);
  const unacknowledgedAlerts = alertsList.filter(a => !a.acknowledged).length;

  // Command Palette keyboard shortcut (Cmd+K or Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlertsList(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const handleDismissAlert = (alertId: string) => {
    setAlertsList(prev => prev.filter(alert => alert.id !== alertId));
  };

  const renderContent = () => {
    if (activeView === 'dashboard') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* System Health */}
          <SystemHealthDashboard health={systemHealth} />

          {/* Global Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {globalMetrics.map((metric) => (
              <Card key={metric.label} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.label}
                  </CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}{metric.unit}</div>
                  <p className="text-xs text-muted-foreground">
                    {metric.change > 0 && '+'}{metric.change}% from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map and AI Insights */}
          <div className="grid gap-4 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <EcosystemMap />
            </div>
            <div className="lg:col-span-3">
              <AIInsightsPanel insights={aiInsights} maxDisplay={4} />
            </div>
          </div>

          {/* Sector Summaries */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Sector Overview</h2>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare Sectors
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {sectors.map((sector) => (
                <Card 
                  key={sector.id} 
                  className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
                  onClick={() => setActiveView(sector.id)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-medium">
                        {sector.name}
                      </CardTitle>
                      <DataQualityIndicator quality={sector.dataQuality} />
                    </div>
                    <sector.icon className={`h-4 w-4 ${sector.color} group-hover:scale-110 transition-transform`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sector.impactScore}
                      <span className="text-sm font-normal text-muted-foreground">/100</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {sector.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{sector.activeDataStreams} streams</span>
                      <span>{sector.totalDataPoints} data points</span>
                    </div>
                    <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${sector.color.replace('text-', 'bg-')} transition-all`} style={{ width: `${sector.impactScore}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Data Streams and Alerts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <DataStreamMonitor streams={dataStreams} />
            <AlertsPanel 
              alerts={alertsList} 
              onAcknowledge={handleAcknowledgeAlert}
              onDismiss={handleDismissAlert}
            />
          </div>

          {/* Analytics and Live Feed */}
          <div className="grid gap-4 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <SectorComparisonChart sectors={sectors} />
            </div>
            <div className="lg:col-span-3">
              <RealTimeDataFeed />
            </div>
          </div>
        </motion.div>
      );
    }

    if (activeView === 'innovations') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-500" />
                Platform Innovations
              </h2>
              <p className="text-muted-foreground mt-1">
                Advanced features powering elite data integration and analytics
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              5 New Features
            </Badge>
          </div>

          {/* Anomaly Detection */}
          <AnomalyDetectionEngine />

          {/* Predictive Analytics */}
          <PredictiveAnalytics />

          {/* Smart Notifications & Pipeline */}
          <div className="grid gap-4 lg:grid-cols-2">
            <SmartNotificationCenter />
            <DataPipelineOrchestrator />
          </div>

          {/* Custom Dashboard Builder */}
          <CustomDashboardBuilder />
        </motion.div>
      );
    }

    if (activeView === 'interactions') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Zap className="h-8 w-8 text-yellow-500" />
                Interactive Features
              </h2>
              <p className="text-muted-foreground mt-1">
                Advanced interactions, filters, and user experience enhancements
              </p>
            </div>
            <QuickActions context="dashboard" />
          </div>

          {/* Data Drill Down & Interactive Filters */}
          <div className="grid gap-4 lg:grid-cols-7">
            <div className="lg:col-span-5">
              <DataDrillDown />
            </div>
            <div className="lg:col-span-2">
              <InteractiveFilters />
            </div>
          </div>

          {/* User Preferences */}
          <UserPreferences />
        </motion.div>
      );
    }

    if (activeSector) {
      return (
        <motion.div
          key={activeSector.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Sector Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-muted shadow-inner`}>
                <activeSector.icon className={`h-8 w-8 ${activeSector.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-bold tracking-tight">{activeSector.name} Sector</h2>
                  <DataQualityIndicator quality={activeSector.dataQuality} showLabel size="md" />
                </div>
                <p className="text-muted-foreground">{activeSector.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4"/> Export Data
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4"/> Generate Report
              </Button>
            </div>
          </div>
          
          <Separator />

          {/* Sector Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="geographic">Geographic</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeSector.metrics.map(metric => (
                  <AdvancedMetricCard key={metric.id} metric={metric} />
                ))}
              </div>

              {/* Charts */}
              <div className="grid gap-4 lg:grid-cols-7">
                <AdvancedSectorChart 
                  data={activeSector.forecast} 
                  title={`${activeSector.name} Impact Forecast`} 
                  color={activeSector.color}
                  showConfidence={true}
                />
                
                {/* Quick Stats Panel */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{activeSector.activeDataStreams}</div>
                        <div className="text-xs text-muted-foreground">Active Data Streams</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{activeSector.totalDataPoints}</div>
                        <div className="text-xs text-muted-foreground">Total Data Points</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{activeSector.impactScore}</div>
                        <div className="text-xs text-muted-foreground">Impact Score</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold capitalize">{activeSector.dataQuality}</div>
                        <div className="text-xs text-muted-foreground">Data Quality</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Recent Activity</h4>
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <Activity className="h-3 w-3 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium">Data sync completed</p>
                            <p className="text-xs text-muted-foreground">{i + 1} hour{i !== 0 ? 's' : ''} ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {activeSector.correlations && (
                  <CorrelationMatrix correlations={activeSector.correlations} />
                )}
                <Card>
                  <CardHeader>
                    <CardTitle>Trend Analysis</CardTitle>
                    <CardDescription>Statistical breakdown of key metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeSector.metrics.slice(0, 4).map((metric) => (
                        <div key={metric.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{metric.label}</span>
                            <span className={`text-sm font-bold ${
                              metric.change > 0 ? 'text-green-500' : 
                              metric.change < 0 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {metric.change > 0 ? '+' : ''}{metric.change}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={metric.change > 0 ? 'bg-green-500' : 'bg-red-500'}
                              style={{ width: `${Math.min(Math.abs(metric.change) * 5, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <AIInsightsPanel 
                insights={aiInsights.filter(insight => insight.sector === activeSector.id)} 
                maxDisplay={10}
              />
            </TabsContent>

            <TabsContent value="geographic" className="space-y-4">
              {activeSector.geographicData && (
                <GeographicImpactMap data={activeSector.geographicData} />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/20">
        <div className="p-6 flex items-center gap-2 border-b">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight">RegenMetrics</span>
            <p className="text-xs text-muted-foreground">Elite Engine v2.0</p>
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-2">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              isActive={activeView === 'dashboard'} 
              onClick={() => setActiveView('dashboard')} 
            />
            <div className="py-2">
              <h4 className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Sectors</h4>
              {sectors.map((sector) => (
                <SidebarItem 
                  key={sector.id}
                  icon={sector.icon} 
                  label={sector.name} 
                  isActive={activeView === sector.id} 
                  onClick={() => setActiveView(sector.id)} 
                />
              ))}
            </div>
            <Separator className="my-2" />
            <SidebarItem 
              icon={Sparkles} 
              label="Innovations" 
              isActive={activeView === 'innovations'} 
              onClick={() => setActiveView('innovations')}
            />
            <SidebarItem 
              icon={Zap} 
              label="Interactions" 
              isActive={activeView === 'interactions'} 
              onClick={() => setActiveView('interactions')}
            />
            <SidebarItem 
              icon={Activity} 
              label="Data Streams" 
              isActive={false} 
              onClick={() => {}}
              badge={dataStreams.filter(s => s.status === 'active').length}
            />
          </nav>
        </ScrollArea>
        <div className="p-4 border-t space-y-2">
          <SidebarItem icon={Settings} label="Settings" isActive={false} onClick={() => {}} />
        </div>
      </aside>

      {/* Command Palette - Global */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(view) => {
          setActiveView(view);
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                {/* Mobile Sidebar - Same as desktop */}
                <div className="p-6 flex items-center gap-2 border-b">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl tracking-tight">RegenMetrics</span>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <nav className="space-y-2">
                    <SidebarItem 
                      icon={LayoutDashboard} 
                      label="Dashboard" 
                      isActive={activeView === 'dashboard'} 
                      onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }} 
                    />
                    <div className="py-2">
                      <h4 className="px-4 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Sectors</h4>
                      {sectors.map((sector) => (
                        <SidebarItem 
                          key={sector.id}
                          icon={sector.icon} 
                          label={sector.name} 
                          isActive={activeView === sector.id} 
                          onClick={() => { setActiveView(sector.id); setIsSidebarOpen(false); }} 
                        />
                      ))}
                    </div>
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search metrics, insights..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden lg:flex">
              <Database className="mr-2 h-4 w-4" /> Data Sources
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unacknowledgedAlerts > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{unacknowledgedAlerts} New Alerts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SE</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-[1600px] mx-auto pb-10">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}