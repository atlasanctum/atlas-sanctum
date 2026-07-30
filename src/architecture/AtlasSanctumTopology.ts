/**
 * Atlas Sanctum Topology & Networks Module
 * Mathematical Framework for Decentralized Resilience and Value Exchange
 * 
 * Topology provides the mathematical foundation for understanding connected spaces,
 * network resilience, and value flows across a decentralized global system.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Node identifier
 */
export type NodeId = string | number;

/**
 * Edge identifier
 */
export type EdgeId = string | number;

/**
 * Node in the network
 */
export interface NetworkNode {
  readonly id: NodeId;
  readonly type: 'individual' | 'community' | 'organization' | 'infrastructure' | 'gateway';
  readonly attributes: Record<string, number | string | boolean>;
  readonly position?: readonly number[]; // For geographic visualization
  readonly jurisdiction?: string;
}

/**
 * Edge in the network
 */
export interface NetworkEdge {
  readonly id: EdgeId;
  readonly source: NodeId;
  readonly target: NodeId;
  readonly type: 'transaction' | 'trust' | 'value' | 'information' | 'governance';
  readonly weight: number;
  readonly attributes: Record<string, number | string | boolean>;
  readonly timestamp?: number;
  readonly crossBorder?: boolean;
}

/**
 * Network graph
 */
export interface NetworkGraph {
  readonly nodes: readonly NetworkNode[];
  readonly edges: readonly NetworkEdge[];
  readonly metadata?: {
    readonly created: number;
    readonly version: string;
    readonly protocol: string;
  };
}

/**
 * Path in the network
 */
export interface NetworkPath {
  readonly nodes: readonly NodeId[];
  readonly edges: readonly EdgeId[];
  readonly totalWeight: number;
  readonly hops: number;
  readonly crossBorderHops: number;
}

/**
 * Connected component
 */
export interface ConnectedComponent {
  readonly id: number;
  readonly nodes: readonly NodeId[];
  readonly edges: readonly EdgeId[];
  readonly size: number;
  readonly isCrossBorder: boolean;
}

/**
 * Centrality measures
 */
export interface CentralityMeasures {
  readonly degree: ReadonlyMap<NodeId, number>;
  readonly betweenness: ReadonlyMap<NodeId, number>;
  readonly closeness: ReadonlyMap<NodeId, number>;
  readonly eigenvector: ReadonlyMap<NodeId, number>;
  readonly pageRank: ReadonlyMap<NodeId, number>;
  readonly hubScore: ReadonlyMap<NodeId, number>;
  readonly authorityScore: ReadonlyMap<NodeId, number>;
}

/**
 * Resilience metrics
 */
export interface ResilienceMetrics {
  readonly connectivity: number;
  readonly redundancy: number;
  readonly robustness: number;
  readonly vulnerability: number;
  readonly percolationThreshold: number;
  readonly giantComponentSize: number;
}

/**
 * Flow configuration
 */
export interface FlowConfig {
  readonly source: NodeId;
  readonly sink: NodeId;
  readonly amount: number;
  readonly commodity: string;
  readonly priority: number;
  readonly constraints?: ReadonlyMap<NodeId | EdgeId, number>;
}

/**
 * Flow result
 */
export interface FlowResult {
  readonly flow: ReadonlyMap<EdgeId, number>;
  readonly path: NetworkPath;
  readonly congestion: ReadonlyMap<EdgeId, number>;
  readonly efficiency: number;
  readonly fairness: number;
}

/**
 * Homology group generator
 */
export interface HomologyGenerator {
  readonly dimension: number;
  readonly generators: readonly NodeId[][] | readonly EdgeId[][];
  readonly cycles: readonly { cycle: NodeId[]; boundary: EdgeId[] }[];
}

/**
 * Border verification result
 */
export interface BorderVerification {
  readonly isValid: boolean;
  readonly jurisdictions: readonly string[];
  readonly compliance: ReadonlyMap<string, boolean>;
  readonly verificationPath: readonly NodeId[];
}

// ============================================================================
// GRAPH OPERATIONS
// ============================================================================

/**
 * Core graph operations for network topology
 */
export class GraphOperations {
  /**
   * Create adjacency list from graph
   */
  static createAdjacencyList(graph: NetworkGraph): Map<NodeId, { neighbor: NodeId; edge: NetworkEdge }[]> {
    const adj = new Map<NodeId, { neighbor: NodeId; edge: NetworkEdge }[]>();

    for (const node of graph.nodes) {
      adj.set(node.id, []);
    }

    for (const edge of graph.edges) {
      const sourceNeighbors = adj.get(edge.source) || [];
      sourceNeighbors.push({ neighbor: edge.target, edge });
      adj.set(edge.source, sourceNeighbors);

      // For undirected edges, add reverse
      const targetNeighbors = adj.get(edge.target) || [];
      targetNeighbors.push({ neighbor: edge.source, edge });
      adj.set(edge.target, targetNeighbors);
    }

    return adj;
  }

  /**
   * Create weighted adjacency matrix
   */
  static createAdjacencyMatrix(graph: NetworkGraph): { matrix: number[][]; nodeIndex: Map<NodeId, number> } {
    const nodeIndex = new Map<NodeId, number>();
    graph.nodes.forEach((node, i) => nodeIndex.set(node.id, i));

    const n = graph.nodes.length;
    const matrix = Array(n).fill(0).map(() => Array(n).fill(0));

    for (const edge of graph.edges) {
      const i = nodeIndex.get(edge.source)!;
      const j = nodeIndex.get(edge.target)!;
      matrix[i][j] = edge.weight;
      matrix[j][i] = edge.weight; // Undirected
    }

    return { matrix, nodeIndex };
  }

