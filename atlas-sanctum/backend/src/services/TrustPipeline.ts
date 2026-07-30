/**
 * TrustPipeline.ts
 *
 * THE WHEEL TURNING:
 * Evidence submission → Oracle attestation collection → TrustScore computation
 * → Covenant eligibility check → Blockchain anchoring → Event emission
 * → Agent task dispatch → Reputation update → Price feed update
 *
 * This service is the axle. Every other service is a spoke.
 * Nothing in the system should call trust-engine directly — they call this.
 *
 * Data flow:
 *   MrvService.createEvidence()
 *     └─▶ TrustPipeline.ingestEvidence()
 *           ├─▶ collectOracleAttestations()     [oracle keeper interface]
 *           ├─▶ computeTrustScore()             [trust-engine]
 *           ├─▶ checkConstitutionalConstraints() [constitution engine]
 *           ├─▶ evaluateCovenantEligibility()   [covenant engine]
 *           ├─▶ anchorOnChain()                 [blockchain connector]
 *           ├─▶ updateProviderReputation()      [identity keeper interface]
 *           ├─▶ dispatchAgentTasks()            [agent orchestrator]
 *           └─▶ publishDomainEvents()           [event bus]
 */

import { EventBus, EVENTS } from '../services/eventBus';
import { AgentOrchestrator } from '../agents/orchestrator';
import { BlockchainConnector } from '../connectors/BlockchainConnector';
import {
  computeTrustScore,
  computeAssetPrice,
  type TrustInputs,
  type TrustScore,
  type OracleAttestation,
} from '../lib/trust-engine';
import {
  reviewProposal,
  type AmendmentTier,
} from '../lib/constitution';
import {
  evaluateCovenant,
  type Covenant,
  type RiskSnapshot,
  type ReserveAccount,
} from '../services/covenantEngine';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IngestEvidenceInput {
  evidenceId: string;
  projectId: string;
  providerId: string;           // DID or address of impact provider
  evidenceType: 'satellite' | 'sensor' | 'human' | 'document' | 'photo';
  metricCode: string;
  value: number;
  unit: string;
  capturedAt: Date;
  rawDataHash: string;          // SHA-256 of evidence bundle — anchored on-chain
  attestations: OracleAttestation[];
  providerHistoricalAccuracy?: number;
  providerStewardshipScore?: number;
  daysSinceLastRecord?: number;
  zkProofValid?: boolean;
}

export interface PipelineResult {
  evidenceId: string;
  trustScore: TrustScore;
  assetPriceUSD: number;
  anchored: boolean;
  anchorTxHash?: string;
  covenantTriggered: boolean;
  agentTaskIds: string[];
  constitutionalViolations: string[];
  publishedEvents: string[];
  processingMs: number;
}

export interface OracleStakeRecord {
  oracleAddress: string;
  oracleType: 'HUMAN' | 'API' | 'SENSOR';
  stakedAmountSAN: number;      // staked SAN tokens — slashable
  reputation: number;           // 0–1 from chain state
  slashHistory: { timestamp: number; reason: string; amount: number }[];
}

export interface ReputationDelta {
  providerId: string;
  delta: number;                // positive = improve, negative = slash
  reason: 'verified_impact' | 'fraud_detected' | 'inactivity' | 'oracle_slash';
}

// ─── TrustPipeline ────────────────────────────────────────────────────────────

export class TrustPipeline {
  // Reputation store — in production backed by identity keeper on-chain
  private reputationCache = new Map<string, number>();
  // Oracle stake registry — in production backed by oracle keeper on-chain
  private oracleStakes = new Map<string, OracleStakeRecord>();
  // Base price per asset class — set by methodology committee, in production from governance
  private basePrices: Record<string, number> = {
    CO2_TONNE: 25,
    BIODIVERSITY_UNIT: 40,
    SOIL_CARBON: 18,
    WATERSHED_CREDIT: 35,
    HEALTH_OUTCOME: 50,
  };

  constructor(
    private readonly eventBus: EventBus,
    private readonly orchestrator: AgentOrchestrator,
    private readonly blockchain: BlockchainConnector,
  ) {}

  // ─── Main entry point ─────────────────────────────────────────────────────

