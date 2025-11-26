# Design Document: Room Tags System

## Overview

The Room Tags System enhances the existing room labeling functionality by introducing a structured, hierarchical tagging mechanism. This system builds upon the current `RoomLabelManager` and extends it with predefined tag categories, color-coding, hierarchical organization, and advanced filtering capabilities.

The design maintains backward compatibility with existing room labels while providing a richer, more organized approach to categorizing campus spaces. The system will integrate seamlessly with the existing React context architecture and local storage persistence layer.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ RoomTag      │  │ TagFilter    │  │ TagStatistics│  │
│  │ Editor       │  │ Component    │  │ Panel        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Context Layer                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │         RoomTagContext (React Context)           │   │
│  │  - Manages tag state and operations              │   │
│  │  - Provides hooks for components                 │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ TagManager   │  │ TagCategory  │  │ TagSearch    │  │
│  │              │  │ Manager      │  │ Service      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Persistence Layer                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         LocalStorage                             │   │
│  │  - campus-room-tags                              │   │
│  │  - campus-tag-categories                         │   │
│  │  - campus-tag-definitions                        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Component Relationships

The system follows a layered architecture:

1. **UI Layer**: React components for user interaction
2. **Context Layer**: State management using React Context API
3. **Service Layer**: Business logic for tag operations
4. **Persistence Layer**: LocalStorage for data persistence

### Integration with Existing System

The tag system will coexist with the existing label system:
- Existing `RoomLabelManager` continues to handle free-form labels
- New `TagManager` handles structured tags
- Both systems share the same room identification scheme (building-floor-room)
- UI components will display both labels and tags
- Search functionality will query both systems

## Components and Interfaces

### Core Data Models

#### Tag
```typescript
interface Tag {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Display name (1-50 chars)
  categoryId: string;            // Parent category reference
  parentTagId?: string;          // Optional parent tag for hierarchy
  color: string;                 // Hex color code (inherited from category)
  isSystem: boolean;             // True for predefined tags
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}
```

#### TagCategory
```typescript
interface TagCategory {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Category name
  color: string;                 // Hex color code for all tags in category
  icon: string;                  // Emoji or icon identifier
  isSystem: boolean;             // True for predefined categories
  createdAt: number;             // Timestamp
}
```

#### RoomTagAssociation
```typescript
interface RoomTagAssociation {
  roomKey: string;               // "BuildingName-Floor-RoomNumber"
  tagIds: string[];              // Array of tag IDs applied to this room
  updatedAt: number;             // Last modification timestamp
}
```

#### TagStorage
```typescript
interface TagStorage {
  categories: Record<string, TagCategory>;
  tags: Record<string, Tag>;
  roomAssociations: Record<string, RoomTagAssociation>;
  version: number;               // Schema version for migrations
}
```

### Service Classes

#### TagManager

Primary service for managing tags and their associations with rooms.

```typescript
class TagManager {
  private storage: TagStorage;
  
  // Initialization
  constructor();
  private loadFromStorage(): TagStorage;
  private saveToStorage(): void;
  private initializeDefaultTags(): void;
  
  // Category operations
  createCategory(name: string, color: string, icon: string): TagCategory;
  getCategory(categoryId: string): TagCategory | null;
  getAllCategories(): TagCategory[];
  deleteCategory(categoryId: string): void;
  
  // Tag operations
  createTag(name: string, categoryId: string, parentTagId?: string): Tag;
  getTag(tagId: string): Tag | null;
  getTagsByCategory(categoryId: string): Tag[];
  getAllTags(): Tag[];
  updateTag(tagId: string, updates: Partial<Tag>): void;
  deleteTag(tagId: string): void;
  
  // Room-tag associations
  applyTagToRoom(building: string, floor: number, room: string, tagId: string): void;
  removeTagFromRoom(building: string, floor: number, room: string, tagId: string): void;
  getRoomTags(building: string, floor: number, room: string): Tag[];
  getRoomsByTag(tagId: string): RoomTagAssociation[];
  
  // Utility operations
  getTagUsageCount(tagId: string): number;
  getTagStatistics(): TagStatistic[];
  exportTags(): string;
  importTags(jsonData: string): void;
  
  // Helper methods
  private generateKey(building: string, floor: number, room: string): string;
  private validateTagName(name: string): void;
  private generateColor(): string;
}
```

