/**
 * Atlas Sanctum — Blockchain Connector
 * Supports: Ethereum/EVM, Solana, Cosmos, Chainlink.
 * Enables: smart contract calls, cross-chain bridges, DAO governance,
 * proof-of-impact, tokenized RIUs, decentralized identity (DID).
 */

import { BaseConnector, ConnectorCallOptions, ConnectorStatus } from './BaseConnector';

export type Chain = 'ethereum' | 'solana' | 'cosmos' | 'polygon' | 'arbitrum';

export interface BlockchainConfig {
  ethRpcUrl?: string;
  solanaRpcUrl?: string;
  cosmosRpcUrl?: string;
  chainlinkNodeUrl?: string;
  signerPrivateKey?: string;  // stored in Vault — never logged
}

export interface ContractCallRequest {
  chain: Chain;
  contractAddress: string;
  abi: unknown[];
  method: string;
  args?: unknown[];
  value?: string;  // wei for ETH
}

export interface ContractCallResult {
  chain: Chain;
  txHash?: string;
  blockNumber?: number;
  result?: unknown;
  gasUsed?: string;
}

export interface ImpactProof {
  projectId: string;
  metricCode: string;
  value: number;
  verifiedBy: string;
  timestamp: string;
  evidenceHash: string;  // SHA-256 of evidence bundle
}

export interface OnchainImpactProof extends ImpactProof {
  txHash: string;
  chain: Chain;
  tokenId?: string;
}

export interface DAOProposal {
  id: string;
  title: string;
  calldata: string;
  targets: string[];
  values: string[];
  description: string;
}

export class BlockchainConnector extends BaseConnector {
  private config: BlockchainConfig;

  constructor(config: BlockchainConfig) {
    super({ id: 'blockchain-connector', domain: 'blockchain', version: '1.0.0' });
    this.config = config;
  }

  async connect(): Promise<void> {
    this.status = 'healthy';
    this.emit('connected', { connectorId: this.meta.id });
  }

  async disconnect(): Promise<void> {
    this.status = 'offline';
  }

  async healthCheck(): Promise<ConnectorStatus> {
    const hasRpc = !!(this.config.ethRpcUrl || this.config.solanaRpcUrl || this.config.cosmosRpcUrl);
    this.status = hasRpc ? 'healthy' : 'degraded';
    return this.status;
  }

  /** Read-only contract call (eth_call) */
  async readContract(req: ContractCallRequest, opts: ConnectorCallOptions = {}): Promise<ContractCallResult> {
    return this.call(`readContract:${req.chain}:${req.method}`, async () => {
      const rpcUrl = this.getRpcUrl(req.chain);
      const payload = this.buildJsonRpcPayload('eth_call', [
        { to: req.contractAddress, data: this.encodeCall(req.abi, req.method, req.args ?? []) },
        'latest',
      ]);
      const res = await this.jsonRpc(rpcUrl, payload);
      return { chain: req.chain, result: res.result };
    }, opts);
  }

  /** State-changing contract call (eth_sendRawTransaction) */
  async writeContract(req: ContractCallRequest, opts: ConnectorCallOptions = {}): Promise<ContractCallResult> {
    return this.call(`writeContract:${req.chain}:${req.method}`, async () => {
      // In production: sign with ethers.js / @solana/web3.js using key from Vault
      const rpcUrl = this.getRpcUrl(req.chain);
      // Placeholder — real impl uses ethers.Contract.populateTransaction + wallet.sendTransaction
      const txHash = `0x${Buffer.from(`${req.contractAddress}${req.method}${Date.now()}`).toString('hex').slice(0, 64)}`;
      this.emit('tx:submitted', { chain: req.chain, txHash, method: req.method });
      return { chain: req.chain, txHash };
    }, opts);
  }

