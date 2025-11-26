# Implementation Plan: Room Tags System

- [x] 1. Create core type definitions and data models
  - Define TypeScript interfaces for Tag, TagCategory, RoomTagAssociation, and TagStorage
  - Create type definitions for search results, statistics, and error types
  - Add types for tag hierarchy and validation
  - _Requirements: 1.1, 2.1, 2.2, 2.3_

- [x] 2. Implement TagManager service class
  - Create TagManager class with storage initialization
  - Implement category management methods (create, get, delete)
  - Implement tag CRUD operations (create, read, update, delete)
  - Implement room-tag association methods (apply, remove, get)
  - Add default categories and tags initialization
  - Implement storage persistence (save/load from LocalStorage)
  - Add validation logic for tag names and categories
  - Implement color generation algorithm for categories
  - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5, 4.2, 4.4_

- [ ]* 2.1 Write property test for tag application persistence
  - **Property 1: Tag application persistence**
  - **Validates: Requirements 1.3**

- [ ]* 2.2 Write property test for tag application idempotence
  - **Property 2: Tag application idempotence**
  - **Validates: Requirements 1.4**

- [ ]* 2.3 Write property test for tag name validation
  - **Property 4: Tag name length validation**
  - **Validates: Requirements 2.1**

- [ ]* 2.4 Write property test for category requirement
  - **Property 5: Tag requires valid category**
  - **Validates: Requirements 2.2**

- [ ]* 2.5 Write property test for unique identifiers
  - **Property 6: Tag creation assigns unique identifiers**
  - **Validates: Requirements 2.3**

- [ ]* 2.6 Write property test for duplicate prevention
  - **Property 7: Duplicate tag names prevented within category**
  - **Validates: Requirements 2.4**

- [ ]* 2.7 Write property test for tag creation round-trip
  - **Property 8: Tag creation round-trip**
  - **Validates: Requirements 2.5**

- [ ]* 2.8 Write property test for color generation
  - **Property 15: Color generation always produces valid colors**
  - **Validates: Requirements 4.4**

- [x] 3. Implement TagHierarchyManager service class
  - Create TagHierarchyManager class
  - Implement parent-child relationship methods
  - Add circular reference detection
  - Implement maximum depth validation (3 levels)
  - Add tag path retrieval methods
  - Implement parent deletion cascade logic
  - _Requirements: 6.1, 6.4, 6.5_

- [ ]* 3.1 Write property test for parent tag category matching
  - **Property 20: Parent tag must be in same category**
  - **Validates: Requirements 6.1**

- [ ]* 3.2 Write property test for parent deletion
  - **Property 21: Parent deletion promotes children**
  - **Validates: Requirements 6.4**

- [ ]* 3.3 Write property test for hierarchy depth limit
  - **Property 22: Tag hierarchy depth limited**
  - **Validates: Requirements 6.5**

- [x] 4. Implement TagSearchService class
  - Create TagSearchService class
  - Implement single tag search functionality
  - Implement multi-tag filtering with AND logic
  - Add relevance scoring for search results
  - Implement substring matching for tag names
  - Add result sorting by relevance
  - _Requirements: 3.1, 3.3, 3.4, 5.1, 5.2, 5.3, 5.5_

- [ ]* 4.1 Write property test for multi-tag AND filtering
  - **Property 9: Multi-tag filter uses AND logic**
  - **Validates: Requirements 3.1**

- [ ]* 4.2 Write property test for filter removal consistency
  - **Property 10: Filter removal consistency**
  - **Validates: Requirements 3.3**

- [ ]* 4.3 Write property test for clear filter
  - **Property 11: Clear filter returns all rooms**
  - **Validates: Requirements 3.4**

- [ ]* 4.4 Write property test for search coverage
  - **Property 16: Search queries both tags and labels**
  - **Validates: Requirements 5.1**

- [ ]* 4.5 Write property test for search result structure
  - **Property 17: Search results contain complete information**
  - **Validates: Requirements 5.2**

- [ ]* 4.6 Write property test for substring matching
  - **Property 18: Substring search matches tags**
  - **Validates: Requirements 5.3**

- [ ]* 4.7 Write property test for search result sorting
  - **Property 19: Search results sorted by relevance**
  - **Validates: Requirements 5.5**

- [x] 5. Implement tag statistics functionality
  - Add getTagStatistics method to TagManager
  - Implement usage count calculation
  - Add sorting by usage frequency
  - Include category metadata in statistics
  - Handle zero-usage tags
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 5.1 Write property test for statistics count accuracy
  - **Property 23: Tag statistics count accuracy**
  - **Validates: Requirements 7.1**

- [ ]* 5.2 Write property test for statistics sorting
  - **Property 24: Statistics sorted by usage**
  - **Validates: Requirements 7.2**

- [ ]* 5.3 Write property test for statistics metadata
  - **Property 25: Statistics include category metadata**
  - **Validates: Requirements 7.4**

- [ ]* 5.4 Write property test for statistics state reflection
  - **Property 26: Statistics reflect current state**
  - **Validates: Requirements 7.5**

- [x] 6. Implement import/export functionality
  - Add exportTags method to TagManager
  - Implement JSON serialization for all tag data
  - Add importTags method with validation
  - Implement schema validation for imports
  - Add merge logic to prevent duplicates
  - Implement error handling for invalid imports
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ]* 6.1 Write property test for export JSON validity
  - **Property 27: Export produces valid JSON**
  - **Validates: Requirements 8.1**

- [ ]* 6.2 Write property test for invalid import rejection
  - **Property 28: Invalid import rejected**
  - **Validates: Requirements 8.2, 8.3**

