/**
 * Integration tests: Row Level Security on donor-owned tables.
 *
 * Verifies that a signed-in donor CANNOT read another donor's rows in:
 *   - transactions
 *   - subscriptions
 *   - invoices
 *   - profiles
 *
 * These tests hit the real Supabase project. They require the following env:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *   RLS_TEST_USER_A_EMAIL / RLS_TEST_USER_A_PASSWORD
 *   RLS_TEST_USER_B_EMAIL / RLS_TEST_USER_B_PASSWORD
 *
 * If any are missing, the suite is skipped so unit CI stays green.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
// Use globalThis to avoid depending on @types/node in this test env.
const _env = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
  .process?.env ?? {};
const A_EMAIL = _env.RLS_TEST_USER_A_EMAIL;
const A_PASS  = _env.RLS_TEST_USER_A_PASSWORD;
const B_EMAIL = _env.RLS_TEST_USER_B_EMAIL;
const B_PASS  = _env.RLS_TEST_USER_B_PASSWORD;

const runReal = !!(URL && KEY && A_EMAIL && A_PASS && B_EMAIL && B_PASS);
const d = runReal ? describe : describe.skip;

const freshClient = () =>
  createClient(URL!, KEY!, { auth: { persistSession: false, autoRefreshToken: false } });

d('RLS: donor isolation', () => {
  let clientA: SupabaseClient;
  let clientB: SupabaseClient;
  let userAId: string;
  let userBId: string;

  beforeAll(async () => {
    clientA = freshClient();
    clientB = freshClient();
    const a = await clientA.auth.signInWithPassword({ email: A_EMAIL!, password: A_PASS! });
    const b = await clientB.auth.signInWithPassword({ email: B_EMAIL!, password: B_PASS! });
    if (a.error) throw a.error;
    if (b.error) throw b.error;
    userAId = a.data.user!.id;
    userBId = b.data.user!.id;
    expect(userAId).not.toBe(userBId);
  }, 30_000);

  const cannotReadOthers = async (
    table: 'transactions' | 'subscriptions' | 'invoices' | 'profiles',
  ) => {
    const { data, error } = await clientA.from(table).select('user_id').eq('user_id', userBId);
    // RLS should either error or return zero rows; never leak another user's rows.
    if (error) {
      // Permission-denied is acceptable — the row set is empty from A's perspective.
      expect(error.message).toMatch(/permission|denied|policy|forbidden/i);
    } else {
      expect(data ?? []).toHaveLength(0);
    }
  };

  it('transactions: A cannot read B rows', () => cannotReadOthers('transactions'));
  it('subscriptions: A cannot read B rows', () => cannotReadOthers('subscriptions'));
  it('invoices:      A cannot read B rows', () => cannotReadOthers('invoices'));
  it('profiles:      A cannot read B rows', () => cannotReadOthers('profiles'));

  it('A can read own transactions only', async () => {
    const { data, error } = await clientA.from('transactions').select('user_id');
    expect(error).toBeNull();
    for (const row of data ?? []) expect(row.user_id).toBe(userAId);
  });

  it('A cannot update B subscriptions', async () => {
    const { data, error } = await clientA
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('user_id', userBId)
      .select();
    // Either an error or zero affected rows — never a successful write.
    if (!error) expect(data ?? []).toHaveLength(0);
  });
});

if (!runReal) {
  describe('RLS: donor isolation (skipped)', () => {
    it.skip('missing RLS_TEST_USER_* env — real RLS tests skipped', () => {});
  });
}