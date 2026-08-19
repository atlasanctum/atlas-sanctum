import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, RotateCcw, Send, ChevronDown, ChevronUp, Copy, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ALL_EVENTS = [
  'payment.succeeded', 'payment.failed',
  'subscription.created', 'subscription.updated', 'subscription.canceled',
  'project.created', 'project.verified',
  'credit.minted', 'credit.transferred',
  'governance.proposal.created', 'governance.vote.cast',
  'sensor.alert', 'user.created',
];

const MOCK_HOOKS = [
  {
    id: 'wh_1', name: 'Production Alerts', url: 'https://hooks.example.com/atlas',
    events: ['payment.failed', 'sensor.alert'], isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const MOCK_DELIVERIES = [
  { id: 'd1', eventType: 'payment.succeeded', status: 'delivered', statusCode: 200, attempt: 1, createdAt: new Date().toISOString() },
  { id: 'd2', eventType: 'sensor.alert',      status: 'retrying',  statusCode: 503, attempt: 2, createdAt: new Date(Date.now() - 3600000).toISOString() },
];

const statusColor: Record<string, string> = {
  delivered: 'bg-emerald-500/10 text-emerald-600',
  retrying:  'bg-amber-500/10 text-amber-600',
  failed:    'bg-red-500/10 text-red-600',
  pending:   'bg-blue-500/10 text-blue-600',
};

export default function WebhookManagement() {
  const { toast } = useToast();
  const [hooks, setHooks] = useState<any[]>(MOCK_HOOKS);
  const [deliveries, setDeliveries] = useState<Record<string, any[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', url: '', events: [] as string[] });

  const token = () => localStorage.getItem('token') ?? '';

  const load = async () => {
    try {
      const res = await fetch('/api/webhooks', { headers: { Authorization: `Bearer ${token()}` } });
      if (res.ok) setHooks((await res.json()).data);
    } catch { /* use mock */ }
  };

  useEffect(() => { load(); }, []);

  const loadDeliveries = async (id: string) => {
    if (deliveries[id]) return;
    try {
      const res = await fetch(`/api/webhooks/${id}/deliveries`, { headers: { Authorization: `Bearer ${token()}` } });
      if (res.ok) setDeliveries(d => ({ ...d, [id]: (await res.json()).data }));
      else setDeliveries(d => ({ ...d, [id]: MOCK_DELIVERIES }));
    } catch { setDeliveries(d => ({ ...d, [id]: MOCK_DELIVERIES })); }
  };

  const toggleExpand = (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    loadDeliveries(id);
  };

  const handleCreate = async () => {
    if (!form.name || !form.url || form.events.length === 0) {
      toast({ title: 'Validation', description: 'Name, URL, and at least one event are required.', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const { data, secret } = await res.json();
        setHooks(h => [data, ...h]);
        toast({ title: 'Webhook created', description: `Secret: ${secret} — save this, it won't be shown again.` });
      } else {
        setHooks(h => [{ id: `wh_${Date.now()}`, ...form, isActive: true, createdAt: new Date().toISOString() }, ...h]);
        toast({ title: 'Webhook created (demo)' });
      }
    } catch {
      setHooks(h => [{ id: `wh_${Date.now()}`, ...form, isActive: true, createdAt: new Date().toISOString() }, ...h]);
      toast({ title: 'Webhook created (demo)' });
    }
    setForm({ name: '', url: '', events: [] });
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/webhooks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    } catch { /* ignore */ }
    setHooks(h => h.filter(w => w.id !== id));
    toast({ title: 'Webhook deleted' });
  };

  const handleRotate = async (id: string) => {
    try {
      const res = await fetch(`/api/webhooks/${id}/rotate`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` } });
      if (res.ok) {
        const { secret } = await res.json();
        toast({ title: 'Secret rotated', description: `New secret: ${secret}` });
        return;
      }
    } catch { /* ignore */ }
    toast({ title: 'Secret rotated (demo)', description: 'whsec_newdemo...' });
  };

  const handleTest = async (id: string) => {
    try {
      await fetch(`/api/webhooks/${id}/test`, { method: 'POST', headers: { Authorization: `Bearer ${token()}` } });
    } catch { /* ignore */ }
    toast({ title: 'Test event dispatched' });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleEvent = (e: string) =>
    setForm(f => ({ ...f, events: f.events.includes(e) ? f.events.filter(x => x !== e) : [...f.events, e] }));

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Webhook Management</h1>
          <p className="text-muted-foreground">Receive real-time event notifications via HTTP POST.</p>
        </div>
        <Button onClick={() => setCreating(c => !c)}>
          <Plus className="w-4 h-4 mr-2" /> Add Webhook
        </Button>
      </motion.div>

      {creating && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6 border-primary/30">
            <CardHeader><CardTitle className="text-base">New Webhook</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Endpoint URL (https://...)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
              <div>
                <p className="text-sm font-medium mb-2 text-muted-foreground">Events to subscribe</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_EVENTS.map(ev => (
                    <button
                      key={ev}
                      onClick={() => toggleEvent(ev)}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${form.events.includes(ev) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                    >
                      {ev}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreate}>Create</Button>
                <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {hooks.map((hook, i) => (
          <motion.div key={hook.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{hook.name}</span>
                      <Badge className={hook.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}>
                        {hook.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <span className="truncate font-mono">{hook.url}</span>
                      <button onClick={() => copyUrl(hook.url)} className="flex-shrink-0 ml-1">
                        {copied === hook.url ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(hook.events ?? []).map((ev: string) => (
                        <span key={ev} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{ev}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleTest(hook.id)} title="Send test event">
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRotate(hook.id)} title="Rotate secret">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(hook.id)} title="Delete">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleExpand(hook.id)}>
                      {expanded === hook.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {expanded === hook.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 border-t pt-4">
                    <p className="text-sm font-medium mb-3 text-muted-foreground">Recent Deliveries</p>
                    {(deliveries[hook.id] ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No deliveries yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {(deliveries[hook.id] ?? []).map((d: any) => (
                          <div key={d.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-muted-foreground" />
                              <span className="font-mono text-xs">{d.eventType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {d.statusCode && <span className="text-xs text-muted-foreground">HTTP {d.statusCode}</span>}
                              <span className="text-xs text-muted-foreground">attempt {d.attempt}</span>
                              <Badge className={`text-xs ${statusColor[d.status] ?? ''}`}>{d.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {hooks.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center text-muted-foreground">
              No webhooks configured. Add one to start receiving events.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