#### TagSearchService

Extends the existing search functionality to include tag-based queries.

```typescript
class TagSearchService {
  private tagManager: TagManager;
  
  constructor(tagManager: TagManager);
  
  searchByTag(query: string): TagSearchResult[];
  searchByMultipleTags(tagIds: string[]): TagSearchResult[];
  getRoomsByTagFilter(tagIds: string[], matchAll: boolean): RoomTagAssociation[];
  
  private calculateRelevance(room: RoomTagAssociation, query: string): number;
}
```

#### TagHierarchyManager

Manages parent-child relationships between tags.

```typescript
class TagHierarchyManager {
  private tagManager: TagManager;
  
  constructor(tagManager: TagManager);
  
  getChildTags(parentTagId: string): Tag[];
  getParentTag(tagId: string): Tag | null;
  getTagPath(tagId: string): Tag[];
  validateHierarchy(tagId: string, parentTagId: string): boolean;
  getMaxDepth(tagId: string): number;
  
  private detectCircularReference(tagId: string, parentTagId: string): boolean;
}
```

### React Components

#### RoomTagEditor

Enhanced version of the existing RoomLabelEditor that supports both labels and tags.

```typescript
interface RoomTagEditorProps {
  building: string;
  floor: number;
  roomNumber: string;
  onClose: () => void;
}

// Features:
// - Display existing labels and tags
// - Tabbed interface: "Quick Labels" and "Structured Tags"
// - Category-based tag selection
// - Tag search within editor
// - Visual hierarchy display for nested tags
```

#### TagFilterPanel

New component for filtering rooms by tags.

```typescript
interface TagFilterPanelProps {
  onFilterChange: (selectedTagIds: string[]) => void;
  matchAll?: boolean; // AND vs OR logic
}

// Features:
// - Category-grouped tag checkboxes
// - "Match All" vs "Match Any" toggle
// - Active filter count badge
// - Clear all filters button
```

#### TagStatisticsPanel

New component for displaying tag usage statistics.

```typescript
interface TagStatisticsPanelProps {
  onTagClick?: (tagId: string) => void;
}

// Features:
// - Sortable table of tags with usage counts
// - Category filtering
// - Visual bar chart representation
// - Export statistics button
```

### React Context

#### RoomTagContext

New context for managing tag state across the application.

```typescript
interface RoomTagContextType {
  tagManager: TagManager;
  
  // Category operations
  categories: TagCategory[];
  createCategory: (name: string, color: string, icon: string) => TagCategory;
  
  // Tag operations
  tags: Tag[];
  createTag: (name: string, categoryId: string, parentTagId?: string) => Tag;
  deleteTag: (tagId: string) => void;
  
  // Room-tag operations
  applyTag: (building: string, floor: number, room: string, tagId: string) => void;
  removeTag: (building: string, floor: number, room: string, tagId: string) => void;
  getRoomTags: (building: string, floor: number, room: string) => Tag[];
  
  // Search and filter
  searchTags: (query: string) => Tag[];
  filterRoomsByTags: (tagIds: string[], matchAll: boolean) => RoomTagAssociation[];
  
  // Statistics
  getTagStatistics: () => TagStatistic[];
  
  // Import/Export
  exportTags: () => string;
  importTags: (jsonData: string) => void;
  
  // Refresh
  refreshTags: () => void;
}
```

## Data Models

### Default Tag Categories

The system will initialize with these predefined categories:

