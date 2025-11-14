import { CampusGraph } from './campusGraph';
import { RoomLabelManager } from './roomLabelManager';
import { SearchResult } from '@/types/hoodmapsStyle';

export class EnhancedSearchService {
  private campusGraph: CampusGraph;
  private roomLabelManager: RoomLabelManager;

  constructor(campusGraph: CampusGraph, roomLabelManager: RoomLabelManager) {
    this.campusGraph = campusGraph;
    this.roomLabelManager = roomLabelManager;
  }

  search(query: string): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const buildingResults = this.searchBuildings(query);
    const roomResults = this.searchRoomLabels(query);

    return [...buildingResults, ...roomResults];
  }

  searchBuildings(query: string): SearchResult[] {
    const buildings = this.campusGraph.searchBuildings(query);
    
    return buildings.map(buildingName => ({
      type: 'building' as const,
      name: buildingName
    }));
  }

  searchRoomLabels(query: string): SearchResult[] {
    const rooms = this.roomLabelManager.searchByLabel(query);
    const lowerQuery = query.toLowerCase();

    return rooms.map(room => {
      // Find which label matched
      const matchedLabel = room.labels.find(label => 
        label.toLowerCase().includes(lowerQuery)
      );

      return {
        type: 'room' as const,
        name: matchedLabel || room.labels[0] || 'Unlabeled Room',
        building: room.buildingName,
        floor: room.floor,
        roomNumber: room.roomNumber,
        labels: room.labels,
        matchedLabel: matchedLabel
      };
    });
  }
}
