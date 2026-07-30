/**
 * Atlas Sanctum Anti-Manipulation Engine
 * Graph Risk Engine
 * 
 * Detects collusion and hidden coordination using graph analysis
 */

import {
  GraphRiskScore,
  GraphRiskType,
  Entity,
  EntityLink,
  EntityNetwork,
  GraphNode,
  GraphEdge,
  RiskPath
} from '../../types/antiManipulation';

// In-memory store for demo (would be Neo4j in production)
const graphRiskScores: Map<number, GraphRiskScore> = new Map();
let graphRiskIdCounter = 1;

/**
 * Analyzes an entity's network for collusion patterns
 */
export function analyzeEntityNetwork(
  entityId: string,
  entities: Map<string, Entity>,
  links: EntityLink[]
): GraphRiskScore[] {
  const scores: GraphRiskScore[] = [];

  // Build adjacency list
  const adjacency: Map<string, Set<string>> = new Map();
  const linkMap: Map<string, EntityLink[]> = new Map();

  links.forEach(link => {
    if (!adjacency.has(link.fromEntityId)) {
      adjacency.set(link.fromEntityId, new Set());
    }
    if (!adjacency.has(link.toEntityId)) {
      adjacency.set(link.toEntityId, new Set());
    }
    adjacency.get(link.fromEntityId)!.add(link.toEntityId);
    adjacency.get(link.toEntityId)!.add(link.fromEntityId);

    const key = `${link.fromEntityId}-${link.toEntityId}`;
    if (!linkMap.has(key)) {
      linkMap.set(key, []);
    }
    linkMap.get(key)!.push(link);
  });

  // Run different graph analysis methods
  scores.push(...detectCollusionClusters(entityId, entities, adjacency, linkMap));
  scores.push(...detectCircularFlows(entityId, entities, adjacency, linkMap));
  scores.push(...detectHiddenHubs(entityId, entities, adjacency, linkMap));
  scores.push(...detectNepotismStructures(entityId, entities, adjacency, linkMap));
  scores.push(...detectProcurementRings(entityId, entities, adjacency, linkMap));

  // Store scores
  scores.forEach(score => {
    graphRiskScores.set(score.id, score);
  });

  return scores;
}

/**
 * Detects tightly connected suspicious clusters
 */
function detectCollusionClusters(
  entityId: string,
  entities: Map<string, Entity>,
  adjacency: Map<string, Set<string>>,
  linkMap: Map<string, EntityLink[]>
): GraphRiskScore[] {
  const scores: GraphRiskScore[] = [];

  // Get entity's neighbors
  const neighbors = adjacency.get(entityId) || new Set();
  if (neighbors.size < 2) return scores;

  // Check for triangles (3 nodes all connected)
  const neighborArray = Array.from(neighbors);
  for (let i = 0; i < neighborArray.length; i++) {
    for (let j = i + 1; j < neighborArray.length; j++) {
      const neighbor1 = neighborArray[i];
      const neighbor2 = neighborArray[j];

      if (adjacency.get(neighbor1)?.has(neighbor2)) {
        // Found a triangle
        const clusterEntities = [entityId, neighbor1, neighbor2];
        
        // Calculate cluster density
        const possibleEdges = 3; // Triangle has 3 edges
        const actualEdges = 3; // We found all 3
        
        // Check for suspicious link types
        const suspiciousLinkTypes = ['shares_device', 'shares_address', 'shares_phone', 'shares_bank_account'];
        let suspiciousLinks = 0;

        clusterEntities.forEach(e1 => {
          clusterEntities.forEach(e2 => {
            if (e1 < e2) {
              const key = `${e1}-${e2}`;
              const links = linkMap.get(key) || [];
              links.forEach(link => {
                if (suspiciousLinkTypes.includes(link.linkType)) {
                  suspiciousLinks++;
                }
              });
            }
          });
        });

        if (suspiciousLinks > 0) {
          const score = Math.min(1, (actualEdges / possibleEdges) * (suspiciousLinks / 3));
          
          scores.push({
            id: graphRiskIdCounter++,
            entityId,
            riskType: 'collusion_cluster',
            score,
            connectedEntities: clusterEntities,
            pathDescription: `Tight cluster detected with ${suspiciousLinks} suspicious connections (shared devices/addresses/phones)`,
            createdAt: new Date()
          });
        }
      }
    }
  }

  return scores;
}