  async ingestEvidence(input: IngestEvidenceInput): Promise<PipelineResult> {
    const start = Date.now();
    const publishedEvents: string[] = [];
    const agentTaskIds: string[] = [];
    let anchored = false;
    let anchorTxHash: string | undefined;
    let covenantTriggered = false;

    // 1. Validate oracle attestations — check each oracle is staked and active
    const validatedAttestations = this.validateOracleAttestations(input.attestations);

    // 2. Compute trust score — the hub of the wheel
    const trustInputs: TrustInputs = {
      evidenceSources: validatedAttestations.length,
      evidenceTypes: [input.evidenceType],
      attestations: validatedAttestations,
      zkProofValid: input.zkProofValid ?? false,
      providerHistoricalAccuracy: this.getProviderReputation(input.providerId),
      providerStewardshipScore: input.providerStewardshipScore ?? 500,
      daysSinceLastRecord: input.daysSinceLastRecord ?? 0,
      confirmations: validatedAttestations.length,
      requiredConfirmations: this.getRequiredConfirmations(validatedAttestations),
    };

    const trustScore = computeTrustScore(trustInputs);

    // 3. Constitutional constraint check — nothing untrusted reaches the chain
    const constitutionalViolations = this.checkConstitutionalConstraints(input, trustScore);
    if (constitutionalViolations.length > 0) {
      await this.eventBus.publish(
        EVENTS.ANOMALY_DETECTED,
        input.evidenceId,
        'evidence',
        { violations: constitutionalViolations, trustScore: trustScore.score, evidenceId: input.evidenceId },
      );
      publishedEvents.push(EVENTS.ANOMALY_DETECTED);

      // Dispatch Governance Agent to review
      const taskId = await this.orchestrator.submit({
        role: 'governance-advisor',
        instruction: `Constitutional violations detected in evidence ${input.evidenceId}. Review and recommend action.`,
        context: { evidenceId: input.evidenceId, violations: constitutionalViolations, trustScore },
        priority: 1,
        requiresHumanApproval: true,
      });
      agentTaskIds.push(taskId);

      return {
        evidenceId: input.evidenceId,
        trustScore,
        assetPriceUSD: 0,
        anchored: false,
        covenantTriggered: false,
        agentTaskIds,
        constitutionalViolations,
        publishedEvents,
        processingMs: Date.now() - start,
      };
    }

    // 4. Compute asset price from trust score
    const basePrice = this.basePrices[input.metricCode] ?? 25;
    const priceResult = computeAssetPrice({
      baseValueUSD: basePrice,
      trustScore,
      scarcityFactor: 1.0,     // TODO: feed from market agent
      liquidityDepth: 500_000, // TODO: feed from market agent
    });

    // 5. Anchor on-chain if trust score meets market grade
    if (trustScore.grade !== 'INSUFFICIENT') {
      try {
        const proof = await this.blockchain.anchorImpactProof({
          projectId: input.projectId,
          metricCode: input.metricCode,
          value: input.value,
          verifiedBy: validatedAttestations.map(a => a.oracleDID).join(','),
          timestamp: input.capturedAt.toISOString(),
          evidenceHash: input.rawDataHash,
        });
        anchored = true;
        anchorTxHash = proof.txHash;

        await this.eventBus.publish(EVENTS.IMPACT_PROOF_ANCHORED, input.evidenceId, 'evidence', {
          evidenceId: input.evidenceId,
          txHash: proof.txHash,
          trustScore: trustScore.score,
          grade: trustScore.grade,
          priceUSD: priceResult.fairValueUSD,
        });
        publishedEvents.push(EVENTS.IMPACT_PROOF_ANCHORED);
      } catch (err) {
        // Anchor failure is non-fatal — evidence is verified, anchoring retried by Recovery Agent
        const taskId = await this.orchestrator.submit({
          role: 'security-sentinel',
          instruction: `Blockchain anchor failed for evidence ${input.evidenceId}. Investigate and retry.`,
          context: { evidenceId: input.evidenceId, error: String(err) },
          priority: 2,
        });
        agentTaskIds.push(taskId);
      }
    }

    // 6. Update provider reputation based on trust score
    this.updateProviderReputation(input.providerId, trustScore);

    // 7. Update oracle reputations — reward accurate oracles, track performance
    this.updateOracleReputations(validatedAttestations, trustScore);

    // 8. Publish PROJECT_VERIFIED domain event
    await this.eventBus.publish(EVENTS.PROJECT_VERIFIED, input.projectId, 'project', {
      evidenceId: input.evidenceId,
      providerId: input.providerId,
      trustScore: trustScore.score,
      grade: trustScore.grade,
      priceUSD: priceResult.fairValueUSD,
      anchored,
      anchorTxHash,
    });
    publishedEvents.push(EVENTS.PROJECT_VERIFIED);

    // 9. Dispatch agent tasks based on trust score grade
    const taskIds = await this.dispatchGradedAgentTasks(input, trustScore, priceResult.fairValueUSD);
    agentTaskIds.push(...taskIds);

    return {
      evidenceId: input.evidenceId,
      trustScore,
      assetPriceUSD: priceResult.fairValueUSD,
      anchored,
      anchorTxHash,
      covenantTriggered,
      agentTaskIds,
      constitutionalViolations: [],
      publishedEvents,
      processingMs: Date.now() - start,
    };
  }

