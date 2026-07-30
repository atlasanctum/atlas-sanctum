import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Network, MessageSquare, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const agents = [
  { name: 'ClimateOracle', role: 'Climate Intelligence', status: 'active', tasks: 142, model: 'GPT-4o' },
  { name: 'EconoSage', role: 'Economic Analysis', status: 'active', tasks: 98, model: 'Claude 3.5' },
  { name: 'HealthGuardian', role: 'Health Surveillance', status: 'active', tasks: 76, model: 'Gemini Pro' },
  { name: 'GovAnalyst', role: 'Policy Intelligence', status: 'idle', tasks: 34, model: 'GPT-4o' },
  { name: 'AgriAdvisor', role: 'Agriculture Insights', status: 'active', tasks: 61, model: 'LLaMA 3' },
  { name: 'InfraWatcher', role: 'Infrastructure Monitor', status: 'active', tasks: 89, model: 'Claude 3.5' },
];

const interactions = [
  { from: 'ClimateOracle', to: 'AgriAdvisor', type: 'data-share', message: 'Drought forecast for Q3 transmitted' },
  { from: 'EconoSage', to: 'GovAnalyst', type: 'analysis', message: 'Fiscal impact model updated' },
  { from: 'HealthGuardian', to: 'ClimateOracle', type: 'query', message: 'Requesting heat stress projections' },
];

export default function MultiAgentIntelligence() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Phase 3</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Multi-Agent Intelligence</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Autonomous AI agents collaborating across domains — sharing knowledge, delegating tasks, and synthesizing insights in real time.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Bot, label: 'Active Agents', value: '5/6', color: 'text-purple-500' },
            { icon: MessageSquare, label: 'Messages/Hour', value: '2,840', color: 'text-blue-500' },
            { icon: Brain, label: 'Decisions Made', value: '18.4K', color: 'text-emerald-500' },
            { icon: Network, label: 'Agent Connections', value: '30', color: 'text-amber-500' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
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
              <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5" /> Agent Fleet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-sm text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.role} · {agent.model}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{agent.tasks} tasks</Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Agent Interactions
                <span className="ml-auto flex items-center gap-1.5 text-sm font-normal text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {interactions.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{msg.from}</Badge>
                    <Zap className="w-3 h-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">{msg.to}</Badge>
                    <Badge className="ml-auto text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">{msg.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.message}</p>
                </motion.div>
              ))}
              <div className="p-4 rounded-lg bg-muted/20 border border-dashed border-border/50 text-center text-sm text-muted-foreground">
                More interactions streaming...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