  /**
   * Find shortest path (Dijkstra's algorithm)
   */
  static shortestPath(
    graph: NetworkGraph,
    source: NodeId,
    target: NodeId,
    weightField: keyof NetworkEdge = 'weight'
  ): NetworkPath | null {
    const adj = this.createAdjacencyList(graph);

    // Dijkstra's algorithm
    const distances = new Map<NodeId, number>();
    const previous = new Map<NodeId, { node: NodeId; edge: EdgeId } | null>();
    const visited = new Set<NodeId>();

    for (const node of graph.nodes) {
      distances.set(node.id, Infinity);
      previous.set(node.id, null);
    }
    distances.set(source, 0);

    while (visited.size < graph.nodes.length) {
      // Find unvisited node with minimum distance
      let minDist = Infinity;
      let current: NodeId | null = null;

      for (const node of graph.nodes) {
        if (!visited.has(node.id) && distances.get(node.id)! < minDist) {
          minDist = distances.get(node.id)!;
          current = node.id;
        }
      }

      if (current === null || current === target) break;
      visited.add(current);

      // Explore neighbors
      const neighbors = adj.get(current) || [];
      for (const { neighbor, edge } of neighbors) {
        if (visited.has(neighbor)) continue;

        const alt = distances.get(current!)! + (edge[weightField] as number);
        if (alt < distances.get(neighbor)!) {
          distances.set(neighbor, alt);
          previous.set(neighbor, { node: current!, edge: edge.id });
        }
      }
    }

    // Reconstruct path
    if (distances.get(target) === Infinity) return null;

    const nodes: NodeId[] = [];
    const edges: EdgeId[] = [];
    let current: NodeId | null = target;

    while (current !== null) {
      nodes.unshift(current);
      const prev = previous.get(current);
      if (prev) {
        edges.unshift(prev.edge);
        current = prev.node;
      } else {
        current = null;
      }
    }

    // Calculate cross-border hops
    const crossBorderHops = this.countCrossBorderHops(graph, nodes);

    return {
      nodes,
      edges,
      totalWeight: distances.get(target)!,
      hops: nodes.length - 1,
      crossBorderHops,
    };
  }

  /**
   * Count cross-border hops in a path
   */
  private static countCrossBorderHops(graph: NetworkGraph, path: NodeId[]): number {
    const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));
    let crossBorder = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const source = nodeMap.get(path[i]);
      const target = nodeMap.get(path[i + 1]);

      if (source?.jurisdiction && target?.jurisdiction && 
          source.jurisdiction !== target.jurisdiction) {
        crossBorder++;
      }
    }

    return crossBorder;
  }

  /**
   * Find all paths (DFS)
   */
  static findAllPaths(
    graph: NetworkGraph,
    source: NodeId,
    target: NodeId,
    maxDepth: number = 10
  ): NetworkPath[] {
    const adj = this.createAdjacencyList(graph);
    const paths: NetworkPath[] = [];

    const dfs = (
      current: NodeId,
      visited: Set<NodeId>,
      nodes: NodeId[],
      edges: EdgeId[],
      depth: number
    ) => {
      if (depth > maxDepth || visited.has(current)) return;
      if (current === target) {
        paths.push({
          nodes: [...nodes],
          edges: [...edges],
          totalWeight: this.calculatePathWeight(graph, nodes),
          hops: nodes.length - 1,
          crossBorderHops: this.countCrossBorderHops(graph, nodes),
        });
        return;
      }

      visited.add(current);
      nodes.push(current);

      const neighbors = adj.get(current) || [];
      for (const { neighbor, edge } of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, visited, [...nodes, neighbor], [...edges, edge.id], depth + 1);
        }
      }

      visited.delete(current);
    };

    dfs(source, new Set(), [source], [], 0);
    return paths;
  }

  /**
   * Calculate path weight
   */
  private static calculatePathWeight(graph: NetworkGraph, nodes: NodeId[]): number {
    const adj = this.createAdjacencyList(graph);
    let weight = 0;

    for (let i = 0; i < nodes.length - 1; i++) {
      const neighbors = adj.get(nodes[i]) || [];
      const edge = neighbors.find(n => n.neighbor === nodes[i + 1])?.edge;
      if (edge) {
        weight += edge.weight;
      }
    }

    return weight;
  }

  /**
   * BFS for connected components
   */
  static findConnectedComponents(graph: NetworkGraph): ConnectedComponent[] {
    const adj = this.createAdjacencyList(graph);
    const visited = new Set<NodeId>();
    const components: ConnectedComponent[] = [];
    let componentId = 0;

    for (const node of graph.nodes) {
      if (visited.has(node.id)) continue;

      const componentNodes: NodeId[] = [];
      const componentEdges: EdgeId[] = [];
      const queue = [node.id];
      visited.add(node.id);

      while (queue.length > 0) {
        const current = queue.shift()!;
        componentNodes.push(current);

        const neighbors = adj.get(current) || [];
        for (const { neighbor, edge } of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
          if (!componentEdges.includes(edge.id)) {
            componentEdges.push(edge.id);
          }
        }
      }

      // Check if cross-border
      const jurisdictions = new Set(
        graph.nodes
          .filter(n => componentNodes.includes(n.id))
          .map(n => n.jurisdiction)
          .filter((j): j is string => j !== undefined)
      );

      components.push({
        id: componentId++,
        nodes: componentNodes,
        edges: componentEdges,
        size: componentNodes.length,
        isCrossBorder: jurisdictions.size > 1,
      });
    }

    return components;
  }
}

