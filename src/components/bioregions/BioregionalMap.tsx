import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Globe,
  TreePine,
  Droplets,
  Thermometer,
  Wind,
  Mountain,
  Waves,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share2
} from 'lucide-react';

interface Bioregion {
  id: string;
  name: string;
  type: 'forest' | 'grassland' | 'wetland' | 'desert' | 'tundra' | 'marine' | 'urban';
  area: number; // hectares
  location: {
    lat: number;
    lng: number;
    bounds: [[number, number], [number, number]];
  };
  climate: {
    temperature: number;
    precipitation: number;
    humidity: number;
  };
  biodiversity: {
    speciesCount: number;
    endangeredSpecies: number;
    keystoneSpecies: string[];
  };
  carbon: {
    sequestration: number;
    storage: number;
    potential: number;
  };
  threats: string[];
  protection: {
    status: 'protected' | 'unprotected' | 'partially_protected';
    designation: string;
    coverage: number;
  };
  projects: number;
  communities: number;
}

interface MapLayer {
  id: string;
  name: string;
  type: 'satellite' | 'terrain' | 'biodiversity' | 'carbon' | 'climate' | 'threats';
  visible: boolean;
  opacity: number;
}

const BioregionalMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'regions' | 'analysis' | 'planning'>('map');
  const [selectedRegion, setSelectedRegion] = useState<Bioregion | null>(null);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'satellite', name: 'Satellite Imagery', type: 'satellite', visible: true, opacity: 1 },
    { id: 'biodiversity', name: 'Biodiversity Hotspots', type: 'biodiversity', visible: true, opacity: 0.7 },
    { id: 'carbon', name: 'Carbon Sequestration', type: 'carbon', visible: false, opacity: 0.8 },
    { id: 'climate', name: 'Climate Zones', type: 'climate', visible: true, opacity: 0.5 },
    { id: 'threats', name: 'Threat Assessment', type: 'threats', visible: false, opacity: 0.6 }
  ]);

  const [bioregions, setBioregions] = useState<Bioregion[]>([
    {
      id: '1',
      name: 'Amazon Rainforest',
      type: 'forest',
      area: 5500000,
      location: {
        lat: -3.4653,
        lng: -62.2159,
        bounds: [[-18.3486, -73.9830], [5.2718, -51.0547]]
      },
      climate: {
        temperature: 27.5,
        precipitation: 2300,
        humidity: 85
      },
      biodiversity: {
        speciesCount: 390000,
        endangeredSpecies: 1200,
        keystoneSpecies: ['Jaguar', 'Brazil Nut Tree', 'Harpy Eagle']
      },
      carbon: {
        sequestration: 1500000,
        storage: 150000000,
        potential: 2000000
      },
      threats: ['Deforestation', 'Climate Change', 'Illegal Mining'],
      protection: {
        status: 'partially_protected',
        designation: 'National Parks & Indigenous Reserves',
        coverage: 65
      },
      projects: 247,
      communities: 89
    },
    {
      id: '2',
      name: 'Great Barrier Reef',
      type: 'marine',
      area: 344400,
      location: {
        lat: -18.2871,
        lng: 147.6992,
        bounds: [[-24.5297, 142.2168], [-10.4120, 154.3076]]
      },
      climate: {
        temperature: 24.2,
        precipitation: 1800,
        humidity: 78
      },
      biodiversity: {
        speciesCount: 50000,
        endangeredSpecies: 134,
        keystoneSpecies: ['Coral Polyps', 'Clownfish', 'Green Sea Turtle']
      },
      carbon: {
        sequestration: 250000,
        storage: 25000000,
        potential: 300000
      },
      threats: ['Ocean Warming', 'Acidification', 'Pollution'],
      protection: {
        status: 'protected',
        designation: 'Marine Protected Area',
        coverage: 95
      },
      projects: 156,
      communities: 23
    },
    {
      id: '3',
      name: 'Serengeti Plains',
      type: 'grassland',
      area: 30000,
      location: {
        lat: -2.1540,
        lng: 34.6857,
        bounds: [[-3.5000, 33.5000], [-1.0000, 36.0000]]
      },
      climate: {
        temperature: 22.8,
        precipitation: 800,
        humidity: 65
      },
      biodiversity: {
        speciesCount: 1500,
        endangeredSpecies: 45,
        keystoneSpecies: ['African Elephant', 'Lion', 'Acacia Trees']
      },
      carbon: {
        sequestration: 50000,
        storage: 5000000,
        potential: 75000
      },
      threats: ['Poaching', 'Habitat Fragmentation', 'Climate Change'],
      protection: {
        status: 'protected',
        designation: 'National Park & UNESCO Site',
        coverage: 100
      },
      projects: 89,
      communities: 12
    }
  ]);

  const tabs = [
    { id: 'map', label: 'Interactive Map', icon: Globe },
    { id: 'regions', label: 'Bioregions', icon: MapPin },
    { id: 'analysis', label: 'Analysis', icon: TrendingUp },
    { id: 'planning', label: 'Planning', icon: Target }
  ];

  const RegionCard: React.FC<{ region: Bioregion; isSelected?: boolean }> = ({ region, isSelected }) => {
    const typeColors = {
      forest: 'bg-green-500/10 text-green-500 border-green-500/20',
      grassland: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      wetland: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      desert: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      tundra: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
      marine: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      urban: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    };

    const typeIcons = {
      forest: TreePine,
      grassland: Mountain,
      wetland: Droplets,
      desert: Thermometer,
      tundra: Wind,
      marine: Waves,
      urban: Globe
    };

    const TypeIcon = typeIcons[region.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card border rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'border-primary shadow-glow' : 'border-border/50'
        }`}
        onClick={() => setSelectedRegion(region)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{region.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{region.type}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${typeColors[region.type]}`}>
            {region.protection.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">{region.area.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Hectares</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-500">{region.biodiversity.speciesCount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Species</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{region.projects} projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">{region.protection.coverage}% protected</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const LayerControl: React.FC<{ layer: MapLayer; onToggle: (id: string) => void; onOpacityChange: (id: string, opacity: number) => void }> = ({
    layer,
    onToggle,
    onOpacityChange
  }) => (
    <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id={`layer-toggle-${layer.id}`}
          checked={layer.visible}
          onChange={() => onToggle(layer.id)}
          className="rounded border-border/50"
          aria-label={`Toggle ${layer.name} layer visibility`}
        />
        <label htmlFor={`layer-toggle-${layer.id}`} className="text-sm font-medium text-foreground cursor-pointer">
          {layer.name}
        </label>
      </div>
      {layer.visible && (
        <input
          type="range"
          id={`layer-opacity-${layer.id}`}
          min="0"
          max="1"
          step="0.1"
          value={layer.opacity}
          onChange={(e) => onOpacityChange(layer.id, parseFloat(e.target.value))}
          className="w-16 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          aria-label={`Adjust ${layer.name} layer opacity`}
        />
      )}
    </div>
  );

  const toggleLayer = (layerId: string) => {
    setMapLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const changeLayerOpacity = (layerId: string, opacity: number) => {
    setMapLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Bioregional Mapping</h1>
              <p className="text-muted-foreground mt-1">Interactive ecosystem visualization and analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{bioregions.length} Bioregions</span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors" aria-label="Download map data">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors" aria-label="Share map">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'map' | 'regions' | 'analysis' | 'planning')}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Map Controls */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-card border border-border/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Map Layers</h3>
                    <div className="space-y-3">
                      {mapLayers.map((layer) => (
                        <LayerControl
                          key={layer.id}
                          layer={layer}
                          onToggle={toggleLayer}
                          onOpacityChange={changeLayerOpacity}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border border-border/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Map Controls</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors" aria-label="Zoom in">
                        <ZoomIn className="w-5 h-5 mx-auto" />
                      </button>
                      <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors" aria-label="Zoom out">
                        <ZoomOut className="w-5 h-5 mx-auto" />
                      </button>
                      <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors" aria-label="Reset view">
                        <RotateCcw className="w-5 h-5 mx-auto" />
                      </button>
                      <button className="p-3 border border-border rounded-lg hover:bg-muted transition-colors" aria-label="Toggle layer visibility">
                        <Layers className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>

                  {selectedRegion && (
                    <div className="bg-card border border-primary/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Selected Region</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-foreground">{selectedRegion.name}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{selectedRegion.type}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Area:</span>
                            <div className="font-medium">{selectedRegion.area.toLocaleString()} ha</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Species:</span>
                            <div className="font-medium">{selectedRegion.biodiversity.speciesCount.toLocaleString()}</div>
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Map View */}
                <div className="lg:col-span-3">
                  <div className="bg-card border border-border/50 rounded-lg overflow-hidden">
                    <div className="h-96 lg:h-[600px] flex items-center justify-center bg-muted/50">
                      <div className="text-center">
                        <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">Interactive Bioregional Map</h3>
                        <p className="text-muted-foreground max-w-md">
                          Interactive 3D map visualization would be displayed here, showing bioregions,
                          biodiversity hotspots, carbon sequestration zones, and environmental threats.
                        </p>
                        <div className="mt-4 flex justify-center space-x-4 text-sm text-muted-foreground">
                          <span>🟢 {bioregions.filter(r => r.protection.status === 'protected').length} Protected</span>
                          <span>🟡 {bioregions.filter(r => r.protection.status === 'partially_protected').length} Partial</span>
                          <span>🔴 {bioregions.filter(r => r.protection.status === 'unprotected').length} Unprotected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'regions' && (
            <motion.div
              key="regions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Region Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {bioregions.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Bioregions</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TreePine className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {bioregions.reduce((acc, r) => acc + r.area, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Hectares Mapped</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {bioregions.reduce((acc, r) => acc + r.projects, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    {(bioregions.reduce((acc, r) => acc + r.protection.coverage, 0) / bioregions.length).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Protection</p>
                </div>
              </div>

              {/* Regions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bioregions.map((region) => (
                  <RegionCard
                    key={region.id}
                    region={region}
                    isSelected={selectedRegion?.id === region.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Biodiversity Analysis */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Biodiversity Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Species</span>
                      <span className="font-semibold text-foreground">
                        {bioregions.reduce((acc, r) => acc + r.biodiversity.speciesCount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Endangered Species</span>
                      <span className="font-semibold text-red-500">
                        {bioregions.reduce((acc, r) => acc + r.biodiversity.endangeredSpecies, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Keystone Species</span>
                      <span className="font-semibold text-blue-500">
                        {bioregions.reduce((acc, r) => acc + r.biodiversity.keystoneSpecies.length, 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Carbon Analysis */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Carbon Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Storage</span>
                      <span className="font-semibold text-green-500">
                        {(bioregions.reduce((acc, r) => acc + r.carbon.storage, 0) / 1000000).toFixed(1)}M tons
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Annual Sequestration</span>
                      <span className="font-semibold text-blue-500">
                        {(bioregions.reduce((acc, r) => acc + r.carbon.sequestration, 0) / 1000).toFixed(1)}K tons
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Restoration Potential</span>
                      <span className="font-semibold text-purple-500">
                        {(bioregions.reduce((acc, r) => acc + r.carbon.potential, 0) / 1000000).toFixed(1)}M tons
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Threat Analysis */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Threat Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { threat: 'Deforestation', count: bioregions.filter(r => r.threats.includes('Deforestation')).length, color: 'bg-red-500' },
                    { threat: 'Climate Change', count: bioregions.filter(r => r.threats.includes('Climate Change')).length, color: 'bg-orange-500' },
                    { threat: 'Pollution', count: bioregions.filter(r => r.threats.includes('Pollution')).length, color: 'bg-yellow-500' },
                    { threat: 'Habitat Loss', count: bioregions.filter(r => r.threats.includes('Habitat Fragmentation')).length, color: 'bg-pink-500' }
                  ].map((item) => (
                    <div key={item.threat} className="text-center">
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-lg font-semibold text-foreground">{item.count}</div>
                      <div className="text-sm text-muted-foreground">{item.threat}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'planning' && (
            <motion.div
              key="planning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Conservation Planning */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Conservation Planning</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">High Priority</h4>
                        <span className="text-sm text-green-500 font-medium">Immediate Action</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Amazon Rainforest - Critical deforestation prevention needed
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-green-500 text-white rounded text-sm">
                          Plan Intervention
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">Medium Priority</h4>
                        <span className="text-sm text-yellow-500 font-medium">Monitor Closely</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great Barrier Reef - Ocean warming mitigation strategies
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm">
                          Develop Strategy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restoration Planning */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Restoration Planning</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">Reforestation</h4>
                        <span className="text-sm text-blue-500 font-medium">High Impact</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        2.5M hectares identified for reforestation projects
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
                          Start Project
                        </button>
                        <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded text-sm">
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-purple-500/20 rounded-lg bg-purple-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">Wetland Restoration</h4>
                        <span className="text-sm text-purple-500 font-medium">Medium Impact</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        500K hectares of degraded wetlands identified
                      </p>
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
                          Assess Sites
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Planning Tools */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Planning Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border border-border/50 rounded-lg hover:bg-muted transition-colors text-left">
                    <Target className="w-8 h-8 text-red-500 mb-2" />
                    <h4 className="font-medium text-foreground mb-1">Impact Assessment</h4>
                    <p className="text-sm text-muted-foreground">Evaluate project impact potential</p>
                  </button>

                  <button className="p-4 border border-border/50 rounded-lg hover:bg-muted transition-colors text-left">
                    <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-medium text-foreground mb-1">Scenario Planning</h4>
                    <p className="text-sm text-muted-foreground">Model different conservation scenarios</p>
                  </button>

                  <button className="p-4 border border-border/50 rounded-lg hover:bg-muted transition-colors text-left">
                    <Globe className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-medium text-foreground mb-1">Connectivity Analysis</h4>
                    <p className="text-sm text-muted-foreground">Analyze wildlife corridor effectiveness</p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BioregionalMap;