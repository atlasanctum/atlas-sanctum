/**
 * Atlas Sanctum Mobile — Offline Queue
 * Persists actions locally (AsyncStorage) and replays them when connectivity is restored.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QueuedAction {
  id: string;
  type: 'field_report' | 'sensor_reading' | 'governance_vote' | 'evidence_upload';
  payload: Record<string, unknown>;
  createdAt: number;
  retries: number;
}

const QUEUE_KEY = '@atlas_offline_queue';

export async function enqueue(action: Omit<QueuedAction, 'id' | 'createdAt' | 'retries'>): Promise<void> {
  const queue = await loadQueue();
  queue.push({ ...action, id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, createdAt: Date.now(), retries: 0 });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function loadQueue(): Promise<QueuedAction[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? (JSON.parse(raw) as QueuedAction[]) : [];
}

export async function removeFromQueue(id: string): Promise<void> {
  const queue = await loadQueue();
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue.filter(a => a.id !== id)));
}

export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY);
}
