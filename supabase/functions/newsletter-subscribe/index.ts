import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_SECONDS = 60;

interface Body {
  email?: string;
  honeypot?: string;
  captchaToken?: string;
  captchaProvider?: "turnstile" | "hcaptcha";
  subscription_type?: string;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifyCaptcha(
  provider: "turnstile" | "hcaptcha",
  token: string,
  remoteip: string | null,
): Promise<{ ok: boolean; reason?: string }> {
  const secret =
    provider === "turnstile"
      ? Deno.env.get("TURNSTILE_SECRET_KEY")
      : Deno.env.get("HCAPTCHA_SECRET_KEY");
  if (!secret) {
    // Fail closed: if a client submits a captcha token we MUST be able to
    // verify it. Refusing the request is safer than silently accepting it.
    return { ok: false, reason: "no_secret_configured" };
  }
  const url =
    provider === "turnstile"
      ? "https://challenges.cloudflare.com/turnstile/v0/siteverify"
      : "https://hcaptcha.com/siteverify";
  const form = new URLSearchParams();
  form.set("secret", secret);
  form.set("response", token);
  if (remoteip) form.set("remoteip", remoteip);
  try {
    const res = await fetch(url, { method: "POST", body: form });
    if (!res.ok) return { ok: false, reason: `siteverify_${res.status}` };
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) {
      return { ok: false, reason: (data["error-codes"] || ["invalid"]).join(",") };
    }
    return { ok: true };
  } catch (e) {
    console.error("captcha verify failed", e);
    return { ok: false, reason: "siteverify_unreachable" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return json(400, { error: "invalid_json" });
  }

  // Honeypot — silently succeed so bots don't learn
  if (body.honeypot && body.honeypot.trim().length > 0) {
    return json(200, { success: true });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 255) {
    return json(400, { error: "invalid_email" });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Atomic cooldown: claim_newsletter_slot inserts-or-rejects in a single
  // statement so parallel requests for the same email/IP cannot both pass.
  // Falls back gracefully if the RPC hasn't been deployed yet.
  let claimed: boolean | null = true; // default allow if RPC unavailable
  try {
    const { data: claimData, error: rlError } = await supabase.rpc(
      "claim_newsletter_slot",
      { _email: email, _ip: ip, _window_seconds: WINDOW_SECONDS },
    );
    if (rlError) {
      // If the function doesn't exist yet (42883 = undefined_function), skip rate limiting
      if ((rlError as any).code === '42883' || rlError.message?.includes('does not exist')) {
        console.warn("claim_newsletter_slot RPC not available, skipping rate limit check");
      } else {
        console.error("rate limit rpc error", rlError);
        return json(500, { error: "rate_limit_check_failed" });
      }
    } else {
      claimed = claimData as boolean;
    }
  } catch (e) {
    console.warn("rate limit check threw, skipping:", e);
  }
  if (claimed === false) {
    return json(429, { error: "rate_limited", retry_after_seconds: WINDOW_SECONDS });
  }

  // Optional captcha verification
  if (body.captchaProvider && body.captchaToken) {
    const v = await verifyCaptcha(body.captchaProvider, body.captchaToken, ip);
    if (!v.ok) {
      try {
        await supabase.from("newsletter_subscription_attempts").insert({
          email, ip_address: ip, succeeded: false, reason: `captcha:${v.reason}`,
        });
      } catch { /* table may not exist yet */ }
      return json(400, { error: "captcha_failed", reason: v.reason });
    }
  } else if (
    Deno.env.get("TURNSTILE_SECRET_KEY") ||
    Deno.env.get("HCAPTCHA_SECRET_KEY")
  ) {
    try {
      await supabase.from("newsletter_subscription_attempts").insert({
        email, ip_address: ip, succeeded: false, reason: "captcha:missing",
      });
    } catch { /* table may not exist yet */ }
    return json(400, { error: "captcha_required" });
  }

  // Insert subscription
  const { error: insertError } = await supabase
    .from("newsletter_subscriptions")
    .insert({
      email,
      subscription_type: body.subscription_type || "general",
    });

  let succeeded = true;
  let reason: string | null = null;
  let status = 200;
  let respBody: Record<string, unknown> = { success: true };

  if (insertError) {
    if (insertError.code === "23505") {
      reason = "duplicate";
      respBody = { success: true, already_subscribed: true };
    } else {
      succeeded = false;
      reason = `insert:${insertError.code || "unknown"}`;
      status = 500;
      respBody = { error: "subscription_failed" };
    }
  }

  await supabase.from("newsletter_subscription_attempts").insert({
    email,
    ip_address: ip,
    succeeded,
    reason,
  }).then(({ error: e }) => {
    if (e) console.warn("Could not log attempt (table may not exist):", e.message);
  });

  return json(status, respBody);
});