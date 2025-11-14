# Room Labeling Guide

## What is Room Labeling?

Room labeling allows you to associate clubs, activities, or any custom names with specific rooms in campus buildings. For example:
- "Dance Club" → Block A, Floor 2, Room 201
- "Art Club" → Block B, Floor 3, Room 305
- "Robotics Lab" → Block E, Floor 1, Room 120

## How to Label Rooms

### Step 1: Switch to Hoodmaps View
Click the **"🎨 Hoodmaps View"** button in the header (top right).

### Step 2: Click on a Building
Click on any colored building zone on the map (e.g., Block A, Block B).

### Step 3: Open Room Details
When the building details appear, you'll see a list of floors and rooms.

### Step 4: Click on a Specific Room
Click on a room number (e.g., "Room 201 - Floor 2").

### Step 5: Add Labels
A modal will open where you can:
- Type a custom label (e.g., "Dance Club")
- Click "Add" to save
- Add multiple labels to the same room
- Use suggested labels for quick selection

### Step 6: Search for Your Labeled Rooms
Use the search bar at the top to find rooms by their labels:
- Type "Dance" → Finds all rooms labeled with "Dance Club"
- Type "Art" → Finds all rooms labeled with "Art Club"

## Example Workflow

Let's say you want to label the Dance Club room:

1. **Switch to Hoodmaps View** (button in header)
2. **Click on "Block A"** (yellow zone on the map)
3. **Find Floor 2, Room 201** in the building details
4. **Click on "Room 201"**
5. **Type "Dance Club"** in the label input
6. **Click "Add"**
7. **Done!** Now you can search for "Dance" to find this room

## Tips

### Multiple Labels
You can add multiple labels to the same room:
- "Dance Club"
- "Performance Space"
- "Studio A"

### Suggested Labels
Click on suggested labels for quick selection:
- Club Office
- Study Room
- Hangout
- Meeting Room
- Lab
- Workshop
- Lounge
- Common Room

### Searching
The search is smart:
- Case-insensitive: "dance" finds "Dance Club"
- Partial matching: "rob" finds "Robotics Lab"
- Shows building, floor, and room number in results

### Deleting Labels
To remove a label:
1. Click on the room again
2. Click the "×" button next to the label you want to remove

## Sample Data

Want to try it out quickly? We've included sample labels in `sample-room-labels.json`:
- Robotics Club (Block A, Floor 2, Room 201)
- Drama Club (Block B, Floor 1, Room 101)
- Music Room (Block B, Floor 2, Room 210)
- Art Studio (Block C, Floor 1, Room 105)
- And more!

To load sample data:
1. Open browser console (F12)
2. Run this code:
```javascript
fetch('/sample-room-labels.json')
  .then(r => r.json())
  .then(data => {
    localStorage.setItem('campus-room-labels', JSON.stringify(data));
    location.reload();
  });
```

## Hoodmaps Visual Style

The Hoodmaps view provides:
- **Bold Colors**: Each building type has a distinct color
  - 🟡 Academic buildings (yellow)
  - 🔴 Canteens (red)
  - 🟢 Recreational areas (green)
  - 🔵 Hostels (blue)
  - 🟣 Administrative (purple)
  - ⚪ Facilities (gray)

- **Rounded Shapes**: Buildings are rounded rectangles, not circles
- **Thick Borders**: Clear zone boundaries
- **Emoji Icons**: Quick visual identification
- **Dashed Paths**: Subtle connections between buildings

## Category Filtering

Use the category filter pills to focus on specific building types:
- Click "📚 Academic" to highlight only academic buildings
- Click "🍽️ Canteens" to find food spots
- Click "🌳 Recreational" to see parks and stages
- Click multiple categories to show several types
- Click "Clear All" to reset

## Persistence

Your room labels are saved in your browser's LocalStorage:
- Labels persist across sessions
- No account needed
- Works offline
- Private to your browser

## Export/Import Labels

### Export (Backup)
Open browser console and run:
```javascript
console.log(localStorage.getItem('campus-room-labels'));
```
Copy the output and save it to a file.

### Import (Restore)
Open browser console and run:
```javascript
const labels = { /* paste your saved labels here */ };
localStorage.setItem('campus-room-labels', JSON.stringify(labels));
location.reload();
```

## Troubleshooting

### Labels Not Saving
- Check that JavaScript is enabled
- Ensure LocalStorage is not disabled
- Try clearing browser cache

### Can't Find Room Editor
- Make sure you're in Hoodmaps view (not classic view)
- Click on a building first
- Then click on a specific room number

### Search Not Working
- Ensure you've added labels to rooms first
- Try refreshing the page
- Check browser console for errors

## Need Help?

The room labeling feature is designed to be intuitive. If you're stuck:
1. Switch to Hoodmaps view
2. Click any building
3. Click any room
4. Start typing labels!

That's it! Enjoy labeling your campus rooms with club names and activities! 🎉
