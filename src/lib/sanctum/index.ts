// Config
export { SANCTUM_CONFIG } from './config';

// HTTP primitives
export { sanctumFetch, tokenStore, SanctumError } from './http';

// Auth
export { sanctumAuth } from './auth';
export type { AuthSession } from './auth';

// REST API clients
export {
  authApi,
  marketplaceApi,
  projectsApi,
  measurementsApi,
  paymentsApi,
} from './api-client';
export type { AuthUser, TokenPair, APIResponse, Paginated } from './api-client';

// AI clients
export {
  aiSystemApi,
  aiEcologyApi,
  aiCarbonApi,
  aiGovernanceApi,
  aiPolicyApi,
  aiTrustApi,
  aiForecastApi,
  aiOptimizeApi,
  aiAgentsApi,
  aiKnowledgeApi,
} from './ai-client';

// Chain clients
export {
  chainStatusApi,
  chainIdentityApi,
  chainImpactApi,
  chainOracleApi,
  chainRegenApi,
  chainBankApi,
  chainTxApi,
} from './chain-client';
export type { ChainUser, ImpactRecord, ChainOracle, RegenProject, TxBroadcastResult } from './chain-client';

// React Query hooks — all ecosystems
export {
  qk,
  useCurrentUser,
  useRIUMarket,
  useRIUListings,
  useBonds,
  useTradingVolume,
  useTransactions,
  useProjects,
  useProject,
  useProjectStats,
  useProjectMeasurements,
  useAnomalies,
  useMeasurementTrends,
  usePurchaseRIU,
  useCreateProject,
  useApproveProject,
  useRecordMeasurement,
  useAIHealth,
  usePlanetaryStatus,
  useEcologyAlerts,
  useAgentStatus,
  useCarbonCredits,
  useKnowledgeSearch,
  useCouncilMembers,
  useProposalTally,
  useAuditTrail,
  useAssessEcology,
  useValidateCarbon,
  useDraftPolicy,
  usePlanRestoration,
  useClimateforecast,
  useGenerateZKProof,
  useVoteProposal,
  useChainHealth,
  useLatestBlock,
  useChainUser,
  useUsersByRole,
  useImpactRecord,
  useImpactByStatus,
  useActiveOracles,
  useRegenProject,
  useTokenBalances,
  useTokenSupply,
  useBroadcastTx,
} from './hooks';

// Realtime
export { realtimeBus, useRealtimeSync, useOnEvent } from './realtime';
export type { RealtimeEvent } from './realtime';