// ============================================================================
// CENTRALITY MEASURES
// ============================================================================

/**
 * Centrality measures for network analysis
 */
export class CentralityMeasuresCalculator {
  /**
   * Calculate degree centrality
   */
  static degreeCentrality(graph: NetworkGraph): ReadonlyMap<NodeId, number> {
    const maxDegree = graph.nodes.length - 1;
    const degree = new Map<NodeId, number>();

    for (const node of graph.nodes) {
      const neighbors = graph.edges.filter(e => e.source === node.id || e.target === node.id);
      degree.set(node.id, neighbors.length / maxDegree);
    }

    return degree;
  }

  /**
   * Calculate betweenness centrality (Brandes' algorithm)
   */
  static betweennessCentrality(graph: NetworkGraph): ReadonlyMap<NodeId, number> {
    const n = graph.nodes.length;
    const betweenness = new Map<NodeId, number>();
    const nodeIndex = new Map<NodeId, number>();

    graph.nodes.forEach((node, i) => nodeIndex.set(node.id, i));

    // Initialize
    for (const node of graph.nodes) {
      betweenness.set(node.id, 0);
    }

    for (const source of graph.nodes) {
      const S: NodeId[][] = []; // Stack of paths
      const P: NodeId[][] = []; // Predecessors
      const sigma = new Map<NodeId, number>(); // Number of shortest paths
      const d = new Map<NodeId, number>(); // Distance

      for (const node of graph.nodes) {
        sigma.set(node.id, 0);
        d.set(node.id, -1);
      }
      sigma.set(source.id, 1);
      d.set(source.id, 0);

      const queue: NodeId[] = [source.id];

      while (queue.length > 0) {
        const v = queue.shift()!;
        S.push([v]);

        const neighbors = this.getNeighbors(graph, v);
        for (const w of neighbors) {
          if (d.get(w)! < 0) {
            queue.push(w);
          }

          const dv = d.get(v)! + 1;
          if (d.get(w)! === dv) {
            sigma.set(w, sigma.get(w)! + sigma.get(v)!);
            P.push([v, w]);
          } else if (d.get(w)! > dv) {
            d.set(w, dv);
            sigma.set(w, sigma.get(v)!);
            P.length = 0;
          }
        }
      }

      // Accumulate dependencies
      const delta = new Map<NodeId, number>();
      for (const node of graph.nodes) {
        delta.set(node.id, 0);
      }

      while (S.length > 0) {
        const w = S.pop()![0];
        for (const pv of P.filter(p => p[1] === w)) {
          const v = pv[0];
          delta.set(v, delta.get(v)! + (sigma.get(v)! / sigma.get(w)!) * (1 + delta.get(w)!));
        }
        if (w !== source.id) {
          betweenness.set(w, betweenness.get(w)! + delta.get(w)!);
        }
      }
    }

    // Normalize
    const factor = 1 / ((n - 1) * (n - 2));
    for (const node of graph.nodes) {
      betweenness.set(node.id, betweenness.get(node.id)! * factor);
    }

    return betweenness;
  }

  /**
   * Get neighbors of a node
   */
  private static getNeighbors(graph: NetworkGraph, nodeId: NodeId): NodeId[] {
    const neighbors = new Set<NodeId>();
    for (const edge of graph.edges) {
      if (edge.source === nodeId) neighbors.add(edge.target);
      if (edge.target === nodeId) neighbors.add(edge.source);
    }
    return Array.from(neighbors);
  }

  /**
   * Calculate closeness centrality
   */
  static closenessCentrality(graph: NetworkGraph): ReadonlyMap<NodeId, number> {
    const n = graph.nodes.length;
    const closeness = new Map<NodeId, number>();

    for (const source of graph.nodes) {
      let totalDistance = 0;
      let reachable = 0;

      for (const target of graph.nodes) {
        if (source.id === target.id) continue;

        const path = GraphOperations.shortestPath(graph, source.id, target.id);
        if (path) {
          totalDistance += path.totalWeight;
          reachable++;
        }
      }

      if (reachable > 0 && totalDistance > 0) {
        closeness.set(source.id, (reachable / totalDistance) * (reachable / (n - 1)));
      } else {
        closeness.set(source.id, 0);
      }
    }

    return closeness;
  }

