import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

/**
 * Boundary tests for the atomic cooldown window. We hit `claim_newsletter_slot`
 * with deliberately small windows so we can prove:
 *   - A second call within the window is rejected.
 *   - A second call after the window expires is accepted.
 * This guards against off-by-one window arithmetic in the RPC.
 */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

const skip = !URL || !KEY;
const describeMaybe = skip ? describe.skip : describe;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describeMaybe("claim_newsletter_slot window boundaries", () => {
  const supabase = createClient(URL!, KEY!);

  it("rejects a second call just before the window expires", async () => {
    const email = `boundary-pre-${Date.now()}@example.com`;
    const ip = `10.0.1.${Math.floor(Math.random() * 250) + 1}`;
    const win = 5; // seconds

    const first = await supabase.rpc("claim_newsletter_slot", {
      _email: email,
      _ip: ip,
      _window_seconds: win,
    });
    expect(first.error).toBeNull();
    expect(first.data).toBe(true);

    // Just before the window rolls over (4s into a 5s window).
    await sleep(4_000);
    const second = await supabase.rpc("claim_newsletter_slot", {
      _email: email,
      _ip: ip,
      _window_seconds: win,
    });
    expect(second.error).toBeNull();
    expect(second.data).toBe(false);
  }, 20_000);

  it("accepts a second call just after the window rolls over", async () => {
    const email = `boundary-post-${Date.now()}@example.com`;
    const ip = `10.0.2.${Math.floor(Math.random() * 250) + 1}`;
    const win = 2; // seconds

    const first = await supabase.rpc("claim_newsletter_slot", {
      _email: email,
      _ip: ip,
      _window_seconds: win,
    });
    expect(first.data).toBe(true);

    // Wait past the window with a small safety margin.
    await sleep(2_500);
    const second = await supabase.rpc("claim_newsletter_slot", {
      _email: email,
      _ip: ip,
      _window_seconds: win,
    });
    expect(second.error).toBeNull();
    expect(second.data).toBe(true);
  }, 20_000);
});