```typescript
const DEFAULT_CATEGORIES: TagCategory[] = [
  {
    id: 'cat-activities',
    name: 'Activities',
    color: '#3B82F6', // Blue
    icon: '🎯',
    isSystem: true
  },
  {
    id: 'cat-facilities',
    name: 'Facilities',
    color: '#10B981', // Green
    icon: '🏢',
    isSystem: true
  },
  {
    id: 'cat-accessibility',
    name: 'Accessibility',
    color: '#8B5CF6', // Purple
    icon: '♿',
    isSystem: true
  },
  {
    id: 'cat-amenities',
    name: 'Amenities',
    color: '#F59E0B', // Amber
    icon: '⭐',
    isSystem: true
  }
];
```

### Default Tags

```typescript
const DEFAULT_TAGS: Tag[] = [
  // Activities
  { id: 'tag-dance', name: 'Dance Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-music', name: 'Music Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-art', name: 'Art Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-robotics', name: 'Robotics Club', categoryId: 'cat-activities', isSystem: true },
  { id: 'tag-drama', name: 'Drama Club', categoryId: 'cat-activities', isSystem: true },
  
  // Facilities
  { id: 'tag-lab', name: 'Laboratory', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-workshop', name: 'Workshop', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-study', name: 'Study Room', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-meeting', name: 'Meeting Room', categoryId: 'cat-facilities', isSystem: true },
  { id: 'tag-lounge', name: 'Lounge', categoryId: 'cat-facilities', isSystem: true },
  
  // Accessibility
  { id: 'tag-wheelchair', name: 'Wheelchair Accessible', categoryId: 'cat-accessibility', isSystem: true },
  { id: 'tag-elevator', name: 'Elevator Access', categoryId: 'cat-accessibility', isSystem: true },
  { id: 'tag-ramp', name: 'Ramp Available', categoryId: 'cat-accessibility', isSystem: true },
  
  // Amenities
  { id: 'tag-wifi', name: 'WiFi Available', categoryId: 'cat-amenities', isSystem: true },
  { id: 'tag-projector', name: 'Projector', categoryId: 'cat-amenities', isSystem: true },
  { id: 'tag-whiteboard', name: 'Whiteboard', categoryId: 'cat-amenities', isSystem: true },
  { id: 'tag-ac', name: 'Air Conditioning', categoryId: 'cat-amenities', isSystem: true }
];
```

### Storage Schema

Three separate LocalStorage keys will be used:

1. **campus-tag-storage**: Complete tag storage object
2. **campus-room-labels**: Existing label storage (unchanged)
3. **campus-tag-version**: Schema version for future migrations

### Color Generation Algorithm

When the predefined color palette is exhausted, new colors will be generated using HSL:

```typescript
function generateColor(index: number): string {
  const hue = (index * 137.508) % 360; // Golden angle
  const saturation = 65 + (index % 3) * 10; // 65-85%
  const lightness = 50 + (index % 2) * 10; // 50-60%
  return hslToHex(hue, saturation, lightness);
}
```

## Error Handling

### Validation Errors

```typescript
class TagValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TagValidationError';
  }
}
```

**Validation Rules:**
- Tag names: 1-50 characters, non-empty after trim
- Category names: 1-30 characters
- Hierarchy depth: Maximum 3 levels
- No circular references in tag hierarchies
- No duplicate tag names within the same category

### Storage Errors

```typescript
class TagStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TagStorageError';
  }
}
```

**Error Scenarios:**
- LocalStorage quota exceeded
- JSON parse errors during import
- Invalid schema version
- Corrupted storage data

### Error Recovery

1. **Storage Quota Exceeded**: Display user-friendly message suggesting cleanup
2. **Parse Errors**: Attempt to recover partial data, log errors to console
3. **Invalid Imports**: Reject import, preserve existing data, show detailed error
4. **Circular References**: Prevent creation, suggest alternative parent

### User-Facing Error Messages

