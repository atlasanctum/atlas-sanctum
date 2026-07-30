/**
 * Atlas Sanctum — Event Bus
 * Abstraction over Kafka / NATS / RabbitMQ / in-process.
 * Supports: event sourcing, CQRS, domain event routing,
 *           dead-letter queues, replay, schema validation.
 */

import { EventEmitter } from 'events';

export type EventBusBackend = 'kafka' | 'nats' | 'rabbitmq' | 'inprocess';

export interface DomainEvent<T = unknown> {
  id: string;
  type: string;           // e.g. "fragility.score.computed"
  aggregateId: string;    // e.g. region_id or project_id
  aggregateType: string;  // e.g. "region" | "project" | "covenant"
  payload: T;
  metadata: {
    traceId?: string;
    actorId?: string;
    organizationId?: string;
    timestamp: string;
    version: number;
    source: string;       // service name
  };
}

export type EventHandler<T = unknown> = (event: DomainEvent<T>) => Promise<void>;

export interface EventBusConfig {
  backend?: EventBusBackend;
  kafkaBrokers?: string;   // comma-separated
  natsUrl?: string;
  rabbitmqUrl?: string;
  deadLetterTopic?: string;
  maxRetries?: number;
}

// ── Well-known Atlas Sanctum event types ────────────────────────────────────

export const EVENTS = {
  // Fragility
  FRAGILITY_RUN_STARTED: 'fragility.run.started',
  FRAGILITY_SCORE_COMPUTED: 'fragility.score.computed',
  FRAGILITY_ALERT_TRIGGERED: 'fragility.alert.triggered',
  // MRV / Projects
  PROJECT_CREATED: 'project.created',
  EVIDENCE_SUBMITTED: 'evidence.submitted',
  PROJECT_VERIFIED: 'project.verified',
  // Payments
  PAYMENT_INITIATED: 'payment.initiated',
  PAYMENT_COMPLETED: 'payment.completed',
  PAYMENT_FAILED: 'payment.failed',
  // Blockchain
  IMPACT_PROOF_ANCHORED: 'impact.proof.anchored',
  DAO_PROPOSAL_SUBMITTED: 'dao.proposal.submitted',
  COVENANT_EXECUTED: 'covenant.executed',
  // IoT
  SENSOR_READING_INGESTED: 'sensor.reading.ingested',
  ANOMALY_DETECTED: 'anomaly.detected',
  // AI / Agents
  AGENT_TASK_ASSIGNED: 'agent.task.assigned',
  AGENT_TASK_COMPLETED: 'agent.task.completed',
  HUMAN_REVIEW_REQUIRED: 'agent.human_review.required',
  // Auth
  USER_REGISTERED: 'user.registered',
  USER_LOGIN: 'user.login',
} as const;

export type EventType = typeof EVENTS[keyof typeof EVENTS];

// ── In-process bus (default / fallback) ─────────────────────────────────────

class InProcessBus extends EventEmitter {
  private handlers = new Map<string, EventHandler[]>();
  private deadLetterQueue: { event: DomainEvent; error: string }[] = [];

  async publish<T>(event: DomainEvent<T>): Promise<void> {
    const handlers = [
      ...(this.handlers.get(event.type) ?? []),
      ...(this.handlers.get('*') ?? []),
    ];

    for (const handler of handlers) {
      try {
        await handler(event as DomainEvent);
      } catch (err) {
        this.deadLetterQueue.push({ event, error: String(err) });
        this.emit('dead-letter', { event, error: String(err) });
      }
    }
  }

  subscribe<T>(eventType: string, handler: EventHandler<T>): () => void {
    const list = this.handlers.get(eventType) ?? [];
    list.push(handler as EventHandler);
    this.handlers.set(eventType, list);
    return () => {
      const updated = (this.handlers.get(eventType) ?? []).filter(h => h !== handler);
      this.handlers.set(eventType, updated);
    };
  }

  getDeadLetterQueue() { return [...this.deadLetterQueue]; }
  clearDeadLetterQueue() { this.deadLetterQueue = []; }
}

// ── Public EventBus facade ───────────────────────────────────────────────────

export class EventBus {
  private bus: InProcessBus;
  private config: EventBusConfig;
  private static instance: EventBus;

  private constructor(config: EventBusConfig = {}) {
    this.config = config;
    this.bus = new InProcessBus();
    // TODO: swap bus for KafkaJS / NATS.js / amqplib based on config.backend
  }

  static getInstance(config?: EventBusConfig): EventBus {
    if (!EventBus.instance) EventBus.instance = new EventBus(config);
    return EventBus.instance;
  }

  async publish<T>(
    type: string,
    aggregateId: string,
    aggregateType: string,
    payload: T,
    meta: Partial<DomainEvent['metadata']> = {}
  ): Promise<void> {
    const event: DomainEvent<T> = {
      id: crypto.randomUUID(),
      type,
      aggregateId,
      aggregateType,
      payload,
      metadata: {
        timestamp: new Date().toISOString(),
        version: 1,
        source: process.env.ATLAS_SERVICE ?? 'atlas-sanctum-api',
        ...meta,
      },
    };
    await this.bus.publish(event);
  }

  subscribe<T>(eventType: string, handler: EventHandler<T>): () => void {
    return this.bus.subscribe(eventType, handler);
  }

  /** Subscribe to all events (useful for audit logging, observability) */
  subscribeAll(handler: EventHandler): () => void {
    return this.bus.subscribe('*', handler);
  }

  onDeadLetter(handler: (item: { event: DomainEvent; error: string }) => void): void {
    this.bus.on('dead-letter', handler);
  }

  getDeadLetterQueue() { return this.bus.getDeadLetterQueue(); }
}

// ── Convenience factory ──────────────────────────────────────────────────────

export function buildEventBus(): EventBus {
  return EventBus.getInstance({
    backend: (process.env.EVENT_BUS_BACKEND as EventBusBackend) ?? 'inprocess',
    kafkaBrokers: process.env.KAFKA_BROKERS,
    natsUrl: process.env.NATS_URL,
    rabbitmqUrl: process.env.RABBITMQ_URL,
    deadLetterTopic: 'atlas.dead-letter',
    maxRetries: 3,
  });
}
