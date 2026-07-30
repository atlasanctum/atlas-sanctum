import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, ShieldAlert, Clock, AlertTriangle, Download } from "lucide-react";

type Attempt = {
  id: string;
  email: string | null;
  ip_address: string | null;
  succeeded: boolean | null;
  reason: string | null;
  created_at: string;
};

const WINDOWS = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
} as const;
type WindowKey = keyof typeof WINDOWS;

// Simple non-cryptographic hash for displaying email/IP without exposing PII.
const hashId = (v: string | null) => {
  if (!v) return "—";
  let h = 0;
  for (let i = 0; i < v.length; i++) h = (h * 31 + v.charCodeAt(i)) | 0;
  return `${(h >>> 0).toString(36)}`.padStart(6, "0").slice(0, 8);
};

const NewsletterAttempts = () => {
  const [windowKey, setWindowKey] = useState<WindowKey>("24h");
  const [rows, setRows] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      const since = new Date(Date.now() - WINDOWS[windowKey]).toISOString();
      const { data, error } = await supabase
        .from("newsletter_subscription_attempts")
        .select("id,email,ip_address,succeeded,reason,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500);
      if (cancelled) return;
      if (error) setError(error.message);
      else setRows((data ?? []));
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [windowKey]);

  const stats = useMemo(() => {
    let succeeded = 0;
    let captcha = 0;
    let rateLimited = 0;
    let other = 0;
    for (const r of rows) {
      if (r.succeeded === true) succeeded++;
      else if (r.reason?.startsWith("captcha")) captcha++;
      else if (r.reason?.includes("rate") || r.reason === "claim") {
        // claim rows are slot reservations; treat duplicates as rate-limited proxy.
        if (r.succeeded === false) rateLimited++;
      } else if (r.succeeded === false) other++;
    }
    return { total: rows.length, succeeded, captcha, rateLimited, other };
  }, [rows]);

  const exportCsv = () => {
    const header = ["created_at", "email_hash", "ip_hash", "succeeded", "reason"];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push(
        [
          escape(new Date(r.created_at).toISOString()),
          escape(hashId(r.email)),
          escape(hashId(r.ip_address)),
          escape(r.succeeded === null ? "" : String(r.succeeded)),
          escape(r.reason ?? ""),
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-attempts-${windowKey}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Newsletter Signup Activity</h1>
            <p className="text-muted-foreground mt-1">
              Attempts, captcha failures and rate-limited events. Email and IP shown as hashed identifiers.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-48">
              <Select value={windowKey} onValueChange={(v) => setWindowKey(v as WindowKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last hour</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportCsv}
              disabled={loading || rows.length === 0}
              data-testid="newsletter-export-csv"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Mail className="w-5 h-5" />} label="Total attempts" value={stats.total} />
          <StatCard icon={<Mail className="w-5 h-5 text-emerald-500" />} label="Succeeded" value={stats.succeeded} />
          <StatCard icon={<ShieldAlert className="w-5 h-5 text-amber-500" />} label="Captcha failures" value={stats.captcha} />
          <StatCard icon={<Clock className="w-5 h-5 text-rose-500" />} label="Rate limited" value={stats.rateLimited} />
        </div>

        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent attempts</h2>
            {error && (
              <span className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {error}
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Time</th>
                  <th className="text-left px-4 py-3 font-medium">Email (hash)</th>
                  <th className="text-left px-4 py-3 font-medium">IP (hash)</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No attempts in this window.</td></tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-t border-border/50">
                      <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs">{hashId(r.email)}</td>
                      <td className="px-4 py-2 font-mono text-xs">{hashId(r.ip_address)}</td>
                      <td className="px-4 py-2">
                        <StatusPill succeeded={r.succeeded} reason={r.reason} />
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{r.reason ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <Card className="p-4 flex items-center gap-3">
    <div className="p-2 rounded-lg bg-muted">{icon}</div>
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  </Card>
);

const StatusPill = ({ succeeded, reason }: { succeeded: boolean | null; reason: string | null }) => {
  if (succeeded === true) return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-600">Succeeded</span>;
  if (succeeded === null && reason === "claim") return <span className="px-2 py-0.5 rounded-full text-xs bg-sky-500/15 text-sky-600">Reserved</span>;
  if (reason?.startsWith("captcha")) return <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-600">Captcha failed</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500/15 text-rose-600">Failed</span>;
};

export default NewsletterAttempts;