/**
 * Detects circular fund flows
 */
function detectCircularFlows(
  entityId: string,
  entities: Map<string, Entity>,
  adjacency: Map<string, Set<string>>,
  linkMap: Map<string, EntityLink[]>
): GraphRiskScore[] {
  const scores: GraphRiskScore[] = [];

  // Simple cycle detection using DFS
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(node: string, path: string[]): void {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      if (cycleStart !== -1) {
        cycles.push(path.slice(cycleStart));
      }
      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    recursionStack.add(node);
    path.push(node);

    const neighbors = adjacency.get(node) || new Set();
    neighbors.forEach(neighbor => {
      // Only follow payment links
      const key = `${node}-${neighbor}`;
      const links = linkMap.get(key) || [];
      const hasPaymentLink = links.some(l => 
        l.linkType === 'paid' || l.linkType === 'transferred_to'
      );
      
      if (hasPaymentLink) {
        dfs(neighbor, [...path]);
      }
    });

    recursionStack.delete(node);
  }

  dfs(entityId, []);

  // Filter cycles that include the entity
  const relevantCycles = cycles.filter(cycle => cycle.includes(entityId));

  relevantCycles.forEach(cycle => {
    if (cycle.length >= 3) {
      scores.push({
        id: graphRiskIdCounter++,
        entityId,
        riskType: 'circular_flow',
        score: Math.min(1, cycle.length / 6), // Longer cycles are more suspicious
        connectedEntities: cycle,
        pathDescription: `Circular payment flow detected: ${cycle.join(' → ')} → ${cycle[0]}`,
        createdAt: new Date()
      });
    }
  });

  return scores;
}

/**
 * Detects hidden intermediary hubs
 */
function detectHiddenHubs(
  entityId: string,
  entities: Map<string, Entity>,
  adjacency: Map<string, Set<string>>,
  linkMap: Map<string, EntityLink[]>
): GraphRiskScore[] {
  const scores: GraphRiskScore[] = [];

  // Find entities with high betweenness centrality
  // (entities that connect many other entities)
  const centralityScores: Map<string, number> = new Map();

  adjacency.forEach((neighbors, node) => {
    centralityScores.set(node, neighbors.size);
  });

  // Find hubs (entities with significantly more connections than average)
  const degrees = Array.from(centralityScores.values());
  const avgDegree = degrees.reduce((a, b) => a + b, 0) / degrees.length;
  const stdDev = Math.sqrt(
    degrees.reduce((a, b) => a + Math.pow(b - avgDegree, 2), 0) / degrees.length
  );

  const hubs = Array.from(centralityScores.entries())
    .filter(([_, degree]) => degree > avgDegree + 2 * stdDev)
    .map(([node, _]) => node);

  // Check if entity is connected to any hubs
  hubs.forEach(hubId => {
    if (hubId !== entityId && adjacency.get(entityId)?.has(hubId)) {
      const hubDegree = centralityScores.get(hubId) || 0;
      const score = Math.min(1, hubDegree / (avgDegree * 3));

      scores.push({
        id: graphRiskIdCounter++,
        entityId,
        riskType: 'hidden_hub',
        score,
        connectedEntities: [entityId, hubId],
        pathDescription: `Connected to hidden hub ${hubId} with ${hubDegree} connections (avg: ${avgDegree.toFixed(1)})`,
        createdAt: new Date()
      });
    }
  });

  return scores;
}

