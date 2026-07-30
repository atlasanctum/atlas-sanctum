/**
 * PLAAS Layer 7 — THE LIVING LIBRARY
 * Civilization Memory & Wisdom Layer
 *
 * Not merely information storage — wisdom preservation.
 * Learns continuously, protects truth integrity, translates across cultures.
 * Inspired by: Library of Alexandria, Timbuktu manuscripts,
 * Andean khipu, Aboriginal songlines, Yoruba Ifá corpus.
 *
 * Responsibilities:
 *  - Historical intelligence & pattern recognition
 *  - Indigenous knowledge systems (sovereignty-first)
 *  - Governance lessons & institutional memory
 *  - Scientific archives with provenance
 *  - Oral tradition digitization (consent-based)
 *  - AI-assisted cross-cultural knowledge synthesis
 *  - Truth integrity verification
 */

import type { WisdomEntry } from '../packages/types';

// ─── Knowledge Graph ──────────────────────────────────────────────────────────

export interface KnowledgeNode {
  id: string;
  type: 'concept' | 'practice' | 'place' | 'person' | 'event' | 'species' | 'principle';
  label: string;
  description: string;
  traditions: string[];
  languages: string[];
  verifiedBy: string[];
  createdAt: Date;
}

export interface KnowledgeEdge {
  fromId: string;
  toId: string;
  relation: 'teaches' | 'contradicts' | 'supports' | 'evolved-from' | 'applies-to' | 'sacred-to';
  weight: number;           // 0–1 strength of relation
  sourceWisdomId?: string;
}

// ─── Oral Tradition ───────────────────────────────────────────────────────────

export interface OralRecord {
  id: string;
  title: string;
  tradition: string;
  language: string;
  narrator: string;
  bioregion: string;
  audioHash?: string;         // content-addressed audio
  transcription?: string;
  translation?: Record<string, string>;  // language → text
  consentGrantedBy: string;   // community authority ID
  accessPolicy: 'public' | 'community' | 'elders-only';
  recordedAt: Date;
}

// ─── Truth Integrity ──────────────────────────────────────────────────────────

export interface TruthClaim {
  id: string;
  statement: string;
  sources: string[];          // vault entry IDs or external URLs
  verifiedBy: string[];       // council member IDs
  confidenceScore: number;    // 0–1
  contested: boolean;
  contestedBy?: string[];
  createdAt: Date;
}

// ─── Synthesis Engine ─────────────────────────────────────────────────────────

export interface WisdomSynthesis {
  id: string;
  query: string;
  traditions: string[];
  synthesizedInsight: string;
  sourceEntries: string[];    // wisdom entry IDs
  generatedBy: 'ai-assisted' | 'council' | 'hybrid';
  reviewedBy?: string[];
  createdAt: Date;
}

// ─── Living Library Layer Interface ──────────────────────────────────────────

export interface LivingLibraryLayer {
  addWisdom(entry: Omit<WisdomEntry, 'id' | 'createdAt'>): Promise<WisdomEntry>;
  searchKnowledgeGraph(query: string, traditions?: string[]): Promise<KnowledgeNode[]>;
  recordOralTradition(record: Omit<OralRecord, 'id'>): Promise<OralRecord>;
  verifyTruthClaim(claim: Omit<TruthClaim, 'id' | 'createdAt'>): Promise<TruthClaim>;
  synthesizeWisdom(query: string, traditions: string[]): Promise<WisdomSynthesis>;
  translateWisdom(entryId: string, targetLanguage: string): Promise<string>;
}
