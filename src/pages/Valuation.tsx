import React, { useState } from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import PageHero from "@/components/PageHero";
import CreditValuationEngine from "@/components/CreditValuationEngine";
import { useValuationModel } from "@/hooks/useValuationModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, TrendingUp, Shield, DollarSign, BarChart3 } from "lucide-react";

const Valuation = () => {
  const [selectedProjectId] = useState<string | undefined>(undefined);

  // Fetch valuation model
  const valuation = useValuationModel(selectedProjectId);

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <PageHero
        title="Mathematical Trust & Credit Valuation Engine"
        subtitle="Multi-variable impact scoring, confidence-weighted credits, reversal risk decay, and permanence bonding"
        ctaText="View Valuation"
        ctaLink="#valuation"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        badgeText="Trust & Transparency"
        stats={[
          { value: "78.5", label: "Impact Score" },
          { value: "92%", label: "Confidence" },
          { value: "$82.10", label: "Price/RIU" },
          { value: "$1.84B", label: "Market Volume" }
        ]}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl" id="valuation">

        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Impact Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">78.5</p>
              <p className="text-xs text-muted-foreground">Score (0-100)</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-xs text-muted-foreground">95% CI</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Reversal Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8.5%</p>
              <p className="text-xs text-muted-foreground">Decay/year</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Price/Credit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$70.00</p>
              <p className="text-xs text-muted-foreground">Final</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Multiplier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2.8x</p>
              <p className="text-xs text-muted-foreground">vs. base</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="engine" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="engine">Valuation Engine</TabsTrigger>
            <TabsTrigger value="design">Design Philosophy</TabsTrigger>
            <TabsTrigger value="examples">Use Cases</TabsTrigger>
            <TabsTrigger value="transparency">Transparency</TabsTrigger>
          </TabsList>

          {/* Engine Tab */}
          <TabsContent value="engine" className="space-y-6">
            <CreditValuationEngine valuation={valuation.data} isLoading={valuation.isLoading} />
          </TabsContent>

          {/* Design Philosophy Tab */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why We Built This Engine</CardTitle>
                <CardDescription>Integrity mathematically embedded, not audited later</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">The Problem</h3>
                    <div className="space-y-3">
                      <div className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded">
                        <h4 className="font-semibold text-sm text-red-900 mb-1">Single-Metric Bias</h4>
                        <p className="text-sm text-red-800">
                          Traditional carbon credits only measure CO₂, ignoring biodiversity collapse and health impacts
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded">
                        <h4 className="font-semibold text-sm text-red-900 mb-1">Greenwashing Risk</h4>
                        <p className="text-sm text-red-800">
                          Unverified claims, no permanence guarantees, reversals hidden years later
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded">
                        <h4 className="font-semibold text-sm text-red-900 mb-1">Opaque Pricing</h4>
                        <p className="text-sm text-red-800">
                          Black-box valuations with no clear methodology, audits happen after the fact
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded">
                        <h4 className="font-semibold text-sm text-red-900 mb-1">Permanence Ignored</h4>
                        <p className="text-sm text-red-800">
                          No accounting for reversal risk or time-decay of stored carbon
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Our Solution</h3>
                    <div className="space-y-3">
                      <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-1">Holistic Scoring</h4>
                        <p className="text-sm text-emerald-800">
                          Three dimensions (CO₂ 45% + Biodiversity 35% + Health 20%) avoid single-metric bias
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-1">Confidence Intervals</h4>
                        <p className="text-sm text-emerald-800">
                          Uncertainty quantified (95% CI) with lower/upper bounds; transparent about unknowns
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-1">Real-Time Verification</h4>
                        <p className="text-sm text-emerald-800">
                          Monthly satellite + sensor updates; anomalies flagged instantly, not hidden
                        </p>
                      </div>

                      <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-1">Permanence Bonds</h4>
                        <p className="text-sm text-emerald-800">
                          2.5% held in escrow, reversal risk decays annually, price reflects actual long-term value
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mathematical Philosophy */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Mathematical Philosophy</h3>
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-blue-50">
                    <p className="text-sm text-slate-700 mb-3">
                      <strong>Trust emerges from systems, not promises.</strong>
                    </p>
                    <p className="text-sm text-slate-700 mb-3">
                      Instead of relying on auditors to catch fraud later, we embed integrity into the valuation formula itself:
                    </p>
                    <ul className="text-sm text-slate-700 space-y-2 ml-4">
                      <li>✓ Every input is verifiable in real-time (satellite data, soil probes, eDNA sequences)</li>
                      <li>✓ Every calculation is deterministic and auditable (no black boxes)</li>
                      <li>✓ Every uncertainty is quantified (confidence intervals, not point estimates)</li>
                      <li>✓ Every credit reflects actual permanence (reversal risk decay over time)</li>
                      <li>✓ Every transaction is immutable (blockchain-backed for critical records)</li>
                    </ul>
                    <p className="text-sm text-slate-700 mt-3">
                      The market price IS the integrity signal. Higher scores = more confidence = higher prices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Use Cases Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Valuation in Action</CardTitle>
                <CardDescription>How different projects are priced by the engine</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {/* High-Score Project */}
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-emerald-900">Indigenous-Led Reforestation (Amazon)</h4>
                        <p className="text-xs text-emerald-700">High impact, low risk, proven permanence</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">$85.00</p>
                        <p className="text-xs text-emerald-700">/credit</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs mt-3 border-t pt-3">
                      <div>
                        <p className="text-emerald-700 font-semibold">Impact Score</p>
                        <p className="text-lg font-bold">92</p>
                      </div>
                      <div>
                        <p className="text-emerald-700 font-semibold">Confidence</p>
                        <p className="text-lg font-bold">96%</p>
                      </div>
                      <div>
                        <p className="text-emerald-700 font-semibold">Multiplier</p>
                        <p className="text-lg font-bold">3.4x</p>
                      </div>
                    </div>
                  </div>

                  {/* Medium-Score Project */}
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-amber-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-amber-900">Mangrove Restoration (Southeast Asia)</h4>
                        <p className="text-xs text-amber-700">High biodiversity, moderate permanence risk</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-amber-600">$56.00</p>
                        <p className="text-xs text-amber-700">/credit</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs mt-3 border-t pt-3">
                      <div>
                        <p className="text-amber-700 font-semibold">Impact Score</p>
                        <p className="text-lg font-bold">74</p>
                      </div>
                      <div>
                        <p className="text-amber-700 font-semibold">Confidence</p>
                        <p className="text-lg font-bold">88%</p>
                      </div>
                      <div>
                        <p className="text-amber-700 font-semibold">Multiplier</p>
                        <p className="text-lg font-bold">2.2x</p>
                      </div>
                    </div>
                  </div>

                  {/* Low-Score Project */}
                  <div className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-red-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-red-900">Recently Deforested Land (No Consent)</h4>
                        <p className="text-xs text-red-700">High risk, uncertain permanence, integrity issues</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">$0.00</p>
                        <p className="text-xs text-red-700">NOT ISSUABLE</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs mt-3 border-t pt-3">
                      <div>
                        <p className="text-red-700 font-semibold">Impact Score</p>
                        <p className="text-lg font-bold">22</p>
                      </div>
                      <div>
                        <p className="text-red-700 font-semibold">Confidence</p>
                        <p className="text-lg font-bold">42%</p>
                      </div>
                      <div>
                        <p className="text-red-700 font-semibold">Status</p>
                        <p className="text-lg font-bold">Rejected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transparency Tab */}
          <TabsContent value="transparency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Full Transparency & Auditability</CardTitle>
                <CardDescription>Every calculation can be independently verified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Public Audit Trail</h3>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg bg-slate-50">
                      <h4 className="font-semibold text-sm mb-2">Real-Time Data Feeds</h4>
                      <p className="text-sm text-slate-700">
                        All measurement data (satellite imagery, soil sensor readings, eDNA results) published to public archive within 24 hours
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50">
                      <h4 className="font-semibold text-sm mb-2">Calculation History</h4>
                      <p className="text-sm text-slate-700">
                        Complete record of every impact score, confidence interval, and reversal risk recalculation stored immutably
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50">
                      <h4 className="font-semibold text-sm mb-2">Methodology Documentation</h4>
                      <p className="text-sm text-slate-700">
                        Open-source formulas, weights, and algorithms available for peer review and independent verification
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-slate-50">
                      <h4 className="font-semibold text-sm mb-2">Price Justification</h4>
                      <p className="text-sm text-slate-700">
                        Every $70 credit can be traced to specific impact components, confidence adjustments, and risk factors
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sample Audit Report */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Sample Valuation Audit Report <span className="text-xs font-normal text-muted-foreground">(illustrative — not real project data)</span></h3>
                  <div className="p-4 border rounded-lg bg-blue-50 font-mono text-xs text-slate-700 space-y-2 max-h-96 overflow-y-auto">
                    <p className="font-bold">VALUATION AUDIT REPORT</p>
                    <p>Project ID: project-1</p>
                    <p>Generated: 2024-01-15T10:30:00Z</p>
                    <p>—————————————————————————</p>
                    <p>INPUT DATA VERIFICATION:</p>
                    <p>  CO₂ Level: 420 ppm (Sentinel-2 source, cloudless, QA pass ✓)</p>
                    <p>  Soil Carbon: 4.2% (NIR spectroscopy, validated ±0.1% ✓)</p>
                    <p>  Biodiversity: 78 (eDNA OTU count: 18,432, confidence 95% ✓)</p>
                    <p>  Microbiome Health: 82% (Metagenomics analysis ✓)</p>
                    <p>—————————————————————————</p>
                    <p>IMPACT CALCULATION:</p>
                    <p>  CO₂_Score = 85 × 0.45 weight = 38.25</p>
                    <p>  Biodiversity_Score = 78 × 0.35 weight = 27.30</p>
                    <p>  Health_Score = 82 × 0.20 weight = 16.40</p>
                    <p>  Impact_Score = 82.0 (sum normalized to 100)</p>
                    <p>—————————————————————————</p>
                    <p>CONFIDENCE ANALYSIS:</p>
                    <p>  Data sources: 4 (satellite + soil + DNA + health)</p>
                    <p>  Cross-validation: Pass (+5%)</p>
                    <p>  Historical baseline: 24 months (+8%)</p>
                    <p>  Confidence_Score = 0.92</p>
                    <p>  95% CI: [71.8, 85.2]</p>
                    <p>—————————————————————————</p>
                    <p>PERMANENCE & RISK:</p>
                    <p>  Reversal Risk: 8.5% (year 1)</p>
                    <p>  Decay Rate: 0.95 (annual)</p>
                    <p>  Bond Escrow: 2.5% of credits</p>
                    <p>  Price Retention: 91.5% (year 1)</p>
                    <p>—————————————————————————</p>
                    <p>FINAL PRICING:</p>
                    <p>  Base Price: $25.00</p>
                    <p>  Impact Multiplier: 1.64 (score 82/50)</p>
                    <p>  Confidence Adjustment: 0.92</p>
                    <p>  Bioregional Premium: 2.8x</p>
                    <p>  Final Price: $70.00 per credit ✓</p>
                    <p>—————————————————————————</p>
                    <p>AUDIT STATUS: VERIFIED ✓</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Valuation;
