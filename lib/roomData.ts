import { Room } from '@/types/campus';

// Generate rooms for a block based on floor count (including ground floor)
function generateRooms(blockName: string, floors: number, roomsPerFloor: number = 10): Room[] {
  const rooms: Room[] = [];
  const blockLetter = blockName.split(' ')[1]; // Extract letter from "Block A"
  
  // Start from floor 0 (ground floor) and go up to the specified number of floors
  for (let floor = 0; floor <= floors; floor++) {
    for (let room = 1; room <= roomsPerFloor; room++) {
      const roomNum = `${floor}${room.toString().padStart(2, '0')}`;
      const roomNumber = `${blockLetter}-${roomNum}`; // Format: E-203, A-008
      const floorName = floor === 0 ? 'Ground Floor' : `Floor ${floor}`;
      rooms.push({
        roomNumber,
        floor,
        block: blockLetter,
        description: `Room ${roomNumber} - ${blockName} ${floorName}`
      });
    }
  }
  
  return rooms;
}

// Special locations (canteens, grounds, etc.) treated as single "rooms"
const specialLocations: Room[] = [
  {
    roomNumber: "Annapurna Canteen",
    floor: 0,
    block: "Canteen",
    description: "Annapurna Canteen"
  },
  {
    roomNumber: "Coca-Cola Canteen",
    floor: 0,
    block: "Canteen",
    description: "Coca-Cola Canteen"
  },
  {
    roomNumber: "JSK Greens",
    floor: 0,
    block: "Recreational",
    description: "JSK Greens - Central green space"
  },
  {
    roomNumber: "Ground",
    floor: 0,
    block: "Recreational",
    description: "Ground"
  },
  {
    roomNumber: "SAC Stage",
    floor: 0,
    block: "Recreational",
    description: "SAC Stage"
  },
  {
    roomNumber: "Scinti Stage",
    floor: 0,
    block: "Recreational",
    description: "Scinti Stage"
  }
];

// Room data for each block (floors count excludes ground floor, so we add 1)
export const blockRooms: Record<string, Room[]> = {
  "Block P": generateRooms("Block P", 4, 10),
  "Block D": generateRooms("Block D", 5, 10),
  "Block E": generateRooms("Block E", 5, 40),
  "Block A": generateRooms("Block A", 4, 10),
  "Block B": generateRooms("Block B", 4, 10),
  "Block C": generateRooms("Block C", 3, 10),
  "PEB Block": generateRooms("PEB Block", 0, 10)
};

// Get all rooms across all blocks, including special locations
export function getAllRooms(): Room[] {
  return [...Object.values(blockRooms).flat(), ...specialLocations];
}

// Search rooms by room number
export function searchRooms(query: string): Room[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return getAllRooms().filter(room =>
    room.roomNumber.toLowerCase().includes(lowerQuery) ||
    room.description?.toLowerCase().includes(lowerQuery)
  );
}

// Get rooms for a specific block
export function getRoomsByBlock(blockName: string): Room[] {
  return blockRooms[blockName] || [];
}

// Get rooms for a specific floor in a block
export function getRoomsByFloor(blockName: string, floor: number): Room[] {
  const rooms = blockRooms[blockName] || [];
  return rooms.filter(room => room.floor === floor);
}
