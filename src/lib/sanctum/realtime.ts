/**
 * realtime.ts
 *
 * Unified real-time layer — Socket.IO + Supabase Realtime on one bus.
 *
 * Socket.IO   → backend events (price updates, governance, marketplace)
 * Supabase    → Postgres change events (tables: impact_records, projects, transactions)
 *
 * Both sources emit to the same EventEmitter so consumers only
 * subscribe to semantic event names, not transport details.
 */

import { io, type Socket } from 'socket.io-client';
import { supabase } from '@/integrations/supabase/client';
import { tokenStore } from './http';
import { SANCTUM_CONFIG } from './config';

// ─── Event catalogue ──────────────────────────────────────────────────────────

export type RealtimeEvent =
  | { type: 'PRICE_UPDATE';        data: { assetId: string; price: number; changePercent: number } }
  | { type: 'IMPACT_VERIFIED';     data: { impactId: string; provider: string; confirmations: number } }
  | { type: 'IMPACT_SUBMITTED';    data: { impactId: string; provider: string } }
  | { type: 'GOVERNANCE_UPDATE';   data: { proposalId: string; action: string } }
  | { type: 'MARKETPLACE_ACTIVITY'; data: { listingId: string; action: string; userId: string } }
  | { type: 'NOTIFICATION';        data: { title: string; message: string; severity: string } }
  | { type: 'AGENT_STATUS';        data: { agentId: string; status: string; role: string } }
  | { type: 'CHAIN_BLOCK';         data: { height: number; time: string } };

type EventHandler<T extends RealtimeEvent['type']> = (
  data: Extract<RealtimeEvent, { type: T }>['data'],
) => void;

type AnyHandler = (event: RealtimeEvent) => void;

// ─── Realtime bus ─────────────────────────────────────────────────────────────

class RealtimeBus {
  private socket: Socket | null = null;
  private handlers = new Map<string, Set<(...args: unknown[]) => void>>();
  private wildcardHandlers = new Set<AnyHandler>();
  private supabaseChannels: ReturnType<typeof supabase.channel>[] = [];

  // ─── Socket.IO ──────────────────────────────────────────────────────────────

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(SANCTUM_CONFIG.socket.url, {
      auth: { token: tokenStore.get() },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10_000,
    });

    this.socket.on('connect', () => this.emit({ type: 'CHAIN_BLOCK', data: { height: 0, time: '' } }));

    const socketEvents: Array<[string, RealtimeEvent['type']]> = [
      ['price-update',       'PRICE_UPDATE'],
      ['governance-update',  'GOVERNANCE_UPDATE'],
      ['marketplace-activity', 'MARKETPLACE_ACTIVITY'],
      ['notification',       'NOTIFICATION'],
      ['agent-status',       'AGENT_STATUS'],
    ];

    for (const [socketEvent, busEvent] of socketEvents) {
      this.socket.on(socketEvent, (data: RealtimeEvent['data']) => {
        this.emit({ type: busEvent, data } as RealtimeEvent);
      });
    }
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  // ─── Supabase Realtime ──────────────────────────────────────────────────────

  subscribeToImpact(): void {
    const ch = supabase
      .channel('impact-records')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'impact_records' },
        payload => {
          const rec = payload.new as { id: string; provider: string; oracle_confirmations: number; status: string };
          if (rec.status === 'VERIFIED') {
            this.emit({ type: 'IMPACT_VERIFIED', data: { impactId: rec.id, provider: rec.provider, confirmations: rec.oracle_confirmations } });
          }
        },
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'impact_records' },
        payload => {
          const rec = payload.new as { id: string; provider: string };
          this.emit({ type: 'IMPACT_SUBMITTED', data: { impactId: rec.id, provider: rec.provider } });
        },
      )
      .subscribe();

    this.supabaseChannels.push(ch);
  }

  unsubscribeAll(): void {
    for (const ch of this.supabaseChannels) {
      void supabase.removeChannel(ch);
    }
    this.supabaseChannels = [];
  }

  // ─── Internal emit ──────────────────────────────────────────────────────────

  private emit(event: RealtimeEvent): void {
    const typed = this.handlers.get(event.type);
    typed?.forEach(h => h(event.data));
    this.wildcardHandlers.forEach(h => h(event));
  }

  // ─── Public subscription API ────────────────────────────────────────────────

  on<T extends RealtimeEvent['type']>(type: T, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    const set = this.handlers.get(type)!;
    set.add(handler as (...args: unknown[]) => void);
    return () => set.delete(handler as (...args: unknown[]) => void);
  }

  onAny(handler: AnyHandler): () => void {
    this.wildcardHandlers.add(handler);
    return () => this.wildcardHandlers.delete(handler);
  }
}

export const realtimeBus = new RealtimeBus();

// ─── React hooks ──────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { qk } from './hooks';

/**
 * useRealtimeSync — wire up the full real-time bus in one hook.
 * Call once at the app root (inside QueryClientProvider).
 */
export function useRealtimeSync(): void {
  const qc = useQueryClient();

  useEffect(() => {
    realtimeBus.connect();
    realtimeBus.subscribeToImpact();

    // Auto-invalidate React Query caches on real-time events
    const unsubs = [
      realtimeBus.on('IMPACT_VERIFIED', ({ impactId }) => {
        void qc.invalidateQueries({ queryKey: qk.chain.impactRecord(impactId) });
        void qc.invalidateQueries({ queryKey: ['chain', 'impact', 'status', 'PENDING'] });
        void qc.invalidateQueries({ queryKey: ['api', 'projects'] });
      }),

      realtimeBus.on('PRICE_UPDATE', () => {
        void qc.invalidateQueries({ queryKey: qk.api.market });
        void qc.invalidateQueries({ queryKey: ['api', 'marketplace', 'listings'] });
      }),

      realtimeBus.on('GOVERNANCE_UPDATE', ({ proposalId }) => {
        void qc.invalidateQueries({ queryKey: qk.ai.proposalTally(proposalId) });
      }),

      realtimeBus.on('MARKETPLACE_ACTIVITY', () => {
        void qc.invalidateQueries({ queryKey: qk.api.market });
      }),
    ];

    return () => {
      unsubs.forEach(u => u());
      realtimeBus.disconnect();
      realtimeBus.unsubscribeAll();
    };
  }, [qc]);
}

/**
 * useOnEvent — subscribe to a single event type inside any component.
 */
export function useOnEvent<T extends RealtimeEvent['type']>(
  type: T,
  handler: EventHandler<T>,
): void {
  useEffect(() => realtimeBus.on(type, handler), [type, handler]);
}
