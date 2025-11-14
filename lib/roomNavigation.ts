import { CampusGraph } from './campusGraph';
import { RouteCalculator } from './routeCalculator';
import { getAllRooms } from './roomData';
import { RoomLocation, NavigationStep, RoomToRoomRoute } from '@/types/navigation';

export class RoomNavigator {
  private graph: CampusGraph;
  private routeCalculator: RouteCalculator;

  constructor(graph: CampusGraph) {
    this.graph = graph;
    this.routeCalculator = new RouteCalculator(graph);
  }

  // Find a room by room number across all buildings and special locations
  findRoom(roomNumber: string): RoomLocation | null {
    const allRooms = getAllRooms();
    // Handle multiple formats:
    // - Exact match: "E-203", "Annapurna Canteen"
    // - Partial match: "203" (will search for E-203)
    // - Case insensitive for special locations
    const room = allRooms.find(r => 
      r.roomNumber === roomNumber || 
      r.roomNumber.toLowerCase() === roomNumber.toLowerCase() ||
      r.roomNumber.endsWith(`-${roomNumber}`)
    );
    
    if (!room) return null;
    
    // For special locations (canteens, grounds, etc.), use the location name as building
    const isSpecialLocation = ['Canteen', 'Recreational'].includes(room.block);
    
    return {
      building: isSpecialLocation ? room.roomNumber : `Block ${room.block}`,
      floor: room.floor,
      roomNumber: room.roomNumber
    };
  }

  // Check if a location is a special outdoor location (no building structure)
  private isSpecialLocation(location: RoomLocation): boolean {
    const specialLocationNames = [
      'Annapurna Canteen',
      'Coca-Cola Canteen',
      'JSK Greens',
      'Ground',
      'SAC Stage',
      'Scinti Stage'
    ];
    return specialLocationNames.includes(location.building);
  }

  // Calculate route between two rooms
  calculateRoomRoute(startRoom: string, endRoom: string): RoomToRoomRoute | null {
    const start = this.findRoom(startRoom);
    const end = this.findRoom(endRoom);

    if (!start || !end) return null;

    const steps: NavigationStep[] = [];
    const startIsSpecial = this.isSpecialLocation(start);
    const endIsSpecial = this.isSpecialLocation(end);

    // Step 1: Start at the location
    const startDescription = startIsSpecial 
      ? `Start at ${start.roomNumber}` 
      : `Start at Room ${start.roomNumber}`;
    
    steps.push({
      type: startIsSpecial ? 'campus_path' : 'room',
      description: startDescription,
      location: start.building,
      floor: start.floor,
      building: start.building
    });

    // Same building/location navigation
    if (start.building === end.building) {
      // Same floor - direct navigation
      if (start.floor === end.floor) {
        steps.push({
          type: 'corridor',
          description: `Walk to ${end.roomNumber}`,
          floor: start.floor,
          building: start.building
        });
      } else {
        // Different floor - use stairs/elevator
        this.addFloorChangeSteps(steps, start, end);
      }
    } else {
      // Different building/location navigation
      this.addLocationChangeSteps(steps, start, end, startIsSpecial, endIsSpecial);
    }

    // Final step: Arrive at destination
    const endDescription = endIsSpecial 
      ? `Arrive at ${end.roomNumber}` 
      : `Arrive at Room ${end.roomNumber}`;
    
    steps.push({
      type: endIsSpecial ? 'campus_path' : 'room',
      description: endDescription,
      location: end.building,
      floor: end.floor,
      building: end.building
    });

    // Estimate time (rough calculation)
    const estimatedMinutes = this.estimateTime(start, end, steps.length);

    return {
      start,
      end,
      steps,
      totalSteps: steps.length,
      estimatedTime: `${estimatedMinutes} min`
    };
  }

