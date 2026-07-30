import React, { useState, useMemo, Suspense } from "react";
import SEO from "@/components/SEO";
import { useSEO } from "@/hooks/useSEO";
import PageLayout from "@/components/PageLayout";
import { RegenerativeMarketplaceShowcase } from "@/components/marketplace/RegenerativeMarketplaceShowcase";
import { ImpactDashboard } from "@/components/marketplace/ImpactDashboard";
import { ReFiConsole } from "@/components/marketplace/ReFiConsole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, Zap, ShoppingCart, TrendingUp, Users, DollarSign, GitCompareArrows, Check } from "lucide-react";
import { useProjects } from "@/hooks/useMarketplace";
import { useSocket, useRealtimeMarketplace } from "@/hooks/useSocket";
import { MarketplaceOverviewTab } from "@/components/marketplace/MarketplaceOverviewTab";
import { MarketplaceRiusTab } from "@/components/marketplace/MarketplaceRiusTab";
import { MarketplaceBuyersTab } from "@/components/marketplace/MarketplaceBuyersTab";
import { MarketplaceBondsTab } from "@/components/marketplace/MarketplaceBondsTab";
import { MarketplaceApisTab } from "@/components/marketplace/MarketplaceApisTab";
import type { SortBy, FilterType } from "@/utils/marketplaceUtils";
import { filterAndSortProjects, formatFilterName } from "@/utils/marketplaceUtils";
import type { CarbonProject } from "@/types/marketplace";
import { ProjectComparisonModal } from "@/components/marketplace/ProjectComparisonModal";
import { PriceAlertForm } from "@/components/marketplace/PriceAlertForm";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/api/client";