  /**
   * Calculate eigenvector centrality (power iteration)
   */
  static eigenvectorCentrality(graph: NetworkGraph, maxIterations: number = 100): ReadonlyMap<NodeId, number> {
    const { matrix, nodeIndex } = GraphOperations.createAdjacencyMatrix(graph);
    const n = graph.nodes.length;

    // Initialize
    let centrality = Array(n).fill(1);
    const normalized = (v: number[]) => {
      const norm = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
      return norm > 0 ? v.map(x => x / norm) : v;
    };

    centrality = normalized(centrality);

    for (let iter = 0; iter < maxIterations; iter++) {
      // Multiply by adjacency matrix
      const newCentrality = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          newCentrality[i] += matrix[i][j] * centrality[j];
        }
      }
      centrality = normalized(newCentrality);
    }

    // Map back to node IDs
    const result = new Map<NodeId, number>();
    graph.nodes.forEach((node, i) => result.set(node.id, centrality[i]));
    return result;
  }

  /**
   * Calculate PageRank
   */
  static pageRank(
    graph: NetworkGraph,
    dampingFactor: number = 0.85,
    maxIterations: number = 100,
    tolerance: number = 1e-6
  ): ReadonlyMap<NodeId, number> {
    const n = graph.nodes.length;
    const nodeIndex = new Map<NodeId, number>();
    graph.nodes.forEach((node, i) => nodeIndex.set(node.id, i));

    const outDegree = new Map<NodeId, number>();
    for (const node of graph.nodes) {
      outDegree.set(node.id, 0);
    }
    for (const edge of graph.edges) {
      outDegree.set(edge.source, outDegree.get(edge.source)! + 1);
    }

    // Initialize
    let pagerank = Array(n).fill(1 / n);
    const teleport = 1 / n;

    for (let iter = 0; iter < maxIterations; iter++) {
      const newPagerank = Array(n).fill(0);

      for (const edge of graph.edges) {
        const sourceIdx = nodeIndex.get(edge.source)!;
        const targetIdx = nodeIndex.get(edge.target)!;
        const contribution = pagerank[sourceIdx] / outDegree.get(edge.source)!;
        newPagerank[targetIdx] += dampingFactor * contribution;
      }

      // Add teleport probability
      for (let i = 0; i < n; i++) {
        newPagerank[i] += (1 - dampingFactor) * teleport;
      }

      // Check convergence
      let diff = 0;
      for (let i = 0; i < n; i++) {
        diff += Math.abs(newPagerank[i] - pagerank[i]);
      }

      pagerank = newPagerank;
      if (diff < tolerance) break;
    }

    // Map back
    const result = new Map<NodeId, number>();
    graph.nodes.forEach((node, i) => result.set(node.id, pagerank[i]));
    return result;
  }

  /**
   * Calculate all centrality measures
   */
  static calculateAll(graph: NetworkGraph): CentralityMeasures {
    return {
      degree: this.degreeCentrality(graph),
      betweenness: this.betweennessCentrality(graph),
      closeness: this.closenessCentrality(graph),
      eigenvector: this.eigenvectorCentrality(graph),
      pageRank: this.pageRank(graph),
      hubScore: this.hubScore(graph),
      authorityScore: this.authorityScore(graph),
    };
  }

  /**
   * HITS hub score
   */
  static hubScore(graph: NetworkGraph, maxIterations: number = 100): ReadonlyMap<NodeId, number> {
    return this.hitsAlgorithm(graph, maxIterations)[0];
  }

  /**
   * HITS authority score
   */
  static authorityScore(graph: NetworkGraph, maxIterations: number = 100): ReadonlyMap<NodeId, number> {
    return this.hitsAlgorithm(graph, maxIterations)[1];
  }

  /**
   * HITS algorithm
   */
  private static hitsAlgorithm(
    graph: NetworkGraph,
    maxIterations: number
  ): [ReadonlyMap<NodeId, number>, ReadonlyMap<NodeId, number>] {
    const n = graph.nodes.length;
    const nodeIndex = new Map<NodeId, number>();
    graph.nodes.forEach((node, i) => nodeIndex.set(node.id, i));

    let hub = Array(n).fill(1);
    let authority = Array(n).fill(1);

    for (let iter = 0; iter < maxIterations; iter++) {
      // Update authority scores
      const newAuthority = Array(n).fill(0);
      for (const edge of graph.edges) {
        const sourceIdx = nodeIndex.get(edge.source)!;
        const targetIdx = nodeIndex.get(edge.target)!;
        newAuthority[targetIdx] += hub[sourceIdx];
      }
      authority = this.normalize(newAuthority);

      // Update hub scores
      const newHub = Array(n).fill(0);
      for (const edge of graph.edges) {
        const sourceIdx = nodeIndex.get(edge.source)!;
        const targetIdx = nodeIndex.get(edge.target)!;
        newHub[sourceIdx] += authority[targetIdx];
      }
      hub = this.normalize(newHub);
    }

    const hubResult = new Map<NodeId, number>();
    const authResult = new Map<NodeId, number>();
    graph.nodes.forEach((node, i) => {
      hubResult.set(node.id, hub[i]);
      authResult.set(node.id, authority[i]);
    });

    return [hubResult, authResult];
  }

  private static normalize(v: number[]): number[] {
    const sum = v.reduce((a, b) => a + b, 0);
    return sum > 0 ? v.map(x => x / sum) : v;
  }
}

// ============================================================================
// RESILIENCE & FAULT TOLERANCE
// ============================================================================

/**
 * Resilience analysis based on topological properties
 */
export class ResilienceAnalyzer {
  /**
   * Calculate connectivity (fraction of nodes connected)
   */
  static connectivity(graph: NetworkGraph): number {
    const components = GraphOperations.findConnectedComponents(graph);
    const largest = Math.max(...components.map(c => c.size));
    return largest / graph.nodes.length;
  }

  /**
   * Calculate redundancy (average number of paths between nodes)
   */
  static redundancy(graph: NetworkGraph): number {
    let totalRedundancy = 0;
    let pairs = 0;

    for (let i = 0; i < graph.nodes.length; i++) {
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const paths = GraphOperations.findAllPaths(graph, graph.nodes[i].id, graph.nodes[j].id, 3);
        if (paths.length > 1) {
          totalRedundancy += paths.length;
        }
        pairs++;
      }
    }

