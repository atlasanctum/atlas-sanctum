// Advanced Analytics Types and Interfaces

// Chart Configuration Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'radar' | 'doughnut' | 'scatter' | 'bubble';
  title?: string;
  dataSource?: string;
  refreshInterval?: number;
  legend?: boolean;
  grid?: boolean;
  colors?: string[];
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  options?: Record<string, unknown>;
}

export interface AxisConfig {
  label: string;
  field: string;
  format?: string;
  min?: number;
  max?: number;
}

// Widget Types
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'gauge' | 'heatmap';
  title: string;
  config: ChartConfig;
  position: WidgetPosition;
  data?: unknown;
  filters?: WidgetFilter[];
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: unknown;
}

// Dashboard Template Types
export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  widgets: DashboardWidget[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  schedule?: ReportSchedule;
  filters?: WidgetFilter[];
  exportFormat: 'pdf' | 'csv' | 'excel';
  template?: string;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  cronExpression?: string;
  recipients: string[];
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
}

// Analytics Data Types
export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface AggregatedData {
  groupBy: string;
  metrics: MetricResult[];
}

export interface MetricResult {
  metric: string;
  value: number;
  change?: number;
  changePercent?: number;
  trend: 'up' | 'down' | 'stable';
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'metric_update' | 'alert' | 'notification' | 'data_refresh';
  payload: unknown;
  timestamp: string;
}

export interface MetricUpdatePayload {
  metricId: string;
  value: number;
  previousValue?: number;
  change?: number;
}

// Filter Types
export interface AnalyticsFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
  value: unknown;
  values?: unknown[];
}

export interface DateRangeFilter {
  field: string;
  startDate: string;
  endDate: string;
}

// Export Types
export interface ExportRequest {
  reportId: string;
  format: 'pdf' | 'csv' | 'excel';
  filters?: AnalyticsFilter[];
  dateRange?: DateRangeFilter;
  includeCharts?: boolean;
}

export interface ExportResult {
  downloadUrl: string;
  filename: string;
  expiresAt: string;
}

// Performance Metrics Types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  status: 'healthy' | 'warning' | 'critical';
  history?: TimeSeriesData[];
}
