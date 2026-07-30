/**
 * Data Integration Metrics Engine Connector
 * Links the Dataintegrationmetricsengine-main layer to the main platform API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Types for the connector
export interface DataSource {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error' | 'syncing';
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
  config: Record<string, unknown>;
}

export interface MetricDefinition {
  id: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  calculationType: string;
  aggregationType: string;
  dimensions: Array<{ name: string; type: string }>;
  isActive: boolean;
  createdAt: string;
}

export interface MetricDataPoint {
  id: string;
  metricDefinitionId: string;
  sourceId: string;
  value: number;
  timestamp: string;
  dimensions: Record<string, string | number | boolean>;
  qualityScore?: number;
}

export interface DataPipeline {
  id: string;
  name: string;
  description?: string;
  sourceId: string;
  destinationId: string;
  status: 'active' | 'inactive' | 'paused' | 'error';
  schedule?: string;
  lastRunAt?: string;
  lastRunStatus?: string;
}

export interface MetricsSummary {
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

export interface DashboardSummary {
  dataSources: {
    total: number;
    active: number;
    error: number;
  };
  metrics: {
    total: number;
    summary: MetricsSummary[];
  };
  pipelines: {
    total: number;
    active: number;
    running: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    status: string;
    message?: string;
    createdAt: string;
  }>;
}

// API Client class
class DataIntegrationConnector {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Data Sources
  async getDataSources(params?: { type?: string; status?: string; limit?: number; offset?: number }): Promise<{ data: DataSource[]; count: number }> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString();
    return this.fetch(`/data-integration/datasources${query ? `?${query}` : ''}`);
  }

  async getDataSource(id: string): Promise<{ data: DataSource }> {
    return this.fetch(`/data-integration/datasources/${id}`);
  }

  async createDataSource(data: Partial<DataSource>): Promise<{ data: DataSource }> {
    return this.fetch('/data-integration/datasources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDataSource(id: string, data: Partial<DataSource>): Promise<{ data: DataSource }> {
    return this.fetch(`/data-integration/datasources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async syncDataSource(id: string): Promise<{ data: { sourceId: string; status: string; recordsSynced: number } }> {
    return this.fetch(`/data-integration/datasources/${id}/sync`, {
      method: 'POST',
    });
  }

  async deleteDataSource(id: string): Promise<{ success: boolean }> {
    return this.fetch(`/data-integration/datasources/${id}`, {
      method: 'DELETE',
    });
  }

  // Metric Definitions
  async getMetricDefinitions(includeInactive?: boolean): Promise<{ data: MetricDefinition[]; count: number }> {
    const query = includeInactive ? '?includeInactive=true' : '';
    return this.fetch(`/data-integration/metrics/definitions${query}`);
  }

  async getMetricDefinition(id: string): Promise<{ data: MetricDefinition }> {
    return this.fetch(`/data-integration/metrics/definitions/${id}`);
  }

  async createMetricDefinition(data: Partial<MetricDefinition>): Promise<{ data: MetricDefinition }> {
    return this.fetch('/data-integration/metrics/definitions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Metrics Data
  async recordMetricData(data: {
    metricDefinitionId: string;
    sourceId: string;
    value: number;
    timestamp?: string;
    dimensions?: Record<string, string | number | boolean>;
    qualityScore?: number;
  }): Promise<{ data: MetricDataPoint }> {
    return this.fetch('/data-integration/metrics/data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async queryMetricsData(params: {
    metricIds?: string[];
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: MetricDataPoint[]; count: number }> {
    const queryParams = new URLSearchParams();
    if (params.metricIds) queryParams.append('metricIds', params.metricIds.join(','));
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    
    return this.fetch(`/data-integration/metrics/data?${queryParams}`);
  }

  async getMetricsSummary(): Promise<{ data: MetricsSummary[]; count: number }> {
    return this.fetch('/data-integration/metrics/summary');
  }

  // Pipelines
  async getPipelines(params?: { status?: string; sourceId?: string; limit?: number; offset?: number }): Promise<{ data: DataPipeline[]; count: number }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.sourceId) queryParams.append('sourceId', params.sourceId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString();
    return this.fetch(`/data-integration/pipelines${query ? `?${query}` : ''}`);
  }

  async getPipeline(id: string): Promise<{ data: DataPipeline }> {
    return this.fetch(`/data-integration/pipelines/${id}`);
  }

  async createPipeline(data: Partial<DataPipeline>): Promise<{ data: DataPipeline }> {
    return this.fetch('/data-integration/pipelines', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePipeline(id: string, data: Partial<DataPipeline>): Promise<{ data: DataPipeline }> {
    return this.fetch(`/data-integration/pipelines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async executePipeline(id: string): Promise<{ data: { pipelineId: string; status: string; recordsProcessed: number } }> {
    return this.fetch(`/data-integration/pipelines/${id}/execute`, {
      method: 'POST',
    });
  }

  // Quality Checks
  async getQualityChecks(metricDefinitionId?: string): Promise<{ data: Array<{ id: string; name: string; checkType: string; severity: string; isActive: boolean }>; count: number }> {
    const query = metricDefinitionId ? `?metricDefinitionId=${metricDefinitionId}` : '';
    return this.fetch(`/data-integration/quality/checks${query}`);
  }

  async createQualityCheck(data: { name: string; metricDefinitionId: string; checkType: string; thresholdValue?: number; severity?: string }): Promise<{ data: { id: string; name: string } }> {
    return this.fetch('/data-integration/quality/checks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async runQualityCheck(id: string): Promise<{ data: { checkId: string; resultStatus: string; failedRecords: number; totalRecords: number } }> {
    return this.fetch(`/data-integration/quality/checks/${id}/run`, {
      method: 'POST',
    });
  }

  // Integration Logs
  async getIntegrationLogs(params?: { sourceId?: string; pipelineId?: string; limit?: number }): Promise<{ data: Array<{ id: string; action: string; status: string; message?: string; createdAt: string }>; count: number }> {
    const queryParams = new URLSearchParams();
    if (params?.sourceId) queryParams.append('sourceId', params.sourceId);
    if (params?.pipelineId) queryParams.append('pipelineId', params.pipelineId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.fetch(`/data-integration/logs?${queryParams}`);
  }

  // Dashboard
  async getDashboard(): Promise<{ data: DashboardSummary }> {
    return this.fetch('/data-integration/dashboard');
  }
}

// Export singleton instance
export const dataIntegrationConnector = new DataIntegrationConnector();

// Export class for custom instances
export { DataIntegrationConnector };

// Export types
export type { DataSource, MetricDefinition, MetricDataPoint, DataPipeline, MetricsSummary, DashboardSummary };
