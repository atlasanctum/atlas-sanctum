/**
 * PLAAS Layer 4 — THE ARK
 * Preservation & Continuity Layer
 *
 * Civilization memory across generations, crises, and disruptions.
 * Inspired by: Svalbard Global Seed Vault, Yoruba oral archives,
 * Andean quipu knowledge systems, Byzantine manuscript preservation.
 *
 * Responsibilities:
 *  - Decentralized knowledge vaults (content-addressed)
 *  - Biodiversity intelligence archives
 *  - Indigenous wisdom preservation (sovereignty-respecting)
 *  - Crisis continuity protocols
 *  - Sovereign memory systems (community-owned)
 *  - Resilient education continuity
 */

import type { WisdomEntry } from '../packages/types';

// ─── Vault ────────────────────────────────────────────────────────────────────

export type VaultContentType =
  | 'seed-genome'
  | 'indigenous-knowledge'
  | 'governance-record'
  | 'scientific-data'
  | 'oral-tradition'
  | 'ecological-baseline'
  | 'cultural-artifact'
  | 'crisis-protocol';

export interface VaultEntry {
  id: string;
  contentType: VaultContentType;
  contentHash: string;        // SHA-256 content address
  title: string;
  description: string;
  bioregion: string;
  tradition?: string;
  language: string;
  custodians: string[];       // community IDs with sovereignty
  accessPolicy: 'public' | 'bioregional' | 'custodians-only';
  replicationCount: number;   // how many nodes hold a copy
  createdAt: Date;
  lastVerifiedAt: Date;
}

// ─── Crisis Continuity ────────────────────────────────────────────────────────

export type CrisisType =
  | 'climate-disaster'
  | 'economic-collapse'
  | 'conflict'
  | 'infrastructure-failure'
  | 'pandemic'
  | 'information-corruption';

export interface ContinuityProtocol {
  id: string;
  crisisType: CrisisType;
  bioregion: string;
  steps: ContinuityStep[];
  offlineCapable: boolean;
  lastDrilled?: Date;
  approvedBy: string[];       // council IDs
}

export interface ContinuityStep {
  order: number;
  action: string;
  responsible: string;        // role or community ID
  offlineInstructions?: string;
  estimatedDurationHours: number;
}

// ─── Biodiversity Intelligence ────────────────────────────────────────────────

export interface BiodiversityRecord {
  id: string;
  bioregion: string;
  species: string;
  commonName: string;
  indigenousName?: string;
  population?: number;
  trend: 'increasing' | 'stable' | 'declining' | 'critical' | 'extinct';
  observedAt: Date;
  observedBy: string;
  linkedWisdom?: string[];    // wisdom entry IDs
}

// ─── Ark Layer Interface ──────────────────────────────────────────────────────

export interface ArkLayer {
  store(entry: Omit<VaultEntry, 'id' | 'contentHash' | 'replicationCount' | 'createdAt' | 'lastVerifiedAt'>): Promise<VaultEntry>;
  retrieve(id: string, requesterId: string): Promise<VaultEntry | null>;
  verifyIntegrity(id: string): Promise<{ valid: boolean; hash: string }>;
  activateProtocol(crisisType: CrisisType, bioregion: string): Promise<ContinuityProtocol>;
  recordBiodiversity(record: Omit<BiodiversityRecord, 'id'>): Promise<BiodiversityRecord>;
  searchWisdom(query: string, language?: string): Promise<WisdomEntry[]>;
}
