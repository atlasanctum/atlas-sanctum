/**
 * Data Integration Metrics Engine Types
 */

// Data Source Types
export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  connectionString?: string;
  credentialsEncrypted?: string;
  status: DataSourceStatus;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
  config: Record<string, unknown>;
}

export type DataSourceType = 
  | 'api' 
  | 'database' 
  | 'file' 
  | 'stream' 
  | 'warehouse'
  | 'blockchain'
  | 'external_api';

export type DataSourceStatus = 'active' | 'inactive' | 'error' | 'syncing';

// Metric Definition Types
export interface MetricDefinition {
  id: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  calculationType: CalculationType;
  sourceId?: string;
  source?: DataSource;
  queryTemplate?: string;
  aggregationType: AggregationType;
  dimensions: MetricDimension[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type CalculationType = 
  | 'sum' 
  | 'average' 
  | 'count' 
  | 'min' 
  | 'max' 
  | 'custom';

export type AggregationType = 
  | 'none' 
  | 'hourly' 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'yearly';

export interface MetricDimension {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description?: string;
}

// Metrics Data Types
export interface MetricDataPoint {
  id: string;
  metricDefinitionId: string;
  metricDefinition?: MetricDefinition;
  sourceId: string;
  source?: DataSource;
  value: number;
  timestamp: string;
  dimensions: Record<string, string | number | boolean>;
  qualityScore?: number;
  createdAt: string;
}

// Data Pipeline Types
export interface DataPipeline {
  id: string;
  name: string;
  description?: string;
  sourceId: string;
  source?: DataSource;
  destinationId: string;
  destination?: DataSource;
  transformationRules: TransformationRule[];
  schedule?: string;
  status: PipelineStatus;
  lastRunAt?: string;
  lastRunStatus?: PipelineRunStatus;
  createdAt: string;
  updatedAt: string;
}

export type PipelineStatus = 'active' | 'inactive' | 'paused' | 'error';
export type PipelineRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface TransformationRule {
  id: string;
  type: TransformationType;
  field: string;
  expression: string;
  description?: string;
}

export type TransformationType = 
  | 'map' 
  | 'filter' 
  | 'aggregate' 
  | 'derive' 
  | 'lookup' 
  | 'normalize';

// Data Quality Types
export interface DataQualityCheck {
  id: string;
  name: string;
  metricDefinitionId: string;
  metricDefinition?: MetricDefinition;
  checkType: QualityCheckType;
  thresholdValue?: number;
  thresholdOperator: QualityThresholdOperator;
  severity: QualitySeverity;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type QualityCheckType = 
  | 'completeness' 
  | 'accuracy' 
  | 'consistency' 
  | 'uniqueness' 
  | 'timeliness' 
  | 'validity';

export type QualityThresholdOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'ne';
export type QualitySeverity = 'info' | 'warning' | 'error' | 'critical';

export interface DataQualityResult {
  id: string;
  checkId: string;
  check?: DataQualityCheck;
  pipelineId?: string;
  pipeline?: DataPipeline;
  resultStatus: QualityResultStatus;
  message?: string;
  failedRecords: number;
  totalRecords: number;
  executedAt: string;
}

export type QualityResultStatus = 'pass' | 'fail' | 'warning' | 'error';

// Integration Log Types
export interface IntegrationLog {
  id: string;
  sourceId?: string;
  source?: DataSource;
  pipelineId?: string;
  pipeline?: DataPipeline;
  action: string;
  status: IntegrationStatus;
  message?: string;
  metadata: Record<string, unknown>;
  durationMs?: number;
  createdAt: string;
}

export type IntegrationStatus = 'success' | 'failed' | 'warning' | 'pending';

// API Response Types
export interface MetricsSummaryResponse {
  metricId: string;
  metricName: string;
  category?: string;
  unit?: string;
  dataPoints: number;
  avgValue: number | null;
  minValue: number | null;
  maxValue: number | null;
  stdDeviation: number | null;
  avgQuality: number | null;
}

export interface PipelineExecutionResponse {
  pipelineId: string;
  status: PipelineRunStatus;
  startedAt: string;
  completedAt?: string;
  recordsProcessed: number;
  errors: string[];
}

export interface DataSourceSyncResponse {
  sourceId: string;
  status: 'started' | 'completed' | 'failed';
  recordsSynced: number;
  durationMs: number;
  errors: string[];
}

// Query Parameters
export interface MetricsQueryParams {
  metricIds?: string[];
  startDate?: string;
  endDate?: string;
  aggregation?: AggregationType;
  dimensions?: Record<string, string>;
  limit?: number;
  offset?: number;
}

export interface DataSourceQueryParams {
  type?: DataSourceType;
  status?: DataSourceStatus;
  limit?: number;
  offset?: number;
}

export interface PipelineQueryParams {
  status?: PipelineStatus;
  sourceId?: string;
  limit?: number;
  offset?: number;
}
