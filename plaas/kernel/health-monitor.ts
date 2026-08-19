/**
 * PLAAS Kernel — Health Monitor
 * Continuously observes all 8 constellation layers.
 * Publishes NODE_OFFLINE alerts when a layer goes dark.
 */

import type { HealthCheckProtocol, LayerHealth } from '../packages/protocols';
import type { NodeRole } from '../packages/types';
import type { PlaasEventBus } from './event-bus';

export type LayerPingFn = () => Promise<boolean>;

export class PlaasHealthMonitor implements HealthCheckProtocol {
  private readonly registry = new Map<NodeRole, LayerPingFn>();
  private readonly cache = new Map<NodeRole, LayerHealth>();

  constructor(private readonly bus: PlaasEventBus) {}

  register(role: NodeRole, ping: LayerPingFn): void {
    this.registry.set(role, ping);
  }

  async ping(role: NodeRole): Promise<LayerHealth> {
    const fn = this.registry.get(role);
    const start = Date.now();
    let health: LayerHealth;

    if (!fn) {
      health = { role, status: 'offline', lastCheck: new Date() };
    } else {
      try {
        const ok = await fn();
        health = {
          role,
          status: ok ? 'healthy' : 'degraded',
          latencyMs: Date.now() - start,
          lastCheck: new Date(),
        };
      } catch {
        health = { role, status: 'offline', latencyMs: Date.now() - start, lastCheck: new Date() };
      }
    }

    const prev = this.cache.get(role);
    this.cache.set(role, health);

    if (health.status === 'offline' && prev?.status !== 'offline') {
      await this.bus.publish({ type: 'NODE_OFFLINE', payload: { nodeId: role } });
    }

    return health;
  }

  async pingAll(): Promise<LayerHealth[]> {
    return Promise.all([...this.registry.keys()].map(r => this.ping(r)));
  }

  getCached(): LayerHealth[] {
    return [...this.cache.values()];
  }
}
