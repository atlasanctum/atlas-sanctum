/**
 * PLAAS Layer 1 — THE NERVOUS SYSTEM
 * Planetary Awareness Layer
 *
 * Civilization's capacity to sense, learn, adapt, and respond in real time.
 * Inspired by: distributed neural networks, indigenous early-warning systems,
 * mycelial chemical signaling.
 *
 * Responsibilities:
 *  - Environmental sensor ingestion (IoT, satellite, field)
 *  - Edge AI inference at the node level
 *  - Mesh communication routing
 *  - Climate & ecological anomaly detection
 *  - Emergency response coordination signals
 */

import type { PlanetarySignal, ConstellationNode } from '../packages/types';

// ─── Sensor Registry ──────────────────────────────────────────────────────────

export type SensorType =
  | 'soil-moisture'
  | 'air-quality'
  | 'water-level'
  | 'ndvi-satellite'
  | 'rainfall-gauge'
  | 'temperature'
  | 'biodiversity-acoustic'
  | 'community-report';

export interface Sensor {
  id: string;
  type: SensorType;
  nodeId: string;
  bioregion: string;
  protocol: 'mqtt' | 'lorawan' | 'http' | 'manual';
  active: boolean;
  lastReading?: SensorReading;
}

export interface SensorReading {
  sensorId: string;
  value: number;
  unit: string;
  quality: 'good' | 'uncertain' | 'poor';
  timestamp: Date;
}

// ─── Edge AI Inference ────────────────────────────────────────────────────────

export interface EdgeInferenceResult {
  modelId: string;
  inputSignals: string[];   // signal IDs
  prediction: string;
  confidence: number;
  anomalyScore: number;     // 0–1; >0.7 triggers alert
  computedAt: Date;
  onDevice: boolean;        // true = ran without cloud
}

// ─── Awareness Engine ─────────────────────────────────────────────────────────

export interface NervousSystemState {
  node: ConstellationNode;
  activeSensors: Sensor[];
  recentSignals: PlanetarySignal[];
  anomalies: EdgeInferenceResult[];
  meshPeers: number;
  offlineQueueDepth: number;
}

export interface NervousSystemLayer {
  ingestReading(reading: SensorReading): Promise<PlanetarySignal>;
  runEdgeInference(signals: PlanetarySignal[]): Promise<EdgeInferenceResult>;
  getState(): NervousSystemState;
  broadcastAlert(signal: PlanetarySignal): Promise<void>;
}
