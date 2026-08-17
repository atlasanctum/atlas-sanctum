/**
 * Atlas Sanctum — IPFS Storage Service
 * Decentralized storage for impact evidence, research, and knowledge assets.
 * Uses Kubo HTTP API (local node) with Pinata pinning service as fallback.
 */

export interface IPFSUploadResult {
  cid: string;
  size: number;
  url: string;
}

export interface IPFSPinResult {
  cid: string;
  pinned: boolean;
  service: 'local' | 'pinata';
}

const KUBO_API = process.env.IPFS_API_URL ?? 'http://localhost:5001';
const IPFS_GATEWAY = process.env.IPFS_GATEWAY ?? 'https://ipfs.io/ipfs';
const PINATA_JWT = process.env.PINATA_JWT ?? '';

async function kuboAdd(data: Buffer | string): Promise<{ Hash: string; Size: string }> {
  const form = new FormData();
  form.append('file', new Blob([data]));
  const res = await fetch(`${KUBO_API}/api/v0/add?pin=true`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Kubo add failed: ${res.status}`);
  return res.json();
}

async function pinataPin(cid: string): Promise<void> {
  if (!PINATA_JWT) return;
  const res = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
    method: 'POST',
    headers: { Authorization: `Bearer ${PINATA_JWT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ hashToPin: cid, pinataMetadata: { name: `atlas-sanctum-${cid}` } }),
  });
  if (!res.ok) throw new Error(`Pinata pin failed: ${res.status}`);
}

export async function uploadToIPFS(data: Buffer | string): Promise<IPFSUploadResult> {
  const result = await kuboAdd(data);
  return {
    cid: result.Hash,
    size: parseInt(result.Size, 10),
    url: `${IPFS_GATEWAY}/${result.Hash}`,
  };
}

export async function uploadJSONToIPFS(obj: unknown): Promise<IPFSUploadResult> {
  return uploadToIPFS(JSON.stringify(obj));
}

export async function pinCID(cid: string): Promise<IPFSPinResult> {
  try {
    const res = await fetch(`${KUBO_API}/api/v0/pin/add?arg=${cid}`, { method: 'POST' });
    if (res.ok) return { cid, pinned: true, service: 'local' };
  } catch {
    // fall through to Pinata
  }
  await pinataPin(cid);
  return { cid, pinned: true, service: 'pinata' };
}

export async function resolveIPFS(cid: string): Promise<Buffer> {
  const res = await fetch(`${KUBO_API}/api/v0/cat?arg=${cid}`, { method: 'POST' });
  if (!res.ok) throw new Error(`IPFS cat failed for ${cid}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function resolveIPFSJSON<T = unknown>(cid: string): Promise<T> {
  const buf = await resolveIPFS(cid);
  return JSON.parse(buf.toString('utf8')) as T;
}

export async function storeImpactEvidence(evidence: {
  assetId: string;
  measurementId: string;
  timestamp: string;
  metrics: Record<string, number>;
  verifierSignature?: string;
}): Promise<string> {
  const { cid } = await uploadJSONToIPFS(evidence);
  await pinCID(cid).catch(() => {});
  return cid;
}

export async function storeKnowledgeAsset(asset: {
  title: string;
  type: 'research' | 'dataset' | 'indigenous-knowledge' | 'policy';
  content: string;
  author: string;
  license: string;
}): Promise<IPFSUploadResult> {
  const result = await uploadJSONToIPFS(asset);
  await pinCID(result.cid).catch(() => {});
  return result;
}
