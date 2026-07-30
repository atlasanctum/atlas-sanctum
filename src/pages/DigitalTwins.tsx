import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, Play, RefreshCw, Settings2, Globe, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const twins = [
  { name: 'Amazon Rainforest', type: 'Ecosystem', fidelity: 97, lastSync: '30s ago', status: 'synced' },
  { name: 'Lagos Metropolitan', type: 'Urban', fidelity: 94, lastSync: '1m ago', status: 'synced' },
  { name: 'North Sea Wind Farm', type: 'Energy', fidelity: 99, lastSync: '15s ago', status: 'synced' },
  { name: 'Mekong River Basin', type: 'Hydrology', fidelity: 91, lastSync: '2m ago', status: 'synced' },
  { name: 'Sahel Agricultural Zone', type: 'Agriculture', fidelity: 88, lastSync: '5m ago', status: 'updating' },
];

const metrics = [
  { label: 'Carbon Flux', value: '-2.4 GtC/yr', delta: '-0.3', positive: true },
  { label: 'Biodiversity Index', value: '0.74', delta: '+0.02', positive: true },
  { label: 'Water Stress', value: '38%', delta: '+2%', positive: false },
  { label: 'Soil Health Score', value: '6.8/10', delta: '+0.4', positive: true },
];

export default function DigitalTwins() {
  const [selected, setSelected] = useState(0);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Phase 3</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Digital Twins</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            High-fidelity virtual replicas of Earth's ecosystems, cities, and infrastructure — enabling real-time monitoring and scenario testing.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Layers, label: 'Active Twins', value: '5' },
            { icon: Cpu, label: 'Compute Nodes', value: '2,400' },
            { icon: RefreshCw, label: 'Sync Rate', value: '<30s' },
            { icon: Globe, label: 'Coverage (km²)', value: '8.4M' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> Twin Registry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {twins.map((twin, i) => (
                <button
                  key={twin.name}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${selected === i ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 hover:bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-foreground">{twin.name}</span>
                    <span className={`w-2 h-2 rounded-full ${twin.status === 'synced' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{twin.type}</span>
                    <span>{twin.fidelity}% fidelity</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5" />
                  {twins[selected].name}
                  <Badge variant="secondary" className="ml-auto">{twins[selected].type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {metrics.map((m) => (
                    <div key={m.label} className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                      <p className="font-bold text-foreground">{m.value}</p>
                      <p className={`text-xs ${m.positive ? 'text-emerald-600' : 'text-red-500'}`}>{m.delta} vs last month</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="hero" className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
