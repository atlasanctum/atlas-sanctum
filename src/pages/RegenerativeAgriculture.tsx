import React, { useState } from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import EcosystemRecoveryTracker from "@/components/EcosystemRecoveryTracker";
import PageHero from "@/components/PageHero";
import { useRegenerativeMetrics } from "@/hooks/useRegenerativeMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Droplet, Bug, TrendingUp, Award } from "lucide-react";

const RegenerativeAgriculture = () => {
  const [selectedProjectId] = useState<string | undefined>("sample-project-1");

  // Fetch regenerative metrics
  const metrics = useRegenerativeMetrics(selectedProjectId);

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <PageHero
        title="Regenerative Agriculture & Ecosystem Recovery"
        subtitle="Soil microbiome health, crop diversity metrics, mangrove/kelp restoration, and pollinator recovery"
        ctaText="Explore Projects"
        ctaLink="#projects"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        badgeText="Sustainable Farming"
        stats={[
          { value: "82%", label: "Microbiome Health" },
          { value: "78%", label: "Biodiversity" },
          { value: "94%", label: "Water Retention" },
          { value: "35%", label: "Carbon Sequestration" }
        ]}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Impact Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Microbiome
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">82%</p>
              <p className="text-xs text-muted-foreground">Health</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Biodiversity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-xs text-muted-foreground">Index</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="h-4 w-4" />
                Crop Diversity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Pollinators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">450</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Water
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">88%</p>
              <p className="text-xs text-muted-foreground">Quality</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="recovery" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="recovery">Recovery Tracker</TabsTrigger>
            <TabsTrigger value="practices">Practices</TabsTrigger>
            <TabsTrigger value="income">Income Models</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          {/* Recovery Tracker Tab */}
          <TabsContent value="recovery" className="space-y-6">
            <EcosystemRecoveryTracker
              metrics={metrics.data}
              trend={metrics.trend || undefined}
              isLoading={metrics.isLoading}
            />
          </TabsContent>

          {/* Regenerative Practices Tab */}
          <TabsContent value="practices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regenerative Agriculture Practices</CardTitle>
                <CardDescription>Evidence-based methods for ecosystem recovery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Soil Health */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-emerald-600" />
                      Soil Regeneration
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-emerald-50">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-2">Cover Cropping</h4>
                        <p className="text-sm text-emerald-800">
                          Growing non-cash crops to protect and enrich soil between growing seasons
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-emerald-50">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-2">Composting</h4>
                        <p className="text-sm text-emerald-800">
                          Converting organic waste into nutrient-rich soil amendments
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-emerald-50">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-2">No-Till Farming</h4>
                        <p className="text-sm text-emerald-800">
                          Minimizing soil disturbance to preserve microbiome structure and function
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-emerald-50">
                        <h4 className="font-semibold text-sm text-emerald-900 mb-2">Crop Rotation</h4>
                        <p className="text-sm text-emerald-800">
                          Varying crops to maintain soil fertility and prevent disease buildup
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Biodiversity */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Biodiversity Enhancement
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">Polyculture</h4>
                        <p className="text-sm text-blue-800">
                          Growing multiple crop species together to increase genetic and functional diversity
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">Hedgerow Planting</h4>
                        <p className="text-sm text-blue-800">
                          Creating wildlife corridors with native trees and shrubs
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">Pollinator Habitat</h4>
                        <p className="text-sm text-blue-800">
                          Establishing flowering areas to support bees, butterflies, and other pollinators
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">Agroforestry</h4>
                        <p className="text-sm text-blue-800">
                          Integrating trees with crops and livestock for ecosystem services
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Water Management */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-cyan-600" />
                      Water & Soil Conservation
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-cyan-50">
                        <h4 className="font-semibold text-sm text-cyan-900 mb-2">Rainwater Harvesting</h4>
                        <p className="text-sm text-cyan-800">
                          Capturing and storing rainfall to reduce irrigation needs
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-cyan-50">
                        <h4 className="font-semibold text-sm text-cyan-900 mb-2">Contour Plowing</h4>
                        <p className="text-sm text-cyan-800">
                          Plowing along elevation lines to prevent erosion and runoff
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-cyan-50">
                        <h4 className="font-semibold text-sm text-cyan-900 mb-2">Riparian Buffers</h4>
                        <p className="text-sm text-cyan-800">
                          Vegetated zones along waterways to filter runoff and protect aquatic ecosystems
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-cyan-50">
                        <h4 className="font-semibold text-sm text-cyan-900 mb-2">Mulching</h4>
                        <p className="text-sm text-cyan-800">
                          Covering soil with organic material to retain moisture and prevent erosion
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Climate Adaptation */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      Climate Adaptation
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-amber-50">
                        <h4 className="font-semibold text-sm text-amber-900 mb-2">Crop Rotation Scheduling</h4>
                        <p className="text-sm text-amber-800">
                          Planning rotations based on climate projections and seasonality
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-amber-50">
                        <h4 className="font-semibold text-sm text-amber-900 mb-2">Drought-Resistant Varieties</h4>
                        <p className="text-sm text-amber-800">
                          Selecting and breeding crops suited to changing climate patterns
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-amber-50">
                        <h4 className="font-semibold text-sm text-amber-900 mb-2">Pest Management</h4>
                        <p className="text-sm text-amber-800">
                          Using biological controls and integrated pest management to reduce inputs
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-amber-50">
                        <h4 className="font-semibold text-sm text-amber-900 mb-2">Diversity for Resilience</h4>
                        <p className="text-sm text-amber-800">
                          Multiple crops and varieties provide buffer against climate shocks
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Models Tab */}
          <TabsContent value="income" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recurring Regenerative Income</CardTitle>
                <CardDescription>Farmers earn steady income for ecosystem function</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Direct Income Streams</h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-emerald-900">Soil Health Credits</h4>
                          <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-1 rounded">Monthly</span>
                        </div>
                        <p className="text-sm text-emerald-800 mb-2">
                          Earn $50-150/acre/month based on microbiome health scores
                        </p>
                        <p className="text-xs text-emerald-700">Measured via eDNA analysis every 30 days</p>
                      </div>

                      <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-blue-900">Biodiversity Credits</h4>
                          <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">Quarterly</span>
                        </div>
                        <p className="text-sm text-blue-800 mb-2">
                          Earn $100-300/acre/quarter for native species recovery
                        </p>
                        <p className="text-xs text-blue-700">Verified through bioacoustic monitoring</p>
                      </div>

                      <div className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-pink-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-pink-900">Pollinator Bonuses</h4>
                          <span className="text-xs bg-pink-200 text-pink-900 px-2 py-1 rounded">Seasonal</span>
                        </div>
                        <p className="text-sm text-pink-800 mb-2">
                          $200-500/acre/season when pollinator counts hit targets
                        </p>
                        <p className="text-xs text-pink-700">Measured via sensor networks & visual surveys</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Stacking Opportunities</h3>
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-amber-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-amber-900">Carbon Sequestration</h4>
                          <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded">Annual</span>
                        </div>
                        <p className="text-sm text-amber-800 mb-2">
                          $20-80/ton of CO₂ sequestered in soil and biomass
                        </p>
                        <p className="text-xs text-amber-700">Verified through soil sampling and satellite imagery</p>
                      </div>

                      <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-purple-900">Water Quality Premium</h4>
                          <span className="text-xs bg-purple-200 text-purple-900 px-2 py-1 rounded">Quarterly</span>
                        </div>
                        <p className="text-sm text-purple-800 mb-2">
                          Bonus payments for watershed protection and reduced runoff
                        </p>
                        <p className="text-xs text-purple-700">Measured via downstream water quality sensors</p>
                      </div>

                      <div className="p-4 border rounded-lg bg-gradient-to-r from-cyan-50 to-cyan-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-cyan-900">Community Impact</h4>
                          <span className="text-xs bg-cyan-200 text-cyan-900 px-2 py-1 rounded">Annual</span>
                        </div>
                        <p className="text-sm text-cyan-800 mb-2">
                          Additional payments for educational programs and local hiring
                        </p>
                        <p className="text-xs text-cyan-700">Verified through community surveys and employment data</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ecosystem Impact Dashboard</CardTitle>
                <CardDescription>Track your regenerative progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg text-center">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">+47%</div>
                    <p className="text-sm text-muted-foreground">Soil Health Improvement</p>
                    <p className="text-xs text-muted-foreground mt-1">Last 12 months</p>
                  </div>
                  <div className="p-6 border rounded-lg text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">+32%</div>
                    <p className="text-sm text-muted-foreground">Biodiversity Recovery</p>
                    <p className="text-xs text-muted-foreground mt-1">Native species count</p>
                  </div>
                  <div className="p-6 border rounded-lg text-center">
                    <div className="text-4xl font-bold text-amber-600 mb-2">2.4t</div>
                    <p className="text-sm text-muted-foreground">CO₂ Sequestered</p>
                    <p className="text-xs text-muted-foreground mt-1">Per acre annually</p>
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

export default RegenerativeAgriculture;