import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBioregionalZones } from '@/hooks/useBioregionalZones';
import type { BioregionalZone } from '@/types/marketplace';

interface BiogregionalMapComponentProps {
  projectId?: string;
  selectedZoneId?: string;
  onZoneSelect?: (zoneId: string) => void;
}

/**
 * Simple map visualization component
 * Shows bioregional zones with climate risk color coding
 */
export function BiogregionalMapComponent({
  projectId,
  selectedZoneId,
  onZoneSelect,
}: BiogregionalMapComponentProps) {
  const { data: zones, isLoading } = useBioregionalZones();
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<BioregionalZone | null>(null);
  const [mapView, setMapView] = useState<'risk' | 'biodiversity' | 'carbon'>('risk');

  if (isLoading || !zones) {
    return (
      <Card className="bg-card-gradient border-border/50">
        <CardHeader>
          <CardTitle>Bioregional Intelligence</CardTitle>
          <CardDescription>Geographic zones and climate risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleZoneSelect = (zone: BioregionalZone) => {
    setSelectedZone(selectedZone?.id === zone.id ? null : zone);
    if (onZoneSelect) {
      onZoneSelect(zone.id);
    }
  };

  // Get color for risk level
  const getRiskColor = (riskLevel: string | null): string => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-500/30';
      case 'high': return 'bg-orange-500/30';
      case 'medium': return 'bg-yellow-500/30';
      case 'low': return 'bg-green-500/30';
      default: return 'bg-gray-500/30';
    }
  };

  const getRiskBadgeColor = (riskLevel: string | null): string => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-300';
      case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-300';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-300';
    }
  };

  const getBiodiversityColor = (index: number | null): string => {
    const value = (index || 0) * 100;
    if (value >= 90) return 'bg-emerald-500/30';
    if (value >= 80) return 'bg-green-500/30';
    if (value >= 70) return 'bg-lime-500/30';
    return 'bg-gray-500/30';
  };

  const getCarbonColor = (rate: number | null): string => {
    const value = rate || 0;
    if (value >= 10) return 'bg-purple-500/30';
    if (value >= 8) return 'bg-blue-500/30';
    if (value >= 5) return 'bg-cyan-500/30';
    return 'bg-gray-500/30';
  };

  return (
    <Card className="bg-card-gradient border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Bioregional Intelligence</CardTitle>
            <CardDescription>Geographic zones with climate risk & ecological data</CardDescription>
          </div>
          <Info className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* View Toggle */}
        <div className="flex gap-2 border-b border-border">
          {(['risk', 'biodiversity', 'carbon'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setMapView(view)}
              className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                mapView === view
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              aria-pressed={mapView === view}
              aria-label={`View ${view} data`}
            >
              {view === 'risk' ? '🌡️ Risk Level' : view === 'biodiversity' ? '🌿 Biodiversity' : '🌲 Carbon Rate'}
            </button>
          ))}
        </div>

        {/* Zone List */}
        <div className="space-y-3" role="list" aria-label="Bioregional zones">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-2 py-1 bg-muted/30 rounded">
            <span>{zones.length} Bioregional Zones</span>
            <div className="flex gap-3">
              {mapView === 'risk' && (
                <>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span>Critical</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Low</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {zones.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleZoneSelect(zone)}
              onMouseEnter={() => setHoveredZoneId(zone.id)}
              onMouseLeave={() => setHoveredZoneId(null)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                hoveredZoneId === zone.id
                  ? 'border-primary/50 shadow-lg'
                  : selectedZone?.id === zone.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border/30'
              } ${
                mapView === 'risk'
                  ? getRiskColor(zone.risk_level)
                  : mapView === 'biodiversity'
                    ? getBiodiversityColor(zone.biodiversity_index)
                    : getCarbonColor(zone.carbon_sequestration_rate)
              }`}
              role="listitem"
              aria-selected={selectedZone?.id === zone.id}
              aria-expanded={selectedZone?.id === zone.id}
              aria-label={`Bioregional zone ${zone.name}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{zone.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {zone.country} • {zone.region}
                  </p>
                </div>
                {mapView === 'risk' && (
                  <Badge
                    variant="outline"
                    className={`${getRiskBadgeColor(zone.risk_level)} text-xs`}
                  >
                    {zone.risk_level || 'Unknown'}
                  </Badge>
                )}
                {mapView === 'biodiversity' && (
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 border-emerald-300 text-xs">
                    {((zone.biodiversity_index || 0) * 100).toFixed(0)}%
                  </Badge>
                )}
                {mapView === 'carbon' && (
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-700 border-purple-300 text-xs">
                    {zone.carbon_sequestration_rate?.toFixed(1) || 0} t/ha/yr
                  </Badge>
                )}
              </div>

              {/* Expanded Details */}
              {selectedZone?.id === zone.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 pt-3 border-t border-border/30 space-y-2"
                  aria-live="polite"
                >
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground mb-1">Climate</p>
                      <p className="font-medium text-foreground">
                        {zone.climate_type || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Active Projects</p>
                      <p className="font-medium text-foreground">
                        {zone.active_projects || 0}
                      </p>
                    </div>
                    {zone.total_area_hectares && (
                      <div>
                        <p className="text-muted-foreground mb-1">Area</p>
                        <p className="font-medium text-foreground">
                          {zone.total_area_hectares.toLocaleString()} ha
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground mb-1">Biodiversity</p>
                      <p className="font-medium text-foreground">
                        {((zone.biodiversity_index || 0) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {zone.description && (
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground">{zone.description}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Legend/Info Box */}
        <div className="p-3 bg-blue-500/10 border border-blue-200 rounded text-xs text-blue-900 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Bioregional Pricing</p>
            <p>
              Credits are dynamically priced based on geographic zone, climate risk, and biodiversity importance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