```typescript
const ERROR_MESSAGES = {
  TAG_NAME_EMPTY: 'Tag name cannot be empty',
  TAG_NAME_TOO_LONG: 'Tag name must be 50 characters or less',
  TAG_DUPLICATE: 'A tag with this name already exists in this category',
  CATEGORY_NOT_FOUND: 'The selected category does not exist',
  HIERARCHY_TOO_DEEP: 'Tag hierarchy cannot exceed 3 levels',
  CIRCULAR_REFERENCE: 'Cannot create circular tag reference',
  STORAGE_FULL: 'Storage limit reached. Please delete some tags or rooms.',
  IMPORT_INVALID: 'Invalid tag data format. Please check your file.',
  SYSTEM_TAG_DELETE: 'System tags cannot be deleted'
};
```

## Testing Strategy

### Unit Testing

The testing approach will use **Vitest** as the testing framework, chosen for its speed, native ESM support, and excellent TypeScript integration.

**Test Coverage Areas:**

1. **TagManager Tests**
   - Tag creation with valid and invalid names
   - Category management operations
   - Room-tag association operations
   - Tag deletion and cascade effects
   - Storage persistence and retrieval
   - Import/export functionality

2. **TagHierarchyManager Tests**
   - Parent-child relationship creation
   - Circular reference detection
   - Maximum depth validation
   - Tag path retrieval
   - Hierarchy traversal

3. **TagSearchService Tests**
   - Single tag search
   - Multi-tag filtering with AND/OR logic
   - Relevance scoring
   - Empty query handling
   - Special character handling

4. **Color Generation Tests**
   - Unique color generation
   - HSL to Hex conversion
   - Color palette exhaustion handling

5. **Validation Tests**
   - Tag name validation
   - Category validation
   - Hierarchy validation
   - Import data validation

### Property-Based Testing

Property-based testing will be implemented using **fast-check**, a property-based testing library for TypeScript/JavaScript that generates random test cases to verify universal properties.

**Configuration:**
- Minimum 100 iterations per property test
- Each property test will be tagged with: `**Feature: room-tags, Property {number}: {property_text}**`
- Tests will use custom generators for domain-specific data (tags, categories, room identifiers)

**Custom Generators:**

