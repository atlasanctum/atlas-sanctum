import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, Play, RefreshCw, Globe, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { AtlasPlanetaryTwins } from '../../services/ai/digital-twins/PlanetaryTwins';

export default function DigitalTwins() {
  const [twins] = useState(AtlasPlanetaryTwins.registry.all());
  const [selected, setSelected] = useState(0);
  const [simResult, setSimResult] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState(AtlasPlanetaryTwins.networkStatus());

  const runSimulation = () => {
    const twin = twins[selected];
    const scenarioId = `scenario-${Date.now()}`;
    AtlasPlanetaryTwins.simulation.register({
      scenarioId,
      twinId: twin.twinId,
      name: 'Regenerative Intervention',
      interventions: Object.keys(twin.realWorldState).slice(0, 2).map(metric => ({
        metric,
        delta: twin.baselineState[metric] !== undefined
          ? (twin.baselineState[metric] - twin.realWorldState[metric]) * 0.3
          : 0,
        rationale: 'Regenerative restoration toward baseline',
      })),
      timeHorizonYears: 10,
      createdBy: 'atlas-sanctum',
      createdAt: Date.now(),
    });
    const result = AtlasPlanetaryTwins.simulation.run(scenarioId);
    setSimResult(result);
    setNetworkStatus(AtlasPlanetaryTwins.networkStatus());
  };

  const syncTwin = () => {
    const twin = twins[selected];
    AtlasPlanetaryTwins.sync({
      twinId: twin.twinId,
      source: 'manual-refresh',
      incomingState: twin.realWorldState,
      timestamp: Date.now(),
      confidence: 0.95,
    });
    setNetworkStatus(AtlasPlanetaryTwins.networkStatus());
  };

  const activeTwin = twins[selected];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Live</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Planetary Digital Twins</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Real-time digital models of Earth's critical ecosystems — syncing from satellite and sensor data, running regenerative simulations.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Layers, label: 'Total Twins', value: networkStatus.totalTwins },
            { icon: CheckCircle2, label: 'Synced', value: networkStatus.synced, color: 'text-emerald-500' },
            { icon: AlertTriangle, label: 'Diverged', value: networkStatus.diverged, color: 'text-amber-500' },
            { icon: Globe, label: 'Active Alerts', value: networkStatus.activeAlerts, color: 'text-red-500' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color ?? 'text-primary'}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> Twin Registry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {twins.map((twin, i) => (
                <button
                  key={twin.twinId}
                  onClick={() => { setSelected(i); setSimResult(null); }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${selected === i ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 hover:bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-foreground">{twin.name}</span>
                    <span className={`w-2 h-2 rounded-full ${twin.status === 'synced' ? 'bg-emerald-500' : twin.status === 'diverged' ? 'bg-red-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="capitalize">{twin.entityType.replace('_', ' ')}</span>
                    <span>Δ {(twin.divergenceScore * 100).toFixed(0)}% divergence</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {activeTwin.name}
                  <Badge variant="secondary" className="ml-auto capitalize">{activeTwin.entityType.replace('_', ' ')}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {Object.entries(activeTwin.realWorldState).map(([metric, value]) => {
                    const baseline = activeTwin.baselineState[metric];
                    const delta = baseline !== undefined ? ((value - baseline) / Math.abs(baseline || 1)) * 100 : 0;
                    return (
                      <div key={metric} className="p-3 rounded-lg bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1 capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="font-bold text-foreground text-sm">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        {baseline !== undefined && (
                          <p className={`text-xs ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs baseline
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <Button variant="hero" className="flex-1" onClick={runSimulation}>
                    <Play className="w-4 h-4 mr-2" /> Run Simulation
                  </Button>
                  <Button variant="outline" onClick={syncTwin}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {simResult && (
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Simulation Results
                    <Badge className="ml-auto bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      {(simResult.confidenceInterval[0] * 100).toFixed(0)}–{(simResult.confidenceInterval[1] * 100).toFixed(0)}% confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {simResult.keyInsights.map((insight: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{insight}</p>
                    </div>
                  ))}
                  {simResult.risks.map((risk: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{risk}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
