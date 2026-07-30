import Layout from "@/components/Layout";
import ApiStatus from "@/components/ApiStatus";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Status = () => {
  return (
    <Layout>
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Platform status</p>
            <h1 className="text-4xl md:text-5xl font-bold">Systems Health</h1>
            <p className="text-muted-foreground text-lg">
              Live view of API health, uptime, and service availability across the stack.
            </p>
          </header>

          <div className="glass border border-border/60 rounded-2xl p-6 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Current status</div>
              <ApiStatus showLabel />
              <p className="text-sm text-muted-foreground">
                API, auth, marketplace, and measurements endpoints monitored continuously.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to="/api">View API</Link>
              </Button>
              <Button asChild>
                <Link to="/contact">Report an issue</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "API Uptime", value: "99.9%", sub: "Last 30 days" },
              { title: "Avg Response", value: "180 ms", sub: "p95 across core endpoints" },
              { title: "Incidents", value: "0", sub: "Past 30 days" },
              { title: "Regions", value: "4", sub: "NA • EU • APAC • Africa" },
            ].map((item) => (
              <div key={item.title} className="glass border border-border/50 rounded-xl p-4">
                <div className="text-sm text-muted-foreground">{item.title}</div>
                <div className="text-2xl font-semibold mt-1">{item.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
              </div>
            ))}
          </div>

          <div className="glass border border-border/60 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Monitored services</h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              {[
                "Auth & sessions",
                "Marketplace (RIUs, bonds, transactions)",
                "Measurements & anomalies",
                "Projects & approvals",
                "Webhooks (payments)",
                "Supabase edge functions",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Status;
