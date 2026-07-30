/**
 * trust-engine.ts
 *
 * The Trust Equation — the single most important financial primitive
 * in Atlas Sanctum. Every price in every market is a direct function
 * of this score.
 *
 * Trust(claim) =
 *   Evidence_Quality
 *   × Oracle_Reputation_Weighted_Consensus
 *   × ZK_Proof_Validity
 *   × Historical_Accuracy_Rate
 *   × Time_Consistency_Penalty^(gaps_in_record)
 *
 * Range: 0.0 – 1.0
 * A score of 1.0 = mathematically perfect trust. Unreachable in practice.
 * A score of 0.85+ = institutional-grade, suitable for bond issuance.
 * A score of 0.70+ = market-grade, suitable for RIU trading.
 * A score below 0.50 = insufficient for any financial instrument.
 */

export interface OracleAttestation {
  oracleDID: string;
  oracleReputation: number;    // 0–1
  oracleType: 'HUMAN' | 'API' | 'SENSOR';
  confidence: number;          // 0–1, oracle's self-reported confidence
  evidenceHash: string;
  attestedAt: number;          // epoch ms
}

export interface TrustInputs {
  // Evidence quality: number of independent evidence sources (0–1)
  evidenceSources: number;
  evidenceTypes: Array<'satellite' | 'sensor' | 'human' | 'document' | 'photo'>;

  // Oracle attestations
  attestations: OracleAttestation[];

  // ZK proof validity (0 = no proof, 1 = valid proof)
  zkProofValid: boolean;

  // Historical accuracy of this provider (0–1, default 1.0 for new providers)
  providerHistoricalAccuracy: number;

  // Proof of Stewardship score (0–1000 → normalised to 0–1)
  providerStewardshipScore: number;

  // Time consistency: days since last verified record (0 = same day, penalises gaps)
  daysSinceLastRecord: number;

  // Oracle confirmation count vs threshold
  confirmations: number;
  requiredConfirmations: number;
}

export interface TrustScore {
  score: number;                    // 0–1 final trust score
  grade: 'INSUFFICIENT' | 'MARKET' | 'INSTITUTIONAL' | 'SOVEREIGN';
  components: {
    evidenceQuality: number;
    oracleConsensus: number;
    zkValidity: number;
    historicalAccuracy: number;
    timeConsistency: number;
    thresholdMultiplier: number;
  };
  priceMultiplier: number;          // applied to base asset price
  bondEligible: boolean;
  explanation: string;
}

// ─── Core Trust Equation ──────────────────────────────────────────────────────

export function computeTrustScore(inputs: TrustInputs): TrustScore {
  // 1. Evidence Quality (0–1)
  //    Rewards diversity of evidence types, not just quantity
  const uniqueTypes = new Set(inputs.evidenceTypes).size;
  const evidenceQuality = Math.min(
    (inputs.evidenceSources / 5) * 0.6 + (uniqueTypes / 5) * 0.4,
    1.0,
  );

  // 2. Oracle Reputation Weighted Consensus (0–1)
  //    Weighted average of oracle reputations × their individual confidence
  //    Extra weight for oracle type diversity
  const oracleConsensus = computeOracleConsensus(inputs.attestations);

  // 3. ZK Proof Validity (0 or 1, with bonus for having proof)
  const zkValidity = inputs.zkProofValid ? 1.0 : 0.75;

  // 4. Historical Accuracy Rate (0–1)
  //    New providers start at 0.8 (benefit of doubt), improves with track record
  const normalizedAccuracy = inputs.providerHistoricalAccuracy > 0
    ? inputs.providerHistoricalAccuracy
    : 0.8;

  // 5. Time Consistency Penalty
  //    Gaps > 90 days apply a compounding penalty
  const timeConsistency = computeTimeConsistency(inputs.daysSinceLastRecord);

  // 6. Threshold Multiplier
  //    Meeting exactly the threshold = 1.0; each additional oracle adds a small premium
  const thresholdMultiplier = inputs.confirmations >= inputs.requiredConfirmations
    ? Math.min(1.0 + (inputs.confirmations - inputs.requiredConfirmations) * 0.02, 1.1)
    : inputs.confirmations / inputs.requiredConfirmations;

  // Final score — multiplicative so any zero component kills the score
  const raw = evidenceQuality
    * oracleConsensus
    * zkValidity
    * normalizedAccuracy
    * timeConsistency
    * thresholdMultiplier;

  const score = Math.min(Math.max(raw, 0), 1.0);
  const grade = scoreToGrade(score);

  return {
    score: Number(score.toFixed(4)),
    grade,
    components: {
      evidenceQuality: Number(evidenceQuality.toFixed(4)),
      oracleConsensus: Number(oracleConsensus.toFixed(4)),
      zkValidity,
      historicalAccuracy: Number(normalizedAccuracy.toFixed(4)),
      timeConsistency: Number(timeConsistency.toFixed(4)),
      thresholdMultiplier: Number(thresholdMultiplier.toFixed(4)),
    },
    priceMultiplier: trustToPriceMultiplier(score),
    bondEligible: score >= 0.85,
    explanation: buildExplanation(score, grade, {
      evidenceQuality, oracleConsensus, zkValidity,
      historicalAccuracy: normalizedAccuracy, timeConsistency, thresholdMultiplier,
    }),
  };
}

