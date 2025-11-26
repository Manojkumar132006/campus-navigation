import { CampusGraph } from './campusGraph';
import { RoomLabelManager } from './roomLabelManager';
import { TagManager } from './tagManager';
import { TagSearchService } from './tagSearchService';
import { SearchResult } from '@/types/hoodmapsStyle';

export class EnhancedSearchService {
  private campusGraph: CampusGraph;
  private roomLabelManager: RoomLabelManager;
  private tagManager: TagManager | null;
  private tagSearchService: TagSearchService | null;

  constructor(
    campusGraph: CampusGraph,
    roomLabelManager: RoomLabelManager,
    tagManager?: TagManager
  ) {
    this.campusGraph = campusGraph;
    this.roomLabelManager = roomLabelManager;
    this.tagManager = tagManager || null;
    this.tagSearchService = tagManager ? new TagSearchService(tagManager) : null;
  }

  search(query: string): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const buildingResults = this.searchBuildings(query);
    const roomResults = this.searchRoomLabels(query);
    const tagResults = this.searchRoomTags(query);

    // Merge and deduplicate results
    return this.mergeAndDeduplicateResults([
      ...buildingResults,
      ...roomResults,
      ...tagResults
    ]);
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

      // Get tags for this room if tag manager is available
      let tags = undefined;
      if (this.tagManager) {
        tags = this.tagManager.getRoomTags(room.buildingName, room.floor, room.roomNumber);
      }

      return {
        type: 'room' as const,
        name: matchedLabel || room.labels[0] || 'Unlabeled Room',
        building: room.buildingName,
        floor: room.floor,
        roomNumber: room.roomNumber,
        labels: room.labels,
        matchedLabel: matchedLabel,
        tags: tags
      };
    });
  }

  searchRoomTags(query: string): SearchResult[] {
    if (!this.tagSearchService) {
      return [];
    }

    const tagResults = this.tagSearchService.searchByTag(query);

    return tagResults.map(result => {
      // Get labels for this room
      const labels = this.roomLabelManager.getLabels(
        result.building,
        result.floor,
        result.roomNumber
      );

      return {
        type: 'room' as const,
        name: result.name,
        building: result.building,
        floor: result.floor,
        roomNumber: result.roomNumber,
        labels: labels.length > 0 ? labels : undefined,
        tags: result.tags,
        matchedTags: result.matchedTags
      };
    });
  }

  private mergeAndDeduplicateResults(results: SearchResult[]): SearchResult[] {
    const roomMap = new Map<string, SearchResult>();

    results.forEach(result => {
      if (result.type === 'building') {
        // Buildings are unique by name
        if (!roomMap.has(result.name)) {
          roomMap.set(result.name, result);
        }
      } else if (result.type === 'room') {
        // Rooms are unique by building-floor-roomNumber
        const key = `${result.building}-${result.floor}-${result.roomNumber}`;
        const existing = roomMap.get(key);

        if (existing && existing.type === 'room') {
          // Merge labels and tags
          const mergedLabels = Array.from(new Set([
            ...(existing.labels || []),
            ...(result.labels || [])
          ]));

          const mergedTags = Array.from(new Map([
            ...(existing.tags || []).map(t => [t.id, t] as [string, typeof t]),
            ...(result.tags || []).map(t => [t.id, t] as [string, typeof t])
          ]).values());

          const mergedMatchedTags = Array.from(new Map([
            ...(existing.matchedTags || []).map(t => [t.id, t] as [string, typeof t]),
            ...(result.matchedTags || []).map(t => [t.id, t] as [string, typeof t])
          ]).values());

          roomMap.set(key, {
            ...existing,
            labels: mergedLabels.length > 0 ? mergedLabels : undefined,
            tags: mergedTags.length > 0 ? mergedTags : undefined,
            matchedTags: mergedMatchedTags.length > 0 ? mergedMatchedTags : undefined,
            matchedLabel: existing.matchedLabel || result.matchedLabel
          });
        } else {
          roomMap.set(key, result);
        }
      }
    });

    return Array.from(roomMap.values());
  }
}
