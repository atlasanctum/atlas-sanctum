/**
 * Atlas Sanctum — Connector Registry
 * Central catalog: registration, health monitoring, failover routing,
 * cost aggregation, version management, audit aggregation.
 */

import { BaseConnector, ConnectorStatus, AuditEntry } from './BaseConnector';
import { AIConnector, AIConnectorConfig } from './AIConnector';
import { BlockchainConnector, BlockchainConfig } from './BlockchainConnector';
import { FintechConnector, FintechConfig } from './FintechConnector';
import { IoTEdgeConnector, IoTConfig } from './IoTEdgeConnector';
import { ObservabilityConnector, ObservabilityConfig } from './ObservabilityConnector';

export interface ConnectorRegistryEntry {
  connector: BaseConnector;
  registeredAt: string;
  tags: string[];
  failoverConnectorId?: string;
}

export interface RegistryHealthReport {
  total: number;
  healthy: number;
  degraded: number;
  offline: number;
  connectors: { id: string; domain: string; status: ConnectorStatus }[];
}

export class ConnectorRegistry {
  private registry = new Map<string, ConnectorRegistryEntry>();
  private static instance: ConnectorRegistry;

  static getInstance(): ConnectorRegistry {
    if (!ConnectorRegistry.instance) ConnectorRegistry.instance = new ConnectorRegistry();
    return ConnectorRegistry.instance;
  }

  register(connector: BaseConnector, tags: string[] = [], failoverConnectorId?: string): void {
    this.registry.set(connector.meta.id, {
      connector,
      registeredAt: new Date().toISOString(),
      tags,
      failoverConnectorId,
    });

    // Aggregate audit events to observability connector
    connector.on('audit', (entry: AuditEntry) => {
      const obs = this.get<ObservabilityConnector>('observability-connector');
      obs?.recordMetric({
        name: `connector.call.duration_ms`,
        value: entry.durationMs,
        tags: { connector: entry.connectorId, operation: entry.operation, success: String(entry.success) },
      });
    });

    connector.on('call:failure', ({ connectorId, operation }: { connectorId: string; operation: string }) => {
      const failoverId = this.registry.get(connectorId)?.failoverConnectorId;
      if (failoverId) {
        const obs = this.get<ObservabilityConnector>('observability-connector');
        obs?.sendLog({
          level: 'warn',
          message: `Connector ${connectorId} failed on ${operation}, routing to failover: ${failoverId}`,
          service: 'connector-registry',
        });
      }
    });
  }

  get<T extends BaseConnector>(id: string): T | undefined {
    return this.registry.get(id)?.connector as T | undefined;
  }

  getByDomain<T extends BaseConnector>(domain: string): T[] {
    return Array.from(this.registry.values())
      .filter(e => e.connector.meta.domain === domain)
      .map(e => e.connector as T);
  }

  async connectAll(): Promise<void> {
    await Promise.allSettled(
      Array.from(this.registry.values()).map(e => e.connector.connect())
    );
  }

  async disconnectAll(): Promise<void> {
    await Promise.allSettled(
      Array.from(this.registry.values()).map(e => e.connector.disconnect())
    );
  }

  async healthReport(): Promise<RegistryHealthReport> {
    const statuses = await Promise.all(
      Array.from(this.registry.values()).map(async e => ({
        id: e.connector.meta.id,
        domain: e.connector.meta.domain,
        status: await e.connector.healthCheck(),
      }))
    );

    return {
      total: statuses.length,
      healthy: statuses.filter(s => s.status === 'healthy').length,
      degraded: statuses.filter(s => s.status === 'degraded').length,
      offline: statuses.filter(s => s.status === 'offline').length,
      connectors: statuses,
    };
  }

  getAggregatedAuditLog(): AuditEntry[] {
    return Array.from(this.registry.values())
      .flatMap(e => e.connector.getAuditLog())
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
}

/** Factory: build and register all connectors from environment */
export function buildConnectorRegistry(): ConnectorRegistry {
  const registry = ConnectorRegistry.getInstance();

  const obs = new ObservabilityConnector({
    datadogApiKey: process.env.DATADOG_API_KEY,
    datadogSite: process.env.DATADOG_SITE,
    grafanaUrl: process.env.GRAFANA_URL,
    grafanaToken: process.env.GRAFANA_TOKEN,
    prometheusUrl: process.env.PROMETHEUS_URL,
    sentryDsn: process.env.SENTRY_DSN,
    sentryEnvironment: process.env.ATLAS_ENV,
  });

  const ai = new AIConnector({
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    googleAiApiKey: process.env.GOOGLE_AI_API_KEY,
    mistralApiKey: process.env.MISTRAL_API_KEY,
    huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,
    defaultProvider: (process.env.AI_DEFAULT_PROVIDER as any) ?? 'openai',
    ethicalReviewThreshold: parseFloat(process.env.AEGIS_ETHICAL_THRESHOLD ?? '0.8'),
  });

  const blockchain = new BlockchainConnector({
    ethRpcUrl: process.env.ETH_RPC_URL,
    solanaRpcUrl: process.env.SOLANA_RPC_URL,
    cosmosRpcUrl: process.env.COSMOS_RPC_URL,
    chainlinkNodeUrl: process.env.CHAINLINK_NODE_URL,
  });

  const fintech = new FintechConnector({
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
    mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY,
    mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET,
    mpesaShortcode: process.env.MPESA_SHORTCODE,
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mpesaBaseUrl: process.env.MPESA_BASE_URL,
  });

  const iot = new IoTEdgeConnector({
    mqttBrokerUrl: process.env.MQTT_BROKER_URL,
    lorawanGatewayId: process.env.LORAWAN_GATEWAY_ID,
    edgeInferenceEndpoint: process.env.EDGE_INFERENCE_ENDPOINT,
    offlineSyncIntervalMs: parseInt(process.env.IOT_SYNC_INTERVAL_MS ?? '30000'),
  });

  // Register with failover chains
  registry.register(obs, ['observability', 'siem']);
  registry.register(ai, ['ai', 'aegis', 'agentic'], 'ai-connector');
  registry.register(blockchain, ['blockchain', 'web3', 'dao']);
  registry.register(fintech, ['fintech', 'payments', 'treasury']);
  registry.register(iot, ['iot', 'edge', 'telemetry']);

  return registry;
}