```typescript
// Generator for valid tag names
const tagNameArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => s.trim().length > 0);

// Generator for room identifiers
const roomKeyArbitrary = fc.record({
  building: fc.constantFrom('Block A', 'Block B', 'Block C', 'Block D', 'Block E'),
  floor: fc.integer({ min: 0, max: 5 }),
  roomNumber: fc.integer({ min: 100, max: 599 }).map(n => n.toString())
});

// Generator for tag hierarchies (max depth 3)
const tagHierarchyArbitrary = fc.array(
  fc.record({
    id: fc.uuid(),
    name: tagNameArbitrary,
    categoryId: fc.uuid(),
    parentTagId: fc.option(fc.uuid(), { nil: undefined })
  }),
  { minLength: 1, maxLength: 20 }
);
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Tag application persistence
*For any* room and predefined tag, applying the tag to the room should result in the tag appearing in the room's tag list when retrieved from storage.
**Validates: Requirements 1.3**

### Property 2: Tag application idempotence
*For any* room and tag, applying the same tag twice should result in the tag appearing exactly once in the room's tag list.
**Validates: Requirements 1.4**

### Property 3: Multiple tags preserve category colors
*For any* room with multiple tags from different categories, retrieving the room's tags should return each tag with its correct category color intact.
**Validates: Requirements 1.5**

### Property 4: Tag name length validation
*For any* string, creating a tag with that string as a name should succeed if and only if the trimmed length is between 1 and 50 characters.
**Validates: Requirements 2.1**

### Property 5: Tag requires valid category
*For any* tag name and category ID, creating a tag should succeed if and only if the category ID corresponds to an existing category.
**Validates: Requirements 2.2**

### Property 6: Tag creation assigns unique identifiers
*For any* sequence of valid tag creations, each created tag should have a unique ID and a non-zero timestamp.
**Validates: Requirements 2.3**

### Property 7: Duplicate tag names prevented within category
*For any* category containing a tag with name N, attempting to create another tag with name N in the same category should fail.
**Validates: Requirements 2.4**

### Property 8: Tag creation round-trip
*For any* valid tag, creating it and then retrieving it from storage should return a tag with the same name and category.
**Validates: Requirements 2.5**

### Property 9: Multi-tag filter uses AND logic
*For any* set of tag IDs, filtering rooms should return only rooms that have all tags in the set applied.
**Validates: Requirements 3.1**

### Property 10: Filter removal consistency
*For any* set of tags [A, B, C], filtering with [A, B, C] then removing C should produce the same results as filtering with just [A, B].
**Validates: Requirements 3.3**

### Property 11: Clear filter returns all rooms
*For any* set of rooms with tags, applying no filter should return all rooms that have at least one tag.
**Validates: Requirements 3.4**

### Property 12: Tag inherits category color
*For any* tag, the tag's color should match its parent category's color.
**Validates: Requirements 4.1**

### Property 13: Category creation assigns color
*For any* new category, it should be assigned a non-empty, valid hex color code.
**Validates: Requirements 4.2**

### Property 14: Multiple category tags maintain colors
*For any* room with tags from N different categories, each tag should have a color matching its category, and tags from different categories should have different colors.
**Validates: Requirements 4.3**

### Property 15: Color generation always produces valid colors
*For any* number of categories created beyond the predefined palette, each should have a valid hex color code in the format #RRGGBB.
**Validates: Requirements 4.4**

### Property 16: Search queries both tags and labels
*For any* search query that matches a tag name, the search results should include all rooms with that tag applied.
**Validates: Requirements 5.1**

### Property 17: Search results contain complete information
*For any* non-empty search results, each result should contain building name, floor number, room number, and the list of applied tags.
**Validates: Requirements 5.2**

### Property 18: Substring search matches tags
*For any* tag name and any substring of that name, searching for the substring should return all rooms with that tag.
**Validates: Requirements 5.3**

### Property 19: Search results sorted by relevance
*For any* search query, results with exact tag name matches should appear before results with partial matches.
**Validates: Requirements 5.5**

### Property 20: Parent tag must be in same category
*For any* tag with a parent tag specified, both tags must belong to the same category.
**Validates: Requirements 6.1**

### Property 21: Parent deletion promotes children
*For any* parent tag with child tags, deleting the parent should result in all child tags having no parent (parentTagId = undefined).
**Validates: Requirements 6.4**

### Property 22: Tag hierarchy depth limited
*For any* tag hierarchy, the maximum depth from any root tag to its deepest descendant should not exceed 3 levels.
**Validates: Requirements 6.5**

### Property 23: Tag statistics count accuracy
*For any* tag, the usage count in statistics should equal the number of rooms that have that tag applied.
**Validates: Requirements 7.1**

### Property 24: Statistics sorted by usage
*For any* tag statistics result, tags should be ordered such that for any two consecutive tags, the first has usage count greater than or equal to the second.
**Validates: Requirements 7.2**

### Property 25: Statistics include category metadata
*For any* tag in statistics, the result should include the tag's category name and color.
**Validates: Requirements 7.4**

### Property 26: Statistics reflect current state
*For any* system state, computing statistics then applying a tag to a room should result in that tag's count increasing by 1 when statistics are recomputed.
**Validates: Requirements 7.5**

### Property 27: Export produces valid JSON
*For any* tag system state, exporting should produce a string that can be parsed as valid JSON.
**Validates: Requirements 8.1**

### Property 28: Invalid import rejected
*For any* JSON string that does not match the TagStorage schema, importing should fail and leave the existing state unchanged.
**Validates: Requirements 8.2, 8.3**

### Property 29: Import merge preserves existing data
*For any* existing tag system state and valid import data, importing should result in a state containing all original tags plus all imported tags without duplicates.
**Validates: Requirements 8.4**

### Property 30: Tag removal from room
*For any* room with a tag applied, removing that tag should result in the tag no longer appearing in the room's tag list.
**Validates: Requirements 9.1**

### Property 31: Tag removal round-trip
*For any* room-tag association, removing the tag and then querying storage should reflect the removal.
**Validates: Requirements 9.5**

### Property 32: Tag deletion cascades to rooms
*For any* tag applied to N rooms, deleting the tag should result in the tag being removed from all N rooms.
**Validates: Requirements 10.1**

### Property 33: Tag deletion removes definition
*For any* tag, deleting it should result in the tag no longer appearing in the list of all tags.
**Validates: Requirements 10.2**

### Property 34: System tags cannot be deleted
*For any* tag where isSystem is true, attempting to delete it should fail and the tag should remain in the system.
**Validates: Requirements 10.3**

### Property 35: Tag deletion round-trip
*For any* tag, deleting it and then querying storage should reflect the deletion.
**Validates: Requirements 10.5**

## Integration Points

### Integration with Existing RoomLabelManager

The tag system will coexist with the existing label system:

```typescript
// Unified room information retrieval
interface RoomInfo {
  building: string;
  floor: number;
  roomNumber: string;
  labels: string[];        // From RoomLabelManager
  tags: Tag[];             // From TagManager
}

