import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Endpoint {
  method: 'GET'|'POST'|'PUT'|'DELETE'|'PATCH';
  path: string;
  summary: string;
  tag: string;
  body?: boolean;
  params?: string[];
}

const ENDPOINTS: Endpoint[] = [
  { method:'GET',    path:'/api/health',                    summary:'Health check',                tag:'System' },
  { method:'GET',    path:'/api/flags',                     summary:'Feature flags',               tag:'System' },
  { method:'POST',   path:'/api/v2/auth/login',             summary:'Login',                       tag:'Auth',    body:true },
  { method:'POST',   path:'/api/v2/auth/signup',            summary:'Sign up',                     tag:'Auth',    body:true },
  { method:'GET',    path:'/api/v2/marketplace',            summary:'List marketplace listings',   tag:'Marketplace' },
  { method:'GET',    path:'/api/v2/projects',               summary:'List projects',               tag:'Projects' },
  { method:'POST',   path:'/api/v2/projects',               summary:'Create project',              tag:'Projects', body:true },
  { method:'GET',    path:'/api/governance',                summary:'List governance proposals',   tag:'Governance' },
  { method:'GET',    path:'/api/community',                 summary:'Community overview',          tag:'Community' },
  { method:'GET',    path:'/api/billing/subscriptions',     summary:'Get subscription',            tag:'Billing' },
  { method:'GET',    path:'/api/billing/invoices',          summary:'List invoices',               tag:'Billing' },
  { method:'GET',    path:'/api/webhooks',                  summary:'List webhooks',               tag:'Webhooks' },
  { method:'POST',   path:'/api/webhooks',                  summary:'Create webhook',              tag:'Webhooks', body:true },
  { method:'GET',    path:'/api/workspaces',                summary:'List workspaces',             tag:'Collaboration' },
  { method:'POST',   path:'/api/workspaces',                summary:'Create workspace',            tag:'Collaboration', body:true },
  { method:'GET',    path:'/api/automation',                summary:'List automations',            tag:'Automation' },
  { method:'POST',   path:'/api/automation',                summary:'Create automation',           tag:'Automation', body:true },
  { method:'GET',    path:'/api/v3/sanctum/knowledge',      summary:'Knowledge system',            tag:'AI' },
  { method:'GET',    path:'/api/v3/intelligence',           summary:'Intelligence models',         tag:'AI' },
  { method:'GET',    path:'/api/v3/sensors',                summary:'Sensor streams',              tag:'IoT' },
  { method:'GET',    path:'/api/v3/research',               summary:'Research platform',           tag:'Research' },
];

const TAGS = [...new Set(ENDPOINTS.map(e=>e.tag))];

const METHOD_COLOR: Record<string,string> = {
  GET:'bg-emerald-500/10 text-emerald-600',
  POST:'bg-blue-500/10 text-blue-600',
  PUT:'bg-amber-500/10 text-amber-600',
  DELETE:'bg-red-500/10 text-red-600',
  PATCH:'bg-purple-500/10 text-purple-600',
};

const DEFAULT_BODIES: Record<string,string> = {
  '/api/v2/auth/login':  JSON.stringify({ email:'demo@atlas.earth', password:'demo1234' }, null, 2),
  '/api/v2/auth/signup': JSON.stringify({ email:'user@example.com', password:'secure123', displayName:'Jane Doe' }, null, 2),
  '/api/v2/projects':    JSON.stringify({ name:'Amazon Reforestation', type:'forest', bioregion:'amazon' }, null, 2),
  '/api/webhooks':       JSON.stringify({ name:'My Hook', url:'https://example.com/hook', events:['payment.succeeded'] }, null, 2),
  '/api/workspaces':     JSON.stringify({ name:'My Workspace', description:'Team workspace', visibility:'private' }, null, 2),
  '/api/automation':     JSON.stringify({ name:'Alert on failure', trigger:{ type:'event', config:{ event:'payment.failed' } }, actions:[{ type:'notify_slack', config:{ webhookUrl:'https://hooks.slack.com/...', message:'Payment failed' }, order:1 }] }, null, 2),
};

