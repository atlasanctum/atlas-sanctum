import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Demo = () => {
  const quickLinks = [
    { label: "Explore Marketplace", href: "/marketplace" },
    { label: "View Measurements", href: "/measurements" },
    { label: "See Bioregions", href: "/bioregions" },
    { label: "Impact Dashboard", href: "/dashboard" },
  ];

  return (
    <Layout>
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Demo Mode</p>
            <h1 className="text-4xl md:text-5xl font-bold">Explore without signing up</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Jump into a guided demo of the marketplace, measurements, and governance flows—no account required.
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button asChild size="lg">
                <Link to="/marketplace">Launch Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Read-only experience • Sample data • Safe to explore
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Marketplace walkthrough",
                desc: "Browse RIUs, bonds, pricing, and purchase flow with demo data.",
              },
              {
                title: "Live measurements",
                desc: "View satellite & IoT feeds, anomalies, and bioregion insights.",
              },
              {
                title: "Governance preview",
                desc: "Review proposals, voting UX, and transparency logs.",
              },
            ].map((item) => (
              <div key={item.title} className="glass border border-border/50 rounded-2xl p-5 space-y-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass border border-border/60 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Jump to a section</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {quickLinks.map((link) => (
                <Button key={link.href} asChild variant="outline" className="justify-start">
                  <Link to={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Demo;
