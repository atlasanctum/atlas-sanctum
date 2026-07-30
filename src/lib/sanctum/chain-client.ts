/**
 * chain-client.ts
 *
 * Cosmos SDK (sanctumd) client for the Atlas Sanctum L1 blockchain.
 * Bridges the React frontend to the chain's REST API (LCD) and RPC.
 *
 * Covers all six x/ modules:
 *   identity · impact · oracle · rewards · regeneration · governance
 */

import { sanctumFetch } from './http';
import { SANCTUM_CONFIG } from './config';

const LCD  = SANCTUM_CONFIG.chain.rest;   // e.g. http://localhost:1317
const RPC  = SANCTUM_CONFIG.chain.rpc;    // e.g. http://localhost:26657

// ─── Shared chain types ───────────────────────────────────────────────────────

export interface ChainUser {
  address: string;
  role: string;
  reputationScore: string;
  metadata: string;
  registeredAt: number;
}

export interface ImpactRecord {
  id: string;
  provider: string;
  impactType: string;
  metric: string;
  value: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  oracleConfirmations: number;
  confirmingOracles: string[];
  timestamp: number;
}

export interface ChainOracle {
  address: string;
  oracleType: string;
  reputation: string;
  active: boolean;
  registeredAt: number;
}

export interface RegenProject {
  id: string;
  owner: string;
  name: string;
  location: string;
  carbonTonnes: string;
  biodiversityScore: string;
  treesPlanted: number;
  status: string;
  createdAt: number;
  updatedAt: number;
}

export interface TxBroadcastResult {
  txHash: string;
  code: number;
  rawLog: string;
  height: number;
}

// ─── Node status ──────────────────────────────────────────────────────────────

export const chainStatusApi = {
  health: () => sanctumFetch<{ status: string; block_height: number }>(`${RPC}/health`),
  latestBlock: () => sanctumFetch<{ block: { header: { height: string; time: string } } }>(
    `${LCD}/cosmos/base/tendermint/v1beta1/blocks/latest`,
  ),
  nodeInfo: () => sanctumFetch<unknown>(`${LCD}/cosmos/base/tendermint/v1beta1/node_info`),
};

// ─── Identity module ──────────────────────────────────────────────────────────

export const chainIdentityApi = {
  getUser: (address: string) =>
    sanctumFetch<{ user: ChainUser }>(`${LCD}/sanctum/identity/v1/user/${address}`),

  getUsersByRole: (role: string) =>
    sanctumFetch<{ users: ChainUser[] }>(`${LCD}/sanctum/identity/v1/users?role=${role}`),
};

// ─── Impact module ────────────────────────────────────────────────────────────

export const chainImpactApi = {
  getRecord: (id: string) =>
    sanctumFetch<{ record: ImpactRecord }>(`${LCD}/sanctum/impact/v1/record/${id}`),

  byStatus: (status: 'PENDING' | 'VERIFIED' | 'REJECTED') =>
    sanctumFetch<{ records: ImpactRecord[] }>(`${LCD}/sanctum/impact/v1/records?status=${status}`),

  byProvider: (provider: string) =>
    sanctumFetch<{ records: ImpactRecord[] }>(`${LCD}/sanctum/impact/v1/records?provider=${provider}`),
};

// ─── Oracle module ────────────────────────────────────────────────────────────

export const chainOracleApi = {
  getOracle: (address: string) =>
    sanctumFetch<{ oracle: ChainOracle }>(`${LCD}/sanctum/oracle/v1/oracle/${address}`),

  activeOracles: () =>
    sanctumFetch<{ oracles: ChainOracle[] }>(`${LCD}/sanctum/oracle/v1/oracles/active`),
};

// ─── Regeneration module ──────────────────────────────────────────────────────

export const chainRegenApi = {
  getProject: (id: string) =>
    sanctumFetch<{ project: RegenProject }>(`${LCD}/sanctum/regeneration/v1/project/${id}`),

  byOwner: (owner: string) =>
    sanctumFetch<{ projects: RegenProject[] }>(`${LCD}/sanctum/regeneration/v1/projects?owner=${owner}`),
};

// ─── Bank / Token balances ────────────────────────────────────────────────────

export const chainBankApi = {
  balances: (address: string) =>
    sanctumFetch<{ balances: { denom: string; amount: string }[] }>(
      `${LCD}/cosmos/bank/v1beta1/balances/${address}`,
    ),

  supplyOf: (denom: string) =>
    sanctumFetch<{ amount: { denom: string; amount: string } }>(
      `${LCD}/cosmos/bank/v1beta1/supply/by_denom?denom=${denom}`,
    ),
};

// ─── Transaction broadcast ────────────────────────────────────────────────────

export const chainTxApi = {
  /**
   * Broadcast a signed tx JSON to the chain.
   * The caller is responsible for signing with a wallet (Keplr / Leap / cosmjs).
   */
  broadcast: (signedTxBytes: string) =>
    sanctumFetch<TxBroadcastResult>(`${LCD}/cosmos/tx/v1beta1/txs`, {
      method: 'POST',
      body: JSON.stringify({
        tx_bytes: signedTxBytes,
        mode: 'BROADCAST_MODE_SYNC',
      }),
    }),

  getByHash: (txHash: string) =>
    sanctumFetch<unknown>(`${LCD}/cosmos/tx/v1beta1/txs/${txHash}`),
};
