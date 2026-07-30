/**
 * Data Integration Metrics Engine Services Index
 */

// Connector to main platform API
export { 
  DataIntegrationConnector, 
  dataIntegrationConnector 
} from './dataIntegrationConnector';

// Types
export type {
  DataSource,
  MetricDefinition,
  MetricDataPoint,
  DataPipeline,
  MetricsSummary,
  DashboardSummary
} from './dataIntegrationConnector';
