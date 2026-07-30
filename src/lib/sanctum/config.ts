/**
 * sanctum-config.ts
 *
 * Single source of truth for every service endpoint, version, and
 * environment toggle across the four ecosystems:
 *
 *   REST API (v2)  — Express / Node backend
 *   AI API  (v3)   — FastAPI / Python AI layer
 *   Blockchain     — Cosmos SDK / sanctumd RPC + REST
 *   Realtime       — Socket.IO
 *
 * All components import from here — never from import.meta.env directly.
 */

function env(key: string, fallback = ''): string {
  return (import.meta.env[key] as string | undefined) ?? fallback;
}

// ─── REST / Express backend ───────────────────────────────────────────────────
const API_BASE   = env('VITE_API_URL', '/api');
const API_V2     = `${API_BASE}/v2`;

// ─── AI / FastAPI backend ─────────────────────────────────────────────────────
const AI_BASE    = env('VITE_AI_URL', 'http://localhost:8000');
const AI_V3      = `${AI_BASE}/api/v3/sanctum`;

// ─── Cosmos SDK sanctumd ──────────────────────────────────────────────────────
const CHAIN_RPC  = env('VITE_CHAIN_RPC',  'http://localhost:26657');
const CHAIN_REST = env('VITE_CHAIN_REST', 'http://localhost:1317');
const CHAIN_ID   = env('VITE_CHAIN_ID',   'sanctum-1');

// ─── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = env('VITE_SUPABASE_URL');
const SUPABASE_KEY = env('VITE_SUPABASE_ANON_KEY');

// ─── Realtime ─────────────────────────────────────────────────────────────────
const SOCKET_URL = env('VITE_SOCKET_URL', API_BASE.replace('/api', ''));

export const SANCTUM_CONFIG = {
  api:        { base: API_BASE, v2: API_V2 },
  ai:         { base: AI_BASE,  v3: AI_V3  },
  chain:      { rpc: CHAIN_RPC, rest: CHAIN_REST, chainId: CHAIN_ID },
  supabase:   { url: SUPABASE_URL, anonKey: SUPABASE_KEY },
  socket:     { url: SOCKET_URL },
} as const;

export type SanctumConfig = typeof SANCTUM_CONFIG;
