// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Minimal ABIs — only the functions the frontend needs
const RIU_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function retire(uint256 amount, bytes32 projectId, string reason)',
  'event RIURetired(address indexed from, uint256 amount, bytes32 projectId, string reason)',
];

const MARKETPLACE_ABI = [
  'function list(uint256 riuAmount, uint256 pricePerRIU, bytes32 projectId) returns (uint256)',
  'function purchase(uint256 listingId, uint256 riuAmount)',
  'function cancelListing(uint256 listingId)',
  'function listings(uint256) view returns (address seller, uint256 riuAmount, uint256 pricePerRIU, bytes32 projectId, bool active)',
  'event Listed(uint256 indexed listingId, address indexed seller, uint256 riuAmount, uint256 pricePerRIU, bytes32 projectId)',
  'event Purchased(uint256 indexed listingId, address indexed buyer, uint256 riuAmount, uint256 totalCost)',
];

const NFT_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function totalMinted() view returns (uint256)',
  'function getImpactData(uint256 tokenId) view returns (tuple(bytes32 projectId, uint256 carbonOffset, uint256 treesPlanted, uint256 waterSavedLiters, uint256 speciesProtected, uint8 rarity, uint256 mintedAt, address verifier))',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

export interface ContractAddresses {
  riuToken: string;
  impactNFT: string;
  marketplace: string;
  paymentToken: string;
}

export interface BlockchainState {
  account: string | null;
  chainId: number | null;
  riuBalance: string;
  nftBalance: string;
  isConnecting: boolean;
  error: string | null;
}

export interface BlockchainActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  retireRIUs: (amount: string, projectId: string, reason: string) => Promise<string>;
  listRIUs: (amount: string, pricePerRIU: string, projectId: string) => Promise<number>;
  purchaseRIUs: (listingId: number, amount: string) => Promise<void>;
  getListing: (listingId: number) => Promise<{
    seller: string; riuAmount: string; pricePerRIU: string; projectId: string; active: boolean;
  }>;
  refreshBalances: () => Promise<void>;
}

const SUPPORTED_CHAIN_IDS = [1, 137, 11155111, 31337]; // mainnet, polygon, sepolia, hardhat

export function useBlockchain(addresses: Partial<ContractAddresses>): BlockchainState & BlockchainActions {
  const [state, setState] = useState<BlockchainState>({
    account: null,
    chainId: null,
    riuBalance: '0',
    nftBalance: '0',
    isConnecting: false,
    error: null,
  });

  const getProvider = useCallback(() => {
    if (typeof window === 'undefined' || !window.ethereum) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, []);

  const refreshBalances = useCallback(async () => {
    const provider = getProvider();
    if (!provider || !state.account) return;

    try {
      const [riuBal, nftBal] = await Promise.all([
        addresses.riuToken
          ? new ethers.Contract(addresses.riuToken, RIU_ABI, provider).balanceOf(state.account)
          : Promise.resolve(0n),
        addresses.impactNFT
          ? new ethers.Contract(addresses.impactNFT, NFT_ABI, provider).balanceOf(state.account)
          : Promise.resolve(0n),
      ]);

      setState(prev => ({
        ...prev,
        riuBalance: ethers.formatEther(riuBal),
        nftBalance: nftBal.toString(),
      }));
    } catch (err) {
      // Silently fail balance refresh — non-critical
    }
  }, [state.account, addresses, getProvider]);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setState(prev => ({ ...prev, error: 'No Web3 wallet detected. Install MetaMask.' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
        setState(prev => ({
          ...prev,
          isConnecting: false,
          error: `Unsupported network (chainId: ${chainId}). Switch to Ethereum, Polygon, or Sepolia.`,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        account: accounts[0],
        chainId,
        isConnecting: false,
        error: null,
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isConnecting: false, error: err.message || 'Connection failed' }));
    }
  }, [getProvider]);

  const disconnect = useCallback(() => {
    setState({ account: null, chainId: null, riuBalance: '0', nftBalance: '0', isConnecting: false, error: null });
  }, []);

  const retireRIUs = useCallback(async (amount: string, projectId: string, reason: string): Promise<string> => {
    const provider = getProvider();
    if (!provider || !state.account || !addresses.riuToken) throw new Error('Not connected');
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(addresses.riuToken, RIU_ABI, signer);
    const tx = await contract.retire(
      ethers.parseEther(amount),
      ethers.encodeBytes32String(projectId.slice(0, 31)),
      reason
    );
    await tx.wait();
    await refreshBalances();
    return tx.hash;
  }, [state.account, addresses.riuToken, getProvider, refreshBalances]);

  const listRIUs = useCallback(async (amount: string, pricePerRIU: string, projectId: string): Promise<number> => {
    const provider = getProvider();
    if (!provider || !state.account || !addresses.riuToken || !addresses.marketplace) throw new Error('Not connected');
    const signer = await provider.getSigner();

    const riuContract = new ethers.Contract(addresses.riuToken, RIU_ABI, signer);
    const marketContract = new ethers.Contract(addresses.marketplace, MARKETPLACE_ABI, signer);

    const amountWei = ethers.parseEther(amount);
    await (await riuContract.approve(addresses.marketplace, amountWei)).wait();
    const tx = await marketContract.list(
      amountWei,
      ethers.parseEther(pricePerRIU),
      ethers.encodeBytes32String(projectId.slice(0, 31))
    );
    const receipt = await tx.wait();
    const event = receipt.logs.find((l: any) => l.fragment?.name === 'Listed');
    return event ? Number(event.args.listingId) : 0;
  }, [state.account, addresses, getProvider]);

  const purchaseRIUs = useCallback(async (listingId: number, amount: string): Promise<void> => {
    const provider = getProvider();
    if (!provider || !state.account || !addresses.marketplace || !addresses.paymentToken) throw new Error('Not connected');
    const signer = await provider.getSigner();

    const listing = await new ethers.Contract(addresses.marketplace, MARKETPLACE_ABI, provider).listings(listingId);
    const amountWei = ethers.parseEther(amount);
    const totalCost = (amountWei * listing.pricePerRIU) / ethers.parseEther('1');
    const fee = (totalCost * 250n) / 10000n;

    const paymentContract = new ethers.Contract(addresses.paymentToken, RIU_ABI, signer);
    await (await paymentContract.approve(addresses.marketplace, totalCost + fee)).wait();

    const marketContract = new ethers.Contract(addresses.marketplace, MARKETPLACE_ABI, signer);
    await (await marketContract.purchase(listingId, amountWei)).wait();
    await refreshBalances();
  }, [state.account, addresses, getProvider, refreshBalances]);

  const getListing = useCallback(async (listingId: number) => {
    const provider = getProvider();
    if (!provider || !addresses.marketplace) throw new Error('Not connected');
    const contract = new ethers.Contract(addresses.marketplace, MARKETPLACE_ABI, provider);
    const l = await contract.listings(listingId);
    return {
      seller: l.seller,
      riuAmount: ethers.formatEther(l.riuAmount),
      pricePerRIU: ethers.formatEther(l.pricePerRIU),
      projectId: ethers.decodeBytes32String(l.projectId),
      active: l.active,
    };
  }, [addresses.marketplace, getProvider]);

  // Listen for account/chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else setState(prev => ({ ...prev, account: accounts[0] }));
    };
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnect]);

  // Refresh balances when account changes
  useEffect(() => {
    if (state.account) refreshBalances();
  }, [state.account, refreshBalances]);

  return { ...state, connect, disconnect, retireRIUs, listRIUs, purchaseRIUs, getListing, refreshBalances };
}