  private addFloorChangeSteps(steps: NavigationStep[], start: RoomLocation, end: RoomLocation) {
    // Exit current room to corridor
    steps.push({
      type: 'corridor',
      description: `Exit to corridor on ${start.floor === 0 ? 'Ground Floor' : `Floor ${start.floor}`}`,
      floor: start.floor,
      building: start.building
    });

    // Go to stairs or elevator
    const floorDiff = Math.abs(end.floor - start.floor);
    if (floorDiff > 2) {
      steps.push({
        type: 'elevator',
        description: `Take elevator from ${start.floor === 0 ? 'Ground Floor' : `Floor ${start.floor}`} to ${end.floor === 0 ? 'Ground Floor' : `Floor ${end.floor}`}`,
        building: start.building
      });
    } else {
      const direction = end.floor > start.floor ? 'up' : 'down';
      steps.push({
        type: 'stairs',
        description: `Take stairs ${direction} from ${start.floor === 0 ? 'Ground Floor' : `Floor ${start.floor}`} to ${end.floor === 0 ? 'Ground Floor' : `Floor ${end.floor}`}`,
        building: start.building
      });
    }

    // Enter corridor on destination floor
    steps.push({
      type: 'corridor',
      description: `Enter corridor on ${end.floor === 0 ? 'Ground Floor' : `Floor ${end.floor}`}`,
      floor: end.floor,
      building: end.building
    });
  }

  private addLocationChangeSteps(
    steps: NavigationStep[], 
    start: RoomLocation, 
    end: RoomLocation,
    startIsSpecial: boolean,
    endIsSpecial: boolean
  ) {
    // Handle exit from start location
    if (!startIsSpecial) {
      // Starting from a building room - need to exit the building
      steps.push({
        type: 'corridor',
        description: `Exit to corridor on ${start.floor === 0 ? 'Ground Floor' : `Floor ${start.floor}`}`,
        floor: start.floor,
        building: start.building
      });

      // Go to ground floor if not already there
      if (start.floor !== 0) {
        steps.push({
          type: 'stairs',
          description: `Take stairs down to Ground Floor`,
          building: start.building
        });
      }

      // Exit building
      steps.push({
        type: 'building',
        description: `Exit ${start.building}`,
        building: start.building
      });
    }

    // Calculate campus path between locations
    const buildingRoute = this.routeCalculator.findRoute(start.building, end.building);
    if (buildingRoute && buildingRoute.success && buildingRoute.path.length > 2) {
      // Add intermediate buildings/locations
      for (let i = 1; i < buildingRoute.path.length - 1; i++) {
        steps.push({
          type: 'campus_path',
          description: `Walk past ${buildingRoute.path[i]}`,
          location: buildingRoute.path[i]
        });
      }
    } else {
      steps.push({
        type: 'campus_path',
        description: `Walk to ${end.building}`,
        location: end.building
      });
    }

    // Handle entry to end location
    if (!endIsSpecial) {
      // Entering a building - need to go inside
      steps.push({
        type: 'building',
        description: `Enter ${end.building}`,
        building: end.building
      });

      // Go to destination floor if not ground floor
      if (end.floor !== 0) {
        const floorDiff = end.floor;
        if (floorDiff > 2) {
          steps.push({
            type: 'elevator',
            description: `Take elevator to Floor ${end.floor}`,
            building: end.building
          });
        } else {
          steps.push({
            type: 'stairs',
            description: `Take stairs up to Floor ${end.floor}`,
            building: end.building
          });
        }
      }

      // Enter corridor on destination floor
      steps.push({
        type: 'corridor',
        description: `Enter corridor on ${end.floor === 0 ? 'Ground Floor' : `Floor ${end.floor}`}`,
        floor: end.floor,
        building: end.building
      });
    }
  }

  private estimateTime(start: RoomLocation, end: RoomLocation, stepCount: number): number {
    let minutes = 0;

    // Base time per step
    minutes += stepCount * 0.5;

    // Add time for floor changes
    const floorDiff = Math.abs(end.floor - start.floor);
    minutes += floorDiff * 1;

    // Add time for building changes
    if (start.building !== end.building) {
      const buildingRoute = this.routeCalculator.findRoute(start.building, end.building);
      if (buildingRoute && buildingRoute.success) {
        minutes += buildingRoute.distance * 2; // 2 minutes per building hop
      }
    }

    return Math.max(1, Math.ceil(minutes));
  }

  // Get all available rooms for dropdown
  getAllRoomNumbers(): string[] {
    return getAllRooms()
      .map(r => r.roomNumber)
      .sort((a, b) => {
        // Sort by block letter first, then by room number
        const [blockA, numA] = a.split('-');
        const [blockB, numB] = b.split('-');
        
        if (blockA !== blockB) {
          return blockA.localeCompare(blockB);
        }
        
        return parseInt(numA) - parseInt(numB);
      });
  }
}