// Unified search results
interface UnifiedSearchResult {
  type: 'building' | 'room';
  name: string;
  building?: string;
  floor?: number;
  roomNumber?: string;
  labels?: string[];       // From RoomLabelManager
  tags?: Tag[];            // From TagManager
  matchedLabel?: string;
  matchedTags?: Tag[];
}
```

### Integration with EnhancedSearchService

The existing `EnhancedSearchService` will be extended:

```typescript
class EnhancedSearchService {
  private campusGraph: CampusGraph;
  private roomLabelManager: RoomLabelManager;
  private tagManager: TagManager;              // New
  private tagSearchService: TagSearchService;  // New

  search(query: string): UnifiedSearchResult[] {
    const buildingResults = this.searchBuildings(query);
    const labelResults = this.searchRoomLabels(query);
    const tagResults = this.tagSearchService.searchByTag(query);  // New
    
    return this.mergeAndDeduplicateResults([
      ...buildingResults,
      ...labelResults,
      ...tagResults
    ]);
  }
}
```

### Integration with UI Components

Existing components will be enhanced:

1. **RoomLabelEditor** → **RoomTagEditor**
   - Tabbed interface: "Quick Labels" | "Structured Tags"
   - Labels tab shows existing free-form label functionality
   - Tags tab shows category-based tag selection

2. **EnhancedSearchBar**
   - Search results will include both labels and tags
   - Visual distinction between label matches and tag matches
   - Tag matches show category color

3. **HoodmapsStyleMap**
   - Rooms with tags can be highlighted by tag filter
   - Color overlay based on selected tag categories

## Migration Strategy

### Backward Compatibility

1. **Existing Labels Preserved**: All existing room labels remain functional
2. **Dual System**: Labels and tags coexist independently
3. **No Breaking Changes**: Existing components continue to work

### Optional Migration Path

Users can optionally convert labels to tags:

```typescript
interface LabelToTagMigration {
  suggestTagsForLabel(label: string): Tag[];
  convertLabelToTag(
    building: string,
    floor: number,
    room: string,
    label: string,
    targetTagId: string
  ): void;
  bulkConvertLabels(mappings: Map<string, string>): void;
}
```

### Storage Migration

Schema versioning will handle future changes:

```typescript
interface TagStorage {
  version: number;  // Current: 1
  // ... other fields
}

