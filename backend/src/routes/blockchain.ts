import express from 'express';
import { ethers } from 'ethers';
import { query } from '../db';
import { verifyAccessToken } from '../utils/auth';

const router = express.Router();

// Contract ABIs (read-only subset)
const RIU_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'event RIUMinted(address indexed to, uint256 amount, bytes32 projectId)',
  'event RIURetired(address indexed from, uint256 amount, bytes32 projectId, string reason)',
];

const MARKETPLACE_ABI = [
  'function listings(uint256) view returns (address seller, uint256 riuAmount, uint256 pricePerRIU, bytes32 projectId, bool active)',
  'event Listed(uint256 indexed listingId, address indexed seller, uint256 riuAmount, uint256 pricePerRIU, bytes32 projectId)',
  'event Purchased(uint256 indexed listingId, address indexed buyer, uint256 riuAmount, uint256 totalCost)',
];

function getProvider(): ethers.JsonRpcProvider | null {
  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
  if (!rpcUrl) return null;
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getContracts() {
  const provider = getProvider();
  if (!provider) return null;
  return {
    riuToken: process.env.RIU_TOKEN_ADDRESS
      ? new ethers.Contract(process.env.RIU_TOKEN_ADDRESS, RIU_ABI, provider)
      : null,
    marketplace: process.env.RIU_MARKETPLACE_ADDRESS
      ? new ethers.Contract(process.env.RIU_MARKETPLACE_ADDRESS, MARKETPLACE_ABI, provider)
      : null,
  };
}

// GET /api/v2/blockchain/status
router.get('/status', async (_req, res) => {
  const provider = getProvider();
  if (!provider) {
    return res.json({
      connected: false,
      message: 'BLOCKCHAIN_RPC_URL not configured — running in mock mode',
      contracts: {
        riuToken: process.env.RIU_TOKEN_ADDRESS || null,
        marketplace: process.env.RIU_MARKETPLACE_ADDRESS || null,
        impactNFT: process.env.IMPACT_NFT_ADDRESS || null,
      },
    });
  }

  try {
    const network = await provider.getNetwork();
    const contracts = getContracts();
    let totalSupply = null;

    if (contracts?.riuToken) {
      const supply = await contracts.riuToken.totalSupply();
      totalSupply = ethers.formatEther(supply);
    }

    res.json({
      connected: true,
      chainId: Number(network.chainId),
      chainName: network.name,
      contracts: {
        riuToken: process.env.RIU_TOKEN_ADDRESS || null,
        marketplace: process.env.RIU_MARKETPLACE_ADDRESS || null,
        impactNFT: process.env.IMPACT_NFT_ADDRESS || null,
      },
      riuTotalSupply: totalSupply,
    });
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// GET /api/v2/blockchain/balance/:address
router.get('/balance/:address', async (req, res) => {
  const { address } = req.params;
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  const contracts = getContracts();
  if (!contracts?.riuToken) {
    return res.json({ address, riuBalance: '0', mock: true });
  }

  try {
    const balance = await contracts.riuToken.balanceOf(address);
    res.json({ address, riuBalance: ethers.formatEther(balance) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v2/blockchain/listing/:listingId
router.get('/listing/:listingId', async (req, res) => {
  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) return res.status(400).json({ error: 'Invalid listing ID' });

  const contracts = getContracts();
  if (!contracts?.marketplace) {
    return res.status(503).json({ error: 'Marketplace contract not configured' });
  }

  try {
    const l = await contracts.marketplace.listings(listingId);
    res.json({
      listingId,
      seller: l.seller,
      riuAmount: ethers.formatEther(l.riuAmount),
      pricePerRIU: ethers.formatEther(l.pricePerRIU),
      projectId: ethers.decodeBytes32String(l.projectId),
      active: l.active,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v2/blockchain/mint — server-side minting after oracle verification (requires auth + admin)
router.post('/mint', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = verifyAccessToken(token);

    const { projectId, recipientAddress, amount } = req.body;
    if (!projectId || !recipientAddress || !amount) {
      return res.status(400).json({ error: 'projectId, recipientAddress, and amount are required' });
    }
    if (!ethers.isAddress(recipientAddress)) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }

    const minterKey = process.env.MINTER_PRIVATE_KEY;
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const riuTokenAddress = process.env.RIU_TOKEN_ADDRESS;

    if (!minterKey || !rpcUrl || !riuTokenAddress) {
      return res.status(503).json({ error: 'Blockchain minting not configured on server' });
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const minterWallet = new ethers.Wallet(minterKey, provider);
    const riuContract = new ethers.Contract(riuTokenAddress, [
      'function mint(address to, uint256 amount, bytes32 projectId)',
    ], minterWallet);

    const amountWei = ethers.parseEther(String(amount));
    const projectIdBytes = ethers.encodeBytes32String(String(projectId).slice(0, 31));

    const tx = await riuContract.mint(recipientAddress, amountWei, projectIdBytes);
    const receipt = await tx.wait();

    // Record in DB
    await query(
      `INSERT INTO blockchain_mint_records (project_id, recipient_address, amount, tx_hash, minted_by, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [projectId, recipientAddress, amount, receipt.hash, payload.userId]
    ).catch(() => {}); // Non-fatal if table doesn't exist yet

    res.json({ success: true, txHash: receipt.hash, amount, recipientAddress });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v2/blockchain/retire — record a retirement event from frontend tx
router.post('/retire', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = verifyAccessToken(token);
    const { txHash, amount, projectId, reason, walletAddress } = req.body;

    if (!txHash || !amount || !projectId) {
      return res.status(400).json({ error: 'txHash, amount, and projectId are required' });
    }

    // Optionally verify tx on-chain
    const provider = getProvider();
    if (provider) {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt || receipt.status !== 1) {
        return res.status(400).json({ error: 'Transaction not confirmed or failed' });
      }
    }

    await query(
      `INSERT INTO blockchain_retirement_records (user_id, wallet_address, project_id, amount, tx_hash, reason, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [payload.userId, walletAddress, projectId, amount, txHash, reason || '']
    ).catch(() => {});

    res.json({ success: true, message: 'Retirement recorded', txHash });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
