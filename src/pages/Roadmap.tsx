import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const phases = [
  {
    phase: 1,
    title: 'Foundation',
    status: 'complete',
    color: 'emerald',
    items: [
      { name: 'Core Dashboard', href: '/dashboard', done: true },
      { name: 'Authentication', href: '/auth', done: true },
      { name: 'Data Pipelines', href: '/data-metrics-engine', done: true },
      { name: 'AI Assistant', href: '/sanctum-ai', done: true },
      { name: 'REST API', href: '/api-documentation', done: true },
    ],
  },
  {
    phase: 2,
    title: 'Intelligence Expansion',
    status: 'active',
    color: 'blue',
    items: [
      { name: 'Knowledge Graph', href: '/knowledge-graph', done: true },
      { name: 'Satellite Integration', href: '/satellite-integration', done: true },
      { name: 'Predictive Analytics', href: '/predictive-analytics', done: true },
      { name: 'Mobile Application', href: '/mobile-app', done: true },
      { name: 'Public APIs', href: '/public-apis', done: true },
    ],
  },
  {
    phase: 3,
    title: 'Advanced Capabilities',
    status: 'active',
    color: 'purple',
    items: [
      { name: 'Multi-Agent Intelligence', href: '/multi-agent-intelligence', done: true },
      { name: 'Digital Twins', href: '/digital-twins', done: true },
      { name: 'Simulation Engine', href: '/simulation-engine', done: true },
      { name: 'Decision Intelligence', href: '/decision-intelligence', done: true },
      { name: 'Enterprise Platform', href: '/enterprise-platform', done: true },
    ],
  },
  {
    phase: 4,
    title: 'Global Ecosystem',
    status: 'active',
    color: 'amber',
    items: [
      { name: 'Global Marketplace', href: '/global-marketplace', done: true },
      { name: 'Open Research Platform', href: '/open-research', done: true },
      { name: 'Community Ecosystem', href: '/community-ecosystem', done: true },
      { name: 'Developer SDK', href: '/developer-sdk', done: true },
      { name: 'Plugin Marketplace', href: '/plugin-marketplace', done: true },
    ],
  },
];

const statusConfig = {
  complete: { label: 'Complete', icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
  active: { label: 'Live', icon: Circle, bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
  planned: { label: 'Planned', icon: Clock, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
};

const phaseColor: Record<string, string> = {
  emerald: 'border-emerald-500/30 from-emerald-500/5',
  blue: 'border-blue-500/30 from-blue-500/5',
  purple: 'border-purple-500/30 from-purple-500/5',
  amber: 'border-amber-500/30 from-amber-500/5',
};

export default function Roadmap() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Platform Roadmap</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From core infrastructure to a global regenerative intelligence ecosystem — four phases building the world's most trusted platform for civilization-scale decision making.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phase, i) => {
            const status = statusConfig[phase.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full bg-gradient-to-b ${phaseColor[phase.color]} to-card/50 border ${phaseColor[phase.color].split(' ')[0]}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-foreground">
                          {phase.phase}
                        </div>
                        <div>
                          <CardTitle className="text-lg">Phase {phase.phase}</CardTitle>
                          <p className="text-sm text-muted-foreground">{phase.title}</p>
                        </div>
                      </div>
                      <Badge className={`${status.bg} ${status.text} ${status.border}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {phase.items.map((item) => (
                      <Link key={item.name} to={item.href}>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${item.done ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Card className="bg-gradient-to-br from-primary/10 via-ocean/10 to-accent/10 border-primary/20 inline-block w-full max-w-2xl">
            <CardContent className="p-8">
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">All 4 Phases Live</h2>
              <p className="text-muted-foreground mb-6">
                20 features across 4 phases — from core dashboard to global marketplace, all operational and ready to drive regenerative impact at civilization scale.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button variant="hero" asChild>
                  <Link to="/dashboard">Launch Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/public-apis">Explore APIs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageLayout>
  );
}
