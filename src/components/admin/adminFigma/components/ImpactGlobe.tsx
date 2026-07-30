import React, { useState } from 'react';
import { Globe, Layers, TrendingUp, Zap, Eye } from 'lucide-react';

interface ImpactPoint {
  lat: number;
  lng: number;
  name: string;
  type: 'reforestation' | 'ocean' | 'renewable' | 'community';
  impact: number;
  status: 'active' | 'completed' | 'planned';
}

export function ImpactGlobe() {
  const [selectedPoint, setSelectedPoint] = useState<ImpactPoint | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [layer, setLayer] = useState<'carbon' | 'biodiversity' | 'projects'>('projects');

  const impactPoints: ImpactPoint[] = [
    {
      lat: -3.4653,
      lng: -62.2159,
      name: 'Amazon Reforestation',
      type: 'reforestation',
      impact: 15420,
      status: 'active',
    },
    {
      lat: 14.5995,
      lng: 120.9842,
      name: 'Coral Reef Restoration',
      type: 'ocean',
      impact: 8750,
      status: 'active',
    },
    {
      lat: 6.5244,
      lng: 3.3792,
      name: 'Solar Farm Initiative',
      type: 'renewable',
      impact: 12100,
      status: 'completed',
    },
    {
      lat: -1.2921,
      lng: 36.8219,
      name: 'Community Agriculture',
      type: 'community',
      impact: 4350,
      status: 'active',
    },
    {
      lat: 28.6139,
      lng: 77.2090,
      name: 'Urban Green Spaces',
      type: 'reforestation',
      impact: 6780,
      status: 'planned',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reforestation':
        return 'bg-emerald-500';
      case 'ocean':
        return 'bg-blue-500';
      case 'renewable':
        return 'bg-amber-500';
      case 'community':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reforestation':
        return '🌳';
      case 'ocean':
        return '🌊';
      case 'renewable':
        return '☀️';
      case 'community':
        return '🏘️';
      default:
        return '📍';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              3D Impact Globe
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Interactive planetary view of regenerative projects and impact data
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                viewMode === '2d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              2D Map
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                viewMode === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              3D Globe
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Interactive Digital Twin</h3>
            <p className="text-sm opacity-90 mb-3">
              Real-time 3D visualization powered by WebGL. Rotate, zoom, and explore global impact data with geographic precision.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Three.js</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Real-Time Data</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">AR/VR Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-gray-600" />
          <span className="text-sm">Data Layers</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLayer('projects')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              layer === 'projects'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setLayer('carbon')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              layer === 'carbon'
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Carbon Density
          </button>
          <button
            onClick={() => setLayer('biodiversity')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              layer === 'biodiversity'
                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Biodiversity
          </button>
        </div>
      </div>

      {/* Globe Visualization */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <div className="relative" style={{ height: '500px' }}>
          {/* Simulated Globe Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
            {/* Simulated Earth */}
            <div className="relative w-96 h-96">
              {/* Globe sphere representation */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-emerald-400 to-blue-600 opacity-80">
                {/* Latitude/Longitude grid overlay */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  {/* Horizontal lines (latitude) */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <ellipse
                      key={`lat-${i}`}
                      cx="200"
                      cy="200"
                      rx={180 - i * 30}
                      ry={20 - i * 4}
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Vertical lines (longitude) */}
                  {[0, 30, 60, 90, 120, 150].map((angle) => (
                    <ellipse
                      key={`lng-${angle}`}
                      cx="200"
                      cy="200"
                      rx="20"
                      ry="180"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      transform={`rotate(${angle} 200 200)`}
                    />
                  ))}
                </svg>

                {/* Impact Points */}
                {impactPoints.map((point, index) => {
                  // Simplified 2D projection
                  const x = 200 + (point.lng / 180) * 150;
                  const y = 200 - (point.lat / 90) * 150;
                  
                  return (
                    <div
                      key={index}
                      className="absolute cursor-pointer group"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onClick={() => setSelectedPoint(point)}
                    >
                      {/* Pulse animation */}
                      <div className={`absolute inset-0 ${getTypeColor(point.type)} rounded-full animate-ping opacity-75`} style={{ width: '12px', height: '12px' }} />
                      
                      {/* Main marker */}
                      <div className={`relative ${getTypeColor(point.type)} rounded-full shadow-lg group-hover:scale-125 transition-transform`} style={{ width: '12px', height: '12px' }} />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white px-3 py-2 rounded text-xs whitespace-nowrap">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{getTypeIcon(point.type)}</span>
                            <span>{point.name}</span>
                          </div>
                          <div className="text-emerald-400">{point.impact.toLocaleString()} tons CO2</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Atmospheric glow */}
              <div className="absolute inset-0 rounded-full" style={{
                boxShadow: 'inset 0 0 60px rgba(100, 200, 255, 0.3), 0 0 80px rgba(100, 200, 255, 0.2)',
              }} />
            </div>

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black/50 backdrop-blur rounded-lg p-3 text-white text-xs space-y-1">
                <div>🖱️ Drag to rotate</div>
                <div>🔍 Scroll to zoom</div>
                <div>👆 Click markers for details</div>
              </div>

              <div className="bg-black/50 backdrop-blur rounded-lg p-3 text-white text-xs">
                <div className="mb-2">Legend:</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span>Reforestation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Ocean Restoration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                    <span>Renewable Energy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span>Community</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur px-4 py-2 rounded-lg text-white text-xs">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Production: Powered by Three.js + React Three Fiber
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Point Details */}
      {selectedPoint && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getTypeIcon(selectedPoint.type)}</div>
              <div>
                <h3 className="text-lg">{selectedPoint.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{selectedPoint.type} Project</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Location</p>
              <p className="text-sm">{selectedPoint.lat.toFixed(2)}°, {selectedPoint.lng.toFixed(2)}°</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <span className={`inline-block px-2 py-1 rounded text-xs capitalize ${
                selectedPoint.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : selectedPoint.status === 'completed'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {selectedPoint.status}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Impact</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-lg">{selectedPoint.impact.toLocaleString()}</span>
                <span className="text-xs text-gray-600">tons CO2</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Active Projects</p>
          <p className="text-2xl">{impactPoints.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Countries</p>
          <p className="text-2xl">12</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Total Impact</p>
          <p className="text-2xl">{impactPoints.reduce((sum, p) => sum + p.impact, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Communities</p>
          <p className="text-2xl">47</p>
        </div>
      </div>
    </div>
  );
}
