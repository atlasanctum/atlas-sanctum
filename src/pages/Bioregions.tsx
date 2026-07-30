import React, { useState } from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import BioregionalMap from "@/components/BioregionalMap";
import ClimateRiskForecasting from "@/components/ClimateRiskForecasting";
import PageHero from "@/components/PageHero";
import { useBioregionalZones } from "@/hooks/useBioregionalZones";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BioregionalZone } from "@/types/marketplace";

const Bioregions = () => {
  // Sample zone IDs - in a real app these would be dynamic
  const [selectedZoneIds] = useState<string[]>(["zone-1", "zone-2", "zone-3"]);
  const [selectedZone, setSelectedZone] = useState<BioregionalZone | undefined>();

  // Fetch bioregional data
  const bioregions = useBioregionalZones(selectedZoneIds);

  // Generate mock zone data matching new schema
  const mockZones: BioregionalZone[] = [
    {
      id: "zone-1",
      name: "Amazon Basin",
      code: "AMZ-001",
      region: "South America",
      country: "Brazil",
      coordinates: null,
      climate_type: "tropical_rainforest",
      biodiversity_index: 95,
      carbon_sequestration_rate: 3.5,
      active_projects: 12,
      total_area_hectares: 5500000,
      risk_level: "medium",
      description: "Indigenous territory, historical deforestation 1970-2000",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "zone-2",
      name: "Boreal Forests",
      code: "BOR-001",
      region: "North America",
      country: "Canada",
      coordinates: null,
      climate_type: "boreal_forest",
      biodiversity_index: 72,
      carbon_sequestration_rate: 2.2,
      active_projects: 8,
      total_area_hectares: 11000000,
      risk_level: "high",
      description: "Commercial forestry, recent conservation 2010-present",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "zone-3",
      name: "Coral Triangle",
      code: "CRL-001",
      region: "Southeast Asia",
      country: "Indonesia",
      coordinates: null,
      climate_type: "ocean_coastal",
      biodiversity_index: 98,
      carbon_sequestration_rate: 4.1,
      active_projects: 15,
      total_area_hectares: 6000000,
      risk_level: "high",
      description: "Traditional fishing, marine conservation expanding",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const displayZones = bioregions.data.length > 0 ? bioregions.data : mockZones;

  // Check for high biodiversity zones (biodiversity_index > 90)
  const highBiodiversityZones = displayZones.filter((z) => (z.biodiversity_index || 0) > 90);

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <PageHero
        title="Geographic Intelligence & Bioregional Mapping"
        subtitle="Bioregional credit zones, historical land-use analysis, climate risk forecasting, and indigenous land recognition"
        ctaText="Explore Zones"
        ctaLink="#map"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        badgeText="Regenerative Cartography"
        stats={[
          { value: displayZones.length.toString(), label: "Active Zones" },
          { value: "PostGIS", label: "Real-time Modeling" },
          { value: highBiodiversityZones.length.toString(), label: "High Biodiversity" },
          { value: "Equity-focused", label: "Justice-Aware" }
        ]}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl">



        {/* Main Tabs */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="map">Map & Zones</TabsTrigger>
            <TabsTrigger value="climate">Climate Risk</TabsTrigger>
            <TabsTrigger value="history">Land Use History</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <BioregionalMap zones={displayZones} selectedZone={selectedZone} onSelectZone={setSelectedZone} isLoading={bioregions.isLoading} />
          </TabsContent>

          {/* Climate Risk Tab */}
          <TabsContent value="climate" className="space-y-6">
            <ClimateRiskForecasting zoneId={selectedZone?.id || "zone-1"} isLoading={bioregions.isLoading} />
          </TabsContent>

          {/* Land Use History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historical Land-Use Analysis</CardTitle>
                <CardDescription>Remote sensing archives & ML reconstruction for justice-aware pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Temporal Analysis</h3>
                    <div className="space-y-3">
                      <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded">
                        <div className="font-semibold text-sm text-emerald-900">Pre-1970: Indigenous Management</div>
                        <p className="text-sm text-emerald-800">Native forest with high biodiversity, sustainable land use practices</p>
                      </div>

                      <div className="p-4 border-l-4 border-l-orange-500 bg-orange-50 rounded">
                        <div className="font-semibold text-sm text-orange-900">1970-2000: Frontier Expansion</div>
                        <p className="text-sm text-orange-800">Large-scale deforestation for agriculture and logging, biodiversity loss</p>
                      </div>

                      <div className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded">
                        <div className="font-semibold text-sm text-blue-900">2000-2010: Mixed Trends</div>
                        <p className="text-sm text-blue-800">Some restoration efforts, but continued pressure from development</p>
                      </div>

                      <div className="p-4 border-l-4 border-l-green-500 bg-green-50 rounded">
                        <div className="font-semibold text-sm text-green-900">2010-Present: Conservation Ascendant</div>
                        <p className="text-sm text-green-800">Indigenous land rights recognized, rewilding and restoration active</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Impact */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Justice-Aware Credit Pricing</h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-emerald-50">
                        <h4 className="font-semibold text-sm mb-2">Indigenous-Managed Lands</h4>
                        <p className="text-sm text-slate-700">
                          <strong>Multiplier: 3.5x</strong> - Historical stewardship, cultural knowledge, proof of permanence
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-blue-50">
                        <h4 className="font-semibold text-sm mb-2">Previously Degraded (Recently Restored)</h4>
                        <p className="text-sm text-slate-700">
                          <strong>Multiplier: 2.8x</strong> - Higher impact due to recovery trajectory, needs active monitoring
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-yellow-50">
                        <h4 className="font-semibold text-sm mb-2">Stable/Protected Forests</h4>
                        <p className="text-sm text-slate-700">
                          <strong>Multiplier: 2.0x</strong> - Lower risk, proven permanence, standard market valuation
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-gradient-to-r from-slate-50 to-red-50">
                        <h4 className="font-semibold text-sm mb-2">Recently Deforested (No Consent)</h4>
                        <p className="text-sm text-slate-700">
                          <strong>Not Issuable</strong> - Violates integrity rules, requires community agreement first
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Satellite Data */}
            <Card>
              <CardHeader>
                <CardTitle>Remote Sensing Archives</CardTitle>
                <CardDescription>ML-based reconstruction of historical land use from satellite imagery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Landsat Archive (1972-Present)</h4>
                    <p className="text-sm text-slate-700">
                      50+ years of medium-resolution imagery enabling historical reconstruction of forest cover, deforestation events, and recovery patterns
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">MODIS Time Series (2000-Present)</h4>
                    <p className="text-sm text-slate-700">
                      Daily global coverage at 250m resolution, enabling rapid change detection and disturbance identification
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Sentinel-1 Radar (2015-Present)</h4>
                    <p className="text-sm text-slate-700">
                      Cloud-penetrating synthetic aperture radar for year-round monitoring regardless of weather or season
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">ML-Based Reconstruction</h4>
                    <p className="text-sm text-slate-700">
                      Pattern recognition algorithms fill data gaps and classify land use through temporal patterns and spectral signatures
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Governance Tab */}
          <TabsContent value="governance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Indigenous Land Recognition & Protection</CardTitle>
                <CardDescription>Geospatial governance layers and immutable records</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Community Consent Validation</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-emerald-50">
                        <p className="font-semibold text-sm text-emerald-900">Digital Identity Registry</p>
                        <p className="text-xs text-emerald-800">Verified community leadership and decision-making authority</p>
                      </div>

                      <div className="p-3 border rounded-lg bg-blue-50">
                        <p className="font-semibold text-sm text-blue-900">Consent Registries</p>
                        <p className="text-xs text-blue-800">Immutable records of community approval for land use projects</p>
                      </div>

                      <div className="p-3 border rounded-lg bg-purple-50">
                        <p className="font-semibold text-sm text-purple-900">Dispute Resolution</p>
                        <p className="text-xs text-purple-800">Community-based mechanisms for addressing grievances</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Sacred Land Protection</h3>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg bg-amber-50">
                        <p className="font-semibold text-sm text-amber-900">Geo-Fencing</p>
                        <p className="text-xs text-amber-800">Blockchain-verified spatial boundaries for sacred sites</p>
                      </div>

                      <div className="p-3 border rounded-lg bg-pink-50">
                        <p className="font-semibold text-sm text-pink-900">Cultural Integrity</p>
                        <p className="text-xs text-pink-800">Off-limits to commercialization, protected by smart contracts</p>
                      </div>

                      <div className="p-3 border rounded-lg bg-indigo-50">
                        <p className="font-semibold text-sm text-indigo-900">Perpetual Trust</p>
                        <p className="text-xs text-indigo-800">Intergenerational stewardship enforced through governance</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-l-green-600 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900 mb-2">Ethical Design Principle</p>
                  <p className="text-sm text-green-800">
                    Some projects are simply non-issuable by design. Sacred lands, culturally sensitive territories, and areas without genuine community consent cannot participate in the marketplace—no exceptions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bioregional Governance Framework</CardTitle>
                <CardDescription>Decentralized, justice-aware decision-making</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Local Bioregional Councils</h4>
                    <p className="text-sm text-slate-700">
                      Community-elected representatives govern zone-level policies, credit issuance, and dispute resolution
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Intergenerational Equity Rules</h4>
                    <p className="text-sm text-slate-700">
                      Permanent trusts ensure decision-making considers impacts on future generations (100+ year horizon)
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Feedback Loops</h4>
                    <p className="text-sm text-slate-700">
                      Real-time measurement data enables adaptive governance and rapid policy adjustments
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Transparency Archive</h4>
                    <p className="text-sm text-slate-700">
                      All governance decisions, credit issuances, and disputes are recorded on-chain
                    </p>
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

export default Bioregions;