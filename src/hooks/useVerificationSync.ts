import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SyncStatus = 'idle' | 'connecting' | 'live' | 'polling' | 'retrying' | 'error';

export type SyncEventKind =
  | 'connected'
  | 'realtime'
  | 'poll'
  | 'manual'
  | 'synced'
  | 'retry'
  | 'error';

export interface SyncEvent {
  id: string;
  kind: SyncEventKind;
  at: Date;
  message: string;
}

interface Options {
  /** Called whenever new data should be fetched. Should throw on failure. */
  fetcher: () => Promise<void>;
  /** Enable realtime subscription for this table filtered by user_id. */
  table?: 'transactions' | 'subscriptions';
  userId: string | null;
  /** Fallback polling interval (ms). */
  pollMs?: number;
  /** Max retry attempts on transient failure. */
  maxRetries?: number;
}

/**
 * Verification sync with realtime-first + polling fallback + exponential
 * backoff on transient errors. Exposes a status flag the UI can render.
 */
export const useVerificationSync = ({
  fetcher,
  table,
  userId,
  pollMs = 30_000,
  maxRetries = 4,
}: Options) => {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<SyncEvent[]>([]);
  const attemptRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const triggerRef = useRef<SyncEventKind>('poll');

  const pushEvent = useCallback((kind: SyncEventKind, message: string) => {
    setEvents((prev) => [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, kind, at: new Date(), message },
      ...prev,
    ].slice(0, 20));
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const run = useCallback(async () => {
    if (cancelledRef.current) return;
    const trigger = triggerRef.current;
    triggerRef.current = 'poll';
    try {
      await fetcher();
      attemptRef.current = 0;
      setLastSyncedAt(new Date());
      setError(null);
      setStatus((prev) => (prev === 'live' ? 'live' : 'polling'));
      pushEvent('synced', trigger === 'realtime'
        ? 'On-chain confirmation received — UI refreshed'
        : trigger === 'manual' ? 'Manual refresh completed' : 'Background sync completed');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sync failed';
      attemptRef.current += 1;
      setError(msg);
      if (attemptRef.current <= maxRetries) {
        setStatus('retrying');
        const backoff = Math.min(30_000, 1000 * 2 ** (attemptRef.current - 1));
        pushEvent('retry', `Retrying in ${Math.round(backoff / 1000)}s (attempt ${attemptRef.current})`);
        clearTimer();
        timerRef.current = window.setTimeout(run, backoff);
      } else {
        setStatus('error');
        pushEvent('error', `Sync failed: ${msg}`);
      }
    }
  }, [fetcher, maxRetries, pushEvent]);

  const refresh = useCallback(() => {
    triggerRef.current = 'manual';
    attemptRef.current = 0;
    return run();
  }, [run]);

  // Initial + polling fallback
  useEffect(() => {
    cancelledRef.current = false;
    if (!userId) return;
    setStatus('connecting');
    run();
    const poll = window.setInterval(() => {
      // Only poll if we're not currently retrying (backoff handles that)
      if (attemptRef.current === 0) run();
    }, pollMs);
    return () => {
      cancelledRef.current = true;
      clearTimer();
      window.clearInterval(poll);
    };
  }, [userId, pollMs, run]);

  // Realtime subscription — webhook-style push updates
  useEffect(() => {
    if (!userId || !table) return;
    const channel = supabase
      .channel(`sync:${table}:${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `user_id=eq.${userId}` },
        (payload) => {
          triggerRef.current = 'realtime';
          pushEvent('realtime', `Change detected on ${table} (${(payload as { eventType?: string })?.eventType ?? 'update'})`);
          run();
        },
      )
      .subscribe((state) => {
        if (state === 'SUBSCRIBED') {
          setStatus('live');
          pushEvent('connected', 'Realtime channel connected');
        } else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') {
          setStatus('polling');
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [userId, table, run, pushEvent]);

  return { status, lastSyncedAt, error, refresh, events };
};

export default useVerificationSync;