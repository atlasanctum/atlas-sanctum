import React from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Adoption = () => {
  const actors = [
    {
      role: "Individual",
      icon: "👤",
      entry: "Micro-Credits ($100+)",
      description: "Carbon offset your lifestyle, own regenerative impact",
      metrics: "24.5M active",
      timeline: "Week 1",
      benefits: ["Personal dashboard", "Impact tracking", "Community sharing", "Tax deduction"],
    },
    {
      role: "Farmer",
      icon: "🌾",
      entry: "Regenerative Income Program",
      description: "Earn recurring income for ecosystem function",
      metrics: "180K farmers",
      timeline: "Week 2-4",
      benefits: ["Monthly soil credits", "Biodiversity bonuses", "Premium crop prices", "Technical support"],
    },
    {
      role: "City",
      icon: "🏙️",
      entry: "Urban Regeneration Fund",
      description: "Build health & resilience, save on healthcare costs",
      metrics: "1.2K cities",
      timeline: "Month 1-3",
      benefits: ["Urban green bonds", "Health metrics", "Air/water credits", "Climate policy alignment"],
    },
    {
      role: "Corporation",
      icon: "🏢",
      entry: "ESG Compliance & Bonds",
      description: "Meet climate targets, access capital markets",
      metrics: "450 corps",
      timeline: "Month 2-6",
      benefits: ["ESG reporting", "Supply chain credits", "Regen-backed bonds", "API integration"],
    },
    {
      role: "Nation",
      icon: "🏛️",
      entry: "Climate Policy & NDCs",
      description: "Scale climate action, achieve national targets",
      metrics: "12 nations",
      timeline: "Year 1-2",
      benefits: ["NDC progress tracking", "Health/GDP co-benefits", "Financial instruments", "Trade leverage"],
    },
    {
      role: "Faith Institution",
      icon: "🙏",
      entry: "Stewardship Leadership",
      description: "Fulfill ethical mandate, inspire global action",
      metrics: "850+ organizations",
      timeline: "Ongoing",
      benefits: ["Ethical governance", "Community leadership", "Sacred land protection", "Intergenerational values"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <PageHero
        title="Adoption Pathway for a New Global Order"
        subtitle="Role-specific entry points from micro-credits to nation-scale climate policy"
        ctaText="Explore Roles"
        ctaLink="#roles"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        badgeText="Regenerative Movement"
        stats={[
          { value: "24.5M", label: "Individuals" },
          { value: "180K", label: "Farmers" },
          { value: "1.2K", label: "Cities" },
          { value: "450", label: "Corporations" }
        ]}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl" id="roles">

        {/* Overview Card */}
        <Card className="mb-8 border-2 border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg">The Regenerative Ladder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Each actor enters at their scale, but all climb the same ladder of regenerative impact. Individual actions aggregate into city systems. City systems inform national policy.
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>Individual</span>
              <span className="text-muted-foreground">→</span>
              <span>Farmer</span>
              <span className="text-muted-foreground">→</span>
              <span>City</span>
              <span className="text-muted-foreground">→</span>
              <span>Corporation</span>
              <span className="text-muted-foreground">→</span>
              <span>Nation</span>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pathways">Detailed Pathways</TabsTrigger>
            <TabsTrigger value="integration">Integration Points</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actors.map((actor, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-3xl mb-2">{actor.icon}</p>
                        <CardTitle className="text-base">{actor.role}</CardTitle>
                        <CardDescription className="text-xs mt-1">{actor.entry}</CardDescription>
                      </div>
                      <Badge variant="outline">{actor.timeline}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-700">{actor.description}</p>
                    <div className="text-center p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">{actor.metrics}</p>
                      <p className="text-xs text-muted-foreground">Currently active</p>
                    </div>
                    <ul className="text-xs space-y-1">
                      {actor.benefits.map((benefit, bidx) => (
                        <li key={bidx} className="flex items-center gap-2">
                          <span className="text-emerald-600">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pathways" className="space-y-6">
            {/* Individual Pathway */}
            <Card>
              <CardHeader>
                <CardTitle>Individual: The Personal Journey</CardTitle>
                <CardDescription>From climate concern to regenerative ownership in weeks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">1</div>
                      <h4 className="font-semibold">Download App (Day 1)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">iOS/Android, create account with email or social login. Takes 3 minutes.</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">2</div>
                      <h4 className="font-semibold">Browse Projects (Day 1-3)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Watch story videos, see real-time impact dashboards, choose what resonates.</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">3</div>
                      <h4 className="font-semibold">Make First Purchase (Week 1)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Buy 1 RIU ($82), 10 RIUs ($820), or $5K portfolio. Credit/debit card or crypto.</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">4</div>
                      <h4 className="font-semibold">Track Impact (Ongoing)</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Monthly impact reports, share on social, join community challenges, retire/hold for appreciation.</p>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-l-green-600 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">Annual Impact (1 Individual buying $1K/year)</p>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>✓ 12 RIUs purchased (12 metric tons CO₂ removed)</li>
                    <li>✓ $840 in healthcare costs prevented (global average)</li>
                    <li>✓ $150-300 potential appreciation (5-10 year hold)</li>
                    <li>✓ $500-1000 tax deduction value</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Farmer Pathway */}
            <Card>
              <CardHeader>
                <CardTitle>Farmer: Regenerative Income Stream</CardTitle>
                <CardDescription>From single crop to diversified ecosystem income in months</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-emerald-50">
                  <p className="font-semibold text-sm text-emerald-900 mb-2">Typical 500-acre Farm Revenue</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-white rounded">
                      <p className="font-bold text-emerald-600">$205K-565K</p>
                      <p className="text-xs">Annual regenerative income</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded">
                      <p className="font-bold text-blue-600">$120K-180K</p>
                      <p className="text-xs">Traditional crop sales</p>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-700 mt-2">
                    Total: $325K-745K/year (171-518% increase)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* City Pathway */}
            <Card>
              <CardHeader>
                <CardTitle>City: Urban Regeneration Systems</CardTitle>
                <CardDescription>Health and resilience dividends from green infrastructure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-purple-50">
                  <p className="font-semibold text-sm text-purple-900 mb-2">City of 1 Million: 10-Year Impact</p>
                  <ul className="text-sm text-purple-800 space-y-2">
                    <li>✓ $8-12B in healthcare cost avoidance</li>
                    <li>✓ $2-4B in productivity gains (less sick days)</li>
                    <li>✓ $500M-1B in property value appreciation</li>
                    <li>✓ $1-2M RIUs retired (climate credit achievement)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Corporation & Nation Pathways  */}
            <Card>
              <CardHeader>
                <CardTitle>Corporate & Government Scale</CardTitle>
                <CardDescription>ESG compliance, capital access, policy leverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-amber-50">
                    <p className="font-semibold text-sm text-amber-900 mb-2">Corporation ($100M RIU portfolio)</p>
                    <ul className="text-xs text-amber-800 space-y-1">
                      <li>✓ Scope 3 emissions offset</li>
                      <li>✓ ESG rating improvement</li>
                      <li>✓ Stock price premium (3-8%)</li>
                      <li>✓ Regen-backed bond access</li>
                      <li>✓ Greenwashing immunity</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg bg-pink-50">
                    <p className="font-semibold text-sm text-pink-900 mb-2">Nation ($1B RIU allocation)</p>
                    <ul className="text-xs text-pink-800 space-y-1">
                      <li>✓ NDC target achievement</li>
                      <li>✓ Climate finance authority</li>
                      <li>✓ International negotiating power</li>
                      <li>✓ Sovereign bond rating improvement</li>
                      <li>✓ Trade leverage in climate talks</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It All Connects</CardTitle>
                <CardDescription>The regenerative system as a coherent whole</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded">
                    <h4 className="font-semibold text-sm text-emerald-900 mb-1">Individuals Fund Farmers</h4>
                    <p className="text-sm text-emerald-800">
                      When you buy an RIU, ~40% of premium goes to farmer income support. Your micro-credit becomes someone's monthly paycheck.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded">
                    <h4 className="font-semibold text-sm text-blue-900 mb-1">Farmers Regenerate Regions</h4>
                    <p className="text-sm text-blue-800">
                      500K+ farmers × 500 acres = ecosystem recovery at bioregional scale. Cities see measurable air/water improvements.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-purple-500 bg-purple-50 rounded">
                    <h4 className="font-semibold text-sm text-purple-900 mb-1">Cities Drive Policy</h4>
                    <p className="text-sm text-purple-800">
                      With $8-12B in health savings, city mayors have political capital to demand regenerative procurement. Corporations follow.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-amber-500 bg-amber-50 rounded">
                    <h4 className="font-semibold text-sm text-amber-900 mb-1">Corporations Set New Standards</h4>
                    <p className="text-sm text-amber-800">
                      When Unilever, Microsoft, Nestlé commit to RIU portfolios, entire supply chains regenerate. Regeneration becomes business-as-usual.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-pink-500 bg-pink-50 rounded">
                    <h4 className="font-semibold text-sm text-pink-900 mb-1">Nations Coordinate Climate Action</h4>
                    <p className="text-sm text-pink-800">
                      With RIU markets as standardized currency, climate finance becomes fungible. Countries trade climate commitments like carbon offsets.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-l-green-500 bg-green-50 rounded">
                    <h4 className="font-semibold text-sm text-green-900 mb-1">System Reaches Saturation</h4>
                    <p className="text-sm text-green-800">
                      After 20-30 years, regenerative agriculture dominates. Bioregional systems thrive. Communities steward the land. New global order emerges.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>The Flywheel Effect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg">
                  <p className="font-semibold text-sm mb-3">More Individuals Buying</p>
                  <p className="text-xs text-muted-foreground mb-4">↓</p>
                  <p className="font-semibold text-sm mb-3">More Farmer Income</p>
                  <p className="text-xs text-muted-foreground mb-4">↓</p>
                  <p className="font-semibold text-sm mb-3">More Ecosystem Recovery</p>
                  <p className="text-xs text-muted-foreground mb-4">↓</p>
                  <p className="font-semibold text-sm mb-3">More City Health Dividends</p>
                  <p className="text-xs text-muted-foreground mb-4">↓</p>
                  <p className="font-semibold text-sm mb-3">More Corporate Commitment</p>
                  <p className="text-xs text-muted-foreground mb-4">↓</p>
                  <p className="font-semibold text-sm mb-3">More RIU Demand</p>
                  <p className="text-xs text-muted-foreground mb-4">↓</p>
                  <p className="font-semibold text-sm text-emerald-700">Back to Step 1 (Accelerated)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Adoption;