    return pairs > 0 ? totalRedundancy / pairs : 0;
  }

  /**
   * Calculate robustness (performance under node removal)
   */
  static robustness(graph: NetworkGraph, fractionRemoved: number = 0.1): number {
    const originalConnectivity = this.connectivity(graph);

    // Remove random nodes
    const shuffled = [...graph.nodes].sort(() => Math.random() - 0.5);
    const removeCount = Math.floor(graph.nodes.length * fractionRemoved);
    const removedNodes = shuffled.slice(0, removeCount);

    const remainingGraph: NetworkGraph = {
      nodes: graph.nodes.filter(n => !removedNodes.find(r => r.id === n.id)),
      edges: graph.edges.filter(e => 
        !removedNodes.find(r => r.id === e.source) && 
        !removedNodes.find(r => r.id === e.target)
      ),
    };

    const newConnectivity = this.connectivity(remainingGraph);
    return newConnectivity / originalConnectivity;
  }

  /**
   * Find percolation threshold (critical fraction for network fragmentation)
   */
  static findPercolationThreshold(graph: NetworkGraph): number {
    const shuffled = [...graph.nodes].sort(() => Math.random() - 0.5);
    let left = 0;
    let right = 1;

    while (right - left > 0.01) {
      const mid = (left + right) / 2;
      const removeCount = Math.floor(graph.nodes.length * mid);
      const removedIds = new Set(shuffled.slice(0, removeCount).map(n => n.id));

      const remainingGraph: NetworkGraph = {
        nodes: graph.nodes.filter(n => !removedIds.has(n.id)),
        edges: graph.edges.filter(e => !removedIds.has(e.source) && !removedIds.has(e.target)),
      };

      if (this.connectivity(remainingGraph) > 0.5) {
        left = mid;
      } else {
        right = mid;
      }
    }

    return (left + right) / 2;
  }

  /**
   * Find alternative paths (k-shortest paths)
   */
  static findKShortestPaths(
    graph: NetworkGraph,
    source: NodeId,
    target: NodeId,
    k: number
  ): NetworkPath[] {
    const allPaths = GraphOperations.findAllPaths(graph, source, target, 10);
    return allPaths
      .sort((a, b) => a.totalWeight - b.totalWeight)
      .slice(0, k);
  }

  /**
   * Calculate vulnerability score
   */
  static vulnerability(graph: NetworkGraph): number {
    const centrality = CentralityMeasuresCalculator.betweennessCentrality(graph);
    let maxCentrality = 0;

    for (const [, value] of centrality) {
      if (value > maxCentrality) maxCentrality = value;
    }

    return maxCentrality;
  }

  /**
   * Get resilience metrics
   */
  static getResilienceMetrics(graph: NetworkGraph): ResilienceMetrics {
    return {
      connectivity: this.connectivity(graph),
      redundancy: this.redundancy(graph),
      robustness: this.robustness(graph),
      vulnerability: this.vulnerability(graph),
      percolationThreshold: this.findPercolationThreshold(graph),
      giantComponentSize: this.connectivity(graph) * graph.nodes.length,
    };
  }
}

// ============================================================================
// FLOW & VALUE DISTRIBUTION
// ============================================================================

/**
 * Flow topology and value circulation
 */
export class FlowAnalyzer {
  /**
   * Calculate max flow (Ford-Fulkerson)
   */
  static maxFlow(
    graph: NetworkGraph,
    source: NodeId,
    sink: NodeId,
    capacityField: keyof NetworkEdge = 'weight'
  ): FlowResult {
    const { matrix, nodeIndex } = GraphOperations.createAdjacencyMatrix(graph);
    const capacities = new Map<EdgeId, number>();
    for (const edge of graph.edges) {
      capacities.set(edge.id, edge[capacityField] as number);
    }

    const sourceIdx = nodeIndex.get(source)!;
    const sinkIdx = nodeIndex.get(sink)!;
    const n = graph.nodes.length;

    // Residual capacities
    const residual = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        residual[i][j] = matrix[i][j];
      }
    }

    let maxFlow = 0;

    while (true) {
      // BFS for augmenting path
      const parent = new Map<number, number>();
      const queue: number[] = [sourceIdx];
      parent.set(sourceIdx, -1);

      let found = false;
      while (queue.length > 0 && !found) {
        const v = queue.shift()!;
        if (v === sinkIdx) {
          found = true;
          break;
        }

        for (let u = 0; u < n; u++) {
          if (!parent.has(u) && residual[v][u] > 0) {
            parent.set(u, v);
            queue.push(u);
          }
        }
      }

      if (!found) break;

      // Find minimum residual capacity
      let pathFlow = Infinity;
      let v = sinkIdx;
      while (v !== sourceIdx) {
        const u = parent.get(v)!;
        pathFlow = Math.min(pathFlow, residual[u][v]);
        v = u;
      }

      // Update residual capacities
      v = sinkIdx;
      while (v !== sourceIdx) {
        const u = parent.get(v)!;
        residual[u][v] -= pathFlow;
        residual[v][u] += pathFlow;
        v = u;
      }

      maxFlow += pathFlow;
    }

    // Build flow result
    const flow = new Map<EdgeId, number>();
    const congestion = new Map<EdgeId, number>();

    for (const edge of graph.edges) {
      const i = nodeIndex.get(edge.source)!;
      const j = nodeIndex.get(edge.target)!;
      const originalCapacity = matrix[i][j];
      const flowValue = originalCapacity - residual[i][j];
      flow.set(edge.id, flowValue);
      congestion.set(edge.id, originalCapacity > 0 ? flowValue / originalCapacity : 0);
    }

    // Find path
    const shortestPath = GraphOperations.shortestPath(graph, source, sink);

    return {
      flow,
      path: shortestPath || { nodes: [source, sink], edges: [], totalWeight: 0, hops: 1, crossBorderHops: 0 },
      congestion,
      efficiency: shortestPath ? 1 : 0,
      fairness: 1,
    };
  }

  /**
   * Distribute value using Shapley values
   */
  static shapleyDistribution(
    graph: NetworkGraph,
    coalitionValues: Map<string, number>
  ): ReadonlyMap<NodeId, number> {
    const game = new CooperativeGameTheory(coalitionValues);
    const shapley = game.computeShapleyValues(graph.nodes.length);

    const result = new Map<NodeId, number>();
    graph.nodes.forEach((node, i) => {
      result.set(node.id, shapley.shapleyValues[i]);
    });

    return result;
  }

  /**
   * Check core stability of allocation
   */
  static checkCoreStability(
    graph: NetworkGraph,
    allocation: ReadonlyMap<NodeId, number>,
    coalitionValues: Map<string, number>
  ): { isStable: boolean; blockingCoalitions: readonly { coalition: NodeId[]; deviation: number }[] } {
    const game = new CooperativeGameTheory(coalitionValues);
    const allocArray = graph.nodes.map(n => allocation.get(n.id) || 0);
    const coreResult = game.checkCore(allocArray);

    return {
      isStable: coreResult.isInCore,
      blockingCoalitions: coreResult.blockingCoalitions.map(bc => ({
        coalition: bc.coalition,
        deviation: bc.deviation,
      })),
    };
  }
}

