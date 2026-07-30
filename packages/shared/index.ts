/**
 * @atlas-sanctum/shared
 * Shared utilities, constants, and validation schemas
 * used across all Atlas Sanctum apps and services.
 */

// ─── Planetary Boundaries ─────────────────────────────────────────────────────
// Rockström et al. (2009) — updated 2023 values

export const PLANETARY_BOUNDARIES = {
  carbonBudgetGt:           380,    // remaining carbon budget (GtCO2)
  biodiversityIntactnessMin: 90,    // minimum BII score (%)
  nitrogenCycleMax:          62,    // Tg N/yr
  phosphorusCycleMax:        11,    // Tg P/yr
  freshwaterMax:             4000,  // km³/yr
  landSystemChangeMax:       75,    // % forest cover remaining
  oceanAcidificationMin:     2.75,  // aragonite saturation state
} as const;

// ─── Regenerative Credit Types ────────────────────────────────────────────────

export const CREDIT_TYPES = [
  'carbon',
  'biodiversity',
  'water',
  'ocean',
  'community',
  'healthcare',
  'circular_economy',
] as const;

export type CreditType = typeof CREDIT_TYPES[number];

// ─── Covenant Layers ──────────────────────────────────────────────────────────

export const COVENANT_LAYERS = {
  creation:       'I   — Purpose',
  preservation:   'II  — Resilience',
  multiplication: 'III — Innovation',
  justice:        'IV  — Governance',
  leadership:     'V   — Institution',
  renewal:        'VI  — Learning',
} as const;

// ─── Bioregions ───────────────────────────────────────────────────────────────

export const BIOREGIONS = [
  'amazon-basin',
  'congo-basin',
  'boreal-forest',
  'coral-triangle',
  'himalayan-watershed',
  'sahel',
  'arctic',
  'mediterranean',
  'great-barrier-reef',
  'mesoamerican-reef',
  'cerrado',
  'sundaland',
] as const;

export type Bioregion = typeof BIOREGIONS[number];

// ─── Validation Helpers ───────────────────────────────────────────────────────

export function isValidDID(did: string): boolean {
  return /^did:[a-z]+:[a-zA-Z0-9._:-]+$/.test(did);
}

export function isValidCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function normalizeScore(value: number): number {
  return clamp(value, 0, 1);
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function toEpochMs(date: Date | string | number): number {
  return new Date(date).getTime();
}

export function fromEpochMs(ms: number): Date {
  return new Date(ms);
}

export function sevenGenerationHorizon(): Date {
  return new Date(Date.now() + 7 * 25 * 365.25 * 24 * 3600 * 1000);
}
