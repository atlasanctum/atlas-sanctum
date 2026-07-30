import React from "react";
import SEO from "@/components/SEO";
import { useSEO } from "@/hooks/useSEO";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import Footer from "@/components/Footer";
import { ArrowRight, Leaf, Droplets, Sun, Wind, TreePine, Globe, CheckCircle, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface VerifiedProject {
  id: string;
  name: string;
  organization: string;
  location: string;
  category: string;
  description: string;
  impactMetrics: {
    carbonOffset: string;
    waterConserved: string;
    renewableEnergy: string;
    biodiversityScore: number;
  };
  fundingProgress: number;
  fundingGoal: string;
  verificationTier: string;
  imageUrl: string;
}

const verifiedProjects: VerifiedProject[] = [
  {
    id: "1",
    name: "Amazon Rainforest Restoration Initiative",
    organization: "Green Earth Alliance",
    location: "Brazil - Amazon Basin",
    category: "Forest Restoration",
    description: "Large-scale reforestation project restoring degraded Amazon rainforest areas with native species.",
    impactMetrics: {
      carbonOffset: "125,000 tCO2e",
      waterConserved: "450M liters",
      renewableEnergy: "85%",
      biodiversityScore: 92,
    },
    fundingProgress: 78,
    fundingGoal: "$2.5M",
    verificationTier: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
  },
  {
    id: "2",
    name: "Mangrove Coastal Protection Network",
    organization: "Ocean Guardians Foundation",
    location: "Kenya - Lamu Coast",
    category: "Coastal Conservation",
    description: "Mangrove restoration protecting coastal communities while sequestering carbon.",
    impactMetrics: {
      carbonOffset: "89,000 tCO2e",
      waterConserved: "1.2B liters",
      renewableEnergy: "72%",
      biodiversityScore: 88,
    },
    fundingProgress: 65,
    fundingGoal: "$1.8M",
    verificationTier: "Platinum",
    imageUrl: "https://images.unsplash.com/photo-1534239143101-1b1c627395c5?w=800",
  },
  {
    id: "3",
    name: "Regenerative Agriculture Hub - East Africa",
    organization: "Agroecology Initiative",
    location: "Tanzania - Arusha Region",
    category: "Sustainable Agriculture",
    description: "Teaching regenerative farming practices to 10,000 smallholder farmers.",
    impactMetrics: {
      carbonOffset: "45,000 tCO2e",
      waterConserved: "320M liters",
      renewableEnergy: "68%",
      biodiversityScore: 85,
    },
    fundingProgress: 52,
    fundingGoal: "$950K",
    verificationTier: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
  },
  {
    id: "4",
    name: "Solar Cooperative Grid Expansion",
    organization: "Renewable Energy Collective",
    location: "India - Rajasthan",
    category: "Renewable Energy",
    description: "Community-owned solar grids bringing clean energy to 50,000 rural households.",
    impactMetrics: {
      carbonOffset: "210,000 tCO2e",
      waterConserved: "890M liters",
      renewableEnergy: "100%",
      biodiversityScore: 78,
    },
    fundingProgress: 89,
    fundingGoal: "$4.2M",
    verificationTier: "Platinum",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
  },
  {
    id: "5",
    name: "Indigenous Land Stewardship Program",
    organization: "Traditional Knowledge Keepers",
    location: "Australia - Northern Territory",
    category: "Land Management",
    description: "Partnering with Indigenous communities to manage fire-resilient landscapes.",
    impactMetrics: {
      carbonOffset: "178,000 tCO2e",
      waterConserved: "670M liters",
      renewableEnergy: "45%",
      biodiversityScore: 96,
    },
    fundingProgress: 41,
    fundingGoal: "$1.2M",
    verificationTier: "Diamond",
    imageUrl: "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800",
  },
  {
    id: "6",
    name: "Mediterranean Reforestation Corridor",
    organization: "European Green Initiative",
    location: "Greece - Crete",
    category: "Forest Restoration",
    description: "Creating wildlife corridors through reforestation of burned areas.",
    impactMetrics: {
      carbonOffset: "67,000 tCO2e",
      waterConserved: "280M liters",
      renewableEnergy: "55%",
      biodiversityScore: 91,
    },
    fundingProgress: 73,
    fundingGoal: "$1.5M",
    verificationTier: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
  },
  {
    id: "7",
    name: "Wetland Restoration Network",
    organization: "Freshwater Conservation Society",
    location: "Netherlands - Delta Region",
    category: "Coastal Conservation",
    description: "Restoring wetlands to filter water and create wildlife habitats.",
    impactMetrics: {
      carbonOffset: "95,000 tCO2e",
      waterConserved: "2.1B liters",
      renewableEnergy: "62%",
      biodiversityScore: 89,
    },
    fundingProgress: 68,
    fundingGoal: "$2.1M",
    verificationTier: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800",
  },
  {
    id: "8",
    name: "Community Wind Farm Initiative",
    organization: "Rural Energy Cooperative",
    location: "Scotland - Highlands",
    category: "Renewable Energy",
    description: "Small-scale wind turbines powering 30,000 off-grid homes.",
    impactMetrics: {
      carbonOffset: "156,000 tCO2e",
      waterConserved: "540M liters",
      renewableEnergy: "100%",
      biodiversityScore: 82,
    },
    fundingProgress: 84,
    fundingGoal: "$3.2M",
    verificationTier: "Platinum",
    imageUrl: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800",
  },
  {
    id: "9",
    name: "Agroforestry Training Program",
    organization: "Sustainable Farming Institute",
    location: "Peru - Amazon Region",
    category: "Sustainable Agriculture",
    description: "Training indigenous communities in agroforestry techniques.",
    impactMetrics: {
      carbonOffset: "78,000 tCO2e",
      waterConserved: "380M liters",
      renewableEnergy: "48%",
      biodiversityScore: 94,
    },
    fundingProgress: 55,
    fundingGoal: "$1.1M",
    verificationTier: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800",
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Forest Restoration": <TreePine className="w-4 h-4" />,
  "Coastal Conservation": <Droplets className="w-4 h-4" />,
  "Sustainable Agriculture": <Leaf className="w-4 h-4" />,
  "Renewable Energy": <Sun className="w-4 h-4" />,
  "Land Management": <Globe className="w-4 h-4" />,
};

const verificationTierColors: Record<string, string> = {
  Gold: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Platinum: "bg-slate-400/10 text-slate-400 border-slate-400/20",
  Diamond: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const ExploreVerifiedProjectsPage: React.FC = () => {
  const seoData = useSEO({
    title: "Explore Verified Projects | Atlas Sanctum",
    description: "Discover and support blockchain-verified regeneration projects making real impact on climate, biodiversity, and communities worldwide.",
  });

  return (
    <>
      <SEO {...seoData} />
      <div className="min-h-screen bg-background">
        <EnterpriseHeader />
        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
              <div className="text-center">
                <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-primary/20 text-primary">
                  🌱 Join the Regenerative Revolution
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Explore Verified Projects
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Discover and support blockchain-verified regeneration projects making real impact on climate, biodiversity, and communities worldwide.
                </p>
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {verifiedProjects.map((project) => (
                  <Card key={project.id} className="h-full overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm">
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge
                        className={`absolute top-4 right-4 border ${
                          verificationTierColors[project.verificationTier]
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {project.verificationTier}
                      </Badge>
                      <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground">
                        {categoryIcons[project.category]}
                        <span className="ml-1">{project.category}</span>
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg md:text-xl line-clamp-1 group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {project.location}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Impact Metrics */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-muted/30 rounded-lg p-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Leaf className="w-3 h-3 text-green-500" />
                            Carbon Offset
                          </div>
                          <div className="font-semibold text-sm">{project.impactMetrics.carbonOffset}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Droplets className="w-3 h-3 text-blue-500" />
                            Water Conserved
                          </div>
                          <div className="font-semibold text-sm">{project.impactMetrics.waterConserved}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Sun className="w-3 h-3 text-yellow-500" />
                            Renewable
                          </div>
                          <div className="font-semibold text-sm">{project.impactMetrics.renewableEnergy}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Wind className="w-3 h-3 text-purple-500" />
                            Biodiversity
                          </div>
                          <div className="font-semibold text-sm">{project.impactMetrics.biodiversityScore}/100</div>
                        </div>
                      </div>

                      {/* Funding Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Funding Progress</span>
                          <span className="font-semibold">{project.fundingProgress}%</span>
                        </div>
                        <Progress value={project.fundingProgress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Goal: {project.fundingGoal}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        View Project Details
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* CTA Section */}
              <div className="mt-12 md:mt-16 text-center">
                <div className="bg-primary/5 rounded-2xl p-8 md:p-12 border border-primary/10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to Make a Difference?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Every contribution supports verified regeneration projects with transparent impact tracking and blockchain verification.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="text-lg px-8">
                      Fund a Project
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Submit Your Project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ExploreVerifiedProjectsPage;