// ============================================================================
// ALGEBRAIC TOPOLOGY (HOMOLOGY & FUNDAMENTAL GROUP)
// ============================================================================

/**
 * Algebraic topology for network robustness
 */
export class AlgebraicTopology {
  /**
   * Calculate Betti numbers (simplified)
   */
  static calculateBettiNumbers(
    graph: NetworkGraph,
    maxDimension: number = 2
  ): readonly number[] {
    const components = GraphOperations.findConnectedComponents(graph);
    const n = graph.nodes.length;
    const m = graph.edges.length;

    // β₀ = number of connected components
    const beta0 = components.length;

    // β₁ = m - n + β₀ (for 1D homology)
    const beta1 = Math.max(0, m - n + beta0);

    // β₂ (holes in 2D) - simplified calculation
    const beta2 = 0;

    if (maxDimension === 1) {
      return [beta0, beta1];
    }
    return [beta0, beta1, beta2];
  }

  /**
   * Find fundamental cycles (basis for cycle space)
   */
  static findFundamentalCycles(
    graph: NetworkGraph
  ): { cycle: NodeId[]; edges: EdgeId[] }[] {
    const spanningTree = this.findSpanningTree(graph);
    const treeEdges = new Set(spanningTree.map(e => e.id));
    const fundamentalCycles: { cycle: NodeId[]; edges: EdgeId[] }[] = [];

    for (const edge of graph.edges) {
      if (!treeEdges.has(edge.id)) {
        // This edge forms a cycle with tree paths
        const cycle = this.findCycleThroughEdge(graph, spanningTree, edge);
        fundamentalCycles.push(cycle);
      }
    }

    return fundamentalCycles;
  }

  /**
   * Find spanning tree (Kruskal's algorithm)
   */
  private static findSpanningTree(
    graph: NetworkGraph
  ): NetworkEdge[] {
    const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    const tree: NetworkEdge[] = [];
    const nodeSet = new Map<NodeId, Set<NodeId>>();

    // Initialize disjoint set
    for (const node of graph.nodes) {
      nodeSet.set(node.id, new Set([node.id]));
    }

    for (const edge of sortedEdges) {
      const sourceRoot = this.findRoot(nodeSet, edge.source);
      const targetRoot = this.findRoot(nodeSet, edge.target);

      if (sourceRoot !== targetRoot) {
        tree.push(edge);
        // Union
        const newSet = new Set([...nodeSet.get(sourceRoot)!, ...nodeSet.get(targetRoot)!]);
        nodeSet.set(sourceRoot, newSet);
        nodeSet.set(targetRoot, newSet);
      }
    }

    return tree;
  }

  private static findRoot(nodeSet: Map<NodeId, Set<NodeId>>, node: NodeId): NodeId {
    for (const [root, members] of nodeSet) {
      if (members.has(node)) return root;
    }
    return node;
  }

  /**
   * Find cycle through an edge
   */
  private static findCycleThroughEdge(
    graph: NetworkGraph,
    tree: NetworkEdge[],
    edge: NetworkEdge
  ): { cycle: NodeId[]; edges: EdgeId[] } {
    // Find path in tree from edge.source to edge.target
    const adj = new Map<NodeId, NetworkEdge[]>();
    for (const t of tree) {
      if (!adj.has(t.source)) adj.set(t.source, []);
      if (!adj.has(t.target)) adj.set(t.target, []);
      adj.get(t.source)!.push(t);
      adj.get(t.target)!.push(t);
    }

    const visited = new Set<NodeId>();
    const parent = new Map<NodeId, { node: NodeId; edge: EdgeId } | null>();
    const queue: NodeId[] = [edge.source];
    parent.set(edge.source, null);

    while (queue.length > 0) {
      const v = queue.shift()!;
      if (v === edge.target) break;

      visited.add(v);
      const neighbors = adj.get(v) || [];
      for (const t of neighbors) {
        const next = t.source === v ? t.target : t.source;
        if (!visited.has(next)) {
          parent.set(next, { node: v, edge: t.id });
          queue.push(next);
        }
      }
    }

    // Reconstruct path
    const pathEdges: EdgeId[] = [edge.id];
    const pathNodes: NodeId[] = [edge.target];
    let current = edge.target;
    const prev = parent.get(current);

    if (prev) {
      while (prev !== null) {
        pathNodes.unshift(prev.node);
        pathEdges.unshift(prev.edge);
        const grandPrev = parent.get(prev.node);
        current = prev.node;
      }
    }

    pathNodes.unshift(edge.source);

    return { cycle: pathNodes, edges: pathEdges };
  }

