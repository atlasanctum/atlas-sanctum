/**
 * BlockchainContext — injects contract addresses from env vars and exposes
 * the useBlockchain hook to the entire React tree.
 *
 * Env vars (set in .env):
 *   VITE_CONTRACT_RIU_TOKEN
 *   VITE_CONTRACT_IMPACT_NFT
 *   VITE_CONTRACT_MARKETPLACE
 *   VITE_CONTRACT_PAYMENT_TOKEN
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useBlockchain, type BlockchainState, type BlockchainActions, type ContractAddresses } from '@/hooks/useBlockchain';

type BlockchainContextValue = BlockchainState & BlockchainActions;

const BlockchainContext = createContext<BlockchainContextValue | null>(null);

const CONTRACT_ADDRESSES: Partial<ContractAddresses> = {
  riuToken:     import.meta.env.VITE_CONTRACT_RIU_TOKEN     || undefined,
  impactNFT:    import.meta.env.VITE_CONTRACT_IMPACT_NFT    || undefined,
  marketplace:  import.meta.env.VITE_CONTRACT_MARKETPLACE   || undefined,
  paymentToken: import.meta.env.VITE_CONTRACT_PAYMENT_TOKEN || undefined,
};

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const blockchain = useBlockchain(CONTRACT_ADDRESSES);
  return (
    <BlockchainContext.Provider value={blockchain}>
      {children}
    </BlockchainContext.Provider>
  );
}

export function useBlockchainContext(): BlockchainContextValue {
  const ctx = useContext(BlockchainContext);
  if (!ctx) throw new Error('useBlockchainContext must be used inside <BlockchainProvider>');
  return ctx;
}
