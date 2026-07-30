import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Brain, Network, MessageSquare, Zap, Activity, Shield, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AtlasAgentNetwork } from '../../services/ai/agents/AgentNetwork';

const ROLE_COLORS: Record<string, string> = {
  governance: 'text-amber-500', economics: 'text-blue-500', restoration: 'text-emerald-500',
  medicine: 'text-rose-500', logistics: 'text-purple-500', ethics: 'text-indigo-500',
  education: 'text-cyan-500', ecology: 'text-lime-500', disaster: 'text-red-500',
  forecasting: 'text-orange-500', culture: 'text-pink-500', security: 'text-slate-500',
  sentinel: 'text-yellow-500', knowledge: 'text-teal-500', identity: 'text-violet-500',
};

export default function MultiAgentIntelligence() {
  const [health, setHealth] = useState(AtlasAgentNetwork.health());
  const [agents] = useState(AtlasAgentNetwork.registry.getHealthReport());
  const [messages, setMessages] = useState(AtlasAgentNetwork.bus.getLog());
  const [taskResult, setTaskResult] = useState<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(AtlasAgentNetwork.health());
      setMessages(AtlasAgentNetwork.bus.getLog().slice(-6));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const runTask = async () => {
    setRunning(true);
    const results = await AtlasAgentNetwork.orchestrator.dispatch({
      taskId: `task-${Date.now()}`,
      type: 'ecological_assessment',
      payload: { region: 'Amazon Basin', restore: true, explanation: 'Biodiversity monitoring' },
      priority: 3,
      requiredRoles: ['ecology', 'economics', 'ethics'],
      createdAt: Date.now(),
    });
    setTaskResult(results);
    setMessages(AtlasAgentNetwork.bus.getLog().slice(-6));
    setHealth(AtlasAgentNetwork.health());
    setRunning(false);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Live</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">AI Agent Network</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            15 constitutional AI agents collaborating across regenerative domains — with ethics pre-flight, coalition formation, and human-in-the-loop gates.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Bot, label: 'Total Agents', value: health.total, color: 'text-purple-500' },
            { icon: Activity, label: 'Online', value: health.online, color: 'text-emerald-500' },
            { icon: Shield, label: 'Avg Ethics Score', value: `${(health.avgEthicsScore * 100).toFixed(0)}%`, color: 'text-blue-500' },
            { icon: MessageSquare, label: 'Messages', value: messages.length, color: 'text-amber-500' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5" /> Agent Fleet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.agentId}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'idle' ? 'bg-emerald-500' : agent.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-muted-foreground'}`} />
                    <div>
                      <p className={`text-xs font-semibold capitalize ${ROLE_COLORS[agent.role] ?? 'text-foreground'}`}>{agent.role}</p>
                      <p className="text-xs text-muted-foreground">{agent.tasksCompleted} done · {(agent.avgEthicsScore * 100).toFixed(0)}% ethics</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">{agent.status}</Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" /> Message Bus
                <span className="ml-auto flex items-center gap-1 text-xs font-normal text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No messages yet — dispatch a task to see agent communication.</p>
              )}
              {messages.map((msg, i) => (
                <div key={msg.messageId} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{msg.from}</Badge>
                    <Zap className="w-3 h-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">{msg.to}</Badge>
                    <Badge className="ml-auto text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">{msg.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{JSON.stringify(msg.payload).slice(0, 80)}…</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5" /> Dispatch Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Run a live ecological assessment through the agent network with constitutional pre-flight.</p>
              <Button variant="hero" className="w-full" onClick={runTask} disabled={running}>
                {running ? <><Clock className="w-4 h-4 mr-2 animate-spin" /> Running…</> : <><Network className="w-4 h-4 mr-2" /> Dispatch Ecological Assessment</>}
              </Button>
              {taskResult && (
                <div className="space-y-2 mt-2">
                  {taskResult.map((r: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-2 mb-1">
                        {r.outcome === 'success'
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          : <XCircle className="w-4 h-4 text-red-500" />}
                        <span className="text-sm font-medium capitalize text-foreground">{r.role}</span>
                        <Badge className="ml-auto text-xs" variant={r.outcome === 'success' ? 'default' : 'destructive'}>{r.outcome}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{r.rationale}</p>
                      <p className="text-xs text-muted-foreground mt-1">Ethics: {(r.ethicsScore * 100).toFixed(0)}% · {r.executionMs}ms</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