  /**
   * Calculate cycle space dimension (cyclomatic number)
   */
  static cycleSpaceDimension(graph: NetworkGraph): number {
    const components = GraphOperations.findConnectedComponents(graph);
    return graph.edges.length - graph.nodes.length + components.length;
  }

  /**
   * Check network topology robustness
   */
  static checkTopologicalRobustness(
    graph: NetworkGraph
  ): {
    isRobust: boolean;
    bettiNumbers: readonly number[];
    cycleSpaceDim: number;
    recommendations: readonly string[];
  } {
    const betti = this.calculateBettiNumbers(graph);
    const cycleDim = this.cycleSpaceDimension(graph);
    const recommendations: string[] = [];

    // Check if network is 2-connected
    const is2Connected = betti[1] >= graph.nodes.length - 1;

    // Check for bridges
    const bridges = this.findBridges(graph);

    if (bridges.length > 0) {
      recommendations.push(`Found ${bridges.length} bridges. Consider adding redundant paths.`);
    }

    // Check for articulation points
    const articulationPoints = this.findArticulationPoints(graph);
    if (articulationPoints.length > 0) {
      recommendations.push(`Found ${articulationPoints.length} articulation points. Network may fragment if removed.`);
    }

    const isRobust = cycleDim >= graph.nodes.length / 2 && bridges.length === 0;

    return {
      isRobust,
      bettiNumbers: betti,
      cycleSpaceDim: cycleDim,
      recommendations,
    };
  }

  /**
   * Find bridges (edges whose removal disconnects graph)
   */
  static findBridges(graph: NetworkGraph): EdgeId[] {
    const bridges: EdgeId[] = [];
    const disc = new Map<NodeId, number>();
    const low = new Map<NodeId, number>();
    const parent = new Map<NodeId, NodeId | null>();
    let time = 0;

    const dfs = (u: NodeId) => {
      disc.set(u, time);
      low.set(u, time);
      time++;

      const neighbors = this.getNeighbors(graph, u);
      let children = 0;

      for (const v of neighbors) {
        if (!disc.has(v)) {
          parent.set(v, u);
          children++;
          dfs(v);
          low.set(u, Math.min(low.get(u)!, low.get(v)!));

          if (parent.get(u) === undefined && children > 1) {
            // Bridge found
          }

          if (parent.get(u) !== undefined && low.get(v)! >= disc.get(u)!) {
            const edge = graph.edges.find(e => 
              (e.source === u && e.target === v) || (e.source === v && e.target === u)
            );
            if (edge) bridges.push(edge.id);
          }
        } else if (v !== parent.get(u)) {
          low.set(u, Math.min(low.get(u)!, disc.get(v)!));
        }
      }
    };

    for (const node of graph.nodes) {
      if (!disc.has(node.id)) {
        parent.set(node.id, null);
        dfs(node.id);
      }
    }

    return bridges;
  }

  /**
   * Find articulation points
   */
  static findArticulationPoints(graph: NetworkGraph): NodeId[] {
    const ap = new Set<NodeId>();
    const disc = new Map<NodeId, number>();
    const low = new Map<NodeId, number>();
    const parent = new Map<NodeId, NodeId | null>();
    let time = 0;

    const dfs = (u: NodeId) => {
      disc.set(u, time);
      low.set(u, time);
      time++;

      const neighbors = this.getNeighbors(graph, u);
      let children = 0;

      for (const v of neighbors) {
        if (!disc.has(v)) {
          parent.set(v, u);
          children++;
          dfs(v);
          low.set(u, Math.min(low.get(u)!, low.get(v)!));

          if (parent.get(u) === null && children > 1) {
            ap.add(u);
          }

          if (parent.get(u) !== undefined && low.get(v)! >= disc.get(u)!) {
            ap.add(u);
          }
        } else if (v !== parent.get(u)) {
          low.set(u, Math.min(low.get(u)!, disc.get(v)!));
        }
      }
    };

    for (const node of graph.nodes) {
      if (!disc.has(node.id)) {
        parent.set(node.id, null);
        dfs(node.id);
      }
    }

    return Array.from(ap);
  }

  private static getNeighbors(graph: NetworkGraph, nodeId: NodeId): NodeId[] {
    const neighbors = new Set<NodeId>();
    for (const edge of graph.edges) {
      if (edge.source === nodeId) neighbors.add(edge.target);
      if (edge.target === nodeId) neighbors.add(edge.source);
    }
    return Array.from(neighbors);
  }
}

// ============================================================================
// BORDERLESS MESH PROTOCOLS
// ============================================================================

/**
 * Borderless mesh economy protocols
 */
