import React from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Wind, Droplet, Leaf } from "lucide-react";

const Health = () => {
  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <PageHero
        title="Human Health Integration"
        subtitle="Air quality credits, water restoration, urban health scores, and health system participation"
        ctaText="Explore Health Data"
        ctaLink="#health-data"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        badgeText="Health & Wellbeing"
        stats={[
          { value: "2.4M", label: "Lives Improved" },
          { value: "45%", label: "Pollution Reduction" },
          { value: "78%", label: "Water Quality" },
          { value: "32%", label: "Health Access" }
        ]}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl" id="health-data">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Lives Improved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2.4M</p>
              <p className="text-xs text-muted-foreground">Annual health impact</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wind className="h-4 w-4" />
                Air Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">45%</p>
              <p className="text-xs text-muted-foreground">Pollution reduction</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Water Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-xs text-muted-foreground">Cleaner watersheds</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Urban Green
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">23K</p>
              <p className="text-xs text-muted-foreground">Parks created</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="framework" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="framework">Framework</TabsTrigger>
            <TabsTrigger value="air">Air Quality</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            <TabsTrigger value="health">Health Systems</TabsTrigger>
          </TabsList>

          <TabsContent value="framework" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prevention Economics</CardTitle>
                <CardDescription>Why preventing disease outperforms treatment economically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border-l-4 border-l-emerald-500 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-800 font-semibold mb-2">Core Insight</p>
                  <p className="text-sm text-emerald-700">
                    Every $1 spent on disease prevention saves $7-10 in treatment costs. Regeneration creates this value automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Health Improvements from Regeneration</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 border rounded-lg bg-red-50">
                        <p className="font-semibold text-red-900">Respiratory Disease ↓ 35%</p>
                        <p className="text-xs text-red-800">From improved air quality + forest recovery</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <p className="font-semibold text-blue-900">Waterborne Illness ↓ 62%</p>
                        <p className="text-xs text-blue-800">From watershed restoration + riparian buffers</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-purple-50">
                        <p className="font-semibold text-purple-900">Heat Stroke ↓ 28%</p>
                        <p className="text-xs text-purple-800">From urban green canopy expansion</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-pink-50">
                        <p className="font-semibold text-pink-900">Mental Health Improvement +42%</p>
                        <p className="text-xs text-pink-800">From access to nature + community restoration work</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Healthcare Savings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 border rounded-lg">
                        <p className="font-semibold">Annual Savings per 1M RIUs Retired</p>
                        <p className="text-2xl font-bold text-green-600">$840M</p>
                        <p className="text-xs text-muted-foreground">In healthcare expenditure avoided</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-semibold">Earnings Gains</p>
                        <p className="text-2xl font-bold text-blue-600">$2.1B</p>
                        <p className="text-xs text-muted-foreground">From increased worker productivity</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-semibold">Life Expectancy Increase</p>
                        <p className="text-2xl font-bold text-emerald-600">+2.3 yrs</p>
                        <p className="text-xs text-muted-foreground">Per capita in restoration zones</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="air" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Air Quality Credits</CardTitle>
                <CardDescription>Direct health impact from atmospheric improvement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Pollutant Reduction Mechanisms</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg">
                        <p className="font-semibold text-sm">Particulate Matter (PM2.5)</p>
                        <p className="text-xs text-muted-foreground">Tree canopy filters 15-20% of particulates</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-semibold text-sm">Nitrogen Oxides (NOx)</p>
                        <p className="text-xs text-muted-foreground">Soil microbes and plants absorb NOx emissions</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-semibold text-sm">Volatile Organic Compounds (VOCs)</p>
                        <p className="text-xs text-muted-foreground">Natural processes break down chemical pollutants</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="font-semibold text-sm">Ozone (O₃)</p>
                        <p className="text-xs text-muted-foreground">Vegetation reduces ground-level ozone formation</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Health Credits Issued</h3>
                    <div className="space-y-2">
                      <div className="p-4 border rounded-lg bg-emerald-50">
                        <p className="font-bold text-emerald-900">$45/ton PM2.5 reduction</p>
                        <p className="text-xs text-emerald-800">Valued by health economics literature</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <p className="font-bold text-blue-900">$12/ton NOx reduction</p>
                        <p className="text-xs text-blue-800">EPA social cost of nitrogen oxides</p>
                      </div>
                      <div className="p-4 border rounded-lg bg-purple-50">
                        <p className="font-bold text-purple-900">Annual Health Credits</p>
                        <p className="text-xs text-purple-800">$2.4B issued across program participants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Water Restoration & Health</CardTitle>
                <CardDescription>Clean water as the foundation of public health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <p className="font-semibold text-sm text-blue-900">Pathogen Reduction</p>
                    <p className="text-2xl font-bold text-blue-600">87%</p>
                    <p className="text-xs text-blue-700">In restored watersheds</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-cyan-50">
                    <p className="font-semibold text-sm text-cyan-900">Nitrate Removal</p>
                    <p className="text-2xl font-bold text-cyan-600">92%</p>
                    <p className="text-xs text-cyan-700">Agricultural runoff eliminated</p>
                  </div>

                  <div className="p-4 border rounded-lg bg-teal-50">
                    <p className="font-semibold text-sm text-teal-900">Pesticide Removal</p>
                    <p className="text-2xl font-bold text-teal-600">78%</p>
                    <p className="text-xs text-teal-700">Chemical contamination reduced</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health System Integration</CardTitle>
                <CardDescription>Insurance companies and governments participate in regenerative financing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Insurer Participation</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <p className="font-semibold text-sm text-blue-900">Premium Reductions</p>
                        <p className="text-xs text-blue-800">5-15% lower health premiums for people in high-regeneration areas</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-emerald-50">
                        <p className="font-semibold text-sm text-emerald-900">RIU Ownership</p>
                        <p className="text-xs text-emerald-800">Insurers buy/retire RIUs as investment in preventive health</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-purple-50">
                        <p className="font-semibold text-sm text-purple-900">Claims Reduction</p>
                        <p className="text-xs text-purple-800">18% fewer respiratory/water-borne illness claims tracked</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Government Integration</h3>
                    <div className="space-y-2">
                      <div className="p-3 border rounded-lg bg-amber-50">
                        <p className="font-semibold text-sm text-amber-900">Public Health Investment</p>
                        <p className="text-xs text-amber-800">Governments allocate climate budgets to RIU purchases</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-pink-50">
                        <p className="font-semibold text-sm text-pink-900">Healthcare Savings</p>
                        <p className="text-xs text-pink-800">Every $1 spent on RIUs saves $8-12 in healthcare costs</p>
                      </div>
                      <div className="p-3 border rounded-lg bg-cyan-50">
                        <p className="font-semibold text-sm text-cyan-900">NDC Alignment</p>
                        <p className="text-xs text-cyan-800">RIU investments count toward climate commitments</p>
                      </div>
                    </div>
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

export default Health;
