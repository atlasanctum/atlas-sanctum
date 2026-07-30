import { Activity, CheckCircle2, RadioTower, RefreshCcw, WifiOff, Zap } from 'lucide-react';
import type { SyncEvent } from '@/hooks/useVerificationSync';

interface Props {
  events: SyncEvent[];
  title?: string;
  emptyLabel?: string;
}

const ICON = {
  connected: RadioTower,
  realtime:  Zap,
  poll:      RefreshCcw,
  manual:    RefreshCcw,
  synced:    CheckCircle2,
  retry:     Activity,
  error:     WifiOff,
} as const;

const COLOR = {
  connected: 'text-emerald-600 bg-emerald-500/10',
  realtime:  'text-blue-600 bg-blue-500/10',
  poll:      'text-muted-foreground bg-muted',
  manual:    'text-primary bg-primary/10',
  synced:    'text-emerald-600 bg-emerald-500/10',
  retry:     'text-amber-600 bg-amber-500/10',
  error:     'text-red-600 bg-red-500/10',
} as const;

const fmt = (d: Date) =>
  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/**
 * Webhook-driven verification status timeline. Renders the last N sync
 * events (realtime pushes, background polls, manual refreshes, retries and
 * failures) so donors can see exactly when an on-chain confirmation was
 * received and when the UI updated to reflect it.
 */
export const VerificationTimeline = ({
  events,
  title = 'Verification activity',
  emptyLabel = 'No sync activity yet.',
}: Props) => {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> {title}
        </h4>
        <span className="text-xs text-muted-foreground">{events.length} events</span>
      </div>
      {events.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ol className="relative border-l border-border/60 ml-2 space-y-3">
          {events.slice(0, 8).map((ev) => {
            const Icon = ICON[ev.kind];
            return (
              <li key={ev.id} className="ml-4">
                <span className={`absolute -left-[9px] flex items-center justify-center w-[18px] h-[18px] rounded-full ring-2 ring-background ${COLOR[ev.kind]}`}>
                  <Icon className="w-3 h-3" />
                </span>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs text-foreground">{ev.message}</p>
                  <time className="text-[10px] tabular-nums text-muted-foreground shrink-0">{fmt(ev.at)}</time>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default VerificationTimeline;