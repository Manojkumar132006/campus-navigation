# Campus Layout Configuration

This file allows you to easily update the campus map without touching the code.

## How to Update the Map

1. **Edit `campus-layout.json`** - Update building positions, add/remove buildings, or change connections
2. **Run the generator** - Execute `npm run generate` to regenerate the TypeScript files
3. **Rebuild the app** - Run `npm run build` to create the updated static site

## Configuration Structure

### Map Settings
```json
"mapSettings": {
  "viewBoxWidth": 600,
  "viewBoxHeight": 1100,
  "description": "Adjust viewBox dimensions to fit your campus layout"
}
```
- `viewBoxWidth`: Width of the SVG canvas (increase if buildings are too cramped horizontally)
- `viewBoxHeight`: Height of the SVG canvas (increase if buildings are too cramped vertically)

### Buildings
Each building has the following properties:

```json
"Block A": {
  "x": 200,              // X coordinate (0 = left, higher = right)
  "y": 320,              // Y coordinate (0 = top, higher = bottom)
  "description": "Block A - Left Building",
  "type": "academic",    // Options: academic, canteen, recreational, facility
  "emoji": "🏢",         // Icon to display on the map
  "floors": 4,           // Number of floors (excluding ground floor)
  "roomsPerFloor": 10    // Number of rooms per floor
}
```

### Connections
Define which buildings are connected by pathways:
```json
"connections": [
  ["Block A", "Block B"],  // Creates a path between Block A and Block B
  ["Block B", "Block C"]
]
```

## Tips for Positioning Buildings

1. **Start with a rough layout**: Place buildings approximately where they should be
2. **Use consistent spacing**: Keep similar distances between connected buildings
3. **Test and adjust**: Run `npm run generate && npm run build` and view the result
4. **Coordinate system**:
   - X: 0 (left) to viewBoxWidth (right)
   - Y: 0 (top) to viewBoxHeight (bottom)
   - Buildings are drawn as circles with 24px radius

## Example: Moving a Building

To move "Block E" to the right:
```json
"Block E": {
  "x": 500,  // Changed from 450 to 500
  "y": 200,
  ...
}
```

Then run:
```bash
npm run generate
npm run build
```

## Example: Adding a New Building

1. Add the building to the `buildings` section:
```json
"Library": {
  "x": 300,
  "y": 400,
  "description": "Main Library",
  "type": "facility",
  "emoji": "📚",
  "floors": 3,
  "roomsPerFloor": 20
}
```

2. Add connections to other buildings:
```json
"connections": [
  ...existing connections...,
  ["Block A", "Library"],
  ["Library", "Block B"]
]
```

3. Regenerate:
```bash
npm run generate
npm run build
```

## Troubleshooting

**Buildings overlap**: Increase the distance between x/y coordinates
**Map is cut off**: Increase `viewBoxWidth` or `viewBoxHeight` in mapSettings
**Changes not showing**: Make sure to run `npm run generate` before `npm run build`
