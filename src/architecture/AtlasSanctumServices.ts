/**
 * Atlas Sanctum Service Layer
 * Repository pattern and service interfaces for external integrations
 * 
 * This module provides abstractions over external services (Supabase, Blockchain, Auth)
 * to enable loose coupling, testability, and resilience.
 */

import {
  AtlasError,
  Result,
  ok,
  fail,
  GeoLocation,
  RegenerativeImpact,
  RegenerativeIntervention,
  User,
  RegenerativeAction,
  CivilizationalResponse,
} from './AtlasSanctumTypes';

// ============================================================================
// REPOSITORY PATTERN FOR SUPABASE
// ============================================================================

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly project_type: string;
  readonly status: 'active' | 'pending' | 'completed' | 'suspended';
  readonly price_per_credit: number;
  readonly available_credits: number;
  readonly total_credits: number;
  readonly carbon_impact: number;
  readonly biodiversity_impact: number;
  readonly social_impact: number;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface Transaction {
  readonly id: string;
  readonly user_id: string;
  readonly project_id: string;
  readonly amount: number;
  readonly type: 'purchase' | 'retirement' | 'transfer';
  readonly status: 'pending' | 'completed' | 'failed';
  readonly transaction_hash?: string;
  readonly created_at: string;
}

export interface UserProfile {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'producer' | 'investor' | 'verifier' | 'admin';
  readonly wallet_address?: string;
  readonly impact_score: number;
  readonly created_at: string;
}

// Generic repository interface
export interface IRepository<T, TId = string> {
  getById(id: TId): Promise<Result<T, AtlasError>>;
  getAll(): Promise<Result<readonly T[], AtlasError>>;
  create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<Result<T, AtlasError>>;
  update(id: TId, data: Partial<T>): Promise<Result<T, AtlasError>>;
  delete(id: TId): Promise<Result<boolean, AtlasError>>;
}

// Repository error codes
export const RepositoryErrorCodes = {
  NOT_FOUND: 'REPO_NOT_FOUND',
  CREATE_FAILED: 'REPO_CREATE_FAILED',
  UPDATE_FAILED: 'REPO_UPDATE_FAILED',
  DELETE_FAILED: 'REPO_DELETE_FAILED',
  CONNECTION_FAILED: 'REPO_CONNECTION_FAILED',
} as const;

// ============================================================================
// BLOCKCHAIN SERVICE INTERFACE
// ============================================================================

export interface BlockchainProject {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly contractAddress: string;
  readonly network: 'Ethereum' | 'Polygon' | 'Solana' | 'Arbitrum';
  readonly status: 'verified' | 'pending' | 'unverified';
  readonly verificationDate?: string;
  readonly impactScore: number;
  readonly carbonCredits: number;
  readonly transactions: number;
  readonly metadata: Record<string, string>;
}

export interface ImpactNFT {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly projectId: string;
  readonly impactMetrics: {
    readonly carbonOffset: number;
    readonly treesPlanted: number;
    readonly waterSaved: number;
    readonly biodiversityProtected: number;
    readonly communitiesSupported: number;
  };
  readonly mintedAt: string;
  readonly owner: string;
  readonly rarity: 'common' | 'rare' | 'epic' | 'legendary';
  readonly transactionHash: string;
}

export interface GovernanceProposal {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly proposer: string;
  readonly status: 'active' | 'passed' | 'rejected' | 'pending';
  readonly votes: { for: number; against: number; abstain: number };
  readonly threshold: number;
  readonly deadline: string;
  readonly category: 'funding' | 'policy' | 'election' | 'partnership';
}

export interface IBlockchainService {
  // Project verification
  verifyProject(projectId: string): Promise<Result<BlockchainProject, AtlasError>>;
  getVerifiedProjects(): Promise<Result<readonly BlockchainProject[], AtlasError>>;
  getProjectById(projectId: string): Promise<Result<BlockchainProject, AtlasError>>;
  
  // NFT operations
  mintImpactNFT(projectId: string, impact: RegenerativeImpact): Promise<Result<ImpactNFT, AtlasError>>;
  getImpactNFTsByOwner(owner: string): Promise<Result<readonly ImpactNFT[], AtlasError>>;
  transferNFT(nftId: string, to: string): Promise<Result<string, AtlasError>>;
  
  // Governance
  createProposal(proposal: Omit<GovernanceProposal, 'id' | 'status'>): Promise<Result<GovernanceProposal, AtlasError>>;
  voteOnProposal(proposalId: string, vote: 'for' | 'against' | 'abstain', votingPower: number): Promise<Result<boolean, AtlasError>>;
  getProposals(): Promise<Result<readonly GovernanceProposal[], AtlasError>>;
  
  // Transaction tracking
  getTransactionStatus(hash: string): Promise<Result<{ status: 'pending' | 'confirmed' | 'failed' }, AtlasError>>;
  trackTransaction(hash: string): Promise<Result<string, AtlasError>>;
}

