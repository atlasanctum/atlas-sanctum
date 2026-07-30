import React, { useState } from "react";
import EnterpriseHeader from "@/components/EnterpriseHeader";
import { useMeasurementData } from "@/hooks/useMeasurementData";
import { useRegenerativeMetrics } from "@/hooks/useRegenerativeMetrics";
import { useBioregionalZones } from "@/hooks/useBioregionalZones";
import { useValuationModel } from "@/hooks/useValuationModel";
import PlanetaryMeasurementDashboard from "@/components/PlanetaryMeasurementDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Satellite, Leaf, TrendingUp, Shield, Activity } from "lucide-react";

const Measurements = () => {
  // Sample project ID - in a real app this would come from URL params or user selection
  const [selectedProjectId] = useState<string | undefined>("sample-project-1");
  const [selectedZoneIds] = useState<string[] | undefined>(["zone-1"]);

  // Fetch all measurement data
  const measurements = useMeasurementData(selectedProjectId);
  const regenerativeMetrics = useRegenerativeMetrics(selectedProjectId);
  const bioregionalZones = useBioregionalZones(selectedZoneIds);
  const valuationModel = useValuationModel(selectedProjectId);

  const isLoading = measurements.isLoading || regenerativeMetrics.isLoading;

  return (
    <div className="min-h-screen bg-background">
      <EnterpriseHeader />
      
      {/* New Planetary Measurement Dashboard */}
      <PlanetaryMeasurementDashboard />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-left-4 border-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Satellite className="h-4 w-4" />
                Satellite Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Sentinel-2</p>
              <p className="text-xs text-muted-foreground">Landsat, Earth Engine</p>
            </CardContent>
          </Card>

          <Card className="border-left-4 border-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Soil Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">NIR</p>
              <p className="text-xs text-muted-foreground">Soil probes, spectroscopy</p>
            </CardContent>
          </Card>

          <Card className="border-left-4 border-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Ocean Carbon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Argo</p>
              <p className="text-xs text-muted-foreground">Alkalinity sensors, floats</p>
            </CardContent>
          </Card>

          <Card className="border-left-4 border-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Biodiversity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">eDNA</p>
              <p className="text-xs text-muted-foreground">Bioacoustic, sequencing</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="satellite">Satellite Data</TabsTrigger>
            <TabsTrigger value="ground">Ground Sensors</TabsTrigger>
            <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Measurement & Verification System
                </CardTitle>
                <CardDescription>
                  Comprehensive environmental monitoring platform for real-time ecological data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Carbon Flux Monitoring</h4>
                    <p className="text-sm text-green-700">
                      Satellite-derived carbon sequestration rates, GPP, ecosystem respiration, and NEE measurements
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Soil Health Tracking</h4>
                    <p className="text-sm text-amber-700">
                      Moisture, nutrients, pH, organic matter, and microbial activity from ground sensors
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Deforestation Alerts</h4>
                    <p className="text-sm text-blue-700">
                      Real-time detection of forest cover change with automated alerts and verification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Satellite Data Tab */}
          <TabsContent value="satellite" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Satellite Data Sources</CardTitle>
                <CardDescription>Integration with public and private satellite networks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Sentinel-2 (ESA)</h4>
                    <p className="text-sm text-muted-foreground">
                      12-day revisit cycle, 10m resolution, multispectral analysis for NDVI and vegetation health
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Landsat-8 (USGS)</h4>
                    <p className="text-sm text-muted-foreground">
                      16-day revisit cycle, 30m resolution, thermal and surface reflectance data
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Earth Engine</h4>
                    <p className="text-sm text-muted-foreground">
                      Automated processing of satellite imagery, temporal analysis, cloud removal
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Planet Labs</h4>
                    <p className="text-sm text-muted-foreground">
                      Daily revisit, 3m resolution, rapid change detection for near real-time monitoring
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ground Sensors Tab */}
          <TabsContent value="ground" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ground-Based Sensor Network</CardTitle>
                <CardDescription>IoT sensors for soil and environmental monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl">🌱</div>
                    <div>
                      <h4 className="font-semibold">Soil Moisture Probes</h4>
                      <p className="text-sm text-muted-foreground">
                        Capacitive and TDR sensors measuring volumetric water content at multiple depths
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl">🧪</div>
                    <div>
                      <h4 className="font-semibold">NIR Spectroscopy</h4>
                      <p className="text-sm text-muted-foreground">
                        Non-destructive nutrient analysis including NPK, organic matter, and pH
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl">🦠</div>
                    <div>
                      <h4 className="font-semibold">Microbial Activity Sensors</h4>
                      <p className="text-sm text-muted-foreground">
                        Soil respiration and enzyme activity indicators for soil health assessment
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biodiversity Tab */}
          <TabsContent value="biodiversity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biodiversity Monitoring Systems</CardTitle>
                <CardDescription>Advanced detection and identification of species diversity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl">🎤</div>
                    <div>
                      <h4 className="font-semibold">Acoustic Monitoring</h4>
                      <p className="text-sm text-muted-foreground">
                        Automated species detection through bioacoustic analysis and vocalization patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl">📷</div>
                    <div>
                      <h4 className="font-semibold">Camera Traps</h4>
                      <p className="text-sm text-muted-foreground">
                        Motion-activated cameras with AI species identification and activity patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="text-2xl">🧬</div>
                    <div>
                      <h4 className="font-semibold">eDNA Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Environmental DNA sequencing for comprehensive species inventory without direct observation
                      </p>
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

export default Measurements;
