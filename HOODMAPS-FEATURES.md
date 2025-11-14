# Hoodmaps-Style Campus Map Features

## Overview

The campus navigation application now includes a Hoodmaps-style visual design that transforms the technical campus map into a fun, social, and engaging experience. Users can label rooms with custom names, search for labeled locations, and enjoy a bold, colorful map aesthetic.

## Key Features

### 1. Hoodmaps Visual Style

- **Bold Flat Colors**: Each zone is color-coded by category
  - 🟡 Academic: Yellow (#FCD34D)
  - 🔵 Hostels: Blue (#60A5FA)
  - 🔴 Canteens: Red (#F87171)
  - 🟢 Recreational: Green (#4ADE80)
  - 🟣 Administrative: Purple (#A78BFA)
  - ⚪ Facilities: Gray (#9CA3AF)

- **Geometric Shapes**: Buildings rendered as rounded rectangles instead of circles
- **Thick Borders**: 3-4px stroke width for visual clarity
- **Original Building Names**: Buildings display their actual names (Block A, JSK Greens, etc.)
- **Micro-Icons**: Emoji symbols inside each zone for quick identification
- **Dashed Pathways**: Subtle connections between zones

### 2. Room Labeling System

This is the core feature - associate clubs and activities with specific rooms:

- **Custom Room Labels**: Label any room with names like "Dance Club", "Art Club", "Robotics Lab"
- **Multiple Labels**: Each room can have multiple labels (e.g., "Robotics Club", "Tech Hub")
- **Persistent Storage**: Labels saved in browser LocalStorage
- **Easy Management**: Add, remove, and edit labels through a modal interface
- **Suggested Labels**: Quick-add common labels like "Club Office", "Study Room", "Hangout"

**How to Label a Room:**
1. Click on a building zone in Hoodmaps view
2. Click on the building to open room details
3. Select a specific room (e.g., "Block A - Floor 2 - Room 201")
4. Add custom labels like "Dance Club" or "Art Studio"
5. Labels are immediately searchable

**Example Use Cases:**
- Label "Block A - Floor 2 - Room 201" as "Dance Club"
- Label "Block B - Floor 3 - Room 305" as "Art Club"
- Label "Block E - Floor 1 - Room 120" as "Photography Club"

### 3. Enhanced Search

Search across both buildings and room labels:

- **Unified Search**: Find buildings or rooms by name or label
- **Real-time Results**: Debounced search with 300ms delay
- **Type Indicators**: Separate sections for buildings and rooms
- **Highlighted Matches**: Search terms highlighted in results
- **Quick Navigation**: Click any result to jump to that location

**Search Examples:**
- "Block A" → Finds the building
- "Robotics" → Finds all rooms labeled with "Robotics"
- "Club" → Finds all club offices

### 4. Category Filtering

Focus on specific types of locations:

- **Filter by Category**: Select one or more categories to highlight
- **Visual Feedback**: Non-selected zones are dimmed (30% opacity)
- **Color-Coded Buttons**: Filter buttons match zone colors
- **Clear All**: Reset filters with one click

**Use Cases:**
- Find all canteens on campus
- Locate recreational areas
- View only academic buildings

### 5. View Toggle

Switch between classic and Hoodmaps styles:

- **Toggle Button**: Located in the header
- **Preserved State**: Selected building and routes maintained when switching
- **Saved Preference**: Your choice is remembered in LocalStorage
- **Default**: Hoodmaps style is the default for new users

## Technical Implementation

### New Components

1. **HoodmapsStyleMap**: Main map component with Hoodmaps styling
2. **RoomLabelEditor**: Modal for adding/editing room labels
3. **EnhancedSearchBar**: Search component with building + room search
4. **CategoryFilter**: Filter controls for zone categories

### New Libraries

1. **RoomLabelManager**: Manages room labels with LocalStorage persistence
2. **HoodmapsStyleEngine**: Applies color schemes and generates playful labels
3. **EnhancedSearchService**: Unified search across buildings and rooms

### Data Storage

- **LocalStorage Key**: `campus-room-labels`
- **Format**: JSON object with room labels
- **Capacity**: ~5MB (sufficient for thousands of labels)
- **Export/Import**: Labels can be exported and imported as JSON

## Usage Guide

### For Students

1. **Explore the Map**: Use the Hoodmaps view to see a colorful, fun campus map
2. **Label Your Spots**: Add labels to rooms where your clubs meet or where you hang out
3. **Search Easily**: Find any labeled room by searching for its label
4. **Filter by Type**: Use category filters to find specific types of locations

### For Administrators

1. **Customize Zone Labels**: Edit playful labels in `lib/hoodmapsStyleEngine.ts`
2. **Adjust Colors**: Modify `HOODMAPS_COLORS` constant for different color schemes
3. **Export Labels**: Use RoomLabelManager's `exportLabels()` method to backup labels
4. **Import Labels**: Use `importLabels()` to restore or share label sets

## Mobile Support

- **Responsive Design**: Works on screens as small as 375px
- **Touch-Friendly**: All controls meet 44px minimum tap target size
- **Touch Gestures**: Zoom and pan with touch on mobile devices
- **Optimized Layout**: Components stack vertically on mobile

## Browser Compatibility

- Chrome, Firefox, Safari, Edge (modern versions)
- Requires JavaScript enabled
- LocalStorage support required for room labels

## Future Enhancements

Potential features for future development:

- User authentication for shared labels
- Voting/rating system for room labels
- Photo uploads for rooms
- Social features (comments, check-ins)
- Admin moderation for labels
- Analytics on popular rooms

## Troubleshooting

### Labels Not Saving

- Check browser LocalStorage is enabled
- Clear browser cache and try again
- Export labels before clearing cache

### Search Not Working

- Ensure you're in Hoodmaps view
- Check that labels have been added to rooms
- Try refreshing the page

### Map Not Displaying

- Check browser console for errors
- Ensure JavaScript is enabled
- Try switching between classic and Hoodmaps views

## Credits

Inspired by [Hoodmaps](https://hoodmaps.com/) - a social map platform with playful, neighborhood-style visualizations.
