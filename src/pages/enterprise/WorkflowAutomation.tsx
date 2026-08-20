import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Trash2, ChevronDown, ChevronUp, Zap, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const TRIGGER_TYPES = ['event','schedule','webhook','manual'];
const ACTION_TYPES  = ['send_email','send_webhook','notify_slack','create_record','update_record'];
const PLATFORM_EVENTS = [
  'payment.succeeded','payment.failed','project.verified',
  'credit.minted','governance.vote.cast','sensor.alert','user.created',
];

const MOCK_AUTOMATIONS = [
  { id:'auto_1', name:'Alert on Payment Failure', description:'Notify Slack when a payment fails',
    trigger:{ type:'event', config:{ event:'payment.failed' } },
    actions:[{ type:'notify_slack', config:{ webhookUrl:'https://hooks.slack.com/...', message:'Payment failed!' }, order:1 }],
    isActive:true, runCount:14, lastRunAt:new Date(Date.now()-3600000).toISOString(), createdAt:new Date().toISOString() },
  { id:'auto_2', name:'Weekly Usage Report', description:'Email usage summary every Monday',
    trigger:{ type:'schedule', config:{ cron:'0 9 * * 1' } },
    actions:[{ type:'send_email', config:{ to:'team@atlas.earth', subject:'Weekly Usage Report' }, order:1 }],
    isActive:true, runCount:4, lastRunAt:new Date(Date.now()-604800000).toISOString(), createdAt:new Date().toISOString() },
];
const MOCK_EXECUTIONS = [
  { id:'ex1', status:'succeeded', durationMs:342, startedAt:new Date(Date.now()-3600000).toISOString() },
  { id:'ex2', status:'failed',    durationMs:10021, startedAt:new Date(Date.now()-7200000).toISOString(), error:'Connection timeout' },
];

const statusIcon: Record<string, JSX.Element> = {
  succeeded: <CheckCircle2 className="w-4 h-4 text-emerald-500"/>,
  failed:    <XCircle className="w-4 h-4 text-red-500"/>,
  running:   <Clock className="w-4 h-4 text-blue-500 animate-spin"/>,
};

const emptyForm = () => ({
  name:'', description:'',
  triggerType:'event' as string,
  triggerEvent:'payment.succeeded',
  triggerCron:'0 9 * * 1',
  actions:[{ type:'send_webhook', config:{ url:'' }, order:1 }],
});