/**
 * Detects nepotism structures
 */
function detectNepotismStructures(
  entityId: string,
  entities: Map<string, Entity>,
  adjacency: Map<string, Set<string>>,
  linkMap: Map<string, EntityLink[]>
): GraphRiskScore[] {
  const scores: GraphRiskScore[] = [];

  // Look for patterns where:
  // 1. A person is director of multiple vendors
  // 2. Those vendors share other attributes
  // 3. Those vendors win contracts from the same approver

  const entity = entities.get(entityId);
  if (!entity) return scores;

  // If entity is a vendor, check for shared directors
  if (entity.entityType === 'vendor') {
    const directors: string[] = [];
    const neighbors = adjacency.get(entityId) || new Set();

    neighbors.forEach(neighborId => {
      const key = `${entityId}-${neighborId}`;
      const links = linkMap.get(key) || [];
      const hasDirectorLink = links.some(l => l.linkType === 'director_of');
      
      if (hasDirectorLink) {
        directors.push(neighborId);
      }
    });

    // Check if any director is also director of other vendors
    directors.forEach(directorId => {
      const directorNeighbors = adjacency.get(directorId) || new Set();
      const otherVendors: string[] = [];

      directorNeighbors.forEach(vendorId => {
        if (vendorId !== entityId) {
          const vendor = entities.get(vendorId);
          if (vendor && vendor.entityType === 'vendor') {
            const key = `${directorId}-${vendorId}`;
            const links = linkMap.get(key) || [];
            const hasDirectorLink = links.some(l => l.linkType === 'director_of');
            
            if (hasDirectorLink) {
              otherVendors.push(vendorId);
            }
          }
        }
      });

      if (otherVendors.length > 0) {
        const score = Math.min(1, otherVendors.length / 3);
        
        scores.push({
          id: graphRiskIdCounter++,
          entityId,
          riskType: 'nepotism_structure',
          score,
          connectedEntities: [entityId, directorId, ...otherVendors],
          pathDescription: `Director ${directorId} controls multiple vendors: ${entityId}, ${otherVendors.join(', ')}`,
          createdAt: new Date()
        });
      }
    });
  }

  return scores;
}

/**
 * Detects procurement rings
 */
function detectProcurementRings(
  entityId: string,
  entities: Map<string, Entity>,
  adjacency: Map<string, Set<string>>,
  linkMap: Map<string, EntityLink[]>
): GraphRiskScore[] {
  const scores: GraphRiskScore[] = [];

  // Look for patterns where:
  // 1. Multiple vendors are connected through shared attributes
  // 2. They all receive payments from the same source
  // 3. Their pricing is suspiciously similar

  const entity = entities.get(entityId);
  if (!entity || entity.entityType !== 'vendor') return scores;

  // Find vendors with shared attributes
  const sharedAttributeTypes = ['shares_address', 'shares_phone', 'shares_bank_account'];
  const connectedVendors: Set<string> = new Set();

  const neighbors = adjacency.get(entityId) || new Set();
  neighbors.forEach(neighborId => {
    const key = `${entityId}-${neighborId}`;
    const links = linkMap.get(key) || [];
    
    const hasSharedAttribute = links.some(l => sharedAttributeTypes.includes(l.linkType));
    if (hasSharedAttribute) {
      const neighbor = entities.get(neighborId);
      if (neighbor && neighbor.entityType === 'vendor') {
        connectedVendors.add(neighborId);
      }
    }
  });

  if (connectedVendors.size >= 2) {
    const vendorArray = Array.from(connectedVendors);
    
    // Check if these vendors also share connections with each other
    let interConnections = 0;
    for (let i = 0; i < vendorArray.length; i++) {
      for (let j = i + 1; j < vendorArray.length; j++) {
        const key = `${vendorArray[i]}-${vendorArray[j]}`;
        const links = linkMap.get(key) || [];
        if (links.length > 0) {
          interConnections++;
        }
      }
    }

    const possibleConnections = (vendorArray.length * (vendorArray.length - 1)) / 2;
    const connectionDensity = interConnections / possibleConnections;

    if (connectionDensity > 0.3) {
      const score = Math.min(1, connectionDensity * (vendorArray.length / 3));
      
      scores.push({
        id: graphRiskIdCounter++,
        entityId,
        riskType: 'procurement_ring',
        score,
        connectedEntities: [entityId, ...vendorArray],
        pathDescription: `Procurement ring detected: ${vendorArray.length + 1} vendors with ${(connectionDensity * 100).toFixed(0)}% interconnection density`,
        createdAt: new Date()
      });
    }
  }

  return scores;
}

