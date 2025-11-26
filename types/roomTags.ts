// Core tag system types

export interface Tag {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Display name (1-50 chars)
  categoryId: string;            // Parent category reference
  parentTagId?: string;          // Optional parent tag for hierarchy
  color: string;                 // Hex color code (inherited from category)
  isSystem: boolean;             // True for predefined tags
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}

export interface TagCategory {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Category name
  color: string;                 // Hex color code for all tags in category
  icon: string;                  // Emoji or icon identifier
  isSystem: boolean;             // True for predefined categories
  createdAt: number;             // Timestamp
}

export interface RoomTagAssociation {
  roomKey: string;               // "BuildingName-Floor-RoomNumber"
  tagIds: string[];              // Array of tag IDs applied to this room
  updatedAt: number;             // Last modification timestamp
}

export interface TagStorage {
  categories: Record<string, TagCategory>;
  tags: Record<string, Tag>;
  roomAssociations: Record<string, RoomTagAssociation>;
  version: number;               // Schema version for migrations
}

// Search and statistics types

export interface TagSearchResult {
  type: 'room';
  name: string;
  building: string;
  floor: number;
  roomNumber: string;
  tags: Tag[];
  matchedTags: Tag[];
  relevance: number;
}

export interface TagStatistic {
  tag: Tag;
  categoryName: string;
  usageCount: number;
}

// Error types

export class TagValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TagValidationError';
  }
}

export class TagStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TagStorageError';
  }
}

// Error messages

export const TAG_ERROR_MESSAGES = {
  TAG_NAME_EMPTY: 'Tag name cannot be empty',
  TAG_NAME_TOO_LONG: 'Tag name must be 50 characters or less',
  TAG_DUPLICATE: 'A tag with this name already exists in this category',
  CATEGORY_NOT_FOUND: 'The selected category does not exist',
  HIERARCHY_TOO_DEEP: 'Tag hierarchy cannot exceed 3 levels',
  CIRCULAR_REFERENCE: 'Cannot create circular tag reference',
  STORAGE_FULL: 'Storage limit reached. Please delete some tags or rooms.',
  IMPORT_INVALID: 'Invalid tag data format. Please check your file.',
  SYSTEM_TAG_DELETE: 'System tags cannot be deleted',
  PARENT_CATEGORY_MISMATCH: 'Parent tag must be in the same category'
} as const;

// Unified search result type (includes both labels and tags)

export interface UnifiedSearchResult {
  type: 'building' | 'room';
  name: string;
  building?: string;
  floor?: number;
  roomNumber?: string;
  labels?: string[];
  tags?: Tag[];
  matchedLabel?: string;
  matchedTags?: Tag[];
}

// Room information with both labels and tags

export interface RoomInfo {
  building: string;
  floor: number;
  roomNumber: string;
  labels: string[];
  tags: Tag[];
}