  // ─── Oracle Staking Interface ─────────────────────────────────────────────

  /**
   * Register an oracle with stake — called when oracle joins the network.
   * In production this writes to the Cosmos chain via oracle keeper tx.
   */
  registerOracleStake(stake: OracleStakeRecord): void {
    if (stake.stakedAmountSAN < this.getMinimumStake(stake.oracleType)) {
      throw new Error(
        `Insufficient stake for ${stake.oracleType}: minimum ${this.getMinimumStake(stake.oracleType)} SAN`,
      );
    }
    this.oracleStakes.set(stake.oracleAddress, stake);
  }

  /**
   * Slash an oracle for false attestation.
   * Slash rate is proportional to fraud severity and stake size.
   */
  async slashOracle(
    oracleAddress: string,
    reason: string,
    fraudSeverity: number, // 0–1
  ): Promise<{ slashed: number; remaining: number }> {
    const stake = this.oracleStakes.get(oracleAddress);
    if (!stake) throw new Error(`Oracle not found: ${oracleAddress}`);

    const slashAmount = Math.floor(stake.stakedAmountSAN * fraudSeverity * 0.5);
    stake.stakedAmountSAN -= slashAmount;
    stake.reputation = Math.max(0, stake.reputation - fraudSeverity * 0.3);
    stake.slashHistory.push({ timestamp: Date.now(), reason, amount: slashAmount });
    this.oracleStakes.set(oracleAddress, stake);

    await this.eventBus.publish(EVENTS.ANOMALY_DETECTED, oracleAddress, 'oracle', {
      type: 'oracle_slashed',
      oracleAddress,
      slashAmount,
      reason,
      remainingStake: stake.stakedAmountSAN,
    });

    // Dispatch Auditor Agent to investigate
    await this.orchestrator.submit({
      role: 'fragility-analyst',
      instruction: `Oracle ${oracleAddress} slashed for: ${reason}. Audit all recent attestations from this oracle and check for coordinated fraud.`,
      context: { oracleAddress, slashAmount, reason, fraudSeverity },
      priority: 1,
      requiresHumanApproval: fraudSeverity > 0.7,
    });

    return { slashed: slashAmount, remaining: stake.stakedAmountSAN };
  }

  // ─── Covenant Integration ─────────────────────────────────────────────────

