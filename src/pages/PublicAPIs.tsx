import { PageLayout } from '@/components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code2, Key, Globe, Zap, BookOpen, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const endpoints = [
  { method: 'GET', path: '/api/v2/climate', desc: 'Climate intelligence data', auth: 'public' },
  { method: 'GET', path: '/api/v2/economy', desc: 'Economic indicators', auth: 'public' },
  { method: 'GET', path: '/api/v2/health', desc: 'Health surveillance data', auth: 'public' },
  { method: 'GET', path: '/api/v2/governance', desc: 'Governance metrics', auth: 'public' },
  { method: 'POST', path: '/api/v2/forecast', desc: 'Generate AI forecast', auth: 'api-key' },
  { method: 'POST', path: '/api/v2/simulate', desc: 'Run scenario simulation', auth: 'api-key' },
  { method: 'POST', path: '/api/v2/chat', desc: 'AI copilot conversation', auth: 'api-key' },
  { method: 'GET', path: '/api/v2/projects', desc: 'Regenerative projects', auth: 'public' },
];

const methodColor: Record<string, string> = {
  GET: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  POST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  PUT: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  DELETE: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function PublicAPIs() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">Phase 2</Badge>
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Public APIs</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Open, documented REST APIs giving developers and researchers access to Atlas Sanctum's global intelligence data.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Globe, label: 'API Calls/Day', value: '4.2M' },
            { icon: Key, label: 'Active API Keys', value: '1,840' },
            { icon: Zap, label: 'Avg Latency', value: '48ms' },
            { icon: Code2, label: 'Endpoints', value: '64' },
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
          <div className="lg:col-span-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code2 className="w-5 h-5" /> API Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {endpoints.map((ep, i) => (
                  <motion.div
                    key={ep.path}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors font-mono text-sm"
                  >
                    <Badge className={`${methodColor[ep.method]} w-14 justify-center flex-shrink-0`}>{ep.method}</Badge>
                    <span className="text-foreground flex-1 truncate">{ep.path}</span>
                    <span className="text-muted-foreground hidden sm:block text-xs">{ep.desc}</span>
                    <Badge variant="outline" className="text-xs flex-shrink-0">{ep.auth}</Badge>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Key className="w-4 h-4" /> Quick Start</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 font-mono text-xs text-muted-foreground mb-4 relative">
                  <pre>{`curl -H "X-API-Key: YOUR_KEY" \\
  https://api.atlassanctum.com/v2/climate`}</pre>
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-6 w-6">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <Button className="w-full" variant="hero">Get API Key</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><BookOpen className="w-4 h-4" /> Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Full API Documentation', 'SDKs & Libraries', 'Rate Limits & Quotas', 'Webhooks Guide'].map((r) => (
                  <Button key={r} variant="ghost" className="w-full justify-start text-sm h-9">{r}</Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
