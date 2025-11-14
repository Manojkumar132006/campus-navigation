const fs = require('fs');
const path = require('path');

// Read the campus layout configuration
const configPath = path.join(__dirname, '../config/campus-layout.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Generate campusData.ts
const campusDataContent = `import { CampusGraphData } from '@/types/campus';

export const campusData: CampusGraphData = {
  nodes: {
${Object.entries(config.buildings).map(([name, building]) => `    "${name}": {
      name: "${name}",
      type: "${building.type}",
      emoji: "${building.emoji}",
      x: ${building.x},
      y: ${building.y},
      description: "${building.description}",
      floors: ${building.floors}
    }`).join(',\n')}
  },
  edges: [
${config.connections.map(([from, to]) => `    ["${from}", "${to}"]`).join(',\n')}
  ]
};

export const mapSettings = {
  viewBoxWidth: ${config.mapSettings.viewBoxWidth},
  viewBoxHeight: ${config.mapSettings.viewBoxHeight}
};
`;

// Generate roomData.ts
const roomDataContent = `import { Room } from '@/types/campus';

// Generate rooms for a block based on floor count (including ground floor)
function generateRooms(blockName: string, floors: number, roomsPerFloor: number = 10): Room[] {
  const rooms: Room[] = [];
  const blockLetter = blockName.split(' ')[1]; // Extract letter from "Block A"
  
  // Start from floor 0 (ground floor) and go up to the specified number of floors
  for (let floor = 0; floor <= floors; floor++) {
    for (let room = 1; room <= roomsPerFloor; room++) {
      const roomNumber = \`\${floor}\${room.toString().padStart(2, '0')}\`;
      const floorName = floor === 0 ? 'Ground Floor' : \`Floor \${floor}\`;
      rooms.push({
        roomNumber,
        floor,
        block: blockLetter,
        description: \`Room \${roomNumber} - \${blockName} \${floorName}\`
      });
    }
  }
  
  return rooms;
}

// Room data for each block (floors count excludes ground floor, so we add 1)
export const blockRooms: Record<string, Room[]> = {
${Object.entries(config.buildings)
  .filter(([_, building]) => building.roomsPerFloor > 0)
  .map(([name, building]) => `  "${name}": generateRooms("${name}", ${building.floors}, ${building.roomsPerFloor})`)
  .join(',\n')}
};

// Get all rooms across all blocks
export function getAllRooms(): Room[] {
  return Object.values(blockRooms).flat();
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
`;

// Write the generated files
const campusDataPath = path.join(__dirname, '../lib/campusData.ts');
const roomDataPath = path.join(__dirname, '../lib/roomData.ts');

fs.writeFileSync(campusDataPath, campusDataContent);
fs.writeFileSync(roomDataPath, roomDataContent);

console.log('✅ Campus data generated successfully!');
console.log('📝 Updated files:');
console.log('   - lib/campusData.ts');
console.log('   - lib/roomData.ts');
