import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FlaskConical, Play, Sliders, BarChart3, Clock, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const scenarios = [
  { name: '2°C Warming Pathway', domain: 'Climate', runs: 1240, status: 'complete', outcome: 'moderate-risk' },
  { name: 'Global Food Crisis 2030', domain: 'Agriculture', runs: 890, status: 'complete', outcome: 'high-risk' },
  { name: 'Pandemic Preparedness', domain: 'Health', runs: 2100, status: 'running', outcome: null },
  { name: 'Renewable Energy Transition', domain: 'Energy', runs: 670, status: 'complete', outcome: 'positive' },
  { name: 'Urban Migration Surge', domain: 'Governance', runs: 430, status: 'queued', outcome: null },
];

const outcomeColor: Record<string, string> = {
  'positive': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  'moderate-risk': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  'high-risk': 'bg-red-500/10 text-red-600 border-red-500/20',
};

const variables = [
  { name: 'CO₂ Concentration', min: 350, max: 600, unit: 'ppm', current: 420 },
  { name: 'Global Temperature', min: 0, max: 4, unit: '°C above baseline', current: 1.4 },
  { name: 'Renewable Share', min: 10, max: 100, unit: '%', current: 34 },
];

export default function SimulationEngine() {
  const [running, setRunning] = useState(false);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Phase 3</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Simulation Engine</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Monte Carlo and agent-based simulations for testing policy interventions, climate scenarios, and systemic risk across interconnected global systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FlaskConical, label: 'Total Simulations', value: '5,330' },
            { icon: Play, label: 'Running Now', value: '1' },
            { icon: Clock, label: 'Avg Runtime', value: '4.2 min' },
            { icon: Layers, label: 'Variables', value: '240+' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Scenario Library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenarios.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.domain} · {s.runs.toLocaleString()} runs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.outcome && <Badge className={`text-xs ${outcomeColor[s.outcome]}`}>{s.outcome}</Badge>}
                    <Badge variant={s.status === 'running' ? 'default' : 'secondary'} className="text-xs">
                      {s.status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse inline-block" />}
                      {s.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sliders className="w-5 h-5" /> Configure Simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {variables.map((v) => (
                <div key={v.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">{v.name}</span>
                    <span className="text-muted-foreground">{v.current} {v.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={v.min}
                    max={v.max}
                    defaultValue={v.current}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{v.min}</span>
                    <span>{v.max}</span>
                  </div>
                </div>
              ))}
              <Button
                className="w-full"
                variant="hero"
                onClick={() => setRunning(!running)}
              >
                {running ? (
                  <><span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />Running...</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" />Run Simulation</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
