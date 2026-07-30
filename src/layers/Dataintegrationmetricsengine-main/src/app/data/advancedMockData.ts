import { LucideIcon, Leaf, Droplets, HeartPulse, Recycle, Activity, TrendingUp, Zap, Database, Clock, AlertTriangle, CheckCircle, XCircle, Globe, Wifi, Server } from 'lucide-react';

export type Sector = 'agriculture' | 'oceanic' | 'healthcare' | 'circular';
export type DataQuality = 'excellent' | 'good' | 'fair' | 'poor';
export type DataSource = 'IoT' | 'Manual' | 'API' | 'ML_Model' | 'Satellite';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Metric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit: string;
  dataQuality?: DataQuality;
  lastUpdated?: Date;
  source?: DataSource;
}

export interface DataStream {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  throughput: string;
  latency: number;
  errorRate: number;
  source: DataSource;
  lastSync: Date;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  sector?: Sector;
  timestamp: Date;
  acknowledged: boolean;
}

export interface ForecastDataPoint {
  name: string;
  actual: number;
  predicted: number;
  confidence?: number;
  upperBound?: number;
  lowerBound?: number;
}

export interface AIInsight {
  id: string;
  type: 'optimization' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  impact: number;
  confidence: number;
  sector: Sector;
  actionable: boolean;
}

export interface GeographicData {
  region: string;
  lat: number;
  lng: number;
  value: number;
  trend: number;
}

export interface SectorData {
  id: Sector;
  name: string;
  icon: any;
  color: string;
  description: string;
  metrics: Metric[];
  forecast: ForecastDataPoint[];
  impactScore: number;
  dataQuality: DataQuality;
  activeDataStreams: number;
  totalDataPoints: string;
  geographicData?: GeographicData[];
  correlations?: { metric: string; correlation: number }[];
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  anomaly?: boolean;
}

