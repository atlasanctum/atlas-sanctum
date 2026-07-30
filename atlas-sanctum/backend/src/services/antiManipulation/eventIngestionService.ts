/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Event Ingestion Service
 * 
 * Handles ingestion of operational events from various source systems
 */

import {
  Event,
  EventType,
  IngestEventRequest,
  EntityType
} from '../../types/antiManipulation';

// In-memory store for demo (would be PostgreSQL in production)
const events: Map<string, Event> = new Map();
const entities: Map<string, { id: string; type: EntityType }> = new Map();

/**
 * Generates a unique event ID
 */
function generateEventId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `event_${timestamp}_${random}`;
}

/**
 * Validates event data
 */
function validateEvent(request: IngestEventRequest): string[] {
  const errors: string[] = [];

  if (!request.eventType) {
    errors.push('Event type is required');
  }

  if (!request.sourceSystem) {
    errors.push('Source system is required');
  }

  if (!request.timestamp) {
    errors.push('Timestamp is required');
  } else {
    const date = new Date(request.timestamp);
    if (isNaN(date.getTime())) {
      errors.push('Invalid timestamp format');
    }
  }

  if (request.payload && typeof request.payload !== 'object') {
    errors.push('Payload must be an object');
  }

  return errors;
}

/**
 * Ingests a single event into the system
 */
export function ingestEvent(request: IngestEventRequest): Event {
  const errors = validateEvent(request);
  if (errors.length > 0) {
    throw new Error(`Event validation failed: ${errors.join(', ')}`);
  }

  const event: Event = {
    id: generateEventId(),
    eventType: request.eventType,
    sourceSystem: request.sourceSystem,
    entityId: request.entityRefs?.[0],
    timestamp: new Date(request.timestamp),
    amount: request.payload?.amount as number | undefined,
    currency: (request.payload?.currency as string) || 'USD',
    metadata: request.payload || {},
    processed: false,
    createdAt: new Date()
  };

  events.set(event.id, event);

  // Trigger async processing (in production, this would be a message queue)
  processEventAsync(event);

  return event;
}

/**
 * Ingests multiple events in batch
 */
export function ingestEventBatch(requests: IngestEventRequest[]): Event[] {
  const results: Event[] = [];
  const errors: { index: number; errors: string[] }[] = [];

  requests.forEach((request, index) => {
    try {
      const event = ingestEvent(request);
      results.push(event);
    } catch (error) {
      errors.push({
        index,
        errors: error instanceof Error ? [error.message] : ['Unknown error']
      });
    }
  });

  if (errors.length > 0) {
    console.warn(`Batch ingestion completed with ${errors.length} errors:`, errors);
  }

  return results;
}

/**
 * Async event processing (placeholder for rule engine, anomaly detection, etc.)
 */
async function processEventAsync(event: Event): Promise<void> {
  // In production, this would:
  // 1. Publish to Kafka/event stream
  // 2. Trigger rule engine evaluation
  // 3. Update anomaly detection models
  // 4. Update graph risk scores
  // 5. Check narrative consistency
  
  console.log(`Processing event ${event.id} of type ${event.eventType}`);
  
  // Mark as processed
  event.processed = true;
  events.set(event.id, event);
}

/**
 * Retrieves an event by ID
 */
export function getEvent(eventId: string): Event | undefined {
  return events.get(eventId);
}

/**
 * Retrieves events for a specific entity
 */
export function getEventsByEntity(entityId: string, limit: number = 100): Event[] {
  return Array.from(events.values())
    .filter(event => event.entityId === entityId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Retrieves events by type
 */
export function getEventsByType(eventType: EventType, limit: number = 100): Event[] {
  return Array.from(events.values())
    .filter(event => event.eventType === eventType)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Retrieves events within a date range
 */
export function getEventsByDateRange(
  startDate: Date,
  endDate: Date,
  limit: number = 1000
): Event[] {
  return Array.from(events.values())
    .filter(event => event.timestamp >= startDate && event.timestamp <= endDate)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

/**
 * Gets event statistics
 */
export function getEventStats(): {
  total: number;
  processed: number;
  unprocessed: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
} {
  const allEvents = Array.from(events.values());
  
  const byType: Record<string, number> = {};
  const bySource: Record<string, number> = {};

  allEvents.forEach(event => {
    byType[event.eventType] = (byType[event.eventType] || 0) + 1;
    bySource[event.sourceSystem] = (bySource[event.sourceSystem] || 0) + 1;
  });

  return {
    total: allEvents.length,
    processed: allEvents.filter(e => e.processed).length,
    unprocessed: allEvents.filter(e => !e.processed).length,
    byType,
    bySource
  };
}

/**
 * Clears all events (for testing)
 */
export function clearEvents(): void {
  events.clear();
}

/**
 * Registers an entity for event association
 */
export function registerEntity(entityId: string, entityType: EntityType): void {
  entities.set(entityId, { id: entityId, type: entityType });
}

/**
 * Gets all registered entities
 */
export function getRegisteredEntities(): Array<{ id: string; type: EntityType }> {
  return Array.from(entities.values());
}
