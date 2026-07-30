import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle2, Loader2, RadioTower, RefreshCcw, WifiOff } from 'lucide-react';
import type { SyncStatus } from '@/hooks/useVerificationSync';
import { Button } from '@/components/ui/button';

interface Props {
  status: SyncStatus;
  lastSyncedAt: Date | null;
  error?: string | null;
  onRetry?: () => void;
  compact?: boolean;
}

const CONFIG: Record<SyncStatus, { label: string; icon: typeof RadioTower; className: string }> = {
  idle:       { label: 'Idle',        icon: RadioTower, className: 'text-muted-foreground' },
  connecting: { label: 'Connecting',  icon: Loader2,    className: 'text-muted-foreground animate-pulse' },
  live:       { label: 'Live',        icon: RadioTower, className: 'text-emerald-600' },
  polling:    { label: 'Synced',      icon: CheckCircle2, className: 'text-emerald-600' },
  retrying:   { label: 'Retrying',    icon: RefreshCcw, className: 'text-amber-600' },
  error:      { label: 'Offline',     icon: WifiOff,    className: 'text-red-600' },
};

export const SyncStatusBadge = ({ status, lastSyncedAt, error, onRetry, compact }: Props) => {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  const spin = status === 'connecting' || status === 'retrying';
  const prev = useRef<SyncStatus>(status);
  useEffect(() => {
    if (prev.current !== status) {
      if (status === 'retrying' && prev.current !== 'retrying') {
        toast.warning('Sync interrupted', { description: error ?? 'Retrying with backoff…' });
      } else if (status === 'error') {
        toast.error('Sync offline', {
          description: error ?? 'Automatic retries exhausted.',
          action: onRetry ? { label: 'Retry now', onClick: () => onRetry() } : undefined,
        });
      } else if (status === 'live' && prev.current !== 'live' && prev.current !== 'idle' && prev.current !== 'connecting') {
        toast.success('Realtime sync restored');
      } else if ((status === 'polling' || status === 'live') && (prev.current === 'error' || prev.current === 'retrying')) {
        toast.success('Back online');
      }
      prev.current = status;
    }
  }, [status, error, onRetry]);

  const handleRetry = () => {
    if (!onRetry) return;
    toast.info('Retrying sync…');
    onRetry();
  };

  return (
    <div className={`inline-flex items-center gap-2 text-xs ${compact ? '' : 'px-2.5 py-1 rounded-md border border-border/50 bg-muted/30'}`}>
      <Icon className={`w-3.5 h-3.5 ${cfg.className} ${spin ? 'animate-spin' : ''}`} />
      <span className={cfg.className}>{cfg.label}</span>
      {lastSyncedAt && status !== 'error' && (
        <span className="text-muted-foreground">· {lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      )}
      {status === 'error' && error && <span className="text-red-600 hidden sm:inline">· {error}</span>}
      {onRetry && (status === 'error' || status === 'retrying' || status === 'polling' || status === 'live') && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 gap-1"
          onClick={handleRetry}
          aria-label="Retry sync now"
        >
          {status === 'error' ? <AlertCircle className="w-3 h-3" /> : <RefreshCcw className="w-3 h-3" />}
          Retry now
        </Button>
      )}
    </div>
  );
};

export default SyncStatusBadge;