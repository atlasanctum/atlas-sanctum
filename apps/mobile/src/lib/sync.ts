/**
 * Atlas Sanctum Mobile — Sync Service
 * Drains the offline queue when network connectivity is restored.
 */

import NetInfo from '@react-native-community/netinfo';
import { loadQueue, removeFromQueue, QueuedAction } from './offline-queue';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.atlassanctum.com';

async function submitAction(action: QueuedAction): Promise<boolean> {
  const endpoints: Record<QueuedAction['type'], string> = {
    field_report:     '/v1/field/reports',
    sensor_reading:   '/v1/sensors/readings',
    governance_vote:  '/v1/governance/votes',
    evidence_upload:  '/v1/projects/evidence',
  };
  try {
    const res = await fetch(`${API_BASE}${endpoints[action.type]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncQueue(): Promise<{ synced: number; failed: number }> {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return { synced: 0, failed: 0 };

  const queue = await loadQueue();
  let synced = 0, failed = 0;

  for (const action of queue) {
    const ok = await submitAction(action);
    if (ok) {
      await removeFromQueue(action.id);
      synced++;
    } else {
      failed++;
    }
  }
  return { synced, failed };
}

/** Call once on app start — auto-syncs whenever connectivity is restored. */
export function startSyncListener(onSync?: (result: { synced: number; failed: number }) => void): () => void {
  return NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncQueue().then(result => {
        if (result.synced > 0) onSync?.(result);
      });
    }
  });
}
