/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Entity Resolution Service
 * 
 * Resolves when different records refer to the same actor
 * Uses exact + fuzzy matching, graph linkage, and probabilistic identity resolution
 */

import {
  Entity,
  EntityType,
  EntityLink,
  LinkType,
  UpsertEntityRequest
} from '../../types/antiManipulation';

// In-memory stores for demo (would be PostgreSQL + Neo4j in production)
const entities: Map<string, Entity> = new Map();
const entityLinks: Map<number, EntityLink> = new Map();
let linkIdCounter = 1;

/**
 * Generates a unique entity ID
 */
function generateEntityId(entityType: EntityType): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${entityType}_${timestamp}_${random}`;
}

/**
 * Creates or updates an entity
 */
export function upsertEntity(request: UpsertEntityRequest): Entity {
  // Check for existing entity by external ID
  if (request.externalId) {
    const existing = Array.from(entities.values()).find(
      e => e.externalId === request.externalId && e.entityType === request.entityType
    );
    if (existing) {
      // Update existing entity
      const updated: Entity = {
        ...existing,
        name: (request.attributes.name as string) || existing.name,
        attributes: { ...existing.attributes, ...request.attributes },
        updatedAt: new Date()
      };
      entities.set(updated.id, updated);
      return updated;
    }
  }

  // Create new entity
  const entity: Entity = {
    id: generateEntityId(request.entityType),
    entityType: request.entityType,
    externalId: request.externalId,
    name: (request.attributes.name as string) || `Unknown ${request.entityType}`,
    attributes: request.attributes,
    riskScore: 0,
    watchStatus: 'normal',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  entities.set(entity.id, entity);
  return entity;
}

/**
 * Gets an entity by ID
 */
export function getEntity(entityId: string): Entity | undefined {
  return entities.get(entityId);
}

/**
 * Gets all entities of a specific type
 */
export function getEntitiesByType(entityType: EntityType): Entity[] {
  return Array.from(entities.values()).filter(e => e.entityType === entityType);
}

/**
 * Searches entities by name or attributes
 */
export function searchEntities(query: string, limit: number = 50): Entity[] {
  const lowerQuery = query.toLowerCase();
  return Array.from(entities.values())
    .filter(entity => {
      return (
        entity.name.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(entity.attributes).toLowerCase().includes(lowerQuery)
      );
    })
    .slice(0, limit);
}

/**
 * Creates a link between two entities
 */
export function createEntityLink(
  fromEntityId: string,
  toEntityId: string,
  linkType: LinkType,
  metadata: Record<string, unknown> = {},
  confidence: number = 1.0
): EntityLink {
  // Validate entities exist
  if (!entities.has(fromEntityId)) {
    throw new Error(`Source entity not found: ${fromEntityId}`);
  }
  if (!entities.has(toEntityId)) {
    throw new Error(`Target entity not found: ${toEntityId}`);
  }

  // Check for existing link
  const existingLink = Array.from(entityLinks.values()).find(
    link =>
      link.fromEntityId === fromEntityId &&
      link.toEntityId === toEntityId &&
      link.linkType === linkType
  );

  if (existingLink) {
    // Update existing link
    const updated: EntityLink = {
      ...existingLink,
      metadata: { ...existingLink.metadata, ...metadata },
      confidence: Math.max(existingLink.confidence, confidence)
    };
    entityLinks.set(updated.id, updated);
    return updated;
  }

  // Create new link
  const link: EntityLink = {
    id: linkIdCounter++,
    fromEntityId,
    toEntityId,
    linkType,
    metadata,
    confidence,
    createdAt: new Date()
  };

  entityLinks.set(link.id, link);
  return link;
}

/**
 * Gets all links for an entity
 */
export function getEntityLinks(entityId: string): EntityLink[] {
  return Array.from(entityLinks.values()).filter(
    link => link.fromEntityId === entityId || link.toEntityId === entityId
  );
}

/**
 * Gets links by type
 */
export function getLinksByType(linkType: LinkType): EntityLink[] {
  return Array.from(entityLinks.values()).filter(link => link.linkType === linkType);
}

/**
 * Finds entities that share specific attributes (phone, email, bank account, etc.)
 */
export function findEntitiesBySharedAttribute(
  attributeKey: string,
  attributeValue: string
): Entity[] {
  return Array.from(entities.values()).filter(entity => {
    const value = entity.attributes[attributeKey];
    return value === attributeValue;
  });
}

/**
 * Resolves potential duplicate entities using fuzzy matching
 */
export function resolveDuplicates(entity: Entity): Array<{
  entity: Entity;
  matchScore: number;
  matchReasons: string[];
}> {
  const candidates: Array<{
    entity: Entity;
    matchScore: number;
    matchReasons: string[];
  }> = [];

  const sameTypeEntities = Array.from(entities.values()).filter(
    e => e.entityType === entity.entityType && e.id !== entity.id
  );

  sameTypeEntities.forEach(candidate => {
    const matchReasons: string[] = [];
    let matchScore = 0;

    // Check name similarity (simple Levenshtein-like)
    if (entity.name && candidate.name) {
      const nameSimilarity = calculateStringSimilarity(
        entity.name.toLowerCase(),
        candidate.name.toLowerCase()
      );
      if (nameSimilarity > 0.8) {
        matchScore += 0.4;
        matchReasons.push(`Name similarity: ${(nameSimilarity * 100).toFixed(0)}%`);
      }
    }

    // Check shared attributes
    const sharedAttributes = ['phone', 'email', 'bank_account_hash', 'id_number', 'address'];
    sharedAttributes.forEach(attr => {
      if (entity.attributes[attr] && candidate.attributes[attr]) {
        if (entity.attributes[attr] === candidate.attributes[attr]) {
          matchScore += 0.3;
          matchReasons.push(`Shared ${attr}`);
        }
      }
    });

    // Check external ID match
    if (entity.externalId && candidate.externalId) {
      if (entity.externalId === candidate.externalId) {
        matchScore += 0.5;
        matchReasons.push('External ID match');
      }
    }

    if (matchScore > 0.3) {
      candidates.push({
        entity: candidate,
        matchScore: Math.min(1, matchScore),
        matchReasons
      });
    }
  });

  return candidates.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Calculates string similarity (simplified Jaro-Winkler)
 */
function calculateStringSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const matchDistance = Math.floor(Math.max(s1.length, s2.length) / 2) - 1;
  const s1Matches: boolean[] = new Array(s1.length).fill(false);
  const s2Matches: boolean[] = new Array(s2.length).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < s1.length; i++) {
    const start = Math.max(0, i - matchDistance);
    const end = Math.min(i + matchDistance + 1, s2.length);

    for (let j = start; j < end; j++) {
      if (s2Matches[j] || s1[i] !== s2[j]) continue;
      s1Matches[i] = true;
      s2Matches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < s1.length; i++) {
    if (!s1Matches[i]) continue;
    while (!s2Matches[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  return (
    (matches / s1.length + matches / s2.length + (matches - transpositions / 2) / matches) / 3
  );
}

/**
 * Gets entity network (connected entities)
 */
export function getEntityNetwork(
  entityId: string,
  depth: number = 2
): {
  center: string;
  entities: Entity[];
  links: EntityLink[];
} {
  const visited = new Set<string>();
  const networkEntities: Entity[] = [];
  const networkLinks: EntityLink[] = [];

  function traverse(currentId: string, currentDepth: number) {
    if (currentDepth > depth || visited.has(currentId)) return;
    visited.add(currentId);

    const entity = entities.get(currentId);
    if (entity) {
      networkEntities.push(entity);
    }

    const links = getEntityLinks(currentId);
    links.forEach(link => {
      networkLinks.push(link);
      const nextId = link.fromEntityId === currentId ? link.toEntityId : link.fromEntityId;
      traverse(nextId, currentDepth + 1);
    });
  }

  traverse(entityId, 0);

  return {
    center: entityId,
    entities: networkEntities,
    links: networkLinks
  };
}

/**
 * Updates entity risk score
 */
export function updateEntityRiskScore(entityId: string, riskScore: number): Entity | undefined {
  const entity = entities.get(entityId);
  if (!entity) return undefined;

  const updated: Entity = {
    ...entity,
    riskScore: Math.max(0, Math.min(100, riskScore)),
    updatedAt: new Date()
  };

  entities.set(entityId, updated);
  return updated;
}

/**
 * Updates entity watch status
 */
export function updateEntityWatchStatus(
  entityId: string,
  watchStatus: Entity['watchStatus']
): Entity | undefined {
  const entity = entities.get(entityId);
  if (!entity) return undefined;

  const updated: Entity = {
    ...entity,
    watchStatus,
    updatedAt: new Date()
  };

  entities.set(entityId, updated);
  return updated;
}

/**
 * Gets entity statistics
 */
export function getEntityStats(): {
  total: number;
  byType: Record<string, number>;
  byWatchStatus: Record<string, number>;
  totalLinks: number;
} {
  const allEntities = Array.from(entities.values());
  const byType: Record<string, number> = {};
  const byWatchStatus: Record<string, number> = {};

  allEntities.forEach(entity => {
    byType[entity.entityType] = (byType[entity.entityType] || 0) + 1;
    byWatchStatus[entity.watchStatus] = (byWatchStatus[entity.watchStatus] || 0) + 1;
  });

  return {
    total: allEntities.length,
    byType,
    byWatchStatus,
    totalLinks: entityLinks.size
  };
}

/**
 * Clears all entities and links (for testing)
 */
export function clearEntities(): void {
  entities.clear();
  entityLinks.clear();
  linkIdCounter = 1;
}