export default function WorkflowAutomation() {
  const { toast } = useToast();
  const [automations, setAutomations] = useState<any[]>(MOCK_AUTOMATIONS);
  const [executions, setExecutions] = useState<Record<string,any[]>>({});
  const [expanded, setExpanded] = useState<string|null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const token = () => localStorage.getItem('token') ?? '';

  useEffect(() => {
    fetch('/api/automation', { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r => r.ok ? r.json() : null).then(d => d && setAutomations(d.data)).catch(()=>{});
  }, []);

  const loadExecutions = async (id: string) => {
    if (executions[id]) return;
    try {
      const r = await fetch(`/api/automation/${id}/executions`, { headers:{ Authorization:`Bearer ${token()}` } });
      setExecutions(e => ({ ...e, [id]: r.ok ? (await r.json()).data : MOCK_EXECUTIONS }));
    } catch { setExecutions(e => ({ ...e, [id]: MOCK_EXECUTIONS })); }
  };

  const toggleExpand = (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id); loadExecutions(id);
  };

  const buildTrigger = () => ({
    type: form.triggerType,
    config: form.triggerType === 'event'    ? { event: form.triggerEvent }
          : form.triggerType === 'schedule' ? { cron: form.triggerCron }
          : {},
  });

  const handleCreate = async () => {
    if (!form.name) { toast({ title:'Name required', variant:'destructive' }); return; }
    const payload = { name:form.name, description:form.description, trigger:buildTrigger(), actions:form.actions };
    try {
      const r = await fetch('/api/automation', {
        method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
        body: JSON.stringify(payload),
      });
      if (r.ok) { const { data } = await r.json(); setAutomations(a=>[data,...a]); toast({ title:'Automation created' }); }
      else throw new Error();
    } catch {
      setAutomations(a => [{ id:`auto_${Date.now()}`, ...payload, isActive:true, runCount:0, lastRunAt:null, createdAt:new Date().toISOString() }, ...a]);
      toast({ title:'Automation created (demo)' });
    }
    setForm(emptyForm()); setCreating(false);
  };

  const handleRun = async (id: string) => {
    try {
      const r = await fetch(`/api/automation/${id}/run`, { method:'POST', headers:{ Authorization:`Bearer ${token()}` } });
      if (r.ok) { const { data } = await r.json(); toast({ title:`Run ${data.status}` }); }
      else throw new Error();
    } catch { toast({ title:'Run triggered (demo)' }); }
    setAutomations(a => a.map(x => x.id===id ? { ...x, runCount:x.runCount+1, lastRunAt:new Date().toISOString() } : x));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/automation/${id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token()}` } }).catch(()=>{});
    setAutomations(a => a.filter(x=>x.id!==id));
    toast({ title:'Automation deleted' });
  };

  const updateAction = (idx: number, field: string, value: string) =>
    setForm(f => { const actions=[...f.actions]; actions[idx]={ ...actions[idx], config:{ ...actions[idx].config, [field]:value } }; return { ...f, actions }; });

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Workflow Automation</h1>
          <p className="text-muted-foreground">Trigger-based automations that react to platform events.</p>
        </div>
        <Button onClick={() => setCreating(c=>!c)}><Plus className="w-4 h-4 mr-2"/>New Automation</Button>
      </motion.div>

      {creating && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}>
          <Card className="mb-6 border-primary/30">
            <CardHeader><CardTitle className="text-base">New Automation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
              <Input placeholder="Description (optional)" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>

              <div>
                <p className="text-sm font-medium mb-2">Trigger</p>
                <div className="flex gap-2 flex-wrap mb-2">
                  {TRIGGER_TYPES.map(t => (
                    <button key={t} onClick={()=>setForm(f=>({...f,triggerType:t}))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.triggerType===t ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>
                      {t}
                    </button>
                  ))}
                </div>
                {form.triggerType==='event' && (
                  <select className="w-full border rounded px-3 py-2 text-sm bg-background"
                    value={form.triggerEvent} onChange={e=>setForm(f=>({...f,triggerEvent:e.target.value}))}>
                    {PLATFORM_EVENTS.map(ev=><option key={ev} value={ev}>{ev}</option>)}
                  </select>
                )}
                {form.triggerType==='schedule' && (
                  <Input placeholder="Cron expression (e.g. 0 9 * * 1)" value={form.triggerCron}
                    onChange={e=>setForm(f=>({...f,triggerCron:e.target.value}))}/>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Actions</p>
                {form.actions.map((action, idx) => (
                  <div key={idx} className="border rounded-lg p-3 mb-2 space-y-2">
                    <select className="w-full border rounded px-3 py-2 text-sm bg-background"
                      value={action.type}
                      onChange={e=>setForm(f=>{ const a=[...f.actions]; a[idx]={...a[idx],type:e.target.value}; return {...f,actions:a}; })}>
                      {ACTION_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    {action.type==='send_webhook' && (
                      <Input placeholder="Webhook URL" value={action.config.url??''}
                        onChange={e=>updateAction(idx,'url',e.target.value)}/>
                    )}
                    {action.type==='notify_slack' && (
                      <>
                        <Input placeholder="Slack Webhook URL" value={action.config.webhookUrl??''}
                          onChange={e=>updateAction(idx,'webhookUrl',e.target.value)}/>
                        <Input placeholder="Message" value={action.config.message??''}
                          onChange={e=>updateAction(idx,'message',e.target.value)}/>
                      </>
                    )}
                    {action.type==='send_email' && (
                      <>
                        <Input placeholder="To" value={action.config.to??''} onChange={e=>updateAction(idx,'to',e.target.value)}/>
                        <Input placeholder="Subject" value={action.config.subject??''} onChange={e=>updateAction(idx,'subject',e.target.value)}/>
                      </>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm"
                  onClick={()=>setForm(f=>({...f,actions:[...f.actions,{type:'send_webhook',config:{url:''},order:f.actions.length+1}]}))}>
                  <Plus className="w-3.5 h-3.5 mr-1"/>Add Action
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreate}>Create</Button>
                <Button variant="outline" onClick={()=>setCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {automations.map((auto, i) => (
          <motion.div key={auto.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-primary flex-shrink-0"/>
                      <span className="font-semibold">{auto.name}</span>
                      <Badge className={auto.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}>
                        {auto.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    {auto.description && <p className="text-sm text-muted-foreground mb-2">{auto.description}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3"/>
                        {auto.trigger?.type} trigger
                        {auto.trigger?.config?.event && ` · ${auto.trigger.config.event}`}
                        {auto.trigger?.config?.cron  && ` · ${auto.trigger.config.cron}`}
                      </span>
                      <span>{auto.runCount} runs</span>
                      {auto.lastRunAt && <span>Last: {new Date(auto.lastRunAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={()=>handleRun(auto.id)} title="Run now"><Play className="w-4 h-4"/></Button>
                    <Button variant="ghost" size="sm" onClick={()=>handleDelete(auto.id)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                    <Button variant="ghost" size="sm" onClick={()=>toggleExpand(auto.id)}>
                      {expanded===auto.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                    </Button>
                  </div>
                </div>

                {expanded===auto.id && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="mt-4 border-t pt-4">
                    <Tabs defaultValue="executions">
                      <TabsList className="h-8">
                        <TabsTrigger value="executions" className="text-xs">Execution History</TabsTrigger>
                        <TabsTrigger value="config" className="text-xs">Configuration</TabsTrigger>
                      </TabsList>
                      <TabsContent value="executions" className="mt-3 space-y-2">
                        {!(executions[auto.id]?.length) ? (
                          <p className="text-sm text-muted-foreground">No executions yet.</p>
                        ) : executions[auto.id].map((ex:any) => (
                          <div key={ex.id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                            <div className="flex items-center gap-2">
                              {statusIcon[ex.status] ?? null}
                              <span className="text-muted-foreground">{new Date(ex.startedAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {ex.durationMs && <span className="text-xs text-muted-foreground">{ex.durationMs}ms</span>}
                              {ex.error && <span className="text-xs text-red-500 truncate max-w-32">{ex.error}</span>}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      <TabsContent value="config" className="mt-3">
                        <pre className="text-xs bg-muted/40 rounded p-3 overflow-auto">
                          {JSON.stringify({ trigger:auto.trigger, actions:auto.actions }, null, 2)}
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {!automations.length && (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center text-muted-foreground">
              No automations yet. Create one to start automating workflows.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
