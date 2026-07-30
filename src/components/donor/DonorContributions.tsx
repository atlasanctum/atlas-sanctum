import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Heart, Repeat, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVerificationSync } from '@/hooks/useVerificationSync';
import { SyncStatusBadge } from './SyncStatusBadge';
import { VerificationTimeline } from './VerificationTimeline';

interface Row {
  id: string;
  created_at: string;
  completed_at: string | null;
  total_amount: number;
  quantity: number;
  status: string;
  transaction_type: string | null;
}

interface Props {
  projectId: string;
  userId: string | null;
}

export const DonorContributions = ({ projectId, userId }: Props) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const fetcher = useCallback(async () => {
    if (!userId) { setRows([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from('transactions')
      .select('id, created_at, completed_at, total_amount, quantity, status, transaction_type')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    setRows((data ?? []) as Row[]);
    setLoading(false);
  }, [projectId, userId]);

  const { status, lastSyncedAt, error, refresh, events } = useVerificationSync({
    fetcher, userId, table: 'transactions',
  });

  const total = rows.filter((r) => r.status === 'completed').reduce((s, r) => s + Number(r.total_amount || 0), 0);

  return (
    <Card className="bg-card-gradient border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-500" /> Your Contributions
          </CardTitle>
          {userId && (
            <SyncStatusBadge status={status} lastSyncedAt={lastSyncedAt} error={error} onRetry={refresh} compact />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!userId ? (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">Sign in to see your donations to this project.</p>
            <Button asChild size="sm"><Link to="/auth"><LogIn className="w-4 h-4 mr-1" /> Sign in</Link></Button>
          </div>
        ) : loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven't contributed to this project yet.</p>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div>
                <div className="text-xs text-muted-foreground">Your lifetime contribution</div>
                <div className="text-2xl font-bold tabular-nums text-emerald-600">${total.toLocaleString()}</div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600">{rows.length} donation{rows.length === 1 ? '' : 's'}</Badge>
            </div>
            <div className="divide-y divide-border/40">
              {rows.map((r) => {
                const ref = `atl_${r.id.replace(/-/g, '').slice(0, 12)}`;
                const verified = r.status === 'completed';
                return (
                  <div key={r.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <div className="font-medium">
                        ${Number(r.total_amount).toLocaleString()}
                        {r.transaction_type === 'donation' ? '' : ` · ${r.quantity} credits`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(r.completed_at ?? r.created_at).toLocaleDateString()} · <span className="capitalize">{r.status}</span>
                      </div>
                    </div>
                    {verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5" /> {ref}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <Repeat className="w-3.5 h-3.5 animate-spin" /> Awaiting attestation
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <VerificationTimeline events={events} title="On-chain verification activity" />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DonorContributions;