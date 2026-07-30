import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  TrendingUp,
  MapPin,
  Satellite,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Globe,
  Zap,
  Target,
  Camera,
  Wifi,
  WifiOff
} from 'lucide-react';

interface MeasurementData {
  id: string;
  type: 'satellite' | 'sensor' | 'drone' | 'manual';
  metric: 'ndvi' | 'soil_moisture' | 'temperature' | 'precipitation' | 'co2' | 'biodiversity';
  value: number;
  unit: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  timestamp: Date;
  accuracy: number;
  source: string;
  status: 'valid' | 'anomalous' | 'pending' | 'error';
}

interface SensorNetwork {
  id: string;
  name: string;
  location: string;
  type: 'weather' | 'soil' | 'air_quality' | 'biodiversity';
  status: 'online' | 'offline' | 'maintenance';
  lastReading: Date;
  batteryLevel: number;
  metrics: string[];
}

interface MeasurementStats {
  totalMeasurements: number;
  activeSensors: number;
  coverageArea: number;
  dataQuality: number;
  anomalyRate: number;
  realTimeCoverage: number;
}

const MeasurementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sensors' | 'satellite' | 'analytics'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  const [measurementStats, setMeasurementStats] = useState<MeasurementStats>({
    totalMeasurements: 2847392,
    activeSensors: 1247,
    coverageArea: 1542000, // hectares
    dataQuality: 96.8,
    anomalyRate: 2.3,
    realTimeCoverage: 89.5
  });

  const [recentMeasurements, setRecentMeasurements] = useState<MeasurementData[]>([
    {
      id: '1',
      type: 'satellite',
      metric: 'ndvi',
      value: 0.72,
      unit: 'index',
      location: { lat: -3.4653, lng: -62.2159, name: 'Amazon Rainforest' },
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      accuracy: 0.95,
      source: 'Sentinel-2',
      status: 'valid'
    },
    {
      id: '2',
      type: 'sensor',
      metric: 'soil_moisture',
      value: 0.34,
      unit: '%',
      location: { lat: 0.0236, lng: 37.9062, name: 'Kenya Agricultural Zone' },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      accuracy: 0.92,
      source: 'IoT Sensor Network',
      status: 'valid'
    },
    {
      id: '3',
      type: 'drone',
      metric: 'biodiversity',
      value: 87,
      unit: 'species',
      location: { lat: 45.4215, lng: -75.6972, name: 'Ottawa Conservation Area' },
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      accuracy: 0.88,
      source: 'Drone Survey',
      status: 'anomalous'
    },
    {
      id: '4',
      type: 'satellite',
      metric: 'temperature',
      value: 28.5,
      unit: '°C',
      location: { lat: 13.7563, lng: 100.5018, name: 'Thailand Mangrove' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      accuracy: 0.97,
      source: 'Landsat 8',
      status: 'valid'
    }
  ]);

  const [sensorNetwork, setSensorNetwork] = useState<SensorNetwork[]>([
    {
      id: '1',
      name: 'Amazon Weather Station #1',
      location: 'Brazil',
      type: 'weather',
      status: 'online',
      lastReading: new Date(Date.now() - 1000 * 60 * 5),
      batteryLevel: 85,
      metrics: ['temperature', 'precipitation', 'humidity', 'wind_speed']
    },
    {
      id: '2',
      name: 'Kenya Soil Sensor #3',
      location: 'Kenya',
      type: 'soil',
      status: 'online',
      lastReading: new Date(Date.now() - 1000 * 60 * 10),
      batteryLevel: 92,
      metrics: ['soil_moisture', 'ph_level', 'nutrients', 'temperature']
    },
    {
      id: '3',
      name: 'Canada Air Quality Monitor',
      location: 'Canada',
      type: 'air_quality',
      status: 'maintenance',
      lastReading: new Date(Date.now() - 1000 * 60 * 60 * 24),
      batteryLevel: 45,
      metrics: ['co2', 'pm25', 'ozone', 'voc']
    },
    {
      id: '4',
      name: 'Australia Biodiversity Camera',
      location: 'Australia',
      type: 'biodiversity',
      status: 'offline',
      lastReading: new Date(Date.now() - 1000 * 60 * 60 * 48),
      batteryLevel: 12,
      metrics: ['species_count', 'movement_patterns', 'habitat_health']
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'sensors', label: 'Sensor Network', icon: Wifi },
    { id: 'satellite', label: 'Satellite Data', icon: Satellite },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const metricFilters = [
    { value: 'all', label: 'All Metrics' },
    { value: 'ndvi', label: 'NDVI' },
    { value: 'soil_moisture', label: 'Soil Moisture' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'co2', label: 'CO₂ Levels' },
    { value: 'biodiversity', label: 'Biodiversity' }
  ];

  const MeasurementCard: React.FC<{ measurement: MeasurementData }> = ({ measurement }) => {
    const statusColors = {
      valid: 'bg-green-500/10 text-green-500 border-green-500/20',
      anomalous: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      error: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const typeIcons = {
      satellite: Satellite,
      sensor: Wifi,
      drone: Camera,
      manual: Target
    };

    const TypeIcon = typeIcons[measurement.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/50 rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize">
                {measurement.metric.replace('_', ' ')}
              </h3>
              <p className="text-sm text-muted-foreground">{measurement.source}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[measurement.status]}`}>
            {measurement.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {measurement.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {measurement.unit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Current Value</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {(measurement.accuracy * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{measurement.location.name}</span>
          </div>
          <span className="text-muted-foreground">
            {measurement.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </motion.div>
    );
  };

  const SensorCard: React.FC<{ sensor: SensorNetwork }> = ({ sensor }) => {
    const statusColors = {
      online: 'bg-green-500/10 text-green-500 border-green-500/20',
      offline: 'bg-red-500/10 text-red-500 border-red-500/20',
      maintenance: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };

    const typeIcons = {
      weather: Thermometer,
      soil: Droplets,
      air_quality: Wind,
      biodiversity: Eye
    };

    const TypeIcon = typeIcons[sensor.type];
    const StatusIcon = sensor.status === 'online' ? Wifi : WifiOff;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-lg p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{sensor.name}</h3>
              <p className="text-sm text-muted-foreground">{sensor.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${
              sensor.status === 'online' ? 'text-green-500' :
              sensor.status === 'offline' ? 'text-red-500' : 'text-yellow-500'
            }`} />
            <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[sensor.status]}`}>
              {sensor.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Battery</span>
              <span className="font-medium">{sensor.batteryLevel}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${sensor.batteryLevel}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Reading</p>
            <p className="font-medium">{sensor.lastReading.toLocaleTimeString()}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Metrics</p>
          <div className="flex flex-wrap gap-1">
            {sensor.metrics.map((metric) => (
              <span
                key={metric}
                className="px-2 py-1 bg-muted/50 text-xs rounded border border-border/50"
              >
                {metric.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const filteredMeasurements = recentMeasurements.filter(
    measurement => selectedMetric === 'all' || measurement.metric === selectedMetric
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Measurement Dashboard</h1>
              <p className="text-muted-foreground mt-1">Real-time environmental monitoring and data collection</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">{measurementStats.realTimeCoverage}% Coverage</span>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Satellite className="w-4 h-4 inline mr-2" />
                Deploy Sensor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{measurementStats.totalMeasurements.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Measurements</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{measurementStats.activeSensors}</div>
              <div className="text-xs text-muted-foreground">Active Sensors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">{measurementStats.coverageArea.toLocaleString()} ha</div>
              <div className="text-xs text-muted-foreground">Coverage Area</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-500">{measurementStats.dataQuality}%</div>
              <div className="text-xs text-muted-foreground">Data Quality</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{measurementStats.anomalyRate}%</div>
              <div className="text-xs text-muted-foreground">Anomaly Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-500">{measurementStats.realTimeCoverage}%</div>
              <div className="text-xs text-muted-foreground">Real-time</div>
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
                  onClick={() => setActiveTab(tab.id as 'overview' | 'sensors' | 'satellite' | 'analytics')}
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
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Metric Filter */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Recent Measurements</h2>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-4 py-2 border border-border/50 rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  aria-label="Filter measurements by metric type"
                >
                  {metricFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
              </div>

              {/* Measurements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMeasurements.map((measurement) => (
                  <MeasurementCard key={measurement.id} measurement={measurement} />
                ))}
              </div>

              {/* Anomaly Alerts */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-foreground">Anomaly Detection</h3>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {recentMeasurements.filter(m => m.status === 'anomalous').length} anomalies detected
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {recentMeasurements.filter(m => m.status === 'anomalous').map((measurement) => (
                    <div key={measurement.id} className="flex items-center justify-between p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-foreground">
                            Anomalous {measurement.metric.replace('_', ' ')} reading
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {measurement.location.name} • {measurement.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">
                          {measurement.value} {measurement.unit}
                        </div>
                        <button className="text-sm text-primary hover:text-primary/80 mt-1">
                          Investigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'sensors' && (
            <motion.div
              key="sensors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Sensor Network Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Wifi className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    {sensorNetwork.filter(s => s.status === 'online').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Online Sensors</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <WifiOff className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    {sensorNetwork.filter(s => s.status === 'offline').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Offline Sensors</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    {sensorNetwork.filter(s => s.status === 'maintenance').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {(sensorNetwork.reduce((acc, s) => acc + s.batteryLevel, 0) / sensorNetwork.length).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Avg Battery</p>
                </div>
              </div>

              {/* Sensor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sensorNetwork.map((sensor) => (
                  <SensorCard key={sensor.id} sensor={sensor} />
                ))}
              </div>

              {/* Network Map Placeholder */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Sensor Network Map</h3>
                <div className="h-96 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive sensor network map would be displayed here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing {sensorNetwork.filter(s => s.status === 'online').length} active sensors across {sensorNetwork.length} locations
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'satellite' && (
            <motion.div
              key="satellite"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Satellite Missions */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Active Satellite Missions</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Sentinel-2', status: 'active', coverage: 'Global', frequency: '5 days' },
                      { name: 'Landsat 8', status: 'active', coverage: 'Global', frequency: '16 days' },
                      { name: 'MODIS Terra', status: 'active', coverage: 'Global', frequency: 'Daily' },
                      { name: 'Sentinel-1', status: 'maintenance', coverage: 'Global', frequency: '6 days' }
                    ].map((satellite, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Satellite className={`w-5 h-5 ${
                            satellite.status === 'active' ? 'text-green-500' : 'text-yellow-500'
                          }`} />
                          <div>
                            <h4 className="font-medium text-foreground">{satellite.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {satellite.coverage} • Every {satellite.frequency}
                            </p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          satellite.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {satellite.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Satellite Imagery */}
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Latest Satellite Imagery</h3>
                  <div className="space-y-4">
                    {recentMeasurements.filter(m => m.type === 'satellite').map((measurement) => (
                      <div key={measurement.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground capitalize">
                              {measurement.metric.replace('_', ' ')} • {measurement.location.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {measurement.source} • {measurement.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {measurement.value} {measurement.unit}
                          </div>
                          <div className="text-sm text-green-500">
                            {(measurement.accuracy * 100).toFixed(1)}% accuracy
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Satellite Analytics */}
              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Satellite Data Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">2,847</div>
                    <p className="text-sm text-muted-foreground">Images Processed Today</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">94.2%</div>
                    <p className="text-sm text-muted-foreground">Cloud-Free Coverage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">15m</div>
                    <p className="text-sm text-muted-foreground">Resolution (Best)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Data Quality Trends</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Data quality trend charts would be displayed here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Coverage Analysis</h3>
                  <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Coverage analysis charts would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">Measurement Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Key Findings</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">NDVI Improvement</p>
                          <p className="text-sm text-muted-foreground">
                            12% increase in vegetation health across monitored regions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">Soil Moisture Trends</p>
                          <p className="text-sm text-muted-foreground">
                            Consistent improvement in soil water retention capacity
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="font-medium text-foreground text-sm">Expand Sensor Network</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deploy additional sensors in high-priority conservation areas
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                        <p className="font-medium text-foreground text-sm">Monitor Drought Risk</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Increased monitoring in regions showing moisture decline
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeasurementDashboard;