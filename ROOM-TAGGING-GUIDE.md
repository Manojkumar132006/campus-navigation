# Room Tagging System Guide

## What is the Room Tagging System?

The Room Tagging System is an enhanced version of room labeling that provides structured, categorized tags for campus rooms. Unlike free-form labels, tags are organized into categories with color-coding, making it easier to find and filter rooms by specific characteristics.

## Key Features

### Structured Categories
Tags are organized into four main categories:
- **🎯 Activities**: Club rooms, activity spaces (Dance Club, Music Club, Art Club, etc.)
- **🏢 Facilities**: Room types and purposes (Laboratory, Study Room, Meeting Room, etc.)
- **♿ Accessibility**: Accessibility features (Wheelchair Accessible, Elevator Access, etc.)
- **⭐ Amenities**: Available equipment and features (WiFi, Projector, Whiteboard, etc.)

### Color-Coded Tags
Each category has a distinct color:
- Activities: Blue (#3B82F6)
- Facilities: Green (#10B981)
- Accessibility: Purple (#8B5CF6)
- Amenities: Amber (#F59E0B)

### Tag Hierarchies
Tags can have parent-child relationships (up to 3 levels deep) for better organization.

## How to Use the Tagging System

### Step 1: Open the Room Tag Editor
1. Switch to **Hoodmaps View** (button in header)
2. Click on any building on the map
3. Click on a specific room number
4. The Room Tag Editor will open

### Step 2: Choose Between Labels and Tags
The editor has two tabs:
- **Structured Tags**: Use predefined, categorized tags
- **Quick Labels**: Use free-form text labels (legacy system)

### Step 3: Apply Tags to a Room

#### Using Predefined Tags:
1. Browse tags by category
2. Click on any tag to apply it to the room
3. Applied tags show a checkmark and are highlighted
4. Click again to remove a tag

#### Creating Custom Tags:
1. Select a category from the dropdown
2. Enter your custom tag name
3. Click "Create & Apply"
4. Your custom tag will be created and immediately applied

### Step 4: Search by Tags
Use the enhanced search bar to find rooms:
- Type any tag name (e.g., "Robotics", "WiFi", "Wheelchair")
- Results show all rooms with matching tags
- Tags are displayed with their category colors

## Advanced Features

### Tag Filtering
Use the Tag Filter Panel to filter rooms by multiple tags:
1. Select multiple tags from different categories
2. Choose "Match All (AND)" to find rooms with ALL selected tags
3. Choose "Match Any (OR)" to find rooms with ANY selected tag
4. Clear filters to reset

### Tag Statistics
View tag usage statistics:
- See which tags are most commonly used
- Sort by tag name, category, or usage count
- Filter statistics by category
- Export statistics for analysis

### Import/Export Tags
Backup or share your tag configuration:

**Export:**
```javascript
// Open browser console (F12)
const tagManager = new TagManager();
console.log(tagManager.exportTags());
// Copy the output and save to a file
```

**Import:**
```javascript
// Open browser console (F12)
fetch('/sample-room-tags.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('campus-tag-storage', JSON.stringify(data));
    location.reload();
  });
```

## Sample Data

We've included sample tags in `sample-room-tags.json`:
- Robotics Club (Block A, Floor 2, Room 201) - Lab, WiFi, Projector
- Drama Club (Block B, Floor 1, Room 101) - Meeting Room, Projector, AC
- Music Room (Block B, Floor 2, Room 210) - Lounge, AC
- Art Studio (Block C, Floor 1, Room 105) - Workshop, Wheelchair Accessible
- Study Room (Block A, Floor 1, Room 110) - WiFi, Whiteboard, Wheelchair, Elevator
- Dance Studio (Block D, Floor 3, Room 305) - Lounge, AC
- Computer Lab (Block E, Floor 2, Room 220) - Lab, WiFi, Projector, Whiteboard

## Tag Management

### Deleting Tags
- System tags (predefined) cannot be deleted
- Custom tags can be deleted from the tag management interface
- Deleting a tag removes it from all rooms

### Tag Hierarchies
- Create parent-child relationships for better organization
- Maximum depth: 3 levels
- Parent and child must be in the same category
- Example: "Lab" → "Computer Lab" → "Advanced Computer Lab"

## Differences Between Labels and Tags

| Feature | Labels | Tags |
|---------|--------|------|
| Structure | Free-form text | Categorized |
| Colors | Single color | Category-based colors |
| Filtering | Search only | Advanced filtering |
| Hierarchy | None | Up to 3 levels |
| Statistics | Basic | Detailed analytics |
| Reusability | Type each time | Select from list |

## Best Practices

### When to Use Tags
- Categorizing rooms by type or purpose
- Marking accessibility features
- Listing available amenities
- Organizing club spaces

### When to Use Labels
- Quick, one-off descriptions
- Temporary notes
- Informal room names
- Personal reminders

### Tag Naming Conventions
- Keep tag names concise (1-50 characters)
- Use descriptive names (e.g., "Wheelchair Accessible" not "WC")
- Be consistent with naming patterns
- Avoid abbreviations unless widely understood

## Troubleshooting

### Tags Not Saving
- Check that JavaScript is enabled
- Ensure LocalStorage is not disabled
- Try clearing browser cache
- Check browser console for errors

### Can't Find Tag Editor
- Make sure you're in Hoodmaps view
- Click on a building first
- Then click on a specific room number
- The editor should open automatically

### Search Not Finding Tagged Rooms
- Ensure tags are properly applied to rooms
- Try refreshing the page
- Check that the tag name matches exactly
- Verify the room has the tag in the editor

### Import Failed
- Verify JSON format is correct
- Check that all required fields are present
- Ensure category IDs match tag categoryIds
- Look for syntax errors in the JSON

## Storage and Performance

### LocalStorage Limits
- Typical limit: 5-10MB per domain
- Estimated capacity: ~25,000 tags or ~50,000 room associations
- Export data regularly as backup

### Performance Tips
- Use tag filtering instead of searching when possible
- Clear unused custom tags periodically
- Export and archive old tag configurations

## Privacy and Security

- All data stored locally in your browser
- No server-side storage or tracking
- Tags are private to your browser
- Export to share with others
- Clear browser data to remove all tags

## Keyboard Shortcuts

- **Enter**: Apply tag or create custom tag
- **Escape**: Close tag editor
- **Tab**: Navigate between elements
- **Space**: Toggle tag selection

## Accessibility Features

- Full keyboard navigation support
- Screen reader compatible
- ARIA labels on all interactive elements
- High contrast color schemes
- Focus indicators on all controls

## Need Help?

The room tagging system is designed to be intuitive and powerful. If you're stuck:
1. Switch to Hoodmaps view
2. Click any building
3. Click any room
4. Explore the Structured Tags tab
5. Start applying tags!

For technical issues, check the browser console (F12) for error messages.

## Migration from Labels to Tags

If you have existing room labels and want to convert them to tags:

1. Review your existing labels
2. Identify common patterns
3. Create custom tags for common labels
4. Apply tags to rooms
5. Optionally keep labels for unique descriptions

Both systems work together, so you don't need to choose one or the other!

---

Enjoy organizing your campus with the powerful room tagging system! 🎉