- [ ]* 6.3 Write property test for import merge
  - **Property 29: Import merge preserves existing data**
  - **Validates: Requirements 8.4**

- [x] 7. Implement tag removal and deletion operations
  - Add removeTagFromRoom method to TagManager
  - Implement tag deletion with cascade to all rooms
  - Add system tag deletion prevention
  - Implement storage persistence for removals
  - Handle edge case of removing last tag from room
  - _Requirements: 9.1, 9.3, 9.5, 10.1, 10.2, 10.3, 10.5_

- [ ]* 7.1 Write property test for tag removal from room
  - **Property 30: Tag removal from room**
  - **Validates: Requirements 9.1**

- [ ]* 7.2 Write property test for tag removal persistence
  - **Property 31: Tag removal round-trip**
  - **Validates: Requirements 9.5**

- [ ]* 7.3 Write property test for tag deletion cascade
  - **Property 32: Tag deletion cascades to rooms**
  - **Validates: Requirements 10.1**

- [ ]* 7.4 Write property test for tag deletion removes definition
  - **Property 33: Tag deletion removes definition**
  - **Validates: Requirements 10.2**

- [ ]* 7.5 Write property test for system tag protection
  - **Property 34: System tags cannot be deleted**
  - **Validates: Requirements 10.3**

- [ ]* 7.6 Write property test for tag deletion persistence
  - **Property 35: Tag deletion round-trip**
  - **Validates: Requirements 10.5**

- [x] 8. Implement color inheritance and display properties
  - Add getTagWithColor method to TagManager
  - Implement category color inheritance for tags
  - Add methods to retrieve tags with display properties
  - Ensure color consistency across operations
  - _Requirements: 1.5, 4.1, 4.3_

- [ ]* 8.1 Write property test for multiple tags color preservation
  - **Property 3: Multiple tags preserve category colors**
  - **Validates: Requirements 1.5**

- [ ]* 8.2 Write property test for tag color inheritance
  - **Property 12: Tag inherits category color**
  - **Validates: Requirements 4.1**

- [ ]* 8.3 Write property test for category color assignment
  - **Property 13: Category creation assigns color**
  - **Validates: Requirements 4.2**

- [ ]* 8.4 Write property test for multiple category colors
  - **Property 14: Multiple category tags maintain colors**
  - **Validates: Requirements 4.3**

- [x] 9. Create RoomTagContext for state management
  - Create RoomTagContext with React Context API
  - Implement RoomTagProvider component
  - Add useRoomTags hook
  - Expose all TagManager operations through context
  - Add state refresh mechanism
  - Integrate with existing RoomLabelContext
  - _Requirements: All requirements (context layer)_

- [x] 10. Create RoomTagEditor UI component
  - Create RoomTagEditor component with modal interface
  - Implement tabbed interface for labels and tags
  - Add category-based tag selection UI
  - Implement tag application and removal UI
  - Add visual hierarchy display for nested tags
  - Include tag search within editor
  - Add color-coded tag display
  - Implement keyboard navigation and accessibility
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 6.3, 9.1_

- [x] 11. Create TagFilterPanel UI component
  - Create TagFilterPanel component
  - Implement category-grouped tag checkboxes
  - Add "Match All" vs "Match Any" toggle
  - Display active filter count badge
  - Add clear all filters button
  - Implement filter state management
  - Add accessibility features (ARIA labels, keyboard nav)
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 12. Create TagStatisticsPanel UI component
  - Create TagStatisticsPanel component
  - Display sortable table of tags with usage counts
  - Add category filtering for statistics
  - Implement visual bar chart representation
  - Add export statistics button
  - Include tag click handlers for navigation
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 13. Integrate tag system with EnhancedSearchService
  - Extend EnhancedSearchService to include TagSearchService
  - Implement unified search across buildings, labels, and tags
  - Add result merging and deduplication logic
  - Update search result types to include tags
  - Ensure tag matches show category colors
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 14. Update existing UI components for tag integration
  - Update EnhancedSearchBar to display tag results
  - Modify BuildingDetails to show room tags
  - Update RoomSelector to include tag information
  - Add tag highlighting to HoodmapsStyleMap
  - Ensure visual distinction between labels and tags
  - _Requirements: 1.2, 1.5, 3.5, 4.5_

- [x] 15. Implement error handling and user feedback
  - Add error boundary components for tag operations
  - Implement user-friendly error messages
  - Add loading states for async operations
  - Implement success notifications for tag operations
  - Add confirmation dialogs for destructive actions
  - _Requirements: 2.4, 8.3, 9.4, 10.3, 10.4_

- [x] 16. Add accessibility features
  - Implement ARIA labels for all interactive elements
  - Add keyboard navigation support
  - Ensure color contrast meets WCAG AA standards
  - Add screen reader announcements
  - Implement focus management in modals
  - Add alternative text indicators for color-blind users
  - _Requirements: All requirements (accessibility layer)_

- [x] 17. Implement input sanitization and security
  - Add input sanitization for tag names
  - Implement XSS prevention measures
  - Add validation for all user inputs
  - Ensure safe JSON parsing for imports
  - _Requirements: 2.1, 8.2, 8.3_

- [x] 18. Create sample tag data and migration utilities
  - Create sample tag data file (similar to sample-room-labels.json)
  - Implement optional label-to-tag migration utility
  - Add bulk tag application utilities
  - Create documentation for tag system usage
  - _Requirements: 1.1, 8.4_

- [x] 19. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 20. Final integration and polish
  - Test complete user workflows end-to-end
  - Verify backward compatibility with existing labels
  - Ensure all components are properly integrated
  - Verify LocalStorage persistence across sessions
  - Test performance with large datasets
  - Final accessibility audit
  - _Requirements: All requirements_
