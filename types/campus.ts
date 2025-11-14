export interface Room {
  roomNumber: string;
  floor: number;
  block: string;
  description?: string;
}

export interface BuildingNode {
  name: string;
  type: 'academic' | 'canteen' | 'recreational' | 'facility';
  emoji: string;
  x: number;
  y: number;
  description?: string;
  floors?: number;
  rooms?: Room[];
}

export interface CampusGraphData {
  nodes: Record<string, BuildingNode>;
  edges: [string, string][];
}

export interface RouteResult {
  path: string[];
  distance: number;
  success: boolean;
}

export interface SearchResult {
  type: 'building' | 'room';
  name: string;
  building?: string;
  floor?: number;
  roomNumber?: string;
}