// Blockchain error codes
export const BlockchainErrorCodes = {
  CONTRACT_NOT_DEPLOYED: 'BLOCKCHAIN_CONTRACT_NOT_DEPLOYED',
  NETWORK_ERROR: 'BLOCKCHAIN_NETWORK_ERROR',
  TRANSACTION_FAILED: 'BLOCKCHAIN_TRANSACTION_FAILED',
  INSUFFICIENT_GAS: 'BLOCKCHAIN_INSUFFICIENT_GAS',
  WALLET_NOT_CONNECTED: 'BLOCKCHAIN_WALLET_NOT_CONNECTED',
  UNAUTHORIZED: 'BLOCKCHAIN_UNAUTHORIZED',
} as const;

// ============================================================================
// AUTH SERVICE INTERFACE
// ============================================================================

export type UserRole = 'producer' | 'investor' | 'verifier' | 'admin';

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly walletAddress?: string;
  readonly impactScore: number;
  readonly consentedAt?: string;
  readonly profileImage?: string;
}

export interface EthicalConsent {
  readonly dataPrivacy: boolean;
  readonly impactSharing: boolean;
  readonly communityGuidelines: boolean;
  readonly regenerativePrinciples: boolean;
  readonly timestamp: string;
}

export interface AuthenticationData {
  readonly method: 'email' | 'wallet' | 'social';
  readonly email?: string;
  readonly password?: string;
  readonly walletAddress?: string;
  readonly socialProvider?: 'google' | 'twitter' | 'github';
}

export interface IAuthService {
  // Authentication
  authenticate(data: AuthenticationData): Promise<Result<AuthUser, AtlasError>>;
  signOut(): Promise<Result<void, AtlasError>>;
  getCurrentUser(): Promise<Result<AuthUser | null, AtlasError>>;
  isAuthenticated(): Promise<boolean>;
  
  // User management
  updateProfile(userId: string, data: Partial<AuthUser>): Promise<Result<AuthUser, AtlasError>>;
  getUserById(userId: string): Promise<Result<AuthUser, AtlasError>>;
  
  // Consent management
  recordConsent(userId: string, consent: EthicalConsent): Promise<Result<boolean, AtlasError>>;
  hasConsented(userId: string): Promise<Result<boolean, AtlasError>>;
  getConsent(userId: string): Promise<Result<EthicalConsent, AtlasError>>;
  
  // Role-based access
  assignRole(userId: string, role: UserRole): Promise<Result<AuthUser, AtlasError>>;
  hasPermission(userId: string, permission: string): Promise<Result<boolean, AtlasError>>;
  
  // Wallet connection
  connectWallet(): Promise<Result<string, AtlasError>>;
  disconnectWallet(): Promise<Result<void, AtlasError>>;
  getConnectedWallet(): Promise<Result<string | null, AtlasError>>;
}

// Auth error codes
export const AuthErrorCodes = {
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  ALREADY_AUTHENTICATED: 'AUTH_ALREADY_AUTHENTICATED',
  NOT_AUTHENTICATED: 'AUTH_NOT_AUTHENTICATED',
  CONSENT_REQUIRED: 'AUTH_CONSENT_REQUIRED',
  CONSENT_EXPIRED: 'AUTH_CONSENT_EXPIRED',
  WALLET_CONNECTION_FAILED: 'AUTH_WALLET_CONNECTION_FAILED',
  SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
} as const;

// ============================================================================
// IMPACT ORACLE SERVICE
// ============================================================================

export interface OracleDataPoint {
  readonly location: GeoLocation;
  readonly type: 'ndvi' | 'soil_moisture' | 'carbon_stock' | 'species_count' | 'air_quality';
  readonly value: number;
  readonly unit: string;
  readonly confidence: number;
  readonly timestamp: number;
  readonly source: string;
}

export interface IImpactOracleService {
  // Data ingestion
  ingestSatelliteData(location: GeoLocation): Promise<Result<readonly OracleDataPoint[], AtlasError>>;
  ingestSensorData(sensorId: string): Promise<Result<readonly OracleDataPoint[], AtlasError>>;
  
  // Impact calculation
  calculateImpact(interventions: readonly RegenerativeIntervention[]): Promise<Result<RegenerativeImpact, AtlasError>>;
  verifyImpactClaim(claimId: string, evidence: readonly OracleDataPoint[]): Promise<Result<{ verified: boolean; confidence: number }, AtlasError>>;
  
