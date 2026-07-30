import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Repeat, Loader2, PauseCircle, PlayCircle, Pencil, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SubRow {
  id: string;
  plan_name: string;
  amount: number;
  currency: string;
  billing_period: string;
  status: string;
  current_period_end: string;
  canceled_at: string | null;
  metadata: Record<string, unknown> | null;
}

interface Props {
  userId: string | null;
  refreshKey?: number;
}

export const RecurringSubscriptions = ({ userId, refreshKey }: Props) => {
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SubRow | null>(null);
  const [nextAmount, setNextAmount] = useState<number>(0);
  const [busy, setBusy] = useState<Record<string, 'cancel' | 'pause' | 'resume' | 'edit' | null>>({});
  const [rowError, setRowError] = useState<Record<string, string | null>>({});
  const [confirming, setConfirming] = useState<{ sub: SubRow; action: 'cancel' | 'pause' | 'resume' } | null>(null);

  const load = useCallback(async () => {
    if (!userId) { setSubs([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id, plan_name, amount, currency, billing_period, status, current_period_end, canceled_at, metadata')
      .eq('user_id', userId)
      .in('status', ['active', 'paused', 'canceled'])
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    setSubs((data ?? []) as SubRow[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load, refreshKey]);

  /** Optimistic update: mutate row locally, roll back on error. */
  const applyOptimistic = async (
    id: string,
    action: 'cancel' | 'pause' | 'resume' | 'edit',
    changes: Partial<{ status: string; canceled_at: string | null; amount: number }>,
    successMsg: string,
  ) => {
    const prev = subs;
    setBusy((b) => ({ ...b, [id]: action }));
    setRowError((e) => ({ ...e, [id]: null }));
    setSubs((rows) => rows.map((r) => (r.id === id ? { ...r, ...changes } as SubRow : r)));
    const { error } = await supabase.from('subscriptions').update(changes).eq('id', id);
    setBusy((b) => ({ ...b, [id]: null }));
    if (error) {
      setSubs(prev); // rollback
      setRowError((e) => ({ ...e, [id]: error.message }));
      toast.error(`Couldn't ${action}: ${error.message}`);
      return false;
    }
    toast.success(successMsg);
    return true;
  };

  const runConfirmed = async () => {
    if (!confirming) return;
    const { sub, action } = confirming;
    setConfirming(null);
    if (action === 'cancel') {
      await applyOptimistic(sub.id, 'cancel',
        { status: 'canceled', canceled_at: new Date().toISOString() },
        'Recurring donation canceled');
    } else if (action === 'pause') {
      await applyOptimistic(sub.id, 'pause', { status: 'paused' }, 'Recurring donation paused');
    } else {
      await applyOptimistic(sub.id, 'resume',
        { status: 'active', canceled_at: null },
        'Recurring donation resumed');
    }
  };

  const saveAmount = async () => {
    if (!editing) return;
    if (!nextAmount || nextAmount < 1) { toast.error('Amount must be at least $1'); return; }
    const ok = await applyOptimistic(editing.id, 'edit', { amount: nextAmount }, `Updated to $${nextAmount}/mo`);
    if (ok) setEditing(null);
  };

  const CONFIRM_COPY: Record<'cancel' | 'pause' | 'resume', { title: string; desc: string; cta: string }> = {
    cancel: { title: 'Cancel this recurring donation?', desc: 'You will stop being charged. You can start a new one anytime.', cta: 'Yes, cancel' },
    pause:  { title: 'Pause this recurring donation?',  desc: 'Billing is paused until you resume it.', cta: 'Pause' },
    resume: { title: 'Resume this recurring donation?', desc: 'Billing will restart on the next cycle.', cta: 'Resume' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Recurring Commitments</h2>
          <p className="text-sm text-muted-foreground">Manage your automated monthly donations</p>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading subscriptions…
        </div>
      ) : subs.length === 0 ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">
          No recurring donations yet. Use "New Donation" and choose Monthly to set one up.
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {subs.map((s) => {
            const canceled = s.status === 'canceled';
            const paused = s.status === 'paused';
            const rowBusy = busy[s.id];
            const err = rowError[s.id];
            return (
              <Card key={s.id} className={canceled ? 'opacity-70' : 'hover:shadow-lg transition-shadow'}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="gap-1 capitalize">
                      <Repeat className="w-3 h-3" /> {s.billing_period}
                    </Badge>
                    <Badge
                      className={
                        canceled ? 'bg-red-500/10 text-red-500' :
                        paused ? 'bg-amber-500/10 text-amber-500' :
                        'bg-emerald-500/10 text-emerald-500'
                      }
                    >{s.status}</Badge>
                  </div>
                  <h4 className="font-semibold mb-1 line-clamp-1">{s.plan_name}</h4>
                  <p className="text-2xl font-bold tabular-nums">
                    ${Number(s.amount).toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal">/mo</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {canceled
                      ? `Canceled ${s.canceled_at ? new Date(s.canceled_at).toLocaleDateString() : ''}`
                      : `Next charge ${new Date(s.current_period_end).toLocaleDateString()}`}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {!canceled && (
                      <Button variant="outline" size="sm" className="gap-1" disabled={!!rowBusy}
                        onClick={() => { setEditing(s); setNextAmount(Number(s.amount)); }}>
                        {rowBusy === 'edit' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pencil className="w-3.5 h-3.5" />} Edit
                      </Button>
                    )}
                    {!canceled && !paused && (
                      <Button variant="ghost" size="sm" className="gap-1" disabled={!!rowBusy}
                        onClick={() => setConfirming({ sub: s, action: 'pause' })}>
                        {rowBusy === 'pause' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PauseCircle className="w-3.5 h-3.5" />} Pause
                      </Button>
                    )}
                    {paused && (
                      <Button variant="ghost" size="sm" className="gap-1" disabled={!!rowBusy}
                        onClick={() => setConfirming({ sub: s, action: 'resume' })}>
                        {rowBusy === 'resume' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />} Resume
                      </Button>
                    )}
                    {!canceled && (
                      <Button variant="ghost" size="sm" className="gap-1 text-red-500 hover:text-red-600" disabled={!!rowBusy}
                        onClick={() => setConfirming({ sub: s, action: 'cancel' })}>
                        {rowBusy === 'cancel' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Cancel
                      </Button>
                    )}
                  </div>
                  {err && (
                    <p className="mt-3 text-xs text-red-600 inline-flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {err}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update recurring amount</DialogTitle>
            <DialogDescription>{editing?.plan_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Monthly amount (USD)</Label>
            <Input type="number" min={1} step={1} value={nextAmount} onChange={(e) => setNextAmount(Number(e.target.value))} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveAmount} disabled={!!(editing && busy[editing.id])}>
              {editing && busy[editing.id] === 'edit' && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirming} onOpenChange={(o) => !o && setConfirming(null)}>
        <AlertDialogContent>
          {confirming && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{CONFIRM_COPY[confirming.action].title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {CONFIRM_COPY[confirming.action].desc}
                  <span className="block mt-2 font-medium text-foreground">
                    {confirming.sub.plan_name} · ${Number(confirming.sub.amount).toLocaleString()}/mo
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep as is</AlertDialogCancel>
                <AlertDialogAction
                  onClick={runConfirmed}
                  className={confirming.action === 'cancel' ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  {CONFIRM_COPY[confirming.action].cta}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecurringSubscriptions;