# Room Tags System - Technical Documentation

## Overview

The Room Tags System is a comprehensive tagging solution for campus rooms that provides structured, categorized, and hierarchical organization of room metadata. It extends the existing room labeling system with advanced features including color-coding, filtering, statistics, and import/export capabilities.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ RoomTag      │  │ TagFilter    │  │ TagStatistics│  │
│  │ Editor       │  │ Panel        │  │ Panel        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Context Layer                            │
│  ┌──────────────────────────────────────────────────┐   │
│  │         RoomTagContext (React Context)           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ TagManager   │  │ TagHierarchy │  │ TagSearch    │  │
│  │              │  │ Manager      │  │ Service      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Persistence Layer                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         LocalStorage                             │   │
│  │  - campus-tag-storage                            │   │
│  │  - campus-tag-version                            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
types/
  roomTags.ts                 # Type definitions for tags, categories, and storage

lib/
  tagManager.ts               # Core tag management service
  tagHierarchyManager.ts      # Tag hierarchy operations
  tagSearchService.ts         # Tag search and filtering
  enhancedSearchService.ts    # Unified search (updated for tags)

contexts/
  RoomTagContext.tsx          # React context for tag state management

components/
  RoomTagEditor.tsx           # Main tag editor UI (replaces RoomLabelEditor)
  TagFilterPanel.tsx          # Tag filtering UI
  TagStatisticsPanel.tsx      # Tag statistics and analytics UI

public/
  sample-room-tags.json       # Sample tag data for testing

docs/
  ROOM-TAGGING-GUIDE.md       # User guide
  TAG-SYSTEM-README.md        # Technical documentation (this file)
```

## Data Models

### Tag
```typescript
interface Tag {
  id: string;                    // UUID
  name: string;                  // 1-50 characters
  categoryId: string;            // Parent category reference
  parentTagId?: string;          // Optional parent tag for hierarchy
  color: string;                 // Hex color (inherited from category)
  isSystem: boolean;             // True for predefined tags
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}
```

### TagCategory
```typescript
interface TagCategory {
  id: string;                    // UUID
  name: string;                  // Category name
  color: string;                 // Hex color for all tags in category
  icon: string;                  // Emoji or icon identifier
  isSystem: boolean;             // True for predefined categories
  createdAt: number;             // Timestamp
}
```

### RoomTagAssociation
```typescript
interface RoomTagAssociation {
  roomKey: string;               // "BuildingName-Floor-RoomNumber"
  tagIds: string[];              // Array of tag IDs
  updatedAt: number;             // Last modification timestamp
}
```

### TagStorage
```typescript
interface TagStorage {
  categories: Record<string, TagCategory>;
  tags: Record<string, Tag>;
  roomAssociations: Record<string, RoomTagAssociation>;
  version: number;               // Schema version
}
```

## Service Classes

### TagManager

Primary service for managing tags and their associations.

**Key Methods:**
- `createCategory(name, color, icon)` - Create a new tag category
- `createTag(name, categoryId, parentTagId?)` - Create a new tag
- `applyTagToRoom(building, floor, room, tagId)` - Apply tag to room
- `removeTagFromRoom(building, floor, room, tagId)` - Remove tag from room
- `getRoomTags(building, floor, room)` - Get all tags for a room
- `deleteTag(tagId)` - Delete tag and remove from all rooms
- `getTagStatistics()` - Get usage statistics for all tags
- `exportTags()` - Export all tags as JSON
- `importTags(jsonData)` - Import tags from JSON

**Storage:**
- LocalStorage key: `campus-tag-storage`
- Version key: `campus-tag-version`
- Current version: 1

### TagHierarchyManager

Manages parent-child relationships between tags.

**Key Methods:**
- `getChildTags(parentTagId)` - Get all child tags
- `getParentTag(tagId)` - Get parent tag
- `getTagPath(tagId)` - Get full path from root to tag
- `validateHierarchy(tagId, parentTagId)` - Validate hierarchy rules
- `getMaxDepth(tagId)` - Get maximum depth of hierarchy
- `promoteChildren(parentTagId)` - Promote children to root level

**Rules:**
- Maximum depth: 3 levels
- Parent and child must be in same category
- No circular references allowed

### TagSearchService

Provides search and filtering capabilities.

**Key Methods:**
- `searchByTag(query)` - Search rooms by tag name
- `searchByMultipleTags(tagIds)` - Search with multiple tags (AND logic)
- `getRoomsByTagFilter(tagIds, matchAll)` - Filter rooms by tags
- `searchTags(query)` - Search tags by name

**Relevance Scoring:**
- Exact match: +100 points
- Starts with query: +50 points
- Contains query: +25 points
- System tag bonus: +5 points
- Multiple matches: +10 points per match

## React Components

### RoomTagEditor

Main UI for applying tags to rooms. Features:
- Tabbed interface: "Structured Tags" and "Quick Labels"
- Category-based tag browsing
- Tag search within editor
- Visual hierarchy display
- Custom tag creation
- Applied tags display with removal

**Props:**
```typescript
interface RoomTagEditorProps {
  building: string;
  floor: number;
  roomNumber: string;
  onClose: () => void;
}
```

### TagFilterPanel

UI for filtering rooms by tags. Features:
- Category-grouped tag checkboxes
- Match All (AND) vs Match Any (OR) toggle
- Active filter count badge
- Clear all filters button
- Expandable categories

**Props:**
```typescript
interface TagFilterPanelProps {
  onFilterChange: (selectedTagIds: string[]) => void;
  matchAll?: boolean;
  onMatchAllChange?: (matchAll: boolean) => void;
}
```

### TagStatisticsPanel

UI for viewing tag usage statistics. Features:
- Sortable table (name, category, usage)
- Category filtering
- Visual bar chart representation
- Export statistics button
- Usage summary

**Props:**
```typescript
interface TagStatisticsPanelProps {
  onTagClick?: (tagId: string) => void;
}
```

## Integration Points

### With Existing RoomLabelManager

The tag system coexists with the existing label system:
- Both systems use the same room identification scheme
- Search results include both labels and tags
- UI displays both labels and tags
- No breaking changes to existing functionality

### With EnhancedSearchService

Updated to search across buildings, labels, and tags:
- Unified search results
- Automatic deduplication
- Merged label and tag information
- Color-coded tag display in results

## Default Tags

### Categories
1. **Activities** (Blue #3B82F6, 🎯)
2. **Facilities** (Green #10B981, 🏢)
3. **Accessibility** (Purple #8B5CF6, ♿)
4. **Amenities** (Amber #F59E0B, ⭐)

### Predefined Tags
- **Activities**: Dance Club, Music Club, Art Club, Robotics Club, Drama Club
- **Facilities**: Laboratory, Workshop, Study Room, Meeting Room, Lounge
- **Accessibility**: Wheelchair Accessible, Elevator Access, Ramp Available
- **Amenities**: WiFi Available, Projector, Whiteboard, Air Conditioning

## Validation Rules

### Tag Names
- Length: 1-50 characters (after trim)
- No duplicates within same category
- Case-insensitive duplicate checking

### Category Names
- Length: 1-30 characters

### Hierarchy
- Maximum depth: 3 levels
- Parent must be in same category
- No circular references
- System tags cannot be deleted

### Storage
- LocalStorage limit: ~5-10MB
- Estimated capacity: ~25,000 tags or ~50,000 room associations

## Error Handling

### Error Types
```typescript
class TagValidationError extends Error
class TagStorageError extends Error
```

### Error Messages
- `TAG_NAME_EMPTY`: "Tag name cannot be empty"
- `TAG_NAME_TOO_LONG`: "Tag name must be 50 characters or less"
- `TAG_DUPLICATE`: "A tag with this name already exists in this category"
- `CATEGORY_NOT_FOUND`: "The selected category does not exist"
- `HIERARCHY_TOO_DEEP`: "Tag hierarchy cannot exceed 3 levels"
- `CIRCULAR_REFERENCE`: "Cannot create circular tag reference"
- `STORAGE_FULL`: "Storage limit reached. Please delete some tags or rooms."
- `IMPORT_INVALID`: "Invalid tag data format. Please check your file."
- `SYSTEM_TAG_DELETE`: "System tags cannot be deleted"

## Color Generation

When predefined colors are exhausted, new colors are generated using HSL:

```typescript
function generateColor(index: number): string {
  const hue = (index * 137.508) % 360;      // Golden angle
  const saturation = 65 + (index % 3) * 10; // 65-85%
  const lightness = 50 + (index % 2) * 10;  // 50-60%
  return hslToHex(hue, saturation, lightness);
}
```

## Performance Considerations

### Optimization Strategies
- Lazy loading of tag definitions
- Caching of frequently accessed associations
- Reverse index for tag-to-rooms lookups
- Debounced search and filter operations

### Performance Targets
- Tag application: < 50ms
- Search query: < 100ms
- Filter operation: < 150ms
- Statistics calculation: < 200ms
- Export/Import: < 500ms

## Security

### Input Sanitization
All user inputs are sanitized:
- Trim whitespace
- Remove HTML characters
- Enforce length limits
- Validate structure

### XSS Prevention
- React's built-in XSS protection
- No `dangerouslySetInnerHTML` usage
- All user content escaped before rendering

### Storage Security
- LocalStorage is origin-bound (same-origin policy)
- No sensitive data stored
- Export/Import validates data structure

## Accessibility

### WCAG 2.1 Compliance
- Full keyboard navigation
- Screen reader support with ARIA labels
- Color contrast meets WCAG AA (4.5:1)
- Visible focus indicators
- Focus trap in modal dialogs

### Keyboard Shortcuts
- **Enter**: Apply tag or create custom tag
- **Escape**: Close tag editor
- **Tab**: Navigate between elements
- **Space**: Toggle tag selection

## Testing

### Unit Testing
Test coverage for:
- Tag creation and validation
- Category management
- Room-tag associations
- Hierarchy validation
- Search and filtering
- Import/export functionality

### Property-Based Testing
Using fast-check library:
- Tag name validation across random inputs
- Hierarchy depth validation
- Circular reference detection
- Import/export round-trip
- Search relevance scoring

## Migration from Labels

### Coexistence Strategy
- Both systems work independently
- No data migration required
- Users can use both simultaneously
- Gradual adoption possible

### Optional Migration Path
1. Review existing labels
2. Identify common patterns
3. Create custom tags for patterns
4. Apply tags to rooms
5. Keep labels for unique descriptions

## API Reference

### TagManager API

```typescript
// Category operations
createCategory(name: string, color: string, icon: string): TagCategory
getCategory(categoryId: string): TagCategory | null
getAllCategories(): TagCategory[]
deleteCategory(categoryId: string): void

// Tag operations
createTag(name: string, categoryId: string, parentTagId?: string): Tag
getTag(tagId: string): Tag | null
getTagsByCategory(categoryId: string): Tag[]
getAllTags(): Tag[]
updateTag(tagId: string, updates: Partial<Tag>): void
deleteTag(tagId: string): void

// Room-tag associations
applyTagToRoom(building: string, floor: number, room: string, tagId: string): void
removeTagFromRoom(building: string, floor: number, room: string, tagId: string): void
getRoomTags(building: string, floor: number, room: string): Tag[]
getRoomsByTag(tagId: string): RoomTagAssociation[]

// Utility operations
getTagUsageCount(tagId: string): number
getTagStatistics(): TagStatistic[]
exportTags(): string
importTags(jsonData: string): void
```

### React Context API

```typescript
// Access via useRoomTags() hook
const {
  tagManager,
  searchService,
  hierarchyManager,
  categories,
  tags,
  roomAssociations,
  createCategory,
  createTag,
  applyTag,
  removeTag,
  getRoomTags,
  searchTags,
  searchByTag,
  filterRoomsByTags,
  getTagStatistics,
  exportTags,
  importTags,
  refreshTags
} = useRoomTags();
```

## Future Enhancements

### Phase 2 Features
- Tag templates for common room types
- Bulk operations (apply tags to multiple rooms)
- ML-based tag recommendations
- Tag sharing via URL
- Tag change history
- Role-based tag management
- Tag analytics and insights
- Tag synonyms
- Tag descriptions
- Custom tag icons

### Potential Integrations
- Calendar integration for event scheduling
- Booking system for room reservations
- Navigation system for routing
- Notification system for room availability
- RESTful API for external integrations

## Troubleshooting

### Common Issues

**Tags not saving:**
- Check JavaScript is enabled
- Verify LocalStorage is not disabled
- Clear browser cache
- Check browser console for errors

**Search not working:**
- Ensure tags are applied to rooms
- Refresh the page
- Verify tag names match
- Check browser console

**Import failed:**
- Validate JSON format
- Check required fields
- Verify category IDs match
- Look for syntax errors

## Support

For technical issues:
1. Check browser console (F12) for errors
2. Verify LocalStorage is enabled
3. Try exporting and re-importing data
4. Clear browser cache and reload
5. Check the ROOM-TAGGING-GUIDE.md for user instructions

## License

This tag system is part of the Campus Navigation application.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Maintainer:** Campus Navigation Team