function migrateStorage(oldVersion: number, data: any): TagStorage {
  if (oldVersion < 1) {
    // Migration logic
  }
  return data;
}
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load tag definitions only when needed
2. **Caching**: Cache frequently accessed tag-room associations
3. **Indexing**: Maintain reverse index for tag-to-rooms lookups
4. **Debouncing**: Debounce search and filter operations

### Storage Limits

LocalStorage has a typical limit of 5-10MB per domain:

- **Estimated Storage per Tag**: ~200 bytes
- **Estimated Storage per Room Association**: ~100 bytes
- **Capacity**: ~25,000 tags or ~50,000 room associations

### Performance Targets

- Tag application: < 50ms
- Search query: < 100ms
- Filter operation: < 150ms
- Statistics calculation: < 200ms
- Export/Import: < 500ms

## Security Considerations

### Input Sanitization

All user inputs will be sanitized:

```typescript
function sanitizeTagName(name: string): string {
  return name
    .trim()
    .replace(/[<>]/g, '')  // Remove potential HTML
    .substring(0, 50);      // Enforce length limit
}
```

### XSS Prevention

- All tag names and labels will be escaped before rendering
- React's built-in XSS protection will be leveraged
- No `dangerouslySetInnerHTML` usage

### Storage Security

- LocalStorage is origin-bound (same-origin policy)
- No sensitive data stored (only room tags)
- Export/Import validates data structure

## Accessibility

### WCAG 2.1 Compliance

1. **Keyboard Navigation**
   - All tag operations accessible via keyboard
   - Tab order follows logical flow
   - Enter/Space to select tags

2. **Screen Reader Support**
   - ARIA labels for all interactive elements
   - Announcements for tag application/removal
   - Semantic HTML structure

3. **Color Contrast**
   - Tag colors meet WCAG AA contrast ratio (4.5:1)
   - Alternative text indicators for color-blind users
   - Pattern/icon support in addition to color

4. **Focus Management**
   - Visible focus indicators
   - Focus trap in modal dialogs
   - Focus restoration after operations

### Accessibility Features

```typescript
// Example ARIA attributes
<button
  aria-label={`Apply ${tag.name} tag to room ${roomNumber}`}
  aria-pressed={isApplied}
  role="switch"
>
  {tag.name}
</button>

<div
  role="region"
  aria-label="Tag filter"
  aria-live="polite"
  aria-atomic="true"
>
  {filteredRooms.length} rooms match your filter
</div>
```

## Future Enhancements

### Phase 2 Features

1. **Tag Templates**: Predefined tag sets for common room types
2. **Bulk Operations**: Apply tags to multiple rooms at once
3. **Tag Suggestions**: ML-based tag recommendations
4. **Tag Sharing**: Share tag configurations via URL
5. **Tag History**: Track tag changes over time
6. **Tag Permissions**: Role-based tag management
7. **Tag Analytics**: Usage patterns and insights
8. **Tag Synonyms**: Alternative names for tags
9. **Tag Descriptions**: Detailed information for each tag
10. **Tag Icons**: Custom icons for tags

### Potential Integrations

1. **Calendar Integration**: Link tags to event schedules
2. **Booking System**: Reserve rooms by tag criteria
3. **Navigation**: Route to rooms by tag
4. **Notifications**: Alert when tagged rooms are available
5. **API**: RESTful API for external integrations

## Conclusion

The Room Tags System provides a structured, scalable approach to categorizing campus spaces while maintaining full backward compatibility with the existing label system. The design emphasizes:

- **Flexibility**: Support for both predefined and custom tags
- **Organization**: Hierarchical tag structure with categories
- **Usability**: Intuitive UI with visual color coding
- **Performance**: Efficient storage and retrieval
- **Extensibility**: Clear path for future enhancements

The property-based testing strategy ensures correctness across a wide range of inputs, while the comprehensive error handling provides a robust user experience.
