# Room-to-Room Navigation Guide

## Overview

The campus navigation app now supports detailed room-to-room navigation with step-by-step directions that consider:
- Floor changes (stairs/elevators)
- Building changes (campus paths)
- Actual room locations within buildings

## Features

### 1. Navigation Types

**Building to Building**
- Navigate between campus buildings
- Shows campus path with intermediate locations
- Displays on campus map

**Room to Room**
- Navigate from any room to any other room
- Detailed step-by-step directions
- Considers floors, stairs, elevators, and campus paths
- Estimated walking time

### 2. How It Works

#### Same Floor Navigation
```
Room 101 → Corridor → Room 105
```
Simple corridor walk within the same floor.

#### Different Floor (Same Building)
```
Room 101 → Corridor → Stairs/Elevator → Corridor (Floor 2) → Room 205
```
Uses stairs for 1-2 floor differences, elevator for 3+ floors.

#### Different Building Navigation
```
Room 101 (Block A) → Corridor → Stairs to Ground → Exit Block A → 
Walk past JSK Greens → Enter Block E → Elevator to Floor 4 → 
Corridor → Room 405
```
Complete path including:
- Exiting source building
- Campus path between buildings
- Entering destination building
- Finding room on destination floor

## Using Room Navigation

### Step 1: Select Navigation Type
In the "Get Directions" panel, choose "Room to Room"

### Step 2: Select Rooms
- **From Room**: Choose starting room number
- **To Room**: Choose destination room number

### Step 3: Get Directions
Click "Get Directions" to see:
- Estimated walking time
- Total number of steps
- Detailed step-by-step directions

### Step 4: Follow Directions
Each step shows:
- 📍 Room locations
- 🚶 Corridor navigation
- 🪜 Stairs
- 🛗 Elevators
- 🏢 Building entry/exit
- 🗺️ Campus paths

## Navigation Logic

### Floor Change Decision
- **1-2 floors**: Use stairs
- **3+ floors**: Use elevator
- Always goes to ground floor when changing buildings

### Time Estimation
- Base: 0.5 minutes per step
- Floor change: +1 minute per floor
- Building change: +2 minutes per building hop

### Example Routes

#### Example 1: Same Floor
**From:** Room 101 (Block E, Floor 1)
**To:** Room 110 (Block E, Floor 1)

```
1. 📍 Start at Room 101
2. 🚶 Walk through corridor to Room 110
3. 📍 Arrive at Room 110
```
**Time:** ~1 minute

#### Example 2: Different Floor
**From:** Room 001 (Block E, Ground Floor)
**To:** Room 405 (Block E, Floor 4)

```
1. 📍 Start at Room 001
2. 🚶 Exit to corridor on Ground Floor
3. 🛗 Take elevator from Ground Floor to Floor 4
4. 🚶 Enter corridor on Floor 4
5. 📍 Arrive at Room 405
```
**Time:** ~5 minutes

#### Example 3: Different Building
**From:** Room 104 (Block A, Floor 1)
**To:** Room 305 (Block E, Floor 3)

```
1. 📍 Start at Room 104
2. 🚶 Exit to corridor on Floor 1
3. 🪜 Take stairs down to Ground Floor
4. 🏢 Exit Block A
5. 🗺️ Walk past JSK Greens
6. 🏢 Enter Block E
7. 🛗 Take elevator to Floor 3
8. 🚶 Enter corridor on Floor 3
9. 📍 Arrive at Room 305
```
**Time:** ~8 minutes

## Tips

1. **Check floor plans**: View floor plans to see exact room locations
2. **Note landmarks**: Pay attention to stairs and elevator locations
3. **Ground floor**: All building changes go through ground floor
4. **Time estimates**: Add extra time during peak hours

## Integration with Floor Plans

When floor plans are available:
- Click on rooms in floor plan view to see their location
- Use floor plan to understand room layout before navigating
- Visualize where stairs and elevators are located

## Future Enhancements

Potential additions (not yet implemented):
- Real-time GPS tracking
- Accessibility routes (wheelchair-friendly)
- Avoid stairs option
- Shortest vs fastest route options
- Indoor turn-by-turn navigation
