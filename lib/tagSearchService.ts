import { Tag, RoomTagAssociation, TagSearchResult } from '@/types/roomTags';
import { TagManager } from './tagManager';

export class TagSearchService {
  private tagManager: TagManager;

  constructor(tagManager: TagManager) {
    this.tagManager = tagManager;
  }

  /**
   * Search for rooms by tag name query
   * Returns rooms that have tags matching the query
   */
  searchByTag(query: string): TagSearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const lowerQuery = query.toLowerCase().trim();
    const allTags = this.tagManager.getAllTags();
    
    // Find tags that match the query
    const matchingTags = allTags.filter(tag =>
      tag.name.toLowerCase().includes(lowerQuery)
    );

    if (matchingTags.length === 0) {
      return [];
    }

    // Get all room associations
    const results: TagSearchResult[] = [];
    const roomAssociations = this.tagManager.getAllRoomAssociations();

    roomAssociations.forEach(association => {
      // Get tags for this room
      const roomTags = association.tagIds
        .map(id => this.tagManager.getTag(id))
        .filter((tag): tag is Tag => tag !== null);

      // Find which tags matched the query
      const matched = roomTags.filter(tag =>
        matchingTags.some(mt => mt.id === tag.id)
      );

      if (matched.length > 0) {
        // Parse room key
        const [building, floorStr, roomNumber] = association.roomKey.split('-');
        const floor = parseInt(floorStr, 10);

        // Calculate relevance score
        const relevance = this.calculateRelevance(association, query, matched);

        results.push({
          type: 'room',
          name: matched[0].name, // Use first matched tag as name
          building,
          floor,
          roomNumber,
          tags: roomTags,
          matchedTags: matched,
          relevance
        });
      }
    });

    // Sort by relevance (highest first)
    results.sort((a, b) => b.relevance - a.relevance);

    return results;
  }

  /**
   * Search for rooms that have ALL of the specified tags (AND logic)
   */
  searchByMultipleTags(tagIds: string[]): TagSearchResult[] {
    if (tagIds.length === 0) {
      return [];
    }

    const results: TagSearchResult[] = [];
    const roomAssociations = this.tagManager.getAllRoomAssociations();

    roomAssociations.forEach(association => {
      // Check if room has all specified tags
      const hasAllTags = tagIds.every(tagId =>
        association.tagIds.includes(tagId)
      );

      if (hasAllTags) {
        // Parse room key
        const [building, floorStr, roomNumber] = association.roomKey.split('-');
        const floor = parseInt(floorStr, 10);

        // Get all tags for this room
        const roomTags = association.tagIds
          .map(id => this.tagManager.getTag(id))
          .filter((tag): tag is Tag => tag !== null);

        // Get matched tags
        const matchedTags = roomTags.filter(tag => tagIds.includes(tag.id));

        results.push({
          type: 'room',
          name: matchedTags[0]?.name || 'Tagged Room',
          building,
          floor,
          roomNumber,
          tags: roomTags,
          matchedTags,
          relevance: matchedTags.length
        });
      }
    });

    return results;
  }

  /**
   * Get rooms filtered by tags with AND or OR logic
   */
  getRoomsByTagFilter(tagIds: string[], matchAll: boolean): RoomTagAssociation[] {
    if (tagIds.length === 0) {
      return this.tagManager.getAllRoomAssociations();
    }

    const roomAssociations = this.tagManager.getAllRoomAssociations();

    return roomAssociations.filter(association => {
      if (matchAll) {
        // AND logic: room must have all specified tags
        return tagIds.every(tagId => association.tagIds.includes(tagId));
      } else {
        // OR logic: room must have at least one specified tag
        return tagIds.some(tagId => association.tagIds.includes(tagId));
      }
    });
  }

  /**
   * Calculate relevance score for a search result
   * Higher score = more relevant
   */
  private calculateRelevance(
    room: RoomTagAssociation,
    query: string,
    matchedTags: Tag[]
  ): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    matchedTags.forEach(tag => {
      const lowerTagName = tag.name.toLowerCase();
      
      // Exact match gets highest score
      if (lowerTagName === lowerQuery) {
        score += 100;
      }
      // Starts with query gets high score
      else if (lowerTagName.startsWith(lowerQuery)) {
        score += 50;
      }
      // Contains query gets medium score
      else if (lowerTagName.includes(lowerQuery)) {
        score += 25;
      }

      // Bonus for system tags (they're more commonly used)
      if (tag.isSystem) {
        score += 5;
      }
    });

    // Bonus for multiple matches
    score += matchedTags.length * 10;

    return score;
  }

  /**
   * Get all rooms that have at least one tag
   */
  getAllTaggedRooms(): TagSearchResult[] {
    const results: TagSearchResult[] = [];
    const roomAssociations = this.tagManager.getAllRoomAssociations();

    roomAssociations.forEach(association => {
      const [building, floorStr, roomNumber] = association.roomKey.split('-');
      const floor = parseInt(floorStr, 10);

      const roomTags = association.tagIds
        .map(id => this.tagManager.getTag(id))
        .filter((tag): tag is Tag => tag !== null);

      if (roomTags.length > 0) {
        results.push({
          type: 'room',
          name: roomTags[0].name,
          building,
          floor,
          roomNumber,
          tags: roomTags,
          matchedTags: roomTags,
          relevance: 0
        });
      }
    });

    return results;
  }

  /**
   * Search tags by name (not rooms, just tags)
   */
  searchTags(query: string): Tag[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const lowerQuery = query.toLowerCase().trim();
    return this.tagManager.getAllTags().filter(tag =>
      tag.name.toLowerCase().includes(lowerQuery)
    );
  }
}
