import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, GitBranch, Database, Search, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const nodes = [
  { id: 'climate', label: 'Climate Data', color: 'bg-emerald-500', connections: 8 },
  { id: 'economy', label: 'Economic Data', color: 'bg-blue-500', connections: 6 },
  { id: 'health', label: 'Health Data', color: 'bg-rose-500', connections: 5 },
  { id: 'governance', label: 'Governance', color: 'bg-amber-500', connections: 7 },
  { id: 'agriculture', label: 'Agriculture', color: 'bg-lime-500', connections: 4 },
  { id: 'infrastructure', label: 'Infrastructure', color: 'bg-purple-500', connections: 6 },
];

const relationships = [
  { from: 'Climate Data', to: 'Agriculture', type: 'influences', strength: 0.92 },
  { from: 'Economic Data', to: 'Governance', type: 'correlates', strength: 0.78 },
  { from: 'Health Data', to: 'Climate Data', type: 'depends_on', strength: 0.85 },
  { from: 'Infrastructure', to: 'Economic Data', type: 'drives', strength: 0.71 },
  { from: 'Governance', to: 'Health Data', type: 'regulates', strength: 0.88 },
];

export default function KnowledgeGraph() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">Phase 2</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Knowledge Graph</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Interconnected intelligence across climate, economic, health, and governance domains — revealing hidden relationships and emergent patterns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Network, label: 'Total Nodes', value: '2.4M', color: 'text-blue-500' },
            { icon: GitBranch, label: 'Relationships', value: '18.7M', color: 'text-emerald-500' },
            { icon: Database, label: 'Data Sources', value: '340+', color: 'text-purple-500' },
          ].map((stat) => (
            <Card key={stat.label} className="bg-card/50 border-border/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="w-5 h-5" /> Domain Nodes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${node.color}`} />
                    <span className="font-medium text-foreground">{node.label}</span>
                  </div>
                  <Badge variant="secondary">{node.connections} connections</Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" /> Key Relationships</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {relationships.map((rel, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{rel.from}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{rel.to}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{rel.type}</Badge>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${rel.strength * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{(rel.strength * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