// Enhanced Sectors with Advanced Metrics
export const sectors: SectorData[] = [
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: Leaf,
    color: 'text-green-500',
    description: 'Regenerative farming, soil health, and crop biodiversity.',
    impactScore: 84,
    dataQuality: 'excellent',
    activeDataStreams: 24,
    totalDataPoints: '1.2M',
    metrics: [
      { id: 'soil', label: 'Soil Organic Carbon', value: '3.2', change: 12, trend: 'up', unit: '%', dataQuality: 'excellent', lastUpdated: new Date(), source: 'IoT' },
      { id: 'water', label: 'Water Efficiency', value: '85', change: 5, trend: 'up', unit: '%', dataQuality: 'good', lastUpdated: new Date(), source: 'IoT' },
      { id: 'bio', label: 'Biodiversity Index', value: '7.8', change: 2.1, trend: 'up', unit: '/10', dataQuality: 'excellent', lastUpdated: new Date(), source: 'Satellite' },
      { id: 'yield', label: 'Crop Yield', value: '4.2', change: 8.5, trend: 'up', unit: 't/ha', dataQuality: 'good', lastUpdated: new Date(), source: 'Manual' },
      { id: 'carbon', label: 'Carbon Capture', value: '890', change: 15.2, trend: 'up', unit: 'kg/ha', dataQuality: 'excellent', lastUpdated: new Date(), source: 'ML_Model' },
      { id: 'nitrogen', label: 'Nitrogen Use Efficiency', value: '72', change: 3.8, trend: 'up', unit: '%', dataQuality: 'good', lastUpdated: new Date(), source: 'IoT' },
    ],
    forecast: [
      { name: 'Jan', actual: 40, predicted: 42, confidence: 0.92, upperBound: 48, lowerBound: 36 },
      { name: 'Feb', actual: 30, predicted: 35, confidence: 0.89, upperBound: 41, lowerBound: 29 },
      { name: 'Mar', actual: 45, predicted: 50, confidence: 0.91, upperBound: 56, lowerBound: 44 },
      { name: 'Apr', actual: 60, predicted: 68, confidence: 0.88, upperBound: 75, lowerBound: 61 },
      { name: 'May', actual: 75, predicted: 85, confidence: 0.85, upperBound: 93, lowerBound: 77 },
      { name: 'Jun', actual: 80, predicted: 92, confidence: 0.83, upperBound: 101, lowerBound: 83 },
    ],
    geographicData: [
      { region: 'North America', lat: 40, lng: -100, value: 85, trend: 12 },
      { region: 'South America', lat: -15, lng: -60, value: 78, trend: 8 },
      { region: 'Europe', lat: 50, lng: 10, value: 92, trend: 5 },
      { region: 'Africa', lat: 0, lng: 20, value: 65, trend: 18 },
      { region: 'Asia', lat: 30, lng: 100, value: 88, trend: 15 },
    ],
    correlations: [
      { metric: 'Rainfall', correlation: 0.87 },
      { metric: 'Temperature', correlation: -0.62 },
      { metric: 'Soil pH', correlation: 0.74 },
    ]
  },
  {
    id: 'oceanic',
    name: 'Oceanic',
    icon: Droplets,
    color: 'text-blue-500',
    description: 'Marine ecosystem restoration, plastic reduction, and coral health.',
    impactScore: 76,
    dataQuality: 'good',
    activeDataStreams: 18,
    totalDataPoints: '845K',
    metrics: [
      { id: 'plastic', label: 'Plastic Removed', value: '1,240', change: 18, trend: 'up', unit: 'tons', dataQuality: 'excellent', lastUpdated: new Date(), source: 'Manual' },
      { id: 'acidity', label: 'pH Levels', value: '8.1', change: -0.2, trend: 'neutral', unit: 'pH', dataQuality: 'excellent', lastUpdated: new Date(), source: 'IoT' },
      { id: 'coral', label: 'Coral Cover', value: '45', change: 3.5, trend: 'up', unit: '%', dataQuality: 'good', lastUpdated: new Date(), source: 'Satellite' },
      { id: 'temp', label: 'Sea Temperature', value: '22.4', change: -1.2, trend: 'down', unit: '°C', dataQuality: 'excellent', lastUpdated: new Date(), source: 'IoT' },
      { id: 'oxygen', label: 'Dissolved Oxygen', value: '7.8', change: 2.4, trend: 'up', unit: 'mg/L', dataQuality: 'good', lastUpdated: new Date(), source: 'IoT' },
      { id: 'fish', label: 'Fish Population', value: '124', change: 5.6, trend: 'up', unit: 'k', dataQuality: 'fair', lastUpdated: new Date(), source: 'ML_Model' },
    ],
    forecast: [
      { name: 'Jan', actual: 20, predicted: 22, confidence: 0.90, upperBound: 26, lowerBound: 18 },
      { name: 'Feb', actual: 25, predicted: 28, confidence: 0.88, upperBound: 32, lowerBound: 24 },
      { name: 'Mar', actual: 35, predicted: 40, confidence: 0.91, upperBound: 45, lowerBound: 35 },
      { name: 'Apr', actual: 45, predicted: 48, confidence: 0.89, upperBound: 54, lowerBound: 42 },
      { name: 'May', actual: 55, predicted: 60, confidence: 0.87, upperBound: 67, lowerBound: 53 },
      { name: 'Jun', actual: 65, predicted: 72, confidence: 0.85, upperBound: 80, lowerBound: 64 },
    ],
    geographicData: [
      { region: 'Pacific Ocean', lat: 0, lng: -140, value: 72, trend: 8 },
      { region: 'Atlantic Ocean', lat: 30, lng: -30, value: 68, trend: 12 },
      { region: 'Indian Ocean', lat: -10, lng: 70, value: 75, trend: 6 },
      { region: 'Arctic Ocean', lat: 75, lng: 0, value: 54, trend: 22 },
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: HeartPulse,
    color: 'text-red-500',
    description: 'Preventative care access, community health, and resource equity.',
    impactScore: 91,
    dataQuality: 'excellent',
    activeDataStreams: 32,
    totalDataPoints: '2.1M',
    metrics: [
      { id: 'access', label: 'Access Rate', value: '94', change: 4, trend: 'up', unit: '%', dataQuality: 'excellent', lastUpdated: new Date(), source: 'API' },
      { id: 'disease', label: 'Disease Incidence', value: '12', change: -8, trend: 'down', unit: 'per 1k', dataQuality: 'excellent', lastUpdated: new Date(), source: 'API' },
      { id: 'satisfaction', label: 'Patient Satisfaction', value: '4.8', change: 1.2, trend: 'up', unit: '/5', dataQuality: 'good', lastUpdated: new Date(), source: 'Manual' },
      { id: 'wait', label: 'Avg Wait Time', value: '18', change: -12, trend: 'down', unit: 'min', dataQuality: 'excellent', lastUpdated: new Date(), source: 'IoT' },
      { id: 'vaccine', label: 'Vaccination Rate', value: '89', change: 6.5, trend: 'up', unit: '%', dataQuality: 'excellent', lastUpdated: new Date(), source: 'API' },
      { id: 'readmit', label: 'Readmission Rate', value: '8.2', change: -4.3, trend: 'down', unit: '%', dataQuality: 'good', lastUpdated: new Date(), source: 'API' },
    ],
    forecast: [
      { name: 'Jan', actual: 85, predicted: 86, confidence: 0.95, upperBound: 89, lowerBound: 83 },
      { name: 'Feb', actual: 88, predicted: 89, confidence: 0.94, upperBound: 92, lowerBound: 86 },
      { name: 'Mar', actual: 87, predicted: 90, confidence: 0.93, upperBound: 93, lowerBound: 87 },
      { name: 'Apr', actual: 90, predicted: 92, confidence: 0.92, upperBound: 95, lowerBound: 89 },
      { name: 'May', actual: 92, predicted: 95, confidence: 0.91, upperBound: 98, lowerBound: 92 },
      { name: 'Jun', actual: 94, predicted: 97, confidence: 0.90, upperBound: 100, lowerBound: 94 },
    ],
  },
  {
    id: 'circular',
    name: 'Circular Economy',
    icon: Recycle,
    color: 'text-amber-500',
    description: 'Material reuse, waste reduction, and lifecycle extension.',
    impactScore: 68,
    dataQuality: 'good',
    activeDataStreams: 21,
    totalDataPoints: '967K',
    metrics: [
      { id: 'reuse', label: 'Material Reuse', value: '62', change: 15, trend: 'up', unit: '%', dataQuality: 'good', lastUpdated: new Date(), source: 'Manual' },
      { id: 'waste', label: 'Landfill Diversion', value: '78', change: 9, trend: 'up', unit: '%', dataQuality: 'excellent', lastUpdated: new Date(), source: 'IoT' },
      { id: 'carbon', label: 'Carbon Offset', value: '450', change: 22, trend: 'up', unit: 'kT', dataQuality: 'good', lastUpdated: new Date(), source: 'ML_Model' },
      { id: 'energy', label: 'Energy Recovery', value: '68', change: 11, trend: 'up', unit: '%', dataQuality: 'good', lastUpdated: new Date(), source: 'IoT' },
      { id: 'recycle', label: 'Recycling Rate', value: '82', change: 7.8, trend: 'up', unit: '%', dataQuality: 'excellent', lastUpdated: new Date(), source: 'Manual' },
      { id: 'lifecycle', label: 'Product Lifecycle', value: '8.4', change: 18.2, trend: 'up', unit: 'years', dataQuality: 'fair', lastUpdated: new Date(), source: 'API' },
    ],
    forecast: [
      { name: 'Jan', actual: 50, predicted: 52, confidence: 0.86, upperBound: 58, lowerBound: 46 },
      { name: 'Feb', actual: 55, predicted: 60, confidence: 0.84, upperBound: 67, lowerBound: 53 },
      { name: 'Mar', actual: 58, predicted: 65, confidence: 0.87, upperBound: 72, lowerBound: 58 },
      { name: 'Apr', actual: 62, predicted: 70, confidence: 0.85, upperBound: 78, lowerBound: 62 },
      { name: 'May', actual: 68, predicted: 78, confidence: 0.83, upperBound: 87, lowerBound: 69 },
      { name: 'Jun', actual: 72, predicted: 85, confidence: 0.81, upperBound: 95, lowerBound: 75 },
    ],
  },
];

