import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

/**
 * RLS smoke tests — verify that an anonymous client cannot harvest
 * sensitive rows from owner-scoped tables.
 *
 * Skipped automatically when Supabase env vars are missing (e.g. CI without secrets).
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const d = url && anon ? describe : describe.skip;

d("RLS — anonymous access is denied", () => {
  const anonClient = createClient(url!, anon!, { auth: { persistSession: false } });

  it("newsletter_subscriptions: anon cannot read any rows", async () => {
    const { data, error } = await anonClient
      .from("newsletter_subscriptions")
      .select("email")
      .limit(5);
    // RLS denies → either empty array or error; never returns emails
    expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy();
  });

  it("transactions: anon cannot read any rows", async () => {
    const { data, error } = await anonClient
      .from("transactions")
      .select("id,user_id,amount")
      .limit(5);
    expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy();
  });

  it("user_preferences: anon cannot read any rows", async () => {
    const { data, error } = await anonClient
      .from("user_preferences")
      .select("user_id,organization_type,monthly_budget")
      .limit(5);
    expect(error || (Array.isArray(data) && data.length === 0)).toBeTruthy();
  });

  it("transactions: anon cannot insert rows", async () => {
    const { error } = await anonClient.from("transactions").insert({
      user_id: "00000000-0000-0000-0000-000000000000",
      amount: 1,
    } as never);
    expect(error).toBeTruthy();
  });

  it("user_preferences: anon cannot insert rows", async () => {
    const { error } = await anonClient.from("user_preferences").insert({
      user_id: "00000000-0000-0000-0000-000000000000",
    } as never);
    expect(error).toBeTruthy();
  });
});