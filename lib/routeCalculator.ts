import { CampusGraph } from './campusGraph';
import { RouteResult } from '@/types/campus';

export class RouteCalculator {
  private graph: CampusGraph;

  constructor(graph: CampusGraph) {
    this.graph = graph;
  }

  findRoute(start: string, end: string): RouteResult | null {
    // Handle same start and end
    if (start === end) {
      return {
        path: [start],
        distance: 0,
        success: true
      };
    }

    // Validate buildings exist
    if (!this.graph.getBuildingInfo(start) || !this.graph.getBuildingInfo(end)) {
      return null;
    }

    // BFS implementation
    const queue: { node: string; path: string[] }[] = [{ node: start, path: [start] }];
    const visited = new Set<string>([start]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = this.graph.getNeighbors(current.node);

      for (const neighbor of neighbors) {
        if (neighbor === end) {
          const finalPath = [...current.path, neighbor];
          return {
            path: finalPath,
            distance: finalPath.length - 1,
            success: true
          };
        }

        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({
            node: neighbor,
            path: [...current.path, neighbor]
          });
        }
      }
    }

    // No path found
    return {
      path: [],
      distance: 0,
      success: false
    };
  }
}