  // Historical data
  getHistoricalImpact(location: GeoLocation, startDate: number, endDate: number): Promise<Result<readonly RegenerativeImpact[], AtlasError>>;
  getCurrentConditions(location: GeoLocation): Promise<Result<RegenerativeImpact, AtlasError>>;
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

export interface ServiceConfig {
  readonly supabaseUrl: string;
  readonly supabaseKey: string;
  readonly blockchainNetwork: string;
  readonly rpcUrl: string;
  readonly contractAddresses: Record<string, string>;
}

export interface IServiceContainer {
  readonly projects: IRepository<Project, string>;
  readonly transactions: IRepository<Transaction, string>;
  readonly users: IRepository<UserProfile, string>;
  readonly blockchain: IBlockchainService;
  readonly auth: IAuthService;
  readonly impactOracle: IImpactOracleService;
  getService<K extends keyof IServiceContainer>(key: K): IServiceContainer[K];
}

// ============================================================================
// ABSTRACT BASE IMPLEMENTATIONS (STUBS)
// ============================================================================

export abstract class AbstractRepository<T, TId> implements IRepository<T, TId> {
  protected abstract getTableName(): string;
  
  async getById(id: TId): Promise<Result<T, AtlasError>> {
    return fail(new AtlasError(
      'Repository method not implemented',
      'NOT_IMPLEMENTED',
      'internal',
      false
    ));
  }
  
  async getAll(): Promise<Result<readonly T[], AtlasError>> {
    return fail(new AtlasError(
      'Repository method not implemented',
      'NOT_IMPLEMENTED',
      'internal',
      false
    ));
  }
  
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<Result<T, AtlasError>> {
    return fail(new AtlasError(
      'Repository method not implemented',
      'NOT_IMPLEMENTED',
      'internal',
      false
    ));
  }
  
  async update(id: TId, data: Partial<T>): Promise<Result<T, AtlasError>> {
    return fail(new AtlasError(
      'Repository method not implemented',
      'NOT_IMPLEMENTED',
      'internal',
      false
    ));
  }
  
  async delete(id: TId): Promise<Result<boolean, AtlasError>> {
    return fail(new AtlasError(
      'Repository method not implemented',
      'NOT_IMPLEMENTED',
      'internal',
      false
    ));
  }
}

export abstract class AbstractBlockchainService implements IBlockchainService {
  async verifyProject(projectId: string): Promise<Result<BlockchainProject, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async getVerifiedProjects(): Promise<Result<readonly BlockchainProject[], AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async getProjectById(projectId: string): Promise<Result<BlockchainProject, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async mintImpactNFT(projectId: string, impact: RegenerativeImpact): Promise<Result<ImpactNFT, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async getImpactNFTsByOwner(owner: string): Promise<Result<readonly ImpactNFT[], AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async transferNFT(nftId: string, to: string): Promise<Result<string, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async createProposal(proposal: Omit<GovernanceProposal, 'id' | 'status'>): Promise<Result<GovernanceProposal, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async voteOnProposal(proposalId: string, vote: 'for' | 'against' | 'abstain', votingPower: number): Promise<Result<boolean, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async getProposals(): Promise<Result<readonly GovernanceProposal[], AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async getTransactionStatus(hash: string): Promise<Result<{ status: 'pending' | 'confirmed' | 'failed' }, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
  
  async trackTransaction(hash: string): Promise<Result<string, AtlasError>> {
    return fail(new AtlasError(
      'Blockchain service not configured',
      BlockchainErrorCodes.NETWORK_ERROR,
      'external_dependency',
      true
    ));
  }
}

export abstract class AbstractAuthService implements IAuthService {
  async authenticate(data: AuthenticationData): Promise<Result<AuthUser, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async signOut(): Promise<Result<void, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async getCurrentUser(): Promise<Result<AuthUser | null, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async isAuthenticated(): Promise<boolean> {
    return false;
  }
  
  async updateProfile(userId: string, data: Partial<AuthUser>): Promise<Result<AuthUser, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async getUserById(userId: string): Promise<Result<AuthUser, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async recordConsent(userId: string, consent: EthicalConsent): Promise<Result<boolean, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async hasConsented(userId: string): Promise<Result<boolean, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async getConsent(userId: string): Promise<Result<EthicalConsent, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async assignRole(userId: string, role: UserRole): Promise<Result<AuthUser, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async hasPermission(userId: string, permission: string): Promise<Result<boolean, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.NOT_AUTHENTICATED,
      'authentication',
      true
    ));
  }
  
  async connectWallet(): Promise<Result<string, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.WALLET_CONNECTION_FAILED,
      'authentication',
      true
    ));
  }
  
  async disconnectWallet(): Promise<Result<void, AtlasError>> {
    return fail(new AtlasError(
      'Auth service not configured',
      AuthErrorCodes.WALLET_CONNECTION_FAILED,
      'authentication',
      true
    ));
  }
  
  async getConnectedWallet(): Promise<Result<string | null, AtlasError>> {
    return ok(null);
  }
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export function handleServiceError(error: unknown, context: string): AtlasError {
  if (error instanceof AtlasError) {
    return error;
  }
  
  const message = error instanceof Error ? error.message : 'Unknown error';
  
  return new AtlasError(
    `${context}: ${message}`,
    'SERVICE_ERROR',
    'external_dependency',
    true,
    { originalError: String(error) }
  );
}

export function isServiceAvailable(error: AtlasError): boolean {
  return error.category === 'external_dependency' && error.recoverable;
}
