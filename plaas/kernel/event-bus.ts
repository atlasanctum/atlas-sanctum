/**
 * PLAAS Kernel — Event Bus
 * Decentralized pub/sub spine of the planetary organism.
 * No central broker. Each node routes through its own bus instance.
 */

import type { LayerEvent, LayerEventBus } from '../packages/protocols';
import type { NodeRole } from '../packages/types';

type Handler = (event: LayerEvent) => void;

const ROLE_MAP: Record<LayerEvent['type'], NodeRole> = {
  SIGNAL_OBSERVED:    'nervous-system',
  COVENANT_TRIGGERED: 'temple',
  NODE_JOINED:        'constellation',
  NODE_OFFLINE:       'constellation',
  WISDOM_PUBLISHED:   'living-library',
  ALERT_RAISED:       'nervous-system',
};

export class PlaasEventBus implements LayerEventBus {
  private readonly handlers = new Map<NodeRole | '*', Set<Handler>>();
  private readonly history: Array<{ event: LayerEvent; ts: Date }> = [];
  private readonly maxHistory: number;

  constructor(maxHistory = 500) {
    this.maxHistory = maxHistory;
  }

  async publish(event: LayerEvent): Promise<void> {
    const ts = new Date();
    this.history.push({ event, ts });
    if (this.history.length > this.maxHistory) this.history.shift();

    const role = ROLE_MAP[event.type];
    const targets = [
      ...(this.handlers.get(role) ?? []),
      ...(this.handlers.get('*') ?? []),
    ];
    await Promise.allSettled(targets.map(h => Promise.resolve().then(() => h(event))));
  }

  subscribe(role: NodeRole | '*', handler: Handler): () => void {
    if (!this.handlers.has(role)) this.handlers.set(role, new Set());
    this.handlers.get(role)!.add(handler);
    return () => this.handlers.get(role)?.delete(handler);
  }

  replay(role: NodeRole, since: Date): LayerEvent[] {
    return this.history
      .filter(({ event, ts }) => ts >= since && ROLE_MAP[event.type] === role)
      .map(({ event }) => event);
  }
}