/**
 * Gets entity network for visualization
 */
export function getEntityNetworkForVisualization(
  entityId: string,
  entities: Map<string, Entity>,
  links: EntityLink[],
  depth: number = 2
): EntityNetwork {
  const visited = new Set<string>();
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const riskPaths: RiskPath[] = [];

  function traverse(currentId: string, currentDepth: number): void {
    if (currentDepth > depth || visited.has(currentId)) return;
    visited.add(currentId);

    const entity = entities.get(currentId);
    if (entity) {
      nodes.push({
        id: currentId,
        type: entity.entityType,
        label: entity.name,
        riskScore: entity.riskScore,
        attributes: entity.attributes
      });
    }

    const entityLinks = links.filter(
      l => l.fromEntityId === currentId || l.toEntityId === currentId
    );

    entityLinks.forEach(link => {
      edges.push({
        from: link.fromEntityId,
        to: link.toEntityId,
        type: link.linkType,
        weight: link.confidence,
        metadata: link.metadata
      });

      const nextId = link.fromEntityId === currentId ? link.toEntityId : link.fromEntityId;
      traverse(nextId, currentDepth + 1);
    });
  }

  traverse(entityId, 0);

  // Get risk paths for this entity
  const entityRiskScores = Array.from(graphRiskScores.values())
    .filter(score => score.entityId === entityId);

  entityRiskScores.forEach(score => {
    riskPaths.push({
      path: score.connectedEntities,
      reason: score.pathDescription || score.riskType,
      score: score.score
    });
  });

  return {
    center: entityId,
    nodes,
    edges,
    riskPaths
  };
}

/**
 * Gets graph risk scores for an entity
 */
export function getGraphRiskScores(entityId: string): GraphRiskScore[] {
  return Array.from(graphRiskScores.values()).filter(score => score.entityId === entityId);
}

/**
 * Gets graph risk scores by type
 */
export function getGraphRiskScoresByType(riskType: GraphRiskType): GraphRiskScore[] {
  return Array.from(graphRiskScores.values()).filter(score => score.riskType === riskType);
}

/**
 * Gets high-severity graph risks
 */
export function getHighSeverityGraphRisks(threshold: number = 0.7): GraphRiskScore[] {
  return Array.from(graphRiskScores.values()).filter(score => score.score >= threshold);
}

/**
 * Gets graph risk statistics
 */
export function getGraphRiskStats(): {
  total: number;
  byType: Record<string, number>;
  averageScore: number;
  highSeverityCount: number;
} {
  const allScores = Array.from(graphRiskScores.values());
  const byType: Record<string, number> = {};

  allScores.forEach(score => {
    byType[score.riskType] = (byType[score.riskType] || 0) + 1;
  });

  const averageScore = allScores.length > 0
    ? allScores.reduce((a, b) => a + b.score, 0) / allScores.length
    : 0;

  return {
    total: allScores.length,
    byType,
    averageScore,
    highSeverityCount: allScores.filter(s => s.score >= 0.7).length
  };
}

/**
 * Clears all graph risk scores (for testing)
 */
export function clearGraphRiskScores(): void {
  graphRiskScores.clear();
  graphRiskIdCounter = 1;
}