  /**
   * Check if a verified impact record triggers covenant execution.
   * Called after trust score crosses INSTITUTIONAL threshold.
   */
  async checkCovenant(
    covenant: Covenant,
    riskSnapshot: RiskSnapshot | null,
    reserve: ReserveAccount | null,
    lastExecutionTime?: string,
  ): Promise<{ triggered: boolean; reason: string }> {
    const check = evaluateCovenant(covenant, riskSnapshot, reserve, lastExecutionTime);

    if (!check.eligible) {
      return { triggered: false, reason: JSON.stringify(check.details) };
    }

    await this.eventBus.publish(EVENTS.COVENANT_EXECUTED, covenant.id, 'covenant', {
      covenantId: covenant.id,
      regionId: covenant.regionId,
      payoutAmountUsd: covenant.payoutAmountUsd,
      checkResult: check,
    });

    // Dispatch payment router agent
    await this.orchestrator.submit({
      role: 'payment-router',
      instruction: `Covenant ${covenant.id} triggered. Route payout of $${covenant.payoutAmountUsd} to region ${covenant.regionId}.`,
      context: { covenant, checkResult: check },
      priority: 1,
      requiresHumanApproval: covenant.payoutAmountUsd > 50_000,
    });

    return { triggered: true, reason: 'All covenant conditions met' };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private validateOracleAttestations(attestations: OracleAttestation[]): OracleAttestation[] {
    // IR-4: require at least 3 oracle types for INSTITUTIONAL grade
    // For MARKET grade: require 2; for SOVEREIGN: require all 3 with minimum reputations
    return attestations.filter(att => {
      const stake = this.oracleStakes.get(att.oracleDID);
      // New oracles (no stake record yet) allowed with reduced reputation weight
      if (!stake) return att.oracleReputation >= 0.5;
      return stake.stakedAmountSAN > 0 && stake.reputation >= 0.3;
    });
  }

  private getRequiredConfirmations(attestations: OracleAttestation[]): number {
    const types = new Set(attestations.map(a => a.oracleType)).size;
    if (types >= 3) return 3;
    if (types >= 2) return 2;
    return 1;
  }

  private checkConstitutionalConstraints(
    input: IngestEvidenceInput,
    trustScore: TrustScore,
  ): string[] {
    const violations: string[] = [];

    // IR-4: oracle type diversity for financial instruments
    const oracleTypes = new Set(input.attestations.map(a => a.oracleType));
    if (trustScore.bondEligible && oracleTypes.size < 3) {
      violations.push(
        `IR-4 violation: bond-eligible instrument requires 3 oracle types, got ${oracleTypes.size}`,
      );
    }

    // IR-1: no evidence with zero attestations
    if (input.attestations.length === 0) {
      violations.push('IR-1 violation: evidence submitted with zero oracle attestations');
    }

    return violations;
  }

  private getProviderReputation(providerId: string): number {
    return this.reputationCache.get(providerId) ?? 0.8; // new providers start at 0.8
  }

  private updateProviderReputation(providerId: string, trustScore: TrustScore): void {
    const current = this.getProviderReputation(providerId);
    // Exponential moving average — recent performance weighted at 20%
    const score = trustScore.score;
    const updated = current * 0.80 + score * 0.20;
    this.reputationCache.set(providerId, Math.min(Math.max(updated, 0), 1));
  }

  private updateOracleReputations(attestations: OracleAttestation[], trustScore: TrustScore): void {
    for (const att of attestations) {
      const stake = this.oracleStakes.get(att.oracleDID);
      if (!stake) continue;
      // Oracles that attested on high-trust records earn reputation
      const reputationGain = (trustScore.score - 0.5) * 0.05;
      stake.reputation = Math.min(1, stake.reputation + reputationGain);
      this.oracleStakes.set(att.oracleDID, stake);
    }
  }

  private async dispatchGradedAgentTasks(
    input: IngestEvidenceInput,
    trustScore: TrustScore,
    priceUSD: number,
  ): Promise<string[]> {
    const taskIds: string[] = [];

    if (trustScore.grade === 'INSUFFICIENT') {
      // Route to impact-verifier for manual re-review
      taskIds.push(await this.orchestrator.submit({
        role: 'impact-verifier',
        instruction: `Evidence ${input.evidenceId} scored INSUFFICIENT (${(trustScore.score * 100).toFixed(1)}%). Identify weakest component and recommend re-submission requirements.`,
        context: { evidenceId: input.evidenceId, trustScore, weakestComponent: trustScore.components },
        priority: 2,
      }));
    }

    if (trustScore.grade === 'SOVEREIGN') {
      // High-value instrument — dispatch scenario planner to model portfolio impact
      taskIds.push(await this.orchestrator.submit({
        role: 'scenario-planner',
        instruction: `SOVEREIGN-grade impact record verified for ${input.projectId} at $${priceUSD.toFixed(2)}. Model 3 portfolio allocation scenarios for institutional buyers.`,
        context: { projectId: input.projectId, trustScore, priceUSD, metricCode: input.metricCode },
        priority: 3,
      }));
    }

    if (trustScore.bondEligible) {
      // Bond-eligible — dispatch governance advisor to check issuance requirements
      taskIds.push(await this.orchestrator.submit({
        role: 'governance-advisor',
        instruction: `Evidence ${input.evidenceId} is bond-eligible (score ${(trustScore.score * 100).toFixed(1)}%). Verify ERB issuance requirements and draft proposal.`,
        context: { evidenceId: input.evidenceId, trustScore, priceUSD },
        priority: 2,
      }));
    }

    return taskIds;
  }

  private getMinimumStake(oracleType: OracleStakeRecord['oracleType']): number {
    // Minimum stake in SAN tokens by oracle type
    const minimums: Record<OracleStakeRecord['oracleType'], number> = {
      HUMAN: 1_000,
      API: 5_000,
      SENSOR: 2_000,
    };
    return minimums[oracleType];
  }

  // ─── Read interface for API routes ────────────────────────────────────────

  getOracleStake(address: string): OracleStakeRecord | undefined {
    return this.oracleStakes.get(address);
  }

  getAllOracleStakes(): OracleStakeRecord[] {
    return Array.from(this.oracleStakes.values());
  }

  getProviderReputationScore(providerId: string): number {
    return this.getProviderReputation(providerId);
  }

  /**
   * Compute trust score preview without side effects — for API endpoint /trust/preview
   */
  previewTrustScore(inputs: TrustInputs): TrustScore {
    return computeTrustScore(inputs);
  }

  /**
   * Constitution review for governance proposals — for API endpoint /governance/review
   */
  reviewGovernanceProposal(proposal: {
    type: string;
    description: string;
    affectedParameters: string[];
    proposerVotingWeight: number;
    targetAmendmentTier: AmendmentTier;
  }) {
    return reviewProposal(proposal);
  }
}

// ─── Singleton factory ────────────────────────────────────────────────────────

let _pipeline: TrustPipeline | null = null;

export function getTrustPipeline(
  eventBus: EventBus,
  orchestrator: AgentOrchestrator,
  blockchain: BlockchainConnector,
): TrustPipeline {
  if (!_pipeline) {
    _pipeline = new TrustPipeline(eventBus, orchestrator, blockchain);
  }
  return _pipeline;
}
