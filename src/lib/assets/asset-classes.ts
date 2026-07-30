/**
 * asset-classes.ts
 *
 * The five new financial primitives that do not exist anywhere in the
 * world today. Each extends the ImpactRecord into a tradeable,
 * composable financial instrument.
 *
 *  1. Proof of Stewardship Bond (PSB)
 *  2. Community Health Future (CHF)
 *  3. Biodiversity Credit (BDC)
 *  4. Indigenous Knowledge Royalty (IKR)
 *  5. Educational Outcome Certificate (EOC)
 */

import type { TrustScore } from '../trust/trust-engine';

// ─── Shared primitives ────────────────────────────────────────────────────────

export type AssetClass = 'PSB' | 'CHF' | 'BDC' | 'IKR' | 'EOC';

export type InstrumentStatus =
  | 'DRAFT'       // created, not yet verified
  | 'ACTIVE'      // verified, tradeable
  | 'MATURED'     // time-bounded instrument that has reached maturity
  | 'DEFAULTED'   // milestones not met
  | 'RETIRED';    // voluntarily retired by holder

export interface BaseInstrument {
  id: string;
  assetClass: AssetClass;
  status: InstrumentStatus;
  issuerDID: string;
  ownerDID: string;
  trustScore: TrustScore;
  issuedAt: number;         // epoch ms
  updatedAt: number;
  onChainRef: string;       // tx hash on sanctum chain
  ipfsMetadata: string;     // content-addressed full metadata
}

// ─── 1. Proof of Stewardship Bond ─────────────────────────────────────────────

/**
 * A bond whose coupon rate is dynamically linked to ongoing ecosystem
 * health metrics verified by satellite data. No annual audit required.
 * The bond self-adjusts based on monthly oracle verification.
 */
export interface ProofOfStewardshipBond extends BaseInstrument {
  assetClass: 'PSB';
  projectID: string;
  biomeID: string;
  locationGeoJSON: string;

  // Financial terms
  principalUSD: number;
  maturityYears: number;
  baseCouponRate: number;    // e.g. 0.045 = 4.5%
  maxCouponRate: number;     // e.g. 0.065 = 6.5% (achieved at max stewardship)
  minCouponRate: number;     // e.g. 0.025 = 2.5% (floor, avoids default incentive)

  // Ecosystem health metrics that drive coupon
  baselineNDVI: number;
  currentNDVI: number;
  baselineCarbonStock: number;
  currentCarbonStock: number;

  // Current coupon computed from satellite verification
  currentCouponRate: number;
  lastVerifiedAt: number;

  // Coupon computation formula
  // coupon = baseCoupon + (ndvi_improvement / baseline_ndvi) * (maxCoupon - baseCoupon)
  nextCouponPaymentAt: number;
  totalCouponsPaid: number;
}

export function computePSBCoupon(bond: ProofOfStewardshipBond): number {
  const ndviImprovement = (bond.currentNDVI - bond.baselineNDVI) / bond.baselineNDVI;
  const couponBoost = ndviImprovement * (bond.maxCouponRate - bond.baseCouponRate);
  return Math.min(
    Math.max(bond.baseCouponRate + couponBoost, bond.minCouponRate),
    bond.maxCouponRate,
  );
}

// ─── 2. Community Health Future ───────────────────────────────────────────────

/**
 * A forward contract on health outcome improvements in a defined community.
 * Staged payments as oracle-verified milestones are hit.
 * If milestones are missed, Recovery Agent triggers partial refund.
 */
export interface CommunityHealthFuture extends BaseInstrument {
  assetClass: 'CHF';
  communityID: string;
  jurisdiction: string;
  populationSize: number;

  // Contract terms
  totalValueUSD: number;
  contractYears: number;
  buyerDID: string;          // government, NGO, or development bank

  milestones: HealthMilestone[];
  milestonesAchieved: number;
  totalMilestonePayout: number;
}

export interface HealthMilestone {
  id: string;
  description: string;
  metric: 'air_quality' | 'waterborne_disease' | 'malnutrition' | 'child_mortality' | 'vaccination_rate';
  baselineValue: number;
  targetValue: number;
  targetDate: number;        // epoch ms
  payoutUSD: number;
  achieved: boolean;
  achievedAt?: number;
  oracleVerificationID?: string;
}

// ─── 3. Biodiversity Credit ───────────────────────────────────────────────────

/**
 * Location-specific, species-specific, non-fungible ecological credit.
 * A BDC representing a nesting ground cannot be substituted by a BDC
 * from a different ecosystem — unlike fungible carbon credits.
 */
export interface BiodiversityCredit extends BaseInstrument {
  assetClass: 'BDC';
  projectID: string;
  locationGeoJSON: string;
  biomeType: string;
  protectedHectares: number;

  // Species profile
  keySpecies: SpeciesRecord[];
  habitatType: string;
  migratoryCorridor: boolean;

  // Verification method — requires hardware oracles
  verificationMethods: Array<'camera_trap' | 'edna_sampling' | 'acoustic_monitoring' | 'satellite'>;
  lastSurveyAt: number;
  nextSurveyAt: number;

