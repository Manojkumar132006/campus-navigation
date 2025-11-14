import { CampusGraphData, BuildingNode, SearchResult } from '@/types/campus';
import { searchRooms, getAllRooms } from './roomData';

export class CampusGraph {
  private graphData: CampusGraphData;
  private adjacencyList: Map<string, string[]>;

  constructor(graphData: CampusGraphData) {
    this.graphData = graphData;
    this.adjacencyList = new Map();
    this.buildAdjacencyList();
  }

  private buildAdjacencyList(): void {
    // Initialize adjacency list for all nodes
    Object.keys(this.graphData.nodes).forEach(node => {
      this.adjacencyList.set(node, []);
    });

    // Build bidirectional edges
    this.graphData.edges.forEach(([node1, node2]) => {
      this.adjacencyList.get(node1)?.push(node2);
      this.adjacencyList.get(node2)?.push(node1);
    });
  }

  getBuildings(): string[] {
    return Object.keys(this.graphData.nodes).sort();
  }

  getNeighbors(buildingName: string): string[] {
    return this.adjacencyList.get(buildingName) || [];
  }

  getBuildingInfo(buildingName: string): BuildingNode | null {
    return this.graphData.nodes[buildingName] || null;
  }

  searchBuildings(query: string): string[] {
    if (!query.trim()) {
      return this.getBuildings();
    }

    const lowerQuery = query.toLowerCase();
    return this.getBuildings().filter(building =>
      building.toLowerCase().includes(lowerQuery)
    );
  }

  // Combined search for buildings and rooms
  search(query: string): SearchResult[] {
    if (!query.trim()) {
      return this.getBuildings().map(name => ({
        type: 'building' as const,
        name
      }));
    }

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search buildings
    const matchingBuildings = this.searchBuildings(query);
    matchingBuildings.forEach(building => {
      results.push({
        type: 'building',
        name: building
      });
    });

    // Search rooms
    const matchingRooms = searchRooms(query);
    matchingRooms.forEach(room => {
      results.push({
        type: 'room',
        name: `Room ${room.roomNumber}`,
        building: `Block ${room.block}`,
        floor: room.floor,
        roomNumber: room.roomNumber
      });
    });

    return results;
  }

  getAllNodes(): Record<string, BuildingNode> {
    return this.graphData.nodes;
  }

  getAllEdges(): [string, string][] {
    return this.graphData.edges;
  }
}
