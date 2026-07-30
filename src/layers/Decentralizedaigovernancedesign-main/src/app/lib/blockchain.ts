// Blockchain Integration Layer - Production Ready

import { Address, Transaction, BlockchainError } from '@/app/types';
import type { Hash, PublicClient, WalletClient } from 'viem';

// Contract ABIs (simplified - will be replaced with actual ABIs)
export const CONTRACT_ABIS = {
  SoulboundReputation: [
    {
      name: 'getReputation',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: 'reputation', type: 'tuple' }],
    },
    {
      name: 'updateReputation',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'account', type: 'address' }, { name: 'change', type: 'int256' }],
      outputs: [],
    },
  ] as const,
  
  OptimisticGovernance: [
    {
      name: 'submitProposal',
      type: 'function',
      stateMutability: 'payable',
      inputs: [
        { name: 'proposalData', type: 'bytes' },
        { name: 'timelockDuration', type: 'uint256' },
      ],
      outputs: [{ name: 'proposalId', type: 'bytes32' }],
    },
    {
      name: 'challengeProposal',
      type: 'function',
      stateMutability: 'payable',
      inputs: [
        { name: 'proposalId', type: 'bytes32' },
        { name: 'fraudProof', type: 'bytes' },
      ],
      outputs: [],
    },
    {
      name: 'executeProposal',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'proposalId', type: 'bytes32' }],
      outputs: [],
    },
  ] as const,
  
  ZKVoting: [
    {
      name: 'submitZKVote',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'proposalId', type: 'bytes32' },
        { name: 'proof', type: 'tuple' },
        { name: 'nullifier', type: 'bytes32' },
      ],
      outputs: [],
    },
    {
      name: 'verifyProof',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'proof', type: 'tuple' }],
      outputs: [{ name: 'valid', type: 'bool' }],
    },
  ] as const,
  
  RPGFFunding: [
    {
      name: 'createRound',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'budget', type: 'uint256' },
        { name: 'duration', type: 'uint256' },
      ],
      outputs: [{ name: 'roundId', type: 'uint256' }],
    },
    {
      name: 'submitProject',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'roundId', type: 'uint256' },
        { name: 'projectData', type: 'bytes' },
      ],
      outputs: [{ name: 'projectId', type: 'uint256' }],
    },
    {
      name: 'attestImpact',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'projectId', type: 'uint256' },
        { name: 'attestation', type: 'string' },
        { name: 'rating', type: 'uint8' },
      ],
      outputs: [],
    },
  ] as const,
  
  ImpactCertificates: [
    {
      name: 'createCertificate',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'proposalId', type: 'bytes32' },
        { name: 'predictedImpact', type: 'tuple' },
        { name: 'supply', type: 'uint256' },
      ],
      outputs: [{ name: 'certificateId', type: 'uint256' }],
    },
    {
      name: 'trade',
      type: 'function',
      stateMutability: 'payable',
      inputs: [
        { name: 'certificateId', type: 'uint256' },
        { name: 'amount', type: 'uint256' },
        { name: 'isBuy', type: 'bool' },
      ],
      outputs: [],
    },
  ] as const,
};