  // Non-fungible properties — makes substitution impossible
  uniqueEcosystemHash: string;  // SHA-256 of species profile + location
  substituteProhibited: boolean; // always true for BDC
}

export interface SpeciesRecord {
  scientificName: string;
  commonName: string;
  iucnStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX';
  populationEstimate: number;
  trendDirection: 'increasing' | 'stable' | 'decreasing';
  lastCountAt: number;
}

// ─── 4. Indigenous Knowledge Royalty ─────────────────────────────────────────

/**
 * Standardised on-chain royalty mechanism for traditional ecological
 * knowledge. Communities register knowledge under data sovereignty controls;
 * usage requests flow through the protocol; payments stream automatically.
 *
 * Implements UNDRIP Article 31 — right to maintain, control, protect
 * and develop cultural heritage and traditional knowledge.
 */
export interface IndigenousKnowledgeRoyalty extends BaseInstrument {
  assetClass: 'IKR';
  communityDID: string;
  communityName: string;
  territory: string;         // GeoJSON of ancestral territory

  // Knowledge registration
  knowledgeDomain: 'ecology' | 'medicine' | 'agriculture' | 'governance' | 'cosmology';
  knowledgeHash: string;     // SHA-256; actual content in sovereign vault
  accessLevel: 'commercial' | 'research' | 'conservation';

  // Data sovereignty controls
  consentRequired: boolean;
  consentExpiryYears: number;
  revocable: boolean;
  prohibitedUses: string[];

  // Royalty terms
  royaltyRatePct: number;    // percentage of downstream commercial value
  minimumRoyaltyUSD: number; // per usage event
  totalRoyaltiesEarnedUSD: number;
  totalRoyaltiesDistributed: number;
  paymentCurrency: string;   // local currency code for direct payment
}

// ─── 5. Educational Outcome Certificate ──────────────────────────────────────

/**
 * A tradeable certificate backed by verified educational outcomes.
 * Converts human capital improvements into a financial instrument.
 * Extends the impact primitive standard beyond ecology.
 */
export interface EducationalOutcomeCertificate extends BaseInstrument {
  assetClass: 'EOC';
  institutionDID: string;
  institutionName: string;
  jurisdiction: string;
  cohortSize: number;
  cohortStartYear: number;

  // Outcome metrics
  outcomeMilestones: EducationMilestone[];
  baselineLiteracyRate: number;
  currentLiteracyRate: number;
  baselineAttendanceRate: number;
  currentAttendanceRate: number;

  // Financial terms
  totalValueUSD: number;
  paidToDateUSD: number;
  trackingYears: number;     // longitudinal tracking period (typically 5–10 years)
}

export interface EducationMilestone {
  id: string;
  cohortYear: number;
  metric: 'literacy_rate' | 'attendance' | 'graduation_rate' | 'tertiary_enrollment';
  baselineValue: number;
  achievedValue: number;
  targetValue: number;
  payoutUSD: number;
  verified: boolean;
  verifiedAt?: number;
}

// ─── Union type for all instruments ──────────────────────────────────────────

export type SanctumInstrument =
  | ProofOfStewardshipBond
  | CommunityHealthFuture
  | BiodiversityCredit
  | IndigenousKnowledgeRoyalty
  | EducationalOutcomeCertificate;

// ─── Asset class metadata ─────────────────────────────────────────────────────

export const ASSET_CLASS_METADATA: Record<AssetClass, {
  name: string;
  description: string;
  baseValueUSD: number;
  verificationRequired: string[];
  minTrustScore: number;
  color: string;
}> = {
  PSB: {
    name: 'Proof of Stewardship Bond',
    description: 'Bond with coupon dynamically linked to satellite-verified ecosystem health',
    baseValueUSD: 100,
    verificationRequired: ['satellite', 'sensor'],
    minTrustScore: 0.85,
    color: '#10b981',
  },
  CHF: {
    name: 'Community Health Future',
    description: 'Forward contract on verified health outcome improvements',
    baseValueUSD: 50,
    verificationRequired: ['human', 'document'],
    minTrustScore: 0.80,
    color: '#3b82f6',
  },
  BDC: {
    name: 'Biodiversity Credit',
    description: 'Location-specific, non-fungible ecological protection credit',
    baseValueUSD: 75,
    verificationRequired: ['sensor', 'satellite', 'human'],
    minTrustScore: 0.80,
    color: '#8b5cf6',
  },
  IKR: {
    name: 'Indigenous Knowledge Royalty',
    description: 'Automated royalty instrument for traditional ecological knowledge',
    baseValueUSD: 200,
    verificationRequired: ['human'],
    minTrustScore: 0.75,
    color: '#f59e0b',
  },
  EOC: {
    name: 'Educational Outcome Certificate',
    description: 'Certificate backed by longitudinally verified educational improvements',
    baseValueUSD: 30,
    verificationRequired: ['document', 'human'],
    minTrustScore: 0.75,
    color: '#ef4444',
  },
};