export const globalMetrics = [
  { label: 'Total Impact Score', value: 82, change: 5.4, unit: '/100', icon: Activity },
  { label: 'Carbon Sequestered', value: '2.4M', change: 12.1, unit: 'Tons', icon: Leaf },
  { label: 'Ecosystem Balance', value: 'High', change: 0, unit: '', icon: TrendingUp },
  { label: 'AI Confidence', value: '98.2', change: 0.5, unit: '%', icon: Zap },
];

export const dataStreams: DataStream[] = [
  { id: '1', name: 'IoT Sensor Network', status: 'active', throughput: '2.4 GB/s', latency: 45, errorRate: 0.02, source: 'IoT', lastSync: new Date() },
  { id: '2', name: 'Satellite Imagery Feed', status: 'active', throughput: '1.8 GB/s', latency: 120, errorRate: 0.01, source: 'Satellite', lastSync: new Date(Date.now() - 300000) },
  { id: '3', name: 'External API Integration', status: 'active', throughput: '840 MB/s', latency: 200, errorRate: 0.05, source: 'API', lastSync: new Date(Date.now() - 60000) },
  { id: '4', name: 'ML Prediction Engine', status: 'active', throughput: '620 MB/s', latency: 80, errorRate: 0.03, source: 'ML_Model', lastSync: new Date() },
  { id: '5', name: 'Manual Data Entry', status: 'active', throughput: '42 MB/s', latency: 5000, errorRate: 0.08, source: 'Manual', lastSync: new Date(Date.now() - 1800000) },
  { id: '6', name: 'Legacy Database Sync', status: 'error', throughput: '0 MB/s', latency: 9999, errorRate: 1.0, source: 'API', lastSync: new Date(Date.now() - 7200000) },
];

