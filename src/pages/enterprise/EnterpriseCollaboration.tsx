import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Activity, CheckSquare, Trash2, UserPlus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const MOCK_WORKSPACES = [
  { id:'ws_1', name:'Climate Intelligence', description:'Planetary monitoring & forecasting', visibility:'internal', createdAt:new Date().toISOString() },
  { id:'ws_2', name:'Carbon Markets', description:'Credit issuance and trading ops', visibility:'private', createdAt:new Date(Date.now()-86400000).toISOString() },
];
const MOCK_MEMBERS = [
  { id:'m1', userId:'u1', email:'alice@atlas.earth', displayName:'Alice Chen', role:'owner', joinedAt:new Date().toISOString() },
  { id:'m2', userId:'u2', email:'bob@atlas.earth',   displayName:'Bob Osei',   role:'member', joinedAt:new Date().toISOString() },
];
const MOCK_ACTIVITY = [
  { id:'a1', action:'approval.requested', resourceType:'project', resourceId:'p1', displayName:'Alice Chen', metadata:{ title:'Amazon Reforestation' }, createdAt:new Date().toISOString() },
  { id:'a2', action:'approval.approved',  resourceType:'project', resourceId:'p1', displayName:'Bob Osei',   metadata:{ note:'Looks good' }, createdAt:new Date(Date.now()-3600000).toISOString() },
];
const MOCK_APPROVALS = [
  { id:'ap1', title:'Amazon Reforestation Credit Batch', description:'Mint 50,000 credits', resourceType:'credit', resourceId:'c1', status:'pending', requestedBy:'Alice Chen', createdAt:new Date().toISOString() },
  { id:'ap2', title:'Governance Proposal #42', description:'Increase validator set', resourceType:'proposal', resourceId:'p42', status:'approved', requestedBy:'Bob Osei', createdAt:new Date(Date.now()-86400000).toISOString() },
];

const visibilityColor: Record<string,string> = {
  private:'bg-slate-500/10 text-slate-600',
  internal:'bg-blue-500/10 text-blue-600',
  public:'bg-emerald-500/10 text-emerald-600',
};
const approvalColor: Record<string,string> = {
  pending:'bg-amber-500/10 text-amber-600',
  approved:'bg-emerald-500/10 text-emerald-600',
  rejected:'bg-red-500/10 text-red-600',
};

