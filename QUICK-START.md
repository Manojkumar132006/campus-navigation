# Quick Start Guide - Campus Navigation

## Updating the Campus Map

You can now easily update the campus map layout without touching any code!

### Step 1: Edit the Configuration
Open `config/campus-layout.json` and modify:
- **Building positions** (x, y coordinates)
- **Building properties** (floors, rooms, emoji, type)
- **Connections** between buildings
- **Map dimensions** (viewBox width/height)

### Step 2: Generate Updated Files
```bash
npm run generate
```
This will automatically update `lib/campusData.ts` and `lib/roomData.ts`

### Step 3: Rebuild the Application
```bash
npm run build
```

### Step 4: Test Locally (Optional)
```bash
npx serve out
```

## Example: Adjusting Building Positions

If buildings are overlapping or the layout doesn't match your campus:

1. Open `config/campus-layout.json`
2. Find the building you want to move (e.g., "Block E")
3. Change the `x` and `y` values:
   ```json
   "Block E": {
     "x": 500,  // Move right (increase) or left (decrease)
     "y": 250,  // Move down (increase) or up (decrease)
     ...
   }
   ```
4. Run `npm run generate && npm run build`

## Coordinate System Guide

```
(0,0) ─────────────────────► X (right)
  │
  │    Your campus buildings go here
  │    
  │    Example positions:
  │    - Top-left: x=100, y=100
  │    - Center: x=300, y=500
  │    - Bottom-right: x=500, y=900
  │
  ▼
  Y (down)
```

## Common Adjustments

### Buildings Too Close Together
Increase the spacing between x/y coordinates:
```json
"Block A": { "x": 200, "y": 300 },
"Block B": { "x": 200, "y": 450 }  // Increased from 400 to 450
```

### Map Cut Off
Increase the viewBox dimensions:
```json
"mapSettings": {
  "viewBoxWidth": 800,   // Increased from 600
  "viewBoxHeight": 1200  // Increased from 1100
}
```

### Change Room Count
Modify `roomsPerFloor` for any building:
```json
"Block E": {
  ...
  "roomsPerFloor": 40  // Block E has 40 rooms per floor
}
```

## Need Help?

See `config/README.md` for detailed documentation on all configuration options.