export const alerts: Alert[] = [
  { id: '1', severity: 'critical', message: 'Data stream "Legacy Database Sync" has failed. Immediate attention required.', sector: undefined, timestamp: new Date(Date.now() - 3600000), acknowledged: false },
  { id: '2', severity: 'warning', message: 'Oceanic sector showing higher than normal pH variance.', sector: 'oceanic', timestamp: new Date(Date.now() - 7200000), acknowledged: false },
  { id: '3', severity: 'info', message: 'Agriculture sector carbon capture exceeded targets by 15%.', sector: 'agriculture', timestamp: new Date(Date.now() - 10800000), acknowledged: true },
  { id: '4', severity: 'warning', message: 'Manual data entry latency above acceptable threshold.', sector: undefined, timestamp: new Date(Date.now() - 14400000), acknowledged: false },
];

export const aiInsights: AIInsight[] = [
  { id: '1', type: 'optimization', title: 'Resource Reallocation Opportunity', description: 'ML analysis suggests reallocating 12% of water resources from Region B to Region C could increase overall agriculture impact score by 8%.', impact: 8, confidence: 0.94, sector: 'agriculture', actionable: true },
  { id: '2', type: 'anomaly', title: 'Unusual pH Pattern Detected', description: 'Statistical anomaly detected in oceanic pH levels over the past 48 hours. Warrants investigation.', impact: -3, confidence: 0.88, sector: 'oceanic', actionable: true },
  { id: '3', type: 'prediction', title: 'Healthcare Access Milestone', description: 'Current trajectory indicates 95%+ healthcare access rate will be achieved 3 weeks ahead of target.', impact: 12, confidence: 0.92, sector: 'healthcare', actionable: false },
  { id: '4', type: 'recommendation', title: 'Expand Recycling Infrastructure', description: 'Data indicates 15% increase in circular economy impact if recycling capacity is expanded in urban centers.', impact: 15, confidence: 0.87, sector: 'circular', actionable: true },
  { id: '5', type: 'optimization', title: 'Sensor Network Optimization', description: 'IoT sensor placement optimization could reduce latency by 22% while maintaining data quality.', impact: 5, confidence: 0.91, sector: 'agriculture', actionable: true },
  { id: '6', type: 'prediction', title: 'Coral Recovery Acceleration', description: 'ML models predict coral cover will exceed 50% by Q3 if current restoration pace continues.', impact: 18, confidence: 0.85, sector: 'oceanic', actionable: false },
];

export const systemHealth = {
  overallStatus: 'healthy' as 'healthy' | 'degraded' | 'critical',
  uptime: '99.97%',
  activeDataStreams: 95,
  totalDataStreams: 96,
  dataProcessed24h: '4.2 TB',
  avgLatency: 125,
  errorRate: 0.03,
};
