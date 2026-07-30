import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BioregionalZone } from "@/types/marketplace";
import { MapPin, Shield, AlertTriangle, Globe, BarChart3 } from "lucide-react";

interface BioregionalMapProps {
  zones: BioregionalZone[];
  selectedZone?: BioregionalZone;
  onSelectZone?: (zone: BioregionalZone) => void;
  isLoading?: boolean;
}

const getRiskColor = (riskLevel: string | null): string => {
  switch (riskLevel) {
    case "critical": return "bg-red-600";
    case "high": return "bg-orange-600";
    case "medium": return "bg-yellow-600";
    case "low": return "bg-green-600";
    default: return "bg-gray-600";
  }
};

const getClimateColor = (climateType: string | null): string => {
  if (!climateType) return "bg-gray-600";
  if (climateType.toLowerCase().includes("tropical")) return "bg-emerald-700";
  if (climateType.toLowerCase().includes("marine")) return "bg-blue-600";
  if (climateType.toLowerCase().includes("temperate")) return "bg-orange-600";
  return "bg-slate-600";
};

export const BioregionalMap: React.FC<BioregionalMapProps> = ({
  zones = [],
  selectedZone,
  onSelectZone,
  isLoading = false,
}) => {
  // Simple statistical summary of zones
  const zoneStats = useMemo(() => {
    return {
      total_area: zones.reduce((sum, z) => sum + (z.total_area_hectares || 0), 0),
      avg_biodiversity: zones.reduce((sum, z) => sum + (z.biodiversity_index || 0), 0) / (zones.length || 1),
      critical_zones: zones.filter((z) => z.risk_level === "critical" || z.risk_level === "high").length,
      avg_carbon_rate: zones.reduce((sum, z) => sum + (z.carbon_sequestration_rate || 0), 0) / (zones.length || 1),
    };
  }, [zones]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bioregional Intelligence Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-b from-slate-200 to-slate-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Total Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{(zoneStats.total_area / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground">hectares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              High Risk Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{zoneStats.critical_zones}</p>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Carbon Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{zoneStats.avg_carbon_rate.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">t CO₂/ha/yr avg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Biodiversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{(zoneStats.avg_biodiversity * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Average Index</p>
          </CardContent>
        </Card>
      </div>

      {/* Map Container (Placeholder - real implementation would use Mapbox/Leaflet) */}
      <Card>
        <CardHeader>
          <CardTitle>Bioregional Zone Map</CardTitle>
          <CardDescription>Interactive PostGIS-powered geospatial visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-96 bg-gradient-to-br from-blue-50 via-emerald-50 to-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center"
            aria-label="Bioregional map visualization"
            role="img"
          >
            <div className="text-center">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-semibold">Bioregional Map</p>
              <p className="text-sm text-muted-foreground">Powered by PostGIS & Mapbox</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone Details List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Bioregional Zones</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <Card
              key={zone.id}
              className={`cursor-pointer transition-all ${selectedZone?.id === zone.id ? "ring-2 ring-primary" : "hover:shadow-lg"}`}
              onClick={() => onSelectZone?.(zone)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectZone?.(zone);
                }
              }}
              role="button"
              aria-label={`Select bioregional zone: ${zone.name}`}
              aria-pressed={selectedZone?.id === zone.id}
              tabIndex={0}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{zone.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">{zone.country} • {zone.region}</CardDescription>
                  </div>
                  <div className={`${getClimateColor(zone.climate_type)} rounded-full p-2`}>
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Climate Type */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">Climate Type</span>
                    <Badge variant="outline">{zone.climate_type || "Unknown"}</Badge>
                  </div>
                </div>

                {/* Area */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Area</span>
                  <span className="font-semibold">{zone.total_area_hectares?.toLocaleString() || "—"} ha</span>
                </div>

                {/* Risk Level */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-orange-700">Risk Level</span>
                    <Badge className={`${getRiskColor(zone.risk_level)} text-white`}>
                      {zone.risk_level || "Unknown"}
                    </Badge>
                  </div>
                </div>

                {/* Carbon Sequestration */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Carbon Rate</span>
                  <span className="font-bold text-emerald-600">{zone.carbon_sequestration_rate?.toFixed(1) || "—"} t/ha/yr</span>
                </div>

                {/* Biodiversity Index */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-emerald-700">Biodiversity Index</span>
                    <span className="text-xs font-bold text-emerald-700">{((zone.biodiversity_index || 0) * 100).toFixed(0)}%</span>
                  </div>
                  <progress
                    value={(zone.biodiversity_index || 0) * 100}
                    max="100"
                    aria-label={`Biodiversity index: ${((zone.biodiversity_index || 0) * 100).toFixed(0)}%`}
                    className="w-full h-2 rounded-full [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
                  />
                </div>

                {/* Active Projects */}
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Active Projects</span>
                  <span className="font-bold text-purple-600">{zone.active_projects || 0}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Zone Details Panel */}
      {selectedZone && (
        <Card
          className="border-2 border-primary bg-gradient-to-br from-slate-50 to-blue-50"
          aria-live="polite"
          aria-label="Selected zone details"
        >
          <CardHeader>
            <CardTitle>Selected Zone Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Zone Name</h4>
                  <p className="text-lg font-bold">{selectedZone.name}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Location</h4>
                  <p className="text-lg font-bold">{selectedZone.country}, {selectedZone.region}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Climate Type</h4>
                  <p className="text-lg">{selectedZone.climate_type || "Not specified"}</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Area</h4>
                  <p className="text-lg font-bold">{selectedZone.total_area_hectares?.toLocaleString() || "N/A"} hectares</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Risk Level</h4>
                  <Badge className={`${getRiskColor(selectedZone.risk_level)} text-white`}>
                    {selectedZone.risk_level || "Unknown"}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Carbon Sequestration</h4>
                  <p className="text-lg font-bold text-emerald-600">{selectedZone.carbon_sequestration_rate?.toFixed(2) || "N/A"} t CO₂/ha/yr</p>
                </div>
              </div>
            </div>

            {selectedZone.description && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Description</h4>
                <p className="text-sm text-foreground">{selectedZone.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BioregionalMap;
