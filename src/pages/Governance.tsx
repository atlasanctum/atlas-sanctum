import React, { useState } from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Users, Shield, Gavel, Lightbulb, Lock } from "lucide-react";

const Governance = () => {
  const [selectedCouncil, setSelectedCouncil] = useState<string>("amazon-council");

  const councils = [
    {
      id: "amazon-council",
      name: "Amazon Basin Bioregional Council",
      members: 12,
      status: "active",
      indigenous_representation: "67%",
      recent_decisions: 8,
      sacred_lands_protected: 2400000,
    },
    {
      id: "coral-council",
      name: "Coral Triangle Governance Forum",
      members: 8,
      status: "active",
      indigenous_representation: "50%",
      recent_decisions: 5,
      sacred_lands_protected: 450000,
    },
    {
      id: "boreal-council",
      name: "Boreal Forest Ethics Committee",
      members: 10,
      status: "active",
      indigenous_representation: "60%",
      recent_decisions: 6,
      sacred_lands_protected: 1200000,
    },
  ];

  const currentCouncil = councils.find((c) => c.id === selectedCouncil) || councils[0];

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      <PageHero
        title="Ethical, Cultural & Spiritual Governance"
        subtitle="Indigenous-led councils, sacred land protection, cultural preservation, and ethical impact governance"
        ctaText="Explore Councils"
        ctaLink="#councils"
        secondaryCtaText="Learn More"
        secondaryCtaLink="/about"
        badgeText="Indigenous-Led Governance"
        stats={[
          { value: councils.length.toString(), label: "Active Councils" },
          { value: "61%", label: "Indigenous Representation" },
          { value: "4.05M", label: "Hectares Protected" },
          { value: "19", label: "Recent Decisions" }
        ]}
      />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="overview" className="w-full" id="councils">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="councils">Bioregional Councils</TabsTrigger>
            <TabsTrigger value="sacred">Sacred Lands</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle>Governance Overview</CardTitle>
                <CardDescription>Our governance model is built on indigenous wisdom, community consent, and intergenerational equity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Key Principles</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-pink-700">
                        <Heart className="h-4 w-4" />
                        <span>Community Consent-Based Decision Making</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-pink-700">
                        <Shield className="h-4 w-4" />
                        <span>Sacred Land Protection as Priority</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-pink-700">
                        <Users className="h-4 w-4" />
                        <span>Equitable Representation (67% Indigenous)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Impact Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <Gavel className="h-4 w-4" />
                        <span>8 Recent Decisions Approved</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <Lightbulb className="h-4 w-4" />
                        <span>12 Council Members Active</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-700">
                        <Lock className="h-4 w-4" />
                        <span>2.4M Hectares Protected</span>
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

export default Governance;