export default function APITester() {
  const { toast } = useToast();
  const [selectedTag, setSelectedTag] = useState('System');
  const [selected, setSelected] = useState<Endpoint>(ENDPOINTS[0]);
  const [token, setToken] = useState(localStorage.getItem('token') ?? '');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<{ status:number; data:unknown; ms:number }|null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSnippet, setShowSnippet] = useState(false);

  const selectEndpoint = (ep: Endpoint) => {
    setSelected(ep);
    setBody(DEFAULT_BODIES[ep.path] ?? '');
    setResponse(null);
  };

  const run = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const opts: RequestInit = {
        method: selected.method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization:`Bearer ${token}` } : {}),
        },
      };
      if (selected.body && body) opts.body = body;
      const res = await fetch(selected.path, opts);
      const data = await res.json().catch(() => res.text());
      setResponse({ status:res.status, data, ms:Date.now()-start });
    } catch (err: any) {
      setResponse({ status:0, data:{ error:err.message }, ms:Date.now()-start });
    } finally { setLoading(false); }
  };

  const snippet = `curl -X ${selected.method} '${window.location.origin}${selected.path}' \\
  -H 'Content-Type: application/json' \\${token ? `\n  -H 'Authorization: Bearer ${token}' \\` : ''}${selected.body && body ? `\n  -d '${body.replace(/\n/g,' ')}'` : ''}`;

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet); setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const statusColor = (s: number) =>
    s >= 200 && s < 300 ? 'text-emerald-600' : s >= 400 ? 'text-red-600' : 'text-amber-600';

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">API Tester</h1>
        <p className="text-muted-foreground">Explore and test all Atlas Sanctum API endpoints interactively.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Endpoint list */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1 mb-3">
            {TAGS.map(tag => (
              <button key={tag} onClick={()=>setSelectedTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selectedTag===tag ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                {tag}
              </button>
            ))}
          </div>
          {ENDPOINTS.filter(e=>e.tag===selectedTag).map(ep => (
            <button key={`${ep.method}${ep.path}`} onClick={()=>selectEndpoint(ep)}
              className={`w-full text-left p-2.5 rounded-lg border transition-colors ${selected.path===ep.path&&selected.method===ep.method ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs font-mono ${METHOD_COLOR[ep.method]??''}`}>{ep.method}</Badge>
                <span className="text-xs text-muted-foreground truncate">{ep.summary}</span>
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5 truncate">{ep.path}</div>
            </button>
          ))}
        </div>

        {/* Request / Response */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge className={`font-mono ${METHOD_COLOR[selected.method]??''}`}>{selected.method}</Badge>
                <code className="text-sm font-mono text-foreground">{selected.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{selected.summary}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Bearer Token</label>
                <Input className="font-mono text-xs" placeholder="Paste JWT token (optional)"
                  value={token} onChange={e=>{ setToken(e.target.value); localStorage.setItem('token',e.target.value); }}/>
              </div>

              {selected.body && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Request Body (JSON)</label>
                  <textarea
                    className="w-full h-36 font-mono text-xs border rounded-md p-3 bg-muted/30 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    value={body} onChange={e=>setBody(e.target.value)}/>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={run} disabled={loading} className="flex-1">
                  <Play className="w-4 h-4 mr-2"/>{loading ? 'Sending…' : 'Send Request'}
                </Button>
                <Button variant="outline" onClick={()=>setShowSnippet(s=>!s)}>
                  {showSnippet ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                  cURL
                </Button>
              </div>

              {showSnippet && (
                <div className="relative">
                  <pre className="text-xs bg-muted/40 rounded p-3 overflow-auto whitespace-pre-wrap">{snippet}</pre>
                  <button onClick={copySnippet} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                    {copied ? <Check className="w-4 h-4 text-emerald-500"/> : <Copy className="w-4 h-4"/>}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {response && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Response</CardTitle>
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`font-bold ${statusColor(response.status)}`}>
                        {response.status || 'Error'}
                      </span>
                      <span className="text-muted-foreground">{response.ms}ms</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="body">
                    <TabsList className="h-7 mb-2">
                      <TabsTrigger value="body" className="text-xs">Body</TabsTrigger>
                      <TabsTrigger value="raw" className="text-xs">Raw</TabsTrigger>
                    </TabsList>
                    <TabsContent value="body">
                      <pre className="text-xs bg-muted/40 rounded p-3 overflow-auto max-h-80">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </TabsContent>
                    <TabsContent value="raw">
                      <pre className="text-xs bg-muted/40 rounded p-3 overflow-auto max-h-80">
                        {typeof response.data === 'string' ? response.data : JSON.stringify(response.data)}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
