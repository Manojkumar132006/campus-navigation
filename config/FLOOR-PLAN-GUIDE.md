# Floor Plan Configuration Guide

## Overview

You can now create detailed floor plans for each floor of every building, showing the actual physical layout of rooms, corridors, stairs, and elevators.

## Configuration File

Edit `config/floor-plans.json` to add floor plans for your buildings.

## Structure

```json
{
  "Block Name": {
    "floor_number": {
      "floor": 0,
      "block": "E",
      "width": 800,
      "height": 400,
      "rooms": [...],
      "stairs": [...],
      "elevators": [...]
    }
  }
}
```

## Floor Plan Properties

### Basic Properties
- `floor`: Floor number (0 for ground floor, 1 for first floor, etc.)
- `block`: Block letter (A, B, C, D, E, P, or PEB)
- `width`: Canvas width in pixels (recommended: 800-1200)
- `height`: Canvas height in pixels (recommended: 400-600)

### Rooms Array
Each room has:
```json
{
  "roomNumber": "101",
  "x": 50,
  "y": 50,
  "width": 80,
  "height": 60,
  "label": "Room 101"
}
```

- `roomNumber`: Must match the room number from your room data
- `x`, `y`: Top-left corner position
- `width`, `height`: Room dimensions (optional, defaults to 80x60)
- `label`: Display label (optional)

### Stairs Array (Optional)
```json
{
  "x": 400,
  "y": 200,
  "label": "Stairs"
}
```

### Elevators Array (Optional)
```json
{
  "x": 500,
  "y": 200
}
```

### Corridors Array (Optional)
```json
{
  "x1": 100,
  "y1": 200,
  "x2": 700,
  "y2": 200
}
```

## Step-by-Step: Creating a Floor Plan

### Step 1: Determine Canvas Size
Measure your floor's dimensions and choose appropriate width/height:
- Small floor (10-20 rooms): 800x400
- Medium floor (20-40 rooms): 1000x500
- Large floor (40+ rooms): 1200x600

### Step 2: Plan Room Layout
Sketch your floor on paper or use a simple drawing tool to determine approximate positions.

### Step 3: Add Rooms
Start with rooms in order, placing them according to your sketch:

```json
"rooms": [
  { "roomNumber": "101", "x": 50, "y": 50, "width": 80, "height": 60 },
  { "roomNumber": "102", "x": 150, "y": 50, "width": 80, "height": 60 },
  { "roomNumber": "103", "x": 250, "y": 50, "width": 80, "height": 60 }
]
```

**Tips:**
- Leave space between rooms for visual clarity (20-30px)
- Group rooms that are physically close together
- Use consistent room sizes for similar room types

### Step 4: Add Corridors (Optional)
Draw lines to represent hallways:

```json
"corridors": [
  { "x1": 40, "y1": 120, "x2": 760, "y2": 120 }
]
```

### Step 5: Add Stairs and Elevators
Place stairs and elevators at their actual locations:

```json
"stairs": [
  { "x": 400, "y": 200, "label": "Main Stairs" }
],
"elevators": [
  { "x": 500, "y": 200 }
]
```

## Example: Complete Floor Plan

```json
{
  "Block A": {
    "0": {
      "floor": 0,
      "block": "A",
      "width": 600,
      "height": 300,
      "rooms": [
        { "roomNumber": "001", "x": 50, "y": 50, "width": 80, "height": 60 },
        { "roomNumber": "002", "x": 150, "y": 50, "width": 80, "height": 60 },
        { "roomNumber": "003", "x": 250, "y": 50, "width": 80, "height": 60 },
        { "roomNumber": "004", "x": 350, "y": 50, "width": 80, "height": 60 },
        { "roomNumber": "005", "x": 450, "y": 50, "width": 80, "height": 60 },
        { "roomNumber": "006", "x": 50, "y": 150, "width": 80, "height": 60 },
        { "roomNumber": "007", "x": 150, "y": 150, "width": 80, "height": 60 },
        { "roomNumber": "008", "x": 250, "y": 150, "width": 80, "height": 60 },
        { "roomNumber": "009", "x": 350, "y": 150, "width": 80, "height": 60 },
        { "roomNumber": "010", "x": 450, "y": 150, "width": 80, "height": 60 }
      ],
      "corridors": [
        { "x1": 40, "y1": 120, "x2": 540, "y2": 120 }
      ],
      "stairs": [
        { "x": 300, "y": 230, "label": "Stairs" }
      ]
    }
  }
}
```

## Common Layouts

### Linear Layout (Rooms in a Row)
```
[Room 001] [Room 002] [Room 003] [Room 004]
```
Increment x by (width + spacing), keep y constant.

### Grid Layout (Rooms in Rows and Columns)
```
[Room 001] [Room 002] [Room 003]
[Room 004] [Room 005] [Room 006]
```
Increment x for columns, increment y for rows.

### L-Shaped Layout
```
[Room 001] [Room 002]
[Room 003] [Room 004]
[Room 005]
[Room 006]
```
Combine linear sections at different y positions.

## Testing Your Floor Plan

1. Edit `config/floor-plans.json`
2. Rebuild: `npm run build`
3. Test: `npx serve out`
4. Click on a building with floor plans
5. Select a floor
6. Click "Floor Plan" view mode

## Troubleshooting

**Rooms overlap**: Increase spacing between x/y coordinates
**Floor plan cut off**: Increase width/height values
**Rooms not showing**: Verify roomNumber matches your room data
**Floor plan not available**: Check block name and floor number match exactly

## Quick Reference: Coordinate System

```
(0,0) ──────────────────► X (right)
  │
  │  Your rooms go here
  │  
  │  Example:
  │  Room at x=100, y=50
  │  Size: 80x60
  │  
  ▼
  Y (down)
```

## Tips for Accurate Floor Plans

1. **Measure proportionally**: If Room A is twice as wide as Room B in reality, make it twice as wide in the config
2. **Use consistent spacing**: Keep similar gaps between all rooms
3. **Start simple**: Begin with just rooms, add corridors/stairs later
4. **Test frequently**: Rebuild and check after adding each floor
5. **Copy and modify**: Duplicate similar floors and adjust room numbers