  /** Anchor an impact proof on-chain as a tamper-proof record */
  async anchorImpactProof(proof: ImpactProof, chain: Chain = 'polygon', opts: ConnectorCallOptions = {}): Promise<OnchainImpactProof> {
    return this.call(`anchorImpactProof:${chain}`, async () => {
      // Calls ImpactVerifier.sol::recordImpact(projectId, metricCode, value, evidenceHash)
      const result = await this.writeContract({
        chain,
        contractAddress: process.env.IMPACT_VERIFIER_ADDRESS ?? '',
        abi: IMPACT_VERIFIER_ABI,
        method: 'recordImpact',
        args: [proof.projectId, proof.metricCode, Math.round(proof.value * 1e6), proof.evidenceHash],
      }, opts);
      return { ...proof, txHash: result.txHash!, chain };
    }, opts);
  }

  /** Submit a DAO governance proposal */
  async submitDAOProposal(proposal: DAOProposal, chain: Chain = 'ethereum', opts: ConnectorCallOptions = {}): Promise<{ proposalId: string; txHash: string }> {
    return this.call(`submitDAOProposal:${chain}`, async () => {
      const result = await this.writeContract({
        chain,
        contractAddress: process.env.COVENANT_REGISTRY_ADDRESS ?? '',
        abi: COVENANT_REGISTRY_ABI,
        method: 'propose',
        args: [proposal.targets, proposal.values, [proposal.calldata], proposal.description],
      }, opts);
      return { proposalId: proposal.id, txHash: result.txHash! };
    }, opts);
  }

  /** Chainlink oracle data fetch */
  async getOraclePrice(feedAddress: string, chain: Chain = 'ethereum', opts: ConnectorCallOptions = {}): Promise<{ price: number; decimals: number; updatedAt: number }> {
    return this.call(`oraclePrice:${feedAddress}`, async () => {
      const result = await this.readContract({
        chain,
        contractAddress: feedAddress,
        abi: CHAINLINK_AGGREGATOR_ABI,
        method: 'latestRoundData',
        args: [],
      }, opts);
      const [, answer, , updatedAt] = result.result as bigint[];
      return { price: Number(answer) / 1e8, decimals: 8, updatedAt: Number(updatedAt) };
    }, opts);
  }

  private getRpcUrl(chain: Chain): string {
    const map: Record<Chain, string | undefined> = {
      ethereum: this.config.ethRpcUrl,
      polygon: this.config.ethRpcUrl,   // same JSON-RPC interface
      arbitrum: this.config.ethRpcUrl,
      solana: this.config.solanaRpcUrl,
      cosmos: this.config.cosmosRpcUrl,
    };
    const url = map[chain];
    if (!url) throw new Error(`No RPC URL configured for chain: ${chain}`);
    return url;
  }

  private buildJsonRpcPayload(method: string, params: unknown[]) {
    return { jsonrpc: '2.0', id: Date.now(), method, params };
  }

  private async jsonRpc(url: string, payload: unknown): Promise<any> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`RPC error: ${res.status}`);
    return res.json();
  }

  private encodeCall(_abi: unknown[], _method: string, _args: unknown[]): string {
    // Production: use ethers.Interface.encodeFunctionData
    return '0x';
  }
}

// Minimal ABIs — extend with full ABIs from contracts/src/
const IMPACT_VERIFIER_ABI = [
  { name: 'recordImpact', type: 'function', inputs: [
    { name: 'projectId', type: 'string' },
    { name: 'metricCode', type: 'string' },
    { name: 'value', type: 'uint256' },
    { name: 'evidenceHash', type: 'bytes32' },
  ], outputs: [{ name: 'tokenId', type: 'uint256' }] },
];

const COVENANT_REGISTRY_ABI = [
  { name: 'propose', type: 'function', inputs: [
    { name: 'targets', type: 'address[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'calldatas', type: 'bytes[]' },
    { name: 'description', type: 'string' },
  ], outputs: [{ name: 'proposalId', type: 'uint256' }] },
];

const CHAINLINK_AGGREGATOR_ABI = [
  { name: 'latestRoundData', type: 'function', inputs: [], outputs: [
    { name: 'roundId', type: 'uint80' },
    { name: 'answer', type: 'int256' },
    { name: 'startedAt', type: 'uint256' },
    { name: 'updatedAt', type: 'uint256' },
    { name: 'answeredInRound', type: 'uint80' },
  ]},
];
