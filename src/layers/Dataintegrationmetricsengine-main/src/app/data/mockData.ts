
import { LucideIcon, Leaf, Droplets, HeartPulse, Recycle, Activity, TrendingUp, Zap } from 'lucide-react';

export type Sector = 'agriculture' | 'oceanic' | 'healthcare' | 'circular';

export interface Metric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  unit: string;
}

export interface SectorData {
  id: Sector;
  name: string;
  icon: any;
  color: string;
  description: string;
  metrics: Metric[];
  forecast: { name: string; actual: number; predicted: number }[];
  impactScore: number;
}

export const sectors: SectorData[] = [
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: Leaf,
    color: 'text-green-500',
    description: 'Regenerative farming, soil health, and crop biodiversity.',
    impactScore: 84,
    metrics: [
      { id: 'soil', label: 'Soil Organic Carbon', value: '3.2', change: 12, trend: 'up', unit: '%' },
      { id: 'water', label: 'Water Efficiency', value: '85', change: 5, trend: 'up', unit: '%' },
      { id: 'bio', label: 'Biodiversity Index', value: '7.8', change: 2.1, trend: 'up', unit: '/10' },
    ],
    forecast: [
      { name: 'Jan', actual: 40, predicted: 42 },
      { name: 'Feb', actual: 30, predicted: 35 },
      { name: 'Mar', actual: 45, predicted: 50 },
      { name: 'Apr', actual: 60, predicted: 68 },
      { name: 'May', actual: 75, predicted: 85 },
      { name: 'Jun', actual: 80, predicted: 92 },
    ],
  },
  {
    id: 'oceanic',
    name: 'Oceanic',
    icon: Droplets,
    color: 'text-blue-500',
    description: 'Marine ecosystem restoration, plastic reduction, and coral health.',
    impactScore: 76,
    metrics: [
      { id: 'plastic', label: 'Plastic Removed', value: '1,240', change: 18, trend: 'up', unit: 'tons' },
      { id: 'acidity', label: 'pH Levels', value: '8.1', change: -0.2, trend: 'neutral', unit: 'pH' },
      { id: 'coral', label: 'Coral Cover', value: '45', change: 3.5, trend: 'up', unit: '%' },
    ],
    forecast: [
      { name: 'Jan', actual: 20, predicted: 22 },
      { name: 'Feb', actual: 25, predicted: 28 },
      { name: 'Mar', actual: 35, predicted: 40 },
      { name: 'Apr', actual: 45, predicted: 48 },
      { name: 'May', actual: 55, predicted: 60 },
      { name: 'Jun', actual: 65, predicted: 72 },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: HeartPulse,
    color: 'text-red-500',
    description: 'Preventative care access, community health, and resource equity.',
    impactScore: 91,
    metrics: [
      { id: 'access', label: 'Access Rate', value: '94', change: 4, trend: 'up', unit: '%' },
      { id: 'disease', label: 'Disease Incidence', value: '12', change: -8, trend: 'down', unit: 'per 1k' },
      { id: 'satisfaction', label: 'Patient Satisfaction', value: '4.8', change: 1.2, trend: 'up', unit: '/5' },
    ],
    forecast: [
      { name: 'Jan', actual: 85, predicted: 86 },
      { name: 'Feb', actual: 88, predicted: 89 },
      { name: 'Mar', actual: 87, predicted: 90 },
      { name: 'Apr', actual: 90, predicted: 92 },
      { name: 'May', actual: 92, predicted: 95 },
      { name: 'Jun', actual: 94, predicted: 97 },
    ],
  },
  {
    id: 'circular',
    name: 'Circular Economy',
    icon: Recycle,
    color: 'text-amber-500',
    description: 'Material reuse, waste reduction, and lifecycle extension.',
    impactScore: 68,
    metrics: [
      { id: 'reuse', label: 'Material Reuse', value: '62', change: 15, trend: 'up', unit: '%' },
      { id: 'waste', label: 'Landfill Diversion', value: '78', change: 9, trend: 'up', unit: '%' },
      { id: 'carbon', label: 'Carbon Offset', value: '450', change: 22, trend: 'up', unit: 'kT' },
    ],
    forecast: [
      { name: 'Jan', actual: 50, predicted: 52 },
      { name: 'Feb', actual: 55, predicted: 60 },
      { name: 'Mar', actual: 58, predicted: 65 },
      { name: 'Apr', actual: 62, predicted: 70 },
      { name: 'May', actual: 68, predicted: 78 },
      { name: 'Jun', actual: 72, predicted: 85 },
    ],
  },
];

export const globalMetrics = [
  { label: 'Total Impact Score', value: 82, change: 5.4, unit: '/100', icon: Activity },
  { label: 'Carbon Sequestered', value: '2.4M', change: 12.1, unit: 'Tons', icon: Leaf },
  { label: 'Ecosystem Balance', value: 'High', change: 0, unit: '', icon: TrendingUp },
  { label: 'AI Confidence', value: '98.2', change: 0.5, unit: '%', icon: Zap },
];