// ─── Oracle Consensus Sub-component ──────────────────────────────────────────

function computeOracleConsensus(attestations: OracleAttestation[]): number {
  if (attestations.length === 0) return 0;

  // Weight by oracle reputation × confidence × type diversity bonus
  const typesSeen = new Set<string>();
  let weightedSum = 0;
  let totalWeight = 0;

  for (const att of attestations) {
    const typeDiversityBonus = typesSeen.has(att.oracleType) ? 1.0 : 1.15;
    typesSeen.add(att.oracleType);

    const weight = att.oracleReputation * typeDiversityBonus;
    weightedSum += weight * att.confidence;
    totalWeight += weight;
  }

  const typeBonus = Math.min(typesSeen.size / 3, 1.0) * 0.1; // up to 10% bonus for all 3 types
  return Math.min((weightedSum / totalWeight) + typeBonus, 1.0);
}

// ─── Time Consistency Sub-component ──────────────────────────────────────────

function computeTimeConsistency(daysSinceLastRecord: number): number {
  if (daysSinceLastRecord <= 90) return 1.0;
  // Each 90-day period above the threshold reduces by 5%
  const periods = Math.floor((daysSinceLastRecord - 90) / 90);
  return Math.max(Math.pow(0.95, periods), 0.5);
}

// ─── Score → Grade → Price ───────────────────────────────────────────────────

function scoreToGrade(score: number): TrustScore['grade'] {
  if (score >= 0.92) return 'SOVEREIGN';
  if (score >= 0.85) return 'INSTITUTIONAL';
  if (score >= 0.70) return 'MARKET';
  return 'INSUFFICIENT';
}

/**
 * trustToPriceMultiplier maps trust score to a price premium/discount.
 * Base price (1.0×) at score 0.70.
 * SOVEREIGN grade earns up to 2.5× premium — reflects real-world
 * premium that institutional buyers pay for highest-grade ESG instruments.
 */
export function trustToPriceMultiplier(score: number): number {
  if (score < 0.50) return 0;        // not tradeable
  if (score < 0.70) return 0.5;      // heavy discount
  if (score < 0.85) return 1.0 + (score - 0.70) * 3.33;  // 1.0 → 1.5×
  if (score < 0.92) return 1.5 + (score - 0.85) * 7.14;  // 1.5 → 2.0×
  return 2.0 + (score - 0.92) * 6.25;                     // 2.0 → 2.5×
}

function buildExplanation(
  score: number,
  grade: TrustScore['grade'],
  components: Record<string, number>,
): string {
  const weakest = Object.entries(components)
    .sort(([, a], [, b]) => a - b)[0];

  return [
    `Trust score: ${(score * 100).toFixed(1)}% (${grade}).`,
    `Weakest component: ${weakest[0]} at ${(weakest[1] * 100).toFixed(1)}%.`,
    grade === 'INSUFFICIENT'
      ? 'Record does not meet minimum threshold for trading.'
      : grade === 'SOVEREIGN'
      ? 'Eligible for sovereign-grade bond issuance and treaty-aligned instruments.'
      : `Eligible for ${grade.toLowerCase()}-grade trading with ${(trustToPriceMultiplier(score)).toFixed(2)}× price multiplier.`,
  ].join(' ');
}

// ─── Asset Pricing Engine ─────────────────────────────────────────────────────

export interface AssetPriceInputs {
  baseValueUSD: number;          // set by methodology committee
  trustScore: TrustScore;
  scarcityFactor: number;        // supply/demand ratio 0–2 (1.0 = balanced)
  liquidityDepth: number;        // USD depth in order book
  timeHorizonYears?: number;     // for time-bounded assets
}

export interface AssetPrice {
  fairValueUSD: number;
  priceRangeUSD: [number, number];  // confidence interval
  liquidityPremium: number;
  scarcityPremium: number;
  trustPremium: number;
  tradeable: boolean;
}

export function computeAssetPrice(inputs: AssetPriceInputs): AssetPrice {
  if (!inputs.trustScore.bondEligible && inputs.trustScore.grade === 'INSUFFICIENT') {
    return { fairValueUSD: 0, priceRangeUSD: [0, 0], liquidityPremium: 0, scarcityPremium: 0, trustPremium: 0, tradeable: false };
  }

  const trustPremium = inputs.trustScore.priceMultiplier;
  const scarcityPremium = Math.min(Math.max(inputs.scarcityFactor, 0.1), 3.0);

  // Liquidity discount: thin books reduce price, deep books increase slightly
  const liquidityPremium = inputs.liquidityDepth > 1_000_000
    ? 1.05
    : inputs.liquidityDepth > 100_000
    ? 1.0
    : 0.85;

  const fairValueUSD = inputs.baseValueUSD * trustPremium * scarcityPremium * liquidityPremium;

  // 10% confidence interval based on trust score uncertainty
  const uncertainty = (1 - inputs.trustScore.score) * 0.2;

  return {
    fairValueUSD: Number(fairValueUSD.toFixed(2)),
    priceRangeUSD: [
      Number((fairValueUSD * (1 - uncertainty)).toFixed(2)),
      Number((fairValueUSD * (1 + uncertainty)).toFixed(2)),
    ],
    liquidityPremium,
    scarcityPremium,
    trustPremium,
    tradeable: true,
  };
}
