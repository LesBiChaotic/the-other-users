/**
 * Content Graph Validator — The Other Users
 * 
 * Analyzes content dependency graphs for circular critical locks and unreachable orphaned nodes.
 */

export interface GraphNode {
  id: string;
  type: string;
  dependencies: string[]; // Node IDs required to unlock or access this node
}

export interface GraphValidationReport {
  valid: boolean;
  cycles: string[][];
  orphans: string[];
}

export function validateContentGraph(
  nodes: GraphNode[],
  rootNodeIds: string[] = ['root', '/']
): GraphValidationReport {
  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function detectCycle(nodeId: string, currentPath: string[]) {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    const node = nodeMap.get(nodeId);

    if (node) {
      for (const dep of node.dependencies) {
        if (!visited.has(dep)) {
          detectCycle(dep, [...currentPath, dep]);
        } else if (recursionStack.has(dep)) {
          cycles.push([...currentPath, dep]);
        }
      }
    }

    recursionStack.delete(nodeId);
  }

  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      detectCycle(n.id, [n.id]);
    }
  });

  // Reachability analysis from root nodes
  const reachable = new Set<string>();
  const queue = [...rootNodeIds];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (!reachable.has(curr)) {
      reachable.add(curr);
      // Find all nodes that depend on curr or nodes curr depends on
      for (const node of nodes) {
        if (node.dependencies.includes(curr) && !reachable.has(node.id)) {
          queue.push(node.id);
        }
      }
    }
  }

  const orphans: string[] = [];
  for (const node of nodes) {
    if (!reachable.has(node.id) && !rootNodeIds.includes(node.id)) {
      // If a node has dependencies but cannot be reached from root
      orphans.push(node.id);
    }
  }

  return {
    valid: cycles.length === 0 && orphans.length === 0,
    cycles,
    orphans,
  };
}