export class MeshProtocols {
  /**
   * Verify cross-border transaction compliance
   */
  static verifyCrossBorderTransaction(
    graph: NetworkGraph,
    path: NetworkPath,
    jurisdictionRules: Map<string, { allowed: readonly string[]; requirements: readonly string[] }>
  ): BorderVerification {
    const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));
    const jurisdictions = new Set<string>();
    const compliance = new Map<string, boolean>();
    const verificationPath: NodeId[] = [];

    // Check each node in path
    for (const nodeId of path.nodes) {
      const node = nodeMap.get(nodeId);
      if (node?.jurisdiction) {
        jurisdictions.add(node.jurisdiction);
        verificationPath.push(nodeId);
      }
    }

    const jurisdictionList = Array.from(jurisdictions);

    // Verify compliance with each jurisdiction
    for (const [jurisdiction, rules] of jurisdictionRules) {
      if (jurisdictionList.includes(jurisdiction)) {
        compliance.set(jurisdiction, true);
        for (const req of rules.requirements) {
          // Simplified check - would need full implementation
          if (!req) compliance.set(jurisdiction, false);
        }
      }
    }

    const allCompliant = Array.from(compliance.values()).every(v => v);

    return {
      isValid: allCompliant,
      jurisdictions: jurisdictionList,
      compliance,
      verificationPath,
    };
  }

  /**
   * Route around jurisdiction restrictions
   */
  static routeAroundRestrictions(
    graph: NetworkGraph,
    source: NodeId,
    target: NodeId,
    restrictedJurisdictions: Set<string>
  ): NetworkPath | null {
    const adj = GraphOperations.createAdjacencyList(graph);
    const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));

    // Dijkstra with jurisdiction penalty
    const distances = new Map<NodeId, number>();
    const previous = new Map<NodeId, { node: NodeId; edge: EdgeId } | null>();

    for (const node of graph.nodes) {
      distances.set(node.id, Infinity);
      previous.set(node.id, null);
    }
    distances.set(source, 0);

    const visited = new Set<NodeId>();

    while (visited.size < graph.nodes.length) {
      // Find minimum distance unvisited node
      let minDist = Infinity;
      let current: NodeId | null = null;

      for (const node of graph.nodes) {
        if (!visited.has(node.id) && distances.get(node.id)! < minDist) {
          minDist = distances.get(node.id)!;
          current = node.id;
        }
      }

      if (current === null || current === target) break;
      visited.add(current);

      // Explore neighbors
      const neighbors = adj.get(current) || [];
      for (const { neighbor, edge } of neighbors) {
        if (visited.has(neighbor)) continue;

        // Check jurisdiction restriction
        const sourceNode = nodeMap.get(current);
        const targetNode = nodeMap.get(neighbor);
        const restricted = (sourceNode?.jurisdiction && restrictedJurisdictions.has(sourceNode.jurisdiction)) ||
                          (targetNode?.jurisdiction && restrictedJurisdictions.has(targetNode.jurisdiction));

        const penalty = restricted ? 1000 : 0;
        const alt = distances.get(current!)! + edge.weight + penalty;

        if (alt < distances.get(neighbor)!) {
          distances.set(neighbor, alt);
          previous.set(neighbor, { node: current!, edge: edge.id });
        }
      }
    }

    if (distances.get(target) === Infinity) return null;

    // Reconstruct path
    const nodes: NodeId[] = [];
    const edges: EdgeId[] = [];
    let current: NodeId | null = target;

    while (current !== null) {
      nodes.unshift(current);
      const prev = previous.get(current);
      if (prev) {
        edges.unshift(prev.edge);
        current = prev.node;
      } else {
        current = null;
      }
    }

    return {
      nodes,
      edges,
      totalWeight: distances.get(target)!,
      hops: nodes.length - 1,
      crossBorderHops: GraphOperations.countCrossBorderHops(graph, nodes),
    };
  }

  /**
   * Calculate mesh network coherence
   */
  static calculateMeshCoherence(graph: NetworkGraph): {
    coherenceScore: number;
    jurisdictionClusters: readonly { jurisdiction: string; nodes: NodeId[]; coherence: number }[];
    crossBorderConnections: number;
  } {
    const jurisdictionGroups = new Map<string, NodeId[]>();

    for (const node of graph.nodes) {
      if (node.jurisdiction) {
        const group = jurisdictionGroups.get(node.jurisdiction) || [];
        group.push(node.id);
        jurisdictionGroups.set(node.jurisdiction, group);
      }
    }

    const clusters: { jurisdiction: string; nodes: NodeId[]; coherence: number }[] = [];

    for (const [jurisdiction, nodes] of jurisdictionGroups) {
      // Calculate internal coherence
      const subgraphNodes = graph.nodes.filter(n => nodes.includes(n.id));
      const subgraphEdges = graph.edges.filter(e => 
        nodes.includes(e.source) && nodes.includes(e.target)
      );

      const maxEdges = (nodes.length * (nodes.length - 1)) / 2;
      const coherence = maxEdges > 0 ? subgraphEdges.length / maxEdges : 0;

      clusters.push({ jurisdiction, nodes, coherence });
    }

    // Count cross-border connections
    const crossBorderConnections = graph.edges.filter(e => {
      const source = graph.nodes.find(n => n.id === e.source);
      const target = graph.nodes.find(n => n.id === e.target);
      return source?.jurisdiction && target?.jurisdiction && 
             source.jurisdiction !== target.jurisdiction;
    }).length;

    // Overall coherence (average of cluster coherence weighted by size)
    const totalNodes = Array.from(jurisdictionGroups.values()).reduce((sum, n) => sum + n.length, 0);
    const coherenceScore = clusters.reduce((sum, c) => 
      sum + c.coherence * (c.nodes.length / totalNodes), 0);

    return {
      coherenceScore,
      jurisdictionClusters: clusters,
      crossBorderConnections,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Graph Operations
  GraphOperations,

  // Centrality Measures
  CentralityMeasuresCalculator,

  // Resilience Analysis
  ResilienceAnalyzer,

  // Flow Analysis
  FlowAnalyzer,

  // Algebraic Topology
  AlgebraicTopology,

  // Mesh Protocols
  MeshProtocols,
};

// Re-export for cooperative game theory integration
import { CooperativeGameTheory } from './AtlasSanctumGameTheory';