const Marketplace = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("trending");
  const { data: projects = [], isLoading } = useProjects();

  // Live market stats from API
  const { data: marketStats } = useQuery({
    queryKey: ['riu-market'],
    queryFn: () => apiService.marketplace.getRIUMarket(),
    refetchInterval: 30_000,
  });
  
  // Compare projects state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<CarbonProject[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  
  const toggleCompareProject = (project: CarbonProject) => {
    if (selectedForCompare.find(p => p.id === project.id)) {
      setSelectedForCompare(selectedForCompare.filter(p => p.id !== project.id));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, project]);
    }
  };
  
  const resetCompare = () => {
    setIsCompareMode(false);
    setSelectedForCompare([]);
  };

  // Real-time hooks
  const { isConnected } = useSocket({ channels: ['marketplace'] });
  const { marketplaceActivity } = useRealtimeMarketplace();

  const seoData = useSEO({
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Regenerative Agriculture Marketplace",
      "description": "Browse and invest in regenerative agriculture projects, carbon credits, and sustainable farming initiatives",
      "url": "https://atlasgenesis.com/marketplace",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": projects.length,
        "itemListElement": projects.slice(0, 10).map((project, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": project.title,
            "description": project.description,
            "offers": {
              "@type": "Offer",
              "price": project.price_per_credit,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "category": project.project_type
          }
        }))
      }
    }
  });

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return filterAndSortProjects(projects, searchQuery, selectedFilter, sortBy);
  }, [projects, searchQuery, selectedFilter, sortBy]);

  // Show skeleton while loading
  if (isLoading) {
    const MarketplaceSkeleton = React.lazy(() => import('@/components/skeletons/MarketplaceSkeleton'));
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <MarketplaceSkeleton />
      </Suspense>
    );
  }

  return (
    <>
      <SEO {...seoData} />
      <PageLayout>
        <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Marketplace & Financial Infrastructure</h1>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground">
            Regenerative Impact Units (RIUs), tiered buyer system, ESG APIs, and regeneration-backed bonds
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search projects by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border/50 focus:border-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                  className="gap-1.5"
                >
                  <Filter className="w-4 h-4" />
                  All Projects
                </Button>
                {["reforestation", "renewable_energy", "soil_carbon", "ocean_restoration"].map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter as FilterType)}
                  >
                    {formatFilterName(filter)}
                  </Button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                {[
                  { value: "trending" as const, label: "Trending" },
                  { value: "newest" as const, label: "Newest" },
                  { value: "price" as const, label: "Price (Low to High)" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
                
                {/* Compare Projects Button */}
                <div className="ml-auto flex items-center gap-2">
                  <PriceAlertForm />
                  {!isCompareMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCompareMode(true)}
                      className="gap-2 border-border/50 hover:border-primary/50"
                    >
                      <GitCompareArrows className="w-4 h-4" />
                      Compare Projects
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 p-2 bg-card border border-primary/30 rounded-lg"
                    >
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {selectedForCompare.length}/3 selected
                      </Badge>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setShowCompareModal(true)}
                        disabled={selectedForCompare.length < 2}
                        className="gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Compare
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetCompare}
                        className="gap-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Selected Projects Preview */}
              <AnimatePresence>
                {isCompareMode && selectedForCompare.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2"
                  >
                    {selectedForCompare.map((project) => (
                      <Badge
                        key={project.id}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-destructive/20"
                        onClick={() => toggleCompareProject(project)}
                      >
                        {project.title}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Count */}
              {searchQuery || selectedFilter !== "all" ? (
                <div className="text-sm text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? "s" : ""}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
        
        {/* Project Comparison Modal */}
        <ProjectComparisonModal
          projects={selectedForCompare}
          isOpen={showCompareModal}
          onClose={() => {
            setShowCompareModal(false);
            resetCompare();
          }}
        />

        {/* Regenerative Marketplace Showcase - Categorical Display */}
        <div className="mb-16">
          <RegenerativeMarketplaceShowcase 
            projects={filteredProjects} 
            isLoading={isLoading}
            isCompareMode={isCompareMode}
            selectedForCompare={selectedForCompare}
            onToggleCompare={toggleCompareProject}
          />
        </div>

        {/* Real-time Activity Feed */}
        {marketplaceActivity.length > 0 && (
          <Card className="mb-8 border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Live Marketplace Activity
              </CardTitle>
              <CardDescription>Recent transactions and listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketplaceActivity.slice(0, 5).map((activity, index) => (
                  <div key={`${activity.listingId}-${index}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.type === 'listing_created' && `New RIU listing: ${activity.data.quantity} units`}
                        {activity.type === 'purchase' && `RIU purchase: ${activity.data.quantity} units for $${activity.data.amount}`}
                        {activity.type === 'bid' && `New bid placed`}
                        {activity.type === 'offer' && `New offer submitted`}
                      </p>
                      <p className="text-xs text-muted-foreground">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics — sourced from live API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                RIUs in Circulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">
                {marketStats?.circulationM != null ? `${marketStats.circulationM}M` : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Regenerative Impact Units</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">
                {marketStats?.tradingVolume != null
                  ? `$${(marketStats.tradingVolume / 1_000_000).toFixed(2)}M`
                  : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Total trading value (YTD)</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">
                {marketStats?.totalRIUs != null ? marketStats.totalRIUs.toLocaleString() : '—'}
              </p>
              <p className="text-xs text-muted-foreground">Open RIU listings</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Avg Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold">
                {marketStats?.currentPrice != null ? `$${marketStats.currentPrice.toFixed(2)}` : '—'}
              </p>
              {marketStats?.ytdChange != null && (
                <p className="text-xs text-emerald-600">+{marketStats.ytdChange}% YTD</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 mb-4 sm:mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rius">RIUs</TabsTrigger>
            <TabsTrigger value="buyers">Buyers</TabsTrigger>
            <TabsTrigger value="bonds">Bonds</TabsTrigger>
            <TabsTrigger value="apis">APIs</TabsTrigger>
            <TabsTrigger value="impact">Impact Dashboard</TabsTrigger>
            <TabsTrigger value="refi">ReFi Console</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <MarketplaceOverviewTab />
          </TabsContent>

          {/* RIUs Tab */}
          <TabsContent value="rius">
            <MarketplaceRiusTab />
          </TabsContent>

          {/* Buyers Tab */}
          <TabsContent value="buyers">
            <MarketplaceBuyersTab />
          </TabsContent>

          {/* Bonds Tab */}
          <TabsContent value="bonds">
            <MarketplaceBondsTab />
          </TabsContent>

          {/* APIs Tab */}
          <TabsContent value="apis">
            <MarketplaceApisTab />
          </TabsContent>

          {/* Impact Dashboard Tab */}
          <TabsContent value="impact">
            <ImpactDashboard />
          </TabsContent>

          {/* ReFi Console Tab */}
          <TabsContent value="refi">
            <ReFiConsole />
          </TabsContent>
        </Tabs>
        </div>
      </PageLayout>
    </>
  );
};

export default Marketplace;
