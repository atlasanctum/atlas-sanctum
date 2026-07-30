import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

/**
 * Race-condition test for the atomic backend cooldown.
 *
 * `claim_newsletter_slot` must allow exactly ONE caller within the cooldown
 * window for a given (email, ip) pair, even when many requests are fired in
 * parallel. Earlier implementations using a separate SELECT-then-INSERT could
 * let multiple callers slip through; the FOR UPDATE SKIP LOCKED inside the
 * RPC guarantees idempotency.
 */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

const skip = !URL || !KEY;
const describeMaybe = skip ? describe.skip : describe;

describeMaybe("claim_newsletter_slot race condition", () => {
  const supabase = createClient(URL!, KEY!);

  it("only one of N parallel callers wins the slot", async () => {
    const email = `race-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    const ip = `10.0.0.${Math.floor(Math.random() * 250) + 1}`;
    const N = 20;

    const results = await Promise.all(
      Array.from({ length: N }, () =>
        supabase.rpc("claim_newsletter_slot", {
          _email: email,
          _ip: ip,
          _window_seconds: 60,
        }),
      ),
    );

    const wins = results.filter((r) => r.data === true).length;
    const losses = results.filter((r) => r.data === false).length;
    const errors = results.filter((r) => r.error).length;

    expect(errors).toBe(0);
    expect(wins).toBe(1);
    expect(losses).toBe(N - 1);
  }, 30_000);
});