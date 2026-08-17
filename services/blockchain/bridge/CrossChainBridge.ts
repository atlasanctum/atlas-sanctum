/**
 * Atlas Sanctum — Cross-Chain Bridge Service
 * Bridges regenerative credits between Ethereum/Polygon and sanctum-1 (Cosmos SDK).
 * Uses IBC relayer for Cosmos ↔ Cosmos and a lock-mint pattern for EVM ↔ Cosmos.
 */

export type ChainId = 'sanctum-1' | 'ethereum' | 'polygon';

export interface BridgeTransfer {
  id: string;
  fromChain: ChainId;
  toChain: ChainId;
  asset: string;       // e.g. "carbon-credit", "RIU"
  amount: string;      // big-number string
  sender: string;
  recipient: string;
  status: 'pending' | 'locked' | 'minted' | 'completed' | 'failed';
  txHash?: string;
  ibcSequence?: number;
  createdAt: string;
}

const BRIDGE_API = process.env.BRIDGE_API_URL ?? 'http://localhost:7070';
const IBC_RELAYER = process.env.IBC_RELAYER_URL ?? 'http://localhost:7071';

// ── EVM → Cosmos (lock on EVM, mint on sanctum-1) ────────────────────────────

export async function lockOnEVM(params: {
  asset: string;
  amount: string;
  sender: string;
  cosmosRecipient: string;
  fromChain: 'ethereum' | 'polygon';
}): Promise<BridgeTransfer> {
  const res = await fetch(`${BRIDGE_API}/bridge/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Lock failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function mintOnCosmos(transferId: string): Promise<BridgeTransfer> {
  const res = await fetch(`${BRIDGE_API}/bridge/mint/${transferId}`, { method: 'POST' });
  if (!res.ok) throw new Error(`Mint failed: ${res.status}`);
  return res.json();
}

// ── Cosmos → EVM (burn on sanctum-1, release on EVM) ─────────────────────────

export async function burnOnCosmos(params: {
  asset: string;
  amount: string;
  sender: string;
  evmRecipient: string;
  toChain: 'ethereum' | 'polygon';
}): Promise<BridgeTransfer> {
  const res = await fetch(`${BRIDGE_API}/bridge/burn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Burn failed: ${res.status}`);
  return res.json();
}

export async function releaseOnEVM(transferId: string): Promise<BridgeTransfer> {
  const res = await fetch(`${BRIDGE_API}/bridge/release/${transferId}`, { method: 'POST' });
  if (!res.ok) throw new Error(`Release failed: ${res.status}`);
  return res.json();
}

// ── IBC (Cosmos ↔ Cosmos) ─────────────────────────────────────────────────────

export async function ibcTransfer(params: {
  sourceChannel: string;   // e.g. "channel-0"
  asset: string;
  amount: string;
  sender: string;
  receiver: string;
  timeoutSeconds?: number;
}): Promise<{ sequence: number; txHash: string }> {
  const res = await fetch(`${IBC_RELAYER}/ibc/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeoutSeconds: 600, ...params }),
  });
  if (!res.ok) throw new Error(`IBC transfer failed: ${res.status}`);
  return res.json();
}

// ── Status & history ──────────────────────────────────────────────────────────

export async function getTransferStatus(transferId: string): Promise<BridgeTransfer> {
  const res = await fetch(`${BRIDGE_API}/bridge/transfers/${transferId}`);
  if (!res.ok) throw new Error(`Status fetch failed: ${res.status}`);
  return res.json();
}

export async function listTransfers(address: string): Promise<BridgeTransfer[]> {
  const res = await fetch(`${BRIDGE_API}/bridge/transfers?address=${encodeURIComponent(address)}`);
  if (!res.ok) throw new Error(`List transfers failed: ${res.status}`);
  return res.json();
}

// ── High-level: bridge regenerative credit EVM → sanctum-1 ───────────────────

export async function bridgeCreditToSanctum(params: {
  creditType: 'carbon' | 'biodiversity' | 'water' | 'ocean' | 'circular' | 'healthcare';
  amount: string;
  evmSender: string;
  cosmosRecipient: string;
  fromChain?: 'ethereum' | 'polygon';
}): Promise<BridgeTransfer> {
  const transfer = await lockOnEVM({
    asset: `atlas.${params.creditType}-credit`,
    amount: params.amount,
    sender: params.evmSender,
    cosmosRecipient: params.cosmosRecipient,
    fromChain: params.fromChain ?? 'polygon',
  });
  return mintOnCosmos(transfer.id);
}