export default function EnterpriseCollaboration() {
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<any[]>(MOCK_WORKSPACES);
  const [selected, setSelected] = useState<any>(MOCK_WORKSPACES[0]);
  const [members, setMembers] = useState<any[]>(MOCK_MEMBERS);
  const [activity, setActivity] = useState<any[]>(MOCK_ACTIVITY);
  const [approvals, setApprovals] = useState<any[]>(MOCK_APPROVALS);
  const [creating, setCreating] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [wsForm, setWsForm] = useState({ name:'', description:'', visibility:'private' as const });

  const token = () => localStorage.getItem('token') ?? '';

  const loadWorkspace = async (ws: any) => {
    setSelected(ws);
    try {
      const [mRes, aRes, apRes] = await Promise.all([
        fetch(`/api/workspaces/${ws.id}/members`,  { headers:{ Authorization:`Bearer ${token()}` } }),
        fetch(`/api/workspaces/${ws.id}/activity`, { headers:{ Authorization:`Bearer ${token()}` } }),
        fetch(`/api/workspaces/${ws.id}/approvals`,{ headers:{ Authorization:`Bearer ${token()}` } }),
      ]);
      if (mRes.ok)  setMembers((await mRes.json()).data);
      if (aRes.ok)  setActivity((await aRes.json()).data);
      if (apRes.ok) setApprovals((await apRes.json()).data);
    } catch { /* use mock */ }
  };

  useEffect(() => {
    fetch('/api/workspaces', { headers:{ Authorization:`Bearer ${token()}` } })
      .then(r => r.ok ? r.json() : null).then(d => d && setWorkspaces(d.data)).catch(()=>{});
  }, []);

  const handleCreateWorkspace = async () => {
    if (!wsForm.name) { toast({ title:'Name required', variant:'destructive' }); return; }
    try {
      const r = await fetch('/api/workspaces', {
        method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
        body: JSON.stringify(wsForm),
      });
      if (r.ok) { const { data } = await r.json(); setWorkspaces(w => [data, ...w]); toast({ title:'Workspace created' }); }
      else throw new Error();
    } catch {
      const ws = { id:`ws_${Date.now()}`, ...wsForm, createdAt:new Date().toISOString() };
      setWorkspaces(w => [ws, ...w]); toast({ title:'Workspace created (demo)' });
    }
    setWsForm({ name:'', description:'', visibility:'private' }); setCreating(false);
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    toast({ title:`Invite sent to ${inviteEmail}` });
    setMembers(m => [...m, { id:`m_${Date.now()}`, email:inviteEmail, displayName:inviteEmail, role:'member', joinedAt:new Date().toISOString() }]);
    setInviteEmail('');
  };

  const handleReview = async (approvalId: string, decision: 'approved'|'rejected') => {
    try {
      await fetch(`/api/workspaces/${selected.id}/approvals/${approvalId}/review`, {
        method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token()}` },
        body: JSON.stringify({ decision }),
      });
    } catch {}
    setApprovals(a => a.map(ap => ap.id === approvalId ? { ...ap, status:decision } : ap));
    toast({ title:`Approval ${decision}` });
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Enterprise Collaboration</h1>
          <p className="text-muted-foreground">Team workspaces, activity feeds, and approval workflows.</p>
        </div>
        <Button onClick={() => setCreating(c=>!c)}><Plus className="w-4 h-4 mr-2"/>New Workspace</Button>
      </motion.div>

      {creating && (
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}>
          <Card className="mb-6 border-primary/30">
            <CardHeader><CardTitle className="text-base">New Workspace</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Name" value={wsForm.name} onChange={e=>setWsForm(f=>({...f,name:e.target.value}))}/>
              <Input placeholder="Description" value={wsForm.description} onChange={e=>setWsForm(f=>({...f,description:e.target.value}))}/>
              <select className="w-full border rounded px-3 py-2 text-sm bg-background"
                value={wsForm.visibility} onChange={e=>setWsForm(f=>({...f,visibility:e.target.value as any}))}>
                <option value="private">Private</option>
                <option value="internal">Internal</option>
                <option value="public">Public</option>
              </select>
              <div className="flex gap-2">
                <Button onClick={handleCreateWorkspace}>Create</Button>
                <Button variant="outline" onClick={()=>setCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-2">
          {workspaces.map(ws => (
            <button key={ws.id} onClick={() => loadWorkspace(ws)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${selected?.id===ws.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
              <div className="font-medium text-sm text-foreground truncate">{ws.name}</div>
              <Badge className={`text-xs mt-1 ${visibilityColor[ws.visibility]??''}`}>{ws.visibility}</Badge>
            </button>
          ))}
        </div>

        {/* Main panel */}
        {selected && (
          <div className="md:col-span-3">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
            </div>

            <Tabs defaultValue="members">
              <TabsList>
                <TabsTrigger value="members"><Users className="w-3.5 h-3.5 mr-1.5"/>Members</TabsTrigger>
                <TabsTrigger value="activity"><Activity className="w-3.5 h-3.5 mr-1.5"/>Activity</TabsTrigger>
                <TabsTrigger value="approvals"><CheckSquare className="w-3.5 h-3.5 mr-1.5"/>Approvals</TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="Email to invite" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&handleInvite()}/>
                  <Button onClick={handleInvite}><UserPlus className="w-4 h-4 mr-1.5"/>Invite</Button>
                </div>
                {members.map(m => (
                  <Card key={m.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{m.displayName}</div>
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{m.role}</Badge>
                        {m.role !== 'owner' && (
                          <Button variant="ghost" size="sm" onClick={() => setMembers(ms=>ms.filter(x=>x.id!==m.id))}>
                            <Trash2 className="w-3.5 h-3.5 text-destructive"/>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="activity" className="mt-4 space-y-2">
                {activity.map(a => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Activity className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0"/>
                    <div>
                      <span className="text-sm font-medium">{a.displayName}</span>
                      <span className="text-sm text-muted-foreground"> · {a.action}</span>
                      {a.metadata?.title && <span className="text-sm text-muted-foreground"> — {a.metadata.title}</span>}
                      <div className="text-xs text-muted-foreground mt-0.5">{new Date(a.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {!activity.length && <p className="text-sm text-muted-foreground py-4">No activity yet.</p>}
              </TabsContent>

              <TabsContent value="approvals" className="mt-4 space-y-3">
                {approvals.map(ap => (
                  <Card key={ap.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium text-sm mb-0.5">{ap.title}</div>
                          <div className="text-xs text-muted-foreground mb-1">{ap.description}</div>
                          <div className="text-xs text-muted-foreground">Requested by {ap.requestedBy}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`text-xs ${approvalColor[ap.status]??''}`}>{ap.status}</Badge>
                          {ap.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-300"
                                onClick={() => handleReview(ap.id,'approved')}>
                                <Check className="w-3 h-3 mr-1"/>Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-300"
                                onClick={() => handleReview(ap.id,'rejected')}>
                                <X className="w-3 h-3 mr-1"/>Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!approvals.length && <p className="text-sm text-muted-foreground py-4">No approvals.</p>}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