// Contract addresses (will be set from environment variables)
export const CONTRACT_ADDRESSES = {
  SoulboundReputation: process.env.NEXT_PUBLIC_SOULBOUND_ADDRESS || '0x0000000000000000000000000000000000000000',
  OptimisticGovernance: process.env.NEXT_PUBLIC_OPTIMISTIC_ADDRESS || '0x0000000000000000000000000000000000000000',
  ZKVoting: process.env.NEXT_PUBLIC_ZK_VOTING_ADDRESS || '0x0000000000000000000000000000000000000000',
  RPGFFunding: process.env.NEXT_PUBLIC_RPGF_ADDRESS || '0x0000000000000000000000000000000000000000',
  ImpactCertificates: process.env.NEXT_PUBLIC_IMPACT_CERTS_ADDRESS || '0x0000000000000000000000000000000000000000',
  RiskMonitor: process.env.NEXT_PUBLIC_RISK_MONITOR_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Blockchain Service Class
export class BlockchainService {
  private publicClient: PublicClient | null = null;
  private walletClient: WalletClient | null = null;

  constructor(publicClient?: PublicClient, walletClient?: WalletClient) {
    this.publicClient = publicClient || null;
    this.walletClient = walletClient || null;
  }

  setClients(publicClient: PublicClient, walletClient?: WalletClient) {
    this.publicClient = publicClient;
    if (walletClient) {
      this.walletClient = walletClient;
    }
  }

  // Utility: Wait for transaction confirmation
  async waitForTransaction(hash: Hash, confirmations: number = 1): Promise<Transaction> {
    if (!this.publicClient) {
      throw new BlockchainError('NO_CLIENT', 'Public client not initialized');
    }

    try {
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
        confirmations,
      });

      return {
        hash: receipt.transactionHash,
        from: { value: receipt.from, isValid: true },
        to: { value: receipt.to || '0x', isValid: true },
        value: 0n, // Would get from transaction
        timestamp: Date.now(),
        status: receipt.status === 'success' ? 'confirmed' : 'failed',
        blockNumber: Number(receipt.blockNumber),
      };
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Transaction failed: ${error.message}`, hash);
    }
  }

  // Soulbound Reputation Methods
  async getReputation(address: string): Promise<any> {
    if (!this.publicClient) {
      throw new BlockchainError('NO_CLIENT', 'Public client not initialized');
    }

    try {
      const data = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.SoulboundReputation as `0x${string}`,
        abi: CONTRACT_ABIS.SoulboundReputation,
        functionName: 'getReputation',
        args: [address as `0x${string}`],
      });

      return data;
    } catch (error: any) {
      throw new BlockchainError('READ_FAILED', `Failed to read reputation: ${error.message}`);
    }
  }

  // Optimistic Governance Methods
  async submitOptimisticProposal(
    proposalData: string,
    timelockDuration: bigint,
    bond: bigint
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.OptimisticGovernance as `0x${string}`,
        abi: CONTRACT_ABIS.OptimisticGovernance,
        functionName: 'submitProposal',
        args: [proposalData as `0x${string}`, timelockDuration],
        value: bond,
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to submit proposal: ${error.message}`);
    }
  }

  async challengeProposal(
    proposalId: string,
    fraudProof: string,
    bond: bigint
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.OptimisticGovernance as `0x${string}`,
        abi: CONTRACT_ABIS.OptimisticGovernance,
        functionName: 'challengeProposal',
        args: [proposalId as `0x${string}`, fraudProof as `0x${string}`],
        value: bond,
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to challenge proposal: ${error.message}`);
    }
  }

  // ZK Voting Methods
  async submitZKVote(
    proposalId: string,
    proof: any,
    nullifier: string
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.ZKVoting as `0x${string}`,
        abi: CONTRACT_ABIS.ZKVoting,
        functionName: 'submitZKVote',
        args: [proposalId as `0x${string}`, proof, nullifier as `0x${string}`],
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to submit ZK vote: ${error.message}`);
    }
  }

  // RPGF Methods
  async createRPGFRound(budget: bigint, duration: bigint): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.RPGFFunding as `0x${string}`,
        abi: CONTRACT_ABIS.RPGFFunding,
        functionName: 'createRound',
        args: [budget, duration],
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to create RPGF round: ${error.message}`);
    }
  }

  async submitRPGFProject(roundId: bigint, projectData: string): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.RPGFFunding as `0x${string}`,
        abi: CONTRACT_ABIS.RPGFFunding,
        functionName: 'submitProject',
        args: [roundId, projectData as `0x${string}`],
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to submit RPGF project: ${error.message}`);
    }
  }

  async attestImpact(
    projectId: bigint,
    attestation: string,
    rating: number
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.RPGFFunding as `0x${string}`,
        abi: CONTRACT_ABIS.RPGFFunding,
        functionName: 'attestImpact',
        args: [projectId, attestation, rating],
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to attest impact: ${error.message}`);
    }
  }

  // Impact Certificates Methods
  async createImpactCertificate(
    proposalId: string,
    predictedImpact: any,
    supply: bigint
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.ImpactCertificates as `0x${string}`,
        abi: CONTRACT_ABIS.ImpactCertificates,
        functionName: 'createCertificate',
        args: [proposalId as `0x${string}`, predictedImpact, supply],
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to create certificate: ${error.message}`);
    }
  }

  async tradeCertificate(
    certificateId: bigint,
    amount: bigint,
    isBuy: boolean,
    value: bigint
  ): Promise<Hash> {
    if (!this.walletClient) {
      throw new BlockchainError('NO_WALLET', 'Wallet client not initialized');
    }

    try {
      const hash = await this.walletClient.writeContract({
        address: CONTRACT_ADDRESSES.ImpactCertificates as `0x${string}`,
        abi: CONTRACT_ABIS.ImpactCertificates,
        functionName: 'trade',
        args: [certificateId, amount, isBuy],
        value: isBuy ? value : 0n,
      });

      return hash;
    } catch (error: any) {
      throw new BlockchainError('TX_FAILED', `Failed to trade certificate: ${error.message}`);
    }
  }

  // Utility Methods
  async estimateGas(transaction: any): Promise<bigint> {
    if (!this.publicClient) {
      throw new BlockchainError('NO_CLIENT', 'Public client not initialized');
    }

    try {
      const gas = await this.publicClient.estimateGas(transaction);
      return gas;
    } catch (error: any) {
      throw new BlockchainError('GAS_ESTIMATION_FAILED', `Gas estimation failed: ${error.message}`);
    }
  }

  async getCurrentBlock(): Promise<bigint> {
    if (!this.publicClient) {
      throw new BlockchainError('NO_CLIENT', 'Public client not initialized');
    }

    try {
      const blockNumber = await this.publicClient.getBlockNumber();
      return blockNumber;
    } catch (error: any) {
      throw new BlockchainError('BLOCK_FETCH_FAILED', `Failed to fetch block: ${error.message}`);
    }
  }

  async getBalance(address: string): Promise<bigint> {
    if (!this.publicClient) {
      throw new BlockchainError('NO_CLIENT', 'Public client not initialized');
    }

    try {
      const balance = await this.publicClient.getBalance({
        address: address as `0x${string}`,
      });
      return balance;
    } catch (error: any) {
      throw new BlockchainError('BALANCE_FETCH_FAILED', `Failed to fetch balance: ${error.message}`);
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainService();

// Helper functions
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parseEther(value: string): bigint {
  try {
    const parts = value.split('.');
    const whole = BigInt(parts[0] || 0);
    const decimal = parts[1] || '';
    const decimals = decimal.padEnd(18, '0').slice(0, 18);
    return whole * 10n ** 18n + BigInt(decimals);
  } catch {
    return 0n;
  }
}

export function formatEther(value: bigint): string {
  const str = value.toString().padStart(19, '0');
  const whole = str.slice(0, -18) || '0';
  const decimal = str.slice(-18).replace(/0+$/, '');
  return decimal ? `${whole}.${decimal}` : whole;
}
